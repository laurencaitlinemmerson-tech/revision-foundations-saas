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
 */

export const dynamic = 'force-dynamic';

/** The phone posts with the sync token; the dashboard reads with the password. */
function authedWrite(req: NextRequest) {
  const syncToken = process.env.OPERATOR_SYNC_TOKEN;
  if (syncToken) {
    if (new URL(req.url).searchParams.get('token') === syncToken) return true;
    if (req.headers.get('authorization') === `Bearer ${syncToken}`) return true;
  }
  return req.headers.get('x-operator-pw') === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
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
