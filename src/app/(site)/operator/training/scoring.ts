import type { HealthDay, Lift, WeighIn, Workout } from '../daily-log/data';
import { TARGETS, proteinTargetG } from './targets';
import { isCardioWorkout, isStrengthWorkout } from './workoutKind';

/**
 * The six dimensions, and how a period of logged data turns into a score.
 *
 * Every dimension is scored 0–100 against the targets in `targets.ts` or, where
 * no absolute target makes sense, against the operator's own baseline drawn from
 * the whole history. Each score is a weighted mean of parts, and a part is only
 * counted when the data behind it exists — so a dimension with nothing logged
 * comes back `null` and the dashboard says so, rather than showing a zero that
 * would read as a bad result instead of an absent one.
 */

export const DIMENSIONS = [
  'Strength', 'Cardio', 'Activity', 'Nutrition', 'Recovery', 'Consistency',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

const DAY = 86_400_000;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** A part of a score: its 0–1 value and how much of the dimension it carries. */
type Part = { value: number | null; weight: number };

/** Weighted mean over the parts that have data, renormalised across them. */
function blend(parts: Part[]): number | null {
  const live = parts.filter((p): p is { value: number; weight: number } => p.value !== null);
  if (!live.length) return null;
  const total = live.reduce((a, p) => a + p.weight, 0);
  if (total <= 0) return null;
  return Math.round((live.reduce((a, p) => a + p.value * p.weight, 0) / total) * 100);
}

/* ── window slicing ──────────────────────────────────────────────────────── */

export type Window = { from: number; to: number; spanDays: number };

/** A period and the equal-length period immediately before it. */
export function windows(to: number, spanDays: number): { now: Window; prev: Window } {
  const span = spanDays * DAY;
  return {
    now: { from: to - span, to, spanDays },
    prev: { from: to - span * 2, to: to - span, spanDays },
  };
}

const inWindow = (dateish: string, w: Window) => {
  const t = new Date(dateish).getTime();
  return Number.isFinite(t) && t >= w.from && t < w.to;
};

/* ── the figures a window yields ─────────────────────────────────────────── */

export type Sources = {
  days: HealthDay[];
  lifts: Lift[];
  workouts: Workout[];
  weighIns: WeighIn[];
};

/** Baselines drawn from the whole history, for the metrics with no fixed target. */
export type Baseline = { restingHr: number | null; hrv: number | null; weightKg: number | null };

export function baselineOf(src: Sources): Baseline {
  const rhr = mean(src.days.map((d) => d.heart.restingHr).filter((v): v is number => !!v));
  const hrv = mean(src.days.map((d) => d.heart.hrvMs).filter((v): v is number => !!v));
  const last = src.weighIns.length ? src.weighIns[src.weighIns.length - 1] : null;
  return { restingHr: rhr, hrv, weightKg: last && last.weight > 0 ? last.weight : null };
}

export type WindowStats = {
  window: Window;
  weeks: number;
  days: HealthDay[];
  lifts: Lift[];
  workouts: Workout[];
  weighIns: WeighIn[];

  avgSteps: number | null;
  avgExerciseMin: number | null;
  activeDays: number;

  nutritionDays: number;
  avgCalories: number | null;
  avgProtein: number | null;
  calOnTarget: number;
  proteinOnTarget: number;

  avgSleepH: number | null;
  sleepCv: number | null;
  avgRestingHr: number | null;
  avgHrv: number | null;
  restDays: number;

  cardioMinutes: number;
  cardioDistanceKm: number;
  vo2: number | null;

  volumeKg: number;
  liftSessionDays: number;
  progressedShare: number | null;
  /** Days carrying a strength session, whether logged as lifts or synced. */
  strengthSessionDays: number;

  sessionDays: number;
  plannedSessions: number;
  longestGapDays: number | null;
};

/** Days that carry a completed session of any kind, as ISO dates. */
function sessionDatesIn(lifts: Lift[], workouts: Workout[]): Set<string> {
  const out = new Set<string>();
  for (const l of lifts) out.add(l.performedOn.slice(0, 10));
  for (const w of workouts) out.add(w.startedAt.slice(0, 10));
  return out;
}

export function statsFor(src: Sources, w: Window, base: Baseline): WindowStats {
  const days = src.days.filter((d) => inWindow(d.date, w));
  const lifts = src.lifts.filter((l) => inWindow(l.performedOn, w));
  const workouts = src.workouts.filter((x) => inWindow(x.startedAt, w));
  const weighIns = src.weighIns.filter((r) => inWindow(r.date, w));
  const weeks = Math.max(1, w.spanDays / 7);

  const pick = (f: (d: HealthDay) => number | null | undefined) =>
    days.map(f).filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0);

  const steps = pick((d) => d.activity.steps);
  const exerciseMin = pick((d) => d.activity.exerciseMinutes);

  // Nutrition adherence only counts days that were actually logged; an unlogged
  // day is missing data, not a day the target was missed.
  const proteinTarget = proteinTargetG(base.weightKg);
  const calDays = pick((d) => d.nutrition.dietaryEnergyKcal);
  const proteinDays = pick((d) => d.nutrition.proteinG);
  const calOnTarget = calDays.filter(
    (v) => Math.abs(v - TARGETS.calorieTarget) <= TARGETS.calorieTarget * 0.1,
  ).length;
  const proteinOnTarget = proteinDays.filter((v) => v >= proteinTarget * 0.9).length;

  const sleepH = pick((d) => d.sleep.totalMin).map((m) => m / 60);
  const avgSleepH = mean(sleepH);
  const sleepCv =
    avgSleepH && sleepH.length > 2
      ? Math.sqrt(mean(sleepH.map((h) => (h - avgSleepH) ** 2)) ?? 0) / avgSleepH
      : null;

  // Strength work is deliberately excluded here. Everfit writes gym sessions
  // into Apple Health as "Cross Training", so counting anything long enough as
  // cardio would score a squat session as aerobic training.
  const cardio = workouts.filter(isCardioWorkout);
  const cardioMinutes = cardio.reduce((a, x) => a + (x.durationMin ?? 0), 0);
  const cardioDistanceKm = cardio.reduce((a, x) => a + (x.distanceKm ?? 0), 0);

  const volumeKg = lifts.reduce((a, l) => a + l.volumeKg, 0);
  const liftDates = new Set(lifts.map((l) => l.performedOn.slice(0, 10)));

  // A strength day is one with lifts written down or a strength workout synced.
  // Counting the union means the score does not depend on which app recorded it.
  const strengthDates = new Set<string>(liftDates);
  for (const w of workouts.filter(isStrengthWorkout)) {
    strengthDates.add(w.startedAt.slice(0, 10));
  }

  // Progression: of the exercises trained in this window, how many matched or
  // beat their best set from before it. An exercise with no earlier history is
  // left out rather than counted as a win.
  const bestBefore = new Map<string, number>();
  for (const l of src.lifts) {
    if (new Date(l.performedOn).getTime() >= w.from) continue;
    bestBefore.set(l.exercise, Math.max(bestBefore.get(l.exercise) ?? 0, l.topSetKg));
  }
  const bestNow = new Map<string, number>();
  for (const l of lifts) bestNow.set(l.exercise, Math.max(bestNow.get(l.exercise) ?? 0, l.topSetKg));
  const comparable = [...bestNow.entries()].filter(([name]) => bestBefore.has(name));
  const progressedShare = comparable.length
    ? comparable.filter(([name, kg]) => kg >= (bestBefore.get(name) ?? 0)).length / comparable.length
    : null;

  const sessions = sessionDatesIn(lifts, workouts);
  const sorted = [...sessions].sort();
  let longestGapDays: number | null = null;
  if (sorted.length) {
    const marks = [w.from, ...sorted.map((d) => new Date(d).getTime()), w.to];
    longestGapDays = Math.max(...marks.slice(1).map((t, i) => (t - marks[i]) / DAY));
  }

  const dayKeys = new Set(days.map((d) => d.date.slice(0, 10)));
  const restDays = [...dayKeys].filter((d) => !sessions.has(d)).length;

  return {
    window: w,
    weeks,
    days,
    lifts,
    workouts,
    weighIns,

    avgSteps: mean(steps),
    avgExerciseMin: mean(exerciseMin),
    activeDays: steps.filter((v) => v >= TARGETS.stepGoal * 0.8).length,

    nutritionDays: calDays.length,
    avgCalories: mean(calDays),
    avgProtein: mean(proteinDays),
    calOnTarget,
    proteinOnTarget,

    avgSleepH,
    sleepCv,
    avgRestingHr: mean(pick((d) => d.heart.restingHr)),
    avgHrv: mean(pick((d) => d.heart.hrvMs)),
    restDays,

    cardioMinutes,
    cardioDistanceKm,
    vo2: pick((d) => d.heart.vo2Max).slice(-1)[0] ?? null,

    volumeKg,
    liftSessionDays: liftDates.size,
    progressedShare,
    strengthSessionDays: strengthDates.size,

    sessionDays: sessions.size,
    // Never zero: a single-day window would otherwise divide by it, and
    // "1 of 0 planned" is not a sentence.
    plannedSessions: Math.max(1, Math.round((w.spanDays / 7) * TARGETS.sessionsPerWeek)),
    longestGapDays,
  };
}

