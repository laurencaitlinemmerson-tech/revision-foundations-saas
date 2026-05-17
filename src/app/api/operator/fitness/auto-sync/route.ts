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

// ─── Daily activity / heart / sleep metrics ──────────────────────────────────

type DailyMetricRow = {
  date: string;
  steps: number | null;
  active_energy_kcal: number | null;
  exercise_minutes: number | null;
  stand_hours: number | null;
  distance_km: number | null;
  resting_hr: number | null;
  hrv_ms: number | null;
  walking_hr_avg: number | null;
  vo2_max: number | null;
  sleep_total_min: number | null;
  sleep_in_bed_min: number | null;
  sleep_rem_min: number | null;
  sleep_deep_min: number | null;
  sleep_core_min: number | null;
  sleep_awake_min: number | null;
};

function emptyDaily(date: string): DailyMetricRow {
  return {
    date,
    steps: null,
    active_energy_kcal: null,
    exercise_minutes: null,
    stand_hours: null,
    distance_km: null,
    resting_hr: null,
    hrv_ms: null,
    walking_hr_avg: null,
    vo2_max: null,
    sleep_total_min: null,
    sleep_in_bed_min: null,
    sleep_rem_min: null,
    sleep_deep_min: null,
    sleep_core_min: null,
    sleep_awake_min: null,
  };
}

function convertDistanceToKm(value: number, unit: string | undefined) {
  switch ((unit ?? '').toLowerCase()) {
    case 'km':
      return value;
    case 'm':
      return value / 1000;
    case 'mi':
      return value * 1.609344;
    case 'ft':
      return value * 0.0003048;
    case 'yd':
      return value * 0.0009144;
    default:
      return value;
  }
}

function convertEnergyToKcal(value: number, unit: string | undefined) {
  switch ((unit ?? '').toLowerCase()) {
    case 'kcal':
    case 'cal':
      return value;
    case 'kj':
      return value / 4.184;
    case 'j':
      return value / 4184;
    default:
      return value;
  }
}

function convertDurationToMinutes(value: number, unit: string | undefined) {
  switch ((unit ?? '').toLowerCase()) {
    case 'min':
    case 'mins':
    case 'minutes':
      return value;
    case 'hr':
    case 'hrs':
    case 'hour':
    case 'hours':
      return value * 60;
    case 's':
    case 'sec':
    case 'seconds':
      return value / 60;
    default:
      return value;
  }
}

// Accumulator that takes the latest value per day (for "snapshot" metrics like HR).
function setLatest(target: Map<string, DailyMetricRow>, key: keyof DailyMetricRow, points: HealthAutoExportPoint[], transform?: (qty: number) => number) {
  for (const p of points) {
    if (p.qty === undefined || !p.date) continue;
    const day = parseDay(p.date);
    if (!day) continue;
    const row = target.get(day) ?? emptyDaily(day);
    const value = transform ? transform(p.qty) : p.qty;
    if (Number.isFinite(value)) {
      (row[key] as number | null) = round(value, 2);
      target.set(day, row);
    }
  }
}

// Accumulator that sums values per day (for cumulative metrics like steps/energy).
function setSum(target: Map<string, DailyMetricRow>, key: keyof DailyMetricRow, points: HealthAutoExportPoint[], transform?: (qty: number) => number) {
  const sums = new Map<string, number>();
  for (const p of points) {
    if (p.qty === undefined || !p.date) continue;
    const day = parseDay(p.date);
    if (!day) continue;
    const value = transform ? transform(p.qty) : p.qty;
    if (!Number.isFinite(value)) continue;
    sums.set(day, (sums.get(day) ?? 0) + value);
  }
  for (const [day, total] of sums) {
    const row = target.get(day) ?? emptyDaily(day);
    (row[key] as number | null) = round(total, 2);
    target.set(day, row);
  }
}

