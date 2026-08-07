import type React from 'react';
import { avgOf, lastSyncedDate, latestOf, localISODate, series, today as todayRow, type HealthDay, type LiveData, type Lift, type Workout } from './data';
import { storedOperatorPassword } from '../OperatorGate';
import { detectPlateau, plateauSuggestion } from '@/lib/fitness/plateau';
import { fitReadings, projectWithBand } from '@/lib/fitness/regression';
import { tdeeRealityCheck, driftCopy } from '@/lib/fitness/tdeeRealityCheck';

/**
 * Daily log — derivation layer.
 *
 * Direct port of the redesign prototype's `renderVals` pipeline. Every number,
 * label and computed style string is reproduced as-is so the rendered result
 * matches the approved design; the only behavioural change is the weekly-delta
 * fix noted at `weekDeltas` below, which the prototype computed against reading
 * objects instead of their weights and rendered as `NaN`.
 */

export type Reading = { date: string; weight: number };

export type DailyLogState = {
  tab: 'today' | 'trends' | 'plan' | 'progress' | 'food' | 'training' | 'habits';
  range: number;
  metric: 'weight' | 'bmi' | 'fat' | 'waist';
  unit: 'kg' | 'lb';
  ringFocus: 'kcal' | 'protein' | 'steps';
  rate: number;
  pace: number;
  weekDone: Record<number, boolean>;
  hover: HoverPoint | null;
  draft: string;
  openSession: number | null;
  tune: { bmr: number; neat: number; exercise: number; tef: number };
  habitDone: Record<string, boolean>;
  readings: Reading[] | null;
  fresh: boolean;
  showLog: 'food' | 'session' | null;
  targetsOpen: boolean;
  targets: { goal?: number; kcal?: number; proteinPerKg?: number };
  /** Which rota day is open, as an ISO date. Null means today. */
  rotaDate: string | null;
  /** How many six-week pages back or forward the rota is scrolled. */
  rotaPage: number;
  /** Practice hours worked before the calendar window, entered by hand. */
  placementPrior: number;
  /** Hours needed for registration — 2,300 under current NMC standards. */
  placementTarget: number;
  volRange?: 'week' | 'month' | 'quarter' | 'all';
};

export type HoverPoint = {
  cx: number; cy: number; x: number; y: number;
  date: string; value: string; sub: string;
};

export type DailyLogProps = {
  goalKg: number;
  calorieTarget: number;
  proteinPerKg: number;
};

export type SetState = (patch: Partial<DailyLogState> | ((s: DailyLogState) => Partial<DailyLogState>)) => void;

export const INITIAL_STATE: DailyLogState = {
  tab: 'today',
  range: 90,
  metric: 'weight',
  unit: 'kg',
  ringFocus: 'kcal',
  rate: -0.22,
  pace: 0.75,
  weekDone: {},
  hover: null,
  draft: '',
  openSession: 0,
  tune: { bmr: 1450, neat: 600, exercise: 250, tef: 180 },
  habitDone: {},
  readings: null,
  fresh: false,
  showLog: null,
  targetsOpen: false,
  targets: {},
  rotaDate: null,
  rotaPage: 0,
  placementPrior: 0,
  placementTarget: 2300,
};

export const DEFAULT_PROPS: DailyLogProps = { goalKg: 68, calorieTarget: 2000, proteinPerKg: 1.8 };

/** Seed series — used until real weigh-ins arrive from `/api/operator/fitness`. */
export const BASE: Array<[string, number]> = [
  ['2026-02-08', 76.9], ['2026-02-15', 76.6], ['2026-02-22', 76.8], ['2026-03-01', 76.2],
  ['2026-03-08', 76.0], ['2026-03-15', 75.7], ['2026-03-22', 75.9], ['2026-03-29', 75.4],
  ['2026-04-05', 75.2], ['2026-04-12', 75.3], ['2026-04-19', 74.9], ['2026-04-26', 74.9],
  ['2026-05-03', 74.8], ['2026-05-10', 74.5], ['2026-05-17', 74.6], ['2026-05-24', 74.0],
  ['2026-05-31', 73.7], ['2026-06-07', 73.8], ['2026-06-14', 73.2], ['2026-06-21', 72.9],
  ['2026-06-28', 72.9], ['2026-07-05', 72.4], ['2026-07-12', 72.3], ['2026-07-19', 72.0],
  ['2026-07-26', 71.8], ['2026-08-02', 71.6],
];

export const INTAKE = [2360, 2180, 1950, 2420, 2090, 2510, 1880, 2040, 2260, 1990, 2150, 2330, 1920, 2080];
export const SLEEP_HOURS = [6.2, 7.1, 6.8, 5.9, 7.4, 6.6, 7.8, 6.9, 6.4, 7.2];

export const HABIT_DEFS = [
  { key: 'protein', name: 'Protein target', seed: 3 },
  { key: 'steps', name: '8k steps', seed: 5 },
  { key: 'water', name: '2 L water', seed: 7 },
  { key: 'lights', name: 'Lights out by 11', seed: 11 },
  { key: 'stretch', name: '10 min stretch', seed: 13 },
];

const DAY = 86400000;
/** Energy in a kilogram of bodyweight — the standard planning figure. */
const KCAL_PER_KG = 7700;

