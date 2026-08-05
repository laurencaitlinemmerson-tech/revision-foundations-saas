import type React from 'react';
import { avgOf, latestOf, series, today as todayRow, type LiveData, type Workout } from './data';
import { storedOperatorPassword } from '../OperatorGate';

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
  water: number;
  logged: { kcal: number; protein: number; steps: number };
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
  notion: boolean;
  targets: { goal?: number; kcal?: number; proteinPerKg?: number };
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
  water: 5,
  logged: { kcal: 1240, protein: 96, steps: 8420 },
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
  notion: false,
  targets: {},
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
  return 'padding:10px 20px;border-radius:999px;border:0;cursor:pointer;font-size:12.5px;letter-spacing:0.01em;transition:background 220ms cubic-bezier(.4,0,.2,1),color 220ms;' +
    (active ? 'background:#F4EEE0;color:#8A7346;' : 'background:transparent;color:#9A9287;');
}

export function chip(active: boolean) {
  return 'padding:7px 15px;border-radius:999px;cursor:pointer;font-size:11.5px;transition:all 220ms cubic-bezier(.4,0,.2,1);border:0.5px solid ' +
    (active ? 'rgba(178,152,106,0.35);' : 'rgba(26,24,21,0.06);') +
    (active ? 'background:#F8F3EC;color:#9C7F6A;' : 'background:transparent;color:#A19A8F;');
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
) {
  const st = state;
  const T = st.targets || {};
  const goal = T.goal ?? props.goalKg ?? 68;
  const kcalTarget = T.kcal ?? props.calorieTarget ?? 2000;
  // Live weigh-ins win; a locally added reading (the weigh-in composer) wins over
  // both; the design's seed series is the last resort so an empty account still
  // renders the dashboard rather than a blank.
  const readings: Reading[] = st.readings
    ?? live.readings
    ?? BASE.map((r) => ({ date: r[0], weight: r[1] }));
  const days = live.days;
  const dayNow = todayRow(days);
  const intakeSeries = series(days, (d) => d.nutrition.dietaryEnergyKcal, 14) ?? INTAKE;
  const sleepSeries = series(days, (d) => (d.sleep.totalMin == null ? null : d.sleep.totalMin / 60), 10) ?? SLEEP_HOURS;
  const stepSeries = series(days, (d) => d.activity.steps, 8);
  const proteinSeries = series(days, (d) => d.nutrition.proteinG, 8);
  const rhrAvg = avgOf(days, (d) => d.heart.restingHr, 7);
  const hrvAvg = avgOf(days, (d) => d.heart.hrvMs, 7);
  const activeEnergy7 = avgOf(days, (d) => d.activity.activeEnergyKcal, 7);
  // Real body composition from the scale, where the scale reports it.
  const weighByDate = new Map((live.weighIns ?? []).map((w) => [w.date.slice(0, 10), w]));
  const latest = readings[readings.length - 1];
  const prev = readings[readings.length - 2] ?? latest;
  const tdee = Math.round(st.tune.bmr + st.tune.neat + st.tune.exercise + st.tune.tef);
  const unit = st.unit;
  const conv = (v: number) => (unit === 'lb' ? v * 2.20462 : v);
  const uLabel = unit === 'lb' ? 'lb' : 'kg';
  const bmiOf = (w: number) => w / (1.68 * 1.68);

  /* ── nav + tabs ── */
  const navDefs: Array<[DailyLogState['tab'], string, string]> = [
    ['today', 'Today', 'now'],
    ['trends', 'Trends', readings.length + ' logs'],
    ['plan', 'Plan', st.pace.toFixed(2) + ' kg/wk'],
    ['progress', 'Progress', '−' + (BASE[0][1] - latest.weight).toFixed(1) + ' kg'],
    ['food', 'Nutrition', tdee.toLocaleString() + ' kcal'],
    ['training', 'Training', '4 sessions'],
    ['habits', 'Habits', '21 days'],
  ];
  const navItems = navDefs.map((n) => ({
    label: n[1],
    meta: n[2],
    onClick: () => setState({ tab: n[0] }),
    style: 'display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;padding:13px 16px;border:0;border-radius:16px;cursor:pointer;font-size:13.5px;text-align:left;transition:background 220ms cubic-bezier(.4,0,.2,1),color 220ms;' +
      (st.tab === n[0] ? 'background:#FFFFFF;color:#1A1815;box-shadow:0 6px 18px rgba(26,24,21,0.05);' : 'background:transparent;color:#8A8377;'),
  }));
  const tabs = navDefs.map((n) => ({
    label: n[1],
    onClick: () => setState({ tab: n[0] }),
    style: pill(st.tab === n[0]),
  }));

  /* ── KPI cards ── */
  const sparkOf = (vals: number[]) => {
    const mn = Math.min.apply(null, vals);
    const mx = Math.max.apply(null, vals);
    const rng = mx - mn || 1;
    return vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * 118 + 1;
      const y = 26 - ((v - mn) / rng) * 24;
      return (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
  };
  const last8 = readings.slice(-8).map((r) => r.weight);
  const dw = latest.weight - prev.weight;
  const proteinPerKg = T.proteinPerKg ?? props.proteinPerKg ?? 1.8;
  const kpis = [
    { label: 'Weight', value: +conv(latest.weight).toFixed(1), decimals: 1, unit: uLabel, chip: (dw <= 0 ? '↓ ' : '↑ ') + Math.abs(conv(dw)).toFixed(1), chipBg: dw <= 0 ? '#ECF0ED' : '#F7F0E9', chipColor: dw <= 0 ? '#8A9C93' : '#AA7F68', color: '#C2A87C', spark: sparkOf(last8) },
    { label: 'Calories', value: Math.max(0, kcalTarget - st.logged.kcal), decimals: 0, unit: 'kcal', chip: st.logged.kcal + ' in', chipBg: '#F5F3F0', chipColor: '#5A5750', color: '#8A9C93', spark: sparkOf(intakeSeries.slice(-8)) },
    { label: 'Protein', value: st.logged.protein, decimals: 0, unit: 'g', chip: Math.round((st.logged.protein / (latest.weight * proteinPerKg)) * 100) + '%', chipBg: '#F6F1E6', chipColor: '#9C7F6A', color: '#9C7F6A', spark: sparkOf(proteinSeries ? [...proteinSeries.slice(-7), st.logged.protein] : [88, 104, 96, 120, 112, 98, 126, st.logged.protein]) },
    { label: 'Steps', value: st.logged.steps, decimals: 0, unit: '', chip: st.logged.steps >= 8000 ? 'goal met' : 'keep going', chipBg: st.logged.steps >= 8000 ? '#ECF0ED' : '#F5F3F0', chipColor: st.logged.steps >= 8000 ? '#8A9C93' : '#5A5750', color: '#5A5750', spark: sparkOf(stepSeries ? [...stepSeries.slice(-7), st.logged.steps] : [7400, 9100, 6800, 10400, 8900, 7600, 11200, st.logged.steps]) },
    { label: 'Sleep', value: +(sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length).toFixed(1), decimals: 1, unit: 'h avg', chip: 'RHR ' + Math.round(rhrAvg ?? 58), chipBg: '#F5F3F0', chipColor: '#5A5750', color: '#C2A87C', spark: sparkOf(sleepSeries.slice(-8)) },
  ].map((k) => ({ ...k, display: k.decimals ? k.value.toFixed(k.decimals) : Math.round(k.value).toLocaleString() }));

  /* ── rings ── */
  const ringDefs = [
    { key: 'kcal' as const, name: 'Calories', r: 84, color: '#D8BCA8', track: '#F7F0E9', value: st.logged.kcal, target: kcalTarget, unit: 'kcal', step: 250 },
    { key: 'protein' as const, name: 'Protein', r: 66, color: '#A6B8AF', track: '#F6F1E6', value: st.logged.protein, target: Math.round(latest.weight * proteinPerKg), unit: 'g', step: 15 },
    { key: 'steps' as const, name: 'Steps', r: 48, color: '#CDB88F', track: '#F5F0E4', value: st.logged.steps, target: 8000, unit: '', step: 500 },
  ];
  const bump = (key: 'kcal' | 'protein' | 'steps', amount: number) =>
    setState((s) => ({ logged: { ...s.logged, [key]: Math.max(0, s.logged[key] + amount) } }));
  const rings = ringDefs.map((r) => {
    const c = 2 * Math.PI * r.r;
    const pct = Math.min(1, r.value / r.target);
    return {
      r: r.r, color: r.color, track: r.track, name: r.name,
      dash: c.toFixed(1), offset: (c * (1 - pct)).toFixed(1),
      detail: r.value.toLocaleString() + ' of ' + r.target.toLocaleString() + ' ' + r.unit + ' · ' + Math.round(pct * 100) + '%',
      onClick: () => setState({ ringFocus: r.key }),
      onPlus: (e: { stopPropagation: () => void }) => { e.stopPropagation(); bump(r.key, r.step); },
      onMinus: (e: { stopPropagation: () => void }) => { e.stopPropagation(); bump(r.key, -r.step); },
      rowStyle: 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background 200ms cubic-bezier(.4,0,.2,1);' +
        (st.ringFocus === r.key ? 'background:var(--paper-deep);' : 'background:transparent;'),
    };
  });
  const focus = ringDefs.find((r) => r.key === st.ringFocus) || ringDefs[0];
  const ringFocus = {
    value: focus.key === 'kcal' ? Math.max(0, focus.target - focus.value).toLocaleString() : focus.value.toLocaleString(),
    label: focus.key === 'kcal' ? 'KCAL LEFT' : focus.name.toUpperCase() + ' TODAY',
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
      color: t > tLast ? '#A6ADA7' : '#9A948C',
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
      chipBg: d >= 0 ? '#F7F0E9' : '#ECF0ED',
      chipColor: d >= 0 ? '#AA7F68' : '#8A9C93',
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
  ].map((b) => ({
    label: b.label, value: b.value, spark: b.spark,
    delta: (b.d >= 0 ? '+' : '−') + Math.abs(b.d).toFixed(1),
    chipBg: b.d <= 0 ? '#ECF0ED' : '#F7F0E9',
    chipColor: b.d <= 0 ? '#8A9C93' : '#AA7F68',
  }));

  /* ── nutrition ── */
  const proteinTarget = Math.round(latest.weight * proteinPerKg);
  const macros = [
    { label: 'Protein', v: st.logged.protein, t: proteinTarget, unit: 'g', color: '#8A9C93' },
    { label: 'Carbohydrate', v: Math.round(dayNow?.nutrition.carbsG ?? 148), t: 210, unit: 'g', color: '#C2A87C' },
    { label: 'Fat', v: Math.round(dayNow?.nutrition.fatG ?? 52), t: 68, unit: 'g', color: '#9C7F6A' },
  ].map((m) => ({
    label: m.label,
    value: m.v + ' / ' + m.t + ' ' + m.unit,
    barStyle: 'height:100%;width:' + Math.min(100, (m.v / m.t) * 100).toFixed(1) + '%;background:' + m.color + ';border-radius:999px;transition:width 500ms cubic-bezier(.16,1,.3,1);',
  }));
  const tdeeRows = [
    { key: 'bmr' as const, acronym: 'BMR', fullName: 'what the body spends existing', color: '#1A1815', detail: 'Mifflin–St Jeor at ' + latest.weight.toFixed(1) + ' kg, 168 cm, 26 years. This is the floor.' },
    { key: 'neat' as const, acronym: 'NEAT', fullName: 'everything that is not training', color: '#C2A87C', detail: 'Walking, shifts, stairs, fidgeting. The most volatile line — a busy day and a rest day differ by roughly 400 kcal.' },
    { key: 'exercise' as const, acronym: 'EAT', fullName: 'deliberate training', color: '#8A9C93', detail: 'Four logged sessions a week, spread across seven days. Strength work costs less than it feels like.' },
    { key: 'tef' as const, acronym: 'TEF', fullName: 'the cost of digesting food', color: '#9C7F6A', detail: 'Roughly 8–10% of intake, and it rises with protein.' },
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
        (deficit >= 0 ? (isNow ? '#C2A87C' : '#EBE1CC') : '#D8BCA8') + ';',
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
    { day: 'MON', name: 'Lower body', note: 'Squat, hinge, calves', kcal: 310, tint: '#F6F1E6', sets: [{ move: 'Back squat', load: '62.5 kg', reps: '4 × 6' }, { move: 'Romanian deadlift', load: '55 kg', reps: '3 × 8' }, { move: 'Calf raise', load: '40 kg', reps: '3 × 12' }] },
    { day: 'TUE', name: 'Long walk', note: '74 min, riverside', kcal: 290, tint: '#ECF0ED', sets: [{ move: 'Zone 2 walk', load: '5.9 km', reps: '74 min' }] },
    { day: 'WED', name: 'Upper body', note: 'Press, row, curls', kcal: 265, tint: '#F6F1E6', sets: [{ move: 'Overhead press', load: '27.5 kg', reps: '4 × 6' }, { move: 'Chest-supported row', load: '35 kg', reps: '3 × 10' }, { move: 'Cable curl', load: '15 kg', reps: '3 × 12' }] },
    { day: 'FRI', name: 'Full body', note: 'Deadlift, push-ups, core', kcal: 340, tint: '#F6F1E6', sets: [{ move: 'Deadlift', load: '85 kg', reps: '3 × 5' }, { move: 'Push-up', load: 'bodyweight', reps: '3 × 12' }, { move: 'Dead bug', load: '—', reps: '3 × 10' }] },
    { day: 'SUN', name: 'Mobility', note: 'Hips and ankles', kcal: 60, tint: '#F5F3F0', sets: [{ move: 'Flow', load: '22 min', reps: 'easy' }] },
  ];
  const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekStart = Date.now() - 7 * DAY;
  const liveSessions = (live.workouts ?? [])
    .filter((w) => new Date(w.startedAt).getTime() >= weekStart)
    .map((w) => {
      const detail: Array<{ move: string; load: string; reps: string }> = [];
      if (w.durationMin) detail.push({ move: 'Duration', load: Math.round(w.durationMin) + ' min', reps: '' });
      if (w.distanceKm) detail.push({ move: 'Distance', load: w.distanceKm.toFixed(1) + ' km', reps: '' });
      if (w.avgHr) detail.push({ move: 'Average heart rate', load: Math.round(w.avgHr) + ' bpm', reps: w.maxHr ? 'max ' + Math.round(w.maxHr) : '' });
      return {
        day: DOW[new Date(w.startedAt).getDay()],
        name: w.type ?? 'Session',
        note: [w.durationMin ? Math.round(w.durationMin) + ' min' : null, w.source].filter(Boolean).join(' · '),
        kcal: Math.round(w.energyKcal ?? 0),
        tint: '#F6F1E6',
        // Set-level detail needs a lift log, which nothing writes yet; until then
        // a session opens onto what Apple Health actually recorded.
        sets: detail.length ? detail : [{ move: 'No set detail recorded', load: '—', reps: '' }],
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
    style: 'width:100%;height:' + ((v / loadMax) * 100).toFixed(1) + '%;border-radius:8px 8px 0 0;background:' + (i === loadVals.length - 1 ? '#C2A87C' : '#EBE1CC') + ';transition:height 500ms cubic-bezier(.16,1,.3,1);',
  }));
  // Bests Apple Health can actually answer. Lift PRs would need set-level data,
  // which nothing records; these come off the workout log itself.
  const prs = (() => {
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

  /* ── habits + sleep ── */
  let done = 0, total = 0;
  // A habit day is "done" when Apple Health shows the target met; an explicit tap
  // still overrides it, and days with no sync fall back to the design's pattern.
  const last14 = (days ?? []).slice(-14);
  const liveHabit = (key: string, i: number): boolean | undefined => {
    const d = last14[last14.length - 14 + i] ?? last14[i];
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
  };
  const habits = HABIT_DEFS.map((h) => {
    let count = 0;
    const days = [];
    for (let i = 0; i < 14; i++) {
      const on = liveHabit(h.key, i) ?? habitCell(st, h.key, i);
      if (on) count++;
      total++;
      if (on) done++;
      days.push({
        title: h.name + ' · day ' + (i + 1) + (on ? ' · done' : ' · missed'),
        style: 'aspect-ratio:1;width:100%;border-radius:7px;border:0.5px solid rgba(0,0,0,0.06);transition:background 200ms cubic-bezier(.4,0,.2,1);background:' + (on ? '#C2A87C' : '#F5F3F0') + ';',
      });
    }
    return { name: h.name, days, count };
  });
  const sleepMax = 9;
  const sleepBars = sleepSeries.map((h, i) => ({
    label: String(i + 1),
    title: h.toFixed(1) + ' hours',
    style: 'width:100%;height:' + ((h / sleepMax) * 100).toFixed(1) + '%;border-radius:8px 8px 0 0;background:' + (h >= 7 ? '#8A9C93' : '#EBE1CC') + ';opacity:' + (h >= 7 ? 0.75 : 1) + ';transition:height 500ms cubic-bezier(.16,1,.3,1);',
  }));
  const avgIntake = Math.round(intakeSeries.reduce((a, b) => a + b, 0) / intakeSeries.length);

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
    navItems, tabs,
    isToday: st.tab === 'today', isTrends: st.tab === 'trends', isFood: st.tab === 'food',
    isProgress: st.tab === 'progress', isPlan: st.tab === 'plan',
    isTraining: st.tab === 'training', isHabits: st.tab === 'habits',
    ...planVals(st, setState, latest, goal, tdee, conv, uLabel),
    ...shellVals(st, setState, latest, goal, tdee, kcalTarget, proteinTarget, conv, uLabel, maLast, avgIntake, readings, proteinPerKg, live),
    lostValue: +conv(BASE[0][1] - latest.weight).toFixed(1),
    lostCopy: 'Down from ' + conv(BASE[0][1]).toFixed(1) + ' ' + uLabel + ' on 8 February — ' + Math.round((tLast - new Date(BASE[0][0]).getTime()) / DAY) + ' days of daily weigh-ins.',
    startLabel: 'Start ' + conv(BASE[0][1]).toFixed(1) + ' ' + uLabel,
    goalDisplay: conv(goal).toFixed(1) + ' ' + uLabel,
    pctLabel: Math.round(Math.min(100, ((BASE[0][1] - latest.weight) / (BASE[0][1] - goal)) * 100)) + '%',
    progressBarStyle: 'height:100%;width:' + Math.min(100, ((BASE[0][1] - latest.weight) / (BASE[0][1] - goal)) * 100).toFixed(1) + '%;border-radius:999px;background:#DBC9A2;transition:width 700ms cubic-bezier(.16,1,.3,1);',
    milestones: [1, 2, 3, 4, 5, 6, 7, 8].map((kg) => {
      const hit = BASE[0][1] - latest.weight >= kg;
      return {
        label: '−' + kg + ' kg',
        style: 'font-size:11px;padding:5px 12px;border-radius:999px;border:0.5px solid ' +
          (hit ? 'rgba(178,152,106,0.22);background:#F6F1E6;color:#9C7F6A;' : 'rgba(26,24,21,0.06);background:transparent;color:#B7B1A8;'),
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
        deltaColor: p.key === 0 ? '#A9A29A' : '#8A9C93',
      };
    }),
    monthly: [
      { month: 'February', d: -0.7 }, { month: 'March', d: -0.8 }, { month: 'April', d: -0.5 },
      { month: 'May', d: -1.1 }, { month: 'June', d: -0.9 }, { month: 'July', d: -1.3 },
    ].map((m) => ({
      month: m.month,
      delta: (m.d >= 0 ? '+' : '−') + Math.abs(m.d).toFixed(1) + ' kg',
      color: m.d <= 0 ? '#C2A87C' : '#BC9B84',
      barStyle: 'height:100%;width:' + Math.min(100, (Math.abs(m.d) / 1.4) * 100).toFixed(0) + '%;border-radius:999px;background:' + (m.d <= 0 ? '#E5D8BE' : '#E6D4C4') + ';',
    })),
    wins: [
      { title: 'Jeans from January fit again', note: 'Noticed 14 July — waist down 4.4 cm since February.' },
      { title: 'Back squat up 12.5 kg', note: 'Lighter body, heavier bar — strength held through the whole cut.' },
      { title: 'Resting heart rate 64 → 58 bpm', note: 'Apple Health, six-month average.' },
      { title: 'Walking a full shift without aching', note: 'Twelve-hour days feel manageable now.' },
    ],
    greeting: 'Good morning, Maya.',
    subhead: 'Sunday 2 August · ' + conv(latest.weight).toFixed(1) + ' ' + uLabel + ' this morning, ' + Math.max(0, kcalTarget - st.logged.kcal).toLocaleString() + ' kcal left today.',
    unitToggle: (['kg', 'lb'] as const).map((u) => ({ label: u, onClick: () => setState({ unit: u }), style: chip(unit === u) })),
    kpis,
    rings, ringFocus,
    balanceProps: { intakeSoFar: st.logged.kcal, tdee, mealsLogged: 3 },
    recoveryProps: { hrv: hrvAvg == null ? 52 : Math.round(hrvAvg), rhr: rhrAvg == null ? 58 : Math.round(rhrAvg), plannedSession: 'Lower body — squat and hinge' },
    glasses: Array.from({ length: 8 }, (_, i) => ({
      title: (i + 1) * 250 + ' ml',
      style: 'width:26px;height:38px;border-radius:6px 6px 10px 10px;display:block;border:0.5px solid ' + (i < st.water ? '#C2A87C' : 'rgba(0,0,0,0.08)') + ';background:' + (i < st.water ? '#EBE1CC' : '#FAFAF8') + ';transition:background 200ms cubic-bezier(.4,0,.2,1);',
    })),
    waterCopy: ((st.water * 250) / 1000).toFixed(2) + ' L of 2 L · from Apple Health',
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
      background: '#FFFFFF', border: '0.5px solid rgba(178,152,106,0.18)', borderRadius: 16,
      padding: '11px 15px', minWidth: 168, boxShadow: '0 12px 34px rgba(178,152,106,0.14)',
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
      proteinTodayG: st.logged.protein, proteinTargetG: proteinTarget,
      rhrWeekAvg: rhrAvg == null ? 58 : Math.round(rhrAvg),
      hrvWeekAvg: hrvAvg == null ? 52 : Math.round(hrvAvg),
      trainingLoad7Day: activeEnergy7 == null ? 430 : Math.round(activeEnergy7),
      trainingLoadYesterday: latestOf(days, (d) => d.activity.activeEnergyKcal) ?? 280,
    },

    sessions, loadBars, prs,
    weeklyDeficitRows, weeklyDeficitHeadline, weeklyDeficitCopy,
    ...volumeVals(st, setState, live, st.tune.neat + st.tune.exercise),

    habits, habitPct: Math.round((done / total) * 100),
    sleepBars, sleepAvg: (sleepSeries.reduce((a, b) => a + b, 0) / sleepSeries.length).toFixed(1),
    reviewHeadline: 'Down 0.2 kg, four sessions, and sleep still the weak link.',
    reviewBody: 'Average intake ' + avgIntake.toLocaleString() + ' kcal against ' + tdee.toLocaleString() + ' kcal burned — about a ' + Math.max(0, tdee - avgIntake) + ' kcal daily deficit. Protein hit on six of seven days, which is why the scale is moving without the sessions getting harder. Nothing to change: keep the food where it is and aim one earlier bedtime this week.',
    reviewChips: ['4 sessions', '6/7 protein days', '6.9 h sleep', 'RHR 58 bpm'],
  };
}

function shellVals(
  st: DailyLogState, setState: SetState, latest: Reading, goal: number, tdee: number,
  kcalTarget: number, proteinTarget: number, conv: (v: number) => number, uLabel: string,
  maLast: number, avgIntake: number, readings: Reading[], proteinPerKg: number,
  live: LiveData,
) {
  const pace = st.pace;
  const wkAgo = readings[readings.length - 2] || latest;
  const actualWeekly = latest.weight - wkAgo.weight;
  const onTrack = actualWeekly <= -pace * 0.7;
  const kcalLeft = Math.max(0, kcalTarget - st.logged.kcal);

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


  // Notion (shifts, lectures) and Google Calendar, merged server-side into the
  // week and read straight through. Until either is configured the card shows
  // the design's example week, dimmed, so the layout still reads.
  const schedule = live.schedule;
  const notionRows = (schedule?.days.length
    ? schedule.days.map((d) => ({ day: d.day, calendar: d.calendar, suggestion: d.suggestion }))
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
    calendar: schedule ? r.calendar : 'not connected',
    calColor: schedule ? '#C2A87C' : '#B7B1A8',
    suggestion: schedule ? r.suggestion : '—',
  }));

  const sources = schedule
    ? [schedule.connected.notion ? 'Notion' : null, schedule.connected.google ? 'Google Calendar' : null]
        .filter(Boolean)
    : [];

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
    heroChipBg: actualWeekly <= 0 ? '#F4EEE0' : '#F7F0E9',
    heroChipColor: actualWeekly <= 0 ? '#8A7346' : '#AA7F68',
    heroVerdict: onTrack
      ? 'On plan — the 7-day trend sits at ' + conv(maLast).toFixed(1) + ' ' + uLabel + ' and you are losing at roughly ' + Math.abs(actualWeekly).toFixed(2) + ' kg a week against a ' + pace.toFixed(2) + ' kg target.'
      : 'Slightly behind plan — losing ' + Math.abs(actualWeekly).toFixed(2) + ' kg a week against a ' + pace.toFixed(2) + ' kg target. Hold the food and add steps before cutting further.',
    quickActions: [
      { label: st.targetsOpen ? 'Hide targets' : 'Adjust targets', onClick: () => setState({ targetsOpen: !st.targetsOpen }), style: 'padding:12px 20px;border:0;border-radius:16px;background:var(--ink);color:var(--paper);font-size:12.5px;cursor:pointer;' },
    ],
    heroStats: [
      { label: 'Calories left', value: kcalLeft.toLocaleString(), note: 'of ' + kcalTarget.toLocaleString() },
      { label: 'Protein', value: st.logged.protein + ' g', note: 'of ' + proteinTarget + ' g' },
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
    realityChipBg: Math.abs(drift) < 90 ? '#F4EEE0' : '#F7F0E9',
    realityChipColor: Math.abs(drift) < 90 ? '#8A7346' : '#AA7F68',
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
      { label: 'Weeks on pace', value: adherencePct + '%', color: '#C2A87C', barStyle: bar(adherencePct, '#DBC9A2') },
      { label: 'Avg weekly loss', value: avgWeekly.toFixed(2) + ' kg', color: '#C2A87C', barStyle: bar((Math.abs(avgWeekly) / pace) * 100, '#D8BCA8') },
      { label: 'Protein days', value: '6 / 7', color: '#8A9C93', barStyle: bar(86, '#A6B8AF') },
      { label: 'Sessions logged', value: '4 / 5', color: '#8A9C93', barStyle: bar(80, '#CDB88F') },
    ],
    adherenceCopy: correctedWeeks
      ? 'At your measured pace — not the target — goal lands in about ' + correctedWeeks + ' weeks. The plan timeline updates from this number, so it stays honest even on a slow fortnight.'
      : 'Not enough downward movement in the last six weeks to project a date. Tighten the food logging for two weeks and this recalculates itself.',

    notionCopy: sources.length
      ? 'Reading your week from ' + sources.join(' and ') + ' — lifts land on the lightest days, steps on the longest, and a reset on the quietest.'
      : 'Set NOTION_TOKEN and NOTION_SCHEDULE_DATABASE_ID, or the GOOGLE_* calendar credentials, and your real week replaces this example — training then places itself around the days you actually have.',
    notionButtonLabel: sources.length ? sources.join(' + ') + ' ✓' : 'Not configured',
    notionButtonStyle: 'padding:11px 18px;border-radius:16px;font-size:12px;flex:none;border:0.5px solid ' +
      (sources.length
        ? 'rgba(178,152,106,0.28);background:#F4EEE0;color:#8A7346;'
        : 'rgba(26,24,21,0.08);background:transparent;color:#B7B1A8;'),
    notionRows,
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
      style: 'display:flex;flex-direction:column;gap:3px;align-items:flex-start;padding:14px 16px;border-radius:18px;cursor:pointer;text-align:left;transition:all 220ms cubic-bezier(.4,0,.2,1);border:0.5px solid ' +
        (done ? 'rgba(178,152,106,0.3);background:#F4EEE0;color:#7A6540;' : 'rgba(26,24,21,0.06);background:#FCFBF9;color:#5A5750;'),
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
      { label: 'Eat per day', value: intake.toLocaleString(), note: 'kcal · ' + (moveDeficit > 0 ? 'plus ' + extraSteps.toLocaleString() + ' extra steps' : 'no extra cardio required'), bg: '#FBF8F1' },
      { label: 'Daily deficit', value: totalDeficit.toLocaleString(), note: 'kcal · ' + Math.round(totalDeficit * 7).toLocaleString() + ' a week', bg: '#F6F1E6' },
      { label: 'Weeks to goal', value: weeksToGoal, note: 'at ' + pace.toFixed(2) + ' kg a week', bg: '#F8F3EC' },
      { label: 'Goal date', value: goalDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), note: conv(goal).toFixed(1) + ' ' + uLabel + ' · ' + goalDate.getFullYear(), bg: '#FBF8F1' },
    ],
    planCaution: pace >= 1
      ? '1 kg a week is about 1.4% of your bodyweight — sustainable for a four to six week block, not forever. Keep protein at ' + proteinG + ' g, lift three times a week, and if strength drops two sessions in a row or sleep goes under six hours, step down to 0.75 kg a week.'
      : '0.75 kg a week is roughly 1% of bodyweight — the sweet spot for holding onto muscle. If the 7-day trend stalls for two weeks, add 1,000 steps a day before cutting food further.',
    planMacros: [
      { label: 'Protein', value: proteinG + ' g', note: '2.0 g per kg — spread across four meals', color: '#A6B8AF', pct: 100 },
      { label: 'Carbohydrate', value: carbG + ' g', note: 'Most of it around training and shifts', color: '#D8BCA8', pct: 80 },
      { label: 'Fat', value: fatG + ' g', note: '0.8 g per kg — keeps hormones and mood steady', color: '#CDB88F', pct: 62 },
      { label: 'Fibre', value: '30 g', note: 'Volume food: it is what makes 1,500 kcal bearable', color: '#AAB8A3', pct: 55 },
    ].map((m) => ({
      label: m.label, value: m.value, note: m.note,
      barStyle: 'height:100%;width:' + m.pct + '%;border-radius:999px;background:' + m.color + ';transition:width 500ms cubic-bezier(.16,1,.3,1);',
    })),
    planWeek: [
      { day: 'Mon', session: 'Lower body strength', detail: 'Squat, hinge, calves · 45 min', tag: 'Lift', tagBg: '#F4EEE0', tagColor: '#8A7346' },
      { day: 'Tue', session: 'Walk + easy day', detail: (8000 + (moveDeficit > 0 ? extraSteps : 0)).toLocaleString() + ' steps target', tag: 'Move', tagBg: '#F8F3EC', tagColor: '#9C7F6A' },
      { day: 'Wed', session: 'Upper body strength', detail: 'Press, row, curls · 40 min', tag: 'Lift', tagBg: '#F4EEE0', tagColor: '#8A7346' },
      { day: 'Thu', session: 'Mobility or rest', detail: 'Hips and ankles · 20 min', tag: 'Easy', tagBg: '#F5F0E4', tagColor: '#8A7346' },
      { day: 'Fri', session: 'Full body strength', detail: 'Deadlift, push-ups, core · 45 min', tag: 'Lift', tagBg: '#F4EEE0', tagColor: '#8A7346' },
      { day: 'Sat', session: 'Long walk', detail: '60–75 min, conversational pace', tag: 'Move', tagBg: '#F8F3EC', tagColor: '#9C7F6A' },
      { day: 'Sun', session: 'Rest · weigh-in · prep', detail: 'Review the 7-day trend and cook for the week', tag: 'Reset', tagBg: '#EFF2EF', tagColor: '#8A9C93' },
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
  const ranges: Array<[string, string, number]> = [
    ['week', 'This week', 7],
    ['month', 'This month', 30],
    ['quarter', 'Last 3 months', 91],
    ['all', 'Since February', 3650],
  ];
  const active = ranges.find((r) => r[0] === (st.volRange || 'month'))!;
  const windowDays = active[2];

  const cutoff = Date.now() - windowDays * DAY;
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
    volTotal: total.toLocaleString(),
    volSub: active[1].toLowerCase() + ' · ' + perSession.toLocaleString() + ' kcal per session on average' +
      (inWindow.length ? '' : ' · estimated until Apple Health syncs'),
    animalCount: (count >= 100 ? Math.round(count).toLocaleString() : count.toFixed(1)) + '\u00d7',
    animalName: best.a.name,
    animalNote: best.a.one + ' \u2248 ' + best.a.kcal.toLocaleString() + ' kcal',
    animalUnitKg: best.a.kcal.toLocaleString(),
    animalUnits: Array.from({ length: units }, (_, i) => ({
      style: 'width:16px;height:16px;border-radius:6px;display:inline-block;background:' + (i % 2 ? '#D8BCA8' : '#DBC9A2') + ';opacity:' + (i < count ? 1 : 0.35) + ';',
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
        labelColor: isBest ? '#C2A87C' : '#9A9287',
        barStyle: 'height:100%;width:' + Math.min(100, (Math.log10(Math.max(1.02, c)) / Math.log10(Math.max(2, total / treats[0].kcal))) * 100).toFixed(0) + '%;border-radius:999px;background:' + (isBest ? '#C2A87C' : '#EBE1CC') + ';',
      };
    }),
  };
}

export type DailyLogVals = ReturnType<typeof deriveVals>;
