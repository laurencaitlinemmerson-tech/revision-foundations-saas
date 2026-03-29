'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const paper = '#F7F2E8';
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';
const blush = '#EEE4DE';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 2,
  fontWeight: 300,
  color: inkMid,
};

const smallCaps: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
};

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '14px',
  color: ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '34px',
  background: parchment,
  overflow: 'hidden',
};

const chip: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: serif,
  fontSize: '13px',
  lineHeight: 1,
  color: inkMid,
  padding: '9px 15px',
  borderRadius: '999px',
  background: blush,
};

const introPoints = [
  {
    number: '01',
    title: 'Thoughtful design',
    text: 'Made to feel calm, clear, and easy to come back to when revision already feels heavy.',
  },
  {
    number: '02',
    title: 'Built from practice',
    text: 'Shaped by placement learning, real nursing study, and the things I actually needed myself.',
  },
  {
    number: '03',
    title: 'Actually useful',
    text: 'Created for OSCE prep, theory revision, placement support, and quick refreshers that save time.',
  },
  {
    number: '04',
    title: 'Still evolving',
    text: 'Everything gets improved when it feels clunky, unclear, or not quite helpful enough.',
  },
];

const supportItems = [
  'Resources that are clear before they are clever',
  'Revision tools designed to feel calm, not chaotic',
  'Useful support for both OSCE prep and theory',
  'Content that gets updated when something needs improving',
];

