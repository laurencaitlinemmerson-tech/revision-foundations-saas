/**
 * The study colour system.
 *
 * Colour on this site encodes meaning rather than decorating. There are three
 * separate encodings and they must not be mixed up:
 *
 *   TopicFamily  categorical — which subject this is. Seven hues, fixed.
 *   StudyState   feedback    — correct / incorrect / warning / info / locked.
 *   mastery      sequential  — one hue, five steps, for ordered progress.
 *
 * The rule that makes it work is consistency: a hue means the same subject on
 * every surface, so a student learns "blue = assessment" once and then reads
 * the hub by colour instead of re-reading every label. That only holds if new
 * tags are added to TAG_FAMILY below rather than given ad-hoc colours locally.
 *
 * Colour is never the only channel. Every helper here pairs with a text label,
 * and state chips also carry an icon, so the system survives colour blindness
 * and greyscale printing.
 *
 * The CSS custom properties live in globals.css and are contrast-audited in
 * both light and night themes.
 */

export type TopicFamily =
  | 'assessment'
  | 'emergency'
  | 'meds'
  | 'skills'
  | 'anatomy'
  | 'professional'
  | 'foundations';

export type StudyState =
  | 'correct'
  | 'incorrect'
  | 'warning'
  | 'info'
  | 'locked';

export type Difficulty = 'Quick Win' | 'Moderate' | 'Deep Dive';

/**
 * Tag -> family. Lowercased keys; lookup is case-insensitive.
 *
 * Branch markers ("Paeds", "Adult") are deliberately absent: they describe
 * *who* the content is for, not *what* it is about, and giving them a hue
 * would compete with the subject encoding. They render as neutral outline
 * chips instead.
 */
const TAG_FAMILY: Record<string, TopicFamily> = {
  // Assessment & exams
  'osce': 'assessment',
  'assessment': 'assessment',

  // Emergency & deterioration
  'emergency/abcde': 'emergency',
  'emergency': 'emergency',
  'critical care': 'emergency',
  'safety': 'emergency',
  'sepsis': 'emergency',

  // Medicines & numbers
  'meds & calculations': 'meds',
  'medications': 'meds',
  'fluids & electrolytes': 'meds',
  'calculations': 'meds',

  // Hands-on practice
  'clinical skills': 'skills',
  'placement': 'skills',
  'procedures': 'skills',

  // Body systems
  'anatomy & physiology': 'anatomy',
  'neuro': 'anatomy',
  'physiology': 'anatomy',

  // Professional practice
  'ethics': 'professional',
  'communication': 'professional',
  'care planning': 'professional',
  'documentation': 'professional',
  'professionalism': 'professional',

  // Orientation & planning
  'y1 essentials': 'foundations',
  'revision plans': 'foundations',
  'revision': 'foundations',
  'good to know': 'foundations',
  'study skills': 'foundations',
};

/**
 * Tags that describe effort rather than subject. They are already shown by the
 * difficulty indicator, so colouring them as topics would double-encode.
 */
const DIFFICULTY_TAGS = new Set(['quick win', 'quick wins', 'moderate', 'deep dive']);

/** Tags that describe audience, not subject. Rendered neutral. */
const BRANCH_TAGS = new Set(['paeds', 'paediatric', 'adult', 'children', "children's"]);

export function isBranchTag(tag: string): boolean {
  return BRANCH_TAGS.has(tag.trim().toLowerCase());
}

export function isDifficultyTag(tag: string): boolean {
  return DIFFICULTY_TAGS.has(tag.trim().toLowerCase());
}

/**
 * Resolve a tag to its family. Returns null for branch/difficulty tags and for
 * anything unmapped — callers render those neutrally rather than guessing a
 * hue, because a wrong-but-confident colour is worse than no colour.
 */
export function familyForTag(tag: string): TopicFamily | null {
  const key = tag.trim().toLowerCase();
  if (BRANCH_TAGS.has(key) || DIFFICULTY_TAGS.has(key)) return null;
  return TAG_FAMILY[key] ?? null;
}

/**
 * The family that best represents a whole resource — used for the spine colour
 * on a card. Takes the first tag that maps, so the order tags are authored in
 * decides the card's identity.
 */
export function primaryFamily(tags: string[]): TopicFamily | null {
  for (const tag of tags) {
    const family = familyForTag(tag);
    if (family) return family;
  }
  return null;
}

type Swatch = {
  surface: string;
  border: string;
  text: string;
  solid: string;
};

export function topicVars(family: TopicFamily): Swatch {
  return {
    surface: `var(--topic-${family}-surface)`,
    border: `var(--topic-${family}-border)`,
    text: `var(--topic-${family}-text)`,
    solid: `var(--topic-${family}-solid)`,
  };
}

export function stateVars(state: StudyState): Swatch {
  return {
    surface: `var(--state-${state}-surface)`,
    border: `var(--state-${state}-border)`,
    text: `var(--state-${state}-text)`,
    solid: `var(--state-${state}-solid)`,
  };
}

/** Neutral swatch for unmapped, branch, and difficulty tags. */
export const NEUTRAL_SWATCH: Swatch = {
  surface: 'transparent',
  border: 'var(--hairline-firm)',
  text: 'var(--ink-soft)',
  solid: 'var(--ink-faint)',
};

export function swatchForTag(tag: string): Swatch {
  const family = familyForTag(tag);
  return family ? topicVars(family) : NEUTRAL_SWATCH;
}

/** Human-readable family names, for legends and filter controls. */
export const FAMILY_LABEL: Record<TopicFamily, string> = {
  assessment: 'Assessment & OSCE',
  emergency: 'Emergency & deterioration',
  meds: 'Medicines & calculations',
  skills: 'Clinical skills & placement',
  anatomy: 'Anatomy & physiology',
  professional: 'Professional practice',
  foundations: 'Foundations & planning',
};

export const ALL_FAMILIES: TopicFamily[] = [
  'foundations',
  'assessment',
  'skills',
  'meds',
  'anatomy',
  'emergency',
  'professional',
];

/**
 * Difficulty is ordered data, so it gets weight (a filled-dot count) rather
 * than a hue. Three dots read as effort even in greyscale, and it keeps the
 * categorical topic hues as the only colour signal on a card.
 */
export const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  'Quick Win': 1,
  'Moderate': 2,
  'Deep Dive': 3,
};

export function difficultyWeight(difficulty: string): number {
  return DIFFICULTY_WEIGHT[difficulty as Difficulty] ?? 0;
}

/** Sequential ramp step (0–4) for a 0–1 mastery fraction. */
export function masteryStep(fraction: number): number {
  if (!Number.isFinite(fraction)) return 0;
  const clamped = Math.max(0, Math.min(1, fraction));
  return Math.min(4, Math.floor(clamped * 5));
}

export function masteryVar(fraction: number): string {
  return `var(--mastery-${masteryStep(fraction)})`;
}
