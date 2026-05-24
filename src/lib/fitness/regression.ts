/* ============================================================
   regression.ts — fit + confidence band for weight readings
   ============================================================ */

export interface Reading { date: string; weight: number }
export interface Fit {
  slope: number; intercept: number; r2: number;
  /** standard error of the residuals (kg) */
  rmse: number;
  /** first reading time in ms (origin for x) */
  t0: number;
}

const dayMs = 86_400_000;

export function fitReadings(readings: Reading[]): Fit | null {
  if (readings.length < 2) return null;
  const sorted = [...readings].sort((a,b)=> a.date.localeCompare(b.date));
  const t0 = new Date(sorted[0].date).getTime();
  const xs = sorted.map(r => (new Date(r.date).getTime() - t0) / dayMs);
  const ys = sorted.map(r => r.weight);
  const n = xs.length;
  const mx = xs.reduce((a,b)=>a+b,0) / n;
  const my = ys.reduce((a,b)=>a+b,0) / n;
  let num=0, den=0;
  for (let i=0;i<n;i++) { num += (xs[i]-mx)*(ys[i]-my); den += (xs[i]-mx)**2; }
  const slope = den ? num/den : 0;
  const intercept = my - slope*mx;
  const ssRes = ys.reduce((a,y,i)=> a + (y - (slope*xs[i] + intercept))**2, 0);
  const ssTot = ys.reduce((a,y)=> a + (y - my)**2, 0);
  const r2 = ssTot ? 1 - ssRes/ssTot : 0;
  const rmse = Math.sqrt(ssRes / Math.max(1, n - 2));
  return { slope, intercept, r2, rmse, t0 };
}

/** Point + ±1 SD band at day-from-t0 */
export function projectWithBand(fit: Fit, daysFromT0: number) {
  const y = fit.intercept + fit.slope * daysFromT0;
  // band grows slightly with horizon: rmse * sqrt(1 + h/observed_span_factor)
  const band = fit.rmse * Math.sqrt(1 + daysFromT0 / 60);
  return { y, lower: y - band, upper: y + band };
}