const laurenFacts = [
  "Children's nursing student",
  'Former medical photographer',
  'Pepsi Max Cherry',
  'Purple everything',
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section className="about-hero" style={{ padding: '132px 24px 60px' }}>
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-34px',
              left: '-26px',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background: 'rgba(238, 228, 222, 0.55)',
              filter: 'blur(10px)',
              zIndex: 0,
            }}
          />

          <div
            className="about-hero-grid"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div>
              <p
                style={{
                  ...smallCaps,
                  marginBottom: '18px',
                }}
              >
                Founder story · Revision Foundations
              </p>

              <h1
                className="about-headline"
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(3.2rem, 7.5vw, 5.4rem)',
                  lineHeight: 0.98,
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  color: ink,
                  marginBottom: '24px',
                }}
              >
                Hi, I&apos;m Lauren.
              </h1>

              <p
                style={{
                  ...body,
                  fontSize: '18px',
                  maxWidth: '590px',
                  marginBottom: '0',
                }}
              >
                I&apos;m a children&apos;s nursing student and the person behind
                Revision Foundations. I started making these resources because I
                wanted revision tools that felt thoughtful, calm, and genuinely
                lovely to use.
              </p>
            </div>

            <div className="about-right-col">
              <div
                className="about-photo-frame"
                style={{
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: `1px solid ${softLine}`,
                  background: parchment,
                  aspectRatio: '4 / 5',
                  position: 'relative',
                }}
              >
                <Image
                  src="/DSC00374.jpg"
                  alt="Lauren"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 200px, 280px"
                  priority
                />
                

              <div className="about-facts-section">
                <p style={{ ...smallCaps, marginBottom: '14px' }}>
                  A few Lauren things
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {laurenFacts.map((item) => (
                    <span key={item} style={chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="intro-points-grid">
            {introPoints.map((item) => (
              <div
                key={item.number}
                style={{
                  padding: '20px 0 0',
                  borderTop: `1px solid ${softLine}`,
                }}
              >
                <p style={{ ...smallCaps, marginBottom: '10px' }}>{item.number}</p>

                <p
                  style={{
                    fontFamily: display,
                    fontSize: '1.35rem',
                    lineHeight: 1.15,
                    color: ink,
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </p>

                <p
                  style={{
                    ...body,
                    fontSize: '15px',
                    lineHeight: 1.85,
                    maxWidth: '270px',
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 68px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="founder-card" style={editorialCard}>
            <div className="founder-card-inner">
              <div
                className="founder-sidebar"
                style={{
                  borderRight: `1px solid ${softLine}`,
                  padding: '42px 24px 42px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: display,
                      fontSize: '92px',
                      lineHeight: 0.9,
                      color: '#BBAA96',
                      marginBottom: '16px',
                    }}
                  >
                    L
                  </p>

                  <p style={smallCaps}>Founder note</p>
                </div>
              </div>

              <div className="founder-content" style={{ padding: '42px 40px 46px' }}>
                <p style={sectionLabel}>How this started</p>

                <p style={{ ...body, marginBottom: '18px', maxWidth: '620px' }}>
                  Before nursing, I worked as a medical photographer in hospitals.
                  I loved being in clinical environments, but it never quite felt
                  like the right fit for me.
                </p>

                <p style={{ ...body, marginBottom: '18px', maxWidth: '620px' }}>
                  At 25, I decided to change direction, applied to nursing, and
                  got in. Children&apos;s nursing felt right almost immediately.
                  From my first placement, I knew it was where I wanted to be.
                </p>

                <div className="founder-aside-grid">
                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '22px',
                      background: 'rgba(249, 246, 240, 0.7)',
                      border: `1px solid ${softLine}`,
                    }}
                  >
                    <p style={{ ...smallCaps, marginBottom: '8px' }}>Why I made it</p>
                    <p style={{ ...body, fontSize: '14px', lineHeight: 1.9 }}>
                      Most revision resources felt overwhelming, badly designed,
                      or just not very kind to use when you were already tired.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '22px',
                      background: 'rgba(249, 246, 240, 0.7)',
                      border: `1px solid ${softLine}`,
                    }}
                  >
                    <p style={{ ...smallCaps, marginBottom: '8px' }}>What mattered</p>
                    <p style={{ ...body, fontSize: '14px', lineHeight: 1.9 }}>
                      I wanted resources that felt clear, calm, practical, and
                      genuinely helpful in real revision moments.
                    </p>
                  </div>
                </div>

                <p style={{ ...body, margin: '26px 0 28px', maxWidth: '620px' }}>
                  So I started making my own. At first they were just for me.
                  Then people on my course started asking for them too, and
                  that&apos;s when Revision Foundations slowly became a real thing.
                </p>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '560px',
                    height: '1px',
                    background: softLine,
                    marginBottom: '28px',
                  }}
                />

                <p style={{ ...body, maxWidth: '620px' }}>
                  I still make everything in the same way — based on what
                  actually feels helpful when you&apos;re revising, not what
                  sounds good on paper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 84px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="what-grid">
            <div
              style={{
                padding: '24px 10px 18px 0',
                alignSelf: 'center',
              }}
            >
              <p style={sectionLabel}>What this is</p>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.1rem, 4vw, 3rem)',
                  lineHeight: 1.06,
                  color: ink,
                  marginBottom: '18px',
                  maxWidth: '520px',
                }}
              >
                Revision tools made the way I wanted them to feel.
              </p>

              <p style={{ ...body, maxWidth: '560px' }}>
                Clear, practical, and actually nice to come back to. Built for
                OSCE prep, theory revision, placement support, and those quick
                refreshers you always seem to need at exactly the wrong moment.
              </p>
            </div>

            <div
              style={{
                borderRadius: '30px',
                background: 'rgba(243, 238, 228, 0.82)',
                border: `1px solid ${softLine}`,
                marginTop: '18px',
              }}
            >
              <div style={{ padding: '30px 28px 32px' }}>
                <p style={sectionLabel}>What you can expect</p>

                <div style={{ display: 'grid', gap: '0' }}>
                  {supportItems.map((item, index) => (
                    <div
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 0',
                        borderTop: index === 0 ? 'none' : `1px solid ${softLine}`,
                        color: inkMid,
                      }}
                    >
                      <span
                        style={{
                          ...smallCaps,
                          minWidth: '26px',
                          paddingTop: '4px',
                        }}
                      >
                        0{index + 1}
                      </span>

                      <span
                        style={{
                          fontFamily: serif,
                          fontSize: '15px',
                          lineHeight: 1.8,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div
            style={{
              borderTop: `1px solid ${softLine}`,
              paddingTop: '34px',
            }}
          >
            <p style={sectionLabel}>A small note</p>

            <div className="closing-grid">
              <div>
                <p
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                    lineHeight: 1.1,
                    color: ink,
                    marginBottom: '16px',
                    maxWidth: '560px',
                  }}
                >
                  I still use these resources myself.
                </p>

                <p style={{ ...body, marginBottom: '18px', maxWidth: '620px' }}>
                  Which means I notice pretty quickly when something feels
                  unclear, clunky, or like it needs improving.
                </p>

                <p style={{ ...body, marginBottom: '24px', maxWidth: '620px' }}>
                  If you ever have a question, spot something that doesn&apos;t
                  make sense, or just want to say hi, I really do read every
                  message.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <Link href="/contact" style={textLink}>
                    Contact me →
                  </Link>

                  <Link href="/hub" style={textLink}>
                    Browse the hub →
                  </Link>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '8px',
                }}
              >
                <p style={{ ...smallCaps, marginBottom: '14px' }}>
                  What matters here
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                  }}
                >
                  {[
                    'Keep things clear',
                    'Make them easy to return to',
                    'Improve what feels off',
                    'Stay useful in real revision',
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingBottom: '12px',
                        borderBottom: `1px solid ${softLine}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: display,
                          fontSize: '18px',
                          color: '#BBAA96',
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: serif,
                          fontSize: '15px',
                          color: inkMid,
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.9fr);
          gap: 48px;
          align-items: start;
        }

        .about-right-col {
          padding-top: 24px;
        }

        .about-photo-frame {
          max-width: 280px;
        }

        .about-facts-section {
          margin-top: 24px;
          padding-left: 24px;
          border-left: 1px solid rgba(217, 208, 193, 0.7);
        }

        .intro-points-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 28px;
        }

        .founder-card-inner {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 0;
        }

        .founder-aside-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 26px;
        }

        .what-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(250px, 330px);
          gap: 28px;
          align-items: start;
        }

        .closing-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
          gap: 40px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .about-hero {
            padding-top: 108px !important;
            padding-bottom: 52px !important;
          }

          .about-hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .about-right-col {
            display: flex;
            flex-direction: row;
            align-items: start;
            gap: 24px;
            padding-top: 0;
          }

          .about-photo-frame {
            max-width: 140px;
            min-width: 120px;
            flex-shrink: 0;
          }

          .about-facts-section {
            margin-top: 0 !important;
            border-left: none !important;
            padding-left: 0 !important;
          }

          .about-headline {
            font-size: clamp(2.4rem, 9vw, 3.6rem) !important;
          }

          .intro-points-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .founder-card-inner {
            grid-template-columns: 1fr;
          }

          .founder-sidebar {
            border-right: none !important;
            border-bottom: 1px solid rgba(217, 208, 193, 0.7);
            padding: 28px 28px 24px !important;
            flex-direction: row !important;
            align-items: center;
            gap: 16px;
          }

          .founder-sidebar > div > p:first-child {
            font-size: 48px !important;
            margin-bottom: 0 !important;
          }

          .founder-content {
            padding: 28px !important;
          }

          .founder-aside-grid {
            grid-template-columns: 1fr;
          }

          .what-grid,
          .closing-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        @media (max-width: 480px) {
          .about-right-col {
            flex-direction: column;
          }

          .about-photo-frame {
            max-width: 160px;
          }
        }
      `}</style>
    </div>
  );
}
