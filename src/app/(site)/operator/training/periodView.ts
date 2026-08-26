import type { HealthDay, Lift, WeighIn, Workout } from '../daily-log/data';

import { GREEN, INK, MUTED, PINK, PLUM, ROSE, SOFT } from './palette';
import { TARGETS } from './targets';
import type { PeriodId } from './periods';
import type { Window } from './scoring';

/**
 * The selected period, broken into the units it is actually made of.
 *
 * Changing the period used to change every number on the page while leaving its
 * shape identical, which made the control feel like a filter rather than a view.
 * A week is seven days, a month is four or five weeks, a year is twelve months —
 * so each period is laid out as the thing it is composed of, and clicking
 * between them changes what you are looking at rather than only what it says.
 *
 * A single day has no sub-units in this data, which is daily aggregates all the
 * way down, so Day shows the day itself against the one before it.
 */

const DAY = 86_400_000;

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtHours = (h: number | null) =>
  h === null ? '—' : `${Math.floor(h)}h ${String(Math.round((h % 1) * 60)).padStart(2, '0')}m`;

export type Unit = {
  key: string;
  label: string;
  sub: string;
  /** Days inside this unit that carried a session. */
  sessions: number;
  steps: number | null;
  stepsLabel: string;
  sleepLabel: string;
  weightLabel: string;
  intakeLabel: string;
  /** 0–100, against the step goal for the unit's length. */
  stepPct: number;
  /** Marks the unit containing today. */
  current: boolean;
  /** Nothing recorded at all. */
  empty: boolean;
};

export type PeriodView = {
  shape: 'day' | 'days' | 'weeks' | 'months';
  title: string;
  note: string;
  units: Unit[];
  /** Day view only: the figures for the day itself. */
  tiles: Array<{ label: string; value: string; note: string; colour: string }>;
};

