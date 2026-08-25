import type { Workout } from '../daily-log/data';
import { workoutKindOf, type WorkoutKind } from '@/lib/workoutKind';

/**
 * Per-activity statistics, built from synced workouts.
 *
 * The Exercises screen was written for a lift log that stays empty, because the
 * sets live in a coaching app that will not release them. But 1,500 workouts did
 * sync, and "what have I actually done, how often, and is it improving" is the
 * question that screen was asking in the first place. So it asks it of activity
 * types instead of movements, and the screen stops being a dead end.
 */

export type ActivityRow = {
  key: string;
  name: string;
  kind: WorkoutKind;
  sessions: number;
  sessionsInRange: number;
  totalMinutes: number;
  totalKm: number;
  /** Longest single session, in minutes. */
  bestMinutes: number | null;
  /** Furthest single session, in km. */
  bestKm: number | null;
  /** Quickest pace over a session of at least 1 km, in minutes per km. */
  bestPace: number | null;
  lastDone: string | null;
  firstDone: string | null;
  /** Sessions per month over the selected range, against the range before it. */
  ratePerMonth: number | null;
  prevRatePerMonth: number | null;
  /** Duration of the most recent 14 sessions, for a sparkline. */
  history: number[];
};

/**
 * The same activity under two source names.
 *
 * The Health export writes Apple's raw identifiers — Walking, Running, Cycling —
 * while Health Auto Export writes the display names the Fitness app shows,
 * "Outdoor Walk" and the like. They are the same training, and leaving both
 * makes a session read as "Walking + Outdoor Walk" and splits its history across
 * two rows. Indoor and outdoor are folded together deliberately: nothing on this
 * dashboard treats them differently.
 */
const ALIASES: Array<[RegExp, string]> = [
  [/^(outdoor|indoor) walk$/i, 'Walking'],
  [/^(outdoor|indoor) run$/i, 'Running'],
  [/^(outdoor|indoor) cycle$/i, 'Cycling'],
  [/^(outdoor|indoor) rowing$/i, 'Rowing'],
  [/^(pool|open water) swim$/i, 'Swimming'],
  [/^traditional strength training$/i, 'Strength Training'],
  [/^functional strength training$/i, 'Functional Strength'],
];

/** Apple's activity names arrive camel-cased from the export. */
export function prettyType(raw: string | null): string {
  if (!raw) return 'Workout';
  const cleaned = raw
    .replace(/^HKWorkoutActivityType/, '')
    // "CrossTraining" from the Health export and "Cross Training" from the phone
    // sync are the same activity, and both have to land on the same string.
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/\bHiit\b/i, 'HIIT')
    .trim();

  for (const [pattern, name] of ALIASES) {
    if (pattern.test(cleaned)) return name;
  }
  return cleaned;
}

const monthsIn = (spanDays: number) => Math.max(0.25, spanDays / 30.437);

export function buildActivities(
  all: Workout[],
  inRange: Workout[],
  prevRange: Workout[],
  spanDays: number,
): ActivityRow[] {
  const names = [...new Set(all.map((w) => prettyType(w.type)))];

  return names
    .map((name) => {
      const mine = all
        .filter((w) => prettyType(w.type) === name)
        .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
      const ranged = inRange.filter((w) => prettyType(w.type) === name);
      const prev = prevRange.filter((w) => prettyType(w.type) === name);

      const mins = mine.map((w) => w.durationMin ?? 0).filter((v) => v > 0);
      const kms = mine.map((w) => w.distanceKm ?? 0).filter((v) => v > 0);

      // Pace only means anything over a distance worth measuring.
      const paces = mine
        .filter((w) => (w.distanceKm ?? 0) >= 1 && (w.durationMin ?? 0) > 0)
        .map((w) => (w.durationMin as number) / (w.distanceKm as number));

      return {
        key: name,
        name,
        kind: workoutKindOf(mine[0] ?? { type: name, source: null, distanceKm: null }),
        sessions: mine.length,
        sessionsInRange: ranged.length,
        totalMinutes: ranged.reduce((a, w) => a + (w.durationMin ?? 0), 0),
        totalKm: ranged.reduce((a, w) => a + (w.distanceKm ?? 0), 0),
        bestMinutes: mins.length ? Math.max(...mins) : null,
        bestKm: kms.length ? Math.max(...kms) : null,
        bestPace: paces.length ? Math.min(...paces) : null,
        lastDone: mine.length ? mine[mine.length - 1].startedAt.slice(0, 10) : null,
        firstDone: mine.length ? mine[0].startedAt.slice(0, 10) : null,
        ratePerMonth: ranged.length / monthsIn(spanDays),
        prevRatePerMonth: prev.length ? prev.length / monthsIn(spanDays) : null,
        history: mine.slice(-14).map((w) => w.durationMin ?? 0),
      };
    })
    .sort((a, b) => b.sessionsInRange - a.sessionsInRange || b.sessions - a.sessions);
}
