import { fitReadings } from '@/lib/fitness/regression';
import type { WeighIn } from '../daily-log/data';
import { AMBER, GREEN, MUTED, PINK, PLUM, ROSE, SOFT } from './palette';

/**
 * Body composition over time.
 *
 * The screen this replaces plotted lift progression, which needs a lift log that
 * a coaching app will never release. The question underneath it — am I actually
 * changing, and in which direction — is answerable from 617 weigh-ins, and more
 * usefully.
 *
 * The number that matters is not weight. Weight conflates fat, lean tissue and
 * water, and a scale reading on its own cannot tell you which one moved. Split
 * into fat mass and lean mass it can: two kilograms down is a good week if it
 * was fat and a bad one if it was muscle, and those are the same number on the
 * scale.
 *
 * Endpoints come from a fitted line rather than the first and last readings,
 * which would ride on whichever two days happened to bookend the window and
 * swing wildly with water.
 */

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

export type CompSeries = {
  key: string;
  label: string;
  unit: string;
  color: string;
  points: Array<{ key: string; cx: number; cy: number; label: string; sub: string }>;
  path: string;
  area: string;
  latest: string;
  change: string;
  changeColor: string;
  /** Per week, from the fitted slope. */
  rate: string;
  lo: string;
  hi: string;
  /** How much of the movement a straight line accounts for. */
  fit: string;
  points_n: number;
};

export type BodyAnalysis = {
  ok: boolean;
  emptyNote: string;
  series: CompSeries[];
  /** The headline: what the weight change was actually made of. */
  verdict: string | null;
  verdictColor: string;
  detail: string | null;
  spanLabel: string;
  /** Weight, fat and lean side by side as a change table. */
  rows: Array<{ label: string; from: string; to: string; change: string; color: string; note: string }>;
  /** Share of the loss that was fat, for the split bar. Null when not losing. */
  fatShare: number | null;
  fatShareLabel: string | null;
};

type Row = { date: string; weight: number; fat: number | null; lean: number | null; pct: number | null };

