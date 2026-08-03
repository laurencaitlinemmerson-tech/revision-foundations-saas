import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* The single operator_settings row — targets and body profile. Every
   field is optional so the quick-edit row on the dashboard can send
   just what changed. */

const settingsSchema = z.object({
  heightCm: z.number().min(100).max(230).optional(),
  ageYears: z.number().min(13).max(100).optional(),
  sex: z.enum(['female', 'male']).optional(),
  targetWeightKg: z.number().min(35).max(300).optional(),
  weeklyChangeKg: z.number().min(-2).max(2).optional(),
  neatFactor: z.number().min(0).max(1).optional(),
  proteinTargetG: z.number().min(0).max(500).optional(),
  stepTarget: z.number().min(0).max(100000).optional(),
  sleepTargetMin: z.number().min(0).max(1440).optional(),
  waterTargetMl: z.number().min(0).max(20000).optional(),
});

const COLUMNS: Record<string, string> = {
  heightCm: 'height_cm',
  ageYears: 'age_years',
  sex: 'sex',
  targetWeightKg: 'target_weight_kg',
  weeklyChangeKg: 'weekly_change_kg',
  neatFactor: 'neat_factor',
  proteinTargetG: 'protein_target_g',
  stepTarget: 'step_target',
  sleepTargetMin: 'sleep_target_min',
  waterTargetMl: 'water_target_ml',
};

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess())) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_settings', issues: parsed.error.issues }, { status: 400 });
  }

  const row: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() };
  for (const [field, column] of Object.entries(COLUMNS)) {
    const value = (parsed.data as Record<string, unknown>)[field];
    if (value !== undefined) row[column] = value;
  }

  const { error } = await supabase.from('operator_settings').upsert([row], { onConflict: 'id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
