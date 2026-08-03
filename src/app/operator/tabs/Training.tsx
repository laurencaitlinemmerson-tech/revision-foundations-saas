'use client';

import { ColumnChart } from '../components/charts';
import { fmtDate, fmtDuration, fmtLongDate, fmtNumber } from '../components/format';
import { Bar, Card, TableView } from '../components/ui';
import type { TabProps } from './types';

/* Fixed slot order — a training type keeps its colour whatever the range. */
const TYPE_COLORS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
];

export default function Training({ data }: TabProps) {
  const { training } = data;

  const weekly = training.weekly.map((week) => ({
    key: week.weekStart,
    label: fmtDate(week.weekStart),
    value: week.minutes,
    tooltip: [
      { label: 'Minutes', value: fmtDuration(week.minutes), color: 'var(--series-1)' },
      { label: 'Sessions', value: String(week.sessions) },
    ],
  }));

  // Past five types the tail folds into "Other" rather than growing hues.
  const top = training.byType.slice(0, 5);
  const rest = training.byType.slice(5);
  const typeRows = rest.length
    ? [
        ...top,
        {
          type: 'Other',
          sessions: rest.reduce((a, r) => a + r.sessions, 0),
          minutes: rest.reduce((a, r) => a + r.minutes, 0),
          kcal: rest.reduce((a, r) => a + r.kcal, 0),
        },
      ]
    : top;

  const maxSessions = Math.max(1, ...typeRows.map((r) => r.sessions));

  const stats = [
    { label: 'Sessions', value: String(training.sessions), note: 'in the selected range' },
    { label: 'Per week', value: training.sessionsPerWeek.toFixed(1), note: 'averaged' },
    { label: 'Time under load', value: fmtDuration(training.minutes), note: 'total logged' },
    { label: 'Session energy', value: `${fmtNumber(training.kcal)}`, note: 'kcal, already in the model' },
  ];

  return (
    <div className="op-stack">
      <div className="op-grid op-grid-4">
        {stats.map((s) => (
          <div key={s.label} className="op-kpi">
            <div className="op-kpi-label">{s.label}</div>
            <div className="op-kpi-value" style={{ marginTop: 12 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className="op-grid op-grid-2">
        <Card title="Weekly volume" sub="Minutes trained per week, Monday-anchored.">
          {weekly.length ? (
            <>
              <ColumnChart
                data={weekly}
                color="var(--series-1)"
                ariaLabel="Minutes trained per week across the selected range."
              />
              <TableView
                caption="Training minutes per week"
                columns={['Week beginning', 'Sessions', 'Minutes']}
                rows={[...training.weekly]
                  .reverse()
                  .map((w) => [fmtLongDate(w.weekStart), w.sessions, w.minutes])}
              />
            </>
          ) : (
            <p className="op-empty">No sessions logged in this range.</p>
          )}
        </Card>

        <Card title="Split by type" sub="Sessions per discipline.">
          {typeRows.length ? (
            <>
              {typeRows.map((row, index) => (
                <div key={row.type} className="op-rowline">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span className="op-swatch" style={{ background: TYPE_COLORS[index] ?? 'var(--axis)' }} />
                    {row.type}
                  </span>
                  <Bar
                    value={row.sessions}
                    target={maxSessions}
                    color={TYPE_COLORS[index] ?? 'var(--axis)'}
                    label={`${row.type} sessions`}
                  />
                  <b>{row.sessions}</b>
                </div>
              ))}
              <TableView
                caption="Training by type"
                columns={['Type', 'Sessions', 'Minutes', 'kcal']}
                rows={typeRows.map((r) => [r.type, r.sessions, r.minutes, r.kcal])}
              />
            </>
          ) : (
            <p className="op-empty">No sessions logged in this range.</p>
          )}
        </Card>
      </div>

      {training.recent.length ? (
        <Card title="Recent sessions" sub="Most recent first.">
          {training.recent.map((workout) => {
            const index = typeRows.findIndex((r) => r.type === workout.type);
            return (
              <div
                key={workout.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: 12,
                  padding: '13px 0',
                  borderTop: '0.5px solid var(--hairline)',
                  alignItems: 'center',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontSize: 13.5 }}>
                    <span className="op-swatch" style={{ background: TYPE_COLORS[index] ?? 'var(--axis)' }} />
                    {workout.type}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                    {fmtLongDate(workout.startedAt)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <div style={{ fontSize: 13, color: 'var(--ink)' }}>{fmtDuration(workout.durationMin)}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {workout.energyKcal === null ? '—' : `${fmtNumber(workout.energyKcal)} kcal`}
                    {workout.avgHr ? ` · ${workout.avgHr} bpm` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      ) : null}
    </div>
  );
}
