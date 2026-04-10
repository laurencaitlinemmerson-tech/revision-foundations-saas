
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
    <div className="card bg-[var(--lilac-soft)] border-[var(--lavender)]/60 mb-8">
      <h2 className="text-lg font-semibold text-[var(--plum)] mb-2">📝 Notes to Myself</h2>
      <textarea
        className="w-full min-h-[120px] p-3 rounded-lg border border-[var(--lavender)] bg-white text-[var(--plum-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--purple)] transition resize-vertical"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Jot down reminders, goals, or anything you like..."
      />
    </div>
  );
}
