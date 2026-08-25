import type { PartnerInput } from '@/lib/operatorPartnerStorage';

/**
 * Health Auto Export → partner daily summaries.
 *
 * The partner's watch is a Garmin, which has no self-serve personal API. The
 * route that does work is the one already running for the operator's own data:
 * Garmin Connect writes into Apple Health, and Health Auto Export posts Apple
 * Health on a schedule. So this accepts exactly the payload that app sends,
 * letting a second phone point the same app at a different URL.
 *
 * Only the fields the head-to-head screen compares are read. Everything else in
 * the payload is ignored rather than stored.
 */

type Point = { qty?: number; value?: number; date?: string };
type Metric = { name?: string; units?: string; data?: Point[] };
type Workout = { name?: string; start?: string; startDate?: string; duration?: number };

export type HealthExportPayload = {
  data?: { metrics?: Metric[]; workouts?: Workout[] };
  metrics?: Metric[];
  workouts?: Workout[];
};

const numOf = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Health Auto Export dates look like "2026-08-25 00:00:00 +0100". */
const dayOf = (v: string | undefined): string | null =>
  v?.trim().match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;

const kcal = (q: number, units: string | undefined) =>
  (units ?? '').toLowerCase() === 'kj' ? q / 4.184 : q;

const kg = (q: number, units: string | undefined) =>
  (units ?? '').toLowerCase().includes('lb') ? q * 0.453592 : q;

/** Minutes, whatever the app decided to send them as. */
const minutes = (q: number, units: string | undefined) => {
  const u = (units ?? '').toLowerCase();
  if (u === 's' || u === 'sec' || u === 'seconds') return q / 60;
  if (u === 'hr' || u === 'h' || u === 'hours') return q * 60;
  return q;
};

type Acc = Record<string, number>;

export function partnerHealthImport(
  payload: HealthExportPayload,
  person: string,
): PartnerInput[] {
  const metrics = payload.data?.metrics ?? payload.metrics ?? [];
  const workouts = payload.data?.workouts ?? payload.workouts ?? [];

  const byName = new Map(metrics.map((m) => [(m.name ?? '').toLowerCase(), m]));
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const m = byName.get(k);
      if (m?.data?.length) return m;
    }
    return undefined;
  };

  const sums: Record<string, Acc> = {};
  const latest: Record<string, Record<string, { at: string; v: number }>> = {};

  const addSum = (field: string, m: Metric | undefined, conv: (q: number, u?: string) => number = (q) => q) => {
    if (!m?.data) return;
    for (const p of m.data) {
      const day = dayOf(p.date);
      const q = numOf(p.qty ?? p.value);
      if (!day || q === null) continue;
      sums[day] ??= {};
      sums[day][field] = (sums[day][field] ?? 0) + conv(q, m.units);
    }
  };

  const addLatest = (field: string, m: Metric | undefined, conv: (q: number, u?: string) => number = (q) => q) => {
    if (!m?.data) return;
    for (const p of m.data) {
      const day = dayOf(p.date);
      const q = numOf(p.qty ?? p.value);
      if (!day || q === null) continue;
      latest[day] ??= {};
      const seen = latest[day][field];
      if (!seen || (p.date ?? '') >= seen.at) {
        latest[day][field] = { at: p.date ?? '', v: conv(q, m.units) };
      }
    }
  };

  addSum('steps', get('step_count', 'steps'));
  addSum('caloriesOut', get('active_energy', 'active_energy_burned'), kcal);
  addSum('caloriesIn', get('dietary_energy', 'dietary_energy_consumed'), kcal);
  addSum('proteinG', get('protein'));
  addSum('carbsG', get('carbohydrates', 'carbs'));
  addSum('fatG', get('total_fat', 'fat', 'fat_total'));
  addSum('sleepMin', get('sleep_analysis'), minutes);

  addLatest('weightKg', get('weight_body_mass', 'body_mass', 'weight'), kg);
  addLatest('bodyFat', get('body_fat_percentage', 'body_fat'));

  // Sessions, split the way the screen counts them: anything that covered ground
  // is a run or ride, anything else timed is a gym session.
  for (const w of workouts) {
    const day = dayOf(w.start ?? w.startDate);
    if (!day) continue;
    sums[day] ??= {};
    const isCardio = /run|cycl|bike|ride|swim|row|walk|hike|elliptical/i.test(w.name ?? '');
    const key = isCardio ? 'runs' : 'gymSessions';
    // Walking is already represented by the step count, so it is not a session.
    if (/walk/i.test(w.name ?? '')) continue;
    sums[day][key] = (sums[day][key] ?? 0) + 1;
  }

  const days = new Set([...Object.keys(sums), ...Object.keys(latest)]);
  const round = (v: number | undefined, dp = 0) =>
    v === undefined ? null : Math.round(v * 10 ** dp) / 10 ** dp;

  return [...days].sort().map((date) => ({
    date,
    person,
    steps: round(sums[date]?.steps),
    gymSessions: round(sums[date]?.gymSessions),
    runs: round(sums[date]?.runs),
    caloriesIn: round(sums[date]?.caloriesIn),
    caloriesOut: round(sums[date]?.caloriesOut),
    proteinG: round(sums[date]?.proteinG, 1),
    carbsG: round(sums[date]?.carbsG, 1),
    fatG: round(sums[date]?.fatG, 1),
    sleepMin: round(sums[date]?.sleepMin),
    weightKg: round(latest[date]?.weightKg?.v, 1),
    bodyFat: round(latest[date]?.bodyFat?.v, 1),
  }));
}
