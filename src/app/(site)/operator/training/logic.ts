import type { LiveData, Lift, WeighIn, Workout } from '../daily-log/data';
import { MUSCLE_GROUPS, equipmentOf, muscleGroupOf, sessionNameFor, type MuscleGroup } from './exercises';
import {
  DAY, DIMENSIONS, baselineOf, overallScore, scoreAll, statsFor, windows,
  type Baseline, type DimensionRow, type Sources,
} from './scoring';
import {
  AMBER, GREEN, HEAT, MUTED, PINK, PINK_SOFT, PLUM, PLUM_SOFT, ROSE, SOFT,
  TAG_GOOD, TAG_INFO, TAG_WATCH,
} from './palette';
import { TARGETS, proteinTargetG } from './targets';
import { workoutKindOf } from './workoutKind';
import {
  daysFromPartner, daysFromSources, deriveHeadToHead, mondayOf,
} from './headToHead';
import type { PartnerData } from './partnerData';

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
  'Dashboard', 'Head to head', 'Workouts', 'Exercises', 'Progress',
  'Goals', 'Nutrition', 'Recovery', 'Insights', 'Settings',
] as const;
export type Screen = (typeof SCREENS)[number];

export const RANGES: Array<[string, number]> = [
  ['7D', 7], ['30D', 30], ['90D', 90], ['1Y', 365],
];

export type BodyMetric = 'Weight' | 'Body fat %' | 'Lean mass';
export type CardioMetric = 'Distance' | 'Pace' | 'Duration' | 'Heart rate';

export type TrainingState = {
  screen: Screen;
  range: string;
  customFrom: string;
  customTo: string;
  body: BodyMetric;
  ex: string;
  cardio: CardioMetric;
  workout: number;
  query: string;
  group: string;
  goalDraft: boolean;
  /** Head to head: which day inside the shown week, 0 = Monday. */
  dayOffset: number;
  /** Head to head: 0 is this week, negative steps back. */
  weekOffset: number;
};

export type SetState = (
  patch: Partial<TrainingState> | ((s: TrainingState) => Partial<TrainingState>),
) => void;

const todayISO = () => new Date().toISOString().slice(0, 10);

