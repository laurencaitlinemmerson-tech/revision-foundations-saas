import { CASE_STUDY, DEADLINES, ROTA, type Deadline, type Shift } from '../nursing/nursingData';
import { EXAMS, REVIEW_DAYS, TOPICS, type Topic } from './studyData';

/** confidence and the date a topic was last revised, per topic id. */
export type TopicState = Record<string, { conf: 1 | 2 | 3; last: string }>;
/** `${date}|${blockId}` for everything ticked off. */
export type DoneState = Record<string, true>;
export type Settings = { offDayBlocks: number; shiftDayBlocks: number };

export const DEFAULT_SETTINGS: Settings = { offDayBlocks: 2, shiftDayBlocks: 0 };

export type BlockKind = 'deadline' | 'task' | 'review' | 'shift';
export type Block = {
  id: string;
  kind: BlockKind;
  title: string;
  sub?: string;
  href?: string;
  topicId?: string;
  minutes: number;
};
export type Day = { date: string; shift: Shift | null; blocks: Block[] };

const DAY = 86_400_000;

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => iso(new Date(parse(s).getTime() + n * DAY));
export const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / DAY);

/** How many days overdue a topic is on `date` (negative = not yet due, null = not taught). */
export function dueIn(topic: Topic, state: TopicState, date: string): number | null {
  if (topic.taught > date) return null;
  const s = state[topic.id];
  if (!s) return 0;
  return daysBetween(addDays(s.last, REVIEW_DAYS[s.conf]), date);
}

/** Deadlines worth a work block, and how often. */
function deadlineBlocks(date: string, list: Deadline[] = DEADLINES): Block[] {
  const out: Block[] = [];
  for (const d of list) {
    if (d.kind === 'Feedback' || d.weight === undefined) continue;
    const left = daysBetween(date, d.date);
    if (left < 0 || left > 45) continue;
    const urgent = d.priority === 'Urgent' || d.priority === 'High' || d.weight >= 50;
    if (!urgent) continue;
    const dow = parse(date).getDay();
    const due =
      left <= 7 ? true : left <= 14 ? left % 2 === 0 : left <= 30 ? dow === 1 || dow === 4 : dow === 1;
    if (!due) continue;
    const exam = d.kind.toLowerCase().includes('exam');
    out.push({
      id: `dl:${d.id}`,
      kind: 'deadline',
      title: `${exam ? 'Prepare' : 'Work on'}: ${d.title}`,
      sub: `${left === 0 ? 'Due today' : `${left} day${left === 1 ? '' : 's'} to go`} · ${d.module}`,
      minutes: 45,
    });
  }
  // Closest deadline first.
  return out.sort((a, b) => a.sub!.localeCompare(b.sub!, undefined, { numeric: true }));
}

function taskBlocks(date: string, tasksDone: boolean[]): Block[] {
  return CASE_STUDY.tasks
    .map((t, i) => ({ t, i }))
    .filter(({ i }) => !tasksDone[i])
    .filter(({ t }) => daysBetween(date, t.date) <= 3)
    .sort((a, b) => a.t.date.localeCompare(b.t.date))
    .map(({ t }) => ({
      id: `tk:${t.id}`,
      kind: 'task' as const,
      title: t.title,
      sub: `Case study · ${daysBetween(date, t.date) < 0 ? 'overdue' : `due ${t.date}`}`,
      minutes: 30,
    }));
}

export function shiftOn(date: string, rota: Shift[] = ROTA): Shift | null {
  return rota.find((s) => s.date === date) ?? null;
}

