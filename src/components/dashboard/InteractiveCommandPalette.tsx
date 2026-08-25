'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

interface CommandItem {
  id: string;
  title: string;
  category: 'Guide' | 'Quiz' | 'OSCE' | 'Tool';
  href: string;
  description: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: '1',
    title: 'Core Quiz — All Topics',
    category: 'Quiz',
    href: '/quiz',
    description: '17 nursing topics with instant feedback & explanations',
  },
  {
    id: '2',
    title: 'Respiratory Assessment & Auscultation',
    category: 'Guide',
    href: '/hub/childrens/respiratory-assessment',
    description: 'Clinical guide to lung sounds, work of breathing & ABCDE',
  },
  {
    id: '3',
    title: 'Paediatric OSCE Station Checklists',
    category: 'OSCE',
    href: '/osce',
    description: '50+ timed clinical stations with step-by-step checklists',
  },
  {
    id: '4',
    title: 'Cardiac & ECG Interpretation',
    category: 'Guide',
    href: '/hub/childrens/cardiac-ecg',
    description: 'ECG rhythms, heart sounds & cardiac emergency care',
  },
  {
    id: '5',
    title: 'Pharmacology & Drug Calculations',
    category: 'Quiz',
    href: '/quiz?topic=pharmacology',
    description: 'Dosage calculations, high-alert meds & side effect recall',
  },
  {
    id: '6',
    title: 'Neuro Assessment & AVPU / GCS',
    category: 'Guide',
    href: '/hub/childrens/neurological-assessment',
    description: 'Pupil response, seizure protocol & Glasgow Coma Scale',
  },
  {
    id: '7',
    title: 'Saved Folders & Desk Library',
    category: 'Tool',
    href: '/dashboard#saved-folders',
    description: 'Revisit your saved clinical guides & personal folders',
  },
  {
    id: '8',
    title: 'Sample Revision Week Planner',
    category: 'Tool',
    href: '/dashboard#revision-week',
    description: 'Adjust and track your weekly study plan blocks',
  },
];

interface InteractiveCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveCommandPalette({ isOpen, onClose }: InteractiveCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      window.location.href = filtered[selectedIndex].href;
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(26,24,21,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--cream, #FDFDFB)',
          border: '1px solid var(--espresso, #1A1815)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Search input bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '0.5px solid rgba(0,0,0,0.12)',
          }}
        >
          <span style={{ fontSize: '16px', opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a topic, station, or guide (or navigate with ↑ ↓)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              fontFamily: serif,
              fontSize: '15px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: ink,
            }}
          />
          <kbd
            style={{
              fontFamily: serif,
              fontSize: '10px',
              padding: '3px 7px',
              border: '0.5px solid rgba(0,0,0,0.2)',
              borderRadius: '3px',
              color: muted,
              background: 'white',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: muted, fontFamily: serif, fontSize: '13px' }}>
              No matching clinical guides or tools found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    background: isSelected ? 'rgba(0,0,0,0.06)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontFamily: serif,
                          fontSize: '9px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          background:
                            item.category === 'Quiz'
                              ? '#C89BB0'
                              : item.category === 'OSCE'
                              ? '#8BBCAA'
                              : item.category === 'Guide'
                              ? '#D4A574'
                              : '#7BA7CC',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ fontFamily: serif, fontSize: '13.5px', color: ink, fontWeight: 500 }}>
                        {item.title}
                      </span>
                    </div>
                    <p style={{ fontFamily: serif, fontSize: '11.5px', color: muted, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: isSelected ? ink : muted }}>→</span>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--linen-light, #F5F3F0)',
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: serif,
            fontSize: '10.5px',
            color: muted,
          }}
        >
          <span>Use ↑ ↓ to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
