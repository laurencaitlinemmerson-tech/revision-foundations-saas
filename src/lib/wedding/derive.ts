import { TASK_PHASES, type WeddingSnapshot, type WeddingTask } from './types';

/* Pure derivations, so the same code runs server-side for the first
   paint and in the client after an edit. */

const DAY_MS = 86_400_000;

export function isoDay(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Whole days from today to an ISO day; negative once it has passed. */
export function daysUntil(target: string | null, from: string = isoDay()): number | null {
  if (!target) return null;
  const a = new Date(`${from}T00:00:00Z`).getTime();
  const b = new Date(`${target}T00:00:00Z`).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.round((b - a) / DAY_MS);
}

export interface PhaseGroup {
  phase: string;
  tasks: WeddingTask[];
  done: number;
}

/** Group tasks by phase in the canonical order, with any unrecognised
 *  phase appended rather than dropped. Empty phases are omitted. */
export function groupByPhase(tasks: WeddingTask[]): PhaseGroup[] {
  const byPhase = new Map<string, WeddingTask[]>();
  for (const task of tasks) {
    const list = byPhase.get(task.phase) ?? [];
    list.push(task);
    byPhase.set(task.phase, list);
  }

  const known = TASK_PHASES.filter((phase) => byPhase.has(phase));
  const extra = [...byPhase.keys()]
    .filter((phase) => !TASK_PHASES.includes(phase as (typeof TASK_PHASES)[number]))
    .sort();

  return [...known, ...extra].map((phase) => {
    const list = byPhase.get(phase) ?? [];
    return { phase, tasks: list, done: list.filter((t) => t.done).length };
  });
}

export interface WeddingSummary {
  daysToWedding: number | null;
  daysToHen: number | null;
  tasksTotal: number;
  tasksDone: number;
  /** Not done, due within the next fortnight or already overdue. */
  upcoming: WeddingTask[];
  overdue: WeddingTask[];
  /** Total the maid of honour is personally out of pocket for. */
  mySpend: number;
  myPaid: number;
  myOutstanding: number;
  /** Everything, whoever is paying. */
  totalSpend: number;
  henSpend: number;
  budgetCap: number | null;
  partyCount: number;
  vendorCount: number;
  henAttending: number;
}

export function summarise(snapshot: WeddingSnapshot): WeddingSummary {
  const today = isoDay();
  const { tasks, costs, contacts, settings } = snapshot;

  const open = tasks.filter((task) => !task.done && task.dueDate);
  const overdue = open.filter((task) => (daysUntil(task.dueDate, today) ?? 0) < 0);
  const upcoming = open
    .filter((task) => {
      const days = daysUntil(task.dueDate, today);
      return days !== null && days >= 0 && days <= 14;
    })
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));

  // "me" is the payer value the UI writes for the maid of honour's own
  // costs; anything else is someone else's money and only counts toward
  // the overall total.
  const mine = costs.filter((cost) => cost.payer.trim().toLowerCase() === 'me');
  const mySpend = mine.reduce((acc, cost) => acc + cost.amount, 0);
  const myPaid = mine.filter((c) => c.paid).reduce((acc, cost) => acc + cost.amount, 0);

  return {
    daysToWedding: daysUntil(settings.weddingDate, today),
    daysToHen: daysUntil(settings.henDate, today),
    tasksTotal: tasks.length,
    tasksDone: tasks.filter((task) => task.done).length,
    upcoming,
    overdue: overdue.sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '')),
    mySpend,
    myPaid,
    myOutstanding: mySpend - myPaid,
    totalSpend: costs.reduce((acc, cost) => acc + cost.amount, 0),
    henSpend: costs.filter((c) => c.isHen).reduce((acc, cost) => acc + cost.amount, 0),
    budgetCap: settings.budgetCap,
    partyCount: contacts.filter((c) => c.kind === 'party').length,
    vendorCount: contacts.filter((c) => c.kind === 'vendor').length,
    henAttending: contacts.filter((c) => c.attendingHen).length,
  };
}

export function fmtMoney(amount: number, currency = 'GBP'): string {
  return amount.toLocaleString('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
}
