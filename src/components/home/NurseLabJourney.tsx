'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  serif, display, ink, inkMid, inkLight, cream, border, sectionLabelStyle, wrap,
} from './styles';

// ── Stage data ─────────────────────────────────────────────────────────────────
const STAGES = [
  {
    num: '01',
    label: 'Start here',
    accent: '#8BBCAA',
    heading: 'Start where your head is at.',
    body: "You don't need a plan. You just need one useful next step. Open the hub, pick a topic that feels relevant, and spend ten minutes with it. That's enough to start.",
    actions: [
      { label: 'Open the hub',          href: '/hub/childrens',                    primary: true  },
      { label: 'Browse free resources', href: '/hub',                              primary: false },
    ],
  },
  {
    num: '02',
    label: 'Build the basics',
    accent: '#D4A574',
    heading: 'Work through the core guides.',
    body: 'Drug calculations, vital signs, A–E assessment, pharmacology. The clinical concepts that come up on placement, in exams, and in OSCEs. Built around how nursing students are actually assessed.',
    actions: [
      { label: 'Browse core guides', href: '/hub',   primary: true  },
      { label: 'Try quiz preview',   href: '/quiz',  primary: false },
    ],
  },
  {
    num: '03',
    label: 'Prepare for placement',
    accent: '#C89BB0',
    heading: 'Go into your next shift feeling oriented.',
    body: 'Observations, escalation, SBAR handover, documentation. A calm refresher on the situations that catch students off guard — before the shift starts, not during it.',
    actions: [
      { label: 'Placement survival guide', href: '/hub/resources/placement-survival', primary: true  },
      { label: 'Open the hub',             href: '/hub/childrens',                    primary: false },
    ],
  },
  {
    num: '04',
    label: 'Practise under pressure',
    accent: '#7BA7CC',
    heading: 'Run OSCE stations and timed recall.',
    body: '50+ paediatric stations with checklists, timed mode, and spoken structure. Active recall across 17 quiz topics. The kind of repetition that makes the real thing feel familiar.',
    actions: [
      { label: 'Start OSCE preview', href: '/osce',  primary: true  },
      { label: 'Try quiz preview',   href: '/quiz',  primary: false },
    ],
  },
  {
    num: '05',
    label: 'Walk in calmer',
    accent: '#D4B896',
    heading: 'Exams, OSCEs, placement — with less noise.',
    body: "You'll still feel the nerves. But there's a difference between nerves and unpreparedness. One payment. No subscription. Start free and unlock when you're ready.",
    actions: [
      { label: 'See pricing',   href: '/pricing',      primary: true  },
      { label: 'Open the hub', href: '/hub/childrens', primary: false },
    ],
  },
] as const;

