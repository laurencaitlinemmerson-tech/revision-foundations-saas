import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

function fromRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    date: row.date as string,
    weight: Number(row.weight),
    bmi: Number(row.bmi),
    bodyFat: Number(row.body_fat),
    water: Number(row.water),
    muscleMass: Number(row.muscle_mass),
    boneMass: Number(row.bone_mass),
  };
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .select('*')
      .order('date', { ascending: true });
    if (error) return NextResponse.json({ readings: [], setup_required: true });
    return NextResponse.json({ readings: (data ?? []).map(fromRow) });
  } catch {
    return NextResponse.json({ readings: [], setup_required: true });
  }
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .insert([{
        date: body.date,
        weight: body.weight,
        bmi: body.bmi,
        body_fat: body.bodyFat,
        water: body.water,
        muscle_mass: body.muscleMass,
        bone_mass: body.boneMass,
      }])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message, setup_required: true }, { status: 500 });
    return NextResponse.json({ reading: fromRow(data as Record<string, unknown>) });
  } catch {
    return NextResponse.json({ error: 'db_unavailable', setup_required: true }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const { error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .delete()
      .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
  }
}
