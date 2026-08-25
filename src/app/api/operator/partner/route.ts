import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { listPartnerDays, savePartnerDay } from '@/lib/operatorPartnerStorage';
import { partnerHealthImport } from '@/lib/partnerHealthImport';

/**
 * The partner's daily summary — the second side of the head-to-head screen.
 *
 * POST accepts two shapes:
 *   • a plain day  { person, date, steps, gymSessions, ... }
 *   • a Health Auto Export payload  { data: { metrics: [...], workouts: [...] } }
 *
 * The second one matters: the partner's watch is a Garmin, which has no
 * self-serve personal API, so the working route is Garmin Connect → Apple Health
 * → Health Auto Export. Accepting that payload verbatim means his phone runs the
 * same app as the operator's, pointed at this URL instead.
 *
 * Writes are authorised by a token derived for this route alone — see
 * derivePartnerToken. Reads still need the operator password, because the
 * dashboard is the only thing that reads.
 */

export const dynamic = 'force-dynamic';

/**
 * A write credential for this route alone, derived from the sync token.
 *
 * This is the one endpoint whose credential gets handed to another person, and
 * OPERATOR_SYNC_TOKEN is far too much to hand over: it also authorises POSTs to
 * the auto-sync route, which would let the holder overwrite the operator's own
 * health history, and it reads the morning brief. Deriving a token by HMAC gives
 * the partner's phone something that only works here and cannot be reversed back
 * into the writing key — the same trade the brief route already makes, with no
 * extra environment variable to keep in sync.
 *
 * Rotating it means rotating OPERATOR_SYNC_TOKEN, which also re-points the
 * operator's own phone — so rotate both together.
 */
export function derivePartnerToken(syncToken: string) {
  return createHmac('sha256', syncToken).update('partner-sync-v1').digest('hex');
}

function constantTimeEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** The partner's phone posts with the derived token; the operator's own tooling
 *  and the dashboard keep working with what they already hold. */
function authedWrite(req: NextRequest) {
  const syncToken = process.env.OPERATOR_SYNC_TOKEN;

  if (syncToken) {
    const presented = (req.headers.get('authorization') ?? '').replace(/^Bearer /, '');
    const queryToken = new URL(req.url).searchParams.get('token') ?? '';

    /* What the partner's phone holds — scoped to this route. */
    const partnerToken = derivePartnerToken(syncToken);
    if (presented && constantTimeEquals(presented, partnerToken)) return true;
    if (queryToken && constantTimeEquals(queryToken, partnerToken)) return true;

    /* The operator's own write token still works, so existing callers are
       unaffected by the addition above. */
    if (presented && constantTimeEquals(presented, syncToken)) return true;
    if (queryToken && constantTimeEquals(queryToken, syncToken)) return true;
  }

  const pw = req.headers.get('x-operator-pw') ?? '';
  const expected = process.env.OPERATOR_PASSWORD ?? 'operator2026';
  return Boolean(pw) && constantTimeEquals(pw, expected);
}

function authedRead(req: NextRequest) {
  return req.headers.get('x-operator-pw') === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authedRead(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const from = new URL(req.url).searchParams.get('from') ?? undefined;
  const { days, setupRequired } = await listPartnerDays(from);
  return NextResponse.json({ days, setup_required: setupRequired });
}

export async function POST(req: NextRequest) {
  if (!authedWrite(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // The person is named on the URL for the phone, in the body for a manual post.
  const person =
    new URL(req.url).searchParams.get('person') ??
    (body.person == null ? 'partner' : String(body.person));

  const looksLikeExport =
    (body.data && typeof body.data === 'object') || Array.isArray(body.metrics);

  if (looksLikeExport) {
    const rows = partnerHealthImport(body, person);
    if (!rows.length) {
      return NextResponse.json({ imported: 0, note: 'No recognised metrics in that payload.' });
    }

    let imported = 0;
    let setupRequired = false;
    let lastError: string | null = null;
    for (const row of rows) {
      const { day, error, setupRequired: needsSetup } = await savePartnerDay(row);
      if (day) imported++;
      else {
        lastError = error ?? 'save_failed';
        setupRequired ||= needsSetup;
      }
    }

    return NextResponse.json(
      { imported, days: rows.length, person, setup_required: setupRequired, error: lastError },
      { status: imported ? 200 : 500 },
    );
  }

  const pick = (k: string) => {
    const v = body[k];
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const { day, error, setupRequired } = await savePartnerDay({
    date: String(body.date ?? new Date().toISOString().slice(0, 10)),
    person,
    steps: pick('steps'),
    gymSessions: pick('gymSessions'),
    runs: pick('runs'),
    caloriesIn: pick('caloriesIn'),
    caloriesOut: pick('caloriesOut'),
    proteinG: pick('proteinG'),
    carbsG: pick('carbsG'),
    fatG: pick('fatG'),
    sleepMin: pick('sleepMin'),
    weightKg: pick('weightKg'),
    bodyFat: pick('bodyFat'),
    note: body.note == null ? null : String(body.note),
  });

  if (!day) {
    return NextResponse.json(
      { error: error ?? 'save_failed', setup_required: setupRequired },
      { status: error === 'bad_date' ? 400 : 500 },
    );
  }
  return NextResponse.json({ day });
}