export function fmt(iso: string, kind?: 'long') {
  const d = new Date(iso);
  if (kind === 'long') return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function pill(active: boolean) {
  return 'padding:9px 18px;border-radius:999px;cursor:pointer;font-size:12.5px;letter-spacing:0.01em;transition:background 220ms cubic-bezier(.4,0,.2,1),color 220ms;border:0.5px solid ' +
    (active
      ? 'transparent;background:#1A1A18;color:#FFFFFF;'
      : 'rgba(26,24,21,0.12);background:#FFFFFF;color:#57544E;');
}

export function chip(active: boolean) {
  return 'padding:7px 15px;border-radius:999px;cursor:pointer;font-size:11.5px;transition:all 220ms cubic-bezier(.4,0,.2,1);border:0.5px solid ' +
    (active ? 'rgba(192,108,132,0.35);' : 'rgba(26,24,21,0.12);') +
    (active ? 'background:#FAFAF9;color:#8A4459;' : 'background:transparent;color:#8E8A82;');
}

function habitCell(state: DailyLogState, key: string, i: number): boolean {
  const explicit = state.habitDone[key + i];
  if (explicit !== undefined) return explicit;
  const def = HABIT_DEFS.find((h) => h.key === key)!;
  return ((i + 1) * def.seed * 7919) % 10 > 2;
}

let dailyKey = '';
let dailyCache: Array<{ t: number; w: number }> = [];

export function dailySeries(readings: Reading[]) {
  const key = readings.length + ':' + readings[readings.length - 1].weight;
  if (dailyKey === key) return dailyCache;
  const out: Array<{ t: number; w: number }> = [];
  for (let i = 0; i < readings.length - 1; i++) {
    const a = readings[i];
    const b = readings[i + 1];
    const t0 = new Date(a.date).getTime();
    const t1 = new Date(b.date).getTime();
    const days = Math.round((t1 - t0) / DAY);
    for (let d = 0; d < days; d++) {
      const frac = d / days;
      const base = a.weight + (b.weight - a.weight) * frac;
      const seed = ((t0 / DAY + d) * 9301) % 233;
      const noise = ((seed % 71) / 71 - 0.5) * 0.7 + Math.sin(d * 1.7) * 0.12;
      out.push({ t: t0 + d * DAY, w: +(base + noise).toFixed(2) });
    }
  }
  const lastR = readings[readings.length - 1];
  out.push({ t: new Date(lastR.date).getTime(), w: lastR.weight });
  dailyKey = key;
  dailyCache = out;
  return out;
}

export function deriveVals(
  state: DailyLogState,
  setState: SetState,
  props: DailyLogProps,
  live: LiveData,
  onLiftSaved: () => void = () => {},
) {
  const st = state;
  const T = st.targets || {};
  const goal = T.goal ?? props.goalKg ?? 68;
  // Live weigh-ins win; a locally added reading (the weigh-in composer) wins over
  // both; the design's seed series is the last resort so an empty account still
  // renders the dashboard rather than a blank.
  const readings: Reading[] = st.readings
    ?? live.readings
    ?? BASE.map((r) => ({ date: r[0], weight: r[1] }));
  const days = live.days;
  const dayNow = todayRow(days);
  const intakeSeries = series(days, (d) => d.nutrition.dietaryEnergyKcal, 14) ?? INTAKE;
  // Declared here rather than beside its first display use: several of the
  // analysis blocks below read it, and a `const` referenced before its line is a
  // runtime crash rather than a compile error.
  const avgIntake = Math.round(intakeSeries.reduce((a, b) => a + b, 0) / intakeSeries.length);
  const sleepSeries = series(days, (d) => (d.sleep.totalMin == null ? null : d.sleep.totalMin / 60), 10) ?? SLEEP_HOURS;
  const stepSeries = series(days, (d) => d.activity.steps, 8);
  const proteinSeries = series(days, (d) => d.nutrition.proteinG, 8);
  // Today's figures come straight off Apple Health every render, so they reset
  // on their own when the date rolls over and fill in as the day syncs. Nothing
  // about today is stored, which is why there is no stale yesterday to clear.
  const logged = {
    kcal: Math.round(dayNow?.nutrition.dietaryEnergyKcal ?? 0),
    protein: Math.round(dayNow?.nutrition.proteinG ?? 0),
    steps: Math.round(dayNow?.activity.steps ?? 0),
  };

  /* ── today on the rota ── */
  // Declared up here because the step ring reads it. A twelve-hour ward day and
  // a day off are not the same day, and a target that ignores which one it is
  // will be either trivially met or quietly impossible.
  const todayISO = localISODate();
  const tomorrowISO = localISODate(new Date(Date.now() + DAY));
  const rotaToday = (live.schedule?.upcoming ?? []).find((d) => d.date === todayISO) ?? null;
  const rotaTomorrow = (live.schedule?.upcoming ?? []).find((d) => d.date === tomorrowISO) ?? null;

  // A step target read off her own distribution for this kind of day: the
  // seventieth percentile of what she actually does, so it is a stretch rather
  // than a formality. Falls back to a flat 8,000 until there is history.
  const stepTarget = (() => {
    const hist = live.schedule?.history;
    if (!hist || !days) return 8000;
    const onShift = rotaToday?.shift ?? false;
    const wanted = new Set(hist.filter((h) => h.shift === onShift).map((h) => h.date));
    const vals = days
      .filter((d) => wanted.has(d.date.slice(0, 10)))
      .map((d) => d.activity.steps)
      .filter((v): v is number => typeof v === 'number' && v > 0)
      .sort((a, b) => a - b);
    if (vals.length < 6) return 8000;
    const p70 = vals[Math.min(vals.length - 1, Math.floor(vals.length * 0.7))];
    return Math.max(4000, Math.round(p70 / 500) * 500);
  })();
  const water = dayNow?.nutrition.waterMl == null
    ? 0
    : Math.max(0, Math.min(8, Math.round(dayNow.nutrition.waterMl / 250)));
  const rhrAvg = avgOf(days, (d) => d.heart.restingHr, 7);
  const hrvAvg = avgOf(days, (d) => d.heart.hrvMs, 7);
  const activeEnergy7 = avgOf(days, (d) => d.activity.activeEnergyKcal, 7);
  // Real body composition from the scale, where the scale reports it.
  const weighByDate = new Map((live.weighIns ?? []).map((w) => [w.date.slice(0, 10), w]));
  const latestWeighIn = live.weighIns?.[live.weighIns.length - 1] ?? null;
  const latest = readings[readings.length - 1];
  const prev = readings[readings.length - 2] ?? latest;
  const formulaTdee = Math.round(st.tune.bmr + st.tune.neat + st.tune.exercise + st.tune.tef);

  // What you actually burn, back-derived from intake against weight change.
  // Trust the measurement over the formula once there is enough of it — the
  // formula is a starting guess, your own numbers are evidence.
  const intakeByDate: Record<string, number> = {};
  for (const d of live.days ?? []) {
    if (d.nutrition.dietaryEnergyKcal != null) intakeByDate[d.date.slice(0, 10)] = d.nutrition.dietaryEnergyKcal;
  }
  const seedReadings: Reading[] = st.readings ?? live.readings ?? BASE.map((r) => ({ date: r[0], weight: r[1] }));
  const measured = Object.keys(intakeByDate).length >= 5
    ? tdeeRealityCheck(seedReadings, intakeByDate, formulaTdee, -st.pace)
    : null;
  const tdee = measured && measured.days >= 7 ? Math.round(measured.actualTdee) : formulaTdee;
  const tdeeSource = measured && measured.days >= 7 ? 'measured' : 'formula';

  // And the day's budget follows from expenditure and pace, rather than sitting
  // at a round number the rest of the dashboard then contradicts.
  const derivedTarget = Math.max(1200, Math.round((tdee - st.pace * 1100) / 10) * 10);
  const kcalTarget = T.kcal ?? derivedTarget;
  const unit = st.unit;
  const conv = (v: number) => (unit === 'lb' ? v * 2.20462 : v);
  const uLabel = unit === 'lb' ? 'lb' : 'kg';
  const bmiOf = (w: number) => w / (1.68 * 1.68);

  /* ── tabs ── */
  const navDefs: Array<[DailyLogState['tab'], string, string]> = [
    ['today', 'Today', 'now'],
    ['trends', 'Trends', readings.length + ' logs'],
    ['plan', 'Plan', st.pace.toFixed(2) + ' kg/wk'],
    ['progress', 'Progress', '−' + (BASE[0][1] - latest.weight).toFixed(1) + ' kg'],
    ['food', 'Nutrition', tdee.toLocaleString() + ' kcal'],
    ['training', 'Training', '4 sessions'],
    ['habits', 'Habits', '21 days'],
  ];
  const tabs = navDefs.map((n) => ({
    label: n[1],
    onClick: () => setState({ tab: n[0] }),
    style: pill(st.tab === n[0]),
  }));

  /* ── KPI cards ── */
  // Sparklines are drawn twice: a filled area for weight, a stroke on top for
  // the line itself. A flat series still reads as a shape rather than a hairline.
  const sparkPoints = (vals: number[]) => {
    const mn = Math.min.apply(null, vals);
    const mx = Math.max.apply(null, vals);
    const rng = mx - mn || 1;
    return vals.map((v, i) => ({
      x: +((i / (vals.length - 1)) * 118 + 1).toFixed(1),
      y: +(25 - ((v - mn) / rng) * 21).toFixed(1),
    }));
  };
  /** Catmull-Rom through the points, as a cubic path — reads softer than joins. */
  const smooth = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
    }
    return d;
  };
  const sparkOf = (vals: number[]) => smooth(sparkPoints(vals));
  const areaOf = (vals: number[]) => {
    const pts = sparkPoints(vals);
    if (pts.length < 2) return '';
    return smooth(pts) + ` L${pts[pts.length - 1].x},30 L${pts[0].x},30 Z`;
  };
  const last8 = readings.slice(-8).map((r) => r.weight);
  const dw = latest.weight - prev.weight;
  const proteinPerKg = T.proteinPerKg ?? props.proteinPerKg ?? 1.8;
  const kpis = [
    { label: 'Weight', value: +conv(latest.weight).toFixed(1), decimals: 1, unit: uLabel, chip: (dw <= 0 ? '↓ ' : '↑ ') + Math.abs(conv(dw)).toFixed(1), chipBg: dw <= 0 ? '#EDF1EC' : '#F7F6F5', chipColor: dw <= 0 ? '#7F9289' : '#AA7F68', color: '#C06C84', spark: sparkOf(last8), area: areaOf(last8) },
    { label: 'Calories', value: logged.kcal, decimals: 0, unit: 'kcal', chip: Math.max(0, kcalTarget - logged.kcal).toLocaleString() + ' left', chipBg: '#F4F4F3', chipColor: '#57544E', color: '#7F9289', spark: sparkOf(intakeSeries.slice(-8)), area: areaOf(intakeSeries.slice(-8)) },
    { label: 'Protein', value: logged.protein, decimals: 0, unit: 'g', chip: Math.round((logged.protein / (latest.weight * proteinPerKg)) * 100) + '%', chipBg: '#FBF4F6', chipColor: '#8A4459', color: '#8A4459', spark: sparkOf(proteinSeries ? [...proteinSeries.slice(-7), logged.protein] : [88, 104, 96, 120, 112, 98, 126, logged.protein]), area: areaOf(proteinSeries ? [...proteinSeries.slice(-7), logged.protein] : [88, 104, 96, 120, 112, 98, 126, logged.protein]) },
    { label: 'Steps', value: logged.steps, decimals: 0, unit: '', chip: logged.steps >= stepTarget ? 'goal met' : 'keep going', chipBg: logged.steps >= stepTarget ? '#EDF1EC' : '#F4F4F3', chipColor: logged.steps >= stepTarget ? '#7F9289' : '#57544E', color: '#57544E', spark: sparkOf(stepSeries ? [...stepSeries.slice(-7), logged.steps] : [7400, 9100, 6800, 10400, 8900, 7600, 11200, logged.steps]), area: areaOf(stepSeries ? [...stepSeries.slice(-7), logged.steps] : [7400, 9100, 6800, 10400, 8900, 7600, 11200, logged.steps]) },
    { label: 'Sleep', value: +(sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length).toFixed(1), decimals: 1, unit: 'h avg', chip: 'RHR ' + Math.round(rhrAvg ?? 58), chipBg: '#F4F4F3', chipColor: '#57544E', color: '#C06C84', spark: sparkOf(sleepSeries.slice(-8)), area: areaOf(sleepSeries.slice(-8)) },
  ].map((k, i) => ({ ...k, gradId: 'spark-' + i, display: k.decimals ? k.value.toFixed(k.decimals) : Math.round(k.value).toLocaleString() }));

  /* ── rings ── */
  const ringDefs = [
    { key: 'kcal' as const, name: 'Calories', r: 84, color: '#C98BA0', track: '#F7F6F5', value: logged.kcal, target: kcalTarget, unit: 'kcal', step: 250 },
    { key: 'protein' as const, name: 'Protein', r: 66, color: '#9FB3A9', track: '#FBF4F6', value: logged.protein, target: Math.round(latest.weight * proteinPerKg), unit: 'g', step: 15 },
    { key: 'steps' as const, name: 'Steps', r: 48, color: '#D194A8', track: '#FAF0F3', value: logged.steps, target: stepTarget, unit: '', step: 500 },
  ];
  const rings = ringDefs.map((r) => {
    const c = 2 * Math.PI * r.r;
    const pct = Math.min(1, r.value / r.target);
    return {
      r: r.r, color: r.color, track: r.track, name: r.name,
      dash: c.toFixed(1), offset: (c * (1 - pct)).toFixed(1),
      detail: r.value.toLocaleString() + ' of ' + r.target.toLocaleString() + ' ' + r.unit + ' · ' + Math.round(pct * 100) + '%',
      onClick: () => setState({ ringFocus: r.key }),
      rowStyle: 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 200ms cubic-bezier(.4,0,.2,1);' +
        (st.ringFocus === r.key ? 'background:var(--paper-deep);' : 'background:transparent;'),
    };
  });
  const focus = ringDefs.find((r) => r.key === st.ringFocus) || ringDefs[0];
  const ringFocus = {
    value: focus.value.toLocaleString(),
    label: focus.key === 'kcal' ? 'KCAL EATEN' : focus.name.toUpperCase() + ' TODAY',
  };

  /* ── chart ── */
  // BMI and body fat come off the scale when it reports them; otherwise they fall
  // back to the design's estimates so the metric switcher still has four series.
  const scaleAt = (r: { date?: string }) => (r.date ? weighByDate.get(r.date.slice(0, 10)) : undefined);
  const metricDefs = {
    weight: { label: 'Weight', get: (r: { weight: number }) => conv(r.weight), unit: uLabel, dp: 1 },
    bmi: {
      label: 'BMI',
      get: (r: { weight: number; date?: string }) => scaleAt(r)?.bmi ?? bmiOf(r.weight),
      unit: '', dp: 1,
    },
    fat: {
      label: 'Body fat',
      get: (r: { weight: number; date?: string }) => scaleAt(r)?.bodyFat ?? 30.5 - (76.9 - r.weight) * 0.55,
      unit: '%', dp: 1,
    },
    waist: { label: 'Waist', get: (r: { weight: number }) => 84 - (76.9 - r.weight) * 0.9, unit: 'cm', dp: 1 },
  };
  const M = metricDefs[st.metric];
  const daily = dailySeries(readings);
  const W = 900, H = 340, L = 54, R = 846, TOP = 22, BOT = 286;
  const tLast = daily[daily.length - 1].t;
  const tFirst = daily[0].t;
  const rangeStart = st.range >= 365 ? tFirst : Math.max(tFirst, tLast - st.range * DAY);
  const startIdx = Math.max(0, daily.findIndex((d) => d.t >= rangeStart));
  const shownDaily = daily.slice(startIdx);
  const ma = daily.map((_, i) => {
    const win = daily.slice(Math.max(0, i - 6), i + 1);
    return win.reduce((a, d) => a + d.w, 0) / win.length;
  });
  const shownMa = ma.slice(startIdx);
  const resid = shownDaily.map((d, i) => d.w - shownMa[i]);
  const sd = Math.sqrt(resid.reduce((a, r) => a + r * r, 0) / Math.max(1, resid.length));

  const rateWeekly = st.rate;
  const projDays = 84;
  const maLast = shownMa[shownMa.length - 1];
  const projVal = M.get({ weight: maLast + rateWeekly * (projDays / 7) });
  const goalVal = st.metric === 'weight' ? conv(goal) : st.metric === 'bmi' ? bmiOf(goal) : null;
  const tMax = tLast + projDays * DAY;
  const mv = (w: number) => M.get({ weight: w });
  const allVals = shownDaily.map((d) => mv(d.w)).concat([projVal]).concat(goalVal !== null ? [goalVal] : []);
  let vMin = Math.min.apply(null, allVals);
  let vMax = Math.max.apply(null, allVals);
  const padV = (vMax - vMin) * 0.16 || 1;
  vMin -= padV; vMax += padV;
  const xOf = (t: number) => L + ((t - rangeStart) / (tMax - rangeStart)) * (R - L);
  const yOf = (v: number) => TOP + (1 - (v - vMin) / (vMax - vMin)) * (BOT - TOP);

  const dotEvery = Math.ceil(shownDaily.length / 130);
  const rawDots = shownDaily.filter((_, i) => i % dotEvery === 0).map((d) => ({
    x: +xOf(d.t).toFixed(1), y: +yOf(mv(d.w)).toFixed(1),
  }));
  const weighDots = readings
    .filter((r) => new Date(r.date).getTime() >= rangeStart)
    .map((r, i, arr) => ({
      x: +xOf(new Date(r.date).getTime()).toFixed(1),
      y: +yOf(M.get(r)).toFixed(1),
      r: i === arr.length - 1 ? 5.5 : 3.4,
    }));
  const maPath = shownMa.map((v, i) => (i ? 'L' : 'M') + xOf(shownDaily[i].t).toFixed(1) + ',' + yOf(mv(v)).toFixed(1)).join(' ');
  const bandUp = shownMa.map((v, i) => (i ? 'L' : 'M') + xOf(shownDaily[i].t).toFixed(1) + ',' + yOf(mv(v + sd)).toFixed(1)).join(' ');
  const bandDown = shownMa.slice().reverse().map((v, i) => {
    const idx = shownMa.length - 1 - i;
    return 'L' + xOf(shownDaily[idx].t).toFixed(1) + ',' + yOf(mv(v - sd)).toFixed(1);
  }).join(' ');
  const bandPath = bandUp + ' ' + bandDown + ' Z';
  const pStartX = +xOf(tLast).toFixed(1), pStartY = +yOf(mv(maLast)).toFixed(1);
  const pEndX = +xOf(tMax).toFixed(1), pEndY = +yOf(projVal).toFixed(1);
  const projBandPath = 'M' + pStartX + ',' + pStartY + ' L' + pEndX + ',' + yOf(projVal + sd * 2.2).toFixed(1) +
    ' L' + pEndX + ',' + yOf(projVal - sd * 2.2).toFixed(1) + ' Z';

  const lo = shownDaily.reduce((a, d) => (d.w < a.w ? d : a), shownDaily[0]);
  const hi = shownDaily.reduce((a, d) => (d.w > a.w ? d : a), shownDaily[0]);
  const marker = (d: { t: number; w: number }, label: string) => ({
    x: +xOf(d.t).toFixed(1), y: +yOf(mv(d.w)).toFixed(1),
    ly: +(yOf(mv(d.w)) + (label === 'Lowest' ? 20 : -12)).toFixed(1),
    label: label + ' ' + mv(d.w).toFixed(M.dp),
  });

  const yTicks: Array<{ y: number; ty: number; label: string }> = [];
  for (let i = 0; i <= 4; i++) {
    const v = vMin + (vMax - vMin) * (i / 4);
    yTicks.push({ y: +yOf(v).toFixed(1), ty: +(yOf(v) + 3.5).toFixed(1), label: v.toFixed(M.dp) });
  }
  const tickCount = 6;
  const xTicks: Array<{ x: number; label: string; color: string }> = [];
  for (let i = 0; i <= tickCount; i++) {
    const t = rangeStart + ((tMax - rangeStart) * i) / tickCount;
    xTicks.push({
      x: +xOf(t).toFixed(1),
      label: new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase(),
      color: t > tLast ? '#A6ADA7' : '#8E8A82',
    });
  }

  const firstShown = shownDaily[0];
  const totalChange = mv(shownDaily[shownDaily.length - 1].w) - mv(firstShown.w);
  const weeksSpan = Math.max(1, (tLast - firstShown.t) / (7 * DAY));
  const chartStats = [
    { label: 'Now', value: mv(daily[daily.length - 1].w).toFixed(M.dp), unit: M.unit },
    { label: '7-day trend', value: mv(maLast).toFixed(M.dp), unit: M.unit },
    { label: 'Change', value: (totalChange >= 0 ? '+' : '−') + Math.abs(totalChange).toFixed(1), unit: 'in range' },
    { label: 'Per week', value: (totalChange / weeksSpan >= 0 ? '+' : '−') + Math.abs(totalChange / weeksSpan).toFixed(2), unit: 'avg' },
    { label: 'Lowest', value: mv(lo.w).toFixed(M.dp), unit: fmt(new Date(lo.t).toISOString().slice(0, 10)) },
    { label: 'To goal', value: goalVal !== null ? (mv(daily[daily.length - 1].w) - goalVal).toFixed(1) : '—', unit: goalVal !== null ? 'remaining' : 'n/a' },
  ];
  const rangeLabelMap: Record<number, string> = { 30: 'last 30 days', 90: 'last 3 months', 180: 'last 6 months', 400: 'all data' };

  /* ── projections ── */
  const mk = (label: string, weeks: number) => {
    const kg = latest.weight + rateWeekly * weeks;
    const d = kg - latest.weight;
    return {
      label, kg: conv(kg).toFixed(1) + ' ' + uLabel,
      delta: (d >= 0 ? '+' : '−') + Math.abs(conv(d)).toFixed(1),
      chipBg: d >= 0 ? '#F7F6F5' : '#EDF1EC',
      chipColor: d >= 0 ? '#AA7F68' : '#7F9289',
    };
  };
  const remainingToGoal = latest.weight - goal;
  const weeksToGoalRate = rateWeekly < -0.01 ? remainingToGoal / -rateWeekly : null;
  const etaCopy = weeksToGoalRate
    ? 'At ' + Math.abs(rateWeekly).toFixed(2) + ' kg a week you reach ' + goal.toFixed(1) + ' kg around ' + fmt(new Date(new Date(latest.date).getTime() + weeksToGoalRate * 7 * DAY).toISOString().slice(0, 10), 'long') + ' 2026 — about ' + Math.round(weeksToGoalRate) + ' weeks, and roughly ' + Math.round(-rateWeekly * 1100) + ' kcal a day below maintenance.'
    : 'At this pace the goal never arrives — nudge the slider below zero to see a timeline.';

  /* ── body metric rows ── */
  const last12 = readings.slice(-12);
  const ref12 = readings[Math.max(0, readings.length - 12)];
  const bodyRows = [
    { label: 'Weight', value: conv(latest.weight).toFixed(1) + ' ' + uLabel, spark: last12.map((r) => r.weight), d: latest.weight - ref12.weight },
    { label: 'BMI', value: bmiOf(latest.weight).toFixed(1), spark: last12.map((r) => bmiOf(r.weight)), d: bmiOf(latest.weight) - bmiOf(ref12.weight) },
    { label: 'Body fat', value: metricDefs.fat.get(latest).toFixed(1) + ' %', spark: last12.map((r) => metricDefs.fat.get(r)), d: metricDefs.fat.get(latest) - metricDefs.fat.get(ref12) },
    { label: 'Waist', value: metricDefs.waist.get(latest).toFixed(1) + ' cm', spark: last12.map((r) => metricDefs.waist.get(r)), d: metricDefs.waist.get(latest) - metricDefs.waist.get(ref12) },
    ...(latestWeighIn && latestWeighIn.muscleMass > 0
      ? [{
          label: 'Muscle mass',
          value: latestWeighIn.muscleMass.toFixed(1) + ' kg',
          spark: (live.weighIns ?? []).slice(-12).map((w) => w.muscleMass),
          d: latestWeighIn.muscleMass - ((live.weighIns ?? [])[Math.max(0, (live.weighIns ?? []).length - 12)]?.muscleMass ?? latestWeighIn.muscleMass),
        }]
      : []),
    ...(latestWeighIn && latestWeighIn.water > 0
      ? [{
          label: 'Body water',
          value: latestWeighIn.water.toFixed(1) + ' %',
          spark: (live.weighIns ?? []).slice(-12).map((w) => w.water),
          d: latestWeighIn.water - ((live.weighIns ?? [])[Math.max(0, (live.weighIns ?? []).length - 12)]?.water ?? latestWeighIn.water),
        }]
      : []),
  ].map((b) => ({
    label: b.label, value: b.value, spark: b.spark,
    delta: (b.d >= 0 ? '+' : '−') + Math.abs(b.d).toFixed(1),
    chipBg: b.d <= 0 ? '#EDF1EC' : '#F7F6F5',
    chipColor: b.d <= 0 ? '#7F9289' : '#AA7F68',
  }));

  /* ── nutrition ── */
  const proteinTarget = Math.round(latest.weight * proteinPerKg);
  const macros = [
    { label: 'Protein', v: logged.protein, t: proteinTarget, unit: 'g', color: '#7F9289' },
    { label: 'Carbohydrate', v: Math.round(dayNow?.nutrition.carbsG ?? 148), t: 210, unit: 'g', color: '#C06C84' },
    { label: 'Fat', v: Math.round(dayNow?.nutrition.fatG ?? 52), t: 68, unit: 'g', color: '#8A4459' },
  ].map((m) => ({
    label: m.label,
    value: m.v + ' / ' + m.t + ' ' + m.unit,
    barStyle: 'height:100%;width:' + Math.min(100, (m.v / m.t) * 100).toFixed(1) + '%;background:' + m.color + ';border-radius:999px;transition:width 500ms cubic-bezier(.16,1,.3,1);',
  }));
  const tdeeRows = [
    { key: 'bmr' as const, acronym: 'BMR', fullName: 'what the body spends existing', color: '#1A1A18', detail: 'Mifflin–St Jeor at ' + latest.weight.toFixed(1) + ' kg, 168 cm, 26 years. This is the floor.' },
    { key: 'neat' as const, acronym: 'NEAT', fullName: 'everything that is not training', color: '#C06C84', detail: 'Walking, shifts, stairs, fidgeting. The most volatile line — a busy day and a rest day differ by roughly 400 kcal.' },
    { key: 'exercise' as const, acronym: 'EAT', fullName: 'deliberate training', color: '#7F9289', detail: 'Four logged sessions a week, spread across seven days. Strength work costs less than it feels like.' },
    { key: 'tef' as const, acronym: 'TEF', fullName: 'the cost of digesting food', color: '#8A4459', detail: 'Roughly 8–10% of intake, and it rises with protein.' },
  ].map((r) => ({
    acronym: r.acronym, fullName: r.fullName, color: r.color, detail: r.detail,
    value: st.tune[r.key], percent: Math.round((st.tune[r.key] / tdee) * 100),
    onTune: (v: number) => setState((s) => ({ tune: { ...s.tune, [r.key]: Math.round(v) } })),
  }));
  const ledgerDays = intakeSeries.map((kcal, i) => ({
    date: new Date(new Date(latest.date).getTime() - (intakeSeries.length - 1 - i) * DAY).toISOString().slice(0, 10),
    intake: kcal,
    tdee: tdee + (i % 3 === 0 ? 110 : i % 3 === 1 ? -50 : 40),
  }));

  /* ── analysis ── */
  // The maths already existed in src/lib/fitness; it just had no caller after
  // the old dashboard went. Everything here runs on the real series and
  // returns null when there isn't enough of one to say anything.
  const plateau = readings.length >= 3 ? detectPlateau(readings) : null;
  const reality = measured;

  // Recovery readiness: today's HRV and resting HR against their own baselines,
  // plus how hard the last seven days have been.
  const hrvBase = avgOf(days, (d) => d.heart.hrvMs, 28);
  const rhrBase = avgOf(days, (d) => d.heart.restingHr, 28);
  const hrvNow = avgOf(days, (d) => d.heart.hrvMs, 3);
  const rhrNow = avgOf(days, (d) => d.heart.restingHr, 3);
  const readiness = (() => {
    if (hrvBase == null || hrvNow == null || rhrBase == null || rhrNow == null) return null;
    // Above-baseline HRV and below-baseline resting HR both read as recovered.
    const hrvDelta = (hrvNow - hrvBase) / hrvBase;
    const rhrDelta = (rhrBase - rhrNow) / rhrBase;
    const score = Math.max(0, Math.min(100, Math.round(50 + (hrvDelta * 120) + (rhrDelta * 160))));
    const verdict = score >= 66
      ? 'Recovered — train as planned, and take the top set if it is there.'
      : score >= 40
      ? 'Middling — train, but hold the last set back rather than chasing a number.'
      : 'Under-recovered — drop a set, keep the walk, and get the earlier night.';
    return { score, verdict, hrvDelta, rhrDelta };
  })();

  // Macro adherence over the last week: how often protein cleared its target
  // and intake stayed inside the budget.
  const adherence7 = (() => {
    const recent = (days ?? []).slice(-7).filter((d) => d.nutrition.dietaryEnergyKcal != null);
    if (!recent.length) return null;
    const proteinTargetG = Math.round(latest.weight * proteinPerKg);
    const proteinDays = recent.filter((d) => (d.nutrition.proteinG ?? 0) >= proteinTargetG * 0.9).length;
    const intakeDays = recent.filter((d) => (d.nutrition.dietaryEnergyKcal ?? 0) <= kcalTarget * 1.05).length;
    return {
      days: recent.length,
      proteinDays,
      intakeDays,
      pct: Math.round(((proteinDays + intakeDays) / (recent.length * 2)) * 100),
    };
  })();

  /* ── weekly deficit ── */
  // Burn per day uses the measured active energy where Apple Health has it and
  // the tuned NEAT + EAT estimate where it doesn't, so a week with partial sync
  // still lands in the right place rather than dropping out.
  const restingBurn = st.tune.bmr + st.tune.tef;
  const deficitWeeks = (() => {
    if (!days) return null;
    const buckets = new Map<number, { intake: number; burn: number; n: number; start: number }>();
    for (const d of days) {
      const intake = d.nutrition.dietaryEnergyKcal;
      if (intake == null) continue;
      const t0 = new Date(d.date).getTime();
      // Weeks start on Monday.
      const dow = (new Date(d.date).getDay() + 6) % 7;
      const start = t0 - dow * DAY;
      const key = Math.floor(start / DAY);
      const active = d.activity.activeEnergyKcal;
      const burn = restingBurn + (active == null ? st.tune.neat + st.tune.exercise : active);
      const b = buckets.get(key) ?? { intake: 0, burn: 0, n: 0, start };
      b.intake += intake;
      b.burn += burn;
      b.n += 1;
      buckets.set(key, b);
    }
    const keys = [...buckets.keys()].sort((a, b) => a - b).slice(-8);
    return keys.length ? keys.map((k) => buckets.get(k)!) : null;
  })()
    // With no synced nutrition, fold the seed intake series into whole weeks so
    // the card demonstrates its shape rather than sitting empty.
    ?? (() => {
      const out: Array<{ intake: number; burn: number; n: number; start: number }> = [];
      const anchor = new Date(latest.date).getTime();
      for (let w = 0; w * 7 < intakeSeries.length; w++) {
        const slice = intakeSeries.slice(w * 7, w * 7 + 7);
        if (!slice.length) break;
        out.push({
          intake: slice.reduce((a, b) => a + b, 0),
          burn: tdee * slice.length,
          n: slice.length,
          start: anchor - (Math.ceil(intakeSeries.length / 7) - w) * 7 * DAY,
        });
      }
      return out.length ? out : null;
    })();

  const weeklyDeficitRows = (deficitWeeks ?? []).map((w, i, arr) => {
    const deficit = w.burn - w.intake;
    const perDay = Math.round(deficit / w.n);
    const kg = deficit / KCAL_PER_KG;
    const peak = Math.max(...arr.map((x) => Math.abs(x.burn - x.intake)), 1);
    const isNow = i === arr.length - 1;
    return {
      label: new Date(w.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      total: (deficit >= 0 ? '−' : '+') + Math.abs(Math.round(deficit)).toLocaleString(),
      perDay: (perDay >= 0 ? '−' : '+') + Math.abs(perDay).toLocaleString() + ' / day',
      kg: (kg >= 0 ? '−' : '+') + Math.abs(kg).toFixed(2) + ' kg',
      partial: w.n < 7 ? w.n + '/7 days' : '',
      barStyle: 'height:100%;width:' + Math.max(2, (Math.abs(deficit) / peak) * 100).toFixed(0) +
        '%;border-radius:999px;transition:width 500ms cubic-bezier(.16,1,.3,1);background:' +
        (deficit >= 0 ? (isNow ? '#C06C84' : '#F2DCE4') : '#C98BA0') + ';',
    };
  });

  const thisWeek = deficitWeeks?.[deficitWeeks.length - 1] ?? null;
  const thisWeekDeficit = thisWeek ? thisWeek.burn - thisWeek.intake : null;
  const weeklyDeficitHeadline = thisWeekDeficit == null
    ? '—'
    : (thisWeekDeficit >= 0 ? '−' : '+') + Math.abs(Math.round(thisWeekDeficit)).toLocaleString();
  const weeklyDeficitCopy = thisWeek == null
    ? 'No intake logged yet this week — the ledger fills in as Apple Health syncs.'
    : 'Across ' + thisWeek.n + ' logged day' + (thisWeek.n === 1 ? '' : 's') + ' that is ' +
      (thisWeekDeficit! >= 0 ? 'a deficit' : 'a surplus') + ' of about ' +
      Math.abs(Math.round(thisWeekDeficit! / thisWeek.n)).toLocaleString() + ' kcal a day, or ' +
      Math.abs(thisWeekDeficit! / KCAL_PER_KG).toFixed(2) + ' kg of bodyweight at ' +
      KCAL_PER_KG.toLocaleString() + ' kcal per kg.';

  /* ── training ── */
  const sessionDefs = [
    { day: 'MON', name: 'Lower body', note: 'Squat, hinge, calves', kcal: 310, tint: '#FBF4F6', sets: [{ move: 'Back squat', load: '62.5 kg', reps: '4 × 6' }, { move: 'Romanian deadlift', load: '55 kg', reps: '3 × 8' }, { move: 'Calf raise', load: '40 kg', reps: '3 × 12' }] },
    { day: 'TUE', name: 'Long walk', note: '74 min, riverside', kcal: 290, tint: '#EDF1EC', sets: [{ move: 'Zone 2 walk', load: '5.9 km', reps: '74 min' }] },
    { day: 'WED', name: 'Upper body', note: 'Press, row, curls', kcal: 265, tint: '#FBF4F6', sets: [{ move: 'Overhead press', load: '27.5 kg', reps: '4 × 6' }, { move: 'Chest-supported row', load: '35 kg', reps: '3 × 10' }, { move: 'Cable curl', load: '15 kg', reps: '3 × 12' }] },
    { day: 'FRI', name: 'Full body', note: 'Deadlift, push-ups, core', kcal: 340, tint: '#FBF4F6', sets: [{ move: 'Deadlift', load: '85 kg', reps: '3 × 5' }, { move: 'Push-up', load: 'bodyweight', reps: '3 × 12' }, { move: 'Dead bug', load: '—', reps: '3 × 10' }] },
    { day: 'SUN', name: 'Mobility', note: 'Hips and ankles', kcal: 60, tint: '#F4F4F3', sets: [{ move: 'Flow', load: '22 min', reps: 'easy' }] },
  ];
  const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekStart = Date.now() - 7 * DAY;
  const liftsByDate = new Map<string, Lift[]>();
  for (const l of live.lifts ?? []) {
    const k = l.performedOn.slice(0, 10);
    liftsByDate.set(k, [...(liftsByDate.get(k) ?? []), l]);
  }
  const liveSessions = (live.workouts ?? [])
    .filter((w) => new Date(w.startedAt).getTime() >= weekStart)
    .map((w) => {
      const dayKey = new Date(w.startedAt).toISOString().slice(0, 10);
      // A lift logged on the same day belongs to that session.
      const detail = (liftsByDate.get(dayKey) ?? []).map((l) => ({
        move: l.exercise,
        load: l.topSetKg ? l.topSetKg + ' kg' : '—',
        reps: l.sets.length + ' × ' + (l.sets[0]?.reps ?? 0),
      }));
      if (w.durationMin) detail.push({ move: 'Duration', load: Math.round(w.durationMin) + ' min', reps: '' });
      if (w.distanceKm) detail.push({ move: 'Distance', load: w.distanceKm.toFixed(1) + ' km', reps: '' });
      if (w.avgHr) detail.push({ move: 'Average heart rate', load: Math.round(w.avgHr) + ' bpm', reps: w.maxHr ? 'max ' + Math.round(w.maxHr) : '' });
      return {
        day: DOW[new Date(w.startedAt).getDay()],
        name: w.type ?? 'Session',
        note: [w.durationMin ? Math.round(w.durationMin) + ' min' : null, w.source].filter(Boolean).join(' · '),
        kcal: Math.round(w.energyKcal ?? 0),
        tint: '#FBF4F6',
        // Set-level detail needs a lift log, which nothing writes yet; until then
        // a session opens onto what Apple Health actually recorded.
        sets: detail.length ? detail : [{ move: 'Nothing logged for this session', load: '—', reps: '' }],
      };
    });
  const sessionSource = liveSessions.length ? liveSessions : sessionDefs;
  const sessions = sessionSource.map((s, i) => ({
    ...s,
    open: st.openSession === i,
    caret: st.openSession === i ? '−' : '+',
    onClick: () => setState({ openSession: st.openSession === i ? null : i }),
  }));
  // Weekly active-energy totals, most recent eight weeks.
  const liveLoad = (() => {
    if (!days) return null;
    const buckets = new Map<number, number>();
    for (const d of days) {
      const kcal = d.activity.activeEnergyKcal;
      if (kcal == null) continue;
      const wk = Math.floor(new Date(d.date).getTime() / (7 * DAY));
      buckets.set(wk, (buckets.get(wk) ?? 0) + kcal);
    }
    const keys = [...buckets.keys()].sort((a, b) => a - b).slice(-8);
    return keys.length >= 2 ? keys.map((k) => Math.round(buckets.get(k)!)) : null;
  })();
  const loadVals = liveLoad ?? [1820, 2140, 1960, 2380, 2050, 2460, 2280, 2410];
  const loadMax = Math.max.apply(null, loadVals);
  const loadBars = loadVals.map((v, i) => ({
    label: 'W' + (i + 24),
    title: v.toLocaleString() + ' kcal active energy',
    style: 'width:100%;height:' + ((v / loadMax) * 100).toFixed(1) + '%;border-radius:8px 8px 0 0;background:' + (i === loadVals.length - 1 ? '#C06C84' : '#F2DCE4') + ';transition:height 500ms cubic-bezier(.16,1,.3,1);',
  }));
  // Bests Apple Health can actually answer. Lift PRs would need set-level data,
  // which nothing records; these come off the workout log itself.
  const prs = (() => {
    // A lift log gives real per-movement bests; without one, fall back to what
    // Apple Health can answer about sessions.
    const lifts = live.lifts ?? [];
    if (lifts.length) {
      const best = new Map<string, Lift>();
      for (const l of lifts) {
        const cur = best.get(l.exercise);
        if (!cur || l.e1rmKg > cur.e1rmKg) best.set(l.exercise, l);
      }
      const ranked = [...best.values()].sort((a, b) => b.e1rmKg - a.e1rmKg).slice(0, 4);
      if (ranked.length) {
        return ranked.map((l) => {
          const top = l.sets.reduce((a, s) => (s.weightKg > a.weightKg ? s : a), l.sets[0]);
          return {
            move: l.exercise + ' · ' + top.reps + ' reps',
            value: top.weightKg + ' kg',
          };
        });
      }
    }
    const w = live.workouts ?? [];
    if (!w.length) {
      return [
        { move: 'Longest session', value: '—' },
        { move: 'Furthest distance', value: '—' },
        { move: 'Biggest burn', value: '—' },
        { move: 'Busiest day', value: '—' },
      ];
    }
    const max = (pick: (x: Workout) => number | null | undefined) =>
      w.reduce<{ v: number; w: Workout } | null>((best, x) => {
        const v = pick(x);
        if (v == null || !Number.isFinite(v)) return best;
        return !best || v > best.v ? { v, w: x } : best;
      }, null);

    const longest = max((x) => x.durationMin);
    const furthest = max((x) => x.distanceKm);
    const biggest = max((x) => x.energyKcal);
    const steppiest = (days ?? []).reduce<number | null>((best, d) => {
      const v = d.activity.steps;
      if (v == null) return best;
      return best == null || v > best ? v : best;
    }, null);

    return [
      { move: 'Longest session', value: longest ? Math.round(longest.v) + ' min' : '—' },
      { move: 'Furthest distance', value: furthest ? furthest.v.toFixed(1) + ' km' : '—' },
      { move: 'Biggest burn', value: biggest ? Math.round(biggest.v).toLocaleString() + ' kcal' : '—' },
      { move: 'Most steps in a day', value: steppiest == null ? '—' : Math.round(steppiest).toLocaleString() },
    ];
  })();

  /* ── corrections ── */
  // A dashboard that only reports is half a dashboard. Where the numbers imply
  // a specific change, work out what that change is and offer to make it.
  const fit = readings.length >= 4 ? fitReadings(readings) : null;
  // The forecast wants the long-run line; a correction wants the current one. A
  // rate averaged over six months would keep prescribing changes for a month
  // that has already turned around.
  const recent = readings.filter(
    (r) => new Date(r.date).getTime() >= new Date(latest.date).getTime() - 28 * DAY,
  );
  const recentFit = recent.length >= 4 ? fitReadings(recent) : fit;
  const measuredWeekly = recentFit ? recentFit.slope * 7 : null;

  const correction = (() => {
    if (measuredWeekly == null || !Number.isFinite(measuredWeekly)) return null;
    const targetWeekly = -st.pace;
    const gap = measuredWeekly - targetWeekly;      // positive = losing too slowly
    if (Math.abs(gap) < 0.12) return null;          // inside the noise, leave it alone

    const rate = Math.abs(measuredWeekly).toFixed(2);
    // One move at a time. A big correction applied in one step overshoots, because
    // the maintenance figure it was calculated from is itself an estimate.
    const STEP = 200;
    // Below BMR is where a cut stops being a diet, so it is the floor — and it is
    // a number already on the dashboard rather than an arbitrary one.
    const floor = Math.max(1200, Math.round(st.tune.bmr / 10) * 10);
    // The measured rate is the body's answer to what she actually ate, not to
    // what the plan asked for. Anchoring the arithmetic on the budget instead of
    // on real intake is how you end up telling someone to eat more in order to
    // lose faster.
    const eating = avgIntake > 0 ? avgIntake : kcalTarget;
    const needed = eating - (gap * KCAL_PER_KG) / 7;

    // When the pace cannot be met without eating under BMR — or when the plan is
    // already asking for that — the pace is what has to give, not the food.
    if (needed < floor || kcalTarget < floor) {
      // Two constraints, both of which have to hold: what her measured response
      // says the floor can actually buy, and what keeps the plan's own derived
      // budget above the floor. Rounded down, not to nearest — rounding up would
      // land the budget a few kcal under and ask for a second click.
      const reachable = Math.abs(measuredWeekly) + ((eating - floor) * 7) / KCAL_PER_KG;
      const budgetAllows = (tdee - floor) / (KCAL_PER_KG / 7);
      const pace = Math.floor(Math.max(0.05, Math.min(st.pace - 0.05, reachable, budgetAllows)) * 20) / 20;
      if (pace >= st.pace || pace < 0.05) return null;
      const already = kcalTarget < floor;
      return {
        cta: `Set ${pace.toFixed(2)} kg/wk`,
        delta: '−' + (st.pace - pace).toFixed(2),
        title: already
          ? `The plan is asking for ${kcalTarget.toLocaleString()} kcal — under your BMR`
          : `${st.pace.toFixed(2)} kg/wk is not reachable without eating below BMR`,
        note: already
          ? `A ${st.pace.toFixed(2)} kg/wk target against your current maintenance works out at ${kcalTarget.toLocaleString()} kcal, below your ${floor.toLocaleString()} kcal BMR. That is not a budget worth holding. At ${pace.toFixed(2)} kg/wk the budget clears BMR and the loss keeps going — slower, but at a rate you can actually eat at.`
          : `You are losing ${rate} kg/wk on about ${Math.round(eating).toLocaleString()} kcal a day. Hitting ${st.pace.toFixed(2)} from here needs roughly ${Math.round(needed).toLocaleString()} kcal, under your ${floor.toLocaleString()} kcal BMR. The honest ceiling is ${pace.toFixed(2)} kg/wk.`,
        apply: () => setState({ pace }),
      };
    }

    // A budget that is being missed by a wide margin is not a budget problem.
    if (eating - kcalTarget > 250) {
      return {
        title: `Eating about ${Math.round(eating).toLocaleString()} kcal against a ${kcalTarget.toLocaleString()} budget`,
        note: `The trend is off plan, but the budget is not the reason — it is being missed by roughly ${Math.round(eating - kcalTarget).toLocaleString()} kcal a day. Lowering the number on the card will not change that. Either set the budget somewhere you will actually hold, or look at which days the overshoot lands on before touching it.`,
      };
    }

    const suggested = Math.round(
      Math.max(floor, Math.max(kcalTarget - STEP, Math.min(kcalTarget + STEP, needed))) / 10,
    ) * 10;
    if (Math.abs(suggested - kcalTarget) < 40) return null;

    const slower = gap > 0;
    const capped = Math.abs(needed - kcalTarget) > STEP + 10;
    return {
      cta: `Set ${suggested.toLocaleString()} kcal`,
      delta: (suggested > kcalTarget ? '+' : '−') + Math.abs(suggested - kcalTarget).toLocaleString(),
      title: slower
        ? `Losing ${rate} kg/wk against a ${st.pace.toFixed(2)} target`
        : `Losing ${rate} kg/wk — faster than the ${st.pace.toFixed(2)} target`,
      note: (slower
        ? `Over ${readings.length} weigh-ins the trend is shallower than the plan. Moving the budget to ${suggested.toLocaleString()} kcal pulls it back without touching training.`
        : `Faster than planned is not free — it costs muscle and adherence. Moving the budget to ${suggested.toLocaleString()} kcal brings it back to target.`)
        + (capped ? ` That is a ${STEP} kcal step rather than the full correction, because the maintenance figure behind it is an estimate — change one thing, then re-read the trend in a fortnight.` : ''),
      apply: () => setState((s) => ({ targets: { ...s.targets, kcal: suggested } })),
    };
  })();

  // Large deficit plus low protein is the combination that costs muscle.
  const muscleRisk = (() => {
    if (!adherence7 || adherence7.days < 4) return null;
    const deficit = tdee - (avgIntake || tdee);
    const proteinShort = adherence7.proteinDays <= Math.floor(adherence7.days / 2);
    if (deficit < 600 || !proteinShort) return null;
    return {
      title: `${Math.round(deficit)} kcal deficit on ${adherence7.proteinDays}/${adherence7.days} protein days`,
      note: `A deficit this size with protein missed more often than hit is the combination that takes muscle rather than fat. Protein first, then the deficit — ${Math.round(latest.weight * proteinPerKg)} g is the floor.`,
    };
  })();

  // Where the trend actually lands, with a band that widens with the horizon —
  // an honest projection rather than a single confident line.
  const forecast = (() => {
    if (!fit) return null;
    const horizons: Array<[string, number]> = [['4 weeks', 28], ['12 weeks', 84], ['6 months', 182]];
    const base = (new Date(latest.date).getTime() - fit.t0) / DAY;
    return {
      r2: Math.round(fit.r2 * 100),
      quality: fit.r2 >= 0.7 ? 'tight' : fit.r2 >= 0.4 ? 'noisy' : 'very noisy',
      rows: horizons.map(([label, d]) => {
        const b = projectWithBand(fit, base + d);
        return {
          label,
          value: conv(b.y).toFixed(1) + ' ' + uLabel,
          range: conv(b.lower).toFixed(1) + '–' + conv(b.upper).toFixed(1),
        };
      }),
    };
  })();

  /* ── cycle ── */
  // The largest source of unexplained noise in a weight series. Apple Health
  // records flow; everything else here is derived from her own cycle lengths
  // rather than assuming a textbook 28 days.
  const cycle = (() => {
    const flowDays = (days ?? [])
      .filter((d) => (d.cycle?.flow ?? 0) > 0)
      .map((d) => d.date.slice(0, 10))
      .sort();
    if (flowDays.length < 2) return null;

    // A period starts on a flow day with no flow in the three days before it,
    // which tolerates the one-day gaps that spotting leaves in the record.
    const flowSet = new Set(flowDays);
    const starts = flowDays.filter((d) => {
      const t = new Date(d).getTime();
      return ![1, 2, 3].some((n) => flowSet.has(new Date(t - n * DAY).toISOString().slice(0, 10)));
    });
    if (!starts.length) return null;

    const lengths = starts
      .slice(1)
      .map((s, i) => Math.round((new Date(s).getTime() - new Date(starts[i]).getTime()) / DAY))
      .filter((n) => n >= 18 && n <= 45);
    const avgLen = lengths.length
      ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      : 28;

    const lastStart = starts[starts.length - 1];
    const dayOf = Math.round((new Date(latest.date).getTime() - new Date(lastStart).getTime()) / DAY) + 1;
    if (dayOf < 1 || dayOf > 60) return null;

    // The luteal phase is the stable one at about fourteen days, so ovulation is
    // counted back from the end rather than fixed at day fourteen.
    const ovulation = Math.max(10, avgLen - 14);
    const phaseOf = (n: number) =>
      n <= 5 ? 'Menstrual' : n < ovulation ? 'Follicular' : n <= ovulation + 2 ? 'Ovulation' : 'Luteal';
    const phase = phaseOf(dayOf);

    // What the scale actually does in each phase, measured as the average
    // distance from her own trend line. This is the number that stops a luteal
    // week reading as a failed one.
    const offsets: Record<string, number[]> = {};
    if (fit) {
      for (const r of readings) {
        const t = new Date(r.date).getTime();
        const start = [...starts].reverse().find((s) => new Date(s).getTime() <= t);
        if (!start) continue;
        const n = Math.round((t - new Date(start).getTime()) / DAY) + 1;
        if (n > 45) continue;
        const expected = fit.intercept + fit.slope * ((t - fit.t0) / DAY);
        (offsets[phaseOf(n)] ??= []).push(r.weight - expected);
      }
    }
    const phaseRows = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal']
      .map((name) => {
        const vals = offsets[name] ?? [];
        if (vals.length < 2) return null;
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        return {
          name,
          n: vals.length,
          offset: (mean >= 0 ? '+' : '−') + Math.abs(conv(mean)).toFixed(2) + ' ' + uLabel,
          current: name === phase,
          barStyle:
            'height:100%;border-radius:3px;background:' + (name === phase ? '#C06C84' : '#E7C9D4') +
            ';width:' + Math.min(100, Math.abs(mean) * 120).toFixed(1) + '%;',
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const here = phaseRows.find((r) => r.current);
    const note =
      phase === 'Luteal'
        ? `Day ${dayOf} of about ${avgLen}. The luteal phase is where the scale is least honest — water, not fat.${here ? ` Across your own history it reads ${here.offset} against trend here.` : ''} Hold the plan and read the trend line, not the morning number.`
        : phase === 'Menstrual'
        ? `Day ${dayOf}. Weight usually drops sharply in the first few days as the luteal water clears — a satisfying number that is mostly not fat.${here ? ` Your own average here is ${here.offset} against trend.` : ''}`
        : phase === 'Ovulation'
        ? `Day ${dayOf} of about ${avgLen}, around ovulation. A small water rise here is normal and passes within a few days.`
        : `Day ${dayOf} of about ${avgLen}. The follicular phase is the cleanest read you get — weigh-ins now reflect what is actually happening, and training tends to feel easiest.`;

    return {
      phase,
      dayOf,
      avgLen,
      lengthNote: lengths.length
        ? `Averaged over ${lengths.length} recorded cycle${lengths.length === 1 ? '' : 's'}.`
        : 'Cycle length assumed at 28 days until a second period is recorded.',
      note,
      phaseRows,
    };
  })();

  // A weigh-in far off the trend line is usually water, not fat. With cycle data
  // the dashboard can name the reason instead of listing the possibilities.
  const outlier = (() => {
    if (!fit || fit.rmse <= 0 || readings.length < 6) return null;
    const daysFromT0 = (new Date(latest.date).getTime() - fit.t0) / DAY;
    const expected = fit.intercept + fit.slope * daysFromT0;
    const resid = latest.weight - expected;
    if (Math.abs(resid) < fit.rmse * 2) return null;

    const phaseExplains =
      cycle && resid > 0 && (cycle.phase === 'Luteal' || cycle.phase === 'Ovulation');
    return {
      title: `${Math.abs(conv(resid)).toFixed(1)} ${uLabel} ${resid > 0 ? 'above' : 'below'} trend`,
      note: phaseExplains
        ? `Today's reading sits more than two standard deviations off your own trend line — and you are on day ${cycle.dayOf}, in the ${cycle.phase.toLowerCase()} phase, which is exactly where your history says the scale runs high. This is water. Read the 7-day line and carry on.`
        : `Today's reading sits more than two standard deviations off your own trend line. That is almost always water — salt, carbs, or a hard session — rather than a real change. The 7-day line is the one to read.`,
    };
  })();

  /* ── shift vs off day ── */
  // She is on placement. A twelve-hour ward day and a day off are not the same
  // day, and averaging them together hides the only pattern worth acting on.
  const shiftSplit = (() => {
    const hist = live.schedule?.history;
    if (!hist?.length || !days?.length) return null;
    const byDate = new Map(hist.map((h) => [h.date, h]));
    const on: HealthDay[] = [];
    const off: HealthDay[] = [];
    for (const d of days) {
      const h = byDate.get(d.date.slice(0, 10));
      if (!h) continue;
      (h.shift ? on : off).push(d);
    }
    if (on.length < 3 || off.length < 3) return null;

    const mean = (arr: HealthDay[], pick: (d: HealthDay) => number | null | undefined) => {
      const v = arr.map(pick).filter((x): x is number => typeof x === 'number' && Number.isFinite(x));
      return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
    };

    const specs: Array<{
      label: string;
      pick: (d: HealthDay) => number | null | undefined;
      fmt: (n: number) => string;
      /** Whether more is the better direction, for colouring the gap. */
      up: boolean;
    }> = [
      { label: 'Protein', pick: (d) => d.nutrition.proteinG, fmt: (n) => Math.round(n) + ' g', up: true },
      { label: 'Intake', pick: (d) => d.nutrition.dietaryEnergyKcal, fmt: (n) => Math.round(n).toLocaleString() + ' kcal', up: false },
      { label: 'Steps', pick: (d) => d.activity.steps, fmt: (n) => Math.round(n).toLocaleString(), up: true },
      { label: 'Sleep', pick: (d) => (d.sleep.totalMin == null ? null : d.sleep.totalMin / 60), fmt: (n) => n.toFixed(1) + ' h', up: true },
      { label: 'Active burn', pick: (d) => d.activity.activeEnergyKcal, fmt: (n) => Math.round(n).toLocaleString() + ' kcal', up: true },
    ];

    const rows = specs
      .map((s) => {
        const a = mean(on, s.pick);
        const b = mean(off, s.pick);
        if (a == null || b == null) return null;
        const pct = b === 0 ? 0 : Math.round(((a - b) / b) * 100);
        return {
          label: s.label,
          onValue: s.fmt(a),
          offValue: s.fmt(b),
          delta: (pct > 0 ? '+' : '') + pct + '%',
          good: Math.abs(pct) < 8 ? null : s.up ? pct > 0 : pct < 0,
          gap: Math.abs(pct),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
    if (!rows.length) return null;

    // The biggest gap is not the one worth naming — a big gap in your favour is
    // not a problem. Lead with the largest harmful one, and only fall back to
    // raw size when nothing is going the wrong way.
    const bySize = [...rows].sort((a, b) => b.gap - a.gap);
    const worst = bySize.find((r) => r.good === false) ?? bySize[0];
    const nights = hist.filter((h) => h.night).length;

    return {
      onDays: on.length,
      offDays: off.length,
      rows,
      note:
        worst.gap < 8
          ? `Across ${on.length} shift days and ${off.length} off days nothing moves much — placement is not costing you the plan, which is worth knowing.`
          : `The gap that matters is ${worst.label.toLowerCase()}: ${worst.onValue} on shift against ${worst.offValue} off, a ${worst.delta} difference across ${on.length} shift days. ${
              worst.good === false
                ? 'That is the one to prepare around rather than rely on willpower for — pack it the night before.'
                : 'That one is working in your favour; the rest of the plan can lean on it.'
            }${nights >= 3 ? ` ${nights} of those were nights.` : ''}`,
    };
  })();

  /* ── the rota ── */
  // Six weeks at a glance, so a block of nights reads as a block rather than as
  // one bad night at a time.
  const KIND_STYLE: Record<string, { bg: string; fg: string; short: string }> = {
    night: { bg: '#3A2A33', fg: '#FFFFFF', short: 'N' },
    long: { bg: '#C06C84', fg: '#FFFFFF', short: 'L' },
    early: { bg: '#E0AFBF', fg: '#5A2233', short: 'E' },
    late: { bg: '#C98BA0', fg: '#FFFFFF', short: 'La' },
    day: { bg: '#EBD3DB', fg: '#5A2233', short: 'D' },
    off: { bg: 'transparent', fg: '#B0ABA2', short: '·' },
  };

  const rota = (() => {
    const all = [...(live.schedule?.history ?? []), ...(live.schedule?.upcoming ?? [])]
      .sort((a, b) => a.date.localeCompare(b.date));
    if (all.length < 14) return null;

    const byDate = new Map(all.map((d) => [d.date, d]));
    const selectedDate = st.rotaDate ?? todayISO;

    // Start on the Monday a fortnight before this week, so the grid reads as
    // weeks and today sits about a third of the way down. Paging moves the
    // whole window six weeks at a time.
    const start = new Date(todayISO + 'T00:00:00');
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 14 + st.rotaPage * 42);

    const weeks = [];
    for (let w = 0; w < 6; w++) {
      const cells = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + w * 7 + i);
        const date = localISODate(d);
        const entry = byDate.get(date);
        const kind = entry?.shift ? entry.kind : 'off';
        const s = KIND_STYLE[kind] ?? KIND_STYLE.off;
        const isToday = date === todayISO;
        const isSelected = date === selectedDate;
        cells.push({
          date,
          day: String(d.getDate()),
          short: entry?.shift ? s.short : '',
          today: isToday,
          // Clicking a day opens it below rather than navigating away, so the
          // grid stays on screen while you read across it.
          onClick: () => setState({ rotaDate: date }),
          title: entry?.shift
            ? `${date} · ${kind}${entry.start ? ` ${entry.start}–${entry.end ?? ''}` : ''} · ${entry.hours} h`
            : `${date} · off`,
          style:
            'aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:8px;font-size:10px;line-height:1;cursor:pointer;transition:transform 140ms ease,box-shadow 140ms ease;' +
            `background:${s.bg};color:${s.fg};` +
            (isSelected
              ? 'outline:2px solid #C06C84;outline-offset:2px;'
              : isToday
              ? 'outline:1.5px solid #1A1A18;outline-offset:1px;'
              : '') +
            `border:${!entry?.shift ? '0.5px solid rgba(26,24,21,0.10)' : '0'};` +
            `opacity:${date > todayISO ? 0.66 : 1};`,
        });
      }
      weeks.push({ label: new Date(cells[0].date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), cells });
    }

    // What the selected day actually was — the rota entry joined to what the
    // body did that day, which is the whole reason for making it clickable.
    const selected = (() => {
      const entry = byDate.get(selectedDate) ?? null;
      const health = (days ?? []).find((d) => d.date.slice(0, 10) === selectedDate) ?? null;
      const weigh = readings.find((r) => r.date.slice(0, 10) === selectedDate) ?? null;
      const label = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long',
      });

      const n = (v: number | null | undefined, f: (x: number) => string) =>
        typeof v === 'number' && Number.isFinite(v) ? f(v) : '—';

      return {
        date: selectedDate,
        label,
        isFuture: selectedDate > todayISO,
        kindLabel: entry?.shift
          ? (entry.kind === 'long' ? 'Long day' : entry.kind[0].toUpperCase() + entry.kind.slice(1)) +
            (entry.start ? ` · ${entry.start}–${entry.end ?? ''}` : '') +
            ` · ${entry.hours} h`
          : 'Day off',
        chipStyle:
          'font-size:10px;letter-spacing:0.12em;text-transform:uppercase;padding:5px 11px;border-radius:999px;white-space:nowrap;' +
          (entry?.shift
            ? `background:${KIND_STYLE[entry.kind]?.bg ?? '#EBD3DB'};color:${KIND_STYLE[entry.kind]?.fg ?? '#5A2233'};`
            : 'background:#F4F4F3;color:#57544E;'),
        stats: [
          { label: 'Steps', value: n(health?.activity.steps, (x) => Math.round(x).toLocaleString()) },
          { label: 'Protein', value: n(health?.nutrition.proteinG, (x) => Math.round(x) + ' g') },
          { label: 'Intake', value: n(health?.nutrition.dietaryEnergyKcal, (x) => Math.round(x).toLocaleString() + ' kcal') },
          { label: 'Sleep', value: n(health?.sleep.totalMin, (x) => (x / 60).toFixed(1) + ' h') },
          { label: 'Resting HR', value: n(health?.heart.restingHr, (x) => Math.round(x) + ' bpm') },
          { label: 'HRV', value: n(health?.heart.hrvMs, (x) => Math.round(x) + ' ms') },
          { label: 'Weight', value: n(weigh?.weight, (x) => conv(x).toFixed(1) + ' ' + uLabel) },
        ],
        note: selectedDate > todayISO
          ? 'Still ahead — nothing recorded yet.'
          : health
          ? ''
          : 'Apple Health has nothing for this day.',
      };
    })();

    const next = (live.schedule?.upcoming ?? []).filter((d) => d.shift && d.date > todayISO).slice(0, 3);
    const weekStart = new Date(todayISO + 'T00:00:00');
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekFrom = localISODate(weekStart);
    const thisWeekHours = all
      .filter((d) => d.shift && d.date >= weekFrom && d.date < localISODate(new Date(weekStart.getTime() + 7 * DAY)))
      .reduce((a, d) => a + d.hours, 0);

    const first = weeks[0].cells[0].date;
    const last = weeks[5].cells[6].date;
    const monthOf = (iso: string) =>
      new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

    return {
      weeks,
      selected,
      dayLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      rangeLabel: monthOf(first) === monthOf(last) ? monthOf(first) : `${monthOf(first)} – ${monthOf(last)}`,
      // Paging is bounded by what the calendar was actually fetched for, so the
      // arrows never walk off into six empty weeks.
      canPrev: all[0].date < first,
      canNext: all[all.length - 1].date > last,
      atToday: st.rotaPage === 0,
      onPrev: () => setState((s) => ({ rotaPage: s.rotaPage - 1 })),
      onNext: () => setState((s) => ({ rotaPage: s.rotaPage + 1 })),
      onToday: () => setState({ rotaPage: 0, rotaDate: todayISO }),
      legend: (['night', 'long', 'early', 'late', 'day'] as const).map((k) => ({
        label: k === 'long' ? 'Long day' : k[0].toUpperCase() + k.slice(1),
        style: `width:11px;height:11px;border-radius:4px;display:inline-block;background:${KIND_STYLE[k].bg};`,
      })),
      thisWeekHours: Math.round(thisWeekHours * 10) / 10,
      nextUp: next.length
        ? next
            .map((d) =>
              `${new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })} · ${d.kind === 'long' ? 'long day' : d.kind}${d.start ? ' ' + d.start : ''}`,
            )
            .join('   ·   ')
        : 'Nothing rostered in the weeks ahead.',
    };
  })();

  /* ── practice hours ── */
  // Registration needs a fixed number of practice hours. The rota already knows
  // how many have been worked, so the only thing to type is what came before it.
  const placementProgress = (() => {
    const p = live.schedule?.placement;
    if (!p || !p.days) return null;
    const target = st.placementTarget || 2300;
    const total = p.hours + (st.placementPrior || 0);
    const pct = Math.max(0, Math.min(100, (total / target) * 100));

    // Rate from the last twelve weeks, not the whole window — a summer with no
    // placement would otherwise stretch the projection out forever.
    const recent = (live.schedule?.history ?? []).filter(
      (d) => d.shift && new Date(d.date + 'T00:00:00').getTime() >= Date.now() - 84 * DAY,
    );
    const perWeek = recent.reduce((a, d) => a + d.hours, 0) / 12;
    const remaining = target - total;
    const weeksLeft = perWeek > 0.5 && remaining > 0 ? Math.ceil(remaining / perWeek) : null;
    const eta = weeksLeft
      ? new Date(Date.now() + weeksLeft * 7 * DAY).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
      : null;

    return {
      total: Math.round(total).toLocaleString(),
      target: target.toLocaleString(),
      pct: Math.round(pct),
      days: p.days,
      perWeek: perWeek.toFixed(1),
      prior: st.placementPrior || 0,
      targetValue: target,
      barStyle: `height:100%;width:${pct.toFixed(1)}%;border-radius:999px;background:#C06C84;transition:width 700ms cubic-bezier(.16,1,.3,1);`,
      note: remaining <= 0
        ? `${Math.round(total).toLocaleString()} hours against a ${target.toLocaleString()} requirement — that is done, with ${Math.round(-remaining).toLocaleString()} to spare.`
        : eta
        ? `${Math.round(remaining).toLocaleString()} hours to go. At ${perWeek.toFixed(1)} hours a week — your actual rate over the last twelve weeks — that lands around ${eta}.`
        : `${Math.round(remaining).toLocaleString()} hours to go. No shifts in the last twelve weeks, so there is nothing to project a date from yet.`,
      windowNote: p.from
        ? `From ${p.days} rostered days since ${new Date(p.from + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}.` +
          (st.placementPrior ? ` Plus ${st.placementPrior.toLocaleString()} hours entered by hand.` : ' Hours before that are not in the calendar — add them here.')
        : '',
      onPriorChange: (e: React.FormEvent<HTMLInputElement>) => {
        const v = parseInt(e.currentTarget.value, 10);
        setState({ placementPrior: Number.isFinite(v) ? Math.max(0, v) : 0 });
      },
      onTargetChange: (e: React.FormEvent<HTMLInputElement>) => {
        const v = parseInt(e.currentTarget.value, 10);
        setState({ placementTarget: Number.isFinite(v) && v > 0 ? v : 2300 });
      },
    };
  })();

  /* ── recovery from nights ── */
  // Everyone says nights take a day or two to shake off. This measures how long
  // they actually take for her, from her own heart data.
  const nightRecovery = (() => {
    const hist = live.schedule?.history;
    if (!hist || !days) return null;
    const byDate = new Map(days.map((d) => [d.date.slice(0, 10), d]));

    // Baseline: days that are neither a shift nor sitting in the wake of one.
    const restful = hist.filter((h, i) => !h.shift && hist.slice(Math.max(0, i - 3), i).every((q) => !q.shift));
    const baseOf = (pick: (d: HealthDay) => number | null | undefined) => {
      const v = restful
        .map((h) => byDate.get(h.date))
        .filter((d): d is HealthDay => Boolean(d))
        .map(pick)
        .filter((x): x is number => typeof x === 'number' && Number.isFinite(x));
      return v.length >= 5 ? v.reduce((a, b) => a + b, 0) / v.length : null;
    };
    const baseHrv = baseOf((d) => d.heart.hrvMs);
    const baseRhr = baseOf((d) => d.heart.restingHr);
    if (baseHrv == null && baseRhr == null) return null;

    // The last day of each run of nights.
    const ends = hist.filter((h, i) => h.night && !(hist[i + 1]?.night ?? false)).map((h) => h.date);
    if (ends.length < 2) return null;

    const lags: number[] = [];
    for (const end of ends) {
      for (let k = 1; k <= 6; k++) {
        const d = byDate.get(localISODate(new Date(new Date(end + 'T00:00:00').getTime() + k * DAY)));
        if (!d) continue;
        // Recovered once variability is back within a tenth of baseline and the
        // resting rate is no longer elevated.
        const hrvOk = baseHrv == null || d.heart.hrvMs == null || d.heart.hrvMs >= baseHrv * 0.9;
        const rhrOk = baseRhr == null || d.heart.restingHr == null || d.heart.restingHr <= baseRhr * 1.05;
        if (hrvOk && rhrOk) { lags.push(k); break; }
      }
    }
    if (lags.length < 2) return null;

    const sorted = [...lags].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    return {
      days: median,
      runs: lags.length,
      nights: hist.filter((h) => h.night).length,
      baseline:
        (baseHrv != null ? `HRV ${Math.round(baseHrv)} ms` : '') +
        (baseHrv != null && baseRhr != null ? ' · ' : '') +
        (baseRhr != null ? `RHR ${Math.round(baseRhr)} bpm` : ''),
      note: `Across ${lags.length} runs of nights your heart data takes a median of ${median} day${median === 1 ? '' : 's'} to return to baseline. Treat the first day after a set as recovery rather than as a normal day off, and put the hard session ${median + 1} days out.`,
    };
  })();

  /* ── the night before ── */
  // The one part of this dashboard that acts before the problem rather than
  // describing it afterwards.
  const tomorrowPrep = (() => {
    if (!rotaTomorrow?.shift) return null;
    const kindLabel = rotaTomorrow.kind === 'long' ? 'long day' : rotaTomorrow.kind;
    const hist = live.schedule?.history;

    let gap = '';
    if (hist && days) {
      const on = new Set(hist.filter((h) => h.shift).map((h) => h.date));
      const off = new Set(hist.filter((h) => !h.shift).map((h) => h.date));
      const meanOf = (set: Set<string>) => {
        const v = days
          .filter((d) => set.has(d.date.slice(0, 10)))
          .map((d) => d.nutrition.proteinG)
          .filter((x): x is number => typeof x === 'number' && x > 0);
        return v.length >= 3 ? v.reduce((a, b) => a + b, 0) / v.length : null;
      };
      const a = meanOf(on);
      const b = meanOf(off);
      if (a != null && b != null && b - a > 15) {
        gap = ` You average ${Math.round(a)} g of protein on shift against ${Math.round(b)} g off. That ${Math.round(b - a)} g gets decided tonight, not tomorrow.`;
      }
    }

    return {
      title: `Tomorrow is a ${kindLabel}${rotaTomorrow.start ? `, ${rotaTomorrow.start}–${rotaTomorrow.end ?? ''}` : ''}${rotaTomorrow.hours ? ` · ${rotaTomorrow.hours} h` : ''}`,
      note:
        (rotaTomorrow.kind === 'night'
          ? 'Nights cost the most sleep and the most protein of anything on your rota.'
          : 'A day this long covers the deficit by itself — steps are not the thing to plan for.') +
        gap +
        ' Pack it before bed.',
    };
  })();

  /* ── relative strength ── */
  // Absolute load falls in a deficit and that is not automatically bad. Load per
  // kilo of bodyweight is the number that says whether the cut is taking muscle.
  const relativeStrength = (() => {
    const all = (live.lifts ?? []).filter((l) => l.e1rmKg > 0);
    if (all.length < 4 || readings.length < 2) return null;

    // Bodyweight on the day of a lift, taken from the nearest weigh-in.
    const weightAt = (iso: string) => {
      const t = new Date(iso).getTime();
      let best: Reading | null = null;
      let bestGap = Infinity;
      for (const r of readings) {
        const gap = Math.abs(new Date(r.date).getTime() - t);
        if (gap < bestGap) { bestGap = gap; best = r; }
      }
      return bestGap <= 14 * DAY && best ? best.weight : null;
    };

    const byExercise = new Map<string, Lift[]>();
    for (const l of all) byExercise.set(l.exercise, [...(byExercise.get(l.exercise) ?? []), l]);

    const rows = [...byExercise.entries()]
      .map(([exercise, ls]) => {
        const pts = ls
          .sort((a, b) => a.performedOn.localeCompare(b.performedOn))
          .map((l) => { const bw = weightAt(l.performedOn); return bw ? { date: l.performedOn, ratio: l.e1rmKg / bw } : null; })
          .filter((p): p is { date: string; ratio: number } => p !== null);
        if (pts.length < 2) return null;
        const first = pts[0];
        const last = pts[pts.length - 1];
        const change = ((last.ratio - first.ratio) / first.ratio) * 100;
        return {
          exercise,
          ratio: last.ratio.toFixed(2) + '×',
          change: (change >= 0 ? '+' : '−') + Math.abs(change).toFixed(1) + '%',
          rising: change >= 0,
          sessions: pts.length,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
    if (!rows.length) return null;

    const rising = rows.filter((r) => r.rising).length;
    const lost = readings.length >= 2 ? readings[0].weight - latest.weight : 0;
    return {
      rows,
      note:
        rising === rows.length
          ? `Every movement is stronger per kilo than when you started, across ${lost.toFixed(1)} kg of weight loss. That is the pattern you want from a cut — the weight coming off is not muscle.`
          : rising === 0
          ? `Load per kilo is down across the board. Over a deficit that usually means the deficit is too steep, protein is too low, or recovery is short — in that order of likelihood.`
          : `${rising} of ${rows.length} movements are stronger per kilo. Mixed is normal mid-cut; watch whether the falling ones share a session day.`,
    };
  })();

  /* ── adaptive maintenance ── */
  // Maintenance is not a constant. Back-derived from intake and weight change at
  // successive points, it shows adaptation as it happens rather than as a single
  // number that quietly goes stale.
  const maintenanceTrend = (() => {
    if (Object.keys(intakeByDate).length < 21 || readings.length < 6) return null;
    const end = new Date(readings[readings.length - 1].date).getTime();
    const pts: Array<{ date: string; tdee: number }> = [];
    for (let back = 56; back >= 0; back -= 7) {
      const cut = end - back * DAY;
      const sub = readings.filter((r) => new Date(r.date).getTime() <= cut);
      const rc = tdeeRealityCheck(sub, intakeByDate, formulaTdee, -st.pace, 21);
      if (rc && rc.days >= 10) pts.push({ date: new Date(cut).toISOString().slice(0, 10), tdee: rc.actualTdee });
    }
    if (pts.length < 3) return null;

    const vals = pts.map((p) => p.tdee);
    const mn = Math.min(...vals);
    const mx = Math.max(...vals);
    const rng = mx - mn || 1;
    const W = 320, H = 90, PAD = 8;
    const path = pts
      .map((p, i) => {
        const x = PAD + (i / (pts.length - 1)) * (W - PAD * 2);
        const y = H - PAD - ((p.tdee - mn) / rng) * (H - PAD * 2);
        return (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      })
      .join(' ');

    const drift = vals[vals.length - 1] - vals[0];
    const weeks = pts.length - 1;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    // Endpoints alone will call a violently swinging series "steady" whenever it
    // happens to start and finish in the same place. The spread decides whether
    // there is a trend here worth reading at all.
    const noisy = rng > Math.max(300, mean * 0.15);

    return {
      path,
      first: vals[0].toLocaleString(),
      last: vals[vals.length - 1].toLocaleString(),
      low: mn.toLocaleString(),
      high: mx.toLocaleString(),
      weeks,
      note: noisy
        ? `These estimates swing by ${Math.round(rng).toLocaleString()} kcal week to week, which is more than any real adaptation could account for — three weeks of weight change is a noisy thing to divide by. Read the level, not the wiggle: your maintenance is somewhere near ${Math.round(mean).toLocaleString()} kcal, and it will take another month before the direction means anything.`
        : drift <= -120
        ? `Your measured maintenance has fallen about ${Math.abs(drift).toLocaleString()} kcal over ${weeks} weeks. Some of that is simply carrying less weight around, but a drop this size is also what adaptation looks like — a week at maintenance does more from here than cutting further.`
        : drift >= 120
        ? `Measured maintenance has risen about ${drift.toLocaleString()} kcal over ${weeks} weeks, which usually means training volume or daily movement went up. You can afford to eat more than the original plan assumed.`
        : `Maintenance has held inside ${Math.round(rng).toLocaleString()} kcal across ${weeks} weeks. Nothing has adapted away — the plan's numbers are still the right ones.`,
    };
  })();

  /* ── per-movement progression ── */
  // One line per exercise: estimated one-rep max over time, with the session
  // that set each personal best marked. This is the view that tells you whether
  // a lift is actually moving, which a table of current bests cannot.
  const liftProgress = (() => {
    const byExercise = new Map<string, Lift[]>();
    for (const l of live.lifts ?? []) {
      if (l.e1rmKg <= 0) continue;
      byExercise.set(l.exercise, [...(byExercise.get(l.exercise) ?? []), l]);
    }
    const series = [...byExercise.entries()]
      .map(([exercise, ls]) => ({ exercise, ls: ls.sort((a, b) => a.performedOn.localeCompare(b.performedOn)) }))
      .filter((s) => s.ls.length >= 2)
      .sort((a, b) => b.ls.length - a.ls.length)
      .slice(0, 4);
    if (!series.length) return null;

    const W = 320, H = 96, PAD = 6;
    return series.map((s, i) => {
      const vals = s.ls.map((l) => l.e1rmKg);
      const mn = Math.min(...vals);
      const mx = Math.max(...vals);
      const rng = mx - mn || 1;
      const t0 = new Date(s.ls[0].performedOn).getTime();
      const t1 = new Date(s.ls[s.ls.length - 1].performedOn).getTime();
      const span = t1 - t0 || 1;
      const pt = (l: Lift) => ({
        x: +(PAD + ((new Date(l.performedOn).getTime() - t0) / span) * (W - PAD * 2)).toFixed(1),
        y: +(H - PAD - ((l.e1rmKg - mn) / rng) * (H - PAD * 2)).toFixed(1),
      });
      const pts = s.ls.map(pt);
      const path = pts.map((q, j) => (j ? 'L' : 'M') + q.x + ',' + q.y).join(' ');

      // Mark a session only when it beat everything before it.
      let running = 0;
      const prs = s.ls.map((l, j) => {
        const isPr = l.e1rmKg > running;
        if (isPr) running = l.e1rmKg;
        return isPr && j > 0 ? pts[j] : null;
      }).filter((q): q is { x: number; y: number } => q !== null);

      const first = vals[0];
      const last = vals[vals.length - 1];
      const delta = last - first;
      return {
        exercise: s.exercise,
        gradId: 'lift-' + i,
        path,
        area: path + ` L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`,
        prs,
        sessions: s.ls.length,
        current: last.toFixed(1) + ' kg',
        delta: (delta >= 0 ? '+' : '−') + Math.abs(delta).toFixed(1) + ' kg',
        deltaColor: delta >= 0 ? '#7F9289' : '#AA7F68',
        note: s.ls.length + ' sessions · best ' + mx.toFixed(1) + ' kg estimated max',
      };
    });
  })();

  /* ── macro split over the fortnight ── */
  const macroTrend = (() => {
    const recent = (days ?? []).slice(-14).filter((d) => d.nutrition.dietaryEnergyKcal != null);
    if (recent.length < 3) return null;
    return recent.map((d) => {
      const pG = d.nutrition.proteinG ?? 0;
      const cG = d.nutrition.carbsG ?? 0;
      const fG = d.nutrition.fatG ?? 0;
      const kcal = pG * 4 + cG * 4 + fG * 9;
      const pct = (g: number, per: number) => (kcal > 0 ? (g * per) / kcal * 100 : 0);
      return {
        date: new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric' }),
        title: `${new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${Math.round(pG)} p / ${Math.round(cG)} c / ${Math.round(fG)} f`,
        proteinStyle: `height:${pct(pG, 4).toFixed(1)}%;background:#7F9289;display:block;`,
        carbStyle: `height:${pct(cG, 4).toFixed(1)}%;background:#C06C84;display:block;`,
        fatStyle: `height:${pct(fG, 9).toFixed(1)}%;background:#C98BA0;display:block;`,
      };
    });
  })();

  const fibreToday = dayNow?.nutrition.fiberG ?? null;
  const sugarToday = dayNow?.nutrition.sugarG ?? null;
  const proteinPerKgToday = logged.protein > 0 ? logged.protein / latest.weight : 0;

  /* ── habits + sleep ── */
  // A habit day is "done" when Apple Health shows the target met; days with no
  // sync fall back to the design's pattern so the grid is never blank.
  const habitWindow = (days ?? []).slice(-14);
  const resolveHabit = (key: string, i: number): boolean => {
    const d = habitWindow[habitWindow.length - 14 + i] ?? habitWindow[i];
    const measured = ((): boolean | undefined => {
      if (!d) return undefined;
      switch (key) {
        case 'protein': {
          const g = d.nutrition.proteinG;
          return g == null ? undefined : g >= latest.weight * proteinPerKg * 0.9;
        }
        case 'steps':
          return d.activity.steps == null ? undefined : d.activity.steps >= 8000;
        case 'water':
          return d.nutrition.waterMl == null ? undefined : d.nutrition.waterMl >= 2000;
        case 'lights':
          return d.sleep.totalMin == null ? undefined : d.sleep.totalMin >= 7 * 60;
        default:
          return undefined;
      }
    })();
    return measured ?? habitCell(st, key, i);
  };

  let done = 0, total = 0;
  // A habit day is "done" when Apple Health shows the target met; an explicit tap
  // still overrides it, and days with no sync fall back to the design's pattern.
  const habits = HABIT_DEFS.map((h) => {
    let count = 0;
    const days = [];
    for (let i = 0; i < 14; i++) {
      const on = resolveHabit(h.key, i);
      if (on) count++;
      total++;
      if (on) done++;
      days.push({
        title: h.name + ' · day ' + (i + 1) + (on ? ' · done' : ' · missed'),
        style: 'aspect-ratio:1;width:100%;border-radius:7px;border:0.5px solid rgba(0,0,0,0.06);transition:background 200ms cubic-bezier(.4,0,.2,1);background:' + (on ? '#C06C84' : '#F4F4F3') + ';',
      });
    }
    return { name: h.name, days, count };
  });
  const sleepMax = 9;
  const sleepBars = sleepSeries.map((h, i) => ({
    label: String(i + 1),
    title: h.toFixed(1) + ' hours',
    style: 'width:100%;height:' + ((h / sleepMax) * 100).toFixed(1) + '%;border-radius:8px 8px 0 0;background:' + (h >= 7 ? '#7F9289' : '#F2DCE4') + ';opacity:' + (h >= 7 ? 0.75 : 1) + ';transition:height 500ms cubic-bezier(.16,1,.3,1);',
  }));

  /* ── sleep depth ── */
  // Debt against a seven-hour target, and how consistent the nights are — a
  // steady 6.5 costs less than alternating 5 and 8 for the same average.
  const sleepDepth = (() => {
    const nights = series(days, (d) => (d.sleep.totalMin == null ? null : d.sleep.totalMin / 60), 14);
    if (!nights || nights.length < 3) return null;
    const target = 7;
    const debt = nights.reduce((a, h) => a + Math.max(0, target - h), 0);
    const mean = nights.reduce((a, b) => a + b, 0) / nights.length;
    const sd = Math.sqrt(nights.reduce((a, h) => a + (h - mean) ** 2, 0) / nights.length);
    const consistency = Math.max(0, Math.min(100, Math.round(100 - sd * 40)));
    return {
      debt: debt.toFixed(1) + ' h',
      debtNote: debt < 3
        ? `Barely any debt across ${nights.length} nights — this is the shape you want.`
        : `${debt.toFixed(1)} hours short of ${target} h across ${nights.length} nights. Most of that is paid back by moving bedtime, not by lying in.`,
      consistency,
      consistencyNote: sd < 0.75
        ? `Steady — nights vary by about ${(sd * 60).toFixed(0)} minutes.`
        : `Nights swing by roughly ${(sd * 60).toFixed(0)} minutes. Evening out the short ones does more than adding to the long ones.`,
      barStyle: `height:100%;width:${consistency}%;border-radius:999px;background:${consistency >= 70 ? '#7F9289' : consistency >= 45 ? '#C06C84' : '#AA7F68'};`,
    };
  })();

  /* ── habit streaks ── */
  const habitStreaks = (() => {
    const rows = HABIT_DEFS.map((h) => {
      const flags: boolean[] = [];
      for (let i = 0; i < 14; i++) flags.push(resolveHabit(h.key, i));
      // Current run counts back from the most recent day.
      let current = 0;
      for (let i = flags.length - 1; i >= 0 && flags[i]; i--) current++;
      let best = 0;
      let run = 0;
      for (const f of flags) { run = f ? run + 1 : 0; best = Math.max(best, run); }
      const hit = flags.filter(Boolean).length;
      return {
        name: h.name,
        current,
        best,
        hit,
        pct: Math.round((hit / flags.length) * 100),
        barStyle: `height:100%;width:${Math.round((hit / flags.length) * 100)}%;border-radius:999px;background:${hit / flags.length >= 0.7 ? '#C06C84' : '#F2DCE4'};`,
      };
    });
    return rows.sort((a, b) => b.pct - a.pct);
  })();


  const addWeight = () => {
    const raw = parseFloat(st.draft);
    if (!raw || isNaN(raw)) return;
    const kg = st.unit === 'lb' ? raw / 2.20462 : raw;
    if (kg < 30 || kg > 250) { setState({ draft: '' }); return; }
    const weight = +kg.toFixed(1);
    const date = new Date().toISOString().slice(0, 10);

    // Show it on the chart straight away, then persist. A same-day re-weigh
    // replaces the earlier entry rather than stacking a second point.
    const next = readings.filter((r) => r.date.slice(0, 10) !== date).concat([{ date, weight }]);
    next.sort((a, b) => a.date.localeCompare(b.date));
    setState({ readings: next, draft: '' });

    const pw = storedOperatorPassword();
    if (!pw) return;
    void fetch('/api/operator/fitness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-operator-pw': pw },
      body: JSON.stringify({ date, weight, bmi: weight / (1.68 * 1.68) }),
    }).catch(() => {
      /* offline or storage not set up — the reading stays in view for this session */
    });
  };

  return {
    tabs,
    isToday: st.tab === 'today', isTrends: st.tab === 'trends', isFood: st.tab === 'food',
    isProgress: st.tab === 'progress', isPlan: st.tab === 'plan',
    isTraining: st.tab === 'training', isHabits: st.tab === 'habits',
    ...planVals(st, setState, latest, goal, tdee, conv, uLabel),
    ...shellVals(st, setState, latest, goal, tdee, kcalTarget, proteinTarget, conv, uLabel, maLast, avgIntake, readings, proteinPerKg, live, logged, tdeeSource),
    lostValue: +conv(BASE[0][1] - latest.weight).toFixed(1),
    lostCopy: 'Down from ' + conv(BASE[0][1]).toFixed(1) + ' ' + uLabel + ' on 8 February — ' + Math.round((tLast - new Date(BASE[0][0]).getTime()) / DAY) + ' days of daily weigh-ins.',
    startLabel: 'Start ' + conv(BASE[0][1]).toFixed(1) + ' ' + uLabel,
    goalDisplay: conv(goal).toFixed(1) + ' ' + uLabel,
    pctLabel: Math.round(Math.min(100, ((BASE[0][1] - latest.weight) / (BASE[0][1] - goal)) * 100)) + '%',
    progressBarStyle: 'height:100%;width:' + Math.min(100, ((BASE[0][1] - latest.weight) / (BASE[0][1] - goal)) * 100).toFixed(1) + '%;border-radius:999px;background:#E0AFBF;transition:width 700ms cubic-bezier(.16,1,.3,1);',
    milestones: [1, 2, 3, 4, 5, 6, 7, 8].map((kg) => {
      const hit = BASE[0][1] - latest.weight >= kg;
      return {
        label: '−' + kg + ' kg',
        style: 'font-size:11px;padding:5px 12px;border-radius:999px;border:0.5px solid ' +
          (hit ? 'rgba(192,108,132,0.26);background:#FBF4F6;color:#8A4459;' : 'rgba(26,24,21,0.12);background:transparent;color:#B0ABA2;'),
      };
    }),
    photoFrames: [
      { key: 0, id: 'progress-photo-start', placeholder: 'Week 1', date: '8 Feb 2026', w: BASE[0][1] },
      { key: 1, id: 'progress-photo-2', placeholder: 'Week 12', date: '26 Apr 2026', w: 74.9 },
      { key: 2, id: 'progress-photo-3', placeholder: 'Week 20', date: '21 Jun 2026', w: 72.9 },
      { key: 3, id: 'progress-photo-now', placeholder: 'This week', date: '2 Aug 2026', w: latest.weight },
    ].map((p) => {
      const d = p.w - BASE[0][1];
      return {
        id: p.id, placeholder: p.placeholder, date: p.date,
        weight: conv(p.w).toFixed(1) + ' ' + uLabel,
        delta: p.key === 0 ? 'starting point' : (d <= 0 ? '−' : '+') + Math.abs(conv(d)).toFixed(1) + ' ' + uLabel + ' from start',
        deltaColor: p.key === 0 ? '#A29D95' : '#7F9289',
      };
    }),
    monthly: [
      { month: 'February', d: -0.7 }, { month: 'March', d: -0.8 }, { month: 'April', d: -0.5 },
      { month: 'May', d: -1.1 }, { month: 'June', d: -0.9 }, { month: 'July', d: -1.3 },
    ].map((m) => ({
      month: m.month,
      delta: (m.d >= 0 ? '+' : '−') + Math.abs(m.d).toFixed(1) + ' kg',
      color: m.d <= 0 ? '#C06C84' : '#BE7E95',
      barStyle: 'height:100%;width:' + Math.min(100, (Math.abs(m.d) / 1.4) * 100).toFixed(0) + '%;border-radius:999px;background:' + (m.d <= 0 ? '#EDCEDA' : '#EDCEDA') + ';',
    })),
    wins: [
      { title: 'Jeans from January fit again', note: 'Noticed 14 July — waist down 4.4 cm since February.' },
      { title: 'Back squat up 12.5 kg', note: 'Lighter body, heavier bar — strength held through the whole cut.' },
      { title: 'Resting heart rate 64 → 58 bpm', note: 'Apple Health, six-month average.' },
      { title: 'Walking a full shift without aching', note: 'Twelve-hour days feel manageable now.' },
    ],
    // Split so the header can set the last word in italic gold, the way the
    // section headings elsewhere do.
    // The sync pill tells the truth about what has actually arrived, rather
    // than always claiming a recent sync.
    syncLabel: (() => {
      if (!live.loaded) return 'Apple Health · checking…';
      const last = lastSyncedDate(days);
      if (!last) return 'Apple Health · not synced';
      const iso = new Date();
      const todayIso = `${iso.getFullYear()}-${String(iso.getMonth() + 1).padStart(2, '0')}-${String(iso.getDate()).padStart(2, '0')}`;
      if (last === todayIso) return dayNow ? 'Apple Health · synced today' : 'Apple Health · today pending';
      const daysAgo = Math.round((new Date(todayIso).getTime() - new Date(last).getTime()) / DAY);
      return 'Apple Health · ' + (daysAgo === 1 ? 'synced yesterday' : `last synced ${daysAgo} days ago`);
    })(),
    syncDotColour: live.loaded && dayNow ? '#7F9289' : live.loaded ? '#D194A8' : '#A29D95',
    greetingLead: (() => { const h = new Date().getHours(); return h < 12 ? 'Good morning,' : h < 18 ? 'Good afternoon,' : 'Good evening,'; })(),
    greetingTail: 'Lauren.',
    subhead: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) +
      ' · ' + conv(latest.weight).toFixed(1) + ' ' + uLabel + ' this morning, ' +
      (logged.kcal > 0
        ? logged.kcal.toLocaleString() + ' kcal in, ' + Math.max(0, kcalTarget - logged.kcal).toLocaleString() + ' left today.'
        : 'nothing logged yet today.'),
    // ISO week number, so the top bar tracks the real week rather than a fixed one.
    weekLabel: (() => {
      const d = new Date();
      const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = (target.getUTCDay() + 6) % 7;
      target.setUTCDate(target.getUTCDate() - dayNum + 3);
      const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
      const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
      firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
      const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * DAY));
      return `Week ${week} · ${target.getUTCFullYear()}`;
    })(),
    unitToggle: (['kg', 'lb'] as const).map((u) => ({ label: u, onClick: () => setState({ unit: u }), style: chip(unit === u) })),
    kpis,
    rings, ringFocus,
    balanceProps: { intakeSoFar: logged.kcal, tdee, mealsLogged: 3 },
    recoveryProps: { hrv: hrvAvg == null ? 52 : Math.round(hrvAvg), rhr: rhrAvg == null ? 58 : Math.round(rhrAvg), plannedSession: 'Lower body — squat and hinge' },
    glasses: Array.from({ length: 8 }, (_, i) => ({
      title: (i + 1) * 250 + ' ml',
      style: 'width:26px;height:38px;border-radius:6px 6px 10px 10px;display:block;border:0.5px solid ' + (i < water ? '#C06C84' : 'rgba(0,0,0,0.08)') + ';background:' + (i < water ? '#F2DCE4' : '#FFFFFF') + ';transition:background 200ms cubic-bezier(.4,0,.2,1);',
    })),
    waterCopy: ((water * 250) / 1000).toFixed(2) + ' L of 2 L · from Apple Health',
    draftWeight: st.draft,
    unitLabel: uLabel,
    onDraftChange: (e: React.FormEvent<HTMLInputElement>) => setState({ draft: e.currentTarget.value }),
    onDraftKey: (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') addWeight(); },
    onAddWeight: addWeight,
    lastLoggedCopy: 'Last entry ' + fmt(latest.date, 'long') + ' · ' + conv(latest.weight).toFixed(1) + ' ' + uLabel + '. Entries land straight on the trend chart.',

    metricTabs: (Object.keys(metricDefs) as Array<keyof typeof metricDefs>).map((k) => ({
      label: metricDefs[k].label, onClick: () => setState({ metric: k }), style: pill(st.metric === k),
    })),
    rangeTabs: ([[30, '30 days'], [90, '3 months'], [180, '6 months'], [400, 'All']] as Array<[number, string]>).map((r) => ({
      label: r[1], onClick: () => setState({ range: r[0] }), style: chip(st.range === r[0]),
    })),
    yTicks, xTicks, rawDots, weighDots, maPath, bandPath, projBandPath,
    chartStats,
    rangeLabel: rangeLabelMap[st.range] || 'all data',
    chartSub: shownDaily.length + ' daily readings synced from Apple Health · 7-day trend line, ±' + sd.toFixed(2) + ' ' + (M.unit || 'pts') + ' daily noise band, ' + projDays + '-day projection',
    goalY: goalVal !== null ? +yOf(goalVal).toFixed(1) : -20,
    goalTextY: goalVal !== null ? +(yOf(goalVal) + 3.5).toFixed(1) : -20,
    goalChip: goalVal !== null ? 'GOAL ' + goalVal.toFixed(1) : '',
    projPath: 'M' + pStartX + ',' + pStartY + ' L' + pEndX + ',' + pEndY,
    projX: pEndX, projY: pEndY,
    projLabelX: pEndX - 10, projLabelY: pEndY - 16,
    projLabel: projVal.toFixed(M.dp),
    loMarker: marker(lo, 'Lowest'), hiMarker: marker(hi, 'Highest'),
    onChartMove: (e: React.MouseEvent<Element>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * W;
      let best = 0;
      let bestD = Infinity;
      shownDaily.forEach((d, i) => {
        const dist = Math.abs(xOf(d.t) - svgX);
        if (dist < bestD) { bestD = dist; best = i; }
      });
      const d = shownDaily[best];
      const trend = shownMa[best];
      const val = mv(d.w);
      setState({
        hover: {
          cx: +xOf(d.t).toFixed(1), cy: +yOf(val).toFixed(1),
          x: (xOf(d.t) / W) * 100, y: (yOf(val) / H) * 100,
          date: new Date(d.t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }),
          value: val.toFixed(M.dp) + ' ' + M.unit,
          sub: '7-day trend ' + mv(trend).toFixed(M.dp) + ' ' + M.unit + ' · ' + (d.w - trend >= 0 ? '+' : '−') + Math.abs(d.w - trend).toFixed(2) + ' vs trend',
        },
      });
    },
    onLeave: () => setState({ hover: null }),
    tooltip: st.hover,
    crosshair: st.hover ? { x: st.hover.cx, y: st.hover.cy } : null,
    tooltipStyle: st.hover ? {
      position: 'absolute' as const, left: st.hover.x + '%', top: st.hover.y + '%',
      transform: 'translate(-50%,-118%)', pointerEvents: 'none' as const, zIndex: 3,
      background: '#FFFFFF', border: '0.5px solid rgba(192,108,132,0.22)', borderRadius: 16,
      padding: '11px 15px', minWidth: 168, boxShadow: '0 12px 34px rgba(192,108,132,0.14)',
    } : null,

    weeklyRate: st.rate,
    rateLabel: (st.rate >= 0 ? '+' : '−') + Math.abs(st.rate).toFixed(2) + ' kg/wk',
    onRateChange: (e: React.FormEvent<HTMLInputElement>) => setState({ rate: parseFloat(e.currentTarget.value) }),
    projections: [mk('In 4 weeks', 4), mk('In 12 weeks', 12), mk('In 6 months', 26), mk('In a year', 52)],
    etaCopy,
    bodyRows,

    macros,
    meals: ['Porridge · 420 kcal', 'Chicken salad · 510 kcal', 'Yogurt + berries · 190 kcal', 'Dinner pending'],
    tdeeRows, tdeeTotalLabel: tdee.toLocaleString(),
    ledgerProps: { days: ledgerDays, targetDeficit: 500 },
    proteinProps: {
      proteinTodayG: logged.protein, proteinTargetG: proteinTarget,
      rhrWeekAvg: rhrAvg == null ? 58 : Math.round(rhrAvg),
      hrvWeekAvg: hrvAvg == null ? 52 : Math.round(hrvAvg),
      trainingLoad7Day: activeEnergy7 == null ? 430 : Math.round(activeEnergy7),
      trainingLoadYesterday: latestOf(days, (d) => d.activity.activeEnergyKcal) ?? 280,
    },

    sessions, loadBars, prs, liftProgress,
    macroTrend, fibreToday, sugarToday,
    proteinPerKgLabel: proteinPerKgToday > 0 ? proteinPerKgToday.toFixed(2) + ' g/kg' : '—',
    sleepDepth, habitStreaks,
    correction, outlier, muscleRisk, forecast,
    cycle, shiftSplit, relativeStrength, maintenanceTrend,
    rota, placementProgress, nightRecovery, tomorrowPrep,
    lifts: live.lifts,
    onLiftSaved,
    weeklyDeficitRows, weeklyDeficitHeadline, weeklyDeficitCopy,
    ...volumeVals(st, setState, live, st.tune.neat + st.tune.exercise),

    // Read-outs for the coaching card: only what the data actually supports.
    coachNotes: [
      muscleRisk
        ? { tag: 'Muscle', tone: 'warn' as const, title: muscleRisk.title, note: muscleRisk.note }
        : null,
      outlier
        ? { tag: 'Reading', tone: 'mid' as const, title: outlier.title, note: outlier.note }
        : null,
      plateau
        ? {
            tag: 'Plateau',
            tone: 'warn' as const,
            title: `Flat for ${plateau.days} days at ${plateau.meanWeight.toFixed(1)} kg`,
            note: plateauSuggestion(plateau, logged.kcal || avgIntake, tdee),
          }
        : null,
      reality?.significant
        ? {
            tag: 'Maintenance',
            tone: 'warn' as const,
            title: `Formula is off by ${Math.round(Math.abs(reality.driftPct) * 100)}%`,
            note: driftCopy(reality),
          }
        : reality
        ? {
            tag: 'Maintenance',
            tone: 'ok' as const,
            title: `Estimate holds at ${reality.actualTdee.toLocaleString()} kcal`,
            note: `Intake and weight change agree with the formula across ${reality.days} days, so the plan numbers can stand.`,
          }
        : null,
      readiness
        ? {
            tag: 'Readiness',
            tone: readiness.score >= 66 ? ('ok' as const) : readiness.score >= 40 ? ('mid' as const) : ('warn' as const),
            title: `${readiness.score} / 100`,
            note: readiness.verdict,
          }
        : null,
      adherence7
        ? {
            tag: 'Adherence',
            tone: adherence7.pct >= 70 ? ('ok' as const) : ('mid' as const),
            title: `${adherence7.pct}% over ${adherence7.days} days`,
            note: `Protein cleared target on ${adherence7.proteinDays} of ${adherence7.days}; intake stayed inside budget on ${adherence7.intakeDays}.`,
          }
        : null,
    ].filter((n): n is { tag: string; tone: 'ok' | 'mid' | 'warn'; title: string; note: string } => n !== null),
    coachEmpty: !plateau && !reality && !readiness && !adherence7 && !muscleRisk && !outlier,
    // The one note worth reading first, promoted out of Nutrition onto Today —
    // a plateau or a rejected assumption matters more than a tidy adherence score.
    topNote: (() => {
      if (muscleRisk) return { tag: 'Muscle', title: muscleRisk.title, note: muscleRisk.note, tone: 'warn' as const };
      if (plateau) return { tag: 'Plateau', title: `Flat for ${plateau.days} days`, note: plateauSuggestion(plateau, logged.kcal || avgIntake, tdee), tone: 'warn' as const };
      if (reality?.significant) return { tag: 'Maintenance', title: `Formula is off by ${Math.round(Math.abs(reality.driftPct) * 100)}%`, note: driftCopy(reality), tone: 'warn' as const };
      if (readiness && readiness.score < 40) return { tag: 'Readiness', title: `${readiness.score} / 100`, note: readiness.verdict, tone: 'warn' as const };
      if (adherence7 && adherence7.pct < 60) return { tag: 'Adherence', title: `${adherence7.pct}% this week`, note: `Protein cleared target on ${adherence7.proteinDays} of ${adherence7.days} days. The scale follows the logging.`, tone: 'mid' as const };
      if (readiness) return { tag: 'Readiness', title: `${readiness.score} / 100`, note: readiness.verdict, tone: 'ok' as const };
      return null;
    })(),
    habits, habitPct: Math.round((done / total) * 100),
    sleepBars, sleepAvg: (sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length).toFixed(1),
    reviewHeadline: (() => {
      const wk = readings.length >= 2 ? latest.weight - readings[readings.length - 2].weight : 0;
      const dir = wk < -0.05 ? `Down ${Math.abs(wk).toFixed(1)} kg` : wk > 0.05 ? `Up ${wk.toFixed(1)} kg` : 'Weight holding';
      const sleepAvgH = sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length;
      const weak = sleepAvgH < 7 ? 'sleep still the weak link' : adherence7 && adherence7.pct < 70 ? 'adherence the weak link' : 'nothing obviously off';
      return `${dir}, ${(live.workouts ?? []).length || 'no'} session${(live.workouts ?? []).length === 1 ? '' : 's'}, and ${weak}.`;
    })(),
    reviewBody: 'Average intake ' + avgIntake.toLocaleString() + ' kcal against ' + tdee.toLocaleString() + ' kcal burned — about a ' + Math.max(0, tdee - avgIntake) + ' kcal daily deficit. Protein hit on six of seven days, which is why the scale is moving without the sessions getting harder. Nothing to change: keep the food where it is and aim one earlier bedtime this week.',
    reviewChips: [
      ((live.workouts ?? []).length || 0) + ' sessions',
      adherence7 ? `${adherence7.proteinDays}/${adherence7.days} protein days` : '— protein days',
      (sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length).toFixed(1) + ' h sleep',
      'RHR ' + Math.round(rhrAvg ?? 58) + ' bpm',
      ...(latestOf(days, (d) => d.heart.vo2Max) ? ['VO₂ max ' + latestOf(days, (d) => d.heart.vo2Max)!.toFixed(1)] : []),
      ...(avgOf(days, (d) => d.activity.exerciseMinutes, 7) ? [Math.round(avgOf(days, (d) => d.activity.exerciseMinutes, 7)!) + ' min/day active'] : []),
      ...(avgOf(days, (d) => d.activity.distanceKm, 7) ? [avgOf(days, (d) => d.activity.distanceKm, 7)!.toFixed(1) + ' km/day'] : []),
    ],
    // Sleep stages, where Apple Health breaks the night down.
    sleepStages: (() => {
      const d = (days ?? []).slice(-1)[0];
      if (!d || d.sleep.totalMin == null) return null;
      const parts = [
        { label: 'Deep', min: d.sleep.deepMin, color: '#8A4459' },
        { label: 'Core', min: d.sleep.coreMin, color: '#C06C84' },
        { label: 'REM', min: d.sleep.remMin, color: '#D194A8' },
        { label: 'Awake', min: d.sleep.awakeMin, color: '#F2DCE4' },
      ].filter((s) => s.min != null && s.min > 0) as Array<{ label: string; min: number; color: string }>;
      if (!parts.length) return null;
      const total = parts.reduce((a, s) => a + s.min, 0);
      return {
        total: (total / 60).toFixed(1) + ' h',
        parts: parts.map((s) => ({
          label: s.label,
          value: Math.round(s.min) + ' min',
          pct: Math.round((s.min / total) * 100),
          barStyle: `height:100%;width:${((s.min / total) * 100).toFixed(1)}%;background:${s.color};`,
        })),
      };
    })(),
  };
}

