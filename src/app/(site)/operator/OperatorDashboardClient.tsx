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

type MetricKey = keyof Omit<FitnessReading, 'id' | 'date'>;

// ─── Seed data (from your scale readings Nov 2025 – May 2026) ─────────────────

const SEED_READINGS: FitnessReading[] = [
  { id: 's1', date: '2025-11-15T09:00:00', weight: 82.0, bmi: 33.3, bodyFat: 44.5, water: 38.8, muscleMass: 50.5, boneMass: 3.3 },
  { id: 's2', date: '2025-12-10T09:00:00', weight: 82.5, bmi: 33.5, bodyFat: 44.8, water: 38.6, muscleMass: 50.4, boneMass: 3.3 },
  { id: 's3', date: '2026-01-12T09:00:00', weight: 83.0, bmi: 33.7, bodyFat: 45.0, water: 38.4, muscleMass: 50.2, boneMass: 3.2 },
  { id: 's4', date: '2026-02-08T09:00:00', weight: 83.5, bmi: 33.9, bodyFat: 45.5, water: 38.2, muscleMass: 50.1, boneMass: 3.2 },
  { id: 's5', date: '2026-03-14T09:00:00', weight: 85.0, bmi: 34.5, bodyFat: 46.0, water: 38.0, muscleMass: 50.0, boneMass: 3.2 },
  { id: 's6', date: '2026-04-09T09:00:00', weight: 86.5, bmi: 35.1, bodyFat: 46.5, water: 37.9, muscleMass: 49.9, boneMass: 3.2 },
  { id: 's7', date: '2026-05-17T09:59:00', weight: 88.2, bmi: 35.8, bodyFat: 47.0, water: 37.9, muscleMass: 49.8, boneMass: 3.2 },
];

const STORAGE_KEY = 'operator_fitness_readings';
const GOAL_KEY = 'operator_fitness_goal';
const AUTH_KEY = 'operator_authed';

// ─── Status helpers ───────────────────────────────────────────────────────────

interface Status { label: string; color: string; bg: string }

function weightStatus(weight: number, goal: number): Status {
  const pct = (weight - goal) / goal;
  if (pct <= 0) return { label: 'ON TRACK', color: '#15803d', bg: '#dcfce7' };
  if (pct < 0.15) return { label: 'ABOVE GOAL', color: '#C8700A', bg: '#fef3c7' };
  return { label: 'HIGH', color: '#C8700A', bg: '#fef3c7' };
}
function bmiStatus(bmi: number): Status {
  if (bmi < 18.5) return { label: 'UNDERWEIGHT', color: '#C8700A', bg: '#fef3c7' };
  if (bmi < 25) return { label: 'NORMAL', color: '#15803d', bg: '#dcfce7' };
  if (bmi < 30) return { label: 'OVERWEIGHT', color: '#C8700A', bg: '#fef3c7' };
  return { label: 'HIGH', color: '#C8700A', bg: '#fef3c7' };
}
function bodyFatStatus(fat: number): Status {
  if (fat < 21) return { label: 'LOW', color: '#C8700A', bg: '#fef3c7' };
  if (fat < 33) return { label: 'HEALTHY', color: '#15803d', bg: '#dcfce7' };
  return { label: 'HIGH', color: '#C8700A', bg: '#fef3c7' };
}
function waterStatus(water: number): Status {
  if (water < 45) return { label: 'LOW', color: '#C8700A', bg: '#fef3c7' };
  if (water < 60) return { label: 'NORMAL', color: '#15803d', bg: '#dcfce7' };
  return { label: 'HIGH', color: '#C8700A', bg: '#fef3c7' };
}
function muscleStatus(muscle: number): Status {
  if (muscle >= 45) return { label: 'EXCELLENT', color: '#0891b2', bg: '#e0f2fe' };
  if (muscle >= 38) return { label: 'GOOD', color: '#15803d', bg: '#dcfce7' };
  return { label: 'LOW', color: '#C8700A', bg: '#fef3c7' };
}
function boneStatus(bone: number): Status {
  if (bone >= 3.0) return { label: 'EXCELLENT', color: '#0891b2', bg: '#e0f2fe' };
  if (bone >= 2.5) return { label: 'NORMAL', color: '#15803d', bg: '#dcfce7' };
  return { label: 'LOW', color: '#C8700A', bg: '#fef3c7' };
}

