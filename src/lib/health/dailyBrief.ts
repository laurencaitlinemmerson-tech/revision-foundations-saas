import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FITNESS_FALLBACK_TYPE } from '@/lib/operatorFitnessStorage';
import { isPlausibleWeightKg } from '@/lib/fitnessValidation';
import { computeTdee } from '@/lib/fitness/tdee';
import { detectPlateau, plateauSuggestion, type Plateau } from '@/lib/fitness/plateau';
import { fitReadings, type Reading } from '@/lib/fitness/regression';
import { tdeeRealityCheck, driftCopy, type RealityCheck } from '@/lib/fitness/tdeeRealityCheck';

/**
 * Daily health brief — the whole picture, assembled server-side.
 *
 * Everything the morning email could possibly want, already reconciled:
 * yesterday's day against its own 7- and 28-day baselines, the weigh-in trend
 * with a real regression behind it, energy balance, and an honest account of
 * what is missing. The email writer's job is voice, not arithmetic — so no
 * consumer of this payload should ever have to divide, average or compare.
 *
 * Two rules the rest of the file keeps:
 *   1. A metric that was never recorded is `null`, never 0. Apple Health writes
 *      real zeroes (a day with no steps is 0 steps), so conflating the two
 *      would let a missing sync read as a lazy day.
 *   2. Anything derived carries the basis it was derived from, so the email can
 *      say "against your 28-day average" rather than implying a fixed target.
 */

const DAY_MS = 86_400_000;
const TIMEZONE = 'Europe/London';

/* Sleep stage minutes below this are the sync writing fragments rather than a
   night — Health Auto Export sometimes sends a handful of stage samples with no
   session behind them. Reporting "you slept 8 minutes" would be worse than
   admitting the number is not trustworthy. */
const MIN_CREDIBLE_SLEEP_MIN = 120;

type MetricRow = Record<string, unknown>;

export interface BriefDay {
  date: string;
  weekday: string;
  activity: {
    steps: number | null;
    activeEnergyKcal: number | null;
    exerciseMinutes: number | null;
    standHours: number | null;
    distanceKm: number | null;
  };
  heart: {
    restingHr: number | null;
    hrvMs: number | null;
    walkingHrAvg: number | null;
    vo2Max: number | null;
  };
  sleep: {
    totalMin: number | null;
    inBedMin: number | null;
    remMin: number | null;
    deepMin: number | null;
    coreMin: number | null;
    awakeMin: number | null;
    /** False when the stage data is too thin to be a real night. */
    reliable: boolean;
  };
  nutrition: {
    dietaryEnergyKcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    fatG: number | null;
    fiberG: number | null;
    sugarG: number | null;
    waterMl: number | null;
  };
  cycle: { flow: number | null };
}

export interface Averages {
  days: number;
  steps: number | null;
  activeEnergyKcal: number | null;
  exerciseMinutes: number | null;
  standHours: number | null;
  distanceKm: number | null;
  restingHr: number | null;
  hrvMs: number | null;
  sleepTotalMin: number | null;
  dietaryEnergyKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  sugarG: number | null;
  waterMl: number | null;
}

