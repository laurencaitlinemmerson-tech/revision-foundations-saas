import { fitReadings } from '@/lib/fitness/regression';
import type { HealthDay, WeighIn, Workout } from '../daily-log/data';
import { AMBER, GREEN, MUTED, PINK, PLUM, ROSE, SOFT } from './palette';

/**
 * Energy balance, and what the scale says about it.
 *
 * Intake minus expenditure gives a deficit, and 7,700 kcal is the conventional
 * energy value of a kilogram of body fat, so a deficit implies a rate of loss.
 * That implication is worth showing and worth distrusting in equal measure:
 * intake is self-reported and expenditure is a watch's estimate, and both drift.
 *
 * So the useful number is not the projection on its own but the projection set
 * against what actually happened. If the log predicts 1.2 kg and the scale says
 * 0.3 kg, the gap is the interesting thing — it is measuring the accuracy of the
 * logging, not a failure of the body.
 */

const KCAL_PER_KG = 7700;

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

/**
 * Where a day's burn came from.
 *
 * Expenditure is BMR + NEAT + EAT + TEF, and three of those four are measured
 * here rather than modelled:
 *
 *  - BMR is Apple Health's basal energy, not a Mifflin–St Jeor guess.
 *  - EAT is the energy the watch recorded against actual workouts.
 *  - NEAT is what is left of active energy once workouts are taken out — the
 *    walking, standing and fidgeting that is not training.
 *  - TEF is the only estimate, and it is computed from the macros rather than
 *    as a flat percentage: protein costs about 25% of its own energy to digest,
 *    carbohydrate about 8%, fat about 2%. A protein-heavy day genuinely burns
 *    more than a fat-heavy one of the same size, and a flat 10% hides that.
 *
 * Apple's active energy already folds NEAT and EAT together, and its total burn
 * leaves TEF out entirely — so the figure here is deliberately higher than the
 * watch's own, and the deficit correspondingly larger.
 */
export type EnergyDay = {
  date: string;
  inKcal: number | null;
  outKcal: number | null;
  net: number | null;
  bmr: number | null;
  neat: number | null;
  eat: number | null;
  tef: number | null;
};

/** Protein ~25%, carbohydrate ~8%, fat ~2% of their own energy. */
export function thermicEffect(d: HealthDay): number | null {
  const { proteinG, carbsG, fatG, dietaryEnergyKcal } = d.nutrition;
  if (proteinG !== null || carbsG !== null || fatG !== null) {
    return (proteinG ?? 0) * 4 * 0.25 + (carbsG ?? 0) * 4 * 0.08 + (fatG ?? 0) * 9 * 0.02;
  }
  // No macros logged, so fall back to the conventional flat share of intake.
  return dietaryEnergyKcal === null ? null : dietaryEnergyKcal * 0.10;
}

export type EnergyView = {
  /** Days where both sides were recorded — the only ones that can be scored. */
  complete: number;
  spanDays: number;
  avgIn: number | null;
  avgOut: number | null;
  avgNet: number | null;

  headline: string;
  headlineUnit: string;
  headlineColor: string;
  direction: 'deficit' | 'surplus' | 'maintenance' | 'unknown';

  /** Implied by the logged balance alone. */
  projectedKgPerWeek: number | null;
  projectedLabel: string;
  projectedNote: string;

  /** What the scale actually did over the same window. */
  actualKgPerWeek: number | null;
  actualLabel: string;

  /** The gap between the two, and what it means. */
  reconciliation: string | null;
  reconciliationColor: string;

  /** Implied expenditure, worked back from intake and the real weight change. */
  impliedTdee: number | null;
  impliedTdeeNote: string;
  /** False when the figure is arithmetically valid but cannot be true. */
  impliedTdeeCredible: boolean;
  /** BMR, NEAT, EAT and TEF averaged across the window. */
  components: Array<{
    key: string; label: string; note: string; measured: boolean;
    value: number | null; valueLabel: string; share: number; pct: string;
  }>;
  componentsNote: string;

  bars: Array<{
    key: string; x: number; cx: number; y: number; w: number; h: number;
    fill: string; label: string; sub: string;
  }>;
  zeroY: number;
  coverageNote: string;
};

