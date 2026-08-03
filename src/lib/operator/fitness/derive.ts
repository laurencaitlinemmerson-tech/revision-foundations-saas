/* ============================================================
   derive.ts — raw rows in, everything the dashboard renders out
   ============================================================
   Pure functions only, so the same code runs on the server for the
   first paint and in the client when the range toggle changes.
   ============================================================ */

import type { BodyReading, DailyMetric, OperatorSettings, Workout } from '../types';
import { computeTdee, tdeeRealityCheck, type TdeeBreakdown } from './tdee';
import { detectPlateau, type Plateau } from './plateau';
import {
  daysToTarget,
  fitReadings,
  projectWithBand,
  rollingMean,
  type Fit,
} from './regression';

const DAY_MS = 86_400_000;

export type RangeKey = '30d' | '90d' | '180d' | 'all';

export const RANGES: { key: RangeKey; label: string; days: number | null }[] = [
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
  { key: '180d', label: '6 months', days: 180 },
  { key: 'all', label: 'All time', days: null },
];

export function isoDay(value: string | Date): string {
  return (typeof value === 'string' ? new Date(value) : value).toISOString().slice(0, 10);
}

export function addDays(day: string, delta: number): string {
  return isoDay(new Date(new Date(`${day}T00:00:00Z`).getTime() + delta * DAY_MS));
}

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime()) / DAY_MS,
  );
}

/** One row per calendar day, gaps included, so charts space correctly. */
export interface DerivedDay {
  date: string;
  /** Scale reading for the day, null on days without one. */
  weight: number | null;
  /** Smoothed weight — the line to actually read. */
  trendWeight: number | null;
  /** Weight carried forward, used for per-day energy maths. */
  effectiveWeight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  water: number | null;

  intakeKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  waterMl: number | null;

  activeKcal: number | null;
  steps: number | null;
  exerciseMinutes: number | null;
  standHours: number | null;

  restingHr: number | null;
  hrvMs: number | null;
  sleepTotalMin: number | null;
  sleepDeepMin: number | null;
  sleepRemMin: number | null;

  /** Modelled expenditure for the day. */
  expenditureKcal: number | null;
  /** expenditure − intake. Positive is a deficit. */
  deltaKcal: number | null;

  workouts: Workout[];
}

export interface Streak {
  current: number;
  best: number;
}

export interface TrainingSummary {
  sessions: number;
  minutes: number;
  kcal: number;
  sessionsPerWeek: number;
  byType: { type: string; sessions: number; minutes: number; kcal: number }[];
  /** Sessions per ISO week, oldest first. */
  weekly: { weekStart: string; sessions: number; minutes: number }[];
  recent: Workout[];
}

export interface RecoverySummary {
  sleepAvgMin: number | null;
  sleepDebtMin: number | null;
  deepShare: number | null;
  remShare: number | null;
  restingHr: number | null;
  restingHrDelta: number | null;
  hrv: number | null;
  hrvDelta: number | null;
  nightsLogged: number;
}

export interface Derived {
  days: DerivedDay[];
  latest: BodyReading | null;
  previous: BodyReading | null;
  first: BodyReading | null;
  fit: Fit | null;
  plateau: Plateau | null;
  tdee: TdeeBreakdown;
  reality: { realTdee: number; reliable: boolean } | null;
  /** Weight change across the visible range, kg. */
  rangeChangeKg: number | null;
  /** Trend slope, kg per week. */
  slopePerWeek: number | null;
  toGoalKg: number | null;
  goalEta: string | null;
  projection: { date: string; y: number; lower: number; upper: number }[];
  averages: {
    intakeKcal: number | null;
    proteinG: number | null;
    steps: number | null;
    activeKcal: number | null;
    deltaKcal: number | null;
    sleepMin: number | null;
    waterMl: number | null;
  };
  streaks: {
    protein: Streak;
    steps: Streak;
    deficit: Streak;
    logging: Streak;
  };
  training: TrainingSummary;
  recovery: RecoverySummary;
  /** Most recent day that carries any signal at all. */
  today: DerivedDay | null;
}

function mean(values: (number | null | undefined)[]): number | null {
  const clean = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (!clean.length) return null;
  return clean.reduce((a, b) => a + b, 0) / clean.length;
}

