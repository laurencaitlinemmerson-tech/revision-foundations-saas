'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const panel = '#F6F0E5';
const panelSoft = 'rgba(255,255,255,0.38)';
const border = '#D9D0C1';
const tagBg = '#EFE5D4';
const green = '#1E8A4D';
const greenBg = '#E6F4EA';

const wrap = '1120px';

const tools = [
  {
    num: '01',
    title: "Children's OSCE Tool",
    challenge: "I get nervous during OSCEs and struggle with the timed nature.",
    solution: "Simulate real OSCE scenarios with timed stations that mirror the structure of your actual exam. Practice under pressure to build confidence and improve your performance.",
    benefit: "Familiarize yourself with the exam format and reduce anxiety. Get comfortable with timed practice, and approach the real test with confidence.",
    desc: '50+ practice stations covering paediatric observations, A–E assessment, medication administration, safeguarding, and SBAR handover. Each station includes a marking checklist and timed mode.',
    tags: ['Paed obs', 'A–E', 'Medication admin', 'Safeguarding'],
    href: '/osce',
  },
  {
    num: '02',
    title: 'Core Nursing Quiz',
    challenge: "I struggle to retain key facts and formulas for my exams.",
    solution: "Our Core Quizzes help you master critical nursing concepts with targeted practice. Each quiz adapts to your skill level, so you can improve at your own pace.",
    benefit: "Track your progress and gain confidence with every quiz. Master the essential topics for your exams and retain what matters most.",
    desc: 'Topic-based revision across vital signs, drug calculations, anatomy and physiology, pharmacology, infection control, and fluid balance, with clear explanations throughout.',
    tags: ['Drug calculations', 'Vital signs', 'Pharmacology', 'Infection control'],
    href: '/quiz',
  },
  {
    num: '03',
    title: 'Revision Hub',
    challenge: "I waste time looking for the right revision material.",
    solution: "Access concise and comprehensive revision notes organized by topic. All the material you need for exams is available in one place, making revision easy and effective.",
    benefit: "Stay focused and save time by using expertly curated notes. No more searching through endless textbooks—everything is here, ready for you.",
    desc: 'Clinical guides, cheat sheets, and reference articles built around the topics nursing students actually use during placement and revision.',
    tags: ['Cheat sheets', 'Clinical guides', 'Placement tips', 'Q&A'],
    href: '/hub',
  },
];

