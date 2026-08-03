/* Shared shapes for the operator dashboard. Everything is camelCase on
   this side of the wire; the Supabase snake_case rows are mapped in
   `data.ts`. Nullable fields are genuinely nullable — a missing day of
   Apple Health data must never silently read as zero. */

export interface BodyReading {
  id: string;
  /** ISO day, YYYY-MM-DD */
  date: string;
  /** kg */
  weight: number;
  bmi: number;
  /** percentage of body mass */
  bodyFat: number;
  water: number;
  muscleMass: number;
  boneMass: number;
}

export interface DailyMetric {
  date: string;

  // Activity
  steps: number | null;
  activeEnergyKcal: number | null;
  exerciseMinutes: number | null;
  standHours: number | null;
  distanceKm: number | null;

  // Heart
  restingHr: number | null;
  hrvMs: number | null;
  walkingHrAvg: number | null;
  vo2Max: number | null;

  // Sleep (minutes)
  sleepTotalMin: number | null;
  sleepRemMin: number | null;
  sleepDeepMin: number | null;
  sleepCoreMin: number | null;
  sleepAwakeMin: number | null;

  // Nutrition
  dietaryEnergyKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  sugarG: number | null;
  waterMl: number | null;
}

export interface Workout {
  id: string;
  startedAt: string;
  type: string;
  durationMin: number | null;
  energyKcal: number | null;
  avgHr: number | null;
  maxHr: number | null;
  distanceKm: number | null;
}

export interface OperatorSettings {
  heightCm: number;
  ageYears: number;
  sex: 'female' | 'male';
  /** kg */
  targetWeightKg: number;
  /** kg per week; positive = loss */
  weeklyChangeKg: number;
  /** NEAT as a proportion of BMR */
  neatFactor: number;
  proteinTargetG: number;
  stepTarget: number;
  /** minutes */
  sleepTargetMin: number;
  waterTargetMl: number;
}

export interface RevenuePoint {
  month: string;
  grossPence: number;
  orders: number;
}

export interface BusinessPulse {
  available: boolean;
  currency: string;
  grossPence: number;
  gross30Pence: number;
  gross7Pence: number;
  orders: number;
  orders30: number;
  unclaimed: number;
  entitlements: number;
  activeStudents7: number;
  activeStudents30: number;
  byProduct: { product: string; orders: number; grossPence: number }[];
  revenueByMonth: RevenuePoint[];
}

export interface OperatorSnapshot {
  generatedAt: string;
  /** True when Supabase is unreachable or empty and we are showing sample data. */
  isDemo: boolean;
  /** True when the operator_* tables have not been created yet. */
  setupRequired: boolean;
  settings: OperatorSettings;
  readings: BodyReading[];
  dailies: DailyMetric[];
  workouts: Workout[];
  business: BusinessPulse;
}

export const DEFAULT_SETTINGS: OperatorSettings = {
  heightCm: 157.5,
  ageYears: 26,
  sex: 'female',
  targetWeightKg: 60,
  weeklyChangeKg: 0.5,
  neatFactor: 0.25,
  proteinTargetG: 120,
  stepTarget: 8000,
  sleepTargetMin: 450,
  waterTargetMl: 2000,
};
