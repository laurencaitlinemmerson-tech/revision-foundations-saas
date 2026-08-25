'use client';

import { useCallback, useEffect, useState } from 'react';
import { storedOperatorPassword } from '../OperatorGate';
import type { Reading } from './logic';

/**
 * Live operator data.
 *
 * Pulls the three operator sources — weigh-ins, Apple Health daily metrics and
 * workouts — and reshapes them into the series the dashboard's derivation layer
 * consumes. Anything missing stays `null` so the derivation can fall back to the
 * design's seed values rather than render blanks or NaN.
 */

export type HealthDay = {
  date: string;
  activity: {
    steps: number | null;
    activeEnergyKcal: number | null;
    exerciseMinutes: number | null;
    standHours: number | null;
    distanceKm: number | null;
  };
  heart: {
    restingHr: number | null;
    hrvMs: number | null;
    walkingHrAvg: number | null;
    vo2Max: number | null;
  };
  sleep: {
    totalMin: number | null;
    inBedMin: number | null;
    remMin: number | null;
    deepMin: number | null;
    coreMin: number | null;
    awakeMin: number | null;
  };
  nutrition: {
    dietaryEnergyKcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    fatG: number | null;
    fiberG: number | null;
    sugarG: number | null;
    waterMl: number | null;
  };
  cycle: {
    /** 0 none, 1 light, 2 medium, 3 heavy. Null when nothing was recorded. */
    flow: number | null;
  };
};

export type WeighIn = {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  water: number;
  muscleMass: number;
  boneMass: number;
};

export type ScheduleDay = {
  day: string;
  date: string;
  calendar: string;
  suggestion: string;
  tag: string;
  busyHours: number;
};

export type ScheduleStatus = 'ok' | 'unconfigured' | 'auth_failed' | 'fetch_failed';

export type ShiftKind = 'night' | 'long' | 'early' | 'late' | 'day' | 'off';

/** A day classified from the rota — past or upcoming. */
export type ShiftDay = {
  date: string;
  shift: boolean;
  night: boolean;
  kind: ShiftKind;
  /** Hours the calendar accounts for. Null when the entry carries no times. */
  hours: number | null;
  /** Local clock times, when the calendar entry was timed rather than all-day. */
  start: string | null;
  end: string | null;
  /** The calendar entry that named it, when a title matched rather than hours. */
  label: string | null;
};

export type Schedule = {
  status: ScheduleStatus;
  days: ScheduleDay[];
  history?: ShiftDay[];
  /** Today and the weeks ahead, for the rota and the night-before prompt. */
  upcoming?: ShiftDay[];
  /** Whether running the connect flow could plausibly fix this state. */
  canConnect?: boolean;
  /** GOOGLE_REFRESH_TOKEN is set, so it overrides anything the flow stores. */
  envPinned?: boolean;
  /** The exact callback URL this deployment sends, to register on the client. */
  redirectUri?: string;
  /** Google's own reason, when it rejected the credentials. */
  detail?: string;
};

export type LiftSet = { reps: number; weightKg: number };

export type Lift = {
  id: string;
  performedOn: string;
  exercise: string;
  sets: LiftSet[];
  note: string | null;
  volumeKg: number;
  e1rmKg: number;
  topSetKg: number;
};

export type Workout = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  type: string | null;
  durationMin: number | null;
  energyKcal: number | null;
  avgHr: number | null;
  maxHr: number | null;
  distanceKm: number | null;
  source: string | null;
};

/** What the derivation layer reads. `null` on any field means "no data — use the seed". */
export type LiveData = {
  loaded: boolean;
  /** Weigh-in series, oldest first. */
  readings: Reading[] | null;
  /** Full weigh-in records, for the real BMI / body-fat metrics. */
  weighIns: WeighIn[] | null;
  /** Apple Health days, oldest first. */
  days: HealthDay[] | null;
  workouts: Workout[] | null;
  /** Logged lifts — the only hand-entered source. */
  lifts: Lift[] | null;
  /** This week from Google Calendar, with why it is empty when it is. */
  schedule: Schedule | null;
  /** Whether any source reported that its table is not set up yet. */
  setupRequired: boolean;
};

export const EMPTY_LIVE: LiveData = {
  loaded: false,
  readings: null,
  weighIns: null,
  days: null,
  workouts: null,
  lifts: null,
  schedule: null,
  setupRequired: false,
};

