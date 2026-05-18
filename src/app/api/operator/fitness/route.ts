import { NextRequest, NextResponse } from 'next/server';
import {
  deleteFitnessReading,
  listFitnessReadings,
  saveFitnessReading,
} from '@/lib/operatorFitnessStorage';
import { isPlausibleWeightKg } from '@/lib/fitnessValidation';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await listFitnessReadings();
    return NextResponse.json({ readings: result.readings, setup_required: result.setupRequired });
  } catch {
    return NextResponse.json({ readings: [], setup_required: true });
  }
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const weight = Number(body.weight);
  if (!isPlausibleWeightKg(weight)) {
    return NextResponse.json({ error: 'weight_out_of_range' }, { status: 400 });
  }
  try {
    const result = await saveFitnessReading({
      date: body.date,
      weight,
      bmi: Number(body.bmi),
      bodyFat: Number(body.bodyFat),
      water: Number(body.water),
      muscleMass: Number(body.muscleMass),
      boneMass: Number(body.boneMass),
    });

    if (!result.reading) {
      return NextResponse.json({ error: result.error ?? 'db_unavailable', setup_required: result.setupRequired }, { status: 500 });
    }

    return NextResponse.json({ reading: result.reading });
  } catch {
    return NextResponse.json({ error: 'db_unavailable', setup_required: true }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const all = url.searchParams.get('all') === '1';

  if (all) {
    try {
      const current = await listFitnessReadings();
      let deleted = 0;
      for (const r of current.readings) {
        const result = await deleteFitnessReading(r.id);
        if (result.success) deleted++;
      }
      return NextResponse.json({ success: true, deleted });
    } catch {
      return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
    }
  }

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const result = await deleteFitnessReading(id);
    if (!result.success) return NextResponse.json({ error: result.error ?? 'db_unavailable' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
  }
}
