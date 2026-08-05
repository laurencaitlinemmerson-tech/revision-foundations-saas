import { NextRequest, NextResponse } from 'next/server';

/**
 * The operator's week — shifts and lectures from Notion, events from Google
 * Calendar — folded into the seven rows the dashboard's scheduling card shows.
 *
 * This is a single-operator surface, so both integrations authenticate from
 * environment variables rather than an OAuth flow:
 *
 *   NOTION_TOKEN                 internal integration secret (secret_…)
 *   NOTION_SCHEDULE_DATABASE_ID  database of shifts / lectures
 *   NOTION_SCHEDULE_DATE_PROP    date property name        (default "Date")
 *   NOTION_SCHEDULE_TITLE_PROP   title property name       (default "Name")
 *
 *   GOOGLE_CLIENT_ID             OAuth client
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN         obtained once, offline access
 *   GOOGLE_CALENDAR_ID           defaults to "primary"
 *
 * Either side can be configured alone; whatever is present is merged, and the
 * card reports which sources answered.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

type Entry = { start: Date; end: Date | null; title: string; allDay: boolean };

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

/* ── Notion ──────────────────────────────────────────────────────────────── */

async function fromNotion(from: Date, to: Date): Promise<Entry[] | null> {
  const token = process.env.NOTION_TOKEN;
  const db = process.env.NOTION_SCHEDULE_DATABASE_ID;
  if (!token || !db) return null;

  const dateProp = process.env.NOTION_SCHEDULE_DATE_PROP ?? 'Date';
  const titleProp = process.env.NOTION_SCHEDULE_TITLE_PROP ?? 'Name';

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
        filter: {
          and: [
            { property: dateProp, date: { on_or_after: from.toISOString().slice(0, 10) } },
            { property: dateProp, date: { before: to.toISOString().slice(0, 10) } },
          ],
        },
      }),
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { results?: Array<Record<string, unknown>> };
    const out: Entry[] = [];

    for (const page of json.results ?? []) {
      const props = (page.properties ?? {}) as Record<string, Record<string, unknown>>;
      const date = props[dateProp]?.date as { start?: string; end?: string } | undefined;
      if (!date?.start) continue;

      const titleRuns = (props[titleProp]?.title ?? []) as Array<{ plain_text?: string }>;
      const title = titleRuns.map((r) => r.plain_text ?? '').join('').trim() || 'Untitled';

      out.push({
        start: new Date(date.start),
        end: date.end ? new Date(date.end) : null,
        title,
        allDay: date.start.length === 10,
      });
    }
    return out;
  } catch {
    return null;
  }
}

/* ── Google Calendar ─────────────────────────────────────────────────────── */

async function googleAccessToken(): Promise<string | null> {
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

async function fromGoogle(from: Date, to: Date): Promise<Entry[] | null> {
  const token = await googleAccessToken();
  if (!token) return null;

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
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }>;
    };

    return (json.items ?? []).flatMap((e) => {
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

/* ── shaping ─────────────────────────────────────────────────────────────── */

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
 * Place the week's training around what the calendar already contains: lifts on
 * the lightest days, movement on the heaviest, and a reset on the quietest.
 */
function suggest(entries: Entry[], index: number, liftsPlaced: number) {
  const hours = busyHours(entries);
  const finish = lastFinishHour(entries);

  if (hours >= 8) return { text: 'Steps only — a day this long already covers the deficit', tag: 'Move' };
  if (hours >= 5 && finish >= 19) return { text: 'Rest and eat at maintenance', tag: 'Easy' };
  if (index === 6) return { text: 'Weigh-in, meal prep, rest', tag: 'Reset' };
  if (liftsPlaced < 3) {
    return {
      text: finish > 0 ? `Strength after you finish — 45 min` : 'Strength — 45 min',
      tag: 'Lift',
    };
  }
  if (hours === 0) return { text: 'Long walk, conversational pace', tag: 'Move' };
  return { text: 'Mobility or an easy walk', tag: 'Easy' };
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const from = weekStart();
  const to = new Date(from.getTime() + 7 * DAY_MS);

  const [notion, google] = await Promise.all([fromNotion(from, to), fromGoogle(from, to)]);

  const connected = { notion: notion !== null, google: google !== null };
  if (!connected.notion && !connected.google) {
    return NextResponse.json({ connected, days: [], configured: false });
  }

  const all = [...(notion ?? []), ...(google ?? [])].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  let liftsPlaced = 0;
  const days = DAY_LABELS.map((label, i) => {
    const dayStart = new Date(from.getTime() + i * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);
    const entries = all.filter((e) => e.start >= dayStart && e.start < dayEnd);

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

  return NextResponse.json({ connected, days, configured: true });
}
