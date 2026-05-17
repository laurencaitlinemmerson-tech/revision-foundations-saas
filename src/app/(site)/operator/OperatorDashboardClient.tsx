'use client';

import { useState, useEffect, useCallback, FormEvent, CSSProperties } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FitnessReading {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  water: number;
  muscleMass: number;
  boneMass: number;
}

interface Regression {
  slope: number;      // kg per day
  intercept: number;
  r2: number;
  firstMs: number;
  predict: (date: Date) => number;
  goalDate: (goal: number) => Date | null;
}

type MetricKey = keyof Omit<FitnessReading, 'id' | 'date'>;

// ─── Seed data (Nov 2025 – May 2026 from your scale) ─────────────────────────

const SEED: FitnessReading[] = [
  { id: 's1', date: '2025-11-15T09:00:00', weight: 82.0, bmi: 33.3, bodyFat: 44.5, water: 38.8, muscleMass: 50.5, boneMass: 3.3 },
  { id: 's2', date: '2025-12-10T09:00:00', weight: 82.5, bmi: 33.5, bodyFat: 44.8, water: 38.6, muscleMass: 50.4, boneMass: 3.3 },
  { id: 's3', date: '2026-01-12T09:00:00', weight: 83.0, bmi: 33.7, bodyFat: 45.0, water: 38.4, muscleMass: 50.2, boneMass: 3.2 },
  { id: 's4', date: '2026-02-08T09:00:00', weight: 83.5, bmi: 33.9, bodyFat: 45.5, water: 38.2, muscleMass: 50.1, boneMass: 3.2 },
  { id: 's5', date: '2026-03-14T09:00:00', weight: 85.0, bmi: 34.5, bodyFat: 46.0, water: 38.0, muscleMass: 50.0, boneMass: 3.2 },
  { id: 's6', date: '2026-04-09T09:00:00', weight: 86.5, bmi: 35.1, bodyFat: 46.5, water: 37.9, muscleMass: 49.9, boneMass: 3.2 },
  { id: 's7', date: '2026-05-17T09:59:00', weight: 88.2, bmi: 35.8, bodyFat: 47.0, water: 37.9, muscleMass: 49.8, boneMass: 3.2 },
];

const STORAGE_KEY = 'op_fitness_v2';
const GOAL_KEY    = 'op_fitness_goal';
const AUTH_KEY    = 'op_authed_v2';
const AUTH_TTL    = 30 * 24 * 60 * 60 * 1000; // 30 days

// ─── Status helpers ───────────────────────────────────────────────────────────

interface Status { label: string; color: string }
const STATUS_AMBER  = '#C8700A';
const STATUS_GREEN  = '#15803d';
const STATUS_TEAL   = '#0891b2';

function weightStatus(w: number, goal: number): Status {
  if (w <= goal)       return { label: 'AT GOAL',     color: STATUS_GREEN };
  if (w <= goal * 1.1) return { label: 'ABOVE GOAL',  color: STATUS_AMBER };
  return                      { label: 'HIGH',         color: STATUS_AMBER };
}
function bmiStatus(b: number): Status {
  if (b < 18.5) return { label: 'UNDERWEIGHT', color: STATUS_AMBER };
  if (b < 25)   return { label: 'HEALTHY',     color: STATUS_GREEN };
  if (b < 30)   return { label: 'OVERWEIGHT',  color: STATUS_AMBER };
  return               { label: 'OBESE',       color: STATUS_AMBER };
}
function bodyFatStatus(f: number): Status {
  if (f < 21) return { label: 'LOW',     color: STATUS_AMBER };
  if (f < 33) return { label: 'HEALTHY', color: STATUS_GREEN };
  return             { label: 'HIGH',    color: STATUS_AMBER };
}
function waterStatus(w: number): Status {
  if (w < 45) return { label: 'LOW',    color: STATUS_AMBER };
  if (w < 60) return { label: 'NORMAL', color: STATUS_GREEN };
  return             { label: 'HIGH',   color: STATUS_AMBER };
}
function muscleStatus(m: number): Status {
  if (m >= 45) return { label: 'EXCELLENT', color: STATUS_TEAL };
  if (m >= 38) return { label: 'GOOD',      color: STATUS_GREEN };
  return              { label: 'LOW',       color: STATUS_AMBER };
}
function boneStatus(b: number): Status {
  if (b >= 3.0) return { label: 'EXCELLENT', color: STATUS_TEAL };
  if (b >= 2.5) return { label: 'NORMAL',    color: STATUS_GREEN };
  return               { label: 'LOW',       color: STATUS_AMBER };
}

