'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGuideForTopic, getTopicLabel } from '@/lib/productLoop';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const bodyColor = "var(--charcoal)";
const mid = "var(--charcoal-light)";
const muted = "var(--charcoal-light)";
const borderMid = "var(--border)";

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
          const topicLabel = getTopicLabel(worst.topic);
          const guide = getGuideForTopic(worst.topic);
          const quizHref = `/quiz?topic=${encodeURIComponent(worst.topic)}`;

          if (guide) {
            return {
              headline: `Start with the ${guide.title}.`,
              text: `${topicLabel} is still your weakest area at ${worst.score}%. Read the guide to spot the gaps, then run a short quiz set to lock them in.`,
              href: guide.href,
              cta: 'Read the guide',
              accent: 'var(--blue-600)',
              accentSoft: 'var(--blue-50)',
              effort: '10-15 min',
              secondaryHref: quizHref,
              secondaryCta: `Practise ${topicLabel.toLowerCase()}`,
            };
          }

          return {
            headline: `Focus on ${topicLabel.toLowerCase()}.`,
            text: `It is still your weakest area at ${worst.score}%. A short, targeted question set is the quickest way to stop it hanging over you.`,
            href: quizHref,
            cta: `Practise ${topicLabel.toLowerCase()}`,
            accent: 'var(--blue-600)',
            accentSoft: 'var(--blue-50)',
            effort: '5-10 min',
            secondaryHref: '/dashboard#search',
            secondaryCta: 'Search another topic',
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
          secondaryHref: '/dashboard#saved-folders',
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
          secondaryHref: '/dashboard#revision-week',
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
          secondaryHref: '/dashboard#todays-plan',
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
    secondaryHref: '/dashboard#saved-folders',
    secondaryCta: 'Browse saved folders',
  };
}

function getEnergySuggestion(level: string): Suggestion | null {
  if (level === 'low') {
    return {
      headline: 'Low energy today? Keep it short and calm.',
      text: 'No pressure for full mock exams today. Try a quick 5-question recall set or read a single clinical summary.',
      href: '/quiz',
      cta: 'Start 5-min Quiz',
      accent: 'var(--blue-600, #7BA7CC)',
      accentSoft: 'rgba(123,167,204,0.15)',
      effort: '5 min',
      secondaryHref: '/dashboard#saved-folders',
      secondaryCta: 'Browse saved pages',
    };
  }
  if (level === 'high') {
    return {
      headline: 'High energy! Tackle an OSCE station mock.',
      text: 'You have full focus today. Run a timed 10-minute paediatric or clinical OSCE station checklist to max out retention.',
      href: '/osce',
      cta: 'Launch OSCE Station',
      accent: 'var(--teal-600, #6B9E87)',
      accentSoft: 'rgba(107,158,135,0.15)',
      effort: '12 min',
      secondaryHref: '/quiz',
      secondaryCta: 'Run 15-question quiz',
    };
  }
  if (level === 'crunch') {
    return {
      headline: 'Exam crunch mode: targeted weak spots.',
      text: 'Focus exclusively on your lowest scoring topics and high-yield clinical red flags.',
      href: '/dashboard#search',
      cta: 'Search High-Yield Guides',
      accent: 'var(--amber-600, #C89BB0)',
      accentSoft: 'rgba(200,155,176,0.15)',
      effort: '15 min',
      secondaryHref: '/quiz',
      secondaryCta: 'Practice weak topics',
    };
  }
  return null;
}

export default function WhatToDoToday() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    function loadSuggestion() {
      try {
        const energy = localStorage.getItem('rf_energy_level');
        if (energy) {
          const energySug = getEnergySuggestion(energy);
          if (energySug) {
            setSuggestion(energySug);
            return;
          }
        }
      } catch {}
      setSuggestion(getSuggestion());
    }

    loadSuggestion();

    function handleEnergyChange(e: Event) {
      const customEv = e as CustomEvent<string>;
      if (customEv.detail) {
        const energySug = getEnergySuggestion(customEv.detail);
        if (energySug) {
          setSuggestion(energySug);
          return;
        }
      }
      setSuggestion(getSuggestion());
    }

    window.addEventListener('rf_energy_change', handleEnergyChange);
    return () => window.removeEventListener('rf_energy_change', handleEnergyChange);
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

        <h3 style={{ fontFamily: display, fontSize: '1.9rem', lineHeight: 1.05, fontWeight: 400, color: ink, marginBottom: '16px' }}>
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
          style={{ fontFamily: serif, fontSize: '12px', color: bodyColor, textDecoration: 'underline', textUnderlineOffset: '3px', transition: 'opacity 0.15s ease', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
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
          background: var(--surface-raised);
          padding: 40px 44px;
          transition: border-color 0.2s ease;
        }
        .dash-suggestion-shell:hover {
          border-color: var(--hairline-firm);
        }

        .dash-suggestion-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
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
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .dash-suggestion-primary:hover {
          background: #2C2A27;
          transform: scale(1.02);
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
