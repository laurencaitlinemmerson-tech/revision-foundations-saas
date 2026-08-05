import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Lift log storage.
 *
 * Apple Health knows a workout happened but not what was lifted in it, so this
 * is the one part of the dashboard that is entered by hand. Everything the
 * Training tab claims about volume and personal bests comes from here.
 */

export type LiftSet = { reps: number; weightKg: number };

export interface LiftInput {
  performedOn: string;
  exercise: string;
  sets: LiftSet[];
  note?: string | null;
}

export interface LiftRecord extends LiftInput {
  id: string;
  /** sets x reps x load, in kg. */
  volumeKg: number;
  /** Best estimated one-rep max across the sets, by Epley. */
  e1rmKg: number;
  /** Heaviest load moved for at least one rep. */
  topSetKg: number;
}

type LiftRow = {
  id: string;
  performed_on: string;
  exercise: string;
  sets: unknown;
  note: string | null;
};

const MAX_REPS = 100;
const MAX_LOAD_KG = 500;

function num(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Epley: a rep count above ~12 stops predicting a true max, so it is capped. */
export function epley(reps: number, weightKg: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + Math.min(reps, 12) / 30);
}

export function normaliseSets(raw: unknown): LiftSet[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return { reps: Math.round(num(o.reps)), weightKg: num(o.weightKg) };
    })
    .filter((s) => s.reps > 0 && s.reps <= MAX_REPS && s.weightKg >= 0 && s.weightKg <= MAX_LOAD_KG);
}

function fromRow(row: LiftRow): LiftRecord {
  const sets = normaliseSets(row.sets);
  return {
    id: row.id,
    performedOn: String(row.performed_on).slice(0, 10),
    exercise: row.exercise,
    sets,
    note: row.note,
    volumeKg: Math.round(sets.reduce((a, s) => a + s.reps * s.weightKg, 0)),
    e1rmKg: Math.round(Math.max(0, ...sets.map((s) => epley(s.reps, s.weightKg))) * 10) / 10,
    topSetKg: Math.max(0, ...sets.map((s) => s.weightKg)),
  };
}

export async function listLifts(fromDate?: string) {
  try {
    let query = supabaseAdmin
      .from('operator_lifts')
      .select('*')
      .order('performed_on', { ascending: true });
    if (fromDate) query = query.gte('performed_on', fromDate);

    const { data, error } = await query;
    if (error) return { lifts: [] as LiftRecord[], setupRequired: true };
    return { lifts: (data ?? []).map((r) => fromRow(r as LiftRow)), setupRequired: false };
  } catch {
    return { lifts: [] as LiftRecord[], setupRequired: true };
  }
}

export async function saveLift(input: LiftInput) {
  const sets = normaliseSets(input.sets);
  if (!input.exercise.trim() || !sets.length) {
    return { lift: null, error: 'nothing_to_save', setupRequired: false };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_lifts')
      .insert({
        performed_on: input.performedOn.slice(0, 10),
        exercise: input.exercise.trim(),
        sets,
        note: input.note?.trim() || null,
      })
      .select('*')
      .single();

    if (error || !data) return { lift: null, error: error?.message ?? 'insert_failed', setupRequired: true };
    return { lift: fromRow(data as LiftRow), error: null, setupRequired: false };
  } catch (e) {
    return { lift: null, error: String(e).slice(0, 120), setupRequired: true };
  }
}

export async function deleteLift(id: string) {
  try {
    const { error } = await supabaseAdmin.from('operator_lifts').delete().eq('id', id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
