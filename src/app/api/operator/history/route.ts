import { NextRequest, NextResponse } from 'next/server';
import { findWhatWorked, type DayRow, type WeighRow, type WorkoutRow } from '@/lib/health/whatWorked';
import { FITNESS_FALLBACK_TYPE } from '@/lib/operatorFitnessStorage';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * The whole record, analysed on the server.
 *
 * Eight years is two thousand days and six hundred weigh-ins. Sending all of it
 * to the browser so the dashboard can re-derive the same findings on every
 * render would be wasteful twice over, so the analysis runs here and only its
 * conclusions travel. Everything it reads is already behind the operator
 * password, which is what this route checks.
 */

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

/** Supabase caps a select at a thousand rows, and the record is longer. */
async function all<T>(table: string, select: string, order: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabaseAdmin
      .from(table).select(select).order(order).range(from, from + 999);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as T[];
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const days = await all<DayRow>(
      'operator_daily_metrics',
      'date,steps,active_energy_kcal,exercise_minutes,dietary_energy_kcal,protein_g,sleep_total_min,resting_hr',
      'date',
    );
    const weighIns = await all<WeighRow>('operator_fitness_readings', 'date,weight', 'date');

    // Weigh-ins parked in the workouts table under the fallback type are not
    // sessions, and counting them would put a session on every weighing day.
    const raw = await all<WorkoutRow>('operator_workouts', 'started_at,type', 'started_at');
    const workouts = raw.filter((w) => w.type !== FITNESS_FALLBACK_TYPE);

    return NextResponse.json({ findings: findWhatWorked(days, weighIns, workouts) });
  } catch {
    return NextResponse.json({ findings: null, setup_required: true });
  }
}
