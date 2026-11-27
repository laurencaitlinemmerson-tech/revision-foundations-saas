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
  /** Beat every earlier log of this movement. A first-ever log is not a PB. */
  pb: boolean;
  /** No earlier log of this movement to compare against. */
  firstLog: boolean;
  /** The next step up from this session's top set, by double progression. */
  next: string | null;
  /** Share of the session's heaviest exercise volume, 0–100, for the set bars. */
  volumePct: number;
};

export type MuscleStatus = 'none' | 'under' | 'in' | 'over';

export type MuscleBalance = {
  days: number;
  /** Days the averages are taken over: the window, or less when the log starts inside it. */
  coveredDays: number;
  from: string;
  to: string;
  sessions: number;
  sets: number;
  volumeKg: number;
  /** Sets a week: each primary set counts 1, each assisting set counts half. */
  perWeek: Record<MuscleKey, number>;
  status: Record<MuscleKey, MuscleStatus>;
  /** The movements behind each muscle's sets, most sets first. */
  contributors: Record<MuscleKey, Array<{ name: string; sets: number; role: 'primary' | 'secondary' }>>;
  /** Major muscles below the weekly range, worst first. */
  under: MuscleKey[];
  inRange: number;
};

export type MuscleMap = {
  empty: boolean;
  date: string | null;
  exercises: MuscleMapExercise[];
  /** Sets per muscle: primary counts each set, secondary counts it separately. */
  load: Record<MuscleKey, { primary: number; secondary: number }>;
  totals: { sets: number; volumeKg: number; pbs: number; exercises: number };
  unmatched: string[];
  balance: { week: MuscleBalance; month: MuscleBalance };
};

/**
 * The weekly range most hypertrophy guidance works to: around 10 hard sets per
 * muscle per week as the floor, with returns flattening past about 20.
 */
export const WEEKLY_SETS = { low: 10, high: 20 } as const;

/** The muscles a balanced programme trains directly; the rest get enough indirect work. */
export const MAJOR_MUSCLES: MuscleKey[] = [
  'glutes', 'quads', 'hamstrings', 'chest', 'lats', 'midBack', 'deltsSide', 'deltsRear',
  'biceps', 'triceps', 'calves', 'abs',
];

const KEYS = Object.keys(MUSCLE_NAMES) as MuscleKey[];
const per = <T,>(f: (k: MuscleKey) => T) => Object.fromEntries(KEYS.map((k) => [k, f(k)])) as Record<MuscleKey, T>;
const blankLoad = () => per(() => ({ primary: 0, secondary: 0 }));

const kg = (n: number) => `${Math.round(n * 10) / 10}`.replace(/\.0$/, '');
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Double progression from the session's top set: work up to 12 reps at a load,
 * then add the smallest jump. Under 6 reps, hold the load and build reps first.
 */
function nextStep(sets: Lift['sets']): string | null {
  const loaded = sets.filter((s) => s.weightKg > 0);
  if (!loaded.length) return null;
  const top = [...loaded].sort((a, b) => b.weightKg - a.weightKg || b.reps - a.reps)[0];
  if (top.reps >= 12) return `${kg(top.weightKg + 2.5)} kg × 8–10`;
  if (top.reps < 6) return `${kg(top.weightKg)} kg × 6`;
  return `${kg(top.weightKg)} kg × ${top.reps + 1}`;
}

