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
    id: row.id as string,
    startedAt: row.started_at as string,
    endedAt: (row.ended_at as string | null) ?? null,
    type: (row.type as string | null) ?? null,
    durationMin: num(row.duration_min),
    energyKcal: num(row.energy_kcal),
    avgHr: num(row.avg_hr),
    maxHr: num(row.max_hr),
    distanceKm: num(row.distance_km),
    source: (row.source as string | null) ?? null,
  };
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '200'), 1000);

  try {
    let query = supabaseAdmin
      .from('operator_workouts')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (from) query = query.gte('started_at', from);
    if (to) query = query.lte('started_at', to);

    const { data, error } = await query;
    if (error) return NextResponse.json({ workouts: [], setup_required: true });
    return NextResponse.json({ workouts: (data ?? []).map(fromRow) });
  } catch {
    return NextResponse.json({ workouts: [], setup_required: true });
  }
}