// ─── Linear regression on weight ─────────────────────────────────────────────

function calcRegression(readings: FitnessReading[]): Regression | null {
  const n = readings.length;
  if (n < 2) return null;

  const firstMs = new Date(readings[0].date).getTime();
  const xs = readings.map(r => (new Date(r.date).getTime() - firstMs) / 86400000);
  const ys = readings.map(r => r.weight);

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - meanX) * (ys[i] - meanY); den += (xs[i] - meanX) ** 2; }

  const slope = den ? num / den : 0;
  const intercept = meanY - slope * meanX;

  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssRes += (ys[i] - (slope * xs[i] + intercept)) ** 2;
    ssTot += (ys[i] - meanY) ** 2;
  }
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1;

  const predict = (date: Date) => slope * ((date.getTime() - firstMs) / 86400000) + intercept;
  const goalDate = (goal: number) => {
    if (slope >= 0) return null;
    const days = (goal - intercept) / slope;
    return new Date(firstMs + days * 86400000);
  };

  return { slope, intercept, r2, firstMs, predict, goalDate };
}

// ─── SVG smooth-path helper ───────────────────────────────────────────────────

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6, cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6, cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// ─── LineChart ────────────────────────────────────────────────────────────────

function LineChart({
  readings, metric, unit, title, goalValue, decimals = 1, regression, predictDays = 0,
}: {
  readings: FitnessReading[];
  metric: MetricKey;
  unit: string;
  title: string;
  goalValue?: number;
  decimals?: number;
  regression?: Regression | null;
  predictDays?: number;
}) {
  const W = 620, H = 220;
  const pad = { t: 24, r: 48, b: 52, l: 56 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  // Prediction points (only for weight metric)
  const predPts: [number, number][] = [];
  if (regression && predictDays > 0 && metric === 'weight' && readings.length > 0) {
    const lastDate = new Date(readings[readings.length - 1].date);
    const steps = 6;
    for (let s = 1; s <= steps; s++) {
      const d = new Date(lastDate.getTime() + (predictDays / steps) * s * 86400000);
      predPts.push([d.getTime(), regression.predict(d)]);
    }
  }

  const values = readings.map(r => r[metric] as number);
  const predValues = predPts.map(p => p[1]);
  const allVals = [...values, ...predValues, ...(goalValue !== undefined ? [goalValue] : [])];
  const rawMin = Math.min(...allVals), rawMax = Math.max(...allVals);
  const span = rawMax - rawMin || 1;
  const minV = rawMin - span * 0.12, maxV = rawMax + span * 0.12;

  // Time-based x axis when predictions are shown, otherwise index-based
  const useTime = predPts.length > 0;
  const firstMs  = useTime ? new Date(readings[0].date).getTime() : 0;
  const lastPredMs = useTime && predPts.length ? predPts[predPts.length - 1][0] : 0;
  const totalMs  = useTime ? (lastPredMs - firstMs) : 1;

  const xOfMs  = (ms: number) => pad.l + ((ms - firstMs) / totalMs) * pw;
  const xOfIdx = (i: number)  => pad.l + (readings.length > 1 ? (i / (readings.length - 1)) * pw : pw / 2);
  const xOf    = (i: number)  => useTime ? xOfMs(new Date(readings[i].date).getTime()) : xOfIdx(i);
  const yOf    = (v: number)  => pad.t + (1 - (v - minV) / (maxV - minV)) * ph;

  const histPts: [number, number][] = readings.map((_, i) => [xOf(i), yOf(values[i])]);
  const svgPredPts: [number, number][] = predPts.map(([ms, v]) => [xOfMs(ms), yOf(v)]);

  const linePath   = smoothPath(histPts);
  const predPath   = svgPredPts.length ? smoothPath([histPts[histPts.length - 1], ...svgPredPts]) : '';
  const areaPoints = histPts.length
    ? `${pad.l},${pad.t + ph} ${histPts.map(([x, y]) => `${x},${y}`).join(' ')} ${histPts[histPts.length - 1][0]},${pad.t + ph} Z`
    : '';

  const ticks = [0, 1, 2, 3].map(i => minV + (i / 3) * (maxV - minV));

  const monthLabel = (date: Date) => date.toLocaleDateString('en-GB', { month: 'short' });

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 6px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 12, letterSpacing: '0.09em', color: '#1A1815', marginBottom: 2 }}>{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* Grid & y-axis labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} y1={yOf(t)} x2={pad.l + pw} y2={yOf(t)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={pad.l - 6} y={yOf(t) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">{t.toFixed(decimals)}</text>
          </g>
        ))}
        {/* Area fill */}
        {areaPoints && <path d={areaPoints} fill="rgba(20,184,166,0.12)" />}
        {/* Goal line */}
        {goalValue !== undefined && (
          <g>
            <line x1={pad.l} y1={yOf(goalValue)} x2={pad.l + pw} y2={yOf(goalValue)} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6,4" />
            <rect x={pad.l + 5} y={yOf(goalValue) - 15} width={56} height={16} rx={4} fill="#F59E0B" />
            <text x={pad.l + 33} y={yOf(goalValue) - 3} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">Goal {goalValue}</text>
          </g>
        )}
        {/* Prediction fill */}
        {svgPredPts.length > 0 && histPts.length > 0 && (
          <path
            d={`M ${histPts[histPts.length-1][0]},${pad.t+ph} L ${histPts[histPts.length-1][0]},${histPts[histPts.length-1][1]} ${svgPredPts.map(([x,y])=>`L ${x},${y}`).join(' ')} L ${svgPredPts[svgPredPts.length-1][0]},${pad.t+ph} Z`}
            fill="rgba(20,184,166,0.05)"
          />
        )}
        {/* Prediction line */}
        {predPath && <path d={predPath} fill="none" stroke="#14B8A6" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" />}
        {/* Actual line */}
        {linePath && <path d={linePath} fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        {/* Data points */}
        {histPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#14B8A6" stroke="#fff" strokeWidth="2" />
        ))}
        {/* Last prediction point */}
        {svgPredPts.length > 0 && (
          <circle cx={svgPredPts[svgPredPts.length-1][0]} cy={svgPredPts[svgPredPts.length-1][1]} r="4" fill="#14B8A6" stroke="#fff" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" />
        )}
        {/* Latest value label */}
        {histPts.length > 0 && (
          <text x={histPts[histPts.length-1][0] + 7} y={histPts[histPts.length-1][1] - 9} fontSize="13" fill="#14B8A6" fontWeight="700">
            {values[values.length-1].toFixed(decimals)}{unit}
          </text>
        )}
        {/* Predicted end value label */}
        {svgPredPts.length > 0 && (
          <text x={svgPredPts[svgPredPts.length-1][0] + 6} y={svgPredPts[svgPredPts.length-1][1] - 8} fontSize="11" fill="#9ca3af" fontWeight="600">
            {predValues[predValues.length-1].toFixed(decimals)}{unit}
          </text>
        )}
        {/* X-axis labels */}
        {readings.map((r, i) => (
          <text key={i} x={xOf(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#9ca3af">{monthLabel(new Date(r.date))}</text>
        ))}
        {svgPredPts.length > 0 && predPts.length > 0 && (
          <text x={svgPredPts[svgPredPts.length-1][0]} y={H - 10} textAnchor="middle" fontSize="11" fill="#14B8A6" opacity="0.6">
            {monthLabel(new Date(predPts[predPts.length-1][0]))}
          </text>
        )}
        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t+ph} stroke="#e5e7eb" strokeWidth="1" />
        <line x1={pad.l} y1={pad.t+ph} x2={pad.l+pw} y2={pad.t+ph} stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, unit, status, icon, delta }: {
  label: string; value: number; unit: string; status: Status; icon: string; delta?: number;
}) {
  const disp = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: '#5A5750' }}>{label}</span>
      </div>
      <div style={{ borderBottom: `2.5px solid ${status.color}`, width: 30, marginTop: 1 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: '#1A1815', lineHeight: 1 }}>{disp}</span>
        <span style={{ fontSize: 13, color: '#5A5750' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: status.color, letterSpacing: '0.05em' }}>{status.label}</span>
        {delta !== undefined && (
          <span style={{ fontSize: 11, color: delta > 0 ? '#ef4444' : '#15803d' }}>
            {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}{unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Password Screen ──────────────────────────────────────────────────────────

function PasswordScreen({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/operator/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        onAuth(pw);
      } else {
        setError('Incorrect password.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1815', marginBottom: 6, fontFamily: 'Playfair Display, serif' }}>Operator Dashboard</h1>
        <p style={{ fontSize: 13, color: '#5A5750', marginBottom: 28 }}>Private access only.</p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            autoFocus
            style={{ ...inp, border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={primaryBtn}>{loading ? 'Verifying…' : 'Enter Dashboard'}</button>
        </form>
      </div>
    </div>
  );
}

// ─── Add Reading Modal ────────────────────────────────────────────────────────

function AddReadingModal({ last, onAdd, onClose }: { last: FitnessReading; onAdd: (r: FitnessReading) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    weight: String(last.weight), bmi: String(last.bmi), bodyFat: String(last.bodyFat),
    water: String(last.water), muscleMass: String(last.muscleMass), boneMass: String(last.boneMass),
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now().toString(),
      date: new Date(form.date).toISOString(),
      weight: parseFloat(form.weight), bmi: parseFloat(form.bmi),
      bodyFat: parseFloat(form.bodyFat), water: parseFloat(form.water),
      muscleMass: parseFloat(form.muscleMass), boneMass: parseFloat(form.boneMass),
    });
    onClose();
  };

  const fields = [
    { k: 'weight', l: 'Weight (kg)', s: '0.1' }, { k: 'bmi', l: 'BMI', s: '0.1' },
    { k: 'bodyFat', l: 'Body Fat %', s: '0.1' }, { k: 'water', l: 'Water %', s: '0.1' },
    { k: 'muscleMass', l: 'Muscle Mass %', s: '0.1' }, { k: 'boneMass', l: 'Bone Mass %', s: '0.01' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '30px 26px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1815', margin: 0 }}>Add Reading</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5A5750' }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={lbl}>Date & Time</label>
            <input type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} required style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {fields.map(f => (
              <div key={f.k}>
                <label style={lbl}>{f.l}</label>
                <input type="number" step={f.s} value={form[f.k as keyof typeof form]} onChange={e => set(f.k, e.target.value)} required style={inp} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
            <button type="submit" style={{ ...primaryBtn, flex: 1, background: '#14B8A6' }}>Save Reading</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ latest, prev, goal }: { latest: FitnessReading; prev?: FitnessReading; goal: number }) {
  const cards = [
    { label: 'WEIGHT',       value: latest.weight,     unit: 'kg', status: weightStatus(latest.weight, goal), icon: '⚖️',  delta: prev ? latest.weight - prev.weight : undefined },
    { label: 'BMI',          value: latest.bmi,        unit: '',   status: bmiStatus(latest.bmi),             icon: '📊',  delta: prev ? latest.bmi - prev.bmi : undefined },
    { label: 'BODY FAT %',   value: latest.bodyFat,    unit: '%',  status: bodyFatStatus(latest.bodyFat),     icon: '🔥',  delta: prev ? latest.bodyFat - prev.bodyFat : undefined },
    { label: 'WATER',        value: latest.water,      unit: '%',  status: waterStatus(latest.water),         icon: '💧',  delta: prev ? latest.water - prev.water : undefined },
    { label: 'MUSCLE MASS %',value: latest.muscleMass, unit: '%',  status: muscleStatus(latest.muscleMass),   icon: '💪',  delta: prev ? latest.muscleMass - prev.muscleMass : undefined },
    { label: 'BONE MASS %',  value: latest.boneMass,   unit: '%',  status: boneStatus(latest.boneMass),       icon: '🦴',  delta: prev ? latest.boneMass - prev.boneMass : undefined },
  ];

  const toGo = latest.weight - goal;

  return (
    <div>
      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 18 }}>
        {new Date(latest.date).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>

      {/* Goal progress */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1815' }}>Goal Progress</span>
          <span style={{ fontSize: 13, color: '#5A5750' }}>{latest.weight} → {goal} kg</span>
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, Math.max(2, (toGo / latest.weight) * 100))}%`,
            background: 'linear-gradient(90deg,#14B8A6,#0891B2)', height: '100%', borderRadius: 999,
          }} />
        </div>
        <p style={{ fontSize: 12, color: '#5A5750', marginTop: 6 }}>
          {toGo > 0 ? `${toGo.toFixed(1)} kg to go` : '🎉 Goal reached!'}
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {cards.map(c => <MetricCard key={c.label} {...c} />)}
      </div>

      {/* BMI guide */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', marginTop: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#5A5750', marginBottom: 8, letterSpacing: '0.08em' }}>BMI REFERENCE</p>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 7, marginBottom: 7 }}>
          <div style={{ flex: 18.5, background: '#60a5fa' }} /><div style={{ flex: 6.4, background: '#34d399' }} />
          <div style={{ flex: 5, background: '#fbbf24' }} /><div style={{ flex: 10, background: '#f87171' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>
          <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
        </div>
        <p style={{ fontSize: 12, color: '#5A5750' }}>
          Your BMI: <strong style={{ color: '#1A1815' }}>{latest.bmi.toFixed(1)}</strong> — healthy range is 18.5–24.9
        </p>
      </div>
    </div>
  );
}

// ─── Predictions Tab ──────────────────────────────────────────────────────────

function PredictionsTab({ readings, goal }: { readings: FitnessReading[]; goal: number }) {
  const reg = calcRegression(readings);
  if (!reg || readings.length < 2) {
    return <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Need at least 2 readings to calculate predictions.</p>;
  }

  const kgPerWeek = reg.slope * 7;
  const gaining   = kgPerWeek > 0;
  const latest    = readings[readings.length - 1];
  const now       = new Date(latest.date);

  const project = (days: number) => reg.predict(new Date(now.getTime() + days * 86400000));
  const proj30  = project(30);
  const proj90  = project(90);
  const proj180 = project(180);
  const proj365 = project(365);

  // Rate needed to hit goal in N months
  const rateNeeded = (months: number) => {
    const kgToLose = latest.weight - goal;
    const weeks = months * 4.33;
    return -kgToLose / weeks; // negative = loss
  };

  const gDate = reg.goalDate(goal);

  const confidence = reg.r2 >= 0.85 ? 'High' : reg.r2 >= 0.65 ? 'Moderate' : 'Low';
  const confColor  = reg.r2 >= 0.85 ? STATUS_GREEN : reg.r2 >= 0.65 ? STATUS_AMBER : '#ef4444';

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Trend summary */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#5A5750', letterSpacing: '0.08em', marginBottom: 12 }}>CURRENT TREND</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Rate per week</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: gaining ? '#ef4444' : STATUS_GREEN, lineHeight: 1 }}>
              {gaining ? '+' : ''}{kgPerWeek.toFixed(2)} kg
            </p>
            <p style={{ fontSize: 12, color: '#5A5750', marginTop: 4 }}>{gaining ? '⬆ Gaining weight' : '⬇ Losing weight'}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Trend confidence</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: confColor, lineHeight: 1 }}>{confidence}</p>
            <p style={{ fontSize: 12, color: '#5A5750', marginTop: 4 }}>R² = {(reg.r2 * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Projections */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#5A5750', letterSpacing: '0.08em', marginBottom: 12 }}>
          IF CURRENT TREND CONTINUES
        </p>
        {gaining && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: 0 }}>
              ⚠️ You are gaining weight at this rate. Projections show where you&apos;ll be if nothing changes.
            </p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: '1 month',  val: proj30,  days: 30 },
            { label: '3 months', val: proj90,  days: 90 },
            { label: '6 months', val: proj180, days: 180 },
            { label: '1 year',   val: proj365, days: 365 },
          ].map((row, i) => {
            const delta = row.val - latest.weight;
            const dateStr = fmt(new Date(now.getTime() + row.days * 86400000));
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1815', margin: 0 }}>{row.label}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{dateStr}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#1A1815', margin: 0 }}>{row.val.toFixed(1)} kg</p>
                  <p style={{ fontSize: 12, color: delta > 0 ? '#ef4444' : STATUS_GREEN, margin: 0 }}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)} kg
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal analysis */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#5A5750', letterSpacing: '0.08em', marginBottom: 12 }}>
          REACHING YOUR {goal} KG GOAL
        </p>
        {gDate && !gaining ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
            <p style={{ fontSize: 14, color: STATUS_GREEN, fontWeight: 700, margin: '0 0 4px' }}>🎯 Estimated goal date</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1815', margin: 0 }}>{fmt(gDate)}</p>
          </div>
        ) : (
          <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: STATUS_AMBER, fontWeight: 600, margin: 0 }}>
              At your current rate you are moving <em>away</em> from your goal. You need to reverse direction.
            </p>
          </div>
        )}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#5A5750', marginBottom: 8, letterSpacing: '0.06em' }}>REQUIRED RATE TO HIT GOAL</p>
        {[
          { label: 'In 3 months',  rate: rateNeeded(3)  },
          { label: 'In 6 months',  rate: rateNeeded(6)  },
          { label: 'In 12 months', rate: rateNeeded(12) },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
            <span style={{ fontSize: 13, color: '#5A5750' }}>{row.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: STATUS_TEAL }}>
              {row.rate.toFixed(2)} kg/week
            </span>
          </div>
        ))}
      </div>

      {/* Weight prediction chart */}
      <LineChart
        readings={readings}
        metric="weight"
        unit="kg"
        title="WEIGHT — TREND & 90-DAY PROJECTION"
        goalValue={goal}
        regression={reg}
        predictDays={90}
      />
    </div>
  );
}

// ─── Charts Tab ───────────────────────────────────────────────────────────────

function ChartsTab({ readings, goal, regression }: { readings: FitnessReading[]; goal: number; regression: Regression | null }) {
  const charts: { metric: MetricKey; title: string; unit: string; goalValue?: number; decimals?: number }[] = [
    { metric: 'weight',     title: 'WEIGHT',      unit: 'kg', goalValue: goal },
    { metric: 'bmi',        title: 'BMI',          unit: '' },
    { metric: 'bodyFat',    title: 'BODY FAT %',   unit: '%' },
    { metric: 'water',      title: 'WATER %',      unit: '%' },
    { metric: 'muscleMass', title: 'MUSCLE MASS %',unit: '%' },
    { metric: 'boneMass',   title: 'BONE MASS %',  unit: '%', decimals: 2 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {charts.map(c => (
        <LineChart key={c.metric} readings={readings} {...c} regression={c.metric === 'weight' ? regression : null} predictDays={c.metric === 'weight' ? 90 : 0} />
      ))}
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ readings, onDelete }: { readings: FitnessReading[]; onDelete: (id: string) => void }) {
  const sorted = [...readings].reverse();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map(r => (
        <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1815' }}>
              {new Date(r.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            {!r.id.startsWith('s') && (
              <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', padding: '2px 8px' }}>
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              ['Weight', `${r.weight}kg`], ['BMI', r.bmi.toFixed(1)], ['Body Fat', `${r.bodyFat}%`],
              ['Water', `${r.water}%`], ['Muscle', `${r.muscleMass}%`], ['Bone', `${r.boneMass}%`],
            ].map(([l, v]) => (
              <div key={l}>
                <p style={{ fontSize: 9, color: '#9ca3af', margin: '0 0 1px', fontWeight: 700, letterSpacing: '0.06em' }}>{(l as string).toUpperCase()}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1815', margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {sorted.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>No readings yet.</p>}
    </div>
  );
}

// ─── Shared style constants ───────────────────────────────────────────────────

const inp: CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#FAFAF8', color: '#1A1815', outline: 'none', boxSizing: 'border-box' };
const lbl: CSSProperties = { fontSize: 11, fontWeight: 600, color: '#5A5750', display: 'block', marginBottom: 5 };
const primaryBtn: CSSProperties = { flex: 1, background: '#1A1815', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const ghostBtn: CSSProperties  = { flex: 1, background: '#fff', color: '#5A5750', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' };

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiHeaders(pw: string) {
  return { 'Content-Type': 'application/json', 'x-operator-pw': pw };
}

async function apiLoad(pw: string): Promise<FitnessReading[] | null> {
  try {
    const res = await fetch('/api/operator/fitness', { headers: apiHeaders(pw) });
    if (!res.ok) return null;
    const j = await res.json();
    if (j.setup_required || !Array.isArray(j.readings)) return null;
    return j.readings as FitnessReading[];
  } catch {
    return null;
  }
}

async function apiSave(pw: string, r: FitnessReading): Promise<string | null> {
  try {
    const res = await fetch('/api/operator/fitness', { method: 'POST', headers: apiHeaders(pw), body: JSON.stringify(r) });
    if (!res.ok) return null;
    const j = await res.json();
    return j.reading?.id ?? null;
  } catch {
    return null;
  }
}

async function apiDel(pw: string, id: string): Promise<void> {
  try {
    await fetch(`/api/operator/fitness?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: apiHeaders(pw) });
  } catch { /* silent */ }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OperatorDashboardClient() {
  const [authed, setAuthed]           = useState(false);
  const [opPw, setOpPw]               = useState('');
  const [tab, setTab]                 = useState<'overview' | 'charts' | 'predict' | 'history'>('overview');
  const [readings, setReadings]       = useState<FitnessReading[]>([]);
  const [goal, setGoal]               = useState(60.0);
  const [showAdd, setShowAdd]         = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput]     = useState('60');
  const [cloudOk, setCloudOk]        = useState<boolean | null>(null); // null=unknown, true=ok, false=local-only
  const [syncing, setSyncing]         = useState(false);

  const saveLocal = useCallback((rs: FitnessReading[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rs));
  }, []);

  const loadData = useCallback(async (pw: string) => {
    // Start with local data immediately so the UI is responsive
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const local: FitnessReading[] = localRaw ? JSON.parse(localRaw) : SEED;
    setReadings(local);
    if (!localRaw) saveLocal(local);

    setSyncing(true);
    const cloud = await apiLoad(pw);
    setSyncing(false);

    if (cloud === null) {
      setCloudOk(false);
      return;
    }
    setCloudOk(true);

    if (cloud.length === 0) {
      // Seed cloud with local data on first cloud-load
      for (const r of local) {
        const newId = await apiSave(pw, r);
        if (newId) r.id = newId;
      }
      setReadings([...local]);
      saveLocal(local);
    } else {
      setReadings(cloud);
      saveLocal(cloud);
    }
  }, [saveLocal]);

  // Restore auth (localStorage, 30-day expiry) on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const g = localStorage.getItem(GOAL_KEY);
    if (g) { setGoal(parseFloat(g)); setGoalInput(g); }

    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { ts, pw } = JSON.parse(stored) as { ts: number; pw: string };
        if (Date.now() - ts < AUTH_TTL) {
          setAuthed(true);
          setOpPw(pw);
          loadData(pw);
        } else {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, [loadData]);

  const handleAuth = useCallback(async (pw: string) => {
    setOpPw(pw);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now(), pw }));
    setAuthed(true);
    await loadData(pw);
  }, [loadData]);

  const handleAdd = useCallback(async (r: FitnessReading) => {
    // Optimistic local update
    const next = [...readings, r].sort((a, b) => a.date.localeCompare(b.date));
    setReadings(next);
    saveLocal(next);

    // Persist to cloud, update ID if returned
    if (opPw) {
      const newId = await apiSave(opPw, r);
      if (newId && newId !== r.id) {
        const updated = next.map(x => x.id === r.id ? { ...x, id: newId } : x);
        setReadings(updated);
        saveLocal(updated);
      }
    }
  }, [readings, opPw, saveLocal]);

  const handleDelete = useCallback(async (id: string) => {
    const next = readings.filter(r => r.id !== id);
    setReadings(next);
    saveLocal(next);
    if (opPw) await apiDel(opPw, id);
  }, [readings, opPw, saveLocal]);

  const handleGoalSave = () => {
    const g = parseFloat(goalInput);
    if (!isNaN(g) && g > 0) {
      setGoal(g);
      localStorage.setItem(GOAL_KEY, String(g));
    }
    setEditingGoal(false);
  };

  if (!authed) return <PasswordScreen onAuth={handleAuth} />;

  const latest = readings[readings.length - 1];
  const prev   = readings.length >= 2 ? readings[readings.length - 2] : undefined;
  const reg    = calcRegression(readings);

  const TABS = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'predict'  as const, label: 'Predictions' },
    { key: 'charts'   as const, label: 'Charts' },
    { key: 'history'  as const, label: 'History' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ background: '#1A1815', padding: '20px 20px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, color: '#6b7280', margin: '0 0 3px', letterSpacing: '0.1em', fontWeight: 600 }}>OPERATOR</p>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Playfair Display, serif' }}>
              Fitness Tracker
              {syncing && <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 10, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>syncing…</span>}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {cloudOk !== null && (
              <span style={{ fontSize: 10, color: cloudOk ? '#34d399' : '#6b7280', fontWeight: 600 }}>
                {cloudOk ? '☁ cloud' : '💾 local'}
              </span>
            )}
            {editingGoal ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number" step="0.1" value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  style={{ width: 68, padding: '6px 8px', borderRadius: 8, border: 'none', fontSize: 14, background: '#fff', color: '#1A1815' }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleGoalSave(); if (e.key === 'Escape') setEditingGoal(false); }}
                />
                <button onClick={handleGoalSave} style={{ background: '#14B8A6', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
              </div>
            ) : (
              <button onClick={() => setEditingGoal(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '7px 12px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                🎯 {goal}kg
              </button>
            )}
            <button onClick={() => setShowAdd(true)} style={{ background: '#14B8A6', border: 'none', borderRadius: 10, padding: '8px 15px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', padding: '0 12px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '13px 4px', border: 'none', background: 'none', fontSize: 13,
              fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? '#14B8A6' : '#5A5750',
              borderBottom: tab === t.key ? '2.5px solid #14B8A6' : '2.5px solid transparent',
              cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '22px 14px' }}>
        {latest ? (
          <>
            {tab === 'overview' && <OverviewTab latest={latest} prev={prev} goal={goal} />}
            {tab === 'predict'  && <PredictionsTab readings={readings} goal={goal} />}
            {tab === 'charts'   && <ChartsTab readings={readings} goal={goal} regression={reg} />}
            {tab === 'history'  && <HistoryTab readings={readings} onDelete={handleDelete} />}
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 0' }}>No readings yet — tap + Add to get started.</p>
        )}
      </div>

      {/* Add modal */}
      {showAdd && latest && <AddReadingModal last={latest} onAdd={handleAdd} onClose={() => setShowAdd(false)} />}

      {/* Lock */}
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 14px' }}>
        <button
          onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); setOpPw(''); }}
          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px', color: '#9ca3af', fontSize: 12, cursor: 'pointer', width: '100%' }}
        >
          🔒 Lock Dashboard
        </button>
      </div>
    </div>
  );
}
