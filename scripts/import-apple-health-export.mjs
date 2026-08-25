#!/usr/bin/env node
/**
 * Backfill from a full Apple Health export.
 *
 * Health Auto Export only ever posted what was enabled at the time, so the
 * database holds a few months of partial days. The Health app's own export holds
 * everything, so this reads export.xml directly and fills the history in.
 *
 *   node scripts/import-apple-health-export.mjs <path-to-export.xml> [--dry]
 *
 * Two things it is careful about, because getting either wrong quietly corrupts
 * the history rather than failing loudly:
 *
 *  - The raw export contains BOTH iPhone and Watch samples for the same walk, so
 *    summing every sample double counts. Per day and per metric this sums within
 *    each source and then takes the largest — which is the most complete single
 *    account of the day rather than an inflated merge of several.
 *
 *  - "In bed" is not "asleep". Only the Asleep* stages are counted, and a night
 *    is attributed to the day it ended, which is the day you woke up.
 */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const xmlPath = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!xmlPath) {
  console.error('usage: node scripts/import-apple-health-export.mjs <export.xml> [--dry]');
  process.exit(1);
}

const env = {};
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/* ── what we pull out ─────────────────────────────────────────────────────── */

// Summed across the day, deduped by source.
const SUMMED = {
  HKQuantityTypeIdentifierStepCount: 'steps',
  HKQuantityTypeIdentifierActiveEnergyBurned: 'active_energy_kcal',
  HKQuantityTypeIdentifierBasalEnergyBurned: 'basal_energy_kcal',
  HKQuantityTypeIdentifierAppleExerciseTime: 'exercise_minutes',
  HKQuantityTypeIdentifierDistanceWalkingRunning: 'distance_km',
  HKQuantityTypeIdentifierDietaryEnergyConsumed: 'dietary_energy_kcal',
  HKQuantityTypeIdentifierDietaryProtein: 'protein_g',
  HKQuantityTypeIdentifierDietaryCarbohydrates: 'carbs_g',
  HKQuantityTypeIdentifierDietaryFatTotal: 'fat_g',
  HKQuantityTypeIdentifierDietaryFiber: 'fiber_g',
  HKQuantityTypeIdentifierDietarySugar: 'sugar_g',
  HKQuantityTypeIdentifierDietaryWater: 'water_ml',
};

// A reading rather than a total: the last one of the day wins.
const LATEST = {
  HKQuantityTypeIdentifierRestingHeartRate: 'resting_hr',
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: 'hrv_ms',
  HKQuantityTypeIdentifierWalkingHeartRateAverage: 'walking_hr_avg',
  HKQuantityTypeIdentifierVO2Max: 'vo2_max',
};

const BODY = {
  HKQuantityTypeIdentifierBodyMass: 'weight',
  HKQuantityTypeIdentifierBodyMassIndex: 'bmi',
  HKQuantityTypeIdentifierBodyFatPercentage: 'bodyFat',
  HKQuantityTypeIdentifierLeanBodyMass: 'muscleMass',
};

const ASLEEP = /HKCategoryValueSleepAnalysisAsleep/;

/** Columns the table types as INTEGER, which reject a decimal outright. */
const INT_FIELDS = new Set([
  'steps', 'exercise_minutes', 'stand_hours', 'water_ml',
  'resting_hr', 'walking_hr_avg',
  'sleep_total_min', 'sleep_in_bed_min', 'sleep_rem_min',
  'sleep_deep_min', 'sleep_core_min', 'sleep_awake_min',
]);

/* ── unit handling ────────────────────────────────────────────────────────── */

const toKcal = (v, u) => ((u || '').toLowerCase() === 'kj' ? v / 4.184 : v);
const toKm = (v, u) => {
  const unit = (u || '').toLowerCase();
  if (unit === 'mi') return v * 1.609344;
  if (unit === 'm') return v / 1000;
  return v;
};
const toKg = (v, u) => ((u || '').toLowerCase() === 'lb' ? v * 0.453592 : v);
const toMl = (v, u) => {
  const unit = (u || '').toLowerCase();
  if (unit === 'l') return v * 1000;
  if (unit === 'floz_us' || unit === 'fl_oz_us') return v * 29.5735;
  return v;
};
const toMin = (v, u) => {
  const unit = (u || '').toLowerCase();
  if (unit === 'sec' || unit === 's') return v / 60;
  if (unit === 'hr' || unit === 'h') return v * 60;
  return v;
};

/** Apple writes local wall-clock time, so the date part is already the London day. */
const dayOf = (s) => (s || '').slice(0, 10);
const minutesBetween = (a, b) => (Date.parse(iso(b)) - Date.parse(iso(a))) / 60000;
const iso = (s) => (s || '').replace(/^(\S+) (\S+) ([+-]\d{2})(\d{2})$/, '$1T$2$3:$4');

