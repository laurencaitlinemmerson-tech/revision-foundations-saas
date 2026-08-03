import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';
import { PHOTO_BUCKET } from '@/lib/operator/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Progress photos. Uploads land in a private bucket; the dashboard
   signs short-lived URLs server-side, so an image is never publicly
   addressable. */

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess())) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const slot = String(form?.get('slot') ?? '').trim();
  const date = String(form?.get('date') ?? '').trim();
  const weight = Number(form?.get('weight'));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file_required' }, { status: 400 });
  }
  if (!slot || !/^[a-z0-9-]{1,40}$/.test(slot)) {
    return NextResponse.json({ error: 'invalid_slot' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'invalid_date' }, { status: 400 });
  }
  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json({ error: 'unsupported_type' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${slot}/${date}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const upload = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  // One photo per frame: re-uploading a slot replaces what was there.
  const { data: existing } = await supabase
    .from('operator_photos')
    .select('path')
    .eq('slot', slot)
    .maybeSingle();

  const { error } = await supabase.from('operator_photos').upsert(
    [
      {
        slot,
        date,
        path,
        weight_kg: Number.isFinite(weight) && weight > 0 ? weight : null,
      },
    ],
    { onConflict: 'slot' },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Drop the replaced object so the bucket does not accumulate orphans.
  const previousPath = (existing as { path?: string } | null)?.path;
  if (previousPath && previousPath !== path) {
    await supabase.storage.from(PHOTO_BUCKET).remove([previousPath]).catch(() => {});
  }

  return NextResponse.json({ ok: true, slot, path }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!(await hasOperatorAccess())) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const slot = request.nextUrl.searchParams.get('slot');
  if (!slot) return NextResponse.json({ error: 'slot_required' }, { status: 400 });

  const { data } = await supabase
    .from('operator_photos')
    .select('path')
    .eq('slot', slot)
    .maybeSingle();

  const path = (data as { path?: string } | null)?.path;
  if (path) await supabase.storage.from(PHOTO_BUCKET).remove([path]).catch(() => {});

  const { error } = await supabase.from('operator_photos').delete().eq('slot', slot);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
