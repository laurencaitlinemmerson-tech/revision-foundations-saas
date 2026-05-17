'use client';

import { useEffect, useMemo, useState } from 'react';

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

interface DailyMetrics {
  date: string;
  activity: ActivityMetrics;
  heart: HeartMetrics;
  sleep: SleepMetrics;
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

function correlationLabel(r: number | null): { label: string; tone: 'good' | 'warn' | 'neutral' } {
  if (r === null) return { label: 'Not enough data yet', tone: 'neutral' };
  const abs = Math.abs(r);
  if (abs < 0.2) return { label: `No clear link (r ${r.toFixed(2)})`, tone: 'neutral' };
  if (abs < 0.4) return { label: `Weak ${r >= 0 ? 'positive' : 'inverse'} link (r ${r.toFixed(2)})`, tone: 'neutral' };
  if (abs < 0.7) return { label: `Moderate ${r >= 0 ? 'positive' : 'inverse'} link (r ${r.toFixed(2)})`, tone: r >= 0 ? 'good' : 'warn' };
  return { label: `Strong ${r >= 0 ? 'positive' : 'inverse'} link (r ${r.toFixed(2)})`, tone: r >= 0 ? 'good' : 'warn' };
}

// ─── tiny spark line ────────────────────────────────────────────────────────

function Spark({ values, width = 96, height = 28 }: { values: (number | null)[]; width?: number; height?: number }) {
  const nums = values.map((v) => (v === null || !Number.isFinite(v) ? null : v));
  const valid = nums.filter((v): v is number => v !== null);
  if (valid.length < 2) {
    return <svg width={width} height={height} aria-hidden="true" />;
  }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  const step = width / Math.max(nums.length - 1, 1);
  const points = nums.map((v, i) => {
    if (v === null) return null;
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = points
    .filter((p): p is string => p !== null)
    .reduce((acc, p, i) => acc + (i === 0 ? `M${p}` : `L${p}`), '');
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}

// ─── sleep stage bar ────────────────────────────────────────────────────────

function SleepStages({ s }: { s: SleepMetrics }) {
  const stages = [
    { key: 'deep', label: 'Deep', value: s.deepMin, color: '#3a4a6b' },
    { key: 'rem', label: 'REM', value: s.remMin, color: '#6b7a99' },
    { key: 'core', label: 'Core', value: s.coreMin, color: '#a8b3c5' },
    { key: 'awake', label: 'Awake', value: s.awakeMin, color: '#d4c8b8' },
  ];
  const total = stages.reduce((acc, st) => acc + (st.value ?? 0), 0);
  if (total === 0) {
    return <p className="op-health-empty">No stage data for this night.</p>;
  }
  return (
    <div className="op-sleep-stages">
      <div className="op-sleep-bar" role="img" aria-label="Sleep stage breakdown">
        {stages.map((st) => {
          const pct = ((st.value ?? 0) / total) * 100;
          if (pct === 0) return null;
          return (
            <span
              key={st.key}
              className="op-sleep-seg"
              style={{ width: `${pct.toFixed(2)}%`, background: st.color }}
              title={`${st.label}: ${formatMinutes(st.value)}`}
            />
          );
        })}
      </div>
      <ul className="op-sleep-legend">
        {stages.map((st) => (
          <li key={st.key}>
            <span className="op-sleep-dot" style={{ background: st.color }} />
            <span className="op-sleep-stage-label">{st.label}</span>
            <span className="op-sleep-stage-value">{formatMinutes(st.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
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
      fetch('/api/operator/workouts?limit=30', { headers: { 'x-operator-pw': opPw } }).then((r) => r.json()),
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
  const last30 = useMemo(() => days.slice(-30), [days]);
  const latest = days[days.length - 1] ?? null;
  const previousNight = days[days.length - 2] ?? null;

  // 7-day rollups
  const steps7 = sum(last7.map((d) => d.activity.steps));
  const stepsAvg7 = avg(last7.map((d) => d.activity.steps));
  const energy7 = sum(last7.map((d) => d.activity.activeEnergyKcal));
  const exerciseMin7 = sum(last7.map((d) => d.activity.exerciseMinutes));
  const restingHrAvg7 = avg(last7.map((d) => d.heart.restingHr));
  const hrvAvg7 = avg(last7.map((d) => d.heart.hrvMs));
  const sleepAvg7 = avg(last7.map((d) => d.sleep.totalMin));

  // Workouts this week
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, []);
  const workoutsThisWeek = workouts.filter((w) => w.startedAt >= weekAgo);

  // ─── Correlations (30-day window) ──────────────────────────────────────────
  const correlations = useMemo(() => {
    // Sleep → next-day HRV (shift HRV by +1)
    const sleepNights: number[] = [];
    const nextHrv: number[] = [];
    for (let i = 0; i < last30.length - 1; i++) {
      const a = last30[i].sleep.totalMin;
      const b = last30[i + 1].heart.hrvMs;
      if (a !== null && b !== null) { sleepNights.push(a); nextHrv.push(b); }
    }
    const sleepHrv = pearson(sleepNights, nextHrv);

    // Steps → weight trend (use any reading we have on the same day)
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

    // Resting HR → exercise minutes (inverse expected: more exercise → lower RHR)
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
        <p className="op-health-empty">
          Nothing has synced yet. Make sure Health Auto Export is configured to POST to{' '}
          <code>/api/operator/fitness/auto-sync</code> with metrics enabled (steps, active energy,
          exercise minutes, resting HR, HRV, sleep analysis, workouts).
        </p>
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
        <p className="op-health-empty">Could not load health data: {errorMsg ?? 'unknown error'}</p>
      </section>
    );
  }

  return (
    <section className="op-health-section">
      <header className="op-health-head">
        <span className="op-health-kicker">Apple Health stream</span>
        <span className="muted">
          {latest ? `Latest ${latest.date}` : '—'} · {days.length} days on file
        </span>
      </header>

      <div className="op-health-grid">
        {/* ── Activity ─────────────────────────────────────────────────── */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Activity</span>
            <span className="muted">7-day</span>
          </header>
          <div className="op-health-primary">
            <div className="op-health-num">{fmtNum(latest?.activity.steps ?? null)}</div>
            <div className="op-health-unit">steps today</div>
          </div>
          <div className="op-health-spark">
            <Spark values={last7.map((d) => d.activity.steps)} />
          </div>
          <dl className="op-health-stats">
            <div><dt>7-day avg</dt><dd>{fmtNum(stepsAvg7, 0)}</dd></div>
            <div><dt>Week total</dt><dd>{fmtNum(steps7, 0)}</dd></div>
            <div><dt>Active kcal (7d)</dt><dd>{fmtNum(energy7, 0)}</dd></div>
            <div><dt>Exercise (7d)</dt><dd>{formatMinutes(exerciseMin7)}</dd></div>
          </dl>
        </article>

        {/* ── Heart ────────────────────────────────────────────────────── */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Heart</span>
            <span className="muted">7-day</span>
          </header>
          <div className="op-health-primary">
            <div className="op-health-num">{fmtNum(latest?.heart.restingHr ?? null)}</div>
            <div className="op-health-unit">resting bpm</div>
          </div>
          <div className="op-health-spark">
            <Spark values={last7.map((d) => d.heart.restingHr)} />
          </div>
          <dl className="op-health-stats">
            <div><dt>RHR avg (7d)</dt><dd>{fmtNum(restingHrAvg7, 0, ' bpm')}</dd></div>
            <div><dt>HRV avg (7d)</dt><dd>{fmtNum(hrvAvg7, 0, ' ms')}</dd></div>
            <div><dt>Walking HR</dt><dd>{fmtNum(latest?.heart.walkingHrAvg ?? null, 0, ' bpm')}</dd></div>
            <div><dt>VO₂ max</dt><dd>{fmtNum(latest?.heart.vo2Max ?? null, 1)}</dd></div>
          </dl>
        </article>

        {/* ── Sleep ────────────────────────────────────────────────────── */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Sleep</span>
            <span className="muted">Last night</span>
          </header>
          <div className="op-health-primary">
            <div className="op-health-num">{formatMinutes(latest?.sleep.totalMin ?? null)}</div>
            <div className="op-health-unit">asleep</div>
          </div>
          {latest && <SleepStages s={latest.sleep} />}
          <dl className="op-health-stats">
            <div><dt>In bed</dt><dd>{formatMinutes(latest?.sleep.inBedMin ?? null)}</dd></div>
            <div><dt>Awake</dt><dd>{formatMinutes(latest?.sleep.awakeMin ?? null)}</dd></div>
            <div><dt>7-day avg</dt><dd>{formatMinutes(sleepAvg7)}</dd></div>
            <div><dt>vs prev night</dt><dd>
              {latest?.sleep.totalMin !== null && latest?.sleep.totalMin !== undefined && previousNight?.sleep.totalMin
                ? `${(latest.sleep.totalMin - previousNight.sleep.totalMin) >= 0 ? '+' : ''}${Math.round(latest.sleep.totalMin - previousNight.sleep.totalMin)}m`
                : '—'}
            </dd></div>
          </dl>
        </article>

        {/* ── Workouts ─────────────────────────────────────────────────── */}
        <article className="op-health-card">
          <header className="op-health-card-head">
            <span className="op-health-card-label">Workouts</span>
            <span className="muted">{workoutsThisWeek.length} this week</span>
          </header>
          {workouts.length === 0 ? (
            <p className="op-health-empty">No workouts synced yet.</p>
          ) : (
            <ul className="op-workout-list">
              {workouts.slice(0, 5).map((w) => (
                <li key={w.id}>
                  <div className="op-workout-head">
                    <span className="op-workout-type">{w.type ?? 'Workout'}</span>
                    <span className="muted">{new Date(w.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="op-workout-meta">
                    <span>{fmtNum(w.durationMin, 0)} min</span>
                    {w.energyKcal !== null && <span>· {fmtNum(w.energyKcal, 0)} kcal</span>}
                    {w.avgHr !== null && <span>· {fmtNum(w.avgHr, 0)} bpm avg</span>}
                    {w.distanceKm !== null && <span>· {fmtNum(w.distanceKm, 2)} km</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      {/* ── Correlations ───────────────────────────────────────────────── */}
      <div className="op-health-correlations">
        <header className="op-health-card-head">
          <span className="op-health-card-label">Correlations · last 30 days</span>
          <span className="muted">Pearson r</span>
        </header>
        <ul className="op-corr-list">
          <li>
            <span className="op-corr-q">Does better sleep boost next-day HRV?</span>
            <span className={`op-corr-a ${correlationLabel(correlations.sleepHrv).tone}`}>
              {correlationLabel(correlations.sleepHrv).label}
            </span>
          </li>
          <li>
            <span className="op-corr-q">Do more steps move the scale?</span>
            <span className={`op-corr-a ${correlationLabel(correlations.stepsWeight === null ? null : -correlations.stepsWeight).tone}`}>
              {correlations.stepsWeight === null ? 'Not enough data yet' : `${correlations.stepsWeight < 0 ? 'More steps → lower weight' : 'More steps → higher weight'} (r ${correlations.stepsWeight.toFixed(2)})`}
            </span>
          </li>
          <li>
            <span className="op-corr-q">Does exercise lower resting HR?</span>
            <span className={`op-corr-a ${correlationLabel(correlations.exerciseRhr === null ? null : -correlations.exerciseRhr).tone}`}>
              {correlations.exerciseRhr === null ? 'Not enough data yet' : `${correlations.exerciseRhr < 0 ? 'More exercise → lower RHR' : 'More exercise → higher RHR'} (r ${correlations.exerciseRhr.toFixed(2)})`}
            </span>
          </li>
        </ul>
        <p className="op-corr-note">
          r near 0 = no link · |r| &gt; 0.4 starts to mean something · needs 4+ overlapping days to compute.
        </p>
      </div>
    </section>
  );
}
