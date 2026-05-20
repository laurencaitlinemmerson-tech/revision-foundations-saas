'use client';

import { useEffect, useMemo, useState } from 'react';

type PlanId = 'fullbody' | 'lower' | 'upper' | 'run';

interface WorkoutStudioWorkout {
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
}

interface StudioItem {
  id: string;
  name: string;
  prescription: string;
  note: string;
  muscles: string[];
  detail: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputMode?: 'text' | 'decimal';
  restSeconds?: number;
  allowEffort?: boolean;
}

interface StudioPlan {
  label: string;
  eyebrow: string;
  emphasis: string;
  cadence: string;
  summary: string;
  items: StudioItem[];
}

interface PlanDraft {
  completedIds: string[];
  values: Record<string, string>;
  effort: Record<string, number>;
  notes: Record<string, string>;
}

interface StudioSnapshot {
  id: string;
  savedAt: string;
  plan: PlanId;
  completed: number;
  total: number;
  timerSeconds: number;
}

interface PersistedStudioState {
  activePlan: PlanId;
  drafts: Record<PlanId, PlanDraft>;
  snapshots: StudioSnapshot[];
  weeklyRunTargetKm: number;
}

const STORAGE_KEY = 'operator-workout-studio-v1';
const PLAN_IDS: PlanId[] = ['fullbody', 'lower', 'upper', 'run'];

