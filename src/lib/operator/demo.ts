import {
  DEFAULT_SETTINGS,
  type BodyReading,
  type BusinessPulse,
  type DailyMetric,
  type OperatorSettings,
  type OperatorSnapshot,
  type Workout,
} from './types';
import { addDays, isoDay } from './fitness/derive';

/* ============================================================
   demo.ts — plausible sample data for an unconfigured dashboard
   ============================================================
   Rendered whenever the operator tables are empty or absent, so the
   layout can be judged before a single real reading exists. Always
   labelled as sample data in the UI — never presented as real.

   Deterministic: a seeded PRNG means the same shape every render,
   which keeps server and client output identical.
   ============================================================ */

const DEMO_DAYS = 180;

/** mulberry32 — small, fast, good enough for believable noise. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORKOUT_TYPES = [
  { type: 'Strength', minutes: 52, kcal: 320, hr: 128 },
  { type: 'Running', minutes: 34, kcal: 380, hr: 158 },
  { type: 'Pilates', minutes: 45, kcal: 190, hr: 112 },
  { type: 'Walking', minutes: 62, kcal: 210, hr: 104 },
  { type: 'Cycling', minutes: 40, kcal: 300, hr: 140 },
];

export function buildDemoSnapshot(settings: OperatorSettings = DEFAULT_SETTINGS): OperatorSnapshot {
  const random = seeded(20260803);
  const today = isoDay(new Date());
  const start = addDays(today, -(DEMO_DAYS - 1));

  const readings: BodyReading[] = [];
  const dailies: DailyMetric[] = [];
  const workouts: Workout[] = [];

  const startWeight = 78.4;
  const endWeight = 71.6;

  for (let i = 0; i < DEMO_DAYS; i += 1) {
    const date = addDays(start, i);
    const progress = i / (DEMO_DAYS - 1);
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();

    // An easing curve, because loss slows as it goes on, plus a small
    // plateau through the middle third and day-to-day water noise.
    const eased = 1 - (1 - progress) ** 1.35;
    const plateau = progress > 0.42 && progress < 0.56 ? 0.35 : 0;
    const trendWeight = startWeight - (startWeight - endWeight) * (eased - plateau * 0.08);
    const noise = (random() - 0.5) * 0.9;
    const weight = Number((trendWeight + noise).toFixed(1));

    // Weighs in most mornings, misses the odd day.
    if (random() > 0.18) {
      const bodyFat = Number((31.5 - 4.8 * eased + (random() - 0.5) * 0.6).toFixed(1));
      readings.push({
        id: `demo-${date}`,
        date,
        weight,
        bmi: Number((weight / (settings.heightCm / 100) ** 2).toFixed(1)),
        bodyFat,
        water: Number((48.5 + 2.4 * eased + (random() - 0.5) * 0.8).toFixed(1)),
        muscleMass: Number((36.2 + 2.9 * eased + (random() - 0.5) * 0.5).toFixed(1)),
        boneMass: Number((2.6 + (random() - 0.5) * 0.06).toFixed(2)),
      });
    }

    const isWeekend = weekday === 0 || weekday === 6;
    const trained = !isWeekend ? random() > 0.42 : random() > 0.72;
    const loggedFood = random() > 0.12;

    const activeKcal = Math.round(
      (trained ? 430 : 210) + random() * 160 - (isWeekend ? 40 : 0),
    );
    const steps = Math.round((isWeekend ? 6200 : 9100) + random() * 4200);
    const intake = loggedFood
      ? Math.round(1620 + random() * 460 + (isWeekend ? 240 : 0))
      : null;
    const protein = intake ? Math.round(intake * (0.26 + random() * 0.08) / 4) : null;
    const fat = intake ? Math.round((intake * (0.3 + random() * 0.06)) / 9) : null;
    const carbs = intake && protein && fat ? Math.round((intake - protein * 4 - fat * 9) / 4) : null;

    const sleepTotal = Math.round(392 + random() * 96);
    const deep = Math.round(sleepTotal * (0.14 + random() * 0.05));
    const rem = Math.round(sleepTotal * (0.2 + random() * 0.06));

    dailies.push({
      date,
      steps,
      activeEnergyKcal: activeKcal,
      exerciseMinutes: trained ? Math.round(38 + random() * 26) : Math.round(random() * 18),
      standHours: Math.round(9 + random() * 4),
      distanceKm: Number((steps / 1370).toFixed(2)),
      restingHr: Math.round(62 - 5 * eased + (random() - 0.5) * 4),
      hrvMs: Number((41 + 12 * eased + (random() - 0.5) * 9).toFixed(1)),
      walkingHrAvg: Math.round(104 + (random() - 0.5) * 8),
      vo2Max: Number((34.5 + 4.2 * eased).toFixed(1)),
      sleepTotalMin: sleepTotal,
      sleepRemMin: rem,
      sleepDeepMin: deep,
      sleepCoreMin: sleepTotal - deep - rem,
      sleepAwakeMin: Math.round(8 + random() * 16),
      dietaryEnergyKcal: intake,
      proteinG: protein,
      carbsG: carbs,
      fatG: fat,
      fiberG: intake ? Math.round(18 + random() * 12) : null,
      sugarG: intake ? Math.round(38 + random() * 30) : null,
      waterMl: Math.round(1500 + random() * 1200),
    });

    if (trained) {
      const template = WORKOUT_TYPES[Math.floor(random() * WORKOUT_TYPES.length)];
      const duration = Math.round(template.minutes + (random() - 0.5) * 18);
      workouts.push({
        id: `demo-w-${date}`,
        startedAt: `${date}T${isWeekend ? '10' : '18'}:15:00.000Z`,
        type: template.type,
        durationMin: duration,
        energyKcal: Math.round(template.kcal * (duration / template.minutes) * (0.9 + random() * 0.2)),
        avgHr: Math.round(template.hr + (random() - 0.5) * 12),
        maxHr: Math.round(template.hr + 22 + random() * 14),
        distanceKm:
          template.type === 'Running' || template.type === 'Cycling' || template.type === 'Walking'
            ? Number((duration * (template.type === 'Cycling' ? 0.42 : 0.15)).toFixed(2))
            : null,
      });
    }
  }

  const business: BusinessPulse = {
    available: false,
    currency: 'gbp',
    grossPence: 0,
    gross30Pence: 0,
    gross7Pence: 0,
    orders: 0,
    orders30: 0,
    unclaimed: 0,
    entitlements: 0,
    activeStudents7: 0,
    activeStudents30: 0,
    byProduct: [],
    revenueByMonth: [],
  };

  return {
    generatedAt: new Date().toISOString(),
    isDemo: true,
    setupRequired: false,
    settings,
    readings,
    dailies,
    workouts,
    business,
  };
}
