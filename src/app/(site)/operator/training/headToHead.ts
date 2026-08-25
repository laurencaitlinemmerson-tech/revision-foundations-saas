import type { PartnerDay } from '@/lib/operatorPartnerStorage';
import type { Sources } from './scoring';
import { GREEN, MUTED, PINK, PLUM, SOFT } from './palette';
import { TARGETS } from './targets';

/**
 * Head to head — the same week, scored twice.
 *
 * Two people, five rounds, a point for each round won. The rounds are chosen so
 * neither person can win them by being bigger: steps, sessions, runs and sleep
 * are the same task whoever does them, and protein is compared per kilo of
 * bodyweight rather than in absolute grams. Body weight itself is never a round,
 * because whose body is heavier is not a contest.
 *
 * A round with data on only one side is not awarded. Beating someone who did not
 * log is not the same as beating them.
 */

const DAY = 86_400_000;
const DASH = '—';

/** One day of the handful of metrics both sides can produce. */
export type PersonDay = {
  date: string;
  steps: number | null;
  gymSessions: number | null;
  runs: number | null;
  caloriesIn: number | null;
  caloriesOut: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  sleepMin: number | null;
  weightKg: number | null;
  bodyFat: number | null;
};

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Monday of the week containing `t`, at midnight. */
export function mondayOf(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime() - ((d.getDay() + 6) % 7) * DAY;
}

/* ── turning each side's sources into the same shape ─────────────────────── */

/** The operator's own day, assembled from Apple Health, lifts and the scale. */
export function daysFromSources(src: Sources, from: number, to: number): PersonDay[] {
  const liftDays = new Map<string, number>();
  for (const l of src.lifts) {
    const k = l.performedOn.slice(0, 10);
    liftDays.set(k, (liftDays.get(k) ?? 0) + 1);
  }
  // A "run" is any workout that covered ground; walking is already in the steps.
  const runDays = new Map<string, number>();
  for (const w of src.workouts) {
    if (!(w.distanceKm ?? 0) || /walk/i.test(w.type ?? '')) continue;
    const k = w.startedAt.slice(0, 10);
    runDays.set(k, (runDays.get(k) ?? 0) + 1);
  }
  const weighBy = new Map<string, { weight: number | null; bodyFat: number | null }>();
  for (const r of src.weighIns) {
    weighBy.set(r.date.slice(0, 10), {
      weight: r.weight > 0 ? r.weight : null,
      bodyFat: r.bodyFat > 0 ? r.bodyFat : null,
    });
  }

  const out: PersonDay[] = [];
  for (let t = from; t <= to; t += DAY) {
    const k = iso(t);
    const h = src.days.find((d) => d.date.slice(0, 10) === k) ?? null;
    const scale = weighBy.get(k) ?? null;
    out.push({
      date: k,
      steps: h?.activity.steps ?? null,
      gymSessions: liftDays.get(k) ? 1 : (h ? 0 : null),
      runs: runDays.get(k) ?? (h ? 0 : null),
      caloriesIn: h?.nutrition.dietaryEnergyKcal ?? null,
      caloriesOut: h?.activity.activeEnergyKcal ?? null,
      proteinG: h?.nutrition.proteinG ?? null,
      carbsG: h?.nutrition.carbsG ?? null,
      fatG: h?.nutrition.fatG ?? null,
      sleepMin: h?.sleep.totalMin ?? null,
      weightKg: scale?.weight ?? null,
      bodyFat: scale?.bodyFat ?? null,
    });
  }
  return out;
}