/* ── the six scores ──────────────────────────────────────────────────────── */

export function scoreDimension(d: Dimension, s: WindowStats, base: Baseline): number | null {
  switch (d) {
    case 'Activity':
      return blend([
        { value: s.avgSteps === null ? null : clamp01(s.avgSteps / TARGETS.stepGoal), weight: 0.65 },
        {
          value: s.avgExerciseMin === null
            ? null
            : clamp01(s.avgExerciseMin / TARGETS.exerciseMinutesPerDay),
          weight: 0.35,
        },
      ]);

    case 'Nutrition': {
      const logged = s.nutritionDays;
      return blend([
        { value: logged ? s.calOnTarget / logged : null, weight: 0.4 },
        { value: logged ? s.proteinOnTarget / logged : null, weight: 0.4 },
        { value: logged ? clamp01(logged / s.window.spanDays) : null, weight: 0.2 },
      ]);
    }

    case 'Recovery':
      return blend([
        {
          value: s.avgSleepH === null ? null : clamp01(s.avgSleepH / TARGETS.sleepTargetH),
          weight: 0.4,
        },
        { value: s.sleepCv === null ? null : clamp01(1 - s.sleepCv / 0.25), weight: 0.2 },
        {
          // Five beats below the personal baseline scores full marks, five above
          // scores nothing — resting heart rate only means anything relative to
          // the person it was measured on.
          value: s.avgRestingHr === null || base.restingHr === null
            ? null
            : clamp01((base.restingHr + 5 - s.avgRestingHr) / 10),
          weight: 0.2,
        },
        {
          value: s.avgHrv === null || !base.hrv
            ? null
            : clamp01((s.avgHrv - base.hrv * 0.85) / (base.hrv * 0.3)),
          weight: 0.2,
        },
      ]);

    case 'Cardio':
      return blend([
        {
          value: s.workouts.length
            ? clamp01(s.cardioMinutes / s.weeks / TARGETS.cardioMinutesPerWeek)
            : null,
          weight: 0.6,
        },
        { value: s.vo2 === null ? null : clamp01((s.vo2 - 25) / 20), weight: 0.4 },
      ]);

    case 'Strength':
      // Volume and progression need a lift log. When the training is recorded in
      // a coaching app instead, sets and loads never reach this project — but the
      // sessions do, so frequency carries the score rather than the dimension
      // going blank on somebody who trains three times a week.
      return blend([
        {
          value: s.lifts.length ? clamp01(s.volumeKg / s.weeks / TARGETS.weeklyVolumeKg) : null,
          weight: 0.4,
        },
        { value: s.progressedShare, weight: 0.35 },
        {
          value: s.strengthSessionDays || s.workouts.length
            ? clamp01(s.strengthSessionDays / s.weeks / TARGETS.sessionsPerWeek)
            : null,
          weight: 0.25,
        },
      ]);

    case 'Consistency':
      return blend([
        {
          value: s.plannedSessions ? clamp01(s.sessionDays / s.plannedSessions) : null,
          weight: 0.7,
        },
        {
          // Three days between sessions is a normal rest gap; ten days is a lapse.
          value: s.longestGapDays === null
            ? null
            : clamp01(1 - Math.max(0, s.longestGapDays - 3) / 7),
          weight: 0.3,
        },
      ]);
  }
}

export type DimensionRow = { label: Dimension; score: number | null; prev: number | null };

export function scoreAll(now: WindowStats, prev: WindowStats, base: Baseline): DimensionRow[] {
  return DIMENSIONS.map((label) => ({
    label,
    score: scoreDimension(label, now, base),
    prev: scoreDimension(label, prev, base),
  }));
}

/** The headline number: the mean of whichever dimensions could be scored. */
export function overallScore(rows: DimensionRow[], key: 'score' | 'prev' = 'score'): number | null {
  const live = rows.map((r) => r[key]).filter((v): v is number => v !== null);
  return live.length ? Math.round(mean(live) as number) : null;
}

export { DAY, clamp01, mean, iso };
