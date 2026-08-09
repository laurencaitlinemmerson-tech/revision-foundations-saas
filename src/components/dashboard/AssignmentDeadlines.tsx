'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addAssignment,
  getAssignments,
  removeAssignment,
  toggleAssignment,
  type Assignment,
} from '@/lib/dashboardTracking';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Whole days from today to a YYYY-MM-DD date; negative means overdue */
function daysUntil(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const target = new Date(y, m - 1, d);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

function fmtDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
}

function urgency(days: number) {
  if (days < 0)  return { color: '#C0616B', label: `${Math.abs(days)}d overdue` };
  if (days === 0) return { color: '#C0616B', label: 'Due today' };
  if (days <= 7)  return { color: '#B8863F', label: `${days}d left` };
  return { color: '#6B9E87', label: `${days}d left` };
}

export default function AssignmentDeadlines() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [ready, setReady] = useState(false);

  const [title,  setTitle]  = useState('');
  const [module, setModule] = useState('');
  const [due,    setDue]    = useState(todayYmd());

  useEffect(() => {
    setItems(getAssignments());
    setReady(true);
  }, []);

  const { open, done, next } = useMemo(() => {
    const open = items.filter(a => !a.done);
    const done = items.filter(a => a.done);
    return { open, done, next: open[0] ?? null };
  }, [items]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !due) return;
    setItems(addAssignment({ title: title.trim(), module: module.trim(), due }));
    setTitle('');
    setModule('');
    setDue(todayYmd());
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
        Academic
      </p>
      <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, marginBottom: '16px', lineHeight: 1.4 }}>
        Assignment deadlines
      </p>

      {/* Next due */}
      <div style={{ padding: '14px 16px', background: 'rgba(0,0,0,0.02)', marginBottom: '16px' }}>
        {!ready ? (
          <p style={{ fontFamily: serif, fontSize: '12px', color: muted }}>Loading…</p>
        ) : next ? (
          <>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '6px' }}>
              Next due
            </p>
            <p style={{ fontFamily: display, fontSize: '1.3rem', fontStyle: 'italic', color: ink, lineHeight: 1.2, marginBottom: '4px' }}>
              {next.title}
            </p>
            <p style={{ fontFamily: serif, fontSize: '11px', color: urgency(daysUntil(next.due)).color }}>
              {fmtDate(next.due)} · {urgency(daysUntil(next.due)).label}
              {next.module && <span style={{ color: muted }}> · {next.module}</span>}
            </p>
          </>
        ) : (
          <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.7 }}>
            Nothing outstanding. Add a deadline below when one lands.
          </p>
        )}
      </div>

      {/* Add */}
      <form onSubmit={submit} className="as-form" style={{ marginBottom: '16px' }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment" maxLength={70} required style={inputStyle} />
        <input value={module} onChange={e => setModule(e.target.value)} placeholder="Module" maxLength={40} style={inputStyle} />
        <input value={due} onChange={e => setDue(e.target.value)} type="date" required style={inputStyle} />
        <button type="submit" style={{ padding: '9px 16px', fontFamily: serif, fontSize: '12px', background: ink, color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Add
        </button>
      </form>

      {/* Outstanding */}
      {ready && open.length > 0 && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '12px' }}>
          {open.map(a => {
            const u = urgency(daysUntil(a.due));
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                <input
                  type="checkbox" checked={false} onChange={() => setItems(toggleAssignment(a.id))}
                  aria-label={`Mark ${a.title} complete`}
                  style={{ flexShrink: 0, cursor: 'pointer', accentColor: '#8BBCAA' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  {a.module && <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300 }}>{a.module}</p>}
                </div>
                <span style={{ fontFamily: serif, fontSize: '10px', color: muted, flexShrink: 0 }}>{fmtDate(a.due)}</span>
                <span style={{ fontFamily: serif, fontSize: '10px', color: u.color, flexShrink: 0, width: '62px', textAlign: 'right' }}>{u.label}</span>
                <button
                  onClick={() => setItems(removeAssignment(a.id))}
                  aria-label={`Delete ${a.title}`}
                  style={{ fontFamily: serif, fontSize: '14px', color: '#C4B4A8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Submitted */}
      {ready && done.length > 0 && (
        <details style={{ marginTop: '12px' }}>
          <summary style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, cursor: 'pointer' }}>
            Submitted ({done.length})
          </summary>
          <div style={{ marginTop: '8px' }}>
            {done.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                <input
                  type="checkbox" checked readOnly onClick={() => setItems(toggleAssignment(a.id))}
                  aria-label={`Mark ${a.title} outstanding`}
                  style={{ flexShrink: 0, cursor: 'pointer', accentColor: '#8BBCAA' }}
                />
                <span style={{ fontFamily: serif, fontSize: '11px', color: muted, flex: 1, textDecoration: 'line-through', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.title}
                </span>
                <button
                  onClick={() => setItems(removeAssignment(a.id))}
                  aria-label={`Delete ${a.title}`}
                  style={{ fontFamily: serif, fontSize: '14px', color: '#C4B4A8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </details>
      )}

      <style>{`
        .as-form { display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 7px; }
        @media (max-width: 700px) {
          .as-form { grid-template-columns: 1fr 1fr; }
          .as-form button { grid-column: 1 / -1; }
        }
      `}</style>
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
