import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Cross-device operator state: a tiny key/value store (see
 * supabase-operator-state.sql). Ticks, notes and logs live here so the phone and
 * the laptop agree.
 *
 * GET  -> every key with its value and updatedAt
 * PUT  -> { key, value } upserts one key (last write wins)
 *
 * `setup_required` means the table has not been created yet; the client keeps
 * working from localStorage until it is.
 */

export const dynamic = 'force-dynamic';

const KEY_RE = /^[a-z0-9._:-]{1,80}$/;
const MAX_BYTES = 200_000;

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin.from('operator_state').select('key,value,updated_at');
    if (error) return NextResponse.json({ state: {}, setup_required: true });
    const state: Record<string, { value: unknown; updatedAt: string }> = {};
    for (const row of data ?? []) state[row.key as string] = { value: row.value, updatedAt: row.updated_at as string };
    return NextResponse.json({ state, setup_required: false });
  } catch {
    return NextResponse.json({ state: {}, setup_required: true });
  }
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { key?: unknown; value?: unknown };
  const key = String(body.key ?? '');
  if (!KEY_RE.test(key)) return NextResponse.json({ error: 'bad_key' }, { status: 400 });
  if (body.value === undefined) return NextResponse.json({ error: 'missing_value' }, { status: 400 });
  if (JSON.stringify(body.value).length > MAX_BYTES) return NextResponse.json({ error: 'too_large' }, { status: 413 });

  try {
    const updatedAt = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from('operator_state')
      .upsert({ key, value: body.value, updated_at: updatedAt }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: 'setup_required', setup_required: true }, { status: 503 });
    return NextResponse.json({ ok: true, updatedAt });
  } catch {
    return NextResponse.json({ error: 'setup_required', setup_required: true }, { status: 503 });
  }
}
