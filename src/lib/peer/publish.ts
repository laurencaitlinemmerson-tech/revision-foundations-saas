import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isStrengthWorkout, isRunWorkout } from '@/lib/workoutKind';
import { JOURNEY } from '@/app/(site)/operator/training/targets';
import {
  CAPS, CONTRACT_VERSION, SESSIONS_PLANNED_PER_WEEK,
  daysBetween, daysElapsedInWeek, londonDate, londonISO, londonMonday,
  netOf, reading, scoreOf, shiftDays, sleepReading,
  type DayEntry, type PeerPayload,
} from './contract';

/**
 * Building this side's peer document from stored data.
 *
 * Served from the stored copy, never by reaching into Apple Health live: it has
 * to answer in a couple of seconds every time the other side's page renders.
 */

/** Values the contract needs that no source supplies. */
export const PEER_PROFILE = {
  athlete: 'Lauren',
  /** From DEFAULT_HEIGHT_M in the Apple Health importer — 1.5748 m. */
  heightCm: 157,
  /** Grams of protein a day, the target the weekly protein round is scored against. */
  proteinTargetG: 130,
  /**
   * The goal and its starting point both come from JOURNEY, so the figure Louis
   * sees is the same one the Goals screen shows. Deriving the start from the
   * earliest weigh-in on record made the peer document disagree with this side's
   * own dashboard, and reported progress against a weight from a different
   * attempt entirely.
   */
  goalKg: JOURNEY.goalKg,
  startKg: JOURNEY.startKg as number | null,
  avatarUrl: null as string | null,
} as const;

type MetricRow = Record<string, unknown>;

const n = (v: unknown) => reading(typeof v === 'string' ? Number(v) : v);

