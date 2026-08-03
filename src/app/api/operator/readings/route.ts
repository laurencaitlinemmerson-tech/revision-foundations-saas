import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Body-composition readings. Authorised by the dashboard cookie, by the
   access key as a bearer token, or by `?k=` in the URL — so a phone
   shortcut or automation can post here without setting a header. */

const readingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  // 35–300 kg keeps a mistyped or unit-confused entry out of the trend.
  weight: z.number().min(35).max(300),
  bmi: z.number().min(0).max(100).optional(),
  bodyFat: z.number().min(0).max(100).optional(),
  water: z.number().min(0).max(100).optional(),
  muscleMass: z.number().min(0).max(100).optional(),
  boneMass: z.number().min(0).max(20).optional(),
});

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const { data, error } = await supabase
    .from('operator_fitness_readings')
    .select('*')
    .order('date', { ascending: false })
    .limit(365);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ readings: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const parsed = readingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_reading', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const reading = parsed.data;

  // One reading per day: a re-weigh replaces rather than appends.
  const { data, error } = await supabase
    .from('operator_fitness_readings')
    .upsert(
      [
        {
          date: reading.date,
          weight: reading.weight,
          bmi: reading.bmi ?? 0,
          body_fat: reading.bodyFat ?? 0,
          water: reading.water ?? 0,
          muscle_mass: reading.muscleMass ?? 0,
          bone_mass: reading.boneMass ?? 0,
        },
      ],
      { onConflict: 'date' },
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ reading: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  const { error } = await supabase.from('operator_fitness_readings').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
