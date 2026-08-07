/**
 * The university's own timetable, read directly from its ICS feed.
 *
 * A deliberately separate source from Google Calendar: subscribed ICS
 * calendars inside Google refresh unreliably — sometimes a day late,
 * sometimes not at all — and leave stale copies behind when the feed
 * changes, which is what a "ghost" lecture on the calendar usually is.
 * Reading the feed itself is always the current one.
 *
 * This never touches shift detection, on purpose. It exists to show lectures
 * and exams on the rota alongside placement shifts, nothing more — placement
 * shifts stay exactly what Google Calendar says they are.
 */

export type TimetableEntry = {
  date: string;
  title: string;
  /** HH:MM local, or null for an all-day entry. */
  start: string | null;
  end: string | null;
  allDay: boolean;
};

const TZ = 'Europe/London';

function dayKey(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function hhmm(d: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${h}:${m}`;
}

/** Unfold ICS continuation lines: a line starting with a space or tab is the
 * previous line's overflow, per RFC 5545. */
function unfold(text: string): string[] {
  const raw = text.split(/\r\n|\n|\r/);
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

type Prop = { name: string; params: Record<string, string>; value: string };

function parseLine(line: string): Prop | null {
  const colon = line.indexOf(':');
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(';');
  const params: Record<string, string> = {};
  for (const p of paramParts) {
    const eq = p.indexOf('=');
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
  }
  return { name: name.toUpperCase(), params, value };
}

/**
 * A DTSTART/DTEND/EXDATE value: either a bare date (all-day) or a date-time —
 * a true UTC instant, or a TZID-qualified local wall clock.
 *
 * A TZID value is trusted as already being the stated wall clock rather than
 * converted through a timezone database: a UK university states its times in
 * Europe/London, and the digits it wrote are exactly what belongs on the
 * rota, with no DST arithmetic needed to get there.
 */
function parseDateValue(prop: Prop): { date: string; hhmm: string | null; allDay: boolean } | null {
  const v = prop.value.trim();
  if (prop.params.VALUE === 'DATE' || /^\d{8}$/.test(v)) {
    const m = v.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!m) return null;
    return { date: `${m[1]}-${m[2]}-${m[3]}`, hhmm: null, allDay: true };
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (z === 'Z') {
    const instant = new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`);
    if (Number.isNaN(instant.getTime())) return null;
    return { date: dayKey(instant), hhmm: hhmm(instant), allDay: false };
  }
  return { date: `${y}-${mo}-${d}`, hhmm: `${h}:${mi}`, allDay: false };
}

const MAX_OCCURRENCES = 200;

/**
 * Best-effort weekly RRULE expansion. Anything more elaborate than
 * FREQ=WEEKLY with an UNTIL or COUNT falls back to the single DTSTART
 * occurrence — better to show one date than to expand a rule wrong and show
 * a dozen invented ones.
 */
function expandWeekly(startDate: string, rrule: string, exdates: Set<string>): string[] {
  const parts = Object.fromEntries(
    rrule.split(';').map((p) => p.split('=') as [string, string]),
  );
  if (parts.FREQ !== 'WEEKLY') return [startDate];

  const interval = Math.max(1, parseInt(parts.INTERVAL ?? '1', 10) || 1);
  const untilDate = parts.UNTIL
    ? `${parts.UNTIL.slice(0, 4)}-${parts.UNTIL.slice(4, 6)}-${parts.UNTIL.slice(6, 8)}`
    : null;
  const count = parts.COUNT ? parseInt(parts.COUNT, 10) : null;

  const dates: string[] = [];
  let d = new Date(startDate + 'T00:00:00Z');
  for (let n = 0; n < MAX_OCCURRENCES; n++) {
    const key = d.toISOString().slice(0, 10);
    if (untilDate && key > untilDate) break;
    if (count != null && dates.length >= count) break;
    if (!exdates.has(key)) dates.push(key);
    d = new Date(d.getTime() + interval * 7 * 86400000);
  }
  return dates.length ? dates : [startDate];
}

