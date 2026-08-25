import { fitReadings } from '@/lib/fitness/regression';
import type { HealthDay, WeighIn } from '../daily-log/data';
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

export type EnergyDay = {
  date: string;
  inKcal: number | null;
  outKcal: number | null;
  net: number | null;
};

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

  bars: Array<{ key: string; x: string; y: string; w: string; h: string; fill: string }>;
  zeroY: string;
  coverageNote: string;
};

/** Intake and expenditure for one day, with expenditure as total burn. */
export function energyDays(days: HealthDay[]): EnergyDay[] {
  return days.map((d) => {
    const inKcal = d.nutrition.dietaryEnergyKcal ?? null;
    const active = d.activity.activeEnergyKcal ?? null;
    // Total burn needs basal. Active alone is the Move ring, a few hundred kcal,
    // and calling that a day's expenditure would invent an enormous deficit.
    const basal = d.activity.basalEnergyKcal ?? null;
    const outKcal = active !== null && basal !== null ? active + basal : null;
    return {
      date: d.date.slice(0, 10),
      inKcal,
      outKcal,
      net: inKcal !== null && outKcal !== null ? inKcal - outKcal : null,
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

  const bars = window.map((r, i) => {
    const v = r.net;
    if (v === null) {
      return { key: r.date, x: (i * step).toFixed(1), y: String(zeroY - 1), w: (step * 0.7).toFixed(1), h: '2', fill: '#E6DCE8' };
    }
    const h = Math.max(1.5, (Math.abs(v) / bound) * (H / 2));
    return {
      key: r.date,
      x: (i * step).toFixed(1),
      y: (v < 0 ? zeroY : zeroY - h).toFixed(1),
      w: (step * 0.7).toFixed(1),
      h: h.toFixed(1),
      // Deficit hangs below the line in plum, surplus rises above it in rose.
      fill: v < 0 ? PLUM : PINK,
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
    bars,
    zeroY: String(zeroY),
    coverageNote: `${complete.length} of ${rows.length} days have both sides recorded${
      complete.length < rows.length
        ? '. A day missing either one is not counted, rather than being treated as a zero.'
        : '.'
    }`,
  };
}

export const energyPalette = { deficit: PLUM, surplus: PINK, warn: AMBER, bad: ROSE };
