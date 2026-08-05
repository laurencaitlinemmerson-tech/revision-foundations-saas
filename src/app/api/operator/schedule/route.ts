import { NextRequest, NextResponse } from 'next/server';

/**
 * The operator's week from Google Calendar, folded into the seven rows the
 * dashboard's scheduling card shows.
 *
 * This is a single-operator surface, so it authenticates from environment
 * variables rather than an OAuth flow:
 *
 *   GOOGLE_CLIENT_ID       OAuth client
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN   obtained once with calendar.readonly, offline access
 *   GOOGLE_CALENDAR_ID     defaults to "primary"
 *
 * `status` distinguishes "nothing set up yet" from "credentials were rejected",
 * so a typo in the refresh token doesn't masquerade as an unconfigured card.
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

async function accessToken(): Promise<string | null> {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: 'refresh_token' }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

async function fetchWeek(token: string, from: Date, to: Date): Promise<Entry[] | null> {
  const calendar = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? 'primary');
  const params = new URLSearchParams({
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
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

  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN,
  );
  if (!configured) {
    return NextResponse.json({ status: 'unconfigured' satisfies Status, days: [] });
  }

  const token = await accessToken();
  if (!token) {
    return NextResponse.json({ status: 'auth_failed' satisfies Status, days: [] });
  }

  const from = weekStart();
  const to = new Date(from.getTime() + 7 * DAY_MS);
  const events = await fetchWeek(token, from, to);
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

  return NextResponse.json({ status: 'ok' satisfies Status, days });
}
