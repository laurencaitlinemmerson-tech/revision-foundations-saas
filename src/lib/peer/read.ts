import {
  CAPS, CONTRACT_VERSION, atwater, londonMonday, netOf, reading, sleepReading,
  type DayEntry, type FoodItem, type PeerPayload,
} from './contract';

/**
 * Reading the other side's document.
 *
 * It comes from a different codebase on a different deploy, and it can be
 * mid-redeploy, offline, or serving nonsense. Nothing in here throws on bad
 * input: anything of the wrong shape becomes null, and the whole payload is
 * rejected rather than half-trusted. It must never take this page down.
 */

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

const int = (v: unknown): number | null => {
  const n = reading(v);
  return n === null ? null : Math.round(n);
};

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

function foodOf(v: unknown): FoodItem[] | null {
  // [] is "logged nothing today"; null is "I do not publish my food". They mean
  // different things and both are legitimate, so the distinction is preserved.
  if (v === null || v === undefined) return null;
  if (!Array.isArray(v)) return null;
  return v
    .map((raw) => {
      const o = obj(raw);
      const name = str(o.name, CAPS.nameChars);
      if (!name) return null; // a row with no name is dropped
      const proteinG = reading(o.proteinG);
      const carbsG = reading(o.carbsG);
      const fatG = reading(o.fatG);
      return {
        name,
        category: str(o.category, 20),
        at: str(o.at, 20),
        kcal: reading(o.kcal) ?? atwater(proteinG, carbsG, fatG),
        proteinG, carbsG, fatG,
      };
    })
    .filter((x): x is FoodItem => x !== null)
    .slice(0, CAPS.foodPerDay);
}

function dayOf(v: unknown): DayEntry | null {
  const o = obj(v);
  const day = str(o.day, 10);
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const caloriesIn = int(o.caloriesIn);
  const caloriesOut = int(o.caloriesOut);
  return {
    day,
    steps: int(o.steps),
    caloriesIn,
    caloriesOut,
    // Recomputed rather than trusted, so a net that disagrees with its own
    // in and out cannot travel.
    net: netOf(caloriesIn, caloriesOut),
    proteinG: reading(o.proteinG),
    carbsG: reading(o.carbsG),
    fatG: reading(o.fatG),
    sleepMinutes: sleepReading(o.sleepMinutes),
    food: foodOf(o.food),
  };
}

export type PeerReadResult =
  | { ok: true; payload: PeerPayload }
  | { ok: false; reason: 'unreachable' | 'timeout' | 'bad-version' | 'no-athlete' | 'stale-week' | 'malformed' };

export function parsePeer(raw: unknown, expectedWeek = londonMonday()): PeerReadResult {
  const o = obj(raw);
  if (reading(o.v) !== CONTRACT_VERSION) return { ok: false, reason: 'bad-version' };

  const athlete = str(o.athlete, 40);
  if (!athlete) return { ok: false, reason: 'no-athlete' };

  // A stale week rendered as live is actively misleading — worse than nothing.
  const week = str(o.week, 10);
  if (week !== expectedWeek) return { ok: false, reason: 'stale-week' };

  const score = obj(o.score);
  const goal = obj(o.goal);
  const totals = obj(o.weekTotals);
  const today = obj(o.today);
  const todayIn = int(today.caloriesIn);
  const todayOut = int(today.caloriesOut);

  const days = Array.isArray(o.days)
    ? o.days.map(dayOf).filter((d): d is DayEntry => d !== null)
      .sort((a, b) => b.day.localeCompare(a.day)) // sorted here, not trusted
      .slice(0, CAPS.days)
    : null;

  return {
    ok: true,
    payload: {
      v: CONTRACT_VERSION,
      athlete,
      updatedAt: str(o.updatedAt, 40) ?? '',
      week,
      score: {
        points: int(score.points) ?? 0,
        consistency: int(score.consistency) ?? 0,
        adherence: int(score.adherence) ?? 0,
        streak: int(score.streak) ?? 0,
        streakDays: int(score.streakDays) ?? 0,
        sessions: int(score.sessions) ?? 0,
        sessionsPlanned: int(score.sessionsPlanned) ?? 0,
        deficitDays: int(score.deficitDays) ?? 0,
        daysElapsed: int(score.daysElapsed) ?? 0,
      },
      goal: {
        pct: reading(goal.pct),
        toGoKg: reading(goal.toGoKg),
        startKg: reading(goal.startKg),
        goalKg: reading(goal.goalKg),
      },
      heightCm: reading(o.heightCm),
      targets: { proteinG: reading(obj(o.targets).proteinG) },
      weightKg: reading(o.weightKg),
      bodyFat: reading(o.bodyFat),
      avatarUrl: (() => {
        const url = str(o.avatarUrl, 300);
        return url && url.startsWith('https://') ? url : null;
      })(),
      today: {
        steps: int(today.steps),
        caloriesIn: todayIn,
        caloriesOut: todayOut,
        net: netOf(todayIn, todayOut),
        proteinG: reading(today.proteinG),
        carbsG: reading(today.carbsG),
        fatG: reading(today.fatG),
        sleepMinutes: sleepReading(today.sleepMinutes),
        food: foodOf(today.food),
      },
      weekTotals: {
        steps: int(totals.steps),
        daysWithSteps: int(totals.daysWithSteps) ?? 0,
        gymSessions: int(totals.gymSessions) ?? 0,
        runs: int(totals.runs) ?? 0,
        proteinG: reading(totals.proteinG),
        sleepNights7h: int(totals.sleepNights7h),
      },
      days,
    },
  };
}

/** Fetch and parse the peer's document. Never throws. */
export async function fetchPeer(url: string, key: string, timeoutMs = 6000): Promise<PeerReadResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(`${url}${sep}key=${encodeURIComponent(key)}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return { ok: false, reason: 'unreachable' };
    return parsePeer(await res.json());
  } catch (e) {
    return { ok: false, reason: (e as Error)?.name === 'AbortError' ? 'timeout' : 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}
