'use client';

import { useMemo, useState } from 'react';
import type { Derived, DerivedDay } from '@/lib/operator/fitness/derive';
import type { OperatorSettings } from '@/lib/operator/types';
import { ColumnChart } from '../components/charts';
import { fmtDate, fmtDuration, fmtLongDate, fmtNumber, fmtSigned } from '../components/format';
import { Card, Note, Section, TableView } from '../components/ui';

/* The four components of expenditure, in fixed categorical order. */
const LEDGER = [
  { key: 'bmr', label: 'BMR', color: 'var(--series-1)', note: 'Mifflin–St Jeor' },
  { key: 'neat', label: 'NEAT', color: 'var(--series-2)', note: 'estimated' },
  { key: 'exercise', label: 'Exercise', color: 'var(--series-3)', note: 'from Health' },
  { key: 'tef', label: 'Food thermogenesis', color: 'var(--series-4)', note: 'from intake' },
] as const;

export default function Energy({
  data,
  settings,
}: {
  data: Derived;
  settings: OperatorSettings;
}) {
  const balanceDays = useMemo(() => data.days.slice(-30), [data.days]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selected: DerivedDay | null =
    balanceDays.find((day) => day.date === selectedKey) ??
    balanceDays[balanceDays.length - 1] ??
    null;

  const selectedIndex = selected ? balanceDays.findIndex((day) => day.date === selected.date) : -1;

  const { tdee } = data;
  const amounts: Record<string, number> = {
    bmr: tdee.bmr,
    neat: tdee.neat,
    exercise: tdee.exercise,
    tef: tdee.tef,
  };
  const maxComponent = Math.max(...Object.values(amounts));

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
        color: 'var(--series-4)',
      },
      {
        label: day.deltaKcal !== null && day.deltaKcal < 0 ? 'Surplus' : 'Deficit',
        value: day.deltaKcal === null ? '—' : `${fmtNumber(Math.abs(day.deltaKcal))} kcal`,
      },
    ],
  }));

  const loggedDeltas = balanceDays
    .map((day) => day.deltaKcal)
    .filter((value): value is number => value !== null);
  const cumulative = loggedDeltas.reduce((acc, value) => acc + value, 0);
  const impliedKg = cumulative / 7700;

  return (
    <Section
      kicker="Energy"
      title="What the body is actually spending"
      note="Expenditure is assembled from real signals rather than a flat activity multiplier: measured basal rate, an estimated non-exercise component, active energy straight from Health, and the thermic cost of the food itself."
    >
      <div className="op-grid op-grid-2">
        <Card
          title="Expenditure breakdown"
          sub={`Seven-day basis · ${tdee.exerciseSource === 'measured' ? 'exercise measured from Health' : 'exercise estimated from a planned week'}`}
        >
          <div className="op-ledger">
            {LEDGER.map((row) => (
              <div className="op-ledger-row" key={row.key}>
                <span className="op-ledger-key">
                  <span className="op-swatch" style={{ background: row.color }} />
                  {row.label}
                </span>
                <span className="op-ledger-track">
                  <span
                    className="op-ledger-fill"
                    style={{
                      width: `${(amounts[row.key] / maxComponent) * 100}%`,
                      background: row.color,
                    }}
                  />
                </span>
                <span className="op-ledger-value">{fmtNumber(amounts[row.key])}</span>
              </div>
            ))}

            <div
              className="op-ledger-row"
              style={{ paddingTop: 12, borderTop: '1px solid var(--hairline)' }}
            >
              <span className="op-ledger-key" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                Total expenditure
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {Math.round(tdee.confidence * 100)}% from measured signal
              </span>
              <span className="op-ledger-value">{fmtNumber(tdee.tdee)}</span>
            </div>

            <div className="op-ledger-row">
              <span className="op-ledger-key" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                Intake target
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {fmtNumber(tdee.dailyDelta)} kcal/day deficit → {fmtNumber(settings.weeklyChangeKg, 2)}{' '}
                kg/wk
              </span>
              <span className="op-ledger-value">{fmtNumber(tdee.targetIntake)}</span>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <TableView
              caption="Modelled daily energy expenditure, kcal"
              columns={['Component', 'kcal', 'Share']}
              rows={[
                ...LEDGER.map((row) => [
                  row.label,
                  fmtNumber(amounts[row.key]),
                  `${Math.round((amounts[row.key] / tdee.tdee) * 100)}%`,
                ]),
                ['Total', fmtNumber(tdee.tdee), '100%'],
              ]}
            />
          </div>
        </Card>

        <Card
          title="Reality check"
          sub="Expenditure implied by the weight actually lost against the food actually logged"
        >
          {data.reality ? (
            <>
              <div className="op-stat-value" style={{ fontSize: 40, marginTop: 4 }}>
                {fmtNumber(data.reality.realTdee)}
                <small>kcal/day</small>
              </div>
              <p className="op-card-sub" style={{ marginTop: 8 }}>
                Modelled figure is {fmtNumber(tdee.tdee)} kcal — a gap of{' '}
                {fmtSigned(data.reality.realTdee - tdee.tdee, 0, ' kcal')}.
              </p>
              <Note tone={data.reality.reliable ? 'good' : 'warning'}>
                {data.reality.reliable ? (
                  <>
                    <strong>Reliable window.</strong> Enough days and enough logging for the
                    back-calculated figure to be worth trusting over the model. Where they disagree,
                    follow this one.
                  </>
                ) : (
                  <>
                    <strong>Thin evidence.</strong> Needs at least fourteen days with food logged on
                    most of them before this beats the model. Treat it as a hint, not a target.
                  </>
                )}
              </Note>
            </>
          ) : (
            <p className="op-empty">
              Needs at least a fortnight of weigh-ins and logged food in the selected range.
            </p>
          )}

          <div className="op-grid op-grid-2" style={{ marginTop: 16 }}>
            <div>
              <div className="op-stat-label">Mean intake</div>
              <div className="op-stat-value" style={{ fontSize: 22 }}>
                {fmtNumber(data.averages.intakeKcal)}
                <small>kcal</small>
              </div>
            </div>
            <div>
              <div className="op-stat-label">Mean daily deficit</div>
              <div className="op-stat-value" style={{ fontSize: 22 }}>
                {data.averages.deltaKcal === null ? '—' : fmtSigned(data.averages.deltaKcal, 0)}
                <small>kcal</small>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }} />

      <Card
        title="Daily balance, last 30 days"
        sub="Above the line is a deficit, below it a surplus. Select a column for the full day."
      >
        <div style={{ marginTop: 12 }}>
          <ColumnChart
            data={columns}
            color="var(--diverge-cool)"
            negativeColor="var(--diverge-warm)"
            format={(value) => fmtNumber(value)}
            ariaLabel="Daily energy balance for the last thirty days, in kilocalories. Positive is a deficit."
            onSelect={setSelectedKey}
            selectedKey={selected?.date ?? null}
          />
        </div>

        <div className="op-legend">
          <span className="op-legend-item">
            <span className="op-swatch" style={{ background: 'var(--diverge-cool)' }} />
            Deficit
          </span>
          <span className="op-legend-item">
            <span className="op-swatch" style={{ background: 'var(--diverge-warm)' }} />
            Surplus
          </span>
        </div>

        <p className="op-card-sub" style={{ marginTop: 14, marginBottom: 0 }}>
          Cumulative balance across the window: <strong>{fmtSigned(cumulative, 0, ' kcal')}</strong>,
          which implies about <strong>{fmtSigned(-impliedKg, 2, ' kg')}</strong> of tissue —{' '}
          {data.rangeChangeKg === null
            ? 'no weigh-in span to compare against'
            : `the scale moved ${fmtSigned(data.rangeChangeKg, 1, ' kg')} over the selected range`}
          .
        </p>

        {selected ? (
          <div style={{ marginTop: 20 }}>
            <div className="op-inspector-head">
              <div>
                <div className="op-kicker">Day inspector</div>
                <strong style={{ fontSize: 15 }}>{fmtLongDate(selected.date)}</strong>
              </div>
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
                    setSelectedKey(
                      balanceDays[Math.min(balanceDays.length - 1, selectedIndex + 1)].date,
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>

            <dl className="op-inspector-grid">
              <div className="op-inspector-cell">
                <dt>Balance</dt>
                <dd>{selected.deltaKcal === null ? '—' : fmtSigned(selected.deltaKcal, 0)}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Intake</dt>
                <dd>{fmtNumber(selected.intakeKcal)}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Expenditure</dt>
                <dd>{fmtNumber(selected.expenditureKcal)}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Protein</dt>
                <dd>{selected.proteinG === null ? '—' : `${fmtNumber(selected.proteinG)}g`}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Carbs</dt>
                <dd>{selected.carbsG === null ? '—' : `${fmtNumber(selected.carbsG)}g`}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Fat</dt>
                <dd>{selected.fatG === null ? '—' : `${fmtNumber(selected.fatG)}g`}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Steps</dt>
                <dd>{fmtNumber(selected.steps)}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Sleep</dt>
                <dd>{fmtDuration(selected.sleepTotalMin)}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Weight</dt>
                <dd>{selected.weight === null ? '—' : `${fmtNumber(selected.weight, 1)}kg`}</dd>
              </div>
              <div className="op-inspector-cell">
                <dt>Training</dt>
                <dd style={{ fontSize: 14 }}>
                  {selected.workouts.length
                    ? selected.workouts.map((workout) => workout.type).join(', ')
                    : 'Rest'}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <TableView
            caption="Daily energy balance, most recent first"
            columns={['Date', 'Intake', 'Expenditure', 'Balance', 'Protein (g)']}
            rows={[...balanceDays].reverse().map((day) => [
              fmtLongDate(day.date),
              fmtNumber(day.intakeKcal),
              fmtNumber(day.expenditureKcal),
              day.deltaKcal === null ? '—' : fmtSigned(day.deltaKcal, 0),
              fmtNumber(day.proteinG),
            ])}
          />
        </div>
      </Card>
    </Section>
  );
}