// Sleep analysis points come as objects with stage durations rather than `qty`.
type SleepPoint = {
  date?: string;
  startDate?: string;
  endDate?: string;
  sleepStart?: string;
  sleepEnd?: string;
  inBedStart?: string;
  inBedEnd?: string;
  asleep?: number;
  inBed?: number;
  awake?: number;
  deep?: number;
  core?: number;
  rem?: number;
  value?: string; // older format ("InBed", "Asleep", "REM", etc.)
};

function minutesBetween(a: string | undefined, b: string | undefined) {
  if (!a || !b) return null;
  const start = parseAt(a);
  const end = parseAt(b);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return Math.round((end - start) / 60000);
}

function applySleep(target: Map<string, DailyMetricRow>, metric: HealthAutoExportMetric | undefined) {
  if (!metric?.data?.length) return;

  // Group by the day the user *woke up* on — that's the canonical "sleep night" date.
  const dayBuckets = new Map<string, { total: number; inBed: number; rem: number; deep: number; core: number; awake: number }>();

  for (const raw of metric.data as SleepPoint[]) {
    const wakeIso = raw.sleepEnd ?? raw.endDate ?? raw.inBedEnd ?? raw.date;
    const day = parseDay(wakeIso);
    if (!day) continue;

    const bucket = dayBuckets.get(day) ?? { total: 0, inBed: 0, rem: 0, deep: 0, core: 0, awake: 0 };

    const asleep = typeof raw.asleep === 'number' ? raw.asleep : null;
    const inBed = typeof raw.inBed === 'number'
      ? raw.inBed
      : minutesBetween(raw.inBedStart, raw.inBedEnd);
    const rem = typeof raw.rem === 'number' ? raw.rem : null;
    const deep = typeof raw.deep === 'number' ? raw.deep : null;
    const core = typeof raw.core === 'number' ? raw.core : null;
    const awake = typeof raw.awake === 'number' ? raw.awake : null;

    if (asleep !== null) bucket.total += asleep;
    else if (rem !== null || deep !== null || core !== null) {
      bucket.total += (rem ?? 0) + (deep ?? 0) + (core ?? 0);
    } else {
      const computed = minutesBetween(raw.sleepStart, raw.sleepEnd);
      if (computed !== null) bucket.total += computed;
    }

    if (inBed !== null) bucket.inBed += inBed;
    if (rem !== null) bucket.rem += rem;
    if (deep !== null) bucket.deep += deep;
    if (core !== null) bucket.core += core;
    if (awake !== null) bucket.awake += awake;

    dayBuckets.set(day, bucket);
  }

  for (const [day, b] of dayBuckets) {
    const row = target.get(day) ?? emptyDaily(day);
    if (b.total > 0) row.sleep_total_min = Math.round(b.total);
    if (b.inBed > 0) row.sleep_in_bed_min = Math.round(b.inBed);
    if (b.rem > 0) row.sleep_rem_min = Math.round(b.rem);
    if (b.deep > 0) row.sleep_deep_min = Math.round(b.deep);
    if (b.core > 0) row.sleep_core_min = Math.round(b.core);
    if (b.awake > 0) row.sleep_awake_min = Math.round(b.awake);
    target.set(day, row);
  }
}

