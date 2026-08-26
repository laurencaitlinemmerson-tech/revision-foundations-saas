import type { HealthDay, LiveData, Lift, WeighIn, Workout } from '../daily-log/data';
import { MUSCLE_GROUPS, equipmentOf, muscleGroupOf, sessionNameFor, type MuscleGroup } from './exercises';
import {
  DAY, DIMENSIONS, baselineOf, breakdownOf, overallScore, partsFor, scoreAll, statsFor,
  type Baseline, type DimensionRow, type Sources,
} from './scoring';
import {
  AMBER, GREEN, HEAT, MUTED, PINK, PINK_SOFT, PLUM, PLUM_SOFT, ROSE, SOFT,
  TAG_GOOD, TAG_INFO, TAG_WATCH,
} from './palette';
import { JOURNEY, TARGETS, proteinTargetG } from './targets';
import { PERIOD_IDS, periodWindows, type PeriodId } from './periods';
import { historyInsights } from './historyInsights';
import { buildEnergy, energyDays } from './energy';
import { buildActivities, prettyType } from './activities';
import { buildBodyAnalysis } from './bodyAnalysis';
import { buildPeriodView } from './periodView';
import { buildRibbon } from './trends';
import { fitReadings } from '@/lib/fitness/regression';
import { isRunWorkout, workoutKindOf } from './workoutKind';
import { deriveHeadToHead } from './headToHead';
import type { PeerData } from './peerData';
import type { BriefData } from './briefData';
import { adaptiveTargets } from './adaptive';

/**
 * Everything the Training dashboard displays, derived from logged data.
 *
 * The view is a direct translation of the approved design, so this module owns
 * every decision the design left as a placeholder: which window a figure covers,
 * what counts as a session, and — most of it — what to show when a source has
 * nothing in it. Nothing here invents a number. A metric with no data behind it
 * comes back as an em dash and the surrounding copy says which source is empty.
 */

export {
  INK, MUTED, GREEN, AMBER, ROSE, SOFT, PLUM, PINK,
} from './palette';

const DASH = '—';

export const SCREENS = [
  'Dashboard', 'Head to head', 'Workouts', 'Calendar', 'Progress',
  'Goals', 'Nutrition', 'Recovery', 'Insights', 'Settings',
] as const;
export type Screen = (typeof SCREENS)[number];



export type BodyMetric = 'Weight' | 'Body fat %' | 'Lean mass';
export type CardioMetric = 'Distance' | 'Pace' | 'Duration' | 'Heart rate';

export type TrainingState = {
  screen: Screen;
  range: PeriodId;
  customFrom: string;
  customTo: string;
  body: BodyMetric;
  ex: string;
  cardio: CardioMetric;
  workout: number;
  query: string;
  group: string;
  goalDraft: boolean;
  /** Which dimension has been opened up to show its parts. */
  openDim: string | null;
  /** An activity type everything is filtered to, or null for all of them. */
  focus: string | null;
  /** Which month the calendar is showing, as YYYY-MM. */
  calendarMonth: string | null;
  /** A day opened from the calendar, as YYYY-MM-DD. */
  selectedDay: string | null;
  /** Head to head: 0 is today, counting back through the published fortnight. */
  dayOffset: number;
  /**
   * An explicit override for the journey breakdown's grain. Null means it
   * follows the period control at the top of the page, which is what someone
   * clicking "Week" up there is asking for.
   */
  journeyGrain: 'week' | 'month' | null;
  /** Whether the journey chart fits what has happened, or the whole plan. */
  journeyChart: 'sofar' | 'plan' | null;
};

export type SetState = (
  patch: Partial<TrainingState> | ((s: TrainingState) => Partial<TrainingState>),
) => void;

const todayISO = () => new Date().toISOString().slice(0, 10);

export const INITIAL_STATE: TrainingState = {
  screen: 'Dashboard',
  range: 'Week',
  customFrom: new Date(Date.now() - 90 * DAY).toISOString().slice(0, 10),
  customTo: todayISO(),
  body: 'Weight',
  ex: '',
  cardio: 'Distance',
  workout: 0,
  query: '',
  group: 'All',
  goalDraft: false,
  openDim: null,
  focus: null,
  calendarMonth: null,
  selectedDay: null,
  dayOffset: 0,
  journeyGrain: null,
  journeyChart: null,
};

/* ── formatting ──────────────────────────────────────────────────────────── */

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

/** A number, or an em dash when there is nothing to show. */
const num = (v: number | null | undefined, d = 0) =>
  v === null || v === undefined || !Number.isFinite(v) ? DASH : nf(v, d);

const unitNum = (v: number | null | undefined, d: number, unit: string) =>
  v === null || v === undefined || !Number.isFinite(v) ? DASH : `${nf(v, d)} ${unit}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d: Date | string, withYear = false) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (!Number.isFinite(dt.getTime())) return DASH;
  const base = `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
  return withYear ? `${base} ${dt.getFullYear()}` : base;
}

/** Hours as "7h 42m". */
function fmtHours(h: number | null) {
  if (h === null || !Number.isFinite(h)) return DASH;
  const total = Math.round(h * 60);
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
}

/** Minutes as "52 min", or "1h 05m" once it runs long. */
function fmtMinutes(m: number | null) {
  if (m === null || !Number.isFinite(m)) return DASH;
  return m < 90 ? `${Math.round(m)} min` : fmtHours(m / 60);
}

/** Seconds per km as "6:12". */
function fmtPace(minPerKm: number | null) {
  if (minPerKm === null || !Number.isFinite(minPerKm) || minPerKm <= 0) return DASH;
  const s = Math.round(minPerKm * 60);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

type Delta = { text: string; color: string };

/** Percentage movement between two periods, in the design's arrow voice. */
function pctDelta(now: number | null, prev: number | null, goodDown = false): Delta {
  if (now === null || prev === null || !prev) return { text: DASH, color: MUTED };
  const change = ((now - prev) / Math.abs(prev)) * 100;
  if (Math.abs(change) < 0.05) return { text: 'held', color: MUTED };
  const up = change > 0;
  const good = goodDown ? !up : up;
  return {
    text: `${up ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%`,
    color: good ? GREEN : ROSE,
  };
}

/** Absolute movement, for the measurements list where units matter more. */
function absDelta(now: number | null, prev: number | null, d: number, unit: string, goodDown = false): Delta {
  if (now === null || prev === null) return { text: DASH, color: MUTED };
  const diff = now - prev;
  if (Math.abs(diff) < Math.pow(10, -d) / 2) return { text: 'held', color: MUTED };
  const up = diff > 0;
  const good = goodDown ? !up : up;
  return {
    text: `${up ? '↑' : '↓'} ${nf(Math.abs(diff), d)} ${unit}`,
    color: good ? GREEN : SOFT,
  };
}

/* ── chart geometry ──────────────────────────────────────────────────────── */

function linePath(vals: number[], w: number, h: number, pad: number) {
  if (vals.length < 2) return '';
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i: number) => (i / (vals.length - 1)) * w;
  const y = (v: number) => pad + (1 - (v - min) / span) * (h - pad * 2);
  return vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
}

function areaPath(vals: number[], w: number, h: number, pad: number) {
  const p = linePath(vals, w, h, pad);
  return p ? `${p} L${w} ${h} L0 ${h} Z` : '';
}

/* ── shaping the sources ─────────────────────────────────────────────────── */

/** A weigh-in field only counts when it was actually recorded; the scale writes 0 for the rest. */
const scaleVal = (v: number | undefined | null) => (typeof v === 'number' && v > 0 ? v : null);

/** One day of training, however it was recorded. */
export type Session = {
  key: string;
  date: string;
  name: string;
  dateLabel: string;
  fullDate: string;
  duration: string;
  exercises: number;
  volume: string;
  energy: string;
  prCount: number;
  note: string;
  minutes: number | null;
  energyKcal: number | null;
  kind: string;
  rows: Array<{ name: string; sets: string; weight: string; volume: string; pr: string }>;
};

/** Every lift, tagged with whether its top set beat everything before it. */
function markPersonalBests(lifts: Lift[]) {
  const best = new Map<string, number>();
  const flagged = new Map<string, boolean>();
  for (const l of [...lifts].sort((a, b) => a.performedOn.localeCompare(b.performedOn))) {
    const prior = best.get(l.exercise) ?? 0;
    const isPr = l.topSetKg > prior && l.topSetKg > 0;
    if (isPr) best.set(l.exercise, l.topSetKg);
    flagged.set(l.id, isPr);
  }
  return flagged;
}

function setsLabel(l: Lift) {
  if (!l.sets.length) return DASH;
  const reps = l.sets.map((s) => s.reps);
  const same = reps.every((r) => r === reps[0]);
  return same ? `${l.sets.length} × ${reps[0]}` : l.sets.map((s) => s.reps).join(' / ');
}

function buildSessions(lifts: Lift[], workouts: Workout[]): Session[] {
  const prFlags = markPersonalBests(lifts);

  // Best distance so far per workout type, so a cardio personal best can be
  // marked the same way a lift one is.
  const cardioBest = new Map<string, number>();
  const cardioPr = new Map<string, boolean>();
  for (const w of [...workouts].sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    const type = w.type ?? 'Workout';
    const km = w.distanceKm ?? 0;
    const isPr = km > 0 && km > (cardioBest.get(type) ?? 0);
    if (isPr) cardioBest.set(type, km);
    cardioPr.set(w.id, isPr);
  }

  const byDay = new Map<string, { lifts: Lift[]; workouts: Workout[] }>();
  const bucket = (d: string) => {
    const key = d.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, { lifts: [], workouts: [] });
    return byDay.get(key)!;
  };
  for (const l of lifts) bucket(l.performedOn).lifts.push(l);
  for (const w of workouts) bucket(w.startedAt).workouts.push(w);

  return [...byDay.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, day]) => {
      const groups = day.lifts.map((l) => muscleGroupOf(l.exercise));
      // The Health export writes "CrossTraining" while the phone sync writes
      // "Cross Training", so the same activity would otherwise appear twice in
      // one session's name. Normalise before deduplicating.
      const cardioNames = [...new Set(day.workouts.map((w) => prettyType(w.type)))];
      const name = day.lifts.length
        ? sessionNameFor(groups)
        : cardioNames.join(' + ') || 'Session';

      const volumeKg = day.lifts.reduce((a, l) => a + l.volumeKg, 0);
      const distanceKm = day.workouts.reduce((a, w) => a + (w.distanceKm ?? 0), 0);
      const minutes = day.workouts.reduce((a, w) => a + (w.durationMin ?? 0), 0);
      const energy = day.workouts.reduce((a, w) => a + (w.energyKcal ?? 0), 0);

      const liftRows = day.lifts.map((l) => ({
        name: l.exercise,
        sets: setsLabel(l),
        weight: l.topSetKg > 0 ? `${nf(l.topSetKg, l.topSetKg % 1 ? 1 : 0)} kg` : DASH,
        volume: l.volumeKg > 0 ? `${nf(Math.round(l.volumeKg))} kg` : DASH,
        pr: prFlags.get(l.id) ? 'PR' : '',
      }));

      // A synced session carries no sets, so the three columns show what it does
      // know instead of three em dashes: distance and pace for cardio, time and
      // energy for a strength session recorded in a coaching app.
      const cardioRows = day.workouts.map((w) => {
        const km = w.distanceKm ?? 0;
        const mins = w.durationMin ?? 0;
        const kcal = w.energyKcal ?? 0;
        const isCardio = workoutKindOf(w) === 'cardio' && km > 0;
        return {
          name: w.type ?? 'Workout',
          sets: isCardio ? `${nf(km, 1)} km` : fmtMinutes(mins || null),
          weight: isCardio && mins > 0
            ? `${fmtPace(mins / km)} /km`
            : kcal > 0 ? `${nf(Math.round(kcal))} kcal` : DASH,
          volume: w.avgHr ? `${Math.round(w.avgHr)} bpm avg` : DASH,
          pr: cardioPr.get(w.id) ? 'PR' : '',
        };
      });

      const prCount =
        day.lifts.filter((l) => prFlags.get(l.id)).length +
        day.workouts.filter((w) => cardioPr.get(w.id)).length;

      const notes = day.lifts.map((l) => l.note).filter((n): n is string => !!n && n.trim() !== '');

      return {
        key: date,
        date,
        name,
        dateLabel: fmtDate(date),
        fullDate: fmtDate(date, true),
        duration: minutes > 0 ? fmtMinutes(minutes) : DASH,
        exercises: day.lifts.length + day.workouts.length,
        volume: volumeKg > 0 ? `${nf(Math.round(volumeKg))} kg` : distanceKm > 0 ? `${nf(distanceKm, 1)} km` : DASH,
        energy: energy > 0 ? `${nf(Math.round(energy))} kcal` : DASH,
        prCount,
        note: notes.join(' ') || 'No note on this session.',
        minutes: minutes || null,
        energyKcal: energy || null,
        kind: day.lifts.length ? 'Strength'
          : day.workouts.some((w) => workoutKindOf(w) === 'cardio') ? 'Cardio' : 'Strength',
        rows: [...liftRows, ...cardioRows],
      };
    });
}

/** Every exercise ever logged, with its all-time best and its movement in range. */
export type ExerciseRow = {
  name: string;
  group: MuscleGroup;
  equipment: string;
  prKg: number | null;
  prevKg: number | null;
  e1rmKg: number | null;
  sessions: number;
  volumeKg: number;
  pctChange: number | null;
  history: number[];
};

function buildExercises(all: Lift[], inRange: Lift[]): ExerciseRow[] {
  const names = [...new Set(all.map((l) => l.exercise))];
  return names
    .map((name) => {
      const mine = all
        .filter((l) => l.exercise === name)
        .sort((a, b) => a.performedOn.localeCompare(b.performedOn));
      const ranged = inRange.filter((l) => l.exercise === name);

      const prKg = Math.max(...mine.map((l) => l.topSetKg), 0) || null;
      const peakAt = mine.findIndex((l) => l.topSetKg === prKg);
      // "Previous best" is the best set standing before the day the record was
      // set, which is the comparison the number is actually claiming.
      const before = peakAt > 0 ? mine.slice(0, peakAt) : [];
      const prevKg = before.length ? Math.max(...before.map((l) => l.topSetKg)) || null : null;

      return {
        name,
        group: muscleGroupOf(name),
        equipment: equipmentOf(name),
        prKg,
        prevKg,
        e1rmKg: Math.max(...mine.map((l) => l.e1rmKg), 0) || null,
        sessions: ranged.length,
        volumeKg: ranged.reduce((a, l) => a + l.volumeKg, 0),
        pctChange:
          prKg && prevKg && prevKg > 0 ? ((prKg - prevKg) / prevKg) * 100 : prKg ? null : null,
        history: mine.slice(-14).map((l) => l.topSetKg),
      };
    })
    .sort((a, b) => b.volumeKg - a.volumeKg || (b.prKg ?? 0) - (a.prKg ?? 0));
}