/** Intake and expenditure for one day, broken into its four components. */
export function energyDays(days: HealthDay[], workouts: Workout[]): EnergyDay[] {
  // Energy the watch attributed to deliberate training, by day.
  const eatByDate = new Map<string, number>();
  for (const w of workouts) {
    const key = w.startedAt.slice(0, 10);
    eatByDate.set(key, (eatByDate.get(key) ?? 0) + (w.energyKcal ?? 0));
  }

  return days.map((d) => {
    const date = d.date.slice(0, 10);
    const inKcal = d.nutrition.dietaryEnergyKcal ?? null;
    const active = d.activity.activeEnergyKcal ?? null;
    const bmr = d.activity.basalEnergyKcal ?? null;
    const tef = thermicEffect(d);

    // Workouts are already inside Apple's active energy, so EAT is capped at it
    // and NEAT is the remainder — never the two added on top of each other.
    const eatRaw = eatByDate.get(date) ?? null;
    const eat = active === null ? eatRaw : Math.min(eatRaw ?? 0, active);
    const neat = active === null ? null : Math.max(0, active - (eat ?? 0));

    // Without basal there is no total: active alone is the Move ring, and
    // calling that a day's expenditure would invent an enormous deficit.
    const outKcal = bmr === null || active === null ? null : bmr + active + (tef ?? 0);

    return {
      date,
      inKcal,
      outKcal,
      net: inKcal !== null && outKcal !== null ? inKcal - outKcal : null,
      bmr,
      neat,
      eat,
      tef,
    };
  });
}

