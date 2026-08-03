'use client';

import type { Derived } from '@/lib/operator/fitness/derive';
import type { BodyReading, OperatorSettings } from '@/lib/operator/types';
import { plateauSuggestion } from '@/lib/operator/fitness/plateau';
import { TrajectoryChart } from '../components/charts';
import { fmtLongDate, fmtNumber, fmtSigned } from '../components/format';
import { Note, Section, StatTile, TableView } from '../components/ui';

/**
 * The weight story: raw weigh-ins as faint dots, the seven-day trend
 * as the line you actually read, and a six-week projection with a
 * widening ±1 SD band. One measure, one axis.
 */
export default function Trajectory({
  data,
  settings,
  previous,
}: {
  data: Derived;
  settings: OperatorSettings;
  previous: BodyReading | null;
}) {
  const points = data.days.map((day) => ({
    date: day.date,
    weight: day.weight,
    trend: day.trendWeight,
  }));

  const tableRows = data.days
    .filter((day) => day.weight !== null)
    .slice(-90)
    .reverse()
    .map((day) => [
      fmtLongDate(day.date),
      fmtNumber(day.weight, 1),
      day.trendWeight === null ? '—' : fmtNumber(day.trendWeight, 1),
      day.bodyFat ? fmtNumber(day.bodyFat, 1) : '—',
    ]);

  const confidence = data.fit ? Math.round(data.fit.r2 * 100) : null;
  const totalChange =
    data.first && data.latest ? data.latest.weight - data.first.weight : null;

  return (
    <Section
      kicker="Trajectory"
      title="Where the weight is going"
      note="Faint dots are individual weigh-ins; the line is the seven-day centred average. The shaded tail is a six-week projection of the current fit, widening as the horizon grows."
    >
      <div className="op-card">
        <TrajectoryChart
          points={points}
          projection={data.projection}
          goal={settings.targetWeightKg}
        />

        <div className="op-legend">
          <span className="op-legend-item">
            <span className="op-swatch" data-shape="line" style={{ background: 'var(--series-1)' }} />
            Seven-day trend
          </span>
          <span className="op-legend-item">
            <span
              className="op-swatch"
              style={{ background: 'var(--series-1)', opacity: 0.34 }}
            />
            Individual weigh-in
          </span>
          <span className="op-legend-item">
            <span
              className="op-swatch"
              style={{ background: 'var(--series-1)', opacity: 0.14 }}
            />
            Projection ±1 SD
          </span>
          <span className="op-legend-item">
            <span className="op-swatch" data-shape="line" style={{ background: 'var(--axis)' }} />
            Goal {fmtNumber(settings.targetWeightKg, 1)} kg
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          <TableView
            caption="Weigh-ins in the selected range, most recent first"
            columns={['Date', 'Weight (kg)', 'Trend (kg)', 'Body fat (%)']}
            rows={tableRows}
          />
        </div>
      </div>

      <div className="op-grid op-grid-4" style={{ marginTop: 16 }}>
        <StatTile
          label="Range change"
          value={data.rangeChangeKg === null ? '—' : fmtSigned(data.rangeChangeKg, 1)}
          unit="kg"
          foot="Across the selected window"
        />
        <StatTile
          label="Weekly rate"
          value={data.slopePerWeek === null ? '—' : fmtSigned(data.slopePerWeek, 2)}
          unit="kg/wk"
          foot={`Target ${fmtSigned(-settings.weeklyChangeKg, 2)} kg/wk`}
        />
        <StatTile
          label="Since first reading"
          value={totalChange === null ? '—' : fmtSigned(totalChange, 1)}
          unit="kg"
          foot={data.first ? `From ${fmtLongDate(data.first.date)}` : '—'}
        />
        <StatTile
          label="Fit confidence"
          value={confidence === null ? '—' : String(confidence)}
          unit="% R²"
          foot={
            data.fit
              ? `±${fmtNumber(data.fit.rmse, 2)} kg residual spread`
              : 'Needs two or more readings'
          }
        />
      </div>

      {data.plateau ? (
        <div style={{ marginTop: 16 }}>
          <Note tone="warning">
            <strong>
              Plateau: {data.plateau.days} days at about {fmtNumber(data.plateau.meanWeight, 1)} kg.
            </strong>{' '}
            {plateauSuggestion(data.averages.intakeKcal ?? data.tdee.targetIntake, data.tdee.tdee)}
          </Note>
        </div>
      ) : previous && data.latest ? (
        <div style={{ marginTop: 16 }}>
          <Note tone={data.slopePerWeek !== null && data.slopePerWeek < 0 ? 'good' : 'neutral'}>
            {data.slopePerWeek === null ? (
              <>Not enough readings yet to fit a trend.</>
            ) : data.slopePerWeek < -0.05 ? (
              <>
                Losing <strong>{fmtNumber(Math.abs(data.slopePerWeek), 2)} kg a week</strong> on the
                current fit — that is{' '}
                {Math.abs(data.slopePerWeek) > settings.weeklyChangeKg * 1.4
                  ? 'faster than planned, which tends to cost muscle; consider easing the deficit'
                  : 'in the range you planned for'}
                .
              </>
            ) : data.slopePerWeek > 0.05 ? (
              <>
                Gaining <strong>{fmtNumber(data.slopePerWeek, 2)} kg a week</strong>. Intake is
                running above expenditure across this window.
              </>
            ) : (
              <>Holding steady inside ±0.05 kg a week.</>
            )}
          </Note>
        </div>
      ) : null}
    </Section>
  );
}
