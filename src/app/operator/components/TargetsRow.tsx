'use client';

import { useState } from 'react';
import type { OperatorSettings } from '@/lib/operator/types';
import { fmtNumber, fromUnit, toUnit, type Unit } from './format';
import type { Logger } from '../tabs/types';

/**
 * Inline quick-edit for the four numbers that drive everything else on
 * the dashboard. Toggled from the hero — mirrors the mockup's
 * always-visible targets strip, but folded behind "Edit targets" so
 * the default view stays uncluttered.
 */
export default function TargetsRow({
  settings,
  unit,
  logger,
  targetIntake,
}: {
  settings: OperatorSettings;
  unit: Unit;
  logger: Logger;
  targetIntake: number;
}) {
  const [goal, setGoal] = useState(String(fmtNumber(toUnit(settings.targetWeightKg, unit), 1)));
  const [protein, setProtein] = useState(String(settings.proteinTargetG));
  const [rate, setRate] = useState(String(fmtNumber(toUnit(settings.weeklyChangeKg, unit), 2)));

  const commit = (field: string, raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;

    if (field === 'goal') {
      const kg = fromUnit(value, unit);
      if (kg >= 35 && kg <= 300) logger.saveSettings({ targetWeightKg: Number(kg.toFixed(2)) });
      return;
    }
    if (field === 'protein') {
      if (value >= 0 && value <= 500) logger.saveSettings({ proteinTargetG: value });
      return;
    }
    if (field === 'rate') {
      const kgPerWeek = fromUnit(value, unit);
      if (kgPerWeek >= -2 && kgPerWeek <= 2) logger.saveSettings({ weeklyChangeKg: Number(kgPerWeek.toFixed(3)) });
    }
    // "Daily calories" is read-only here — it is derived from the TDEE
    // model, not a stored field — so it has no commit path.
  };

  const fields: {
    key: string;
    label: string;
    value: string;
    set: (value: string) => void;
    unit: string;
    step: number;
    readOnly?: boolean;
    hint?: string;
  }[] = [
    { key: 'goal', label: 'Goal weight', value: goal, set: setGoal, unit, step: unit === 'kg' ? 0.5 : 1 },
    {
      key: 'calories',
      label: 'Daily calories',
      value: String(targetIntake),
      set: () => {},
      unit: 'kcal',
      step: 20,
      readOnly: true,
      hint: 'derived from TDEE — see Plan',
    },
    { key: 'protein', label: 'Protein target', value: protein, set: setProtein, unit: 'g', step: 5 },
    { key: 'rate', label: 'Weekly rate', value: rate, set: setRate, unit, step: unit === 'kg' ? 0.05 : 0.1 },
  ];

  return (
    <div
      className="op-card"
      style={{ marginBottom: 16, padding: '22px 26px' }}
    >
      <div className="op-grid op-grid-4">
        {fields.map((field) => (
          <div key={field.key}>
            <div className="op-field-label">{field.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
              <input
                className="op-input"
                style={{ fontSize: 18, width: 'auto', flex: 1, minWidth: 0 }}
                type="number"
                step={field.step}
                value={field.value}
                readOnly={field.readOnly}
                disabled={logger.busy}
                onChange={(event) => field.set(event.target.value)}
                onBlur={(event) => !field.readOnly && commit(field.key, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !field.readOnly) commit(field.key, field.value);
                }}
                aria-label={field.label}
              />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{field.unit}</span>
            </div>
            {field.hint ? (
              <div style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 6 }}>{field.hint}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
