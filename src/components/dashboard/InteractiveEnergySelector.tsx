'use client';

import { useEffect, useState } from 'react';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

export type EnergyLevel = 'high' | 'steady' | 'low' | 'crunch';

interface EnergyOption {
  key: EnergyLevel;
  icon: 'bolt' | 'cup' | 'moon' | 'target';
  label: string;
  desc: string;
  accent: string;
}

function EnergyIcon({ name, colour }: { name: EnergyOption['icon']; colour: string }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: colour, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (name === 'bolt') return <svg {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
  if (name === 'cup') return <svg {...common}><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 3v2M12 3v2" /></svg>;
  if (name === 'moon') return <svg {...common}><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></svg>;
}

const OPTIONS: EnergyOption[] = [
  {
    key: 'high',
    icon: 'bolt',
    label: 'High energy',
    desc: 'Good day for a full OSCE run or a longer mock.',
    accent: '#0F6E56',
  },
  {
    key: 'steady',
    icon: 'cup',
    label: 'Steady focus',
    desc: 'A solid day for quizzes and guided reading.',
    accent: '#A6906B',
  },
  {
    key: 'low',
    icon: 'moon',
    label: 'Low energy',
    desc: 'Keep it light — a quick recall set is plenty.',
    accent: '#185FA5',
  },
  {
    key: 'crunch',
    icon: 'target',
    label: 'Crunch time',
    desc: "Let's zero in on weak spots and red flags.",
    accent: '#B0664A',
  },
];

interface InteractiveEnergySelectorProps {
  onSelectEnergy?: (level: EnergyLevel) => void;
}

export default function InteractiveEnergySelector({ onSelectEnergy }: InteractiveEnergySelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<EnergyLevel>('steady');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('rf_energy_level') as EnergyLevel;
      if (saved && OPTIONS.some((o) => o.key === saved)) {
        setCurrentLevel(saved);
      }
    } catch {}
  }, []);

  function handleSelect(key: EnergyLevel) {
    setCurrentLevel(key);
    try {
      localStorage.setItem('rf_energy_level', key);
      window.dispatchEvent(new CustomEvent('rf_energy_change', { detail: key }));
    } catch {}
    if (onSelectEnergy) onSelectEnergy(key);
  }

  if (!mounted) return null;

  return (
    <div
      style={{
        background: 'var(--surface-raised, #FFFFFF)',
        border: '0.5px solid var(--hairline-firm, rgba(0,0,0,0.12))',
        borderRadius: 'var(--radius-sm)',
        padding: '16px 20px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p
          style={{
            fontFamily: display,
            fontSize: '1rem',
            fontWeight: 400,
            color: ink,
            margin: 0,
          }}
        >
          How&apos;s your energy today?
        </p>
        <span style={{ fontFamily: serif, fontSize: '11px', color: mid, opacity: 0.7 }}>
          Today&apos;s plan will shift to match
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {OPTIONS.map((opt) => {
          const isSelected = currentLevel === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelect(opt.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: `0.5px solid ${isSelected ? opt.accent : 'rgba(0,0,0,0.1)'}`,
                background: isSelected ? `${opt.accent}12` : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <EnergyIcon name={opt.icon} colour={isSelected ? opt.accent : 'currentColor'} />
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? ink : mid,
                  }}
                >
                  {opt.label}
                </span>
              </div>
              <span style={{ fontFamily: serif, fontSize: '10px', color: muted, lineHeight: 1.3 }}>
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
