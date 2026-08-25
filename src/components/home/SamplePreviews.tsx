'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  serif, display, ink, inkMid, inkLight, border, parchment,
  green, greenBg, sectionLabelStyle, tagStyle, sampleCardStyle, sampleInnerStyle, wrap,
} from './styles';
import { quizPreviewOptions } from './data';

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

export default function SamplePreviews() {
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const selectedQuizOption =
    selectedQuizAnswer === null ? null : quizPreviewOptions[selectedQuizAnswer];
  const quizAnsweredCorrectly = selectedQuizOption?.correct ?? false;

  return (
    <section style={{ padding: '56px 24px 76px', borderTop: `0.5px solid ${border}` }}>
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
            marginBottom: '34px',
          }}
        >
          A few examples from the OSCE Tool, Core Quiz, and Revision Hub.
        </p>

        <div style={{ display: 'grid', gap: '18px', marginBottom: '18px' }}>
          {/* OSCE A-E preview (full width) */}
          <div style={sampleCardStyle} className="home-preview-card">
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
                  borderRight: `0.5px solid ${border}`,
                  paddingRight: '18px',
                  minHeight: '100%',
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: '84px',
                    lineHeight: 0.9,
                    color: 'var(--topic-assessment-text)',
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
                    color: 'var(--topic-assessment-text)',
                    background: 'var(--topic-assessment-surface)',
                    padding: '6px 10px',
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
                    border: `0.5px solid ${border}`,
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
                      items: ['Head tilt chin lift', 'Jaw thrust if trauma', 'Suction if secretions'],
                    },
                  ].map((col, idx) => (
                    <div
                      key={col.title}
                      className="home-osce-col"
                      style={{
                        padding: '18px 16px 16px',
                        borderRight: idx !== 3 ? `0.5px solid ${border}` : 'none',
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
                          borderBottom: `0.5px solid ${border}`,
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
                    color: 'var(--state-incorrect-text)',
                    marginBottom: '10px',
                  }}
                >
                  Red flags
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                  {['Stridor', 'Silence', 'Cyanosis', 'Cannot speak/cry', 'Drooling'].map((item) => (
                    <span key={item} style={{ ...tagStyle, background: 'var(--state-incorrect-surface)', color: 'var(--state-incorrect-text)' }}>
                      {item}
                    </span>
                  ))}
                </div>

                <div style={{ background: 'var(--state-warning-surface)', padding: '18px 20px' }}>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--state-warning-text)',
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

          {/* Three-column row: Quiz + Obs + Meds cheat sheet */}
          <div
            className="home-sample-3col home-sample-secondary"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '18px',
            }}
          >
            {/* Quiz preview */}
            <div style={sampleCardStyle} className="home-preview-card">
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
                  {quizPreviewOptions.map((option, index) => {
                    const isSelected = selectedQuizAnswer === index;
                    const showCorrect = selectedQuizAnswer !== null && option.correct;
                    const showWrong = isSelected && selectedQuizAnswer !== null && !option.correct;

                    return (
                      <button
                        key={option.text}
                        type="button"
                        onClick={() => setSelectedQuizAnswer(index)}
                        className="home-quiz-option"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '12px 14px',
                          border: `0.5px solid ${
                            showCorrect ? 'var(--state-correct-border)' : showWrong ? 'var(--state-incorrect-border)' : isSelected ? 'var(--border-strong)' : border
                          }`,
                          background: showCorrect ? greenBg : showWrong ? 'var(--state-incorrect-surface)' : isSelected ? 'var(--surface-sunken)' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            border: showCorrect ? 'none' : `0.5px solid var(--border-strong)`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: showWrong ? 'var(--state-incorrect-text)' : green,
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {showCorrect ? '✓' : showWrong ? '×' : ''}
                        </span>
                        <span
                          style={{
                            fontFamily: serif,
                            fontSize: '13px',
                            lineHeight: 1.5,
                            color: showCorrect ? green : showWrong ? 'var(--state-incorrect-text)' : inkMid,
                            fontWeight: showCorrect || showWrong || isSelected ? 400 : 300,
                          }}
                        >
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedQuizAnswer === null ? (
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.8,
                      color: inkMid,
                      fontWeight: 300,
                    }}
                  >
                    Tap an answer to see how the quiz gives quick feedback and keeps revision moving.
                  </p>
                ) : (
                  <div
                    style={{
                      background: quizAnsweredCorrectly ? greenBg : 'var(--state-incorrect-surface)',
                      border: `0.5px solid ${quizAnsweredCorrectly ? 'var(--state-correct-border)' : 'var(--state-incorrect-border)'}`,
                      padding: '14px 16px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: quizAnsweredCorrectly ? green : 'var(--state-incorrect-text)',
                        marginBottom: '8px',
                      }}
                    >
                      {quizAnsweredCorrectly ? 'Correct' : 'Not quite'}
                    </p>
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '13px',
                        lineHeight: 1.8,
                        color: inkMid,
                        fontWeight: 300,
                        marginBottom: '10px',
                      }}
                    >
                      Toddlers usually sit around 100–140 bpm at rest. This is the kind of quick distinction that often comes up in observation stations and quizzes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedQuizAnswer(null)}
                      style={{
                        fontFamily: serif,
                        fontSize: '12px',
                        color: ink,
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      Try another answer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Obs ranges preview */}
            <div style={sampleCardStyle} className="home-preview-card">
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
                          background: idx % 2 === 0 ? 'var(--surface-sunken)' : 'transparent',
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
            <div style={sampleCardStyle} className="home-preview-card">
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

                <div
                  style={{
                    background: 'var(--surface-sunken)',
                    padding: '16px 18px',
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
                        <span style={{ fontFamily: serif, fontSize: '10px', color: inkLight }}>
                          ↓ ×1,000 &nbsp; ↑ ÷1,000
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: 'var(--surface-sunken)',
                    padding: '14px 16px',
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

          <div
            className="home-sample-mobile-links"
            style={{
              display: 'none',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/quiz"
              style={{
                fontFamily: serif,
                fontSize: '13px',
                color: ink,
                textDecoration: 'none',
                border: `0.5px solid ${border}`,
                padding: '10px 14px',
                background: parchment,
              }}
            >
              Try quiz preview →
            </Link>
            <Link
              href="/hub/childrens"
              style={{
                fontFamily: serif,
                fontSize: '13px',
                color: ink,
                textDecoration: 'none',
                border: `0.5px solid ${border}`,
                padding: '10px 14px',
                background: 'transparent',
              }}
            >
              Browse hub pages →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
