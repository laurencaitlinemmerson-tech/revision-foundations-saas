/* ============================================================
   plateau.ts — detect a flat window in the trend
   ============================================================
   A plateau is the most recent 14+ days whose slope sits inside
   ±0.05 kg/week — movement small enough to be noise rather than
   trend. Returns null when the trend is still going somewhere.
   ============================================================ */

import { fitReadings, type Reading } from './regression';

export interface Plateau {
  startDate: string;
  endDate: string;
  days: number;
  slopePerWeek: number;
  meanWeight: number;
}

const DAY_MS = 86_400_000;
const FLAT_KG_PER_WEEK = 0.05;
const MIN_DAYS = 14;

export function detectPlateau(readings: Reading[]): Plateau | null {
  if (readings.length < 3) return null;

  const sorted = [...readings].sort((a, b) => a.date.localeCompare(b.date));
  const lastTs = new Date(sorted[sorted.length - 1].date).getTime();
  const window = sorted.filter((r) => lastTs - new Date(r.date).getTime() <= MIN_DAYS * DAY_MS);
  if (window.length < 3) return null;

  const fit = fitReadings(window);
  if (!fit) return null;

  const slopePerWeek = fit.slope * 7;
  if (Math.abs(slopePerWeek) > FLAT_KG_PER_WEEK) return null;

  return {
    startDate: window[0].date,
    endDate: sorted[sorted.length - 1].date,
    days: Math.round((lastTs - new Date(window[0].date).getTime()) / DAY_MS),
    slopePerWeek,
    meanWeight: window.reduce((acc, r) => acc + r.weight, 0) / window.length,
  };
}

/** Which lever to pull next, given where intake sits relative to TDEE. */
export function plateauSuggestion(currentIntake: number, tdee: number): string {
  if (currentIntake > tdee - 200) {
    return 'Intake is within 200 kcal of maintenance. Drop another 150–200 kcal/day and hold it for two weeks before reassessing.';
  }
  if (currentIntake < tdee - 700) {
    return 'A steep deficit that has stopped producing movement. Consider three to five days at maintenance — sustained large deficits suppress NEAT and stall the scale.';
  }
  return 'A sensible deficit that has stopped moving. Try a protein bump, a training deload, or a short refeed before cutting further.';
}
