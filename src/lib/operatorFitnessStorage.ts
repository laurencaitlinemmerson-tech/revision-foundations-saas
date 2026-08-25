import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isPlausibleWeightKg } from '@/lib/fitnessValidation';

export interface FitnessReadingInput {
  date: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  water: number;
  muscleMass: number;
  boneMass: number;
}

export interface FitnessReadingRecord extends FitnessReadingInput {
  id: string;
}

type FitnessTableRow = {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  body_fat: number;
  water: number;
  muscle_mass: number;
  bone_mass: number;
};

/**
 * The marker on a weigh-in stored in the workouts table.
 *
 * When `operator_fitness_readings` is unavailable, a reading is parked in
 * `operator_workouts` under this type. Those rows are weigh-ins wearing a
 * workout's shape, so anything listing actual workouts has to exclude them —
 * which is why this is exported rather than private.
 */
export const FITNESS_FALLBACK_TYPE = '__operator_fitness_reading__';
const FALLBACK_TYPE = FITNESS_FALLBACK_TYPE;
const FALLBACK_SOURCE = 'operator_fitness_fallback';

function num(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isoDay(value: string) {
  return value.slice(0, 10);
}

function fallbackId(date: string) {
  return `fallback:${isoDay(date)}`;
}

function fallbackStartedAt(date: string) {
  return `${isoDay(date)}T12:00:00.000Z`;
}

function fromTableRow(row: FitnessTableRow): FitnessReadingRecord {
  return {
    id: row.id,
    date: row.date,
    weight: Number(row.weight),
    bmi: Number(row.bmi),
    bodyFat: Number(row.body_fat),
    water: Number(row.water),
    muscleMass: Number(row.muscle_mass),
    boneMass: Number(row.bone_mass),
  };
}

function fromFallbackRaw(raw: unknown, startedAt: string): FitnessReadingRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const date = typeof row.date === 'string' && row.date.length >= 10 ? row.date.slice(0, 10) : startedAt.slice(0, 10);
  const weight = num(row.weight, NaN);
  if (!isPlausibleWeightKg(weight)) return null;

  return {
    id: fallbackId(date),
    date,
    weight,
    bmi: num(row.bmi),
    bodyFat: num(row.bodyFat ?? row.body_fat),
    water: num(row.water),
    muscleMass: num(row.muscleMass ?? row.muscle_mass),
    boneMass: num(row.boneMass ?? row.bone_mass),
  };
}

function toFallbackRaw(reading: FitnessReadingInput) {
  return {
    date: isoDay(reading.date),
    weight: reading.weight,
    bmi: reading.bmi,
    bodyFat: reading.bodyFat,
    water: reading.water,
    muscleMass: reading.muscleMass,
    boneMass: reading.boneMass,
  };
}

export async function listFitnessReadings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .select('*')
      .order('date', { ascending: true });

    if (!error) {
      return {
        readings: (data ?? [])
          .map((row) => fromTableRow(row as FitnessTableRow))
          .filter((row) => isPlausibleWeightKg(row.weight)),
        setupRequired: false,
      };
    }
  } catch {}

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_workouts')
      .select('started_at, raw')
      .eq('type', FALLBACK_TYPE)
      .order('started_at', { ascending: true });

    if (error) return { readings: [] as FitnessReadingRecord[], setupRequired: true };

    const readings = (data ?? [])
      .map((row) => fromFallbackRaw((row as { raw: unknown }).raw, String((row as { started_at: string }).started_at)))
      .filter((row): row is FitnessReadingRecord => row !== null);

    return { readings, setupRequired: false };
  } catch {
    return { readings: [] as FitnessReadingRecord[], setupRequired: true };
  }
}

