import { NextRequest, NextResponse } from 'next/server';
import { googleClientConfigured, loadAuth } from '@/lib/operatorGoogle';

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
/** How far back to pull for the shift-vs-off comparison. */
const HISTORY_DAYS = 84;

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

    return (json.items ?? []).flatMap((e) => {
      // Cancelled events and ones marked "free" do not constrain the day.
      if (e.status === 'cancelled' || e.transparency === 'transparent') return [];
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
  } catch {
    return null;
  }
}

/**
 * Words that mark a day as clinical work rather than anything else in the
 * calendar. Matched case-insensitively against the event title.
 */
const SHIFT_WORDS = /\b(shift|placement|ward|clinical|nights?|long day|early|late|on call|oncall|hospital|practice|trust)\b/i;

/** A day counts as worked when it is named as one, or when it simply is one. */
function classifyDay(entries: Entry[]) {
  const named = entries.find((e) => SHIFT_WORDS.test(e.title));
  const hours = busyHours(entries);
  const shift = Boolean(named) || hours >= 6;
  const night = entries.some(
    (e) => /\bnights?\b/i.test(e.title) || (!e.allDay && (e.start.getHours() >= 19 || e.start.getHours() < 5)),
  );
  return { shift, night: shift && night, hours: Math.round(hours * 10) / 10, label: named?.title ?? null };
}

/** Hours committed on a day, all-day entries counting as a full working day. */
function busyHours(entries: Entry[]) {
  return entries.reduce((total, e) => {
    if (e.allDay) return total + 8;
    if (!e.end) return total + 1;
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

  if (!googleClientConfigured()) {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      detail: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set on this deployment.',
    });
  }

  const auth = await loadAuth();
  if (auth === 'setup_required') {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      canConnect: false,
      detail: 'The connection table is not set up yet — run supabase-operator-google.sql.',
    });
  }
  if (!auth) {
    return NextResponse.json({
      status: 'unconfigured' satisfies Status,
      days: [],
      canConnect: true,
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
      detail: token.detail,
    });
  }

  const from = weekStart();
  const to = new Date(from.getTime() + 7 * DAY_MS);

  // The card needs this week; the shift analysis needs a run of past weeks to
  // compare worked days against off days. One fetch covers both.
  const historyFrom = new Date(from.getTime() - HISTORY_DAYS * DAY_MS);
  const events = await fetchEvents(token.token, historyFrom, to);
  if (events === null) {
    return NextResponse.json({ status: 'fetch_failed' satisfies Status, days: [] });
  }

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

  // Past days, classified, for the shift-vs-off comparison. Today is excluded —
  // a day still in progress would drag every "on shift" average down.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const history = [];
  for (let t = historyFrom.getTime(); t < todayStart.getTime(); t += DAY_MS) {
    const dayStart = new Date(t);
    const dayEnd = new Date(t + DAY_MS);
    const entries = events.filter((e) => e.start >= dayStart && e.start < dayEnd);
    const c = classifyDay(entries);
    history.push({ date: dayStart.toISOString().slice(0, 10), ...c });
  }

  return NextResponse.json({ status: 'ok' satisfies Status, days, history });
}