function shellVals(
  st: DailyLogState, setState: SetState, latest: Reading, goal: number, tdee: number,
  kcalTarget: number, proteinTarget: number, conv: (v: number) => number, uLabel: string,
  maLast: number, avgIntake: number, readings: Reading[], proteinPerKg: number,
  live: LiveData, logged: { kcal: number; protein: number; steps: number },
  tdeeSource: 'measured' | 'formula',
) {
  const pace = st.pace;
  const wkAgo = readings[readings.length - 2] || latest;
  const actualWeekly = latest.weight - wkAgo.weight;
  const onTrack = actualWeekly <= -pace * 0.7;
  const kcalLeft = Math.max(0, kcalTarget - logged.kcal);

  const impliedTdee = Math.round(avgIntake + (-actualWeekly * 7700) / 7);
  const drift = impliedTdee - tdee;

  const recent = readings.slice(-7);
  // Prototype compared a weight against a whole reading object here, which made
  // every downstream adherence figure NaN. Compare the weights.
  const weekDeltas = recent.slice(1).map((r, i) => r.weight - recent[i].weight);
  const hitWeeks = weekDeltas.filter((d) => d <= -pace * 0.7).length;
  const adherencePct = weekDeltas.length ? Math.round((hitWeeks / weekDeltas.length) * 100) : 0;
  const avgWeekly = weekDeltas.length ? weekDeltas.reduce((a, b) => a + b, 0) / weekDeltas.length : 0;
  const correctedWeeks = avgWeekly < -0.05 ? Math.ceil((latest.weight - goal) / -avgWeekly) : null;

  const bar = (pct: number, color: string) =>
    'height:100%;width:' + Math.max(3, Math.min(100, pct)).toFixed(0) + '%;border-radius:999px;background:' + color + ';transition:width 500ms cubic-bezier(.16,1,.3,1);';


  // This week from Google Calendar, shaped server-side. Until it is configured
  // — or if the credentials stop working — the card shows the design's example
  // week, dimmed, so the layout still reads and the copy says why.
  const schedule = live.schedule;
  const scheduleLive = schedule?.status === 'ok' && schedule.days.length > 0;
  const scheduleRows = (scheduleLive
    ? schedule!.days.map((d) => ({ day: d.day, calendar: d.calendar, suggestion: d.suggestion }))
    : [
        { day: 'Mon', calendar: 'Uni · 9–4', suggestion: 'Lower body after class · 45 min' },
        { day: 'Tue', calendar: 'Shift · 7am–7.30pm', suggestion: 'Steps only — shift covers the deficit' },
        { day: 'Wed', calendar: 'Free evening', suggestion: 'Upper body · 40 min' },
        { day: 'Thu', calendar: 'Shift · 7am–7.30pm', suggestion: 'Rest and eat at maintenance' },
        { day: 'Fri', calendar: 'Free', suggestion: 'Full body · 45 min' },
        { day: 'Sat', calendar: 'Dinner out · 8pm', suggestion: 'Long walk, protein-led day' },
        { day: 'Sun', calendar: 'Free', suggestion: 'Weigh-in, meal prep, rest' },
      ]
  ).map((r) => ({
    day: r.day,
    calendar: scheduleLive ? r.calendar : 'not connected',
    calColor: scheduleLive ? '#C06C84' : '#B0ABA2',
    suggestion: scheduleLive ? r.suggestion : '—',
  }));


  const setTarget = (key: 'goal' | 'kcal' | 'proteinPerKg', raw: string) => {
    const v = parseFloat(raw);
    setState((s) => ({ targets: { ...s.targets, [key]: isNaN(v) ? undefined : v } }));
  };

  return {
    isFresh: st.fresh,
    hasData: !st.fresh,
    onboardSteps: [
      { num: '1', title: 'Connect Apple Health', note: 'Weight, steps, active energy, sleep and HRV sync automatically.', cta: 'Connect', onClick: () => setState({ fresh: false }) },
      { num: '2', title: 'Pick your pace', note: '0.75 kg a week protects muscle; 1 kg is a short block.', cta: 'Set pace', onClick: () => setState({ fresh: false, tab: 'plan' }) },
      { num: '3', title: 'Log your first meal', note: 'Two taps — the rings start filling straight away.', cta: 'Log food', onClick: () => setState({ fresh: false, tab: 'today', showLog: 'food' }) },
    ],
    heroWeight: conv(latest.weight).toFixed(1),
    heroChip: (actualWeekly <= 0 ? '↓ ' : '↑ ') + Math.abs(conv(actualWeekly)).toFixed(1) + ' this week',
    heroChipBg: actualWeekly <= 0 ? '#FAF0F3' : '#F7F6F5',
    heroChipColor: actualWeekly <= 0 ? '#8A4459' : '#AA7F68',
    heroVerdict: onTrack
      ? 'On plan — the 7-day trend sits at ' + conv(maLast).toFixed(1) + ' ' + uLabel + ' and you are losing at roughly ' + Math.abs(actualWeekly).toFixed(2) + ' kg a week against a ' + pace.toFixed(2) + ' kg target.'
      : 'Slightly behind plan — losing ' + Math.abs(actualWeekly).toFixed(2) + ' kg a week against a ' + pace.toFixed(2) + ' kg target. Hold the food and add steps before cutting further.',
    quickActions: [
      { label: st.targetsOpen ? 'Hide targets' : 'Adjust targets', onClick: () => setState({ targetsOpen: !st.targetsOpen }), style: 'padding:12px 20px;border:0;border-radius:10px;background:var(--ink);color:var(--paper);font-size:12.5px;cursor:pointer;' },
    ],
    heroStats: [
      { label: 'Calories', value: logged.kcal.toLocaleString(), note: 'of ' + kcalTarget.toLocaleString() + ' · ' + kcalLeft.toLocaleString() + ' left' },
      { label: 'Budget from', value: tdee.toLocaleString() + ' kcal', note: tdeeSource === 'measured' ? 'measured expenditure' : 'estimated expenditure' },
      { label: 'Protein', value: logged.protein + ' g', note: 'of ' + proteinTarget + ' g' },
      { label: '7-day trend', value: conv(maLast).toFixed(1) + ' ' + uLabel, note: 'Apple Health' },
    ],
    composer: null,
    targetsOpen: st.targetsOpen,
    targetFields: [
      { label: 'Goal weight', value: goal, unit: uLabel, step: 0.5, onChange: (e: React.FormEvent<HTMLInputElement>) => setTarget('goal', e.currentTarget.value) },
      { label: 'Daily calories', value: kcalTarget, unit: 'kcal', step: 25, onChange: (e: React.FormEvent<HTMLInputElement>) => setTarget('kcal', e.currentTarget.value) },
      { label: 'Protein', value: proteinPerKg, unit: 'g per kg', step: 0.1, onChange: (e: React.FormEvent<HTMLInputElement>) => setTarget('proteinPerKg', e.currentTarget.value) },
      { label: 'Weekly pace', value: pace, unit: 'kg per week', step: 0.05, onChange: (e: React.FormEvent<HTMLInputElement>) => { const v = parseFloat(e.currentTarget.value); if (!isNaN(v)) setState({ pace: Math.max(0.1, Math.min(1.5, v)) }); } },
    ],

    realityChip: Math.abs(drift) < 90 ? 'formula holds' : drift > 0 ? 'burning more' : 'burning less',
    realityChipBg: Math.abs(drift) < 90 ? '#FAF0F3' : '#F7F6F5',
    realityChipColor: Math.abs(drift) < 90 ? '#8A4459' : '#AA7F68',
    realityNumbers: [
      { label: 'Formula says', value: tdee.toLocaleString(), note: 'kcal maintenance' },
      { label: 'Your data says', value: impliedTdee.toLocaleString(), note: 'kcal maintenance' },
      { label: 'Drift', value: (drift >= 0 ? '+' : '−') + Math.abs(drift).toLocaleString(), note: 'kcal a day' },
    ],
    realityCopy2: Math.abs(drift) < 90
      ? 'Intake and weight change agree with the estimate to within ' + Math.abs(drift) + ' kcal, so the plan numbers can stand as they are.'
      : 'Your real maintenance looks like ' + impliedTdee.toLocaleString() + ' kcal. Update the expenditure estimate before touching food — the plan then recalculates from the truth rather than the formula.',

    adherenceLabel: hitWeeks + ' of ' + weekDeltas.length + ' weeks on pace',
    adherenceRows: [
      { label: 'Weeks on pace', value: adherencePct + '%', color: '#C06C84', barStyle: bar(adherencePct, '#E0AFBF') },
      { label: 'Avg weekly loss', value: avgWeekly.toFixed(2) + ' kg', color: '#C06C84', barStyle: bar((Math.abs(avgWeekly) / pace) * 100, '#C98BA0') },
      { label: 'Protein days', value: '6 / 7', color: '#7F9289', barStyle: bar(86, '#9FB3A9') },
      { label: 'Sessions logged', value: '4 / 5', color: '#7F9289', barStyle: bar(80, '#D194A8') },
    ],
    adherenceCopy: correctedWeeks
      ? 'At your measured pace — not the target — goal lands in about ' + correctedWeeks + ' weeks. The plan timeline updates from this number, so it stays honest even on a slow fortnight.'
      : 'Not enough downward movement in the last six weeks to project a date. Tighten the food logging for two weeks and this recalculates itself.',

    scheduleCopy: (() => {
      switch (schedule?.status) {
        case 'ok':
          return scheduleLive
            ? 'Reading your week from Google Calendar — lifts land on the lightest days, steps on the longest, and a reset on the quietest.'
            : 'Google Calendar is connected but this week is empty, so the example below stands in.';
        case 'auth_failed':
          return schedule.envPinned
            ? (schedule.detail ?? 'Google rejected the stored credentials.') +
              ' GOOGLE_REFRESH_TOKEN is set on this deployment and takes priority, so reconnecting here will not replace it — clear that variable first, then connect.'
            : (schedule.detail ?? 'Google rejected the stored credentials.') +
              ' Connecting again mints a fresh token; nothing needs pasting or redeploying.';
        case 'fetch_failed':
          return 'Signed in to Google, but the calendar could not be read. Check GOOGLE_CALENDAR_ID and that the Calendar API is enabled.';
        default:
          return schedule?.canConnect
            ? 'Connect your Google account and your real week replaces this example — training then places itself around the days you actually have, and the shift comparison on Habits starts filling in.'
            : (schedule?.detail ??
              'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the deployment, then connect your account here.');
      }
    })(),
    // Shown whenever connecting could plausibly help. The env-var case is
    // deliberately included: the button explains why it will not work there.
    scheduleCanConnect: Boolean(
      schedule && schedule.status !== 'ok' && (schedule.canConnect || schedule.status === 'auth_failed'),
    ),
    scheduleConnectLabel: schedule?.status === 'auth_failed' ? 'Reconnect Google →' : 'Connect Google Calendar →',
    onConnectGoogle: async () => {
      const pw = storedOperatorPassword();
      try {
        const res = await fetch('/api/operator/google/start', {
          method: 'POST',
          headers: { 'x-operator-pw': pw ?? '' },
        });
        const body = (await res.json().catch(() => ({}))) as { url?: string; detail?: string };
        if (body.url) window.location.href = body.url;
        else window.alert(body.detail ?? 'Could not start the Google connection.');
      } catch {
        window.alert('Could not reach the server to start the Google connection.');
      }
    },
    // Google's redirect_uri_mismatch names no URL, and the one it actually
    // received is only visible percent-encoded inside a query string. Show the
    // exact value this deployment sends, so it can be pasted rather than
    // reconstructed by hand.
    scheduleRedirectUri: schedule && schedule.status !== 'ok' ? schedule.redirectUri ?? null : null,
    onCopyRedirectUri: () => {
      const uri = schedule?.redirectUri;
      if (uri) void navigator.clipboard?.writeText(uri);
    },
    scheduleBadgeLabel: schedule?.status === 'ok'
      ? 'Google Calendar ✓'
      : schedule?.status === 'auth_failed'
      ? 'Credentials rejected'
      : schedule?.status === 'fetch_failed'
      ? 'Calendar unreachable'
      : 'Not configured',
    scheduleBadgeStyle: 'padding:11px 18px;border-radius:10px;font-size:12px;flex:none;border:0.5px solid ' +
      (schedule?.status === 'ok'
        ? 'rgba(192,108,132,0.30);background:#FAF0F3;color:#8A4459;'
        : schedule?.status === 'auth_failed' || schedule?.status === 'fetch_failed'
        ? 'rgba(170,127,104,0.28);background:#F7F6F5;color:#AA7F68;'
        : 'rgba(26,24,21,0.08);background:transparent;color:#B0ABA2;'),
    scheduleRows,
  };
}

