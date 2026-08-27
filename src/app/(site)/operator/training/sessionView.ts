import type { SessionDetail } from '@/lib/health/sessionDetail';

import { BLUE, GREEN, MUTED, PINK, PLUM, ROSE, SOFT } from './palette';

/**
 * A session's per-minute record, drawn.
 *
 * The heart-rate zones here are cut from the highest rate ever recorded on this
 * account rather than from 220-minus-age. An age formula has a standard error of
 * around twelve beats, which is more than a zone is wide — so it would put a
 * confident boundary in the wrong place, while the observed maximum is at least
 * a number this heart has actually reached.
 */

const nf = (n: number, d = 0) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

const clock = (t: number, from: number) => {
  const min = Math.round((t - from) / 60_000);
  return `${Math.floor(min / 60) ? `${Math.floor(min / 60)}h ` : ''}${min % 60}m`;
};

export type SessionView = {
  state: 'closed' | 'loading' | 'summary' | 'rich';
  note: string;

  /** The heart-rate trace. */
  width: number;
  height: number;
  hrPath: string;
  hrMarks: Array<{ key: string; cx: number; cy: number; label: string; sub: string }>;
  hrGrid: Array<{ key: string; y: string; label: string }>;
  hrAvgY: string | null;
  startLabel: string;
  endLabel: string;

  /** Time spent in each band, as a share of the session. */
  zones: Array<{ key: string; label: string; range: string; pct: number; minutes: string; colour: string }>;
  zoneNote: string;

  /** Calories as they accumulated. */
  energyPath: string;
  energyLabel: string;

  stats: Array<{ label: string; value: string; note: string }>;
  conditions: string | null;
  recoveryLine: string | null;
};

const CLOSED: SessionView = {
  state: 'closed', note: '', width: 720, height: 150,
  hrPath: '', hrMarks: [], hrGrid: [], hrAvgY: null, startLabel: '', endLabel: '',
  zones: [], zoneNote: '', energyPath: '', energyLabel: '',
  stats: [], conditions: null, recoveryLine: null,
};

