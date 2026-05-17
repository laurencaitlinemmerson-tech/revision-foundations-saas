import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type FitnessRow = {
  id: string
  date: string
  weight: number
  bmi: number
  body_fat: number
  water: number
  muscle_mass: number
  bone_mass: number
}

type HealthAutoExportPoint = {
  qty?: number
  date?: string
}

type HealthAutoExportMetric = {
  name?: string
  units?: string
  data?: HealthAutoExportPoint[]
}

const DEFAULT_HEIGHT_M = 1.57;

function authed(req: NextRequest) {
  const bearer = req.headers.get('authorization') ?? '';
  const syncToken = process.env.OPERATOR_SYNC_TOKEN;
  if (syncToken && bearer === `Bearer ${syncToken}`) return true;

  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

function parseNumber(value: unknown) {
  const num = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(num) ? num : null;
}

function parseDay(value: string | undefined | null) {
  if (!value) return null;
  const matched = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return matched?.[1] ?? null;
}

function parseAt(value: string | undefined | null) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const normalized = value.replace(/ ([+-]\d{2})(\d{2})$/, 'T$1:$2').replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? Number.NEGATIVE_INFINITY : parsed.getTime();
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toPercent(value: number | null) {
  if (value === null) return 0;
  const percent = value <= 1.2 ? value * 100 : value;
  return Math.max(0, Math.min(100, round(percent, 1)));
}

function nextDay(day: string) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}

function pickMetric(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = parseNumber(source[key]);
    if (value !== null) return value;
  }
  return null;
}

function convertMassToKg(value: number, unit: string | undefined) {
  switch ((unit ?? '').toLowerCase()) {
    case 'kg':
      return value;
    case 'g':
      return value / 1000;
    case 'lb':
    case 'lbs':
      return value * 0.45359237;
    case 'oz':
      return value * 0.0283495231;
    default:
      return value;
  }
}

function convertHeightToMeters(value: number, unit: string | undefined) {
  switch ((unit ?? '').toLowerCase()) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * 0.0254;
    case 'ft':
      return value * 0.3048;
    default:
      return value;
  }
}

function latestMetricPoint(metric: HealthAutoExportMetric | undefined, day?: string | null) {
  if (!metric?.data?.length) return null;

  let best: HealthAutoExportPoint | null = null;
  let bestAt = Number.NEGATIVE_INFINITY;

  for (const point of metric.data) {
    if (point.qty === undefined || !point.date) continue;
    if (day && parseDay(point.date) !== day) continue;
    const at = parseAt(point.date);
    if (at >= bestAt) {
      best = point;
      bestAt = at;
    }
  }

  return best;
}

function parseHealthAutoExportPayload(payload: Record<string, unknown>) {
  const root = (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? payload.data
    : payload) as Record<string, unknown>;
  const metrics = Array.isArray(root.metrics) ? (root.metrics as HealthAutoExportMetric[]) : null;
  if (!metrics || metrics.length === 0) return null;

  const byName = new Map(metrics.map((metric) => [metric.name ?? '', metric]));
  const weightMetric = byName.get('weight_&_body_mass') ?? byName.get('weight') ?? byName.get('body_mass');
  const weightPoint = latestMetricPoint(weightMetric);
  if (!weightMetric || !weightPoint || weightPoint.qty === undefined || !weightPoint.date) return null;

  const day = parseDay(weightPoint.date);
  if (!day) return null;

  const weight = round(convertMassToKg(weightPoint.qty, weightMetric.units), 2);
  const heightPoint = latestMetricPoint(byName.get('height'), day);
  const heightM = heightPoint?.qty !== undefined ? convertHeightToMeters(heightPoint.qty, byName.get('height')?.units) : DEFAULT_HEIGHT_M;

  const bmiPoint = latestMetricPoint(byName.get('body_mass_index'), day);
  const bodyFatPoint = latestMetricPoint(byName.get('body_fat_percentage'), day);
  const leanMassPoint = latestMetricPoint(byName.get('lean_body_mass'), day);
  const waterMassPoint = latestMetricPoint(byName.get('body_water_mass'), day);
  const boneMassPoint = latestMetricPoint(byName.get('bone_mass'), day);

  return {
    date: day,
    weight,
    bmi: round(bmiPoint?.qty ?? weight / (heightM * heightM), 1),
    body_fat: toPercent(bodyFatPoint?.qty ?? null),
    water: waterMassPoint?.qty !== undefined ? toPercent((convertMassToKg(waterMassPoint.qty, byName.get('body_water_mass')?.units) / weight) * 100) : 0,
    muscle_mass: leanMassPoint?.qty !== undefined ? toPercent((convertMassToKg(leanMassPoint.qty, byName.get('lean_body_mass')?.units) / weight) * 100) : 0,
    bone_mass: boneMassPoint?.qty !== undefined ? round(convertMassToKg(boneMassPoint.qty, byName.get('bone_mass')?.units), 2) : 0,
  };
}