const STUDIO_PLANS: Record<PlanId, StudioPlan> = {
  fullbody: {
    label: 'Full body',
    eyebrow: 'Wednesday rhythm',
    emphasis: 'Balanced push, pull, squat, hinge.',
    cadence: '45 min studio',
    summary: 'The most useful slice of the standalone tracker, trimmed into one editorial dashboard card.',
    items: [
      {
        id: 'fb-warm',
        name: 'Elliptical warm-up',
        prescription: '5 min',
        note: 'Low resistance. Build a light sweat before loading anything.',
        muscles: ['Warm-up', 'Cardio'],
        detail: 'Start easy for two minutes, then lengthen the stride and let the heart rate climb just enough to wake everything up.',
        allowEffort: false,
      },
      {
        id: 'fb-chest',
        name: 'Chest press',
        prescription: '4 × 10',
        note: 'Drive through the chest, not the shoulders.',
        muscles: ['Chest', 'Triceps'],
        detail: 'Feet flat, shoulder blades anchored. Lower with control to a clean 90° elbow bend, then press without crashing into lockout.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'fb-lat',
        name: 'Lat pulldown',
        prescription: '4 × 10',
        note: 'Elbows to pockets. Full stretch at the top.',
        muscles: ['Lats', 'Biceps'],
        detail: 'Slight lean back, chest lifted. Pull to upper chest and think about moving the elbows rather than yanking with the hands.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 75,
      },
      {
        id: 'fb-squat',
        name: 'Goblet squat',
        prescription: '3 × 12',
        note: 'Chest tall, knees tracking cleanly.',
        muscles: ['Quads', 'Glutes', 'Core'],
        detail: 'Hold the bell close to the sternum, sit between the hips, and stand by driving through the floor rather than pitching forward.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'fb-rdl',
        name: 'Romanian deadlift',
        prescription: '3 × 10',
        note: 'Pure hinge. Feel the hamstrings lengthen.',
        muscles: ['Hamstrings', 'Glutes'],
        detail: 'Push hips back, keep ribs tucked, and stop the range the moment the back wants to round. Quality hinge, then stand tall.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'fb-lateral',
        name: 'Lateral raise',
        prescription: '3 × 15',
        note: 'Light and slow beats heavy and messy.',
        muscles: ['Side delts'],
        detail: 'Lead softly with the elbows, pause at shoulder height, then lower slower than you lifted. Keep tension, not momentum.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 45,
      },
    ],
  },
  lower: {
    label: 'Lower',
    eyebrow: 'Saturday lower-body',
    emphasis: 'Glutes, quads, hamstrings, then tidy isolation.',
    cadence: '45 min studio',
    summary: 'Aesthetic but practical: heavy movers first, then cleaner fatigue work once the session has shape.',
    items: [
      {
        id: 'lo-warm',
        name: 'Incline walk or bike',
        prescription: '5 min',
        note: 'Open the hips before the main work.',
        muscles: ['Warm-up', 'Hips'],
        detail: 'Think circulation and range rather than fatigue. The goal is simply to arrive at the first set warm.',
        allowEffort: false,
      },
      {
        id: 'lo-thrust',
        name: 'Hip thrust',
        prescription: '3 × 12',
        note: 'One-second squeeze at the top.',
        muscles: ['Glute max', 'Hamstrings'],
        detail: 'Ribs down, chin slightly tucked, and finish each rep by driving the hips through rather than over-arching the spine.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'lo-press',
        name: 'Leg press',
        prescription: '4 × 10',
        note: 'Feet lower and narrower for quad bias.',
        muscles: ['Quads', 'Glutes'],
        detail: 'Use a controlled bottom position, keep the lower back heavy on the pad, and let the knees travel without bouncing.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'lo-rdl',
        name: 'Romanian deadlift',
        prescription: '4 × 10',
        note: 'Heavy hinge. No rush on the way down.',
        muscles: ['Hamstrings', 'Glutes'],
        detail: 'Stay honest about range. If the hinge disappears, the set is done even if the prescribed reps are still on paper.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 90,
      },
      {
        id: 'lo-curl',
        name: 'Lying leg curl',
        prescription: '3 × 12',
        note: 'Control the eccentric. Hips stay down.',
        muscles: ['Hamstrings'],
        detail: 'Curl with intent, squeeze for a beat, and lower over three seconds so the machine never takes the work away from you.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 45,
      },
      {
        id: 'lo-abduct',
        name: 'Hip abduction',
        prescription: '3 × 15',
        note: 'Lean slightly forward to catch more glute med.',
        muscles: ['Glute med', 'Glute min'],
        detail: 'Push wide with control and return slowly. The set should burn, but the pelvis should stay still and deliberate.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 45,
      },
    ],
  },
  upper: {
    label: 'Upper',
    eyebrow: 'Sunday upper-body',
    emphasis: 'Press, pull, shoulders, then polish.',
    cadence: '45 min studio',
    summary: 'This keeps the better parts of the original tracker while letting the dashboard stay editorial rather than app-store busy.',
    items: [
      {
        id: 'up-warm',
        name: 'Row or band warm-up',
        prescription: '5 min',
        note: 'Wake the shoulders and upper back before pressing.',
        muscles: ['Warm-up', 'Shoulders'],
        detail: 'Light rows, band pull-aparts, or a simple erg warm-up. The point is joint readiness, not early fatigue.',
        allowEffort: false,
      },
      {
        id: 'up-press',
        name: 'Incline dumbbell press',
        prescription: '4 × 10',
        note: 'Slow three-second descent.',
        muscles: ['Upper chest', 'Triceps'],
        detail: 'Bench set between 30° and 45°. Let the dumbbells travel slightly in, not just straight up and down.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 75,
      },
      {
        id: 'up-lat',
        name: 'Lat pulldown',
        prescription: '4 × 10',
        note: 'Long reach up, then elbows down.',
        muscles: ['Lats', 'Biceps'],
        detail: 'Own the top stretch. The dashboard version is simple: full range, clean chest position, and no jerking through the middle.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 75,
      },
      {
        id: 'up-shoulder',
        name: 'Seated shoulder press',
        prescription: '3 × 10',
        note: 'Brace the ribs. No low-back shortcut.',
        muscles: ['Front delts', 'Triceps'],
        detail: 'Press in a smooth arc, finish stacked overhead, and lower with the same level of attention you gave the press itself.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 60,
      },
      {
        id: 'up-row',
        name: 'Low cable row',
        prescription: '3 × 12',
        note: 'Pull to the lower stomach, not the chest.',
        muscles: ['Mid-back', 'Rhomboids'],
        detail: 'Tall torso, soft knees, and pause for a beat when the shoulder blades meet. The squeeze is the point.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 60,
      },
      {
        id: 'up-facepull',
        name: 'Face pulls',
        prescription: '3 × 15',
        note: 'Light weight, high ownership.',
        muscles: ['Rear delts', 'Rotator cuff'],
        detail: 'Split the rope beside the ears and keep the elbows high enough to build the right shape rather than just moving the stack.',
        inputLabel: 'Load',
        inputPlaceholder: 'kg',
        inputMode: 'decimal',
        restSeconds: 45,
      },
    ],
  },
  run: {
    label: 'Run',
    eyebrow: 'Running line',
    emphasis: 'Warm up, settle, then one honest quality block.',
    cadence: '30–40 min line',
    summary: 'Rather than a separate run app, this makes the running side feel native to the same dashboard language.',
    items: [
      {
        id: 'run-warm',
        name: 'Warm-up walk + drills',
        prescription: '8 min',
        note: 'Walk, then light skips or leg swings.',
        muscles: ['Warm-up', 'Mobility'],
        detail: 'Bring the breathing down first, then gradually lift cadence and posture before you ask for speed.',
        allowEffort: false,
      },
      {
        id: 'run-easy',
        name: 'Easy build',
        prescription: '10–12 min',
        note: 'Talk-test easy. Nose breathing if available.',
        muscles: ['Aerobic', 'Cadence'],
        detail: 'This is the section that makes the main set cleaner. If this feels hurried, the rest of the run will too.',
        inputLabel: 'Pace',
        inputPlaceholder: 'min/km',
        inputMode: 'text',
        restSeconds: 60,
      },
      {
        id: 'run-main',
        name: 'Main block',
        prescription: '4 × 3 min steady / 2 min easy',
        note: 'Steady means purposeful, not maximal.',
        muscles: ['Threshold', 'Control'],
        detail: 'Hold posture, hold rhythm, and finish each rep feeling like one more would still be there if needed.',
        inputLabel: 'Pace',
        inputPlaceholder: 'min/km',
        inputMode: 'text',
        restSeconds: 120,
      },
      {
        id: 'run-strides',
        name: 'Strides',
        prescription: '6 × 20 sec',
        note: 'Fast feet, relaxed shoulders.',
        muscles: ['Speed', 'Mechanics'],
        detail: 'These are not sprints. The goal is crispness and tall posture, with the easy walk back acting as recovery.',
        inputLabel: 'Cue',
        inputPlaceholder: 'felt sharp / heavy / smooth',
        inputMode: 'text',
        restSeconds: 60,
      },
      {
        id: 'run-cool',
        name: 'Cool-down',
        prescription: '5 min',
        note: 'Walk it down. Let the system settle properly.',
        muscles: ['Recovery'],
        detail: 'A clean cool-down makes the next day better. It is part of the session, not something that happens only if time is left over.',
        allowEffort: false,
      },
    ],
  },
};

function localIsoDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeekIso(now: Date = new Date()): string {
  const base = new Date(now);
  const day = base.getDay();
  const offset = day === 0 ? 6 : day - 1;
  base.setDate(base.getDate() - offset);
  base.setHours(0, 0, 0, 0);
  return localIsoDate(base);
}

function createEmptyDraft(): PlanDraft {
  return { completedIds: [], values: {}, effort: {}, notes: {} };
}

function createInitialDrafts(): Record<PlanId, PlanDraft> {
  return {
    fullbody: createEmptyDraft(),
    lower: createEmptyDraft(),
    upper: createEmptyDraft(),
    run: createEmptyDraft(),
  };
}

function normalizeDraft(value: unknown): PlanDraft {
  const base = createEmptyDraft();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base;
  const raw = value as Partial<PlanDraft>;
  return {
    completedIds: Array.isArray(raw.completedIds) ? raw.completedIds.filter((entry): entry is string => typeof entry === 'string') : [],
    values: raw.values && typeof raw.values === 'object' && !Array.isArray(raw.values) ? Object.fromEntries(
      Object.entries(raw.values).filter(([, entry]) => typeof entry === 'string'),
    ) : {},
    effort: raw.effort && typeof raw.effort === 'object' && !Array.isArray(raw.effort) ? Object.fromEntries(
      Object.entries(raw.effort)
        .filter(([, entry]) => Number.isFinite(entry))
        .map(([key, entry]) => [key, Math.max(1, Math.min(5, Number(entry)))]),
    ) : {},
    notes: raw.notes && typeof raw.notes === 'object' && !Array.isArray(raw.notes) ? Object.fromEntries(
      Object.entries(raw.notes).filter(([, entry]) => typeof entry === 'string'),
    ) : {},
  };
}

