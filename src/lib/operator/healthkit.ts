import type { DayInput, WorkoutInput } from './ingestColumns';

/* ============================================================
   healthkit.ts — map the "Health Auto Export" REST payload
   ============================================================

   The iOS app "Health Auto Export – JSON+CSV" can post a snapshot of
   HealthKit straight to a URL on a schedule (Settings → Automations →
   REST API). Its export shape is:

     {
       "data": {
         "metrics": [
           { "name": "step_count", "units": "count",
             "data": [{ "date": "2026-08-03 00:00:00 +0100", "qty": 9120 }] },
           { "name": "sleep_analysis", "units": "hr",
             "data": [{ "date": "...", "asleep": 6.9, "inBed": 7.6,
                         "core": 3.9, "deep": 1.1, "rem": 1.6, "awake": 0.3 }] }
         ],
         "workouts": [
           { "name": "Running", "start": "...", "end": "...", "duration": 2100,
             "activeEnergyBurned": { "qty": 380, "units": "kcal" },
             "distance": { "qty": 5.2, "units": "km" },
             "avgHeartRate": { "qty": 158, "units": "bpm" } }
         ]
       }
     }

   The exact metric names and nesting have shifted across app versions,
   so this reads defensively — several plausible keys per field — and
   returns `unmatchedMetrics` so a mismatch is visible in the response
   rather than silently dropped. If a sync lands with metrics unmapped,
   send the `unmatchedMetrics` list back and the aliases below get
   extended.
   ============================================================ */

type Json = Record<string, unknown>;

function asArray(value: unknown): Json[] {
  return Array.isArray(value) ? (value as Json[]) : [];
}

