/* ============================================================
   animals.ts — "total weight moved" as something you can picture
   ============================================================
   Ported from the source design's volumeVals() logic: picks whichever
   reference animal lands the comparison closest to a "6×" multiple —
   scaling to a golden retriever when the total is small, an elephant
   when it's enormous — rather than always reaching for the same
   overused "elephants" comparison regardless of scale.
   ============================================================ */

export interface AnimalRef {
  name: string;
  kg: number;
}

export const ANIMALS: AnimalRef[] = [
  { name: 'golden retrievers', kg: 32 },
  { name: 'red kangaroos', kg: 85 },
  { name: 'reindeer', kg: 180 },
  { name: 'highland cows', kg: 500 },
  { name: 'polar bears', kg: 450 },
  { name: 'giraffes', kg: 1200 },
  { name: 'African elephants', kg: 6000 },
];

export interface AnimalComparison {
  best: AnimalRef;
  count: number;
  /** A handful of neighbouring reference animals for the scale strip,
   *  each with a log-scaled bar width so a 6000kg elephant and a 32kg
   *  retriever can share one axis without the small end vanishing. */
  scale: { ref: AnimalRef; count: number; isBest: boolean; barWidthPct: number }[];
}

export function compareToAnimals(totalKg: number): AnimalComparison | null {
  if (totalKg <= 0) return null;

  const candidates = ANIMALS.map((ref) => ({ ref, count: totalKg / ref.kg })).filter(
    (c) => c.count >= 1.5,
  );
  const picked =
    candidates.sort((a, b) => Math.abs(Math.log(a.count / 6)) - Math.abs(Math.log(b.count / 6)))[0] ??
    { ref: ANIMALS[0], count: totalKg / ANIMALS[0].kg };

  const sorted = [...ANIMALS].sort((a, b) => a.kg - b.kg);
  const bestIndex = sorted.findIndex((a) => a.name === picked.ref.name);
  const from = Math.max(0, Math.min(bestIndex - 2, sorted.length - 5));
  const windowRefs = sorted.slice(from, from + 5);
  const logSpan = Math.log10(Math.max(2, totalKg / ANIMALS[0].kg));

  return {
    best: picked.ref,
    count: picked.count,
    scale: windowRefs.map((ref) => {
      const count = totalKg / ref.kg;
      return {
        ref,
        count,
        isBest: ref.name === picked.ref.name,
        barWidthPct: Math.min(100, (Math.log10(Math.max(1.02, count)) / logSpan) * 100),
      };
    }),
  };
}

/** "1.4×" under 100, "1,240×" once the multiple gets silly. */
export function fmtAnimalCount(count: number): string {
  return count >= 100 ? `${Math.round(count).toLocaleString('en-GB')}×` : `${count.toFixed(1)}×`;
}
