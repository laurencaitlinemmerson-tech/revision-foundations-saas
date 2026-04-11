'use client';

import { useState } from 'react';
import Link from 'next/link';
import DesktopAppButton from '@/components/DesktopAppButton';
import {
  serif, display, ink, inkMid, inkLight, cream, border, panel, parchment,
  green, greenBg, greenLine, blue, blueBg, blueLine, danger, dangerBg, dangerLine,
  infoBg, sectionLabelStyle, primaryButton, secondaryButton, tagStyle, strongBorder, wrap,
} from './styles';
import { heroQuizPreviewOptions } from './data';

export default function HeroSection() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const selectedOption = selectedAnswer === null ? null : heroQuizPreviewOptions[selectedAnswer];
  const answeredCorrectly = selectedOption?.correct ?? false;

  return (
    <section style={{ padding: '88px 24px 64px', borderBottom: `0.5px solid ${border}`, background: cream }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div
          className="home-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.02fr) minmax(320px, 0.98fr)',
            gap: '26px',
            alignItems: 'center',
          }}
        >
          {/* Left */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span
                style={{
                  ...tagStyle,
                  padding: '6px 10px',
                }}
              >
                Children&apos;s nursing live now
              </span>
              <span
                style={{
                  ...tagStyle,
                  padding: '6px 10px',
                }}
              >
                Adult hub guides available
              </span>
            </div>

            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
                fontWeight: 500,
                lineHeight: 1.1,
                color: ink,
                marginBottom: '14px',
                maxWidth: '13ch',
              }}
            >
              The calm revision system for UK nursing students.
            </h1>

            <p
              style={{
                fontFamily: serif,
                fontSize: '16px',
                lineHeight: 1.75,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '480px',
                marginBottom: '22px',
              }}
            >
              Paediatric OSCE prep, drug calculations, and placement-ready guides, with children&apos;s nursing the most complete route live today.
            </p>

            <p
              style={{
                fontFamily: serif,
                fontSize: '13px',
                lineHeight: 1.8,
                fontWeight: 300,
                color: inkLight,
                maxWidth: '520px',
                marginBottom: '20px',
              }}
            >
              Start free in the hub first, then choose the OSCE tool, quiz, or full bundle once you know which lane you need.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <Link href="/hub/childrens" style={primaryButton}>
                Start free →
              </Link>
              <Link href="/pricing" style={secondaryButton}>
                Unlock the bundle →
              </Link>
              <DesktopAppButton
                label="Download desktop app"
                style={secondaryButton}
                title="Install The Nurse Lab as a desktop app"
              />
            </div>

            {/* Slim proof strip */}
            <div
              style={{
                display: 'flex',
                gap: '28px',
                flexWrap: 'wrap',
                paddingTop: '22px',
                borderTop: `0.5px solid ${border}`,
              }}
            >
              {[
                { value: '50+', label: 'paeds OSCE stations' },
                { value: '17', label: 'quiz topics' },
                { value: '£9.99', label: 'one payment' },
                { value: 'Free', label: 'hub pages to start' },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontFamily: display,
                      fontSize: '22px',
                      fontWeight: 400,
                      color: ink,
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}
                  >
                    {item.value}
                  </p>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '12px',
                      color: inkLight,
                      fontWeight: 300,
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: quiz card */}
          <div
            style={{
              border: `0.5px solid ${border}`,
              background: panel,
              padding: '18px 18px 20px',
              maxWidth: '540px',
              marginLeft: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '14px',
              }}
            >
              <p style={{ ...sectionLabelStyle, marginBottom: 0 }}>Quiz preview</p>
              <span
                style={{
                  ...tagStyle,
                  background: blueBg,
                  color: blue,
                  padding: '6px 10px',
                }}
              >
                17 topics
              </span>
            </div>

            <div>
              <p
                style={{
                  ...sectionLabelStyle,
                  color: blue,
                  marginBottom: '8px',
                }}
              >
                Sample question
              </p>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)',
                  lineHeight: 1.1,
                  color: ink,
                  marginBottom: '14px',
                  maxWidth: '100%',
                  textWrap: 'balance',
                }}
              >
                A child weighs 18 kg. The prescription is 15 mg/kg. What dose do they need?
              </h2>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                {heroQuizPreviewOptions.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const showCorrect = selectedAnswer !== null && option.correct;
                  const showWrong = isSelected && selectedAnswer !== null && !option.correct;

                  return (
                    <button
                      key={option.text}
                      type="button"
                      onClick={() => setSelectedAnswer(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 12px',
                        border: `0.5px solid ${
                          showCorrect ? greenLine : showWrong ? dangerLine : isSelected ? strongBorder : border
                        }`,
                        background: showCorrect ? greenBg : showWrong ? dangerBg : isSelected ? parchment : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          border: showCorrect ? 'none' : `0.5px solid ${strongBorder}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: showWrong ? danger : green,
                          fontSize: '10px',
                          flexShrink: 0,
                        }}
                      >
                        {showCorrect ? '✓' : showWrong ? '×' : ''}
                      </span>
                      <span
                        style={{
                          fontFamily: serif,
                          fontSize: '12px',
                          lineHeight: 1.45,
                          color: showCorrect ? green : showWrong ? danger : inkMid,
                          fontWeight: showCorrect || showWrong || isSelected ? 400 : 300,
                        }}
                      >
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  background: selectedAnswer === null ? infoBg : answeredCorrectly ? greenBg : dangerBg,
                  border: `0.5px solid ${
                    selectedAnswer === null ? blueLine : answeredCorrectly ? greenLine : dangerLine
                  }`,
                  padding: '12px 14px',
                  marginBottom: '14px',
                }}
              >
                <p
                  style={{
                    ...sectionLabelStyle,
                    color: selectedAnswer === null ? blue : answeredCorrectly ? green : danger,
                    marginBottom: '4px',
                  }}
                >
                  {selectedAnswer === null ? 'Why it helps' : answeredCorrectly ? 'Correct' : 'Not quite'}
                </p>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: inkMid,
                  }}
                >
                  {selectedAnswer === null
                    ? 'The quiz covers calculations as well as recall, so it feels broader than a single-topic flashcard set.'
                    : '15 mg × 18 kg = 270 mg. The point is not just getting the number right, but staying steady with the calculation steps under pressure.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Link href="/quiz" style={{ ...secondaryButton, padding: '9px 16px' }}>
                  Open quiz preview →
                </Link>
                <span style={{ ...tagStyle, background: greenBg, color: green, padding: '6px 10px' }}>
                  Instant feedback
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
