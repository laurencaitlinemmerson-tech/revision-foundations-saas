'use client';

import { useEffect, useMemo, useState } from 'react';

// Local-timezone YYYY-MM-DD. Avoids the UTC rollback bug where "today" reads
// as yesterday for users east of UTC after local midnight.
function localIsoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── types ──────────────────────────────────────────────────────────────────

interface ActivityMetrics {
  steps: number | null;
  activeEnergyKcal: number | null;
  exerciseMinutes: number | null;
  standHours: number | null;
  distanceKm: number | null;
}

interface HeartMetrics {
  restingHr: number | null;
  hrvMs: number | null;
  walkingHrAvg: number | null;
  vo2Max: number | null;
}

interface SleepMetrics {
  totalMin: number | null;
  inBedMin: number | null;
  remMin: number | null;
  deepMin: number | null;
  coreMin: number | null;
  awakeMin: number | null;
}

interface NutritionMetrics {
  dietaryEnergyKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  sugarG: number | null;
  waterMl: number | null;
}

interface DailyMetrics {
  date: string;
  activity: ActivityMetrics;
  heart: HeartMetrics;
  sleep: SleepMetrics;
  nutrition?: NutritionMetrics;
}

interface Workout {
  id: string;
  startedAt: string;
  endedAt: string | null;
  type: string | null;
  durationMin: number | null;
  energyKcal: number | null;
  avgHr: number | null;
  maxHr: number | null;
  distanceKm: number | null;
  source: string | null;
}

interface FitnessReadingLite {
  date: string;
  weight: number;
}

export type HealthStreamStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export interface HealthStreamFetch {
  status: HealthStreamStatus;
  errorMsg: string | null;
  days: DailyMetrics[];
  workouts: Workout[];
}

export type HealthSlot =
  | 'header'
  | 'readiness'
  | 'accountability'
  | 'promise'
  | 'todayStrip'
  | 'weekCompare'
  | 'mainGrid'
  | 'lifestyle'
  | 'compare'
  | 'prs'
  | 'correlations'
  | 'all';

// Hook that fetches the Apple Health stream once and exposes raw data.
// Parents can pass the returned object back into HealthMetricsSection so
// multiple slot-scoped renders share a single fetch.
export function useHealthStream(opPw: string): HealthStreamFetch {
  const [days, setDays] = useState<DailyMetrics[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [status, setStatus] = useState<HealthStreamStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!opPw) return;
    let cancelled = false;
    setStatus('loading');
    setErrorMsg(null);

    Promise.all([
      fetch('/api/operator/health?limit=180', { headers: { 'x-operator-pw': opPw } }).then((r) => r.json()),
      fetch('/api/operator/workouts?limit=100', { headers: { 'x-operator-pw': opPw } }).then((r) => r.json()),
    ])
      .then(([healthRes, workoutRes]) => {
        if (cancelled) return;
        if (healthRes?.setup_required) {
          setStatus('empty');
          return;
        }
        const fetchedDays: DailyMetrics[] = healthRes?.days ?? [];
        const fetchedWorkouts: Workout[] = workoutRes?.workouts ?? [];
        setDays(fetchedDays);
        setWorkouts(fetchedWorkouts);
        setStatus(fetchedDays.length === 0 && fetchedWorkouts.length === 0 ? 'empty' : 'ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : 'Failed to load health data');
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, [opPw]);

  return { status, errorMsg, days, workouts };
}

interface Props {
  opPw: string;
  readings: FitnessReadingLite[];
  /** Pre-fetched data — if provided, skip the internal fetch (so multiple slot renders share one fetch). */
  injected?: HealthStreamFetch;
  /** Render only this slot. 'all' (default) renders the legacy full section. */
  slot?: HealthSlot;
}

// ─── goal targets (sensible defaults) ───────────────────────────────────────

const GOALS = {
  steps: 10000,
  exerciseMinutes: 30,
  standHours: 12,
  sleepMinutes: 480,
  restingHrTarget: 60,
  calorieIntake: 1600,
  deficit: 1100,
  bmrHeightM: 1.5748,
  bmrAgeYears: 26,
} as const;

// Mifflin-St Jeor for women (matches existing dashboard defaults)
function estimateBMR(weightKg: number): number {
  const heightCm = GOALS.bmrHeightM * 100;
  return 10 * weightKg + 6.25 * heightCm - 5 * GOALS.bmrAgeYears - 161;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatMinutes(min: number | null): string {
  if (min === null || !Number.isFinite(min)) return '—';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtNum(value: number | null, digits = 0, suffix = ''): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return value.toFixed(digits) + suffix;
}

function fmtInt(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return Math.round(value).toLocaleString('en-GB');
}

function avg(values: (number | null)[]): number | null {
  const ns = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (ns.length === 0) return null;
  return ns.reduce((a, b) => a + b, 0) / ns.length;
}

function sum(values: (number | null)[]): number | null {
  const ns = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (ns.length === 0) return null;
  return ns.reduce((a, b) => a + b, 0);
}

function stddev(values: (number | null)[]): number | null {
  const ns = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (ns.length < 2) return null;
  const mean = ns.reduce((a, b) => a + b, 0) / ns.length;
  const variance = ns.reduce((a, b) => a + (b - mean) ** 2, 0) / ns.length;
  return Math.sqrt(variance);
}

// Streak of consecutive most-recent days where `pick(day) >= threshold`.
// Days are assumed chronological oldest → newest.
function trailingStreak(days: DailyMetrics[], pick: (d: DailyMetrics) => number | null, threshold: number): number {
  let n = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const v = pick(days[i]);
    if (v === null || !Number.isFinite(v) || v < threshold) break;
    n++;
  }
  return n;
}

function longestStreak(days: DailyMetrics[], pick: (d: DailyMetrics) => number | null, threshold: number): number {
  let best = 0;
  let cur = 0;
  for (const d of days) {
    const v = pick(d);
    if (v !== null && Number.isFinite(v) && v >= threshold) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}

function pearson(a: number[], b: number[]): number | null {
  const n = Math.min(a.length, b.length);
  if (n < 4) return null;
  let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
  for (let i = 0; i < n; i++) {
    sumA += a[i]; sumB += b[i];
    sumAB += a[i] * b[i];
    sumA2 += a[i] * a[i];
    sumB2 += b[i] * b[i];
  }
  const num = n * sumAB - sumA * sumB;
  const den = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));
  if (den === 0) return null;
  return num / den;
}

function deltaPill(current: number | null, baseline: number | null, options: { invert?: boolean; digits?: number; suffix?: string } = {}) {
  if (current === null || baseline === null || baseline === 0) {
    return { text: '—', tone: 'neutral' as const };
  }
  const diff = current - baseline;
  const pct = (diff / baseline) * 100;
  const sign = diff >= 0 ? '+' : '';
  const text = `${sign}${diff.toFixed(options.digits ?? 0)}${options.suffix ?? ''} · ${sign}${pct.toFixed(0)}%`;
  const positive = options.invert ? diff < 0 : diff > 0;
  const tone: 'good' | 'warn' | 'neutral' =
    Math.abs(pct) < 2 ? 'neutral' : positive ? 'good' : 'warn';
  return { text, tone };
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short' });
}

// ─── progress ring ───────────────────────────────────────────────────────────

function Ring({ value, goal, label, suffix = '', size = 92 }: { value: number | null; goal: number; label: string; suffix?: string; size?: number }) {
  const pct = value === null ? 0 : Math.min(1, value / goal);
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <div className="op-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--rule)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2}) scale(1,-1) translate(0,-${size})`}
        />
      </svg>
      <div className="op-ring-inner">
        <div className="op-ring-num">{value === null ? '—' : Math.round(value).toLocaleString('en-GB')}{suffix}</div>
        <div className="op-ring-lbl">{label}</div>
      </div>
    </div>
  );
}

// ─── mini bar chart ─────────────────────────────────────────────────────────

