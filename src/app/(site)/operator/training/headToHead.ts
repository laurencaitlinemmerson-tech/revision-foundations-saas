import {
  CHALLENGES, challengeValue, winnerOf,
  type ChallengeId, type DayEntry, type PeerPayload,
} from '@/lib/peer/contract';
import { GREEN, MUTED, PINK, PLUM, ROSE, SOFT } from './palette';

/**
 * Head to head, from the two peer documents.
 *
 * The scoreboard is a pure function of data both sides already hold, so there is
 * nothing to agree on at runtime. What does have to match is the five rounds and
 * the winner rule, and those live in the shared contract rather than here — this
 * module only turns the result into something to look at.
 */

const DASH = '—';

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtMins = (m: number | null) =>
  m === null ? DASH : `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, '0')}m`;

/** How each round's raw value should read on screen. */
function roundText(id: ChallengeId, v: number | null, p: PeerPayload | null): string {
  if (v === null) return DASH;
  switch (id) {
    case 'steps-week': return nf(v);
    case 'protein-week': {
      const total = p?.weekTotals.proteinG;
      const target = p?.targets.proteinG;
      return total && target ? `${Math.round(v * 100)}%  ·  ${nf(total)} / ${nf(target * 7)} g` : `${Math.round(v * 100)}%`;
    }
    case 'weight-lost': {
      const g = p?.goal;
      return g?.toGoKg != null ? `${Math.round(v * 100)}%  ·  ${nf(g.toGoKg, 1)} kg to go` : `${Math.round(v * 100)}%`;
    }
    case 'gym-week': return `${nf(v)} / 7`;
    case 'sleep-week': return `${nf(v)} / 7 nights`;
  }
}

const ROUND_NOTES: Record<ChallengeId, string> = {
  'steps-week': 'Total steps, Monday to today',
  'protein-week': 'Against each of your own targets',
  'weight-lost': 'Progress toward each of your own goals',
  'gym-week': 'Days with a weights session',
  'sleep-week': 'Nights of seven hours or more',
};

/**
 * Head to head runs on the week, and only the week.
 *
 * The contract publishes weekTotals under rules both sides compute identically,
 * so both screens show the same result. Day and month views belong on the
 * personal screens, where this side owns all the data and nobody else has to
 * agree with the arithmetic.
 */
/**
 * What it would take to win a round you are losing.
 *
 * A scoreboard that only reports the result is a thing to look at. Naming the
 * gap in the round's own units — steps a day, one more session, grams of protein
 * — turns it into something you can act on before the week is out.
 */
function gapFor(
  id: ChallengeId,
  mine: number | null,
  theirs: number | null,
  me: PeerPayload | null,
): string | null {
  if (mine === null || theirs === null || mine >= theirs) return null;
  const short = theirs - mine;
  const daysLeft = Math.max(1, 7 - (me?.score.daysElapsed ?? 7));

  switch (id) {
    case 'steps-week':
      return `${nf(Math.ceil(short))} steps behind — about ${nf(Math.ceil(short / daysLeft))} a day for the rest of the week.`;
    case 'protein-week': {
      const target = me?.targets.proteinG;
      if (!target) return 'Behind on protein against your own target.';
      // The round is a ratio of a weekly target, so the gap converts back to grams.
      const grams = short * target * 7;
      return `${nf(Math.ceil(grams))} g of protein behind — roughly ${nf(Math.ceil(grams / daysLeft))} g a day to close it.`;
    }
    case 'weight-lost':
      return 'Behind on progress toward your own goal — this one moves slowly and is not worth chasing inside a week.';
    case 'gym-week':
      return short <= 1
        ? 'One more session takes this round.'
        : `${Math.ceil(short)} more sessions to take this round.`;
    case 'sleep-week':
      return short <= 1
        ? 'One more night of seven hours takes this round.'
        : `${Math.ceil(short)} more nights of seven hours or more.`;
  }
}

export type HeadToHeadState = { dayOffset: number };

