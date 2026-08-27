import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * The intended training week.
 *
 * Nothing syncs a plan — Apple Health records what happened, never what was
 * meant to happen — so this is the only thing on the dashboard the operator
 * types in rather than earns. It is a repeating weekly template rather than a
 * dated calendar, because that is how the week is actually decided.
 */

export type PlanKind = 'strength' | 'cardio' | 'other' | 'rest';

const KINDS: PlanKind[] = ['strength', 'cardio', 'other', 'rest'];

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

type Row = { weekday: number; kind: string; label: string | null };

/** Seven days, every one present, whatever the table happens to hold. */
function wholeWeek(rows: Row[]) {
  const by = new Map(rows.map((r) => [r.weekday, r] as const));
  return Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    const row = by.get(day);
    return {
      weekday: day,
      kind: (KINDS as string[]).includes(row?.kind ?? '') ? (row!.kind as PlanKind) : 'rest',
      label: row?.label ?? null,
    };
  });
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_plan').select('weekday,kind,label').order('weekday');
    if (error) return NextResponse.json({ plan: wholeWeek([]), setup_required: true });
    return NextResponse.json({ plan: wholeWeek((data ?? []) as Row[]), setup_required: false });
  } catch {
    return NextResponse.json({ plan: wholeWeek([]), setup_required: true });
  }
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { weekday?: unknown; kind?: unknown; label?: unknown };
  const weekday = Number(body.weekday);
  const kind = String(body.kind ?? '');

  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    return NextResponse.json({ error: 'bad_weekday' }, { status: 400 });
  }
  if (!(KINDS as string[]).includes(kind)) {
    return NextResponse.json({ error: 'bad_kind' }, { status: 400 });
  }

  // A label is a note to self, not a field anything parses, so it is trimmed to
  // something that fits a cell rather than validated.
  const label = body.label == null ? null : String(body.label).trim().slice(0, 40) || null;

  try {
    const { error } = await supabaseAdmin
      .from('operator_plan')
      .upsert({ weekday, kind, label, updated_at: new Date().toISOString() }, { onConflict: 'weekday' });
    if (error) return NextResponse.json({ ok: false, setup_required: true }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, setup_required: true }, { status: 500 });
  }
}
