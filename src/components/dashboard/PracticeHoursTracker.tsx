'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addPracticeShift,
  getPracticeShifts,
  getPracticeTarget,
  removePracticeShift,
  savePracticeTarget,
  type PracticeShift,
} from '@/lib/dashboardTracking';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";
const AREA_COLORS = ['#8BBCAA', '#D4A574', '#7BA7CC', '#C89BB0', '#D4B896'];

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
}

/** Trims to one decimal place without leaving a trailing ".0" */
function fmtHours(n: number) {
  return Number(n.toFixed(1)).toLocaleString('en-GB');
}

export default function PracticeHoursTracker() {
  const [shifts, setShifts]   = useState<PracticeShift[]>([]);
  const [target, setTarget]   = useState(2300);
  const [ready, setReady]     = useState(false);

  const [date,  setDate]  = useState(todayYmd());
  const [hours, setHours] = useState('');
  const [area,  setArea]  = useState('');
  const [editingTarget, setEditingTarget] = useState(false);

  // localStorage is only read after mount so server and client markup match
  useEffect(() => {
    setShifts(getPracticeShifts());
    setTarget(getPracticeTarget());
    setReady(true);
  }, []);

  const totals = useMemo(() => {
    const logged    = shifts.reduce((s, x) => s + x.hours, 0);
    const remaining = Math.max(target - logged, 0);
    const pct       = target > 0 ? Math.min((logged / target) * 100, 100) : 0;
    const avg       = shifts.length > 0 ? logged / shifts.length : 0;

    const byArea = new Map<string, number>();
    for (const s of shifts) {
      const key = s.area.trim() || 'Unspecified';
      byArea.set(key, (byArea.get(key) ?? 0) + s.hours);
    }
    const areas = [...byArea.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, hrs]) => ({ name, hrs }));

    return { logged, remaining, pct, avg, areas };
  }, [shifts, target]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!date || !Number.isFinite(h) || h <= 0) return;
    setShifts(addPracticeShift({ date, hours: h, area: area.trim() }));
    setHours('');
    setArea('');
    setDate(todayYmd());
  }

  function commitTarget(value: string) {
    const t = parseInt(value, 10);
    if (Number.isFinite(t) && t > 0) {
      setTarget(t);
      savePracticeTarget(t);
    }
    setEditingTarget(false);
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
            Placement
          </p>
          <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, lineHeight: 1.4 }}>
            Practice hours
          </p>
        </div>
        {editingTarget ? (
          <input
            type="number"
            defaultValue={target}
            autoFocus
            onBlur={e => commitTarget(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitTarget((e.target as HTMLInputElement).value); }}
            style={{ width: '90px', padding: '5px 8px', fontFamily: serif, fontSize: '12px', color: ink, border: `0.5px solid ${ink}`, outline: 'none' }}
          />
        ) : (
          <button
            onClick={() => setEditingTarget(true)}
            style={{ fontFamily: serif, fontSize: '10px', color: muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            Target {target.toLocaleString('en-GB')} h — edit
          </button>
        )}
      </div>

      {/* Headline progress */}
      <div style={{ marginTop: '20px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontFamily: display, fontSize: '2.4rem', fontStyle: 'italic', color: ink, lineHeight: 1 }}>
            {ready ? fmtHours(totals.logged) : '—'}
          </span>
          <span style={{ fontFamily: serif, fontSize: '12px', color: muted, fontWeight: 300 }}>
            of {target.toLocaleString('en-GB')} hours
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: serif, fontSize: '12px', color: '#8BBCAA' }}>
            {ready ? `${totals.pct.toFixed(1)}%` : ''}
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)' }}>
          <div style={{ height: '100%', width: `${ready ? totals.pct : 0}%`, background: '#8BBCAA', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[
            { k: 'Remaining',   v: ready ? `${fmtHours(totals.remaining)} h` : '—' },
            { k: 'Shifts',      v: ready ? String(shifts.length) : '—' },
            { k: 'Avg / shift', v: ready && shifts.length ? `${fmtHours(totals.avg)} h` : '—' },
          ].map(s => (
            <div key={s.k}>
              <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '3px' }}>{s.k}</p>
              <p style={{ fontFamily: serif, fontSize: '13px', color: ink }}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add a shift */}
      <form onSubmit={submit} className="ph-form" style={{ marginBottom: '18px' }}>
        <input
          type="date" value={date} onChange={e => setDate(e.target.value)} required
          style={inputStyle}
        />
        <input
          type="number" value={hours} onChange={e => setHours(e.target.value)}
          placeholder="Hours" step="0.25" min="0.25" max="24" required
          style={inputStyle}
        />
        <input
          type="text" value={area} onChange={e => setArea(e.target.value)}
          placeholder="Placement area" maxLength={40}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{ padding: '9px 18px', fontFamily: serif, fontSize: '12px', background: ink, color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Log shift
        </button>
      </form>

      {/* By area */}
      {ready && totals.areas.length > 0 && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '16px', marginBottom: '4px' }}>
          <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '11px' }}>
            By placement area
          </p>
          {totals.areas.map((a, i) => (
            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
              <span style={{ fontFamily: serif, fontSize: '12px', color: ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
              <span style={{ fontFamily: serif, fontSize: '11px', color: muted, flexShrink: 0 }}>{fmtHours(a.hrs)} h</span>
              <div style={{ width: '70px', height: '2px', background: 'rgba(0,0,0,0.06)', flexShrink: 0 }}>
                <div style={{ height: '100%', width: `${(a.hrs / totals.areas[0].hrs) * 100}%`, background: AREA_COLORS[i % AREA_COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent shifts */}
      {ready && shifts.length > 0 && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
          <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '9px' }}>
            Recent shifts
          </p>
          {shifts.slice(0, 6).map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontFamily: serif, fontSize: '11px', color: muted, width: '52px', flexShrink: 0 }}>{fmtDate(s.date)}</span>
              <span style={{ fontFamily: serif, fontSize: '12px', color: ink, flexShrink: 0 }}>{fmtHours(s.hours)} h</span>
              <span style={{ fontFamily: serif, fontSize: '11px', color: muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.area || '—'}
              </span>
              <button
                onClick={() => setShifts(removePracticeShift(s.id))}
                aria-label={`Remove ${fmtHours(s.hours)} hour shift on ${fmtDate(s.date)}`}
                style={{ fontFamily: serif, fontSize: '14px', color: '#C4B4A8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {ready && shifts.length === 0 && (
        <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.7, borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
          No shifts logged yet. Add your first one above — date, hours, and where you were.
        </p>
      )}

      <p style={{ fontFamily: serif, fontSize: '9px', fontWeight: 300, color: muted, marginTop: '14px', lineHeight: 1.6 }}>
        Saved in this browser only. Keep your university&apos;s record as the official one.
      </p>

      <style>{`
        .ph-form {
          display: grid;
          grid-template-columns: auto 90px 1fr auto;
          gap: 8px;
        }
        @media (max-width: 620px) {
          .ph-form { grid-template-columns: 1fr 1fr; }
          .ph-form button { grid-column: 1 / -1; }
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
