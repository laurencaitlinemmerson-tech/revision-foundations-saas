'use client';

/* ============================================================
   ProteinRecovery.tsx — protein target + recovery pairing
   ============================================================ */

import { type CSSProperties } from 'react';

export interface ProteinRecoveryProps {
  proteinTodayG: number | null;
  proteinTargetG: number;         // 1.6–2.2 g/kg lean mass
  rhrWeekAvg: number | null;      // resting heart rate, bpm
  hrvWeekAvg: number | null;      // RMSSD, ms
  trainingLoad7Day: number;       // kcal active energy avg
  /** Yesterday's training load — for trend */
  trainingLoadYesterday: number;
}

export function ProteinRecovery({ proteinTodayG, proteinTargetG, rhrWeekAvg, hrvWeekAvg, trainingLoad7Day, trainingLoadYesterday }: ProteinRecoveryProps) {
  const proteinPct = proteinTodayG !== null ? Math.min(100, (proteinTodayG / proteinTargetG) * 100) : 0;
  const proteinShort = proteinTodayG !== null ? Math.max(0, proteinTargetG - proteinTodayG) : null;

  // Recovery rule of thumb: HRV up + RHR down = recovered; opposite = recover
  const recovered = (rhrWeekAvg !== null && hrvWeekAvg !== null)
    ? (hrvWeekAvg >= 45 && rhrWeekAvg <= 65)
    : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)' }}>
      {/* Protein column */}
      <div style={{ padding: '28px 32px 24px', borderRight: '0.5px solid var(--rule)' }}>
        <span style={kicker}>Protein · today</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {proteinTodayG !== null ? Math.round(proteinTodayG) : '—'}
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'var(--ink-mute)' }}>g</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 16, color: 'var(--ink-mute)', marginLeft: 8 }}>
            of {Math.round(proteinTargetG)} g target
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: 'var(--rule-soft)', marginTop: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${proteinPct}%`, background: proteinPct >= 100 ? 'var(--green)' : 'var(--ink)' }} />
        </div>
        <p style={{ marginTop: 12, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          {proteinShort === null
            ? 'Log a meal to track protein against the daily target.'
            : proteinShort <= 0
              ? 'Target met.'
              : `${Math.round(proteinShort)} g short — a serving of yogurt, two eggs, or a 30 g whey scoop closes the gap.`}
        </p>
      </div>

      {/* Recovery column */}
      <div style={{ padding: '28px 32px 24px' }}>
        <span style={kicker}>Recovery signal</span>
        <div style={{ display: 'flex', gap: 32, marginTop: 12 }}>
          <Mini label="RHR" value={rhrWeekAvg !== null ? Math.round(rhrWeekAvg) : '—'} unit="bpm" />
          <Mini label="HRV" value={hrvWeekAvg !== null ? Math.round(hrvWeekAvg) : '—'} unit="ms" />
          <Mini label="Load 7-d" value={Math.round(trainingLoad7Day)} unit="kcal/d" />
        </div>
        <p style={{ marginTop: 16, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          {recovered === null
            ? 'Not enough Apple Health data to assess recovery — connect HRV and RHR streams.'
            : recovered
              ? `Recovered — HRV holding above 45 ms, RHR under 65 bpm. Train as planned${trainingLoadYesterday < trainingLoad7Day * 0.7 ? '; yesterday was light, room to push.' : '.'}`
              : 'Recover — HRV depressed or RHR elevated. Substitute a walk or mobility session for the planned hard set.'}
        </p>
      </div>
    </div>
  );
}

function Mini({ label, value, unit }: { label: string; value: number | string; unit: string }) {
  return (
    <div>
      <span style={kicker}>{label}</span>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.01em', marginTop: 4, lineHeight: 1 }}>{value}</div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{unit}</span>
    </div>
  );
}

const kicker: CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)',
};
