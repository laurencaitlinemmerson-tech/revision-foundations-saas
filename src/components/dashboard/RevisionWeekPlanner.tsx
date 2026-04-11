'use client';

import { useState } from 'react';

// ── Design tokens ──────────────────────────────────────────────────────────────
const serif   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink     = '#1A1815';
const mid     = '#5A5750';
const muted   = '#9C8878';

// ── Revision week data ─────────────────────────────────────────────────────────
const WEEK = [
  {
    day: 'Mon',
    theme: 'Respiratory',
    durationHrs: 1.5,
    rest: false,
    tasks: [
      { label: 'Airway assessment guide',    type: 'hub'  },
      { label: 'OSCE: chest auscultation',   type: 'osce' },
      { label: 'Quiz: 10 respiratory Qs',    type: 'quiz' },
    ],
  },
  {
    day: 'Tue',
    theme: 'Pharmacology',
    durationHrs: 1,
    rest: false,
    tasks: [
      { label: 'Drug calculations guide', type: 'hub'  },
      { label: 'Quiz: 15-question set',   type: 'quiz' },
    ],
  },
  {
    day: 'Wed',
    theme: 'Neurological',
    durationHrs: 1.5,
    rest: false,
    tasks: [
      { label: 'Neuro assessment guide',       type: 'hub'  },
      { label: 'OSCE: pupil response station', type: 'osce' },
      { label: 'Quiz: 10 neuro Qs',            type: 'quiz' },
    ],
  },
  {
    day: 'Thu',
    theme: 'Rest day',
    durationHrs: 0,
    rest: true,
    tasks: [
      { label: 'Light reading only if needed', type: 'rest' },
    ],
  },
  {
    day: 'Fri',
    theme: 'Cardiac',
    durationHrs: 1.5,
    rest: false,
    tasks: [
      { label: 'ECG interpretation guide',    type: 'hub'  },
      { label: 'OSCE: cardiac auscultation',  type: 'osce' },
      { label: 'Quiz: 10 cardiac Qs',         type: 'quiz' },
    ],
  },
  {
    day: 'Sat',
    theme: 'Mock exam',
    durationHrs: 1,
    rest: false,
    tasks: [
      { label: '30-question timed mock',  type: 'quiz' },
      { label: 'Review all wrong answers', type: 'hub' },
    ],
  },
  {
    day: 'Sun',
    theme: 'Rest day',
    durationHrs: 0,
    rest: true,
    tasks: [
      { label: 'Reflect on the week', type: 'rest' },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  hub:  '#D4A574',
  osce: '#8BBCAA',
  quiz: '#C89BB0',
  rest: 'rgba(0,0,0,0.1)',
};

// ── ICS helpers ────────────────────────────────────────────────────────────────
function getNextMonday(): Date {
  const d = new Date();
  const jsDay = d.getDay(); // 0=Sun
  const diff  = jsDay === 0 ? 1 : 8 - jsDay;
  d.setDate(d.getDate() + diff);
  d.setHours(9, 0, 0, 0);
  return d;
}

function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function buildICS(): string {
  const monday = getNextMonday();
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//The Nurse Lab//Revision Week//EN',
  ];

  WEEK.forEach((day, i) => {
    if (day.rest) return;
    const start = new Date(monday);
    start.setDate(monday.getDate() + i);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setTime(start.getTime() + day.durationHrs * 60 * 60 * 1000);

    lines.push(
      'BEGIN:VEVENT',
      `UID:nurselab-week-${i}-${Date.now()}@thenurselab.com`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:The Nurse Lab — ${day.theme} revision`,
      `DESCRIPTION:${day.tasks.map((t) => t.label).join(', ')}`,
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadICS() {
  const blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'nurse-lab-revision-week.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function buildTextVersion(): string {
  return WEEK.map((d) =>
    `${d.day} — ${d.theme}${d.durationHrs ? ` (~${d.durationHrs} hrs)` : ''}\n` +
    d.tasks.map((t) => `  · ${t.label}`).join('\n'),
  ).join('\n\n');
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function RevisionWeekPlanner() {
  const [icsState,  setIcsState]  = useState<'idle' | 'done'>('idle');
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');

  function handleExport() {
    downloadICS();
    setIcsState('done');
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildTextVersion()).then(() => {
      setCopyState('done');
      setTimeout(() => setCopyState('idle'), 2200);
    });
  }

  return (
    <div>
      {/* Header row */}
      <div className="rwp-header">
        <div>
          <p style={{
            fontFamily: display, fontSize: '1.3rem', fontWeight: 400,
            color: ink, marginBottom: '6px', lineHeight: 1.2,
          }}>
            A balanced week before placement
          </p>
          <p style={{
            fontFamily: serif, fontSize: '12px', color: mid,
            fontWeight: 300, lineHeight: 1.75, maxWidth: '46ch',
          }}>
            One topic focus per day, one practice format, and a realistic time target.
            Rest days are built in — they matter as much as the study days.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleExport}
            disabled={icsState === 'done'}
            title="Export this revision week to your calendar app"
            style={{
              fontFamily: serif, fontSize: '11px', letterSpacing: '0.08em',
              padding: '9px 20px', cursor: icsState === 'done' ? 'default' : 'pointer',
              border: 'none', whiteSpace: 'nowrap',
              background: icsState === 'done' ? '#6B9E87' : '#1A1815',
              color: '#FAFAF8',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (icsState !== 'done') { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.background = '#2C2A27'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.background = icsState === 'done' ? '#6B9E87' : '#1A1815'; }}
          >
            {icsState === 'done' ? 'Downloaded ✓' : 'Add to calendar (.ics) ↓'}
          </button>
          <button
            onClick={handleCopy}
            title="Copy revision week as plain text"
            style={{
              fontFamily: serif, fontSize: '11px', letterSpacing: '0.08em',
              padding: '9px 20px', cursor: 'pointer',
              border: '0.5px solid rgba(0,0,0,0.14)',
              background: '#fff', color: ink, whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.background = '#F5F3F0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
          >
            {copyState === 'done' ? 'Copied ✓' : 'Copy as text'}
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="rwp-grid">
        {WEEK.map((d) => (
          <div
            key={d.day}
            className="rwp-day-tile"
            style={{
              background: '#fff',
              border: '0.5px solid rgba(0,0,0,0.07)',
              opacity: d.rest ? 0.7 : 1,
            }}
          >
            {/* Day header */}
            <div style={{
              padding: '10px 12px 8px',
              borderBottom: '0.5px solid rgba(0,0,0,0.06)',
            }}>
              <p style={{
                fontFamily: serif, fontSize: '10px', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: muted, marginBottom: '2px',
              }}>
                {d.day}
              </p>
              <p style={{
                fontFamily: serif, fontSize: '11px',
                fontWeight: d.rest ? 400 : 500,
                color: d.rest ? '#B4A89C' : ink,
                lineHeight: 1.3,
              }}>
                {d.theme}
              </p>
            </div>

            {/* Tasks */}
            <div style={{ padding: '10px 12px' }}>
              {d.tasks.map((t, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    marginBottom: i < d.tasks.length - 1 ? '5px' : 0,
                    lineHeight: 1.4,
                    borderLeft: `2px solid ${TYPE_COLORS[t.type] ?? 'transparent'}`,
                    background: 'rgba(250,248,246,0.8)',
                    color: t.type === 'rest' ? '#B4A89C' : '#2C2A27',
                    fontFamily: serif,
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>

            {/* Time estimate */}
            <p style={{
              fontFamily: serif, fontSize: '9px', color: '#C4B4A8',
              padding: '0 12px 10px', fontWeight: 300,
            }}>
              {d.durationHrs ? `~${d.durationHrs} hrs` : 'Off'}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Hub / reading', color: '#D4A574' },
          { label: 'OSCE practice', color: '#8BBCAA' },
          { label: 'Quiz',          color: '#C89BB0' },
          { label: 'Rest',          color: 'rgba(0,0,0,0.12)' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '1px',
              background: l.color, display: 'inline-block',
            }} />
            <span style={{ fontFamily: serif, fontSize: '10px', color: muted }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Export note */}
      <p style={{
        fontFamily: serif, fontSize: '11px', color: '#B4A89C',
        fontWeight: 300, lineHeight: 1.7, marginTop: '18px',
        paddingTop: '16px', borderTop: '0.5px solid rgba(0,0,0,0.07)',
      }}>
        The .ics file works with Google Calendar, Apple Calendar, and Outlook.
        Each study session is added as a timed event starting Monday at 9am —
        drag them once imported to fit your timetable.
      </p>

      <style>{`
        .rwp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .rwp-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }
        .rwp-day-tile {
          cursor: default;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .rwp-day-tile:hover {
          transform: translateY(-2px);
          border-color: rgba(0,0,0,0.16) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .rwp-day-tile { transition: none; }
        }
        @media (max-width: 860px) {
          .rwp-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .rwp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rwp-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
