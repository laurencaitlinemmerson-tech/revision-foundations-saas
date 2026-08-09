'use client';

import { useEffect, useState } from 'react';
import {
  addReflection,
  getReflections,
  removeReflection,
  type Reflection,
} from '@/lib/dashboardTracking';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(y, m - 1, d));
}

export default function ReflectionLog() {
  const [entries, setEntries] = useState<Reflection[]>([]);
  const [ready, setReady]     = useState(false);
  const [open, setOpen]       = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [date,  setDate]  = useState(todayYmd());
  const [title, setTitle] = useState('');
  const [body,  setBody]  = useState('');

  useEffect(() => {
    setEntries(getReflections());
    setReady(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setEntries(addReflection({ date, title: title.trim(), body: body.trim() }));
    setTitle('');
    setBody('');
    setDate(todayYmd());
    setOpen(false);
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
            Practice learning
          </p>
          <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, lineHeight: 1.4 }}>
            Reflections
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            padding: '7px 14px', fontFamily: serif, fontSize: '11px', flexShrink: 0,
            background: open ? '#fff' : ink, color: open ? '#7A6F64' : '#fff',
            border: `0.5px solid ${open ? 'rgba(0,0,0,0.14)' : ink}`, cursor: 'pointer',
          }}
        >
          {open ? 'Cancel' : 'New entry'}
        </button>
      </div>

      <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.7, marginTop: '10px', marginBottom: '16px' }}>
        {ready
          ? `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} logged. Write these up while the shift is fresh — they're far harder to reconstruct later.`
          : 'Loading…'}
      </p>

      {open && (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ ...inputStyle, flexShrink: 0 }} />
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="What happened?" maxLength={80} required
              style={{ ...inputStyle, flex: 1, minWidth: '140px' }}
            />
          </div>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="What did you learn, and what would you do differently?"
            rows={4} maxLength={2000} required
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
          />
          <button
            type="submit"
            style={{ padding: '9px 18px', fontFamily: serif, fontSize: '12px', background: ink, color: '#fff', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Save reflection
          </button>
        </form>
      )}

      {ready && entries.length > 0 && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
          {entries.slice(0, 8).map(r => {
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '11px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    aria-expanded={isOpen}
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                  >
                    <p style={{ fontFamily: serif, fontSize: '12px', color: ink, marginBottom: '2px' }}>{r.title}</p>
                    <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300 }}>{fmtDate(r.date)}</p>
                  </button>
                  <button
                    onClick={() => setEntries(removeReflection(r.id))}
                    aria-label={`Delete reflection: ${r.title}`}
                    style={{ fontFamily: serif, fontSize: '14px', color: '#C4B4A8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
                {isOpen && (
                  <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: '#5A5750', lineHeight: 1.8, marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                    {r.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {ready && entries.length === 0 && !open && (
        <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.7, borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '14px' }}>
          Nothing logged yet. A few lines after a shift is enough.
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '9px 10px',
  fontFamily: serif,
  fontSize: '12px',
  color: ink,
  background: '#fff',
  border: '0.5px solid rgba(0,0,0,0.14)',
  outline: 'none',
  minWidth: 0,
};
