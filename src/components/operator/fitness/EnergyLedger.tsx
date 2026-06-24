'use client';

/* ============================================================
   EnergyLedger.tsx — 14-day intake vs TDEE bars + running balance
   ============================================================ */

import { type CSSProperties } from 'react';

export interface LedgerDay {
  date: string;          // ISO yyyy-mm-dd
  intake: number | null; // kcal logged
  tdee: number;          // estimated TDEE for that day
}

export function EnergyLedger({ days, targetDeficit = 1100 }: { days: LedgerDay[]; targetDeficit?: number }) {
  // Compute running 7-day balance (sum of (intake - tdee) over trailing 7d)
  const balance: (number | null)[] = days.map((_, i) => {
    const window = days.slice(Math.max(0, i - 6), i + 1)
      .filter(d => d.intake !== null);
    if (window.length === 0) return null;
    return window.reduce((a, d) => a + ((d.intake! - d.tdee)), 0);
  });

  const maxKcal = Math.max(...days.map(d => Math.max(d.intake ?? 0, d.tdee)));
  const yScale = (v: number) => (v / maxKcal) * 100;

  const totalDelta = days.reduce((a, d) => a + (d.intake !== null ? d.intake - d.tdee : 0), 0);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={kicker}>14-day energy ledger</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--ink-soft)' }}>
          Net <strong style={{ color: totalDelta > 0 ? 'var(--rose)' : 'var(--green)' }}>{totalDelta >= 0 ? '+' : ''}{totalDelta.toLocaleString()}</strong> kcal · target <strong style={{ color: 'var(--ink)' }}>−{(targetDeficit * 2).toLocaleString()}</strong>
        </span>
      </div>

      {/* Paired bars */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 140, borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', padding: '8px 0' }}>
        {days.map((d, i) => {
          const intakeH = d.intake !== null ? yScale(d.intake) : 0;
          const tdeeH = yScale(d.tdee);
          return (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%', justifyContent: 'center', height: '100%' }}>
                {/* TDEE bar — ink, full-height baseline */}
                <div style={{ width: '40%', height: `${tdeeH}%`, background: 'var(--ink)', opacity: 0.18 }} />
                {/* Intake bar — solid */}
                <div style={{
                  width: '40%',
                  height: `${intakeH}%`,
                  background: d.intake !== null && d.intake < d.tdee ? 'var(--green)' : 'var(--rose)',
                  opacity: d.intake === null ? 0 : 0.85,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Running balance line below */}
      <svg viewBox={`0 0 ${days.length * 20} 60`} style={{ width: '100%', height: 60, display: 'block', marginTop: 8 }} preserveAspectRatio="none">
        {(() => {
          const balVals = balance.filter((b): b is number => b !== null);
          if (balVals.length === 0) return null;
          const min = Math.min(...balVals, 0);
          const max = Math.max(...balVals, 0);
          const range = Math.max(1, max - min);
          const ys = balance.map(b => b === null ? null : 50 - ((b - min) / range) * 40 - 5);
          const path = ys
            .map((y, i) => y === null ? '' : `${i === 0 ? 'M' : 'L'}${i * 20 + 10},${y.toFixed(1)}`)
            .filter(Boolean)
            .join(' ');
          const zeroY = 50 - ((0 - min) / range) * 40 - 5;
          return (
            <>
              <line x1="0" x2={days.length * 20} y1={zeroY} y2={zeroY} stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="3 3" />
              <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1" />
            </>
          );
        })()}
      </svg>

      {/* X-axis: every 3rd day labelled */}
      <div style={{ display: 'flex', marginTop: 6 }}>
        {days.map((d, i) => (
          <div key={d.date} style={{ flex: 1, textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
            {i % 3 === 0 ? new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric' }) : ''}
          </div>
        ))}
      </div>

      {/* Key */}
      <div style={{ display: 'flex', gap: 24, marginTop: 16, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
        <span style={chip}><i style={{ ...sw, background: 'var(--ink)', opacity: 0.18 }} /> TDEE</span>
        <span style={chip}><i style={{ ...sw, background: 'var(--green)' }} /> Deficit day</span>
        <span style={chip}><i style={{ ...sw, background: 'var(--rose)' }} /> Surplus day</span>
        <span style={chip}><i style={{ ...sw, background: 'var(--ink)' }} /> Running 7-day balance</span>
      </div>
    </div>
  );
}

const kicker: CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)',
};
const chip: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8 };
const sw: CSSProperties = { width: 8, height: 8, display: 'inline-block' };
