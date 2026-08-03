'use client';

import { MultiLineChart, TrajectoryChart } from '../components/charts';
import { fmtLongDate, fmtNumber, toUnit } from '../components/format';
import { Card, Chip, TableView } from '../components/ui';
import { RANGES, addDays } from '@/lib/operator/fitness/derive';
import { plateauSuggestion } from '@/lib/operator/fitness/plateau';
import type { TabProps } from './types';

export default function Trends({ data, settings, unit, range, setRange }: TabProps) {
  const points = data.days.map((day) => ({
    date: day.date,
    weight: toUnit(day.weight, unit),
    trend: toUnit(day.trendWeight, unit),
  }));

  const projection = data.projection.map((p) => ({
    date: p.date,
    y: toUnit(p.y, unit) ?? 0,
    lower: toUnit(p.lower, unit) ?? 0,
    upper: toUnit(p.upper, unit) ?? 0,
  }));

  const rate = data.slopePerWeek;
  const lastDate = data.days[data.days.length - 1]?.date ?? null;

  const horizons = [
    { label: 'In 4 weeks', days: 28 },
    { label: 'In 12 weeks', days: 84 },
    { label: 'In 6 months', days: 182 },
  ].map((h) => {
    const kg = data.latest && rate !== null ? data.latest.weight + (rate / 7) * h.days : null;
    const delta = kg !== null && data.latest ? kg - data.latest.weight : null;
    return {
      ...h,
      value: kg === null ? '—' : fmtNumber(toUnit(kg, unit), 1),
      delta,
      date: lastDate ? fmtLongDate(addDays(lastDate, h.days)) : '—',
    };
  });

  const withComposition = data.days.filter((d) => d.bodyFat !== null || d.muscleMass !== null);

  const bodyRows = [
    { key: 'fat', label: 'Body fat', values: withComposition.map((d) => d.bodyFat), suffix: '%' },
    { key: 'muscle', label: 'Muscle mass', values: withComposition.map((d) => d.muscleMass), suffix: '%' },
    { key: 'water', label: 'Water', values: withComposition.map((d) => d.water), suffix: '%' },
  ].map((row) => {
    const clean = row.values.filter((v): v is number => v !== null);
    const first = clean[0] ?? null;
    const last = clean[clean.length - 1] ?? null;
    return { ...row, last, delta: first !== null && last !== null ? last - first : null };
  });

  return (
    <div className="op-stack">
      <Card
        title={`Weight · ${RANGES.find((r) => r.key === range)?.label.toLowerCase() ?? ''}`}
        sub="Faint dots are single weigh-ins; the line is the seven-day trend. The band shows how far a typical day strays from it."
        action={
          <div className="op-tabs" style={{ margin: 0 }} role="group" aria-label="Date range">
            {RANGES.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-selected={range === option.key}
                role="tab"
                onClick={() => setRange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      >
        <TrajectoryChart
          points={points}
          projection={projection}
          goal={toUnit(settings.targetWeightKg, unit)}
          unit={unit}
        />

        <TableView
          caption="Weigh-ins in the selected range, most recent first"
          columns={['Date', `Weight (${unit})`, `Trend (${unit})`, 'Body fat (%)']}
          rows={data.days
            .filter((d) => d.weight !== null)
            .slice(-120)
            .reverse()
            .map((d) => [
              fmtLongDate(d.date),
              fmtNumber(toUnit(d.weight, unit), 1),
              fmtNumber(toUnit(d.trendWeight, unit), 1),
              d.bodyFat ? fmtNumber(d.bodyFat, 1) : '—',
            ])}
        />
      </Card>

      <div className="op-grid op-grid-2">
        <Card title="Where this lands" sub="Carrying the current fit forward, with no change to what you are doing.">
          {horizons.map((h) => (
            <div
              key={h.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 14,
                alignItems: 'baseline',
                padding: '12px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <span style={{ fontSize: 13 }}>{h.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>
                {h.value}
              </span>
              <Chip value={toUnit(h.delta, unit)} suffix={` ${unit}`} digits={1} goodDirection="down" />
            </div>
          ))}

          <p className="op-note" style={{ marginTop: 16 }}>
            {data.goalEta ? (
              <>
                At this rate you reach <strong>{fmtNumber(toUnit(settings.targetWeightKg, unit), 1)} {unit}</strong>{' '}
                around <strong>{fmtLongDate(data.goalEta)}</strong>.
              </>
            ) : (
              <>The current trend does not reach the goal — it is flat or moving away from it.</>
            )}
          </p>

          {data.plateau ? (
            <p className="op-note" style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12.5 }}>
              <strong>Plateau: {data.plateau.days} days.</strong>{' '}
              {plateauSuggestion(data.averages.intakeKcal ?? data.tdee.targetIntake, data.tdee.tdee)}
            </p>
          ) : null}
        </Card>

        <Card title="Body metrics" sub="Scale weight alone cannot tell a good week from a bad one.">
          {bodyRows.map((row) => (
            <div
              key={row.key}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 12,
                alignItems: 'baseline',
                padding: '13px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <span style={{ fontSize: 13 }}>{row.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)' }}>
                {row.last === null ? '—' : `${fmtNumber(row.last, 1)}${row.suffix}`}
              </span>
              <Chip
                value={row.delta}
                suffix=" pts"
                digits={1}
                goodDirection={row.key === 'fat' ? 'down' : 'up'}
              />
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            {withComposition.length ? (
              <MultiLineChart
                labels={withComposition.map((d) => d.date)}
                series={[
                  { key: 'fat', label: 'Body fat', color: 'var(--series-1)', values: withComposition.map((d) => d.bodyFat) },
                  { key: 'muscle', label: 'Muscle', color: 'var(--series-2)', values: withComposition.map((d) => d.muscleMass) },
                  { key: 'water', label: 'Water', color: 'var(--series-3)', values: withComposition.map((d) => d.water) },
                ]}
                ariaLabel="Body fat, muscle mass and water as a percentage of body mass over time."
              />
            ) : (
              <p className="op-empty">No composition readings in this range.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