function parseIcs(text: string): TimetableEntry[] {
  const lines = unfold(text);
  const entries: TimetableEntry[] = [];

  let inEvent = false;
  let summary = '';
  let dtstart: Prop | null = null;
  let dtend: Prop | null = null;
  let rrule: string | null = null;
  let exdates = new Set<string>();

  for (const raw of lines) {
    const line = raw.trim();
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      summary = '';
      dtstart = null;
      dtend = null;
      rrule = null;
      exdates = new Set();
      continue;
    }
    if (line === 'END:VEVENT') {
      inEvent = false;
      if (!dtstart) continue;
      const start = parseDateValue(dtstart);
      if (!start) continue;
      const end = dtend ? parseDateValue(dtend) : null;
      const title = summary || 'Timetable entry';

      try {
        let dates: string[];
        if (rrule) {
          dates = expandWeekly(start.date, rrule, exdates);
        } else if (start.allDay && end?.allDay && end.date > start.date) {
          // An all-day DTEND is exclusive per RFC 5545 — the day after the
          // last day the event actually covers — so a reading week or a
          // multi-day induction has to be walked out day by day rather than
          // shown only on the day it starts.
          dates = [];
          let d = new Date(start.date + 'T00:00:00Z');
          const endD = new Date(end.date + 'T00:00:00Z');
          for (let n = 0; d.getTime() < endD.getTime() && n < MAX_OCCURRENCES; n++) {
            dates.push(d.toISOString().slice(0, 10));
            d = new Date(d.getTime() + 86400000);
          }
          if (!dates.length) dates = [start.date];
        } else {
          dates = [start.date];
        }
        for (const date of dates) {
          entries.push({ date, title, start: start.hhmm, end: end?.hhmm ?? null, allDay: start.allDay });
        }
      } catch {
        // A rule this parser cannot follow should not drop the one date it
        // does know about.
        entries.push({ date: start.date, title, start: start.hhmm, end: end?.hhmm ?? null, allDay: start.allDay });
      }
      continue;
    }
    if (!inEvent) continue;

    const prop = parseLine(line);
    if (!prop) continue;
    if (prop.name === 'SUMMARY') {
      summary = prop.value.replace(/\\,/g, ',').replace(/\\n/gi, ' ').replace(/\\\\/g, '\\').trim();
    } else if (prop.name === 'DTSTART') {
      dtstart = prop;
    } else if (prop.name === 'DTEND') {
      dtend = prop;
    } else if (prop.name === 'RRULE') {
      rrule = prop.value;
    } else if (prop.name === 'EXDATE') {
      const parsed = parseDateValue(prop);
      if (parsed) exdates.add(parsed.date);
    }
  }

  // A ceiling against a malformed or unbounded feed — nothing on a rota
  // legitimately needs more than this.
  if (entries.length > 5000) entries.length = 5000;
  return entries;
}

type Cache = { at: number; entries: TimetableEntry[] } | null;
let cache: Cache = null;
const TTL_MS = 30 * 60 * 1000;

/**
 * `null` means either the feed is not configured or it could not be read at
 * all and nothing is cached yet — both read as "no timetable data" to the
 * caller, which already treats this source as optional.
 */
export async function fetchTimetable(): Promise<TimetableEntry[] | null> {
  const url = process.env.UNIVERSITY_ICS_URL;
  if (!url) return null;

  if (cache && Date.now() - cache.at < TTL_MS) return cache.entries;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return cache?.entries ?? null;
    const text = await res.text();
    const entries = parseIcs(text);
    cache = { at: Date.now(), entries };
    return entries;
  } catch {
    // The university's server being briefly unreachable should not take the
    // rest of the dashboard down with it.
    return cache?.entries ?? null;
  }
}
