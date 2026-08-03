import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';
import { buildDayRows, buildWorkoutRows } from '@/lib/operator/ingestColumns';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ============================================================
   Daily metrics + workout ingest
   ============================================================
   The endpoint a hand-built automation posts to — a Shortcut, a
   script. Authorise with the access key as a bearer token, or as a
   `?k=` query param when the caller can't set custom headers:

     curl -X POST https://<site>/api/operator/ingest \
       -H "Authorization: Bearer $OPERATOR_ACCESS_KEY" \
       -H "Content-Type: application/json" \
       -d '{"days":[{"date":"2026-08-03","steps":9120,"sleepTotalMin":431}]}'

   Every field is optional beyond the date, and only the fields present
   are written — a partial sync never blanks yesterday's numbers.
   ============================================================ */

const daySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  steps: z.number().min(0).max(200_000).nullish(),
  activeEnergyKcal: z.number().min(0).max(20_000).nullish(),
  exerciseMinutes: z.number().min(0).max(1440).nullish(),
  standHours: z.number().min(0).max(24).nullish(),
  distanceKm: z.number().min(0).max(500).nullish(),

  restingHr: z.number().min(20).max(200).nullish(),
  hrvMs: z.number().min(0).max(500).nullish(),
  walkingHrAvg: z.number().min(20).max(250).nullish(),
  vo2Max: z.number().min(0).max(100).nullish(),

  sleepTotalMin: z.number().min(0).max(1440).nullish(),
  sleepInBedMin: z.number().min(0).max(1440).nullish(),
  sleepRemMin: z.number().min(0).max(1440).nullish(),
  sleepDeepMin: z.number().min(0).max(1440).nullish(),
  sleepCoreMin: z.number().min(0).max(1440).nullish(),
  sleepAwakeMin: z.number().min(0).max(1440).nullish(),

  dietaryEnergyKcal: z.number().min(0).max(20_000).nullish(),
  proteinG: z.number().min(0).max(1000).nullish(),
  carbsG: z.number().min(0).max(2000).nullish(),
  fatG: z.number().min(0).max(1000).nullish(),
  fiberG: z.number().min(0).max(500).nullish(),
  sugarG: z.number().min(0).max(2000).nullish(),
  waterMl: z.number().min(0).max(20_000).nullish(),
});

const workoutSchema = z.object({
  startedAt: z.string().min(10),
  endedAt: z.string().min(10).nullish(),
  type: z.string().min(1).max(80),
  durationMin: z.number().min(0).max(1440).nullish(),
  energyKcal: z.number().min(0).max(20_000).nullish(),
  avgHr: z.number().min(20).max(250).nullish(),
  maxHr: z.number().min(20).max(250).nullish(),
  distanceKm: z.number().min(0).max(500).nullish(),
});

const payloadSchema = z
  .object({
    days: z.array(daySchema).max(400).optional(),
    workouts: z.array(workoutSchema).max(400).optional(),
  })
  .refine((value) => value.days?.length || value.workouts?.length, {
    message: 'payload must include days or workouts',
  });

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { days = [], workouts = [] } = parsed.data;

  let daysWritten = 0;
  let workoutsWritten = 0;

  if (days.length) {
    // Only send the keys actually present, so a partial sync merges
    // into the existing row instead of nulling the rest of the day.
    const rows = buildDayRows(days);
    const { error } = await supabase.from('operator_daily_metrics').upsert(rows, { onConflict: 'date' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    daysWritten = rows.length;
  }

  if (workouts.length) {
    const rows = buildWorkoutRows(workouts, 'ingest');
    const { error } = await supabase
      .from('operator_workouts')
      .upsert(rows, { onConflict: 'started_at,type' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    workoutsWritten = rows.length;
  }

  return NextResponse.json({ ok: true, daysWritten, workoutsWritten });
}