function parseDailyMetrics(payload: Record<string, unknown>): DailyMetricRow[] {
  const root = (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? payload.data
    : payload) as Record<string, unknown>;
  const metrics = Array.isArray(root.metrics) ? (root.metrics as HealthAutoExportMetric[]) : null;
  if (!metrics || metrics.length === 0) return [];

  const byName = new Map(metrics.map((m) => [(m.name ?? '').toLowerCase(), m]));
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const m = byName.get(k);
      if (m) return m;
    }
    return undefined;
  };

  const target = new Map<string, DailyMetricRow>();

  // Activity (cumulative across the day → sum)
  const steps = get('step_count', 'steps');
  if (steps?.data) setSum(target, 'steps', steps.data, Math.round);

  const energy = get('active_energy', 'active_energy_burned');
  if (energy?.data) setSum(target, 'active_energy_kcal', energy.data, (q) => convertEnergyToKcal(q, energy.units));

  const exercise = get('apple_exercise_time', 'exercise_time');
  if (exercise?.data) setSum(target, 'exercise_minutes', exercise.data, (q) => Math.round(convertDurationToMinutes(q, exercise.units)));

  const stand = get('apple_stand_hour', 'apple_stand_time', 'stand_hours');
  if (stand?.data) setSum(target, 'stand_hours', stand.data, Math.round);

  const distance = get('walking_running_distance', 'distance_walking_running');
  if (distance?.data) setSum(target, 'distance_km', distance.data, (q) => convertDistanceToKm(q, distance.units));

  // Heart (snapshot → latest)
  const restingHr = get('resting_heart_rate');
  if (restingHr?.data) setLatest(target, 'resting_hr', restingHr.data, Math.round);

  const hrv = get('heart_rate_variability');
  if (hrv?.data) setLatest(target, 'hrv_ms', hrv.data);

  const walkingHr = get('walking_heart_rate_average');
  if (walkingHr?.data) setLatest(target, 'walking_hr_avg', walkingHr.data, Math.round);

  const vo2 = get('vo2_max');
  if (vo2?.data) setLatest(target, 'vo2_max', vo2.data);

  // Sleep
  applySleep(target, get('sleep_analysis'));

  return Array.from(target.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Workouts ────────────────────────────────────────────────────────────────

type WorkoutRow = {
  started_at: string;
  ended_at: string | null;
  type: string | null;
  duration_min: number | null;
  energy_kcal: number | null;
  avg_hr: number | null;
  max_hr: number | null;
  distance_km: number | null;
  source: string | null;
  raw: unknown;
};

type RawWorkout = Record<string, unknown> & {
  name?: string;
  workoutName?: string;
  start?: string;
  startDate?: string;
  end?: string;
  endDate?: string;
  duration?: number;
  totalEnergyBurned?: number;
  activeEnergyBurned?: number;
  totalDistance?: number;
  distance?: number;
  avgHeartRate?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  source?: string;
  energyUnits?: string;
  distanceUnits?: string;
  durationUnits?: string;
};

function isoOrNull(value: string | undefined) {
  if (!value) return null;
  const normalized = value.replace(/ ([+-]\d{2})(\d{2})$/, 'T$1:$2').replace(' ', 'T');
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function parseWorkouts(payload: Record<string, unknown>): WorkoutRow[] {
  const root = (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? payload.data
    : payload) as Record<string, unknown>;
  const list = Array.isArray(root.workouts) ? (root.workouts as RawWorkout[]) : null;
  if (!list || list.length === 0) return [];

  const rows: WorkoutRow[] = [];
  for (const w of list) {
    const started = isoOrNull(w.start ?? w.startDate);
    if (!started) continue;
    const ended = isoOrNull(w.end ?? w.endDate);

    const energyRaw = parseNumber(w.totalEnergyBurned ?? w.activeEnergyBurned);
    const energy = energyRaw !== null ? round(convertEnergyToKcal(energyRaw, w.energyUnits), 1) : null;

    const distanceRaw = parseNumber(w.totalDistance ?? w.distance);
    const distance = distanceRaw !== null ? round(convertDistanceToKm(distanceRaw, w.distanceUnits), 2) : null;

    const durationRaw = parseNumber(w.duration);
    let duration = durationRaw !== null ? round(convertDurationToMinutes(durationRaw, w.durationUnits), 1) : null;
    if (duration === null && ended) {
      const computed = minutesBetween(started, ended);
      if (computed !== null) duration = computed;
    }

    rows.push({
      started_at: started,
      ended_at: ended,
      type: (w.name ?? w.workoutName ?? null) as string | null,
      duration_min: duration,
      energy_kcal: energy,
      avg_hr: parseNumber(w.avgHeartRate ?? w.averageHeartRate) !== null
        ? Math.round(parseNumber(w.avgHeartRate ?? w.averageHeartRate) as number)
        : null,
      max_hr: parseNumber(w.maxHeartRate) !== null
        ? Math.round(parseNumber(w.maxHeartRate) as number)
        : null,
      distance_km: distance,
      source: (w.source ?? null) as string | null,
      raw: w,
    });
  }
  return rows;
}

// ─── Upsert helpers ─────────────────────────────────────────────────────────

async function upsertDailyMetrics(rows: DailyMetricRow[]) {
  if (rows.length === 0) return { upserted: 0 };

  const dates = rows.map((r) => r.date);
  const { data: existing, error: loadErr } = await supabaseAdmin
    .from('operator_daily_metrics')
    .select('*')
    .in('date', dates);
  if (loadErr) throw new Error(loadErr.message);

  const existingByDate = new Map<string, DailyMetricRow>();
  for (const row of (existing ?? []) as DailyMetricRow[]) {
    existingByDate.set(row.date, row);
  }

  const merged = rows.map((incoming) => {
    const prev = existingByDate.get(incoming.date);
    if (!prev) return { ...incoming, updated_at: new Date().toISOString() };
    const out: Record<string, unknown> = { date: incoming.date, updated_at: new Date().toISOString() };
    for (const key of Object.keys(incoming) as (keyof DailyMetricRow)[]) {
      if (key === 'date') continue;
      const next = incoming[key];
      const before = prev[key];
      out[key] = next !== null && next !== undefined ? next : before;
    }
    return out;
  });

  const { error } = await supabaseAdmin
    .from('operator_daily_metrics')
    .upsert(merged, { onConflict: 'date' });
  if (error) throw new Error(error.message);

  return { upserted: merged.length };
}

async function upsertWorkouts(rows: WorkoutRow[]) {
  if (rows.length === 0) return { upserted: 0 };
  const { error } = await supabaseAdmin
    .from('operator_workouts')
    .upsert(rows, { onConflict: 'started_at,type' });
  if (error) throw new Error(error.message);
  return { upserted: rows.length };
}

async function syncBodyComposition(body: unknown) {
  const reading = normalisePayload(body);
  if (!reading) return { action: 'skipped' as const };

  const dayStart = `${reading.date}T00:00:00.000Z`;
  const dayEnd = nextDay(reading.date);

  const { data: existingRows, error: loadError } = await supabaseAdmin
    .from('operator_fitness_readings')
    .select('id, date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
    .gte('date', dayStart)
    .lt('date', dayEnd)
    .order('date', { ascending: false })
    .limit(1);
  if (loadError) throw new Error(loadError.message);

  const existing = (existingRows?.[0] as FitnessRow | undefined) ?? null;
  if (existing) {
    const merged = mergeReading(existing, reading);
    const { error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .update(merged)
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
    return { action: 'updated' as const, date: reading.date };
  }

  const { error } = await supabaseAdmin
    .from('operator_fitness_readings')
    .insert([reading]);
  if (error) throw new Error(error.message);
  return { action: 'inserted' as const, date: reading.date };
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const payload = body as Record<string, unknown>;

  try {
    const bodyComp = await syncBodyComposition(payload);
    const dailyRows = parseDailyMetrics(payload);
    const workoutRows = parseWorkouts(payload);
    const dailyResult = await upsertDailyMetrics(dailyRows);
    const workoutResult = await upsertWorkouts(workoutRows);

    const anyData = bodyComp.action !== 'skipped' || dailyResult.upserted > 0 || workoutResult.upserted > 0;
    if (!anyData) {
      return NextResponse.json({ error: 'No recognisable metrics in payload' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      body_composition: bodyComp,
      daily_metrics: { upserted: dailyResult.upserted, dates: dailyRows.map((r) => r.date) },
      workouts: { upserted: workoutResult.upserted },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'auto_sync_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
