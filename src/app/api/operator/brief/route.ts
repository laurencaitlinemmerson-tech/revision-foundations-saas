import { NextRequest, NextResponse } from 'next/server';
import { buildDailyBrief } from '@/lib/health/dailyBrief';
import { JOURNEY } from '@/app/(site)/operator/training/targets';

/**
 * The daily brief, for the dashboard.
 *
 * The existing brief route is authorised by the sync token, because it was built
 * for a scheduled job that writes an email. The dashboard holds the operator
 * password instead, so rather than widening that route's credentials this one
 * calls the same builder behind the password the browser already has.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const brief = await buildDailyBrief({ goalWeeklyLossKg: JOURNEY.targetKgPerWeek });
    // Only the parts the dashboard renders; the full brief carries a month of
    // history the panel has no use for.
    return NextResponse.json(
      {
        subject: brief.subject,
        freshness: brief.freshness,
        cues: brief.cues,
        weighIn: brief.weighIn,
        energy: brief.energy,
        protein: brief.protein,
        today: brief.today,
      },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'brief_failed' },
      { status: 500 },
    );
  }
}
