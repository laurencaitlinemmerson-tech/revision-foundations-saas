/**
 * The Training dashboard's colours.
 *
 * The ground is the approved design untouched: cream page, hairline rules, sharp
 * corners, near-black ink for type. What sits on top of it is coloured, and the
 * three accents each mean one thing rather than being decoration:
 *
 *   violet  you, now — the primary series and the figure that leads a panel
 *   pink    the other side — a peer, a previous period, a second series
 *   blue    the target — a plan line, a goal, the thing being measured against
 *
 * Green, amber and rose stay semantic on top of that — good, needs attention,
 * falling — so a colour never has to be read twice.
 */

/* Ground */
export const PAPER = '#FAFAF8';
export const SIDEBAR = '#F5F3F0';
export const CARD = '#FFFFFF';
/** The soft panel tint behind the radar and a selected row. */
export const TINT = '#FBF8F3';
/** An active nav row, lifted out of the sidebar on the faintest violet. */
export const LILAC_HAZE = '#F3EFF8';

/* Type */
export const INK = '#1A1815';
export const SOFT = '#5A5750';
export const MUTED = '#9C8878';

/* The primary series — you, now. */
export const PLUM = '#6A4A8F';
export const PLUM_SOFT = '#9B85BE';
export const PLUM_FILL = 'rgba(106, 74, 143, 0.10)';
export const PLUM_FILL_FAINT = 'rgba(106, 74, 143, 0.055)';

/** The second series — the other person, a previous period, a shortfall. */
export const PINK = '#C2497E';
export const PINK_DEEP = '#8A2F58';
export const PINK_SOFT = '#F0D8E4';
export const PINK_LINE = '#D3B4C6';
export const PINK_FILL = 'rgba(194, 73, 126, 0.09)';

/** The target — a plan line, a goal, the level being measured against. */
export const BLUE = '#3B6EA8';
export const BLUE_SOFT = '#8FAED2';
export const BLUE_LINE = '#7FA3CC';
export const BLUE_FILL = 'rgba(59, 110, 168, 0.09)';

/* Chart furniture, tinted to the ground rather than left warm grey */
export const TRACK = '#F1EDF5';
export const TRACK_PREV = '#DFD6E8';
export const SPARK = '#B9A9CE';
export const RULE = '0.5px solid rgba(0, 0, 0, 0.08)';
export const RULE_SOFT = '0.5px solid rgba(0, 0, 0, 0.06)';

/* Semantic */
export const GREEN = '#1E8A4D';
export const AMBER = '#C8700A';
export const ROSE = '#A14A57';

/** The activity heatmap ramp, palest to darkest — cream through to deep violet. */
export const HEAT = ['#F3F0F2', '#E8DFF2', '#C7B2E0', '#9270C0', '#5B3B87'];

/** Insight tag colours, as the design set them. */
export const TAG_GOOD = '#1C7A67';
export const TAG_WATCH = '#7A3F04';
export const TAG_INFO = BLUE;

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
  plum: { bg: 'transparent', fg: PLUM },
  pink: { bg: 'transparent', fg: PINK_DEEP },
  blue: { bg: 'transparent', fg: BLUE },
  green: { bg: 'transparent', fg: GREEN },
  amber: { bg: 'transparent', fg: AMBER },
  grey: { bg: 'transparent', fg: MUTED },
};