function normalisePayload(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const payload = body as Record<string, unknown>;
  const healthAutoExport = parseHealthAutoExportPayload(payload);
  if (healthAutoExport) return healthAutoExport;

  const source = (payload.reading && typeof payload.reading === 'object' && !Array.isArray(payload.reading)
    ? payload.reading
    : payload.metrics && typeof payload.metrics === 'object' && !Array.isArray(payload.metrics)
    ? payload.metrics
    : payload) as Record<string, unknown>;

  const dateValue = (source.date ?? source.recordedAt ?? source.timestamp ?? payload.date ?? payload.recordedAt) as string | undefined;
  const day = typeof dateValue === 'string' && dateValue.length >= 10
    ? dateValue.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const weight = pickMetric(source, ['weight', 'bodyWeight', 'weightKg']);
  if (!weight) return null;

  const heightM = pickMetric(source, ['heightM', 'height']) ?? DEFAULT_HEIGHT_M;
  const bmi = pickMetric(source, ['bmi', 'bodyMassIndex']) ?? round(weight / (heightM * heightM), 1);
  const bodyFat = toPercent(pickMetric(source, ['bodyFat', 'bodyFatPercentage']));

  const waterPercent = pickMetric(source, ['water', 'waterPct', 'bodyWaterPercentage']);
  const waterMassKg = pickMetric(source, ['waterMassKg', 'bodyWaterMassKg', 'bodyWaterMass']);
  const water = waterPercent !== null
    ? toPercent(waterPercent)
    : waterMassKg !== null
    ? toPercent((waterMassKg / weight) * 100)
    : 0;

  const musclePercent = pickMetric(source, ['muscleMass', 'musclePct', 'leanMassPercentage']);
  const leanMassKg = pickMetric(source, ['leanMassKg', 'leanBodyMassKg', 'leanBodyMass']);
  const muscleMass = musclePercent !== null
    ? toPercent(musclePercent)
    : leanMassKg !== null
    ? toPercent((leanMassKg / weight) * 100)
    : 0;

  const boneMassDirect = pickMetric(source, ['boneMass', 'boneMassKg']);
  const boneMass = boneMassDirect !== null ? round(boneMassDirect, 2) : 0;

  return {
    date: day,
    weight: round(weight, 2),
    bmi: round(bmi, 1),
    body_fat: bodyFat,
    water,
    muscle_mass: muscleMass,
    bone_mass: boneMass,
  };
}

function mergeMetric(current: number, incoming: number) {
  return incoming > 0 ? incoming : current;
}

function mergeReading(existing: FitnessRow, incoming: ReturnType<typeof normalisePayload>) {
  if (!incoming) return null;
  return {
    date: incoming.date,
    weight: incoming.weight || existing.weight,
    bmi: mergeMetric(existing.bmi, incoming.bmi),
    body_fat: mergeMetric(existing.body_fat, incoming.body_fat),
    water: mergeMetric(existing.water, incoming.water),
    muscle_mass: mergeMetric(existing.muscle_mass, incoming.muscle_mass),
    bone_mass: mergeMetric(existing.bone_mass, incoming.bone_mass),
  };
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const reading = normalisePayload(body);
  if (!reading) {
    return NextResponse.json({ error: 'Invalid fitness payload' }, { status: 400 });
  }

  try {
    const dayStart = `${reading.date}T00:00:00.000Z`;
    const dayEnd = nextDay(reading.date);

    const { data: existingRows, error: loadError } = await supabaseAdmin
      .from('operator_fitness_readings')
      .select('id, date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
      .gte('date', dayStart)
      .lt('date', dayEnd)
      .order('date', { ascending: false })
      .limit(1);

    if (loadError) {
      return NextResponse.json({ error: loadError.message }, { status: 500 });
    }

    const existing = (existingRows?.[0] as FitnessRow | undefined) ?? null;

    if (existing) {
      const merged = mergeReading(existing, reading);
      const { data, error } = await supabaseAdmin
        .from('operator_fitness_readings')
        .update(merged)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, action: 'updated', reading: data });
    }

    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .insert([reading])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, action: 'inserted', reading: data });
  } catch {
    return NextResponse.json({ error: 'auto_sync_failed' }, { status: 500 });
  }
}