export const INITIAL_STATE: TrainingState = {
  screen: 'Dashboard',
  range: '90D',
  customFrom: new Date(Date.now() - 90 * DAY).toISOString().slice(0, 10),
  customTo: todayISO(),
  body: 'Weight',
  ex: '',
  cardio: 'Distance',
  workout: 0,
  query: '',
  group: 'All',
  goalDraft: false,
  dayOffset: Math.floor((Date.now() - mondayOf(Date.now())) / 86_400_000),
  weekOffset: 0,
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
      const cardioNames = [...new Set(day.workouts.map((w) => w.type ?? 'Workout'))];
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

export type TrainingProps = { operatorName: string };
export const DEFAULT_PROPS: TrainingProps = { operatorName: 'Lauren' };

export function deriveVals(
  st: TrainingState,
  setState: SetState,
  props: TrainingProps,
  live: LiveData,
  partner: PartnerData,
) {
  const set = (patch: Partial<TrainingState>) => setState(patch);

  const src: Sources = {
    days: live.days ?? [],
    lifts: live.lifts ?? [],
    workouts: live.workouts ?? [],
    weighIns: live.weighIns ?? [],
  };
  const hasAny = src.days.length + src.lifts.length + src.workouts.length + src.weighIns.length > 0;

  /* window ---------------------------------------------------------------- */

  const custom = st.range === 'Custom';
  const customTo = new Date(`${st.customTo}T23:59:59`).getTime();
  const customFrom = new Date(`${st.customFrom}T00:00:00`).getTime();
  const customSpan =
    Number.isFinite(customTo) && Number.isFinite(customFrom) && customTo > customFrom
      ? Math.max(1, Math.round((customTo - customFrom) / DAY))
      : 90;
  const spanDays = custom ? customSpan : (RANGES.find((r) => r[0] === st.range)?.[1] ?? 90);
  const endsAt = custom && Number.isFinite(customTo) ? customTo : Date.now();

  const { now: nowWin, prev: prevWin } = windows(endsAt, spanDays);
  const base: Baseline = baselineOf(src);
  const nowStats = statsFor(src, nowWin, base);
  const prevStats = statsFor(src, prevWin, base);

  const rangeLabel = custom
    ? `${fmtDate(new Date(nowWin.from))} – ${fmtDate(new Date(nowWin.to))}`
    : `last ${spanDays} days`;

  /* dimensions ------------------------------------------------------------ */

  const rows: DimensionRow[] = scoreAll(nowStats, prevStats, base);
  const overall = overallScore(rows);
  const overallPrev = overallScore(rows, 'prev');
  const overallDelta = pctDelta(overall, overallPrev);

  const dims = rows.map((r) => {
    const d = pctDelta(r.score, r.prev);
    return {
      label: r.label,
      score: r.score === null ? DASH : String(r.score),
      prev: r.prev === null ? DASH : String(r.prev),
      pct: `${r.score ?? 0}%`,
      prevPct: `${r.prev ?? 0}%`,
      delta: d.text,
      deltaColor: d.color,
      bar: r.score !== null && r.prev !== null && r.score < r.prev ? ROSE : PLUM,
    };
  });

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
  const weighSeries = inRangeWeigh.length >= 2 ? inRangeWeigh : weighAll.slice(-30);

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
    return {
      key: d.date,
      x: (i * (560 / Math.max(1, calWindow.length))).toFixed(1),
      y: (208 - h).toFixed(0),
      w: (560 / Math.max(1, calWindow.length)) * 0.72,
      h: h.toFixed(0),
      fill: v > 0 && Math.abs(v - TARGETS.calorieTarget) <= TARGETS.calorieTarget * 0.1 ? PLUM : PINK_SOFT,
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

  const sleepSeries = src.days
    .slice(-30)
    .map((d) => (d.sleep.totalMin ?? 0) / 60)
    .filter((v) => v > 0);

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
        trend: `${volumeDelta.text} vs previous`,
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
          ? `${pctDelta(nowStats.strengthSessionDays, prevStats.strengthSessionDays).text} vs previous`
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
      trend: nowStats.vo2 === null ? 'No VO₂ estimate synced' : `${vo2Delta.text} vs previous`,
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
          .filter((w) => (w.distanceKm ?? 0) > 0 && (w.durationMin ?? 0) > 0)
          .map((w) => (w.durationMin as number) / (w.distanceKm as number));
        return paces.length ? Math.min(...paces) : 0;
      }
    }
  });

  const bestPace = (() => {
    const paces = cardioWorkouts
      .filter((w) => (w.distanceKm ?? 0) > 0 && (w.durationMin ?? 0) > 0)
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
  const cardioBars = cardioWeekly.map((v, i) => {
    const h = (v / cardioMax) * 128;
    return {
      key: i,
      x: (i * cardioStep + cardioStep * 0.16).toFixed(1),
      y: (138 - h).toFixed(1),
      w: (cardioStep * 0.68).toFixed(1),
      h: Math.max(0, h).toFixed(1),
      fill: i === cardioWeekly.length - 1 ? PLUM : PINK_SOFT,
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
    return {
      key: title,
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
  const insights: Array<{ key: string; tag: string; tagColor: string; title: string; body: string; source: string }> = [];

  if (nowStats.lifts.length) {
    const d = pctDelta(volumeTonnes || null, prevVolumeTonnes || null);
    insights.push({
      key: 'strength',
      tag: 'Strength',
      tagColor: TAG_GOOD,
      title: d.color === GREEN ? 'Strength volume is trending up' : d.text === 'held' ? 'Strength volume is holding' : 'Strength volume is down',
      body: `You moved ${nf(nowStats.volumeKg)} kg across ${nowStats.liftSessionDays} lift session${nowStats.liftSessionDays === 1 ? '' : 's'} — ${d.text === DASH ? 'no comparable previous period' : `${d.text} against the period before`}.${exerciseRows[0]?.e1rmKg ? ` Best estimated one-rep max is ${nf(exerciseRows[0].e1rmKg, 1)} kg on the ${exerciseRows[0].name.toLowerCase()}.` : ''}`,
      source: `From ${nowStats.lifts.length} logged lift${nowStats.lifts.length === 1 ? '' : 's'}, ${spanLabel}`,
    });
  }

  if (!nowStats.lifts.length && nowStats.strengthSessionDays) {
    const d = pctDelta(nowStats.strengthSessionDays, prevStats.strengthSessionDays);
    insights.push({
      key: 'strength-sessions',
      tag: 'Strength',
      tagColor: TAG_GOOD,
      title: 'Strength is scored on sessions, not volume',
      body: `${nowStats.strengthSessionDays} strength session${nowStats.strengthSessionDays === 1 ? '' : 's'} against ${nowStats.plannedSessions} planned — ${d.text === DASH ? 'no comparable previous period' : `${d.text} on the period before`}. Your sets and loads are recorded in your coaching app and never reach this project, so volume and personal bests cannot be shown.`,
      source: `From ${nowStats.workouts.length} synced workout${nowStats.workouts.length === 1 ? '' : 's'}, ${spanLabel}`,
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
      tag: 'Consistency',
      tagColor: pct >= 85 ? TAG_GOOD : TAG_WATCH,
      title: extra > 0 ? 'Ahead of the planned schedule'
        : pct >= 85 ? 'Consistency is holding up'
          : 'Sessions are behind the plan',
      body: extra > 0
        ? `${nowStats.sessionDays} sessions against ${nowStats.plannedSessions} planned — ${extra} more than the plan asks for${gapNote}.`
        : `${nowStats.sessionDays} of ${nowStats.plannedSessions} planned sessions completed — ${pct}% adherence${gapNote}.`,
      source: `From the session log, ${spanLabel}`,
    });
  }

  if (nowStats.avgSleepH !== null) {
    const down = sleepDelta.color === ROSE || sleepDelta.text.startsWith('↓');
    insights.push({
      key: 'recovery',
      tag: 'Recovery',
      tagColor: down ? TAG_WATCH : TAG_GOOD,
      title: down ? 'Recovery could improve' : 'Recovery is steady',
      body: `Average sleep is ${fmtHours(nowStats.avgSleepH)}${sleepDelta.text === 'held' ? ', unchanged on the previous period' : `, ${sleepDelta.text} on the previous period`}${nowStats.avgHrv === null ? '' : `, and HRV is ${nf(nowStats.avgHrv)} ms (${hrvDelta.text})`}.`,
      source: `From ${nowStats.days.filter((d) => (d.sleep.totalMin ?? 0) > 0).length} nights of sleep data`,
    });
  }

  if (bodyLast !== null && bodyFirst !== null) {
    const leanNow = latest('muscleMass');
    const leanStart = earliestInRange('muscleMass');
    insights.push({
      key: 'body',
      tag: 'Body composition',
      tagColor: TAG_INFO,
      title: 'What the scale is showing',
      body: `${st.body} moved from ${nf(bodyFirst, 1)} to ${nf(bodyLast, 1)} ${bodyUnit} across this window.${leanNow !== null && leanStart !== null ? ` Lean mass went from ${nf(leanStart, 1)} to ${nf(leanNow, 1)} kg over the same span, so the change is in composition as well as total.` : ''}`,
      source: `From ${inRangeWeigh.length || weighSeries.length} weigh-in${(inRangeWeigh.length || weighSeries.length) === 1 ? '' : 's'}`,
    });
  }

  if (nowStats.nutritionDays) {
    insights.push({
      key: 'nutrition',
      tag: 'Nutrition',
      tagColor: TAG_INFO,
      title: nowStats.proteinOnTarget / nowStats.nutritionDays < nowStats.calOnTarget / nowStats.nutritionDays
        ? 'Protein is the gap, not calories'
        : 'Calories are the gap, not protein',
      body: `Calories landed within ${nf(TARGETS.calorieTarget * 0.1)} kcal of the ${nf(TARGETS.calorieTarget)} target on ${nowStats.calOnTarget} of ${nowStats.nutritionDays} logged days. Protein averaged ${num(nowStats.avgProtein)} g against a ${nf(proteinTarget)} g target.`,
      source: `From ${nowStats.nutritionDays} logged day${nowStats.nutritionDays === 1 ? '' : 's'}`,
    });
  }

  // Dimensions with too little behind them get named rather than left blank —
  // an empty panel reads as a bad score instead of an absent one.
  for (const d of DIMENSIONS) {
    if (insights.length >= 6) break;
    const row = rows.find((r) => r.label === d);
    if (row?.score !== null) continue;
    insights.push({
      key: `empty-${d}`,
      tag: d,
      tagColor: MUTED,
      title: 'Not enough data yet',
      body: `${d} has nothing logged in ${rangeLabel}, so it is not being scored and is not pulling the overall figure down.`,
      source: 'Waiting on data from this source',
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

  /* chrome ---------------------------------------------------------------- */

  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const nav = SCREENS.map((label, i) => ({
    label,
    numeral: numerals[i],
    go: () => set({ screen: label }),
    active: st.screen === label,
  }));

  const ranges = [...RANGES.map((r) => r[0]), 'Custom'].map((label) => ({
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
      partner.days?.length
        ? `You and ${partner.name}, same week, five rounds. A round only counts when you both logged it.`
        : 'Two people, same week, five rounds — once the second feed is connected.',
    ],
    Workouts: ['Workouts', `${allSessions.length} session${allSessions.length === 1 ? '' : 's'} on record. Select one to see every set.`],
    Exercises: ['Exercises', 'Every movement you have logged, with its best lift and estimated one-rep max.'],
    Progress: ['Progress', 'Strength, cardio and the events that moved the score.'],
    Goals: ['Goals', 'Four targets from Settings. Current values come from logged sessions.'],
    Nutrition: ['Nutrition', 'Targets are guides. Consistency across the week is what counts.'],
    Recovery: ['Recovery', 'Sleep, heart rate and variability — what the training has to fit around.'],
    Insights: ['Insights', `Observations drawn from your logged data over ${rangeLabel}.`],
    Settings: ['Settings', 'Units, targets and the sources feeding this dashboard.'],
  };
  const [pageTitle, pageSub] = titles[st.screen];

  /* head to head ---------------------------------------------------------- */

  // Both sides are built over the same 120-day span so streaks and the weight
  // journey have history behind them, not just the week on screen.
  const h2hFrom = mondayOf(Date.now()) - 119 * DAY;
  const h2hTo = mondayOf(Date.now()) + 6 * DAY;
  const headToHead = deriveHeadToHead(
    { name: props.operatorName, days: daysFromSources(src, h2hFrom, h2hTo) },
    { name: partner.name, days: daysFromPartner(partner.days ?? [], h2hFrom, h2hTo) },
    { dayOffset: st.dayOffset, weekOffset: st.weekOffset },
    Boolean(partner.days?.length),
  );
  const h2h = {
    ...headToHead,
    partnerLoaded: partner.loaded,
    partnerSetupRequired: partner.setupRequired,
    prevDay: () => set({ dayOffset: Math.max(0, st.dayOffset - 1) }),
    nextDay: () => set({ dayOffset: Math.min(6, st.dayOffset + 1) }),
    prevWeek: () => set({ weekOffset: st.weekOffset - 1, dayOffset: 0 }),
    nextWeek: () => set({
      weekOffset: Math.min(0, st.weekOffset + 1),
      dayOffset: st.weekOffset + 1 === 0
        ? Math.floor((Date.now() - mondayOf(Date.now())) / DAY)
        : 0,
    }),
    canGoForwardDay: st.dayOffset < 6,
    canGoBackDay: st.dayOffset > 0,
    canGoForwardWeek: st.weekOffset < 0,
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
    loaded: live.loaded,
    hasAny,
    setupRequired: live.setupRequired,

    /* dashboard */
    overall: overall === null ? DASH : String(overall),
    overallDelta: overall === null ? 'Nothing scored yet' : `${overallDelta.text} vs previous period`,
    overallDeltaColor: overall === null ? MUTED : overallDelta.color,
    dims,
    dimNote,
    radarRings, radarSpokes, radarNow, radarPrev, radarDots, radarLabels,
    topCards,
    measurements,
    bodyTabs,
    bodyUnit,
    bodyValue: bodyLast === null ? DASH : nf(bodyLast, 1),
    bodyDelta: bodyDelta.text === DASH ? 'No weigh-ins in this window' : `${bodyDelta.text} over ${rangeLabel}`,
    bodyPath: linePath(bodyVals, 680, 166, 14),
    bodyArea: areaPath(bodyVals, 680, 166, 14),
    bodyStart: weighSeries.length ? fmtDate(weighSeries[0].date) : DASH,
    bodyEnd: weighSeries.length ? fmtDate(weighSeries[weighSeries.length - 1].date) : DASH,
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
    sleepPath: linePath(sleepSeries, 320, 60, 6),
    sleepBig: linePath(sleepSeries, 600, 210, 20),
    sleepArea: areaPath(sleepSeries, 600, 210, 20),
    sleepNote: nowStats.avgSleepH === null
      ? 'No sleep data has synced for this window.'
      : `Average sleep ${fmtHours(nowStats.avgSleepH)}, ${sleepDelta.text === 'held' ? 'unchanged on' : `${sleepDelta.text} on`} the previous period.`,
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
    cardioValue,
    cardioUnit,
    cardioTabs,
    cardioBars,
    cardioTrend: cardioWorkouts.length
      ? `${cardioTrendDelta.text} vs previous period`
      : 'No cardio workouts in this window',
    cardioTrendColor: cardioWorkouts.length ? cardioTrendDelta.color : MUTED,

    /* goals */
    goals,
    goalDraft: st.goalDraft,
    newGoal: () => set({ goalDraft: !st.goalDraft }),

    /* insights + settings */
    insights: insights.slice(0, 6),
    settings,

    /* head to head */
    h2h,

    /* which screen */
    screen: st.screen,
  };
}

export type TrainingVals = ReturnType<typeof deriveVals>;