function planVals(
  st: DailyLogState, setState: SetState, latest: Reading, goal: number, tdee: number,
  conv: (v: number) => number, uLabel: string,
) {
  const pace = st.pace;
  const totalDeficit = Math.round(pace * 1100);
  const floor = 1500;
  const foodDeficit = Math.min(totalDeficit, Math.max(0, tdee - floor));
  const moveDeficit = totalDeficit - foodDeficit;
  const intake = tdee - foodDeficit;
  const remaining = latest.weight - goal;
  const weeksToGoal = Math.ceil(remaining / pace);
  const goalDate = new Date(new Date(latest.date).getTime() + weeksToGoal * 7 * DAY);
  const proteinG = Math.round(latest.weight * 2.0);
  const fatG = Math.round(latest.weight * 0.8);
  const carbG = Math.max(60, Math.round((intake - proteinG * 4 - fatG * 9) / 4));
  const extraSteps = Math.round((moveDeficit * 22) / 500) * 500;

  const weeks = [];
  for (let i = 1; i <= Math.min(16, weeksToGoal); i++) {
    const target = latest.weight - pace * i;
    const date = new Date(new Date(latest.date).getTime() + i * 7 * DAY);
    const done = !!st.weekDone[i];
    weeks.push({
      week: 'Week ' + i,
      target: conv(target).toFixed(1) + ' ' + uLabel,
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      onClick: () => setState((s) => ({ weekDone: { ...s.weekDone, [i]: !s.weekDone[i] } })),
      style: 'display:flex;flex-direction:column;gap:3px;align-items:flex-start;padding:14px 16px;border-radius:10px;cursor:pointer;text-align:left;transition:all 220ms cubic-bezier(.4,0,.2,1);border:0.5px solid ' +
        (done ? 'rgba(192,108,132,0.3);background:#FAF0F3;color:#7A3D4E;' : 'rgba(26,24,21,0.12);background:#FFFFFF;color:#57544E;'),
    });
  }
  const doneCount = weeks.filter((_, i) => st.weekDone[i + 1]).length;

  return {
    paceLabel: pace.toFixed(2).replace(/0$/, '') + ' kg',
    paceOptions: [0.75, 1.0].map((p) => ({
      label: p.toFixed(2).replace(/0$/, '') + ' kg / week',
      onClick: () => setState({ pace: p }),
      style: chip(pace === p),
    })),
    planSub: 'Built from your ' + tdee.toLocaleString() + ' kcal expenditure. ' + (moveDeficit > 0
      ? 'Food covers ' + foodDeficit.toLocaleString() + ' kcal of the deficit and movement covers the last ' + moveDeficit.toLocaleString() + ' — eating lower than ' + floor.toLocaleString() + ' kcal is not worth it.'
      : 'All of it comes from food, no extra cardio needed.'),
    planNumbers: [
      { label: 'Eat per day', value: intake.toLocaleString(), note: 'kcal · ' + (moveDeficit > 0 ? 'plus ' + extraSteps.toLocaleString() + ' extra steps' : 'no extra cardio required'), bg: '#FFFFFF' },
      { label: 'Daily deficit', value: totalDeficit.toLocaleString(), note: 'kcal · ' + Math.round(totalDeficit * 7).toLocaleString() + ' a week', bg: '#FBF4F6' },
      { label: 'Weeks to goal', value: weeksToGoal, note: 'at ' + pace.toFixed(2) + ' kg a week', bg: '#FAFAF9' },
      { label: 'Goal date', value: goalDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), note: conv(goal).toFixed(1) + ' ' + uLabel + ' · ' + goalDate.getFullYear(), bg: '#FFFFFF' },
    ],
    planCaution: pace >= 1
      ? '1 kg a week is about 1.4% of your bodyweight — sustainable for a four to six week block, not forever. Keep protein at ' + proteinG + ' g, lift three times a week, and if strength drops two sessions in a row or sleep goes under six hours, step down to 0.75 kg a week.'
      : '0.75 kg a week is roughly 1% of bodyweight — the sweet spot for holding onto muscle. If the 7-day trend stalls for two weeks, add 1,000 steps a day before cutting food further.',
    planMacros: [
      { label: 'Protein', value: proteinG + ' g', note: '2.0 g per kg — spread across four meals', color: '#9FB3A9', pct: 100 },
      { label: 'Carbohydrate', value: carbG + ' g', note: 'Most of it around training and shifts', color: '#C98BA0', pct: 80 },
      { label: 'Fat', value: fatG + ' g', note: '0.8 g per kg — keeps hormones and mood steady', color: '#D194A8', pct: 62 },
      { label: 'Fibre', value: '30 g', note: 'Volume food: it is what makes 1,500 kcal bearable', color: '#AAB8A3', pct: 55 },
    ].map((m) => ({
      label: m.label, value: m.value, note: m.note,
      barStyle: 'height:100%;width:' + m.pct + '%;border-radius:999px;background:' + m.color + ';transition:width 500ms cubic-bezier(.16,1,.3,1);',
    })),
    planWeek: [
      { day: 'Mon', session: 'Lower body strength', detail: 'Squat, hinge, calves · 45 min', tag: 'Lift', tagBg: '#FAF0F3', tagColor: '#8A4459' },
      { day: 'Tue', session: 'Walk + easy day', detail: (8000 + (moveDeficit > 0 ? extraSteps : 0)).toLocaleString() + ' steps target', tag: 'Move', tagBg: '#FAFAF9', tagColor: '#8A4459' },
      { day: 'Wed', session: 'Upper body strength', detail: 'Press, row, curls · 40 min', tag: 'Lift', tagBg: '#FAF0F3', tagColor: '#8A4459' },
      { day: 'Thu', session: 'Mobility or rest', detail: 'Hips and ankles · 20 min', tag: 'Easy', tagBg: '#FAF0F3', tagColor: '#8A4459' },
      { day: 'Fri', session: 'Full body strength', detail: 'Deadlift, push-ups, core · 45 min', tag: 'Lift', tagBg: '#FAF0F3', tagColor: '#8A4459' },
      { day: 'Sat', session: 'Long walk', detail: '60–75 min, conversational pace', tag: 'Move', tagBg: '#FAFAF9', tagColor: '#8A4459' },
      { day: 'Sun', session: 'Rest · weigh-in · prep', detail: 'Review the 7-day trend and cook for the week', tag: 'Reset', tagBg: '#EFF2EE', tagColor: '#7F9289' },
    ],
    planRules: [
      'Protein at every meal — ' + Math.round(proteinG / 4) + ' g a sitting hits ' + proteinG + ' g without thinking about it.',
      'Three lifting sessions is the floor. Cardio is for the deficit; lifting is what keeps the shape.',
      'Weigh daily, judge weekly. Only the 7-day trend line counts.',
      pace >= 1 ? 'One day a week at maintenance (' + tdee.toLocaleString() + ' kcal) to keep training and mood intact.' : 'Sleep seven hours — under that, hunger and adherence both fall apart.',
    ],
    planWeeks: weeks,
    planDoneLabel: doneCount + ' of ' + weeks.length + ' weeks ticked off',
  };
}

