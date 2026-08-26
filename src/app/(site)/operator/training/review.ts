import type { HealthDay, Lift, WeighIn, Workout } from '../daily-log/data';
import type { Findings } from '@/lib/health/whatWorked';

import { AMBER, GREEN, MUTED, PLUM, ROSE, SOFT } from './palette';

/**
 * This week, measured against what has actually worked for you.
 *
 * Every other screen compares the week to a target someone chose. This compares
 * it to the levels you were running at during the stretches where your weight
 * actually came off — which is a bar you have already cleared, for weeks at a
 * time, rather than one taken from an article.
 *
 * A lever only appears when the record's difference points the way the body
 * does. Your losing stretches happen to show *less* sleep than your holding
 * ones, which is a coverage artefact of a sparse sleep log; surfacing that as a
 * lever would turn a gap in the data into advice to sleep less. Those are named
 * and set aside instead.
 */

const DAY = 86_400_000;

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

type Src = { days: HealthDay[]; workouts: Workout[]; lifts: Lift[]; weighIns: WeighIn[] };

/** Which way the body goes, independent of what any one record happens to show. */
const DIRECTION: Record<string, 'higher' | 'lower'> = {
  sessions: 'higher',
  steps: 'higher',
  exercise: 'higher',
  active: 'higher',
  protein: 'higher',
  intake: 'lower',
  sleep: 'higher',
  rhr: 'lower',
};

/** How each lever is read out of a day. Sessions are counted, not averaged. */
const OF: Record<string, (d: HealthDay) => number | null> = {
  steps: (d) => d.activity.steps,
  exercise: (d) => d.activity.exerciseMinutes,
  active: (d) => d.activity.activeEnergyKcal,
  protein: (d) => d.nutrition.proteinG,
  intake: (d) => d.nutrition.dietaryEnergyKcal,
  sleep: (d) => (d.sleep.totalMin === null ? null : d.sleep.totalMin / 60),
  rhr: (d) => d.heart.restingHr,
};

export type Lever = {
  key: string;
  label: string;
  unit: string;
  /** This week. */
  now: number | null;
  nowLabel: string;
  /** The level held during the stretches that worked. */
  worked: number;
  workedLabel: string;
  /** How far this week sits from that level, in the lever's own unit. */
  gapLabel: string;
  /** Where this week sits against that level, as a share for a bar. */
  pct: number;
  onTrack: boolean;
  colour: string;
  /** Days of the week that carried this measure. */
  covered: number;
  /** How far short of the level that worked, in the direction that matters. */
  shortfall: number;
};

export type ReviewView = {
  ok: boolean;
  note: string;
  weekLabel: string;
  spanLabel: string;

  /** What the scale did over the week, and whether that is the plan. */
  weightLine: string;
  weightColour: string;

  headline: string;
  headlineColour: string;

  levers: Lever[];
  /** The single furthest from the level that worked. */
  focus: { label: string; line: string } | null;
  /** Levers the record disagrees with the body about, named rather than used. */
  setAside: string[];
  benchNote: string;
};

const EMPTY: ReviewView = {
  ok: false, note: '', weekLabel: '', spanLabel: '', weightLine: '', weightColour: MUTED,
  headline: '', headlineColour: MUTED, levers: [], focus: null, setAside: [], benchNote: '',
};