const whyItems = [
  {
    title: 'Branch-specific content',
    text: "Children's nursing is live now, with paediatric observations, PEWS, safeguarding, and family-centred care built in from the start.",
  },
  {
    title: 'Built around real assessments',
    text: 'The structure reflects the way nursing students are actually assessed in OSCEs, written exams, and placement settings.',
  },
  {
    title: 'One payment, no subscription',
    text: 'Pay once and keep access. New material is added over time, with future updates included.',
  },
];

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const primaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '12px 24px',
  borderRadius: '9999px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const secondaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '11px 24px',
  borderRadius: '9999px',
  border: `1px solid ${border}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: serif,
  fontSize: '12px',
  color: inkMid,
  background: tagBg,
  padding: '7px 14px',
  borderRadius: '999px',
  lineHeight: 1,
};

const sampleCardStyle: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '28px',
  background: panel,
  overflow: 'hidden',
};

const sampleInnerStyle: CSSProperties = {
  padding: '24px',
};

function SampleLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: serif,
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: inkLight,
        marginBottom: '16px',
      }}
    >
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

     {/* ── Hero ── */}
<section style={{ padding: '128px 24px 108px', borderBottom: `1px solid ${border}` }}>
  <div style={{ maxWidth: wrap, margin: '0 auto' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0',
        maxWidth: '820px',
      }}
    >
      {/* New Value Proposition Headline */}
    <h1
  style={{
    fontFamily: display,
    fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
    fontWeight: 500,
    lineHeight: 1.1,
    color: ink,
    marginBottom: '16px',
    fontStyle: 'italic',  // Italics added here
  }}
>
  Pass Your Nursing Exams with Confidence
</h1>
      {/* New Value Proposition Subheading (Including Placement and Wellness) */}
      <p
        style={{
          fontFamily: serif,
          fontSize: '18px',
          lineHeight: 1.8,
          fontWeight: 300,
          color: inkMid,
          maxWidth: '590px',
          marginBottom: '34px',
        }}
      >
        OSCE practice, quizzes, guides for nursing students, and wellness support to help you excel in exams, clinical placements, and self-care throughout your journey.
      </p>

      {/* Existing Section Label (Optional) */}
      <p style={sectionLabelStyle}>OSCE prep · theory revision · placement support</p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Link href="/pricing" style={primaryButton}>
          Start revising →
        </Link>
        <Link href="/quiz" style={secondaryButton}>
          Try free preview →
        </Link>
      </div>

      {/* Pricing Info */}
      <p
        style={{
          fontFamily: serif,
          fontSize: '13px',
          lineHeight: 1.8,
          fontWeight: 300,
          color: inkLight,
        }}
      >
        £9.99 one-time payment · Lifetime access · 7-day guarantee
      </p>
    </div>
  </div>
</section>

      {/* ── Branch selector ── */}
      <section style={{ padding: '84px 24px 72px' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Choose your branch</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '32px',
            }}
          >
            Which branch are you studying?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            <Link
              href="/hub/childrens"
              style={{
                display: 'block',
                padding: '30px',
                border: `1px solid ${border}`,
                borderRadius: '24px',
                background: panelSoft,
                textDecoration: 'none',
                color: ink,
              }}
            >
              <p style={{ ...sectionLabelStyle, marginBottom: '12px' }}>Available now</p>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: '24px',
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '12px',
                }}
              >
                Children&apos;s Nursing
              </h3>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.9,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '20px',
                }}
              >
                Paediatric observations, PEWS, paediatric OSCEs, family-centred care,
                developmental milestones, and more.
              </p>
              <span style={{ fontFamily: serif, fontSize: '14px', color: ink }}>
                Browse resources →
              </span>
            </Link>

            <div
              style={{
                padding: '30px',
                border: `1px solid ${border}`,
                borderRadius: '24px',
                background: 'transparent',
                opacity: 0.72,
              }}
            >
              <p style={{ ...sectionLabelStyle, marginBottom: '12px' }}>Coming soon</p>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: '24px',
                  fontWeight: 400,
                  color: inkMid,
                  marginBottom: '12px',
                }}
              >
                Adult Nursing
              </h3>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.9,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '20px',
                }}
              >
                NEWS2, sepsis, wound care, medication management, and adult-specific OSCE
                stations.
              </p>
              <span style={{ fontFamily: serif, fontSize: '14px', color: inkMid }}>
                Join waitlist →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section style={{ padding: '32px 24px 48px' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>What&apos;s included</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: ink,
              marginBottom: '18px',
            }}
          >
            Three tools, one payment.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '580px',
              marginBottom: '40px',
            }}
          >
            A calmer, more structured way to revise for OSCEs, theory exams, and placement.
          </p>

          <div
            style={{
              border: `1px solid ${border}`,
              borderRadius: '28px',
              background: panel,
              overflow: 'hidden',
            }}
          >
            {tools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: ink,
                  padding: '34px 30px',
                  borderBottom: index !== tools.length - 1 ? `1px solid ${border}` : 'none',
                }}
              >
                <div
                  className="home-tool-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '96px minmax(0, 1fr)',
                    gap: '18px',
                    alignItems: 'start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: '30px',
                      lineHeight: 1,
                      color: '#C7B8A5',
                      paddingTop: '4px',
                    }}
                  >
                    {tool.num}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: display,
                        fontSize: '24px',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: ink,
                        marginBottom: '14px',
                      }}
                    >
                      {tool.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '14px',
                        lineHeight: 1.95,
                        fontWeight: 300,
                        color: inkMid,
                        maxWidth: '720px',
                        marginBottom: '18px',
                      }}
                    >
                      {tool.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {tool.tags.map((tag) => (
                        <span key={tag} style={tagStyle}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── A look inside ── */}
      <section style={{ padding: '36px 24px 84px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>A look inside</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: ink,
              marginBottom: '18px',
            }}
          >
            A look inside the tools.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '600px',
              marginBottom: '40px',
            }}
          >
            A few examples from the OSCE Tool, Core Quiz, and Revision Hub.
          </p>

          <div style={{ display: 'grid', gap: '18px', marginBottom: '18px' }}>
            {/* ── OSCE A-E preview (full width) ── */}
            <div style={sampleCardStyle}>
              <div
                className="home-osce-grid"
                style={{
                  padding: '26px 28px 28px',
                  display: 'grid',
                  gridTemplateColumns: '88px minmax(0, 1fr)',
                  gap: '20px',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    borderRight: `1px solid ${border}`,
                    paddingRight: '18px',
                    minHeight: '100%',
                  }}
                >
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: '84px',
                      lineHeight: 0.9,
                      color: '#2E67B1',
                      marginBottom: '10px',
                    }}
                  >
                    A
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#2E67B1',
                      background: '#E6EEF8',
                      padding: '6px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    Airway
                  </span>
                </div>

                <div>
                  <SampleLabel>OSCE station</SampleLabel>

                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '32px',
                      fontWeight: 400,
                      lineHeight: 1.1,
                      color: ink,
                      marginBottom: '8px',
                    }}
                  >
                    Airway
                  </h3>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '15px',
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                      color: inkLight,
                      marginBottom: '22px',
                    }}
                  >
                    Is the airway open and protected?
                  </p>

                  <div
                    className="home-osce-4col"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                      border: `1px solid ${border}`,
                      marginBottom: '18px',
                    }}
                  >
                    {[
                      {
                        title: 'Look',
                        items: ['Visible obstruction', 'Lip or tongue swelling', 'Facial trauma', 'Accessory muscle use'],
                      },
                      {
                        title: 'Listen',
                        items: ['Stridor (obstruction)', 'Gurgling (fluid)', 'Snoring (soft tissue)', 'Silence (complete block)'],
                      },
                      {
                        title: 'Feel',
                        items: ['Air at mouth/nose', 'Chest rise with breaths', 'Tracheal position'],
                      },
                      {
                        title: 'Act',
                        items: ['Head tilt chin lift', 'Jaw thrust if trauma', 'Suction if secretions', 'Call anaesthetics'],
                      },
                    ].map((col, idx) => (
                      <div
                        key={col.title}
                        style={{
                          padding: '18px 16px 16px',
                          borderRight: idx !== 3 ? `1px solid ${border}` : 'none',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: serif,
                            fontSize: '11px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: inkLight,
                            marginBottom: '12px',
                            paddingBottom: '10px',
                            borderBottom: `1px solid ${border}`,
                          }}
                        >
                          {col.title}
                        </p>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {col.items.map((item) => (
                            <p
                              key={item}
                              style={{
                                fontFamily: serif,
                                fontSize: '14px',
                                lineHeight: 1.6,
                                color: inkMid,
                                fontWeight: 300,
                              }}
                            >
                              – {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#B05A5A',
                      marginBottom: '10px',
                    }}
                  >
                    Red flags
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                    {['Stridor', 'Silence', 'Cyanosis', 'Cannot speak/cry', 'Drooling'].map((item) => (
                      <span key={item} style={{ ...tagStyle, background: '#F6E6E6', color: '#B05A5A' }}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div style={{ background: '#F3E6CB', padding: '18px 20px' }}>
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#9B7442',
                        marginBottom: '8px',
                      }}
                    >
                      Clinical pearl
                    </p>
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '14px',
                        lineHeight: 1.8,
                        color: inkMid,
                        fontWeight: 300,
                      }}
                    >
                      In children the narrowest point is the cricoid ring, so even mild swelling can
                      significantly reduce airway diameter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Three-column row: Quiz + Obs + Meds cheat sheet ── */}
            <div
              className="home-sample-3col"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '18px',
              }}
            >
              {/* Quiz preview */}
              <div style={sampleCardStyle}>
                <div style={sampleInnerStyle}>
                  <SampleLabel>Quiz — paediatric observations</SampleLabel>

                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '20px',
                      fontWeight: 400,
                      lineHeight: 1.25,
                      color: ink,
                      marginBottom: '18px',
                    }}
                  >
                    What&apos;s the normal HR for a 2-year-old at rest?
                  </h3>

                  <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
                    {[
                      { text: '60–100 bpm', correct: false },
                      { text: '80–120 bpm', correct: false },
                      { text: '100–140 bpm', correct: true },
                      { text: '120–160 bpm', correct: false },
                    ].map((option) => (
                      <div
                        key={option.text}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          borderRadius: '999px',
                          border: `1px solid ${option.correct ? '#A4D8B7' : border}`,
                          background: option.correct ? greenBg : 'transparent',
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '999px',
                            border: option.correct ? 'none' : `1px solid #C9C1B5`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: green,
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {option.correct ? '✓' : ''}
                        </span>
                        <span
                          style={{
                            fontFamily: serif,
                            fontSize: '13px',
                            lineHeight: 1.5,
                            color: option.correct ? green : inkMid,
                            fontWeight: option.correct ? 400 : 300,
                          }}
                        >
                          {option.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.8,
                      color: inkMid,
                      fontWeight: 300,
                    }}
                  >
                    Students often confuse paediatric and adult ranges — a common mistake in OSCE obs stations.
                  </p>
                </div>
              </div>

              {/* Obs ranges preview */}
              <div style={sampleCardStyle}>
                <div style={sampleInnerStyle}>
                  <SampleLabel>Hub resource</SampleLabel>

                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '20px',
                      fontWeight: 400,
                      lineHeight: 1.25,
                      color: ink,
                      marginBottom: '18px',
                    }}
                  >
                    Paed Normal Obs Ranges
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                      rowGap: '0',
                      marginBottom: '18px',
                    }}
                  >
                    {['Age', 'HR', 'RR', 'SBP'].map((heading) => (
                      <div
                        key={heading}
                        style={{
                          fontFamily: serif,
                          fontSize: '11px',
                          letterSpacing: '0.04em',
                          color: inkMid,
                          padding: '0 0 10px',
                        }}
                      >
                        {heading}
                      </div>
                    ))}

                    {[
                      ['Newborn', '100–160', '30–60', '50–70'],
                      ['1–12mo', '100–150', '25–50', '70–90'],
                      ['1–5yr', '90–140', '20–40', '80–100'],
                      ['5–12yr', '70–120', '15–25', '90–110'],
                    ].map((row, idx) =>
                      row.map((cell, cellIdx) => (
                        <div
                          key={`${row[0]}-${cellIdx}`}
                          style={{
                            fontFamily: serif,
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: inkMid,
                            fontWeight: 300,
                            padding: '10px 10px 10px 0',
                            background: idx % 2 === 0 ? '#EEE8DE' : 'transparent',
                          }}
                        >
                          {cell}
                        </div>
                      )),
                    )}
                  </div>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.8,
                      color: inkMid,
                      fontWeight: 300,
                    }}
                  >
                    Part of the Paediatric Vital Signs cheat sheet in the Hub.
                  </p>
                </div>
              </div>

              {/* Meds cheat sheet preview */}
              <div style={sampleCardStyle}>
                <div style={sampleInnerStyle}>
                  <SampleLabel>Hub — drug calculations</SampleLabel>

                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '20px',
                      fontWeight: 400,
                      lineHeight: 1.25,
                      color: ink,
                      marginBottom: '18px',
                    }}
                  >
                    Medication Cheat Sheet
                  </h3>

                  {/* Core formula */}
                  <div
                    style={{
                      background: '#EEE8DE',
                      padding: '16px 18px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: inkLight,
                        marginBottom: '8px',
                      }}
                    >
                      Core formula
                    </p>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '22px',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: ink,
                        lineHeight: 1.3,
                      }}
                    >
                      <span style={{ fontSize: '14px', fontStyle: 'normal', color: inkMid }}>Dose = </span>
                      What you want
                      <span style={{ fontSize: '14px', fontStyle: 'normal', color: inkMid }}> ÷ </span>
                      What you&apos;ve got
                      <span style={{ fontSize: '14px', fontStyle: 'normal', color: inkMid }}> × </span>
                      Volume
                    </p>
                  </div>

                  {/* Unit conversion staircase */}
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: inkLight,
                      marginBottom: '10px',
                    }}
                  >
                    Unit conversion staircase
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    {[
                      { unit: 'kg', indent: 0 },
                      { unit: 'g', indent: 1 },
                      { unit: 'mg', indent: 2, highlight: true },
                      { unit: 'mcg', indent: 3 },
                      { unit: 'ng', indent: 4 },
                    ].map((step, i) => (
                      <div
                        key={step.unit}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginLeft: `${step.indent * 18}px`,
                          padding: '4px 0',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: display,
                            fontSize: '15px',
                            fontWeight: step.highlight ? 500 : 400,
                            color: step.highlight ? ink : inkMid,
                            minWidth: '32px',
                          }}
                        >
                          {step.unit}
                        </span>
                        {i < 4 && (
                          <span
                            style={{
                              fontFamily: serif,
                              fontSize: '10px',
                              color: inkLight,
                            }}
                          >
                            ↓ ×1,000 &nbsp; ↑ ÷1,000
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* IV drip rate teaser */}
                  <div
                    style={{
                      background: '#EEE8DE',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: inkLight,
                        marginBottom: '6px',
                      }}
                    >
                      IV drip rate
                    </p>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '16px',
                        fontStyle: 'italic',
                        color: ink,
                        lineHeight: 1.4,
                      }}
                    >
                      Volume (ml) × Drop factor
                      <span style={{ fontSize: '13px', fontStyle: 'normal', color: inkMid }}> ÷ </span>
                      Time (hours) × 60
                    </p>
                  </div>

                  <Link
                    href="/hub/resources/drug-calculations-cheat-sheet"
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: ink,
                      textDecoration: 'none',
                      borderBottom: `0.5px solid ${border}`,
                      paddingBottom: '1px',
                    }}
                  >
                    View full cheat sheet →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bundle CTA ── */}
          <div
            className="home-bundle-cta"
            style={{
              marginTop: '44px',
              padding: '46px 40px',
              borderRadius: '28px',
              background: panel,
              border: `1px solid ${border}`,
            }}
          >
            <p style={sectionLabelStyle}>Children&apos;s Nursing Bundle</p>

            <p
              style={{
                fontFamily: display,
                fontSize: '58px',
                lineHeight: 1,
                color: ink,
                marginBottom: '14px',
              }}
            >
              £9.99
            </p>

            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                lineHeight: 1.9,
                color: inkMid,
                maxWidth: '500px',
                marginBottom: '24px',
              }}
            >
              One-time access to the OSCE Tool, Core Quiz, Revision Hub, and all future
              updates.
            </p>

            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                height: '1px',
                background: border,
                marginBottom: '24px',
              }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {['50+ OSCE stations', 'Topic-based quizzes', 'Clinical guides', 'Future updates'].map(
                (item) => (
                  <span key={item} style={tagStyle}>
                    {item}
                  </span>
                ),
              )}
            </div>

            <Link href="/pricing" style={primaryButton}>
              Start revising →
            </Link>

            <p
              style={{
                fontFamily: serif,
                fontSize: '12px',
                color: inkLight,
                marginTop: '14px',
              }}
            >
              7-day guarantee
            </p>
          </div>
        </div>
      </section>

      {/* ── Popular from the hub ── */}
      <section style={{ padding: '72px 24px 84px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>From the revision hub</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: ink,
              }}
            >
              Guides students actually use.
            </h2>

            <Link href="/hub" style={{ fontFamily: serif, fontSize: '14px', color: ink, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Browse all resources →
            </Link>
          </div>

          <div className="home-hub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
            {[
              { title: 'Drug Calculations Cheat Sheet', desc: 'Core formulas, unit conversions, and IV drip rates — the stuff you actually need on placement.', href: '/hub/resources/drug-calculations-cheat-sheet' },
              { title: 'Paediatric Vital Signs', desc: 'Normal ranges by age group for HR, RR, BP, and SpO2. The quick-reference version.', href: '/hub/resources/paeds-vital-signs-cheat-sheet' },
              { title: 'A&E Assessment Guide', desc: 'A–E assessment structure, red flags, and what to do at each step. Built for OSCE prep.', href: '/hub/resources/ae-assessment-guide' },
              { title: 'NG Tube Insertion', desc: 'Step-by-step procedure, safety checks, and common OSCE questions for nasogastric tubes.', href: '/hub/resources/ng-tube-insertion' },
              { title: 'Placement Survival Guide', desc: 'What to expect, what to bring, and how to get the most out of your clinical placement.', href: '/hub/resources/placement-survival' },
              { title: 'Medication Abbreviations', desc: 'The abbreviations you\'ll see on drug charts and prescriptions — decoded and explained.', href: '/hub/resources/medication-abbreviations' },
            ].map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                style={{
                  display: 'block',
                  padding: '24px',
                  border: `1px solid ${border}`,
                  borderRadius: '20px',
                  background: panel,
                  textDecoration: 'none',
                  color: ink,
                  transition: 'border-color 0.15s',
                }}
                className="home-hub-card"
              >
                <h3 style={{ fontFamily: display, fontSize: '18px', fontWeight: 400, color: ink, marginBottom: '10px', lineHeight: 1.25 }}>
                  {resource.title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.7, fontWeight: 300, color: inkMid }}>
                  {resource.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it exists ── */}
      <section style={{ padding: '84px 24px', background: parchment }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Why it exists</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '40px',
            }}
          >
            Designed around real nursing assessments.
          </h2>

          <div
            className="home-why-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '36px',
            }}
          >
            {whyItems.map((item) => (
              <div key={item.title}>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: 1.25,
                    color: ink,
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    lineHeight: 1.95,
                    fontWeight: 300,
                    color: inkMid,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ── Final CTA ── */}
      <section style={{ padding: '88px 24px 96px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Ready</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '14px',
            }}
          >
            Start with the tools you&apos;ll actually use.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '540px',
              marginBottom: '28px',
            }}
          >
            One payment. Lifetime access. Built for nursing students preparing for real
            assessments.
          </p>

          <Link href="/pricing" style={primaryButton}>
            Explore the bundle →
          </Link>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section
        style={{
          padding: '26px 24px',
          background: parchment,
          borderTop: `1px solid ${border}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontSize: '13px',
            lineHeight: 1.8,
            color: inkLight,
            fontWeight: 300,
          }}
        >
          Got a question or spotted something that needs updating?{' '}
          <a
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ink, textDecoration: 'underline' }}
          >
            WhatsApp me
          </a>{' '}
          or{' '}
          <Link href="/contact" style={{ color: ink, textDecoration: 'underline' }}>
            use the contact form
          </Link>
          .
        </p>
      </section>

      <Footer />

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .home-sample-3col {
            grid-template-columns: 1fr !important;
          }
          .home-why-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .home-osce-grid {
            grid-template-columns: 1fr !important;
          }
          .home-osce-4col {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .home-tool-row {
            grid-template-columns: 1fr !important;
          }
          .home-bundle-cta {
            padding: 32px 24px !important;
          }
          .home-hub-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .home-hub-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .home-osce-4col {
            grid-template-columns: 1fr !important;
          }
        }
        .home-hub-card:hover {
          border-color: #B8AD9E !important;
        }
      `}</style>
    </div>
  );
}
