import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  DEFAULT_SETTINGS,
  type BodyReading,
  type BusinessPulse,
  type DailyMetric,
  type OperatorSettings,
  type OperatorSnapshot,
  type RevenuePoint,
  type Workout,
} from './types';
import { addDays, isoDay } from './fitness/derive';
import { buildDemoSnapshot } from './demo';

/**
 * The operator tables may not exist yet, and Supabase may not be
 * configured at all in a preview environment. Every read here is
 * best-effort: a missing table degrades that one section rather than
 * taking the whole dashboard down.
 */

const HISTORY_DAYS = 400;
const EMPTY_BUSINESS: BusinessPulse = {
  available: false,
  currency: 'gbp',
  grossPence: 0,
  gross30Pence: 0,
  gross7Pence: 0,
  orders: 0,
  orders30: 0,
  unclaimed: 0,
  entitlements: 0,
  activeStudents7: 0,
  activeStudents30: 0,
  byProduct: [],
  revenueByMonth: [],
};

let cachedClient: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cachedClient =
    url && serviceRoleKey
      ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
      : null;

  return cachedClient;
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function int(value: unknown): number | null {
  const parsed = num(value);
  return parsed === null ? null : Math.round(parsed);
}

type Row = Record<string, unknown>;

async function readSettings(client: SupabaseClient): Promise<OperatorSettings> {
  try {
    const { data, error } = await client.from('operator_settings').select('*').eq('id', 1).maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;

    const row = data as Row;
    const sex = row.sex === 'male' ? 'male' : 'female';

    return {
      heightCm: num(row.height_cm) ?? DEFAULT_SETTINGS.heightCm,
      ageYears: int(row.age_years) ?? DEFAULT_SETTINGS.ageYears,
      sex,
      targetWeightKg: num(row.target_weight_kg) ?? DEFAULT_SETTINGS.targetWeightKg,
      weeklyChangeKg: num(row.weekly_change_kg) ?? DEFAULT_SETTINGS.weeklyChangeKg,
      neatFactor: num(row.neat_factor) ?? DEFAULT_SETTINGS.neatFactor,
      proteinTargetG: num(row.protein_target_g) ?? DEFAULT_SETTINGS.proteinTargetG,
      stepTarget: int(row.step_target) ?? DEFAULT_SETTINGS.stepTarget,
      sleepTargetMin: int(row.sleep_target_min) ?? DEFAULT_SETTINGS.sleepTargetMin,
      waterTargetMl: int(row.water_target_ml) ?? DEFAULT_SETTINGS.waterTargetMl,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function readReadings(client: SupabaseClient, since: string) {
  try {
    const { data, error } = await client
      .from('operator_fitness_readings')
      .select('id, date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
      .gte('date', since)
      .order('date', { ascending: true });

    if (error) return { readings: [] as BodyReading[], missing: true };

    const readings = (data ?? [])
      .map((raw): BodyReading | null => {
        const row = raw as Row;
        const weight = num(row.weight);
        // 35–300 kg keeps a mistyped or unit-confused entry out of the trend.
        if (weight === null || weight < 35 || weight > 300) return null;
        return {
          id: String(row.id),
          date: isoDay(String(row.date)),
          weight,
          bmi: num(row.bmi) ?? 0,
          bodyFat: num(row.body_fat) ?? 0,
          water: num(row.water) ?? 0,
          muscleMass: num(row.muscle_mass) ?? 0,
          boneMass: num(row.bone_mass) ?? 0,
        };
      })
      .filter((reading): reading is BodyReading => reading !== null);

    return { readings, missing: false };
  } catch {
    return { readings: [] as BodyReading[], missing: true };
  }
}

async function readDailies(client: SupabaseClient, since: string) {
  try {
    const { data, error } = await client
      .from('operator_daily_metrics')
      .select('*')
      .gte('date', since)
      .order('date', { ascending: true });

    if (error) return { dailies: [] as DailyMetric[], missing: true };

    const dailies = (data ?? []).map((raw): DailyMetric => {
      const row = raw as Row;
      return {
        date: isoDay(String(row.date)),
        steps: int(row.steps),
        activeEnergyKcal: num(row.active_energy_kcal),
        exerciseMinutes: int(row.exercise_minutes),
        standHours: int(row.stand_hours),
        distanceKm: num(row.distance_km),
        restingHr: int(row.resting_hr),
        hrvMs: num(row.hrv_ms),
        walkingHrAvg: int(row.walking_hr_avg),
        vo2Max: num(row.vo2_max),
        sleepTotalMin: int(row.sleep_total_min),
        sleepRemMin: int(row.sleep_rem_min),
        sleepDeepMin: int(row.sleep_deep_min),
        sleepCoreMin: int(row.sleep_core_min),
        sleepAwakeMin: int(row.sleep_awake_min),
        dietaryEnergyKcal: num(row.dietary_energy_kcal),
        proteinG: num(row.protein_g),
        carbsG: num(row.carbs_g),
        fatG: num(row.fat_g),
        fiberG: num(row.fiber_g),
        sugarG: num(row.sugar_g),
        waterMl: num(row.water_ml),
      };
    });

    return { dailies, missing: false };
  } catch {
    return { dailies: [] as DailyMetric[], missing: true };
  }
}

async function readWorkouts(client: SupabaseClient, since: string) {
  try {
    const { data, error } = await client
      .from('operator_workouts')
      .select('id, started_at, type, duration_min, energy_kcal, avg_hr, max_hr, distance_km')
      .gte('started_at', since)
      .order('started_at', { ascending: true });

    if (error) return { workouts: [] as Workout[], missing: true };

    const workouts = (data ?? [])
      .map((raw): Workout => {
        const row = raw as Row;
        return {
          id: String(row.id),
          startedAt: String(row.started_at),
          type: String(row.type ?? 'Other'),
          durationMin: num(row.duration_min),
          energyKcal: num(row.energy_kcal),
          avgHr: int(row.avg_hr),
          maxHr: int(row.max_hr),
          distanceKm: num(row.distance_km),
        };
      })
      // The old importer parked body-composition rows in this table.
      .filter((workout) => !workout.type.startsWith('__'));

    return { workouts, missing: false };
  } catch {
    return { workouts: [] as Workout[], missing: true };
  }
}

async function readBusiness(client: SupabaseClient): Promise<BusinessPulse> {
  const pulse: BusinessPulse = { ...EMPTY_BUSINESS, byProduct: [], revenueByMonth: [] };
  const today = isoDay(new Date());
  const since30 = addDays(today, -30);
  const since7 = addDays(today, -7);

  try {
    const { data, error } = await client
      .from('purchases')
      .select('product_key, amount_total, currency, status, created_at');

    if (!error && data) {
      pulse.available = true;
      const byProduct = new Map<string, { orders: number; grossPence: number }>();
      const byMonth = new Map<string, { orders: number; grossPence: number }>();

      for (const raw of data) {
        const row = raw as Row;
        const amount = num(row.amount_total) ?? 0;
        const createdAt = row.created_at ? isoDay(String(row.created_at)) : today;
        const product = String(row.product_key ?? 'unknown');

        pulse.grossPence += amount;
        pulse.orders += 1;
        if (row.currency) pulse.currency = String(row.currency);
        if (row.status === 'unclaimed') pulse.unclaimed += 1;

        if (createdAt >= since30) {
          pulse.gross30Pence += amount;
          pulse.orders30 += 1;
        }
        if (createdAt >= since7) pulse.gross7Pence += amount;

        const productEntry = byProduct.get(product) ?? { orders: 0, grossPence: 0 };
        productEntry.orders += 1;
        productEntry.grossPence += amount;
        byProduct.set(product, productEntry);

        const month = createdAt.slice(0, 7);
        const monthEntry = byMonth.get(month) ?? { orders: 0, grossPence: 0 };
        monthEntry.orders += 1;
        monthEntry.grossPence += amount;
        byMonth.set(month, monthEntry);
      }

      pulse.byProduct = [...byProduct.entries()]
        .map(([product, value]) => ({ product, ...value }))
        .sort((a, b) => b.grossPence - a.grossPence);

      pulse.revenueByMonth = [...byMonth.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12)
        .map(([month, value]): RevenuePoint => ({ month, ...value }));
    }
  } catch {
    // Leave the section marked unavailable.
  }

  try {
    const { count } = await client
      .from('entitlements')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');
    pulse.entitlements = count ?? 0;
  } catch {
    // Optional.
  }

  try {
    const { data } = await client
      .from('study_sessions')
      .select('clerk_user_id, study_date')
      .gte('study_date', since30);

    if (data) {
      const seen30 = new Set<string>();
      const seen7 = new Set<string>();
      for (const raw of data) {
        const row = raw as Row;
        const user = String(row.clerk_user_id);
        const date = isoDay(String(row.study_date));
        seen30.add(user);
        if (date >= since7) seen7.add(user);
      }
      pulse.activeStudents30 = seen30.size;
      pulse.activeStudents7 = seen7.size;
    }
  } catch {
    // Optional.
  }

  return pulse;
}

/**
 * Everything the dashboard needs, in one round of parallel reads.
 * Falls back to sample data when there is nothing real to show, so the
 * page is never an empty shell.
 */
export async function loadOperatorSnapshot(): Promise<OperatorSnapshot> {
  const client = getClient();
  const generatedAt = new Date().toISOString();

  if (!client) {
    return { ...buildDemoSnapshot(), generatedAt, isDemo: true, setupRequired: true };
  }

  const since = addDays(isoDay(new Date()), -HISTORY_DAYS);

  const [settings, readingResult, dailyResult, workoutResult, business] = await Promise.all([
    readSettings(client),
    readReadings(client, since),
    readDailies(client, since),
    readWorkouts(client, since),
    readBusiness(client),
  ]);

  const setupRequired = readingResult.missing && dailyResult.missing && workoutResult.missing;
  const hasFitnessData =
    readingResult.readings.length > 0 ||
    dailyResult.dailies.length > 0 ||
    workoutResult.workouts.length > 0;

  if (!hasFitnessData) {
    const demo = buildDemoSnapshot(settings);
    return { ...demo, generatedAt, isDemo: true, setupRequired, business };
  }

  return {
    generatedAt,
    isDemo: false,
    setupRequired: false,
    settings,
    readings: readingResult.readings,
    dailies: dailyResult.dailies,
    workouts: workoutResult.workouts,
    business,
  };
}
