import { fitReadings } from '@/lib/fitness/regression';
import { isStrengthWorkout } from '@/lib/workoutKind';
import { MUTED, TAG_GOOD, TAG_INFO, TAG_WATCH } from './palette';
import type { Sources, Window } from './scoring';
import { TARGETS } from './targets';

/**
 * Observations that need history rather than a window.
 *
 * The window insights answer "how is this period going". These answer questions
 * only years of data can: whether this is your best month, what your training
 * week actually looks like, where the weight is heading at the rate it is
 * currently moving.
 *
 * Every one of these is a description of what was logged. Where two things move
 * together it says so as an association and no more — nothing here knows why
 * anything happened, and phrasing a correlation as a cause would be inventing a
 * finding the data cannot support.
 */

export type Insight = {
  key: string;
  tag: string;
  tagColor: string;
  title: string;
  body: string;
  source: string;
  /**
   * The figure the observation turns on, pulled out so the claim and its
   * evidence sit together. An insight that cannot name a number is usually one
   * that has not really found anything.
   */
  metric?: { value: string; unit: string } | null;
};

const DAY = 86_400_000;
const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** 1st, 2nd, 3rd, 4th — and 11th through 13th, which break the pattern. */
function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}

/** Pearson's r. Reported, never dressed up as a cause. */
function correlation(pairs: Array<[number, number]>): number | null {
  if (pairs.length < 10) return null;
  const xs = pairs.map((p) => p[0]);
  const ys = pairs.map((p) => p[1]);
  const mx = mean(xs) as number;
  const my = mean(ys) as number;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (const [x, y] of pairs) {
    num += (x - mx) * (y - my);
    dx += (x - mx) ** 2;
    dy += (y - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den ? num / den : null;
}

const strength = (r: number) => {
  const a = Math.abs(r);
  return a >= 0.5 ? 'a clear' : a >= 0.3 ? 'a modest' : 'a weak';
};

/* ── the detectors ───────────────────────────────────────────────────────── */

/** This period against the same calendar period a year ago. */
function yearOnYear(src: Sources, win: Window): Insight | null {
  const shift = (t: number) => t - 365 * DAY;
  const inRange = (iso: string, from: number, to: number) => {
    const t = new Date(iso).getTime();
    return t >= from && t < to;
  };

  const sessionsIn = (from: number, to: number) =>
    new Set(src.workouts.filter((w) => inRange(w.startedAt, from, to)).map((w) => w.startedAt.slice(0, 10))).size;
  const stepsIn = (from: number, to: number) => {
    const vals = src.days.filter((d) => inRange(d.date, from, to))
      .map((d) => d.activity.steps).filter((v): v is number => !!v);
    return vals.length ? mean(vals) : null;
  };

  const nowSessions = sessionsIn(win.from, win.to);
  const thenSessions = sessionsIn(shift(win.from), shift(win.to));
  const nowSteps = stepsIn(win.from, win.to);
  const thenSteps = stepsIn(shift(win.from), shift(win.to));

  if (thenSteps === null && !thenSessions) return null;

  const bits: string[] = [];
  if (nowSteps !== null && thenSteps !== null) {
    const d = ((nowSteps - thenSteps) / thenSteps) * 100;
    bits.push(`${nf(nowSteps)} steps a day now against ${nf(thenSteps)} then (${d >= 0 ? '+' : ''}${d.toFixed(0)}%)`);
  }
  if (thenSessions) {
    bits.push(`${nowSessions} session${nowSessions === 1 ? '' : 's'} now against ${thenSessions}`);
  }
  if (!bits.length) return null;

  return {
    key: 'yoy',
    tag: 'A year ago',
    tagColor: TAG_INFO,
    title: 'The same stretch, last year',
    body: `Measured over the same calendar days twelve months apart: ${bits.join(', and ')}.`,
    source: 'From the same calendar window in the previous year',
    metric: nowSteps !== null && thenSteps !== null
      ? {
        value: `${((nowSteps - thenSteps) / thenSteps) * 100 >= 0 ? '+' : ''}${(((nowSteps - thenSteps) / thenSteps) * 100).toFixed(0)}%`,
        unit: 'steps a day',
      }
      : { value: String(nowSessions), unit: 'sessions' },
  };
}

/** Which days of the week the training actually lands on. */
function trainingWeek(src: Sources): Insight | null {
  const recent = src.workouts.filter(
    (w) => new Date(w.startedAt).getTime() >= Date.now() - 365 * DAY && isStrengthWorkout(w),
  );
  if (recent.length < 12) return null;

  const byDay = new Array(7).fill(0) as number[];
  const seen = new Set<string>();
  for (const w of recent) {
    const key = w.startedAt.slice(0, 10);
    if (seen.has(key)) continue;
    seen.add(key);
    byDay[(new Date(`${key}T12:00:00Z`).getUTCDay() + 6) % 7]++;
  }
  const total = byDay.reduce((a, b) => a + b, 0);
  if (!total) return null;

  const ranked = byDay.map((n, i) => ({ day: WEEKDAYS[i], n })).sort((a, b) => b.n - a.n);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];

  return {
    key: 'weekshape',
    tag: 'Pattern',
    tagColor: TAG_INFO,
    title: `${top.day} is your training day`,
    body: `Across the last year, ${top.n} of ${total} strength sessions landed on a ${top.day} and only ${bottom.n} on a ${bottom.day}. That is the shape of the week you actually train, which is worth knowing when you plan around it.`,
    source: `From ${total} strength days over 12 months`,
    metric: { value: `${Math.round((top.n / total) * 100)}%`, unit: `on a ${top.day}` },
  };
}

/** Whether the current month is unusually strong or quiet by your own standards. */
function monthRanking(src: Sources): Insight | null {
  const byMonth = new Map<string, Set<string>>();
  for (const w of src.workouts) {
    const key = w.startedAt.slice(0, 7);
    if (!byMonth.has(key)) byMonth.set(key, new Set());
    byMonth.get(key)!.add(w.startedAt.slice(0, 10));
  }
  if (byMonth.size < 6) return null;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const counts = [...byMonth.entries()]
    .filter(([k]) => k !== thisMonth)
    .map(([k, v]) => ({ month: k, n: v.size }))
    .sort((a, b) => b.n - a.n);
  if (!counts.length) return null;

  const current = byMonth.get(thisMonth)?.size ?? 0;
  const best = counts[0];
  const rank = counts.filter((c) => c.n > current).length + 1;
  const median = counts[Math.floor(counts.length / 2)].n;
  const [by, bm] = best.month.split('-');

  return {
    key: 'monthrank',
    tag: 'Consistency',
    tagColor: current >= median ? TAG_GOOD : TAG_WATCH,
    title: rank === 1
      ? 'Your busiest month on record'
      : `${ordinal(rank)} busiest month of ${counts.length + 1} on record`,
    body: `${current} session day${current === 1 ? '' : 's'} so far this month, against a median of ${median} across ${counts.length} recorded months. Your best was ${best.n} in ${MONTHS[Number(bm) - 1]} ${by}.`,
    source: `From ${counts.length + 1} months of logged sessions`,
    metric: { value: ordinal(rank), unit: `of ${counts.length + 1} months` },
  };
}

/** Where the weight is heading at the rate it is currently moving. */
function weightTrajectory(src: Sources): Insight | null {
  const cutoff = Date.now() - 90 * DAY;
  const readings = src.weighIns
    .filter((r) => r.weight > 0 && new Date(r.date).getTime() >= cutoff)
    .map((r) => ({ date: r.date.slice(0, 10), weight: r.weight }));
  if (readings.length < 8) return null;

  const fit = fitReadings(readings);
  if (!fit) return null;

  const perWeek = fit.slope * 7;
  const latest = readings[readings.length - 1].weight;
  const flat = Math.abs(perWeek) < 0.05;

  // r² says how much of the movement the straight line actually accounts for.
  // A low value means the readings are scattered, and a projection off it would
  // be a line drawn through noise.
  const trustworthy = fit.r2 >= 0.25;

  const direction = perWeek < 0 ? 'down' : 'up';
  const body = flat
    ? `Weight has been effectively level for 90 days — ${nf(perWeek, 2)} kg a week, which is inside the noise of the scale itself.`
    : trustworthy
      ? `Weight is moving ${direction} at ${nf(Math.abs(perWeek), 2)} kg a week over 90 days. Held at that rate, ${nf(latest, 1)} kg becomes about ${nf(latest + perWeek * 4, 1)} kg in a month. The line accounts for ${Math.round(fit.r2 * 100)}% of the movement, so treat it as a direction rather than a forecast.`
      : `The 90-day trend points ${direction} at ${nf(Math.abs(perWeek), 2)} kg a week, but the readings scatter enough that the line only accounts for ${Math.round(fit.r2 * 100)}% of the movement. That is not yet a trend worth projecting from.`;

  return {
    key: 'trajectory',
    tag: 'Body composition',
    tagColor: TAG_INFO,
    title: flat ? 'Weight is holding' : `Weight is trending ${direction}`,
    body,
    source: `Least-squares fit over ${readings.length} weigh-ins, 90 days`,
    metric: { value: `${perWeek < 0 ? '−' : '+'}${nf(Math.abs(perWeek), 2)}`, unit: 'kg a week' },
  };
}

/** Whether sleep and next-day activity move together, stated as association only. */
function sleepAndActivity(src: Sources): Insight | null {
  const byDate = new Map(src.days.map((d) => [d.date.slice(0, 10), d] as const));
  const pairs: Array<[number, number]> = [];
  for (const d of src.days) {
    const sleep = d.sleep.totalMin;
    if (!sleep) continue;
    const next = byDate.get(new Date(new Date(`${d.date.slice(0, 10)}T12:00:00Z`).getTime() + DAY).toISOString().slice(0, 10));
    const steps = next?.activity.steps;
    if (!steps) continue;
    pairs.push([sleep / 60, steps]);
  }

  const r = correlation(pairs);
  if (r === null || Math.abs(r) < 0.15) return null;

  const dir = r > 0 ? 'more' : 'fewer';
  return {
    key: 'sleepsteps',
    tag: 'Recovery',
    tagColor: TAG_INFO,
    title: 'Sleep and the next day move together',
    body: `Across ${pairs.length} nights, longer sleep is associated with ${dir} steps the following day — ${strength(r)} relationship (r = ${r.toFixed(2)}). Which way the causation runs is not something this data can tell you: a day that was always going to be busy also shortens the night before it.`,
    source: `From ${pairs.length} nights paired with the following day`,
    metric: { value: `r ${r.toFixed(2)}`, unit: 'association' },
  };
}

/** The longest run of training days on record, against the current one. */
function streakRecord(src: Sources): Insight | null {
  const days = [...new Set(src.workouts.map((w) => w.startedAt.slice(0, 10)))].sort();
  if (days.length < 20) return null;

  let best = 1;
  let bestEnd = days[0];
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = (Date.parse(`${days[i]}T12:00:00Z`) - Date.parse(`${days[i - 1]}T12:00:00Z`)) / DAY;
    run = gap === 1 ? run + 1 : 1;
    if (run > best) { best = run; bestEnd = days[i]; }
  }

  // The current run only counts if it reaches yesterday; a streak that ended
  // three weeks ago is not a streak you are on.
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const gap = (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${days[i]}T12:00:00Z`)) / DAY;
    if (gap > current + 1) break;
    current = Math.max(current, gap === current ? current : current + 1);
    if (i > 0) {
      const step = (Date.parse(`${days[i]}T12:00:00Z`) - Date.parse(`${days[i - 1]}T12:00:00Z`)) / DAY;
      if (step !== 1) break;
    }
  }

  return {
    key: 'streak',
    tag: 'Consistency',
    tagColor: current >= best ? TAG_GOOD : MUTED,
    title: current >= best && current > 1 ? 'Your longest streak, right now' : `Longest streak: ${best} days`,
    body: `${best} consecutive days with a session, ending ${new Date(`${bestEnd}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.${current > 1 ? ` You are on ${current} days now.` : ' Nothing running at the moment.'}`,
    source: `From ${days.length} session days on record`,
    metric: { value: String(best), unit: 'day best streak' },
  };
}

/** How much of the year has carried any activity at all. */
function coverage(src: Sources): Insight | null {
  if (src.days.length < 200) return null;
  const year = new Date().getFullYear();
  const thisYear = src.days.filter((d) => d.date.startsWith(String(year)));
  const active = thisYear.filter((d) => (d.activity.steps ?? 0) >= TARGETS.stepGoal * 0.8).length;
  if (!thisYear.length) return null;

  const pct = Math.round((active / thisYear.length) * 100);
  return {
    key: 'coverage',
    tag: 'Activity',
    tagColor: pct >= 50 ? TAG_GOOD : TAG_INFO,
    title: `${pct}% of days this year hit the step goal`,
    body: `${active} of ${thisYear.length} recorded days in ${year} reached ${nf(TARGETS.stepGoal * 0.8)} steps or more. The dashboard holds ${nf(src.days.length)} days going back to ${src.days[0]?.date.slice(0, 10)}.`,
    source: `From ${thisYear.length} recorded days in ${year}`,
    metric: { value: `${pct}%`, unit: 'of days at goal' },
  };
}

/** Everything the history can say, best-evidence first. */
export function historyInsights(src: Sources, win: Window): Insight[] {
  return [
    monthRanking(src),
    weightTrajectory(src),
    yearOnYear(src, win),
    trainingWeek(src),
    streakRecord(src),
    sleepAndActivity(src),
    coverage(src),
  ].filter((x): x is Insight => x !== null);
}
