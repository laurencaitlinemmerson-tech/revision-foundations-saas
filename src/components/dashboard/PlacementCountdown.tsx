'use client';

import { useEffect, useState } from 'react';
import { getPlacementDate, setPlacementDate } from '@/lib/dashboardTracking';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const mid = '#5A5750';
const muted = '#999';
const border = 'rgba(0,0,0,0.1)';
const borderMid = 'rgba(0,0,0,0.12)';

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PlacementCountdown() {
  const [date, setDate] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getPlacementDate();
    setDate(saved);
    if (saved) setInput(saved);
  }, []);

  if (!mounted) return null;

  function handleSave() {
    if (!input) return;
    setPlacementDate(input);
    setDate(input);
    setEditing(false);
  }

  const days = date ? daysUntil(date) : null;

  if (!date || editing) {
    return (
      <div style={{ border: `0.5px solid ${borderMid}`, background: 'white', padding: '20px 22px 22px' }}>
        <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '14px' }}>
          Placement countdown
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <input
            type="date"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ fontFamily: serif, fontSize: '13px', color: ink, background: '#FAFAF8', border: `0.5px solid ${border}`, padding: '8px 10px', outline: 'none' }}
          />
          <button
            onClick={handleSave}
            disabled={!input}
            title="Save your placement date"
            style={{ fontFamily: serif, fontSize: '12px', color: '#FAFAF8', background: ink, padding: '9px 16px', border: 'none', cursor: 'pointer', opacity: input ? 1 : 0.4, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { if (input) { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.background = '#2C2A27'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.background = ink; }}
          >
            Set date
          </button>
          {date && (
            <button onClick={() => setEditing(false)} style={{ fontFamily: serif, fontSize: '12px', color: mid, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', padding: 0 }}>
              Cancel
            </button>
          )}
        </div>
        <p style={{ fontFamily: serif, fontSize: '11px', color: muted }}>
          Set once and the countdown stays on your dashboard.
        </p>
      </div>
    );
  }

  const isPast = days !== null && days < 0;
  const isToday = days === 0;

  // Urgency-based colour
  const numberColor = isPast ? muted
    : isToday ? 'var(--teal-600)'
    : days !== null && days <= 7 ? 'var(--coral-600)'
    : days !== null && days <= 14 ? 'var(--amber-600)'
    : ink;

  const encouragement = days !== null && days >= 1 && days <= 3
    ? 'You are ready for this. Trust your preparation.'
    : null;

  return (
    <div style={{ border: `0.5px solid ${borderMid}`, background: 'white', padding: '20px 22px 22px' }}>
      <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '10px' }}>
        Placement countdown
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span className="placement-number" style={{ fontFamily: display, fontSize: '2.6rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1, color: numberColor }}>
          {isToday ? 'Today' : Math.abs(days ?? 0)}
        </span>
        {!isToday && (
          <span style={{ fontFamily: serif, fontSize: '12px', color: mid }}>
            {isPast ? 'days ago' : 'days away'}
          </span>
        )}
      </div>
      {encouragement && (
        <p style={{ fontFamily: serif, fontSize: '12px', fontStyle: 'italic', color: 'var(--teal-600)', marginTop: '8px', fontWeight: 300 }}>
          {encouragement}
        </p>
      )}
      <button
        onClick={() => setEditing(true)}
        title="Change your placement date"
        style={{ fontFamily: serif, fontSize: '11px', color: muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', padding: '8px 0 0', display: 'block', transition: 'color 0.15s ease' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = mid)}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
      >
        Change date
      </button>

      <style>{`
        @keyframes countPulse {
          0%   { opacity: 1; transform: scale(1); }
          40%  { opacity: 0.7; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .placement-number {
          display: inline-block;
          animation: countPulse 0.8s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .placement-number { animation: none; }
        }
      `}</style>
    </div>
  );
}
