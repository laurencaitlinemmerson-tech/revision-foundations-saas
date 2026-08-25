/**
 * The peer head-to-head contract, v2.
 *
 * Two independent sites, two databases, nobody writing to anybody else's. Each
 * side publishes one read-only JSON document describing its own day and week and
 * fetches the other's; both then compute the scoreboard locally. The parts that
 * have to agree live here so there is one place to check them against the spec.
 */

export const CONTRACT_VERSION = 2 as const;

/** Caps, applied when publishing and again when reading. */
export const CAPS = { days: 14, foodPerDay: 40, nameChars: 60 } as const;

export const SESSIONS_PLANNED_PER_WEEK = 4;
export const SCORE_WEIGHTS = { consistency: 40, adherence: 40, streak: 20 } as const;
export const STREAK_CAP_DAYS = 14;

/* ── London time ─────────────────────────────────────────────────────────── */

const LONDON = 'Europe/London';

/**
 * The London calendar date for a moment, as YYYY-MM-DD.
 *
 * Taken from the zone directly rather than from the server clock: this runs in
 * UTC on Vercel, where "today" is the previous day for the hour after London
 * midnight through British Summer Time.
 */
export function londonDate(at: number | Date = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: LONDON, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(at));
}

/**
 * Move a YYYY-MM-DD date by whole days.
 *
 * Anchored at midday rather than midnight. Midnight sits one daylight-saving
 * step away from being the previous day; midday has twelve hours of slack on
 * either side and cannot slide.
 */
export function shiftDays(day: string, delta: number): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) + delta * 86_400_000)
    .toISOString().slice(0, 10);
}

/** The Monday of the week containing `day`, in London. */
export function londonMonday(day: string = londonDate()): string {
  const dow = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
  return shiftDays(day, -dow);
}

/** Monday is 1, Sunday is 7. */
export function daysElapsedInWeek(day: string = londonDate()): number {
  return ((new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7) + 1;
}

/** Every date from `from` to `to` inclusive, oldest first. */
export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = from; d <= to; d = shiftDays(d, 1)) out.push(d);
  return out;
}

/**
 * An ISO 8601 timestamp carrying London's offset rather than Z.
 *
 * The spec asks for the local offset explicitly, so a reader can see which
 * clock the document was written against without inferring it.
 */
export function londonISO(at: number | Date = Date.now()): string {
  const d = new Date(at);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d);
  const p = (type: string) => parts.find((x) => x.type === type)?.value ?? '00';

  // The offset is the gap between the wall clock in London and the same instant
  // read as UTC, which avoids hard-coding when British Summer Time starts.
  const wallAsUTC = Date.UTC(
    Number(p('year')), Number(p('month')) - 1, Number(p('day')),
    Number(p('hour')), Number(p('minute')), Number(p('second')),
  );
  const offsetMin = Math.round((wallAsUTC - d.setMilliseconds(0)) / 60_000);
  const sign = offsetMin < 0 ? '-' : '+';
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');

  return `${p('year')}-${p('month')}-${p('day')}T${p('hour')}:${p('minute')}:${p('second')}${sign}${hh}:${mm}`;
}

/* ── the payload ─────────────────────────────────────────────────────────── */

export type FoodItem = {
  name: string;
  category: string | null;
  at: string | null;
  kcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
};

export type DayEntry = {
  day: string;
  steps: number | null;
  caloriesIn: number | null;
  caloriesOut: number | null;
  net: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  sleepMinutes: number | null;
  food: FoodItem[] | null;
};

