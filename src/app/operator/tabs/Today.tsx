'use client';

import { useState } from 'react';
import { Rings } from '../components/charts';
import { fmtDuration, fmtNumber, fromUnit, toUnit } from '../components/format';
import { Bar, Card } from '../components/ui';
import { isoDay } from '@/lib/operator/fitness/derive';
import type { TabProps } from './types';

const GLASS_ML = 250;

export default function Today({ data, settings, unit, logger }: TabProps) {
  const today = data.today;
  const date = today?.date ?? isoDay(new Date());

  const [focus, setFocus] = useState('calories');
  const [draft, setDraft] = useState('');

  const intake = today?.intakeKcal ?? 0;
  const protein = today?.proteinG ?? 0;
  const steps = today?.steps ?? 0;
  const waterMl = today?.waterMl ?? 0;

  const rings = [
    { key: 'calories', label: 'CALORIES', color: 'var(--series-1)', value: intake, target: data.tdee.targetIntake },
    { key: 'protein', label: 'PROTEIN', color: 'var(--series-2)', value: protein, target: settings.proteinTargetG },
    { key: 'steps', label: 'STEPS', color: 'var(--series-3)', value: steps, target: settings.stepTarget },
  ];

  const ringDetail: Record<string, string> = {
    calories: `${fmtNumber(intake)} of ${fmtNumber(data.tdee.targetIntake)} kcal`,
    protein: `${fmtNumber(protein)} of ${fmtNumber(settings.proteinTargetG)} g`,
    steps: `${fmtNumber(steps)} of ${fmtNumber(settings.stepTarget)}`,
  };

  const step = (key: string, direction: 1 | -1) => {
    if (key === 'calories') {
      return logger.saveDay(date, { dietaryEnergyKcal: Math.max(0, intake + direction * 100) });
    }
    if (key === 'protein') {
      return logger.saveDay(date, { proteinG: Math.max(0, protein + direction * 10) });
    }
    return logger.saveDay(date, { steps: Math.max(0, steps + direction * 500) });
  };

  const glasses = Math.round(settings.waterTargetMl / GLASS_ML);
  const filled = Math.round(waterMl / GLASS_ML);

  const saveWeight = () => {
    const entered = Number(draft);
    if (!Number.isFinite(entered) || entered <= 0) return;
    // The input is in whatever unit is on screen; storage is always kg.
    const kg = fromUnit(entered, unit);
    if (kg < 35 || kg > 300) return;
    logger.saveWeight(isoDay(new Date()), Number(kg.toFixed(2))).then((ok) => {
      if (ok) setDraft('');
    });
  };

  return (
    <div className="op-grid op-grid-wide" style={{ alignItems: 'start' }}>
      <Card title="Today's targets" sub="Tap a ring to focus it; the buttons log in small steps.">
        <div className="op-rings-layout">
          <Rings rings={rings} focusKey={focus} onFocus={setFocus} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
            {rings.map((ring) => (
              <div key={ring.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="op-ring-row"
                  aria-pressed={focus === ring.key}
                  onClick={() => setFocus(ring.key)}
                >
                  <span className="op-ring-dot" style={{ background: ring.color }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink)' }}>
                      {ring.label.charAt(0) + ring.label.slice(1).toLowerCase()}
                    </span>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                      {ringDetail[ring.key]}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="op-step"
                  aria-label={`Subtract from ${ring.label.toLowerCase()}`}
                  disabled={logger.busy}
                  onClick={() => step(ring.key, -1)}
                >
                  −
                </button>
                <button
                  type="button"
                  className="op-step"
                  aria-label={`Add to ${ring.label.toLowerCase()}`}
                  disabled={logger.busy}
                  onClick={() => step(ring.key, 1)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '0.5px solid var(--hairline)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: 'var(--muted)' }}>Running balance</span>
            <span style={{ color: 'var(--ink)' }}>
              {today?.deltaKcal == null
                ? 'not enough logged'
                : today.deltaKcal > 0
                  ? `${fmtNumber(today.deltaKcal)} kcal deficit`
                  : `${fmtNumber(Math.abs(today.deltaKcal))} kcal surplus`}
            </span>
          </div>
          <Bar value={intake} target={data.tdee.targetIntake} label="Intake against target" />
        </div>
      </Card>

      <div className="op-stack">
        <Card title="Water" sub={`${(waterMl / 1000).toFixed(1)} L of ${(settings.waterTargetMl / 1000).toFixed(1)} L · tap a glass`}>
          <div className="op-glasses">
            {Array.from({ length: glasses }, (_, index) => (
              <button
                key={index}
                type="button"
                className="op-glass"
                aria-pressed={index < filled}
                aria-label={`${index + 1} glasses`}
                disabled={logger.busy}
                onClick={() => {
                  // Tapping the last filled glass empties it; anything else
                  // fills up to that glass.
                  const next = index + 1 === filled ? index : index + 1;
                  logger.saveDay(date, { waterMl: next * GLASS_ML });
                }}
              />
            ))}
          </div>
        </Card>

        <Card title="Log a weigh-in" sub="Saves against today, replacing any earlier reading.">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="op-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') saveWeight();
              }}
              placeholder={fmtNumber(toUnit(data.latest?.weight ?? null, unit), 1)}
              inputMode="decimal"
              aria-label={`Weight in ${unit}`}
            />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{unit}</span>
            <button
              type="button"
              className="op-btn"
              data-variant="solid"
              onClick={saveWeight}
              disabled={logger.busy || !draft}
            >
              Save →
            </button>
          </div>
          <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--muted)' }}>
            {data.latest
              ? `Last logged ${fmtNumber(toUnit(data.latest.weight, unit), 1)} ${unit} on ${data.latest.date}.`
              : 'Nothing logged yet.'}
          </p>
        </Card>

        <Card soft title="Today's plan">
          <p className="op-note">
            {today?.workouts.length
              ? `${today.workouts.map((w) => w.type).join(', ')} logged — ${fmtDuration(
                  today.workouts.reduce((acc, w) => acc + (w.durationMin ?? 0), 0),
                )}.`
              : 'No session logged yet today.'}
          </p>
          <p className="op-note" style={{ marginTop: 8, color: 'var(--muted)', fontSize: 12.5 }}>
            {data.recovery.restingHr !== null
              ? `Resting heart rate ${fmtNumber(data.recovery.restingHr)} bpm, HRV ${fmtNumber(
                  data.recovery.hrv,
                )} ms across the last fortnight.`
              : 'No recovery data synced yet.'}
          </p>
        </Card>
      </div>
    </div>
  );
}
