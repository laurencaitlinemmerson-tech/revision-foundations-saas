'use client';

// ─── Nursing Dashboard ───────────────────────────────────────────────────────
// A snapshot of the BSc Children's Nursing degree and clinical placements,
// mirrored from the Notion "Nursing Dashboard" workspace. Static data with one
// live piece: the countdown to the next upcoming placement. Styling reuses the
// editorial operator tokens (cream paper, hairline rules, sharp corners, Inter).

import React, { useMemo } from 'react';

interface ModuleRow {
  code: string;
  title: string;
  credits: number;
  grade?: number;   // final module % where marked
  pass?: boolean;   // for pass/fail components (PAD)
}

interface YearBlock {
  key: string;
  label: string;
  sub: string;
  status: 'complete' | 'current' | 'upcoming';
  credits: number;
  average?: number;
  modules: ModuleRow[];
}

interface PlacementRow {
  emoji: string;
  name: string;
  specialty: string | null;
  year: string;
  stage: 'Complete' | 'In progress' | 'Upcoming';
  start: string | null; // ISO
  end: string | null;   // ISO
}

// ── Degree structure (King's College London, BSc Children's Nursing) ──────────
const YEARS: YearBlock[] = [
  {
    key: 'y1',
    label: 'Year 1',
    sub: '2025–2026',
    status: 'complete',
    credits: 120,
    average: 78,
    modules: [
      { code: '4KNIC001', title: "Foundations for Children's Nursing", credits: 60, grade: 67 },
      { code: '4KNIC002', title: "Fundamental Skills for Children's Nursing", credits: 30, grade: 92 },
      { code: '4KNIC003', title: "Becoming a Children's Nurse", credits: 15, grade: 90 },
      { code: '4KNIC041', title: "Women's Health", credits: 15, grade: 78 },
      { code: '4KNIC000', title: 'Practice Assessment Document (PAD)', credits: 0, pass: true },
    ],
  },
  {
    key: 'y2',
    label: 'Year 2',
    sub: '2026–2027',
    status: 'current',
    credits: 120,
    modules: [
      { code: '5KNIC011', title: "Promoting & Optimising Health in Children's Nursing", credits: 60 },
      { code: '5KNIC012', title: 'Nursing Process in Action', credits: 30 },
      { code: '5KNIA013', title: 'Pharmacology for Healthcare Practice', credits: 15 },
      { code: '5KNIC019', title: 'Haemoglobinopathies: Client-Centred Care', credits: 15 },
      { code: '5KNIC000', title: 'Practice Assessment Document (PAD)', credits: 0 },
    ],
  },
  {
    key: 'y3',
    label: 'Year 3',
    sub: '2027–2028',
    status: 'upcoming',
    credits: 120,
    modules: [
      { code: '6KNIC021', title: "Professional Practice as a Children's Nurse", credits: 60 },
      { code: '6KNIC022', title: 'Clinical Care & Decision-Making', credits: 30 },
      { code: '—', title: 'Optional module — Term 1 (TBC)', credits: 15 },
      { code: '—', title: 'Optional module — Term 2 (TBC)', credits: 15 },
      { code: '6KNIC000', title: 'Practice Assessment Document (PAD)', credits: 0 },
    ],
  },
];

const PLACEMENTS: PlacementRow[] = [
  { emoji: '🌸', name: 'February 2026', specialty: 'Oncology', year: 'Year 1', stage: 'Complete', start: '2026-02-02', end: '2026-03-15' },
  { emoji: '🧠', name: 'July 2026', specialty: 'Neurosurgery', year: 'Year 1', stage: 'Upcoming', start: '2026-07-13', end: '2026-08-15' },
  { emoji: '🍂', name: 'October 2026', specialty: null, year: 'Year 2', stage: 'Upcoming', start: null, end: null },
  { emoji: '🌷', name: 'February 2027', specialty: null, year: 'Year 2', stage: 'Upcoming', start: null, end: null },
  { emoji: '🌻', name: 'July 2027', specialty: null, year: 'Year 2', stage: 'Upcoming', start: null, end: null },
];

