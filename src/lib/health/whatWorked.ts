/**
 * What actually worked, read out of the record rather than assumed.
 *
 * There are eight years of days in this account and five and a half years of
 * weigh-ins. Most of a fitness dashboard is a mirror: it tells you what you did
 * this week, which you already know. The one thing the record can say that you
 * cannot is which of your own past stretches actually moved the weight, and what
 * was different about them — because you have done this before, several times,
 * and the answer is in the data rather than in an article.
 *
 * Everything here is measured. Nothing is advice, and a comparison that lacks
 * the coverage to be trusted is refused by name rather than estimated.
 */

const DAY = 86_400_000;

/** Kilocalories in a kilogram of body mass, the usual working figure. */
const KCAL_PER_KG = 7700;

/** A slope smaller than this is not a direction, it is noise. */
const MOVING_KG_WK = 0.25;

/** Shorter than this is a fortnight of water, not a stretch of anything. */
const MIN_EPISODE_DAYS = 21;

/** The window a rolling rate is fitted over. */
const RATE_WINDOW_DAYS = 28;

/** Readings needed inside a rate window before it is fitted at all. */
const MIN_READINGS = 4;

export type DayRow = {
  date: string;
  steps: number | null;
  active_energy_kcal: number | null;
  exercise_minutes: number | null;
  dietary_energy_kcal: number | null;
  protein_g: number | null;
  sleep_total_min: number | null;
  resting_hr: number | null;
};

export type WeighRow = { date: string; weight: number | null };
export type WorkoutRow = { started_at: string; type: string | null };

export type Phase = 'losing' | 'holding' | 'gaining';

export type Episode = {
  phase: Phase;
  from: string;
  to: string;
  days: number;
  /** Fitted kilograms a week across the episode. */
  ratePerWeek: number;
  startKg: number;
  endKg: number;
};

/** One behaviour, measured inside a set of episodes. */
export type Measure = {
  key: string;
  label: string;
  unit: string;
  /** Mean across the days that carried the measure. */
  value: number | null;
  /** How many days carried it, and how many there were. */
  covered: number;
  total: number;
};

export type Contrast = {
  key: string;
  label: string;
  unit: string;
  losing: number | null;
  other: number | null;
  /** losing − other, in the measure's own unit. */
  diff: number | null;
  /** True when both sides cleared the coverage bar. */
  trustworthy: boolean;
  losingCovered: number;
  otherCovered: number;
};

export type Maintenance = {
  /** Median maintenance implied across qualifying windows, kcal/day. */
  medianKcal: number | null;
  lowKcal: number | null;
  highKcal: number | null;
  windows: number;
  /** Mean logged intake across those windows, for the under-logging check. */
  loggedKcal: number | null;
  note: string;
};

export type RateSpread = {
  /** Rolling rates measured inside losing episodes, kg/week (negative). */
  p25: number | null;
  median: number | null;
  p75: number | null;
  samples: number;
};

export type Findings = {
  ok: boolean;
  /** The span the record actually covers. */
  from: string | null;
  to: string | null;
  dayCount: number;
  weighCount: number;
  episodes: Episode[];
  /** Losing episodes, longest first. */
  best: Episode[];
  contrasts: Contrast[];
  maintenance: Maintenance;
  rates: RateSpread;
  /** The lowest sustained weight in the record, and when. */
  lowest: { kg: number; on: string } | null;
  note: string;
};

/* ── small helpers ─────────────────────────────────────────────────────────── */

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const at = (d: string) => Date.parse(`${d.slice(0, 10)}T12:00:00Z`);
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

function quantile(sorted: number[], q: number): number | null {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

/** Least-squares slope in units per day. Null when the x's do not vary. */
function slopePerDay(pts: Array<{ t: number; v: number }>): number | null {
  if (pts.length < 2) return null;
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p.t, 0) / n;
  const my = pts.reduce((a, p) => a + p.v, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of pts) {
    num += (p.t - mx) * (p.v - my);
    den += (p.t - mx) ** 2;
  }
  if (den === 0) return null;
  return (num / den) * DAY;
}

/* ── the analysis ──────────────────────────────────────────────────────────── */