export async function buildPeerPayload(): Promise<PeerPayload> {
  const today = londonDate();
  const week = londonMonday(today);
  const from = shiftDays(today, -(CAPS.days - 1));
  const windowStart = from < week ? from : week;

  const [metrics, workouts, weighIns] = await Promise.all([
    supabaseAdmin.from('operator_daily_metrics').select('*').gte('date', windowStart).lte('date', today),
    supabaseAdmin.from('operator_workouts').select('started_at, type, source, distance_km')
      .neq('type', '__operator_fitness_reading__').gte('started_at', windowStart),
    supabaseAdmin.from('operator_fitness_readings').select('date, weight, body_fat')
      .order('date', { ascending: true }),
  ]);

  const byDate = new Map<string, MetricRow>();
  for (const r of (metrics.data ?? []) as MetricRow[]) {
    byDate.set(String(r.date).slice(0, 10), r);
  }

  const entryFor = (day: string): DayEntry => {
    const r = byDate.get(day);
    const caloriesIn = n(r?.dietary_energy_kcal);

    // Total burn is basal + active. Active alone is the Move ring, so publishing
    // it here would read as a day of a few hundred kcal against a Garmin's total
    // and skew every comparison. Without basal there is no total, so it is null.
    const active = n(r?.active_energy_kcal);
    const basal = n(r?.basal_energy_kcal);
    const caloriesOut = active !== null && basal !== null ? Math.round(active + basal) : null;

    return {
      day,
      steps: n(r?.steps),
      caloriesIn: caloriesIn === null ? null : Math.round(caloriesIn),
      caloriesOut,
      net: netOf(caloriesIn === null ? null : Math.round(caloriesIn), caloriesOut),
      proteinG: n(r?.protein_g),
      carbsG: n(r?.carbs_g),
      fatG: n(r?.fat_g),
      // A zero here is a watch on the bedside table, not a sleepless night.
      sleepMinutes: sleepReading(n(r?.sleep_total_min)),
      // Apple Health nutrition carries quantities but no item names, so a food
      // list cannot be built from this feed. Null says "not published", which is
      // honest; inventing one row from the day's totals would not be.
      food: null,
    };
  };

  const dayList = daysBetween(from, today).map(entryFor).reverse(); // newest first
  const todayEntry = dayList[0] ?? entryFor(today);

  /* week totals ----------------------------------------------------------- */

  const weekDays = daysBetween(week, today).map(entryFor);
  const sum = (pick: (d: DayEntry) => number | null) => {
    const live = weekDays.map(pick).filter((v): v is number => v !== null);
    return live.length ? live.reduce((a, b) => a + b, 0) : null;
  };

  const wk = (workouts.data ?? []) as Array<Record<string, unknown>>;
  const inWeek = wk.filter((w) => String(w.started_at).slice(0, 10) >= week);
  const shaped = inWeek.map((w) => ({
    day: String(w.started_at).slice(0, 10),
    type: (w.type as string | null) ?? null,
    source: (w.source as string | null) ?? null,
    distanceKm: n(w.distance_km),
  }));

  // Gym is counted in DAYS — two sessions in a day is one day. Runs are counted
  // as activities, because two runs in a day is two runs.
  const gymSessions = new Set(shaped.filter(isStrengthWorkout).map((w) => w.day)).size;
  const runs = shaped.filter(isRunWorkout).length;

  const sleepNightsWithData = weekDays.filter((d) => d.sleepMinutes !== null);
  const sleepNights7h = sleepNightsWithData.length
    ? sleepNightsWithData.filter((d) => (d.sleepMinutes as number) >= 420).length
    : null;

  /* score ----------------------------------------------------------------- */

  // A deficit day needs both sides logged. A day with either missing is not
  // evidence, so it neither counts for nor against.
  const deficitDays = weekDays.filter(
    (d) => d.caloriesIn !== null && d.caloriesOut !== null && d.caloriesIn < d.caloriesOut,
  ).length;

  // The on-plan streak, counted off the food log, ending today.
  let streakDays = 0;
  for (const d of dayList) {
    if (d.caloriesIn === null) break;
    streakDays++;
  }

  const score = scoreOf({
    sessions: shaped.length,
    sessionsPlanned: SESSIONS_PLANNED_PER_WEEK,
    deficitDays,
    daysElapsed: daysElapsedInWeek(today),
    streakDays,
  });

  /* body ------------------------------------------------------------------ */

  const scale = (weighIns.data ?? []) as Array<Record<string, unknown>>;
  const usable = scale.filter((r) => n(r.weight));
  const latest = usable.at(-1) ?? null;
  const weightKg = latest ? n(latest.weight) : null;
  const bodyFatRaw = latest ? n(latest.body_fat) : null;

  const startKg = PEER_PROFILE.startKg ?? weightKg;

  const goalKg = PEER_PROFILE.goalKg;
  const span = startKg !== null ? startKg - goalKg : null;
  const pct = weightKg !== null && startKg !== null && span && span > 0
    ? Math.max(0, Math.min(1, (startKg - weightKg) / span))
    : null;

  return {
    v: CONTRACT_VERSION,
    athlete: PEER_PROFILE.athlete,
    updatedAt: londonISO(),
    week,
    score,
    goal: {
      pct,
      toGoKg: weightKg === null ? null : Math.round((weightKg - goalKg) * 10) / 10,
      startKg: startKg === null ? null : Math.round(startKg * 10) / 10,
      goalKg,
    },
    heightCm: PEER_PROFILE.heightCm,
    targets: { proteinG: PEER_PROFILE.proteinTargetG },
    weightKg: weightKg === null ? null : Math.round(weightKg * 10) / 10,
    // The scale writes 0 when it did not get a reading.
    bodyFat: bodyFatRaw && bodyFatRaw > 0 ? Math.round(bodyFatRaw * 10) / 10 : null,
    avatarUrl: PEER_PROFILE.avatarUrl,
    today: {
      steps: todayEntry.steps,
      caloriesIn: todayEntry.caloriesIn,
      caloriesOut: todayEntry.caloriesOut,
      net: todayEntry.net,
      proteinG: todayEntry.proteinG,
      carbsG: todayEntry.carbsG,
      fatG: todayEntry.fatG,
      sleepMinutes: todayEntry.sleepMinutes,
      food: todayEntry.food,
    },
    weekTotals: {
      steps: sum((d) => d.steps),
      daysWithSteps: weekDays.filter((d) => d.steps !== null).length,
      gymSessions,
      runs,
      proteinG: sum((d) => d.proteinG),
      sleepNights7h,
    },
    days: dayList.slice(0, CAPS.days),
  };
}