function BarChart({ values, labels, height = 72, format }: { values: (number | null)[]; labels: string[]; height?: number; format?: (v: number) => string }) {
  const nums = values.map((v) => (v === null || !Number.isFinite(v) ? 0 : v));
  const max = Math.max(...nums, 1);
  return (
    <div className="op-bars" style={{ height }}>
      {nums.map((v, i) => {
        const pct = (v / max) * 100;
        const isLast = i === nums.length - 1;
        return (
          <div key={i} className="op-bar-col">
            <div
              className={`op-bar ${isLast ? 'is-today' : ''}`}
              style={{ height: `${pct}%` }}
              title={`${labels[i]}: ${format ? format(v) : v}`}
            />
            <div className="op-bar-lbl">{labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── line chart (mini) ──────────────────────────────────────────────────────

function LineMini({ values, height = 68, width = 280 }: { values: (number | null)[]; height?: number; width?: number }) {
  const nums = values.map((v) => (v === null || !Number.isFinite(v) ? null : v));
  const valid = nums.filter((v): v is number => v !== null);
  if (valid.length < 2) return <svg width={width} height={height} aria-hidden="true" />;
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  const step = width / Math.max(nums.length - 1, 1);
  let path = '';
  nums.forEach((v, i) => {
    if (v === null) return;
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    path += (path === '' ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`);
  });
  const lastIdx = nums.length - 1;
  const lastVal = nums[lastIdx];
  const lastX = lastIdx * step;
  const lastY = lastVal !== null ? height - ((lastVal - min) / range) * (height - 4) - 2 : null;
  return (
    <svg width={width} height={height} aria-hidden="true" className="op-line-mini">
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.25} />
      {lastY !== null && (
        <circle cx={lastX} cy={lastY} r={2.5} fill="currentColor" />
      )}
    </svg>
  );
}

// ─── sleep night bars ────────────────────────────────────────────────────────

function SleepNights({ days }: { days: DailyMetrics[] }) {
  const nights = days.slice(-7);
  const maxMin = Math.max(
    ...nights.map((d) => (d.sleep.deepMin ?? 0) + (d.sleep.remMin ?? 0) + (d.sleep.coreMin ?? 0) + (d.sleep.awakeMin ?? 0)),
    1
  );
  return (
    <div className="op-sleep-week">
      {nights.map((d, i) => {
        const total = (d.sleep.deepMin ?? 0) + (d.sleep.remMin ?? 0) + (d.sleep.coreMin ?? 0) + (d.sleep.awakeMin ?? 0);
        const scale = total / maxMin;
        const segs = [
          { key: 'deep', value: d.sleep.deepMin ?? 0, color: '#3a4a6b' },
          { key: 'core', value: d.sleep.coreMin ?? 0, color: '#a8b3c5' },
          { key: 'rem', value: d.sleep.remMin ?? 0, color: '#6b7a99' },
          { key: 'awake', value: d.sleep.awakeMin ?? 0, color: '#e6c0d5' },
        ];
        const isLast = i === nights.length - 1;
        return (
          <div key={d.date} className="op-sleep-night">
            <div className="op-sleep-stack" style={{ height: `${Math.max(scale * 100, 4)}%` }} title={`${d.date}: ${formatMinutes(d.sleep.totalMin)}`}>
              {segs.map((s) => {
                const pct = total > 0 ? (s.value / total) * 100 : 0;
                if (pct === 0) return null;
                return <span key={s.key} className="op-sleep-stack-seg" style={{ height: `${pct}%`, background: s.color }} />;
              })}
            </div>
            <div className={`op-sleep-night-lbl ${isLast ? 'is-today' : ''}`}>{shortDate(d.date)}</div>
            <div className="op-sleep-night-val">{formatMinutes(d.sleep.totalMin)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── correlations narrative ─────────────────────────────────────────────────

function describeCorrelation(r: number | null, positiveCopy: string, inverseCopy: string): { text: string; tone: 'good' | 'warn' | 'neutral' } {
  if (r === null) return { text: 'Not enough overlapping data yet', tone: 'neutral' };
  const abs = Math.abs(r);
  const strength = abs < 0.2 ? 'no clear' : abs < 0.4 ? 'a slight' : abs < 0.7 ? 'a moderate' : 'a strong';
  const direction = r >= 0 ? positiveCopy : inverseCopy;
  return {
    text: `${direction} (r = ${r.toFixed(2)} · ${strength})`,
    tone: abs < 0.2 ? 'neutral' : abs < 0.4 ? 'neutral' : 'good',
  };
}

// ─── component ──────────────────────────────────────────────────────────────

export default function HealthMetricsSection({ opPw, readings, injected, slot = 'all' }: Props) {
  const internal = useHealthStream(injected ? '' : opPw);
  const { status, errorMsg, days, workouts } = injected ?? internal;

  const last7 = useMemo(() => days.slice(-7), [days]);
  const last14 = useMemo(() => days.slice(-14), [days]);
  const last30 = useMemo(() => days.slice(-30), [days]);
  const latest = days[days.length - 1] ?? null;
  const previousNight = days[days.length - 2] ?? null;
  const currentDayIso = localIsoDate();
  const latestDayIso = latest?.date ? latest.date.slice(0, 10) : null;
  const latestIsToday = latestDayIso === currentDayIso;
  const healthHeadline = latestIsToday ? 'Today, in body and motion' : 'Latest body and motion';

  // 7-day averages
  const stepsAvg7 = avg(last7.map((d) => d.activity.steps));
  const exerciseAvg7 = avg(last7.map((d) => d.activity.exerciseMinutes));
  const restingHrAvg7 = avg(last7.map((d) => d.heart.restingHr));
  const hrvAvg7 = avg(last7.map((d) => d.heart.hrvMs));
  const sleepAvg7 = avg(last7.map((d) => d.sleep.totalMin));

  // Today vs baseline
  const stepsDelta = deltaPill(latest?.activity.steps ?? null, stepsAvg7);
  const exerciseDelta = deltaPill(latest?.activity.exerciseMinutes ?? null, exerciseAvg7, { suffix: ' min' });
  const rhrDelta = deltaPill(latest?.heart.restingHr ?? null, restingHrAvg7, { invert: true, suffix: ' bpm' });
  const hrvDelta = deltaPill(latest?.heart.hrvMs ?? null, hrvAvg7, { suffix: ' ms' });
  const sleepDelta = deltaPill(latest?.sleep.totalMin ?? null, sleepAvg7, { suffix: 'm' });

  // 14-day step labels and values
  const stepBars = last14.map((d) => d.activity.steps);
  const stepLabels = last14.map((d) => shortDate(d.date).charAt(0));

  // ── Nutrition: net / deficit context ────────────────────────────────────
  const latestWeight = readings.length > 0 ? readings[readings.length - 1].weight : null;
  const bmr = latestWeight !== null ? estimateBMR(latestWeight) : null;

  function netForDay(d: DailyMetrics | null): number | null {
    if (!d || bmr === null) return null;
    const kIn = d.nutrition?.dietaryEnergyKcal ?? null;
    const kActive = d.activity.activeEnergyKcal ?? 0;
    if (kIn === null) return null;
    return kIn - (bmr + kActive);
  }

  const netToday = netForDay(latest);
  const targetNet = -GOALS.deficit;
  const nets7 = last7.map(netForDay);
  const avgNet7 = avg(nets7);
  const deficitToday = netToday !== null ? Math.max(0, -netToday) : null;
  const deficitAvg7 = avgNet7 !== null ? Math.max(0, -avgNet7) : null;
  const hasNutritionData = days.some((d) => (d.nutrition?.dietaryEnergyKcal ?? null) !== null);
  const deficitDelta = (() => {
    if (netToday === null) {
      return { text: 'Food log not synced yet', tone: 'neutral' as const };
    }
    if (netToday > 0) {
      return { text: `In surplus by ${Math.round(netToday)} kcal`, tone: 'warn' as const };
    }
    if (deficitToday !== null && deficitToday >= GOALS.deficit) {
      const extra = Math.round(deficitToday - GOALS.deficit);
      return { text: extra > 0 ? `${extra} kcal past target` : 'Target met', tone: 'good' as const };
    }
    return {
      text: `${Math.round(GOALS.deficit - (deficitToday ?? 0))} kcal short of target`,
      tone: 'warn' as const,
    };
  })();

  // ── Readiness score (composite, 0–100) ───────────────────────────────────
  // Compares last-night sleep, last HRV and last RHR against 14-day baselines.
  // Each axis can earn up to ~33 points. Missing axes are skipped, score rescaled.
  const baselineWindow = useMemo(() => days.slice(-15, -1), [days]); // exclude today
  const sleepBaseline = avg(baselineWindow.map((d) => d.sleep.totalMin));
  const hrvBaseline = avg(baselineWindow.map((d) => d.heart.hrvMs));
  const rhrBaseline = avg(baselineWindow.map((d) => d.heart.restingHr));

  function readinessAxis(current: number | null, baseline: number | null, invert = false): number | null {
    if (current === null || baseline === null || baseline === 0) return null;
    const ratio = invert ? baseline / current : current / baseline;
    // 1.0 = on baseline → ~85 points. 1.15 = strongly above → ~100. 0.7 = poor → ~0.
    const score = (ratio - 0.7) / 0.45;
    return Math.max(0, Math.min(1, score)) * 100;
  }

  // Weighted composite: sleep matters most, then autonomic signals (HRV / RHR),
  // then training load and yesterday's alcohol as small modifiers.
  const trainingLoad7d = last7.reduce((s, d) => s + (d.activity.exerciseMinutes ?? 0), 0);
  // Sweet spot ~150–300 min/week; below or above pushes the score down.
  const loadScore = trainingLoad7d === 0
    ? null
    : trainingLoad7d < 60 ? 55
    : trainingLoad7d < 150 ? 80
    : trainingLoad7d <= 300 ? 95
    : trainingLoad7d <= 450 ? 70
    : 45;
  const readinessAxes: { key: string; label: string; weight: number; score: number | null }[] = [
    { key: 'sleep', label: 'Sleep', weight: 0.35, score: readinessAxis(latest?.sleep.totalMin ?? null, sleepBaseline) },
    { key: 'hrv', label: 'HRV', weight: 0.25, score: readinessAxis(latest?.heart.hrvMs ?? null, hrvBaseline) },
    { key: 'rhr', label: 'RHR', weight: 0.25, score: readinessAxis(latest?.heart.restingHr ?? null, rhrBaseline, true) },
    { key: 'load', label: 'Load', weight: 0.15, score: loadScore },
  ];
  const readinessScore = (() => {
    const present = readinessAxes.filter((a) => a.score !== null);
    if (present.length === 0) return null;
    const wSum = present.reduce((s, a) => s + a.weight, 0);
    const wScore = present.reduce((s, a) => s + (a.score as number) * a.weight, 0);
    return Math.round(wScore / wSum);
  })();
  const readinessTone: 'good' | 'warn' | 'neutral' =
    readinessScore === null ? 'neutral'
    : readinessScore >= 70 ? 'good'
    : readinessScore >= 45 ? 'neutral'
    : 'warn';
  const readinessVerdict =
    readinessScore === null ? 'Awaiting more baseline data'
    : readinessScore >= 75 ? 'Green — push day available'
    : readinessScore >= 55 ? 'Amber — steady aerobic only'
    : readinessScore >= 35 ? 'Amber — recover before pushing'
    : 'Red — rest, light movement, hydrate';

  // Recovery caution: poor sleep + elevated RHR + suppressed HRV together is
  // the cluster worth surfacing. All three must be present and red.
  const recoveryCaution = (() => {
    const sleepNow = latest?.sleep.totalMin ?? null;
    const rhrNow = latest?.heart.restingHr ?? null;
    const hrvNow = latest?.heart.hrvMs ?? null;
    if (sleepNow === null || rhrNow === null || hrvNow === null) return null;
    if (rhrBaseline === null || hrvBaseline === null) return null;
    const sleepPoor = sleepNow < 360; // <6h
    const rhrElevated = rhrNow > rhrBaseline + 5;
    const hrvSuppressed = hrvNow < hrvBaseline * 0.9;
    if (sleepPoor && rhrElevated && hrvSuppressed) {
      return {
        title: 'Recovery caution',
        body: `Sleep ${formatMinutes(sleepNow)} (under 6h), RHR ${Math.round(rhrNow)} bpm (above your baseline) and HRV ${Math.round(hrvNow)} ms (suppressed). Lower intensity today and prioritise tonight's sleep.`,
      };
    }
    return null;
  })();

  // ── This week vs last week ───────────────────────────────────────────────
  const thisWeek = useMemo(() => days.slice(-7), [days]);
  const lastWeek = useMemo(() => days.slice(-14, -7), [days]);
  function weeklySum(window: DailyMetrics[], pick: (d: DailyMetrics) => number | null): number | null {
    return sum(window.map(pick));
  }
  const weeklyDeltas = [
    {
      label: 'Steps',
      now: weeklySum(thisWeek, (d) => d.activity.steps),
      prev: weeklySum(lastWeek, (d) => d.activity.steps),
      fmt: (v: number | null) => fmtInt(v),
    },
    {
      label: 'Exercise',
      now: weeklySum(thisWeek, (d) => d.activity.exerciseMinutes),
      prev: weeklySum(lastWeek, (d) => d.activity.exerciseMinutes),
      fmt: (v: number | null) => fmtNum(v, 0, ' min'),
    },
    {
      label: 'Active kcal',
      now: weeklySum(thisWeek, (d) => d.activity.activeEnergyKcal),
      prev: weeklySum(lastWeek, (d) => d.activity.activeEnergyKcal),
      fmt: (v: number | null) => fmtInt(v),
    },
    {
      label: 'Sleep avg',
      now: avg(thisWeek.map((d) => d.sleep.totalMin)),
      prev: avg(lastWeek.map((d) => d.sleep.totalMin)),
      fmt: (v: number | null) => formatMinutes(v),
    },
  ];

  // ── Streaks ─────────────────────────────────────────────────────────────
  const stepsStreak = trailingStreak(days, (d) => d.activity.steps, 7000);
  const exerciseStreak = trailingStreak(days, (d) => d.activity.exerciseMinutes, GOALS.exerciseMinutes);
  const stepsStreakBest = longestStreak(last30, (d) => d.activity.steps, 7000);

  // ── Sleep consistency (last 14 nights) ──────────────────────────────────
  const sleepStdMin = stddev(last14.map((d) => d.sleep.totalMin));
  const sleepConsistencyLabel =
    sleepStdMin === null ? '—'
    : sleepStdMin < 30 ? 'Tight'
    : sleepStdMin < 60 ? 'Steady'
    : sleepStdMin < 90 ? 'Variable'
    : 'Erratic';

  // ── 28-day step heatmap ─────────────────────────────────────────────────
  const heatmapDays = useMemo(() => days.slice(-28), [days]);

  // ── Personal records (all-time, from current data window) ───────────────
  const records = useMemo(() => {
    function findMax(pick: (d: DailyMetrics) => number | null): { value: number | null; date: string | null } {
      let best: number | null = null;
      let bestDate: string | null = null;
      for (const d of days) {
        const v = pick(d);
        if (v !== null && Number.isFinite(v) && (best === null || v > best)) { best = v; bestDate = d.date; }
      }
      return { value: best, date: bestDate };
    }
    function findMin(pick: (d: DailyMetrics) => number | null): { value: number | null; date: string | null } {
      let best: number | null = null;
      let bestDate: string | null = null;
      for (const d of days) {
        const v = pick(d);
        if (v !== null && Number.isFinite(v) && (best === null || v < best)) { best = v; bestDate = d.date; }
      }
      return { value: best, date: bestDate };
    }
    const lightestWeight = readings.reduce<{ weight: number; date: string } | null>((acc, r) => {
      if (!acc || r.weight < acc.weight) return { weight: r.weight, date: r.date };
      return acc;
    }, null);
    return {
      steps: findMax((d) => d.activity.steps),
      exercise: findMax((d) => d.activity.exerciseMinutes),
      sleep: findMax((d) => d.sleep.totalMin),
      hrv: findMax((d) => d.heart.hrvMs),
      rhr: findMin((d) => d.heart.restingHr),
      weight: lightestWeight,
    };
  }, [days, readings]);

  // ── Compare panel (now vs 30/90/180 days back) ─────────────────────────
  const compareWindows = useMemo(() => {
    function findClosest(targetDays: number): DailyMetrics | null {
      if (days.length === 0) return null;
      const latestDate = new Date(days[days.length - 1].date).getTime();
      const targetDate = latestDate - targetDays * 86400000;
      let best: DailyMetrics | null = null;
      let bestDiff = Infinity;
      for (const d of days) {
        const diff = Math.abs(new Date(d.date).getTime() - targetDate);
        if (diff < bestDiff) { bestDiff = diff; best = d; }
      }
      // Only return if within ±5 days of the target.
      return bestDiff <= 5 * 86400000 ? best : null;
    }
    function findWeightClosest(targetDays: number): { weight: number; date: string } | null {
      if (readings.length === 0) return null;
      const latestDate = new Date(readings[readings.length - 1].date).getTime();
      const targetDate = latestDate - targetDays * 86400000;
      let best: { weight: number; date: string } | null = null;
      let bestDiff = Infinity;
      for (const r of readings) {
        const diff = Math.abs(new Date(r.date).getTime() - targetDate);
        if (diff < bestDiff) { bestDiff = diff; best = r; }
      }
      return bestDiff <= 14 * 86400000 ? best : null;
    }
    return [30, 90, 180].map((n) => ({
      days: n,
      health: findClosest(n),
      weight: findWeightClosest(n),
    }));
  }, [days, readings]);

  // ── Lifestyle inputs (water from health stream + caffeine/alcohol local) ─
  const LIFESTYLE_KEY = 'op-fitness-lifestyle-v1';
  interface LifestyleEntry { date: string; caffeine?: number; alcohol?: number; water?: number }
  const [lifestyle, setLifestyle] = useState<Record<string, { caffeine?: number; alcohol?: number; water?: number }>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIFESTYLE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LifestyleEntry[];
        const map: Record<string, { caffeine?: number; alcohol?: number; water?: number }> = {};
        for (const p of parsed) map[p.date] = { caffeine: p.caffeine, alcohol: p.alcohol, water: p.water };
        setLifestyle(map);
      }
    } catch { /* ignore */ }
  }, []);
  function bumpLifestyle(date: string, field: 'caffeine' | 'alcohol' | 'water', delta: number) {
    setLifestyle((prev) => {
      const cur = prev[date] ?? {};
      const nextVal = Math.max(0, (cur[field] ?? 0) + delta);
      const next = { ...prev, [date]: { ...cur, [field]: nextVal } };
      try {
        const list: LifestyleEntry[] = Object.entries(next).map(([d, v]) => ({ date: d, ...v }));
        localStorage.setItem(LIFESTYLE_KEY, JSON.stringify(list));
      } catch { /* ignore */ }
      return next;
    });
  }
  function lifestyleStrip(field: 'caffeine' | 'alcohol' | 'water'): (number | null)[] {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const out: (number | null)[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      if (field === 'water') {
        // Water can also come from health.nutrition.waterMl (cups ≈ 250ml).
        const local = lifestyle[iso]?.water;
        const fromHealth = days.find((row) => row.date.slice(0, 10) === iso)?.nutrition?.waterMl;
        const cups = local ?? (fromHealth ? Math.round(fromHealth / 250) : null);
        out.push(cups);
      } else {
        out.push(lifestyle[iso]?.[field] ?? null);
      }
    }
    return out;
  }
  const todayLifestyleIso = localIsoDate();
  const todayWater = lifestyle[todayLifestyleIso]?.water ?? (latest?.nutrition?.waterMl ? Math.round(latest.nutrition.waterMl / 250) : 0);
  const todayCaffeine = lifestyle[todayLifestyleIso]?.caffeine ?? 0;
  const todayAlcohol = lifestyle[todayLifestyleIso]?.alcohol ?? 0;

  // Yesterday's lifestyle → today's signals. Only emit a row when both sides
  // exist; otherwise the strip stays quiet.
  const yesterdayLifestyleDate = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return localIsoDate(d);
  })();
  const yesterdayCaffeine = lifestyle[yesterdayLifestyleDate]?.caffeine ?? null;
  const yesterdayAlcoholForCausal = lifestyle[yesterdayLifestyleDate]?.alcohol ?? null;
  const yesterdayWater = lifestyle[yesterdayLifestyleDate]?.water ?? null;
  type CausalRow = { input: string; outcome: string; tone: 'good' | 'warn' | 'neutral' };
  const lifestyleCausalRows: CausalRow[] = [];
  if (yesterdayCaffeine !== null && yesterdayCaffeine > 0 && latest?.heart.hrvMs !== null && latest?.heart.hrvMs !== undefined && hrvAvg7 !== null) {
    const diff = (latest.heart.hrvMs as number) - hrvAvg7;
    lifestyleCausalRows.push({
      input: `Caffeine ${yesterdayCaffeine} ${yesterdayCaffeine === 1 ? 'cup' : 'cups'} yesterday`,
      outcome: `Today HRV ${diff >= 0 ? '+' : ''}${Math.round(diff)} ms vs 7-day avg`,
      tone: diff < -5 ? 'warn' : diff > 5 ? 'good' : 'neutral',
    });
  }
  if (yesterdayAlcoholForCausal !== null && yesterdayAlcoholForCausal > 0 && latest?.heart.restingHr !== null && latest?.heart.restingHr !== undefined && restingHrAvg7 !== null) {
    const diff = (latest.heart.restingHr as number) - restingHrAvg7;
    lifestyleCausalRows.push({
      input: `Alcohol ${yesterdayAlcoholForCausal} ${yesterdayAlcoholForCausal === 1 ? 'unit' : 'units'} yesterday`,
      outcome: `Today RHR ${diff >= 0 ? '+' : ''}${Math.round(diff)} bpm vs 7-day avg`,
      tone: diff > 3 ? 'warn' : diff < -3 ? 'good' : 'neutral',
    });
  }
  if (yesterdayWater !== null && yesterdayWater > 0 && latest?.activity.exerciseMinutes !== null && latest?.activity.exerciseMinutes !== undefined && exerciseAvg7 !== null) {
    const diff = (latest.activity.exerciseMinutes as number) - exerciseAvg7;
    lifestyleCausalRows.push({
      input: `Water ${yesterdayWater} cups yesterday`,
      outcome: `Today exercise ${diff >= 0 ? '+' : ''}${Math.round(diff)} min vs 7-day avg`,
      tone: diff > 5 ? 'good' : diff < -10 ? 'warn' : 'neutral',
    });
  }


  // ── Today's one move (single named action) ──────────────────────────────
  const todayHour = new Date().getHours();
  const stepsToday = latest?.activity.steps ?? null;
  const exerciseToday = latest?.activity.exerciseMinutes ?? null;
  const sleepShortfall =
    latest?.sleep.totalMin && sleepBaseline ? sleepBaseline - latest.sleep.totalMin : null;
  const oneMove = (() => {
    if (readinessScore !== null && readinessScore < 40) {
      return {
        action: <>Rest day. <em>15-min walk and 8h sleep target.</em></>,
        reason: 'Readiness is low — pushing today costs more than it earns. Light movement keeps the streak alive without taxing recovery.',
        meta: [['Aim', '15 min walk'], ['Then', 'Wind down by 22:00']],
      };
    }
    if (sleepShortfall !== null && sleepShortfall > 60) {
      return {
        action: <>Short walk now, <em>early wind-down tonight.</em></>,
        reason: `Last night was ${Math.round(sleepShortfall)} min below your 14-day average. Tonight's sleep matters more than today's workout.`,
        meta: [['Aim', '20 min walk'], ['Sleep target', '8h']],
      };
    }
    if (netToday !== null && netToday > 200 && hasNutritionData) {
      return {
        action: <>Walk after dinner. <em>Aim to close on a small deficit.</em></>,
        reason: `Net energy is +${Math.round(netToday)} kcal so far today. A 30-minute walk plus protein-led dinner gets you back to a clean deficit.`,
        meta: [['Walk', '30 min'], ['Dinner', 'Protein-led']],
      };
    }
    if (exerciseStreak >= 4 && readinessScore !== null && readinessScore >= 70) {
      return {
        action: <>Push day available — <em>pick the session you've been avoiding.</em></>,
        reason: `Readiness is green (${readinessScore}) and you're ${exerciseStreak} days into an exercise streak. This is the day to bank a harder session.`,
        meta: [['Aim', '45–60 min'], ['Intensity', 'Zone 3–4']],
      };
    }
    if (stepsToday !== null && stepsToday < 5000 && todayHour >= 17) {
      return {
        action: <>20-minute walk after dinner. <em>Closes the Exercise ring.</em></>,
        reason: `You're at ${fmtInt(stepsToday)} steps with an hour or two of light left. A short loop now lifts your 7-day cadence without taxing tomorrow.`,
        meta: [['Walk', '20 min'], ['Steps target', '7k+']],
      };
    }
    if (exerciseToday !== null && exerciseToday >= GOALS.exerciseMinutes) {
      return {
        action: <>Exercise ring closed — <em>protect tonight's sleep.</em></>,
        reason: `Movement is done for the day. Lights low by 21:30, screens off 30 min before bed protects HRV gains.`,
        meta: [['Sleep target', '8h'], ['Wind-down', '21:30']],
      };
    }
    return {
      action: <>20-minute brisk walk <em>after dinner.</em></>,
      reason: 'A daily walk is the highest-leverage move on your current data — it lifts steps, exercise minutes and active kcal in one go, and protects sleep.',
      meta: [['Walk', '20 min'], ['Steps target', '7k+']],
    };
  })();

  // ── Drift detector (3-day off-target signal) ────────────────────────────
  const last3Nets = nets7.slice(-3);
  const driftNet = avg(last3Nets);
  const last3Steps = avg(last7.slice(-3).map((d) => d.activity.steps));
  const prior7Steps = avg(last7.slice(0, 4).map((d) => d.activity.steps));
  const stepsDriftPct =
    last3Steps !== null && prior7Steps !== null && prior7Steps !== 0
      ? ((last3Steps - prior7Steps) / prior7Steps) * 100
      : null;

  const driftCard = (() => {
    if (driftNet !== null && driftNet > 200 && hasNutritionData) {
      return {
        tone: 'warn' as const,
        headline: `Nutrition net has drifted +${Math.round(driftNet)} kcal for 3 days.`,
        body: 'No drama — but if this continues another week the trend line flattens. One reset day usually settles it.',
        signals: [
          ['3-day avg net', `+${Math.round(driftNet)} kcal`, 'warn' as const],
          ['Target net', `${targetNet} kcal`, 'neutral' as const],
        ],
      };
    }
    if (stepsDriftPct !== null && stepsDriftPct < -20) {
      return {
        tone: 'warn' as const,
        headline: `Steps are down ${Math.abs(Math.round(stepsDriftPct))}% on the last 3 days.`,
        body: 'Often a busy-week signal more than a motivation one. A single 30-min walk tomorrow usually corrects it.',
        signals: [
          ['Last 3 days avg', `${fmtInt(last3Steps)} steps`, 'warn' as const],
          ['Earlier this week', `${fmtInt(prior7Steps)} steps`, 'neutral' as const],
        ],
      };
    }
    if (exerciseStreak === 0 && days.length >= 3) {
      return {
        tone: 'neutral' as const,
        headline: 'Exercise streak paused.',
        body: 'No streak this week — that\'s fine. The data shows you start streaks within 1–2 days of a walk. Today\'s a good day for that walk.',
        signals: [
          ['Steps today', fmtInt(stepsToday), 'neutral' as const],
          ['Exercise mins today', fmtInt(exerciseToday), 'neutral' as const],
        ],
      };
    }
    return {
      tone: 'good' as const,
      headline: 'No drift signals.',
      body: 'Nutrition, steps and exercise are tracking with your recent baseline. Keep the cadence light.',
      signals: [
        ['3-day avg net', driftNet !== null ? `${driftNet >= 0 ? '+' : ''}${Math.round(driftNet)} kcal` : '—', 'good' as const],
        ['Steps trend (3d)', stepsDriftPct !== null ? `${stepsDriftPct >= 0 ? '+' : ''}${stepsDriftPct.toFixed(0)}%` : '—', 'good' as const],
      ],
    };
  })();

  // ── Promise ledger (localStorage) ───────────────────────────────────────
  const PROMISE_KEY = 'op-fitness-promises-v1';
  type PromiseKind = 'walk' | 'workout' | 'rest' | 'stretch';
  interface PromiseEntry { date: string; promise: PromiseKind }
  const [promises, setPromises] = useState<Record<string, PromiseKind>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROMISE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PromiseEntry[];
        const map: Record<string, PromiseKind> = {};
        for (const p of parsed) map[p.date] = p.promise;
        setPromises(map);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function setPromiseFor(date: string, kind: PromiseKind | null) {
    setPromises((prev) => {
      const next = { ...prev };
      if (kind === null) delete next[date]; else next[date] = kind;
      try {
        const list: PromiseEntry[] = Object.entries(next).map(([d, p]) => ({ date: d, promise: p }));
        localStorage.setItem(PROMISE_KEY, JSON.stringify(list));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function evaluatePromise(date: string, kind: PromiseKind): 'kept' | 'missed' | 'pending' {
    if (date === localIsoDate()) return 'pending';
    const d = days.find((row) => row.date.slice(0, 10) === date);
    if (!d) return 'pending';
    if (kind === 'rest') return 'kept';
    if (kind === 'stretch') return 'kept'; // honour-system
    if (kind === 'walk') {
      const ok = (d.activity.steps ?? 0) >= 7000 || (d.activity.exerciseMinutes ?? 0) >= 15;
      return ok ? 'kept' : 'missed';
    }
    if (kind === 'workout') {
      const hasWorkout = workouts.some((w) => w.startedAt.slice(0, 10) === date);
      return hasWorkout ? 'kept' : 'missed';
    }
    return 'pending';
  }

  const promiseLedger = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rows: Array<{
      date: string; dow: string; promise: PromiseKind | null; status: 'kept' | 'missed' | 'pending' | 'empty';
      stepsVal: number | null;
    }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const promise = promises[iso] ?? null;
      const dayData = days.find((row) => row.date.slice(0, 10) === iso) ?? null;
      const status: 'kept' | 'missed' | 'pending' | 'empty' = promise ? evaluatePromise(iso, promise) : 'empty';
      rows.push({
        date: iso,
        dow: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        promise,
        status,
        stepsVal: dayData?.activity.steps ?? null,
      });
    }
    return rows;
  }, [promises, days, workouts]);

  const keptCount = promiseLedger.filter((r) => r.status === 'kept').length;
  const setCount = promiseLedger.filter((r) => r.promise !== null).length;
  const todayIso = localIsoDate();
  const todayPromise = promises[todayIso] ?? null;


  // ── Weight insight (plain-English summary) ───────────────────────────────
  const weightInsight = useMemo(() => {
    if (readings.length === 0) return null;
    const latestReading = readings[readings.length - 1];
    const latestKg = latestReading.weight;
    const latestMs = new Date(latestReading.date).getTime();
    const findNearest = (daysBack: number) => {
      const target = latestMs - daysBack * 86400000;
      let best: { weight: number; date: string; diff: number } | null = null;
      for (const r of readings) {
        const t = new Date(r.date).getTime();
        if (t > latestMs - 86400000) continue; // exclude same-day
        const diff = Math.abs(t - target);
        if (best === null || diff < best.diff) best = { weight: r.weight, date: r.date, diff };
      }
      return best && best.diff <= daysBack * 86400000 + 3 * 86400000 ? best : null;
    };
    const week = findNearest(7);
    const month = findNearest(30);
    const delta7 = week ? +(latestKg - week.weight).toFixed(2) : null;
    const delta30 = month ? +(latestKg - month.weight).toFixed(2) : null;
    // Linear fit on last 28 days for the trend rate.
    const cutoff = latestMs - 28 * 86400000;
    const window = readings
      .filter((r) => new Date(r.date).getTime() >= cutoff)
      .map((r) => ({ x: (new Date(r.date).getTime() - cutoff) / 86400000, y: r.weight }));
    let ratePerWeek: number | null = null;
    if (window.length >= 3) {
      const n = window.length;
      const sumX = window.reduce((s, p) => s + p.x, 0);
      const sumY = window.reduce((s, p) => s + p.y, 0);
      const sumXY = window.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = window.reduce((s, p) => s + p.x * p.x, 0);
      const denom = n * sumX2 - sumX * sumX;
      if (denom !== 0) {
        const slope = (n * sumXY - sumX * sumY) / denom;
        ratePerWeek = +(slope * 7).toFixed(2);
      }
    }
    const direction = ratePerWeek === null ? 'unknown'
      : ratePerWeek < -0.25 ? 'losing'
      : ratePerWeek < -0.05 ? 'losing-slow'
      : ratePerWeek <= 0.05 ? 'stable'
      : 'gaining';
    const tone: 'good' | 'warn' | 'neutral' =
      direction === 'losing' || direction === 'losing-slow' ? 'good'
      : direction === 'stable' ? 'neutral'
      : direction === 'gaining' ? 'warn'
      : 'neutral';
    const headline = direction === 'losing' ? 'Losing.'
      : direction === 'losing-slow' ? 'Losing slowly.'
      : direction === 'stable' ? 'Holding steady.'
      : direction === 'gaining' ? 'Drifting up.'
      : 'Not enough data yet.';
    const summary = (() => {
      if (direction === 'unknown') return 'Log a few weigh-ins across the next two weeks to surface a real trend line.';
      const rateLabel = ratePerWeek === null ? '' : `${ratePerWeek >= 0 ? '+' : ''}${ratePerWeek} kg/wk`;
      const monthLabel = delta30 === null ? '' : `${delta30 >= 0 ? '+' : ''}${delta30.toFixed(1)} kg over 30 days`;
      if (direction === 'losing') return `${monthLabel} at ${rateLabel}. Faster than the current -1.0 kg/wk target — keep an eye on energy and protein.`;
      if (direction === 'losing-slow') return `${monthLabel} at ${rateLabel}. Slower than the current -1.0 kg/wk target — consistent with maintenance plus a smaller-than-planned deficit.`;
      if (direction === 'stable') return `${monthLabel} at ${rateLabel}. The line is essentially flat — either pace is matching intake, or the deficit isn't landing.`;
      return `${monthLabel} at ${rateLabel}. The line is drifting up — worth checking food log, alcohol and step volume.`;
    })();
    return { latestKg, delta7, delta30, ratePerWeek, direction, tone, headline, summary };
  }, [readings]);

  // ── Data quality snapshot ────────────────────────────────────────────────
  const dataQuality = useMemo(() => {
    const weighInLast30 = readings.filter((r) => {
      const t = new Date(r.date).getTime();
      return t >= Date.now() - 30 * 86400000;
    }).length;
    const healthDaysLast14 = last14.filter((d) => d.sleep.totalMin !== null || d.heart.restingHr !== null || d.activity.steps !== null).length;
    const presentMetrics: string[] = [];
    if (last14.some((d) => d.sleep.totalMin !== null)) presentMetrics.push('sleep');
    if (last14.some((d) => d.heart.hrvMs !== null)) presentMetrics.push('HRV');
    if (last14.some((d) => d.heart.restingHr !== null)) presentMetrics.push('RHR');
    if (last14.some((d) => d.activity.steps !== null)) presentMetrics.push('steps');
    if (last14.some((d) => d.activity.exerciseMinutes !== null)) presentMetrics.push('exercise');
    if (last14.some((d) => (d.nutrition?.dietaryEnergyKcal ?? null) !== null)) presentMetrics.push('nutrition');
    const missingMetrics: string[] = [];
    if (!last14.some((d) => d.sleep.totalMin !== null)) missingMetrics.push('sleep');
    if (!last14.some((d) => d.heart.hrvMs !== null)) missingMetrics.push('HRV');
    if (!last14.some((d) => d.heart.restingHr !== null)) missingMetrics.push('RHR');
    if (!last14.some((d) => (d.nutrition?.dietaryEnergyKcal ?? null) !== null)) missingMetrics.push('nutrition');
    const overlapDays = last30.filter((d) => {
      const iso = d.date.slice(0, 10);
      const hasReading = readings.some((r) => r.date.slice(0, 10) === iso);
      return hasReading && d.sleep.totalMin !== null && d.heart.hrvMs !== null;
    }).length;
    return { weighInLast30, healthDaysLast14, presentMetrics, missingMetrics, overlapDays };
  }, [readings, last14, last30]);

  // Correlations (30 days)
  const correlations = useMemo(() => {
    const sleepNights: number[] = [];
    const nextHrv: number[] = [];
    for (let i = 0; i < last30.length - 1; i++) {
      const a = last30[i].sleep.totalMin;
      const b = last30[i + 1].heart.hrvMs;
      if (a !== null && b !== null) { sleepNights.push(a); nextHrv.push(b); }
    }
    const sleepHrv = pearson(sleepNights, nextHrv);

    const readingByDate = new Map(readings.map((r) => [r.date.slice(0, 10), r.weight]));
    const stepsArr: number[] = [];
    const weightArr: number[] = [];
    for (const d of last30) {
      const w = readingByDate.get(d.date);
      if (d.activity.steps !== null && w !== undefined) {
        stepsArr.push(d.activity.steps);
        weightArr.push(w);
      }
    }
    const stepsWeight = pearson(stepsArr, weightArr);

    const exArr: number[] = [];
    const rhrArr: number[] = [];
    for (const d of last30) {
      if (d.activity.exerciseMinutes !== null && d.heart.restingHr !== null) {
        exArr.push(d.activity.exerciseMinutes);
        rhrArr.push(d.heart.restingHr);
      }
    }
    const exerciseRhr = pearson(exArr, rhrArr);
    return { sleepHrv, stepsWeight, exerciseRhr };
  }, [last30, readings]);

  // ── render guards ────────────────────────────────────────────────────────
  // For non-'all'/'header' slots, swallow the loading/empty/error chrome —
  // the parent will only show one header somewhere, not 12.

  const showChrome = slot === 'all' || slot === 'header';

  if (status === 'idle' || status === 'loading') {
    if (!showChrome) return null;
    return (
      <section className="op-health-section">
        <header className="op-health-head">
          <span className="op-health-kicker">Apple Health stream</span>
          <span className="muted">Reading the day…</span>
        </header>
      </section>
    );
  }

  if (status === 'empty') {
    if (!showChrome) return null;
    return (
      <section className="op-health-section">
        <header className="op-health-head">
          <span className="op-health-kicker">Apple Health stream</span>
          <span className="muted">Waiting on first sync</span>
        </header>
        <div className="op-health-empty-box">
          <p>
            The week is still being written. Once Health Auto Export posts to{' '}
            <code>/api/operator/fitness/auto-sync</code> — with steps, energy, exercise, heart, sleep
            and workouts enabled — the page fills in.
          </p>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    if (!showChrome) return null;
    return (
      <section className="op-health-section">
        <header className="op-health-head">
          <span className="op-health-kicker">Apple Health stream</span>
          <span className="muted">Something interrupted the read</span>
        </header>
        <div className="op-health-empty-box">
          <p>The stream stalled: {errorMsg ?? 'unknown error'}. Try again in a moment.</p>
        </div>
      </section>
    );
  }

  // ── main render ──────────────────────────────────────────────────────────

  const sectionClass = slot === 'all' ? 'op-health-section' : 'op-health-section op-health-section--slot';

  return (
    <section className={sectionClass}>
      {(slot === 'all' || slot === 'header') && (
        <header className="op-health-head">
          <div>
            <div className="op-health-kicker">Apple Health stream</div>
            <h2 className="op-health-title">{healthHeadline}</h2>
          </div>
          <div className="op-health-head-meta">
            <span className="op-date-stamp">{latest?.date ? new Date(latest.date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase().replace(/[ ,]+/g, ' · ') : '—'}</span>
            <span className="op-health-head-dot">·</span>
            <span className="muted">{days.length} days on file</span>
          </div>
        </header>
      )}

      {/* ── Readiness band ──────────────────────────────────────────────── */}
      {(slot === 'all' || slot === 'readiness') && (
      <div className={`op-readiness op-readiness-${readinessTone}`}>
        <div className="op-readiness-score">
          <div className="op-readiness-num">{readinessScore !== null ? readinessScore : '—'}</div>
          <div className="op-readiness-lbl">Readiness</div>
        </div>
        <div className="op-readiness-axes">
          {readinessAxes.map((a) => (
            <div key={a.key} className="op-readiness-axis">
              <div className="op-readiness-axis-lbl">{a.label} <span className="muted" style={{ fontWeight: 400 }}>· {Math.round(a.weight * 100)}%</span></div>
              <div className="op-readiness-axis-bar">
                <span style={{ width: `${a.score ?? 0}%` }} />
              </div>
              <div className="op-readiness-axis-val">{a.score !== null ? Math.round(a.score) : '—'}</div>
            </div>
          ))}
        </div>
        <div className="op-readiness-verdict">
          <div className="op-readiness-verdict-lbl">Today reads as</div>
          <div className="op-readiness-verdict-txt">{readinessVerdict}</div>
          {recoveryCaution && (
            <div className="op-readiness-caution">
              <span className="op-readiness-caution-label">{recoveryCaution.title}</span>
              <span className="op-readiness-caution-body">{recoveryCaution.body}</span>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── Accountability: today's one move + drift detector ───────── */}
      {(slot === 'all' || slot === 'accountability') && (
      <div className="op-accountability">
        <div className="op-onemove">
          <span className="kicker">Today, one move</span>
          <div className="action">{oneMove.action}</div>
          <p className="reason">{oneMove.reason}</p>
          <div className="meta-row">
            {oneMove.meta.map(([k, v]) => (
              <span key={k}>{k} <strong>{v}</strong></span>
            ))}
          </div>
        </div>
        <div className="op-drift">
          <span className="kicker">Drift check · 3 days</span>
          <div className={`headline ${driftCard.tone}`}>{driftCard.headline}</div>
          <p className="body">{driftCard.body}</p>
          <dl className="signals">
            {driftCard.signals.map(([k, v, tone]) => (
              <div className="signal-row" key={k}>
                <dt>{k}</dt>
                <dd className={tone}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      )}

      {/* ── Promise ledger ──────────────────────────────────────────── */}
      {(slot === 'all' || slot === 'promise') && (
      <div className="op-promise">
        <div className="op-promise-head">
          <span className="op-health-card-label">Promise → kept · last 7 days</span>
          <span className="muted">{setCount === 0 ? 'Set a tiny intention below — evaluated against tomorrow\'s data.' : `${keptCount}/${setCount} kept`}</span>
        </div>
        <div className="op-promise-grid">
          {promiseLedger.map((row) => {
            const stateClass = row.status === 'empty' ? '' : row.status;
            const mark = row.status === 'kept' ? '✓' : row.status === 'missed' ? '·' : row.status === 'pending' ? '…' : '—';
            const valLabel = row.status === 'empty' ? 'no promise'
              : row.promise === 'rest' ? 'rest'
              : row.promise === 'stretch' ? 'stretch'
              : row.promise === 'workout' ? 'workout'
              : row.stepsVal !== null ? `${fmtInt(row.stepsVal)} st`
              : 'walk';
            return (
              <div key={row.date} className={`op-promise-day ${stateClass}`} title={`${row.date}: ${row.promise ?? 'no promise'} · ${row.status}`}>
                <span className="op-promise-dow">{row.dow}</span>
                <span className="op-promise-mark">{mark}</span>
                <span className="op-promise-val">{valLabel}</span>
              </div>
            );
          })}
        </div>
        <div className="op-promise-summary">
          <span className="muted" style={{ marginRight: 10 }}>Today&apos;s intention:</span>
          {(['walk', 'workout', 'stretch', 'rest'] as PromiseKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setPromiseFor(todayIso, todayPromise === kind ? null : kind)}
              style={{
                marginRight: 8,
                padding: '4px 10px',
                border: `0.5px solid ${todayPromise === kind ? 'var(--ink)' : 'var(--rule)'}`,
                background: todayPromise === kind ? 'rgba(140,117,179,0.12)' : 'transparent',
                fontFamily: 'inherit',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              {kind}
            </button>
          ))}
          {todayPromise && (
            <span className="muted" style={{ marginLeft: 6 }}>
              {todayPromise === 'walk' && '— evaluated tomorrow against 7k steps or 15 exercise min.'}
              {todayPromise === 'workout' && '— evaluated tomorrow against a logged workout.'}
              {todayPromise === 'stretch' && '— honour-system, marked kept.'}
              {todayPromise === 'rest' && '— marked kept tomorrow.'}
            </span>
          )}
        </div>
      </div>
      )}

      {/* ── Today snapshot strip ────────────────────────────────────────── */}
      {(slot === 'all' || slot === 'todayStrip') && (
      <div className="op-today-strip">
        <SnapshotCell
          label="Steps"
          value={fmtInt(latest?.activity.steps ?? null)}
          baseline={`7d avg ${fmtInt(stepsAvg7)}`}
          delta={stepsDelta}
          spark={last7.map((d) => d.activity.steps)}
        />
        <SnapshotCell
          label="Deficit"
          value={deficitToday !== null ? `${Math.round(deficitToday).toLocaleString('en-GB')} kcal` : '—'}
          baseline={deficitAvg7 !== null ? `7d avg ${Math.round(deficitAvg7).toLocaleString('en-GB')} kcal` : `Target ${GOALS.deficit.toLocaleString('en-GB')} kcal`}
          delta={deficitDelta}
          spark={nets7.map((n) => (n === null ? null : Math.max(0, -n)))}
        />
        <SnapshotCell
          label="Sleep"
          value={formatMinutes(latest?.sleep.totalMin ?? null)}
          baseline={`7d avg ${formatMinutes(sleepAvg7)}`}
          delta={sleepDelta}
          spark={last7.map((d) => d.sleep.totalMin)}
        />
        <SnapshotCell
          label="Exercise"
          value={`${fmtInt(latest?.activity.exerciseMinutes ?? null)} min`}
          baseline={`Goal ${GOALS.exerciseMinutes}`}
          delta={exerciseDelta}
          spark={last7.map((d) => d.activity.exerciseMinutes)}
        />
        <SnapshotCell
          label="Resting HR"
          value={fmtNum(latest?.heart.restingHr ?? null, 0, ' bpm')}
          baseline={`7d avg ${fmtNum(restingHrAvg7, 0, ' bpm')}`}
          delta={rhrDelta}
          spark={last7.map((d) => d.heart.restingHr)}
        />
        <SnapshotCell
          label="HRV"
          value={fmtNum(latest?.heart.hrvMs ?? null, 0, ' ms')}
          baseline={`7d avg ${fmtNum(hrvAvg7, 0, ' ms')}`}
          delta={hrvDelta}
          spark={last7.map((d) => d.heart.hrvMs)}
        />
      </div>
      )}

      {/* ── This week vs last week ──────────────────────────────────── */}
      {(slot === 'all' || slot === 'weekCompare') && (
      <div className="op-week-compare">
        <div className="op-week-compare-head">
          <span className="op-health-card-label">This week vs last</span>
          <span className="muted">7-day totals (sleep = nightly avg)</span>
        </div>
        <div className="op-week-compare-grid">
          {weeklyDeltas.map((row) => {
            let tone: 'good' | 'warn' | 'neutral' = 'neutral';
            let pctText = '—';
            if (row.now !== null && row.prev !== null && row.prev !== 0) {
              const diff = row.now - row.prev;
              const pct = (diff / row.prev) * 100;
              tone = Math.abs(pct) < 3 ? 'neutral' : pct > 0 ? 'good' : 'warn';
              pctText = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
            }
            return (
              <div key={row.label} className="op-week-compare-cell">
                <div className="op-week-compare-lbl">{row.label}</div>
                <div className="op-week-compare-val">{row.fmt(row.now)}</div>
                <div className="op-week-compare-sub muted">prev {row.fmt(row.prev)}</div>
                <div className={`op-week-compare-delta ${tone}`}>{pctText}</div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ── Main grid ────────────────────────────────────────────────── */}
      {(slot === 'all' || slot === 'mainGrid') && (
      <div className="op-health-grid-v2-frame">
      <div className="op-health-grid-v2">

        {/* Activity (wide) */}
        <article className="op-health-card op-card-wide">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Activity</span>
            <span className="muted">Today vs goals · last 14 days</span>
          </header>

          <div className="op-rings-row">
            <Ring value={latest?.activity.steps ?? null} goal={GOALS.steps} label="steps" />
            <Ring value={latest?.activity.exerciseMinutes ?? null} goal={GOALS.exerciseMinutes} label="exercise" />
            <Ring value={latest?.activity.standHours ?? null} goal={GOALS.standHours} label="stand hrs" />
          </div>

          <BarChart values={stepBars} labels={stepLabels} format={(v) => `${Math.round(v).toLocaleString('en-GB')} steps`} />

          <dl className="op-health-stats">
            <div><dt>14d total</dt><dd>{fmtInt(sum(stepBars))}</dd></div>
            <div><dt>Best day</dt><dd>{fmtInt(Math.max(...stepBars.map((v) => v ?? 0)))}</dd></div>
            <div><dt>Distance (7d)</dt><dd>{fmtNum(sum(last7.map((d) => d.activity.distanceKm)), 1, ' km')}</dd></div>
            <div><dt>Active kcal (7d)</dt><dd>{fmtInt(sum(last7.map((d) => d.activity.activeEnergyKcal)))}</dd></div>
            <div><dt>Steps streak (≥7k)</dt><dd>{stepsStreak} day{stepsStreak === 1 ? '' : 's'}</dd></div>
            <div><dt>Exercise streak</dt><dd>{exerciseStreak} day{exerciseStreak === 1 ? '' : 's'}</dd></div>
          </dl>
        </article>

        {/* Sleep (wide) */}
        <article className="op-health-card op-card-wide">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Sleep</span>
            <span className="muted">Last 7 nights · stages</span>
          </header>

          <SleepNights days={days} />

          <dl className="op-health-stats">
            <div><dt>Last night</dt><dd>{formatMinutes(latest?.sleep.totalMin ?? null)}</dd></div>
            <div><dt>vs night before</dt><dd>
              {latest?.sleep.totalMin && previousNight?.sleep.totalMin
                ? `${(latest.sleep.totalMin - previousNight.sleep.totalMin) >= 0 ? '+' : ''}${Math.round(latest.sleep.totalMin - previousNight.sleep.totalMin)}m`
                : '—'}
            </dd></div>
            <div><dt>7-night avg</dt><dd>{formatMinutes(sleepAvg7)}</dd></div>
            <div><dt>Avg deep</dt><dd>{formatMinutes(avg(last7.map((d) => d.sleep.deepMin)))}</dd></div>
            <div><dt>Avg REM</dt><dd>{formatMinutes(avg(last7.map((d) => d.sleep.remMin)))}</dd></div>
            <div><dt>Avg awake</dt><dd>{formatMinutes(avg(last7.map((d) => d.sleep.awakeMin)))}</dd></div>
            <div><dt>14-night consistency</dt><dd>{sleepStdMin !== null ? `${sleepConsistencyLabel} · ±${Math.round(sleepStdMin)}m` : '—'}</dd></div>
          </dl>

          <ul className="op-sleep-legend">
            <li><span className="op-sleep-dot" style={{ background: '#3a4a6b' }} />Deep</li>
            <li><span className="op-sleep-dot" style={{ background: '#6b7a99' }} />REM</li>
            <li><span className="op-sleep-dot" style={{ background: '#a8b3c5' }} />Core</li>
            <li><span className="op-sleep-dot" style={{ background: '#e6c0d5' }} />Awake</li>
          </ul>
        </article>

        {/* Heart */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Heart</span>
            <span className="muted">14-day trend</span>
          </header>
          <div className="op-health-primary">
            <div className="op-health-num">{fmtNum(latest?.heart.restingHr ?? null)}</div>
            <div className="op-health-unit">resting bpm</div>
          </div>
          <div className="op-line-row">
            <span className="op-line-label">RHR</span>
            <LineMini values={last14.map((d) => d.heart.restingHr)} />
          </div>
          <div className="op-line-row">
            <span className="op-line-label">HRV</span>
            <LineMini values={last14.map((d) => d.heart.hrvMs)} />
          </div>
          <dl className="op-health-stats">
            <div><dt>HRV today</dt><dd>{fmtNum(latest?.heart.hrvMs ?? null, 0, ' ms')}</dd></div>
            <div><dt>HRV 7d avg</dt><dd>{fmtNum(hrvAvg7, 0, ' ms')}</dd></div>
            <div><dt>Walking HR</dt><dd>{fmtNum(latest?.heart.walkingHrAvg ?? null, 0, ' bpm')}</dd></div>
            <div><dt>VO₂ max</dt><dd>{fmtNum(latest?.heart.vo2Max ?? null, 1)}</dd></div>
          </dl>
        </article>

        {/* Consistency — 28-day heatmap + streaks */}
        <article className="op-health-card op-card-wide">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Consistency · last 28 days</span>
            <span className="muted">Step intensity per day — darker = closer to goal</span>
          </header>
          <Heatmap days={heatmapDays} goal={GOALS.steps} />
          <dl className="op-health-stats">
            <div><dt>Steps streak (≥7k)</dt><dd>{stepsStreak} day{stepsStreak === 1 ? '' : 's'}</dd></div>
            <div><dt>Best in 30d</dt><dd>{stepsStreakBest} day{stepsStreakBest === 1 ? '' : 's'}</dd></div>
            <div><dt>Exercise streak (≥{GOALS.exerciseMinutes}m)</dt><dd>{exerciseStreak} day{exerciseStreak === 1 ? '' : 's'}</dd></div>
            <div><dt>Sleep consistency</dt><dd>{sleepConsistencyLabel}{sleepStdMin !== null ? ` (±${Math.round(sleepStdMin)}m)` : ''}</dd></div>
          </dl>
        </article>

      </div>
      </div>
      )}

      {/* ── Lifestyle inputs — water, caffeine, alcohol ──────────────── */}
      {(slot === 'all' || slot === 'lifestyle') && (
        <article className="op-health-card op-card-wide op-lifestyle-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Lifestyle · today</span>
            <span className="muted">Water · caffeine · alcohol — tap to log, 14-day strip below</span>
          </header>
          <div className="op-lifestyle-rows">
            <LifestyleRow
              label="Water"
              suffix="cups"
              value={todayWater}
              series={lifestyleStrip('water')}
              accent="brass"
              onBump={(delta) => bumpLifestyle(todayLifestyleIso, 'water', delta)}
              hint="Apple Health water (if logged) shows automatically; tap + to top up."
            />
            <LifestyleRow
              label="Caffeine"
              suffix="cups"
              value={todayCaffeine}
              series={lifestyleStrip('caffeine')}
              accent="brass-deep"
              onBump={(delta) => bumpLifestyle(todayLifestyleIso, 'caffeine', delta)}
              hint="Coffees / strong teas / energy drinks. >3 starts to bite HRV."
            />
            <LifestyleRow
              label="Alcohol"
              suffix="units"
              value={todayAlcohol}
              series={lifestyleStrip('alcohol')}
              accent="warn"
              onBump={(delta) => bumpLifestyle(todayLifestyleIso, 'alcohol', delta)}
              hint="Units, not drinks. A glass of wine ≈ 1.5 units. Cleanest signal in the dashboard."
            />
          </div>

          {lifestyleCausalRows.length > 0 && (
            <div className="op-lifestyle-causal">
              <div className="op-lifestyle-causal-head">Yesterday → today</div>
              <ul>
                {lifestyleCausalRows.map((row, i) => (
                  <li key={i} className={`op-lifestyle-causal-row tone-${row.tone}`}>
                    <span className="op-lifestyle-causal-input">{row.input}</span>
                    <span className="op-lifestyle-causal-arrow">→</span>
                    <span className="op-lifestyle-causal-outcome">{row.outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}

      {/* ── Compare: now vs 30 / 90 / 180 days back ──────────────────── */}
      {(slot === 'all' || slot === 'compare') && (
      <div className="op-compare">
        <header className="op-compare-head">
          <span className="op-health-card-label">You, then and now</span>
          <span className="muted">Same body, three time windows back</span>
        </header>
        <div className="op-compare-grid">
          <div className="op-compare-rowhead">
            <span>Metric</span>
            <span>Now</span>
            {compareWindows.map((w) => (
              <span key={w.days}>{w.days}d ago</span>
            ))}
          </div>
          <CompareRow
            label="Weight"
            now={readings.length > 0 ? readings[readings.length - 1].weight : null}
            cols={compareWindows.map((w) => w.weight?.weight ?? null)}
            fmt={(v) => v !== null ? `${v.toFixed(1)} kg` : '—'}
            invertDelta
          />
          <CompareRow
            label="Resting HR"
            now={latest?.heart.restingHr ?? null}
            cols={compareWindows.map((w) => w.health?.heart.restingHr ?? null)}
            fmt={(v) => v !== null ? `${Math.round(v)} bpm` : '—'}
            invertDelta
          />
          <CompareRow
            label="HRV"
            now={latest?.heart.hrvMs ?? null}
            cols={compareWindows.map((w) => w.health?.heart.hrvMs ?? null)}
            fmt={(v) => v !== null ? `${Math.round(v)} ms` : '—'}
          />
          <CompareRow
            label="Sleep (last night)"
            now={latest?.sleep.totalMin ?? null}
            cols={compareWindows.map((w) => w.health?.sleep.totalMin ?? null)}
            fmt={(v) => v !== null ? formatMinutes(v) : '—'}
          />
          <CompareRow
            label="VO₂ max"
            now={latest?.heart.vo2Max ?? null}
            cols={compareWindows.map((w) => w.health?.heart.vo2Max ?? null)}
            fmt={(v) => v !== null ? v.toFixed(1) : '—'}
          />
        </div>
      </div>
      )}

      {/* ── Personal records ─────────────────────────────────────────── */}
      {(slot === 'all' || slot === 'prs') && (
      <div className="op-pr-strip">
        <header className="op-pr-head">
          <span className="op-health-card-label">Personal records</span>
          <span className="muted">Earned, not chased</span>
        </header>
        <div className="op-pr-grid">
          <PRCell label="Most steps" value={records.steps.value !== null ? fmtInt(records.steps.value) : '—'} date={records.steps.date} />
          <PRCell label="Longest exercise" value={records.exercise.value !== null ? `${Math.round(records.exercise.value)} min` : '—'} date={records.exercise.date} />
          <PRCell label="Biggest sleep" value={records.sleep.value !== null ? formatMinutes(records.sleep.value) : '—'} date={records.sleep.date} />
          <PRCell label="Highest HRV" value={records.hrv.value !== null ? `${Math.round(records.hrv.value)} ms` : '—'} date={records.hrv.date} />
          <PRCell label="Lowest RHR" value={records.rhr.value !== null ? `${Math.round(records.rhr.value)} bpm` : '—'} date={records.rhr.date} />
          <PRCell label="Leanest weight" value={records.weight ? `${records.weight.weight.toFixed(1)} kg` : '—'} date={records.weight?.date ?? null} />
        </div>
      </div>
      )}

      {/* ── Insight & data quality (replaces old Patterns block) ─────── */}
      {(slot === 'all' || slot === 'correlations') && (
      <div className="op-insights">
        <div className={`op-insight-card op-insight-${weightInsight?.tone ?? 'neutral'}`}>
          <header className="op-health-card-head" style={{ marginBottom: 10 }}>
            <span className="op-health-card-label">Weight insight</span>
            <span className="muted">Last 30 days</span>
          </header>
          {weightInsight ? (
            <>
              <p className="op-insight-headline">
                <strong>{weightInsight.headline}</strong> {weightInsight.summary}
              </p>
              <div className="op-insight-stats">
                <div className="op-insight-stat">
                  <span className="op-insight-stat-lbl">7-day Δ</span>
                  <span className={`op-insight-stat-v ${weightInsight.delta7 === null ? '' : weightInsight.delta7 <= 0 ? 'good' : 'warn'}`}>
                    {weightInsight.delta7 === null ? '—' : `${weightInsight.delta7 >= 0 ? '+' : ''}${weightInsight.delta7.toFixed(1)} kg`}
                  </span>
                </div>
                <div className="op-insight-stat">
                  <span className="op-insight-stat-lbl">30-day Δ</span>
                  <span className={`op-insight-stat-v ${weightInsight.delta30 === null ? '' : weightInsight.delta30 <= 0 ? 'good' : 'warn'}`}>
                    {weightInsight.delta30 === null ? '—' : `${weightInsight.delta30 >= 0 ? '+' : ''}${weightInsight.delta30.toFixed(1)} kg`}
                  </span>
                </div>
                <div className="op-insight-stat">
                  <span className="op-insight-stat-lbl">Rate</span>
                  <span className={`op-insight-stat-v ${weightInsight.ratePerWeek === null ? '' : weightInsight.ratePerWeek <= 0 ? 'good' : 'warn'}`}>
                    {weightInsight.ratePerWeek === null ? '—' : `${weightInsight.ratePerWeek >= 0 ? '+' : ''}${weightInsight.ratePerWeek.toFixed(2)} kg/wk`}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="op-insight-headline muted">Log a few weigh-ins across the next two weeks to surface a real trend line.</p>
          )}
        </div>

        <div className="op-insight-card op-insight-neutral">
          <header className="op-health-card-head" style={{ marginBottom: 10 }}>
            <span className="op-health-card-label">Data quality</span>
            <span className="muted">What's syncing, what isn't</span>
          </header>
          <p className="op-insight-headline">
            <strong>
              {dataQuality.weighInLast30 >= 12 && dataQuality.healthDaysLast14 >= 10
                ? 'Strong coverage.'
                : dataQuality.weighInLast30 >= 4 && dataQuality.healthDaysLast14 >= 5
                  ? 'Building up.'
                  : 'Limited data.'}
            </strong>{' '}
            {dataQuality.weighInLast30} weigh-{dataQuality.weighInLast30 === 1 ? 'in' : 'ins'} in the last 30 days, {dataQuality.healthDaysLast14} of the last 14 days have Apple Health rows.
            {dataQuality.presentMetrics.length > 0 && ` Syncing: ${dataQuality.presentMetrics.join(' · ')}.`}
            {dataQuality.missingMetrics.length > 0 && ` Missing: ${dataQuality.missingMetrics.join(' · ')}.`}
          </p>
          <p className="op-corr-note" style={{ marginTop: 12 }}>
            {dataQuality.overlapDays >= 14
              ? `Correlations unlocked (${dataQuality.overlapDays} overlapping days).`
              : `Correlation insights unlock at 14 overlapping days. Currently at ${dataQuality.overlapDays}.`}
          </p>
        </div>

        {dataQuality.overlapDays >= 14 && (
          <div className="op-insight-card op-insight-neutral">
            <header className="op-health-card-head" style={{ marginBottom: 10 }}>
              <span className="op-health-card-label">Patterns · last 30 days</span>
              <span className="muted">Plain-English read of the numbers</span>
            </header>
            <ul className="op-corr-list">
              <li>
                <span className="op-corr-q">Does better sleep boost next-day HRV?</span>
                <span className={`op-corr-a ${describeCorrelation(correlations.sleepHrv, 'Yes — more sleep, higher HRV', 'Inverse — more sleep, lower HRV').tone}`}>
                  {describeCorrelation(correlations.sleepHrv, 'Yes — more sleep, higher HRV', 'Inverse — more sleep, lower HRV').text}
                </span>
              </li>
              <li>
                <span className="op-corr-q">Do more steps move the scale down?</span>
                <span className={`op-corr-a ${describeCorrelation(correlations.stepsWeight === null ? null : -correlations.stepsWeight, 'Yes — more steps, lower weight', 'No — more steps tracked higher weight').tone}`}>
                  {describeCorrelation(correlations.stepsWeight === null ? null : -correlations.stepsWeight, 'Yes — more steps, lower weight', 'No — more steps tracked higher weight').text}
                </span>
              </li>
              <li>
                <span className="op-corr-q">Does exercise volume lower resting HR?</span>
                <span className={`op-corr-a ${describeCorrelation(correlations.exerciseRhr === null ? null : -correlations.exerciseRhr, 'Yes — more exercise, lower RHR', 'Hmm — more exercise but higher RHR').tone}`}>
                  {describeCorrelation(correlations.exerciseRhr === null ? null : -correlations.exerciseRhr, 'Yes — more exercise, lower RHR', 'Hmm — more exercise but higher RHR').text}
                </span>
              </li>
            </ul>
            <p className="op-corr-note">
              r close to 0 = no relationship · |r| above 0.4 starts to mean something real.
            </p>
          </div>
        )}
      </div>
      )}
    </section>
  );
}

// ─── presentational sub-components ──────────────────────────────────────────

function Heatmap({ days, goal }: { days: DailyMetrics[]; goal: number }) {
  // Build a 4-week × 7-day grid ending today. Today is the last (rightmost,
  // bottom) cell. Earlier weeks fill in above. Missing days render as empty.
  if (days.length === 0) {
    return <p className="op-health-empty">The grid fills in once steps start syncing.</p>;
  }
  const today = days[days.length - 1] ? new Date(days[days.length - 1].date) : new Date();
  today.setHours(0, 0, 0, 0);
  const cells: Array<DailyMetrics | null> = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push(days.find((row) => row.date.slice(0, 10) === iso) ?? null);
  }
  const dayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  return (
    <div className="op-heatmap">
      <div className="op-heatmap-grid">
        {cells.map((d, idx) => {
          const steps = d?.activity.steps ?? null;
          const pct = steps !== null ? Math.min(1, steps / goal) : null;
          const isToday = idx === cells.length - 1;
          return (
            <div
              key={idx}
              className={`op-heatmap-cell ${isToday ? 'is-today' : ''} ${steps === null ? 'is-missing' : ''}`}
              style={pct !== null ? { background: `rgba(140,117,179,${0.12 + pct * 0.68})` } : undefined}
              title={d ? `${d.date}: ${steps !== null ? Math.round(steps).toLocaleString('en-GB') + ' steps' : 'no data'}` : 'missing'}
            />
          );
        })}
      </div>
      <div className="op-heatmap-legend">
        <span className="muted">Less</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((s) => (
          <span key={s} className="op-heatmap-swatch" style={{ background: `rgba(140,117,179,${0.12 + s * 0.68})` }} />
        ))}
        <span className="muted">Goal {goal.toLocaleString('en-GB')}</span>
        <span className="op-heatmap-spacer" />
        <span className="op-heatmap-days">
          {dayLabels.map((l) => <span key={l}>{l}</span>)}
        </span>
      </div>
    </div>
  );
}

function LifestyleRow({ label, suffix, value, series, accent, onBump, hint }: {
  label: string;
  suffix: string;
  value: number;
  series: (number | null)[];
  accent: 'brass' | 'brass-deep' | 'warn';
  onBump: (delta: number) => void;
  hint: string;
}) {
  const color = accent === 'brass' ? 'var(--brass)' : accent === 'brass-deep' ? 'var(--brass-deep)' : 'var(--warn)';
  const max = Math.max(...series.map((v) => v ?? 0), 1);
  return (
    <div className="op-lifestyle-row">
      <div className="op-lifestyle-row-meta">
        <div className="op-lifestyle-row-label">{label}</div>
        <div className="op-lifestyle-row-hint muted">{hint}</div>
      </div>
      <div className="op-lifestyle-row-value">
        <button type="button" className="op-lifestyle-btn" onClick={() => onBump(-1)} aria-label={`Decrement ${label}`}>−</button>
        <div className="op-lifestyle-num"><strong>{value}</strong> <span className="muted">{suffix}</span></div>
        <button type="button" className="op-lifestyle-btn" onClick={() => onBump(1)} aria-label={`Increment ${label}`}>+</button>
      </div>
      <div className="op-lifestyle-strip" style={{ color }}>
        {series.map((v, i) => {
          const h = v !== null && v > 0 ? Math.max(8, (v / max) * 100) : 0;
          const isToday = i === series.length - 1;
          return (
            <span
              key={i}
              className={`op-lifestyle-bar ${isToday ? 'is-today' : ''} ${v === null ? 'is-empty' : ''}`}
              style={{ height: `${h}%`, background: v && v > 0 ? color : undefined }}
              title={`${v ?? 'no data'} ${suffix}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function CompareRow({ label, now, cols, fmt, invertDelta }: {
  label: string;
  now: number | null;
  cols: (number | null)[];
  fmt: (v: number | null) => string;
  invertDelta?: boolean;
}) {
  return (
    <div className="op-compare-row">
      <span className="op-compare-lbl">{label}</span>
      <span className="op-compare-now">{fmt(now)}</span>
      {cols.map((v, i) => {
        let deltaTone: 'good' | 'warn' | 'neutral' = 'neutral';
        let deltaTxt = '—';
        if (now !== null && v !== null && v !== 0) {
          const diff = now - v;
          const pct = (diff / v) * 100;
          const positive = invertDelta ? diff < 0 : diff > 0;
          deltaTone = Math.abs(pct) < 2 ? 'neutral' : positive ? 'good' : 'warn';
          deltaTxt = `${diff >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
        }
        return (
          <span key={i} className={`op-compare-cell ${deltaTone}`}>
            <span className="op-compare-val">{fmt(v)}</span>
            <span className="op-compare-delta">{deltaTxt}</span>
          </span>
        );
      })}
    </div>
  );
}

function PRCell({ label, value, date }: { label: string; value: string; date: string | null }) {
  return (
    <div className="op-pr-cell">
      <span className="op-pr-label">{label}</span>
      <span className="op-pr-value">{value}</span>
      <span className="op-pr-date">
        {date ? new Date(date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase().replace(/[ ,]+/g, ' · ') : '—'}
      </span>
    </div>
  );
}

function SnapshotCell({ label, value, baseline, delta, spark }: {
  label: string;
  value: string;
  baseline: string;
  delta: { text: string; tone: 'good' | 'warn' | 'neutral' };
  spark?: Array<number | null>;
}) {
  const hasDelta = delta.text !== '—';
  const trimmed = delta.text.trim();
  const arrow = !hasDelta
    ? null
    : trimmed.startsWith('+')
      ? '↑'
      : trimmed.startsWith('-') || trimmed.startsWith('−')
        ? '↓'
        : null;
  return (
    <div className="op-snap-cell">
      <div className="op-snap-label">{label}</div>
      <div className="op-snap-value">{value}</div>
      <div className="op-snap-spark-row">
        {spark && spark.filter((v) => v !== null).length >= 2 ? (
          <MiniSpark points={spark} tone={delta.tone} />
        ) : (
          <span className="op-snap-spark-empty" aria-hidden />
        )}
      </div>
      {hasDelta ? (
        <div className={`op-snap-delta ${delta.tone}`}>
          {arrow ? <span className="op-snap-delta-arrow" aria-hidden>{arrow}</span> : null}
          <span>{delta.text}</span>
        </div>
      ) : (
        <div className="op-snap-delta neutral op-snap-delta-empty" aria-hidden>—</div>
      )}
      <div className="op-snap-baseline muted">{baseline}</div>
    </div>
  );
}

function MiniSpark({ points, tone }: {
  points: Array<number | null>;
  tone: 'good' | 'warn' | 'neutral';
}) {
  const W = 100;
  const H = 18;
  const valid = points.flatMap((v, i) => (v === null ? [] : [{ v: v as number, i }]));
  const values = valid.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const denom = Math.max(1, points.length - 1);
  const xs = valid.map((p) => (p.i / denom) * W);
  const ys = valid.map((p) => H - ((p.v - min) / range) * (H - 3) - 1.5);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const lastX = xs[xs.length - 1];
  const lastY = ys[ys.length - 1];
  const stroke =
    tone === 'warn' ? 'var(--warn)' :
    tone === 'good' ? 'var(--good)' :
    'var(--ink-soft)';
  return (
    <svg
      className="op-snap-spark"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.55}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={1.6} fill={stroke} />
    </svg>
  );
}
