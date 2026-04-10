'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react';
import { getPinnedNote, savePinnedNote } from '@/lib/dashboardTracking';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const ink = '#1A1815';
const body = '#2C2A27';
const mid = '#5A5750';
const muted = '#999';
const border = 'rgba(0,0,0,0.08)';
const borderMid = 'rgba(0,0,0,0.12)';

interface PinnedNoteProps {
  compact?: boolean;
}

export default function PinnedNote({ compact = false }: PinnedNoteProps) {
  const [note, setNote] = useState('');
  const [mounted, setMounted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setNote(getPinnedNote());
  }, []);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  function handleChange(value: string) {
    setNote(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => savePinnedNote(value), 600);
  }

  if (!mounted) return null;

  const hasNote = note.trim().length > 0;

  return (
    <div
      style={
        compact
          ? {
              border: `0.5px solid ${border}`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(245,243,240,0.92) 100%)',
              padding: '16px 16px 14px',
            }
          : {
              border: `0.5px solid ${borderMid}`,
              background: 'white',
              padding: '20px 22px 22px',
            }
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <p
          style={{
            fontFamily: serif,
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: muted,
            margin: 0,
          }}
        >
          Desk note
        </p>
        <span
          style={{
            fontFamily: serif,
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: hasNote ? 'var(--sage-600)' : muted,
            background: hasNote ? 'var(--sage-50)' : 'rgba(255,255,255,0.72)',
            padding: '4px 8px',
          }}
        >
          {hasNote ? 'Saved' : 'Autosaves'}
        </span>
      </div>

      <p
        style={{
          fontFamily: serif,
          fontSize: '12px',
          color: mid,
          lineHeight: 1.7,
          marginBottom: '10px',
        }}
      >
        {hasNote
          ? 'Keep one reminder here so it shows up the next time you land on the dashboard.'
          : 'Pin the one reminder, red flag, or follow-up you do not want to lose in the noise.'}
      </p>

      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Check BP cuff sizes before Thursday..."
        rows={compact ? 4 : 4}
        aria-label="Pinned note"
        style={{
          fontFamily: serif,
          fontSize: '13px',
          color: ink,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          width: '100%',
          resize: 'none',
          lineHeight: 1.8,
          minHeight: compact ? '92px' : '120px',
          padding: 0,
        }}
      />

      <p
        style={{
          fontFamily: serif,
          fontSize: '10px',
          color: hasNote ? body : muted,
          marginTop: '6px',
        }}
      >
        {hasNote ? 'Saves automatically while you type.' : 'Try a task, deadline, or one thing to revisit.'}
      </p>
    </div>
  );
}
