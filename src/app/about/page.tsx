'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5A5750';
const inkLight = '#8D887F';
const cream = '#FAFAF8';
const softLine = 'rgba(26, 24, 21, 0.08)';
const accent = '#B76B4A';
const sage = '#5E6D61';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '10px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  lineHeight: 1.85,
  fontWeight: 300,
  color: inkMid,
};

const primaryLink: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: serif,
  fontSize: '13px',
  color: cream,
  background: ink,
  padding: '10px 20px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const ghostLink: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: serif,
  fontSize: '13px',
  color: inkMid,
  background: 'transparent',
  padding: '10px 20px',
  border: `0.5px solid rgba(26,24,21,0.25)`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '13px',
  color: inkMid,
  textDecoration: 'none',
};

const quickFacts = [
  { label: 'Background', value: 'Photography and medical illustration' },
  { label: 'Now studying', value: "Children's nursing" },
  { label: 'Built around', value: 'Placement prep, OSCEs, revision' },
  { label: 'Based in', value: 'The UK' },
];

const timelineEntries = [
  {
    period: '2021',
    title: 'Graduated with a first class in photography',
    text: 'That training taught me to care about composition, clarity, and what a person actually notices first when they are looking at a page.',
    color: '#185FA5',
  },
  {
    period: '2023',
    title: 'Completed a PgCert in medical illustration',
    text: 'I spent more time translating clinical information into visuals and wording that make sense quickly, especially when the subject matter is dense.',
    color: '#185FA5',
  },
  {
    period: 'After that',
    title: 'Moved toward healthcare more directly',
    text: 'It became obvious that I did not just want to design around healthcare. I wanted to be part of it properly, which is what brought me back into training.',
    color: '#185FA5',
  },
  {
    period: 'Now',
    title: 'Building The Nurse Lab alongside nursing study',
    text: 'The site is shaped while I am doing lectures, placement prep, OSCE practice, and the same last-minute topic refreshes that other students are dealing with too.',
    color: '#185FA5',
  },
];

const principles = [
  {
    title: 'Clear before clever',
    text: 'If a page looks polished but still makes you work harder to find the answer, it is not doing its job.',
    bar: accent,
  },
  {
    title: 'Clinical language, but still human',
    text: 'I want the wording to be accurate enough to trust, without sounding distant or burying the explanation under jargon.',
    bar: sage,
  },
  {
    title: 'Built from real student use',
    text: 'I notice quickly when something feels clunky before placement, unhelpful in revision, or too busy to open when your brain is already full.',
    bar: '#8B6B52',
  },
];

const supportNotes = [
  'Clear enough to use when you are tired',
  'Written in proper clinical language without burying the explanation',
  'Calm to look at and easy to come back to',
  'Changed when something feels clunky or unhelpful',
];

