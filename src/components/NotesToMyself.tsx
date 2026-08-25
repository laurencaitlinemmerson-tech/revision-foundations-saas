
"use client";
import { useState, useEffect } from 'react';

export default function NotesToMyself() {
  const [notes, setNotes] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-notes');
    if (saved) setNotes(saved);
  }, []);

  // Save notes to localStorage on change
  useEffect(() => {
    localStorage.setItem('dashboard-notes', notes);
  }, [notes]);

  return (
    <div className="card mb-8 border border-black/8 bg-[var(--surface-sunken)]">
      <h2
        className="mb-2 text-lg"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--ink-strong)',
          fontWeight: 400,
        }}
      >
        Notes to myself
      </h2>
      <textarea
        className="min-h-[120px] w-full resize-vertical border border-black/10 bg-white p-3 transition focus:outline-none"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Jot down reminders, goals, or anything you like..."
        style={{
          color: 'var(--ink-strong)',
          lineHeight: 1.7,
        }}
      />
    </div>
  );
}
