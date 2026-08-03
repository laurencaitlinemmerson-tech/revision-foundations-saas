'use client';

import { StackedColumnChart } from '../components/charts';
import { fmtDate, fmtDuration, fmtLongDate, fmtNumber } from '../components/format';
import { Card, Chip, TableView } from '../components/ui';
import type { TabProps } from './types';

const SLEEP_SERIES = [
  { key: 'deep', label: 'Deep', color: 'var(--series-1)' },
  { key: 'rem', label: 'REM', color: 'var(--series-2)' },
  { key: 'core', label: 'Core', color: 'var(--series-3)' },
];

export default function Habits({ data, settings }: TabProps) {
  const { recovery, streaks } = data;

  // Eight weeks of activity, most recent week last.
  const tail = data.days.slice(-56);
  const weeks: { label: string; days: { tone: string; title: string }[] }[] = [];
  for (let i = 0; i < tail.length; i += 7) {
    const chunk = tail.slice(i, i + 7);
    if (!chunk.length) continue;
    weeks.push({
      label: fmtDate(chunk[0].date),
      days: chunk.map((day) => {
        const trained = day.workouts.length > 0;
        const logged = day.intakeKcal !== null || day.weight !== null;
        return {
          tone: trained ? 'var(--series-1)' : logged ? 'var(--lilac)' : 'var(--track)',
          title: `${fmtLongDate(day.date)} — ${
            trained ? 'session + logged' : logged ? 'logged' : 'nothing logged'
          }`,
        };
      }),
    });
  }

  const nights = data.days.slice(-21).filter((d) => d.sleepTotalMin !== null);
  // Plotted in hours so the axis ticks land on whole hours rather than
  // the ragged 0h / 3h / 7h that minute-based steps produce.
  const sleepColumns = nights.map((day) => {
    const deep = day.sleepDeepMin ?? 0;
    const rem = day.sleepRemMin ?? 0;
    const core = Math.max(0, (day.sleepTotalMin ?? 0) - deep - rem);
    return {
      key: day.date,
      label: fmtDate(day.date),
      values: { deep: deep / 60, rem: rem / 60, core: core / 60 },
    };
  });

  const streakCards = [
    { label: 'Logging', current: streaks.logging.current, best: streaks.logging.best },
    { label: 'Protein target', current: streaks.protein.current, best: streaks.protein.best },
    { label: 'Step target', current: streaks.steps.current, best: streaks.steps.best },
    { label: 'In a deficit', current: streaks.deficit.current, best: streaks.deficit.best },
  ];

  return (
    <div className="op-stack">
      <div className="op-grid op-grid-4">
        {streakCards.map((s) => (
          <div key={s.label} className="op-kpi">
            <div className="op-kpi-label">{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
              <span className="op-kpi-value">{s.current}</span>
              <span className="op-kpi-unit">days</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>best {s.best}</div>
          </div>
        ))}
      </div>

      <Card title="Eight weeks, day by day" sub="Every square is a day; the darkest are days a session was logged.">
        <div className="op-weeks">
          {weeks.map((week) => (
            <div key={week.label}>
              <div className="op-eyebrow" style={{ marginBottom: 8 }}>{week.label}</div>
              <div className="op-week-days">
                {week.days.map((day, index) => (
                  <div
                    key={index}
                    className="op-day-cell"
                    style={{ background: day.tone }}
                    title={day.title}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="op-legend">
          <span className="op-legend-item">
            <span className="op-swatch" style={{ background: 'var(--series-1)' }} />
            Session logged
          </span>
          <span className="op-legend-item">
            <span className="op-swatch" style={{ background: 'var(--lilac)' }} />
            Food or weight logged
          </span>
          <span className="op-legend-item">
            <span className="op-swatch" style={{ background: 'var(--track)' }} />
            Nothing logged
          </span>
        </div>
      </Card>

      <div className="op-grid op-grid-4">
        <div className="op-kpi">
          <div className="op-kpi-label">Sleep</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>{fmtDuration(recovery.sleepAvgMin)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {recovery.nightsLogged} nights · {fmtDuration(settings.sleepTargetMin)} target
          </div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-top">
            <span className="op-kpi-label">Resting HR</span>
            <Chip value={recovery.restingHrDelta} suffix=" bpm" digits={1} goodDirection="down" />
          </div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {recovery.restingHr === null ? '—' : fmtNumber(recovery.restingHr)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>14-day mean</div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-top">
            <span className="op-kpi-label">HRV</span>
            <Chip value={recovery.hrvDelta} suffix=" ms" digits={1} goodDirection="up" />
          </div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {recovery.hrv === null ? '—' : fmtNumber(recovery.hrv)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>14-day mean</div>
        </div>
        <div className="op-kpi">
          <div className="op-kpi-label">Sleep debt</div>
          <div className="op-kpi-value" style={{ marginTop: 12 }}>
            {recovery.sleepDebtMin === null ? '—' : fmtDuration(Math.max(0, recovery.sleepDebtMin))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>against target, 14 nights</div>
        </div>
      </div>

      <Card title="Sleep architecture" sub="Last three weeks, by stage.">
        {sleepColumns.length ? (
          <>
            <StackedColumnChart
              data={sleepColumns}
              series={SLEEP_SERIES}
              format={(value) => `${Number(value.toFixed(1))}h`}
              ariaLabel="Nightly sleep split into deep, REM and core stages, in hours."
            />

            <p className="op-note" style={{ marginTop: 16, fontSize: 12.5 }}>
              Deep sleep is running at{' '}
              <strong>{recovery.deepShare === null ? '—' : `${Math.round(recovery.deepShare * 100)}%`}</strong>{' '}
              of total and REM at{' '}
              <strong>{recovery.remShare === null ? '—' : `${Math.round(recovery.remShare * 100)}%`}</strong>.
              Healthy adults typically land near 13–23% deep and 20–25% REM.
            </p>

            <TableView
              caption="Nightly sleep by stage, minutes"
              columns={['Night', 'Total', 'Deep', 'REM', 'Core']}
              rows={[...nights].reverse().map((day) => [
                fmtLongDate(day.date),
                fmtDuration(day.sleepTotalMin),
                fmtNumber(day.sleepDeepMin),
                fmtNumber(day.sleepRemMin),
                fmtNumber(
                  Math.max(0, (day.sleepTotalMin ?? 0) - (day.sleepDeepMin ?? 0) - (day.sleepRemMin ?? 0)),
                ),
              ])}
            />
          </>
        ) : (
          <p className="op-empty">No sleep data synced for this range.</p>
        )}
      </Card>

      {recovery.restingHrDelta !== null && recovery.hrvDelta !== null ? (
        <Card soft>
          <p className="op-note">
            {recovery.restingHrDelta <= 0 && recovery.hrvDelta >= 0 ? (
              <>
                <strong>Absorbing the load.</strong> Resting heart rate and HRV are both moving the
                way you want against the fortnight before — the deficit is being handled.
              </>
            ) : recovery.restingHrDelta > 2 && recovery.hrvDelta < 0 ? (
              <>
                <strong>Both markers moving the wrong way.</strong> Resting heart rate up{' '}
                {fmtNumber(recovery.restingHrDelta, 1)} bpm with HRV down{' '}
                {fmtNumber(Math.abs(recovery.hrvDelta), 1)} ms. Usually accumulated fatigue, thin
                sleep, or a deficit held too long. A lighter week is cheaper than a forced one.
              </>
            ) : (
              <>
                Mixed signals across the fortnight. Worth another week before reading anything into
                it.
              </>
            )}
          </p>
        </Card>
      ) : null}
    </div>
  );
}
