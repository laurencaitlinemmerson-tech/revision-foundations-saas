import { NextRequest, NextResponse } from 'next/server';
import { deleteLift, listLifts, saveLift } from '@/lib/operatorLiftStorage';

/** The lift log — the only operator data that is entered rather than synced. */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const from = new URL(req.url).searchParams.get('from') ?? undefined;
  const { lifts, setupRequired } = await listLifts(from);
  return NextResponse.json({ lifts, setup_required: setupRequired });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { lift, error, setupRequired } = await saveLift({
    performedOn: String(body.performedOn ?? new Date().toISOString().slice(0, 10)),
    exercise: String(body.exercise ?? ''),
    sets: Array.isArray(body.sets) ? body.sets : [],
    note: body.note == null ? null : String(body.note),
  });

  if (!lift) {
    return NextResponse.json(
      { error: error ?? 'save_failed', setup_required: setupRequired },
      { status: error === 'nothing_to_save' ? 400 : 500 },
    );
  }
  return NextResponse.json({ lift });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const { ok } = await deleteLift(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
