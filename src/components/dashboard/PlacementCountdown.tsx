'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  type CountdownDate,
  getCountdownDates,
  saveCountdownDates,
} from '@/lib/dashboardTracking';

const serif  = "var(--font-body)";
const display = "var(--font-display)";
const ink    = "var(--espresso)";
const mid    = "var(--charcoal)";
const muted  = "var(--charcoal-light)";
const border = "var(--border)";

const LABEL_PRESETS = ['Placement', 'Exam', 'Assignment', 'Deadline', 'Interview'];

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyColor(days: number): string {
  if (days < 0)  return muted;
  if (days === 0) return 'var(--teal-600, #1E8A6E)';
  if (days <= 7)  return 'var(--coral-600, #C0392B)';
  if (days <= 14) return 'var(--amber-600, #B7791F)';
  return ink;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function PlacementCountdown() {
  const [dates, setDates]     = useState<CountdownDate[]>([]);
  const [adding, setAdding]   = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDate, setNewDate]   = useState('');
  const [mounted, setMounted]   = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  useEffect(() => {
    setMounted(true);
    setDates(getCountdownDates());
  }, []);

  useEffect(() => {
    if (adding) labelInputRef.current?.focus();
  }, [adding]);

  if (!mounted) return null;

  function handleAdd() {
    if (!newLabel.trim() || !newDate) return;
    const next: CountdownDate[] = [
      ...dates,
      { id: `${Date.now()}`, label: newLabel.trim(), date: newDate },
    ];
    next.sort((a, b) => a.date.localeCompare(b.date));
    setDates(next);
    saveCountdownDates(next);
    setNewLabel('');
    setNewDate('');
    setAdding(false);
  }

  function handleDelete(id: string) {
    const next = dates.filter(d => d.id !== id);
    setDates(next);
    saveCountdownDates(next);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setAdding(false); setNewLabel(''); setNewDate(''); }
  }

  const upcoming = dates.filter(d => daysUntil(d.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  const past     = dates.filter(d => daysUntil(d.date) < 0);

  return (
    <div style={{ border, background: 'white', padding: '22px 26px' }}>
      {/* Header */}
      <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '16px' }}>
        Upcoming dates
      </p>

      {/* Date list */}
      {dates.length === 0 && !adding && (
        <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: muted, marginBottom: '14px' }}>
          No dates set yet.
        </p>
      )}

      {upcoming.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: past.length > 0 ? '14px' : '0' }}>
          {upcoming.map(item => {
            const days = daysUntil(item.date);
            const color = urgencyColor(days);
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '0.5px solid var(--hairline-soft)' }}>
                {/* Countdown number */}
                <span style={{ fontFamily: display, fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1, color, minWidth: '44px', textAlign: 'right', flexShrink: 0 }}>
                  {days === 0 ? '!' : days}
                </span>
                {/* Label + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: ink, marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '10px', fontWeight: 300, color: muted }}>
                    {days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} · ${formatDate(item.date)}`}
                  </p>
                </div>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Remove ${item.label}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.2)', fontSize: '14px', padding: '4px', flexShrink: 0, lineHeight: 1 }}
                  onMouseEnter={e => (e.currentTarget.style.color = mid)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.2)')}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Past dates (collapsed) */}
      {past.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          {past.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', opacity: 0.45 }}>
              <span style={{ fontFamily: display, fontSize: '1.2rem', fontStyle: 'italic', color: muted, minWidth: '44px', textAlign: 'right', flexShrink: 0 }}>
                {Math.abs(daysUntil(item.date))}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: serif, fontSize: '12px', color: mid, textDecoration: 'line-through' }}>{item.label}</p>
                <p style={{ fontFamily: serif, fontSize: '10px', color: muted }}>{Math.abs(daysUntil(item.date))} days ago</p>
              </div>
              <button onClick={() => handleDelete(item.id)} aria-label={`Remove ${item.label}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.15)', fontSize: '13px', padding: '4px', flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }} onKeyDown={handleKeyDown}>
          {/* Label presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2px' }}>
            {LABEL_PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setNewLabel(p)}
                style={{
                  fontFamily: serif, fontSize: '11px', padding: '4px 10px',
                  background: newLabel === p ? ink : 'transparent',
                  color: newLabel === p ? 'var(--surface-page)' : mid,
                  border: '0.5px solid var(--hairline-firm)',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              ref={labelInputRef}
              id={`${formId}-label`}
              type="text"
              placeholder="Label (e.g. Final exam)"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              style={{ fontFamily: serif, fontSize: '13px', color: ink, background: 'var(--surface-page)', border, padding: '8px 10px', outline: 'none', flex: '1 1 140px', minWidth: 0 }}
            />
            <input
              id={`${formId}-date`}
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{ fontFamily: serif, fontSize: '13px', color: ink, background: 'var(--surface-page)', border, padding: '8px 10px', outline: 'none', flex: '0 0 auto' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || !newDate}
              style={{ fontFamily: serif, fontSize: '12px', color: 'var(--surface-page)', background: ink, padding: '8px 16px', border: 'none', cursor: 'pointer', opacity: newLabel.trim() && newDate ? 1 : 0.4 }}
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setNewLabel(''); setNewDate(''); }}
              style={{ fontFamily: serif, fontSize: '12px', color: muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', padding: 0 }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{ fontFamily: serif, fontSize: '12px', color: muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', padding: '10px 0 0', display: 'block', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = mid)}
          onMouseLeave={e => (e.currentTarget.style.color = muted)}
        >
          + Add a date
        </button>
      )}
    </div>
  );
}
