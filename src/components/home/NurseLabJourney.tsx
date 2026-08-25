'use client';

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
  parchment,
} from './styles';

const STAGES = [
  {
    step: '01',
    label: 'Start here',
    tags: ['Free', 'Hub'],
    tone: '#6F8D7E',
    toneBg: greenBg,
    heading: 'Start where your head is at.',
    body: 'Open one useful page, not twelve. A short practical block is usually enough to get moving again.',
    actions: [
      { label: 'Open the hub', href: '/hub/childrens', primary: true },
      { label: 'Browse free resources', href: '/hub', primary: false },
    ],
  },
  {
    step: '02',
    label: 'Build the basics',
    tags: ['Guides', 'Quiz'],
    tone: '#7E94AD',
    toneBg: blueBg,
    heading: 'Work through the core guides.',
    body: 'Drug calculations, A–E, observations, pharmacology, and the topics that keep showing up.',
    actions: [
      { label: 'Browse core guides', href: '/hub', primary: true },
      { label: 'Try quiz preview', href: '/quiz', primary: false },
    ],
  },
  {
    step: '03',
    label: 'Placement',
    tags: ['Placement', 'Refreshers'],
    tone: '#6E8F8A',
    toneBg: tealBg,
    heading: 'Go into your next shift feeling oriented.',
    body: 'Refresh escalation, documentation, communication, and practical details before placement days.',
    actions: [
      { label: 'Placement survival guide', href: '/hub/resources/placement-survival', primary: true },
      { label: 'Open the children’s hub', href: '/hub/childrens', primary: false },
    ],
  },
  {
    step: '04',
    label: 'Practise',
    tags: ['OSCE', 'Timed'],
    tone: '#8B8F98',
    toneBg: parchment,
    heading: 'Practise under a little pressure.',
    body: 'Move into recall and repetition with short quiz blocks and steadier OSCE runs.',
    actions: [
      { label: 'Start OSCE preview', href: '/osce', primary: true },
      { label: 'Try quiz preview', href: '/quiz', primary: false },
    ],
  },
  {
    step: '05',
    label: 'Ready',
    tags: ['Bundle', 'Lifetime'],
    tone: '#9A948C',
    toneBg: 'var(--surface-sunken)',
    heading: 'Walk in calmer.',
    body: 'Still nervous, probably. Just less scrambled, better oriented, and clearer on the essentials.',
    actions: [
      { label: 'See pricing', href: '/pricing', primary: true },
      { label: 'Start free first', href: '/hub/childrens', primary: false },
    ],
  },
] as const;

export default function NurseLabJourney() {
  return (
    <section style={{ background: cream, borderTop: `0.5px solid ${border}` }}>
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '64px 24px 68px',
        }}
      >
        <div style={{ maxWidth: '560px', marginBottom: '28px' }}>
          <p style={sectionLabelStyle}>How it fits together</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(1.85rem, 3.6vw, 2.65rem)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: ink,
              margin: '0 0 12px',
              maxWidth: '13ch',
            }}
          >
            A calmer path through exams, OSCEs, and placement.
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: '14px',
              lineHeight: 1.82,
              fontWeight: 300,
              color: inkMid,
              margin: 0,
              maxWidth: '40ch',
            }}
          >
            Not a huge system. Just a clearer order for what to open first, what to practise next, and where the tools start to help.
          </p>
        </div>

        <div className="nlj-list">
          {STAGES.map((stage) => (
            <div key={stage.step} className="nlj-row">
              <div className="nlj-rail-col">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '999px',
                    background: 'var(--surface-page)',
                    border: `0.5px solid ${stage.tone}`,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>

              <div className="nlj-content-col">
                <div className="nlj-meta-line">
                  <span className="nlj-time">Step {stage.step}</span>
                  <span className="nlj-tag-row">
                    {stage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="nlj-tag"
                        style={{
                          color: stage.tone,
                          background: stage.toneBg,
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
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: inkLight,
                    margin: '0 0 8px',
                  }}
                >
                  {stage.label}
                </p>

                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(1.28rem, 2.2vw, 1.7rem)',
                    lineHeight: 1.16,
                    fontWeight: 400,
                    color: ink,
                    margin: '0 0 10px',
                  }}
                >
                  {stage.heading}
                </h3>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.78,
                    fontWeight: 300,
                    color: inkMid,
                    margin: 0,
                    maxWidth: '42ch',
                  }}
                >
                  {stage.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .nlj-list {
          position: relative;
        }

        .nlj-list::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 6px;
          bottom: 86px;
          width: 0.5px;
          background: ${border};
        }

        .nlj-row {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr);
          gap: 20px;
        }

        .nlj-rail-col {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 2px;
        }

        .nlj-content-col {
          padding-bottom: 36px;
        }

        .nlj-meta-line {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .nlj-time {
          font-family: ${serif};
          font-size: 13px;
          line-height: 1;
          color: ${inkLight};
          letter-spacing: 0.04em;
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
          padding: 3px 7px;
          font-family: ${serif};
          font-size: 10px;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .nlj-row {
            grid-template-columns: 18px minmax(0, 1fr);
            gap: 16px;
          }

          .nlj-content-col {
            padding-bottom: 28px;
          }

          .nlj-list::before {
            bottom: 56px;
          }
        }
      `}</style>
    </section>
  );
}
