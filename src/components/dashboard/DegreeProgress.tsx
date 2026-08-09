'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_CREDIT_TARGET,
  PASS_MARK,
  addModule,
  classify,
  getModules,
  removeModule,
  type DegreeModule,
} from '@/lib/dashboardTracking';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";

const YEAR_COLORS = ['#8BBCAA', '#D4A574', '#7BA7CC'];

function gradeColor(g: number) {
  if (g >= 70) return '#4F7F68';
  if (g >= 60) return '#6B9E87';
  if (g >= 50) return '#B8863F';
  if (g >= PASS_MARK) return '#B07A8E';
  return '#C0616B';
}

export default function DegreeProgress() {
  const [modules, setModules] = useState<DegreeModule[]>([]);
  const [ready, setReady]     = useState(false);

  const [name,    setName]    = useState('');
  const [credits, setCredits] = useState('20');
  const [grade,   setGrade]   = useState('');
  const [year,    setYear]    = useState('1');

  useEffect(() => {
    setModules(getModules());
    setReady(true);
  }, []);

  const stats = useMemo(() => {
    const graded = modules.filter(m => m.grade !== null);
    const gradedCredits = graded.reduce((s, m) => s + m.credits, 0);

    // Credit-weighted mean across graded modules only
    const average = gradedCredits > 0
      ? graded.reduce((s, m) => s + (m.grade as number) * m.credits, 0) / gradedCredits
      : 0;

    const passedCredits = graded
      .filter(m => (m.grade as number) >= PASS_MARK)
      .reduce((s, m) => s + m.credits, 0);

    const byYear = [1, 2, 3].map(y => {
      const inYear = modules.filter(m => m.year === y && m.grade !== null);
      const cr = inYear.reduce((s, m) => s + m.credits, 0);
      return {
        year: y,
        credits: cr,
        average: cr > 0
          ? inYear.reduce((s, m) => s + (m.grade as number) * m.credits, 0) / cr
          : null,
      };
    }).filter(y => y.credits > 0);

    return {
      average,
      passedCredits,
      gradedCount: graded.length,
      pct: Math.min((passedCredits / DEFAULT_CREDIT_TARGET) * 100, 100),
      byYear,
    };
  }, [modules]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const c = parseInt(credits, 10);
    const y = parseInt(year, 10);
    const g = grade.trim() === '' ? null : parseFloat(grade);
    if (!name.trim() || !Number.isFinite(c) || c <= 0) return;
    if (g !== null && (!Number.isFinite(g) || g < 0 || g > 100)) return;

    setModules(addModule({ name: name.trim(), credits: c, grade: g, year: y }));
    setName('');
    setGrade('');
    setCredits('20');
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
        Academic
      </p>
      <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, marginBottom: '18px', lineHeight: 1.4 }}>
        Degree progress
      </p>

      {/* Headline */}
      <div className="dg-head" style={{ marginBottom: '16px' }}>
        {[
          {
            label: 'Weighted average',
            value: ready && stats.gradedCount > 0 ? `${stats.average.toFixed(1)}%` : '—',
            sub:   ready && stats.gradedCount > 0 ? classify(stats.average) : 'No grades yet',
            color: ready && stats.gradedCount > 0 ? gradeColor(stats.average) : ink,
          },
          {
            label: 'Credits passed',
            value: ready ? String(stats.passedCredits) : '—',
            sub:   `of ${DEFAULT_CREDIT_TARGET}`,
            color: ink,
          },
          {
            label: 'Modules graded',
            value: ready ? String(stats.gradedCount) : '—',
            sub:   `${modules.length} total`,
            color: ink,
          },
        ].map(s => (
          <div key={s.label}>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '6px' }}>
              {s.label}
            </p>
            <p style={{ fontFamily: display, fontSize: '1.7rem', fontStyle: 'italic', color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300, marginTop: '3px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${ready ? stats.pct : 0}%`, background: '#8BBCAA', transition: 'width 0.4s ease' }} />
      </div>

      {/* Per-year averages */}
      {ready && stats.byYear.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {stats.byYear.map(y => (
            <div key={y.year} style={{ flex: '1 1 90px', padding: '9px 11px', background: 'rgba(0,0,0,0.02)', borderLeft: `2px solid ${YEAR_COLORS[(y.year - 1) % 3]}` }}>
              <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginBottom: '3px' }}>
                Year {y.year}
              </p>
              <p style={{ fontFamily: serif, fontSize: '13px', color: ink }}>
                {y.average !== null ? `${y.average.toFixed(1)}%` : '—'}
              </p>
              <p style={{ fontFamily: serif, fontSize: '9px', color: muted, fontWeight: 300 }}>{y.credits} credits</p>
            </div>
          ))}
        </div>
      )}

      {/* Add module */}
      <form onSubmit={submit} className="dg-form" style={{ marginBottom: '16px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Module name" maxLength={60} required style={inputStyle} />
        <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>
          {[1, 2, 3].map(y => <option key={y} value={y}>Yr {y}</option>)}
        </select>
        <input value={credits} onChange={e => setCredits(e.target.value)} type="number" min="1" max="180" placeholder="Credits" required style={inputStyle} />
        <input value={grade} onChange={e => setGrade(e.target.value)} type="number" min="0" max="100" step="0.1" placeholder="Grade %" style={inputStyle} />
        <button type="submit" style={{ padding: '9px 16px', fontFamily: serif, fontSize: '12px', background: ink, color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Add
        </button>
      </form>

      {/* Module list */}
      {ready && modules.length > 0 && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '12px' }}>
          {modules.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontFamily: serif, fontSize: '9px', color: muted, flexShrink: 0, width: '26px' }}>Y{m.year}</span>
              <span style={{ fontFamily: serif, fontSize: '12px', color: ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
              <span style={{ fontFamily: serif, fontSize: '10px', color: muted, flexShrink: 0 }}>{m.credits} cr</span>
              <span style={{ fontFamily: serif, fontSize: '12px', flexShrink: 0, width: '46px', textAlign: 'right', color: m.grade !== null ? gradeColor(m.grade) : muted }}>
                {m.grade !== null ? `${m.grade}%` : '—'}
              </span>
              <button
                onClick={() => setModules(removeModule(m.id))}
                aria-label={`Remove module ${m.name}`}
                style={{ fontFamily: serif, fontSize: '14px', color: '#C4B4A8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {ready && modules.length === 0 && (
        <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.7, borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '14px' }}>
          No modules yet. Add one above — leave the grade blank while it&apos;s still running.
        </p>
      )}

      <p style={{ fontFamily: serif, fontSize: '9px', fontWeight: 300, color: muted, marginTop: '12px', lineHeight: 1.6 }}>
        Average is credit-weighted across graded modules. Indicative only — your university&apos;s own weighting rules decide the final classification.
      </p>

      <style>{`
        .dg-head { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .dg-form { display: grid; grid-template-columns: 1fr 70px 80px 80px auto; gap: 7px; }
        @media (max-width: 700px) {
          .dg-form { grid-template-columns: 1fr 1fr; }
          .dg-form button { grid-column: 1 / -1; }
        }
        @media (max-width: 440px) {
          .dg-head { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '9px 10px',
  fontFamily: serif,
  fontSize: '12px',
  color: ink,
  background: '#fff',
  border: '0.5px solid rgba(0,0,0,0.14)',
  outline: 'none',
  minWidth: 0,
};