function balanceFor(lifts: Lift[], days: number, today: Date): MuscleBalance {
  const to = ymd(today);
  const from = ymd(new Date(today.getTime() - (days - 1) * 864e5));
  const inWindow = lifts.filter((l) => {
    const d = l.performedOn.slice(0, 10);
    return d >= from && d <= to;
  });

  const raw = per(() => 0);
  const contrib = per(() => new Map<string, { sets: number; role: 'primary' | 'secondary' }>());
  for (const l of inWindow) {
    const m = musclesOf(l.exercise);
    const add = (k: MuscleKey, role: 'primary' | 'secondary') => {
      raw[k] += role === 'primary' ? l.sets.length : l.sets.length / 2;
      const prev = contrib[k].get(l.exercise);
      contrib[k].set(l.exercise, {
        sets: (prev?.sets ?? 0) + l.sets.length,
        role: prev?.role === 'primary' ? 'primary' : role,
      });
    };
    m.primary.forEach((k) => add(k, 'primary'));
    m.secondary.forEach((k) => add(k, 'secondary'));
  }

  // Average over the days the log actually covers, so a window that reaches back
  // before the first logged lift is not diluted by weeks with no record at all.
  const first = lifts.map((l) => l.performedOn.slice(0, 10)).sort()[0];
  const covered = first && first > from
    ? Math.max(7, Math.round((new Date(`${to}T12:00:00`).getTime() - new Date(`${first}T12:00:00`).getTime()) / 864e5) + 1)
    : days;
  const perWeek = per((k) => Math.round((raw[k] / (Math.min(days, covered) / 7)) * 10) / 10);
  const status = per<MuscleStatus>((k) =>
    perWeek[k] === 0 ? 'none' : perWeek[k] < WEEKLY_SETS.low ? 'under' : perWeek[k] <= WEEKLY_SETS.high ? 'in' : 'over');

  return {
    days,
    coveredDays: Math.min(days, covered),
    from,
    to,
    sessions: new Set(inWindow.map((l) => l.performedOn.slice(0, 10))).size,
    sets: inWindow.reduce((a, l) => a + l.sets.length, 0),
    volumeKg: inWindow.reduce((a, l) => a + l.volumeKg, 0),
    perWeek,
    status,
    contributors: per((k) =>
      [...contrib[k].entries()]
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => (a.role === b.role ? b.sets - a.sets : a.role === 'primary' ? -1 : 1))),
    under: MAJOR_MUSCLES.filter((k) => perWeek[k] < WEEKLY_SETS.low).sort((a, b) => perWeek[a] - perWeek[b]),
    inRange: MAJOR_MUSCLES.filter((k) => status[k] === 'in' || status[k] === 'over').length,
  };
}

export function buildMuscleMap(lifts: Lift[], today: Date = new Date()): MuscleMap {
  const dated = lifts.filter((l) => l.performedOn && l.sets.length);
  const balance = { week: balanceFor(dated, 7, today), month: balanceFor(dated, 28, today) };
  if (!dated.length) {
    return {
      empty: true, date: null, exercises: [], load: blankLoad(),
      totals: { sets: 0, volumeKg: 0, pbs: 0, exercises: 0 }, unmatched: [], balance,
    };
  }

  // A personal best beats every earlier log of that movement. The first time a
  // movement is logged there is nothing to beat, so it is marked as a first log
  // rather than counted — otherwise a fresh log would read as a PB on every lift.
  const best = new Map<string, number>();
  const pbIds = new Set<string>();
  const firstIds = new Set<string>();
  for (const l of [...dated].sort((a, b) => a.performedOn.localeCompare(b.performedOn))) {
    const key = l.exercise.trim().toLowerCase();
    if (!best.has(key)) {
      firstIds.add(l.id);
      best.set(key, l.topSetKg);
    } else if (l.topSetKg > 0 && l.topSetKg > best.get(key)!) {
      pbIds.add(l.id);
      best.set(key, l.topSetKg);
    }
  }

  const date = dated.map((l) => l.performedOn.slice(0, 10)).sort().at(-1)!;
  const session = dated.filter((l) => l.performedOn.slice(0, 10) === date);
  const maxVol = Math.max(1, ...session.map((l) => l.volumeKg));
  const load = blankLoad();
  const unmatched: string[] = [];

  const exercises = session.map((l) => {
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
      firstLog: firstIds.has(l.id),
      next: nextStep(l.sets),
      volumePct: Math.max(8, (l.volumeKg / maxVol) * 100),
    };
  });

  return {
    empty: false,
    date,
    exercises,
    load,
    totals: {
      sets: session.reduce((a, l) => a + l.sets.length, 0),
      volumeKg: session.reduce((a, l) => a + l.volumeKg, 0),
      pbs: exercises.filter((e) => e.pb).length,
      exercises: session.length,
    },
    unmatched,
    balance,
  };
}
