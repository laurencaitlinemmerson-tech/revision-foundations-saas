/* ============================================================
   plateau.ts — detect a flat window in the trend
   ============================================================
   A plateau is defined as the most recent 14 days where the
   linear slope is within ±0.05 kg/wk and R² is low (noise, not
   trend). Returns null if no plateau detected.
   ============================================================ */

import { fitReadings, type Reading } from './regression';

export interface Plateau {
  startDate: string;
  endDate: string;
  days: number;
  slopePerWeek: number;
  meanWeight: number;
}

const DAY = 86_400_000;
const FLAT_KG_PER_WEEK = 0.05;
const MIN_DAYS = 14;

export function detectPlateau(readings: Reading[]): Plateau | null {
  if (readings.length < 3) return null;
  const sorted = [...readings].sort((a,b)=> a.date.localeCompare(b.date));
  const lastTs = new Date(sorted[sorted.length-1].date).getTime();
  const window = sorted.filter(r => lastTs - new Date(r.date).getTime() <= MIN_DAYS * DAY);
  if (window.length < 3) return null;
  const fit = fitReadings(window);
  if (!fit) return null;
  const slopePerWeek = fit.slope * 7;
  if (Math.abs(slopePerWeek) > FLAT_KG_PER_WEEK) return null;
  const days = Math.round((lastTs - new Date(window[0].date).getTime()) / DAY);
  return {
    startDate: window[0].date,
    endDate: sorted[sorted.length-1].date,
    days,
    slopePerWeek,
    meanWeight: window.reduce((a,r)=>a+r.weight,0) / window.length,
  };
}

/** Editorial copy suggesting the next lever to pull. */
export function plateauSuggestion(p: Plateau, currentIntake: number, tdee: number): string {
  if (currentIntake > tdee - 200) {
    return 'Current intake sits within 200 kcal of estimated maintenance — drop another 150–200 kcal/day for two weeks before reassessing.';
  }
  if (currentIntake < tdee - 700) {
    return 'Steep deficit for two weeks — consider a refeed at maintenance for 3–5 days; chronic large deficits suppress NEAT and stall progress.';
  }
  return 'Sustainable deficit running for two weeks without movement — try a small protein bump, a deload on training, or a five-day refeed.';
}