export function buildEnergy(
  rows: EnergyDay[],
  weighIns: WeighIn[],
  spanDays: number,
): EnergyView {
  const complete = rows.filter((r) => r.net !== null);
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

  const avgIn = mean(rows.map((r) => r.inKcal).filter((v): v is number => v !== null));
  const avgOut = mean(rows.map((r) => r.outKcal).filter((v): v is number => v !== null));
  const avgNet = mean(complete.map((r) => r.net as number));

  const avgOf = (pick: (r: EnergyDay) => number | null) =>
    mean(rows.map(pick).filter((v): v is number => v !== null));

  const parts = [
    { key: 'bmr', label: 'BMR', value: avgOf((r) => r.bmr), note: 'Resting burn, measured by the watch', measured: true },
    { key: 'neat', label: 'NEAT', value: avgOf((r) => r.neat), note: 'Everything active that was not a workout', measured: true },
    { key: 'eat', label: 'EAT', value: avgOf((r) => r.eat), note: 'Energy recorded against logged workouts', measured: true },
    { key: 'tef', label: 'TEF', value: avgOf((r) => r.tef), note: 'Digestion, from the macros logged', measured: false },
  ];
  const partsTotal = parts.reduce((a, p) => a + (p.value ?? 0), 0) || 1;
  const components = parts.map((p) => ({
    ...p,
    label: p.label,
    valueLabel: p.value === null ? '—' : nf(Math.round(p.value)),
    share: p.value === null ? 0 : (p.value / partsTotal) * 100,
    pct: p.value === null ? '0%' : `${((p.value / partsTotal) * 100).toFixed(0)}%`,
  }));

  const direction: EnergyView['direction'] = avgNet === null
    ? 'unknown'
    : avgNet < -100 ? 'deficit' : avgNet > 100 ? 'surplus' : 'maintenance';

  // A deficit is a negative net, so loss is a negative rate. Shown as a positive
  // "lost" figure with the direction carried by the words, not a minus sign.
  const projectedKgPerWeek = avgNet === null ? null : (avgNet * 7) / KCAL_PER_KG;

  // What the scale did, from a fitted line rather than first-vs-last, which
  // would ride on whichever two days happened to be the endpoints.
  const readings = weighIns
    .filter((w) => w.weight > 0)
    .map((w) => ({ date: w.date.slice(0, 10), weight: w.weight }));
  const fit = readings.length >= 4 ? fitReadings(readings) : null;
  const actualKgPerWeek = fit ? fit.slope * 7 : null;

  const enough = complete.length >= 7;

  const projectedLabel = projectedKgPerWeek === null
    ? '—'
    : `${projectedKgPerWeek < 0 ? '−' : '+'}${nf(Math.abs(projectedKgPerWeek), 2)} kg/week`;
  const actualLabel = actualKgPerWeek === null
    ? '—'
    : `${actualKgPerWeek < 0 ? '−' : '+'}${nf(Math.abs(actualKgPerWeek), 2)} kg/week`;

  let reconciliation: string | null = null;
  let reconciliationColor = MUTED;
  if (enough && projectedKgPerWeek !== null && actualKgPerWeek !== null) {
    const gapPerWeek = actualKgPerWeek - projectedKgPerWeek;
    const gapKcal = (gapPerWeek * KCAL_PER_KG) / 7;
    if (Math.abs(gapKcal) < 150) {
      reconciliation = `The log and the scale agree to within ${nf(Math.abs(gapKcal))} kcal a day. Both can be trusted at this level.`;
      reconciliationColor = GREEN;
    } else if (gapKcal > 0) {
      reconciliation = `The scale is moving ${nf(Math.abs(gapPerWeek), 2)} kg a week slower than the log implies — a gap of about ${nf(Math.abs(gapKcal))} kcal a day. Usually that means intake is under-recorded or the watch is generous with expenditure, rather than anything about your body.`;
      reconciliationColor = AMBER;
    } else {
      reconciliation = `The scale is moving ${nf(Math.abs(gapPerWeek), 2)} kg a week faster than the log implies — about ${nf(Math.abs(gapKcal))} kcal a day unaccounted for. Water and glycogen swing this over short windows, so read it over months, not weeks.`;
      reconciliationColor = PLUM;
    }
  }

  // Expenditure worked backwards from intake and the observed change, which is
  // the only estimate of it that does not depend on the watch being right.
  const impliedRaw = enough && avgIn !== null && actualKgPerWeek !== null
    ? avgIn - (actualKgPerWeek * KCAL_PER_KG) / 7
    : null;

  // But it inherits every gap in the intake log. If it lands far below what the
  // watch measured — or below any plausible resting metabolism — the arithmetic
  // has not discovered a slow metabolism, it has detected unlogged food. Saying
  // so is more useful than printing a number that cannot be true.
  const credible = impliedRaw !== null && avgOut !== null && impliedRaw >= avgOut * 0.7;
  const impliedTdee = credible ? impliedRaw : null;

  /* the bars: net per day, above and below a zero line ---------------------- */

  const W = 560;
  const H = 200;
  const window = rows.slice(-Math.min(rows.length, 60));
  const nets = window.map((r) => r.net).filter((v): v is number => v !== null);
  const bound = Math.max(600, ...nets.map((v) => Math.abs(v)));
  const zeroY = H / 2;
  const step = W / Math.max(1, window.length);

  const dateLabel = (d: string) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const bars = window.map((r, i) => {
    const v = r.net;
    const base = { key: r.date, x: i * step, cx: i * step + step * 0.35, w: step * 0.7, sub: dateLabel(r.date) };

    if (v === null) {
      // Drawn as a stub on the baseline: a day with only one side logged is
      // visibly present and visibly not counted.
      return {
        ...base, y: zeroY - 1, h: 2, fill: '#E6DCE8',
        label: r.inKcal === null && r.outKcal === null
          ? 'Nothing logged'
          : r.inKcal === null ? 'No intake logged' : 'No expenditure recorded',
      };
    }

    const h = Math.max(1.5, (Math.abs(v) / bound) * (H / 2));
    return {
      ...base,
      y: v < 0 ? zeroY : zeroY - h,
      h,
      // Deficit hangs below the line in plum, surplus rises above it in rose.
      fill: v < 0 ? PLUM : PINK,
      label: `${nf(Math.abs(v))} kcal ${v < 0 ? 'deficit' : 'surplus'}  ·  in ${nf(r.inKcal ?? 0)} / out ${nf(r.outKcal ?? 0)}`,
    };
  });

  return {
    complete: complete.length,
    spanDays,
    avgIn,
    avgOut,
    avgNet,
    headline: avgNet === null ? '—' : nf(Math.abs(avgNet)),
    headlineUnit: direction === 'surplus' ? 'kcal surplus a day' : 'kcal deficit a day',
    headlineColor: direction === 'deficit' ? PLUM : direction === 'surplus' ? PINK : SOFT,
    direction,
    projectedKgPerWeek,
    projectedLabel,
    projectedNote: !enough
      ? `Needs at least seven days with both intake and expenditure recorded — there ${complete.length === 1 ? 'is' : 'are'} ${complete.length}.`
      : `At ${nf(Math.abs(avgNet ?? 0))} kcal a day, using 7,700 kcal per kilogram of fat.`,
    actualKgPerWeek,
    actualLabel,
    reconciliation,
    reconciliationColor,
    impliedTdee,
    impliedTdeeNote: impliedTdee !== null
      ? `Worked back from ${nf(avgIn ?? 0)} kcal average intake and the measured weight trend — independent of what the watch reports.`
      : impliedRaw !== null
        ? `This works out at ${nf(Math.round(impliedRaw))} kcal, which is below any plausible resting metabolism and well under the ${nf(Math.round(avgOut ?? 0))} your watch measured. That is not a finding about your body — it is what the arithmetic does when food goes unlogged. Only ${complete.length} of ${rows.length} days here have intake recorded.`
        : 'Needs both a logged intake and a weight trend over the same window.',
    impliedTdeeCredible: credible,
    components,
    componentsNote: parts.every((p) => p.value !== null)
      ? 'Three of these four are measured rather than modelled — only digestion is estimated, and from the macros rather than a flat share.'
      : 'Some components have no data in this window, so the total below is incomplete.',
    bars,
    zeroY,
    coverageNote: `${complete.length} of ${rows.length} days have both sides recorded${
      complete.length < rows.length
        ? '. A day missing either one is not counted, rather than being treated as a zero.'
        : '.'
    }`,
  };
}

export const energyPalette = { deficit: PLUM, surplus: PINK, warn: AMBER, bad: ROSE };