const attrs = (line) => {
  const out = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(line))) out[m[1]] = m[2];
  return out;
};

/* ── accumulate ───────────────────────────────────────────────────────────── */

// day -> field -> source -> running total (deduped by taking the max source)
const sums = new Map();
const latest = new Map();   // day -> field -> {at, v}
const sleep = new Map();    // day -> source -> asleep minutes
const body = new Map();     // day -> {field: {at, v}}
const workouts = [];

const addSum = (day, field, source, value) => {
  if (!Number.isFinite(value)) return;
  let d = sums.get(day);
  if (!d) sums.set(day, (d = new Map()));
  let f = d.get(field);
  if (!f) d.set(field, (f = new Map()));
  f.set(source, (f.get(source) ?? 0) + value);
};

const addLatest = (day, field, at, value) => {
  if (!Number.isFinite(value)) return;
  let d = latest.get(day);
  if (!d) latest.set(day, (d = new Map()));
  const prev = d.get(field);
  if (!prev || at >= prev.at) d.set(field, { at, v: value });
};

let current = null; // the Workout element being read

const rl = createInterface({
  input: createReadStream(xmlPath, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

let seen = 0;
for await (const line of rl) {
  if (line.indexOf('<Record ') !== -1) {
    const a = attrs(line);
    const type = a.type;
    if (!type) continue;
    seen++;

    if (type === 'HKCategoryTypeIdentifierSleepAnalysis') {
      if (!ASLEEP.test(a.value || '')) continue; // in-bed and awake are not sleep
      const day = dayOf(a.endDate); // the day you woke
      const mins = minutesBetween(a.startDate, a.endDate);
      if (!Number.isFinite(mins) || mins <= 0) continue;
      let d = sleep.get(day);
      if (!d) sleep.set(day, (d = new Map()));
      const src = a.sourceName || '?';
      d.set(src, (d.get(src) ?? 0) + mins);
      continue;
    }

    const v = Number(a.value);
    if (!Number.isFinite(v)) continue;
    const day = dayOf(a.startDate);
    const src = a.sourceName || '?';

    if (SUMMED[type]) {
      const field = SUMMED[type];
      let value = v;
      if (field.endsWith('_kcal')) value = toKcal(v, a.unit);
      else if (field === 'distance_km') value = toKm(v, a.unit);
      else if (field === 'water_ml') value = toMl(v, a.unit);
      else if (field === 'exercise_minutes') value = toMin(v, a.unit);
      addSum(day, field, src, value);
      continue;
    }

    if (LATEST[type]) {
      addLatest(day, LATEST[type], a.startDate, v);
      continue;
    }

    if (BODY[type]) {
      const field = BODY[type];
      const value = field === 'weight' || field === 'muscleMass' ? toKg(v, a.unit) : v;
      let d = body.get(day);
      if (!d) body.set(day, (d = {}));
      const prev = d[field];
      if (!prev || a.startDate >= prev.at) d[field] = { at: a.startDate, v: value };
      continue;
    }
    continue;
  }

  if (line.indexOf('<Workout ') !== -1) {
    const a = attrs(line);
    current = {
      started_at: iso(a.startDate),
      ended_at: a.endDate ? iso(a.endDate) : null,
      type: (a.workoutActivityType || '').replace('HKWorkoutActivityType', '') || null,
      duration_min: a.duration ? round(toMin(Number(a.duration), a.durationUnit), 1) : null,
      energy_kcal: null,
      avg_hr: null,
      max_hr: null,
      distance_km: null,
      source: a.sourceName || null,
      raw: null,
    };
    if (line.indexOf('/>') !== -1) { workouts.push(current); current = null; }
    continue;
  }

  if (current && line.indexOf('<WorkoutStatistics ') !== -1) {
    const a = attrs(line);
    const sum = Number(a.sum);
    const avg = Number(a.average);
    const max = Number(a.maximum);
    if (a.type === 'HKQuantityTypeIdentifierActiveEnergyBurned' && Number.isFinite(sum)) {
      current.energy_kcal = round(toKcal(sum, a.unit), 1);
    } else if (a.type?.startsWith('HKQuantityTypeIdentifierDistance') && Number.isFinite(sum)) {
      current.distance_km = round(toKm(sum, a.unit), 2);
    } else if (a.type === 'HKQuantityTypeIdentifierHeartRate') {
      if (Number.isFinite(avg)) current.avg_hr = Math.round(avg);
      if (Number.isFinite(max)) current.max_hr = Math.round(max);
    }
    continue;
  }

  if (current && line.indexOf('</Workout>') !== -1) {
    workouts.push(current);
    current = null;
  }
}

function round(v, dp) {
  return Number.isFinite(v) ? Math.round(v * 10 ** dp) / 10 ** dp : null;
}

/* ── fold into rows ───────────────────────────────────────────────────────── */

const days = new Set([...sums.keys(), ...latest.keys(), ...sleep.keys()]);
const metricRows = [];
for (const day of [...days].sort()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
  const row = { date: day };

  const d = sums.get(day);
  if (d) {
    for (const [field, bySource] of d) {
      // The most complete single source, not the sum of overlapping ones.
      const v = Math.max(...bySource.values());
      row[field] = INT_FIELDS.has(field) ? Math.round(v) : round(v, 1);
    }
  }
  const l = latest.get(day);
  if (l) for (const [field, { v }] of l) row[field] = INT_FIELDS.has(field) ? Math.round(v) : round(v, 1);

  const s = sleep.get(day);
  if (s) row.sleep_total_min = Math.round(Math.max(...s.values()));

  if (Object.keys(row).length > 1) metricRows.push(row);
}

const bodyRows = [];
for (const [day, fields] of [...body].sort()) {
  if (!fields.weight) continue; // a reading without a weight is not a weigh-in
  bodyRows.push({
    date: day,
    weight: round(fields.weight.v, 1),
    bmi: round(fields.bmi?.v ?? 0, 1) ?? 0,
    body_fat: round(fields.bodyFat?.v ?? 0, 1) ?? 0,
    water: 0,
    muscle_mass: round(fields.muscleMass?.v ?? 0, 1) ?? 0,
    bone_mass: 0,
  });
}

// Two apps can log the same session at the same instant, and Postgres refuses an
// ON CONFLICT batch that touches one row twice. Keep the fullest record per
// (start, type) — the one that actually carries energy, distance and heart rate.
const workoutRows = (() => {
  const best = new Map();
  const richness = (w) =>
    (w.energy_kcal ? 1 : 0) + (w.distance_km ? 1 : 0) + (w.avg_hr ? 1 : 0) +
    (w.duration_min ? 1 : 0) + (w.source ? 1 : 0);
  for (const w of workouts) {
    if (!w.started_at || !w.type) continue;
    const key = `${w.started_at}|${w.type}`;
    const prev = best.get(key);
    if (!prev || richness(w) > richness(prev)) best.set(key, w);
  }
  return [...best.values()];
})();

console.log(`\n  parsed ${seen.toLocaleString()} records`);
console.log(`    daily metric rows : ${metricRows.length.toLocaleString()}  (${metricRows[0]?.date} → ${metricRows.at(-1)?.date})`);
console.log(`    weigh-ins         : ${bodyRows.length.toLocaleString()}  (${bodyRows[0]?.date} → ${bodyRows.at(-1)?.date})`);
console.log(`    workouts          : ${workoutRows.length.toLocaleString()}`);
const withSleep = metricRows.filter((r) => r.sleep_total_min).length;
const withBasal = metricRows.filter((r) => r.basal_energy_kcal).length;
console.log(`    days with sleep   : ${withSleep.toLocaleString()}`);
console.log(`    days with basal   : ${withBasal.toLocaleString()}`);

const COMPARE = process.argv.find((a) => a.startsWith('--compare='));
if (COMPARE) {
  const snap = JSON.parse(readFileSync(COMPARE.split('=')[1], 'utf8'));
  const mine = new Map(metricRows.map((r) => [r.date, r]));
  const fields = ['steps', 'active_energy_kcal', 'dietary_energy_kcal', 'protein_g'];
  console.log('\n  parsed vs what Health Auto Export delivered (Apple\'s own aggregation)\n');
  const diffs = { steps: [], active_energy_kcal: [], dietary_energy_kcal: [], protein_g: [] };
  for (const row of snap) {
    const m = mine.get(row.date);
    if (!m) continue;
    for (const f of fields) {
      const a = row[f] == null ? null : Number(row[f]);
      const b = m[f] == null ? null : Number(m[f]);
      if (a === null || b === null || !a) continue;
      diffs[f].push((b - a) / a);
    }
  }
  for (const f of fields) {
    const d = diffs[f];
    if (!d.length) { console.log(`    ${f.padEnd(22)} no overlap`); continue; }
    d.sort((x, y) => x - y);
    const med = d[Math.floor(d.length / 2)];
    const within2 = d.filter((x) => Math.abs(x) <= 0.02).length;
    console.log(`    ${f.padEnd(22)} n=${String(d.length).padStart(3)}  median ${(med * 100).toFixed(1).padStart(6)}%   within 2%: ${within2}/${d.length}`);
  }
  console.log('');
  process.exit(0);
}

if (DRY) {
  console.log('\n  --dry: nothing written. Sample day:');
  console.log('   ', JSON.stringify(metricRows.at(-2)));
  console.log('  Sample workout:');
  console.log('   ', JSON.stringify(workoutRows.at(-1)));
  console.log('');
  process.exit(0);
}

/* ── write ────────────────────────────────────────────────────────────────── */

/**
 * Upsert without destroying what is already there.
 *
 * A bulk upsert writes a fixed column list, so any column this parse does not
 * produce would be set to NULL on an existing row — the scale's water and bone
 * mass, or stand hours, would be wiped by an import that never knew about them.
 * Existing rows are read first and merged field by field, with the parsed value
 * winning only where it actually has one.
 */
async function upsertChunked(table, rows, conflict, label, keyOf) {
  const SIZE = 400;
  let done = 0;
  let merged = 0;

  for (let i = 0; i < rows.length; i += SIZE) {
    const chunk = rows.slice(i, i + SIZE);

    // Pull the rows this chunk would collide with.
    const existing = new Map();
    if (keyOf) {
      const dates = chunk.map((r) => r.date);
      const { data } = await db.from(table).select('*').in('date', dates);
      for (const r of data ?? []) existing.set(keyOf(r), r);
    }

    const payload = chunk.map((incoming) => {
      const prev = keyOf ? existing.get(keyOf(incoming)) : null;
      if (!prev) return incoming;
      merged++;
      const out = { ...prev };
      for (const [k, v] of Object.entries(incoming)) {
        // Zero from this parse means "not in the export", not "measured as zero".
        if (v === null || v === undefined) continue;
        if (v === 0 && (prev[k] ?? 0) !== 0) continue;
        out[k] = v;
      }
      delete out.created_at;
      return out;
    });

    // The column is NOT NULL, and a merged row carries whatever was there before.
    if (table === 'operator_daily_metrics') {
      const now = new Date().toISOString();
      for (const r of payload) r.updated_at = now;
    }

    const { error } = await db.from(table).upsert(payload, { onConflict: conflict });
    if (error) {
      console.error(`\n  ${label} failed at row ${i}: ${error.message}`);
      process.exit(1);
    }
    done += chunk.length;
    process.stdout.write(`\r  ${label}: ${done}/${rows.length}   `);
  }
  console.log(`\r  ${label}: ${done}/${rows.length}   done (${merged} merged into existing)`);
}


/**
 * Weigh-ins, which have no unique constraint on date to upsert against.
 *
 * The scale writes water and bone mass that the Health export does not carry, so
 * an existing reading is updated field by field rather than replaced — otherwise
 * a backfill would strip the very fields only the scale knows.
 */
async function writeWeighIns(rows) {
  const dates = rows.map((r) => r.date);
  const existing = new Map();
  for (let i = 0; i < dates.length; i += 400) {
    const { data } = await db.from('operator_fitness_readings')
      .select('*').in('date', dates.slice(i, i + 400));
    for (const r of data ?? []) existing.set(String(r.date).slice(0, 10), r);
  }

  const inserts = [];
  const updates = [];
  for (const row of rows) {
    const prev = existing.get(row.date);
    if (!prev) { inserts.push(row); continue; }
    const out = { id: prev.id };
    let changed = false;
    for (const [k, v] of Object.entries(row)) {
      if (k === 'date' || !v) continue;
      if (Number(prev[k]) === Number(v)) continue;
      // Never let a blank export value overwrite something the scale recorded.
      if (!Number(prev[k]) || k === 'weight' || k === 'bmi') { out[k] = v; changed = true; }
    }
    if (changed) updates.push(out);
  }

  let n = 0;
  for (let i = 0; i < inserts.length; i += 400) {
    const { error } = await db.from('operator_fitness_readings').insert(inserts.slice(i, i + 400));
    if (error) { console.error(`\n  weigh-in insert failed: ${error.message}`); process.exit(1); }
    n += Math.min(400, inserts.length - i);
    process.stdout.write(`\r  weigh-ins    : inserted ${n}/${inserts.length}   `);
  }
  let u = 0;
  for (const row of updates) {
    const { id, ...fields } = row;
    const { error } = await db.from('operator_fitness_readings').update(fields).eq('id', id);
    if (error) { console.error(`\n  weigh-in update failed: ${error.message}`); process.exit(1); }
    u++;
  }
  console.log(`\r  weigh-ins    : ${inserts.length} new, ${updates.length} updated, ${rows.length - inserts.length - updates.length} unchanged      `);
}

console.log('');
const byDate = (r) => String(r.date).slice(0, 10);
await upsertChunked('operator_daily_metrics', metricRows, 'date', 'daily metrics', byDate);
await writeWeighIns(bodyRows);
await upsertChunked('operator_workouts', workoutRows, 'started_at,type', 'workouts     ', null);
console.log('');