const TOTAL_CREDITS = 360;
const EARNED_CREDITS = 120; // Year 1 complete
const NMC_PRACTICE_HOURS = 2300;

function classOf(pct: number): string {
  if (pct >= 70) return '1st';
  if (pct >= 60) return '2:1';
  if (pct >= 50) return '2:2';
  if (pct >= 40) return '3rd';
  return 'Fail';
}

function toneOf(pct: number): 'gold' | 'green' | 'blue' | 'rose' {
  if (pct >= 70) return 'gold';
  if (pct >= 60) return 'green';
  if (pct >= 50) return 'blue';
  return 'rose';
}

function fmtRange(start: string | null, end: string | null): string {
  if (!start) return 'Dates TBC';
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const s = new Date(start).toLocaleDateString('en-GB', opts);
  if (!end) return s;
  const e = new Date(end).toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
  return `${s} – ${e}`;
}

function daysUntil(iso: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(iso);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export default function NursingSection() {
  const next = useMemo(() => {
    const dated = PLACEMENTS.filter((p) => p.stage !== 'Complete' && p.start);
    dated.sort((a, b) => (a.start! < b.start! ? -1 : 1));
    return dated[0] ?? null;
  }, []);

  const completedPlacements = PLACEMENTS.filter((p) => p.stage === 'Complete').length;
  const creditPct = Math.round((EARNED_CREDITS / TOTAL_CREDITS) * 100);
  const nextCountdown = next?.start ? daysUntil(next.start) : null;

  return (
    <div className="nurse">
      <div className="nurse-head">
        <span className="nurse-kicker">Nursing</span>
        <h2 className="nurse-title">BSc Children&apos;s Nursing</h2>
        <p className="nurse-note">
          King&apos;s College London · Registered Children&apos;s Nurse pathway. Degree progress, module
          grades, and clinical placements — mirrored from your Notion workspace.
        </p>
      </div>

      {/* ── Headline stats ─────────────────────────────────────────────── */}
      <div className="nurse-stats">
        <div className="nurse-stat">
          <span className="nurse-stat-value">Year&nbsp;2<small>of 3</small></span>
          <span className="nurse-stat-label">Current stage</span>
        </div>
        <div className="nurse-stat">
          <span className="nurse-stat-value">{EARNED_CREDITS}<small>/ {TOTAL_CREDITS} cr</small></span>
          <span className="nurse-stat-label">Credits earned</span>
        </div>
        <div className="nurse-stat">
          <span className="nurse-stat-value nurse-stat-accent">1st</span>
          <span className="nurse-stat-label">Projected class</span>
        </div>
        <div className="nurse-stat">
          <span className="nurse-stat-value">{completedPlacements}<small>/ {PLACEMENTS.length}</small></span>
          <span className="nurse-stat-label">Placements done</span>
        </div>
      </div>

      {/* ── Next placement callout ─────────────────────────────────────── */}
      {next && (
        <aside className="nurse-next">
          <div className="nurse-next-left">
            <span className="nurse-next-kicker">Next placement</span>
            <span className="nurse-next-name">
              <span aria-hidden>{next.emoji}</span> {next.name}
              {next.specialty ? <span className="nurse-next-spec"> · {next.specialty}</span> : null}
            </span>
            <span className="nurse-next-dates">{fmtRange(next.start, next.end)}</span>
          </div>
          {nextCountdown !== null && (
            <div className="nurse-next-count">
              <span className="nurse-next-count-num">{nextCountdown <= 0 ? 'Now' : nextCountdown}</span>
              <span className="nurse-next-count-unit">
                {nextCountdown <= 0 ? 'in progress' : nextCountdown === 1 ? 'day away' : 'days away'}
              </span>
            </div>
          )}
        </aside>
      )}

      {/* ── Degree progress by year ────────────────────────────────────── */}
      <div className="nurse-section-head">
        <span className="nurse-eyebrow">Degree progress</span>
        <span className="nurse-eyebrow-note">120 credits banked · {creditPct}% of the programme complete</span>
      </div>
      <div className="nurse-years">
        {YEARS.map((y) => (
          <div key={y.key} className={`nurse-year nurse-year--${y.status}`}>
            <div className="nurse-year-top">
              <span className="nurse-year-label">{y.label}</span>
              <span className={`nurse-badge nurse-badge--${y.status}`}>
                {y.status === 'complete' ? 'Complete' : y.status === 'current' ? 'In progress' : 'Upcoming'}
              </span>
            </div>
            <span className="nurse-year-sub">{y.sub}</span>
            <div className="nurse-year-bar">
              <span
                className="nurse-year-bar-fill"
                style={{ width: y.status === 'complete' ? '100%' : y.status === 'current' ? '18%' : '0%' }}
              />
            </div>
            <div className="nurse-year-meta">
              <span>{y.credits} credits</span>
              {y.average !== undefined ? (
                <span className="nurse-year-avg">{y.average}% · {classOf(y.average)}</span>
              ) : (
                <span className="nurse-year-avg nurse-year-avg--muted">
                  {y.status === 'current' ? 'In progress' : 'Not started'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Placements timeline ────────────────────────────────────────── */}
      <div className="nurse-section-head">
        <span className="nurse-eyebrow">Placements</span>
        <span className="nurse-eyebrow-note">{NMC_PRACTICE_HOURS.toLocaleString()} practice hours needed for NMC registration</span>
      </div>
      <ul className="nurse-placements">
        {PLACEMENTS.map((p, i) => (
          <li key={i} className={`nurse-place nurse-place--${p.stage === 'Complete' ? 'done' : p.start ? 'next' : 'future'}`}>
            <span className="nurse-place-dot" aria-hidden />
            <span className="nurse-place-emoji" aria-hidden>{p.emoji}</span>
            <span className="nurse-place-main">
              <span className="nurse-place-name">
                {p.name}
                {p.specialty ? <span className="nurse-place-spec"> · {p.specialty}</span> : null}
              </span>
              <span className="nurse-place-dates">{fmtRange(p.start, p.end)} · {p.year}</span>
            </span>
            <span className={`nurse-badge nurse-badge--${p.stage === 'Complete' ? 'complete' : 'upcoming'}`}>
              {p.stage}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Modules by year ────────────────────────────────────────────── */}
      <div className="nurse-section-head">
        <span className="nurse-eyebrow">Modules &amp; grades</span>
        <span className="nurse-eyebrow-note">1st ≥ 70 · 2:1 60–69 · 2:2 50–59</span>
      </div>
      <div className="nurse-modules">
        {YEARS.map((y) => (
          <div key={y.key} className="nurse-mod-group">
            <div className="nurse-mod-group-head">
              <span className="nurse-mod-group-year">{y.label}</span>
              <span className="nurse-mod-group-sub">{y.sub}</span>
            </div>
            <ul className="nurse-mod-list">
              {y.modules.map((m) => (
                <li key={m.code + m.title} className="nurse-mod">
                  <span className="nurse-mod-code">{m.code}</span>
                  <span className="nurse-mod-title">{m.title}</span>
                  <span className="nurse-mod-credits">{m.credits ? `${m.credits} cr` : 'PAD'}</span>
                  {m.grade !== undefined ? (
                    <span className={`nurse-mod-grade nurse-mod-grade--${toneOf(m.grade)}`}>
                      {m.grade}% · {classOf(m.grade)}
                    </span>
                  ) : m.pass ? (
                    <span className="nurse-mod-grade nurse-mod-grade--pass">Pass</span>
                  ) : (
                    <span className="nurse-mod-grade nurse-mod-grade--pending">—</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
