'use client';

import { Sun, Moon, Plus } from 'lucide-react';

export type OperatorSection = 'today' | 'trajectory' | 'history' | 'nutrition' | 'insights' | 'plan';

export const SECTION_EMOJI: Record<OperatorSection, string> = {
  today: '🌸',
  trajectory: '📈',
  history: '🗓️',
  nutrition: '🍓',
  insights: '🔮',
  plan: '🎀',
};

const NAV_ITEMS: { key: OperatorSection; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'trajectory', label: 'Trajectory' },
  { key: 'history', label: 'History' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'insights', label: 'Insights' },
  { key: 'plan', label: 'Plan' },
];

interface OperatorSidebarProps {
  active: OperatorSection;
  onSelect: (section: OperatorSection) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogWeight: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function OperatorSidebar({
  active, onSelect, theme, onToggleTheme, onLogWeight, isOpen, onClose,
}: OperatorSidebarProps) {
  return (
    <>
      {isOpen ? <div className="fit-sidebar-backdrop" onClick={onClose} /> : null}
      <aside className={`fit-sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="fit-sidebar-brand">
          <span className="fit-sidebar-brand-icon" aria-hidden>🌸</span>
          <div className="fit-sidebar-brand-copy">
            <strong>Operator</strong>
            <span>Fitness dashboard</span>
          </div>
        </div>

        <button type="button" className="fit-sidebar-log-btn" onClick={onLogWeight}>
          <Plus aria-hidden size={14} /> New reading
        </button>

        <nav className="fit-sidebar-nav" aria-label="Dashboard sections">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`fit-sidebar-nav-item${active === item.key ? ' is-active' : ''}`}
              onClick={() => { onSelect(item.key); onClose(); }}
              aria-current={active === item.key ? 'page' : undefined}
            >
              <span className="fit-sidebar-nav-emoji" aria-hidden>{SECTION_EMOJI[item.key]}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="fit-sidebar-spacer" />

        <div className="fit-sidebar-foot">
          <button
            type="button"
            className="op-theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun aria-hidden size={15} /> : <Moon aria-hidden size={15} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>
    </>
  );
}