function cardFor(p: PeerPayload | null, day: DayEntry | null, accent: string, isLeader: boolean) {
  if (!p) return null;
  const today = day ?? { ...p.today, day: '' };
  const net = today.net;

  return {
    name: p.athlete,
    initial: p.athlete.slice(0, 1).toUpperCase(),
    isLeader,
    accent,
    avatarUrl: p.avatarUrl,
    journey: p.goal.startKg !== null && p.weightKg !== null
      ? `${nf(p.goal.startKg, 1)} → ${nf(p.weightKg, 1)} kg`
      : p.weightKg !== null ? `${nf(p.weightKg, 1)} kg` : 'No weight published',
    vitals: [
      p.heightCm === null ? null : `${nf(p.heightCm)} cm`,
      p.weightKg === null ? null : `${nf(p.weightKg, 1)} kg`,
      p.bodyFat === null ? null : `${nf(p.bodyFat, 1)}% bf`,
    ].filter((x): x is string => x !== null).join('  ·  ') || 'Nothing published',

    headline: today.steps === null ? DASH : nf(today.steps),
    headlineNote: p.weekTotals.steps === null ? 'No steps this week' : `Week ${nf(p.weekTotals.steps)}`,

    weekRows: [
      { label: 'Gym sessions', value: nf(p.weekTotals.gymSessions) },
      { label: 'Runs', value: nf(p.weekTotals.runs) },
      { label: 'Nights 7h+', value: p.weekTotals.sleepNights7h === null ? DASH : nf(p.weekTotals.sleepNights7h) },
    ],

    dayRows: [
      { label: 'Calories in', value: today.caloriesIn === null ? DASH : nf(today.caloriesIn), color: SOFT },
      { label: 'Calories out', value: today.caloriesOut === null ? DASH : nf(today.caloriesOut), color: SOFT },
      {
        label: 'Net',
        value: net === null ? DASH : `${net > 0 ? '+' : '−'}${nf(Math.abs(net))}`,
        color: net === null ? MUTED : net <= 0 ? GREEN : ROSE,
      },
      { label: 'Protein', value: today.proteinG === null ? DASH : `${nf(today.proteinG)} g`, color: SOFT },
      { label: 'Carbs', value: today.carbsG === null ? DASH : `${nf(today.carbsG)} g`, color: SOFT },
      { label: 'Fat', value: today.fatG === null ? DASH : `${nf(today.fatG)} g`, color: SOFT },
      { label: 'Sleep', value: fmtMins(today.sleepMinutes), color: SOFT },
    ],

    goalLabel: p.goal.goalKg === null ? 'Goal' : `Goal ${nf(p.goal.goalKg, 1)} kg`,
    goalText: p.goal.pct === null ? DASH : `${Math.round(p.goal.pct * 100)}%`,
    goalPct: `${Math.round((p.goal.pct ?? 0) * 100)}%`,

    // [] means "logged nothing today"; null means "does not publish food".
    food: today.food === null
      ? null
      : today.food.map((f, i) => ({
        key: `${f.name}-${i}`,
        name: f.name,
        meta: [f.category, f.at].filter(Boolean).join(' · ') || null,
        kcal: f.kcal === null ? DASH : `${nf(f.kcal)} kcal`,
        macros: [
          f.proteinG === null ? null : `P ${nf(f.proteinG)}`,
          f.carbsG === null ? null : `C ${nf(f.carbsG)}`,
          f.fatG === null ? null : `F ${nf(f.fatG)}`,
        ].filter(Boolean).join('  ') || null,
      })),
    foodTotal: today.caloriesIn === null ? DASH : `${nf(today.caloriesIn)} kcal`,
    updatedAt: p.updatedAt ? p.updatedAt.slice(11, 16) : DASH,
  };
}

const PEER_ERRORS: Record<string, string> = {
  unreachable: 'Their site did not answer. Your own numbers are unaffected.',
  timeout: 'Their site took too long to answer. Your own numbers are unaffected.',
  'bad-version': 'They are publishing a different contract version.',
  'no-athlete': 'Their document arrived without a name on it.',
  'stale-week': 'Their document is for a different week, so it is not being shown — a stale week rendered as live would be misleading.',
  malformed: 'Their document did not have the expected shape.',
};