type Src = { days: HealthDay[]; workouts: Workout[]; lifts: Lift[]; weighIns: WeighIn[] };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function buildPeriodView(src: Src, period: PeriodId, win: Window, today: string): PeriodView {
  const sessionDates = new Set<string>([
    ...src.lifts.map((l) => l.performedOn.slice(0, 10)),
    ...src.workouts.map((w) => w.startedAt.slice(0, 10)),
  ]);
  const dayBy = new Map(src.days.map((d) => [d.date.slice(0, 10), d] as const));
  const weightBy = new Map(
    src.weighIns.filter((w) => w.weight > 0).map((w) => [w.date.slice(0, 10), w.weight] as const),
  );

  /** Roll a set of dates into one unit. */
  const unitOf = (key: string, label: string, sub: string, dates: string[]): Unit => {
    const rows = dates.map((d) => dayBy.get(d)).filter((d): d is HealthDay => !!d);
    const pick = (f: (d: HealthDay) => number | null | undefined) =>
      rows.map(f).filter((v): v is number => typeof v === 'number' && v > 0);

    const steps = pick((d) => d.activity.steps);
    const stepTotal = steps.length ? steps.reduce((a, b) => a + b, 0) : null;
    const sleep = pick((d) => d.sleep.totalMin);
    const intake = pick((d) => d.nutrition.dietaryEnergyKcal);
    const weights = dates.map((d) => weightBy.get(d)).filter((v): v is number => !!v);

    // Scored against the goal for however many days the unit covers, so a week
    // and a month are held to the same standard per day.
    const goal = TARGETS.stepGoal * Math.max(1, dates.filter((d) => d <= today).length);

    return {
      key,
      label,
      sub,
      sessions: dates.filter((d) => sessionDates.has(d)).length,
      steps: stepTotal,
      stepsLabel: stepTotal === null ? '—' : nf(Math.round(stepTotal)),
      sleepLabel: sleep.length ? fmtHours(sleep.reduce((a, b) => a + b, 0) / sleep.length / 60) : '—',
      weightLabel: weights.length
        ? `${nf(weights.reduce((a, b) => a + b, 0) / weights.length, 1)} kg`
        : '—',
      intakeLabel: intake.length
        ? nf(Math.round(intake.reduce((a, b) => a + b, 0) / intake.length))
        : '—',
      stepPct: stepTotal === null ? 0 : Math.min(100, (stepTotal / goal) * 100),
      current: dates.includes(today),
      empty: !rows.length && !weights.length,
    };
  };

  const shift = (d: string, n: number) =>
    new Date(Date.parse(`${d}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);
  const between = (from: string, to: string) => {
    const out: string[] = [];
    for (let d = from; d <= to; d = shift(d, 1)) out.push(d);
    return out;
  };

  const fromDay = new Date(win.from).toISOString().slice(0, 10);
  const toDay = new Date(win.to - 1).toISOString().slice(0, 10);

  /* ── Day: no sub-units to show, so the day itself ──────────────────────── */

  if (period === 'Day') {
    const d = dayBy.get(today);
    const prev = dayBy.get(shift(today, -1));
    const delta = (now: number | null | undefined, was: number | null | undefined, unit: string) => {
      if (!now || !was) return '—';
      const diff = now - was;
      return `${diff >= 0 ? '+' : '−'}${nf(Math.abs(Math.round(diff)))} ${unit} on yesterday`;
    };

    const sessionsToday = src.workouts.filter((w) => w.startedAt.slice(0, 10) === today).length
      + src.lifts.filter((l) => l.performedOn.slice(0, 10) === today).length;

    return {
      shape: 'day',
      title: 'Today',
      note: 'The day itself, against yesterday. This data is daily totals, so a single day has nothing smaller to break into.',
      units: [],
      tiles: [
        {
          label: 'Steps', value: d?.activity.steps ? nf(d.activity.steps) : '—',
          note: delta(d?.activity.steps, prev?.activity.steps, 'steps'),
          colour: (d?.activity.steps ?? 0) >= TARGETS.stepGoal ? GREEN : INK,
        },
        {
          label: 'Sessions', value: String(sessionsToday),
          note: sessionsToday ? 'logged today' : 'nothing logged yet',
          colour: sessionsToday ? PLUM : MUTED,
        },
        {
          label: 'Sleep', value: d?.sleep.totalMin ? fmtHours(d.sleep.totalMin / 60) : '—',
          note: delta(d?.sleep.totalMin, prev?.sleep.totalMin, 'min'),
          colour: (d?.sleep.totalMin ?? 0) >= 420 ? GREEN : (d?.sleep.totalMin ?? 0) > 0 ? ROSE : MUTED,
        },
        {
          label: 'Calories in', value: d?.nutrition.dietaryEnergyKcal ? nf(Math.round(d.nutrition.dietaryEnergyKcal)) : '—',
          note: d?.nutrition.dietaryEnergyKcal ? 'logged' : 'nothing logged',
          colour: INK,
        },
        {
          label: 'Protein', value: d?.nutrition.proteinG ? `${nf(Math.round(d.nutrition.proteinG))} g` : '—',
          note: delta(d?.nutrition.proteinG, prev?.nutrition.proteinG, 'g'),
          colour: INK,
        },
        {
          label: 'Resting HR', value: d?.heart.restingHr ? `${nf(d.heart.restingHr)} bpm` : '—',
          note: delta(d?.heart.restingHr, prev?.heart.restingHr, 'bpm'),
          colour: INK,
        },
        {
          label: 'Weight', value: weightBy.has(today) ? `${nf(weightBy.get(today) as number, 1)} kg` : '—',
          note: weightBy.has(today) ? 'weighed today' : 'not weighed today',
          colour: INK,
        },
        {
          label: 'Active energy', value: d?.activity.activeEnergyKcal ? nf(Math.round(d.activity.activeEnergyKcal)) : '—',
          note: delta(d?.activity.activeEnergyKcal, prev?.activity.activeEnergyKcal, 'kcal'),
          colour: INK,
        },
      ],
    };
  }

  /* ── Week: seven days ──────────────────────────────────────────────────── */

  if (period === 'Week' || (period === 'Custom' && win.spanDays <= 10)) {
    const dates = between(fromDay, toDay);
    return {
      shape: 'days',
      title: 'Day by day',
      note: 'Each day of the week, with its step total against the daily goal.',
      units: dates.map((d) => unitOf(
        d,
        new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }),
        new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
        [d],
      )),
      tiles: [],
    };
  }

  /* ── Year: twelve months ───────────────────────────────────────────────── */

  if (period === 'Year' || (period === 'Custom' && win.spanDays > 90)) {
    const seen = new Set<string>();
    for (const d of between(fromDay, toDay)) seen.add(d.slice(0, 7));
    return {
      shape: 'months',
      title: 'Month by month',
      note: 'Each month of the year so far, with its step total against the goal for the days it covers.',
      units: [...seen].sort().map((m) => {
        const [y, mo] = m.split('-').map(Number);
        const last = new Date(Date.UTC(y, mo, 0)).getUTCDate();
        const dates = between(`${m}-01`, `${m}-${String(last).padStart(2, '0')}`)
          .filter((d) => d >= fromDay && d <= toDay);
        return unitOf(m, MONTHS[mo - 1].slice(0, 3), String(y), dates);
      }),
      tiles: [],
    };
  }

  /* ── Month: four or five weeks ─────────────────────────────────────────── */

  const weeks = new Map<string, string[]>();
  for (const d of between(fromDay, toDay)) {
    const dt = new Date(`${d}T12:00:00Z`);
    const monday = new Date(dt.getTime() - ((dt.getUTCDay() + 6) % 7) * DAY)
      .toISOString().slice(0, 10);
    if (!weeks.has(monday)) weeks.set(monday, []);
    weeks.get(monday)!.push(d);
  }

  return {
    shape: 'weeks',
    title: 'Week by week',
    note: 'Each week of the month, with its step total against the goal for the days it covers.',
    units: [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([monday, dates]) =>
      unitOf(
        monday,
        `Week ${[...weeks.keys()].sort().indexOf(monday) + 1}`,
        `${new Date(`${dates[0]}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} – ${new Date(`${dates[dates.length - 1]}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`,
        dates,
      )),
    tiles: [],
  };
}

export const periodPalette = { ink: INK, soft: SOFT, muted: MUTED, plum: PLUM, pink: PINK };
