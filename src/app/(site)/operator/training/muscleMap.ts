import type { Lift } from '../daily-log/data';

/**
 * Which muscles the latest lifting session worked.
 *
 * Lifts are typed as free text, so the muscles have to be read back out of the
 * exercise name, the same way `exercises.ts` reads the movement group. Each rule
 * names the muscles that do the work (primary) and the ones that help (secondary).
 * Rules are ordered most specific first, so "Rear delt fly" is caught before the
 * plain "fly" that would otherwise read it as a chest movement.
 *
 * The map shows only the most recent day with lifts in the log, so it always
 * describes one real session rather than a blend of several.
 */

export type MuscleKey =
  | 'chest' | 'deltsFront' | 'deltsSide' | 'deltsRear' | 'biceps' | 'triceps' | 'forearms'
  | 'lats' | 'midBack' | 'traps' | 'abs' | 'obliques' | 'lowerBack'
  | 'glutes' | 'quads' | 'hamstrings' | 'adductors' | 'calves';

export const MUSCLE_NAMES: Record<MuscleKey, string> = {
  chest: 'Chest', deltsFront: 'Front delts', deltsSide: 'Side delts', deltsRear: 'Rear delts',
  biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms', lats: 'Lats', midBack: 'Mid back',
  traps: 'Traps', abs: 'Abs', obliques: 'Obliques', lowerBack: 'Lower back', glutes: 'Glutes',
  quads: 'Quads', hamstrings: 'Hamstrings', adductors: 'Adductors', calves: 'Calves',
};

type Rule = { keys: string[]; primary: MuscleKey[]; secondary: MuscleKey[] };

