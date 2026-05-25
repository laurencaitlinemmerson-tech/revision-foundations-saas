'use client';

import { type CSSProperties } from 'react';

interface EditorialPickerProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function EditorialPicker<T extends string | number>({
  label, value, options, onChange,
}: EditorialPickerProps<T>) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 9.5,
        fontWeight: 500,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
      }}>{label}</span>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                background: 'transparent',
                border: 0,
                padding: '4px 0',
                cursor: 'pointer',
                position: 'relative',
                fontFamily: active ? "'Playfair Display', serif" : "'Inter', sans-serif",
                fontStyle: active ? 'italic' : 'normal',
                fontSize: active ? 18 : 13,
                fontWeight: 400,
                letterSpacing: active ? '-0.005em' : '0.04em',
                color: active ? 'var(--ink)' : 'var(--ink-mute)',
                lineHeight: 1,
                transition: 'color 240ms ease',
              } as CSSProperties}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-soft)'; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-mute)'; }}
              aria-pressed={active}
            >
              {opt.label}
              {active && (
                <span style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: -6,
                  height: 1, background: 'var(--ink)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
