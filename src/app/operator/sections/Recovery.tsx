'use client';

import type { Derived } from '@/lib/operator/fitness/derive';
import type { OperatorSettings } from '@/lib/operator/types';
import { StackedColumnChart } from '../components/charts';
import { fmtDate, fmtDuration, fmtLongDate, fmtNumber, fmtSigned } from '../components/format';
import { Card, Delta, Note, Section, StatTile, TableView } from '../components/ui';

const SLEEP_SERIES = [
  { key: 'deep', label: 'Deep', color: 'var(--series-1)' },
  { key: 'rem', label: 'REM', color: 'var(--series-2)' },
  { key: 'core', label: 'Core', color: 'var(--series-3)' },
];

/**
 * Recovery. A falling resting heart rate with rising HRV is the
 * signature of a deficit the body is coping with; the reverse is the
 * first sign it is not.
 */
export default function Recovery({
  data,
  settings,
}: {
  data: Derived;
  settings: OperatorSettings;
}) {
  const { recovery } = data;
  const nights = data.days.slice(-21).filter((day) => day.sleepTotalMin !== null);

  // Plotted in hours rather than minutes so the axis ticks land on whole
  // hours instead of the ragged 0h / 3h / 7h that minute-based steps give.
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

  const tail = data.days.slice(-21);

  return (
    <Section
      kicker="Recovery"
      title="Whether the body is keeping up"
      note="A deficit is a stressor. Resting heart rate drifting down and HRV drifting up means it is being absorbed; the two moving the other way is the earliest warning that the deficit, the training, or the sleep needs easing."
    >
      <div className="op-grid op-grid-4">
        <StatTile
          label="Sleep"
          value={fmtDuration(recovery.sleepAvgMin)}
          foot={`${recovery.nightsLogged} nights logged · ${fmtDuration(settings.sleepTargetMin)} target`}
          spark={tail.map((day) => day.sleepTotalMin)}
        />
        <StatTile
          label="Resting HR"
          value={recovery.restingHr === null ? '—' : fmtNumber(recovery.restingHr)}
          unit="bpm"
          delta={
            <Delta value={recovery.restingHrDelta} suffix=" bpm" digits={1} goodDirection="down" />
          }
          foot="14-day mean"
        />
        <StatTile
          label="HRV"
          value={recovery.hrv === null ? '—' : fmtNumber(recovery.hrv)}
          unit="ms"
          delta={<Delta value={recovery.hrvDelta} suffix=" ms" digits={1} goodDirection="up" />}
          foot="14-day mean"
        />
        <StatTile
          label="Sleep debt"
          value={
            recovery.sleepDebtMin === null
              ? '—'
              : fmtDuration(Math.max(0, recovery.sleepDebtMin))
          }
          foot="Against target, last 14 nights"
        />
      </div>

      <div style={{ marginTop: 16 }} />

      <Card title="Sleep architecture" sub="Last three weeks, by stage">
        {sleepColumns.length ? (
          <>
            <StackedColumnChart
              data={sleepColumns}
              series={SLEEP_SERIES}
              format={(value) => `${Number(value.toFixed(1))}h`}
              ariaLabel="Nightly sleep split into deep, REM and core stages, in minutes."
            />

            <p className="op-card-sub" style={{ marginTop: 16, marginBottom: 0 }}>
              Deep sleep is running at{' '}
              <strong>
                {recovery.deepShare === null ? '—' : `${Math.round(recovery.deepShare * 100)}%`}
              </strong>{' '}
              of total and REM at{' '}
              <strong>
                {recovery.remShare === null ? '—' : `${Math.round(recovery.remShare * 100)}%`}
              </strong>
              . Healthy adults typically land near 13–23% deep and 20–25% REM.
            </p>

            <div style={{ marginTop: 16 }}>
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
            </div>
          </>
        ) : (
          <p className="op-empty">No sleep data synced for this range.</p>
        )}
      </Card>

      {recovery.restingHrDelta !== null && recovery.hrvDelta !== null ? (
        <div style={{ marginTop: 16 }}>
          <Note
            tone={
              recovery.restingHrDelta <= 0 && recovery.hrvDelta >= 0
                ? 'good'
                : recovery.restingHrDelta > 2 && recovery.hrvDelta < 0
                  ? 'warning'
                  : 'neutral'
            }
          >
            {recovery.restingHrDelta <= 0 && recovery.hrvDelta >= 0 ? (
              <>
                <strong>Absorbing the load.</strong> Resting heart rate is{' '}
                {fmtSigned(recovery.restingHrDelta, 1, ' bpm')} and HRV{' '}
                {fmtSigned(recovery.hrvDelta, 1, ' ms')} against the fortnight before — the direction
                you want on both.
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
                Mixed signals across the fortnight — resting heart rate{' '}
                {fmtSigned(recovery.restingHrDelta, 1, ' bpm')}, HRV{' '}
                {fmtSigned(recovery.hrvDelta, 1, ' ms')}. Worth another week before reading anything
                into it.
              </>
            )}
          </Note>
        </div>
      ) : null}
    </Section>
  );
}
