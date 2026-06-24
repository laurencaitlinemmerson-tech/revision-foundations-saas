// ─── Shared operator dashboard design tokens ─────────────────────────────────
//
// All colour fields are CSS variables defined in operator-dashboard.css under
// .fitness-reference-shell (light) and .fitness-reference-shell[data-theme="dark"].
// Pointing T at the vars makes every inline style that consumes T.* theme-aware
// without touching call sites. This is the single source of truth — previously
// OperatorDashboardClient.tsx and EatingPlan.tsx each kept their own copy.
//
// `display` and `sans` both resolve to the Inter stack: the dashboard dropped
// its Playfair Display "editorial" treatment for a neutral, Notion-style look.
// Kept as two keys (rather than collapsing call sites onto one) since hundreds
// of call sites reference T.display specifically.
const SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const T = {
  paper: 'var(--paper)',
  paperDeep: 'var(--paper-deep)',
  surface: 'var(--surface)',
  ink: 'var(--ink)',
  inkSoft: 'var(--ink-soft)',
  body: 'var(--body)',
  muted: 'var(--muted)',
  line: 'var(--line)',
  softLine: 'var(--soft-line)',
  blue: 'var(--blue)', blueSoft: 'var(--blue-soft)',
  green: 'var(--green)', greenSoft: 'var(--green-soft)',
  gold: 'var(--gold)', goldSoft: 'var(--gold-soft)',
  rose: 'var(--rose)', roseSoft: 'var(--rose-soft)',
  pink: 'var(--pink)', pinkSoft: 'var(--pink-soft)', pinkDeeper: 'var(--pink-deeper)',
  lavender: 'var(--lavender)', lavenderSoft: 'var(--lavender-soft)', lavenderDeeper: 'var(--lavender-deeper)',
  plum: 'var(--plum)', plumSoft: 'var(--plum-soft)',
  display: SANS,
  sans: SANS,
} as const;
