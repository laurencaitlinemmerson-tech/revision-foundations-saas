import { DIMENSIONS, baselineOf, scoreDimension, statsFor, type Dimension, type Sources } from './scoring';
import { AMBER, GREEN, MUTED, PINK, PLUM, ROSE } from './palette';

/**
 * The six dimensions, month by month.
 *
 * This replaces the radar, which plotted six numbers that were already listed in
 * full beside it — decoration standing in the most prominent position on the
 * page. Twelve months of the same six says something the list cannot: when they
 * diverged, which one fell away first, and whether a dip is a pattern or a bad
 * fortnight.
 *
 * Each month is scored by exactly the same function the headline uses, so a
 * point on this chart and the number at the top of the screen can never disagree.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DIMENSION_COLOURS: Record<Dimension, string> = {
  Strength: PLUM,
  Cardio: PINK,
  Activity: '#8E6FA3',
  Nutrition: AMBER,
  Recovery: '#7A5FA0',
  Consistency: GREEN,
};

export type RibbonPoint = {
  key: string;
  /** First of the month, as YYYY-MM. */
  month: string;
  label: string;
  scores: Partial<Record<Dimension, number | null>>;
};

export type RibbonRow = {
  key: Dimension;
  label: string;
  colour: string;
  path: string;
  /** Latest scored value, for the row's own figure. */
  latest: number | null;
  latestLabel: string;
  /** Change across the whole ribbon, when both ends are scored. */
  change: string;
  changeColour: string;
  points: Array<{ cx: number; cy: number | null }>;
};

export type Ribbon = {
  ok: boolean;
  months: RibbonPoint[];
  rows: RibbonRow[];
  width: number;
  rowHeight: number;
  note: string;
};

/** Month starts, oldest first, ending with the current month. */
function monthStarts(count: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export function buildRibbon(src: Sources, count = 12): Ribbon {
  const W = 560;
  const ROW = 34;
  const months = monthStarts(count);
  const base = baselineOf(src);

  // One pass per month, scored with the same function as the headline figure.
  const scored: RibbonPoint[] = months.map((m) => {
    const from = Date.parse(`${m}-01T00:00:00Z`);
    const [y, mo] = m.split('-').map(Number);
    const to = Date.UTC(mo === 12 ? y + 1 : y, mo === 12 ? 0 : mo, 1);
    const stats = statsFor(src, { from, to, spanDays: Math.round((to - from) / 86_400_000) }, base);

    const scores: Partial<Record<Dimension, number | null>> = {};
    for (const d of DIMENSIONS) scores[d] = scoreDimension(d, stats, base);
    return {
      key: m,
      month: m,
      label: `${MONTHS[mo - 1]} ${y}`,
      scores,
    };
  });

  const step = count > 1 ? W / (count - 1) : 0;

  const rows: RibbonRow[] = DIMENSIONS.map((d) => {
    const pts = scored.map((s, i) => ({
      cx: i * step,
      // Scores run 0–100 and the row is drawn upside down, high at the top.
      cy: s.scores[d] === null || s.scores[d] === undefined
        ? null
        : ROW - 3 - ((s.scores[d] as number) / 100) * (ROW - 6),
    }));

    // A gap in scoring breaks the line rather than being bridged across, so a
    // month with no data does not read as a straight run between two others.
    let path = '';
    let pen = false;
    for (const p of pts) {
      if (p.cy === null) { pen = false; continue; }
      path += `${pen ? 'L' : 'M'}${p.cx.toFixed(1)} ${p.cy.toFixed(1)} `;
      pen = true;
    }

    const live = scored.map((s) => s.scores[d]).filter((v): v is number => v !== null && v !== undefined);
    const latest = live.length ? live[live.length - 1] : null;
    const first = live.length ? live[0] : null;
    const delta = latest !== null && first !== null ? latest - first : null;

    return {
      key: d,
      label: d,
      colour: DIMENSION_COLOURS[d],
      path: path.trim(),
      latest,
      latestLabel: latest === null ? '—' : String(latest),
      change: delta === null ? '—' : Math.abs(delta) < 2 ? 'held' : `${delta > 0 ? '↑' : '↓'} ${Math.abs(delta)}`,
      changeColour: delta === null ? MUTED : Math.abs(delta) < 2 ? MUTED : delta > 0 ? GREEN : ROSE,
      points: pts,
    };
  });

  const anyScored = rows.some((r) => r.latest !== null);

  return {
    ok: anyScored,
    months: scored,
    rows,
    width: W,
    rowHeight: ROW,
    note: anyScored
      ? `Each month scored the same way as the figure above. A break in a line is a month with nothing to score, not a flat one.`
      : 'Not enough logged history to score a month yet.',
  };
}