const lighterDetails = [
  'Pepsi Max Cherry',
  'Purple everything',
  'Very into calm interfaces',
  'Will always rewrite awkward wording',
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ padding: '120px 24px 0', borderBottom: `0.5px solid ${softLine}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="about-hero-grid">

            {/* Left */}
            <div style={{ paddingBottom: '64px' }}>
              <p style={sectionLabel}>About Lauren</p>

              <h1
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                  lineHeight: 1.03,
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  color: ink,
                  marginBottom: '28px',
                  maxWidth: '13ch',
                }}
              >
                A calmer kind of nursing revision, shaped by design training and real student life.
              </h1>

              <div style={{ display: 'grid', gap: '14px', maxWidth: '560px', marginBottom: '32px' }}>
                <p style={{ ...body, margin: 0 }}>
                  I graduated with a first class in photography in 2021, then completed a PgCert in
                  Medical Illustration in 2023. Now I&apos;m back studying as a
                  children&apos;s nursing student, building the kind of revision
                  support I kept wishing already existed.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  The Nurse Lab started because so many study resources felt
                  harder to use than they needed to be. Not always wrong. Just
                  noisy, cluttered, or written in a way that did not help when
                  your head was already full.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  So this site is me building something steadier: revision pages,
                  tools, and guides that feel calm, useful, and trustworthy right
                  before placement, OSCE practice, or a last-minute refresh.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href="/hub" style={primaryLink}>Browse the hub</Link>
                <Link href="/contact" style={ghostLink}>Contact me</Link>
              </div>
            </div>

            {/* Right — photo */}
            <div className="about-hero-side">
              <div
                style={{
                  overflow: 'hidden',
                  border: `0.5px solid ${softLine}`,
                }}
              >
                <div style={{ aspectRatio: '4 / 5', position: 'relative', background: '#E9E1D9' }}>
                  <Image
                    src="/DSC00374.jpg"
                    alt="Lauren"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 420px"
                    priority
                  />
                </div>
                <div style={{ padding: '20px 22px 22px', borderTop: `0.5px solid ${softLine}` }}>
                  <p style={{ ...sectionLabel, marginBottom: '6px' }}>What shapes the work</p>
                  <p style={{ ...body, margin: 0, color: ink, fontSize: '14px' }}>
                    Visual clarity, clinical accuracy, and a low-friction user experience.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Meta strip ── */}
      <div style={{ borderBottom: `0.5px solid ${softLine}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="about-meta-strip">
            {quickFacts.map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '20px 28px',
                  borderRight: i < quickFacts.length - 1 ? `0.5px solid ${softLine}` : 'none',
                }}
              >
                <p style={{ ...sectionLabel, marginBottom: '5px' }}>{item.label}</p>
                <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 500, color: ink, margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Route / Timeline ── */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="about-story-grid">

            {/* Story */}
            <div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '3px', minHeight: '1.4rem', flexShrink: 0, marginTop: '4px', background: '#185FA5', borderRadius: '0' }} />
                <div>
                  <p style={sectionLabel}>The route here</p>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                      lineHeight: 1.1,
                      fontWeight: 400,
                      color: ink,
                      maxWidth: '14ch',
                    }}
                  >
                    The timeline looks neat on paper.
                  </h2>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px', maxWidth: '540px', marginBottom: '32px' }}>
                <p style={{ ...body, margin: 0 }}>
                  Photography and medical illustration both trained me to think
                  about attention, hierarchy, and what happens when important
                  information is technically there but still hard to take in.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  When I moved into nursing training, that same frustration kept
                  showing up in revision support. Good material was often hidden
                  behind awkward layouts, vague wording, or too much visual noise.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  The Nurse Lab grew out of trying to fix that for myself first,
                  then realising other students wanted the same thing: resources
                  that feel practical, calm, and worth opening again.
                </p>
              </div>

              {/* Pull quote — bare left border only */}
              <div
                style={{
                  borderLeft: '2px solid rgba(26,24,21,0.18)',
                  paddingLeft: '20px',
                  borderRadius: '0',
                }}
              >
                <p
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.45,
                    color: ink,
                    margin: 0,
                  }}
                >
                  "If a page is confusing, too busy, or trying too hard, it gets in the way of the learning."
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p style={sectionLabel}>Timeline</p>
              <div
                style={{
                  borderLeft: `0.5px solid rgba(26,24,21,0.15)`,
                  paddingLeft: '24px',
                }}
              >
                {timelineEntries.map((entry, index) => (
                  <div
                    key={entry.title}
                    style={{
                      position: 'relative',
                      paddingBottom: index === timelineEntries.length - 1 ? 0 : '28px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '-29px',
                        top: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#C8C4BE',
                        border: `0.5px solid rgba(26,24,21,0.15)`,
                      }}
                    />
                    <p style={{ ...sectionLabel, marginBottom: '4px' }}>{entry.period}</p>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '1.15rem',
                        lineHeight: 1.25,
                        color: ink,
                        marginBottom: '6px',
                      }}
                    >
                      {entry.title}
                    </p>
                    <p style={{ ...body, fontSize: '14px', margin: 0 }}>{entry.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why I made it ── */}
      <section style={{ padding: '0 24px 72px', borderTop: `0.5px solid ${softLine}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '72px' }}>
          <div className="about-values-grid">

            <div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '3px', minHeight: '1.4rem', flexShrink: 0, marginTop: '4px', background: '#0F6E56', borderRadius: '0' }} />
                <div>
                  <p style={sectionLabel}>Why I made it</p>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                      lineHeight: 1.1,
                      fontWeight: 400,
                      color: ink,
                      maxWidth: '14ch',
                    }}
                  >
                    Thoughtful handover, not a content dump.
                  </h2>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px', maxWidth: '540px' }}>
                <p style={{ ...body, margin: 0 }}>
                  Some resources had good content buried under messy layout. Some
                  sounded polished but still did not help much in the exact moment
                  you needed something clear, specific, and grounded.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  I kept wanting pages that used proper clinical wording, but still
                  felt calm and human to read. That is the gap I&apos;m trying to
                  fill here, one page and one tool at a time.
                </p>
              </div>
            </div>

            {/* Principles — left bar markers, no icon boxes */}
            <div style={{ display: 'grid', gap: '1px', background: softLine, border: `0.5px solid ${softLine}`, overflow: 'hidden' }}>
              {principles.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: '#fff',
                    padding: '20px 22px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ width: '3px', minHeight: '1.2rem', flexShrink: 0, marginTop: '4px', background: item.bar, borderRadius: '0' }} />
                  <div>
                    <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 500, color: ink, marginBottom: '5px' }}>
                      {item.title}
                    </p>
                    <p style={{ ...body, fontSize: '13px', margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section style={{ padding: '0 24px 96px', borderTop: `0.5px solid ${softLine}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '72px' }}>
          <div className="about-closing-grid">

            <div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '3px', minHeight: '1.4rem', flexShrink: 0, marginTop: '4px', background: '#854F0B', borderRadius: '0' }} />
                <div>
                  <p style={sectionLabel}>A small note</p>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                      lineHeight: 1.1,
                      fontWeight: 400,
                      color: ink,
                      maxWidth: '14ch',
                    }}
                  >
                    I still use this site like a student, because I am one.
                  </h2>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px', maxWidth: '540px', marginBottom: '28px' }}>
                <p style={{ ...body, margin: 0 }}>
                  That means I notice quickly when wording is off, a page feels
                  too busy, or a tool adds friction instead of helping. Those are
                  usually the things I want to fix next.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  If something feels clunky, confusing, or simply not worth
                  opening, I want to know. A lot of the best improvements come
                  from those messages.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/contact" style={primaryLink}>Contact me</Link>
                <Link href="/hub" style={ghostLink}>Browse the hub</Link>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1px', background: softLine, border: `0.5px solid ${softLine}`, overflow: 'hidden', alignSelf: 'start' }}>
              <div style={{ background: '#fff', padding: '20px 22px', borderBottom: `0.5px solid ${softLine}` }}>
                <p style={{ ...sectionLabel, marginBottom: '12px' }}>What you can expect</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {supportNotes.map((item) => (
                    <p key={item} style={{ ...body, fontSize: '13px', margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', padding: '20px 22px' }}>
                <p style={{ ...sectionLabel, marginBottom: '10px' }}>A few lighter details</p>
                <p style={{ ...body, fontSize: '13px', margin: 0, lineHeight: 1.9 }}>
                  {lighterDetails.join(' · ')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 56px;
          align-items: start;
        }

        .about-meta-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .about-story-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 56px;
          align-items: start;
        }

        .about-values-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
          gap: 56px;
          align-items: start;
        }

        .about-closing-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
          gap: 56px;
          align-items: start;
        }

        @media (max-width: 860px) {
          .about-hero-grid,
          .about-story-grid,
          .about-values-grid,
          .about-closing-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .about-meta-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .about-meta-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
