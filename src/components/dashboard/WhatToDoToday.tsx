'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import Link from 'next/link';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const bodyColor = '#2C2A27';
const mid = '#5A5750';
const muted = '#999';
const borderMid = 'rgba(0,0,0,0.12)';

interface Suggestion {
  headline: string;
  text: string;
  href: string;
  cta: string;
  accent: string;
  accentSoft: string;
  effort: string;
  secondaryHref: string;
  secondaryCta: string;
}

function getSuggestion(): Suggestion {
  try {
    const rawWeak = localStorage.getItem('rf_weak_topics');
    if (rawWeak) {
      const topics = JSON.parse(rawWeak) as { topic: string; score: number }[];
      if (topics.length > 0) {
        const worst = [...topics].sort((a, b) => a.score - b.score)[0];
        if (worst.score < 70) {
          return {
            headline: `Focus on ${worst.topic}.`,
            text: `It is still your weakest area at ${worst.score}%. A short, targeted question set is the quickest way to stop it hanging over you.`,
            href: `/quiz?topic=${encodeURIComponent(worst.topic)}`,
            cta: `Practise ${worst.topic}`,
            accent: 'var(--blue-600)',
            accentSoft: 'var(--blue-50)',
            effort: '5-10 min',
            secondaryHref: '/dashboard#weak-areas',
            secondaryCta: 'See weak areas',
          };
        }
      }
    }

    const rawLast = localStorage.getItem('rf_last_activity');
    if (rawLast) {
      const last = JSON.parse(rawLast) as { toolName: string };
      if (last.toolName === 'osce') {
        return {
          headline: 'Balance practice with a short quiz.',
          text: 'You last ran an OSCE station. A quick recall set today would round that out without turning it into a big session.',
          href: '/quiz',
          cta: 'Open the core quiz',
          accent: 'var(--blue-600)',
          accentSoft: 'var(--blue-50)',
          effort: '5 min',
          secondaryHref: '/dashboard#saved-resources',
          secondaryCta: 'Open saved pages',
        };
      }
      if (last.toolName === 'quiz') {
        return {
          headline: 'Turn recall into spoken practice.',
          text: 'You last did a quiz. One timed station keeps the practical side sharp and stops revision becoming only reading and recall.',
          href: '/osce',
          cta: 'Launch OSCE',
          accent: 'var(--teal-600)',
          accentSoft: 'var(--teal-50)',
          effort: '8-12 min',
          secondaryHref: '/dashboard#exam-season',
          secondaryCta: 'See study blocks',
        };
      }
    }

    const rawStreak = localStorage.getItem('rf_study_streak');
    if (rawStreak) {
      const streak = JSON.parse(rawStreak) as { lastStudyDate?: string };
      const today = new Date().toISOString().split('T')[0];
      if (streak.lastStudyDate !== today) {
        return {
          headline: 'Log one calm session today.',
          text: 'Nothing is logged yet today. One short block is enough to keep momentum going and make the dashboard useful again tomorrow.',
          href: '/hub',
          cta: 'Open the hub',
          accent: 'var(--sage-600)',
          accentSoft: 'var(--sage-50)',
          effort: '10 min',
          secondaryHref: '/dashboard#today-block',
          secondaryCta: 'Check today’s plan',
        };
      }
    }
  } catch {}

  return {
    headline: 'Pick the easiest door back in.',
    text: 'Open one guide, run one station, or work through a short question set. The goal here is movement, not perfection.',
    href: '/hub',
    cta: 'Open the hub',
    accent: 'var(--sage-600)',
    accentSoft: 'var(--sage-50)',
    effort: '5-15 min',
    secondaryHref: '/dashboard#saved-resources',
    secondaryCta: 'Browse saved folders',
  };
}

export default function WhatToDoToday() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    setSuggestion(getSuggestion());
  }, []);

  if (!suggestion) return null;

  return (
    <div className="dash-suggestion-shell" style={{ borderLeft: `2px solid ${suggestion.accent}` }}>
      <div>
        <div className="dash-suggestion-meta">
          <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, margin: 0 }}>
            What to do today
          </p>
          <span
            style={{
              fontFamily: serif,
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: suggestion.accent,
              background: suggestion.accentSoft,
              padding: '4px 8px',
            }}
          >
            {suggestion.effort}
          </span>
        </div>

        <h3 style={{ fontFamily: display, fontSize: '1.9rem', lineHeight: 1.05, fontWeight: 400, color: ink, marginBottom: '10px' }}>
          {suggestion.headline}
        </h3>

        <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.85, margin: 0, maxWidth: '42rem' }}>
          {suggestion.text}
        </p>
      </div>

      <div className="dash-suggestion-actions">
        <Link href={suggestion.href} className="dash-suggestion-primary">
          {suggestion.cta}
        </Link>
        <Link
          href={suggestion.secondaryHref}
          style={{ fontFamily: serif, fontSize: '12px', color: bodyColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          {suggestion.secondaryCta} →
        </Link>
      </div>

      <style>{`
        .dash-suggestion-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px 28px;
          align-items: start;
          border: 0.5px solid ${borderMid};
          background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,250,248,0.98) 100%);
          padding: 22px 22px 24px;
        }

        .dash-suggestion-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .dash-suggestion-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          min-width: 210px;
        }

        .dash-suggestion-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-family: ${serif};
          font-size: 13px;
          color: white;
          background: ${ink};
          text-decoration: none;
          padding: 11px 16px;
        }

        @media (max-width: 760px) {
          .dash-suggestion-shell {
            grid-template-columns: 1fr;
          }

          .dash-suggestion-actions {
            min-width: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
