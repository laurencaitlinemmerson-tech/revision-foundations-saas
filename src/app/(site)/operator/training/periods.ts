import { londonDate, shiftDays } from '@/lib/peer/contract';
import type { Window } from './scoring';

/**
 * The dashboard's period control.
 *
 * Calendar-aligned rather than rolling, because "this month" is the thing people
 * actually mean. The comparison period is the same *elapsed* stretch of the
 * previous one — three days into a month you are compared against the first
 * three days of last month, not against all thirty. Comparing a partial period
 * against a whole one makes every month open catastrophically and recover by the
 * 30th, which is an artefact of the arithmetic rather than anything you did.
 */

export type PeriodId = 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';

export const PERIOD_IDS: PeriodId[] = ['Day', 'Week', 'Month', 'Year', 'Custom'];

const DAY = 86_400_000;
const at = (day: string) => Date.parse(`${day}T00:00:00Z`);

/** The first day of the period containing `day`. */
function startOf(period: PeriodId, day: string): string {
  switch (period) {
    case 'Day':
      return day;
    case 'Week': {
      const dow = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
      return shiftDays(day, -dow);
    }
    case 'Month':
      return `${day.slice(0, 7)}-01`;
    case 'Year':
      return `${day.slice(0, 4)}-01-01`;
    default:
      return day;
  }
}

/** The same period, one step back. */
function previousStart(period: PeriodId, start: string): string {
  switch (period) {
    case 'Day':
      return shiftDays(start, -1);
    case 'Week':
      return shiftDays(start, -7);
    case 'Month': {
      const [y, m] = start.split('-').map(Number);
      const py = m === 1 ? y - 1 : y;
      const pm = m === 1 ? 12 : m - 1;
      return `${py}-${String(pm).padStart(2, '0')}-01`;
    }
    case 'Year':
      return `${Number(start.slice(0, 4)) - 1}-01-01`;
    default:
      return start;
  }
}

export type PeriodWindows = {
  now: Window;
  prev: Window;
  /** How the period reads in a sentence, e.g. "this month so far". */
  label: string;
  /** The comparison, e.g. "the same 12 days of July". */
  againstLabel: string;
  start: string;
  spanDays: number;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function periodWindows(
  period: PeriodId,
  custom?: { from: string; to: string },
): PeriodWindows {
  const today = londonDate();

  if (period === 'Custom' && custom) {
    const from = at(custom.from);
    const to = at(custom.to) + DAY;
    const span = Math.max(1, Math.round((to - from) / DAY));
    return {
      now: { from, to, spanDays: span },
      prev: { from: from - span * DAY, to: from, spanDays: span },
      label: `${custom.from} to ${custom.to}`,
      againstLabel: `the ${span} days before`,
      start: custom.from,
      spanDays: span,
    };
  }

  const start = startOf(period, today);
  const from = at(start);
  const to = Date.now();
  // Whole days elapsed so far, so the comparison covers the same stretch.
  const elapsed = Math.max(1, Math.round((at(today) - from) / DAY) + 1);

  const prevStart = previousStart(period, start);
  const prevFrom = at(prevStart);

  const labels: Record<PeriodId, string> = {
    Day: 'today',
    Week: 'this week so far',
    Month: `${MONTHS[Number(today.slice(5, 7)) - 1]} so far`,
    Year: `${today.slice(0, 4)} so far`,
    Custom: 'the selected range',
  };

  const against: Record<PeriodId, string> = {
    Day: 'yesterday',
    Week: `the same ${elapsed} day${elapsed === 1 ? '' : 's'} of last week`,
    Month: `the same ${elapsed} day${elapsed === 1 ? '' : 's'} of ${MONTHS[Number(prevStart.slice(5, 7)) - 1]}`,
    Year: `the same ${elapsed} days of ${prevStart.slice(0, 4)}`,
    Custom: 'the period before',
  };

  return {
    now: { from, to, spanDays: elapsed },
    prev: { from: prevFrom, to: prevFrom + elapsed * DAY, spanDays: elapsed },
    label: labels[period],
    againstLabel: against[period],
    start,
    spanDays: elapsed,
  };
}