/** The partner's day, already stored in exactly this shape. */
export function daysFromPartner(rows: PartnerDay[], from: number, to: number): PersonDay[] {
  const by = new Map(rows.map((r) => [r.date.slice(0, 10), r] as const));
  const out: PersonDay[] = [];
  for (let t = from; t <= to; t += DAY) {
    const k = iso(t);
    const r = by.get(k);
    out.push({
      date: k,
      steps: r?.steps ?? null,
      gymSessions: r?.gymSessions ?? null,
      runs: r?.runs ?? null,
      caloriesIn: r?.caloriesIn ?? null,
      caloriesOut: r?.caloriesOut ?? null,
      proteinG: r?.proteinG ?? null,
      carbsG: r?.carbsG ?? null,
      fatG: r?.fatG ?? null,
      sleepMin: r?.sleepMin ?? null,
      weightKg: r?.weightKg ?? null,
      bodyFat: r?.bodyFat ?? null,
    });
  }
  return out;
}

/* ── the contest ─────────────────────────────────────────────────────────── */

const sum = (xs: Array<number | null>) => {
  const live = xs.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  return live.length ? live.reduce((a, b) => a + b, 0) : null;
};
const avg = (xs: Array<number | null>) => {
  const live = xs.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  return live.length ? live.reduce((a, b) => a + b, 0) / live.length : null;
};
const latest = (days: PersonDay[], pick: (d: PersonDay) => number | null) => {
  for (let i = days.length - 1; i >= 0; i--) {
    const v = pick(days[i]);
    if (v !== null && Number.isFinite(v)) return v;
  }
  return null;
};

/** The five rounds, in the order they are played. */
const ROUNDS = [
  { key: 'steps', label: 'Steps', note: 'Total for the week' },
  { key: 'sessions', label: 'Gym sessions', note: 'Days with a logged session' },
  { key: 'runs', label: 'Runs & rides', note: 'Distance workouts' },
  { key: 'sleep', label: 'Sleep', note: 'Average a night' },
  { key: 'protein', label: 'Protein per kg', note: 'Levelled for bodyweight' },
] as const;

export type RoundKey = (typeof ROUNDS)[number]['key'];

type Side = { days: PersonDay[]; weightKg: number | null };

function roundValue(key: RoundKey, side: Side): number | null {
  const d = side.days;
  switch (key) {
    case 'steps': return sum(d.map((x) => x.steps));
    case 'sessions': return sum(d.map((x) => x.gymSessions));
    case 'runs': return sum(d.map((x) => x.runs));
    case 'sleep': return avg(d.map((x) => x.sleepMin));
    case 'protein': {
      const p = avg(d.map((x) => x.proteinG));
      return p !== null && side.weightKg ? p / side.weightKg : null;
    }
  }
}

function roundText(key: RoundKey, v: number | null): string {
  if (v === null) return DASH;
  switch (key) {
    case 'steps': return nf(v);
    case 'sessions':
    case 'runs': return nf(v);
    case 'sleep': return `${Math.floor(v / 60)}h ${String(Math.round(v % 60)).padStart(2, '0')}m`;
    case 'protein': return `${nf(v, 2)} g/kg`;
  }
}

/** Consecutive days ending today that carried a session of any kind. */
function streakOf(days: PersonDay[]): number {
  let n = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if ((d.gymSessions ?? 0) > 0 || (d.runs ?? 0) > 0) n++;
    else break;
  }
  return n;
}

export type HeadToHeadState = {
  /** 0 is today; negative steps back through the week. */
  dayOffset: number;
  /** 0 is this week; negative steps back. */
  weekOffset: number;
};

