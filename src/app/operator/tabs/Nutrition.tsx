'use client';

import { useMemo, useState } from 'react';
import { ColumnChart } from '../components/charts';
import { fmtDate, fmtLongDate, fmtNumber } from '../components/format';
import { Bar, Card, TableView } from '../components/ui';
import { isoDay } from '@/lib/operator/fitness/derive';
import type { TabProps } from './types';

/* Quick-add sizes, so a rough log takes one tap rather than a form. */
const QUICK = [
  { label: 'Snack', kcal: 150, protein: 5 },
  { label: 'Light meal', kcal: 400, protein: 25 },
  { label: 'Full meal', kcal: 650, protein: 40 },
  { label: 'Protein shake', kcal: 160, protein: 30 },
];

export default function Nutrition({ data, settings, logger }: TabProps) {
  const today = data.today;
  const date = today?.date ?? isoDay(new Date());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const balanceDays = useMemo(() => data.days.slice(-30), [data.days]);
  const selected =
    balanceDays.find((d) => d.date === selectedKey) ?? balanceDays[balanceDays.length - 1] ?? null;
  const selectedIndex = selected ? balanceDays.findIndex((d) => d.date === selected.date) : -1;

  const intake = today?.intakeKcal ?? 0;
  const protein = today?.proteinG ?? 0;
  const carbs = today?.carbsG ?? 0;
  const fat = today?.fatG ?? 0;

  const macros = [
    { key: 'protein', label: 'Protein', value: protein, target: settings.proteinTargetG, unit: 'g', color: 'var(--series-1)' },
    { key: 'carbs', label: 'Carbs', value: carbs, target: Math.round((data.tdee.targetIntake * 0.4) / 4), unit: 'g', color: 'var(--series-2)' },
    { key: 'fat', label: 'Fat', value: fat, target: Math.round((data.tdee.targetIntake * 0.3) / 9), unit: 'g', color: 'var(--series-3)' },
  ];

  const columns = balanceDays.map((day) => ({
    key: day.date,
    label: fmtDate(day.date),
    value: day.deltaKcal === null ? null : Math.round(day.deltaKcal),
    tooltip: [
      {
        label: 'Expenditure',
        value: day.expenditureKcal === null ? '—' : `${fmtNumber(day.expenditureKcal)} kcal`,
        color: 'var(--series-1)',
      },
      {
        label: 'Intake',
        value: day.intakeKcal === null ? 'not logged' : `${fmtNumber(day.intakeKcal)} kcal`,
        color: 'var(--series-2)',
      },
      {
        label: day.deltaKcal !== null && day.deltaKcal < 0 ? 'Surplus' : 'Deficit',
        value: day.deltaKcal === null ? '—' : `${fmtNumber(Math.abs(day.deltaKcal))} kcal`,
      },
    ],
  }));

  const cumulative = balanceDays
    .map((d) => d.deltaKcal)
    .filter((v): v is number => v !== null)
    .reduce((acc, v) => acc + v, 0);

  return (
    <div className="op-stack">
      <div className="op-grid op-grid-2">
        <Card title="Macros today" sub={`${fmtNumber(intake)} of ${fmtNumber(data.tdee.targetIntake)} kcal logged`}>
          {macros.map((m) => (
            <div key={m.key} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 12.5 }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)' }}>
                  {fmtNumber(m.value)} / {fmtNumber(m.target)} {m.unit}
                </span>
              </div>
              <Bar value={m.value} target={m.target} color={m.color} label={`${m.label} against target`} />
            </div>
          ))}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--hairline)' }}>
            <div className="op-field-label">Quick add</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="op-btn"
                  disabled={logger.busy}
                  onClick={() =>
                    logger.saveDay(date, {
                      dietaryEnergyKcal: intake + item.kcal,
                      proteinG: protein + item.protein,
                    })
                  }
                >
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>
                    +{item.kcal} · {item.protein}g
                  </span>
                </button>
              ))}
            </div>
            <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--muted)' }}>
              Rough is fine — these write straight to today&apos;s row and MyFitnessPal overwrites
              them on the next Health sync if you log properly there.
            </p>
          </div>
        </Card>

        <Card
          title="Daily balance"
          sub="Above the line is a deficit, below it a surplus. Select a column for the full day."
        >
          <ColumnChart
            data={columns}
            color="var(--series-1)"
            negativeColor="var(--series-2)"
            ariaLabel="Daily energy balance for the last thirty days, in kilocalories. Positive is a deficit."
            onSelect={setSelectedKey}
            selectedKey={selected?.date ?? null}
          />

          <div className="op-legend">
            <span className="op-legend-item">
              <span className="op-swatch" style={{ background: 'var(--series-1)' }} />
              Deficit
            </span>
            <span className="op-legend-item">
              <span className="op-swatch" style={{ background: 'var(--series-2)' }} />
              Surplus
            </span>
          </div>

          <p className="op-note" style={{ marginTop: 14, fontSize: 12.5 }}>
            Cumulative balance across the window: <strong>{fmtNumber(cumulative)} kcal</strong>, which
            implies about <strong>{fmtNumber(cumulative / 7700, 2)} kg</strong> of tissue.
          </p>
        </Card>
      </div>

      {selected ? (
        <Card
          title={fmtLongDate(selected.date)}
          sub="Everything logged for the selected day."
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="op-btn"
                aria-label="Previous day"
                disabled={selectedIndex <= 0}
                onClick={() => setSelectedKey(balanceDays[Math.max(0, selectedIndex - 1)].date)}
              >
                ←
              </button>
              <button
                type="button"
                className="op-btn"
                aria-label="Next day"
                disabled={selectedIndex >= balanceDays.length - 1}
                onClick={() =>
                  setSelectedKey(balanceDays[Math.min(balanceDays.length - 1, selectedIndex + 1)].date)
                }
              >
                →
              </button>
            </div>
          }
        >
          <div className="op-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(116px, 1fr))', gap: 14 }}>
            {[
              { label: 'Balance', value: selected.deltaKcal === null ? '—' : fmtNumber(selected.deltaKcal) },
              { label: 'Intake', value: fmtNumber(selected.intakeKcal) },
              { label: 'Expenditure', value: fmtNumber(selected.expenditureKcal) },
              { label: 'Protein', value: selected.proteinG === null ? '—' : `${fmtNumber(selected.proteinG)}g` },
              { label: 'Carbs', value: selected.carbsG === null ? '—' : `${fmtNumber(selected.carbsG)}g` },
              { label: 'Fat', value: selected.fatG === null ? '—' : `${fmtNumber(selected.fatG)}g` },
              { label: 'Fibre', value: selected.fiberG === null ? '—' : `${fmtNumber(selected.fiberG)}g` },
              { label: 'Water', value: selected.waterMl === null ? '—' : `${(selected.waterMl / 1000).toFixed(1)}L` },
            ].map((cell) => (
              <div
                key={cell.label}
                style={{
                  padding: '14px 16px',
                  borderRadius: 18,
                  background: 'var(--card-soft)',
                  border: '0.5px solid var(--line-violet)',
                }}
              >
                <div className="op-field-label">{cell.label}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    color: 'var(--ink)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {cell.value}
                </div>
              </div>
            ))}
          </div>

          <TableView
            caption="Daily energy balance, most recent first"
            columns={['Date', 'Intake', 'Expenditure', 'Balance', 'Protein (g)']}
            rows={[...balanceDays].reverse().map((day) => [
              fmtLongDate(day.date),
              fmtNumber(day.intakeKcal),
              fmtNumber(day.expenditureKcal),
              day.deltaKcal === null ? '—' : fmtNumber(day.deltaKcal),
              fmtNumber(day.proteinG),
            ])}
          />
        </Card>
      ) : null}
    </div>
  );
}
