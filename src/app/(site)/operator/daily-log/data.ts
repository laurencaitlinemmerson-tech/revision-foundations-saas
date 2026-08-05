'use client';

import { useEffect, useState } from 'react';
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

export type Schedule = {
  status: ScheduleStatus;
  days: ScheduleDay[];
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
  schedule: null,
  setupRequired: false,
};

const nonEmpty = <T,>(a: T[] | null | undefined): T[] | null => (a && a.length ? a : null);

export function useOperatorData(): LiveData {
  const [live, setLive] = useState<LiveData>(EMPTY_LIVE);

  useEffect(() => {
    let cancelled = false;
    const pw = storedOperatorPassword();
    const headers = { 'x-operator-pw': pw ?? '' };

    // A year of history covers every range the Trends tab offers.
    const from = new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10);

    const get = async (url: string) => {
      try {
        const res = await fetch(url, { headers });
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
      const [fitness, health, workouts, schedule] = await Promise.all([
        get('/api/operator/fitness'),
        get(`/api/operator/health?from=${from}`),
        get('/api/operator/workouts'),
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
        schedule: (schedule as unknown as Schedule) ?? null,
        setupRequired: Boolean(
          fitness?.setup_required || health?.setup_required || workouts?.setup_required,
        ),
      });
    })();

    return () => { cancelled = true; };
  }, []);

  return live;
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
  const iso = new Date().toISOString().slice(0, 10);
  return days.find((d) => d.date.slice(0, 10) === iso) ?? null;
}
