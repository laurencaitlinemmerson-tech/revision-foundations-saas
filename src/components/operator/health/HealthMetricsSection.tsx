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
          <span className="muted">Loading…</span>
        </header>
      </section>
    );
  }

  if (status === 'empty') {
    return (
      <section className="op-health-section">
        <header className="op-health-head">
          <span className="op-health-kicker">Apple Health stream</span>
          <span className="muted">No data yet</span>
        </header>
        <div className="op-health-empty-box">
          <p>
            Nothing has synced from Health Auto Export yet. Once a payload arrives at{' '}
            <code>/api/operator/fitness/auto-sync</code> with metrics enabled (steps, active energy,
            exercise minutes, resting HR, HRV, sleep analysis, workouts) this section fills in.
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
          <span className="muted">Error</span>
        </header>
        <div className="op-health-empty-box">
          <p>Could not load health data: {errorMsg ?? 'unknown error'}</p>
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
          <span className="muted">Latest {latest?.date}</span>
          <span className="op-health-head-dot">·</span>
          <span className="muted">{days.length} days on file</span>
        </div>
      </header>

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
                Nothing from MyFitnessPal yet. In MFP, turn on{' '}
                <em>Settings → Apps &amp; Devices → Apple Health</em> for at least <em>Calories</em>,{' '}
                <em>Protein</em>, <em>Carbs</em>, <em>Fat</em>. Then in Health Auto Export, enable
                Dietary Energy + macros on the same automation. Next sync fills this in.
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
            <p className="op-health-empty">No workouts synced yet.</p>
          )}
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
