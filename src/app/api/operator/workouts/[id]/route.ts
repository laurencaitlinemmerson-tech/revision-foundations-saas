import { NextRequest, NextResponse } from 'next/server';
import { parseSessionDetail } from '@/lib/health/sessionDetail';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * One session, with the per-minute record parsed out of it.
 *
 * The list route deliberately never returns `raw`: a single session's payload
 * carries a sample a minute for heart rate, energy and steps, and putting that
 * on every row of a year of workouts would be megabytes to render a table. It is
 * fetched here, one session at a time, when a session is actually opened.
 */

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_workouts')
      .select('id,started_at,ended_at,type,source,duration_min,energy_kcal,avg_hr,max_hr,distance_km,raw')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ detail: null }, { status: error ? 500 : 404 });

    return NextResponse.json({
      detail: parseSessionDetail(data.raw),
      summary: {
        id: data.id,
        startedAt: data.started_at,
        endedAt: data.ended_at,
        type: data.type,
        source: data.source,
        durationMin: data.duration_min,
        energyKcal: data.energy_kcal,
        avgHr: data.avg_hr,
        maxHr: data.max_hr,
        distanceKm: data.distance_km,
      },
    });
  } catch {
    return NextResponse.json({ detail: null }, { status: 500 });
  }
}