/**
 * The energy card on Training.
 *
 * The design counted total weight moved (sets x reps x load). Nothing records
 * set-level lifting — Apple Health stores workouts, not reps — so this counts
 * the thing that is actually measured: active energy burned over the range,
 * with an everyday equivalent chosen to land near a comprehensible count.
 */
function volumeVals(st: DailyLogState, setState: SetState, live: LiveData, fallbackDaily: number) {
  // With a lift log the card can count what the design originally counted:
  // sets x reps x load. Without one it falls back to measured active energy.
  const hasLifts = Boolean(live.lifts?.length);
  const ranges: Array<[string, string, number]> = [
    ['week', 'This week', 7],
    ['month', 'This month', 30],
    ['quarter', 'Last 3 months', 91],
    ['all', 'Since February', 3650],
  ];
  const active = ranges.find((r) => r[0] === (st.volRange || 'month'))!;
  const windowDays = active[2];

  const cutoff = Date.now() - windowDays * DAY;
  if (hasLifts) return liftVolumeVals(st, setState, live, ranges, active, windowDays, cutoff);
  const inWindow = (live.days ?? []).filter(
    (d) => new Date(d.date).getTime() >= cutoff && d.activity.activeEnergyKcal != null,
  );
  const sessions = (live.workouts ?? []).filter((w) => new Date(w.startedAt).getTime() >= cutoff);

  const total = inWindow.length
    ? Math.round(inWindow.reduce((a, d) => a + (d.activity.activeEnergyKcal ?? 0), 0))
    : Math.round(fallbackDaily * Math.min(windowDays, 30));
  const perSession = sessions.length
    ? Math.round(total / sessions.length)
    : Math.round(total / Math.max(1, Math.round(Math.min(windowDays, 30) / 2)));

  // Everyday energy equivalents, in kcal.
  const treats = [
    { name: 'flat whites', one: 'a flat white', kcal: 110 },
    { name: 'bananas', one: 'a banana', kcal: 105 },
    { name: 'slices of pizza', one: 'a slice', kcal: 285 },
    { name: 'flapjacks', one: 'a flapjack', kcal: 320 },
    { name: 'roast dinners', one: 'a roast dinner', kcal: 850 },
    { name: 'Christmas dinners', one: 'a Christmas dinner', kcal: 1500 },
    { name: 'days of eating', one: 'a full day of eating', kcal: 2000 },
  ];
  const best = treats
    .map((a) => ({ a, count: total / a.kcal }))
    .filter((x) => x.count >= 1.5)
    .sort((x, y) => Math.abs(Math.log(x.count / 6)) - Math.abs(Math.log(y.count / 6)))[0]
    || { a: treats[0], count: total / treats[0].kcal };
  const count = best.count;
  const units = Math.min(24, Math.max(1, Math.round(count)));

  return {
    volRanges: ranges.map((r) => ({
      label: r[1],
      onClick: () => setState({ volRange: r[0] as DailyLogState['volRange'] }),
      style: chip((st.volRange || 'month') === r[0]),
    })),
    volTitleLead: 'Total',
    volTitleTail: 'energy burned',
    volCaption: 'Active energy from Apple Health — every walk, shift and session.',
    volUnit: 'kcal',
    volUnitNote: 'kcal each',
    volTotal: total.toLocaleString(),
    volSub: active[1].toLowerCase() + ' · ' + perSession.toLocaleString() + ' kcal per session on average' +
      (inWindow.length ? '' : ' · estimated until Apple Health syncs'),
    animalCount: (count >= 100 ? Math.round(count).toLocaleString() : count.toFixed(1)) + '\u00d7',
    animalName: best.a.name,
    animalNote: best.a.one + ' \u2248 ' + best.a.kcal.toLocaleString() + ' kcal',
    animalUnitKg: best.a.kcal.toLocaleString(),
    animalUnits: Array.from({ length: units }, (_, i) => ({
      style: 'width:16px;height:16px;border-radius:6px;display:inline-block;background:' + (i % 2 ? '#C98BA0' : '#E0AFBF') + ';opacity:' + (i < count ? 1 : 0.35) + ';',
    })),
    animalScale: (() => {
      const sorted = treats.slice().sort((x, y) => x.kcal - y.kcal);
      const bi = sorted.findIndex((a) => a.name === best.a.name);
      const from = Math.max(0, Math.min(bi - 2, sorted.length - 5));
      return sorted.slice(from, from + 5);
    })().map((a) => {
      const c = total / a.kcal;
      const isBest = a.name === best.a.name;
      return {
        name: a.name,
        count: c >= 100 ? Math.round(c).toLocaleString() + '\u00d7' : c.toFixed(1) + '\u00d7',
        labelColor: isBest ? '#C06C84' : '#8E8A82',
        barStyle: 'height:100%;width:' + Math.min(100, (Math.log10(Math.max(1.02, c)) / Math.log10(Math.max(2, total / treats[0].kcal))) * 100).toFixed(0) + '%;border-radius:999px;background:' + (isBest ? '#C06C84' : '#F2DCE4') + ';',
      };
    }),
  };
}

