export const MIN_PLAUSIBLE_WEIGHT_KG = 35
export const MAX_PLAUSIBLE_WEIGHT_KG = 300

export function isPlausibleWeightKg(value: number) {
  return Number.isFinite(value) && value >= MIN_PLAUSIBLE_WEIGHT_KG && value <= MAX_PLAUSIBLE_WEIGHT_KG
}

