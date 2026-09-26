'use client';

import { Search } from 'lucide-react';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal-light)";
const muted = "var(--charcoal-light)";
const borderMid = "var(--border)";
const border = "var(--border)";

export default function QuickTopicSearch() {
  function triggerGlobalSearch() {
    window.dispatchEvent(new Event('open-command-palette'));
  }

  return (
    <div className="dash-search-shell" style={{ border: borderMid }}>
      <h3 style={{ fontFamily: display, fontSize: '1.6rem', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '10px' }}>
        Looking for something specific?
      </h3>

      <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.8, marginBottom: '16px', maxWidth: '36rem' }}>
        Search guides, skills, and quick references across both adult and children&apos;s branches.
      </p>

      <div className="dash-search-input" onClick={triggerGlobalSearch}>
        <Search size={14} color={mid} style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search hub resources..."
          readOnly
          onFocus={triggerGlobalSearch}
          aria-label="Search dashboard resources"
          style={{
            fontFamily: serif,
            fontSize: '13px',
            color: ink,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            cursor: 'pointer'
          }}
        />
        <span className="dash-search-hint">⌘K</span>
      </div>

      <style>{`
        .dash-search-shell {
          position: relative;
          background: var(--surface-page);
          border-radius: var(--radius-sm);
          padding: 24px 26px;
          min-height: 100%;
          transition: border-color 0.2s ease;
        }
        .dash-search-shell:hover {
          border-color: var(--gold);
          box-shadow: var(--shadow-sm);
        }

        .dash-search-input {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0.5px solid ${border};
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.94);
          padding: 12px 14px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .dash-search-input:hover {
          border-color: var(--gold);
        }

        .dash-search-hint {
          font-family: monospace;
          font-size: 10px;
          color: ${muted};
          padding-left: 12px;
          border-left: 0.5px solid ${border};
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
