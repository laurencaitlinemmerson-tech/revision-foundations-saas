import type { HealthDay, Lift, WeighIn, Workout } from '../daily-log/data';

import { GREEN, MUTED, PLUM, TRACK } from './palette';
import { TARGETS } from './targets';

/**
 * The daily things, and how long each run has held.
 *
 * Everything else on this dashboard measures amounts. This measures whether the
 * day happened at all, which is the thing that actually compounds — and it is
 * derived rather than ticked, so there is nothing to remember to do. A habit is
 * met when the data says it was met.
 *
 * The distinction that matters here is between a day that missed and a day that
 * was never recorded. A streak broken by a flat battery is not a broken streak,
 * so an unrecorded day is drawn as a gap and neither continues a run nor ends
 * one — it is skipped over, and the count says how many were skipped.
 */

const DAY = 86_400_000;

type Src = { days: HealthDay[]; workouts: Workout[]; lifts: Lift[]; weighIns: WeighIn[] };

export type HabitDay = {
  date: string;
  /** True met, false missed, null never recorded. */
  state: boolean | null;
  label: string;
};

export type Habit = {
  key: string;
  label: string;
  /** What counts as meeting it, in words. */
  rule: string;
  /** Today, or null when today has nothing recorded yet. */
  today: boolean | null;
  /** Consecutive met days ending today, skipping over unrecorded ones. */
  streak: number;
  /** The longest run anywhere in the window. */
  best: number;
  /** Met days over recorded days in the window. */
  hitRate: number;
  /**
   * Set when the habit was never once met across every recorded day. A bar
   * nothing has ever cleared is more likely to be set wrong than to be a run of
   * bad days, and saying so is more useful than showing a column of zeroes.
   */
  neverMet: string | null;
  hitLabel: string;
  recorded: number;
  colour: string;
  days: HabitDay[];
};

export type HabitsView = {
  ok: boolean;
  /** How many of the day's habits are already met. */
  todayMet: number;
  todayTotal: number;
  todayLabel: string;
  spanLabel: string;
  habits: Habit[];
  note: string;
};

export function buildHabits(src: Src, today: string, windowDays = 56): HabitsView {
  const shift = (d: string, n: number) =>
    new Date(Date.parse(`${d}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);

  const dates: string[] = [];
  for (let i = windowDays - 1; i >= 0; i--) dates.push(shift(today, -i));

  const dayBy = new Map(src.days.map((d) => [d.date.slice(0, 10), d] as const));
  const sessionDates = new Set<string>([
    ...src.lifts.map((l) => l.performedOn.slice(0, 10)),
    ...src.workouts.map((w) => w.startedAt.slice(0, 10)),
  ]);
  const weighDates = new Set(
    src.weighIns.filter((w) => w.weight > 0).map((w) => w.date.slice(0, 10)),
  );

  // Protein is set per kilogram, so the bar moves with the weight rather than
  // sitting where it was at the start of the year.
  const latestKg = [...src.weighIns]
    .filter((w) => w.weight > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .at(-1)?.weight ?? null;
  const proteinTarget = latestKg === null ? null : Math.round(latestKg * TARGETS.proteinPerKg);
  const sleepTargetMin = TARGETS.sleepTargetH * 60;

  /**
   * Each habit says whether a date met it, or that the date holds no evidence
   * either way. Anything reading `null` is a gap, not a miss.
   */
  const RULES: Array<{
    key: string; label: string; rule: string; colour: string;
    of: (date: string) => boolean | null;
  }> = [
    {
      key: 'steps',
      label: 'Moved',
      rule: `${TARGETS.stepGoal.toLocaleString('en-GB')} steps`,
      colour: PLUM,
      of: (d) => {
        const steps = dayBy.get(d)?.activity.steps;
        return typeof steps === 'number' && steps > 0 ? steps >= TARGETS.stepGoal : null;
      },
    },
    {
      key: 'session',
      label: 'Trained',
      rule: 'a session logged',
      colour: PLUM,
      of: (d) => {
        // A session is evidence of itself; its absence on a day that otherwise
        // synced is a real rest day rather than a gap.
        if (sessionDates.has(d)) return true;
        return dayBy.has(d) ? false : null;
      },
    },
    {
      key: 'protein',
      label: 'Ate the protein',
      rule: proteinTarget === null ? 'no weight to set it from' : `${proteinTarget} g`,
      colour: PLUM,
      of: (d) => {
        if (proteinTarget === null) return null;
        const p = dayBy.get(d)?.nutrition.proteinG;
        return typeof p === 'number' && p > 0 ? p >= proteinTarget : null;
      },
    },
    {
      key: 'food',
      label: 'Logged the food',
      rule: 'anything at all',
      colour: PLUM,
      of: (d) => {
        const row = dayBy.get(d);
        if (!row) return null;
        const kcal = row.nutrition.dietaryEnergyKcal;
        return typeof kcal === 'number' && kcal > 0;
      },
    },
    {
      key: 'weigh',
      label: 'Weighed in',
      rule: 'stood on the scale',
      colour: PLUM,
      of: (d) => (weighDates.has(d) ? true : dayBy.has(d) ? false : null),
    },
    {
      key: 'sleep',
      label: 'Slept enough',
      rule: `${TARGETS.sleepTargetH} hours`,
      colour: PLUM,
      of: (d) => {
        const m = dayBy.get(d)?.sleep.totalMin;
        return typeof m === 'number' && m > 0 ? m >= sleepTargetMin : null;
      },
    },
  ];

  const habits: Habit[] = RULES.map((r) => {
    const days: HabitDay[] = dates.map((d) => {
      const state = r.of(d);
      return {
        date: d,
        state,
        label: `${new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} — ${
          state === null ? 'nothing recorded' : state ? 'met' : 'missed'
        }`,
      };
    });

    // Walking back from today: a met day extends the run, a missed day ends it,
    // and an unrecorded day is stepped over without doing either.
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const s = days[i].state;
      if (s === null) continue;
      if (s) streak++;
      else break;
    }

    let best = 0;
    let run = 0;
    for (const d of days) {
      if (d.state === null) continue;
      if (d.state) { run++; best = Math.max(best, run); } else run = 0;
    }

    const recorded = days.filter((d) => d.state !== null).length;
    const met = days.filter((d) => d.state === true).length;

    return {
      neverMet: recorded >= 14 && met === 0
        ? `Not once in ${recorded} recorded days. A bar nothing has ever cleared is worth checking before it is worth chasing.`
        : null,
      key: r.key,
      label: r.label,
      rule: r.rule,
      today: days[days.length - 1].state,
      streak,
      best,
      hitRate: recorded ? (met / recorded) * 100 : 0,
      hitLabel: recorded ? `${Math.round((met / recorded) * 100)}%` : '—',
      recorded,
      colour: recorded === 0 ? MUTED : r.colour,
      days,
    };
  });

  const todayMet = habits.filter((h) => h.today === true).length;
  const unrecorded = habits.filter((h) => h.today === null).length;

  return {
    ok: src.days.length > 0,
    todayMet,
    todayTotal: habits.length,
    todayLabel: `${todayMet} of ${habits.length} today`,
    spanLabel: `${windowDays} days`,
    habits,
    note: unrecorded
      ? `${unrecorded} of today's habits have nothing recorded yet, which is a gap rather than a miss — an unrecorded day neither continues a streak nor breaks one.`
      : 'An unrecorded day is drawn as a gap: it neither continues a streak nor breaks one, because a flat battery is not a missed day.',
  };
}

export const habitPalette = { met: GREEN, missed: TRACK, gap: MUTED };
