'use client';

import { fmtNumber, toUnit } from '../components/format';
import { Bar, Card, FieldLabel } from '../components/ui';
import { KCAL_PER_KG } from '@/lib/operator/fitness/tdee';
import type { TabProps } from './types';

/* The four components of expenditure, in fixed categorical order. */
const LEDGER = [
  { key: 'bmr', label: 'BMR', color: 'var(--series-1)', note: 'what the body spends existing' },
  { key: 'neat', label: 'NEAT', color: 'var(--series-2)', note: 'shifts, stairs, walking — estimated' },
  { key: 'exercise', label: 'Training', color: 'var(--series-3)', note: 'measured from Health' },
  { key: 'tef', label: 'Food', color: 'var(--series-4)', note: 'thermic cost of digesting' },
] as const;

export default function Plan({ data, settings, unit }: TabProps) {
  const { tdee } = data;

  const amounts: Record<string, number> = {
    bmr: tdee.bmr,
    neat: tdee.neat,
    exercise: tdee.exercise,
    tef: tdee.tef,
  };

  const planNumbers = [
    {
      label: 'Daily calories',
      value: fmtNumber(tdee.targetIntake),
      note: `${fmtNumber(tdee.dailyDelta)} kcal under maintenance`,
    },
    {
      label: 'Protein',
      value: `${fmtNumber(settings.proteinTargetG)} g`,
      note: `${(settings.proteinTargetG / Math.max(1, data.latest?.weight ?? 70)).toFixed(1)} g per kg`,
    },
    {
      label: 'Weekly rate',
      value: `${fmtNumber(toUnit(settings.weeklyChangeKg, unit), 2)} ${unit}`,
      note: `${fmtNumber((settings.weeklyChangeKg * KCAL_PER_KG) / 7)} kcal/day`,
    },
    {
      label: 'Maintenance',
      value: fmtNumber(tdee.tdee),
      note: `${Math.round(tdee.confidence * 100)}% from measured signal`,
    },
  ];

  const adherence = [
    {
      label: 'Food logged',
      value: data.days.filter((d) => d.intakeKcal !== null).length,
      total: data.days.length,
      color: 'var(--series-1)',
    },
    {
      label: 'Protein target',
      value: data.days.filter((d) => d.proteinG !== null && d.proteinG >= settings.proteinTargetG).length,
      total: data.days.length,
      color: 'var(--series-2)',
    },
    {
      label: 'Step target',
      value: data.days.filter((d) => d.steps !== null && d.steps >= settings.stepTarget).length,
      total: data.days.length,
      color: 'var(--series-3)',
    },
    {
      label: 'In a deficit',
      value: data.days.filter((d) => d.deltaKcal !== null && d.deltaKcal > 0).length,
      total: data.days.length,
      color: 'var(--series-4)',
    },
  ];

  const macroSplit = [
    { label: 'Protein', grams: settings.proteinTargetG, kcalPerG: 4, color: 'var(--series-1)' },
    {
      label: 'Fat',
      grams: Math.round((tdee.targetIntake * 0.3) / 9),
      kcalPerG: 9,
      color: 'var(--series-2)',
    },
    {
      label: 'Carbs',
      grams: Math.round(
        (tdee.targetIntake - settings.proteinTargetG * 4 - Math.round((tdee.targetIntake * 0.3) / 9) * 9) / 4,
      ),
      kcalPerG: 4,
      color: 'var(--series-3)',
    },
  ];

  return (
    <div className="op-stack">
      <Card
        title={`Your plan · ${fmtNumber(toUnit(settings.weeklyChangeKg, unit), 2)} ${unit} a week`}
        sub="Targets come from the single operator_settings row — edit it in Supabase to change them."
      >
        <div className="op-grid op-grid-4">
          {planNumbers.map((n) => (
            <div
              key={n.label}
              style={{
                padding: '18px 20px',
                borderRadius: 22,
                background: 'var(--card-soft)',
                border: '0.5px solid var(--line-violet)',
              }}
            >
              <FieldLabel>{n.label}</FieldLabel>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {n.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{n.note}</div>
            </div>
          ))}
        </div>

        <p className="op-note" style={{ marginTop: 18, color: 'var(--muted)', fontSize: 12.5 }}>
          Expenditure is assembled from real signals rather than a flat activity multiplier —
          measured basal rate, an estimated non-exercise component, active energy straight from
          Health, and the thermic cost of the food itself. Treat it as a starting hypothesis and let
          the reality check below correct it.
        </p>
      </Card>

      <div className="op-grid op-grid-2">
        <Card title="Where the energy goes" sub={`Seven-day basis · training ${tdee.exerciseSource}`}>
          {LEDGER.map((row) => (
            <div key={row.key} className="op-rowline">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="op-swatch" style={{ background: row.color }} />
                {row.label}
              </span>
              <span>
                <Bar value={amounts[row.key]} target={tdee.tdee} color={row.color} label={row.label} />
                <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', marginTop: 5 }}>
                  {row.note}
                </span>
              </span>
              <b>{fmtNumber(amounts[row.key])}</b>
            </div>
          ))}

          <div className="op-rowline" style={{ borderTop: '0.5px solid var(--line)' }}>
            <span style={{ color: 'var(--ink)' }}>Total</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {Math.round(tdee.confidence * 100)}% measured
            </span>
            <b>{fmtNumber(tdee.tdee)}</b>
          </div>
        </Card>

        <Card
          title="Reality check"
          sub="Maintenance back-calculated from what you actually ate and what the scale actually did — not the formula."
          action={
            data.reality ? (
              <span className="op-chip" data-tone={data.reality.reliable ? 'good' : 'flat'}>
                {data.reality.reliable ? 'reliable' : 'thin evidence'}
              </span>
            ) : null
          }
        >
          {data.reality ? (
            <>
              <div className="op-grid op-grid-3">
                {[
                  { label: 'Real maintenance', value: fmtNumber(data.reality.realTdee), note: 'kcal/day' },
                  { label: 'Formula says', value: fmtNumber(tdee.tdee), note: 'kcal/day' },
                  {
                    label: 'Gap',
                    value: fmtNumber(Math.abs(data.reality.realTdee - tdee.tdee)),
                    note: data.reality.realTdee > tdee.tdee ? 'above formula' : 'below formula',
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 18,
                      background: 'var(--card-soft)',
                      border: '0.5px solid var(--line-violet)',
                    }}
                  >
                    <FieldLabel>{r.label}</FieldLabel>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 23, color: 'var(--ink)', lineHeight: 1 }}>
                      {r.value}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 5 }}>{r.note}</div>
                  </div>
                ))}
              </div>

              <p className="op-note" style={{ marginTop: 16 }}>
                {data.reality.reliable
                  ? 'Enough days and enough logging for this to be worth trusting over the model. Where the two disagree, follow this one.'
                  : 'Needs at least a fortnight with food logged on most days before this beats the model. Treat it as a hint, not a target.'}
              </p>
            </>
          ) : (
            <p className="op-empty">
              Needs at least a fortnight of weigh-ins and logged food in the selected range.
            </p>
          )}
        </Card>
      </div>

      <div className="op-grid op-grid-2">
        <Card title="Adherence" sub={`Across the last ${data.days.length} days`}>
          {adherence.map((row) => (
            <div key={row.label} className="op-rowline">
              <span>{row.label}</span>
              <Bar value={row.value} target={row.total} color={row.color} label={row.label} />
              <b>{row.total ? `${Math.round((row.value / row.total) * 100)}%` : '—'}</b>
            </div>
          ))}
          <p className="op-note" style={{ marginTop: 14, fontSize: 12.5, color: 'var(--muted)' }}>
            Consistency beats precision. A plan followed four days in five outperforms a stricter one
            followed three.
          </p>
        </Card>

        <Card title="Daily plate" sub="The split that hits the calorie and protein targets.">
          {macroSplit.map((m) => (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <span style={{ fontSize: 12.5 }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' }}>
                  {fmtNumber(m.grams)} g
                </span>
              </div>
              <Bar
                value={m.grams * m.kcalPerG}
                target={tdee.targetIntake}
                color={m.color}
                label={`${m.label} share of intake`}
              />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                {fmtNumber(m.grams * m.kcalPerG)} kcal ·{' '}
                {Math.round(((m.grams * m.kcalPerG) / tdee.targetIntake) * 100)}% of intake
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
