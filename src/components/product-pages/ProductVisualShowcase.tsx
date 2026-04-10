'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CSSProperties } from 'react';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

type ProductVisualVariant = 'quiz' | 'osce';

type Detail = {
  label: string;
  title: string;
  text: string;
};

type VisualConfig = {
  imageSrc: string;
  imageAlt: string;
  accent: string;
  accentSoft: string;
  eyebrow: string;
  details: Detail[];
};

const border = 'rgba(28, 21, 16, 0.1)';
const paper = '#FFFFFF';
const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';

const configs: Record<ProductVisualVariant, VisualConfig> = {
  quiz: {
    imageSrc: '/product-previews/quiz-editorial-preview.png',
    imageAlt: 'Quiz interface screenshot showing a worked multiple-choice question with explanation.',
    accent: '#2E67B1',
    accentSoft: '#E7EEF8',
    eyebrow: 'Real quiz screen',
    details: [
      {
        label: 'Question first',
        title: 'The question is easy to read quickly.',
        text: 'That matters when you are revising between lectures or placements and just want to answer the thing without extra clutter.',
      },
      {
        label: 'Fast feedback',
        title: 'You can see straight away what was right or wrong.',
        text: 'The answer state is clear enough that you do not have to hunt around the screen for what just happened.',
      },
      {
        label: 'Useful explanation',
        title: 'The explanation helps you see what to fix next.',
        text: 'That makes it easier to spot whether the problem was recall, calculation method, or reading the question too fast.',
      },
    ],
  },
  osce: {
    imageSrc: '/product-previews/oscepreview.png',
    imageAlt: 'OSCE support screen showing a calm recall page before full station work.',
    accent: '#2F8A7E',
    accentSoft: '#E6F3F1',
    eyebrow: 'Real OSCE screen',
    details: [
      {
        label: 'Station prep',
        title: 'You can settle into the station quickly.',
        text: 'The opening screen gives you the scenario and the task clearly, so you spend less time decoding it and more time actually practising.',
      },
      {
        label: 'Say it aloud',
        title: 'The middle of the screen helps with speaking practice.',
        text: 'The prompts stay visible in a way that makes it easier to talk through the station out loud instead of freezing on the next step.',
      },
      {
        label: 'Quick scan',
        title: 'The key prompts are easy to find when you are under pressure.',
        text: 'That matters more than the design itself, because in OSCE practice the useful part is being able to glance back and pick up your flow fast.',
      },
    ],
  },
};

export default function ProductVisualShowcase({
  variant,
  compact = false,
}: {
  variant: ProductVisualVariant;
  compact?: boolean;
}) {
  const config = configs[variant];
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);
  const activeDetail = config.details[activeDetailIndex] ?? config.details[0];

  const labelStyle: CSSProperties = {
    fontFamily: serif,
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: inkLight,
    marginBottom: compact ? '8px' : '12px',
  };

  return (
    <div
      style={{
        display: 'grid',
        gap: compact ? '16px' : '18px',
      }}
    >
      <div
        style={{
          border: `0.5px solid ${border}`,
          background: paper,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: compact ? '12px 14px' : '14px 16px',
            borderBottom: `1px solid ${border}`,
            background: '#FCFBF9',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['#E07A66', '#E3B24E', '#7AA780'].map((tone) => (
                <span
                  key={tone}
                  style={{
                    width: '8px',
                    height: '8px',
                    background: tone,
                    display: 'inline-flex',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: serif,
                fontSize: compact ? '12px' : '13px',
                color: inkMid,
              }}
            >
              {config.eyebrow}
            </span>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: config.accentSoft,
              color: config.accent,
              padding: compact ? '6px 10px' : '7px 12px',
              fontFamily: serif,
              fontSize: compact ? '11px' : '12px',
            }}
          >
            Exported preview
          </span>
        </div>

        <div
          style={{
            background: '#F8F7F4',
            padding: compact ? '10px 10px 0' : '14px 14px 0',
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              border: `0.5px solid ${border}`,
              background: '#fff',
            }}
          >
            <Image
              src={config.imageSrc}
              alt={config.imageAlt}
              width={1710}
              height={983}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
              priority={!compact}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: compact ? '12px' : '14px',
            padding: compact ? '14px 14px 16px' : '18px 18px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: compact ? '10px' : '12px',
            }}
          >
            {config.details.map((detail, index) => {
              const isActive = index === activeDetailIndex;

              return (
                <button
                  key={detail.label}
                  type="button"
                  onMouseEnter={() => setActiveDetailIndex(index)}
                  onFocus={() => setActiveDetailIndex(index)}
                  onClick={() => setActiveDetailIndex(index)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `0.5px solid ${isActive ? config.accentSoft : border}`,
                    background: isActive ? config.accentSoft : '#FFFFFF',
                    color: isActive ? config.accent : inkMid,
                    padding: compact ? '7px 12px' : '8px 14px',
                    fontFamily: serif,
                    fontSize: compact ? '11px' : '12px',
                    cursor: 'pointer',
                    transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
                  }}
                >
                  {detail.label}
                </button>
              );
            })}
          </div>

          {compact ? (
            <p
              style={{
                fontFamily: serif,
                fontSize: '13px',
                lineHeight: 1.7,
                color: inkMid,
              }}
            >
              {activeDetail.text}
            </p>
          ) : (
            <div
              className="product-visual-meta"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr)',
                gap: '18px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  border: `0.5px solid ${border}`,
                  background: paper,
                  padding: '18px 18px 16px',
                }}
              >
                <p style={labelStyle}>What you are seeing</p>
                <p
                  style={{
                    fontFamily: display,
                    fontSize: '24px',
                    lineHeight: 1.08,
                    color: ink,
                    marginBottom: '8px',
                  }}
                >
                  {activeDetail.title}
                </p>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.75,
                    color: inkMid,
                  }}
                >
                  {activeDetail.text}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-visual-meta {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
