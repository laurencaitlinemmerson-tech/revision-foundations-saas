import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { buildDailyBrief, renderBriefText, renderWeeklyText } from '@/lib/health/dailyBrief';

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

/**
 * A read-only credential for this endpoint, derived from the sync token.
 *
 * The scheduled job that writes the morning email needs to read one summary. It
 * does not need OPERATOR_SYNC_TOKEN, which also authorises POSTs to the
 * auto-sync route and can therefore overwrite the health history it is meant to
 * be reporting on. Deriving a token by HMAC gives that job a credential scoped
 * to this route alone, with no second environment variable to configure and
 * nothing that can be reversed back into the writing key.
 *
 * Rotating it means rotating OPERATOR_SYNC_TOKEN — an acceptable trade for
 * needing no extra setup, since the phone's sync config is the only other
 * holder.
 */
export function deriveBriefToken(syncToken: string) {
  return createHmac('sha256', syncToken).update('health-brief-v1').digest('hex');
}

function constantTimeEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function authed(req: NextRequest) {
  const syncToken = process.env.OPERATOR_SYNC_TOKEN;

  if (syncToken) {
    const presented = (req.headers.get('authorization') ?? '').replace(/^Bearer /, '');
    const queryToken = new URL(req.url).searchParams.get('token') ?? '';

    /* The derived read-only token — what the email scheduler should hold. */
    const briefToken = deriveBriefToken(syncToken);
    if (presented && constantTimeEquals(presented, briefToken)) return true;
    if (queryToken && constantTimeEquals(queryToken, briefToken)) return true;

    /* The write token still works, so the phone and any existing caller are
       unaffected by the addition above. */
    if (presented && constantTimeEquals(presented, syncToken)) return true;
    if (queryToken && constantTimeEquals(queryToken, syncToken)) return true;
  }

  const pw = req.headers.get('x-operator-pw') ?? '';
  return constantTimeEquals(pw, process.env.OPERATOR_PASSWORD ?? 'operator2026');
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

    /* ?period=week swaps the digest for the weekly roll-up. The JSON payload
       carries both regardless, so one fetch can serve either email. */
    const weekly = params.get('period') === 'week';
    const digest = weekly ? renderWeeklyText(brief) : renderBriefText(brief);

    if (format === 'text' || format === 'txt') {
      return new NextResponse(digest, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    }

    return NextResponse.json(
      { brief, text: digest, dailyText: renderBriefText(brief), weeklyText: renderWeeklyText(brief) },
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
