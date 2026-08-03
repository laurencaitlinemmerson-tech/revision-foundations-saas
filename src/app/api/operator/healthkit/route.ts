import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';
import { buildDayRows, buildWorkoutRows } from '@/lib/operator/ingestColumns';
import { mapHealthAutoExport } from '@/lib/operator/healthkit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/* ============================================================
   Apple Health sync — Health Auto Export's REST API automation
   ============================================================
   In the app: Automations → new REST API automation →

     URL:     https://<your-domain>/api/operator/healthkit
     Method:  POST
     Header:  Authorization: Bearer <OPERATOR_ACCESS_KEY>
     Body:    JSON (the app's default export format)

   Set it to run automatically (hourly is plenty) or trigger "Sync Now"
   for a manual test. See mapHealthAutoExport() for exactly which
   metrics are recognised — the response below reports any that
   weren't, so a naming mismatch is visible rather than silent.
   ============================================================ */

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess())) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'invalid_json' }, { status: 400 });

  const { days, workouts, metricsSeen, unmatchedMetrics } = mapHealthAutoExport(body);

  if (!days.length && !workouts.length) {
    return NextResponse.json(
      { ok: false, error: 'nothing_recognised', metricsSeen, unmatchedMetrics },
      { status: 200 },
    );
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let daysWritten = 0;
  let workoutsWritten = 0;

  if (days.length) {
    const rows = buildDayRows(days);
    const { error } = await supabase.from('operator_daily_metrics').upsert(rows, { onConflict: 'date' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    daysWritten = rows.length;
  }

  if (workouts.length) {
    const rows = buildWorkoutRows(workouts, 'health_auto_export');
    const { error } = await supabase
      .from('operator_workouts')
      .upsert(rows, { onConflict: 'started_at,type' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    workoutsWritten = rows.length;
  }

  return NextResponse.json({ ok: true, daysWritten, workoutsWritten, metricsSeen, unmatchedMetrics });
}

/** GET as a plain reachability check — hitting the URL in a browser
 *  should not need a real HealthKit export to confirm the route exists. */
export async function GET() {
  if (!(await hasOperatorAccess())) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, message: 'POST a Health Auto Export payload here.' });
}
