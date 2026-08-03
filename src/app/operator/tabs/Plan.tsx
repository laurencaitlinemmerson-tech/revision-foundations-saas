'use client';

import { useMemo, useState } from 'react';
import { addDays, isoDay } from '@/lib/operator/fitness/derive';
import { fmtLongDate, fmtNumber, toUnit } from '../components/format';
import { Bar, Card, FieldLabel } from '../components/ui';
import { KCAL_PER_KG } from '@/lib/operator/fitness/tdee';
import type { TabProps } from './types';

const PACE_OPTIONS_KG = [0.25, 0.5, 0.75, 1] as const;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* The four components of expenditure, in fixed categorical order. */
const LEDGER = [
  { key: 'bmr', label: 'BMR', color: 'var(--series-1)', note: 'what the body spends existing' },
  { key: 'neat', label: 'NEAT', color: 'var(--series-2)', note: 'shifts, stairs, walking — estimated' },
  { key: 'exercise', label: 'Training', color: 'var(--series-3)', note: 'measured from Health' },
  { key: 'tef', label: 'Food', color: 'var(--series-4)', note: 'thermic cost of digesting' },
] as const;

export default function Plan({ data, settings, unit, logger }: TabProps) {
  const { tdee } = data;
  const [notionConnected, setNotionConnected] = useState(false);

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

  // Which session type most often lands on each weekday, from the real
  // training history — the closest an app with no calendar access can
  // get to "what does the week actually look like".
  const weekPattern = useMemo(() => {
    const byWeekday: Record<number, Record<string, number>> = {};
    for (const day of data.days) {
      for (const workout of day.workouts) {
        const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
        const counts = byWeekday[weekday] ?? {};
        counts[workout.type] = (counts[workout.type] ?? 0) + 1;
        byWeekday[weekday] = counts;
      }
    }
    return WEEKDAYS.map((label, index) => {
      // getUTCDay(): 0=Sun..6=Sat; WEEKDAYS starts Monday, so shift by 1.
      const weekday = (index + 1) % 7;
      const counts = byWeekday[weekday];
      const top = counts
        ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
        : null;
      return { label, type: top?.[0] ?? null, count: top?.[1] ?? 0 };
    });
  }, [data.days]);

  // A target weight per week from the first reading to goal, marked done
  // once the trend actually reached it — a real projection, not a
  // manually-ticked checklist.
  const weekTargets = useMemo(() => {
    const first = data.first;
    if (!first || settings.weeklyChangeKg <= 0) return [];
    const totalWeeks = Math.min(
      26,
      Math.max(1, Math.ceil(Math.abs(first.weight - settings.targetWeightKg) / settings.weeklyChangeKg)),
    );
    const sortedReadings = [...data.days]
      .filter((d) => d.weight !== null)
      .map((d) => ({ date: d.date, weight: d.weight as number }));

    return Array.from({ length: totalWeeks }, (_, i) => {
      const weekNum = i + 1;
      const target = first.weight - settings.weeklyChangeKg * weekNum;
      const date = addDays(first.date, weekNum * 7);
      const reachedBy = sortedReadings.find((r) => r.date >= date && r.weight <= target);
      const passedDate = !reachedBy && isoDay(new Date()) > date;
      return { weekNum, target, date, done: !!reachedBy, overdue: passedDate };
    });
  }, [data.days, data.first, settings.targetWeightKg, settings.weeklyChangeKg]);

  const doneWeeks = weekTargets.filter((w) => w.done).length;

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
        sub="Pick a pace and every number below recalculates from it."
        action={
          <div className="op-tabs" style={{ margin: 0 }} role="group" aria-label="Weekly pace">
            {PACE_OPTIONS_KG.map((kg) => (
              <button
                key={kg}
                type="button"
                role="tab"
                aria-selected={Math.abs(settings.weeklyChangeKg - kg) < 0.01}
                disabled={logger.busy}
                onClick={() => logger.saveSettings({ weeklyChangeKg: kg })}
              >
                {fmtNumber(toUnit(kg, unit), 2)} {unit}
              </button>
            ))}
          </div>
        }
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

      <div className="op-grid op-grid-2">
        <Card
          title="Smart scheduling · Notion"
          sub={
            notionConnected
              ? 'Reading real session history to suggest what each weekday tends to be.'
              : 'Connect a Notion database of shifts and lectures and training days place themselves around the week you actually have.'
          }
          action={
            <button
              type="button"
              className="op-btn"
              data-variant={notionConnected ? undefined : 'solid'}
              onClick={() => setNotionConnected((v) => !v)}
            >
              {notionConnected ? 'Connected ✓' : 'Connect Notion →'}
            </button>
          }
        >
          {weekPattern.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(0,1fr) minmax(0,1fr)',
                gap: 14,
                alignItems: 'center',
                padding: '11px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <span style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--faint)' }}>
                {row.label}
              </span>
              <span style={{ fontSize: 12.5, color: notionConnected ? 'var(--violet)' : 'var(--faint)' }}>
                {notionConnected ? (row.type ?? 'no pattern yet') : 'not connected'}
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>
                {notionConnected ? (row.count ? `${row.count}× logged this weekday` : '—') : '—'}
              </span>
            </div>
          ))}
          <p className="op-note" style={{ marginTop: 12, fontSize: 11.5, color: 'var(--muted)' }}>
            No real Notion connection here — toggling shows what the weekday pattern looks like
            from your own logged sessions, which is the honest version of what a calendar
            integration would eventually schedule around.
          </p>
        </Card>

        <Card soft title="Non-negotiables">
          {[
            `Protein at every meal — ${Math.round(settings.proteinTargetG / 4)} g a sitting hits ${fmtNumber(settings.proteinTargetG)} g without thinking about it.`,
            'Three training sessions is the floor. Cardio is for the deficit; training is what keeps the shape.',
            'Weigh daily, judge weekly. Only the seven-day trend line counts.',
            settings.weeklyChangeKg >= 1
              ? `One day a week at maintenance (${fmtNumber(tdee.tdee)} kcal) to keep training and mood intact.`
              : 'Sleep seven hours — under that, hunger and adherence both fall apart.',
          ].map((rule) => (
            <div key={rule} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '11px 0', borderBottom: '0.5px solid var(--line-violet)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blush)', marginTop: 7, flex: 'none' }} />
              <span style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.55 }}>{rule}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card
        title="Week-by-week targets"
        sub="A target per week from your first reading to goal — marked once the trend actually reached it."
        action={
          weekTargets.length ? (
            <span className="op-chip" data-tone="good">
              {doneWeeks} of {weekTargets.length} weeks reached
            </span>
          ) : null
        }
      >
        {weekTargets.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 10 }}>
            {weekTargets.map((week) => (
              <div
                key={week.weekNum}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '14px 16px',
                  borderRadius: 18,
                  border: '0.5px solid',
                  borderColor: week.done ? 'var(--line-violet)' : 'var(--line)',
                  background: week.done ? 'var(--card-tint)' : week.overdue ? 'var(--card)' : 'var(--card-soft)',
                  color: week.done ? 'var(--violet-deep)' : week.overdue ? 'var(--critical-ink)' : 'var(--body)',
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>
                  Week {week.weekNum}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, letterSpacing: '-0.015em' }}>
                  {fmtNumber(toUnit(week.target, unit), 1)} {unit}
                </span>
                <span style={{ fontSize: 10.5, opacity: 0.75 }}>
                  {week.done ? 'Reached · ' : week.overdue ? 'Not yet · ' : ''}
                  {fmtLongDate(week.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="op-empty">Needs a first weigh-in to project weekly targets from.</p>
        )}
      </Card>
    </div>
  );
}
