'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  id: string;
  label: string;
  note: string;
  completed: boolean;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', label: 'Morning Weigh-In Logged', note: 'Fasted weigh-in before liquid intake', completed: false },
  { id: '2', label: 'Protein Target Hit (160g+)', note: 'Anchor around major meal windows', completed: false },
  { id: '3', label: 'Creatine & 3L Hydration', note: '5g monohydrate daily', completed: false },
  { id: '4', label: 'Lift Session / Workout Logged', note: 'Log set load & rep count', completed: false },
  { id: '5', label: '10k Step Goal Reached', note: 'NEAT movement & active walks', completed: false },
];

export function OperatorChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
  const [mounted, setMounted] = useState<boolean>(false);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setMounted(true);
    try {
      const savedDate = localStorage.getItem('op_checklist_date');
      const savedData = localStorage.getItem('op_checklist_goals');
      if (savedDate === todayKey && savedData) {
        setItems(JSON.parse(savedData));
      } else {
        localStorage.setItem('op_checklist_date', todayKey);
        localStorage.setItem('op_checklist_goals', JSON.stringify(DEFAULT_ITEMS));
      }
    } catch {}
  }, [todayKey]);

  function handleToggle(id: string) {
    const next = items.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it));
    setItems(next);
    try {
      localStorage.setItem('op_checklist_goals', JSON.stringify(next));
    } catch {}

    const completedCount = next.filter((i) => i.completed).length;
    if (completedCount === next.length && next.length > 0) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C06C84', '#7F9289', '#D194A8', '#3A2A33'],
        });
      } catch {}
    }
  }

  if (!mounted) return null;

  const completedCount = items.filter((i) => i.completed).length;
  const pct = Math.round((completedCount / items.length) * 100);

  return (
    <div
      style={{
        padding: '24px 26px',
        background: '#FFFFFF',
        border: '0.5px solid rgba(26,24,21,0.12)',
        borderRadius: '12px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A4459' }}>
            Daily Protocol Checklist
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'var(--ink)',
              margin: '3px 0 0',
              letterSpacing: '-0.015em',
            }}
          >
            {completedCount} of {items.length} items logged ({pct}%)
          </h3>
        </div>

        <span
          style={{
            fontSize: '11px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: pct === 100 ? '#EDF1EC' : '#FAF0F3',
            color: pct === 100 ? '#7F9289' : '#8A4459',
            fontWeight: 500,
          }}
        >
          {pct === 100 ? '✓ All protocols hit' : `${items.length - completedCount} remaining`}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '4px',
          background: 'rgba(26,24,21,0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: pct === 100 ? '#7F9289' : '#C06C84',
            transition: 'width 0.4s ease, background 0.3s ease',
          }}
        />
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((it) => (
          <div
            key={it.id}
            onClick={() => handleToggle(it.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '8px',
              border: `0.5px solid ${it.completed ? 'rgba(127,146,137,0.3)' : 'rgba(26,24,21,0.08)'}`,
              background: it.completed ? '#F8FAF7' : '#FFFFFF',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `1.5px solid ${it.completed ? '#7F9289' : 'rgba(26,24,21,0.25)'}`,
                  background: it.completed ? '#7F9289' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
              >
                {it.completed && '✓'}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13.5px',
                    color: it.completed ? '#8E8A82' : 'var(--ink)',
                    textDecoration: it.completed ? 'line-through' : 'none',
                  }}
                >
                  {it.label}
                </div>
                <div style={{ fontSize: '11px', color: '#A29D95', marginTop: '1px' }}>{it.note}</div>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: it.completed ? '#7F9289' : '#A29D95' }}>
              {it.completed ? 'Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
