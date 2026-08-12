'use client';

import { useState } from 'react';
import { Card, FieldLabel } from '../../components/ui';
import type { SectionProps } from './types';

/* The wedding's own facts. Saved on blur rather than per keystroke, so
   typing a venue name isn't one request per letter. */
export default function Details({ snapshot, writer }: SectionProps) {
  const { settings } = snapshot;
  const [draft, setDraft] = useState({
    brideName: settings.brideName,
    partnerName: settings.partnerName,
    weddingDate: settings.weddingDate ?? '',
    venue: settings.venue,
    henDate: settings.henDate ?? '',
    henLocation: settings.henLocation,
    budgetCap: settings.budgetCap === null ? '' : String(settings.budgetCap),
  });

  const commit = (field: keyof typeof draft) => {
    const value = draft[field];

    if (field === 'budgetCap') {
      const parsed = value === '' ? null : Number(value);
      if (parsed !== null && (!Number.isFinite(parsed) || parsed < 0)) return;
      if (parsed === settings.budgetCap) return;
      writer.save('settings', { budgetCap: parsed });
      return;
    }

    if (field === 'weddingDate' || field === 'henDate') {
      const next = value === '' ? null : value;
      if (next === (settings[field] ?? null)) return;
      writer.save('settings', { [field]: next });
      return;
    }

    if (value === settings[field]) return;
    writer.save('settings', { [field]: value });
  };

  const set = (field: keyof typeof draft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const fields: {
    key: keyof typeof draft;
    label: string;
    type?: string;
    placeholder?: string;
  }[] = [
    { key: 'brideName', label: 'Bride', placeholder: 'Her name' },
    { key: 'partnerName', label: 'Partner', placeholder: 'Their name' },
    { key: 'weddingDate', label: 'Wedding date', type: 'date' },
    { key: 'venue', label: 'Venue', placeholder: 'Where it is' },
    { key: 'henDate', label: 'Hen do date', type: 'date' },
    { key: 'henLocation', label: 'Hen do location', placeholder: 'Where you are going' },
    { key: 'budgetCap', label: `Your budget (${settings.currency})`, placeholder: 'optional' },
  ];

  return (
    <div className="op-stack">
      <Card
        title="The details"
        sub="Everything else on this page reads from here. Changes save when you click away."
      >
        <div className="op-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {fields.map((field) => (
            <div key={field.key}>
              <FieldLabel>{field.label}</FieldLabel>
              <input
                className="op-input"
                style={{
                  fontSize: field.type === 'date' ? 13 : 16,
                  fontFamily: field.type === 'date' ? 'var(--font-ui)' : 'var(--font-display)',
                }}
                type={field.type ?? 'text'}
                inputMode={field.key === 'budgetCap' ? 'decimal' : undefined}
                placeholder={field.placeholder}
                value={draft[field.key]}
                onChange={(event) => set(field.key, event.target.value)}
                onBlur={() => commit(field.key)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
                aria-label={field.label}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card soft title="How this hub works">
        <p className="op-note">
          Everything here is private to this link — the same gate as the fitness dashboard, never
          indexed, no login. Tasks, people and costs all save to Supabase as you edit them.
        </p>
        <p className="op-note" style={{ marginTop: 10, color: 'var(--muted)', fontSize: 12.5 }}>
          Tick <strong>hen</strong> on a task or cost to have it appear in the Hen do tab, and mark
          bridal party members as attending in the People tab to build the guest list and per-head
          split.
        </p>
      </Card>
    </div>
  );
}