export type Cue = { kind: 'win' | 'watch' | 'gap'; text: string };

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Smart-scale fields write 0 for "not measured" — treat that as missing. */
function positive(value: unknown): number | null {
  const n = num(value);
  return n !== null && n > 0 ? n : null;
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function isoDay(value: string) {
  return value.slice(0, 10);
}

export function todayInLondon(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(now);
}

function weekdayOf(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long' })
    .format(new Date(`${isoDate}T12:00:00Z`));
}

function shiftDay(isoDate: string, deltaDays: number) {
  return new Date(new Date(`${isoDate}T12:00:00Z`).getTime() + deltaDays * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

function daysBetween(fromIso: string, toIso: string) {
  return Math.round(
    (new Date(`${toIso}T12:00:00Z`).getTime() - new Date(`${fromIso}T12:00:00Z`).getTime()) / DAY_MS,
  );
}

function mean(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function toBriefDay(row: MetricRow): BriefDay {
  const date = isoDay(String(row.date));
  const rem = num(row.sleep_rem_min);
  const deep = num(row.sleep_deep_min);
  const core = num(row.sleep_core_min);
  const stageSum = [rem, deep, core].some((v) => v !== null)
    ? [rem, deep, core].reduce<number>((a, v) => a + (v ?? 0), 0)
    : null;
  const totalMin = num(row.sleep_total_min) ?? stageSum;

  return {
    date,
    weekday: weekdayOf(date),
    activity: {
      steps: num(row.steps),
      activeEnergyKcal: num(row.active_energy_kcal),
      exerciseMinutes: num(row.exercise_minutes),
      standHours: num(row.stand_hours),
      distanceKm: num(row.distance_km),
    },
    heart: {
      restingHr: num(row.resting_hr),
      hrvMs: num(row.hrv_ms),
      walkingHrAvg: num(row.walking_hr_avg),
      vo2Max: num(row.vo2_max),
    },
    sleep: {
      totalMin,
      inBedMin: num(row.sleep_in_bed_min),
      remMin: rem,
      deepMin: deep,
      coreMin: core,
      awakeMin: num(row.sleep_awake_min),
      reliable: totalMin !== null && totalMin >= MIN_CREDIBLE_SLEEP_MIN,
    },
    nutrition: {
      dietaryEnergyKcal: num(row.dietary_energy_kcal),
      proteinG: num(row.protein_g),
      carbsG: num(row.carbs_g),
      fatG: num(row.fat_g),
      fiberG: num(row.fiber_g),
      sugarG: num(row.sugar_g),
      waterMl: num(row.water_ml),
    },
    cycle: { flow: num(row.menstrual_flow) },
  };
}

function averagesOf(days: BriefDay[]): Averages {
  const pick = (fn: (d: BriefDay) => number | null) =>
    days.map(fn).filter((v): v is number => v !== null);
  const avg = (fn: (d: BriefDay) => number | null, digits = 1) => {
    const m = mean(pick(fn));
    return m === null ? null : round(m, digits);
  };

  return {
    days: days.length,
    steps: avg((d) => d.activity.steps, 0),
    activeEnergyKcal: avg((d) => d.activity.activeEnergyKcal, 0),
    exerciseMinutes: avg((d) => d.activity.exerciseMinutes, 0),
    standHours: avg((d) => d.activity.standHours, 1),
    distanceKm: avg((d) => d.activity.distanceKm, 2),
    restingHr: avg((d) => d.heart.restingHr, 0),
    hrvMs: avg((d) => d.heart.hrvMs, 1),
    sleepTotalMin: avg((d) => (d.sleep.reliable ? d.sleep.totalMin : null), 0),
    dietaryEnergyKcal: avg((d) => d.nutrition.dietaryEnergyKcal, 0),
    proteinG: avg((d) => d.nutrition.proteinG, 0),
    carbsG: avg((d) => d.nutrition.carbsG, 0),
    fatG: avg((d) => d.nutrition.fatG, 0),
    fiberG: avg((d) => d.nutrition.fiberG, 1),
    sugarG: avg((d) => d.nutrition.sugarG, 1),
    waterMl: avg((d) => d.nutrition.waterMl, 0),
  };
}

function delta(value: number | null, baseline: number | null, digits = 1) {
  if (value === null || baseline === null) return null;
  return round(value - baseline, digits);
}

/* ── The weekly admin rota ──────────────────────────────────────────────────
   One small piece of upkeep per day so nothing lands all at once. Edit this
   table to change what the morning email nudges about — nothing else reads it. */
const WEEKLY_ADMIN: Record<string, { theme: string; items: string[] }> = {
  Monday: {
    theme: 'Week reset',
    items: [
      'Pick the training days for this week and put them somewhere visible',
      'Name one non-negotiable for the week — just one',
    ],
  },
  Tuesday: {
    theme: 'Protein check',
    items: [
      'Look at where protein actually landed the last few days',
      'Line up an easy high-protein option for the day you know will be busy',
    ],
  },
  Wednesday: {
    theme: 'Movement check',
    items: [
      'Midweek step check — a walk today is worth more than a big weekend catch-up',
      'If steps have been low, put a short walk in the diary rather than hoping',
    ],
  },
  Thursday: {
    theme: 'Sleep check',
    items: [
      'Set the wind-down time for tonight and actually honour it',
      'Screens away earlier than feels necessary',
    ],
  },
  Friday: {
    theme: 'Food prep look-ahead',
    items: [
      'Glance at the weekend — where are meals coming from?',
      'Defrost or prep one thing now so Saturday is not a scramble',
    ],
  },
  Saturday: {
    theme: 'Supplements and hydration',
    items: [
      'Check protein powder and vitamins — anything low goes on the shopping list today',
      'Honest look at the week’s water intake; fill a big bottle and sip through the day',
    ],
  },
  Sunday: {
    theme: 'Weekly review',
    items: [
      'Zoom out on the weight trend — the line, not the last number',
      'Photos or measurements if it is that kind of Sunday, then plan the week ahead',
    ],
  },
};

export interface WeighInView {
  lastDate: string | null;
  daysSince: number | null;
  dueToday: boolean;
  weightKg: number | null;
  bmi: number | null;
  bodyFatPct: number | null;
  muscleMassPct: number | null;
  changeSinceLastKg: number | null;
  change7dKg: number | null;
  /** Actual days spanned by change7dKg — weighing is not daily, so it is rarely exactly 7. */
  change7dSpanDays: number | null;
  change28dKg: number | null;
  /** Actual days spanned by change28dKg. */
  change28dSpanDays: number | null;
  /** Regression slope over the last 28 days, in kg/week. Negative = losing. */
  trendKgPerWeek: number | null;
  trendR2: number | null;
  trendConfidence: 'firm' | 'loose' | 'unknown';
  plateau: (Plateau & { suggestion: string | null }) | null;
  readings28d: Reading[];
}

function buildWeighIn(readings: Reading[], today: string, currentIntake: number | null, tdee: number | null): WeighInView {
  const sorted = [...readings].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1] ?? null;
  const lastDate = latest ? isoDay(latest.date) : null;
  const daysSince = lastDate ? daysBetween(lastDate, today) : null;

  const at = (targetIso: string, toleranceDays: number) => {
    /* Nearest reading on or before the target day — weighing is not daily, so
       "7 days ago" has to mean the last reading by then, not an exact match.
       The tolerance matters: without it, a fortnight away from the scale would
       have "change over 7 days" quietly comparing against a three-week-old
       number and reporting it as a week's work. */
    const candidates = sorted.filter((r) => isoDay(r.date) <= targetIso);
    const nearest = candidates[candidates.length - 1] ?? null;
    if (!nearest) return null;
    return daysBetween(isoDay(nearest.date), targetIso) <= toleranceDays ? nearest : null;
  };

  const previous = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const sevenAgo = at(shiftDay(today, -7), 4);
  const twentyEightAgo = at(shiftDay(today, -28), 10);

  const window28 = sorted.filter((r) => daysBetween(isoDay(r.date), today) <= 28);
  const fit = window28.length >= 2 ? fitReadings(window28) : null;
  const plateauHit = detectPlateau(sorted);

  return {
    lastDate,
    daysSince,
    dueToday: daysSince === null || daysSince >= 1,
    weightKg: latest ? round(latest.weight, 2) : null,
    bmi: null,
    bodyFatPct: null,
    muscleMassPct: null,
    changeSinceLastKg: latest && previous ? round(latest.weight - previous.weight, 2) : null,
    change7dKg: latest && sevenAgo && sevenAgo !== latest ? round(latest.weight - sevenAgo.weight, 2) : null,
    change7dSpanDays:
      latest && sevenAgo && sevenAgo !== latest
        ? daysBetween(isoDay(sevenAgo.date), isoDay(latest.date))
        : null,
    change28dKg:
      latest && twentyEightAgo && twentyEightAgo !== latest
        ? round(latest.weight - twentyEightAgo.weight, 2)
        : null,
    change28dSpanDays:
      latest && twentyEightAgo && twentyEightAgo !== latest
        ? daysBetween(isoDay(twentyEightAgo.date), isoDay(latest.date))
        : null,
    trendKgPerWeek: fit ? round(fit.slope * 7, 2) : null,
    trendR2: fit ? round(fit.r2, 2) : null,
    trendConfidence: fit ? (fit.r2 >= 0.5 ? 'firm' : 'loose') : 'unknown',
    plateau: plateauHit
      ? {
          ...plateauHit,
          suggestion:
            currentIntake !== null && tdee !== null
              ? plateauSuggestion(plateauHit, currentIntake, tdee)
              : null,
        }
      : null,
    readings28d: window28.map((r) => ({ date: isoDay(r.date), weight: round(r.weight, 2) })),
  };
}

export interface EnergyView {
  bmr: number | null;
  tdee: number | null;
  targetIntakeKcal: number | null;
  goalWeeklyLossKg: number;
  exerciseSource: 'measured' | 'planned' | null;
  confidence: number | null;
  intakeYesterdayKcal: number | null;
  balanceYesterdayKcal: number | null;
  avgIntake7dKcal: number | null;
  avgBalance7dKcal: number | null;
  realityCheck: (RealityCheck & { copy: string }) | null;
}

export interface ProteinView {
  targetG: number | null;
  /** How the target was derived, so the email can say it out loud. */
  basis: 'fat-free-mass' | 'body-weight' | null;
  yesterdayG: number | null;
  avg7dG: number | null;
  hitYesterday: boolean | null;
}

/* Protein in a deficit is set off fat-free mass where body composition is
   known — 2.2 g/kg FFM — because g/kg of total body weight overshoots badly at
   higher body fat and would have the email nagging about a target that was
   never the right one. Without a body-fat reading it falls back to 1.4 g/kg. */
const PROTEIN_G_PER_KG_FFM = 2.2;
const PROTEIN_G_PER_KG_BODYWEIGHT = 1.4;

function buildProtein(
  weightKg: number | null,
  bodyFatPct: number | null,
  yesterdayG: number | null,
  avg7dG: number | null,
): ProteinView {
  let targetG: number | null = null;
  let basis: ProteinView['basis'] = null;

  if (weightKg !== null && bodyFatPct !== null && bodyFatPct > 0 && bodyFatPct < 70) {
    targetG = Math.round(weightKg * (1 - bodyFatPct / 100) * PROTEIN_G_PER_KG_FFM);
    basis = 'fat-free-mass';
  } else if (weightKg !== null) {
    targetG = Math.round(weightKg * PROTEIN_G_PER_KG_BODYWEIGHT);
    basis = 'body-weight';
  }

  return {
    targetG,
    basis,
    yesterdayG,
    avg7dG,
    hitYesterday: targetG !== null && yesterdayG !== null ? yesterdayG >= targetG : null,
  };
}

export interface CycleView {
  lastFlowDate: string | null;
  daysSinceFlow: number | null;
  flowYesterday: number | null;
  /** Only ever a hint — one cycle of data is not a prediction. */
  note: string | null;
  tracked: boolean;
}

function buildCycle(days: BriefDay[], today: string, yesterday: BriefDay | null): CycleView {
  const flowDays = days.filter((d) => (d.cycle.flow ?? 0) > 0);
  const lastFlow = flowDays[flowDays.length - 1] ?? null;

  if (!lastFlow) {
    return {
      lastFlowDate: null,
      daysSinceFlow: null,
      flowYesterday: yesterday?.cycle.flow ?? null,
      note: null,
      tracked: false,
    };
  }

  const daysSince = daysBetween(lastFlow.date, today);
  return {
    lastFlowDate: lastFlow.date,
    daysSinceFlow: daysSince,
    flowYesterday: yesterday?.cycle.flow ?? null,
    note:
      daysSince >= 18 && daysSince <= 32
        ? 'Late-cycle window — water retention here is normal and reads as weight on the scale. Worth naming before the number is.'
        : null,
    tracked: true,
  };
}

export interface DailyBrief {
  generatedAt: string;
  timezone: string;
  today: { date: string; weekday: string };
  /** The day the email is actually about — yesterday, fully synced. */
  subject: BriefDay | null;
  freshness: {
    lastSyncedDate: string | null;
    daysStale: number | null;
    healthy: boolean;
    note: string | null;
  };
  averages: { last7: Averages; previous7: Averages; last28: Averages };
  deltas: {
    /** Yesterday against the 7-day average that precedes it. */
    vs7d: Partial<Record<keyof Averages, number | null>>;
    /** This week's average against the week before it. */
    weekOverWeek: Partial<Record<keyof Averages, number | null>>;
  };
  weighIn: WeighInView;
  energy: EnergyView;
  protein: ProteinView;
  cycle: CycleView;
  admin: { weekday: string; theme: string; items: string[] };
  weekly: WeeklyOverview;
  workouts: WorkoutView[];
  cues: Cue[];
  history: BriefDay[];
}

export interface WorkoutView {
  startedAt: string;
  date: string;
  type: string | null;
  durationMin: number | null;
  energyKcal: number | null;
  avgHr: number | null;
  distanceKm: number | null;
}

function buildCues(
  subject: BriefDay | null,
  last7: Averages,
  previous7: Averages,
  last28: Averages,
  weighIn: WeighInView,
  energy: EnergyView,
  protein: ProteinView,
  freshnessHealthy: boolean,
  realityCheckRejected: boolean,
): Cue[] {
  const cues: Cue[] = [];

  if (!freshnessHealthy) {
    cues.push({ kind: 'gap', text: 'Health data has not synced for a couple of days — open Health Auto Export on the phone.' });
  }

  /* Wins first: the email should have something true and good to open with,
     and these are the comparisons that are actually earned rather than flattering. */
  if (weighIn.trendKgPerWeek !== null && weighIn.trendKgPerWeek < -0.1) {
    cues.push({
      kind: 'win',
      text: `The 28-day trend is down ${Math.abs(weighIn.trendKgPerWeek)} kg/week — that is the line moving, whatever today's number says.`,
    });
  }
  if (protein.hitYesterday) {
    cues.push({ kind: 'win', text: `Protein target hit yesterday (${protein.yesterdayG} g against ${protein.targetG} g).` });
  }
  if (subject?.activity.steps !== null && subject?.activity.steps !== undefined && last28.steps !== null && subject.activity.steps > last28.steps * 1.2) {
    cues.push({ kind: 'win', text: `Steps ran well above the 28-day average yesterday (${subject.activity.steps} vs ${last28.steps}).` });
  }
  if (last7.exerciseMinutes !== null && previous7.exerciseMinutes !== null && last7.exerciseMinutes > previous7.exerciseMinutes + 5) {
    cues.push({ kind: 'win', text: 'Training minutes are up on last week.' });
  }

  /* Things worth a gentle mention — never more than a nudge. */
  if (weighIn.daysSince !== null && weighIn.daysSince >= 3) {
    cues.push({ kind: 'watch', text: `No weigh-in for ${weighIn.daysSince} days — the trend needs points to draw a line through.` });
  }
  if (weighIn.plateau) {
    cues.push({
      kind: 'watch',
      text: weighIn.plateau.suggestion ?? `Flat for ${weighIn.plateau.days} days — normal, and usually a signal to change one lever rather than everything.`,
    });
  }
  if (subject?.heart.restingHr !== null && subject?.heart.restingHr !== undefined && last28.restingHr !== null && subject.heart.restingHr > last28.restingHr + 5) {
    cues.push({
      kind: 'watch',
      text: `Resting HR was ${subject.heart.restingHr} against a 28-day baseline of ${last28.restingHr} — often a sign of poor sleep, a hard session or something brewing.`,
    });
  }
  if (subject?.heart.hrvMs !== null && subject?.heart.hrvMs !== undefined && last28.hrvMs !== null && subject.heart.hrvMs < last28.hrvMs * 0.7) {
    cues.push({ kind: 'watch', text: `HRV was well below baseline (${subject.heart.hrvMs} vs ${last28.hrvMs} ms) — a lighter day would not be a failure.` });
  }
  if (protein.hitYesterday === false && protein.targetG !== null) {
    cues.push({ kind: 'watch', text: `Protein came in at ${protein.yesterdayG ?? 0} g against ${protein.targetG} g.` });
  }
  if (subject?.nutrition.fiberG !== null && subject?.nutrition.fiberG !== undefined && subject.nutrition.fiberG < 15) {
    cues.push({ kind: 'watch', text: `Fibre was low yesterday (${subject.nutrition.fiberG} g).` });
  }
  if (energy.realityCheck?.significant) {
    cues.push({ kind: 'watch', text: energy.realityCheck.copy });
  }

  /* An upward trend gets named, never buried — but named with its most likely
     causes attached, because "you gained weight" on its own is the sentence
     that makes someone stop reading their own data. */
  if (weighIn.trendKgPerWeek !== null && weighIn.trendKgPerWeek > 0.1) {
    cues.push({
      kind: 'watch',
      text: `The 28-day line is up ${weighIn.trendKgPerWeek} kg/week. Worth a calm look rather than a verdict — water, cycle, glycogen from training and salt all move the scale on this timescale.`,
    });
  }

  /* A steady logged deficit alongside a rising scale is the single most useful
     thing this brief can surface: it is either water, or the food log is
     drifting from what was actually eaten. Both are fixable, neither is a
     failure — and it is a fortnight's question, not this morning's. */
  if (
    energy.avgBalance7dKcal !== null &&
    energy.avgBalance7dKcal < -300 &&
    weighIn.trendKgPerWeek !== null &&
    weighIn.trendKgPerWeek > 0.1
  ) {
    cues.push({
      kind: 'watch',
      text: `Logged intake averages ${Math.abs(energy.avgBalance7dKcal)} kcal/day under estimated maintenance while the scale trends up — usually water retention or a food log that has drifted from what was actually eaten. Give it another week of honest logging before changing anything.`,
    });
  }

  if (realityCheckRejected) {
    cues.push({
      kind: 'gap',
      text: 'The measured-maintenance calculation returned an impossible figure this week (short-term water swings distort it) — it has been suppressed. Do not quote a maintenance or suggested-intake number.',
    });
  }

  /* Gaps, so the email never invents a number it does not have. */
  if (last7.waterMl === null) {
    cues.push({ kind: 'gap', text: 'Water is not syncing from Apple Health — hydration can be nudged but not measured.' });
  }
  if (subject && !subject.sleep.reliable) {
    cues.push({ kind: 'gap', text: 'Sleep data for the night is too thin to report — do not quote a sleep figure.' });
  }
  if (subject?.nutrition.dietaryEnergyKcal === null) {
    cues.push({ kind: 'gap', text: 'No food logged yesterday, so energy balance is unknown for the day.' });
  }

  return cues;
}


export interface WeeklyTotals {
  steps: number | null;
  activeEnergyKcal: number | null;
  exerciseMinutes: number | null;
  distanceKm: number | null;
  dietaryEnergyKcal: number | null;
}

export interface WeeklyOverview {
  from: string;
  to: string;
  totals: WeeklyTotals;
  previousTotals: WeeklyTotals;
  /* Counts, not averages. "Four days out of seven" is a fact you can act on;
     "5.8 average stand hours" is not. */
  consistency: {
    daysWithData: number;
    daysFoodLogged: number;
    daysProteinTargetHit: number | null;
    daysSteps8k: number;
    daysTrained: number;
    daysWeighed: number;
  };
  weight: {
    startKg: number | null;
    endKg: number | null;
    changeKg: number | null;
    trendKgPerWeek: number | null;
  };
  bestStepDay: { date: string; weekday: string; steps: number } | null;
  quietestStepDay: { date: string; weekday: string; steps: number } | null;
}

function sumOf(days: BriefDay[], pick: (d: BriefDay) => number | null): number | null {
  const values = days.map(pick).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0));
}

function totalsOf(days: BriefDay[]): WeeklyTotals {
  return {
    steps: sumOf(days, (d) => d.activity.steps),
    activeEnergyKcal: sumOf(days, (d) => d.activity.activeEnergyKcal),
    exerciseMinutes: sumOf(days, (d) => d.activity.exerciseMinutes),
    distanceKm: sumOf(days, (d) => d.activity.distanceKm),
    dietaryEnergyKcal: sumOf(days, (d) => d.nutrition.dietaryEnergyKcal),
  };
}

function buildWeekly(
  weekDays: BriefDay[],
  previousDays: BriefDay[],
  readings: Reading[],
  proteinTargetG: number | null,
  anchor: string,
): WeeklyOverview {
  const from = shiftDay(anchor, -6);
  const stepDays = weekDays
    .filter((d) => d.activity.steps !== null)
    .sort((a, b) => (b.activity.steps ?? 0) - (a.activity.steps ?? 0));

  const weekReadings = readings.filter((r) => isoDay(r.date) >= from && isoDay(r.date) <= anchor);
  const fit = weekReadings.length >= 2 ? fitReadings(weekReadings) : null;
  const first = weekReadings[0] ?? null;
  const last = weekReadings[weekReadings.length - 1] ?? null;

  return {
    from,
    to: anchor,
    totals: totalsOf(weekDays),
    previousTotals: totalsOf(previousDays),
    consistency: {
      daysWithData: weekDays.length,
      daysFoodLogged: weekDays.filter((d) => (d.nutrition.dietaryEnergyKcal ?? 0) > 0).length,
      daysProteinTargetHit:
        proteinTargetG === null
          ? null
          : weekDays.filter((d) => (d.nutrition.proteinG ?? 0) >= proteinTargetG).length,
      daysSteps8k: weekDays.filter((d) => (d.activity.steps ?? 0) >= 8000).length,
      daysTrained: weekDays.filter((d) => (d.activity.exerciseMinutes ?? 0) >= 20).length,
      daysWeighed: weekReadings.length,
    },
    weight: {
      startKg: first ? round(first.weight, 2) : null,
      endKg: last ? round(last.weight, 2) : null,
      changeKg: first && last && first !== last ? round(last.weight - first.weight, 2) : null,
      trendKgPerWeek: fit ? round(fit.slope * 7, 2) : null,
    },
    bestStepDay: stepDays[0]
      ? { date: stepDays[0].date, weekday: stepDays[0].weekday, steps: stepDays[0].activity.steps as number }
      : null,
    quietestStepDay: stepDays.length > 1
      ? {
          date: stepDays[stepDays.length - 1].date,
          weekday: stepDays[stepDays.length - 1].weekday,
          steps: stepDays[stepDays.length - 1].activity.steps as number,
        }
      : null,
  };
}

/* The weigh-in fallback stores readings as pseudo-workouts; they are not
   training and must never appear in the training section. */


export interface BuildBriefOptions {
  /** Overrides "today" — only used for testing and backfills. */
  today?: string;
  /** Target weekly weight change in kg. Positive = loss. */
  goalWeeklyLossKg?: number;
  /** How many days of raw history to return in `history`. */
  historyDays?: number;
}

export async function buildDailyBrief(options: BuildBriefOptions = {}): Promise<DailyBrief> {
  const today = options.today ?? todayInLondon();
  const goalWeeklyLossKg = options.goalWeeklyLossKg ?? 0.5;
  const historyDays = Math.min(Math.max(options.historyDays ?? 14, 1), 120);
  const windowStart = shiftDay(today, -120);

  const [metricsRes, readingsRes, workoutsRes] = await Promise.all([
    supabaseAdmin
      .from('operator_daily_metrics')
      .select('*')
      .gte('date', windowStart)
      .order('date', { ascending: true }),
    supabaseAdmin
      .from('operator_fitness_readings')
      .select('date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
      .order('date', { ascending: true }),
    supabaseAdmin
      .from('operator_workouts')
      .select('started_at, type, duration_min, energy_kcal, avg_hr, distance_km')
      .gte('started_at', `${shiftDay(today, -14)}T00:00:00.000Z`)
      .order('started_at', { ascending: false }),
  ]);

  const days = (metricsRes.data ?? []).map((row) => toBriefDay(row as MetricRow));
  const byDate = new Map(days.map((d) => [d.date, d]));

  const rawReadings = (readingsRes.data ?? [])
    .map((row) => {
      const r = row as MetricRow;
      return {
        date: isoDay(String(r.date)),
        weight: num(r.weight) ?? NaN,
        bmi: positive(r.bmi),
        bodyFat: positive(r.body_fat),
        muscleMass: positive(r.muscle_mass),
      };
    })
    .filter((r) => isPlausibleWeightKg(r.weight))
    .sort((a, b) => a.date.localeCompare(b.date));

  /* Historic rows are stored twice per date (every reading before 2026-07 has a
     duplicate), which would double-weight those days in the regression and make
     "change since last weigh-in" read as 0.00 kg against its own twin. Keep the
     last row for each date and let the trend see one point per day. */
  const readings = Array.from(
    new Map(rawReadings.map((r) => [r.date, r])).values(),
  ).sort((a, b) => a.date.localeCompare(b.date));

  const workouts: WorkoutView[] = (workoutsRes.data ?? [])
    .map((row) => {
      const r = row as MetricRow;
      const startedAt = String(r.started_at);
      return {
        startedAt,
        date: isoDay(startedAt),
        type: (r.type as string | null) ?? null,
        durationMin: num(r.duration_min),
        energyKcal: num(r.energy_kcal),
        avgHr: num(r.avg_hr),
        distanceKm: num(r.distance_km),
      };
    })
    .filter((w) => w.type !== FITNESS_FALLBACK_TYPE);

  /* Everything is anchored on the day the email is about — yesterday when it
     has synced, otherwise the last day that did. Anchoring on "today" instead
     would let a half-finished morning drag every average down. */
  const yesterday = shiftDay(today, -1);
  const lastSyncedDate = days.length > 0 ? days[days.length - 1].date : null;
  const subject = byDate.get(yesterday) ?? (lastSyncedDate ? byDate.get(lastSyncedDate) ?? null : null);
  const anchor = subject?.date ?? yesterday;

  const inWindow = (from: string, to: string) =>
    days.filter((d) => d.date >= from && d.date <= to);

  const last7 = averagesOf(inWindow(shiftDay(anchor, -6), anchor));
  const previous7 = averagesOf(inWindow(shiftDay(anchor, -13), shiftDay(anchor, -7)));
  const last28 = averagesOf(inWindow(shiftDay(anchor, -27), anchor));

  const latestReading = readings[readings.length - 1] ?? null;
  const intakeYesterday = subject?.nutrition.dietaryEnergyKcal ?? null;

  const proteinShare =
    intakeYesterday && intakeYesterday > 0 && subject?.nutrition.proteinG
      ? Math.min(0.6, (subject.nutrition.proteinG * 4) / intakeYesterday)
      : undefined;

  const tdeeBreakdown = latestReading
    ? computeTdee({
        weightKg: latestReading.weight,
        measuredExerciseKcal: last7.activeEnergyKcal,
        intakeKcal: intakeYesterday,
        proteinShare,
        weeklyChangeKg: goalWeeklyLossKg,
      })
    : null;

  const weighIn = buildWeighIn(
    readings.map((r) => ({ date: r.date, weight: r.weight })),
    today,
    intakeYesterday,
    tdeeBreakdown?.tdee ?? null,
  );
  weighIn.bmi = latestReading?.bmi ?? null;
  weighIn.bodyFatPct = latestReading?.bodyFat ?? null;
  weighIn.muscleMassPct = latestReading?.muscleMass ?? null;

  const intakeByDate: Record<string, number> = {};
  for (const day of days) {
    if (day.nutrition.dietaryEnergyKcal !== null && day.nutrition.dietaryEnergyKcal > 0) {
      intakeByDate[day.date] = day.nutrition.dietaryEnergyKcal;
    }
  }

  const rawRealityCheck = tdeeBreakdown
    ? tdeeRealityCheck(
        weighIn.readings28d,
        intakeByDate,
        tdeeBreakdown.tdee,
        goalWeeklyLossKg,
        14,
      )
    : null;

  /* The reality check divides a two-week weight change by two weeks, so a
     couple of kilos of water read as a metabolic collapse: a real run of this
     data returned "maintenance is 866 kcal, eat 320". That number is not just
     wrong, it is the kind of wrong that does harm if a cheerful morning email
     repeats it. Anything implying maintenance at or below BMR, or an intake
     under BMR, is water noise rather than physiology — drop it and say why. */
  const realityCheck =
    rawRealityCheck &&
    tdeeBreakdown &&
    rawRealityCheck.actualTdee >= tdeeBreakdown.bmr &&
    rawRealityCheck.actualTdee <= tdeeBreakdown.bmr * 2.6 &&
    rawRealityCheck.suggestedIntake >= tdeeBreakdown.bmr
      ? rawRealityCheck
      : null;

  const realityCheckRejected = Boolean(rawRealityCheck) && !realityCheck;

  const energy: EnergyView = {
    bmr: tdeeBreakdown ? Math.round(tdeeBreakdown.bmr) : null,
    tdee: tdeeBreakdown ? Math.round(tdeeBreakdown.tdee) : null,
    targetIntakeKcal: tdeeBreakdown ? tdeeBreakdown.targetIntake : null,
    goalWeeklyLossKg,
    exerciseSource: tdeeBreakdown?.exerciseSource ?? null,
    confidence: tdeeBreakdown ? round(tdeeBreakdown.confidence, 2) : null,
    intakeYesterdayKcal: intakeYesterday,
    balanceYesterdayKcal:
      intakeYesterday !== null && tdeeBreakdown ? Math.round(intakeYesterday - tdeeBreakdown.tdee) : null,
    avgIntake7dKcal: last7.dietaryEnergyKcal,
    avgBalance7dKcal:
      last7.dietaryEnergyKcal !== null && tdeeBreakdown
        ? Math.round(last7.dietaryEnergyKcal - tdeeBreakdown.tdee)
        : null,
    realityCheck: realityCheck ? { ...realityCheck, copy: driftCopy(realityCheck) } : null,
  };

  const protein = buildProtein(
    latestReading?.weight ?? null,
    latestReading?.bodyFat ?? null,
    subject?.nutrition.proteinG ?? null,
    last7.proteinG,
  );

  const cycle = buildCycle(days, today, subject);

  const daysStale = lastSyncedDate ? daysBetween(lastSyncedDate, today) : null;
  const freshnessHealthy = daysStale !== null && daysStale <= 1;

  const deltaKeys: (keyof Averages)[] = [
    'steps', 'activeEnergyKcal', 'exerciseMinutes', 'standHours', 'distanceKm',
    'restingHr', 'hrvMs', 'sleepTotalMin', 'dietaryEnergyKcal', 'proteinG',
    'carbsG', 'fatG', 'fiberG', 'sugarG',
  ];

  const subjectValue = (key: keyof Averages): number | null => {
    if (!subject) return null;
    switch (key) {
      case 'steps': return subject.activity.steps;
      case 'activeEnergyKcal': return subject.activity.activeEnergyKcal;
      case 'exerciseMinutes': return subject.activity.exerciseMinutes;
      case 'standHours': return subject.activity.standHours;
      case 'distanceKm': return subject.activity.distanceKm;
      case 'restingHr': return subject.heart.restingHr;
      case 'hrvMs': return subject.heart.hrvMs;
      case 'sleepTotalMin': return subject.sleep.reliable ? subject.sleep.totalMin : null;
      case 'dietaryEnergyKcal': return subject.nutrition.dietaryEnergyKcal;
      case 'proteinG': return subject.nutrition.proteinG;
      case 'carbsG': return subject.nutrition.carbsG;
      case 'fatG': return subject.nutrition.fatG;
      case 'fiberG': return subject.nutrition.fiberG;
      case 'sugarG': return subject.nutrition.sugarG;
      default: return null;
    }
  };

  const vs7d: Partial<Record<keyof Averages, number | null>> = {};
  const weekOverWeek: Partial<Record<keyof Averages, number | null>> = {};
  for (const key of deltaKeys) {
    /* Compared against the week *before* the day itself, so a big day is not
       quietly averaged into its own baseline. */
    vs7d[key] = delta(subjectValue(key), previous7[key] as number | null);
    weekOverWeek[key] = delta(last7[key] as number | null, previous7[key] as number | null);
  }

  const adminEntry = WEEKLY_ADMIN[weekdayOf(today)] ?? { theme: 'Daily basics', items: [] };

  const weekly = buildWeekly(
    inWindow(shiftDay(anchor, -6), anchor),
    inWindow(shiftDay(anchor, -13), shiftDay(anchor, -7)),
    readings.map((r) => ({ date: r.date, weight: r.weight })),
    protein.targetG,
    anchor,
  );

  return {
    generatedAt: new Date().toISOString(),
    timezone: TIMEZONE,
    today: { date: today, weekday: weekdayOf(today) },
    subject,
    freshness: {
      lastSyncedDate,
      daysStale,
      healthy: freshnessHealthy,
      note: freshnessHealthy
        ? null
        : lastSyncedDate
          ? `Last sync was ${lastSyncedDate} (${daysStale} days ago) — numbers below may be stale.`
          : 'No health data found at all.',
    },
    averages: { last7, previous7, last28 },
    deltas: { vs7d, weekOverWeek },
    weighIn,
    energy,
    protein,
    cycle,
    admin: { weekday: weekdayOf(today), theme: adminEntry.theme, items: adminEntry.items },
    weekly,
    workouts,
    cues: buildCues(subject, last7, previous7, last28, weighIn, energy, protein, freshnessHealthy, realityCheckRejected),
    history: days.slice(-historyDays),
  };
}

function fmt(value: number | null, unit = '', digits?: number) {
  if (value === null) return '—';
  const shown = digits === undefined ? value : round(value, digits);
  return `${shown.toLocaleString('en-GB')}${unit}`;
}

function signed(value: number | null, unit = '') {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-GB')}${unit}`;
}

/**
 * A plain-text digest of the same payload.
 *
 * This is the version to paste into a prompt: it is the whole brief, already
 * compared and captioned, short enough to read in one go. It deliberately
 * states its own gaps so the email writer does not fill them in with guesses.
 */
export function renderBriefText(brief: DailyBrief): string {
  const s = brief.subject;
  const a7 = brief.averages.last7;
  const a28 = brief.averages.last28;
  const lines: string[] = [];

  lines.push(`HEALTH BRIEF — ${brief.today.weekday} ${brief.today.date} (${brief.timezone})`);
  lines.push(`Covering: ${s ? `${s.weekday} ${s.date}` : 'no synced day'}`);
  if (brief.freshness.note) lines.push(`! ${brief.freshness.note}`);
  lines.push('');

  lines.push('WEIGH-IN');
  const sinceLabel =
    brief.weighIn.daysSince === null
      ? 'never'
      : brief.weighIn.daysSince === 0
        ? 'today'
        : brief.weighIn.daysSince === 1
          ? 'yesterday'
          : brief.weighIn.daysSince < 0
            ? 'dated after this brief'
            : `${brief.weighIn.daysSince} days ago`;
  lines.push(`  Last: ${fmt(brief.weighIn.weightKg, ' kg')} on ${brief.weighIn.lastDate ?? '—'} (${sinceLabel})`);
  lines.push(`  Due today: ${brief.weighIn.dueToday ? 'yes' : 'no'}`);
  const spanLabel = (kg: number | null, days: number | null, nominal: number) =>
    kg === null ? '—' : `${signed(kg, ' kg')} over ${days ?? nominal} days`;
  lines.push(`  Change: ${spanLabel(brief.weighIn.change7dKg, brief.weighIn.change7dSpanDays, 7)}, ${spanLabel(brief.weighIn.change28dKg, brief.weighIn.change28dSpanDays, 28)}`);
  lines.push(`  28-day trend: ${signed(brief.weighIn.trendKgPerWeek, ' kg/week')} (fit ${brief.weighIn.trendConfidence}, R² ${fmt(brief.weighIn.trendR2)})`);
  lines.push(`  BMI ${fmt(brief.weighIn.bmi)} · body fat ${fmt(brief.weighIn.bodyFatPct, '%')} · muscle ${fmt(brief.weighIn.muscleMassPct, '%')}`);
  if (brief.weighIn.plateau) {
    lines.push(`  Plateau: flat ${brief.weighIn.plateau.days} days at ${fmt(round(brief.weighIn.plateau.meanWeight, 1), ' kg')}`);
    if (brief.weighIn.plateau.suggestion) lines.push(`    → ${brief.weighIn.plateau.suggestion}`);
  }
  lines.push('');

  lines.push('ACTIVITY (yesterday · 7d avg · 28d avg)');
  lines.push(`  Steps: ${fmt(s?.activity.steps ?? null)} · ${fmt(a7.steps)} · ${fmt(a28.steps)}`);
  lines.push(`  Active energy: ${fmt(s?.activity.activeEnergyKcal ?? null, ' kcal')} · ${fmt(a7.activeEnergyKcal, ' kcal')} · ${fmt(a28.activeEnergyKcal, ' kcal')}`);
  lines.push(`  Exercise: ${fmt(s?.activity.exerciseMinutes ?? null, ' min')} · ${fmt(a7.exerciseMinutes, ' min')} · ${fmt(a28.exerciseMinutes, ' min')}`);
  lines.push(`  Stand hours: ${fmt(s?.activity.standHours ?? null)} · ${fmt(a7.standHours)} · ${fmt(a28.standHours)}`);
  lines.push(`  Distance: ${fmt(s?.activity.distanceKm ?? null, ' km')} · ${fmt(a7.distanceKm, ' km')} · ${fmt(a28.distanceKm, ' km')}`);
  lines.push('');

  lines.push('HEART & RECOVERY');
  lines.push(`  Resting HR: ${fmt(s?.heart.restingHr ?? null, ' bpm')} (28d baseline ${fmt(a28.restingHr, ' bpm')})`);
  lines.push(`  HRV: ${fmt(s?.heart.hrvMs ?? null, ' ms')} (28d baseline ${fmt(a28.hrvMs, ' ms')})`);
  lines.push(`  VO2 max: ${fmt(s?.heart.vo2Max ?? null)}`);
  lines.push(
    s && s.sleep.reliable
      ? `  Sleep: ${fmt(s.sleep.totalMin, ' min')} (REM ${fmt(s.sleep.remMin)}, deep ${fmt(s.sleep.deepMin)}, core ${fmt(s.sleep.coreMin)})`
      : '  Sleep: not reliably recorded — do not quote a figure',
  );
  lines.push('');

  lines.push('NUTRITION');
  lines.push(`  Intake: ${fmt(s?.nutrition.dietaryEnergyKcal ?? null, ' kcal')} · 7d avg ${fmt(a7.dietaryEnergyKcal, ' kcal')}`);
  lines.push(`  Target intake: ${fmt(brief.energy.targetIntakeKcal, ' kcal')} (TDEE ${fmt(brief.energy.tdee, ' kcal')}, BMR ${fmt(brief.energy.bmr, ' kcal')}, goal ${brief.energy.goalWeeklyLossKg} kg/week)`);
  lines.push(`  Balance: ${signed(brief.energy.balanceYesterdayKcal, ' kcal')} yesterday · ${signed(brief.energy.avgBalance7dKcal, ' kcal')} 7d avg`);
  lines.push(`  Protein: ${fmt(brief.protein.yesterdayG, ' g')} against ${fmt(brief.protein.targetG, ' g')} target (${brief.protein.basis ?? 'no basis'}) · 7d avg ${fmt(brief.protein.avg7dG, ' g')}`);
  lines.push(`  Carbs ${fmt(s?.nutrition.carbsG ?? null, ' g')} · fat ${fmt(s?.nutrition.fatG ?? null, ' g')} · fibre ${fmt(s?.nutrition.fiberG ?? null, ' g')} · sugar ${fmt(s?.nutrition.sugarG ?? null, ' g')}`);
  lines.push(`  Water: ${a7.waterMl === null ? 'not tracked in Apple Health' : fmt(s?.nutrition.waterMl ?? null, ' ml')}`);
  if (brief.energy.realityCheck) lines.push(`  Reality check: ${brief.energy.realityCheck.copy}`);
  lines.push('');

  if (brief.cycle.tracked) {
    lines.push('CYCLE');
    lines.push(`  Last flow: ${brief.cycle.lastFlowDate} (${brief.cycle.daysSinceFlow} days ago)`);
    if (brief.cycle.note) lines.push(`  ${brief.cycle.note}`);
    lines.push('');
  }

  if (brief.workouts.length > 0) {
    lines.push('WORKOUTS (last 14 days)');
    for (const w of brief.workouts.slice(0, 8)) {
      lines.push(`  ${w.date} — ${w.type ?? 'session'}, ${fmt(w.durationMin, ' min')}, ${fmt(w.energyKcal, ' kcal')}`);
    }
    lines.push('');
  }

  lines.push(`TODAY'S ADMIN — ${brief.admin.theme}`);
  for (const item of brief.admin.items) lines.push(`  · ${item}`);
  lines.push('');

  const byKind = (kind: Cue['kind']) => brief.cues.filter((c) => c.kind === kind);
  const wins = byKind('win');
  const watch = byKind('watch');
  const gaps = byKind('gap');
  if (wins.length) {
    lines.push('WORTH SAYING OUT LOUD');
    for (const c of wins) lines.push(`  + ${c.text}`);
    lines.push('');
  }
  if (watch.length) {
    lines.push('GENTLY WORTH A MENTION');
    for (const c of watch) lines.push(`  ~ ${c.text}`);
    lines.push('');
  }
  if (gaps.length) {
    lines.push('DO NOT INVENT (missing data)');
    for (const c of gaps) lines.push(`  ? ${c.text}`);
  }

  return lines.join('\n');
}


/**
 * The weekly roll-up, as text.
 *
 * Deliberately built on counts and totals rather than the daily brief's
 * averages: across seven days "four days out of seven" is something you can act
 * on, where a decimal average of stand hours is not.
 */
export function renderWeeklyText(brief: DailyBrief): string {
  const w = brief.weekly;
  const a7 = brief.averages.last7;
  const prev = brief.averages.previous7;
  const lines: string[] = [];

  const totalDelta = (now: number | null, before: number | null, unit = '') => {
    if (now === null) return '—';
    if (before === null) return fmt(now, unit);
    return `${fmt(now, unit)} (${signed(round(now - before, 0), unit)} vs week before)`;
  };

  lines.push(`WEEKLY OVERVIEW — ${w.from} to ${w.to} (${brief.timezone})`);
  lines.push(`Days with data: ${w.consistency.daysWithData} of 7`);
  lines.push('');

  lines.push('THE WEEK IN TOTAL');
  lines.push(`  Steps: ${totalDelta(w.totals.steps, w.previousTotals.steps)}`);
  lines.push(`  Active energy: ${totalDelta(w.totals.activeEnergyKcal, w.previousTotals.activeEnergyKcal, ' kcal')}`);
  lines.push(`  Exercise: ${totalDelta(w.totals.exerciseMinutes, w.previousTotals.exerciseMinutes, ' min')}`);
  lines.push(`  Distance: ${totalDelta(w.totals.distanceKm, w.previousTotals.distanceKm, ' km')}`);
  lines.push('');

  lines.push('CONSISTENCY (the number that actually predicts progress)');
  lines.push(`  Trained (20+ min): ${w.consistency.daysTrained} of 7 days`);
  lines.push(`  Steps over 8k: ${w.consistency.daysSteps8k} of 7 days`);
  lines.push(`  Food logged: ${w.consistency.daysFoodLogged} of 7 days`);
  lines.push(
    w.consistency.daysProteinTargetHit === null
      ? '  Protein target: no target available'
      : `  Protein target hit: ${w.consistency.daysProteinTargetHit} of 7 days (${fmt(brief.protein.targetG, ' g')})`,
  );
  lines.push(`  Weighed in: ${w.consistency.daysWeighed} of 7 days`);
  lines.push('');

  lines.push('WEIGHT');
  lines.push(`  Start ${fmt(w.weight.startKg, ' kg')} → end ${fmt(w.weight.endKg, ' kg')} (${signed(w.weight.changeKg, ' kg')} across the week)`);
  lines.push(`  This week's slope: ${signed(w.weight.trendKgPerWeek, ' kg/week')} · 28-day trend: ${signed(brief.weighIn.trendKgPerWeek, ' kg/week')}`);
  lines.push('  A single week of scale movement is mostly noise. The 28-day line is the one to read.');
  lines.push('');

  lines.push('DAY TO DAY');
  if (w.bestStepDay) lines.push(`  Busiest: ${w.bestStepDay.weekday} — ${fmt(w.bestStepDay.steps)} steps`);
  if (w.quietestStepDay) lines.push(`  Quietest: ${w.quietestStepDay.weekday} — ${fmt(w.quietestStepDay.steps)} steps`);
  lines.push('');

  lines.push('AVERAGES, THIS WEEK vs LAST');
  lines.push(`  Intake: ${fmt(a7.dietaryEnergyKcal, ' kcal')} vs ${fmt(prev.dietaryEnergyKcal, ' kcal')}`);
  lines.push(`  Protein: ${fmt(a7.proteinG, ' g')} vs ${fmt(prev.proteinG, ' g')}`);
  lines.push(`  Fibre: ${fmt(a7.fiberG, ' g')} vs ${fmt(prev.fiberG, ' g')}`);
  lines.push(`  Resting HR: ${fmt(a7.restingHr, ' bpm')} vs ${fmt(prev.restingHr, ' bpm')}`);
  lines.push(`  HRV: ${fmt(a7.hrvMs, ' ms')} vs ${fmt(prev.hrvMs, ' ms')}`);
  lines.push('');

  const gaps = brief.cues.filter((c) => c.kind === 'gap');
  if (gaps.length) {
    lines.push('DO NOT INVENT (missing data)');
    for (const c of gaps) lines.push(`  ? ${c.text}`);
  }

  return lines.join('\n');
}