export function deriveHeadToHead(
  you: PeerPayload | null,
  them: PeerPayload | null,
  st: HeadToHeadState,
  meta: { loaded: boolean; configured: boolean; peerError: string | null },
) {
  const rounds = CHALLENGES.map((c) => {
    const a = challengeValue(c.id, you);
    const b = challengeValue(c.id, them);
    const winner = winnerOf(a, b);
    const share = a !== null && b !== null && a + b > 0 ? (a / (a + b)) * 100 : 50;
    return {
      key: c.id,
      label: c.label,
      note: a === null || b === null ? 'Not published on both sides' : ROUND_NOTES[c.id],
      you: roundText(c.id, a, you),
      them: roundText(c.id, b, them),
      winner,
      youLead: winner === 'you',
      themLead: winner === 'them',
      youShare: `${share.toFixed(1)}%`,
      // What closing it would actually take, in the round's own units.
      gap: gapFor(c.id, a, b, you),
    };
  });

  const yourPoints = rounds.filter((r) => r.winner === 'you').length;
  const theirPoints = rounds.filter((r) => r.winner === 'them').length;
  const decided = rounds.filter((r) => r.winner !== null).length;
  const leader = yourPoints > theirPoints ? 'you' : theirPoints > yourPoints ? 'them' : 'tie';

  const youName = you?.athlete ?? 'You';
  const themName = them?.athlete ?? 'Them';
  const scoreline = !them
    ? 'Waiting on the other side'
    : !decided
      ? 'No rounds settled yet'
      : leader === 'tie'
        ? `Level at ${yourPoints}–${theirPoints}`
        : leader === 'you'
          ? `${youName} leads ${yourPoints}–${theirPoints}`
          : `${themName} leads ${theirPoints}–${yourPoints}`;

  // days[0] is today; the offset walks backwards through the published fortnight.
  const pick = (p: PeerPayload | null) => p?.days?.[st.dayOffset] ?? null;
  const yourDay = pick(you);
  const theirDay = pick(them);
  const dayKey = yourDay?.day ?? theirDay?.day ?? null;
  const maxBack = Math.max(you?.days?.length ?? 1, them?.days?.length ?? 1) - 1;

  const dayLabel = st.dayOffset === 0
    ? 'Today'
    : st.dayOffset === 1
      ? 'Yesterday'
      : dayKey
        ? new Date(`${dayKey}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
        : DASH;

  return {
    loaded: meta.loaded,
    configured: meta.configured,
    connected: Boolean(them),
    peerMessage: meta.peerError ? (PEER_ERRORS[meta.peerError] ?? PEER_ERRORS.malformed) : null,
    scoreline,
    leader,
    yourPoints,
    theirPoints,
    roundsDecided: decided,
    roundsTotal: rounds.length,
    rounds,
    weekLabel: you?.week ? `Week of ${new Date(`${you.week}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'This week',
    dayLabel,
    dayOffset: st.dayOffset,
    maxBack,
    you: cardFor(you, yourDay, PLUM, leader === 'you'),
    them: cardFor(them, theirDay, PINK, leader === 'them'),
    // Rounds still in reach, closest first — worth spending the rest of the week
    // on, rather than the ones already gone.
    plan: rounds
      .filter((r) => r.themLead && r.gap)
      .map((r) => ({ key: r.key, label: r.label, gap: r.gap as string })),
    planNote: theirPoints > yourPoints
      ? `${theirPoints - yourPoints} round${theirPoints - yourPoints === 1 ? '' : 's'} behind, with the week still running.`
      : yourPoints > theirPoints
        ? 'Ahead. These are the rounds still in play.'
        : 'Level. These are the rounds still in play.',
    fairnessNote:
      'Three of the five rounds are ratios against each of your own targets, so body size is never the contest. A number missing on either side leaves the round uncalled — an unsynced watch never hands the other person a win.',
  };
}

export type HeadToHeadVals = ReturnType<typeof deriveHeadToHead>;
