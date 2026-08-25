'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

interface GoalItem {
  id: string;
  label: string;
  category: 'quiz' | 'osce' | 'hub' | 'custom';
  completed: boolean;
}

const DEFAULT_GOALS: GoalItem[] = [
  { id: '1', label: 'Run a 5-min Core Quiz recall set', category: 'quiz', completed: false },
  { id: '2', label: 'Review 1 key guide on your weakest topic', category: 'hub', completed: false },
  { id: '3', label: 'Run 1 timed OSCE checklist station', category: 'osce', completed: false },
  { id: '4', label: 'Log 15 minutes in the Focus Sprint Timer', category: 'custom', completed: false },
];

export default function InteractiveDailyChecklist() {
  const [goals, setGoals] = useState<GoalItem[]>(DEFAULT_GOALS);
  const [newGoalText, setNewGoalText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setMounted(true);
    try {
      const savedDate = localStorage.getItem('rf_checklist_date');
      const savedData = localStorage.getItem('rf_checklist_goals');
      if (savedDate === todayKey && savedData) {
        setGoals(JSON.parse(savedData));
      } else {
        localStorage.setItem('rf_checklist_date', todayKey);
        localStorage.setItem('rf_checklist_goals', JSON.stringify(DEFAULT_GOALS));
      }
    } catch {}
  }, [todayKey]);

  function updateGoals(next: GoalItem[]) {
    setGoals(next);
    try {
      localStorage.setItem('rf_checklist_goals', JSON.stringify(next));
    } catch {}
  }

  function handleToggle(id: string) {
    const next = goals.map((g) => {
      if (g.id === id) {
        return { ...g, completed: !g.completed };
      }
      return g;
    });

    updateGoals(next);

    const completedCount = next.filter((g) => g.completed).length;
    if (completedCount === next.length && next.length > 0) {
      // 100% completion celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#8BBCAA', '#D4A574', '#C89BB0', '#7BA7CC'],
        });
      } catch {}
    }
  }

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newItem: GoalItem = {
      id: Date.now().toString(),
      label: newGoalText.trim(),
      category: 'custom',
      completed: false,
    };
    const next = [...goals, newItem];
    updateGoals(next);
    setNewGoalText('');
    setShowAddForm(false);
  }

  function handleDeleteGoal(id: string) {
    const next = goals.filter((g) => g.id !== id);
    updateGoals(next);
  }

  if (!mounted) return null;

  const completedCount = goals.filter((g) => g.completed).length;
  const pct = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div
      style={{
        background: 'var(--surface-raised, #FFFFFF)',
        border: '0.5px solid var(--hairline-firm, rgba(0,0,0,0.12))',
        padding: '22px 24px',
        marginTop: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <p
            style={{
              fontFamily: serif,
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: muted,
              margin: 0,
            }}
          >
            Today's Micro-Wins Checklist
          </p>
          <p
            style={{
              fontFamily: display,
              fontSize: '1.25rem',
              color: ink,
              margin: '4px 0 0',
              fontStyle: 'italic',
            }}
          >
            {completedCount} of {goals.length} micro-goals completed ({pct}%)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            fontFamily: serif,
            fontSize: '11px',
            color: ink,
            background: 'transparent',
            border: '0.5px solid rgba(0,0,0,0.15)',
            padding: '5px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '18px' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: pct === 100 ? '#6B9E87' : '#D4A574',
            transition: 'width 0.4s ease, background 0.3s ease',
          }}
        />
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="e.g. Read 5 pages of Paediatric Dosage Guide..."
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontFamily: serif,
              fontSize: '12.5px',
              border: '0.5px solid rgba(0,0,0,0.2)',
              outline: 'none',
              background: 'var(--cream, #FDFDFB)',
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: ink,
              color: 'white',
              fontFamily: serif,
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </form>
      )}

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => handleToggle(g.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              border: `0.5px solid ${g.completed ? 'rgba(107,158,135,0.3)' : 'rgba(0,0,0,0.08)'}`,
              background: g.completed ? 'rgba(107,158,135,0.05)' : 'transparent',
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
                  borderRadius: '3px',
                  border: `1.5px solid ${g.completed ? '#6B9E87' : 'rgba(0,0,0,0.25)'}`,
                  background: g.completed ? '#6B9E87' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
              >
                {g.completed && '✓'}
              </div>
              <span
                style={{
                  fontFamily: serif,
                  fontSize: '13px',
                  color: g.completed ? 'rgba(0,0,0,0.45)' : ink,
                  textDecoration: g.completed ? 'line-through' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {g.label}
              </span>
            </div>

            {g.category === 'custom' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGoal(g.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: muted,
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