export type PeerPayload = {
  v: 2;
  athlete: string;
  updatedAt: string;
  week: string;
  score: {
    points: number; consistency: number; adherence: number; streak: number;
    streakDays: number; sessions: number; sessionsPlanned: number;
    deficitDays: number; daysElapsed: number;
  };
  goal: { pct: number | null; toGoKg: number | null; startKg: number | null; goalKg: number | null };
  heightCm: number | null;
  targets: { proteinG: number | null };
  weightKg: number | null;
  bodyFat: number | null;
  avatarUrl: string | null;
  today: Omit<DayEntry, 'day'>;
  weekTotals: {
    steps: number | null;
    daysWithSteps: number;
    gymSessions: number;
    runs: number;
    proteinG: number | null;
    sleepNights7h: number | null;
  };
  days: DayEntry[] | null;
};

/* ── the rules that have to match ────────────────────────────────────────── */

/** A reading, or null. Zero is a claim and only survives when it is meant. */
export const reading = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

/** Zero here means an unworn watch, not a sleepless night, so it becomes null. */
export const sleepReading = (v: unknown): number | null => {
  const n = reading(v);
  return n && n > 0 ? n : null;
};

export const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);

/** Always derived, never trusted from the wire. */
export const netOf = (inK: number | null, outK: number | null): number | null =>
  inK === null || outK === null ? null : inK - outK;

/** Atwater, for an item logged as macros without a calorie figure. */
export const atwater = (p: number | null, c: number | null, f: number | null): number | null =>
  p === null && c === null && f === null ? null : (p ?? 0) * 4 + (c ?? 0) * 4 + (f ?? 0) * 9;

export function scoreOf(input: {
  sessions: number; sessionsPlanned: number; deficitDays: number;
  daysElapsed: number; streakDays: number;
}) {
  const consistency = Math.round(clamp01(input.sessions / input.sessionsPlanned) * SCORE_WEIGHTS.consistency);
  const adherence = Math.round(
    (input.daysElapsed > 0 ? clamp01(input.deficitDays / input.daysElapsed) : 0) * SCORE_WEIGHTS.adherence,
  );
  const streak = Math.round(
    clamp01(Math.min(input.streakDays, STREAK_CAP_DAYS) / STREAK_CAP_DAYS) * SCORE_WEIGHTS.streak,
  );
  return { ...input, consistency, adherence, streak, points: consistency + adherence + streak };
}

/* ── the five challenges ─────────────────────────────────────────────────── */

export type ChallengeId = 'steps-week' | 'protein-week' | 'weight-lost' | 'gym-week' | 'sleep-week';

export const CHALLENGES: Array<{ id: ChallengeId; label: string }> = [
  { id: 'steps-week', label: 'Weekly steps' },
  { id: 'protein-week', label: 'Weekly protein vs own goal' },
  { id: 'weight-lost', label: 'Weight lost vs own goal' },
  { id: 'gym-week', label: 'Gym sessions' },
  { id: 'sleep-week', label: 'Nights 7h+ sleep' },
];

/** The extractor for one challenge. Must be identical on both sides. */
export function challengeValue(id: ChallengeId, p: PeerPayload | null): number | null {
  if (!p) return null;
  switch (id) {
    case 'steps-week':
      return p.weekTotals.steps || null;
    case 'protein-week': {
      const total = p.weekTotals.proteinG;
      const target = p.targets.proteinG;
      if (total === null || !target) return null;
      return Math.min(1, total / (target * 7));
    }
    case 'weight-lost':
      return p.weightKg === null || p.goal.pct === null ? null : clamp01(p.goal.pct);
    case 'gym-week':
      // Agreed exception: missing counts as zero, so a side that has not built
      // the field starts at 0/7 rather than sitting uncalled forever.
      return Math.max(0, Math.min(7, p.weekTotals.gymSessions ?? 0));
    case 'sleep-week': {
      const n = p.weekTotals.sleepNights7h;
      return n === null ? null : Math.max(0, Math.min(7, n));
    }
  }
}

/** A missing number leaves the round uncalled; it never awards a win. */
export function winnerOf(a: number | null, b: number | null): 'you' | 'them' | null {
  if (a === null || b === null || a === b) return null;
  return a > b ? 'you' : 'them';
}
