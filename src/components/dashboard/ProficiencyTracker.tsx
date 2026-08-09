'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  NMC_PLATFORMS,
  getProficiencies,
  setProficiency,
  type ProficiencyMap,
  type ProficiencyStatus,
} from '@/lib/dashboardTracking';

const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";

const CYCLE: ProficiencyStatus[] = ['not-started', 'in-progress', 'signed-off'];

const STATUS_META: Record<ProficiencyStatus, { label: string; color: string; bg: string }> = {
  'not-started': { label: 'Not started', color: '#B4A89C', bg: 'rgba(0,0,0,0.04)'    },
  'in-progress': { label: 'In progress', color: '#B8863F', bg: 'rgba(212,165,116,0.16)' },
  'signed-off':  { label: 'Signed off',  color: '#4F7F68', bg: 'rgba(139,188,170,0.22)' },
};

export default function ProficiencyTracker() {
  const [map, setMap]     = useState<ProficiencyMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMap(getProficiencies());
    setReady(true);
  }, []);

  const signedOff = useMemo(
    () => NMC_PLATFORMS.filter(p => map[p.id] === 'signed-off').length,
    [map],
  );

  const pct = (signedOff / NMC_PLATFORMS.length) * 100;

  function advance(id: string) {
    const current = map[id] ?? 'not-started';
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    setMap(setProficiency(id, next));
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px 26px' }}>
      <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
        NMC Future Nurse
      </p>
      <p style={{ fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic', color: ink, marginBottom: '16px', lineHeight: 1.4 }}>
        Proficiency platforms
      </p>

      {/* Summary */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontFamily: display, fontSize: '1.9rem', fontStyle: 'italic', color: ink, lineHeight: 1 }}>
          {ready ? signedOff : '—'}
        </span>
        <span style={{ fontFamily: serif, fontSize: '12px', color: muted, fontWeight: 300 }}>
          of {NMC_PLATFORMS.length} signed off
        </span>
      </div>
      <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', marginBottom: '18px' }}>
        <div style={{ height: '100%', width: `${ready ? pct : 0}%`, background: '#8BBCAA', transition: 'width 0.4s ease' }} />
      </div>

      {/* Platforms */}
      <div style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
        {NMC_PLATFORMS.map((p, i) => {
          const status = map[p.id] ?? 'not-started';
          const meta   = STATUS_META[status];
          return (
            <button
              key={p.id}
              onClick={() => advance(p.id)}
              title="Click to change status"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 12px', background: '#fff', border: 'none',
                borderBottom: i < NMC_PLATFORMS.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: serif, fontSize: '9px', color: muted, flexShrink: 0, width: '16px' }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: serif, fontSize: '12px', color: ink, flex: 1, lineHeight: 1.5 }}>
                {p.label}
              </span>
              <span style={{
                fontFamily: serif, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: meta.color, background: meta.bg, padding: '3px 8px', flexShrink: 0, whiteSpace: 'nowrap',
              }}>
                {ready ? meta.label : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily: serif, fontSize: '9px', fontWeight: 300, color: muted, marginTop: '12px', lineHeight: 1.6 }}>
        Click a platform to cycle its status. Your practice assessment document remains the formal record.
      </p>
    </div>
  );
}
