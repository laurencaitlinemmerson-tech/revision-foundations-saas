/* ============================================================
   tdee.ts — energy expenditure from real signals, not a multiplier
   ============================================================

       TDEE = BMR + NEAT + measured exercise + TEF(intake)

   - BMR       Mifflin–St Jeor
   - NEAT      a configurable proportion of BMR. The only component
               without a direct signal, because step count alone is a
               noisy proxy for non-exercise movement. Tune from data.
   - exercise  Apple Health active energy, 7-day average. Falls back
               to a planned-week estimate when health data is absent,
               and says which one it used.
   - TEF       thermic effect of food, protein-weighted. Falls back to
               a share of pre-TEF expenditure when intake is unknown.

   `confidence` reports how much of the total is backed by measurement
   rather than assumption, so the dashboard can be honest about how
   much weight to put on the number.
   ============================================================ */

export interface TdeeInputs {
  weightKg: number;
  heightCm?: number;
  ageYears?: number;
  sex?: 'female' | 'male';

  /** 7-day average active energy in kcal/day. Null when unavailable. */
  measuredExerciseKcal?: number | null;
  /** Fallback when there is no health data. */
  plannedExerciseKcal?: number;

  /** NEAT as a proportion of BMR. */
  neatFactor?: number;

  /** Logged dietary intake in kcal. Null when unknown. */
  intakeKcal?: number | null;
  /** Protein share of intake (0–1); raises TEF. */
  proteinShare?: number;

  /** Target weekly weight change in kg. Positive = loss. */
  weeklyChangeKg?: number;
}

export interface TdeeBreakdown {
  bmr: number;
  neat: number;
  exercise: number;
  exerciseSource: 'measured' | 'planned';
  tef: number;
  /** Sum of all four components. */
  tdee: number;
  /** Intake that hits the weekly-change target. */
  targetIntake: number;
  /** Daily deficit (positive) or surplus (negative) implied by the target. */
  dailyDelta: number;
  /** 0–1: share of TDEE backed by measured signals. */
  confidence: number;
}

export const KCAL_PER_KG = 7700;

const DEFAULT_HEIGHT_CM = 157.5;
const DEFAULT_AGE = 26;
const DEFAULT_NEAT_FACTOR = 0.25;
const DEFAULT_PLANNED_EXERCISE = 280;
const DEFAULT_PROTEIN_SHARE = 0.25;
const DEFAULT_WEEKLY_CHANGE = 0.5;

export function computeTdee(inputs: TdeeInputs): TdeeBreakdown {
  const {
    weightKg,
    heightCm = DEFAULT_HEIGHT_CM,
    ageYears = DEFAULT_AGE,
    sex = 'female',
    measuredExerciseKcal = null,
    plannedExerciseKcal = DEFAULT_PLANNED_EXERCISE,
    neatFactor = DEFAULT_NEAT_FACTOR,
    intakeKcal = null,
    proteinShare = DEFAULT_PROTEIN_SHARE,
    weeklyChangeKg = DEFAULT_WEEKLY_CHANGE,
  } = inputs;

  const bmr = Math.round(
    10 * weightKg + 6.25 * heightCm - 5 * ageYears + (sex === 'female' ? -161 : 5),
  );

  const neat = Math.round(bmr * neatFactor);

  const hasMeasured = measuredExerciseKcal !== null && measuredExerciseKcal >= 0;
  const exercise = Math.round(hasMeasured ? measuredExerciseKcal : plannedExerciseKcal);
  const exerciseSource: 'measured' | 'planned' = hasMeasured ? 'measured' : 'planned';

  // Carbs and fat sit near 5–10%, protein near 25%. Blend by share.
  const tefRate = 0.1 * (1 - proteinShare) + 0.22 * proteinShare;
  const beforeTef = bmr + neat + exercise;
  const tefBase = intakeKcal !== null && intakeKcal > 0 ? intakeKcal : beforeTef;
  const tef = Math.round(tefBase * tefRate);

  const tdee = beforeTef + tef;

  const dailyDelta = Math.round((KCAL_PER_KG * weeklyChangeKg) / 7);
  const targetIntake = Math.round((tdee - dailyDelta) / 20) * 20;

  const measuredKcal = (hasMeasured ? exercise : 0) + (intakeKcal !== null ? tef : 0);
  const confidence = tdee > 0 ? Math.min(1, measuredKcal / tdee) : 0;

  return {
    bmr,
    neat,
    exercise,
    exerciseSource,
    tef,
    tdee,
    targetIntake,
    dailyDelta,
    confidence,
  };
}

/**
 * Back out actual expenditure from observed weight change and logged
 * intake over a window — the reality check on the modelled TDEE.
 *
 *     realTdee = meanIntake + (weightLostKg × 7700) / days
 */
export function tdeeRealityCheck(options: {
  meanIntakeKcal: number | null;
  weightChangeKg: number;
  days: number;
  intakeDaysLogged: number;
}): { realTdee: number; reliable: boolean } | null {
  const { meanIntakeKcal, weightChangeKg, days, intakeDaysLogged } = options;
  if (meanIntakeKcal === null || days < 7) return null;

  const realTdee = Math.round(meanIntakeKcal - (weightChangeKg * KCAL_PER_KG) / days);
  if (!Number.isFinite(realTdee) || realTdee < 800 || realTdee > 6000) return null;

  // Needs both a decent window and most days actually logged.
  return { realTdee, reliable: days >= 14 && intakeDaysLogged / days >= 0.6 };
}