export function findWhatWorked(
  days: DayRow[],
  weighIns: WeighRow[],
  workouts: WorkoutRow[],
): Findings {
  const weights = weighIns
    .filter((w): w is { date: string; weight: number } => typeof w.weight === 'number' && w.weight > 0)
    .map((w) => ({ t: at(w.date), v: w.weight }))
    .sort((a, b) => a.t - b.t);

  const empty: Findings = {
    ok: false, from: null, to: null, dayCount: days.length, weighCount: weights.length,
    episodes: [], best: [], contrasts: [],
    maintenance: { medianKcal: null, lowKcal: null, highKcal: null, windows: 0, loggedKcal: null, note: '' },
    rates: { p25: null, median: null, p75: null, samples: 0 },
    lowest: null,
    note: '',
  };

  if (weights.length < 20) {
    return { ...empty, note: `Only ${weights.length} weigh-ins on record — not enough to find a stretch in.` };
  }

  /* A rolling rate at every day the record covers ------------------------- */

  // The rate is fitted over four weeks of readings rather than taken between
  // two mornings, so a heavy Sunday cannot start or end a stretch on its own.
  const firstT = weights[0].t;
  const lastT = weights[weights.length - 1].t;

  type Point = { t: number; rate: number | null; kg: number | null };
  const track: Point[] = [];
  for (let t = firstT; t <= lastT; t += DAY) {
    const half = (RATE_WINDOW_DAYS / 2) * DAY;
    const win = weights.filter((w) => w.t >= t - half && w.t <= t + half);
    const rate = win.length >= MIN_READINGS ? slopePerDay(win) : null;
    track.push({
      t,
      rate: rate === null ? null : rate * 7,
      kg: win.length ? mean(win.map((w) => w.v)) : null,
    });
  }

  /* Days classified, then merged into episodes ---------------------------- */

  const phaseOf = (rate: number | null): Phase | null =>
    rate === null ? null
      : rate <= -MOVING_KG_WK ? 'losing'
        : rate >= MOVING_KG_WK ? 'gaining'
          : 'holding';

  const episodes: Episode[] = [];
  let run: Point[] = [];
  let runPhase: Phase | null = null;

  const closeRun = () => {
    if (runPhase && run.length >= MIN_EPISODE_DAYS) {
      const from = run[0];
      const to = run[run.length - 1];
      const inRun = weights.filter((w) => w.t >= from.t && w.t <= to.t);
      const s = slopePerDay(inRun);
      episodes.push({
        phase: runPhase,
        from: iso(from.t),
        to: iso(to.t),
        days: run.length,
        ratePerWeek: s === null ? 0 : s * 7,
        startKg: from.kg ?? inRun[0]?.v ?? 0,
        endKg: to.kg ?? inRun[inRun.length - 1]?.v ?? 0,
      });
    }
    run = [];
    runPhase = null;
  };

  for (const p of track) {
    const phase = phaseOf(p.rate);
    if (phase === null) { closeRun(); continue; }
    if (phase !== runPhase) { closeRun(); runPhase = phase; }
    run.push(p);
  }
  closeRun();

  /* What was different inside the losing stretches ------------------------ */

  const dayBy = new Map(days.map((d) => [d.date.slice(0, 10), d] as const));
  const sessionDates = new Set(workouts.map((w) => w.started_at.slice(0, 10)));

  const datesIn = (eps: Episode[]) => {
    const out: string[] = [];
    for (const e of eps) for (let t = at(e.from); t <= at(e.to); t += DAY) out.push(iso(t));
    return out;
  };

  const losing = episodes.filter((e) => e.phase === 'losing');
  const notLosing = episodes.filter((e) => e.phase !== 'losing');

  const MEASURES: Array<{ key: string; label: string; unit: string; of: (d: DayRow) => number | null }> = [
    { key: 'steps', label: 'Steps', unit: '/day', of: (d) => d.steps },
    { key: 'exercise', label: 'Exercise', unit: 'min/day', of: (d) => d.exercise_minutes },
    { key: 'active', label: 'Active energy', unit: 'kcal/day', of: (d) => d.active_energy_kcal },
    { key: 'intake', label: 'Logged intake', unit: 'kcal/day', of: (d) => d.dietary_energy_kcal },
    { key: 'protein', label: 'Protein', unit: 'g/day', of: (d) => d.protein_g },
    { key: 'sleep', label: 'Sleep', unit: 'h/night', of: (d) => (d.sleep_total_min === null ? null : d.sleep_total_min / 60) },
    { key: 'rhr', label: 'Resting heart rate', unit: 'bpm', of: (d) => d.resting_hr },
  ];

  // Both sides need this many measured days before a gap means anything. A
  // fortnight of a measure is one holiday or one bad week; three weeks is the
  // point at which a mean stops being a story about a few days.
  const MIN_COVER = 21;

  const measureOver = (dates: string[], of: (d: DayRow) => number | null) => {
    const vals: number[] = [];
    for (const key of dates) {
      const row = dayBy.get(key);
      if (!row) continue;
      const v = of(row);
      if (typeof v === 'number' && v > 0) vals.push(v);
    }
    return { value: mean(vals), covered: vals.length, total: dates.length };
  };

  const losingDates = datesIn(losing);
  const otherDates = datesIn(notLosing);

  const contrasts: Contrast[] = MEASURES.map((m) => {
    const a = measureOver(losingDates, m.of);
    const b = measureOver(otherDates, m.of);
    const trustworthy = a.covered >= MIN_COVER && b.covered >= MIN_COVER;
    return {
      key: m.key,
      label: m.label,
      unit: m.unit,
      losing: a.value,
      other: b.value,
      diff: a.value !== null && b.value !== null ? a.value - b.value : null,
      trustworthy,
      losingCovered: a.covered,
      otherCovered: b.covered,
    };
  });

  // Sessions a week is counted rather than averaged, so it gets its own row.
  const sessionsPerWeek = (dates: string[]) =>
    dates.length ? (dates.filter((d) => sessionDates.has(d)).length / dates.length) * 7 : null;

  contrasts.unshift({
    key: 'sessions',
    label: 'Sessions',
    unit: '/week',
    losing: sessionsPerWeek(losingDates),
    other: sessionsPerWeek(otherDates),
    diff: losingDates.length && otherDates.length
      ? (sessionsPerWeek(losingDates) ?? 0) - (sessionsPerWeek(otherDates) ?? 0)
      : null,
    trustworthy: losingDates.length >= MIN_COVER && otherDates.length >= MIN_COVER,
    losingCovered: losingDates.length,
    otherCovered: otherDates.length,
  });

  /* What maintenance actually was, where the logging supports asking ------- */

  const maintenance = measureMaintenance(days, weights);

  /* How fast losing actually went, when it went ---------------------------- */

  const losingRates: number[] = [];
  for (const e of losing) {
    for (const p of track) {
      if (p.t >= at(e.from) && p.t <= at(e.to) && p.rate !== null) losingRates.push(p.rate);
    }
  }
  losingRates.sort((a, b) => a - b);

  /* The floor of the record ------------------------------------------------ */

  const smoothed = track.filter((p): p is Point & { kg: number } => p.kg !== null);
  const low = smoothed.length
    ? smoothed.reduce((a, b) => (b.kg < a.kg ? b : a))
    : null;

  return {
    ok: true,
    from: iso(firstT),
    to: iso(lastT),
    dayCount: days.length,
    weighCount: weights.length,
    episodes,
    best: [...losing].sort((a, b) => b.days - a.days),
    contrasts,
    maintenance,
    rates: {
      p25: quantile(losingRates, 0.25),
      median: quantile(losingRates, 0.5),
      p75: quantile(losingRates, 0.75),
      samples: losingRates.length,
    },
    lowest: low ? { kg: low.kg, on: iso(low.t) } : null,
    note: '',
  };
}

