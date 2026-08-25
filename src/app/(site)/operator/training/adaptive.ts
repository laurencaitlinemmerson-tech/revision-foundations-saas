import { computeTdee } from '@/lib/fitness/tdee';
import { JOURNEY, TARGETS } from './targets';
import type { Sources } from './scoring';

/**
 * Targets that move as the body does.
 *
 * A fixed calorie target is wrong at both ends of a long loss. Resting metabolism
 * falls with bodyweight — roughly 10 kcal a day per kilogram by Mifflin–St Jeor —
 * so a number set at 88 kg is around 200 kcal too generous by 68. Held static, the
 * dashboard would slowly start marking a genuine deficit as a failure and a
 * genuine surplus as on target, and it would do so without any visible change.
 *
 * Everything here is recomputed from the most recent weigh-in and the last month
 * of measured expenditure, so the target follows the person rather than the
 * person chasing the target.
 */

export type AdaptiveTargets = {
  /** Total daily expenditure, from Mifflin–St Jeor plus measured signals. */
  tdee: number;
  bmr: number;
  /** Intake that produces the planned weekly loss. */
  calorieTarget: number;
  proteinTarget: number;
  /** The weekly change the target is built around. */
  weeklyLossKg: number;
  /** How much of the estimate rests on measured rather than assumed figures. */
  confidence: number;
  /** Whether this is derived from a weigh-in at all. */
  derived: boolean;
  note: string;
};

const DAY = 86_400_000;
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function adaptiveTargets(src: Sources): AdaptiveTargets {
  const weighed = src.weighIns.filter((w) => w.weight > 0);
  const latest = weighed.length ? weighed[weighed.length - 1].weight : null;

  if (latest === null) {
    return {
      tdee: TARGETS.calorieTarget,
      bmr: 0,
      calorieTarget: TARGETS.calorieTarget,
      proteinTarget: 130,
      weeklyLossKg: JOURNEY.targetKgPerWeek,
      confidence: 0,
      derived: false,
      note: 'No weigh-in yet, so targets fall back to the fixed defaults in targets.ts.',
    };
  }

  // The last 30 days of measured active energy, which is what the watch actually
  // saw rather than what a formula assumes about activity level.
  const since = Date.now() - 30 * DAY;
  const recent = src.days.filter((d) => new Date(d.date).getTime() >= since);
  const measuredExerciseKcal = mean(
    recent.map((d) => d.activity.activeEnergyKcal).filter((v): v is number => !!v),
  );
  const intakeKcal = mean(
    recent.map((d) => d.nutrition.dietaryEnergyKcal).filter((v): v is number => !!v),
  );

  // Protein share raises the thermic effect, so it is read from the log rather
  // than assumed at a quarter.
  const proteinKcal = mean(
    recent.map((d) => d.nutrition.proteinG).filter((v): v is number => !!v),
  );
  const proteinShare = proteinKcal !== null && intakeKcal ? Math.min(0.6, (proteinKcal * 4) / intakeKcal) : undefined;

  const t = computeTdee({
    weightKg: latest,
    weeklyChangeKg: JOURNEY.targetKgPerWeek,
    measuredExerciseKcal,
    intakeKcal,
    proteinShare,
  });

  // Protein is held per kilogram of bodyweight, so it falls with the weight too,
  // but never below the floor that protects lean tissue in a deficit.
  const proteinTarget = Math.max(100, Math.round((latest * TARGETS.proteinPerKg) / 5) * 5);

  return {
    tdee: t.tdee,
    bmr: t.bmr,
    calorieTarget: t.targetIntake,
    proteinTarget,
    weeklyLossKg: JOURNEY.targetKgPerWeek,
    confidence: t.confidence,
    derived: true,
    note: `Built from your most recent weigh-in of ${latest.toFixed(1)} kg${
      measuredExerciseKcal !== null ? ' and 30 days of measured activity' : ''
    }. It moves as you do — at ${JOURNEY.goalKg} kg the same plan needs roughly ${
      Math.round(t.targetIntake - (latest - JOURNEY.goalKg) * 10)
    } kcal instead of ${t.targetIntake}.`,
  };
}