/** Longest and current run of days satisfying `hit`, walking backwards from today. */
function streak(days: DerivedDay[], hit: (day: DerivedDay) => boolean | null): Streak {
  let best = 0;
  let running = 0;
  for (const day of days) {
    if (hit(day)) {
      running += 1;
      best = Math.max(best, running);
    } else {
      running = 0;
    }
  }

  // The current streak ignores a trailing day with no data at all, so an
  // unsynced today does not read as a broken streak.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const result = hit(days[i]);
    if (result === null && i === days.length - 1) continue;
    if (!result) break;
    current += 1;
  }

  return { current, best };
}

function startOfWeek(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  const weekday = (date.getUTCDay() + 6) % 7; // Monday = 0
  return addDays(day, -weekday);
}

export function buildDays(
  readings: BodyReading[],
  dailies: DailyMetric[],
  workouts: Workout[],
  settings: OperatorSettings,
): DerivedDay[] {
  const dates = [
    ...readings.map((r) => r.date),
    ...dailies.map((d) => d.date),
    ...workouts.map((w) => isoDay(w.startedAt)),
  ].sort();
  if (!dates.length) return [];

  const start = dates[0];
  const end = dates[dates.length - 1];
  const span = Math.max(0, daysBetween(start, end));

  const readingByDate = new Map(readings.map((r) => [r.date, r]));
  const dailyByDate = new Map(dailies.map((d) => [d.date, d]));
  const workoutsByDate = new Map<string, Workout[]>();
  for (const workout of workouts) {
    const day = isoDay(workout.startedAt);
    const list = workoutsByDate.get(day);
    if (list) list.push(workout);
    else workoutsByDate.set(day, [workout]);
  }

  const skeleton: DerivedDay[] = [];
  for (let i = 0; i <= span; i += 1) {
    const date = addDays(start, i);
    const reading = readingByDate.get(date) ?? null;
    const daily = dailyByDate.get(date) ?? null;

    skeleton.push({
      date,
      weight: reading?.weight ?? null,
      trendWeight: null,
      effectiveWeight: null,
      bodyFat: reading?.bodyFat ?? null,
      muscleMass: reading?.muscleMass ?? null,
      water: reading?.water ?? null,

      intakeKcal: daily?.dietaryEnergyKcal ?? null,
      proteinG: daily?.proteinG ?? null,
      carbsG: daily?.carbsG ?? null,
      fatG: daily?.fatG ?? null,
      fiberG: daily?.fiberG ?? null,
      waterMl: daily?.waterMl ?? null,

      activeKcal: daily?.activeEnergyKcal ?? null,
      steps: daily?.steps ?? null,
      exerciseMinutes: daily?.exerciseMinutes ?? null,
      standHours: daily?.standHours ?? null,

      restingHr: daily?.restingHr ?? null,
      hrvMs: daily?.hrvMs ?? null,
      sleepTotalMin: daily?.sleepTotalMin ?? null,
      sleepDeepMin: daily?.sleepDeepMin ?? null,
      sleepRemMin: daily?.sleepRemMin ?? null,

      expenditureKcal: null,
      deltaKcal: null,
      workouts: workoutsByDate.get(date) ?? [],
    });
  }

  // Smoothed weight line, then carry a weight forward across gaps so
  // every day can be given an energy figure.
  const trend = rollingMean(skeleton.map((d) => d.weight), 7);
  let carried: number | null = null;
  for (let i = 0; i < skeleton.length; i += 1) {
    skeleton[i].trendWeight = trend[i];
    carried = skeleton[i].weight ?? trend[i] ?? carried;
    skeleton[i].effectiveWeight = carried;
  }
  // Backfill the head of the series from the first known weight.
  const firstKnown = skeleton.find((d) => d.effectiveWeight !== null)?.effectiveWeight ?? null;
  for (const day of skeleton) {
    if (day.effectiveWeight === null) day.effectiveWeight = firstKnown;
    else break;
  }

  for (const day of skeleton) {
    if (day.effectiveWeight === null) continue;

    const proteinShare =
      day.proteinG !== null && day.intakeKcal
        ? Math.min(0.6, (day.proteinG * 4) / day.intakeKcal)
        : undefined;

    const breakdown = computeTdee({
      weightKg: day.effectiveWeight,
      heightCm: settings.heightCm,
      ageYears: settings.ageYears,
      sex: settings.sex,
      neatFactor: settings.neatFactor,
      measuredExerciseKcal: day.activeKcal,
      intakeKcal: day.intakeKcal,
      proteinShare,
      weeklyChangeKg: settings.weeklyChangeKg,
    });

    day.expenditureKcal = breakdown.tdee;
    day.deltaKcal = day.intakeKcal === null ? null : breakdown.tdee - day.intakeKcal;
  }

  return skeleton;
}

