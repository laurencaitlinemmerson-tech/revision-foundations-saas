import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

interface StationProgress {
  stationId: string;
  score: number;
  attempts: number;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let stations: StationProgress[];
  try {
    const body = await req.json();
    stations = body.stations;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(stations) || stations.length === 0) {
    return NextResponse.json({ ok: true, synced: 0 });
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Fetch existing records for this user's stations in one query
  const stationIds = stations.map((s) => s.stationId);
  const { data: existing } = await supabase
    .from('osce_progress')
    .select('station_id, attempts, best_score')
    .eq('clerk_user_id', userId)
    .in('station_id', stationIds);

  const existingMap = new Map(
    (existing ?? []).map((r) => [r.station_id, r]),
  );

  const rows = stations.map((s) => {
    const prev = existingMap.get(s.stationId);
    return {
      clerk_user_id: userId,
      station_id: s.stationId,
      attempts: (prev?.attempts ?? 0) + s.attempts,
      best_score: Math.max(prev?.best_score ?? 0, s.score),
      last_attempted_at: now,
    };
  });

  const { error } = await supabase
    .from('osce_progress')
    .upsert(rows, { onConflict: 'clerk_user_id,station_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, synced: rows.length });
}
