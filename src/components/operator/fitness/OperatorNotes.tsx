'use client';

import { useEffect, useRef, useState } from 'react';

const TAGS = ['#PR', '#RPE8', '#RPE9', '#Fasted', '#LowEnergy', '#GreatPump', '#Sleep8h'];

export function OperatorNotes() {
  const [noteText, setNoteText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setMounted(true);
    try {
      const savedDate = localStorage.getItem('op_notes_date');
      const savedNote = localStorage.getItem('op_notes_text');
      if (savedDate === todayKey && savedNote) {
        setNoteText(savedNote);
      }
    } catch {}
  }, [todayKey]);

  function handleChange(val: string) {
    setNoteText(val);
    setIsSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem('op_notes_date', todayKey);
        localStorage.setItem('op_notes_text', val);
        setIsSaved(true);
      } catch {}
    }, 500);
  }

  function handleAddTag(tag: string) {
    const next = noteText ? `${noteText.trim()} ${tag}` : tag;
    handleChange(next);
  }

  if (!mounted) return null;

  return (
    <div
      style={{
        padding: '20px 24px',
        background: '#FFFFFF',
        border: '0.5px solid rgba(26,24,21,0.12)',
        borderRadius: '12px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A4459' }}>
          Operator Field Notes
        </span>
        <span style={{ fontSize: '10px', color: isSaved ? '#7F9289' : '#8E8A82' }}>
          {isSaved ? '✓ Autosaved' : 'Typing...'}
        </span>
      </div>

      <textarea
        value={noteText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Log workout notes, feel, RPE, or meal adjustments today..."
        rows={3}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '0.5px solid rgba(26,24,21,0.12)',
          fontSize: '13px',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          resize: 'none',
          background: '#FBFAF8',
        }}
      />

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleAddTag(t)}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              border: '0.5px solid rgba(26,24,21,0.12)',
              background: '#FFFFFF',
              color: '#8E8A82',
              fontSize: '10.5px',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
