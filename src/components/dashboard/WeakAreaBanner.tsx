'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const bodyColor = '#2C2A27';
const muted = '#999';

interface WeakTopic {
  topic: string;
  score: number;
  attempts: number;
  lastSeen: string;
}

export default function WeakAreaBanner() {
  const [weakest, setWeakest] = useState<WeakTopic | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rf_weak_topics');
      if (!raw) return;
      const topics = JSON.parse(raw) as WeakTopic[];
      if (topics.length === 0) return;
      const sorted = [...topics].sort((a, b) => a.score - b.score);
      const worst = sorted[0];
      if (worst.score < 80) setWeakest(worst);
    } catch {}
  }, []);

  if (!weakest || dismissed) {
    if (!weakest && !dismissed) {
      return (
        <div style={{
          border: '0.5px solid rgba(0,0,0,0.08)',
          padding: '16px 20px',
          background: 'white',
        }}>
          <p style={{ fontFamily: serif, fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
            No weak areas flagged yet. Run a few quiz sets and any topics under 80% will surface here.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      borderLeft: '2px solid var(--coral-600)',
      background: 'var(--coral-50)',
      padding: '12px 18px',
    }}>
      <p style={{ fontFamily: serif, fontSize: '13px', color: bodyColor, margin: 0 }}>
        Your lowest quiz area is still <strong style={{ fontWeight: 500 }}>{weakest.topic}</strong> at {weakest.score}%.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/quiz" style={{ fontFamily: serif, fontSize: '12px', color: bodyColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Review now
        </Link>
        <button
          onClick={() => setDismissed(true)}
          style={{ fontFamily: serif, fontSize: '11px', color: muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
