/**
 * Classifying a logged lift.
 *
 * Lifts are typed by hand as free text, so the muscle group and the equipment
 * the Exercises table shows have to be read back out of the name. Matching is
 * keyword-based and deliberately ordered: the most specific phrase wins, so
 * "Bicep Curl" lands in Pull rather than being caught by the "curl" that also
 * appears in "Leg Curl".
 */

export type MuscleGroup = 'Lower body' | 'Push' | 'Pull' | 'Core' | 'Other';

/** The filter row on the Exercises screen, in display order. */
export const MUSCLE_GROUPS: MuscleGroup[] = ['Lower body', 'Push', 'Pull', 'Core', 'Other'];

const GROUP_RULES: Array<[MuscleGroup, string[]]> = [
  ['Core', ['plank', 'crunch', 'sit up', 'sit-up', 'situp', 'dead bug', 'deadbug', 'russian twist',
            'hollow', 'ab wheel', 'leg raise', 'mountain climber', 'bird dog', 'pallof']],
  ['Lower body', ['squat', 'deadlift', 'rdl', 'romanian', 'lunge', 'leg press', 'leg curl',
                  'leg extension', 'hip thrust', 'glute', 'calf', 'step up', 'step-up',
                  'hamstring', 'quad', 'hack', 'bulgarian', 'good morning', 'adductor', 'abductor']],
  ['Pull', ['row', 'pulldown', 'pull down', 'pull-up', 'pull up', 'pullup', 'chin', 'lat ',
            'lat-', 'face pull', 'shrug', 'bicep', 'curl', 'rear delt', 'reverse fly',
            'rear fly', 'pullover']],
  ['Push', ['bench', 'chest press', 'shoulder press', 'overhead press', 'ohp', 'incline',
            'decline', 'dip', 'tricep', 'push up', 'push-up', 'pushup', 'pec', 'fly',
            'lateral raise', 'front raise', 'skull', 'press']],
];

const EQUIPMENT_RULES: Array<[string, string[]]> = [
  ['Barbell', ['barbell', 'bb ', 'bar ']],
  ['Dumbbell', ['dumbbell', 'db ', ' db']],
  ['Kettlebell', ['kettlebell', 'kb ', ' kb']],
  ['Cable', ['cable', 'pulldown', 'pull down', 'pushdown', 'push down', 'face pull']],
  ['Machine', ['machine', 'press machine', 'leg press', 'leg curl', 'leg extension', 'smith', 'hack']],
  ['Band', ['band', 'resistance band']],
  ['Bodyweight', ['plank', 'push up', 'push-up', 'pushup', 'pull up', 'pull-up', 'pullup',
                  'chin', 'dip', 'crunch', 'sit up', 'sit-up', 'dead bug', 'bodyweight',
                  'mountain climber', 'bird dog', 'hollow']],
];

/** Which of the five groups a free-text exercise name belongs to. */
export function muscleGroupOf(name: string): MuscleGroup {
  const n = ` ${name.toLowerCase()} `;
  for (const [group, keys] of GROUP_RULES) {
    if (keys.some((k) => n.includes(k))) return group;
  }
  return 'Other';
}

/**
 * What the lift was loaded with.
 *
 * Falls back to "Barbell" for anything in a barbell-shaped group, because a
 * bare "Squat" or "Deadlift" written in the log almost always means the bar.
 */
export function equipmentOf(name: string): string {
  const n = ` ${name.toLowerCase()} `;
  for (const [equipment, keys] of EQUIPMENT_RULES) {
    if (keys.some((k) => n.includes(k))) return equipment;
  }
  const group = muscleGroupOf(name);
  if (group === 'Core') return 'Bodyweight';
  if (group === 'Lower body' || group === 'Push' || group === 'Pull') return 'Barbell';
  return '—';
}

/** A session's name, taken from the groups the lifts in it belong to. */
export function sessionNameFor(groups: MuscleGroup[]): string {
  const counts = new Map<MuscleGroup, number>();
  for (const g of groups) counts.set(g, (counts.get(g) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return 'Session';

  const [top, topCount] = ranked[0];
  const named = ranked.filter(([g]) => g !== 'Other');
  // A session that spreads evenly across the body reads better as "Full body"
  // than as whichever group happened to have one extra movement in it.
  if (named.length >= 3 || (named.length === 2 && named[0][1] === named[1][1])) return 'Full body';
  if (top === 'Other') return 'Session';
  if (topCount === groups.length || named.length === 1) return top;
  return named[0][0];
}
