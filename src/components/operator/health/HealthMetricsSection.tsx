'use client';

import { useEffect, useMemo, useState } from 'react';

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

interface Props {
  opPw: string;
  readings: FitnessReadingLite[];
}

// ─── goal targets (sensible defaults) ───────────────────────────────────────

const GOALS = {
  steps: 10000,
  exerciseMinutes: 30,
  standHours: 12,
  sleepMinutes: 480,
  restingHrTarget: 60,
  calorieIntake: 1600,
  deficit: 800,
  bmrHeightM: 1.57,
  bmrAgeYears: 30,
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

function Ring({ value, goal, label, suffix = '', size = 76 }: { value: number | null; goal: number; label: string; suffix?: string; size?: number }) {
  const pct = value === null ? 0 : Math.min(1, value / goal);
  const stroke = 4;
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

function BarChart({ values, labels, height = 56, format }: { values: (number | null)[]; labels: string[]; height?: number; format?: (v: number) => string }) {
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

function LineMini({ values, height = 56, width = 240 }: { values: (number | null)[]; height?: number; width?: number }) {
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
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1} />
      {lastY !== null && (
        <circle cx={lastX} cy={lastY} r={2} fill="currentColor" />
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
          { key: 'awake', value: d.sleep.awakeMin ?? 0, color: '#d4c8b8' },
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

// ─── workout type breakdown ─────────────────────────────────────────────────

function workoutsByType(workouts: Workout[]): Array<{ type: string; count: number; minutes: number; kcal: number }> {
  const map = new Map<string, { type: string; count: number; minutes: number; kcal: number }>();
  for (const w of workouts) {
    const key = w.type ?? 'Other';
    const cur = map.get(key) ?? { type: key, count: 0, minutes: 0, kcal: 0 };
    cur.count += 1;
    cur.minutes += w.durationMin ?? 0;
    cur.kcal += w.energyKcal ?? 0;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
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

export default function HealthMetricsSection({ opPw, readings }: Props) {
  const [days, setDays] = useState<DailyMetrics[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'empty' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!opPw) return;
    let cancelled = false;
    setStatus('loading');
    setErrorMsg(null);

    Promise.all([
      fetch('/api/operator/health?limit=90', { headers: { 'x-operator-pw': opPw } }).then((r) => r.json()),
      fetch('/api/operator/workouts?limit=50', { headers: { 'x-operator-pw': opPw } }).then((r) => r.json()),
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

  const last7 = useMemo(() => days.slice(-7), [days]);
  const last14 = useMemo(() => days.slice(-14), [days]);
  const last30 = useMemo(() => days.slice(-30), [days]);
  const latest = days[days.length - 1] ?? null;
  const previousNight = days[days.length - 2] ?? null;

  // 7-day averages
  const stepsAvg7 = avg(last7.map((d) => d.activity.steps));
  const energyAvg7 = avg(last7.map((d) => d.activity.activeEnergyKcal));
  const exerciseAvg7 = avg(last7.map((d) => d.activity.exerciseMinutes));
  const restingHrAvg7 = avg(last7.map((d) => d.heart.restingHr));
  const hrvAvg7 = avg(last7.map((d) => d.heart.hrvMs));
  const sleepAvg7 = avg(last7.map((d) => d.sleep.totalMin));

  // Today vs baseline
  const stepsDelta = deltaPill(latest?.activity.steps ?? null, stepsAvg7);
  const energyDelta = deltaPill(latest?.activity.activeEnergyKcal ?? null, energyAvg7, { suffix: ' kcal' });
  const exerciseDelta = deltaPill(latest?.activity.exerciseMinutes ?? null, exerciseAvg7, { suffix: ' min' });
  const rhrDelta = deltaPill(latest?.heart.restingHr ?? null, restingHrAvg7, { invert: true, suffix: ' bpm' });
  const hrvDelta = deltaPill(latest?.heart.hrvMs ?? null, hrvAvg7, { suffix: ' ms' });
  const sleepDelta = deltaPill(latest?.sleep.totalMin ?? null, sleepAvg7, { suffix: 'm' });

  // Workouts week aggregates
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, []);
  const workoutsThisWeek = useMemo(() => workouts.filter((w) => w.startedAt >= weekAgo), [workouts, weekAgo]);
  const workoutMinutesWeek = workoutsThisWeek.reduce((acc, w) => acc + (w.durationMin ?? 0), 0);
  const workoutKcalWeek = workoutsThisWeek.reduce((acc, w) => acc + (w.energyKcal ?? 0), 0);
  const byType = useMemo(() => workoutsByType(workoutsThisWeek), [workoutsThisWeek]);
  const recentWorkouts = workouts.slice(0, 4);

  // 14-day step labels and values
  const stepBars = last14.map((d) => d.activity.steps);
  const stepLabels = last14.map((d) => shortDate(d.date).charAt(0));

  // ── Nutrition: calories in / out / net ──────────────────────────────────
  const latestWeight = readings.length > 0 ? readings[readings.length - 1].weight : null;
  const bmr = latestWeight !== null ? estimateBMR(latestWeight) : null;

  function netForDay(d: DailyMetrics | null): number | null {
    if (!d || bmr === null) return null;
    const kIn = d.nutrition?.dietaryEnergyKcal ?? null;
    const kActive = d.activity.activeEnergyKcal ?? 0;
    if (kIn === null) return null;
    return kIn - (bmr + kActive);
  }

  const caloriesIn = latest?.nutrition?.dietaryEnergyKcal ?? null;
  const activeKcalToday = latest?.activity.activeEnergyKcal ?? null;
  const caloriesOut = bmr !== null ? bmr + (activeKcalToday ?? 0) : null;
  const netToday = netForDay(latest);
  const targetNet = -GOALS.deficit;
  const nets7 = last7.map(netForDay);
  const avgNet7 = avg(nets7);
  const proteinToday = latest?.nutrition?.proteinG ?? null;
  const carbsToday = latest?.nutrition?.carbsG ?? null;
  const fatToday = latest?.nutrition?.fatG ?? null;
  const hasNutritionData = days.some((d) => (d.nutrition?.dietaryEnergyKcal ?? null) !== null);

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

  const readinessAxes = [
    { key: 'sleep', label: 'Sleep', score: readinessAxis(latest?.sleep.totalMin ?? null, sleepBaseline) },
    { key: 'hrv', label: 'HRV', score: readinessAxis(latest?.heart.hrvMs ?? null, hrvBaseline) },
    { key: 'rhr', label: 'RHR', score: readinessAxis(latest?.heart.restingHr ?? null, rhrBaseline, true) },
  ];
  const readinessScores = readinessAxes.map((a) => a.score).filter((s): s is number => s !== null);
  const readinessScore = readinessScores.length > 0
    ? Math.round(readinessScores.reduce((a, b) => a + b, 0) / readinessScores.length)
    : null;
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
    if (date === new Date().toISOString().slice(0, 10)) return 'pending';
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
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayPromise = promises[todayIso] ?? null;


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

  if (status === 'idle' || status === 'loading') {
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

  return (
    <section className="op-health-section">
      <header className="op-health-head">
        <div>
          <div className="op-health-kicker">Apple Health stream</div>
          <h2 className="op-health-title">Today, in body and motion</h2>
        </div>
        <div className="op-health-head-meta">
          <span className="op-date-stamp">{latest?.date ? new Date(latest.date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase().replace(/[ ,]+/g, ' · ') : '—'}</span>
          <span className="op-health-head-dot">·</span>
          <span className="muted">{days.length} days on file</span>
        </div>
      </header>

      {/* ── Readiness band ──────────────────────────────────────────────── */}
      <div className={`op-readiness op-readiness-${readinessTone}`}>
        <div className="op-readiness-score">
          <div className="op-readiness-num">{readinessScore !== null ? readinessScore : '—'}</div>
          <div className="op-readiness-lbl">Readiness</div>
        </div>
        <div className="op-readiness-axes">
          {readinessAxes.map((a) => (
            <div key={a.key} className="op-readiness-axis">
              <div className="op-readiness-axis-lbl">{a.label}</div>
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
        </div>
      </div>

      {/* ── Accountability: today's one move + drift detector ───────── */}
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

      {/* ── Promise ledger ──────────────────────────────────────────── */}
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
                background: todayPromise === kind ? 'rgba(196,135,47,0.12)' : 'transparent',
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

      {/* ── Today snapshot strip ────────────────────────────────────────── */}
      <div className="op-today-strip">
        <SnapshotCell
          label="Steps"
          value={fmtInt(latest?.activity.steps ?? null)}
          baseline={`7d avg ${fmtInt(stepsAvg7)}`}
          delta={stepsDelta}
        />
        <SnapshotCell
          label="Active kcal"
          value={fmtInt(latest?.activity.activeEnergyKcal ?? null)}
          baseline={`7d avg ${fmtInt(energyAvg7)}`}
          delta={energyDelta}
        />
        <SnapshotCell
          label="Exercise"
          value={`${fmtInt(latest?.activity.exerciseMinutes ?? null)} min`}
          baseline={`Goal ${GOALS.exerciseMinutes}`}
          delta={exerciseDelta}
        />
        <SnapshotCell
          label="Sleep"
          value={formatMinutes(latest?.sleep.totalMin ?? null)}
          baseline={`7d avg ${formatMinutes(sleepAvg7)}`}
          delta={sleepDelta}
        />
        <SnapshotCell
          label="Resting HR"
          value={fmtNum(latest?.heart.restingHr ?? null, 0, ' bpm')}
          baseline={`7d avg ${fmtNum(restingHrAvg7, 0, ' bpm')}`}
          delta={rhrDelta}
        />
        <SnapshotCell
          label="HRV"
          value={fmtNum(latest?.heart.hrvMs ?? null, 0, ' ms')}
          baseline={`7d avg ${fmtNum(hrvAvg7, 0, ' ms')}`}
          delta={hrvDelta}
        />
      </div>

      {/* ── This week vs last week ──────────────────────────────────── */}
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

      {/* ── Main grid ────────────────────────────────────────────────── */}
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
            <li><span className="op-sleep-dot" style={{ background: '#d4c8b8' }} />Awake</li>
          </ul>
        </article>

        {/* Nutrition (wide) */}
        <article className="op-health-card op-card-wide">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Nutrition · calories</span>
            <span className="muted">In vs out · target deficit {GOALS.deficit} kcal</span>
          </header>

          {!hasNutritionData ? (
            <div className="op-nutri-empty">
              <p>
                Nothing from MyFitnessPal yet. In MFP, switch on{' '}
                <em>Settings → Apps &amp; Devices → Apple Health</em> for at least <em>Calories</em>,{' '}
                <em>Protein</em>, <em>Carbs</em> and <em>Fat</em> — then enable Dietary Energy + macros
                on the same Health Auto Export automation. The numbers arrive on the next sync.
              </p>
            </div>
          ) : (
            <>
              <div className="op-nutri-numbers">
                <div className="op-nutri-cell">
                  <div className="op-nutri-lbl">In</div>
                  <div className="op-nutri-num">{fmtInt(caloriesIn)}</div>
                  <div className="op-nutri-sub muted">
                    {caloriesIn !== null ? `${(caloriesIn - GOALS.calorieIntake) >= 0 ? '+' : ''}${Math.round(caloriesIn - GOALS.calorieIntake)} vs ${GOALS.calorieIntake} target` : `Target ${GOALS.calorieIntake}`}
                  </div>
                </div>
                <div className="op-nutri-cell">
                  <div className="op-nutri-lbl">Out</div>
                  <div className="op-nutri-num">{fmtInt(caloriesOut)}</div>
                  <div className="op-nutri-sub muted">
                    BMR {fmtInt(bmr)} + active {fmtInt(activeKcalToday)}
                  </div>
                </div>
                <div className="op-nutri-cell">
                  <div className="op-nutri-lbl">Net</div>
                  <div className={`op-nutri-num ${netToday !== null && netToday <= targetNet ? 'good' : netToday !== null && netToday < 0 ? 'neutral' : 'warn'}`}>
                    {netToday !== null ? `${netToday >= 0 ? '+' : ''}${Math.round(netToday)}` : '—'}
                  </div>
                  <div className="op-nutri-sub muted">
                    Target {targetNet} kcal
                  </div>
                </div>
                <div className="op-nutri-cell">
                  <div className="op-nutri-lbl">7-day avg net</div>
                  <div className={`op-nutri-num ${avgNet7 !== null && avgNet7 <= targetNet ? 'good' : avgNet7 !== null && avgNet7 < 0 ? 'neutral' : 'warn'}`}>
                    {avgNet7 !== null ? `${avgNet7 >= 0 ? '+' : ''}${Math.round(avgNet7)}` : '—'}
                  </div>
                  <div className="op-nutri-sub muted">
                    {avgNet7 !== null
                      ? `${Math.round((avgNet7 / targetNet) * 100)}% of deficit target`
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="op-nutri-bar-wrap">
                <div className="op-nutri-bar-lbl muted">Deficit progress (today)</div>
                <div className="op-nutri-bar">
                  <span
                    className={netToday !== null && netToday <= 0 ? 'good' : 'warn'}
                    style={{
                      width: netToday !== null
                        ? `${Math.min(100, Math.max(0, (Math.min(0, netToday) / targetNet) * 100))}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>

              <dl className="op-health-stats">
                <div><dt>Protein</dt><dd>{fmtNum(proteinToday, 0, ' g')}</dd></div>
                <div><dt>Carbs</dt><dd>{fmtNum(carbsToday, 0, ' g')}</dd></div>
                <div><dt>Fat</dt><dd>{fmtNum(fatToday, 0, ' g')}</dd></div>
                <div><dt>BMR (Mifflin)</dt><dd>{fmtInt(bmr)} kcal</dd></div>
              </dl>
            </>
          )}
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

        {/* Workouts */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Workouts</span>
            <span className="muted">This week</span>
          </header>
          <div className="op-health-primary">
            <div className="op-health-num">{workoutsThisWeek.length}</div>
            <div className="op-health-unit">sessions · {Math.round(workoutMinutesWeek)} min · {Math.round(workoutKcalWeek)} kcal</div>
          </div>

          {byType.length > 0 && (
            <div className="op-workout-types">
              {byType.slice(0, 4).map((row) => {
                const max = byType[0].minutes || 1;
                const pct = (row.minutes / max) * 100;
                return (
                  <div key={row.type} className="op-workout-type-row">
                    <span className="op-workout-type-name">{row.type}</span>
                    <span className="op-workout-type-bar">
                      <span style={{ width: `${pct}%` }} />
                    </span>
                    <span className="op-workout-type-val">{Math.round(row.minutes)}m · {row.count}×</span>
                  </div>
                );
              })}
            </div>
          )}

          {recentWorkouts.length > 0 && (
            <>
              <div className="op-workout-recent-head">Recent</div>
              <ul className="op-workout-list">
                {recentWorkouts.map((w) => (
                  <li key={w.id}>
                    <div className="op-workout-head">
                      <span className="op-workout-type">{w.type ?? 'Workout'}</span>
                      <span className="muted">{new Date(w.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="op-workout-meta">
                      {w.durationMin !== null && <span>{Math.round(w.durationMin)} min</span>}
                      {w.energyKcal !== null && <span>· {Math.round(w.energyKcal)} kcal</span>}
                      {w.avgHr !== null && <span>· {Math.round(w.avgHr)} bpm</span>}
                      {w.distanceKm !== null && <span>· {w.distanceKm.toFixed(2)} km</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {workouts.length === 0 && (
            <p className="op-health-empty">No sessions yet — the page waits patiently.</p>
          )}
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

      {/* ── Correlations ─────────────────────────────────────────────── */}
      <div className="op-health-correlations">
        <header className="op-health-card-head">
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
          r close to 0 = no relationship · |r| above 0.4 starts to mean something real · needs 4+ overlapping days.
        </p>
      </div>
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
              style={pct !== null ? { background: `rgba(196,135,47,${0.12 + pct * 0.68})` } : undefined}
              title={d ? `${d.date}: ${steps !== null ? Math.round(steps).toLocaleString('en-GB') + ' steps' : 'no data'}` : 'missing'}
            />
          );
        })}
      </div>
      <div className="op-heatmap-legend">
        <span className="muted">Less</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((s) => (
          <span key={s} className="op-heatmap-swatch" style={{ background: `rgba(196,135,47,${0.12 + s * 0.68})` }} />
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

function SnapshotCell({ label, value, baseline, delta }: {
  label: string;
  value: string;
  baseline: string;
  delta: { text: string; tone: 'good' | 'warn' | 'neutral' };
}) {
  return (
    <div className="op-snap-cell">
      <div className="op-snap-label">{label}</div>
      <div className="op-snap-value">{value}</div>
      <div className="op-snap-baseline muted">{baseline}</div>
      <div className={`op-snap-delta ${delta.tone}`}>{delta.text}</div>
    </div>
  );
}