export async function saveFitnessReading(reading: FitnessReadingInput) {
  if (!isPlausibleWeightKg(reading.weight)) {
    return { reading: null, setupRequired: false, error: 'weight_out_of_range' };
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .insert([{
        date: reading.date,
        weight: reading.weight,
        bmi: reading.bmi,
        body_fat: reading.bodyFat,
        water: reading.water,
        muscle_mass: reading.muscleMass,
        bone_mass: reading.boneMass,
      }])
      .select()
      .single();

    if (!error && data) {
      return { reading: fromTableRow(data as FitnessTableRow), setupRequired: false };
    }
  } catch {}

  try {
    const date = isoDay(reading.date);
    const { error } = await supabaseAdmin
      .from('operator_workouts')
      .upsert([{
        started_at: fallbackStartedAt(date),
        ended_at: null,
        type: FALLBACK_TYPE,
        duration_min: null,
        energy_kcal: null,
        avg_hr: null,
        max_hr: null,
        distance_km: null,
        source: FALLBACK_SOURCE,
        raw: toFallbackRaw(reading),
      }], { onConflict: 'started_at,type' });

    if (error) return { reading: null, setupRequired: true, error: error.message };

    return {
      reading: {
        id: fallbackId(date),
        date,
        weight: reading.weight,
        bmi: reading.bmi,
        bodyFat: reading.bodyFat,
        water: reading.water,
        muscleMass: reading.muscleMass,
        boneMass: reading.boneMass,
      },
      setupRequired: false,
    };
  } catch {
    return { reading: null, setupRequired: true, error: 'db_unavailable' };
  }
}

export async function upsertFitnessReading(reading: FitnessReadingInput) {
  if (!isPlausibleWeightKg(reading.weight)) {
    throw new Error('weight_out_of_range');
  }
  const day = isoDay(reading.date);
  const dayStart = `${day}T00:00:00.000Z`;
  const nextDay = new Date(Date.UTC(
    parseInt(day.slice(0, 4)),
    parseInt(day.slice(5, 7)) - 1,
    parseInt(day.slice(8, 10)) + 1,
  )).toISOString().slice(0, 10);
  const nextDayStart = `${nextDay}T00:00:00.000Z`;

  try {
    const { data: existingRows, error: loadError } = await supabaseAdmin
      .from('operator_fitness_readings')
      .select('id, date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
      .gte('date', dayStart)
      .lt('date', nextDayStart)
      .order('date', { ascending: false })
      .limit(1);

    if (!loadError) {
      const existing = (existingRows?.[0] as FitnessTableRow | undefined) ?? null;

      if (existing) {
        const { error } = await supabaseAdmin
          .from('operator_fitness_readings')
          .update({
            date: reading.date,
            weight: reading.weight,
            bmi: reading.bmi,
            body_fat: reading.bodyFat > 0 ? reading.bodyFat : existing.body_fat,
            water: reading.water > 0 ? reading.water : existing.water,
            muscle_mass: reading.muscleMass > 0 ? reading.muscleMass : existing.muscle_mass,
            bone_mass: reading.boneMass > 0 ? reading.boneMass : existing.bone_mass,
          })
          .eq('id', existing.id);

        if (!error) return { action: 'updated' as const, date: isoDay(reading.date) };
      } else {
        const { error } = await supabaseAdmin
          .from('operator_fitness_readings')
          .insert([{
            date: reading.date,
            weight: reading.weight,
            bmi: reading.bmi,
            body_fat: reading.bodyFat,
            water: reading.water,
            muscle_mass: reading.muscleMass,
            bone_mass: reading.boneMass,
          }]);

        if (!error) return { action: 'inserted' as const, date: isoDay(reading.date) };
      }
    }
  } catch {}

  const fallback = await saveFitnessReading(reading);
  if (!fallback.reading) throw new Error(fallback.error ?? 'db_unavailable');
  return { action: 'updated' as const, date: isoDay(reading.date) };
}

export async function deleteFitnessReading(id: string) {
  if (id.startsWith('fallback:')) {
    const date = id.slice('fallback:'.length);
    try {
      const { error } = await supabaseAdmin
        .from('operator_workouts')
        .delete()
        .eq('type', FALLBACK_TYPE)
        .eq('started_at', fallbackStartedAt(date));
      return { success: !error, error: error?.message };
    } catch {
      return { success: false, error: 'db_unavailable' };
    }
  }

  try {
    const { error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .delete()
      .eq('id', id);

    if (!error) return { success: true };
  } catch {}

  return { success: false, error: 'db_unavailable' };
}
