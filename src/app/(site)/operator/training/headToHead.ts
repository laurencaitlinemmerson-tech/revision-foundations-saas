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
    fairnessNote:
      'Three of the five rounds are ratios against each of your own targets, so body size is never the contest. A number missing on either side leaves the round uncalled — an unsynced watch never hands the other person a win.',
  };
}

export type HeadToHeadVals = ReturnType<typeof deriveHeadToHead>;
