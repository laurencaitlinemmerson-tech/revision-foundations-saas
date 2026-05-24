'use client';

/* ============================================================
   SundayIssue.tsx — auto-generated weekly editorial recap
   ============================================================
   A printable Sunday card that summarises the week in italic
   editorial prose. Designed to print to A4 cleanly (use the
   PrintIssueButton).
   ============================================================ */

import { type CSSProperties } from 'react';

export interface SundayIssueData {
  weekStart: string;        // ISO yyyy-mm-dd
  weekEnd: string;
  weightStart: number;
  weightEnd: number;
  weeklyDelta: number;      // weightEnd - weightStart
  workouts: number;
  avgSleepHours: number | null;
  avgRhr: number | null;
  avgHrv: number | null;
  avgIntake: number | null;
  avgTdee: number;
  /** Headline signal of the week (auto-detected) */
  signal?: { label: string; detail: string };
  /** Editor's note — single italic paragraph */
  letter: string;
}

export function buildSundayIssue(input: Omit<SundayIssueData, 'letter' | 'signal'>): SundayIssueData {
  // Auto-pick signal of the week
  const signal = pickSignal(input);
  const letter = composeLetter({ ...input, signal });
  return { ...input, signal, letter };
}

function pickSignal(d: Omit<SundayIssueData, 'letter' | 'signal'>): SundayIssueData['signal'] {
  // Order: weight movement > training > sleep > nutrition
  if (Math.abs(d.weeklyDelta) >= 0.4) {
    return {
      label: d.weeklyDelta < 0 ? 'Weight moved' : 'Weight crept',
      detail: `${d.weeklyDelta >= 0 ? '+' : ''}${d.weeklyDelta.toFixed(1)} kg over the week.`,
    };
  }
  if (d.workouts >= 4) {
    return { label: 'Training showed up', detail: `${d.workouts} sessions logged.` };
  }
  if (d.workouts <= 1) {
    return { label: 'Training slipped', detail: `Only ${d.workouts} sessions this week.` };
  }
  if (d.avgSleepHours !== null && d.avgSleepHours < 6.5) {
    return { label: 'Sleep ran short', detail: `Average ${d.avgSleepHours.toFixed(1)} h — under the 7-hour minimum.` };
  }
  return { label: 'Steady week', detail: 'Nothing dramatic moved.' };
}

function composeLetter(d: SundayIssueData): string {
  const pieces: string[] = [];
  const dir = d.weeklyDelta < 0 ? 'down' : d.weeklyDelta > 0 ? 'up' : 'flat';
  pieces.push(`Week of ${fmtRange(d.weekStart, d.weekEnd)}. The scale finished ${dir === 'flat' ? 'flat' : `${dir} ${Math.abs(d.weeklyDelta).toFixed(1)} kg`} on ${d.weightEnd.toFixed(1)} kg.`);
  if (d.workouts > 0) pieces.push(`${d.workouts} ${d.workouts === 1 ? 'session' : 'sessions'} logged.`);
  if (d.avgSleepHours !== null) pieces.push(`Sleep averaged ${d.avgSleepHours.toFixed(1)} hours.`);
  if (d.avgRhr !== null) pieces.push(`Resting heart rate ${Math.round(d.avgRhr)} bpm.`);
  if (d.avgIntake !== null) {
    const deficit = d.avgTdee - d.avgIntake;
    pieces.push(`Average intake ${Math.round(d.avgIntake).toLocaleString()} kcal against an estimated ${Math.round(d.avgTdee).toLocaleString()} kcal expenditure — ${deficit > 0 ? `a ${Math.round(deficit)} kcal daily deficit` : `a ${Math.round(-deficit)} kcal daily surplus`}.`);
  }
  if (d.signal) pieces.push(`Signal of the week: ${d.signal.label.toLowerCase()} — ${d.signal.detail.toLowerCase()}`);
  return pieces.join(' ');
}

function fmtRange(a: string, b: string): string {
  const da = new Date(a), db = new Date(b);
  const sameMonth = da.getMonth() === db.getMonth();
  if (sameMonth) {
    return `${da.getDate()}–${db.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  return `${da.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${db.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

/* ── Component ─────────────────────────────────────────────── */
export function SundayIssue({ data }: { data: SundayIssueData }) {
  return (
    <article className="sunday-issue" style={shell}>
      <header style={{ paddingBottom: 24, borderBottom: '0.5px solid var(--rule)' }}>
        <span style={kicker}>The Operator Log · Sunday Issue</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 36, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.08, margin: '12px 0 8px' }}>
          The week in <em>review</em>.
        </h2>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--ink-mute)', margin: 0 }}>
          {fmtRange(data.weekStart, data.weekEnd)}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderBottom: '0.5px solid var(--rule)' }}>
        <Stat label="Weight Δ" value={`${data.weeklyDelta >= 0 ? '+' : ''}${data.weeklyDelta.toFixed(1)}`} unit="kg" tone={data.weeklyDelta < 0 ? 'green' : data.weeklyDelta > 0 ? 'rose' : 'mute'} />
        <Stat label="Sessions" value={String(data.workouts)} unit="logged" />
        <Stat label="Sleep avg" value={data.avgSleepHours !== null ? data.avgSleepHours.toFixed(1) : '—'} unit="hours" />
        <Stat label="Daily Δ kcal" value={data.avgIntake !== null ? String(Math.round(data.avgIntake - data.avgTdee)) : '—'} unit={data.avgIntake !== null && data.avgIntake < data.avgTdee ? 'deficit' : 'surplus'} />
      </div>

      {data.signal && (
        <div style={{ padding: '28px 0', borderBottom: '0.5px solid var(--rule)' }}>
          <span style={kicker}>Signal of the Week</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', lineHeight: 1.3, margin: '8px 0 6px', letterSpacing: '-0.01em' }}>
            {data.signal.label}.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.65 }}>
            {data.signal.detail}
          </p>
        </div>
      )}

      <div style={{ padding: '32px 0' }}>
        <span style={kicker}>Editor's Letter</span>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 17, color: 'var(--ink)', lineHeight: 1.7, margin: '10px 0 0', maxWidth: '60ch', letterSpacing: '0.005em' }}>
          {data.letter}
        </p>
      </div>
    </article>
  );
}

function Stat({ label, value, unit, tone = 'ink' }: { label: string; value: string; unit: string; tone?: 'ink' | 'green' | 'rose' | 'mute' }) {
  const colours = { ink: 'var(--ink)', green: 'var(--green)', rose: 'var(--rose)', mute: 'var(--ink-mute)' } as const;
  return (
    <div style={{ padding: '24px 22px', borderRight: '0.5px solid var(--rule-soft)' }}>
      <span style={kicker}>{label}</span>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 36, color: colours[tone], letterSpacing: '-0.015em', margin: '10px 0 4px', lineHeight: 1 }}>{value}</div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{unit}</span>
    </div>
  );
}

const shell: CSSProperties = {
  background: 'var(--paper)',
  padding: '0',
  border: '0.5px solid var(--rule)',
  marginTop: 32,
};
const kicker: CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)',
};
