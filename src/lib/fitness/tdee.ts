/* ============================================================
   tdee.ts — TDEE from food + exercise, not a flat multiplier
   ============================================================

   Replaces the old `nutritionTargets(reading, weeklyLossKg)` which
   used a fixed 1.40× multiplier on BMR. The new model assembles
   TDEE from actual signals:

       TDEE = BMR + NEAT + measuredExercise + TEF(intake)

   - BMR              Mifflin–St Jeor (female default)
   - NEAT             estimated as a configurable % of BMR (default 25%)
                      — this is the only piece without a direct signal,
                      because step-count tracking on its own is a noisy
                      proxy. Tune from data over time.
   - measuredExercise pulled from Apple Health 7-day avg
                      (activeEnergyKcal). Falls back to a planned-week
                      estimate when health data is absent.
   - TEF              thermic effect of food = ~10% of dietary intake
                      (slightly higher for protein-heavy days). If
                      intake is unknown, falls back to ~10% of the
                      estimated TDEE-excluding-TEF.

   Goal/intake target ----------------------------------------------------
   A weight-loss target generates a deficit in kcal/day; intake is then
   the TDEE minus that deficit, rounded to the nearest 20 kcal.

   ============================================================ */

export interface TdeeInputs {
  /** Weight in kilograms */
  weightKg: number;
  /** Height in metres (defaults to 1.5748 — i.e. 5'2") */
  heightM?: number;
  /** Age in years (defaults to 26) */
  ageYears?: number;
  /** Sex — defaults to female (Mifflin–St Jeor female variant) */
  sex?: 'female' | 'male';

  /** Apple Health 7-day average of active energy in kcal/day. Pass null if not available. */
  measuredExerciseKcal?: number | null;
  /** Fallback exercise estimate if no health data — kcal/day. e.g. 350 for 4× 45-min lifts/week averaged. */
  plannedExerciseKcal?: number;

  /** NEAT factor (proportion of BMR). Default 0.25. */
  neatFactor?: number;

  /** Today's logged dietary intake in kcal. Pass null if unknown. */
  intakeKcal?: number | null;
  /** Average protein share (0–1) of intake. Slightly raises TEF. Default 0.25. */
  proteinShare?: number;

  /** Target weekly weight change in kg. Positive = loss, negative = gain. */
  weeklyChangeKg?: number;
}

export interface TdeeBreakdown {
  bmr: number;
  neat: number;
  exercise: number;
  /** Source of the exercise figure */
  exerciseSource: 'measured' | 'planned';
  tef: number;
  /** Sum of all four components — true daily energy expenditure */
  tdee: number;
  /** Recommended daily intake to hit the weekly-change target */
  targetIntake: number;
  /** Daily kcal deficit (or surplus) implied by weeklyChangeKg */
  dailyDelta: number;
  /** Confidence: how much of TDEE is from measured (vs estimated) signals */
  confidence: number; // 0–1
}

const KCAL_PER_KG = 7700;
const DEFAULT_HEIGHT_M = 1.5748;
const DEFAULT_AGE = 26;
const DEFAULT_NEAT_FACTOR = 0.25;
const DEFAULT_PLANNED_EX = 280; // ~4× 45-min sessions/wk averaged
const DEFAULT_PROTEIN_SHARE = 0.25;
const DEFAULT_WEEKLY_LOSS = 1;

export function computeTdee(inputs: TdeeInputs): TdeeBreakdown {
  const {
    weightKg,
    heightM = DEFAULT_HEIGHT_M,
    ageYears = DEFAULT_AGE,
    sex = 'female',
    measuredExerciseKcal = null,
    plannedExerciseKcal = DEFAULT_PLANNED_EX,
    neatFactor = DEFAULT_NEAT_FACTOR,
    intakeKcal = null,
    proteinShare = DEFAULT_PROTEIN_SHARE,
    weeklyChangeKg = DEFAULT_WEEKLY_LOSS,
  } = inputs;

  // 1. BMR — Mifflin–St Jeor
  const bmr = Math.round(
    10 * weightKg + 6.25 * (heightM * 100) - 5 * ageYears + (sex === 'female' ? -161 : 5)
  );

  // 2. NEAT — proportion of BMR
  const neat = Math.round(bmr * neatFactor);

  // 3. Exercise — measured if we have it, otherwise planned
  const exercise = measuredExerciseKcal !== null && measuredExerciseKcal >= 0
    ? Math.round(measuredExerciseKcal)
    : Math.round(plannedExerciseKcal);
  const exerciseSource: 'measured' | 'planned' =
    measuredExerciseKcal !== null && measuredExerciseKcal >= 0 ? 'measured' : 'planned';

  // 4. TEF — protein-weighted. Carbs/fat ~5–10%, protein ~25%.
  //    Blended TEF % ≈ 0.10 * (1 - p) + 0.22 * p
  const tefRate = 0.10 * (1 - proteinShare) + 0.22 * proteinShare;
  const tdeeBeforeTef = bmr + neat + exercise;
  const tefBase = intakeKcal !== null && intakeKcal > 0 ? intakeKcal : tdeeBeforeTef;
  const tef = Math.round(tefBase * tefRate);

  const tdee = tdeeBeforeTef + tef;

  // 5. Intake target for the weight-change goal
  const dailyDelta = Math.round((KCAL_PER_KG * weeklyChangeKg) / 7); // positive = deficit
  const targetIntake = Math.round((tdee - dailyDelta) / 20) * 20;

  // 6. Confidence — fraction of TDEE backed by measured exercise + intake
  const measuredKcal =
    (exerciseSource === 'measured' ? exercise : 0) +
    (intakeKcal !== null ? tef : 0);
  const confidence = tdee > 0 ? Math.min(1, measuredKcal / tdee) : 0;

  return { bmr, neat, exercise, exerciseSource, tef, tdee, targetIntake, dailyDelta, confidence };
}

/* ── Drop-in replacement for the old nutritionTargets() ───────────────── */
/* If you still want the old return shape so other call sites work: */
export function nutritionTargets(
  reading: { weight: number },
  weeklyLossKg = 1,
  signals: {
    measuredExerciseKcal?: number | null;
    plannedExerciseKcal?: number;
    intakeKcal?: number | null;
    proteinShare?: number;
  } = {}
) {
  const t = computeTdee({
    weightKg: reading.weight,
    weeklyChangeKg: weeklyLossKg,
    ...signals,
  });
  return {
    bmr: t.bmr,
    activeTdee: t.tdee,            // ← now true TDEE, not BMR × 1.4
    intake: t.targetIntake,
    neat: t.neat,
    exercise: t.exercise,
    tef: t.tef,
    exerciseSource: t.exerciseSource,
    confidence: t.confidence,
  };
}