export function sliceRange(days: DerivedDay[], range: RangeKey): DerivedDay[] {
  const spec = RANGES.find((r) => r.key === range);
  if (!spec?.days || days.length <= spec.days) return days;
  return days.slice(days.length - spec.days);
}

function summariseTraining(days: DerivedDay[]): TrainingSummary {
  const workouts = days.flatMap((day) => day.workouts);
  const byType = new Map<string, { sessions: number; minutes: number; kcal: number }>();

  for (const workout of workouts) {
    const type = workout.type || 'Other';
    const entry = byType.get(type) ?? { sessions: 0, minutes: 0, kcal: 0 };
    entry.sessions += 1;
    entry.minutes += workout.durationMin ?? 0;
    entry.kcal += workout.energyKcal ?? 0;
    byType.set(type, entry);
  }

  const weekMap = new Map<string, { sessions: number; minutes: number }>();
  for (const day of days) {
    const week = startOfWeek(day.date);
    const entry = weekMap.get(week) ?? { sessions: 0, minutes: 0 };
    for (const workout of day.workouts) {
      entry.sessions += 1;
      entry.minutes += workout.durationMin ?? 0;
    }
    weekMap.set(week, entry);
  }

  const minutes = workouts.reduce((acc, w) => acc + (w.durationMin ?? 0), 0);
  const kcal = workouts.reduce((acc, w) => acc + (w.energyKcal ?? 0), 0);
  const weeks = Math.max(1, days.length / 7);

  return {
    sessions: workouts.length,
    minutes: Math.round(minutes),
    kcal: Math.round(kcal),
    sessionsPerWeek: Number((workouts.length / weeks).toFixed(1)),
    byType: [...byType.entries()]
      .map(([type, value]) => ({ type, ...value, minutes: Math.round(value.minutes), kcal: Math.round(value.kcal) }))
      .sort((a, b) => b.sessions - a.sessions),
    weekly: [...weekMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([weekStart, value]) => ({ weekStart, ...value, minutes: Math.round(value.minutes) })),
    recent: [...workouts]
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, 8),
  };
}

function summariseRecovery(days: DerivedDay[], settings: OperatorSettings): RecoverySummary {
  const recent = days.slice(-14);
  const earlier = days.slice(-28, -14);

  const sleepAvgMin = mean(recent.map((d) => d.sleepTotalMin));
  const nightsLogged = recent.filter((d) => d.sleepTotalMin !== null).length;

  const restingHr = mean(recent.map((d) => d.restingHr));
  const restingHrEarlier = mean(earlier.map((d) => d.restingHr));
  const hrv = mean(recent.map((d) => d.hrvMs));
  const hrvEarlier = mean(earlier.map((d) => d.hrvMs));

  const deep = mean(recent.map((d) => d.sleepDeepMin));
  const rem = mean(recent.map((d) => d.sleepRemMin));

  return {
    sleepAvgMin,
    sleepDebtMin:
      sleepAvgMin === null ? null : Math.round((settings.sleepTargetMin - sleepAvgMin) * nightsLogged),
    deepShare: deep !== null && sleepAvgMin ? deep / sleepAvgMin : null,
    remShare: rem !== null && sleepAvgMin ? rem / sleepAvgMin : null,
    restingHr,
    restingHrDelta: restingHr !== null && restingHrEarlier !== null ? restingHr - restingHrEarlier : null,
    hrv,
    hrvDelta: hrv !== null && hrvEarlier !== null ? hrv - hrvEarlier : null,
    nightsLogged,
  };
}