export function buildReview(
  src: Src,
  findings: Findings | null,
  loaded: boolean,
  targetKgPerWeek: number,
  today: string,
): ReviewView {
  if (!loaded) return { ...EMPTY, note: 'Reading the record…' };
  if (!findings?.ok) {
    return {
      ...EMPTY,
      note: 'The week can only be reviewed against the stretches that worked, and those need the whole record. It could not be read.',
    };
  }

  const shift = (d: string, n: number) =>
    new Date(Date.parse(`${d}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);

  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) dates.push(shift(today, -i));
  const from = dates[0];

  const dayBy = new Map(src.days.map((d) => [d.date.slice(0, 10), d] as const));
  const rows = dates.map((d) => dayBy.get(d)).filter((d): d is HealthDay => !!d);

  const sessionDates = new Set<string>([
    ...src.lifts.map((l) => l.performedOn.slice(0, 10)),
    ...src.workouts.map((w) => w.startedAt.slice(0, 10)),
  ]);
  const sessionsThisWeek = dates.filter((d) => sessionDates.has(d)).length;

  const meanOf = (of: (d: HealthDay) => number | null) => {
    const vals = rows.map(of).filter((v): v is number => typeof v === 'number' && v > 0);
    return { value: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null, covered: vals.length };
  };

  /* the levers ------------------------------------------------------------ */

  const setAside: string[] = [];
  const levers: Lever[] = [];

  for (const c of findings.contrasts) {
    if (!c.trustworthy || c.losing === null || c.other === null) continue;

    const want = DIRECTION[c.key];
    if (!want) continue;

    // The record has to agree with the body about which way this lever runs,
    // or it is a gap in the logging wearing the costume of a finding.
    const recordSays = c.losing > c.other ? 'higher' : 'lower';
    if (recordSays !== want) { setAside.push(c.label); continue; }

    // A difference smaller than a twentieth is not a lever, it is a rounding.
    if (Math.abs(c.losing - c.other) < Math.abs(c.other) * 0.05) continue;

    const dp = c.unit === 'h/night' || c.unit === '/week' ? 1 : 0;
    const now = c.key === 'sessions'
      ? { value: sessionsThisWeek, covered: 7 }
      : meanOf(OF[c.key]);

    const worked = c.losing;
    const onTrack = now.value === null ? false
      : want === 'higher' ? now.value >= worked * 0.95 : now.value <= worked * 1.05;

    levers.push({
      key: c.key,
      label: c.label,
      unit: c.unit,
      now: now.value,
      nowLabel: now.value === null ? '—' : nf(now.value, dp),
      worked,
      workedLabel: nf(worked, dp),
      gapLabel: now.value === null
        ? 'nothing logged this week'
        : (() => {
          const diff = now.value - worked;
          if (Math.abs(diff) < Math.abs(worked) * 0.03) return 'about level with it';
          const word = want === 'higher'
            ? (diff < 0 ? 'below' : 'above')
            : (diff > 0 ? 'above' : 'below');
          return `${nf(Math.abs(diff), dp)} ${c.unit.replace('/', ' a ')} ${word}`;
        })(),
      pct: now.value === null || worked === 0 ? 0 : Math.min(140, (now.value / worked) * 100),
      // How far this week falls short in the direction that matters. Intake is
      // the reason this cannot be read off the bar: being over the level that
      // worked is the shortfall there, and being under it is fine.
      shortfall: now.value === null || worked === 0 ? 0
        : ((want === 'higher' ? worked - now.value : now.value - worked) / Math.abs(worked)),
      onTrack,
      colour: now.value === null ? MUTED : onTrack ? GREEN : AMBER,
      covered: now.covered,
    });
  }

  // Furthest from the level that worked, and measurable — that is the one thing
  // worth changing, and naming one is the whole point of a review.
  const ranked = levers
    .filter((l) => l.now !== null && !l.onTrack)
    .sort((a, b) => b.shortfall - a.shortfall);
  const worst = ranked[0] ?? null;

  /* what the scale did ---------------------------------------------------- */

  const weighs = src.weighIns
    .filter((w) => w.weight > 0 && w.date.slice(0, 10) >= from && w.date.slice(0, 10) <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const prevWeighs = src.weighIns
    .filter((w) => w.weight > 0 && w.date.slice(0, 10) >= shift(from, -7) && w.date.slice(0, 10) < from);

  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const thisAvg = avg(weighs.map((w) => w.weight));
  const lastAvg = avg(prevWeighs.map((w) => w.weight));
  const change = thisAvg !== null && lastAvg !== null ? thisAvg - lastAvg : null;

  // A change smaller than this is the scale's own noise, not a direction.
  const LEVEL_KG = 0.05;
  const moved = change === null ? null
    : change <= -LEVEL_KG ? 'down' : change >= LEVEL_KG ? 'up' : 'level';

  const weightLine = change === null
    ? weighs.length
      ? `${weighs.length} weigh-in${weighs.length === 1 ? '' : 's'} this week, but none the week before to compare against.`
      : 'No weigh-ins this week, so the scale has nothing to say about it.'
    : moved === 'level'
      ? `The week's average was ${nf(thisAvg as number, 1)} kg, the same as the week before, against a plan of ${nf(targetKgPerWeek, 1)} kg a week.`
      : `The week's average was ${nf(thisAvg as number, 1)} kg against ${nf(lastAvg as number, 1)} the week before — ${moved} ${nf(Math.abs(change), 2)} kg, on a plan of ${nf(targetKgPerWeek, 1)} kg a week.`;

  const held = change !== null && change <= -targetKgPerWeek * 0.6;
  const weightColour = change === null ? MUTED
    : held ? GREEN : moved === 'down' ? AMBER : moved === 'level' ? MUTED : ROSE;

  const onTrackCount = levers.filter((l) => l.onTrack).length;
  const leverLine = `${onTrackCount} of ${levers.length} lever${levers.length === 1 ? '' : 's'} ${onTrackCount === 1 ? 'was' : 'were'} at the level that has worked before`;

  const headline = change === null
    ? levers.length
      ? `${leverLine}, and no weigh-in to check them against.`
      : 'Not enough logged this week to review it.'
    : held
      ? `The week did what the plan asked, and ${leverLine}.`
      : moved === 'down'
        ? `The weight moved the right way but short of the plan, and ${leverLine}.`
        : moved === 'level'
          ? `The weight held rather than fell, and ${leverLine}.`
          : `The weight went the wrong way, and ${leverLine}.`;

  return {
    ok: true,
    note: '',
    weekLabel: `Week to ${new Date(`${today}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })}`,
    spanLabel: `${new Date(`${from}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} – ${new Date(`${today}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`,
    weightLine,
    weightColour,
    headline,
    headlineColour: change === null ? SOFT : held ? GREEN : moved === 'up' ? ROSE : AMBER,
    levers,
    focus: worst
      ? {
        label: worst.label,
        line: `${worst.label} is the furthest from what worked: ${worst.nowLabel} ${worst.unit.replace('/', 'a ')} against ${worst.workedLabel}. That is the one to move next week — the others are close enough that changing them would be noise.`,
      }
      : levers.length
        ? { label: 'Nothing', line: 'Every measured lever is at or above the level it ran at during the stretches where the weight came off. There is nothing here worth changing.' }
        : null,
    setAside,
    benchNote: `The bar for each lever is what you averaged during the stretches where your weight was actually falling — not a target, a level you have already held for weeks at a time.`,
  };
}

export const reviewPalette = { plum: PLUM };
