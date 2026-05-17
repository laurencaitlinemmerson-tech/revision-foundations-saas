import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

function num(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function fromRow(row: Record<string, unknown>) {
  return {
    date: row.date as string,
    activity: {
      steps: num(row.steps),
      activeEnergyKcal: num(row.active_energy_kcal),
      exerciseMinutes: num(row.exercise_minutes),
      standHours: num(row.stand_hours),
      distanceKm: num(row.distance_km),
    },
    heart: {
      restingHr: num(row.resting_hr),
      hrvMs: num(row.hrv_ms),
      walkingHrAvg: num(row.walking_hr_avg),
      vo2Max: num(row.vo2_max),
    },
    sleep: {
      totalMin: num(row.sleep_total_min),
      inBedMin: num(row.sleep_in_bed_min),
      remMin: num(row.sleep_rem_min),
      deepMin: num(row.sleep_deep_min),
      coreMin: num(row.sleep_core_min),
      awakeMin: num(row.sleep_awake_min),
    },
  };
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '365'), 730);

  try {
    let query = supabaseAdmin
      .from('operator_daily_metrics')
      .select('*')
      .order('date', { ascending: true });

    if (from) query = query.gte('date', from);
    if (to) query = query.lte('date', to);
    if (!from && !to) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return NextResponse.json({ days: [], setup_required: true });
    return NextResponse.json({ days: (data ?? []).map(fromRow) });
  } catch {
    return NextResponse.json({ days: [], setup_required: true });
  }
}
