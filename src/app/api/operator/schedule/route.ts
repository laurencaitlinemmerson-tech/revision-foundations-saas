import { NextRequest, NextResponse } from 'next/server';
import { googleClientConfigured, loadAuth, redirectUri } from '@/lib/operatorGoogle';
import { fetchTimetable } from '@/lib/operatorTimetable';

/**
 * The operator's week from Google Calendar, folded into the seven rows the
 * dashboard's scheduling card shows.
 *
 * The OAuth client comes from the environment:
 *
 *   GOOGLE_CLIENT_ID       OAuth client
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_CALENDAR_ID     defaults to "primary"
 *
 * The refresh token does not. It is written by the connect flow in
 * /api/operator/google, so an expired token is a button on the dashboard rather
 * than an environment edit and a redeploy. GOOGLE_REFRESH_TOKEN still overrides
 * it when set, so an existing deployment keeps working unchanged.
 *
 * `status` distinguishes "nothing connected yet" from "credentials were
 * rejected", so an expired token doesn't masquerade as an unconfigured card.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

type Entry = { start: Date; end: Date | null; title: string; allDay: boolean };
type Status = 'ok' | 'unconfigured' | 'auth_failed' | 'fetch_failed';

const DAY_MS = 86400000;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
/**
 * How far back to pull. The shift comparison only needs a few weeks, but the
 * placement-hours total wants everything the calendar has, and it is the same
 * single request either way.
 */
const HISTORY_DAYS = 550;
/** How far forward, for the rota and the night-before prompt. */
const FUTURE_DAYS = 35;

/**
 * The rota is written in UK local time and this runs on a UTC server, so day
 * boundaries and clock hours are both resolved in Europe/London. Without it a
 * night shift starting 00:30 BST files under the previous day, and every
 * "starts before 9am" test is an hour out for half the year.
 */
const TZ = 'Europe/London';

/** Local calendar date of an instant, as YYYY-MM-DD. */
function dayKey(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** Local clock time of an instant, in hours past midnight. */
function localHour(d: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return h + m / 60;
}

/** Every local calendar date from `from` up to but excluding `to`. */
function eachDayKey(from: Date, to: Date) {
  const keys: string[] = [];
  // Step by 24h and de-duplicate rather than doing calendar arithmetic: a DST
  // change makes one day 23 or 25 hours long, and stepping would either skip or
  // repeat it. The Set absorbs both.
  const seen = new Set<string>();
  for (let t = from.getTime(); t < to.getTime(); t += DAY_MS / 2) {
    const k = dayKey(new Date(t));
    if (!seen.has(k)) { seen.add(k); keys.push(k); }
  }
  return keys;
}

/** Monday 00:00 of the week containing `now`. */
function weekStart(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function hhmm(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }).replace(':00', '');
}

/**
 * Google's own words for why a refresh failed, mapped to something actionable.
 * Guessing at the cause wastes far more time than passing the reason through.
 */
function explainTokenError(error: string, description: string): string {
  switch (error) {
    case 'invalid_grant':
      return 'Google rejected the refresh token itself (invalid_grant) — it was revoked, or the OAuth consent screen is still in Testing mode, where every token dies after seven days. Publishing the app at console.cloud.google.com/auth/audience is what stops that recurring.';
    case 'invalid_client':
      return 'Google rejected the client credentials (invalid_client). GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET does not match the client the refresh token was minted with — check for a truncated paste.';
    case 'unauthorized_client':
      return 'This client is not authorised for the refresh grant (unauthorized_client). The token was most likely minted against a different OAuth client than the one configured here.';
    default:
      return `Google returned "${error}"${description ? ': ' + description : ''}.`;
  }
}

type TokenResult =
  | { ok: true; token: string }
  | { ok: false; detail: string };

async function accessToken(refresh_token: string): Promise<TokenResult> {
  const client_id = process.env.GOOGLE_CLIENT_ID!;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET!;

  // A stray newline or space survives copy-paste far more often than you would
  // think, and Google rejects it with an unhelpful invalid_grant.
  const trimmed = refresh_token.trim();

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: client_id.trim(),
        client_secret: client_secret.trim(),
        refresh_token: trimmed,
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    });

    const json = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!res.ok || !json.access_token) {
      return {
        ok: false,
        detail: explainTokenError(json.error ?? `http_${res.status}`, json.error_description ?? ''),
      };
    }
    return { ok: true, token: json.access_token };
  } catch (e) {
    return { ok: false, detail: `Could not reach Google to refresh the token (${String(e).slice(0, 80)}).` };
  }
}

