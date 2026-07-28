'use client';

import { useState, useMemo } from 'react';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";

function calcBMR(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female') {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary',        note: 'Mostly seated, little movement',           mult: 1.2   },
  { id: 'light',    label: 'Lightly active',    note: 'Walking, exercise 1–3×/week',              mult: 1.375 },
  { id: 'moderate', label: 'Moderately active', note: 'Exercise 3–5×/week',                       mult: 1.55  },
  { id: 'active',   label: 'Very active',       note: 'On your feet all day — placement mode',    mult: 1.725 },
  { id: 'extra',    label: 'Extra active',      note: 'Intense exercise + demanding role',        mult: 1.9   },
];

const GOALS = [
  { id: 'lose',     label: 'Lose weight',  delta: -500, color: '#7BA7CC' },
  { id: 'maintain', label: 'Maintain',     delta: 0,    color: '#8BBCAA' },
  { id: 'gain',     label: 'Gain weight',  delta: +500, color: '#D4A574' },
];

export default function TDEECalculator() {
  const [sex,      setSex]      = useState<'male' | 'female'>('female');
  const [age,      setAge]      = useState('');
  const [weight,   setWeight]   = useState('');
  const [height,   setHeight]   = useState('');
  const [activity, setActivity] = useState('moderate');
  const [goal,     setGoal]     = useState('maintain');

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a < 10 || a > 120 || w < 20 || h < 50) return null;
    const bmr    = calcBMR(w, h, a, sex);
    const mult   = ACTIVITY_LEVELS.find(l => l.id === activity)!.mult;
    const tdee   = Math.round(bmr * mult);
    const delta  = GOALS.find(g => g.id === goal)!.delta;
    return { bmr: Math.round(bmr), tdee, target: tdee + delta };
  }, [sex, age, weight, height, activity, goal]);

  const goalColor = GOALS.find(g => g.id === goal)!.color;

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
        Personal wellness
      </p>
      <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, marginBottom: '20px', lineHeight: 1.4 }}>
        TDEE calculator
      </p>

      {/* Sex */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '7px' }}>Biological sex</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['female', 'male'] as const).map(s => (
            <button key={s} onClick={() => setSex(s)} style={{
              padding: '7px 18px', fontFamily: serif, fontSize: '12px',
              border: `0.5px solid ${sex === s ? ink : 'rgba(0,0,0,0.14)'}`,
              background: sex === s ? ink : '#fff', color: sex === s ? '#fff' : '#7A6F64',
              cursor: 'pointer', transition: 'all 0.13s', textTransform: 'capitalize',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Numeric inputs */}
      <div className="tdee-inputs" style={{ marginBottom: '16px' }}>
        {[
          { label: 'Age', val: age, set: setAge, unit: 'yrs', ph: '25', min: 10, max: 120 },
          { label: 'Weight', val: weight, set: setWeight, unit: 'kg', ph: '65', min: 20, max: 300 },
          { label: 'Height', val: height, set: setHeight, unit: 'cm', ph: '168', min: 50, max: 250 },
        ].map(f => (
          <div key={f.label}>
            <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '6px' }}>{f.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid rgba(0,0,0,0.14)' }}>
              <input
                type="number" value={f.val} onChange={e => f.set(e.target.value)}
                min={f.min} max={f.max} placeholder={f.ph}
                style={{ flex: 1, padding: '9px 10px', fontFamily: serif, fontSize: '13px', color: ink, background: 'transparent', border: 'none', outline: 'none', minWidth: 0 }}
              />
              <span style={{ fontFamily: serif, fontSize: '10px', color: muted, paddingRight: '10px', flexShrink: 0 }}>{f.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '7px' }}>Activity level</p>
        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
          {ACTIVITY_LEVELS.map((l, i) => (
            <button key={l.id} onClick={() => setActivity(l.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '9px 12px', fontFamily: serif, fontSize: '12px', border: 'none',
              borderBottom: i < ACTIVITY_LEVELS.length - 1 ? '0.5px solid rgba(0,0,0,0.07)' : 'none',
              background: activity === l.id ? '#F5F3F0' : '#fff',
              color: activity === l.id ? ink : '#7A6F64',
              cursor: 'pointer', textAlign: 'left', gap: '10px', transition: 'background 0.1s',
            }}>
              <span style={{ fontWeight: activity === l.id ? 500 : 400, flexShrink: 0 }}>{l.label}</span>
              <span style={{ fontSize: '10px', color: muted, fontWeight: 300, flex: 1, textAlign: 'right' }}>{l.note}</span>
              {activity === l.id && <span style={{ fontSize: '9px', color: '#8BBCAA', flexShrink: 0 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '7px' }}>Goal</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {GOALS.map(g => (
            <button key={g.id} onClick={() => setGoal(g.id)} style={{
              padding: '7px 16px', fontFamily: serif, fontSize: '12px',
              border: `0.5px solid ${goal === g.id ? g.color : 'rgba(0,0,0,0.14)'}`,
              background: goal === g.id ? g.color : '#fff', color: goal === g.id ? '#fff' : '#7A6F64',
              cursor: 'pointer', transition: 'all 0.13s',
            }}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '18px' }}>
        {result ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {[
              { label: 'BMR',    value: result.bmr.toLocaleString(),    sub: 'kcal at rest',   col: '#B4A89C' },
              { label: 'TDEE',   value: result.tdee.toLocaleString(),   sub: 'kcal to maintain', col: ink },
              { label: 'Target', value: result.target.toLocaleString(), sub: 'kcal for goal',  col: goalColor },
            ].map(r => (
              <div key={r.label} style={{ textAlign: 'center', padding: '12px 8px', background: 'rgba(0,0,0,0.018)' }}>
                <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '5px' }}>{r.label}</p>
                <p style={{ fontFamily: display, fontSize: '1.4rem', fontStyle: 'italic', color: r.col, lineHeight: 1 }}>{r.value}</p>
                <p style={{ fontFamily: serif, fontSize: '9px', color: muted, marginTop: '3px', fontWeight: 300 }}>{r.sub}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, textAlign: 'center', lineHeight: 1.6 }}>
            Fill in your details to see your TDEE.
          </p>
        )}
        <p style={{ fontFamily: serif, fontSize: '9px', color: muted, fontWeight: 300, marginTop: '12px', lineHeight: 1.6, textAlign: 'center' }}>
          Mifflin–St Jeor equation. A guide, not a prescription.
        </p>
      </div>

      <style>{`
        .tdee-inputs { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        @media (max-width: 500px) { .tdee-inputs { grid-template-columns: 1fr; } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