const RULES: Rule[] = [
  { keys: ['glute kickback', 'cable kickback', 'kick back', 'leg kickback', 'donkey kick'], primary: ['glutes'], secondary: ['hamstrings'] },
  { keys: ['rear delt', 'reverse fly', 'rear fly', 'face pull'], primary: ['deltsRear'], secondary: ['midBack', 'traps'] },
  { keys: ['lateral raise', 'side raise'], primary: ['deltsSide'], secondary: ['traps'] },
  { keys: ['front raise'], primary: ['deltsFront'], secondary: [] },
  { keys: ['shrug'], primary: ['traps'], secondary: ['forearms'] },
  { keys: ['upright row'], primary: ['deltsSide', 'traps'], secondary: ['biceps'] },
  { keys: ['pulldown', 'pull down', 'pull-up', 'pull up', 'pullup', 'chin'], primary: ['lats'], secondary: ['biceps', 'deltsRear', 'midBack', 'forearms'] },
  { keys: ['pullover'], primary: ['lats'], secondary: ['chest', 'triceps'] },
  { keys: ['row'], primary: ['midBack', 'lats'], secondary: ['biceps', 'deltsRear', 'traps', 'forearms'] },
  { keys: ['hammer curl', 'reverse curl', 'wrist curl'], primary: ['forearms', 'biceps'], secondary: [] },
  { keys: ['leg curl', 'hamstring curl', 'nordic'], primary: ['hamstrings'], secondary: ['calves'] },
  { keys: ['bicep', 'biceps', 'curl'], primary: ['biceps'], secondary: ['forearms'] },
  { keys: ['tricep', 'triceps', 'pushdown', 'push down', 'skull', 'kickback'], primary: ['triceps'], secondary: [] },
  { keys: ['dip'], primary: ['triceps', 'chest'], secondary: ['deltsFront'] },
  { keys: ['shoulder press', 'overhead press', 'ohp', 'military', 'arnold'], primary: ['deltsFront', 'deltsSide'], secondary: ['triceps', 'traps'] },
  { keys: ['bench', 'chest press', 'push up', 'push-up', 'pushup', 'pec', 'fly', 'flye', 'crossover'], primary: ['chest'], secondary: ['deltsFront', 'triceps'] },
  { keys: ['romanian', 'rdl', 'stiff leg', 'good morning'], primary: ['hamstrings', 'glutes'], secondary: ['lowerBack'] },
  { keys: ['deadlift'], primary: ['glutes', 'hamstrings', 'lowerBack'], secondary: ['traps', 'quads', 'forearms'] },
  { keys: ['hip thrust', 'glute bridge', 'kickback', 'booty', 'glute'], primary: ['glutes'], secondary: ['hamstrings'] },
  { keys: ['abduct', 'hip abduction'], primary: ['glutes'], secondary: [] },
  { keys: ['adduct'], primary: ['adductors'], secondary: [] },
  { keys: ['leg extension'], primary: ['quads'], secondary: [] },
  { keys: ['squat', 'leg press', 'hack', 'lunge', 'split squat', 'bulgarian', 'step up', 'step-up'], primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors', 'calves'] },
  { keys: ['calf'], primary: ['calves'], secondary: [] },
  { keys: ['back extension', 'hyperextension', 'superman'], primary: ['lowerBack'], secondary: ['glutes', 'hamstrings'] },
  { keys: ['russian twist', 'woodchop', 'side plank', 'oblique', 'pallof'], primary: ['obliques'], secondary: ['abs'] },
  { keys: ['plank', 'crunch', 'sit up', 'sit-up', 'situp', 'leg raise', 'dead bug', 'deadbug', 'hollow', 'ab wheel', 'mountain climber'], primary: ['abs'], secondary: ['obliques'] },
];

/**
 * Keys match at the start of a word, so "chin" (chin-up) is not found inside
 * "machine" and "row" is not found inside "narrow". Plurals still match.
 */
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MATCHERS = RULES.map((r) => ({
  ...r,
  re: new RegExp(`(?:^|[^a-z])(?:${r.keys.map(escape).join('|')})`),
}));

/** The muscles a free-text exercise name works, or none when nothing matches. */
export function musclesOf(exercise: string): { primary: MuscleKey[]; secondary: MuscleKey[] } {
  const n = exercise.toLowerCase();
  for (const r of MATCHERS) {
    if (r.re.test(n)) return { primary: r.primary, secondary: r.secondary };
  }
  return { primary: [], secondary: [] };
}

export type MuscleMapExercise = {
  id: string;
  name: string;
  primary: MuscleKey[];
  secondary: MuscleKey[];
  sets: Array<{ label: string; pb: boolean }>;
  volumeKg: number;
  e1rmKg: number;
  topSetKg: number;
  pb: boolean;
  /** Share of the session's heaviest exercise volume, 0–100, for the set bars. */
  volumePct: number;
};

export type MuscleMap = {
  empty: boolean;
  date: string | null;
  exercises: MuscleMapExercise[];
  /** Sets per muscle: primary counts each set, secondary counts it separately. */
  load: Record<MuscleKey, { primary: number; secondary: number }>;
  totals: { sets: number; volumeKg: number; pbs: number; exercises: number };
  unmatched: string[];
};

const blankLoad = () =>
  Object.fromEntries(
    (Object.keys(MUSCLE_NAMES) as MuscleKey[]).map((k) => [k, { primary: 0, secondary: 0 }]),
  ) as MuscleMap['load'];

const kg = (n: number) => `${Math.round(n * 10) / 10}`.replace(/\.0$/, '');

export function buildMuscleMap(lifts: Lift[]): MuscleMap {
  const dated = lifts.filter((l) => l.performedOn && l.sets.length);
  if (!dated.length) {
    return { empty: true, date: null, exercises: [], load: blankLoad(), totals: { sets: 0, volumeKg: 0, pbs: 0, exercises: 0 }, unmatched: [] };
  }

  // A personal best is a top set heavier than anything logged for that movement
  // before it — the same rule the rest of the page uses for PRs.
  const best = new Map<string, number>();
  const pbIds = new Set<string>();
  for (const l of [...dated].sort((a, b) => a.performedOn.localeCompare(b.performedOn))) {
    const key = l.exercise.trim().toLowerCase();
    if (l.topSetKg > 0 && l.topSetKg > (best.get(key) ?? 0)) {
      pbIds.add(l.id);
      best.set(key, l.topSetKg);
    }
  }

  const date = dated.map((l) => l.performedOn.slice(0, 10)).sort().at(-1)!;
  const today = dated.filter((l) => l.performedOn.slice(0, 10) === date);
  const maxVol = Math.max(1, ...today.map((l) => l.volumeKg));
  const load = blankLoad();
  const unmatched: string[] = [];

  const exercises = today.map((l) => {
    const m = musclesOf(l.exercise);
    if (!m.primary.length) unmatched.push(l.exercise);
    for (const k of m.primary) load[k].primary += l.sets.length;
    for (const k of m.secondary) load[k].secondary += l.sets.length;
    const pb = pbIds.has(l.id);
    return {
      id: l.id,
      name: l.exercise,
      primary: m.primary,
      secondary: m.secondary,
      sets: l.sets.map((s) => ({
        label: s.weightKg > 0 ? `${kg(s.weightKg)} kg × ${s.reps}` : `${s.reps} reps`,
        pb: pb && s.weightKg === l.topSetKg,
      })),
      volumeKg: l.volumeKg,
      e1rmKg: l.e1rmKg,
      topSetKg: l.topSetKg,
      pb,
      volumePct: Math.max(8, (l.volumeKg / maxVol) * 100),
    };
  });

  return {
    empty: false,
    date,
    exercises,
    load,
    totals: {
      sets: today.reduce((a, l) => a + l.sets.length, 0),
      volumeKg: today.reduce((a, l) => a + l.volumeKg, 0),
      pbs: exercises.filter((e) => e.pb).length,
      exercises: today.length,
    },
    unmatched,
  };
}