async function fetchEvents(token: string, from: Date, to: Date): Promise<Entry[] | null> {
  const calendar = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? 'primary');
  const params = new URLSearchParams({
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '2500',
  });

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?${params}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) return null;

    const json = (await res.json()) as {
      items?: Array<{
        summary?: string;
        status?: string;
        transparency?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }>;
    };

    const raw = (json.items ?? []).flatMap((e) => {
      // Cancelled events, unconfirmed ones, and ones marked "free" do not
      // constrain the day. Tentative is Google's own "not confirmed yet"
      // state — precisely the shape of a stale placeholder a re-synced or
      // subscribed calendar leaves behind, which is what shows up as a shift
      // on a day that never had one.
      if (e.status === 'cancelled' || e.status === 'tentative' || e.transparency === 'transparent') return [];
      const startRaw = e.start?.dateTime ?? e.start?.date;
      if (!startRaw) return [];
      const endRaw = e.end?.dateTime ?? e.end?.date;
      return [{
        start: new Date(startRaw),
        end: endRaw ? new Date(endRaw) : null,
        title: (e.summary ?? 'Busy').trim(),
        allDay: !e.start?.dateTime,
      }];
    });

    // A calendar re-synced from an external source (or resubscribed to one)
    // can hand back the same event twice under different IDs — identical
    // title and times, which is invisible to the API's own de-duplication
    // since that only catches a repeated ID.
    const seen = new Set<string>();
    return raw.filter((e) => {
      const key = `${e.title}|${e.start.toISOString()}|${e.end?.toISOString() ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return null;
  }
}

/**
 * Words that mark a day as clinical work.
 *
 * Deliberately narrow. An earlier version also matched "early", "late",
 * "practice" and "trust", which turned "early lecture", "running late" and
 * "practice questions" into ward shifts. Those words only mean a shift next to
 * one of these, so they are read as a kind below rather than as evidence here.
 */
const SHIFT_WORDS = /\b(shifts?|placement|ward|clinical|on[- ]?call|night shift|long day)\b/i;

/** Titles that look like a shift but are not — the rota's false friends. */
const NOT_SHIFT = /\b(lecture|seminar|tutorial|revision|exam|assignment|essay|deadline|birthday|holiday|leave|annual leave|dentist|doctor|gp|appointment|meeting|study|library|zoom|teams)\b/i;

export type ShiftKind = 'night' | 'long' | 'early' | 'late' | 'day' | 'off';

/**
 * A day counts as worked when the calendar names it as one, or when it holds a
 * single long block of time that looks like nothing else.
 *
 * The unnamed fallback used to be "six or more busy hours in the day", summed
 * across every entry and counting all-day events as eight. A birthday reminder
 * was therefore a shift, and so was any day with three lectures. It now needs
 * one continuous timed block, which is what a real shift is.
 */
function classifyDay(entries: Entry[]) {
  const real = entries.filter((e) => !NOT_SHIFT.test(e.title));
  const named = real.find((e) => SHIFT_WORDS.test(e.title));

  // All-day entries are markers, not commitments, so they never imply a shift.
  const timed = real.filter((e) => !e.allDay && e.end);
  const longest = timed.reduce(
    (best, e) => Math.max(best, (e.end!.getTime() - e.start.getTime()) / 3600000),
    0,
  );

  const shift = Boolean(named) || longest >= 6;
  if (!shift) return { shift: false, night: false, kind: 'off' as ShiftKind, hours: null, start: null, end: null, label: null };

  // Measured length, where the rota gives times to measure. Needed before the
  // kind, because an unlabelled shift is classified by how long it ran.
  const timedHours = named ? busyHours(real.filter((e) => !e.allDay)) : longest;

  const startHour = timed.length ? Math.min(...timed.map((e) => localHour(e.start))) : null;
  const endHour = timed.reduce<number | null>((latest, e) => {
    if (!e.end) return latest;
    const h = localHour(e.end);
    return latest == null || h > latest ? h : latest;
  }, null);

  // Kind words are read only off the entry that made this a shift. Taking them
  // from the whole day is how "late lunch" turned an early into a late.
  const source = named ?? timed.reduce<Entry | null>(
    (best, e) => (!best || e.end!.getTime() - e.start.getTime() > best.end!.getTime() - best.start.getTime() ? e : best),
    null,
  );
  const titles = source?.title ?? '';

  // NHS rotas are written in codes — "PLACEMENT LD", "PLACEMENT N" — and a rota
  // kept as all-day entries has no clock to infer anything from. The code is an
  // explicit statement of which shift it is, so it outranks the times.
  const coded: ShiftKind | null =
    /\b(n|night|nights)\b/i.test(titles) ? 'night'
    : /\b(ld|long day)\b/i.test(titles) ? 'long'
    : /\b(e|early)\b/i.test(titles) ? 'early'
    : /\b(l|late)\b/i.test(titles) ? 'late'
    : null;

  const night =
    coded === 'night' ||
    (coded == null &&
      ((startHour != null && (startHour >= 18 || startHour < 5)) ||
        (endHour != null && startHour != null && endHour < startHour))); // crosses midnight

  const kind: ShiftKind =
    coded ??
    (night
      ? 'night'
      : timedHours >= 11
      ? 'long'
      : startHour != null && startHour < 9
      ? 'early'
      : startHour != null && startHour >= 12
      ? 'late'
      : 'day');

  // Hours are whatever the calendar says and nothing else. An all-day entry
  // carries no times, so the answer is that there are none — not a plausible
  // number standing in for one.
  const hours = timedHours > 0 ? Math.round(timedHours * 10) / 10 : null;

  const hhmmOf = (h: number | null) =>
    h == null ? null : `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

  return {
    shift: true,
    night,
    kind,
    hours,
    start: hhmmOf(startHour),
    end: hhmmOf(endHour),
    // The event this was read from. Surfaced so a wrong call is visible as a
    // wrong call rather than as the dashboard inventing a shift.
    label: source?.title ?? null,
  };
}

/** Hours the calendar actually accounts for. Untimed entries contribute none. */
function busyHours(entries: Entry[]) {
  return entries.reduce((total, e) => {
    if (e.allDay || !e.end) return total;
    return total + Math.max(0, (e.end.getTime() - e.start.getTime()) / 3600000);
  }, 0);
}

/** Latest finish time, used to tell a free evening from a late one. */
function lastFinishHour(entries: Entry[]) {
  return entries.reduce((latest, e) => {
    if (e.allDay || !e.end) return latest;
    return Math.max(latest, e.end.getHours() + e.end.getMinutes() / 60);
  }, 0);
}

/**
 * Place the week's training around what the calendar already contains: steps on
 * days that are already long, rest on long days that finish late, lifts on the
 * lightest days up to three a week, and a reset on Sunday.
 */
function suggest(entries: Entry[], index: number, liftsPlaced: number) {
  const hours = busyHours(entries);
  const finish = lastFinishHour(entries);

  if (hours >= 8) return { text: 'Steps only — a day this long already covers the deficit', tag: 'Move' };
  if (hours >= 5 && finish >= 19) return { text: 'Rest and eat at maintenance', tag: 'Easy' };
  if (index === 6) return { text: 'Weigh-in, meal prep, rest', tag: 'Reset' };
  if (liftsPlaced < 3) {
    return {
      text: finish > 0 ? 'Strength once you finish · 45 min' : 'Strength · 45 min',
      tag: 'Lift',
    };
  }
  if (hours === 0) return { text: 'Long walk, conversational pace', tag: 'Move' };
  return { text: 'Mobility or an easy walk', tag: 'Easy' };
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);

  if (!googleClientConfigured()) {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      redirectUri: redirectUri(req),
      detail: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set on this deployment.',
    });
  }

  const auth = await loadAuth();
  if (auth === 'setup_required') {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      canConnect: false,
      redirectUri: redirectUri(req),
      detail: 'The connection table is not set up yet — run supabase-operator-google.sql.',
    });
  }
  if (!auth) {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      canConnect: true,
      redirectUri: redirectUri(req),
      detail: 'No Google account is connected yet.',
    });
  }

  const token = await accessToken(auth.refreshToken);
  if (!token.ok) {
    return NextResponse.json({
      status: 'auth_failed' satisfies Status,
      days: [],
      canConnect: true,
      // An env-var token cannot be replaced by reconnecting — it wins over the
      // stored one, so saying "connect" without saying that would loop forever.
      envPinned: auth.source === 'env',
      redirectUri: redirectUri(req),
      detail: token.detail,
    });
  }

  const from = weekStart();

  // One fetch serves all of it: this week's card, the weeks behind for the shift
  // comparison and practice hours, and the weeks ahead for the rota.
  const historyFrom = new Date(from.getTime() - HISTORY_DAYS * DAY_MS);
  const futureTo = new Date(from.getTime() + FUTURE_DAYS * DAY_MS);
  const [events, timetableAll] = await Promise.all([
    fetchEvents(token.token, historyFrom, futureTo),
    fetchTimetable(),
  ]);
  if (events === null) {
    return NextResponse.json({ status: 'fetch_failed' satisfies Status, days: [] });
  }

  // Informational only — never read by shift detection, so a bad or absent
  // feed here cannot affect the rota's actual data.
  const lectures = (timetableAll ?? []).filter(
    (l) => l.date >= dayKey(historyFrom) && l.date <= dayKey(futureTo),
  );

  let liftsPlaced = 0;
  const days = DAY_LABELS.map((label, i) => {
    const dayStart = new Date(from.getTime() + i * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);
    const entries = events.filter((e) => e.start >= dayStart && e.start < dayEnd);

    const calendar = entries.length
      ? entries
          .slice(0, 2)
          .map((e) => (e.allDay ? e.title : `${e.title} · ${hhmm(e.start)}${e.end ? '–' + hhmm(e.end) : ''}`))
          .join(' · ') + (entries.length > 2 ? ` +${entries.length - 2}` : '')
      : 'Free';

    const s = suggest(entries, i, liftsPlaced);
    if (s.tag === 'Lift') liftsPlaced += 1;

    return {
      day: label,
      date: dayStart.toISOString().slice(0, 10),
      calendar,
      suggestion: s.text,
      tag: s.tag,
      busyHours: Math.round(busyHours(entries) * 10) / 10,
    };
  });

  // Bucket every event by its local calendar date once, rather than re-scanning
  // the whole list for each of ~600 days.
  const byDay = new Map<string, Entry[]>();
  for (const e of events) {
    const k = dayKey(e.start);
    byDay.set(k, [...(byDay.get(k) ?? []), e]);
  }

  const today = dayKey(new Date());
  const classified = eachDayKey(historyFrom, futureTo).map((date) => ({
    date,
    ...classifyDay(byDay.get(date) ?? []),
  }));

  // Today is excluded from history: a day still in progress would drag every
  // "on shift" average down. It belongs to the forward-looking half instead.
  const history = classified.filter((d) => d.date < today);
  const upcoming = classified.filter((d) => d.date >= today);

  // What Google actually returned, so a rota that reads wrong can be
  // diagnosed from the response instead of by guessing at the calendar.
  // ?debug=1 only — it is noise the dashboard never needs. Add &date=YYYY-MM-DD
  // to see exactly what was found for one day, rather than the general tail
  // sample, which a busy calendar can easily push a specific day out of.
  const debugDate = url.searchParams.get('date');
  const debug = url.searchParams.get('debug')
    ? {
        eventCount: events.length,
        calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
        window: { from: dayKey(historyFrom), to: dayKey(futureTo) },
        timetable: {
          configured: Boolean(process.env.UNIVERSITY_ICS_URL),
          totalEntries: timetableAll?.length ?? null,
          windowEntries: lectures.length,
        },
        ...(debugDate
          ? {
              date: debugDate,
              rawEntries: (byDay.get(debugDate) ?? []).map((e) => ({
                title: e.title,
                allDay: e.allDay,
                start: e.start.toISOString(),
                end: e.end?.toISOString() ?? null,
              })),
              classifiedAs: classifyDay(byDay.get(debugDate) ?? []),
            }
          : {
              sample: events.slice(-40).map((e) => ({
                title: e.title,
                allDay: e.allDay,
                start: e.start.toISOString(),
                end: e.end?.toISOString() ?? null,
                readAs: classifyDay([e]),
              })),
            }),
      }
    : undefined;

  return NextResponse.json({ status: 'ok' satisfies Status, days, history, upcoming, lectures, debug });
}
