/* ============================================================
   regression.ts — least-squares fit + confidence band for weight
   ============================================================
   Scale readings are noisy (hydration, food in transit, time of
   day). A single reading means very little; the slope through many
   readings is the actual signal, and the residual spread tells you
   how much to trust it.
   ============================================================ */

export interface Reading {
  date: string;
  weight: number;
}

export interface Fit {
  /** kg per day */
  slope: number;
  intercept: number;
  r2: number;
  /** standard error of the residuals, kg */
  rmse: number;
  /** timestamp of the first reading, the origin for x */
  t0: number;
  n: number;
}

const DAY_MS = 86_400_000;

export function fitReadings(readings: Reading[]): Fit | null {
  if (readings.length < 2) return null;

  const sorted = [...readings].sort((a, b) => a.date.localeCompare(b.date));
  const t0 = new Date(sorted[0].date).getTime();
  const xs = sorted.map((r) => (new Date(r.date).getTime() - t0) / DAY_MS);
  const ys = sorted.map((r) => r.weight);
  const n = xs.length;

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }

  const slope = den ? num / den : 0;
  const intercept = meanY - slope * meanX;

  const ssRes = ys.reduce((acc, y, i) => acc + (y - (slope * xs[i] + intercept)) ** 2, 0);
  const ssTot = ys.reduce((acc, y) => acc + (y - meanY) ** 2, 0);

  return {
    slope,
    intercept,
    r2: ssTot ? 1 - ssRes / ssTot : 0,
    rmse: Math.sqrt(ssRes / Math.max(1, n - 2)),
    t0,
    n,
  };
}

/** Projected weight plus a ±1 SD band that widens with the horizon. */
export function projectWithBand(fit: Fit, daysFromT0: number) {
  const y = fit.intercept + fit.slope * daysFromT0;
  const band = fit.rmse * Math.sqrt(1 + daysFromT0 / 60);
  return { y, lower: y - band, upper: y + band };
}

/** Days until the fit crosses `target`, or null if it never will. */
export function daysToTarget(fit: Fit, latestWeight: number, target: number): number | null {
  if (Math.abs(fit.slope) < 1e-4) return null;
  const remaining = target - latestWeight;
  // Moving away from the target rather than toward it.
  if (Math.sign(remaining) !== Math.sign(fit.slope)) return null;
  const days = remaining / fit.slope;
  return days > 0 && days < 3650 ? days : null;
}

/** Centred rolling mean, which avoids the lag a trailing average adds. */
export function rollingMean(values: (number | null)[], window: number): (number | null)[] {
  const half = Math.floor(window / 2);
  return values.map((_, index) => {
    let sum = 0;
    let count = 0;
    for (let i = index - half; i <= index + half; i += 1) {
      const value = values[i];
      if (i >= 0 && i < values.length && value !== null && Number.isFinite(value)) {
        sum += value;
        count += 1;
      }
    }
    return count ? sum / count : null;
  });
}
