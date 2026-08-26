/**
 * The Training dashboard's colours.
 *
 * The design arrived in warm neutrals with near-black data marks. This keeps its
 * restraint — cream ground, hairline rules, editorial type — and moves the ink
 * that *carries data* into plum, with rose as the second series. Text stays
 * near-black so nothing pays for the colour in legibility.
 *
 * Green, amber and rose keep their jobs: they mean good, attention and falling,
 * and are never used decoratively.
 */

/* Ground */
export const PAPER = '#FBF8FA';
export const SIDEBAR = '#F5F1F5';
export const CARD = '#FFFFFF';
/** The soft panel tint behind the radar and the selected session. */
export const TINT = '#FBF4F7';
/** The faintest lilac, for an active nav row. */
export const LILAC_HAZE = '#F4EFF6';

/* Type */
export const INK = '#221C24';
export const SOFT = '#57515A';
export const MUTED = '#9C8894';

/* Data marks */
export const PLUM = '#5F4472';
export const PLUM_SOFT = '#8E6FA3';
export const PLUM_FILL = 'rgba(95, 68, 114, 0.08)';
export const PLUM_FILL_FAINT = 'rgba(95, 68, 114, 0.05)';
export const PINK = '#C06C84';
export const PINK_DEEP = '#8A4459';
export const PINK_SOFT = '#F2DCE4';
export const PINK_LINE = '#D9AFC0';
export const PINK_FILL = 'rgba(192, 108, 132, 0.10)';

/* Neutral chart furniture */
export const TRACK = '#F1EBF0';
export const TRACK_PREV = '#E6DCE8';
export const SPARK = '#C3AECC';
export const RULE = '0.5px solid rgba(34, 28, 36, 0.10)';
export const RULE_SOFT = '0.5px solid rgba(34, 28, 36, 0.07)';

/* Semantic */
export const GREEN = '#1E8A4D';
export const AMBER = '#C8700A';
export const ROSE = '#A14A57';

/** The activity heatmap ramp, palest to darkest. */
export const HEAT = ['#F7F3F6', '#EEDFE9', '#DFBFD3', '#A87CA8', PLUM];

/** Insight tag colours — plum for good, rose for attention, violet for context. */
export const TAG_GOOD = PLUM;
export const TAG_WATCH = '#A8506B';
export const TAG_INFO = '#7A5FA0';

/* ── Soft edges ──────────────────────────────────────────────────────────
   The reference is Notion: rounded cards, pill tags, nothing with a hard
   corner. Radii are small enough to read as considered rather than bubbly. */

export const RADIUS = {
  card: '10px',
  panel: '12px',
  pill: '999px',
  control: '7px',
  cell: '6px',
} as const;

/** A tag's fill and text, the way Notion colours its select options. */
export const TAGS: Record<string, { bg: string; fg: string }> = {
  plum:   { bg: '#EFE7F3', fg: '#5F4472' },
  pink:   { bg: '#FBE4EC', fg: '#8A4459' },
  blue:   { bg: '#E4ECF7', fg: '#3A5F8A' },
  green:  { bg: '#E2F0E8', fg: '#26694A' },
  amber:  { bg: '#FBEEDC', fg: '#8A5A18' },
  grey:   { bg: '#EEEAEF', fg: '#6A6270' },
};

/**
 * Soft covers, standing in for the reference's photography.
 *
 * The Notion boards are topped with dreamy pastel photographs. A fitness
 * dashboard has no photographs to use and stock imagery would be worse than
 * none, so the same job — a soft band of colour that makes a card feel like a
 * card — is done with gradients drawn from the palette already in use.
 */
export const COVERS = {
  plum:  'linear-gradient(135deg, #E8DCF0 0%, #F6EAF2 55%, #FDF4F8 100%)',
  pink:  'linear-gradient(135deg, #FAD9E6 0%, #FCE9F0 55%, #FEF5F8 100%)',
  dawn:  'linear-gradient(135deg, #F3E2EC 0%, #E9E2F3 50%, #F7F1FA 100%)',
  sea:   'linear-gradient(135deg, #DDEAF2 0%, #E9F0F6 55%, #F6FAFC 100%)',
  sand:  'linear-gradient(135deg, #F6E7DC 0%, #FBF0E8 55%, #FEF9F5 100%)',
} as const;