const nonEmpty = <T,>(a: T[] | null | undefined): T[] | null => (a && a.length ? a : null);

/** Local calendar date, which is what "today" and "resets each day" mean here. */
export function localISODate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** How often to re-read while the tab is open. */
const REFRESH_MS = 5 * 60 * 1000;

export function useOperatorData(): LiveData & { refresh: () => void } {
  const [live, setLive] = useState<LiveData>(EMPTY_LIVE);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  // Re-read on a timer, when the tab comes back to the foreground, and the
  // moment the local date changes — a dashboard left open overnight has to roll
  // onto the new day rather than keep showing yesterday's totals.
  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    let day = localISODate();

    const timer = window.setInterval(() => {
      const now = localISODate();
      if (now !== day) {
        day = now;
        bump();
        return;
      }
      if (document.visibilityState === 'visible') bump();
    }, REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const now = localISODate();
      if (now !== day) day = now;
      bump();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pw = storedOperatorPassword();
    const headers = { 'x-operator-pw': pw ?? '' };

    // A year of history covers every range the Trends tab offers.
    const from = new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10);

    const get = async (url: string) => {
      try {
        // Every one of these is live data with a daily reset behind it, so a
        // reused response is always wrong rather than merely stale.
        const res = await fetch(url, { headers, cache: 'no-store' });
        if (!res.ok) return null;
        return (await res.json()) as Record<string, unknown>;
      } catch {
        return null;
      }
    };

    (async () => {
      if (!pw) {
        if (!cancelled) setLive({ ...EMPTY_LIVE, loaded: true });
        return;
      }
      const [fitness, health, workouts, lifts, schedule] = await Promise.all([
        get('/api/operator/fitness'),
        get(`/api/operator/health?from=${from}`),
        get(`/api/operator/workouts?from=${from}&limit=1000`),
        get(`/api/operator/lifts?from=${from}`),
        get('/api/operator/schedule'),
      ]);
      if (cancelled) return;

      const weighIns = nonEmpty((fitness?.readings as WeighIn[]) ?? null);
      const days = nonEmpty((health?.days as HealthDay[]) ?? null);

      setLive({
        loaded: true,
        weighIns,
        readings: weighIns
          ? weighIns.map((r) => ({ date: r.date.slice(0, 10), weight: r.weight }))
          : null,
        days,
        workouts: nonEmpty((workouts?.workouts as Workout[]) ?? null),
        lifts: nonEmpty((lifts?.lifts as Lift[]) ?? null),
        schedule: (schedule as unknown as Schedule) ?? null,
        setupRequired: Boolean(
          fitness?.setup_required || health?.setup_required || workouts?.setup_required,
        ),
      });
    })();

    return () => { cancelled = true; };
  }, [tick]);

  return { ...live, refresh };
}

/* ── series helpers ───────────────────────────────────────────────────────── */

/** The most recent `n` values of a health field, oldest first, gaps dropped. */
export function series(
  days: HealthDay[] | null,
  pick: (d: HealthDay) => number | null | undefined,
  n: number,
): number[] | null {
  if (!days) return null;
  const vals = days
    .map(pick)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  return vals.length ? vals.slice(-n) : null;
}

/** The latest non-null value of a health field. */
export function latestOf(
  days: HealthDay[] | null,
  pick: (d: HealthDay) => number | null | undefined,
): number | null {
  if (!days) return null;
  for (let i = days.length - 1; i >= 0; i--) {
    const v = pick(days[i]);
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

/** Mean of the last `n` non-null values. */
export function avgOf(
  days: HealthDay[] | null,
  pick: (d: HealthDay) => number | null | undefined,
  n: number,
): number | null {
  const s = series(days, pick, n);
  if (!s) return null;
  return s.reduce((a, b) => a + b, 0) / s.length;
}

/** Today's row, if Apple Health has already synced one. */
export function today(days: HealthDay[] | null): HealthDay | null {
  if (!days) return null;
  const iso = localISODate();
  return days.find((d) => d.date.slice(0, 10) === iso) ?? null;
}

/** The most recent date Apple Health has any row for. */
export function lastSyncedDate(days: HealthDay[] | null): string | null {
  if (!days || !days.length) return null;
  return days[days.length - 1].date.slice(0, 10);
}
