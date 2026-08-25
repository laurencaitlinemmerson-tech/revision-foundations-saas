/**
 * What kind of training a synced workout actually was.
 *
 * Everfit writes logged gym sessions into Apple Health as "Cross Training", so
 * without this a strength session arrives looking like an aerobic one: it would
 * inflate the cardio score and leave the strength score with nothing behind it.
 *
 * The source is checked before the type, because a coaching app that only ever
 * writes strength work is better evidence than Apple's catch-all activity label.
 */

export type WorkoutKind = 'strength' | 'cardio' | 'other';

export type WorkoutLike = {
  type: string | null;
  source: string | null;
  distanceKm: number | null;
};

/** Apps that only ever log resistance training, whatever type they stamp on it. */
const STRENGTH_SOURCES = /everfit|strong|hevy|jefit|fitbod/i;

const STRENGTH_TYPES =
  /cross ?training|strength|weight ?lifting|weight ?training|resistance|functional|pilates|core/i;

const CARDIO_TYPES =
  /run|jog|cycl|bike|ride|swim|row|walk|hike|elliptical|stair|treadmill|cardio|dance|skip/i;

/** Running specifically, for the contract's `runs` count. */
const RUN_TYPES = /run|jog|treadmill/i;

export function workoutKindOf(w: WorkoutLike): WorkoutKind {
  const type = w.type ?? '';
  const source = w.source ?? '';

  // Anything that covered real ground is cardio regardless of how it is labelled.
  if ((w.distanceKm ?? 0) >= 0.5) return 'cardio';
  if (STRENGTH_SOURCES.test(source)) return 'strength';
  if (CARDIO_TYPES.test(type)) return 'cardio';
  if (STRENGTH_TYPES.test(type)) return 'strength';
  return 'other';
}

export const isStrengthWorkout = (w: WorkoutLike) => workoutKindOf(w) === 'strength';
export const isCardioWorkout = (w: WorkoutLike) => workoutKindOf(w) === 'cardio';
export const isRunWorkout = (w: WorkoutLike) =>
  RUN_TYPES.test(w.type ?? '') && !/walk/i.test(w.type ?? '');
