/**
 * One session, in as much detail as the export actually carried.
 *
 * Health Auto Export attaches a per-minute record to a workout — heart rate
 * minute by minute, energy as it accumulated, cadence, the weather it happened
 * in — and none of it was ever read. The list view knows a session lasted 67
 * minutes and burned 415 calories; this is what happened inside it.
 *
 * Only sessions synced by the live phone export carry this. Older rows imported
 * from the Apple Health archive have the summary and nothing else, and a screen
 * built on this has to say so rather than draw an empty chart.
 */

/** Apple exports energy in kilojoules. */
const KJ_PER_KCAL = 4.184;

type Qty = { qty?: number; units?: string } | null | undefined;
type Sample = { qty?: number; date?: string } | null | undefined;
type HrSample = { Avg?: number; Max?: number; Min?: number; date?: string } | null | undefined;

const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

const qty = (v: Qty): number | null => (v && typeof v === 'object' ? num(v.qty) : null);

/** Health Auto Export stamps "2026-08-26 10:00:00 +0100"; Date.parse needs help. */
function parseStamp(s: string | undefined): number | null {
  if (!s) return null;
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})\s*([+-]\d{2}):?(\d{2})?$/);
  const iso = m ? `${m[1]}T${m[2]}${m[3]}:${m[4] ?? '00'}` : s;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

export type SeriesPoint = { t: number; v: number };

export type SessionDetail = {
  /** False when the row predates the live export and carries only a summary. */
  rich: boolean;

  durationSec: number | null;
  /** Beats per minute through the session. */
  heartRate: SeriesPoint[];
  hrAvg: number | null;
  hrMax: number | null;
  hrMin: number | null;
  /** Heart rate in the minutes after it ended — how fast it came back down. */
  recovery: SeriesPoint[];
  /** Drop from the peak over the first minute after finishing. */
  recoveryDrop: number | null;

  /** Calories as they accumulated, active only. */
  energy: SeriesPoint[];
  activeKcal: number | null;
  totalKcal: number | null;

  steps: number | null;
  cadence: number | null;
  /** Kilocalories per hour per kilogram — how hard it was for the body. */
  intensity: number | null;

  indoor: boolean | null;
  location: string | null;
  temperatureC: number | null;
  humidityPct: number | null;

  distanceKm: number | null;
  avgSpeedKph: number | null;
  maxSpeedKph: number | null;
  elevationUpM: number | null;
};

const EMPTY: SessionDetail = {
  rich: false, durationSec: null,
  heartRate: [], hrAvg: null, hrMax: null, hrMin: null, recovery: [], recoveryDrop: null,
  energy: [], activeKcal: null, totalKcal: null,
  steps: null, cadence: null, intensity: null,
  indoor: null, location: null, temperatureC: null, humidityPct: null,
  distanceKm: null, avgSpeedKph: null, maxSpeedKph: null, elevationUpM: null,
};

export function parseSessionDetail(raw: unknown): SessionDetail {
  if (!raw || typeof raw !== 'object') return EMPTY;
  const r = raw as Record<string, unknown>;

  // Weigh-ins are parked in the same table under a fallback type, and their
  // payload is a scale reading rather than a workout.
  if ('weight' in r && !('heartRate' in r) && !('duration' in r)) return EMPTY;

  const hrRows = Array.isArray(r.heartRateData) ? (r.heartRateData as HrSample[]) : [];
  const heartRate: SeriesPoint[] = [];
  for (const s of hrRows) {
    const t = parseStamp(s?.date);
    const v = num(s?.Avg);
    if (t !== null && v !== null) heartRate.push({ t, v });
  }
  heartRate.sort((a, b) => a.t - b.t);

  const recRows = Array.isArray(r.heartRateRecovery) ? (r.heartRateRecovery as HrSample[]) : [];
  const recovery: SeriesPoint[] = [];
  for (const s of recRows) {
    const t = parseStamp(s?.date);
    const v = num(s?.Avg);
    if (t !== null && v !== null) recovery.push({ t, v });
  }
  recovery.sort((a, b) => a.t - b.t);

  // The standard reading: how far the rate fell in the first minute after
  // stopping. A bigger drop is a fitter heart, which is why it is worth keeping.
  const recoveryDrop = recovery.length >= 2
    ? (() => {
      const start = recovery[0];
      const oneMin = recovery.filter((p) => p.t - start.t <= 60_000);
      const last = oneMin[oneMin.length - 1] ?? recovery[recovery.length - 1];
      const peak = Math.max(start.v, ...heartRate.slice(-3).map((p) => p.v));
      return Math.round(peak - last.v);
    })()
    : null;

  // Active energy arrives as one sample per minute in kilojoules, so the running
  // total is the cumulative sum rather than any single value.
  const energyRows = Array.isArray(r.activeEnergy) ? (r.activeEnergy as Sample[]) : [];
  const energy: SeriesPoint[] = [];
  let runningKcal = 0;
  const stamped = energyRows
    .map((s) => ({ t: parseStamp(s?.date), q: num(s?.qty) }))
    .filter((s): s is { t: number; q: number } => s.t !== null && s.q !== null)
    .sort((a, b) => a.t - b.t);
  for (const s of stamped) {
    runningKcal += s.q / KJ_PER_KCAL;
    energy.push({ t: s.t, v: runningKcal });
  }

  const stepRows = Array.isArray(r.stepCount) ? (r.stepCount as Sample[]) : [];
  const steps = stepRows.length
    ? Math.round(stepRows.reduce((a, s) => a + (num(s?.qty) ?? 0), 0))
    : null;

  const activeKj = qty(r.activeEnergyBurned as Qty);
  const totalKj = qty(r.totalEnergy as Qty);

  // Health Auto Export reports speed in kilometres an hour already. Converting
  // from metres a second turned a 3.8 km/h walk into 13.5, which is a run.
  const speed = (v: Qty) => qty(v);

  return {
    rich: heartRate.length > 0 || energy.length > 0,
    durationSec: num(r.duration),
    heartRate,
    hrAvg: qty(r.avgHeartRate as Qty),
    hrMax: qty(r.maxHeartRate as Qty),
    hrMin: qty((r.heartRate as { min?: Qty } | undefined)?.min),
    recovery,
    recoveryDrop,
    energy,
    activeKcal: activeKj === null ? null : activeKj / KJ_PER_KCAL,
    totalKcal: totalKj === null ? null : totalKj / KJ_PER_KCAL,
    steps,
    cadence: qty(r.stepCadence as Qty),
    intensity: qty(r.intensity as Qty),
    indoor: typeof r.isIndoor === 'boolean' ? r.isIndoor : null,
    location: typeof r.location === 'string' ? r.location : null,
    temperatureC: qty(r.temperature as Qty),
    humidityPct: qty(r.humidity as Qty),
    distanceKm: qty(r.distance as Qty),
    avgSpeedKph: speed(r.avgSpeed as Qty),
    maxSpeedKph: speed(r.maxSpeed as Qty),
    elevationUpM: qty(r.elevationUp as Qty),
  };
}
