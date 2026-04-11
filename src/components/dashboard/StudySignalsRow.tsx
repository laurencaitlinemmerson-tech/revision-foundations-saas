'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlacementDate } from '@/lib/dashboardTracking';
import { getLastActivity, getStudyStreak, STORAGE_KEYS } from '@/components/DashboardWidgets';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

interface WeakTopic {
  topic: string;
  score: number;
  attempts: number;
}

interface SignalsState {
  placementDate: string | null;
  weakTopics: WeakTopic[];
  streak: number;
  lastActivity: ReturnType<typeof getLastActivity>;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function StudySignalsRow() {
  const [state, setState] = useState<SignalsState | null>(null);

  useEffect(() => {
    try {
      const rawWeakTopics = localStorage.getItem(STORAGE_KEYS.weakTopics);
      setState({
        placementDate: getPlacementDate(),
        weakTopics: rawWeakTopics ? JSON.parse(rawWeakTopics) as WeakTopic[] : [],
        streak: getStudyStreak().currentStreak,
        lastActivity: getLastActivity(),
      });
    } catch {
      setState({
        placementDate: getPlacementDate(),
        weakTopics: [],
        streak: getStudyStreak().currentStreak,
        lastActivity: getLastActivity(),
      });
    }
  }, []);

  if (!state) return null;

  const weakest = [...state.weakTopics].sort((a, b) => a.score - b.score)[0] ?? null;
  const placementDays = state.placementDate ? getDaysUntil(state.placementDate) : null;

  return (
    <div>
      <p style={{
        fontFamily: serif,
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: muted,
        marginBottom: '10px',
      }}>
        Useful signals
      </p>

      <div className="dash-signals-grid">
        <div className="dash-signal-card">
          <p className="dash-signal-label">Continue</p>
          <h3 className="dash-signal-title">
            {state.lastActivity ? state.lastActivity.label : 'Start a short session'}
          </h3>
          <p className="dash-signal-text">
            {state.lastActivity
              ? `Last opened ${relativeTime(state.lastActivity.timestamp)}. This is still the easiest way back in.`
              : 'Run one quiz or OSCE session and this spot will become your quickest restart.'}
          </p>
          <Link href={state.lastActivity?.path ?? '/hub'} className="dash-signal-link">
            {state.lastActivity ? 'Continue' : 'Open the hub'} →
          </Link>
        </div>

        <div className="dash-signal-card">
          <p className="dash-signal-label">Placement</p>
          <h3 className="dash-signal-title">
            {placementDays === null
              ? 'No date set'
              : placementDays <= 0
              ? 'Placement is here'
              : `${placementDays} days away`}
          </h3>
          <p className="dash-signal-text">
            {placementDays === null
              ? 'Add your next placement date to make the dashboard feel more tailored.'
              : placementDays <= 14
              ? 'Keep the next sessions practical: refresh obs, escalation, and common shift scenarios.'
              : 'You still have room to build calmly before narrowing into pre-shift refreshers.'}
          </p>
          <span className="dash-signal-footnote">
            {state.streak > 0 ? `${state.streak}-day rhythm` : 'No streak yet'}
          </span>
        </div>

        <div className="dash-signal-card">
          <p className="dash-signal-label">Focus next</p>
          <h3 className="dash-signal-title">
            {weakest ? weakest.topic : 'Nothing flagged'}
          </h3>
          <p className="dash-signal-text">
            {weakest
              ? `${weakest.score}% after ${weakest.attempts} ${weakest.attempts === 1 ? 'attempt' : 'attempts'}. This is still the quickest confidence gain.`
              : 'No weak topics are showing yet. A few short question sets will surface what needs attention.'}
          </p>
          <Link href={weakest ? `/quiz?topic=${encodeURIComponent(weakest.topic)}` : '/quiz'} className="dash-signal-link">
            {weakest ? 'Practise topic' : 'Open quiz'} →
          </Link>
        </div>
      </div>

      <style>{`
        .dash-signals-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-signal-card {
          border: 0.5px solid ${border};
          background: #fff;
          padding: 18px 18px 20px;
          min-height: 188px;
        }

        .dash-signal-label {
          font-family: ${serif};
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 12px;
        }

        .dash-signal-title {
          font-family: ${display};
          font-size: 1.55rem;
          line-height: 1.08;
          font-weight: 400;
          color: ${ink};
          margin: 0 0 10px;
        }

        .dash-signal-text {
          font-family: ${serif};
          font-size: 12px;
          line-height: 1.75;
          font-weight: 300;
          color: ${mid};
          margin: 0 0 14px;
        }

        .dash-signal-link,
        .dash-signal-footnote {
          font-family: ${serif};
          font-size: 11px;
          color: ${ink};
        }

        .dash-signal-link {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dash-signal-footnote {
          display: inline-block;
          color: ${muted};
        }

        @media (max-width: 860px) {
          .dash-signals-grid {
            grid-template-columns: 1fr;
          }

          .dash-signal-card {
            min-height: 0;
          }
        }
      `}</style>
    </div>
  );
}