export function derive(
  readings: BodyReading[],
  dailies: DailyMetric[],
  workouts: Workout[],
  settings: OperatorSettings,
  range: RangeKey,
): Derived {
  const allDays = buildDays(readings, dailies, workouts, settings);
  const days = sliceRange(allDays, range);

  const rangeReadings = days
    .filter((d): d is DerivedDay & { weight: number } => d.weight !== null)
    .map((d) => ({ date: d.date, weight: d.weight }));

  const sortedReadings = [...readings].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sortedReadings[sortedReadings.length - 1] ?? null;
  const previous = sortedReadings[sortedReadings.length - 2] ?? null;
  const first = sortedReadings[0] ?? null;

  const fit = fitReadings(rangeReadings);
  const plateau = detectPlateau(sortedReadings.slice(-30));

  const intakeDays = days.filter((d) => d.intakeKcal !== null);
  const averages = {
    intakeKcal: mean(days.map((d) => d.intakeKcal)),
    proteinG: mean(days.map((d) => d.proteinG)),
    steps: mean(days.map((d) => d.steps)),
    activeKcal: mean(days.map((d) => d.activeKcal)),
    deltaKcal: mean(days.map((d) => d.deltaKcal)),
    sleepMin: mean(days.map((d) => d.sleepTotalMin)),
    waterMl: mean(days.map((d) => d.waterMl)),
  };

  const measuredExercise = mean(days.slice(-7).map((d) => d.activeKcal));
  const recentIntake = mean(days.slice(-7).map((d) => d.intakeKcal));
  const recentProtein = mean(days.slice(-7).map((d) => d.proteinG));

  const tdee = computeTdee({
    weightKg: latest?.weight ?? 70,
    heightCm: settings.heightCm,
    ageYears: settings.ageYears,
    sex: settings.sex,
    neatFactor: settings.neatFactor,
    measuredExerciseKcal: measuredExercise,
    intakeKcal: recentIntake,
    proteinShare:
      recentProtein !== null && recentIntake
        ? Math.min(0.6, (recentProtein * 4) / recentIntake)
        : undefined,
    weeklyChangeKg: settings.weeklyChangeKg,
  });

  const firstWeighed = rangeReadings[0] ?? null;
  const lastWeighed = rangeReadings[rangeReadings.length - 1] ?? null;
  const rangeChangeKg =
    firstWeighed && lastWeighed ? lastWeighed.weight - firstWeighed.weight : null;

  const reality =
    firstWeighed && lastWeighed
      ? tdeeRealityCheck({
          meanIntakeKcal: averages.intakeKcal,
          weightChangeKg: rangeChangeKg ?? 0,
          days: Math.max(1, daysBetween(firstWeighed.date, lastWeighed.date)),
          intakeDaysLogged: intakeDays.length,
        })
      : null;

  // Forward projection, 42 days past the last reading.
  const projection: Derived['projection'] = [];
  if (fit && lastWeighed) {
    const originDay = isoDay(new Date(fit.t0));
    const lastOffset = daysBetween(originDay, lastWeighed.date);
    for (let i = 0; i <= 42; i += 7) {
      const point = projectWithBand(fit, lastOffset + i);
      projection.push({ date: addDays(lastWeighed.date, i), ...point });
    }
  }

  const etaDays = fit && latest ? daysToTarget(fit, latest.weight, settings.targetWeightKg) : null;

  return {
    days,
    latest,
    previous,
    first,
    fit,
    plateau,
    tdee,
    reality,
    rangeChangeKg,
    slopePerWeek: fit ? fit.slope * 7 : null,
    toGoalKg: latest ? latest.weight - settings.targetWeightKg : null,
    goalEta: etaDays !== null && lastWeighed ? addDays(lastWeighed.date, Math.round(etaDays)) : null,
    projection,
    averages,
    streaks: {
      protein: streak(days, (d) => (d.proteinG === null ? null : d.proteinG >= settings.proteinTargetG)),
      steps: streak(days, (d) => (d.steps === null ? null : d.steps >= settings.stepTarget)),
      deficit: streak(days, (d) => (d.deltaKcal === null ? null : d.deltaKcal > 0)),
      logging: streak(days, (d) => (d.intakeKcal !== null || d.weight !== null ? true : false)),
    },
    training: summariseTraining(days),
    recovery: summariseRecovery(days, settings),
    today:
      [...days].reverse().find(
        (d) =>
          d.weight !== null ||
          d.intakeKcal !== null ||
          d.steps !== null ||
          d.workouts.length > 0,
      ) ?? null,
  };
}
