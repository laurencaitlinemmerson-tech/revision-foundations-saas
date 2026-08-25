/**
 * The targets every score on the Training dashboard is measured against.
 *
 * They live in one place because the Settings screen displays them and the six
 * dimension scores are all defined relative to them — a number on this page is
 * only meaningful next to the target it is being judged by.
 */

export const TARGETS = {
  /** Rolling daily step goal. */
  stepGoal: 10_000,
  /** Daily calorie target, used by nutrition scoring and the Nutrition screen. */
  calorieTarget: 2000,
  /** Grams of protein per kg of bodyweight. */
  proteinPerKg: 1.8,
  /** Litres of water a day. */
  waterTargetL: 2.5,
  /** Grams of fibre a day. */
  fibreTargetG: 30,
  /** Planned training sessions a week — drives workout adherence. */
  sessionsPerWeek: 3,
  /** Hours of sleep a night. */
  sleepTargetH: 8,
  /** Minutes of moderate cardio a week (WHO minimum for adults). */
  cardioMinutesPerWeek: 150,
  /** Minutes of Apple Health "exercise" a day. */
  exerciseMinutesPerDay: 30,
  /** Kilograms of lifted volume a week, at the planned session count. */
  weeklyVolumeKg: 12_000,
} as const;

/**
 * The fat loss journey.
 *
 * Deliberately anchored to an explicit start rather than derived from the
 * earliest weigh-in on record. A derived start slides every time an older
 * reading is imported, and it cannot tell a fresh attempt apart from the
 * scattered history behind it — progress would appear to reset for reasons
 * that have nothing to do with what happened.
 */
export const JOURNEY = {
  /** Where this attempt began. */
  startKg: 88.2,
  startDate: '2026-08-26',
  goalKg: 68,
  /**
   * A rate to plan against. Roughly 0.5–1% of bodyweight a week is the range
   * usually held to preserve lean tissue; this sits at the gentle end.
   */
  targetKgPerWeek: 0.5,
} as const;

/** Protein target in grams for a given bodyweight, rounded to something sayable. */
export function proteinTargetG(weightKg: number | null): number {
  if (!weightKg) return 130;
  return Math.round((weightKg * TARGETS.proteinPerKg) / 5) * 5;
}
