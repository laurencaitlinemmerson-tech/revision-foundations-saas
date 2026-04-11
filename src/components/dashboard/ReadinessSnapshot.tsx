'use client';

import { useEffect, useState } from 'react';
import { getPlacementDate } from '@/lib/dashboardTracking';
import { getLastActivity, getStudyStreak, STORAGE_KEYS } from '@/components/DashboardWidgets';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const inkMid = '#5A5750';
const inkLight = '#9C8878';
const border = 'rgba(0,0,0,0.08)';

interface WeakTopic {
  topic: string;
  score: number;
}

interface SnapshotState {
  placementDate: string | null;
  weakTopics: WeakTopic[];
  streak: number;
  lastTool: string | null;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getPlacementStatus(date: string | null) {
  if (!date) {
    return {
      title: 'Not set',
      note: 'Add your next placement date to make the dashboard more useful.',
      accent: '#9C8878',
      accentBg: '#F3F1EE',
    };
  }

  const days = daysUntil(date);
  if (days <= 3) {
    return {
      title: days <= 0 ? 'Very close' : `${days} days away`,
      note: 'Keep revision practical and avoid opening too many new topics now.',
      accent: '#B76B4A',
      accentBg: '#F8E7E2',
    };
  }

  if (days <= 14) {
    return {
      title: `${days} days away`,
      note: 'A good window for placement refreshers, escalation, and confidence-building runs.',
      accent: '#2F8A7E',
      accentBg: '#E6F3F1',
    };
  }

  return {
    title: `${days} days away`,
    note: 'Still enough room to build the basics before narrowing into pre-shift revision.',
    accent: '#2E67B1',
    accentBg: '#E7EEF8',
  };
}

function getRecallStatus(topics: WeakTopic[]) {
  if (topics.length === 0) {
    return {
      title: 'Stable',
      note: 'No weak topics are flagged yet. A few question sets will make this sharper.',
      accent: '#2F8A7E',
      accentBg: '#E6F3F1',
    };
  }

  const worst = [...topics].sort((a, b) => a.score - b.score)[0];
  if (worst.score < 60) {
    return {
      title: `${worst.topic} ${worst.score}%`,
      note: 'This is still the topic most likely to hang over your next session.',
      accent: '#B76B4A',
      accentBg: '#F8E7E2',
    };
  }

  return {
    title: `${worst.topic} ${worst.score}%`,
    note: 'Not alarming, but still the easiest place to gain confidence quickly.',
    accent: '#8B7B68',
    accentBg: '#F3F1EE',
  };
}

function getPracticeStatus(streak: number, lastTool: string | null) {
  if (streak >= 5) {
    return {
      title: `${streak}-day rhythm`,
      note: lastTool === 'osce'
        ? 'Practice rhythm is good. Balance the next session with a short quiz block.'
        : 'Practice rhythm is good. Keep the next step small enough to sustain it.',
      accent: '#2F8A7E',
      accentBg: '#E6F3F1',
    };
  }

  if (streak >= 1) {
    return {
      title: `${streak}-day start`,
      note: lastTool
        ? `You are warming up. The easiest door back in is still ${lastTool}.`
        : 'A small rhythm is starting. Protect it with short sessions, not huge plans.',
      accent: '#2E67B1',
      accentBg: '#E7EEF8',
    };
  }

  return {
    title: 'Needs a restart',
    note: 'One guide, one station, or ten questions is enough to make the dashboard feel alive again.',
    accent: '#9C8878',
    accentBg: '#F3F1EE',
  };
}

export default function ReadinessSnapshot() {
  const [state, setState] = useState<SnapshotState | null>(null);

  useEffect(() => {
    try {
      const rawWeakTopics = localStorage.getItem(STORAGE_KEYS.weakTopics);
      setState({
        placementDate: getPlacementDate(),
        weakTopics: rawWeakTopics ? JSON.parse(rawWeakTopics) as WeakTopic[] : [],
        streak: getStudyStreak().currentStreak,
        lastTool: getLastActivity()?.toolName ?? null,
      });
    } catch {
      setState({
        placementDate: getPlacementDate(),
        weakTopics: [],
        streak: getStudyStreak().currentStreak,
        lastTool: getLastActivity()?.toolName ?? null,
      });
    }
  }, []);

  if (!state) return null;

  const cards = [
    { label: 'Placement', ...getPlacementStatus(state.placementDate) },
    { label: 'Recall', ...getRecallStatus(state.weakTopics) },
    { label: 'Practice rhythm', ...getPracticeStatus(state.streak, state.lastTool) },
  ];

  return (
    <div
      style={{
        border: `0.5px solid ${border}`,
        background: '#FFFFFF',
        padding: '20px 22px 22px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: inkLight, marginBottom: '8px' }}>
          Readiness snapshot
        </p>
        <h3 style={{ fontFamily: display, fontSize: '1.5rem', lineHeight: 1.08, fontWeight: 400, color: ink, marginBottom: '8px' }}>
          The three signals that matter most right now.
        </h3>
        <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.75, fontWeight: 300, color: inkMid, margin: 0 }}>
          A quick read on upcoming placement, weak recall areas, and how steady your recent study rhythm has been.
        </p>
      </div>

      <div className="dash-readiness-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              border: `0.5px solid ${border}`,
              background: '#FCFBF8',
              padding: '16px 16px 18px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                fontFamily: serif,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: card.accent,
                background: card.accentBg,
                marginBottom: '12px',
              }}
            >
              {card.label}
            </span>
            <p style={{ fontFamily: display, fontSize: '1.45rem', lineHeight: 1.05, fontWeight: 400, color: ink, marginBottom: '8px' }}>
              {card.title}
            </p>
            <p style={{ fontFamily: serif, fontSize: '12px', lineHeight: 1.7, fontWeight: 300, color: inkMid, margin: 0 }}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .dash-readiness-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 860px) {
          .dash-readiness-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
