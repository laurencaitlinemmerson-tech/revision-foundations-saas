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
  icon: string;
  label: string;
  desc: string;
  accent: string;
}

const OPTIONS: EnergyOption[] = [
  {
    key: 'high',
    icon: '⚡',
    label: 'High energy',
    desc: 'Good day for a full OSCE run or a longer mock.',
    accent: '#6B9E87',
  },
  {
    key: 'steady',
    icon: '☕',
    label: 'Steady focus',
    desc: 'A solid day for quizzes and guided reading.',
    accent: '#D4A574',
  },
  {
    key: 'low',
    icon: '🌙',
    label: 'Low energy',
    desc: 'Keep it light — a quick recall set is plenty.',
    accent: '#7BA7CC',
  },
  {
    key: 'crunch',
    icon: '🎯',
    label: 'Crunch time',
    desc: "Let's zero in on weak spots and red flags.",
    accent: '#C89BB0',
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
                <span style={{ fontSize: '14px' }}>{opt.icon}</span>
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
