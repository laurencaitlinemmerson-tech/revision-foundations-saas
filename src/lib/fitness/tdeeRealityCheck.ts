/* ============================================================
   tdeeRealityCheck.ts — derive actual TDEE from intake + weight Δ
   ============================================================
   If you logged intake for N days and lost (or gained) kg over
   the same period, the true daily expenditure is:

       actualTdee = mean(intake) + (kgChange * 7700 / N)

   (gain → expenditure was below intake → adjust down;
    loss → expenditure was above intake → adjust up.)

   Run it on the last 14 days and compare to the formula. Flag
   if drift > 10%.
   ============================================================ */

import { type Reading } from './regression';

export interface RealityCheck {
  /** measured TDEE (kcal/day) over the window */
  actualTdee: number;
  /** formula's prediction over the same window */
  estimatedTdee: number;
  /** % difference: (actual - estimated) / estimated */
  driftPct: number;
  /** is the drift big enough to surface? */
  significant: boolean;
  /** suggested intake for next 2 weeks at current weekly-change goal */
  suggestedIntake: number;
  /** days used for the calc */
  days: number;
}

const KCAL_PER_KG = 7700;

export function tdeeRealityCheck(
  readings: Reading[],
  intakeKcalByDate: Record<string, number>, // ISO date → kcal
  formulaTdee: number,
  weeklyChangeKgGoal: number,
  windowDays = 14,
): RealityCheck | null {
  if (readings.length < 2) return null;

  const sorted = [...readings].sort((a,b)=> a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1];
  const cutoff = new Date(last.date).getTime() - windowDays * 86_400_000;
  const windowReadings = sorted.filter(r => new Date(r.date).getTime() >= cutoff);
  if (windowReadings.length < 2) return null;

  const first = windowReadings[0];
  const days = Math.round((new Date(last.date).getTime() - new Date(first.date).getTime()) / 86_400_000);
  if (days < 7) return null; // need at least a week

  const intakes: number[] = [];
  const start = new Date(first.date).getTime();
  for (let d = 0; d <= days; d++) {
    const iso = new Date(start + d * 86_400_000).toISOString().slice(0, 10);
    const v = intakeKcalByDate[iso];
    if (v !== undefined && Number.isFinite(v) && v > 0) intakes.push(v);
  }
  if (intakes.length < Math.max(5, days * 0.5)) return null; // need enough logged days

  const meanIntake = intakes.reduce((a,b)=>a+b,0) / intakes.length;
  const kgChange = last.weight - first.weight; // negative = loss
  // weight lost → real TDEE was above intake; weight gained → real TDEE below.
  const actualTdee = Math.round(meanIntake - (kgChange * KCAL_PER_KG) / days);
  const driftPct = (actualTdee - formulaTdee) / formulaTdee;
  const significant = Math.abs(driftPct) >= 0.10;

  const dailyDelta = Math.round((KCAL_PER_KG * weeklyChangeKgGoal) / 7);
  const suggestedIntake = Math.round((actualTdee - dailyDelta) / 20) * 20;

  return { actualTdee, estimatedTdee: Math.round(formulaTdee), driftPct, significant, suggestedIntake, days };
}

/** One-line editorial copy for the UI. */
export function driftCopy(rc: RealityCheck): string {
  const dir = rc.driftPct > 0 ? 'higher' : 'lower';
  const pct = Math.round(Math.abs(rc.driftPct) * 100);
  return `Your real maintenance over the last ${rc.days} days looks closer to ${rc.actualTdee.toLocaleString()} kcal — formula reads ${pct}% ${dir === 'higher' ? 'low' : 'high'}. Suggested intake: ${rc.suggestedIntake.toLocaleString()} kcal/day.`;
}
