import { NextRequest, NextResponse } from 'next/server';
import { buildDailyBrief, renderBriefText } from '@/lib/health/dailyBrief';

/**
 * The morning brief endpoint.
 *
 * Everything the daily email needs, already reconciled — so an assistant with
 * nothing but an HTTP call can write it. `?format=text` returns the digest to
 * paste straight into a prompt; the default JSON carries the same figures for
 * anything that would rather do its own formatting.
 *
 * Auth mirrors the sync endpoint: a bearer token is the intended route (a token
 * in a query string ends up in logs and history), with the operator password
 * accepted so the dashboard can call it with what it already holds.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const syncToken = process.env.OPERATOR_SYNC_TOKEN;

  if (syncToken) {
    const bearer = req.headers.get('authorization') ?? '';
    if (bearer === `Bearer ${syncToken}`) return true;
    if (new URL(req.url).searchParams.get('token') === syncToken) return true;
  }

  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

function numberParam(value: string | null) {
  if (value === null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const format = params.get('format') ?? 'json';

  try {
    const brief = await buildDailyBrief({
      today: params.get('date') ?? undefined,
      goalWeeklyLossKg: numberParam(params.get('goal')),
      historyDays: numberParam(params.get('history')),
    });

    if (format === 'text' || format === 'txt') {
      return new NextResponse(renderBriefText(brief), {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    }

    return NextResponse.json(
      { brief, text: renderBriefText(brief) },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    /* A brief that quietly returns zeroes is worse than one that admits it
       failed — the email would read as a genuinely terrible day. */
    return NextResponse.json(
      { error: 'brief_failed', detail: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    );
  }
}