// ── Progress rail ──────────────────────────────────────────────────────────────
function ProgressRail({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 96,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 28,
      }}
    >
      {STAGES.map((stage, i) => {
        const isActive  = i === activeIndex;
        const isPast    = i < activeIndex;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Dot */}
            <div
              style={{
                width:        isActive ? 8  : 6,
                height:       isActive ? 8  : 6,
                borderRadius: '50%',
                background:   isActive
                  ? stage.accent
                  : isPast
                    ? 'rgba(0,0,0,0.22)'
                    : 'rgba(0,0,0,0.1)',
                transition: 'all 0.35s ease',
                flexShrink: 0,
              }}
            />
            {/* Connector */}
            {i < STAGES.length - 1 && (
              <div
                style={{
                  width:      '0.5px',
                  height:     52,
                  background: isPast ? 'rgba(0,0,0,0.16)' : border,
                  transition: 'background 0.35s ease',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Single stage panel ─────────────────────────────────────────────────────────
function StagePanel({ stage }: { stage: (typeof STAGES)[number] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding:         '40px 0 40px 24px',
        borderBottom:    `0.5px solid ${border}`,
        borderLeft:      `2px solid ${stage.accent}`,
        opacity:         visible ? 1 : 0,
        transform:       visible ? 'none' : 'translateY(12px)',
        transition:      'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      {/* Stage meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{
          fontFamily:     serif,
          fontSize:       9,
          fontWeight:     500,
          letterSpacing:  '0.22em',
          textTransform:  'uppercase',
          color:          inkLight,
        }}>
          {stage.num}
        </span>
        <div style={{ width: '0.5px', height: 10, background: 'rgba(0,0,0,0.1)' }} />
        <span style={{
          fontFamily:    serif,
          fontSize:      9,
          fontWeight:    500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         inkLight,
        }}>
          {stage.label}
        </span>
      </div>

      {/* Heading */}
      <h3 style={{
        fontFamily:  display,
        fontSize:    'clamp(1.35rem, 2.8vw, 1.85rem)',
        fontWeight:  400,
        fontStyle:   'italic',
        lineHeight:  1.2,
        color:       ink,
        margin:      '0 0 14px',
      }}>
        {stage.heading}
      </h3>

      {/* Body */}
      <p style={{
        fontFamily:  serif,
        fontSize:    14,
        fontWeight:  300,
        color:       inkMid,
        lineHeight:  1.9,
        margin:      '0 0 24px',
        maxWidth:    440,
      }}>
        {stage.body}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {stage.actions.map((action, ai) =>
          action.primary ? (
            <Link key={ai} href={action.href} className="nlj-primary-link">
              {action.label} →
            </Link>
          ) : (
            <Link key={ai} href={action.href} className="nlj-secondary-link">
              {action.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function NurseLabJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            setActiveIndex(parseInt((e.target as HTMLElement).dataset.i ?? '0'));
          }
        });
      },
      { threshold: 0.25 },
    );
    panelRefs.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: cream, color: ink }}>

      {/* ── Header ── */}
      <div style={{
        padding:      '72px 28px 56px',
        maxWidth:     680,
        margin:       '0 auto',
        borderBottom: `0.5px solid ${border}`,
      }}>
        <p style={sectionLabelStyle}>Your revision journey</p>
        <h2 style={{
          fontFamily:  display,
          fontSize:    'clamp(1.9rem, 4vw, 2.6rem)',
          fontWeight:  400,
          fontStyle:   'italic',
          lineHeight:  1.18,
          color:       ink,
          margin:      '0 0 18px',
        }}>
          From overwhelmed to ready —<br />one step at a time.
        </h2>
        <p style={{
          fontFamily:  serif,
          fontSize:    15,
          fontWeight:  300,
          color:       inkMid,
          lineHeight:  1.85,
          maxWidth:    460,
          margin:      0,
        }}>
          Wherever you are in your training, there's a useful next step. Pick the one that matches where you are right now.
        </p>
      </div>

      {/* ── Two-column grid: rail + panels ── */}
      <div style={{
        maxWidth:              680,
        margin:                '0 auto',
        padding:               '0 28px',
        display:               'grid',
        gridTemplateColumns:   '20px 1fr',
        gap:                   '0 40px',
        alignItems:            'start',
      }}>
        <ProgressRail activeIndex={activeIndex} />
        <div>
          {STAGES.map((stage, i) => (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el; }}
              data-i={String(i)}
            >
              <StagePanel stage={stage} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Coda ── */}
      <div style={{
        maxWidth:   680,
        margin:     '0 auto',
        padding:    '48px 28px 72px',
        borderTop:  `0.5px solid ${border}`,
      }}>
        <p style={{
          fontFamily:  display,
          fontSize:    '1.05rem',
          fontStyle:   'italic',
          fontWeight:  400,
          color:       inkMid,
          lineHeight:  1.75,
          marginBottom: 24,
          maxWidth:    420,
        }}>
          Start free in the hub, or unlock the full bundle when you want the OSCE tool, quiz, and revision library together.
        </p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/hub/childrens" className="nlj-primary-link">Start free →</Link>
          <Link href="/pricing"       className="nlj-secondary-link">See pricing</Link>
        </div>
      </div>

      <style>{`
        .nlj-primary-link {
          font-family:     ${serif};
          font-size:       12px;
          letter-spacing:  0.06em;
          color:           ${ink};
          text-decoration: none;
          border-bottom:   0.5px solid ${ink};
          padding-bottom:  2px;
          transition:      opacity 0.15s ease;
        }
        .nlj-primary-link:hover { opacity: 0.6; }

        .nlj-secondary-link {
          font-family:     ${serif};
          font-size:       12px;
          letter-spacing:  0.04em;
          color:           ${inkLight};
          text-decoration: none;
          transition:      color 0.15s ease;
        }
        .nlj-secondary-link:hover { color: ${inkMid}; }
      `}</style>
    </section>
  );
}
