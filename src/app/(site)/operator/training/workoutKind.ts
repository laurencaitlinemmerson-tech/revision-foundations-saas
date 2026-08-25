/**
 * Re-exported from the shared module so the server-side peer publisher and the
 * dashboard classify a workout the same way. See src/lib/workoutKind.ts.
 */
export {
  workoutKindOf, isStrengthWorkout, isCardioWorkout, isRunWorkout,
  type WorkoutKind, type WorkoutLike,
} from '@/lib/workoutKind';