/** A weigh-in only counts where the scale actually recorded the field. */
function rowsFrom(weighIns: WeighIn[]): Row[] {
  return weighIns
    .filter((w) => w.weight > 0)
    .map((w) => {
      const pct = w.bodyFat > 0 ? w.bodyFat : null;
      const fat = pct === null ? null : (w.weight * pct) / 100;
      return {
        date: w.date.slice(0, 10),
        weight: w.weight,
        pct,
        fat,
        // Derived from weight and body fat rather than the scale's own muscle
        // figure, so the three numbers always add up to each other.
        lean: fat === null ? null : w.weight - fat,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

const W = 680;
const H = 150;
const PAD = 12;

function seriesOf(
  rows: Row[],
  key: string,
  label: string,
  unit: string,
  color: string,
  pick: (r: Row) => number | null,
  goodDown: boolean,
): CompSeries | null {
  const pts = rows
    .map((r) => ({ date: r.date, v: pick(r) }))
    .filter((p): p is { date: string; v: number } => p.v !== null);
  if (pts.length < 2) return null;

  const t = (d: string) => new Date(`${d}T12:00:00Z`).getTime();
  const first = t(pts[0].date);
  const span = t(pts[pts.length - 1].date) - first || 1;
  const vals = pts.map((p) => p.v);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const range = hi - lo || 1;

  const x = (d: string) => ((t(d) - first) / span) * W;
  const y = (v: number) => PAD + (1 - (v - lo) / range) * (H - PAD * 2);

  const fit = fitReadings(pts.map((p) => ({ date: p.date, weight: p.v })));
  const days = span / 86_400_000;
  const startFit = fit ? fit.intercept : vals[0];
  const endFit = fit ? fit.intercept + fit.slope * days : vals[vals.length - 1];
  const delta = endFit - startFit;
  const perWeek = fit ? fit.slope * 7 : 0;

  const good = goodDown ? delta < 0 : delta > 0;
  const flat = Math.abs(perWeek) < 0.02;

  const points = pts.map((p) => ({
    key: `${key}-${p.date}`,
    cx: Number(x(p.date).toFixed(1)),
    cy: Number(y(p.v).toFixed(1)),
    label: `${nf(p.v, 1)} ${unit}`,
    sub: new Date(`${p.date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  }));
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.cx} ${p.cy}`).join(' ');

  return {
    key,
    label,
    unit,
    color,
    points,
    path,
    area: `${path} L${W} ${H} L0 ${H} Z`,
    latest: `${nf(vals[vals.length - 1], 1)} ${unit}`,
    change: flat ? 'held' : `${delta < 0 ? '−' : '+'}${nf(Math.abs(delta), 1)} ${unit}`,
    changeColor: flat ? MUTED : good ? GREEN : ROSE,
    rate: flat ? '—' : `${perWeek < 0 ? '−' : '+'}${nf(Math.abs(perWeek), 2)} ${unit}/wk`,
    lo: `${nf(lo, 1)} ${unit}`,
    hi: `${nf(hi, 1)} ${unit}`,
    fit: fit ? `${Math.round(fit.r2 * 100)}%` : '—',
    points_n: pts.length,
  };
}

export function buildBodyAnalysis(weighIns: WeighIn[], rangeLabel: string): BodyAnalysis {
  const rows = rowsFrom(weighIns);
  const withComp = rows.filter((r) => r.fat !== null);

  if (rows.length < 2) {
    return {
      ok: false,
      emptyNote: 'Needs at least two weigh-ins in this window.',
      series: [], verdict: null, verdictColor: MUTED, detail: null,
      spanLabel: rangeLabel, rows: [], fatShare: null, fatShareLabel: null,
    };
  }

  const series = [
    seriesOf(rows, 'weight', 'Weight', 'kg', PLUM, (r) => r.weight, true),
    seriesOf(rows, 'fat', 'Fat mass', 'kg', PINK, (r) => r.fat, true),
    seriesOf(rows, 'lean', 'Lean mass', 'kg', '#8E6FA3', (r) => r.lean, false),
    seriesOf(rows, 'pct', 'Body fat', '%', AMBER, (r) => r.pct, true),
  ].filter((x): x is CompSeries => x !== null);

  /* what the change was actually made of ---------------------------------- */

  const fitOf = (pick: (r: Row) => number | null) => {
    const pts = rows.map((r) => ({ date: r.date, v: pick(r) }))
      .filter((p): p is { date: string; v: number } => p.v !== null);
    if (pts.length < 2) return null;
    const f = fitReadings(pts.map((p) => ({ date: p.date, weight: p.v })));
    if (!f) return null;
    const days = (new Date(pts[pts.length - 1].date).getTime() - new Date(pts[0].date).getTime()) / 86_400_000;
    return { from: f.intercept, to: f.intercept + f.slope * days, delta: f.slope * days, r2: f.r2, n: pts.length };
  };

  /**
   * How much of the scatter a straight line has to explain before its endpoints
   * mean anything.
   *
   * Bioimpedance body fat swings with hydration, so a line through a year of it
   * can have almost no explanatory power while still producing confident-looking
   * endpoints — on this data, fits of 3% and 12% implied a 24 kg lean gain and a
   * 16 kg fat loss inside the same year. Both are impossible, and both are what
   * extrapolating a bad fit looks like. Below this threshold the split is
   * refused rather than reported.
   */
  const MIN_FIT = 0.3;

  const wFit = fitOf((r) => r.weight);
  const fFit = fitOf((r) => r.fat);
  const lFit = fitOf((r) => r.lean);

  const tableRows: BodyAnalysis['rows'] = [];
  const push = (label: string, f: ReturnType<typeof fitOf>, unit: string, goodDown: boolean, note: string) => {
    if (!f) return;
    if (f.r2 < MIN_FIT) {
      tableRows.push({
        label,
        from: '—', to: `${nf(f.to, 1)} ${unit}`, change: 'too scattered',
        color: MUTED,
        note: `The readings vary too much for a trend — a line explains only ${Math.round(f.r2 * 100)}% of the movement across ${f.n} readings.`,
      });
      return;
    }
    const flat = Math.abs(f.delta) < 0.15;
    tableRows.push({
      label,
      from: `${nf(f.from, 1)} ${unit}`,
      to: `${nf(f.to, 1)} ${unit}`,
      change: flat ? 'held' : `${f.delta < 0 ? '−' : '+'}${nf(Math.abs(f.delta), 1)} ${unit}`,
      color: flat ? MUTED : (goodDown ? f.delta < 0 : f.delta > 0) ? GREEN : ROSE,
      note,
    });
  };
  push('Weight', wFit, 'kg', true, 'What the scale shows — fat, lean and water together');
  push('Fat mass', fFit, 'kg', true, 'Weight times body fat percentage');
  push('Lean mass', lFit, 'kg', false, 'Everything that is not fat');

  let verdict: string | null = null;
  let verdictColor = MUTED;
  let detail: string | null = null;
  let fatShare: number | null = null;
  let fatShareLabel: string | null = null;

  const compReliable = !!fFit && !!lFit && fFit.r2 >= MIN_FIT && lFit.r2 >= MIN_FIT;

  if (wFit && fFit && lFit && withComp.length >= 4 && !compReliable) {
    const weightClean = wFit.r2 >= MIN_FIT;
    verdict = 'The scale moved, but its body-fat readings will not say how';
    verdictColor = MUTED;
    detail = `${
      weightClean
        ? `Weight itself trends clearly — a line accounts for ${Math.round(wFit.r2 * 100)}% of it across ${wFit.n} readings.`
        : `Weight is scattered too over this window, with a line explaining ${Math.round(wFit.r2 * 100)}% of it across ${wFit.n} readings — a short window and a noisy scale together.`
    } The body-fat readings scatter further still: a trend through them explains only ${Math.round(fFit.r2 * 100)}%, which is not enough to split the change into fat and lean. Extrapolating them anyway produces figures like a 24 kg lean gain inside a year — what a bad fit looks like, rather than what happened. Bioimpedance moves with hydration, so weighing at a consistent time, before drinking and with bare feet, is what tightens it.`;
  } else if (wFit && fFit && lFit && withComp.length >= 4 && compReliable) {
    const dW = wFit.delta;
    const dF = fFit.delta;
    const dL = lFit.delta;

    if (Math.abs(dW) < 0.3) {
      verdict = 'Weight is holding, but the composition is not still';
      verdictColor = dL > 0.2 ? GREEN : MUTED;
      detail = `The scale barely moved over ${rangeLabel} — ${nf(Math.abs(dW), 1)} kg — while fat mass went ${dF < 0 ? 'down' : 'up'} ${nf(Math.abs(dF), 1)} kg and lean mass went ${dL < 0 ? 'down' : 'up'} ${nf(Math.abs(dL), 1)} kg. This is exactly the case a scale on its own cannot show you.`;
    } else if (dW < 0) {
      const fatPart = Math.max(0, -dF);
      const total = Math.max(0.01, -dW);
      fatShare = Math.max(0, Math.min(100, (fatPart / total) * 100));
      fatShareLabel = `${Math.round(fatShare)}% of the loss was fat`;
      verdict = fatShare >= 75
        ? 'Losing weight, and mostly fat'
        : fatShare >= 50
          ? 'Losing weight, with some lean tissue going too'
          : 'Losing weight, but much of it is lean tissue';
      verdictColor = fatShare >= 75 ? GREEN : fatShare >= 50 ? AMBER : ROSE;
      detail = `Down ${nf(total, 1)} kg over ${rangeLabel}: about ${nf(fatPart, 1)} kg of that was fat and ${nf(Math.abs(dL), 1)} kg was lean. ${
        fatShare >= 75
          ? 'That is the split you want — the training is protecting the tissue you are trying to keep.'
          : 'Lean tissue tends to follow protein intake and resistance training, so both are worth checking before cutting harder.'
      }`;
    } else {
      const leanPart = Math.max(0, dL);
      const total = Math.max(0.01, dW);
      fatShare = Math.max(0, Math.min(100, (leanPart / total) * 100));
      fatShareLabel = `${Math.round(fatShare)}% of the gain was lean`;
      verdict = fatShare >= 50 ? 'Gaining weight, mostly lean' : 'Gaining weight, mostly fat';
      verdictColor = fatShare >= 50 ? GREEN : AMBER;
      detail = `Up ${nf(total, 1)} kg over ${rangeLabel}: about ${nf(leanPart, 1)} kg lean and ${nf(Math.max(0, dF), 1)} kg fat.`;
    }
  } else if (rows.length >= 2 && withComp.length < 4) {
    verdict = 'Weight only — no composition to split it with';
    verdictColor = MUTED;
    detail = `${withComp.length} of ${rows.length} weigh-ins in this window carry a body fat reading, which is too few to say what the change was made of. Standing on the scale with bare feet is usually what the impedance reading needs.`;
  }

  return {
    ok: true,
    emptyNote: '',
    series,
    verdict,
    verdictColor,
    detail,
    spanLabel: `${rows[0].date} to ${rows[rows.length - 1].date}`,
    rows: tableRows,
    fatShare,
    fatShareLabel,
  };
}

export const compPalette = { good: GREEN, warn: AMBER, bad: ROSE, muted: MUTED, soft: SOFT };