function prettyWorkoutType(type: string | null): string {
  if (!type) return 'Workout';
  return type
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMinutes(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '—';
  const rounded = Math.round(value);
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function formatWorkoutDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function workoutSubtitle(workout: WorkoutStudioWorkout): string {
  const parts: string[] = [];
  if (workout.distanceKm !== null && workout.distanceKm > 0) parts.push(`${workout.distanceKm.toFixed(1)} km`);
  if (workout.durationMin !== null) parts.push(formatMinutes(workout.durationMin));
  if (workout.avgHr !== null) parts.push(`${Math.round(workout.avgHr)} bpm avg`);
  return parts.join(' · ') || 'Logged from the health stream';
}

export default function WorkoutStudio({ workouts }: { workouts: WorkoutStudioWorkout[] }) {
  const [activePlan, setActivePlan] = useState<PlanId>('fullbody');
  const [drafts, setDrafts] = useState<Record<PlanId, PlanDraft>>(createInitialDrafts);
  const [snapshots, setSnapshots] = useState<StudioSnapshot[]>([]);
  const [weeklyRunTargetKm, setWeeklyRunTargetKm] = useState(20);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [restLabel, setRestLabel] = useState('Rest');
  const [hydrated, setHydrated] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedStudioState>;
        if (parsed.activePlan && PLAN_IDS.includes(parsed.activePlan)) {
          setActivePlan(parsed.activePlan);
        }
        if (Number.isFinite(parsed.weeklyRunTargetKm)) {
          setWeeklyRunTargetKm(Math.max(1, Math.round(parsed.weeklyRunTargetKm as number)));
        }
        if (parsed.drafts && typeof parsed.drafts === 'object' && !Array.isArray(parsed.drafts)) {
          const next = createInitialDrafts();
          for (const planId of PLAN_IDS) {
            next[planId] = normalizeDraft((parsed.drafts as Partial<Record<PlanId, unknown>>)[planId]);
          }
          setDrafts(next);
        }
        if (Array.isArray(parsed.snapshots)) {
          setSnapshots(
            parsed.snapshots
              .filter((entry): entry is StudioSnapshot => {
                if (!entry || typeof entry !== 'object') return false;
                const candidate = entry as Partial<StudioSnapshot>;
                return typeof candidate.id === 'string'
                  && typeof candidate.savedAt === 'string'
                  && PLAN_IDS.includes(candidate.plan as PlanId)
                  && Number.isFinite(candidate.completed)
                  && Number.isFinite(candidate.total)
                  && Number.isFinite(candidate.timerSeconds);
              })
              .slice(0, 8),
          );
        }
      }
    } catch {
      // ignore hydration errors and fall back to clean local state
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedStudioState = {
      activePlan,
      drafts,
      snapshots,
      weeklyRunTargetKm,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore persistence failures
    }
  }, [activePlan, drafts, hydrated, snapshots, weeklyRunTargetKm]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = window.setInterval(() => {
      setTimerSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const restActive = restRemaining !== null;
  useEffect(() => {
    if (!restActive) return undefined;
    const interval = window.setInterval(() => {
      setRestRemaining((value) => {
        if (value === null) return null;
        return value <= 1 ? null : value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [restActive]);

  useEffect(() => {
    if (!savedFlag) return undefined;
    const timeout = window.setTimeout(() => setSavedFlag(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [savedFlag]);

  const plan = STUDIO_PLANS[activePlan];
  const draft = drafts[activePlan];
  const completedSet = useMemo(() => new Set(draft.completedIds), [draft.completedIds]);
  const completedCount = draft.completedIds.length;
  const totalCount = plan.items.length;
  const completionPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const sortedWorkouts = useMemo(
    () => [...workouts]
      .filter((entry) => {
        const hasMeaningfulMetric = (entry.durationMin ?? 0) > 0
          || (entry.distanceKm ?? 0) > 0
          || entry.avgHr !== null
          || entry.energyKcal !== null;
        const looksLikePlaceholder = /operator fitness reading/i.test(entry.type ?? '');
        return hasMeaningfulMetric && !looksLikePlaceholder;
      })
      .sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()),
    [workouts],
  );
  const recentWorkouts = sortedWorkouts.slice(0, 4);
  const weekStart = startOfWeekIso();
  const workoutsThisWeek = sortedWorkouts.filter((entry) => entry.startedAt.slice(0, 10) >= weekStart);
  const weekSessions = workoutsThisWeek.length;
  const weekMinutes = workoutsThisWeek.reduce((sum, entry) => sum + (entry.durationMin ?? 0), 0);
  const weekDistance = workoutsThisWeek.reduce((sum, entry) => sum + (entry.distanceKm ?? 0), 0);
  const weekCalories = workoutsThisWeek.reduce((sum, entry) => sum + (entry.energyKcal ?? 0), 0);
  const weekAvgHr = (() => {
    const heartRates = workoutsThisWeek
      .map((entry) => entry.avgHr)
      .filter((entry): entry is number => entry !== null && Number.isFinite(entry));
    if (heartRates.length === 0) return null;
    return heartRates.reduce((sum, entry) => sum + entry, 0) / heartRates.length;
  })();

  const weeklyRunProgress = weeklyRunTargetKm > 0 ? Math.min(100, (weekDistance / weeklyRunTargetKm) * 100) : 0;
  const latestWorkout = sortedWorkouts[0] ?? null;
  const daysSinceWorkout = latestWorkout
    ? Math.floor((Date.now() - new Date(latestWorkout.startedAt).getTime()) / 86400000)
    : null;
  const cadenceMessage = weekSessions >= 4
    ? 'Cadence is already high this week. Let the studio sharpen quality rather than inflate volume.'
    : daysSinceWorkout !== null && daysSinceWorkout >= 3
      ? 'The live workout feed has gone quiet for a few days. A short studio session would keep the dashboard line warm.'
      : 'The live feed and the studio can now work together: use this block to plan the next session before the data rolls in.';

  function patchActiveDraft(mutator: (current: PlanDraft) => PlanDraft) {
    setDrafts((current) => ({
      ...current,
      [activePlan]: mutator(current[activePlan]),
    }));
  }

  function toggleItem(item: StudioItem) {
    const isDone = completedSet.has(item.id);
    patchActiveDraft((current) => {
      const nextDone = new Set(current.completedIds);
      if (isDone) nextDone.delete(item.id);
      else nextDone.add(item.id);
      return { ...current, completedIds: Array.from(nextDone) };
    });
    if (!isDone && item.restSeconds) {
      setRestLabel(item.name);
      setRestRemaining(item.restSeconds);
    }
  }

  function setValue(itemId: string, value: string) {
    patchActiveDraft((current) => ({
      ...current,
      values: { ...current.values, [itemId]: value },
    }));
  }

  function setEffort(itemId: string, level: number) {
    patchActiveDraft((current) => ({
      ...current,
      effort: { ...current.effort, [itemId]: level },
    }));
  }

  function setNote(itemId: string, value: string) {
    patchActiveDraft((current) => ({
      ...current,
      notes: { ...current.notes, [itemId]: value },
    }));
  }

  function resetPlan() {
    setDrafts((current) => ({
      ...current,
      [activePlan]: createEmptyDraft(),
    }));
    setTimerSeconds(0);
    setTimerRunning(false);
    setRestRemaining(null);
  }

  function saveSnapshot() {
    const snapshot: StudioSnapshot = {
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
      plan: activePlan,
      completed: completedCount,
      total: totalCount,
      timerSeconds,
    };
    setSnapshots((current) => [snapshot, ...current].slice(0, 8));
    setSavedFlag(true);
  }

  return (
    <div className="fit-panel op-workout-studio">
      <div className="fit-panel-head op-workout-studio-head">
        <div>
          <h3>Workout <em>studio</em></h3>
          <div className="meta">Tracker logic from the standalone file, folded into the dashboard instead of split away from it.</div>
        </div>
        <div className="op-workout-studio-headside">
          <span className="pill neutral">{plan.eyebrow}</span>
          <span className="op-workout-studio-headnote">{plan.cadence}</span>
        </div>
      </div>

      <div className="op-workout-studio-body">
        <div className="op-workout-studio-planbar">
          {PLAN_IDS.map((planId) => (
            <button
              key={planId}
              type="button"
              className={`op-workout-studio-tab ${planId === activePlan ? 'is-active' : ''}`}
              onClick={() => setActivePlan(planId)}
            >
              {STUDIO_PLANS[planId].label}
            </button>
          ))}
        </div>

        <div className="op-workout-studio-intro">
          <div>
            <span className="op-workout-studio-kicker">Focus</span>
            <p>{plan.emphasis}</p>
          </div>
          <div>
            <span className="op-workout-studio-kicker">Use</span>
            <p>{plan.summary}</p>
          </div>
        </div>

        <div className="op-workout-studio-grid">
          <div className="op-workout-studio-main">
            <div className="op-workout-studio-command">
              <div className="op-workout-studio-commandtop">
                <div>
                  <span className="op-workout-studio-kicker">Session timer</span>
                  <div className="op-workout-studio-timer">{formatTimer(timerSeconds)}</div>
                </div>
                <div className="op-workout-studio-timeractions">
                  <button type="button" className={`op-workout-studio-ghost ${timerRunning ? 'is-live' : ''}`} onClick={() => setTimerRunning((value) => !value)}>
                    {timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button type="button" className="op-workout-studio-ghost" onClick={() => { setTimerSeconds(0); setTimerRunning(false); }}>
                    Reset
                  </button>
                </div>
              </div>

              <div className="op-workout-studio-progressline" aria-hidden="true">
                <span style={{ width: `${completionPct}%` }} />
              </div>

              <div className="op-workout-studio-progressmeta">
                <span><strong>{completedCount}</strong> of {totalCount} blocks checked</span>
                <span><strong>{completionPct}%</strong> complete</span>
              </div>

              <div className="op-workout-studio-restrow">
                <div className="op-workout-studio-reststate">
                  <span className="op-workout-studio-kicker">Rest timer</span>
                  <div className="op-workout-studio-restvalue">
                    {restRemaining !== null ? `${restLabel} · ${formatTimer(restRemaining)}` : 'Idle'}
                  </div>
                </div>
                <div className="op-workout-studio-restactions">
                  <button type="button" className="op-workout-studio-mini" onClick={() => { setRestLabel('Short rest'); setRestRemaining(45); }}>45s</button>
                  <button type="button" className="op-workout-studio-mini" onClick={() => { setRestLabel('Main-set rest'); setRestRemaining(90); }}>90s</button>
                  <button type="button" className="op-workout-studio-mini" onClick={() => { setRestLabel('Reset'); setRestRemaining(null); }}>Clear</button>
                </div>
              </div>

              <div className="op-workout-studio-commandfoot">
                <button type="button" className="op-workout-studio-save" onClick={saveSnapshot}>
                  Save studio snapshot
                </button>
                <button type="button" className="op-workout-studio-textbtn" onClick={resetPlan}>
                  Reset current plan
                </button>
              </div>

              <div className={`op-workout-studio-savehint ${savedFlag ? 'is-visible' : ''}`}>
                {savedFlag ? 'Saved locally in this dashboard.' : hydrated ? 'Snapshots stay in this browser for quick returns.' : 'Preparing local studio memory…'}
              </div>
            </div>

            <div className="op-workout-studio-list">
              {plan.items.map((item) => {
                const isDone = completedSet.has(item.id);
                const value = draft.values[item.id] ?? '';
                const note = draft.notes[item.id] ?? '';
                const effort = draft.effort[item.id] ?? 0;
                return (
                  <article key={item.id} className={`op-workout-studio-item ${isDone ? 'is-done' : ''}`}>
                    <button
                      type="button"
                      className={`op-workout-studio-check ${isDone ? 'is-done' : ''}`}
                      onClick={() => toggleItem(item)}
                      aria-label={isDone ? `Mark ${item.name} incomplete` : `Mark ${item.name} complete`}
                    >
                      <span />
                    </button>

                    <div className="op-workout-studio-itembody">
                      <div className="op-workout-studio-itemtop">
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.note}</p>
                        </div>
                        <div className="op-workout-studio-prescription">{item.prescription}</div>
                      </div>

                      {item.muscles.length > 0 && (
                        <div className="op-workout-studio-muscles">
                          {item.muscles.map((muscle) => (
                            <span key={muscle}>{muscle}</span>
                          ))}
                        </div>
                      )}

                      <p className="op-workout-studio-detail">{item.detail}</p>

                      <div className="op-workout-studio-controls">
                        {item.inputLabel && (
                          <label className="op-workout-studio-field">
                            <span>{item.inputLabel}</span>
                            <input
                              type="text"
                              inputMode={item.inputMode === 'decimal' ? 'decimal' : 'text'}
                              value={value}
                              placeholder={item.inputPlaceholder}
                              onChange={(event) => setValue(item.id, event.target.value)}
                            />
                          </label>
                        )}

                        {item.allowEffort !== false && (
                          <div className="op-workout-studio-effort">
                            <span>Effort</span>
                            <div className="op-workout-studio-dots">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  className={`op-workout-studio-dot ${level <= effort ? 'is-filled' : ''}`}
                                  onClick={() => setEffort(item.id, level)}
                                  aria-label={`Set ${item.name} effort to ${level} out of 5`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {item.restSeconds && (
                          <button
                            type="button"
                            className="op-workout-studio-restbtn"
                            onClick={() => {
                              setRestLabel(item.name);
                              setRestRemaining(item.restSeconds ?? null);
                            }}
                          >
                            Rest {item.restSeconds}s
                          </button>
                        )}
                      </div>

                      <label className="op-workout-studio-note">
                        <span>Note</span>
                        <input
                          type="text"
                          value={note}
                          placeholder="Cue, tweak, or what changed today"
                          onChange={(event) => setNote(item.id, event.target.value)}
                        />
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="op-workout-studio-side">
            <div className="op-workout-studio-panel">
              <div className="op-workout-studio-panelhead">
                <span className="op-workout-studio-kicker">This week</span>
                <span className="pill neutral">{weekSessions} live sessions</span>
              </div>
              <div className="op-workout-studio-stats">
                <div>
                  <span>Minutes</span>
                  <strong>{formatMinutes(weekMinutes)}</strong>
                </div>
                <div>
                  <span>Distance</span>
                  <strong>{weekDistance.toFixed(1)} km</strong>
                </div>
                <div>
                  <span>Energy</span>
                  <strong>{Math.round(weekCalories).toLocaleString('en-GB')} kcal</strong>
                </div>
                <div>
                  <span>Avg HR</span>
                  <strong>{weekAvgHr !== null ? `${Math.round(weekAvgHr)} bpm` : '—'}</strong>
                </div>
              </div>

              <div className="op-workout-studio-target">
                <div className="op-workout-studio-targethead">
                  <span>Weekly run target</span>
                  <strong>{weekDistance.toFixed(1)} / {weeklyRunTargetKm} km</strong>
                </div>
                <div className="op-workout-studio-targetbar" aria-hidden="true">
                  <span style={{ width: `${weeklyRunProgress}%` }} />
                </div>
                <label className="op-workout-studio-targetinput">
                  <span>Target</span>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={weeklyRunTargetKm}
                    onChange={(event) => setWeeklyRunTargetKm(Math.max(1, Number(event.target.value) || 20))}
                  />
                </label>
              </div>

              <p className="op-workout-studio-cadence">{cadenceMessage}</p>
            </div>

            <div className="op-workout-studio-panel">
              <div className="op-workout-studio-panelhead">
                <span className="op-workout-studio-kicker">Recent workouts</span>
                <span className="op-workout-studio-panelmeta">Health stream</span>
              </div>
              {recentWorkouts.length > 0 ? (
                <div className="op-workout-studio-livefeed">
                  {recentWorkouts.map((workout) => (
                    <article key={workout.id} className="op-workout-studio-liveitem">
                      <div>
                        <h5>{prettyWorkoutType(workout.type)}</h5>
                        <p>{formatWorkoutDate(workout.startedAt)} · {workoutSubtitle(workout)}</p>
                      </div>
                      <span>{workout.distanceKm !== null && workout.distanceKm > 0 ? `${workout.distanceKm.toFixed(1)} km` : formatMinutes(workout.durationMin)}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="op-workout-studio-empty">No live workout rows yet. The studio still works as a local planning and logging layer.</p>
              )}
            </div>

            <div className="op-workout-studio-panel">
              <div className="op-workout-studio-panelhead">
                <span className="op-workout-studio-kicker">Saved snapshots</span>
                <span className="op-workout-studio-panelmeta">Local</span>
              </div>
              {snapshots.length > 0 ? (
                <div className="op-workout-studio-history">
                  {snapshots.map((snapshot) => {
                    const snapshotPlan = STUDIO_PLANS[snapshot.plan];
                    const pct = snapshot.total === 0 ? 0 : Math.round((snapshot.completed / snapshot.total) * 100);
                    return (
                      <article key={snapshot.id} className="op-workout-studio-historyitem">
                        <div>
                          <h5>{snapshotPlan.label}</h5>
                          <p>{formatWorkoutDate(snapshot.savedAt)}</p>
                        </div>
                        <div className="op-workout-studio-historymeta">
                          <strong>{pct}%</strong>
                          <span>{formatTimer(snapshot.timerSeconds)}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="op-workout-studio-empty">Save one studio snapshot and the dashboard will start building a quick local session trail.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
