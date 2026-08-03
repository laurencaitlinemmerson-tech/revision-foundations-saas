/* Shared between /api/operator/ingest (structured JSON from a Shortcut
   or a hand-written script) and /api/operator/healthkit (Health Auto
   Export's REST payload). Both end up writing the same shape into
   operator_daily_metrics, so the column map and the "only send fields
   actually present" merge logic live here once rather than twice. */

export const DAY_COLUMNS: Record<string, string> = {
  steps: 'steps',
  activeEnergyKcal: 'active_energy_kcal',
  exerciseMinutes: 'exercise_minutes',
  standHours: 'stand_hours',
  distanceKm: 'distance_km',
  restingHr: 'resting_hr',
  hrvMs: 'hrv_ms',
  walkingHrAvg: 'walking_hr_avg',
  vo2Max: 'vo2_max',
  sleepTotalMin: 'sleep_total_min',
  sleepInBedMin: 'sleep_in_bed_min',
  sleepRemMin: 'sleep_rem_min',
  sleepDeepMin: 'sleep_deep_min',
  sleepCoreMin: 'sleep_core_min',
  sleepAwakeMin: 'sleep_awake_min',
  dietaryEnergyKcal: 'dietary_energy_kcal',
  proteinG: 'protein_g',
  carbsG: 'carbs_g',
  fatG: 'fat_g',
  fiberG: 'fiber_g',
  sugarG: 'sugar_g',
  waterMl: 'water_ml',
};

export interface DayInput {
  date: string;
  [field: string]: number | string | null | undefined;
}

/** A row per date, with only the fields actually present — so a partial
 *  sync merges into the existing row instead of nulling the rest of it. */
export function buildDayRows(days: DayInput[]) {
  return days.map((day) => {
    const row: Record<string, unknown> = { date: day.date, updated_at: new Date().toISOString() };
    for (const [field, column] of Object.entries(DAY_COLUMNS)) {
      const value = day[field];
      if (value !== undefined && value !== null) row[column] = value;
    }
    return row;
  });
}

export interface WorkoutInput {
  startedAt: string;
  endedAt?: string | null;
  type: string;
  durationMin?: number | null;
  energyKcal?: number | null;
  avgHr?: number | null;
  maxHr?: number | null;
  distanceKm?: number | null;
}

export function buildWorkoutRows(workouts: WorkoutInput[], source: string) {
  return workouts.map((workout) => ({
    started_at: workout.startedAt,
    ended_at: workout.endedAt ?? null,
    type: workout.type,
    duration_min: workout.durationMin ?? null,
    energy_kcal: workout.energyKcal ?? null,
    avg_hr: workout.avgHr ?? null,
    max_hr: workout.maxHr ?? null,
    distance_km: workout.distanceKm ?? null,
    source,
  }));
}