export function buildSessionView(
  detail: SessionDetail | null,
  loading: boolean,
  open: boolean,
  /** The highest heart rate on record, used to cut the zones. */
  observedMaxHr: number | null,
): SessionView {
  if (!open) return CLOSED;
  if (loading) return { ...CLOSED, state: 'loading', note: 'Reading the session…' };
  if (!detail || !detail.rich) {
    return {
      ...CLOSED,
      state: 'summary',
      note: 'This session came from the Apple Health archive, which keeps the summary and drops the minute-by-minute record. Sessions synced by the phone export carry the full trace.',
    };
  }

  const W = 720;
  const H = 150;
  const PAD = 12;

  const hr = detail.heartRate;
  const from = hr[0]?.t ?? 0;
  const to = hr[hr.length - 1]?.t ?? from + 1;

  const lo = Math.min(...hr.map((p) => p.v)) - 6;
  const hi = Math.max(...hr.map((p) => p.v)) + 6;
  const range = hi - lo || 1;

  const x = (t: number) => ((t - from) / Math.max(1, to - from)) * W;
  const y = (v: number) => PAD + (1 - (v - lo) / range) * (H - PAD * 2);

  const hrMarks = hr.map((p) => ({
    key: String(p.t),
    cx: Number(x(p.t).toFixed(1)),
    cy: Number(y(p.v).toFixed(1)),
    label: `${Math.round(p.v)} bpm`,
    sub: clock(p.t, from),
  }));

  const hrGrid: Array<{ key: string; y: string; label: string }> = [];
  for (let v = Math.ceil(lo / 20) * 20; v <= hi; v += 20) {
    hrGrid.push({ key: String(v), y: y(v).toFixed(1), label: `${v}` });
  }

  /* zones ----------------------------------------------------------------- */

  // Each sample stands for the minute it was taken in, which is how the export
  // writes them, so counting samples counts minutes.
  const peak = observedMaxHr ?? Math.max(...hr.map((p) => p.v));
  const BANDS: Array<{ key: string; label: string; from: number; to: number; colour: string }> = [
    { key: 'easy', label: 'Easy', from: 0, to: 0.6, colour: BLUE },
    { key: 'steady', label: 'Steady', from: 0.6, to: 0.7, colour: GREEN },
    { key: 'moderate', label: 'Moderate', from: 0.7, to: 0.8, colour: PLUM },
    { key: 'hard', label: 'Hard', from: 0.8, to: 0.9, colour: PINK },
    { key: 'max', label: 'Maximum', from: 0.9, to: 10, colour: ROSE },
  ];

  const zones = BANDS.map((b) => {
    const inBand = hr.filter((p) => p.v >= peak * b.from && p.v < peak * b.to).length;
    return {
      key: b.key,
      label: b.label,
      range: `${Math.round(peak * b.from)}–${b.to > 1 ? `${Math.round(peak)}+` : Math.round(peak * b.to)}`,
      pct: hr.length ? (inBand / hr.length) * 100 : 0,
      minutes: `${inBand} min`,
      colour: b.colour,
    };
  }).filter((z) => z.pct > 0);

  /* energy ---------------------------------------------------------------- */

  const e = detail.energy;
  const eMax = e.length ? e[e.length - 1].v : 0;
  const energyPath = e.length
    ? e.map((p, i) => {
      const px = ((p.t - from) / Math.max(1, to - from)) * W;
      const py = PAD + (1 - (eMax ? p.v / eMax : 0)) * (H - PAD * 2);
      return `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
    }).join(' ')
    : '';

  /* the plain figures ------------------------------------------------------ */

  const stats: Array<{ label: string; value: string; note: string }> = [];
  const push = (label: string, value: string | null, note: string) => {
    if (value !== null) stats.push({ label, value, note });
  };

  push('Average', detail.hrAvg === null ? null : `${Math.round(detail.hrAvg)}`, 'bpm through the session');
  push('Peak', detail.hrMax === null ? null : `${Math.round(detail.hrMax)}`, `bpm, ${peak ? `${Math.round((detail.hrMax! / peak) * 100)}% of your highest` : ''}`);
  push('Active energy', detail.activeKcal === null ? null : nf(Math.round(detail.activeKcal)), 'kcal above resting');
  push('Steps', detail.steps === null ? null : nf(detail.steps), detail.cadence === null ? 'taken' : `at ${nf(detail.cadence, 0)} a minute`);
  push('Intensity', detail.intensity === null ? null : nf(detail.intensity, 1), 'kcal per hour per kg');
  push('Distance', detail.distanceKm === null ? null : `${nf(detail.distanceKm, 2)} km`,
    detail.avgSpeedKph === null ? 'covered' : `at ${nf(detail.avgSpeedKph, 1)} km/h`);
  push('Climbed', detail.elevationUpM === null ? null : `${nf(Math.round(detail.elevationUpM))} m`, 'of ascent');

  const conditions = [
    detail.indoor === null ? null : detail.indoor ? 'Indoors' : 'Outdoors',
    detail.location,
    detail.temperatureC === null ? null : `${nf(detail.temperatureC, 1)}°C`,
    detail.humidityPct === null ? null : `${nf(detail.humidityPct)}% humidity`,
  ].filter((v, i, a): v is string => !!v && a.indexOf(v) === i).join(' · ') || null;

  return {
    state: 'rich',
    note: '',
    width: W,
    height: H,
    hrPath: hrMarks.map((p, i) => `${i ? 'L' : 'M'}${p.cx} ${p.cy}`).join(' '),
    hrMarks,
    hrGrid,
    hrAvgY: detail.hrAvg === null ? null : y(detail.hrAvg).toFixed(1),
    startLabel: new Date(from).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    endLabel: new Date(to).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    zones,
    zoneNote: `Bands are cut from ${Math.round(peak)} bpm, the highest rate on record for you — not from an age formula, which is wrong by more than a zone is wide.`,
    energyPath,
    energyLabel: eMax ? `${nf(Math.round(eMax))} kcal by the end` : '',
    stats,
    conditions,
    recoveryLine: detail.recoveryDrop === null ? null
      : `Heart rate fell ${detail.recoveryDrop} bpm in the minute after stopping. A bigger drop is a fitter heart, and it is worth watching across sessions of the same kind.`,
  };
}

export const sessionPalette = { soft: SOFT, muted: MUTED };
