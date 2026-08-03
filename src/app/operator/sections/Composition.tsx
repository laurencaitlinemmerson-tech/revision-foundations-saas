'use client';

import type { Derived } from '@/lib/operator/fitness/derive';
import { MultiLineChart } from '../components/charts';
import { fmtLongDate, fmtNumber, fmtSigned } from '../components/format';
import { Card, Note, Section, StatTile, TableView } from '../components/ui';

/**
 * Body composition. Three percentages on one axis — they share a unit,
 * so they belong on one plot rather than three stacked cards.
 */
export default function Composition({ data }: { data: Derived }) {
  const withReadings = data.days.filter((day) => day.bodyFat !== null || day.muscleMass !== null);

  const labels = withReadings.map((day) => day.date);
  const series = [
    {
      key: 'fat',
      label: 'Body fat',
      color: 'var(--series-1)',
      values: withReadings.map((day) => day.bodyFat),
    },
    {
      key: 'muscle',
      label: 'Muscle mass',
      color: 'var(--series-2)',
      values: withReadings.map((day) => day.muscleMass),
    },
    {
      key: 'water',
      label: 'Water',
      color: 'var(--series-3)',
      values: withReadings.map((day) => day.water),
    },
  ];

  const first = withReadings[0] ?? null;
  const last = withReadings[withReadings.length - 1] ?? null;

  const fatDelta = first?.bodyFat != null && last?.bodyFat != null ? last.bodyFat - first.bodyFat : null;
  const muscleDelta =
    first?.muscleMass != null && last?.muscleMass != null ? last.muscleMass - first.muscleMass : null;

  // Lean mass held while fat falls is the outcome that actually matters.
  const holdingLean = fatDelta !== null && muscleDelta !== null && fatDelta < -0.2 && muscleDelta >= -0.2;

  return (
    <Section
      kicker="Composition"
      title="What the weight is made of"
      note="Scale weight alone cannot tell a good week from a bad one. These three shares can: fat falling while muscle holds is the outcome worth having."
    >
      <Card>
        {labels.length ? (
          <MultiLineChart
            labels={labels}
            series={series}
            unit="%"
            ariaLabel="Body fat, muscle mass and water as a percentage of body mass over time."
          />
        ) : (
          <p className="op-empty">No composition readings in this range yet.</p>
        )}

        <div style={{ marginTop: 16 }}>
          <TableView
            caption="Body composition readings, most recent first"
            columns={['Date', 'Body fat (%)', 'Muscle (%)', 'Water (%)', 'Weight (kg)']}
            rows={[...withReadings].reverse().map((day) => [
              fmtLongDate(day.date),
              fmtNumber(day.bodyFat, 1),
              fmtNumber(day.muscleMass, 1),
              fmtNumber(day.water, 1),
              fmtNumber(day.weight, 1),
            ])}
          />
        </div>
      </Card>

      <div className="op-grid op-grid-4" style={{ marginTop: 16 }}>
        <StatTile
          label="Body fat"
          value={last?.bodyFat === null || last?.bodyFat === undefined ? '—' : fmtNumber(last.bodyFat, 1)}
          unit="%"
          foot={fatDelta === null ? 'No comparison' : `${fmtSigned(fatDelta, 1)} pts in range`}
        />
        <StatTile
          label="Muscle mass"
          value={
            last?.muscleMass === null || last?.muscleMass === undefined
              ? '—'
              : fmtNumber(last.muscleMass, 1)
          }
          unit="%"
          foot={muscleDelta === null ? 'No comparison' : `${fmtSigned(muscleDelta, 1)} pts in range`}
        />
        <StatTile
          label="Water"
          value={last?.water === null || last?.water === undefined ? '—' : fmtNumber(last.water, 1)}
          unit="%"
          foot="Hydration moves the scale day to day"
        />
        <StatTile
          label="BMI"
          value={data.latest ? fmtNumber(data.latest.bmi, 1) : '—'}
          foot="A population statistic, not a training target"
        />
      </div>

      {fatDelta !== null && muscleDelta !== null ? (
        <div style={{ marginTop: 16 }}>
          <Note tone={holdingLean ? 'good' : 'neutral'}>
            {holdingLean ? (
              <>
                <strong>Fat down {fmtNumber(Math.abs(fatDelta), 1)} points with muscle held.</strong>{' '}
                This is the shape a well-run deficit makes — the loss is coming from the right place.
              </>
            ) : muscleDelta < -0.5 ? (
              <>
                <strong>Muscle share has fallen {fmtNumber(Math.abs(muscleDelta), 1)} points.</strong>{' '}
                Usually a deficit that is too steep, too little protein, or lifting that has dropped
                off. Check the protein streak and the training volume below.
              </>
            ) : (
              <>
                Composition is broadly flat across this range. Bioimpedance scales are noisy — read
                these as a monthly trend rather than a weekly one.
              </>
            )}
          </Note>
        </div>
      ) : null}
    </Section>
  );
}
