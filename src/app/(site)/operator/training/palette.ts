/**
 * The Training dashboard's colours — the approved design, as drawn.
 *
 * Warm editorial: cream ground, hairline rules, near-black ink carrying the
 * data, and a warm taupe for everything secondary. Green, amber and rose are
 * semantic — good, needs attention, falling — and are never decorative.
 *
 * Every value here comes from the design file itself rather than being derived,
 * so the dashboard and the original agree exactly.
 */

/* Ground */
export const PAPER = '#FAFAF8';
export const SIDEBAR = '#F5F3F0';
export const CARD = '#FFFFFF';
/** The soft panel tint behind the radar and a selected row. */
export const TINT = '#FBF8F3';
/** An active nav row sits on the page's own ground, lifted out of the sidebar. */
export const LILAC_HAZE = '#FAFAF8';

/* Type */
export const INK = '#1A1815';
export const SOFT = '#5A5750';
export const MUTED = '#9C8878';

/* Data marks.
   The design draws its primary series in ink and its previous period in a light
   warm grey. The names below are kept from the two-series version so every
   consumer keeps working; what changed is the values, back to the original. */
export const PLUM = INK;
export const PLUM_SOFT = '#8A857C';
export const PLUM_FILL = 'rgba(26, 24, 21, 0.06)';
export const PLUM_FILL_FAINT = 'rgba(26, 24, 21, 0.045)';
/** The second series — the other person, a personal best, a surplus. */
export const PINK = '#C8700A';
export const PINK_DEEP = '#7A3F04';
export const PINK_SOFT = '#D8D3CB';
export const PINK_LINE = '#C8C4BE';
export const PINK_FILL = 'rgba(200, 112, 10, 0.08)';

/* Neutral chart furniture */
export const TRACK = '#F5F3F0';
export const TRACK_PREV = '#E4E0DA';
export const SPARK = '#C8C4BE';
export const RULE = '0.5px solid rgba(0, 0, 0, 0.08)';
export const RULE_SOFT = '0.5px solid rgba(0, 0, 0, 0.06)';

/* Semantic */
export const GREEN = '#1E8A4D';
export const AMBER = '#C8700A';
export const ROSE = '#A14A57';

/** The activity heatmap ramp, palest to darkest. */
export const HEAT = ['#F5F3F0', '#E4DED4', '#C8BCA9', '#8A7A66', '#3A322A'];

/** Insight tag colours, as the design set them. */
export const TAG_GOOD = '#1C7A67';
export const TAG_WATCH = '#7A3F04';
export const TAG_INFO = '#185FA5';

/**
 * Sharp corners, kept as tokens.
 *
 * The design has no rounding anywhere: it separates things with hairlines and
 * space rather than with soft edges. These stay as named values so the choice is
 * visible and reversible in one place instead of being scattered through the
 * markup as literals.
 */
export const RADIUS = {
  card: '0px',
  panel: '0px',
  pill: '0px',
  control: '0px',
  cell: '0px',
} as const;

/** Subject labels are set in their own colour, not filled. */
export const TAGS: Record<string, { bg: string; fg: string }> = {
  plum: { bg: 'transparent', fg: TAG_GOOD },
  pink: { bg: 'transparent', fg: TAG_WATCH },
  blue: { bg: 'transparent', fg: TAG_INFO },
  green: { bg: 'transparent', fg: GREEN },
  amber: { bg: 'transparent', fg: AMBER },
  grey: { bg: 'transparent', fg: MUTED },
};