/**
 * Maintenance calories, solved for rather than modelled.
 *
 * Over a window, what you ate plus what the scale did gives what you burned:
 * lose a kilogram and the intake was about 7,700 kcal short of maintenance
 * across those days. That is only worth computing where the food log actually
 * covers the window, so windows below the coverage bar are dropped rather than
 * filled in — a month with nine days logged would otherwise report the
 * maintenance of those nine days as if it were the month's.
 */
function measureMaintenance(days: DayRow[], weights: Array<{ t: number; v: number }>): Maintenance {
  const WINDOW = 28;
  /** Days of the window that must carry a logged intake. */
  const MIN_LOGGED = 20;
  /** Weigh-ins needed at each end to trust the change across it. */
  const END_READINGS = 3;

  const rows = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const results: Array<{ maintenance: number; logged: number }> = [];

  const weightAround = (t: number) => {
    const win = weights.filter((w) => Math.abs(w.t - t) <= 5 * DAY);
    return win.length >= END_READINGS ? mean(win.map((w) => w.v)) : null;
  };

  for (let i = 0; i + WINDOW <= rows.length; i += 7) {
    const slice = rows.slice(i, i + WINDOW);
    const logged = slice.map((d) => d.dietary_energy_kcal).filter((v): v is number => !!v && v > 0);
    if (logged.length < MIN_LOGGED) continue;

    const startT = at(slice[0].date);
    const endT = at(slice[slice.length - 1].date);
    const a = weightAround(startT);
    const b = weightAround(endT);
    if (a === null || b === null) continue;

    const spanDays = (endT - startT) / DAY;
    if (spanDays < 20) continue;

    const intake = mean(logged) as number;
    // Lost weight means the intake sat below maintenance by the deficit.
    const maintenance = intake - ((b - a) * KCAL_PER_KG) / spanDays;

    // A body does not maintain on 900 or on 5,000. A window that says so is
    // reporting a logging gap or a scale swing, not a metabolism.
    if (maintenance < 1200 || maintenance > 4000) continue;

    results.push({ maintenance, logged: intake });
  }

  if (results.length < 3) {
    return {
      medianKcal: null, lowKcal: null, highKcal: null, windows: results.length, loggedKcal: null,
      note: results.length === 0
        ? 'No four-week stretch has both enough days of food logged and weigh-ins at each end, so maintenance cannot be measured — only estimated.'
        : `Only ${results.length} four-week stretch${results.length === 1 ? '' : 'es'} had enough logged food to measure against. Three is the minimum before a median means anything.`,
    };
  }

  const sorted = results.map((r) => r.maintenance).sort((a, b) => a - b);
  return {
    medianKcal: quantile(sorted, 0.5),
    lowKcal: quantile(sorted, 0.25),
    highKcal: quantile(sorted, 0.75),
    windows: results.length,
    loggedKcal: mean(results.map((r) => r.logged)),
    note: '',
  };
}
