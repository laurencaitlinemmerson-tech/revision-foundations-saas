'use client';

/* ============================================================
   ChartAnnotations.tsx — one-line context notes on the trend
   ============================================================
   Annotations are stored against ISO date. The chart shows a
   small bracket above the affected reading and prints the
   italic note inline when hovered or tapped.

   Storage shape (localStorage key: 'operator-annotations-v1'):
       Record<isoDate, string>
   ============================================================ */

import { useState, useEffect, type CSSProperties } from 'react';

const STORAGE_KEY = 'operator-annotations-v1';

export function useAnnotations() {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMap(JSON.parse(raw));
    } catch {}
  }, []);
  const set = (date: string, note: string) => {
    setMap(prev => {
      const next = { ...prev };
      if (note.trim()) next[date] = note.trim();
      else delete next[date];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return { map, set };
}

/** Composer that attaches to a chart reading. Drop near the chart. */
export function AnnotationComposer({
  date, note, onSave, onCancel,
}: { date: string; note: string; onSave: (n: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(note);
  return (
    <div style={{ padding: '14px 18px', background: 'var(--paper-deep)', border: '0.5px solid var(--rule)', marginTop: 12 }}>
      <span style={kicker}>Annotate · {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="One line — back from holiday, new dose, deload week…"
        style={{
          display: 'block', width: '100%', marginTop: 10,
          background: 'transparent', border: 0, borderBottom: '0.5px solid var(--rule)',
          padding: '8px 0',
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 16, color: 'var(--ink)', outline: 'none',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(value);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
        <button onClick={onCancel} style={textLink}>Cancel</button>
        <button onClick={() => onSave(value)} style={{ ...textLink, color: 'var(--ink)', borderBottom: '0.5px solid var(--ink)' }}>Save</button>
      </div>
    </div>
  );
}

/** Annotation marker for chart (inline SVG element). Position absolutely. */
export function AnnotationMarker({ note }: { note: string }) {
  return (
    <g>
      <circle r="4" fill="var(--brass-haze)" stroke="var(--brass-deep)" strokeWidth="1" />
      <title>{note}</title>
    </g>
  );
}

const kicker: CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)',
};
const textLink: CSSProperties = {
  background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)',
  borderBottom: '0.5px solid transparent',
};
