'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  serif,
  display,
  ink,
  inkMid,
  inkLight,
  cream,
  border,
  sectionLabelStyle,
  greenBg,
  tealBg,
  blueBg,
  coralBg,
} from './styles';

const STAGES = [
  {
    index: '01',
    label: 'Start here',
    tags: ['Free', 'Hub'],
    tone: '#C9A227',
    toneBg: '#F7EDD0',
    heading: 'Start where your head is at.',
    body: 'Open one practical page, not ten. A short useful block is usually enough to get moving again when revision has started to feel noisy.',
    actions: [
      { label: 'Open the hub', href: '/hub/childrens', primary: true },
      { label: 'Browse free resources', href: '/hub', primary: false },
    ],
  },
  {
    index: '02',
    label: 'Build the basics',
    tags: ['Guides', 'Quiz'],
    tone: '#8E9CB1',
    toneBg: blueBg,
    heading: 'Work through the core guides.',
    body: 'Drug calculations, A–E assessment, observations, pharmacology, and the pieces that keep turning up across lectures, exams, and placement.',
    actions: [
      { label: 'Browse core guides', href: '/hub', primary: true },
      { label: 'Try quiz preview', href: '/quiz', primary: false },
    ],
  },
  {
    index: '03',
    label: 'Placement',
    tags: ['Placement', 'Refreshers'],
    tone: '#7D998E',
    toneBg: greenBg,
    heading: 'Go into your next shift feeling oriented.',
    body: 'Refresh observations, escalation, documentation, and communication before placement days instead of trying to remember everything in the moment.',
    actions: [
      { label: 'Placement survival guide', href: '/hub/resources/placement-survival', primary: true },
      { label: 'Open the children’s hub', href: '/hub/childrens', primary: false },
    ],
  },
  {
    index: '04',
    label: 'Practise',
    tags: ['OSCE', 'Timed'],
    tone: '#8AA9C3',
    toneBg: tealBg,
    heading: 'Practise under a little pressure.',
    body: 'Once the basics are steadier, move into recall and repetition with short quiz blocks and structured OSCE runs that make the real thing feel less alien.',
    actions: [
      { label: 'Start OSCE preview', href: '/osce', primary: true },
      { label: 'Try quiz preview', href: '/quiz', primary: false },
    ],
  },
  {
    index: '05',
    label: 'Ready',
    tags: ['Bundle', 'Lifetime'],
    tone: '#C7B39B',
    toneBg: coralBg,
    heading: 'Walk in calmer.',
    body: 'Still nervous, probably. But clearer on the essentials, steadier in your wording, and less likely to feel completely thrown when it matters.',
    actions: [
      { label: 'See pricing', href: '/pricing', primary: true },
      { label: 'Start free first', href: '/hub/childrens', primary: false },
    ],
  },
] as const;

export default function NurseLabJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const visible = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index ?? '0');
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        });

        if (visible.size > 0) {
          setActiveIndex(Math.min(...visible));
        }
      },
      { rootMargin: '-12% 0px -62% 0px', threshold: 0 },
    );

    stageRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ background: cream, borderTop: `0.5px solid ${border}` }}>
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '84px 28px 82px',
        }}
      >
        <div style={{ maxWidth: '620px', marginBottom: '40px' }}>
          <p style={sectionLabelStyle}>How it fits together</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.1rem, 4.2vw, 3.35rem)',
              fontWeight: 400,
              lineHeight: 1.06,
              color: ink,
              margin: '0 0 14px',
              maxWidth: '12ch',
            }}
          >
            A calmer path through exams, OSCEs, and placement.
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: '15px',
              lineHeight: 1.85,
              fontWeight: 300,
              color: inkMid,
              margin: 0,
              maxWidth: '42ch',
            }}
          >
            Not a perfect system. Just a clearer order for what to open first, what to practise next, and where the tools start to help.
          </p>
        </div>

        <div className="nlj-list">
          {STAGES.map((stage, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={stage.index}
                ref={(element) => {
                  stageRefs.current[index] = element;
                }}
                data-index={String(index)}
                className="nlj-row"
                style={{
                  opacity: isActive ? 1 : 0.28,
                  transition: 'opacity 0.45s ease',
                }}
              >
                <div className="nlj-rail-col">
                  <div
                    style={{
                      width: isActive ? '18px' : '14px',
                      height: isActive ? '18px' : '14px',
                      borderRadius: '999px',
                      background: isActive ? stage.tone : '#F5F3F0',
                      border: `0.5px solid ${isActive ? stage.tone : 'rgba(26,24,21,0.12)'}`,
                      transition: 'all 0.35s ease',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </div>

                <div className="nlj-content-col">
                  <div className="nlj-meta-line">
                    <span className="nlj-time">{stage.index}:00</span>
                    <span className="nlj-tag-row">
                      {stage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="nlj-tag"
                          style={{
                            color: isActive ? stage.tone : '#C9C1B7',
                            background: isActive ? stage.toneBg : '#FBF8F3',
                            borderColor: isActive ? 'transparent' : 'rgba(26,24,21,0.06)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: isActive ? stage.tone : inkLight,
                      margin: '0 0 10px',
                    }}
                  >
                    {stage.label}
                  </p>

                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(1.55rem, 2.6vw, 2.15rem)',
                      lineHeight: 1.14,
                      fontWeight: 400,
                      color: ink,
                      margin: '0 0 12px',
                    }}
                  >
                    {stage.heading}
                  </h3>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '14px',
                      lineHeight: 1.85,
                      fontWeight: 300,
                      color: inkMid,
                      margin: '0 0 18px',
                      maxWidth: '44ch',
                    }}
                  >
                    {stage.body}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      flexWrap: 'wrap',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                  >
                    {stage.actions.map((action) =>
                      action.primary ? (
                        <Link key={action.label} href={action.href} className="nlj-primary-link">
                          {action.label} →
                        </Link>
                      ) : (
                        <Link key={action.label} href={action.href} className="nlj-secondary-link">
                          {action.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .nlj-list {
          position: relative;
        }

        .nlj-list::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 108px;
          width: 0.5px;
          background: ${border};
        }

        .nlj-row {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 28px;
        }

        .nlj-rail-col {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 2px;
        }

        .nlj-content-col {
          padding-bottom: 74px;
        }

        .nlj-meta-line {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .nlj-time {
          font-family: ${serif};
          font-size: 22px;
          line-height: 1;
          color: ${inkLight};
        }

        .nlj-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .nlj-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border: 0.5px solid transparent;
          font-family: ${serif};
          font-size: 10px;
          line-height: 1;
        }

        .nlj-primary-link {
          font-family: ${serif};
          font-size: 13px;
          color: ${ink};
          text-decoration: none;
          border-bottom: 0.5px solid ${ink};
          padding-bottom: 2px;
          transition: opacity 0.15s ease;
        }

        .nlj-primary-link:hover {
          opacity: 0.56;
        }

        .nlj-secondary-link {
          font-family: ${serif};
          font-size: 13px;
          color: ${inkLight};
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .nlj-secondary-link:hover {
          color: ${inkMid};
        }

        @media (max-width: 768px) {
          .nlj-list::before {
            left: 5px;
          }

          .nlj-row {
            grid-template-columns: 24px minmax(0, 1fr);
            gap: 18px;
          }

          .nlj-content-col {
            padding-bottom: 58px;
          }

          .nlj-time {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