export function deriveHeadToHead(
  you: { name: string; days: PersonDay[] },
  them: { name: string; days: PersonDay[] },
  st: HeadToHeadState,
  hasPartnerData: boolean,
) {
  const weekStart = mondayOf(Date.now()) + st.weekOffset * 7 * DAY;
  const weekEnd = weekStart + 6 * DAY;
  const inWeek = (d: PersonDay) => {
    const t = new Date(d.date).getTime();
    return t >= weekStart && t <= weekEnd;
  };

  const yourWeek = you.days.filter(inWeek);
  const theirWeek = them.days.filter(inWeek);

  const yourSide: Side = { days: yourWeek, weightKg: latest(you.days, (d) => d.weightKg) };
  const theirSide: Side = { days: theirWeek, weightKg: latest(them.days, (d) => d.weightKg) };

  const rounds = ROUNDS.map((r) => {
    const a = roundValue(r.key, yourSide);
    const b = roundValue(r.key, theirSide);
    // A round is only awarded when both sides logged it. Winning by default
    // because the other person forgot to log is not winning.
    const contested = a !== null && b !== null;
    const winner = !contested ? 'none' : a > b ? 'you' : b > a ? 'them' : 'tie';
    return {
      key: r.key,
      label: r.label,
      note: contested ? r.note : 'Not enough logged on both sides',
      you: roundText(r.key, a),
      them: roundText(r.key, b),
      winner,
      youLead: winner === 'you',
      themLead: winner === 'them',
      // The bar splits the round between them, so a close round looks close.
      youShare: contested && (a as number) + (b as number) > 0
        ? `${(((a as number) / ((a as number) + (b as number))) * 100).toFixed(1)}%`
        : '50%',
    };
  });

  const yourPoints = rounds.filter((r) => r.winner === 'you').length;
  const theirPoints = rounds.filter((r) => r.winner === 'them').length;
  const decided = rounds.filter((r) => r.winner !== 'none').length;

  const leader = yourPoints > theirPoints ? 'you' : theirPoints > yourPoints ? 'them' : 'tie';
  const scoreline = !decided
    ? 'No rounds settled yet'
    : leader === 'tie'
      ? `Level at ${yourPoints}–${theirPoints}`
      : leader === 'you'
        ? `${you.name} leads ${yourPoints}–${theirPoints}`
        : `${them.name} leads ${theirPoints}–${yourPoints}`;

  /* the week's challenge — a rotating headline round ---------------------- */

  const weekIndex = Math.floor(weekStart / (7 * DAY));
  const challengeKey = ROUNDS[weekIndex % ROUNDS.length].key as RoundKey;
  const challengeDef = ROUNDS.find((r) => r.key === challengeKey)!;
  const cYou = roundValue(challengeKey, yourSide);
  const cThem = roundValue(challengeKey, theirSide);
  const daysElapsed = Math.min(7, Math.max(0, Math.floor((Date.now() - weekStart) / DAY) + 1));
  const daysLeft = Math.max(0, 7 - daysElapsed);

  const challenge = {
    title: `${challengeDef.label} challenge`,
    note: challengeDef.note,
    you: roundText(challengeKey, cYou),
    them: roundText(challengeKey, cThem),
    youLead: cYou !== null && cThem !== null && cYou > cThem,
    themLead: cYou !== null && cThem !== null && cThem > cYou,
    youShare: cYou !== null && cThem !== null && cYou + cThem > 0
      ? `${((cYou / (cYou + cThem)) * 100).toFixed(1)}%`
      : '50%',
    timeLeft: st.weekOffset < 0
      ? 'Finished'
      : daysLeft === 0
        ? 'Last day'
        : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`,
  };

  /* the two person cards -------------------------------------------------- */

  const dayKey = iso(mondayOf(Date.now()) + st.weekOffset * 7 * DAY + st.dayOffset * DAY);

  const cardFor = (
    p: { name: string; days: PersonDay[] },
    week: PersonDay[],
    isLeader: boolean,
  ) => {
    const day = p.days.find((d) => d.date === dayKey) ?? null;
    const weightNow = latest(p.days, (d) => d.weightKg);
    const weightThen = p.days.find((d) => d.weightKg !== null)?.weightKg ?? null;
    const weekSteps = sum(week.map((d) => d.steps));
    const stepGoal = TARGETS.stepGoal * 7;

    const netCals = day && day.caloriesIn !== null && day.caloriesOut !== null
      ? day.caloriesIn - day.caloriesOut
      : null;

    return {
      name: p.name,
      initial: p.name.slice(0, 1).toUpperCase(),
      isLeader,
      journey: weightNow === null
        ? 'No weight logged'
        : weightThen !== null && Math.abs(weightThen - weightNow) >= 0.1
          ? `${nf(weightThen, 1)} → ${nf(weightNow, 1)} kg`
          : `${nf(weightNow, 1)} kg`,
      vitals: [
        weightNow === null ? null : `${nf(weightNow, 1)} kg`,
        latest(p.days, (d) => d.bodyFat) === null
          ? null
          : `${nf(latest(p.days, (d) => d.bodyFat) as number, 1)}% bf`,
      ].filter((x): x is string => x !== null).join('  ·  ') || 'Nothing logged',

      headline: day?.steps === null || day?.steps === undefined ? DASH : nf(day.steps),
      headlineNote: weekSteps === null ? 'No steps this week' : `Week ${nf(weekSteps)}`,

      weekRows: [
        { label: 'Gym sessions', value: sum(week.map((d) => d.gymSessions)) === null ? DASH : nf(sum(week.map((d) => d.gymSessions)) as number) },
        { label: 'Runs & rides', value: sum(week.map((d) => d.runs)) === null ? DASH : nf(sum(week.map((d) => d.runs)) as number) },
      ],

      dayRows: [
        { label: 'Calories in', value: day?.caloriesIn == null ? DASH : nf(day.caloriesIn), color: SOFT },
        { label: 'Calories out', value: day?.caloriesOut == null ? DASH : nf(day.caloriesOut), color: SOFT },
        {
          label: 'Net',
          value: netCals === null ? DASH : `${netCals > 0 ? '+' : '−'}${nf(Math.abs(netCals))}`,
          color: netCals === null ? MUTED : netCals <= 0 ? GREEN : SOFT,
        },
        { label: 'Protein', value: day?.proteinG == null ? DASH : `${nf(day.proteinG)} g`, color: SOFT },
        { label: 'Carbs', value: day?.carbsG == null ? DASH : `${nf(day.carbsG)} g`, color: SOFT },
        { label: 'Fat', value: day?.fatG == null ? DASH : `${nf(day.fatG)} g`, color: SOFT },
        {
          label: 'Sleep',
          value: day?.sleepMin == null
            ? DASH
            : `${Math.floor(day.sleepMin / 60)}h ${String(day.sleepMin % 60).padStart(2, '0')}m`,
          color: SOFT,
        },
      ],

      goalLabel: 'Weekly step goal',
      goalText: weekSteps === null ? DASH : `${nf(weekSteps)} / ${nf(stepGoal)}`,
      goalPct: weekSteps === null ? '0%' : `${Math.min(100, (weekSteps / stepGoal) * 100).toFixed(0)}%`,
      streak: streakOf(p.days),
    };
  };

  const dayLabel = (() => {
    const t = new Date(dayKey).getTime();
    const today = iso(Date.now());
    if (dayKey === today) return 'Today';
    if (dayKey === iso(Date.now() - DAY)) return 'Yesterday';
    return new Date(t).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  })();

  const weekLabel = st.weekOffset === 0
    ? 'This week'
    : st.weekOffset === -1
      ? 'Last week'
      : `Week of ${new Date(weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;

  return {
    hasPartnerData,
    scoreline,
    leader,
    yourPoints,
    theirPoints,
    roundsDecided: decided,
    roundsTotal: ROUNDS.length,
    challenge,
    rounds,
    weekLabel,
    weekRange: `${new Date(weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(weekEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    dayLabel,
    dayIsToday: dayKey === iso(Date.now()),
    you: cardFor(you, yourWeek, leader === 'you'),
    them: cardFor(them, theirWeek, leader === 'them'),
    fairnessNote:
      'Rounds are picked so neither of you can win them by being bigger — protein is compared per kilo, and bodyweight is never a round. A round with data on only one side is left unawarded.',
    accent: { you: PLUM, them: PINK },
  };
}

export type HeadToHeadVals = ReturnType<typeof deriveHeadToHead>;
