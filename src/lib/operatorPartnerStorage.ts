import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Partner daily summary storage.
 *
 * The head-to-head screen needs two people, but only one of them syncs Apple
 * Health here. This is the other side — a short daily summary carrying just the
 * fields the comparison reads. Everything is nullable, because a day that was
 * only half filled in is still worth comparing on the half that was.
 */

export type PartnerDay = {
  date: string;
  person: string;
  steps: number | null;
  gymSessions: number | null;
  runs: number | null;
  caloriesIn: number | null;
  caloriesOut: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  sleepMin: number | null;
  weightKg: number | null;
  bodyFat: number | null;
  note: string | null;
};

type PartnerRow = {
  date: string;
  person: string;
  steps: number | null;
  gym_sessions: number | null;
  runs: number | null;
  calories_in: number | null;
  calories_out: number | null;
  protein_g: number | string | null;
  carbs_g: number | string | null;
  fat_g: number | string | null;
  sleep_min: number | null;
  weight_kg: number | string | null;
  body_fat: number | string | null;
  note: string | null;
};

/** Postgres returns NUMERIC as a string; a blank stays missing rather than zero. */
const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function fromRow(row: PartnerRow): PartnerDay {
  return {
    date: String(row.date).slice(0, 10),
    person: row.person,
    steps: num(row.steps),
    gymSessions: num(row.gym_sessions),
    runs: num(row.runs),
    caloriesIn: num(row.calories_in),
    caloriesOut: num(row.calories_out),
    proteinG: num(row.protein_g),
    carbsG: num(row.carbs_g),
    fatG: num(row.fat_g),
    sleepMin: num(row.sleep_min),
    weightKg: num(row.weight_kg),
    bodyFat: num(row.body_fat),
    note: row.note,
  };
}

export async function listPartnerDays(fromDate?: string) {
  try {
    let query = supabaseAdmin
      .from('operator_partner_days')
      .select('*')
      .order('date', { ascending: true });
    if (fromDate) query = query.gte('date', fromDate);

    const { data, error } = await query;
    if (error) return { days: [] as PartnerDay[], setupRequired: true };
    return { days: (data ?? []).map((r) => fromRow(r as PartnerRow)), setupRequired: false };
  } catch {
    return { days: [] as PartnerDay[], setupRequired: true };
  }
}

export type PartnerInput = Partial<Omit<PartnerDay, 'date' | 'person'>> & {
  date: string;
  person?: string;
};

/**
 * Write one day, replacing whatever was there for that person and date.
 *
 * These rows get re-sent as a day fills in — steps in the morning, macros after
 * dinner — so an upsert is the right shape; a second send should correct the
 * day rather than create a rival copy of it.
 */
export async function savePartnerDay(input: PartnerInput) {
  const date = input.date.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { day: null, error: 'bad_date', setupRequired: false };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_partner_days')
      .upsert(
        {
          person: (input.person ?? 'partner').trim() || 'partner',
          date,
          steps: input.steps ?? null,
          gym_sessions: input.gymSessions ?? null,
          runs: input.runs ?? null,
          calories_in: input.caloriesIn ?? null,
          calories_out: input.caloriesOut ?? null,
          protein_g: input.proteinG ?? null,
          carbs_g: input.carbsG ?? null,
          fat_g: input.fatG ?? null,
          sleep_min: input.sleepMin ?? null,
          weight_kg: input.weightKg ?? null,
          body_fat: input.bodyFat ?? null,
          note: input.note?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'person,date' },
      )
      .select('*')
      .single();

    if (error || !data) {
      return { day: null, error: error?.message ?? 'upsert_failed', setupRequired: true };
    }
    return { day: fromRow(data as PartnerRow), error: null, setupRequired: false };
  } catch (e) {
    return { day: null, error: String(e).slice(0, 120), setupRequired: true };
  }
}
