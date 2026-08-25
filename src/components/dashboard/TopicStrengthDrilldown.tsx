'use client';

import { useState } from 'react';
import Link from 'next/link';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

export interface TopicItem {
  label: string;
  pct: number;
  color: string;
  summary: string;
  redFlags: string[];
  topicSlug: string;
}

const TOPIC_DETAILS: Record<string, { summary: string; redFlags: string[]; topicSlug: string }> = {
  Respiratory: {
    summary: 'Focus on respiratory distress vs failure, oxygen delivery devices, and pediatric wheeze.',
    redFlags: ['Stridor at rest', 'Tracheal tug / severe intercostal recessions', 'SpO2 < 92% on air'],
    topicSlug: 'respiratory',
  },
  Cardiac: {
    summary: 'Master congenital heart disease vs acquired, capillary refill time, and ECG lead placement.',
    redFlags: ['Unexplained tachycardia at rest', 'Weak femoral pulses', 'Profound central cyanosis'],
    topicSlug: 'cardiac',
  },
  Neurological: {
    summary: 'Understand AVPU vs AVPU-P, pupil symmetry, seizure management, and fontanelle inspection.',
    redFlags: ['Non-blanching rash with lethargy', 'Sudden change in GCS / AVPU', 'Bulging fontanelle'],
    topicSlug: 'neurological',
  },
  Pharmacology: {
    summary: 'Key areas: weight-based pediatric dosing, IV rate calculations, and high-alert drug double-checks.',
    redFlags: ['10x dosage calculation error', 'Omission of weight verification', 'Allergy flag override'],
    topicSlug: 'pharmacology',
  },
};

interface TopicStrengthDrilldownProps {
  topics: { label: string; pct: number; color: string }[];
  title: string;
}

export default function TopicStrengthDrilldown({ topics, title }: TopicStrengthDrilldownProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  function handleToggleTopic(label: string) {
    setExpandedTopic((prev) => (prev === label ? null : label));
  }

  return (
    <div
      style={{
        background: 'var(--surface-raised, #FFFFFF)',
        border: '0.5px solid var(--hairline-firm, rgba(0,0,0,0.12))',
        padding: '24px 26px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: muted,
            margin: 0,
          }}
        >
          {title}
        </p>
        <span style={{ fontFamily: serif, fontSize: '10px', color: muted, opacity: 0.8 }}>
          Click any topic for drilldown
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {topics.map((t, idx) => {
          const isExpanded = expandedTopic === t.label;
          const details = TOPIC_DETAILS[t.label] ?? {
            summary: `Practice quiz questions and review guides for ${t.label}.`,
            redFlags: ['Review key clinical guidelines and OSCE checklists.'],
            topicSlug: t.label.toLowerCase(),
          };

          return (
            <div
              key={t.label}
              style={{
                border: `0.5px solid ${isExpanded ? t.color : 'transparent'}`,
                padding: isExpanded ? '12px 14px' : '0',
                background: isExpanded ? 'rgba(0,0,0,0.02)' : 'transparent',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Main Progress Row */}
              <div
                onClick={() => handleToggleTopic(t.label)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span
                    style={{
                      fontFamily: serif,
                      fontSize: '12.5px',
                      color: ink,
                      fontWeight: isExpanded ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{t.label}</span>
                    <span style={{ fontSize: '10px', color: muted }}>{isExpanded ? '▲' : '▼'}</span>
                  </span>
                  <span style={{ fontFamily: serif, fontSize: '11px', color: '#B4A89C' }}>{t.pct}%</span>
                </div>

                <div style={{ height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '2.5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${t.pct}%`,
                      background: t.color,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Expandable Drilldown Drawer */}
              {isExpanded && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: mid, lineHeight: 1.6, margin: '0 0 10px' }}>
                    {details.summary}
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '9.5px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: muted,
                        marginBottom: '6px',
                      }}
                    >
                      High-Yield Red Flags
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontFamily: serif, fontSize: '11.5px', color: ink }}>
                      {details.redFlags.map((flag, fIdx) => (
                        <li key={fIdx} style={{ marginBottom: '3px' }}>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/quiz?topic=${encodeURIComponent(details.topicSlug)}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: ink,
                        color: 'white',
                        fontFamily: serif,
                        fontSize: '11px',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Practise {t.label} Quiz →</span>
                    </Link>
                    <Link
                      href={`/dashboard#search`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: '0.5px solid rgba(0,0,0,0.15)',
                        color: ink,
                        fontFamily: serif,
                        fontSize: '11px',
                        textDecoration: 'none',
                        background: 'white',
                      }}
                    >
                      <span>Find {t.label} Guides</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