// ─── SVG smooth-curve helper ──────────────────────────────────────────────────

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// ─── LineChart ────────────────────────────────────────────────────────────────

function LineChart({
  readings,
  metric,
  unit,
  title,
  goalValue,
  decimals = 1,
}: {
  readings: FitnessReading[];
  metric: MetricKey;
  unit: string;
  title: string;
  goalValue?: number;
  decimals?: number;
}) {
  const W = 620, H = 210;
  const pad = { top: 22, right: 44, bottom: 48, left: 54 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top - pad.bottom;

  const values = readings.map(r => r[metric] as number);
  const allVals = goalValue !== undefined ? [...values, goalValue] : values;
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.12;
  const max = rawMax + span * 0.12;

  const xOf = (i: number) => pad.left + (readings.length > 1 ? (i / (readings.length - 1)) * pw : pw / 2);
  const yOf = (v: number) => pad.top + (1 - (v - min) / (max - min)) * ph;

  const pts: [number, number][] = readings.map((r, i) => [xOf(i), yOf(r[metric] as number)]);
  const linePath = smoothPath(pts);
  const areaPath = pts.length
    ? `M ${pts[0][0]},${pad.top + ph} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${pts[pts.length - 1][0]},${pad.top + ph} Z`
    : '';

  // 4 y-axis ticks
  const ticks = Array.from({ length: 4 }, (_, i) => min + (i / 3) * (max - min));

  // Month labels (deduplicated)
  const monthLabels = readings.map(r => {
    const d = new Date(r.date);
    return d.toLocaleDateString('en-GB', { month: 'short' });
  });

  const latestVal = values[values.length - 1];
  const latestX = xOf(readings.length - 1);
  const latestY = yOf(latestVal);

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 8px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', color: '#1A1815', marginBottom: 4 }}>
        {title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* Grid lines */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={pad.left} y1={yOf(t)}
              x2={pad.left + pw} y2={yOf(t)}
              stroke="#e5e7eb" strokeWidth="1"
            />
            <text x={pad.left - 6} y={yOf(t) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {t.toFixed(decimals)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="rgba(20,184,166,0.13)" />
        )}

        {/* Goal line */}
        {goalValue !== undefined && (
          <g>
            <line
              x1={pad.left} y1={yOf(goalValue)}
              x2={pad.left + pw} y2={yOf(goalValue)}
              stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="7,4"
            />
            <rect x={pad.left + 4} y={yOf(goalValue) - 14} width={50} height={16} rx={4} fill="#F59E0B" />
            <text x={pad.left + 29} y={yOf(goalValue) - 3} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">
              Goal {goalValue}
            </text>
          </g>
        )}

        {/* Smooth line */}
        {linePath && (
          <path d={linePath} fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Data points */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#14B8A6" stroke="#fff" strokeWidth="2" />
        ))}

        {/* Latest value label */}
        {pts.length > 0 && (
          <text x={latestX + 8} y={latestY - 8} fontSize="13" fill="#14B8A6" fontWeight="700">
            {latestVal.toFixed(decimals)}{unit}
          </text>
        )}

        {/* X-axis labels */}
        {readings.map((_, i) => (
          <text key={i} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#9ca3af">
            {monthLabels[i]}
          </text>
        ))}

        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ph} stroke="#e5e7eb" strokeWidth="1" />
        <line x1={pad.left} y1={pad.top + ph} x2={pad.left + pw} y2={pad.top + ph} stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  unit,
  status,
  icon,
  delta,
}: {
  label: string;
  value: number;
  unit: string;
  status: Status;
  icon: string;
  delta?: number;
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px 18px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#5A5750' }}>{label}</span>
      </div>
      <div style={{ borderBottom: `2.5px solid ${status.color}`, width: 32, marginTop: 2 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#1A1815', lineHeight: 1 }}>{value.toFixed(value % 1 === 0 ? 0 : 1)}</span>
        <span style={{ fontSize: 14, color: '#5A5750', fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: status.color,
        }}>{status.label}</span>
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

function PasswordScreen({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
        sessionStorage.setItem(AUTH_KEY, '1');
        onAuth();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAF8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1815', marginBottom: 6, fontFamily: 'Playfair Display, serif' }}>
          Operator Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#5A5750', marginBottom: 28 }}>
          Private access only. Enter your operator password to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 15,
              outline: 'none',
              background: '#FAFAF8',
              color: '#1A1815',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1A1815',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '13px 24px',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Verifying…' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Add Reading Modal ────────────────────────────────────────────────────────

function AddReadingModal({
  last,
  onAdd,
  onClose,
}: {
  last: FitnessReading;
  onAdd: (r: FitnessReading) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    weight: String(last.weight),
    bmi: String(last.bmi),
    bodyFat: String(last.bodyFat),
    water: String(last.water),
    muscleMass: String(last.muscleMass),
    boneMass: String(last.boneMass),
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now().toString(),
      date: new Date(form.date).toISOString(),
      weight: parseFloat(form.weight),
      bmi: parseFloat(form.bmi),
      bodyFat: parseFloat(form.bodyFat),
      water: parseFloat(form.water),
      muscleMass: parseFloat(form.muscleMass),
      boneMass: parseFloat(form.boneMass),
    });
    onClose();
  };

  const fields: { key: string; label: string; unit: string; step: string }[] = [
    { key: 'weight', label: 'Weight', unit: 'kg', step: '0.1' },
    { key: 'bmi', label: 'BMI', unit: '', step: '0.1' },
    { key: 'bodyFat', label: 'Body Fat', unit: '%', step: '0.1' },
    { key: 'water', label: 'Water', unit: '%', step: '0.1' },
    { key: 'muscleMass', label: 'Muscle Mass', unit: '%', step: '0.1' },
    { key: 'boneMass', label: 'Bone Mass', unit: '%', step: '0.01' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '32px 28px',
        width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1815', margin: 0, fontFamily: 'Playfair Display, serif' }}>
            Add New Reading
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5A5750', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#5A5750', display: 'block', marginBottom: 5 }}>Date & Time</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5A5750', display: 'block', marginBottom: 5 }}>
                  {f.label}{f.unit ? ` (${f.unit})` : ''}
                </label>
                <input
                  type="number"
                  step={f.step}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => set(f.key, e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px', border: '1.5px solid #e5e7eb',
              borderRadius: 10, background: '#fff', color: '#5A5750',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              flex: 1, padding: '12px', border: 'none',
              borderRadius: 10, background: '#14B8A6', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 14,
  background: '#FAFAF8',
  color: '#1A1815',
  outline: 'none',
  boxSizing: 'border-box',
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ latest, goal }: { latest: FitnessReading; goal: number }) {
  const cards = [
    {
      label: 'WEIGHT', value: latest.weight, unit: 'kg',
      status: weightStatus(latest.weight, goal), icon: '⚖️',
    },
    {
      label: 'BMI', value: latest.bmi, unit: '',
      status: bmiStatus(latest.bmi), icon: '📊',
    },
    {
      label: 'BODY FAT %', value: latest.bodyFat, unit: '%',
      status: bodyFatStatus(latest.bodyFat), icon: '🔥',
    },
    {
      label: 'WATER', value: latest.water, unit: '%',
      status: waterStatus(latest.water), icon: '💧',
    },
    {
      label: 'MUSCLE MASS %', value: latest.muscleMass, unit: '%',
      status: muscleStatus(latest.muscleMass), icon: '💪',
    },
    {
      label: 'BONE MASS %', value: latest.boneMass, unit: '%',
      status: boneStatus(latest.boneMass), icon: '🦴',
    },
  ];

  return (
    <div>
      {/* Date stamp */}
      <p style={{ fontSize: 13, color: '#5A5750', textAlign: 'center', marginBottom: 20 }}>
        Latest reading: {new Date(latest.date).toLocaleDateString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </p>

      {/* Goal progress bar */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1815' }}>Weight Goal Progress</span>
          <span style={{ fontSize: 13, color: '#5A5750' }}>
            {latest.weight.toFixed(1)} kg → {goal} kg
          </span>
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
          {/* Bar fills from goal end — shows how far remaining to lose */}
          <div style={{
            width: `${Math.min(100, Math.max(0, ((latest.weight - goal) / latest.weight) * 100)).toFixed(1)}%`,
            background: 'linear-gradient(90deg, #14B8A6, #0891B2)',
            height: '100%',
            borderRadius: 999,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ fontSize: 12, color: '#5A5750', marginTop: 6 }}>
          {(latest.weight - goal).toFixed(1)} kg to lose to reach goal
        </p>
      </div>

      {/* Metric cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {cards.map(c => (
          <MetricCard key={c.label} {...c} />
        ))}
      </div>

      {/* BMI range guide */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginTop: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#5A5750', marginBottom: 10, letterSpacing: '0.06em' }}>BMI REFERENCE</p>
        <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', height: 8, marginBottom: 8 }}>
          <div style={{ flex: 18.5, background: '#60a5fa' }} />
          <div style={{ flex: 6.4, background: '#34d399' }} />
          <div style={{ flex: 5, background: '#fbbf24' }} />
          <div style={{ flex: 10, background: '#f87171' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
          <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
        </div>
        <p style={{ fontSize: 12, color: '#5A5750', marginTop: 6 }}>
          Your BMI: <strong style={{ color: '#1A1815' }}>{latest.bmi.toFixed(1)}</strong>
          {' '}— target range is 18.5–24.9
        </p>
      </div>
    </div>
  );
}

// ─── Charts Tab ───────────────────────────────────────────────────────────────

function ChartsTab({ readings, goal }: { readings: FitnessReading[]; goal: number }) {
  const charts: { metric: MetricKey; title: string; unit: string; goalValue?: number; decimals?: number }[] = [
    { metric: 'weight', title: 'WEIGHT', unit: 'kg', goalValue: goal, decimals: 1 },
    { metric: 'bmi', title: 'BMI', unit: '', decimals: 1 },
    { metric: 'bodyFat', title: 'BODY FAT %', unit: '%', decimals: 1 },
    { metric: 'water', title: 'WATER %', unit: '%', decimals: 1 },
    { metric: 'muscleMass', title: 'MUSCLE MASS %', unit: '%', decimals: 1 },
    { metric: 'boneMass', title: 'BONE MASS %', unit: '%', decimals: 2 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {charts.map(c => (
        <LineChart key={c.metric} readings={readings} {...c} />
      ))}
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({
  readings,
  onDelete,
}: {
  readings: FitnessReading[];
  onDelete: (id: string) => void;
}) {
  const sorted = [...readings].reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map(r => (
        <div key={r.id} style={{
          background: '#fff', borderRadius: 14, padding: '14px 18px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1815' }}>
              {new Date(r.date).toLocaleDateString('en-GB', {
                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
              })}
            </span>
            {!r.id.startsWith('s') && (
              <button
                onClick={() => onDelete(r.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer', padding: '2px 6px' }}
              >
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'Weight', value: `${r.weight}kg` },
              { label: 'BMI', value: r.bmi.toFixed(1) },
              { label: 'Body Fat', value: `${r.bodyFat}%` },
              { label: 'Water', value: `${r.water}%` },
              { label: 'Muscle', value: `${r.muscleMass}%` },
              { label: 'Bone', value: `${r.boneMass}%` },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: 10, color: '#9ca3af', margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.05em' }}>{item.label.toUpperCase()}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1815', margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {sorted.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: '40px 0' }}>No readings yet.</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OperatorDashboardClient() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'overview' | 'charts' | 'history'>('overview');
  const [readings, setReadings] = useState<FitnessReading[]>([]);
  const [goal, setGoal] = useState(60.0);
  const [showAdd, setShowAdd] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('60');

  // Restore auth & data from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(AUTH_KEY) === '1') setAuthed(true);

    const stored = localStorage.getItem(STORAGE_KEY);
    setReadings(stored ? JSON.parse(stored) : SEED_READINGS);

    const storedGoal = localStorage.getItem(GOAL_KEY);
    if (storedGoal) {
      setGoal(parseFloat(storedGoal));
      setGoalInput(storedGoal);
    }
  }, []);

  const saveReadings = useCallback((rs: FitnessReading[]) => {
    setReadings(rs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rs));
  }, []);

  const handleAdd = useCallback((r: FitnessReading) => {
    const next = [...readings, r].sort((a, b) => a.date.localeCompare(b.date));
    saveReadings(next);
  }, [readings, saveReadings]);

  const handleDelete = useCallback((id: string) => {
    saveReadings(readings.filter(r => r.id !== id));
  }, [readings, saveReadings]);

  const handleGoalSave = () => {
    const g = parseFloat(goalInput);
    if (!isNaN(g) && g > 0) {
      setGoal(g);
      localStorage.setItem(GOAL_KEY, String(g));
    }
    setEditingGoal(false);
  };

  if (!authed) return <PasswordScreen onAuth={() => setAuthed(true)} />;

  const latest = readings[readings.length - 1];
  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'charts', label: 'Charts' },
    { key: 'history', label: 'History' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        background: '#1A1815',
        padding: '20px 24px 18px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 3px', letterSpacing: '0.1em', fontWeight: 600 }}>OPERATOR</p>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Playfair Display, serif' }}>
              Fitness Tracker
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Goal editor */}
            {editingGoal ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  step="0.1"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  style={{ width: 70, padding: '6px 8px', borderRadius: 8, border: 'none', fontSize: 14, background: '#fff', color: '#1A1815' }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleGoalSave(); if (e.key === 'Escape') setEditingGoal(false); }}
                />
                <button onClick={handleGoalSave} style={{ background: '#14B8A6', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
              </div>
            ) : (
              <button
                onClick={() => setEditingGoal(true)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '7px 13px', color: '#fff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                🎯 Goal: {goal}kg
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              style={{ background: '#14B8A6', border: 'none', borderRadius: 10, padding: '8px 16px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 66, zIndex: 40 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', padding: '0 16px' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: '14px 8px',
                border: 'none',
                background: 'none',
                fontSize: 14,
                fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? '#14B8A6' : '#5A5750',
                borderBottom: tab === t.key ? '2.5px solid #14B8A6' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        {latest ? (
          <>
            {tab === 'overview' && <OverviewTab latest={latest} goal={goal} />}
            {tab === 'charts' && <ChartsTab readings={readings} goal={goal} />}
            {tab === 'history' && <HistoryTab readings={readings} onDelete={handleDelete} />}
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 0' }}>No readings yet — add one to get started.</p>
        )}
      </div>

      {/* Add Reading Modal */}
      {showAdd && latest && (
        <AddReadingModal last={latest} onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Sign out */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
        <button
          onClick={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }}
          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 20px', color: '#5A5750', fontSize: 13, cursor: 'pointer', width: '100%' }}
        >
          Lock Dashboard
        </button>
      </div>
    </div>
  );
}
