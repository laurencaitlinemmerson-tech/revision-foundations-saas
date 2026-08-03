import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Lift logging. HealthKit workouts carry duration/energy/heart-rate but
   no rep or load detail, so "total weight moved" and personal bests can
   only exist if sets are logged by hand. A set is appended to the day's
   Strength workout (creating one if it doesn't exist yet) — noon UTC is
   used as a stable timestamp so repeat adds on the same day land on the
   same row, keyed by the (started_at, type) constraint the sync tables
   already use. */

const bodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.string().min(1).max(40).default('Strength'),
  move: z.string().min(1).max(80),
  loadKg: z.number().min(0).max(600),
  reps: z.number().int().min(1).max(200),
});

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_set', issues: parsed.error.issues }, { status: 400 });
  }

  const { date, type, move, loadKg, reps } = parsed.data;
  const startedAt = `${date}T12:00:00.000Z`;

  const { data: existing } = await supabase
    .from('operator_workouts')
    .select('raw')
    .eq('started_at', startedAt)
    .eq('type', type)
    .maybeSingle();

  const priorSets = Array.isArray((existing?.raw as { sets?: unknown })?.sets)
    ? ((existing?.raw as { sets: unknown[] }).sets as { move: string; loadKg: number; reps: number }[])
    : [];

  const sets = [...priorSets, { move, loadKg, reps }];

  const { error } = await supabase.from('operator_workouts').upsert(
    [
      {
        started_at: startedAt,
        type,
        source: 'manual',
        raw: { sets },
      },
    ],
    { onConflict: 'started_at,type' },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, sets }, { status: 201 });
}