/* ── the derivation ──────────────────────────────────────────────────────── */

/** One plotted weigh-in, already positioned in the chart's viewBox. */
export type BodyPoint = {
  key: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
  value: number;
  valueLabel: string;
  dateLabel: string;
  label: string;
  sub: string;
};

export type TrainingProps = { operatorName: string };
export const DEFAULT_PROPS: TrainingProps = { operatorName: 'Lauren' };

export function deriveVals(
  st: TrainingState,
  setState: SetState,
  props: TrainingProps,
  live: LiveData,
  peer: PeerData,
  brief: BriefData = { loaded: false, cues: [], staleNote: null, ok: false },
) {
  const set = (patch: Partial<TrainingState>) => setState(patch);

  const allWorkouts = live.workouts ?? [];

  // One filter, applied at the source, so every screen agrees about what is
  // being looked at rather than each deciding for itself.
  const focus = st.focus;
  const src: Sources = {
    days: live.days ?? [],
    lifts: live.lifts ?? [],
    workouts: focus ? allWorkouts.filter((w) => prettyType(w.type) === focus) : allWorkouts,
    weighIns: live.weighIns ?? [],
  };
  const hasAny = src.days.length + src.lifts.length + src.workouts.length + src.weighIns.length > 0;

  /* window ---------------------------------------------------------------- */

  // Calendar-aligned, and compared against the same elapsed stretch of the
  // previous period rather than the whole of it.
  const win = periodWindows(st.range, { from: st.customFrom, to: st.customTo });
  const nowWin = win.now;
  const prevWin = win.prev;
  const spanDays = win.spanDays;
  const endsAt = nowWin.to;
  const custom = st.range === 'Custom';

  const base: Baseline = baselineOf(src);
  const nowStats = statsFor(src, nowWin, base);
  const prevStats = statsFor(src, prevWin, base);

  const rangeLabel = win.label;
  const againstLabel = win.againstLabel;

  /* dimensions ------------------------------------------------------------ */

  const rows: DimensionRow[] = scoreAll(nowStats, prevStats, base);
  const overall = overallScore(rows);
  const overallPrev = overallScore(rows, 'prev');
  const overallDelta = pctDelta(overall, overallPrev);

  const dims = rows.map((r) => {
    const d = pctDelta(r.score, r.prev);
    const breakdown = breakdownOf(partsFor(r.label, nowStats, base));

    // The lever is the part with the most headroom once weighted: how much of
    // the dimension it carries, times how far it currently falls short.
    const scored = breakdown.parts.filter((p) => p.value !== null);
    const lever = scored
      .map((p) => ({ p, gain: (p.weight / 100) * (100 - (p.value as number)) }))
      .sort((a, b) => b.gain - a.gain)[0];
    const missing = breakdown.parts.filter((p) => p.value === null);

    return {
      label: r.label,
      parts: breakdown.parts.map((p) => ({
        ...p,
        pct: `${p.value ?? 0}%`,
        valueLabel: p.value === null ? DASH : `${p.value}`,
        weightLabel: p.value === null ? 'not scored' : `${p.weight}% of the score`,
        color: p.value === null ? MUTED : p.value >= 80 ? GREEN : p.value >= 50 ? PLUM : AMBER,
      })),
      lever: !lever || lever.gain < 3
        ? null
        : `Most of the remaining headroom is in ${lever.p.label.toLowerCase()} — worth about ${Math.round(lever.gain)} points.`,
      missingNote: missing.length
        ? `${missing.map((m) => m.label.toLowerCase()).join(' and ')} ${missing.length === 1 ? 'is' : 'are'} not scored, so the rest carry the whole dimension.`
        : null,
      open: st.openDim === r.label,
      toggle: () => set({ openDim: st.openDim === r.label ? null : r.label }),
      // Every dimension has a screen that explains it in full, so the score is
      // a way in rather than a dead end.
      screen: ({
        Strength: 'Workouts', Cardio: 'Progress', Activity: 'Progress',
        Nutrition: 'Nutrition', Recovery: 'Recovery', Consistency: 'Workouts',
      } as Record<string, Screen>)[r.label],
      openScreen: () => set({
        screen: ({
          Strength: 'Workouts', Cardio: 'Progress', Activity: 'Progress',
          Nutrition: 'Nutrition', Recovery: 'Recovery', Consistency: 'Workouts',
        } as Record<string, Screen>)[r.label],
      }),
      score: r.score === null ? DASH : String(r.score),
      prev: r.prev === null ? DASH : String(r.prev),
      pct: `${r.score ?? 0}%`,
      prevPct: `${r.prev ?? 0}%`,
      delta: d.text,
      deltaColor: d.color,
      bar: r.score !== null && r.prev !== null && r.score < r.prev ? ROSE : PLUM,
    };
  });

  // What actually changed, ranked by contribution to the overall figure rather
  // than by raw percentage — a big swing on a dimension nobody scored is noise.
  const movers = rows
    .filter((r) => r.score !== null && r.prev !== null && Math.abs(r.score - r.prev) >= 2)
    .map((r) => ({
      label: r.label,
      change: (r.score as number) - (r.prev as number),
      text: `${(r.score as number) > (r.prev as number) ? '↑' : '↓'} ${Math.abs((r.score as number) - (r.prev as number))}`,
      color: (r.score as number) > (r.prev as number) ? GREEN : ROSE,
      from: String(r.prev),
      to: String(r.score),
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 3);

  const falling = rows.filter(
    (r) => r.score !== null && r.prev !== null && r.score < r.prev,
  );
  const dimNote = !hasAny
    ? 'No sessions or health data have synced yet, so there is nothing to score.'
    : falling.length === 1
      ? `${falling[0].label} is the one dimension moving down this period. See ${falling[0].label} for the detail.`
      : falling.length
        ? `${falling.length} dimensions are moving down this period: ${falling.map((f) => f.label).join(', ')}.`
        : 'No dimension is moving down this period.';

  /* radar ----------------------------------------------------------------- */

  const cx = 210;
  const cy = 168;
  const R = 118;
  const ang = (i: number) => (Math.PI * 2 * i) / 6 - Math.PI / 2;
  const pt = (i: number, v: number): [number, number] => [
    cx + Math.cos(ang(i)) * R * (v / 100),
    cy + Math.sin(ang(i)) * R * (v / 100),
  ];
  const poly = (vals: number[]) =>
    vals.map((v, i) => pt(i, v).map((n) => n.toFixed(1)).join(',')).join(' ');

  const radarRings = [100, 75, 50, 25].map((r) => ({ points: poly([r, r, r, r, r, r]) }));
  const radarSpokes = rows.map((_, i) => {
    const [x, y] = pt(i, 100);
    return { x1: cx, y1: cy, x2: Number(x.toFixed(1)), y2: Number(y.toFixed(1)) };
  });
  const radarNow = poly(rows.map((r) => r.score ?? 0));
  const radarPrev = poly(rows.map((r) => r.prev ?? 0));
  const radarDots = rows
    .filter((r) => r.score !== null)
    .map((r) => {
      const i = rows.indexOf(r);
      const [x, y] = pt(i, r.score ?? 0);
      return { x: x.toFixed(1), y: y.toFixed(1) };
    });
  const radarLabels = rows.map((r, i) => {
    const [x, y] = pt(i, 100);
    const dx = x - cx;
    const dy = y - cy;
    return {
      label: `${r.label} ${r.score ?? DASH}`,
      x: (x + dx * 0.17).toFixed(1),
      y: (y + dy * 0.17 + 4).toFixed(1),
      anchor: (Math.abs(dx) < 6 ? 'middle' : dx > 0 ? 'start' : 'end') as 'middle' | 'start' | 'end',
    };
  });

  /* weigh-ins ------------------------------------------------------------- */

  const weighAll = [...src.weighIns].sort((a, b) => a.date.localeCompare(b.date));
  const inRangeWeigh = weighAll.filter((r) => {
    const t = new Date(r.date).getTime();
    return t >= nowWin.from && t < nowWin.to;
  });
  // Falling back to recent history when the window is thin is fine, but the
  // header still says "last 7 days", so the chart has to admit when it is
  // showing something else.
  const usingFallback = inRangeWeigh.length < 2;
  const weighSeries = usingFallback ? weighAll.slice(-30) : inRangeWeigh;

  const pickScale = (r: WeighIn, metric: BodyMetric) =>
    metric === 'Weight' ? scaleVal(r.weight)
      : metric === 'Body fat %' ? scaleVal(r.bodyFat)
        : scaleVal(r.muscleMass);

  const bodyVals = weighSeries
    .map((r) => pickScale(r, st.body))
    .filter((v): v is number => v !== null);
  const bodyFirst = bodyVals.length ? bodyVals[0] : null;
  const bodyLast = bodyVals.length ? bodyVals[bodyVals.length - 1] : null;
  const bodyUnit = st.body === 'Body fat %' ? '%' : 'kg';
  const bodyDelta = absDelta(bodyLast, bodyFirst, 1, bodyUnit, st.body !== 'Lean mass');

  const bodyTabs = (['Weight', 'Body fat %', 'Lean mass'] as BodyMetric[]).map((label) => ({
    label,
    go: () => set({ body: label }),
    active: st.body === label,
  }));

  const latest2 = <K extends keyof WeighIn>(k: K) => {
    for (let i = weighAll.length - 1; i >= 0; i--) {
      const v = scaleVal(weighAll[i][k] as number);
      if (v !== null) return v;
    }
    return null;
  };

  const latest = <K extends keyof WeighIn>(k: K) => {
    for (let i = weighAll.length - 1; i >= 0; i--) {
      const v = scaleVal(weighAll[i][k] as number);
      if (v !== null) return v;
    }
    return null;
  };
  const earliestInRange = <K extends keyof WeighIn>(k: K) => {
    for (const r of inRangeWeigh) {
      const v = scaleVal(r[k] as number);
      if (v !== null) return v;
    }
    return null;
  };

  const measurements = ([
    ['Weight', 'weight', 1, 'kg', true],
    ['BMI', 'bmi', 1, '', true],
    ['Body fat', 'bodyFat', 1, 'pp', true],
    ['Lean mass', 'muscleMass', 1, 'kg', false],
    ['Body water', 'water', 1, 'pp', false],
    ['Bone mass', 'boneMass', 1, 'kg', false],
  ] as Array<[string, keyof WeighIn, number, string, boolean]>).map(
    ([label, key, dp, unit, goodDown]) => {
      const value = latest(key);
      const start = earliestInRange(key);
      const change = absDelta(value, start, dp, unit, goodDown);
      return {
        label,
        value: value === null ? DASH : `${nf(value, dp)}${unit === 'pp' ? '%' : unit ? ` ${unit}` : ''}`,
        change: change.text,
        color: change.color,
      };
    },
  );

  /* nutrition ------------------------------------------------------------- */

  const dayFor = (d: string) => src.days.find((x) => x.date.slice(0, 10) === d) ?? null;
  const lastNutritionDay =
    [...src.days].reverse().find((d) => (d.nutrition.dietaryEnergyKcal ?? 0) > 0) ?? null;
  const todayRow = dayFor(todayISO());
  const nutritionDay = (todayRow?.nutrition.dietaryEnergyKcal ?? 0) > 0 ? todayRow : lastNutritionDay;
  const proteinTarget = proteinTargetG(base.weightKg);

  const nutritionDefs: Array<[string, number | null, number, string, number]> = [
    ['Calories', nutritionDay?.nutrition.dietaryEnergyKcal ?? null, TARGETS.calorieTarget, 'kcal', 0],
    ['Protein', nutritionDay?.nutrition.proteinG ?? null, proteinTarget, 'g', 0],
    ['Carbohydrates', nutritionDay?.nutrition.carbsG ?? null, Math.round((TARGETS.calorieTarget * 0.4) / 4), 'g', 0],
    ['Fat', nutritionDay?.nutrition.fatG ?? null, Math.round((TARGETS.calorieTarget * 0.3) / 9), 'g', 0],
    ['Fibre', nutritionDay?.nutrition.fiberG ?? null, TARGETS.fibreTargetG, 'g', 0],
    ['Water', nutritionDay?.nutrition.waterMl ? nutritionDay.nutrition.waterMl / 1000 : null, TARGETS.waterTargetL, 'L', 1],
  ];

  const nutrition = nutritionDefs.map(([label, cur, target, unit, dp]) => {
    if (cur === null || cur <= 0) {
      return {
        label,
        text: `${DASH} / ${nf(target, dp)} ${unit}`,
        pct: '0%',
        status: 'Not logged',
        statusColor: MUTED,
        bar: PINK_SOFT,
      };
    }
    const ratio = cur / target;
    return {
      label,
      text: `${nf(cur, dp)} / ${nf(target, dp)} ${unit}`,
      pct: `${Math.min(100, ratio * 100).toFixed(0)}%`,
      status: ratio >= 0.92 ? 'On target' : ratio >= 0.75 ? 'Close to target' : 'Below target',
      statusColor: ratio >= 0.92 ? GREEN : ratio >= 0.75 ? AMBER : MUTED,
      bar: ratio >= 0.92 ? PLUM : ratio >= 0.75 ? PLUM_SOFT : PINK_SOFT,
    };
  });

  const nutritionDayLabel = nutritionDay
    ? nutritionDay.date.slice(0, 10) === todayISO()
      ? `Today — ${fmtDate(nutritionDay.date)}`
      : `Last logged — ${fmtDate(nutritionDay.date)}`
    : 'Nothing logged yet';

  // The 28-day calorie chart, plotted against the target line at mid-height.
  const calWindow = src.days.slice(-28);
  const calBars = calWindow.map((d, i) => {
    const v = d.nutrition.dietaryEnergyKcal ?? 0;
    const ceiling = Math.max(TARGETS.calorieTarget * 1.6, ...calWindow.map((x) => x.nutrition.dietaryEnergyKcal ?? 0));
    const h = v > 0 ? Math.max(6, (v / ceiling) * 200) : 0;
    const step = 560 / Math.max(1, calWindow.length);
    return {
      key: d.date,
      x: i * step,
      cx: i * step + step * 0.36,
      y: 208 - h,
      w: step * 0.72,
      h,
      fill: v > 0 && Math.abs(v - TARGETS.calorieTarget) <= TARGETS.calorieTarget * 0.1 ? PLUM : PINK_SOFT,
      label: v > 0 ? `${nf(Math.round(v))} kcal` : 'Nothing logged',
      sub: fmtDate(d.date, true),
    };
  });
  const calTargetY = (() => {
    const ceiling = Math.max(TARGETS.calorieTarget * 1.6, ...calWindow.map((x) => x.nutrition.dietaryEnergyKcal ?? 0));
    return (208 - (TARGETS.calorieTarget / ceiling) * 200).toFixed(0);
  })();

  const loggedCal = calWindow.filter((d) => (d.nutrition.dietaryEnergyKcal ?? 0) > 0);
  const onTargetCal = loggedCal.filter(
    (d) => Math.abs((d.nutrition.dietaryEnergyKcal ?? 0) - TARGETS.calorieTarget) <= TARGETS.calorieTarget * 0.1,
  );
  const proteinAvg = nowStats.avgProtein;

  const nutritionStats = [
    {
      label: 'Days on target',
      value: loggedCal.length ? `${onTargetCal.length} / ${loggedCal.length}` : DASH,
      note: `Within ${nf(TARGETS.calorieTarget * 0.1)} kcal of ${nf(TARGETS.calorieTarget)}`,
    },
    {
      label: 'Average protein',
      value: proteinAvg === null ? DASH : `${nf(proteinAvg)} g`,
      note: `Target ${nf(proteinTarget)} g`,
    },
    {
      label: 'Logged days',
      value: calWindow.length ? `${loggedCal.length} / ${calWindow.length}` : DASH,
      note: calWindow.length - loggedCal.length === 0
        ? 'Every day logged'
        : `${calWindow.length - loggedCal.length} unlogged`,
    },
  ];

  const nutritionConsistency = loggedCal.length
    ? `${Math.round((onTargetCal.length / loggedCal.length) * 100)}% of logged days on or close to target`
    : 'No days logged in this window';

  /* recovery -------------------------------------------------------------- */

  const sleepNights = src.days
    .slice(-60)
    .filter((d) => (d.sleep.totalMin ?? 0) > 0)
    .slice(-30);
  const sleepSeries = sleepNights.map((d) => (d.sleep.totalMin as number) / 60);

  const recoveryScore = rows.find((r) => r.label === 'Recovery')?.score ?? null;
  const recoveryPrev = rows.find((r) => r.label === 'Recovery')?.prev ?? null;

  const sleepDelta = absDelta(
    nowStats.avgSleepH === null ? null : nowStats.avgSleepH * 60,
    prevStats.avgSleepH === null ? null : prevStats.avgSleepH * 60,
    0, 'min',
  );
  const rhrDelta = absDelta(nowStats.avgRestingHr, prevStats.avgRestingHr, 0, 'bpm', true);
  const hrvDelta = absDelta(nowStats.avgHrv, prevStats.avgHrv, 0, 'ms');

  const recoveryStats = [
    { label: 'Sleep', value: fmtHours(nowStats.avgSleepH), change: sleepDelta.text, color: sleepDelta.color },
    { label: 'Resting HR', value: unitNum(nowStats.avgRestingHr, 0, 'bpm'), change: rhrDelta.text, color: rhrDelta.color },
    { label: 'HRV', value: unitNum(nowStats.avgHrv, 0, 'ms'), change: hrvDelta.text, color: hrvDelta.color },
  ];

  const consistencyPct = nowStats.sleepCv === null ? null : Math.round((1 - nowStats.sleepCv) * 100);
  const prevConsistencyPct = prevStats.sleepCv === null ? null : Math.round((1 - prevStats.sleepCv) * 100);
  const sleepConsistencyDelta = absDelta(consistencyPct, prevConsistencyPct, 0, 'pp');
  const restDelta = absDelta(
    nowStats.restDays / Math.max(1, nowStats.weeks),
    prevStats.restDays / Math.max(1, prevStats.weeks),
    1, '/wk', true,
  );
  const recoveryScoreDelta = pctDelta(recoveryScore, recoveryPrev);

  const recoveryRows = [
    { label: 'Sleep duration', value: fmtHours(nowStats.avgSleepH), change: sleepDelta.text, color: sleepDelta.color },
    { label: 'Sleep consistency', value: consistencyPct === null ? DASH : `${consistencyPct}%`, change: sleepConsistencyDelta.text, color: sleepConsistencyDelta.color },
    { label: 'Resting heart rate', value: unitNum(nowStats.avgRestingHr, 0, 'bpm'), change: rhrDelta.text, color: rhrDelta.color },
    { label: 'HRV', value: unitNum(nowStats.avgHrv, 0, 'ms'), change: hrvDelta.text, color: hrvDelta.color },
    { label: 'Rest days', value: nowStats.days.length ? `${nf(nowStats.restDays / Math.max(1, nowStats.weeks), 1)} / week` : DASH, change: restDelta.text, color: restDelta.color },
    { label: 'Recovery score', value: recoveryScore === null ? DASH : `${recoveryScore} / 100`, change: recoveryScoreDelta.text, color: recoveryScoreDelta.color },
  ];

  // Which component is holding the recovery score back, said plainly.
  const recoveryLimiter = (() => {
    if (recoveryScore === null) return 'No sleep or heart data in this window';
    const candidates: Array<[string, number]> = [];
    if (nowStats.avgSleepH !== null) candidates.push(['sleep', nowStats.avgSleepH / TARGETS.sleepTargetH]);
    if (nowStats.sleepCv !== null) candidates.push(['sleep consistency', 1 - nowStats.sleepCv / 0.25]);
    if (nowStats.avgRestingHr !== null && base.restingHr !== null) {
      candidates.push(['resting heart rate', (base.restingHr + 5 - nowStats.avgRestingHr) / 10]);
    }
    if (nowStats.avgHrv !== null && base.hrv) {
      candidates.push(['HRV', (nowStats.avgHrv - base.hrv * 0.85) / (base.hrv * 0.3)]);
    }
    if (!candidates.length) return 'Scored on partial data';
    const worst = candidates.sort((a, b) => a[1] - b[1])[0][0];
    const band = recoveryScore >= 80 ? 'Strong' : recoveryScore >= 60 ? 'Moderate' : 'Low';
    return `${band} — ${worst} is the limiter`;
  })();

  /* activity, strength, cardio headline cards ----------------------------- */

  const volumeTonnes = nowStats.volumeKg / 1000;
  const prevVolumeTonnes = prevStats.volumeKg / 1000;
  const volumeDelta = pctDelta(volumeTonnes || null, prevVolumeTonnes || null);
  const vo2Delta = pctDelta(nowStats.vo2, prevStats.vo2);

  // Weekly volume, for the strength sparkline.
  const weeklyBuckets = (span: number, pick: (from: number, to: number) => number) => {
    const buckets = Math.min(30, Math.max(3, Math.round(span / 7)));
    const width = (nowWin.to - nowWin.from) / buckets;
    return Array.from({ length: buckets }, (_, i) =>
      pick(nowWin.from + i * width, nowWin.from + (i + 1) * width),
    );
  };
  const volumeSpark = weeklyBuckets(spanDays, (from, to) =>
    src.lifts
      .filter((l) => {
        const t = new Date(l.performedOn).getTime();
        return t >= from && t < to;
      })
      .reduce((a, l) => a + l.volumeKg, 0) / 1000,
  );
  const strengthSpark = weeklyBuckets(spanDays, (from, to) => {
    const dates = new Set<string>();
    for (const l of src.lifts) {
      const t = new Date(l.performedOn).getTime();
      if (t >= from && t < to) dates.add(l.performedOn.slice(0, 10));
    }
    for (const w of src.workouts) {
      const t = new Date(w.startedAt).getTime();
      if (t >= from && t < to && workoutKindOf(w) === 'strength') dates.add(w.startedAt.slice(0, 10));
    }
    return dates.size;
  });

  const vo2Spark = src.days
    .slice(-30)
    .map((d) => d.heart.vo2Max)
    .filter((v): v is number => !!v);
  const stepsSpark = src.days
    .slice(-30)
    .map((d) => d.activity.steps)
    .filter((v): v is number => !!v);

  const sessionsInRange = nowStats.sessionDays;
  const walkedKm = nowStats.days.reduce((a, d) => a + (d.activity.distanceKm ?? 0), 0);

  const topCards = [
    // Volume needs a lift log. Without one the card reports what the synced
    // sessions do prove — that the training happened — rather than an em dash.
    nowStats.lifts.length
      ? {
        eyebrow: 'Strength',
        label: `Total volume, ${rangeLabel}`,
        value: nf(volumeTonnes, volumeTonnes >= 10 ? 0 : 1),
        unit: 'tonnes lifted',
        trend: `${volumeDelta.text} vs ${againstLabel}`,
        trendColor: volumeDelta.color,
        spark: linePath(volumeSpark, 200, 40, 4),
        note: `${nowStats.liftSessionDays} lift session${nowStats.liftSessionDays === 1 ? '' : 's'} of ${nowStats.plannedSessions} planned.`,
      }
      : {
        eyebrow: 'Strength',
        label: `Sessions, ${rangeLabel}`,
        value: nowStats.strengthSessionDays ? nf(nowStats.strengthSessionDays) : DASH,
        unit: `of ${nf(nowStats.plannedSessions)} planned`,
        trend: nowStats.strengthSessionDays
          ? `${pctDelta(nowStats.strengthSessionDays, prevStats.strengthSessionDays).text} vs ${againstLabel}`
          : 'No strength sessions in range',
        trendColor: nowStats.strengthSessionDays
          ? pctDelta(nowStats.strengthSessionDays, prevStats.strengthSessionDays).color
          : MUTED,
        spark: linePath(strengthSpark, 200, 40, 4),
        note: 'Sets and loads live in your coaching app, so volume is not shown.',
      },
    {
      eyebrow: 'Cardio',
      label: 'Estimated VO₂ max',
      value: num(nowStats.vo2, 1),
      unit: 'ml/kg/min',
      trend: nowStats.vo2 === null ? 'No VO₂ estimate synced' : `${vo2Delta.text} vs ${againstLabel}`,
      trendColor: nowStats.vo2 === null ? MUTED : vo2Delta.color,
      spark: linePath(vo2Spark, 200, 40, 4),
      note: nowStats.cardioDistanceKm > 0
        ? `${nf(nowStats.cardioDistanceKm, 1)} km of cardio across ${nowStats.workouts.length} session${nowStats.workouts.length === 1 ? '' : 's'}.`
        : 'No cardio workouts in this window.',
    },
    {
      eyebrow: 'Activity',
      label: 'Average daily steps',
      value: nowStats.avgSteps === null ? DASH : nf(nowStats.avgSteps),
      unit: 'steps',
      trend: nowStats.avgSteps === null
        ? 'No step data synced'
        : `${nowStats.activeDays} of ${nowStats.days.length} days at goal`,
      trendColor: SOFT,
      spark: linePath(stepsSpark, 200, 40, 4),
      note: walkedKm > 0
        ? `${sessionsInRange} session${sessionsInRange === 1 ? '' : 's'} and ${nf(walkedKm)} km walked.`
        : `${sessionsInRange} session${sessionsInRange === 1 ? '' : 's'} logged in this window.`,
    },
  ];

  /* consistency + heatmap ------------------------------------------------- */

  const consistencyScore = rows.find((r) => r.label === 'Consistency')?.score ?? null;
  const adherence = [
    { label: 'Workouts', value: `${nowStats.sessionDays} / ${nowStats.plannedSessions}` },
    {
      label: 'Nutrition',
      value: nowStats.nutritionDays
        ? `${Math.round((nowStats.calOnTarget / nowStats.nutritionDays) * 100)}%`
        : DASH,
    },
    {
      label: 'Steps',
      value: nowStats.days.length
        ? `${Math.round((nowStats.activeDays / nowStats.days.length) * 100)}%`
        : DASH,
    },
    { label: 'Sleep', value: consistencyPct === null ? DASH : `${consistencyPct}%` },
  ];

  // Twelve weeks of squares, ending on the week that contains the window's end.
  const heatEnd = new Date(endsAt);
  heatEnd.setHours(0, 0, 0, 0);
  const backToMonday = (heatEnd.getDay() + 6) % 7;
  const lastMonday = heatEnd.getTime() - backToMonday * DAY;
  const heatStart = lastMonday - 11 * 7 * DAY;

  const sessionDates = new Set<string>([
    ...src.lifts.map((l) => l.performedOn.slice(0, 10)),
    ...src.workouts.map((w) => w.startedAt.slice(0, 10)),
  ]);
  const cardioDates = new Set(
    src.workouts.filter((w) => (w.distanceKm ?? 0) > 0).map((w) => w.startedAt.slice(0, 10)),
  );
  const stepsByDate = new Map(
    src.days.map((d) => [d.date.slice(0, 10), d.activity.steps ?? 0] as const),
  );

  const heatColors = HEAT;
  const heatTips = ['Nothing logged', 'Steps only', 'Light day', 'Session logged', 'Session and cardio'];
  const heatmap = Array.from({ length: 12 }, (_, w) => ({
    key: `w${w}`,
    days: Array.from({ length: 7 }, (_, d) => {
      const t = heatStart + (w * 7 + d) * DAY;
      const key = new Date(t).toISOString().slice(0, 10);
      const steps = stepsByDate.get(key) ?? 0;
      const hasSession = sessionDates.has(key);
      const hasCardio = cardioDates.has(key);
      const future = t > Date.now();
      const level = future ? 0
        : hasSession && hasCardio ? 4
          : hasSession ? 3
            : steps >= TARGETS.stepGoal ? 2
              : steps > 0 ? 1
                : 0;
      return {
        key,
        color: future ? 'transparent' : heatColors[level],
        tip: future ? '' : `${fmtDate(key)} — ${heatTips[level]}`,
        future,
        selected: st.selectedDay === key,
        // The calendar opens a day on click; the heatmap plots the same days and
        // should not behave differently for being drawn as squares.
        select: () => set({ selectedDay: st.selectedDay === key ? null : key }),
      };
    }),
  }));

  const heatMonths = [0, 6, 11].map((w) => MONTHS[new Date(heatStart + w * 7 * DAY).getMonth()]);

  /* sessions -------------------------------------------------------------- */

  const allSessions = buildSessions(src.lifts, src.workouts);
  const rangeSessions = allSessions.filter((s) => {
    const t = new Date(s.date).getTime();
    return t >= nowWin.from && t < nowWin.to;
  });
  const sessionList = rangeSessions.length ? rangeSessions : allSessions.slice(0, 12);
  const selIndex = Math.min(st.workout, Math.max(0, sessionList.length - 1));
  const selected = sessionList[selIndex] ?? null;

  // Effort per session, scaled against the hardest in view, so the list carries
  // shape rather than being a uniform stack of identical rows.
  const effortOf = (s: Session) => {
    const mins = s.minutes ?? 0;
    const kcal = s.energyKcal ?? 0;
    return kcal || mins * 6;
  };
  const peakEffort = Math.max(1, ...sessionList.map(effortOf));

  const weekOf = (iso: string) => {
    const d = new Date(`${iso}T12:00:00Z`);
    const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY);
    return monday.toISOString().slice(0, 10);
  };

  const workouts = sessionList.map((s, i) => ({
    key: s.key,
    name: s.name,
    date: s.dateLabel,
    duration: s.duration,
    exerciseCount: `${s.exercises} exercise${s.exercises === 1 ? '' : 's'}`,
    // A metadata strip reads better with a value missing than with an em dash
    // standing in for it, so anything unrecorded is dropped rather than shown.
    meta: [s.duration, `${s.exercises} exercise${s.exercises === 1 ? '' : 's'}`,
      s.volume === DASH ? DASH : `Volume ${s.volume}`, s.energy].filter((x) => x !== DASH),
    prs: s.prCount ? `${s.prCount} PR${s.prCount > 1 ? 's' : ''}` : 'No PRs',
    prColor: s.prCount ? PINK : MUTED,
    go: () => set({ workout: i }),
    active: selIndex === i,
    effort: `${Math.max(4, (effortOf(s) / peakEffort) * 100).toFixed(0)}%`,
    kind: s.kind,
    week: weekOf(s.date),
    weekLabel: (() => {
      const monday = weekOf(s.date);
      const thisMonday = weekOf(todayISO());
      if (monday === thisMonday) return 'This week';
      if (monday === new Date(new Date(`${thisMonday}T12:00:00Z`).getTime() - 7 * DAY).toISOString().slice(0, 10)) {
        return 'Last week';
      }
      return `Week of ${fmtDate(monday)}`;
    })(),
  }));

  const sel = selected
    ? {
      name: selected.name,
      date: selected.fullDate,
      note: selected.note,
      stats: [
        { label: 'Duration', value: selected.duration },
        { label: 'Exercises', value: String(selected.exercises) },
        { label: 'Volume', value: selected.volume },
        { label: 'Energy', value: selected.energy },
      ],
      rows: selected.rows,
    }
    : null;

  const workoutsHeading = rangeSessions.length
    ? `${rangeLabel} — ${rangeSessions.length} session${rangeSessions.length === 1 ? '' : 's'}`
    : allSessions.length
      ? `Nothing in ${rangeLabel} — showing the ${sessionList.length} most recent`
      : 'No sessions logged yet';

  /* exercises ------------------------------------------------------------- */

  const exerciseRows = buildExercises(src.lifts, nowStats.lifts);
  const groups = ['All', ...MUSCLE_GROUPS].map((label) => ({
    label,
    go: () => set({ group: label }),
    active: st.group === label,
  }));

  const q = st.query.trim().toLowerCase();
  const exercises = exerciseRows.map((e) => {
    // A held movement is scored in seconds, and an estimated one-rep max on it
    // would be arithmetic on a number that means nothing.
    const isTime = /plank|hold|carry|hang|dead ?bug/i.test(e.name);
    return {
      key: e.name,
      name: e.name,
      group: e.group,
      equipment: e.equipment,
      pr: e.prKg === null ? DASH : `${nf(e.prKg, e.prKg % 1 ? 1 : 0)} ${isTime ? 's' : 'kg'}`,
      e1rm: e.e1rmKg && !isTime ? `${nf(e.e1rmKg, 1)} kg` : DASH,
      volume: e.volumeKg ? `${nf(e.volumeKg / 1000, 1)} t` : DASH,
      trend: e.pctChange === null ? 'first record' : e.pctChange === 0 ? 'held' : `↑ ${e.pctChange.toFixed(1)}%`,
      trendColor: e.pctChange ? GREEN : MUTED,
      spark: linePath(e.history, 100, 22, 3),
    };
  });
  const exercisesFiltered = exercises.filter(
    (e) =>
      (st.group === 'All' || e.group === st.group) &&
      (!q ||
        e.name.toLowerCase().includes(q) ||
        e.group.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q)),
  );

  /* progress -------------------------------------------------------------- */

  const exKey = st.ex && exerciseRows.some((e) => e.name === st.ex)
    ? st.ex
    : exerciseRows[0]?.name ?? '';
  const exRaw = exerciseRows.find((e) => e.name === exKey) ?? null;
  const exHistory = exRaw?.history ?? [];

  const exIsTime = exRaw ? /plank|hold|carry|hang|dead ?bug/i.test(exRaw.name) : false;
  const exUnit = exIsTime ? 's' : 'kg';
  const exSel = exRaw
    ? {
      name: exRaw.name,
      pr: exRaw.prKg === null ? DASH : `${nf(exRaw.prKg, exRaw.prKg % 1 ? 1 : 0)} ${exUnit}`,
      prev: exRaw.prevKg === null ? DASH : `${nf(exRaw.prevKg, exRaw.prevKg % 1 ? 1 : 0)} ${exUnit}`,
      e1rm: exRaw.e1rmKg && !exIsTime ? `${nf(exRaw.e1rmKg, 1)} kg` : DASH,
      sessions: exRaw.sessions,
      trend: exRaw.pctChange === null ? 'first record' : exRaw.pctChange === 0 ? 'held' : `↑ ${exRaw.pctChange.toFixed(1)}%`,
      trendColor: exRaw.pctChange ? GREEN : MUTED,
      path: linePath(exHistory, 900, 200, 20),
      area: areaPath(exHistory, 900, 200, 20),
      span: exHistory.length ? `Last ${exHistory.length} session${exHistory.length === 1 ? '' : 's'}` : 'No history',
    }
    : null;

  const volumeByGroup = new Map<MuscleGroup, number>();
  for (const l of nowStats.lifts) {
    const g = muscleGroupOf(l.exercise);
    volumeByGroup.set(g, (volumeByGroup.get(g) ?? 0) + l.volumeKg);
  }
  const groupTotal = [...volumeByGroup.values()].reduce((a, b) => a + b, 0);
  const distribution = MUSCLE_GROUPS.filter((g) => (volumeByGroup.get(g) ?? 0) > 0)
    .map((g) => {
      const share = ((volumeByGroup.get(g) ?? 0) / groupTotal) * 100;
      return { label: g, value: `${share.toFixed(0)}%`, pct: `${share.toFixed(0)}%` };
    })
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

  const cardioWorkouts = nowStats.workouts.filter(
    (w) => (w.distanceKm ?? 0) > 0 || (w.durationMin ?? 0) >= 10,
  );
  const cardioWeekly = weeklyBuckets(spanDays, (from, to) => {
    const inBucket = cardioWorkouts.filter((w) => {
      const t = new Date(w.startedAt).getTime();
      return t >= from && t < to;
    });
    if (!inBucket.length) return 0;
    switch (st.cardio) {
      case 'Distance':
        return inBucket.reduce((a, w) => a + (w.distanceKm ?? 0), 0);
      case 'Duration':
        return inBucket.reduce((a, w) => a + (w.durationMin ?? 0), 0);
      case 'Heart rate': {
        const hrs = inBucket.map((w) => w.avgHr).filter((v): v is number => !!v);
        return hrs.length ? hrs.reduce((a, b) => a + b, 0) / hrs.length : 0;
      }
      case 'Pace': {
        const paces = inBucket
          .filter((w) => isRunWorkout(w) && (w.distanceKm ?? 0) >= 1 && (w.durationMin ?? 0) > 0)
          .map((w) => (w.durationMin as number) / (w.distanceKm as number));
        return paces.length ? Math.min(...paces) : 0;
      }
    }
  });

  const bestPace = (() => {
    // Only runs. A walk has a pace arithmetically, but reporting 15:19/km as a
    // personal best alongside actual running is not a comparison worth making.
    const paces = cardioWorkouts
      .filter((w) => isRunWorkout(w) && (w.distanceKm ?? 0) >= 1 && (w.durationMin ?? 0) > 0)
      .map((w) => (w.durationMin as number) / (w.distanceKm as number));
    return paces.length ? Math.min(...paces) : null;
  })();

  const cardioHeadline: Record<CardioMetric, [string, string]> = {
    Distance: [nowStats.cardioDistanceKm ? nf(nowStats.cardioDistanceKm, 1) : DASH, `km in ${rangeLabel}`],
    Pace: [fmtPace(bestPace), 'min/km best'],
    Duration: [nowStats.cardioMinutes ? fmtHours(nowStats.cardioMinutes / 60) : DASH, 'total'],
    'Heart rate': [
      (() => {
        const hrs = cardioWorkouts.map((w) => w.avgHr).filter((v): v is number => !!v);
        return hrs.length ? nf(hrs.reduce((a, b) => a + b, 0) / hrs.length) : DASH;
      })(),
      'bpm average',
    ],
  };
  const [cardioValue, cardioUnit] = cardioHeadline[st.cardio];

  const cardioMax = Math.max(...cardioWeekly, 0.0001);
  const cardioStep = 420 / Math.max(1, cardioWeekly.length);
  const cardioUnitFor: Record<CardioMetric, (n: number) => string> = {
    Distance: (n) => `${nf(n, 1)} km`,
    Pace: (n) => `${fmtPace(n)} /km`,
    Duration: (n) => fmtMinutes(n),
    'Heart rate': (n) => `${nf(Math.round(n))} bpm`,
  };
  const bucketWidth = (nowWin.to - nowWin.from) / Math.max(1, cardioWeekly.length);
  const cardioBars = cardioWeekly.map((v, i) => {
    const h = (v / cardioMax) * 128;
    return {
      key: String(i),
      x: i * cardioStep + cardioStep * 0.16,
      cx: i * cardioStep + cardioStep * 0.5,
      y: 138 - h,
      w: cardioStep * 0.68,
      h: Math.max(0, h),
      fill: i === cardioWeekly.length - 1 ? PLUM : PINK_SOFT,
      label: v ? cardioUnitFor[st.cardio](v) : 'Nothing recorded',
      sub: `${fmtDate(new Date(nowWin.from + i * bucketWidth))} – ${fmtDate(new Date(nowWin.from + (i + 1) * bucketWidth - DAY))}`,
    };
  });

  const cardioTabs = (['Distance', 'Pace', 'Duration', 'Heart rate'] as CardioMetric[]).map((label) => ({
    label,
    go: () => set({ cardio: label }),
    active: st.cardio === label,
  }));

  const cardioTrendDelta = pctDelta(
    st.cardio === 'Distance' ? nowStats.cardioDistanceKm || null : nowStats.cardioMinutes || null,
    st.cardio === 'Distance' ? prevStats.cardioDistanceKm || null : prevStats.cardioMinutes || null,
  );

  /* timeline + records ---------------------------------------------------- */

  const prFlags = markPersonalBests(src.lifts);
  const recentPrLifts = src.lifts
    .filter((l) => prFlags.get(l.id) && new Date(l.performedOn).getTime() >= nowWin.from)
    .sort((a, b) => b.performedOn.localeCompare(a.performedOn))
    .slice(0, 3);

  const longestCardio = [...nowStats.workouts]
    .filter((w) => (w.distanceKm ?? 0) > 0)
    .sort((a, b) => (b.distanceKm ?? 0) - (a.distanceKm ?? 0))[0] ?? null;

  const timeline: Array<{ key: string; date: string; title: string; detail: string }> = [
    ...recentPrLifts.map((l) => ({
      key: `pr-${l.id}`,
      date: fmtDate(l.performedOn, true),
      title: `New ${l.exercise.toLowerCase()} best — ${nf(l.topSetKg, l.topSetKg % 1 ? 1 : 0)} kg`,
      detail: `${setsLabel(l)}, ${nf(Math.round(l.volumeKg))} kg of volume. Estimated 1RM ${nf(l.e1rmKg, 1)} kg.`,
    })),
  ];

  if (longestCardio) {
    const mins = longestCardio.durationMin ?? 0;
    const km = longestCardio.distanceKm ?? 0;
    timeline.push({
      key: `cardio-${longestCardio.id}`,
      date: fmtDate(longestCardio.startedAt, true),
      title: `Longest ${(longestCardio.type ?? 'session').toLowerCase()} — ${nf(km, 1)} km`,
      detail: mins
        ? `${fmtMinutes(mins)} at ${fmtPace(mins / km)}/km${longestCardio.avgHr ? `, average heart rate ${Math.round(longestCardio.avgHr)} bpm` : ''}.`
        : 'Distance recorded without a duration.',
    });
  }

  if (bodyLast !== null && bodyFirst !== null && Math.abs(bodyLast - bodyFirst) >= 0.1) {
    const leanNow = latest('muscleMass');
    const leanStart = earliestInRange('muscleMass');
    timeline.push({
      key: 'body',
      date: fmtDate(weighSeries[weighSeries.length - 1].date, true),
      title: `${st.body} ${bodyLast > bodyFirst ? 'up' : 'down'} ${nf(Math.abs(bodyLast - bodyFirst), 1)} ${bodyUnit}`,
      detail: leanNow !== null && leanStart !== null
        ? `Lean mass ${leanNow >= leanStart ? 'up' : 'down'} ${nf(Math.abs(leanNow - leanStart), 1)} kg across the same window.`
        : `Measured across ${inRangeWeigh.length} weigh-in${inRangeWeigh.length === 1 ? '' : 's'} in this window.`,
    });
  }

  if (nowStats.sessionDays) {
    timeline.push({
      key: 'consistency',
      date: rangeLabel.replace('last ', 'Last '),
      title: `${nowStats.sessionDays} session${nowStats.sessionDays === 1 ? '' : 's'} of ${nowStats.plannedSessions} planned`,
      detail: nowStats.longestGapDays === null
        ? 'Adherence across the selected window.'
        : `Longest gap between sessions ${nf(nowStats.longestGapDays, 0)} day${Math.round(nowStats.longestGapDays) === 1 ? '' : 's'}.`,
    });
  }

  const allPrLifts = [...src.lifts].sort((a, b) => b.topSetKg - a.topSetKg);
  const bestE1rm = [...src.lifts].sort((a, b) => b.e1rmKg - a.e1rmKg)[0] ?? null;
  const mostReps = src.lifts
    .flatMap((l) => l.sets.map((s) => ({ l, s })))
    .sort((a, b) => b.s.reps - a.s.reps)[0] ?? null;
  const farthest = [...src.workouts].sort((a, b) => (b.distanceKm ?? 0) - (a.distanceKm ?? 0))[0] ?? null;
  const fastest = src.workouts
    .filter((w) => (w.distanceKm ?? 0) >= 1 && (w.durationMin ?? 0) > 0)
    .sort((a, b) => (a.durationMin! / a.distanceKm!) - (b.durationMin! / b.distanceKm!))[0] ?? null;
  const longest = [...src.workouts].sort((a, b) => (b.durationMin ?? 0) - (a.durationMin ?? 0))[0] ?? null;

  const prs = [
    {
      key: 'heaviest', kind: 'Heaviest weight',
      name: allPrLifts[0]?.exercise ?? 'Nothing logged',
      value: allPrLifts[0] ? `${nf(allPrLifts[0].topSetKg, allPrLifts[0].topSetKg % 1 ? 1 : 0)} kg` : DASH,
      date: allPrLifts[0] ? fmtDate(allPrLifts[0].performedOn, true) : 'Log a lift to fill this in',
    },
    {
      key: 'e1rm', kind: 'Highest est. 1RM',
      name: bestE1rm?.exercise ?? 'Nothing logged',
      value: bestE1rm ? `${nf(bestE1rm.e1rmKg, 1)} kg` : DASH,
      date: bestE1rm ? fmtDate(bestE1rm.performedOn, true) : 'Log a lift to fill this in',
    },
    {
      key: 'reps', kind: 'Most reps',
      name: mostReps?.l.exercise ?? 'Nothing logged',
      value: mostReps ? `${mostReps.s.reps} @ ${nf(mostReps.s.weightKg, mostReps.s.weightKg % 1 ? 1 : 0)} kg` : DASH,
      date: mostReps ? fmtDate(mostReps.l.performedOn, true) : 'Log a lift to fill this in',
    },
    {
      key: 'distance', kind: 'Longest distance',
      name: farthest?.type ?? 'Nothing synced',
      value: farthest?.distanceKm ? `${nf(farthest.distanceKm, 1)} km` : DASH,
      date: farthest?.distanceKm ? fmtDate(farthest.startedAt, true) : 'No distance workouts yet',
    },
    {
      key: 'pace', kind: 'Fastest pace',
      name: fastest?.type ?? 'Nothing synced',
      value: fastest ? `${fmtPace(fastest.durationMin! / fastest.distanceKm!)} /km` : DASH,
      date: fastest ? fmtDate(fastest.startedAt, true) : 'No paced workouts yet',
    },
    {
      key: 'longest', kind: 'Longest workout',
      name: longest?.type ?? 'Nothing synced',
      value: longest?.durationMin ? fmtMinutes(longest.durationMin) : DASH,
      date: longest?.durationMin ? fmtDate(longest.startedAt, true) : 'No timed workouts yet',
    },
  ];

  /* goals ----------------------------------------------------------------- */

  const goalOf = (
    dimension: string,
    title: string,
    current: number | null,
    target: number,
    fmtV: (v: number) => string,
    note: string,
  ) => {
    const pct = current === null ? 0 : Math.min(100, (current / target) * 100);
    const status = current === null ? 'No data' : pct >= 95 ? 'On track' : pct >= 75 ? 'Close' : 'Behind';
    // An arc reads as progress toward something in a way a bar does not, and a
    // ring has a natural end where a bar just stops.
    const R = 46;
    const circumference = 2 * Math.PI * R;
    return {
      key: title,
      radius: R,
      circumference: circumference.toFixed(1),
      dash: `${((pct / 100) * circumference).toFixed(1)} ${circumference.toFixed(1)}`,
      dimension,
      title,
      current: current === null ? DASH : fmtV(current),
      target: fmtV(target),
      pct: `${pct.toFixed(0)}%`,
      due: `Rolling ${rangeLabel}`,
      status,
      statusColor: current === null ? MUTED : pct >= 95 ? GREEN : pct >= 75 ? AMBER : ROSE,
      note,
    };
  };

  const goals = [
    goalOf('Activity', `${nf(TARGETS.stepGoal)} average steps`, nowStats.avgSteps, TARGETS.stepGoal,
      (v) => nf(v),
      'Averaged across every day with step data in the selected window.'),
    goalOf('Consistency', `${TARGETS.sessionsPerWeek} sessions a week`,
      nowStats.sessionDays / Math.max(1, nowStats.weeks), TARGETS.sessionsPerWeek,
      (v) => `${nf(v, 1)}/wk`,
      'A day counts once, whether it held lifts, a cardio workout, or both.'),
    goalOf('Nutrition', `Protein ${nf(proteinTarget)} g a day`, nowStats.avgProtein, proteinTarget,
      (v) => `${nf(v)} g`,
      `Target is ${TARGETS.proteinPerKg} g per kg of bodyweight, from your most recent weigh-in.`),
    goalOf('Cardio', `${TARGETS.cardioMinutesPerWeek} cardio minutes a week`,
      nowStats.cardioMinutes / Math.max(1, nowStats.weeks), TARGETS.cardioMinutesPerWeek,
      (v) => `${nf(v)} min`,
      'The weekly minimum for adults in the UK physical activity guidelines.'),
  ];

  /* insights -------------------------------------------------------------- */

  const spanLabel = `${fmtDate(new Date(nowWin.from))} – ${fmtDate(new Date(nowWin.to))}`;
  const insights: Array<{
    key: string; tag: string; tagColor: string; title: string; body: string; source: string;
    metric?: { value: string; unit: string } | null;
    when?: string;
    age?: number;
  }> = [];

  if (nowStats.lifts.length) {
    const d = pctDelta(volumeTonnes || null, prevVolumeTonnes || null);
    insights.push({
      key: 'strength',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Strength',
      tagColor: TAG_GOOD,
      title: d.color === GREEN ? 'Strength volume is trending up' : d.text === 'held' ? 'Strength volume is holding' : 'Strength volume is down',
      body: `You moved ${nf(nowStats.volumeKg)} kg across ${nowStats.liftSessionDays} lift session${nowStats.liftSessionDays === 1 ? '' : 's'} — ${d.text === DASH ? 'no comparable previous period' : `${d.text} against ${againstLabel}`}.${exerciseRows[0]?.e1rmKg ? ` Best estimated one-rep max is ${nf(exerciseRows[0].e1rmKg, 1)} kg on the ${exerciseRows[0].name.toLowerCase()}.` : ''}`,
      source: `From ${nowStats.lifts.length} logged lift${nowStats.lifts.length === 1 ? '' : 's'}, ${spanLabel}`,
      metric: { value: `${nf(Math.round(volumeTonnes))}t`, unit: 'lifted' },
    });
  }

  if (!nowStats.lifts.length && nowStats.strengthSessionDays) {
    const d = pctDelta(nowStats.strengthSessionDays, prevStats.strengthSessionDays);
    insights.push({
      key: 'strength-sessions',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Strength',
      tagColor: TAG_GOOD,
      title: 'Strength is scored on sessions, not volume',
      body: `${nowStats.strengthSessionDays} strength session${nowStats.strengthSessionDays === 1 ? '' : 's'} against ${nowStats.plannedSessions} planned — ${d.text === DASH ? 'no comparable previous period' : `${d.text} on ${againstLabel}`}. Your sets and loads are recorded in your coaching app and never reach this project, so volume and personal bests cannot be shown.`,
      source: `From ${nowStats.workouts.length} synced workout${nowStats.workouts.length === 1 ? '' : 's'}, ${spanLabel}`,
      metric: { value: String(nowStats.strengthSessionDays), unit: `of ${nowStats.plannedSessions} planned` },
    });
  }

  if (nowStats.sessionDays) {
    const pct = Math.round((nowStats.sessionDays / Math.max(1, nowStats.plannedSessions)) * 100);
    const extra = nowStats.sessionDays - nowStats.plannedSessions;
    const gapNote = nowStats.longestGapDays === null
      ? ''
      : `, with no gap longer than ${nf(nowStats.longestGapDays, 0)} days`;
    insights.push({
      key: 'consistency',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Consistency',
      tagColor: pct >= 85 ? TAG_GOOD : TAG_WATCH,
      title: extra > 0 ? 'Ahead of the planned schedule'
        : pct >= 85 ? 'Consistency is holding up'
          : 'Sessions are behind the plan',
      body: extra > 0
        ? `${nowStats.sessionDays} sessions against ${nowStats.plannedSessions} planned — ${extra} more than the plan asks for${gapNote}.`
        : `${nowStats.sessionDays} of ${nowStats.plannedSessions} planned sessions completed — ${pct}% adherence${gapNote}.`,
      source: `From the session log, ${spanLabel}`,
      metric: { value: `${pct}%`, unit: 'adherence' },
    });
  }

  if (nowStats.avgSleepH !== null) {
    const down = sleepDelta.color === ROSE || sleepDelta.text.startsWith('↓');
    insights.push({
      key: 'recovery',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Recovery',
      tagColor: down ? TAG_WATCH : TAG_GOOD,
      title: down ? 'Recovery could improve' : 'Recovery is steady',
      body: `Average sleep is ${fmtHours(nowStats.avgSleepH)}${sleepDelta.text === 'held' ? `, unchanged on ${againstLabel}` : `, ${sleepDelta.text} on ${againstLabel}`}${nowStats.avgHrv === null ? '' : `, and HRV is ${nf(nowStats.avgHrv)} ms (${hrvDelta.text})`}.`,
      source: `From ${nowStats.days.filter((d) => (d.sleep.totalMin ?? 0) > 0).length} nights of sleep data`,
      metric: { value: fmtHours(nowStats.avgSleepH), unit: 'a night' },
    });
  }

  if (bodyLast !== null && bodyFirst !== null) {
    const leanNow = latest('muscleMass');
    const leanStart = earliestInRange('muscleMass');
    insights.push({
      key: 'body',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Body composition',
      tagColor: TAG_INFO,
      title: 'What the scale is showing',
      body: `${st.body} moved from ${nf(bodyFirst, 1)} to ${nf(bodyLast, 1)} ${bodyUnit} across this window.${leanNow !== null && leanStart !== null ? ` Lean mass went from ${nf(leanStart, 1)} to ${nf(leanNow, 1)} kg over the same span, so the change is in composition as well as total.` : ''}`,
      source: `From ${inRangeWeigh.length || weighSeries.length} weigh-in${(inRangeWeigh.length || weighSeries.length) === 1 ? '' : 's'}`,
      metric: bodyLast === null ? null : { value: `${nf(bodyLast, 1)}`, unit: bodyUnit },
    });
  }

  if (nowStats.nutritionDays) {
    insights.push({
      key: 'nutrition',
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 0,
      tag: 'Nutrition',
      tagColor: TAG_INFO,
      title: nowStats.proteinOnTarget / nowStats.nutritionDays < nowStats.calOnTarget / nowStats.nutritionDays
        ? 'Protein is the gap, not calories'
        : 'Calories are the gap, not protein',
      body: `Calories landed within ${nf(TARGETS.calorieTarget * 0.1)} kcal of the ${nf(TARGETS.calorieTarget)} target on ${nowStats.calOnTarget} of ${nowStats.nutritionDays} logged days. Protein averaged ${num(nowStats.avgProtein)} g against a ${nf(proteinTarget)} g target.`,
      source: `From ${nowStats.nutritionDays} logged day${nowStats.nutritionDays === 1 ? '' : 's'}`,
      metric: { value: `${nowStats.calOnTarget}/${nowStats.nutritionDays}`, unit: 'days on target' },
    });
  }

  // What only the history can say: how this month ranks, where the weight is
  // heading, what the training week actually looks like.
  insights.push(...historyInsights(src, nowWin));

  // Dimensions with too little behind them get named rather than left blank —
  // an empty panel reads as a bad score instead of an absent one.
  for (const d of DIMENSIONS) {
    if (insights.length >= 12) break;
    const row = rows.find((r) => r.label === d);
    if (row?.score !== null) continue;
    insights.push({
      key: `empty-${d}`,
      when: rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1),
      age: 1,
      tag: d,
      tagColor: MUTED,
      title: 'Not enough data yet',
      body: `${d} has nothing logged in ${rangeLabel}, so it is not being scored and is not pulling the overall figure down.`,
      source: 'Waiting on data from this source',
      metric: null,
    });
  }

  /* settings -------------------------------------------------------------- */

  const lastSync = src.days.length ? src.days[src.days.length - 1].date.slice(0, 10) : null;
  const lastWeigh = weighAll.length ? weighAll[weighAll.length - 1].date.slice(0, 10) : null;

  const settings = [
    { key: 'units', label: 'Units', note: 'Weight, distance and volume', value: 'Metric — kg, km' },
    { key: 'cal', label: 'Daily calorie target', note: 'Used across nutrition scoring and goals', value: `${nf(TARGETS.calorieTarget)} kcal` },
    { key: 'protein', label: 'Protein target', note: `${TARGETS.proteinPerKg} g per kg of bodyweight`, value: `${nf(proteinTarget)} g` },
    { key: 'sessions', label: 'Planned sessions', note: 'Drives workout adherence and consistency', value: `${TARGETS.sessionsPerWeek} per week` },
    { key: 'steps', label: 'Step goal', note: 'Rolling daily average', value: `${nf(TARGETS.stepGoal)} steps` },
    { key: 'sleep', label: 'Sleep target', note: 'Drives the recovery score', value: `${TARGETS.sleepTargetH} hours` },
    { key: 'cardio', label: 'Cardio target', note: 'UK physical activity guideline minimum', value: `${TARGETS.cardioMinutesPerWeek} min per week` },
    {
      key: 'health', label: 'Apple Health', note: 'Steps, sleep, heart rate and nutrition',
      value: lastSync ? `${src.days.length} days — to ${fmtDate(lastSync)}` : 'Nothing synced',
    },
    {
      key: 'scale', label: 'Smart scale', note: 'Weight, body fat and lean mass',
      value: lastWeigh ? `${weighAll.length} weigh-ins — to ${fmtDate(lastWeigh)}` : 'Nothing synced',
    },
    {
      key: 'lifts', label: 'Lift log', note: 'The one source entered by hand',
      value: src.lifts.length ? `${src.lifts.length} lifts logged` : 'Nothing logged',
    },
  ];

  /* energy balance -------------------------------------------------------- */

  const energy = buildEnergy(
    energyDays(nowStats.days, nowStats.workouts),
    inRangeWeigh.length >= 4 ? inRangeWeigh : weighAll.slice(-60),
    spanDays,
  );

  /* the period, laid out as the units it is made of ------------------------ */

  const periodView = buildPeriodView(src, st.range, nowWin, todayISO());

  /* the dimension ribbon -------------------------------------------------- */

  const ribbon = buildRibbon({ ...src, workouts: allWorkouts }, 12);

  /* body composition ------------------------------------------------------ */

  const bodyAnalysis = buildBodyAnalysis(
    inRangeWeigh.length >= 2 ? inRangeWeigh : weighAll.slice(-90),
    inRangeWeigh.length >= 2 ? rangeLabel : `the last ${Math.min(90, weighAll.length)} weigh-ins`,
  );

  /* activities ------------------------------------------------------------ */

  const activityRows = buildActivities(src.workouts, nowStats.workouts, prevStats.workouts, spanDays);

  /* the body chart -------------------------------------------------------- */

  // Weigh-ins are irregular — several in a week, then nothing for a month. Laying
  // them out evenly by index would draw a 39-day gap the same width as a one-day
  // gap, which is exactly the shape a weight trend must not lie about. Points are
  // positioned by their actual date instead.
  const bodyChart = (() => {
    const W = 680;
    const H = 166;
    const PAD = 14;

    const pts = weighSeries
      .map((r) => ({ date: r.date.slice(0, 10), value: pickScale(r, st.body) }))
      .filter((p): p is { date: string; value: number } => p.value !== null);

    if (pts.length === 0) {
      return {
        bodyPath: '', bodyArea: '', bodyPoints: [] as BodyPoint[],
        bodyStart: DASH, bodyEnd: DASH, bodyMin: DASH, bodyMax: DASH,
        bodyCount: 0, bodySpanNote: 'No weigh-ins to plot in this window.',
      };
    }

    const t = (d: string) => new Date(`${d}T12:00:00Z`).getTime();
    const first = t(pts[0].date);
    const last = t(pts[pts.length - 1].date);
    // A single reading, or several on one day, would divide by zero.
    const span = last - first || 1;

    const values = pts.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const range = hi - lo || 1;

    const x = (d: string) => ((t(d) - first) / span) * W;
    const y = (v: number) => PAD + (1 - (v - lo) / range) * (H - PAD * 2);

    const dp = st.body === 'Body fat %' ? 1 : 1;
    const points: BodyPoint[] = pts.map((p) => ({
      key: `${p.date}-${p.value}`,
      x: Number(x(p.date).toFixed(1)),
      y: Number(y(p.value).toFixed(1)),
      cx: Number(x(p.date).toFixed(1)),
      cy: Number(y(p.value).toFixed(1)),
      value: p.value,
      valueLabel: `${nf(p.value, dp)} ${bodyUnit}`,
      dateLabel: fmtDate(p.date, true),
      label: `${nf(p.value, dp)} ${bodyUnit}`,
      sub: fmtDate(p.date, true),
    }));

    const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');

    return {
      bodyPath: path,
      bodyArea: `${path} L${W} ${H} L0 ${H} Z`,
      bodyPoints: points,
      bodyStart: fmtDate(pts[0].date),
      bodyEnd: fmtDate(pts[pts.length - 1].date),
      bodyMin: `${nf(lo, dp)} ${bodyUnit}`,
      bodyMax: `${nf(hi, dp)} ${bodyUnit}`,
      bodyCount: pts.length,
      bodySpanNote: usingFallback
        ? `Only ${inRangeWeigh.length} weigh-in${inRangeWeigh.length === 1 ? '' : 's'} in ${rangeLabel}, so the chart shows the last ${pts.length} on record.`
        : `${pts.length} weigh-in${pts.length === 1 ? '' : 's'} across ${rangeLabel}, spaced by date.`,
    };
  })();

  /* chrome ---------------------------------------------------------------- */

  /* the fat loss journey -------------------------------------------------- */

  const journey = (() => {
    const latest = latest2('weight');
    const start = JOURNEY.startKg;
    const goal = JOURNEY.goalKg;
    const span = start - goal;

    // Progress is measured from the declared start, so an older weigh-in
    // arriving in an import cannot rewrite where this began.
    const lost = latest === null ? null : start - latest;
    const pct = lost === null || span <= 0 ? null : Math.max(0, Math.min(100, (lost / span) * 100));
    const toGo = latest === null ? null : latest - goal;

    // Rate from the fitted trend over the journey so far, not first-vs-last.
    const sinceStart = weighAll.filter(
      (r) => r.weight > 0 && r.date.slice(0, 10) >= JOURNEY.startDate,
    );
    // A rate needs a span, not just a count. Five readings across five days can
    // fit a line implying 1.6 kg a week and a goal date in November — that is a
    // water-weight swing being read as a trend, and projecting a twenty-kilogram
    // journey off it would set a date the body was never going to meet.
    const MIN_SPAN_DAYS = 21;
    const spanDaysMeasured = sinceStart.length >= 2
      ? (new Date(sinceStart[sinceStart.length - 1].date).getTime()
        - new Date(sinceStart[0].date).getTime()) / DAY
      : 0;

    const fit = sinceStart.length >= 4 && spanDaysMeasured >= MIN_SPAN_DAYS
      ? fitReadings(sinceStart.map((r) => ({ date: r.date.slice(0, 10), weight: r.weight })))
      : null;
    // Loss faster than 1% of bodyweight a week is not sustained, so a fit
    // claiming it is measuring noise rather than progress.
    const rawPerWeek = fit ? fit.slope * 7 : null;
    const perWeek = rawPerWeek !== null && Math.abs(rawPerWeek) <= (latest2('weight') ?? 90) * 0.012
      ? rawPerWeek
      : null;
    const tooSoon = sinceStart.length >= 2 && spanDaysMeasured < MIN_SPAN_DAYS;

    // Only project when the weight is actually moving toward the goal.
    const weeksLeft = perWeek !== null && perWeek < -0.01 && toGo !== null && toGo > 0
      ? toGo / Math.abs(perWeek)
      : null;
    const eta = weeksLeft === null
      ? null
      : new Date(Date.now() + weeksLeft * 7 * DAY);

    const targetWeeks = span > 0 ? span / JOURNEY.targetKgPerWeek : 0;
    const targetEta = new Date(
      new Date(`${JOURNEY.startDate}T12:00:00Z`).getTime() + targetWeeks * 7 * DAY,
    );

    /* milestones ---------------------------------------------------------- */

    // A twenty-kilogram goal is too far away to feel like anything. Every whole
    // stone-ish step between here and there is a real event, and the next one is
    // always close enough to be worth aiming at this month.
    const stops: number[] = [];
    for (let kg = Math.floor(start) - 1; kg > goal; kg -= 2.5) stops.push(kg);
    stops.push(goal);

    const rate = perWeek !== null && perWeek < -0.01 ? Math.abs(perWeek) : JOURNEY.targetKgPerWeek;
    const milestones = stops.map((kg) => {
      const done = latest !== null && latest <= kg;
      const away = latest === null ? null : latest - kg;
      const weeks = done || away === null || away <= 0 ? null : away / rate;
      return {
        key: String(kg),
        label: `${nf(kg, kg % 1 ? 1 : 0)} kg`,
        done,
        isNext: false,
        away: away === null || away <= 0 ? null : `${nf(away, 1)} kg away`,
        eta: weeks === null ? null : fmtDate(new Date(Date.now() + weeks * 7 * DAY)),
        isGoal: kg === goal,
      };
    });
    const nextAt = milestones.findIndex((m) => !m.done);
    if (nextAt >= 0) milestones[nextAt].isNext = true;

    /* week and month views -------------------------------------------------- */

    /**
     * Grouped means rather than endpoints.
     *
     * A week's weight is the average of its readings, and the change is the gap
     * between one week's average and the last. Comparing Monday to Monday would
     * report whatever the water did on two particular mornings; averaging a
     * week's worth is the standard way to see through that, and it is why a
     * weekly figure can be trusted where a daily one cannot.
     */
    const buildBuckets = (grain: 'week' | 'month') => {
      const keyOf = (iso: string) => {
        if (grain === 'month') return iso.slice(0, 7);
        const d = new Date(`${iso}T12:00:00Z`);
        return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY).toISOString().slice(0, 10);
      };

      const groups = new Map<string, number[]>();
      for (const r of weighAll) {
        if (r.weight <= 0) continue;
        const k = keyOf(r.date.slice(0, 10));
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(r.weight);
      }

      const ordered = [...groups.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, vals]) => ({
          key,
          mean: vals.reduce((a, b) => a + b, 0) / vals.length,
          count: vals.length,
        }));

      // Enough to read a pattern, not so many that the page becomes a ledger.
      const shown = ordered.slice(-(grain === 'week' ? 10 : 8)).reverse();
      const targetPerBucket = grain === 'week'
        ? JOURNEY.targetKgPerWeek
        : JOURNEY.targetKgPerWeek * 4.35;

      // How many buckets apart two keys are, so a gap in weighing is not
      // presented as a week-over-week change when it spans three weeks.
      const spanBetween = (a: string, b: string) => {
        if (grain === 'month') {
          const [ay, am] = a.split('-').map(Number);
          const [by, bm] = b.split('-').map(Number);
          return (ay - by) * 12 + (am - bm);
        }
        return Math.round(
          (Date.parse(`${a}T12:00:00Z`) - Date.parse(`${b}T12:00:00Z`)) / (7 * DAY),
        );
      };

      return shown.map((b, i) => {
        const older = shown[i + 1];
        const gap = older ? spanBetween(b.key, older.key) : 0;
        const change = older ? b.mean - older.mean : null;

        // A change across a gap is not a rate. Scaling the target to the span
        // keeps "on plan" meaning the same thing however far apart the two
        // readings are.
        const scaledTarget = targetPerBucket * Math.max(1, gap);
        const onPlan = change !== null && change <= -scaledTarget * 0.9;
        const drifting = change !== null && change > 0;

        return {
          key: b.key,
          label: grain === 'month'
            ? new Date(`${b.key}-01T12:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
            : `Week of ${fmtDate(b.key)}`,
          weight: `${nf(b.mean, 1)} kg`,
          readings: `${b.count} reading${b.count === 1 ? '' : 's'}`,
          change: change === null
            ? 'first on record'
            : Math.abs(change) < 0.05 ? 'held' : `${change < 0 ? '−' : '+'}${nf(Math.abs(change), 2)} kg`,
          changeColor: change === null ? MUTED : Math.abs(change) < 0.05 ? MUTED : change < 0 ? GREEN : ROSE,
          // Bar drawn from the middle: loss left, gain right, against the target.
          barPct: change === null ? '0%' : `${Math.min(50, (Math.abs(change) / (scaledTarget * 2)) * 50).toFixed(1)}%`,
          losing: change !== null && change < 0,
          onPlan,
          drifting,
          // A skipped bucket is named rather than hidden, because a fortnight's
          // change sitting in a week's row would read as twice the rate it was.
          gapNote: gap > 1 ? `over ${gap} ${grain}s` : null,
          note: change === null
            ? ''
            : gap > 1
              ? `over ${gap} ${grain}s`
              : onPlan ? 'on plan' : drifting ? 'up' : 'under plan',
          beforeStart: b.key < JOURNEY.startDate.slice(0, grain === 'month' ? 7 : 10),
        };
      });
    };

    // Day and Week show weeks; Month, Year and a long custom range show months.
    // The control at the top of the page is the one people reach for, so it
    // drives this unless a choice has been pinned below.
    const grain: 'week' | 'month' = st.journeyGrain
      ?? (st.range === 'Day' || st.range === 'Week' ? 'week'
        : st.range === 'Custom' && spanDays <= 60 ? 'week'
          : 'month');

    /* the trajectory ------------------------------------------------------- */

    /**
     * Two ways to look at the same journey.
     *
     * Drawn across the whole plan, the first weeks are a squiggle in the corner:
     * the x-axis runs to next June and the y-axis spans twenty kilograms, so a
     * kilogram of actual movement is a pixel. That view is right for seeing the
     * distance and useless for seeing progress, which is the thing you look at
     * a chart every week for.
     *
     * So the default fits both axes to what has happened, with the plan line
     * still drawn through it — near enough to read a week against, while "whole
     * plan" stays a click away for the long view.
     */
    const chartFor = (mode: 'sofar' | 'plan') => {
      const W = 900;
      const H = 190;
      const PAD = 16;
      const startAt = new Date(`${JOURNEY.startDate}T12:00:00Z`).getTime();
      const planWeeks = span > 0 ? span / JOURNEY.targetKgPerWeek : 1;
      const planEnd = startAt + planWeeks * 7 * DAY;

      const values = sinceStart.map((r) => r.weight);
      const lastAt = sinceStart.length
        ? new Date(`${sinceStart[sinceStart.length - 1].date.slice(0, 10)}T12:00:00Z`).getTime()
        : startAt;

      const from = startAt;
      let to = planEnd;
      let lo = goal - 1;
      let hi = start + 1.5;

      if (mode === 'sofar') {
        // A quarter again of the elapsed time as forward room, and at least a
        // fortnight, so the newest reading is never pinned to the right edge.
        const elapsed = Math.max(14 * DAY, lastAt - startAt);
        to = Math.min(planEnd, startAt + elapsed * 1.25);

        // The plan's own position at the right edge has to stay on the chart,
        // or the target line leaves the frame and the comparison is lost.
        const planAtEnd = start - ((to - startAt) / (7 * DAY)) * JOURNEY.targetKgPerWeek;
        const seen = values.length ? values : [start];
        const seenLo = Math.min(...seen, planAtEnd, start);
        const seenHi = Math.max(...seen, start);
        const pad = Math.max(0.4, (seenHi - seenLo) * 0.18);
        lo = seenLo - pad;
        hi = seenHi + pad;
      }

      const range = hi - lo || 1;
      const x = (t: number) => ((t - from) / Math.max(1, to - from)) * W;
      const y = (kg: number) => PAD + (1 - (kg - lo) / range) * (H - PAD * 2);
      const clamp = (v: number) => Math.max(0, Math.min(H, v));

      const marks = sinceStart
        .filter((r) => {
          const t = new Date(`${r.date.slice(0, 10)}T12:00:00Z`).getTime();
          return t >= from && t <= to;
        })
        .map((r) => ({
          key: r.date.slice(0, 10),
          cx: Number(x(new Date(`${r.date.slice(0, 10)}T12:00:00Z`).getTime()).toFixed(1)),
          cy: Number(clamp(y(r.weight)).toFixed(1)),
          label: `${nf(r.weight, 1)} kg`,
          sub: fmtDate(r.date, true),
        }));

      // Whole kilograms across the visible band, so the axis says something.
      const gridLines: Array<{ key: string; y: string; label: string }> = [];
      for (let kg = Math.ceil(lo); kg <= Math.floor(hi); kg++) {
        if (gridLines.length > 9) break;
        gridLines.push({ key: String(kg), y: y(kg).toFixed(1), label: `${kg} kg` });
      }

      const planStartY = clamp(y(start));
      const planEndY = clamp(y(start - ((to - from) / (7 * DAY)) * JOURNEY.targetKgPerWeek));

      return {
        width: W,
        height: H,
        planPath: `M${x(from).toFixed(1)} ${planStartY.toFixed(1)} L${W} ${planEndY.toFixed(1)}`,
        actualPath: marks.map((p, i) => `${i ? 'L' : 'M'}${p.cx} ${p.cy}`).join(' '),
        marks,
        // Only meaningful when the goal is inside the visible band.
        goalY: goal >= lo && goal <= hi ? y(goal).toFixed(1) : null,
        gridLines,
        startLabel: fmtDate(new Date(from)),
        endLabel: fmtDate(new Date(to)),
        // The visible band, said plainly — a fitted axis must never be mistaken
        // for the whole twenty kilograms.
        bandLabel: `${nf(lo, 1)} – ${nf(hi, 1)} kg`,
        rangeLabel: mode === 'sofar'
          ? (() => {
            const wks = Math.max(1, Math.round((lastAt - startAt) / (7 * DAY)));
            return `${wks} week${wks === 1 ? '' : 's'} in`;
          })()
          : 'the whole plan',
      };
    };

    const chartMode: 'sofar' | 'plan' = st.journeyChart ?? 'sofar';

    return {
      startKg: nf(start, 1),
      goalKg: nf(goal, 1),
      milestones,
      nextMilestone: nextAt >= 0 ? milestones[nextAt] : null,
      buckets: buildBuckets(grain),
      grainTabs: (['week', 'month'] as const).map((g) => ({
        label: g === 'week' ? 'By week' : 'By month',
        // Choosing here pins the grain; the period control stops driving it
        // until the same choice is made again, which releases it.
        go: () => set({ journeyGrain: st.journeyGrain === g ? null : g }),
        active: grain === g,
      })),
      grainFollows: st.journeyGrain === null,
      grainNote: grain === 'week'
        ? `Each row is that week's average weight, and the change against the week before. Averages rather than endpoints, because Monday against Monday reports whatever the water did on two mornings. Target is ${nf(JOURNEY.targetKgPerWeek, 1)} kg a week.`
        : `Each row is that month's average weight against the month before. Target is about ${nf(JOURNEY.targetKgPerWeek * 4.35, 1)} kg a month.`,
      chart: chartFor(chartMode),
      chartTabs: (['sofar', 'plan'] as const).map((m) => ({
        label: m === 'sofar' ? 'So far' : 'Whole plan',
        go: () => set({ journeyChart: m }),
        active: chartMode === m,
      })),
      currentKg: latest === null ? DASH : nf(latest, 1),
      lostKg: lost === null ? DASH : `${lost < 0 ? '+' : ''}${nf(Math.abs(lost), 1)}`,
      toGoKg: toGo === null ? DASH : nf(Math.max(0, toGo), 1),
      pct: pct === null ? 0 : pct,
      pctLabel: pct === null ? DASH : `${pct.toFixed(0)}%`,
      rate: perWeek === null ? DASH : `${perWeek < 0 ? '−' : '+'}${nf(Math.abs(perWeek), 2)} kg/wk`,
      rateColor: perWeek === null ? MUTED : perWeek < -0.01 ? GREEN : perWeek > 0.01 ? ROSE : MUTED,
      readings: sinceStart.length,
      etaLabel: eta ? fmtDate(eta, true) : null,
      targetRate: `${nf(JOURNEY.targetKgPerWeek, 1)} kg/wk`,
      targetEtaLabel: fmtDate(targetEta, true),
      note: latest === null
        ? 'No weigh-in yet.'
        : tooSoon
          ? `Started ${fmtDate(JOURNEY.startDate, true)} at ${nf(start, 1)} kg, ${nf(Math.round(spanDaysMeasured))} days ago. A rate needs about three weeks behind it — over a few days the scale is mostly reporting water, and a line through that would project a date nothing could meet. At the planned ${nf(JOURNEY.targetKgPerWeek, 1)} kg a week the goal lands ${fmtDate(targetEta, true)}.`
          : sinceStart.length < 4
            ? `Started ${fmtDate(JOURNEY.startDate, true)} at ${nf(start, 1)} kg. A rate needs at least four weigh-ins since then — there ${sinceStart.length === 1 ? 'is' : 'are'} ${sinceStart.length}.`
            : eta
              ? `At the current rate, ${nf(goal, 1)} kg lands around ${fmtDate(eta, true)}. At the planned ${nf(JOURNEY.targetKgPerWeek, 1)} kg a week it would be ${fmtDate(targetEta, true)}.`
              : `Weight is not currently moving toward ${nf(goal, 1)} kg, so there is nothing honest to project from. At the planned ${nf(JOURNEY.targetKgPerWeek, 1)} kg a week the goal would land ${fmtDate(targetEta, true)}.`,
    };
  })();

  /* the opened day -------------------------------------------------------- */

  const dayDetail = (() => {
    const date = st.selectedDay;
    if (!date) return null;

    const health = src.days.find((d) => d.date.slice(0, 10) === date) ?? null;
    const sessions = src.workouts.filter((w) => w.startedAt.slice(0, 10) === date);
    const lifts = src.lifts.filter((l) => l.performedOn.slice(0, 10) === date);
    const weigh = weighAll.find((r) => r.date.slice(0, 10) === date && r.weight > 0) ?? null;

    const active = health?.activity.activeEnergyKcal ?? null;
    const basal = health?.activity.basalEnergyKcal ?? null;
    const inKcal = health?.nutrition.dietaryEnergyKcal ?? null;
    const outKcal = active !== null && basal !== null ? Math.round(active + basal) : null;

    const metrics = [
      { label: 'Steps', value: health?.activity.steps == null ? DASH : nf(health.activity.steps) },
      { label: 'Exercise', value: health?.activity.exerciseMinutes == null ? DASH : `${nf(health.activity.exerciseMinutes)} min` },
      { label: 'Calories in', value: inKcal == null ? DASH : nf(Math.round(inKcal)) },
      { label: 'Calories out', value: outKcal == null ? DASH : nf(outKcal) },
      { label: 'Protein', value: health?.nutrition.proteinG == null ? DASH : `${nf(health.nutrition.proteinG)} g` },
      { label: 'Sleep', value: health?.sleep.totalMin ? fmtHours(health.sleep.totalMin / 60) : DASH },
      { label: 'Resting HR', value: health?.heart.restingHr == null ? DASH : `${nf(health.heart.restingHr)} bpm` },
      { label: 'Weight', value: weigh ? `${nf(weigh.weight, 1)} kg` : DASH },
    ];

    return {
      date,
      label: new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
      }),
      close: () => set({ selectedDay: null }),
      // Following a day into the session list is the natural next question.
      openSessions: () => set({ screen: 'Workouts', selectedDay: null }),
      metrics,
      sessions: [
        ...sessions.map((w) => ({
          key: w.id,
          name: prettyType(w.type),
          kind: workoutKindOf(w) === 'strength' ? 'Strength' : workoutKindOf(w) === 'cardio' ? 'Cardio' : 'Other',
          detail: [
            w.durationMin ? fmtMinutes(w.durationMin) : null,
            w.distanceKm ? `${nf(w.distanceKm, 1)} km` : null,
            w.energyKcal ? `${nf(Math.round(w.energyKcal))} kcal` : null,
            w.avgHr ? `${nf(Math.round(w.avgHr))} bpm avg` : null,
          ].filter(Boolean).join('  ·  ') || 'No detail recorded',
          source: w.source ?? null,
        })),
        ...lifts.map((l) => ({
          key: l.id,
          name: l.exercise,
          kind: 'Lift',
          detail: `${setsLabel(l)}  ·  ${nf(Math.round(l.volumeKg))} kg volume`,
          source: null,
        })),
      ],
      empty: !sessions.length && !lifts.length,
    };
  })();

  /* the calendar ---------------------------------------------------------- */

  const calendar = (() => {
    const anchor = st.calendarMonth || `${todayISO().slice(0, 7)}`;
    const [cy, cm] = anchor.split('-').map(Number);
    const firstOfMonth = new Date(Date.UTC(cy, cm - 1, 1));
    const daysInMonth = new Date(Date.UTC(cy, cm, 0)).getUTCDate();
    // Monday-first, like the rest of the dashboard.
    const lead = (firstOfMonth.getUTCDay() + 6) % 7;

    const sessionsByDate = new Map<string, { strength: number; cardio: number; other: number }>();
    for (const w of src.workouts) {
      const key = w.startedAt.slice(0, 10);
      const kind = workoutKindOf(w);
      const at = sessionsByDate.get(key) ?? { strength: 0, cardio: 0, other: 0 };
      at[kind] += 1;
      sessionsByDate.set(key, at);
    }
    for (const l of src.lifts) {
      const key = l.performedOn.slice(0, 10);
      const at = sessionsByDate.get(key) ?? { strength: 0, cardio: 0, other: 0 };
      at.strength += 1;
      sessionsByDate.set(key, at);
    }
    const weightByDate = new Map(
      weighAll.filter((r) => r.weight > 0).map((r) => [r.date.slice(0, 10), r.weight] as const),
    );
    const stepsByDate2 = new Map(
      src.days.map((d) => [d.date.slice(0, 10), d.activity.steps ?? 0] as const),
    );

    const cells = [
      ...Array.from({ length: lead }, (_, i) => ({
        key: `pad-${i}`, pad: true as const, day: 0, date: '', future: false, isToday: false,
        strength: 0, cardio: 0, other: 0, hasSession: false,
        weight: null as string | null, steps: null as string | null, tint: 'transparent',
        selected: false, select: () => {},
      })),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const date = `${anchor}-${String(i + 1).padStart(2, '0')}`;
        const s = sessionsByDate.get(date);
        const weight = weightByDate.get(date) ?? null;
        const steps = stepsByDate2.get(date) ?? 0;
        const future = date > todayISO();
        return {
          key: date,
          pad: false as const,
          day: i + 1,
          date,
          future,
          isToday: date === todayISO(),
          strength: s?.strength ?? 0,
          cardio: s?.cardio ?? 0,
          other: s?.other ?? 0,
          hasSession: Boolean(s),
          weight: weight === null ? null : `${nf(weight, 1)}`,
          steps: steps ? nf(steps) : null,
          selected: st.selectedDay === date,
          select: () => set({ selectedDay: st.selectedDay === date ? null : date }),
          // A quiet wash behind a day that carried work, so the month reads at a glance.
          tint: future ? 'transparent'
            : s ? (s.strength ? 'rgba(95,68,114,0.10)' : 'rgba(192,108,132,0.10)')
              : steps >= TARGETS.stepGoal ? 'rgba(95,68,114,0.04)' : 'transparent',
        };
      }),
    ];

    const monthLabel = firstOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const shift = (delta: number) => {
      const d = new Date(Date.UTC(cy, cm - 1 + delta, 1));
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    };

    // Padding cells carry no data, and a day that has not happened is not a
    // day you failed to train on.
    const inMonth = cells.filter(
      (c): c is Extract<typeof c, { pad: false }> => !c.pad && !c.future,
    );
    const sessionDays = inMonth.filter((c) => c.hasSession).length;

    return {
      monthLabel,
      cells,
      dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      prev: () => set({ calendarMonth: shift(-1) }),
      next: () => set({ calendarMonth: shift(1) }),
      canNext: anchor < todayISO().slice(0, 7),
      summary: `${sessionDays} session day${sessionDays === 1 ? '' : 's'} of ${inMonth.length}`,
      // A month is a period in its own right, so the screen can total it.
      stats: (() => {
        const monthDays = src.days.filter((d) => d.date.slice(0, 7) === anchor);
        const sum = (pick: (d: HealthDay) => number | null | undefined) => {
          const live = monthDays.map(pick).filter((v): v is number => !!v);
          return live.length ? live.reduce((a, b) => a + b, 0) : null;
        };
        const avg = (pick: (d: HealthDay) => number | null | undefined) => {
          const live = monthDays.map(pick).filter((v): v is number => !!v);
          return live.length ? live.reduce((a, b) => a + b, 0) / live.length : null;
        };
        const mins = src.workouts
          .filter((w) => w.startedAt.slice(0, 7) === anchor)
          .reduce((a, w) => a + (w.durationMin ?? 0), 0);
        const weighed = weighAll.filter((r) => r.date.slice(0, 7) === anchor && r.weight > 0);

        return [
          { label: 'Session days', value: `${sessionDays}` },
          { label: 'Training time', value: mins ? fmtHours(mins / 60) : DASH },
          { label: 'Avg steps', value: avg((d) => d.activity.steps) === null ? DASH : nf(Math.round(avg((d) => d.activity.steps) as number)) },
          { label: 'Total steps', value: sum((d) => d.activity.steps) === null ? DASH : nf(Math.round(sum((d) => d.activity.steps) as number)) },
          { label: 'Avg sleep', value: avg((d) => d.sleep.totalMin) === null ? DASH : fmtHours((avg((d) => d.sleep.totalMin) as number) / 60) },
          { label: 'Weigh-ins', value: weighed.length ? `${weighed.length}` : DASH },
        ];
      })(),
    };
  })();

  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const nav = SCREENS.map((label, i) => ({
    label,
    numeral: numerals[i],
    go: () => set({ screen: label }),
    active: st.screen === label,
  }));

  const ranges = PERIOD_IDS.map((label) => ({
    label,
    go: () => set({ range: label }),
    active: st.range === label,
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const titles: Record<Screen, [string, string]> = {
    Dashboard: [
      `${greeting}, ${props.operatorName}`,
      hasAny
        ? 'Six dimensions, one score, all of it from what you have logged.'
        : 'Nothing has synced yet. Connect Apple Health or log a lift and this fills in.',
    ],
    'Head to head': [
      'Head to head',
      peer.them
        ? `You and ${peer.them.athlete}, same week, five rounds. A round only counts when you have both published it.`
        : 'Two trackers, same week, five rounds — once the other side answers.',
    ],
    Workouts: [
      'Workouts',
      `${allSessions.length} session${allSessions.length === 1 ? '' : 's'} on record across ${activityRows.length} kinds of training.`,
    ],
    Calendar: [
      'Calendar',
      `Every day on record — ${calendar.summary.replace(' session day', ' training day')} this month. Select one to open it.`,
    ],
    Progress: [
      'Progress',
      'What the weight change was actually made of — fat, lean tissue, or water.',
    ],
    Goals: ['Goals', 'Four targets from Settings. Current values come from logged sessions.'],
    Nutrition: ['Nutrition', 'Targets are guides. Consistency across the week is what counts.'],
    Recovery: ['Recovery', 'Sleep, heart rate and variability — what the training has to fit around.'],
    Insights: ['Insights', `Observations drawn from your logged data over ${rangeLabel}.`],
    Settings: ['Settings', 'Units, targets and the sources feeding this dashboard.'],
  };
  const [pageTitle, pageSub] = titles[st.screen];

  /* head to head ---------------------------------------------------------- */

  // Both sides come from the peer contract rather than from this project's own
  // sources, so the two screens agree: the scoreboard is a pure function of two
  // documents both people already hold.
  const headToHead = deriveHeadToHead(peer.you, peer.them, { dayOffset: st.dayOffset }, {
    loaded: peer.loaded,
    configured: peer.configured,
    peerError: peer.peerError,
  });
  const h2h = {
    ...headToHead,
    prevDay: () => set({ dayOffset: Math.min(headToHead.maxBack, st.dayOffset + 1) }),
    nextDay: () => set({ dayOffset: Math.max(0, st.dayOffset - 1) }),
    canGoBackDay: st.dayOffset < headToHead.maxBack,
    canGoForwardDay: st.dayOffset > 0,
  };

  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    /* chrome */
    nav,
    ranges,
    isCustom: custom,
    customFrom: st.customFrom,
    customTo: st.customTo,
    onCustomFrom: (v: string) => set({ customFrom: v }),
    onCustomTo: (v: string) => set({ customTo: v }),
    todayLabel: `${dayNames[today.getDay()]} ${fmtDate(today, true)}`,
    operatorName: props.operatorName,
    operatorInitial: props.operatorName.slice(0, 1),
    operatorNote: lastSync ? `Synced to ${fmtDate(lastSync)}` : 'No sync yet',
    pageTitle,
    pageSub,
    rangeLabel,
    againstLabel: `vs ${againstLabel}`,
    loaded: live.loaded,
    hasAny,
    setupRequired: live.setupRequired,

    /* dashboard */
    overall: overall === null ? DASH : String(overall),
    overallDelta: overall === null ? 'Nothing scored yet' : `${overallDelta.text} vs ${againstLabel}`,
    overallDeltaColor: overall === null ? MUTED : overallDelta.color,
    dims,
    dimNote,
    movers,
    moversNote: movers.length
      ? `The biggest movers ${againstLabel}.`
      : `Nothing moved by more than a point or two ${againstLabel}.`,
    radarRings, radarSpokes, radarNow, radarPrev, radarDots, radarLabels,
    topCards,
    measurements,
    bodyTabs,
    bodyUnit,
    bodyValue: bodyLast === null ? DASH : nf(bodyLast, 1),
    bodyDelta: bodyDelta.text === DASH ? 'No weigh-ins in this window' : `${bodyDelta.text} over ${rangeLabel}`,
    ...bodyChart,
    bodyNote: (() => {
      const leanNow = latest('muscleMass');
      const leanStart = earliestInRange('muscleMass');
      if (leanNow === null || leanStart === null) {
        return 'Weight on its own does not separate muscle from anything else. Lean mass fills in once the scale reports it.';
      }
      return `Lean mass is ${leanNow >= leanStart ? 'up' : 'down'} ${nf(Math.abs(leanNow - leanStart), 1)} kg while weight is ${(latest('weight') ?? 0) >= (earliestInRange('weight') ?? 0) ? 'up' : 'down'} ${nf(Math.abs((latest('weight') ?? 0) - (earliestInRange('weight') ?? 0)), 1)} kg. A falling number on the scale is not progress on its own, and a rising one is not a setback.`;
    })(),

    nutrition,
    nutritionDayLabel,
    nutritionTargetNote: `${nf(TARGETS.calorieTarget)} kcal daily target`,
    nutritionTargetShort: `${nf(TARGETS.calorieTarget)} kcal`,
    nutritionHeadline: nutritionDay?.nutrition.dietaryEnergyKcal
      ? nf(nutritionDay.nutrition.dietaryEnergyKcal)
      : DASH,
    nutritionBars: calBars,
    calTargetY,
    nutritionStats,
    nutritionConsistency,

    recoveryScore: recoveryScore === null ? DASH : String(recoveryScore),
    recoveryBadge: recoveryLimiter,
    recoveryNeedsAttention: recoveryScore !== null && recoveryScore < 70,
    recoveryStats,
    recoveryRows,
    sleepMarks: (() => {
      if (sleepSeries.length < 2) return [];
      const lo = Math.min(...sleepSeries);
      const hi = Math.max(...sleepSeries);
      const span = hi - lo || 1;
      return sleepNights.map((d, i) => ({
        key: d.date,
        cx: (i / (sleepSeries.length - 1)) * 600,
        cy: 20 + (1 - (sleepSeries[i] - lo) / span) * (210 - 40),
        label: fmtHours(sleepSeries[i]),
        sub: fmtDate(d.date, true),
      }));
    })(),
    sleepPath: linePath(sleepSeries, 320, 60, 6),
    sleepBig: linePath(sleepSeries, 600, 210, 20),
    sleepArea: areaPath(sleepSeries, 600, 210, 20),
    sleepNote: nowStats.avgSleepH === null
      ? 'No sleep data has synced for this window.'
      : `Average sleep ${fmtHours(nowStats.avgSleepH)}, ${sleepDelta.text === 'held' ? 'unchanged on' : `${sleepDelta.text} on`} ${againstLabel}.`,
    sleepTargetY: (() => {
      if (!sleepSeries.length) return '52';
      const min = Math.min(...sleepSeries);
      const max = Math.max(...sleepSeries);
      const span = max - min || 1;
      const y = 20 + (1 - (TARGETS.sleepTargetH - min) / span) * (230 - 40);
      return Math.max(2, Math.min(228, y)).toFixed(0);
    })(),
    sleepCount: sleepSeries.length,

    consistencyScore: consistencyScore === null ? DASH : `${consistencyScore}%`,
    consistencyNote: `${rangeLabel}, ${nowStats.sessionDays} of ${nowStats.plannedSessions} planned`,
    adherence,
    heatmap,
    heatMonths,
    dayLabels: ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'],
    timeline: timeline.slice(0, 6),
    prs,

    /* workouts */
    workouts,
    workoutsHeading,
    sel,

    /* exercises */
    groups,
    exercises,
    exercisesFiltered,
    noExercises: exercisesFiltered.length === 0,
    exerciseCount: `${exercisesFiltered.length} of ${exercises.length} exercise${exercises.length === 1 ? '' : 's'}`,
    query: st.query,
    onQuery: (v: string) => set({ query: v }),

    /* progress */
    exKey,
    onExercise: (v: string) => set({ ex: v }),
    exSel,
    distribution,
    distributionNote: groupTotal
      ? `Share of ${nf(Math.round(groupTotal))} kg of volume over ${rangeLabel}.`
      : 'No lift volume in this window.',
    // Where the training time actually goes. The old strength distribution was
    // built from lift volume and sat empty whenever the sets lived elsewhere;
    // this reads minutes off the synced workouts, which are always there.
    trainingSplit: (() => {
      const byKind = new Map<string, number>();
      for (const w of nowStats.workouts) {
        const kind = workoutKindOf(w) === 'strength' ? 'Strength'
          : workoutKindOf(w) === 'cardio' ? 'Cardio' : 'Other';
        byKind.set(kind, (byKind.get(kind) ?? 0) + (w.durationMin ?? 0));
      }
      // A lift-only day has no synced duration, so it is credited a nominal
      // session length rather than counting as no time trained at all.
      const liftOnlyDays = new Set(nowStats.lifts.map((l) => l.performedOn.slice(0, 10)));
      for (const w of nowStats.workouts) liftOnlyDays.delete(w.startedAt.slice(0, 10));
      if (liftOnlyDays.size) {
        byKind.set('Strength', (byKind.get('Strength') ?? 0) + liftOnlyDays.size * 45);
      }
      const total = [...byKind.values()].reduce((a, b) => a + b, 0);
      const colours: Record<string, string> = { Strength: PLUM, Cardio: PINK, Other: MUTED };
      return {
        total,
        totalLabel: total ? fmtHours(total / 60) : DASH,
        rows: [...byKind.entries()]
          .filter(([, v]) => v > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([label, mins]) => ({
            label,
            colour: colours[label] ?? MUTED,
            value: fmtMinutes(mins),
            share: total ? (mins / total) * 100 : 0,
            pct: total ? `${Math.round((mins / total) * 100)}%` : '0%',
          })),
        note: total
          ? `${fmtHours(total / 60)} of training across ${nowStats.workouts.length} session${nowStats.workouts.length === 1 ? '' : 's'} in ${rangeLabel}.`
          : `No sessions with a recorded duration in ${rangeLabel}.`,
      };
    })(),

    // The caption has to follow the metric on show — the box carries distance,
    // pace, duration and heart rate, none of which is VO₂ max.
    cardioNote: {
      Distance: 'Distance is summed from workouts that recorded one; a gym session contributes nothing here.',
      Pace: 'The quickest running pace in each week, over at least a kilometre. Walks are excluded — they have a pace, but not a comparable one.',
      Duration: 'Time spent on cardio, by week. Strength sessions are counted on the Strength dimension instead.',
      'Heart rate': 'Average heart rate across cardio sessions, which moves with effort and with the weather.',
    }[st.cardio],
    cardioSummary: [
      { label: 'Sessions', value: nf(cardioWorkouts.length) },
      { label: 'Distance', value: nowStats.cardioDistanceKm ? `${nf(nowStats.cardioDistanceKm, 1)} km` : DASH },
      { label: 'Time', value: nowStats.cardioMinutes ? fmtHours(nowStats.cardioMinutes / 60) : DASH },
      { label: 'VO₂ max', value: nowStats.vo2 === null ? DASH : nf(nowStats.vo2, 1) },
    ],

    cardioValue,
    cardioUnit,
    cardioTabs,
    cardioBars,
    cardioTrend: cardioWorkouts.length
      ? `${cardioTrendDelta.text} vs ${againstLabel}`
      : 'No cardio workouts in this window',
    cardioTrendColor: cardioWorkouts.length ? cardioTrendDelta.color : MUTED,

    /* goals */
    goals,
    goalDraft: st.goalDraft,
    newGoal: () => set({ goalDraft: !st.goalDraft }),

    /* insights + settings */
    insights: insights.slice(0, 12).map((i) => {
      // The tag already names the subject, so it also names where the working is.
      const target = ({
        Strength: 'Workouts', Consistency: 'Workouts', Cardio: 'Progress',
        Activity: 'Progress', Recovery: 'Recovery', Nutrition: 'Nutrition',
        'Body composition': 'Progress', Plateau: 'Progress', Pattern: 'Workouts',
        'A year ago': 'Progress',
      } as Record<string, Screen>)[i.tag];
      return {
        ...i,
        screen: target ?? null,
        open: target ? () => set({ screen: target }) : null,
      };
    }),
    settings,

  /* the full-history brush ------------------------------------------------ */

    history: (() => {
      const W = 900;
      const H = 46;
      const pts = weighAll.filter((r) => r.weight > 0);
      if (pts.length < 4) return null;

      const t = (d: string) => new Date(`${d.slice(0, 10)}T12:00:00Z`).getTime();
      const first = t(pts[0].date);
      const span = t(pts[pts.length - 1].date) - first || 1;
      const vals = pts.map((r) => r.weight);
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      const range = hi - lo || 1;

      const x = (d: string) => ((t(d) - first) / span) * W;
      const path = pts
        .map((r, i) => `${i ? 'L' : 'M'}${x(r.date).toFixed(1)} ${(4 + (1 - (r.weight - lo) / range) * (H - 8)).toFixed(1)}`)
        .join(' ');

      // Year boundaries, so a drag has something to aim at.
      const years: Array<{ key: string; x: number; label: string }> = [];
      for (let y = new Date(first).getUTCFullYear() + 1; y <= new Date(t(pts[pts.length - 1].date)).getUTCFullYear(); y++) {
        const at = Date.UTC(y, 0, 1);
        if (at < first || at > first + span) continue;
        years.push({ key: String(y), x: ((at - first) / span) * W, label: String(y) });
      }

      // Where the selected window sits inside the whole history.
      const clamp = (v: number) => Math.max(0, Math.min(W, v));
      const selFrom = clamp(((nowWin.from - first) / span) * W);
      const selTo = clamp(((nowWin.to - first) / span) * W);

      return {
        width: W, height: H, path, years,
        selFrom, selWidth: Math.max(2, selTo - selFrom),
        startLabel: fmtDate(pts[0].date, true),
        endLabel: fmtDate(pts[pts.length - 1].date, true),
        count: pts.length,
        /** Turn two positions on the strip into a custom range. */
        selectRange: (aFrac: number, bFrac: number) => {
          const lowFrac = Math.max(0, Math.min(aFrac, bFrac));
          const highFrac = Math.min(1, Math.max(aFrac, bFrac));
          const from = new Date(first + lowFrac * span).toISOString().slice(0, 10);
          const to = new Date(first + highFrac * span).toISOString().slice(0, 10);
          // A drag of a few pixels is a mis-click, not a one-day window.
          if (new Date(to).getTime() - new Date(from).getTime() < 2 * DAY) return;
          set({ range: 'Custom', customFrom: from, customTo: to });
        },
        reset: () => set({ range: 'Month' }),
      };
    })(),

    /* cross-filter */
    focus,
    focusLabel: focus ? `Filtered to ${focus}` : null,
    focusCount: focus
      ? `${src.workouts.length} of ${allWorkouts.length} workouts`
      : null,
    clearFocus: () => set({ focus: null }),

    /* today's cues, from the brief */
    brief: {
      loaded: brief.loaded,
      ok: brief.ok,
      staleNote: brief.staleNote,
      cues: brief.cues.map((c, i) => ({
        key: `${c.kind}-${i}`,
        kind: c.kind,
        text: c.text,
        colour: c.kind === 'win' ? GREEN : c.kind === 'watch' ? AMBER : MUTED,
      })),
    },

    /* the targets everything is scored against, which move with the weight */
    targets: (() => {
      const t = adaptiveTargets(src);
      return {
        ...t,
        tdeeLabel: nf(t.tdee),
        bmrLabel: nf(t.bmr),
        calorieLabel: nf(t.calorieTarget),
        proteinLabel: `${nf(t.proteinTarget)} g`,
        confidenceLabel: `${Math.round(t.confidence * 100)}%`,
      };
    })(),

    /* the period, in the shape of the period */
    periodView,

    /* the ribbon */
    ribbon,
    calendar,
    dayDetail,
    journey,

    /* body composition */
    bodyAnalysis,

    /* energy */
    energy: {
      ...energy,
      inLabel: energy.avgIn === null ? DASH : nf(Math.round(energy.avgIn)),
      outLabel: energy.avgOut === null ? DASH : nf(Math.round(energy.avgOut)),
      impliedTdeeLabel: energy.impliedTdee === null ? DASH : nf(Math.round(energy.impliedTdee)),
      title: energy.direction === 'surplus' ? 'Running a surplus'
        : energy.direction === 'deficit' ? 'Running a deficit'
          : energy.direction === 'maintenance' ? 'Holding at maintenance'
            : 'Not enough logged to say',
    },

    /* activities */
    activities: activityRows.map((a) => {
      const trend = a.prevRatePerMonth === null || !a.prevRatePerMonth
        ? { text: a.sessionsInRange ? 'first in range' : DASH, color: MUTED }
        : pctDelta(a.ratePerMonth, a.prevRatePerMonth);
      return {
        key: a.key,
        name: a.name,
        focused: focus === a.key,
        focus: () => set({ focus: focus === a.key ? null : a.key }),
        kind: a.kind === 'strength' ? 'Strength' : a.kind === 'cardio' ? 'Cardio' : 'Other',
        sessions: nf(a.sessionsInRange),
        allTime: nf(a.sessions),
        time: a.totalMinutes >= 60 ? fmtHours(a.totalMinutes / 60) : a.totalMinutes ? `${nf(Math.round(a.totalMinutes))} min` : DASH,
        distance: a.totalKm ? `${nf(a.totalKm, 1)} km` : DASH,
        best: a.bestKm ? `${nf(a.bestKm, 1)} km` : a.bestMinutes ? fmtMinutes(a.bestMinutes) : DASH,
        pace: a.bestPace ? `${fmtPace(a.bestPace)} /km` : DASH,
        last: a.lastDone ? fmtDate(a.lastDone) : DASH,
        trend: trend.text,
        trendColor: trend.color,
        spark: linePath(a.history, 100, 22, 3),
      };
    }),
    activityCount: `${activityRows.length} activit${activityRows.length === 1 ? 'y' : 'ies'}`,
    activityNote: src.lifts.length
      ? 'Movements come from your lift log; activities from synced workouts.'
      : 'Built from synced workouts. Your coaching app holds the sets and loads, so per-movement detail is not available here.',

    /* head to head */
    h2h,

    /* which screen */
    screen: st.screen,
  };
}

export type TrainingVals = ReturnType<typeof deriveVals>;
