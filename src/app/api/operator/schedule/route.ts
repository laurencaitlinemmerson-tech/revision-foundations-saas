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
 *   GOOGLE_CALENDAR_ID     pins the rota to one calendar when set. Left unset
 *                          (the default), every calendar the account can see —
 *                          shift rota, lectures kept outside the ICS feed,
 *                          personal — is fetched and merged, minus whatever is
 *                          hidden in Google Calendar's own sidebar.
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

type Entry = { start: Date; end: Date | null; title: string; allDay: boolean; source: string };
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

/**
 * Local "H:MM" (Europe/London). Not `toLocaleTimeString` without a zone —
 * that reads the server's own clock, which is UTC on most hosts and quietly
 * puts every displayed time an hour out for half the year.
 */
function hhmm(d: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: false }).formatToParts(d);
  const h = parts.find((p) => p.type === 'hour')?.value ?? '0';
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return m === '00' ? h : `${h}:${m}`;
}

/** Hour-as-float back to "HH:MM", for text built from `localHour`/`lastFinishHour`. */
function hhmmOf(h: number | null) {
  return h == null ? null : `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
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

/** One entry per calendar the account can see, minus anything hidden in Google's own sidebar. */
async function fetchCalendarIds(token: string): Promise<Array<{ id: string; summary: string }> | null> {
  try {
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250',
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) return null;

    const json = (await res.json()) as {
      items?: Array<{ id?: string; summary?: string; hidden?: boolean; accessRole?: string }>;
    };

    return (json.items ?? [])
      // A freeBusyReader calendar (someone else's calendar shared as
      // free/busy only) returns blocks with no title, which would just
      // show up as an unexplained "Busy" — worse than leaving it out.
      .filter((c) => c.id && c.hidden !== true && c.accessRole !== 'freeBusyReader')
      .map((c) => ({ id: c.id!, summary: c.summary ?? c.id! }));
  } catch {
    return null;
  }
}

async function fetchEventsForCalendar(
  token: string,
  calendarId: string,
  calendarSummary: string,
  from: Date,
  to: Date,
): Promise<Entry[] | null> {
  const calendar = encodeURIComponent(calendarId);
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
        attendees?: Array<{ self?: boolean; responseStatus?: string }>;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }>;
    };

    return (json.items ?? []).flatMap((e) => {
      // Cancelled events, unconfirmed ones, declined invitations, and ones
      // marked "free" do not constrain the day. Tentative is Google's own
      // "not confirmed yet" state — precisely the shape of a stale
      // placeholder a re-synced or subscribed calendar leaves behind, which
      // is what shows up as a shift on a day that never had one.
      if (e.status === 'cancelled' || e.status === 'tentative' || e.transparency === 'transparent') return [];
      const selfAttendee = e.attendees?.find((a) => a.self);
      if (selfAttendee?.responseStatus === 'declined') return [];

      const startRaw = e.start?.dateTime ?? e.start?.date;
      if (!startRaw) return [];
      const endRaw = e.end?.dateTime ?? e.end?.date;
      return [{
        start: new Date(startRaw),
        end: endRaw ? new Date(endRaw) : null,
        title: (e.summary ?? 'Busy').trim(),
        allDay: !e.start?.dateTime,
        source: calendarSummary,
      }];
    });
  } catch {
    return null;
  }
}

type FetchResult = { entries: Entry[]; calendars: Array<{ id: string; summary: string }> };

/**
 * Every calendar the account can see, fetched in parallel and merged. A
 * deployment can pin GOOGLE_CALENDAR_ID to scope this to one calendar; left
 * unset, this is what makes "connect Google Calendar" mean the whole
 * account rather than whichever calendar happens to be primary.
 */
async function fetchEvents(token: string, from: Date, to: Date): Promise<FetchResult | null> {
  const pinned = process.env.GOOGLE_CALENDAR_ID;
  let calendars = pinned ? [{ id: pinned, summary: pinned }] : await fetchCalendarIds(token);
  if (!calendars || calendars.length === 0) calendars = [{ id: 'primary', summary: 'primary' }];

  const results = await Promise.all(
    calendars.map((c) => fetchEventsForCalendar(token, c.id, c.summary, from, to)),
  );
  // One calendar erroring out (revoked share, deleted subscription) should
  // not sink the rest of the account's calendars along with it.
  const successful = results.filter((r): r is Entry[] => r !== null);
  if (successful.length === 0) return null;

  const raw = successful.flat();

  // A calendar re-synced from an external source (or subscribed to twice
  // under different IDs) can hand back the same event more than once —
  // identical title and times, invisible to the API's own de-duplication
  // since that only catches a repeated ID within a single calendar.
  const seen = new Set<string>();
  const entries = raw.filter((e) => {
    const key = `${e.title}|${e.start.toISOString()}|${e.end?.toISOString() ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { entries, calendars };
}

/**
 * Words that explicitly mean the day is NOT a shift, even if other shift-like words
 * appear in the title (e.g., "Night off", "Shift cancelled", "No shift", "Off").
 */
const OFF_WORDS = /\b(off|day off|no shift|cancelled|canceled|not working|rest day|annual leave|holiday|leave|zero|swapped out|vacation|free day|day-off|night-off|night off)\b/i;

/**
 * Words that mark a day as clinical work.
 */
const SHIFT_WORDS = /\b(shifts?|placement|ward|clinical|on[- ]?call|night shift|long day|early shift|late shift|day shift|hospital|nhs|kch|gosh|gstt|st thomas|guy'?s)\b/i;

/** Titles that look like a shift but are not — the rota's false friends. */
const NOT_SHIFT = /\b(lecture|seminar|tutorial|revision|exam|assignment|essay|deadline|birthday|holiday|leave|annual leave|dentist|doctor|gp|appointment|meeting|study|library|zoom|teams|travel|flight|drive|personal|wfh|work from home|conference|workshop|ceremony|dinner|party|lunch)\b/i;

export type ShiftKind = 'night' | 'long' | 'early' | 'late' | 'day' | 'off';

/**
 * Parses explicit NHS / rota shift codes from an event title.
 */
function getShiftCode(title: string): ShiftKind | null {
  const t = title.trim();
  if (OFF_WORDS.test(t)) return null;

  // Exact codes or standalone shift types
  if (/^(n|nights?|night shift)$/i.test(t)) return 'night';
  if (/^(ld|long day)$/i.test(t)) return 'long';
  if (/^(e|early|early shift)$/i.test(t)) return 'early';
  if (/^(l|late|late shift)$/i.test(t)) return 'late';
  if (/^(d|day shift)$/i.test(t)) return 'day';

  // Words with explicit shift context: "Placement N", "Shift LD", "Ward E", etc.
  if (/\b(placement|shift|ward|clinical)\s+n\b/i.test(t) || /\bnight\s+shift\b/i.test(t) || /\bnights?\b/i.test(t)) return 'night';
  if (/\b(placement|shift|ward|clinical)\s+ld\b/i.test(t) || /\blong\s+day\b/i.test(t)) return 'long';
  if (/\b(placement|shift|ward|clinical)\s+e\b/i.test(t) || /\bearly\s+shift\b/i.test(t)) return 'early';
  if (/\b(placement|shift|ward|clinical)\s+l\b/i.test(t) || /\blate\s+shift\b/i.test(t)) return 'late';

  return null;
}

/**
 * Checks if an event is a multi-day placement block banner (e.g. July 13 - Aug 15)
 * rather than an individual daily shift.
 */
function isMultiDayBlock(e: Entry): boolean {
  if (!e.end) return false;
  return (e.end.getTime() - e.start.getTime()) > 24 * 3600000;
}

/**
 * A day counts as worked when the calendar names a single-day shift entry,
 * or when it holds a single long block of time that looks like nothing else.
 */
function classifyDay(entries: Entry[]) {
  // Ignore multi-day placement block banners (which cover weeks at a time)
  // so days off within a placement block are correctly identified as off days.
  const singleDayEntries = entries.filter((e) => !isMultiDayBlock(e));
  const real = singleDayEntries.filter((e) => !OFF_WORDS.test(e.title) && !NOT_SHIFT.test(e.title));
  const named = real.find((e) => SHIFT_WORDS.test(e.title) || getShiftCode(e.title) !== null);

  // All-day entries are markers, not commitments, so they never imply a shift unless named
  const timed = real.filter((e) => !e.allDay && e.end);
  const longest = timed.reduce(
    (best, e) => Math.max(best, (e.end!.getTime() - e.start.getTime()) / 3600000),
    0,
  );

  const shift = Boolean(named) || (longest >= 7 && real.some((e) => !e.allDay && (e.end!.getTime() - e.start.getTime()) / 3600000 >= 7));
  if (!shift) return { shift: false, night: false, kind: 'off' as ShiftKind, hours: null, start: null, end: null, label: null };

  // Measured length
  const timedHours = named ? busyHours(real.filter((e) => !e.allDay)) : longest;

  const startHour = timed.length ? Math.min(...timed.map((e) => localHour(e.start))) : null;
  const endHour = timed.reduce<number | null>((latest, e) => {
    if (!e.end) return latest;
    const h = localHour(e.end);
    return latest == null || h > latest ? h : latest;
  }, null);

  const source = named ?? timed.reduce<Entry | null>(
    (best, e) => (!best || e.end!.getTime() - e.start.getTime() > best.end!.getTime() - best.start.getTime() ? e : best),
    null,
  );
  const titles = source?.title ?? '';

  const coded = getShiftCode(titles);

  const night =
    coded === 'night' ||
    (coded == null &&
      ((startHour != null && (startHour >= 18 || startHour < 5)) ||
        (endHour != null && startHour != null && endHour < startHour)));

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

  const hours = timedHours > 0 ? Math.round(timedHours * 10) / 10 : null;

  return {
    shift: true,
    night,
    kind,
    hours,
    start: hhmmOf(startHour),
    end: hhmmOf(endHour),
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
    return Math.max(latest, localHour(e.end));
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

/**
 * A single day's training read, for the rota's day panel — any day, not just
 * this week's seven. Unlike `suggest()` it carries no weekly state (lift cap,
 * "day 6 is the reset day"), because a day panel shows one day at a time and
 * has nothing to reset against; it reads purely from what is actually on the
 * calendar that day.
 */
function suggestForDay(entries: Entry[]): { text: string; tag: 'Lift' | 'Move' | 'Easy' | 'Rest' } {
  const hours = busyHours(entries);
  const finish = lastFinishHour(entries);

  if (hours >= 8) return { text: 'A day this long already covers the deficit — steps only.', tag: 'Move' };
  if (hours >= 5 && finish >= 19) return { text: 'Long day finishing late — rest and eat at maintenance.', tag: 'Rest' };
  if (hours === 0) return { text: 'Nothing on the calendar — a clean day for a full session.', tag: 'Lift' };
  if (finish > 0) {
    const free = hhmmOf(finish);
    return finish < 17
      ? { text: `Free from ${free} — a lift fits before the evening.`, tag: 'Lift' }
      : { text: `Free from ${free}, but late — keep it light.`, tag: 'Easy' };
  }
  return { text: 'Open day — good for a full session or a long walk.', tag: 'Lift' };
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
  const [fetched, timetableAll] = await Promise.all([
    fetchEvents(token.token, historyFrom, futureTo),
    fetchTimetable(),
  ]);
  if (fetched === null) {
    return NextResponse.json({ status: 'fetch_failed' satisfies Status, days: [] });
  }
  const events = fetched.entries;

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

  // Bucket every event by its local calendar date once, expanding multi-day events across all dates
  const byDay = new Map<string, Entry[]>();
  for (const e of events) {
    if (e.allDay && e.end && e.end.getTime() > e.start.getTime() + DAY_MS) {
      for (let t = e.start.getTime(); t < e.end.getTime(); t += DAY_MS / 2) {
        const k = dayKey(new Date(t));
        if (!byDay.has(k)) byDay.set(k, []);
        const list = byDay.get(k)!;
        if (!list.includes(e)) list.push(e);
      }
    } else {
      const k = dayKey(e.start);
      byDay.set(k, [...(byDay.get(k) ?? []), e]);
    }
  }

  /** Every event on a day, as text — the actual agenda, not just the shift read. */
  const eventBrief = (e: Entry) => ({
    title: e.title,
    start: e.allDay ? null : hhmm(e.start),
    end: e.allDay || !e.end ? null : hhmm(e.end),
    allDay: e.allDay,
    source: e.source,
  });

  const today = dayKey(new Date());
  const classified = eachDayKey(historyFrom, futureTo).map((date) => {
    const dayEntries = (byDay.get(date) ?? []).slice().sort((a, b) => a.start.getTime() - b.start.getTime());
    return {
      date,
      ...classifyDay(dayEntries),
      events: dayEntries.map(eventBrief),
      // Only forward-looking — there is nothing to suggest for a day that has
      // already happened.
      suggestion: date >= today ? suggestForDay(dayEntries) : null,
    };
  });

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
        calendars: fetched.calendars.map((c) => c.summary),
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
                source: e.source,
              })),
              classifiedAs: classifyDay(byDay.get(debugDate) ?? []),
            }
          : {
              sample: events.slice(-40).map((e) => ({
                title: e.title,
                allDay: e.allDay,
                start: e.start.toISOString(),
                end: e.end?.toISOString() ?? null,
                source: e.source,
                readAs: classifyDay([e]),
              })),
            }),
      }
    : undefined;

  return NextResponse.json({ status: 'ok' satisfies Status, days, history, upcoming, lectures, debug });
}
