'use client';

import type { Derived } from '@/lib/operator/fitness/derive';
import { ColumnChart } from '../components/charts';
import { fmtDate, fmtDuration, fmtLongDate, fmtNumber } from '../components/format';
import { Card, Section, StatTile, TableView } from '../components/ui';

/* Fixed slot order — a training type keeps its colour whatever the range. */
const TYPE_COLORS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
];

export default function Training({ data }: { data: Derived }) {
  const { training } = data;

  const weeklyColumns = training.weekly.map((week) => ({
    key: week.weekStart,
    label: fmtDate(week.weekStart),
    value: week.minutes,
    tooltip: [
      { label: 'Minutes', value: fmtDuration(week.minutes), color: 'var(--series-1)' },
      { label: 'Sessions', value: String(week.sessions) },
    ],
  }));

  // Past five types the tail folds into "Other" rather than growing hues.
  const topTypes = training.byType.slice(0, 5);
  const otherTypes = training.byType.slice(5);
  const typeRows = otherTypes.length
    ? [
        ...topTypes,
        {
          type: 'Other',
          sessions: otherTypes.reduce((acc, item) => acc + item.sessions, 0),
          minutes: otherTypes.reduce((acc, item) => acc + item.minutes, 0),
          kcal: otherTypes.reduce((acc, item) => acc + item.kcal, 0),
        },
      ]
    : topTypes;

  const maxSessions = Math.max(1, ...typeRows.map((row) => row.sessions));

  return (
    <Section
      kicker="Training"
      title="What the work looks like"
      note="Sessions are what protects lean mass through a deficit. Consistency across weeks matters more here than any single hard session."
    >
      <div className="op-grid op-grid-4">
        <StatTile label="Sessions" value={String(training.sessions)} foot="In the selected range" />
        <StatTile
          label="Per week"
          value={training.sessionsPerWeek.toFixed(1)}
          foot="Averaged across the range"
        />
        <StatTile label="Time under load" value={fmtDuration(training.minutes)} foot="Total logged" />
        <StatTile
          label="Session energy"
          value={fmtNumber(training.kcal)}
          unit="kcal"
          foot="Already inside the expenditure model"
        />
      </div>

      <div style={{ marginTop: 16 }} />

      <div className="op-grid op-grid-2">
        <Card title="Weekly volume" sub="Minutes trained per week, Monday-anchored">
          {weeklyColumns.length ? (
            <>
              <ColumnChart
                data={weeklyColumns}
                color="var(--series-1)"
                format={(value) => fmtNumber(value)}
                ariaLabel="Minutes trained per week across the selected range."
              />
              <div style={{ marginTop: 14 }}>
                <TableView
                  caption="Training minutes per week"
                  columns={['Week beginning', 'Sessions', 'Minutes']}
                  rows={[...training.weekly]
                    .reverse()
                    .map((week) => [fmtLongDate(week.weekStart), week.sessions, week.minutes])}
                />
              </div>
            </>
          ) : (
            <p className="op-empty">No sessions logged in this range.</p>
          )}
        </Card>

        <Card title="Split by type" sub="Sessions per discipline">
          {typeRows.length ? (
            <>
              <div className="op-ledger">
                {typeRows.map((row, index) => (
                  <div className="op-ledger-row" key={row.type}>
                    <span className="op-ledger-key">
                      <span
                        className="op-swatch"
                        style={{ background: TYPE_COLORS[index] ?? 'var(--axis)' }}
                      />
                      {row.type}
                    </span>
                    <span className="op-ledger-track">
                      <span
                        className="op-ledger-fill"
                        style={{
                          width: `${(row.sessions / maxSessions) * 100}%`,
                          background: TYPE_COLORS[index] ?? 'var(--axis)',
                        }}
                      />
                    </span>
                    <span className="op-ledger-value">{row.sessions}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <TableView
                  caption="Training by type"
                  columns={['Type', 'Sessions', 'Minutes', 'kcal']}
                  rows={typeRows.map((row) => [row.type, row.sessions, row.minutes, row.kcal])}
                />
              </div>
            </>
          ) : (
            <p className="op-empty">No sessions logged in this range.</p>
          )}
        </Card>
      </div>

      {training.recent.length ? (
        <div style={{ marginTop: 16 }}>
          <Card title="Recent sessions" sub="Most recent first">
            <div className="op-sessions">
              {training.recent.map((workout) => {
                const typeIndex = typeRows.findIndex((row) => row.type === workout.type);
                return (
                  <div className="op-session" key={workout.id}>
                    <div>
                      <div className="op-session-type">
                        <span
                          className="op-swatch"
                          style={{ background: TYPE_COLORS[typeIndex] ?? 'var(--axis)' }}
                        />
                        {workout.type}
                      </div>
                      <div className="op-session-meta">{fmtLongDate(workout.startedAt)}</div>
                    </div>
                    <div className="op-session-stats">
                      <div>{fmtDuration(workout.durationMin)}</div>
                      <div className="op-session-meta">
                        {workout.energyKcal === null ? '—' : `${fmtNumber(workout.energyKcal)} kcal`}
                        {workout.avgHr ? ` · ${workout.avgHr} bpm avg` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ) : null}
    </Section>
  );
}