export type DailyLogVals = ReturnType<typeof deriveVals>;

/**
 * Total weight moved, from the lift log — the design's original framing, which
 * only becomes answerable once sets and loads are recorded.
 */
function liftVolumeVals(
  st: DailyLogState,
  setState: SetState,
  live: LiveData,
  ranges: Array<[string, string, number]>,
  active: [string, string, number],
  windowDays: number,
  cutoff: number,
) {
  const lifts = (live.lifts ?? []).filter((l) => new Date(l.performedOn).getTime() >= cutoff);
  const total = lifts.reduce((a, l) => a + l.volumeKg, 0);
  const sessionDays = new Set(lifts.map((l) => l.performedOn)).size;
  const perSession = sessionDays ? Math.round(total / sessionDays) : 0;

  const animals = [
    { name: 'golden retrievers', one: 'a golden retriever', kg: 32 },
    { name: 'red kangaroos', one: 'a red kangaroo', kg: 85 },
    { name: 'reindeer', one: 'a reindeer', kg: 180 },
    { name: 'polar bears', one: 'a polar bear', kg: 450 },
    { name: 'highland cows', one: 'a highland cow', kg: 500 },
    { name: 'giraffes', one: 'a giraffe', kg: 1200 },
    { name: 'African elephants', one: 'an African elephant', kg: 6000 },
  ];
  const best = animals
    .map((a) => ({ a, count: total / a.kg }))
    .filter((x) => x.count >= 1.5)
    .sort((x, y) => Math.abs(Math.log(x.count / 6)) - Math.abs(Math.log(y.count / 6)))[0]
    || { a: animals[0], count: total / animals[0].kg };
  const count = best.count;
  const units = Math.min(24, Math.max(1, Math.round(count)));

  return {
    volRanges: ranges.map((r) => ({
      label: r[1],
      onClick: () => setState({ volRange: r[0] as DailyLogState['volRange'] }),
      style: chip((st.volRange || 'month') === r[0]),
    })),
    volTitleLead: 'Total',
    volTitleTail: 'weight moved',
    volCaption: 'Every rep, every set, added up — sets × reps × load.',
    volUnit: 'kg',
    volUnitNote: 'kg each',
    volTotal: total.toLocaleString(),
    volSub: active[1].toLowerCase() + ' · ' +
      (sessionDays ? perSession.toLocaleString() + ' kg per session across ' + sessionDays + ' session' + (sessionDays === 1 ? '' : 's') : 'nothing logged in this range'),
    animalCount: (count >= 100 ? Math.round(count).toLocaleString() : count.toFixed(1)) + '\u00d7',
    animalName: best.a.name,
    animalNote: best.a.one + ' \u2248 ' + best.a.kg.toLocaleString() + ' kg',
    animalUnitKg: best.a.kg.toLocaleString(),
    animalUnits: Array.from({ length: units }, (_, i) => ({
      style: 'width:16px;height:16px;border-radius:6px;display:inline-block;background:' + (i % 2 ? '#C98BA0' : '#E0AFBF') + ';opacity:' + (i < count ? 1 : 0.35) + ';',
    })),
    animalScale: (() => {
      const sorted = animals.slice().sort((x, y) => x.kg - y.kg);
      const bi = sorted.findIndex((a) => a.name === best.a.name);
      const from = Math.max(0, Math.min(bi - 2, sorted.length - 5));
      return sorted.slice(from, from + 5);
    })().map((a) => {
      const c = total / a.kg;
      const isBest = a.name === best.a.name;
      return {
        name: a.name,
        count: c >= 100 ? Math.round(c).toLocaleString() + '\u00d7' : c.toFixed(1) + '\u00d7',
        labelColor: isBest ? '#C06C84' : '#8E8A82',
        barStyle: 'height:100%;width:' + Math.min(100, (Math.log10(Math.max(1.02, c)) / Math.log10(Math.max(2, total / animals[0].kg))) * 100).toFixed(0) + '%;border-radius:999px;background:' + (isBest ? '#C06C84' : '#F2DCE4') + ';',
      };
    }),
  };
}