function num(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/** Health Auto Export dates look like "2026-08-03 00:12:00 +0100". */
function dayOf(dateStr: unknown): string | null {
  if (typeof dateStr !== 'string') return null;
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/** The value field varies by export version — try each in order. */
function pointValue(point: Json, keys: string[]): number | null {
  for (const key of keys) {
    const value = num(point[key]);
    if (value !== null) return value;
  }
  return null;
}

type DayField =
  | 'steps'
  | 'activeEnergyKcal'
  | 'exerciseMinutes'
  | 'standHours'
  | 'distanceKm'
  | 'restingHr'
  | 'hrvMs'
  | 'walkingHrAvg'
  | 'vo2Max'
  | 'dietaryEnergyKcal'
  | 'proteinG'
  | 'carbsG'
  | 'fatG'
  | 'fiberG'
  | 'sugarG'
  | 'waterMl';

interface MetricRule {
  /** Names this metric is known to export under, across app versions. */
  aliases: string[];
  field: DayField;
  /** How same-day points combine. */
  kind: 'sum' | 'avg' | 'max' | 'last';
  /** Unit conversion into the column's stored unit. */
  scale?: number;
}

const METRIC_RULES: MetricRule[] = [
  { aliases: ['step_count', 'steps'], field: 'steps', kind: 'sum' },
  { aliases: ['active_energy', 'active_energy_burned', 'apple_exercise_time_energy'], field: 'activeEnergyKcal', kind: 'sum' },
  { aliases: ['apple_exercise_time', 'exercise_time'], field: 'exerciseMinutes', kind: 'sum' },
  { aliases: ['apple_stand_hour', 'apple_stand_time', 'stand_hours'], field: 'standHours', kind: 'sum' },
  { aliases: ['walking_running_distance', 'distance_walking_running'], field: 'distanceKm', kind: 'sum' },
  { aliases: ['resting_heart_rate'], field: 'restingHr', kind: 'avg' },
  { aliases: ['heart_rate_variability', 'hrv', 'heart_rate_variability_sdnn'], field: 'hrvMs', kind: 'avg' },
  { aliases: ['walking_heart_rate_average'], field: 'walkingHrAvg', kind: 'avg' },
  { aliases: ['vo2_max'], field: 'vo2Max', kind: 'avg' },
  { aliases: ['dietary_energy', 'dietary_energy_consumed'], field: 'dietaryEnergyKcal', kind: 'sum' },
  { aliases: ['protein'], field: 'proteinG', kind: 'sum' },
  { aliases: ['carbohydrates'], field: 'carbsG', kind: 'sum' },
  { aliases: ['total_fat', 'fat_total'], field: 'fatG', kind: 'sum' },
  { aliases: ['fiber', 'dietary_fiber'], field: 'fiberG', kind: 'sum' },
  { aliases: ['sugar', 'dietary_sugar'], field: 'sugarG', kind: 'sum' },
  { aliases: ['dietary_water', 'water'], field: 'waterMl', kind: 'sum', scale: 1000 },
];

const METRIC_LOOKUP = new Map<string, MetricRule>();
for (const rule of METRIC_RULES) {
  for (const alias of rule.aliases) METRIC_LOOKUP.set(alias, rule);
}

export interface HealthKitResult {
  days: DayInput[];
  workouts: WorkoutInput[];
  metricsSeen: string[];
  unmatchedMetrics: string[];
}

export function mapHealthAutoExport(body: unknown): HealthKitResult {
  const root = (body as Json)?.data as Json | undefined;
  const metrics = asArray(root?.metrics);
  const workoutsRaw = asArray(root?.workouts);

  const byDate = new Map<string, Record<string, number[]>>();
  const sleepByDate = new Map<string, { total: number; inBed: number; rem: number; deep: number; core: number; awake: number }>();

  const metricsSeen: string[] = [];
  const unmatchedMetrics: string[] = [];

  for (const metric of metrics) {
    const name = String(metric.name ?? '').trim();
    if (!name) continue;
    metricsSeen.push(name);

    const points = asArray(metric.data);

    if (name === 'sleep_analysis') {
      for (const point of points) {
        // Bucket sleep by wake time so a night that starts before midnight
        // still lands on the morning it ended.
        const date = dayOf(point.date ?? point.sleepEnd ?? point.end);
        if (!date) continue;
        const entry = sleepByDate.get(date) ?? { total: 0, inBed: 0, rem: 0, deep: 0, core: 0, awake: 0 };
        entry.inBed += pointValue(point, ['inBed', 'in_bed']) ?? 0;
        entry.rem += pointValue(point, ['rem']) ?? 0;
        entry.deep += pointValue(point, ['deep']) ?? 0;
        entry.core += pointValue(point, ['core']) ?? 0;
        entry.awake += pointValue(point, ['awake']) ?? 0;
        const asleep = pointValue(point, ['asleep', 'total_sleep']);
        entry.total += asleep ?? entry.rem + entry.deep + entry.core;
        sleepByDate.set(date, entry);
      }
      continue;
    }

    const rule = METRIC_LOOKUP.get(name);
    if (!rule) {
      unmatchedMetrics.push(name);
      continue;
    }

    for (const point of points) {
      const date = dayOf(point.date);
      const value = pointValue(point, ['qty', 'value', 'avg']);
      if (!date || value === null) continue;
      const scaled = rule.scale ? value * rule.scale : value;
      const record = byDate.get(date) ?? {};
      const bucket = record[rule.field] ?? [];
      bucket.push(scaled);
      record[rule.field] = bucket;
      byDate.set(date, record);
    }
  }

  const days: DayInput[] = [];
  const allDates = new Set([...byDate.keys(), ...sleepByDate.keys()]);

  for (const date of allDates) {
    const record = byDate.get(date) ?? {};
    const day: DayInput = { date };

    for (const rule of METRIC_RULES) {
      const values = record[rule.field];
      if (!values || !values.length) continue;
      day[rule.field] =
        rule.kind === 'sum'
          ? values.reduce((a, b) => a + b, 0)
          : rule.kind === 'max'
            ? Math.max(...values)
            : rule.kind === 'avg'
              ? values.reduce((a, b) => a + b, 0) / values.length
              : values[values.length - 1];
    }

    const sleep = sleepByDate.get(date);
    if (sleep) {
      day.sleepTotalMin = Math.round(sleep.total * 60);
      day.sleepInBedMin = Math.round(sleep.inBed * 60);
      day.sleepRemMin = Math.round(sleep.rem * 60);
      day.sleepDeepMin = Math.round(sleep.deep * 60);
      day.sleepCoreMin = Math.round(sleep.core * 60);
      day.sleepAwakeMin = Math.round(sleep.awake * 60);
    }

    if (Object.keys(day).length > 1) days.push(day);
  }

  const workouts: WorkoutInput[] = workoutsRaw
    .map((workout): WorkoutInput | null => {
      const startedAt = String(workout.start ?? workout.startDate ?? '');
      if (!startedAt) return null;

      const energy = workout.activeEnergyBurned as Json | undefined;
      const distance = workout.distance as Json | undefined;
      const avgHr = (workout.avgHeartRate ?? workout.heartRateAvg) as Json | undefined;
      const maxHr = (workout.maxHeartRate ?? workout.heartRateMax) as Json | undefined;
      const durationSeconds = num(workout.duration);

      // Distance ships in whatever unit HealthKit recorded; convert the
      // common non-metric case rather than assume km.
      const distanceQty = distance ? num(distance.qty) : null;
      const distanceUnit = distance ? String(distance.units ?? '') : '';
      const distanceKm =
        distanceQty === null ? null : distanceUnit.startsWith('mi') ? distanceQty * 1.609344 : distanceQty;

      return {
        startedAt,
        endedAt: workout.end ? String(workout.end) : null,
        type: String(workout.name ?? 'Workout'),
        durationMin: durationSeconds !== null ? durationSeconds / 60 : null,
        energyKcal: energy ? num(energy.qty) : null,
        avgHr: avgHr ? num(avgHr.qty) : null,
        maxHr: maxHr ? num(maxHr.qty) : null,
        distanceKm,
      };
    })
    .filter((w): w is WorkoutInput => w !== null);

  return { days, workouts, metricsSeen, unmatchedMetrics: [...new Set(unmatchedMetrics)] };
}