/** A plan for `days` days from `start`, spread around shifts and spaced review. */
export function planDays(
  start: string,
  topics: TopicState,
  tasksDone: boolean[],
  settings: Settings,
  days = 7,
  ctx: { deadlines?: Deadline[]; rota?: Shift[] } = {},
): Day[] {
  const planned = new Set<string>();
  const result: Day[] = [];

  for (let n = 0; n < days; n++) {
    const date = addDays(start, n);
    const shift = shiftOn(date, ctx.rota);
    const cap = shift ? settings.shiftDayBlocks : settings.offDayBlocks;
    const blocks: Block[] = [];

    if (shift) {
      blocks.push({ id: 'sl:shiftlog', kind: 'shift', title: 'Write up your shift', sub: `${shift.ward} · ${shift.start}–${shift.end}. Three lines while it is fresh`, href: '/operator/nursing#shiftlog', minutes: 5 });
    }

    const used = () => blocks.filter((b) => b.kind !== 'shift').length;
    // Keep one slot for revision when there is room for two or more, so an overdue
    // task or a deadline can never starve spaced review completely.
    const workCap = cap >= 2 ? cap - 1 : cap;
    const work = () => used() < workCap;
    for (const b of taskBlocks(date, tasksDone).slice(0, 1)) if (work()) blocks.push(b);
    const closeDeadlines = deadlineBlocks(date, ctx.deadlines);
    const limit = closeDeadlines.some((b) => /^[0-3] day|Due today/.test(b.sub ?? '')) ? 2 : 1;
    let dl = 0;
    for (const b of closeDeadlines) {
      if (work() && dl < limit) {
        blocks.push(b);
        dl++;
      }
    }
    const room = () => used() < cap;

    // Spaced review: most overdue first, shaky before solid, each topic once a week.
    const due = TOPICS.map((t) => ({ t, over: dueIn(t, topics, date) }))
      .filter((x): x is { t: Topic; over: number } => x.over !== null && x.over >= 0 && !planned.has(x.t.id))
      .sort((a, b) => {
        const sa = a.over + (topics[a.t.id] ? 0 : 3) + (topics[a.t.id]?.conf === 1 ? 2 : 0);
        const sb = b.over + (topics[b.t.id] ? 0 : 3) + (topics[b.t.id]?.conf === 1 ? 2 : 0);
        return sb - sa || a.t.taught.localeCompare(b.t.taught);
      });
    for (const { t, over } of due) {
      if (!room()) break;
      planned.add(t.id);
      const s = topics[t.id];
      blocks.push({
        id: `rv:${t.id}`,
        kind: 'review',
        title: `Revise: ${t.title}`,
        sub: `${t.module} · ${s ? (over > 0 ? `${over} day${over === 1 ? '' : 's'} overdue` : 'due today') : 'not revised yet'}`,
        href: t.hub,
        topicId: t.id,
        minutes: 25,
      });
    }

    result.push({ date, shift, blocks });
  }
  return result;
}

/** Consecutive days, ending today or yesterday, with at least one block ticked. */
export function streak(done: DoneState, today: string): number {
  const days = new Set(Object.keys(done).map((k) => k.split('|')[0]));
  let d = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/**
 * How ready a module is: every taught topic scores by confidence (shaky a third,
 * okay two thirds, solid in full), discounted when it is overdue for review, then
 * averaged. A topic you have never rated scores nothing.
 */
export function readiness(module: keyof typeof EXAMS, topics: TopicState, today: string) {
  const list = TOPICS.filter((t) => t.module === module && t.taught <= today);
  let total = 0;
  for (const t of list) {
    const s = topics[t.id];
    if (!s) continue;
    const base = s.conf / 3;
    total += (dueIn(t, topics, today) ?? 0) >= 0 ? base * 0.6 : base;
  }
  return {
    taught: list.length,
    total: TOPICS.filter((t) => t.module === module).length,
    rated: list.filter((t) => topics[t.id]).length,
    solid: list.filter((t) => topics[t.id]?.conf === 3).length,
    due: list.filter((t) => (dueIn(t, topics, today) ?? -1) >= 0).length,
    pct: list.length ? Math.round((total / list.length) * 100) : 0,
  };
}

/**
 * Blocks already ticked on `date` that the planner no longer proposes, because
 * finishing them is what made them drop off (a revised topic is no longer due,
 * a ticked task is no longer outstanding). They stay on today's list so the
 * day's count does not go backwards.
 */
export function completedExtras(date: string, done: DoneState, present: Set<string>): Block[] {
  const out: Block[] = [];
  for (const key of Object.keys(done)) {
    const [d, id] = key.split('|');
    if (d !== date || present.has(id)) continue;
    if (id.startsWith('rv:')) {
      const t = TOPICS.find((x) => x.id === id.slice(3));
      if (t) out.push({ id, kind: 'review', title: `Revise: ${t.title}`, sub: t.module, href: t.hub, topicId: t.id, minutes: 25 });
    } else if (id.startsWith('tk:')) {
      const t = CASE_STUDY.tasks.find((x) => `tk:${x.id}` === id);
      if (t) out.push({ id, kind: 'task', title: t.title, sub: 'Case study', minutes: 30 });
    }
  }
  return out;
}
