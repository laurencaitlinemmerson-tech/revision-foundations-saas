'use client';

import { useEffect, useMemo, useState } from 'react';

import type { HealthStreamFetch } from '@/components/operator/health/HealthMetricsSection';

type SessionKey = 'fullbody' | 'lower' | 'upper';
type BodyPhase = 'unset' | 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'pms';
type BodySignal = 'lowEnergy' | 'cramps' | 'bloated' | 'stressed' | 'strong';

interface SessionPlan {
  title: string;
  shortTitle: string;
  schedule: string;
  duration: string;
  focus: string;
  warmup: string;
  warmupNote: string;
  compounds: string[];
  accessories: string[];
  recovery: string;
  coaching: string;
}

interface BodyGuidance {
  label: string;
  scale: string;
  training: string;
  fuel: string;
}

const BODY_CONTEXT_KEY = 'operator-training-body-context-v1';

const PHASE_LABELS: Record<BodyPhase, string> = {
  unset: 'No phase set',
  menstrual: 'Period',
  follicular: 'Follicular',
  ovulatory: 'Ovulatory',
  luteal: 'Luteal',
  pms: 'PMS',
};

const SIGNAL_LABELS: Record<BodySignal, string> = {
  lowEnergy: 'Low energy',
  cramps: 'Cramps',
  bloated: 'Bloated',
  stressed: 'Stressed',
  strong: 'Feeling strong',
};

const TRAINING_PLAN: Record<SessionKey, SessionPlan> = {
  fullbody: {
    title: 'Full body',
    shortTitle: 'Full body',
    schedule: 'Wednesday',
    duration: '45 min',
    focus: 'Push, pull, squat and hinge in one balanced midweek lift.',
    warmup: 'Elliptical',
    warmupNote: '5 minutes, low resistance, build to a light sweat.',
    compounds: ['Chest press', 'Lat pulldown', 'Goblet squat', 'Romanian deadlift'],
    accessories: ['Cable tricep pushdown', 'Lateral raises'],
    recovery: '75-90 sec on compounds, 45 sec on accessories.',
    coaching: 'Use this as the clean reset session when the week feels scattered but you still want the big rocks covered.',
  },
  lower: {
    title: 'Lower body',
    shortTitle: 'Lower',
    schedule: 'Saturday',
    duration: '45 min',
    focus: 'Glutes first, quads and hamstrings second, with heavy lower-body work while fresh.',
    warmup: 'Elliptical',
    warmupNote: '5 minutes, loosen hips and legs before loading.',
    compounds: ['Hip thrust', 'Leg press', 'Romanian deadlift'],
    accessories: ['Hip abduction machine', 'Lying leg curl'],
    recovery: '45 sec on supersets, 90 sec on the heavy leg press and RDL work.',
    coaching: 'This is the best session for lower-body recomposition and shape work, so protect the first lifts and do not rush them.',
  },
  upper: {
    title: 'Upper body',
    shortTitle: 'Upper',
    schedule: 'Sunday',
    duration: '45 min',
    focus: 'Upper chest, lats, shoulders and mid-back with a strong push-pull rhythm.',
    warmup: 'Elliptical or row',
    warmupNote: '5 minutes, warm shoulders and back before pressing.',
    compounds: ['Incline dumbbell press', 'Lat pulldown', 'Dumbbell shoulder press', 'Low cable row'],
    accessories: ['Face pulls', 'Dumbbell bicep curl'],
    recovery: '75 sec on the first superset, 60 sec on the second, 45 sec on isolation work.',
    coaching: 'Use this day to build posture and shape, not ego; crisp reps and full range matter more than chasing load.',
  },
};

const WEEKLY_SEQUENCE: Array<{ day: number; key: SessionKey }> = [
  { day: 0, key: 'upper' },
  { day: 3, key: 'fullbody' },
  { day: 6, key: 'lower' },
];

function avg(values: Array<number | null | undefined>): number | null {
  const nums = values.filter((value): value is number => value !== null && value !== undefined && Number.isFinite(value));
  if (nums.length === 0) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function sum(values: Array<number | null | undefined>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function formatDate(iso: string | null): string {
  if (!iso) return 'No export yet';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'No export yet';
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function sessionForToday(day: number): SessionKey | null {
  return WEEKLY_SEQUENCE.find((entry) => entry.day === day)?.key ?? null;
}

function nextPlannedSession(day: number): { key: SessionKey; daysAway: number } {
  return WEEKLY_SEQUENCE
    .map((entry) => ({
      key: entry.key,
      daysAway: ((entry.day - day) + 7) % 7 || 7,
    }))
    .sort((a, b) => a.daysAway - b.daysAway)[0];
}

function baseGuidance(phase: BodyPhase): BodyGuidance {
  switch (phase) {
    case 'menstrual':
      return {
        label: 'Period context',
        scale: 'A noisier scale here is often fluid, soreness or inflammation rather than sudden fat gain.',
        training: 'Take the easier version if cramps or fatigue are loud. Machine work and walking still count.',
        fuel: 'Keep protein high, hydrate hard, and do not interpret temporary appetite shifts as failure.',
      };
    case 'follicular':
      return {
        label: 'Follicular context',
        scale: 'This is often a cleaner comparison window, so trend changes can be read with less hormonal static.',
        training: 'Good window to push load or reps on the main compounds if recovery markers are decent.',
        fuel: 'Use the extra energy well: protein first, then place carbs around the session to support output.',
      };
    case 'ovulatory':
      return {
        label: 'Ovulatory context',
        scale: 'Bodyweight can still wobble, but this phase often feels more powerful and coordinated for training.',
        training: 'Strong day potential. Warm up properly, then take your top sets seriously if form feels sharp.',
        fuel: 'Do not under-fuel just because energy feels better. Good sessions still need food support.',
      };
    case 'luteal':
      return {
        label: 'Luteal context',
        scale: 'Late-cycle water retention can make the graph look harsher than reality. Judge the month, not one morning.',
        training: 'Keep the session honest but not dramatic. Consistency beats force in this window.',
        fuel: 'Front-load satisfying meals, protect protein and fibre, and expect cravings without turning them into a spiral.',
      };
    case 'pms':
      return {
        label: 'PMS context',
        scale: 'This is the phase most likely to fake a setback. A bump on the scale is often water, not body fat.',
        training: 'Lower the pressure, not the standard. A lighter session or solid walk is still a win.',
        fuel: 'Simplify the day: structured meals, protein early, hydration, and less bargaining with yourself.',
      };
    case 'unset':
    default:
      return {
        label: 'Body context',
        scale: 'Add phase context when the scale feels emotionally louder than it should. It helps you read trend, not panic.',
        training: 'Use readiness and honesty to choose push, steady, lighter or recover instead of treating every day the same.',
        fuel: 'Protein, hydration and a boring plan beat chasing perfect days.',
      };
  }
}

function appendSignalGuidance(guidance: BodyGuidance, signals: BodySignal[]): BodyGuidance {
  let scale = guidance.scale;
  let training = guidance.training;
  let fuel = guidance.fuel;

  if (signals.includes('bloated')) {
    scale += ' Bloating is usually a fluid story, so keep your eye on the 2-4 week line.';
  }
  if (signals.includes('cramps')) {
    training += ' If pressure is unpleasant, swap heavy hinging for machines, incline walking or a shorter version.';
  }
  if (signals.includes('lowEnergy')) {
    training += ' Keep the promise small enough to complete cleanly.';
    fuel += ' A carb-supported session is better than trying to white-knuckle through a flat day.';
  }
  if (signals.includes('stressed')) {
    training += ' The goal is to leave feeling better than you started, not to prove anything.';
  }
  if (signals.includes('strong')) {
    training += ' If bar speed and form feel good, this is a fair day to add a rep or nudge the load.';
  }

  return { ...guidance, scale, training, fuel };
}

function modeLabel(mode: 'push' | 'steady' | 'lighter' | 'recover'): string {
  switch (mode) {
    case 'push':
      return 'Push day';
    case 'steady':
      return 'Steady day';
    case 'lighter':
      return 'Lighter day';
    case 'recover':
    default:
      return 'Recovery day';
  }
}

function readinessLabel(score: number | null): string {
  if (score === null) return 'Awaiting baseline';
  if (score >= 2) return 'Ready to push';
  if (score >= 0) return 'Good to go';
  if (score >= -2) return 'Take pressure off';
  return 'Recovery first';
}

function statValue(value: number | null, suffix = ''): string {
  if (value === null || !Number.isFinite(value)) return '-';
  return `${Math.round(value).toLocaleString('en-GB')}${suffix}`;
}

export default function OperatorTrainingSection({ healthStream }: { healthStream: HealthStreamFetch }) {
  const [phase, setPhase] = useState<BodyPhase>('unset');
  const [signals, setSignals] = useState<BodySignal[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionKey | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(BODY_CONTEXT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { phase?: BodyPhase; signals?: BodySignal[] };
      if (parsed.phase) setPhase(parsed.phase);
      if (Array.isArray(parsed.signals)) setSignals(parsed.signals.filter((signal): signal is BodySignal => signal in SIGNAL_LABELS));
    } catch {
      localStorage.removeItem(BODY_CONTEXT_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BODY_CONTEXT_KEY, JSON.stringify({ phase, signals }));
  }, [phase, signals]);

  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const todayKey = sessionForToday(now.getDay());
  const nextKey = nextPlannedSession(now.getDay());

  const latestDay = healthStream.days[healthStream.days.length - 1] ?? null;
  const todayDay = healthStream.days.find((day) => day.date.slice(0, 10) === todayIso) ?? latestDay;
  const baselineWindow = healthStream.days.slice(-15, -1);
  const last7 = healthStream.days.slice(-7);
  const workoutsThisWeek = healthStream.workouts.filter((workout) => {
    const date = new Date(workout.startedAt);
    if (Number.isNaN(date.getTime())) return false;
    return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
  });
  const latestWorkout = healthStream.workouts[0] ?? null;
  const workoutToday = healthStream.workouts.find((workout) => workout.startedAt.slice(0, 10) === todayIso) ?? null;

  const sleepBaseline = avg(baselineWindow.map((day) => day.sleep.totalMin));
  const hrvBaseline = avg(baselineWindow.map((day) => day.heart.hrvMs));
  const rhrBaseline = avg(baselineWindow.map((day) => day.heart.restingHr));

  const sleepToday = todayDay?.sleep.totalMin ?? null;
  const hrvToday = todayDay?.heart.hrvMs ?? null;
  const rhrToday = todayDay?.heart.restingHr ?? null;
  const exerciseToday = todayDay?.activity.exerciseMinutes ?? null;
  const weeklyExerciseMin = sum(last7.map((day) => day.activity.exerciseMinutes));
  const weeklySteps = sum(last7.map((day) => day.activity.steps));

  const readinessScore = useMemo(() => {
    let score = 0;
    let hasSignal = false;

    if (sleepToday !== null && sleepBaseline !== null) {
      hasSignal = true;
      score += sleepToday >= sleepBaseline - 20 ? 1 : sleepToday >= sleepBaseline - 75 ? 0 : -1;
    }
    if (hrvToday !== null && hrvBaseline !== null) {
      hasSignal = true;
      score += hrvToday >= hrvBaseline * 0.95 ? 1 : hrvToday >= hrvBaseline * 0.85 ? 0 : -1;
    }
    if (rhrToday !== null && rhrBaseline !== null) {
      hasSignal = true;
      score += rhrToday <= rhrBaseline + 2 ? 1 : rhrToday <= rhrBaseline + 5 ? 0 : -1;
    }

    if (phase === 'follicular' || phase === 'ovulatory') score += 1;
    if (phase === 'menstrual' || phase === 'pms') score -= 1;
    if (signals.includes('lowEnergy')) score -= 1;
    if (signals.includes('stressed')) score -= 1;
    if (signals.includes('cramps')) score -= 2;
    if (signals.includes('strong')) score += 1;

    if (!hasSignal && phase === 'unset' && signals.length === 0) return null;
    return score;
  }, [hrvBaseline, hrvToday, phase, rhrBaseline, rhrToday, signals, sleepBaseline, sleepToday]);

  const completedMoveToday = Boolean(workoutToday) || (exerciseToday ?? 0) >= 30;
  const mode = useMemo<'push' | 'steady' | 'lighter' | 'recover'>(() => {
    if (completedMoveToday && !todayKey) return 'recover';
    if (readinessScore === null) return signals.includes('cramps') || signals.includes('lowEnergy') ? 'lighter' : 'steady';
    if (readinessScore >= 2) return 'push';
    if (readinessScore >= 0) return 'steady';
    if (readinessScore >= -2) return 'lighter';
    return 'recover';
  }, [completedMoveToday, readinessScore, signals, todayKey]);

  const recommendedKey = todayKey ?? nextKey.key;
  const previewKey = selectedSession ?? recommendedKey;
  const previewSession = TRAINING_PLAN[previewKey];
  const recommendedSession = TRAINING_PLAN[recommendedKey];
  const guidance = appendSignalGuidance(baseGuidance(phase), signals);
  const liveLabel = completedMoveToday
    ? 'Movement logged'
    : todayKey
    ? 'Programmed today'
    : `${nextKey.daysAway} day runway`;

  useEffect(() => {
    if (selectedSession === null) setSelectedSession(recommendedKey);
  }, [recommendedKey, selectedSession]);

  const headline = todayKey
    ? mode === 'recover'
      ? `Protect recovery over ${recommendedSession.shortTitle.toLowerCase()}`
      : `${modeLabel(mode)} for ${recommendedSession.shortTitle.toLowerCase()}`
    : mode === 'recover'
    ? `Recovery over chasing extra work`
    : `${modeLabel(mode)} with ${recommendedSession.shortTitle.toLowerCase()} next`;

  const subcopy = todayKey
    ? `${recommendedSession.title} is on the calendar today. ${guidance.training}`
    : `${recommendedSession.title} is your next programmed lift in ${nextKey.daysAway} day${nextKey.daysAway === 1 ? '' : 's'}. ${guidance.training}`;

  const previewNote = previewKey === recommendedKey
    ? ''
    : `Viewing ${previewSession.title}. The recommendation still points to ${recommendedSession.title}.`;

  function toggleSignal(signal: BodySignal) {
    setSignals((current) => (current.includes(signal)
      ? current.filter((item) => item !== signal)
      : [...current, signal]));
  }

  function sessionStatus(key: SessionKey): string {
    if (key === todayKey) return 'Today';
    if (key === nextKey.key) return `Next in ${nextKey.daysAway}d`;
    return TRAINING_PLAN[key].schedule;
  }

  return (
    <section className="fit-panel op-training-section">
      <div className="fit-panel-head op-training-head">
        <div>
          <h3>Training <em>rhythm</em></h3>
          <div className="meta">Next lift, weekly split, and body-context guidance in one place.</div>
        </div>
        <div className="op-training-head-side">
          <span className={`op-training-mode-pill is-${mode}`}>{modeLabel(mode)}</span>
          <span className="op-training-inline-meta">
            {todayKey ? `${recommendedSession.title} planned today` : `${recommendedSession.title} next`}
          </span>
        </div>
      </div>

      <div className="op-training-layout">
        <article className="op-training-feature">
          <div className="op-training-feature-top">
            <div>
              <div className="op-training-feature-label">{todayKey ? "Today's recommendation" : 'Next programmed lift'}</div>
              <h4>{headline}</h4>
              <p>{subcopy}</p>
            </div>
            <div className="op-training-live">
              <span className="op-training-live-dot" aria-hidden="true" />
              <span>{liveLabel}</span>
            </div>
          </div>

          {previewNote ? <div className="op-training-preview-note">{previewNote}</div> : null}

          <div className="op-training-stat-row">
            <div className="op-training-stat">
              <span className="op-training-stat-label">Readiness</span>
              <strong>{readinessLabel(readinessScore)}</strong>
              <span>{sleepToday !== null || hrvToday !== null || rhrToday !== null ? 'From sleep, HRV and resting HR' : 'Will sharpen once Apple Health fills in'}</span>
            </div>
            <div className="op-training-stat">
              <span className="op-training-stat-label">Week load</span>
              <strong>{weeklyExerciseMin > 0 ? `${Math.round(weeklyExerciseMin)} min` : '-'}</strong>
              <span>{weeklySteps > 0 ? `${Math.round(weeklySteps).toLocaleString('en-GB')} steps in 7d` : 'Awaiting movement history'}</span>
            </div>
            <div className="op-training-stat">
              <span className="op-training-stat-label">Body context</span>
              <strong>{PHASE_LABELS[phase]}</strong>
              <span>{signals.length > 0 ? signals.map((signal) => SIGNAL_LABELS[signal]).join(' / ') : 'Add a signal when the day feels different'}</span>
            </div>
            <div className="op-training-stat">
              <span className="op-training-stat-label">Last workout</span>
              <strong>{latestWorkout ? formatDate(latestWorkout.startedAt) : 'No export yet'}</strong>
              <span>{latestWorkout ? `${latestWorkout.type ?? 'Workout'} / ${statValue(latestWorkout.durationMin, ' min')}` : 'Plan still works even while export is empty'}</span>
            </div>
          </div>

          <div className="op-training-plan-grid">
            <div className="op-training-plan-card">
              <span className="op-training-plan-label">Warm-up</span>
              <strong>{previewSession.warmup}</strong>
              <span>{previewSession.warmupNote}</span>
            </div>
            <div className="op-training-plan-card">
              <span className="op-training-plan-label">Focus</span>
              <strong>{previewSession.duration}</strong>
              <span>{previewSession.focus}</span>
            </div>
            <div className="op-training-plan-card">
              <span className="op-training-plan-label">Recovery</span>
              <strong>{modeLabel(mode)}</strong>
              <span>{previewSession.recovery}</span>
            </div>
            <div className="op-training-plan-card">
              <span className="op-training-plan-label">Coaching note</span>
              <strong>{previewSession.schedule}</strong>
              <span>{previewSession.coaching}</span>
            </div>
          </div>

          <div className="op-training-exercise-grid">
            <div className="op-training-exercise-card">
              <span className="op-training-exercise-label">Main lifts</span>
              <ul>
                {previewSession.compounds.map((exercise) => (
                  <li key={exercise}>{exercise}</li>
                ))}
              </ul>
            </div>
            <div className="op-training-exercise-card">
              <span className="op-training-exercise-label">Accessory finishers</span>
              <ul>
                {previewSession.accessories.map((exercise) => (
                  <li key={exercise}>{exercise}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="op-training-session-grid">
            {(Object.keys(TRAINING_PLAN) as SessionKey[]).map((key) => {
              const session = TRAINING_PLAN[key];
              const isActive = key === previewKey;
              const isRecommended = key === recommendedKey;

              return (
                <button
                  key={key}
                  type="button"
                  className={`op-training-session-card${isActive ? ' is-active' : ''}${isRecommended ? ' is-recommended' : ''}`}
                  onClick={() => setSelectedSession(key)}
                >
                  <div className="op-training-session-top">
                    <span className="op-training-session-name">{session.title}</span>
                    <span className="op-training-session-status">{sessionStatus(key)}</span>
                  </div>
                  <p>{session.focus}</p>
                  <div className="op-training-session-meta">
                    <span>{session.compounds.length} main lifts</span>
                    <span>{session.accessories.length} accessories</span>
                    <span>{session.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </article>

        <aside className="op-training-side">
          <div className="op-context-panel">
            <div className="op-context-head">
              <span className="op-training-kicker">Body context</span>
            </div>
            <p className="op-context-copy">
              Track the things that change how the same session actually feels, so the plan stays realistic instead of generic.
            </p>

            <div className="op-context-group">
              <span className="op-context-label">Phase</span>
              <div className="op-context-chip-row">
                {(Object.keys(PHASE_LABELS) as BodyPhase[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`op-context-chip${phase === value ? ' is-active' : ''}`}
                    onClick={() => setPhase(value)}
                  >
                    {PHASE_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>

            <div className="op-context-group">
              <span className="op-context-label">Signals</span>
              <div className="op-context-chip-row">
                {(Object.keys(SIGNAL_LABELS) as BodySignal[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`op-context-chip is-soft${signals.includes(value) ? ' is-active' : ''}`}
                    onClick={() => toggleSignal(value)}
                  >
                    {SIGNAL_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="op-context-notes">
            <div className="op-context-note">
              <span className="op-context-note-label">{guidance.label}</span>
            </div>
            <div className="op-context-note">
              <span className="op-context-note-label">Scale note</span>
              <p>{guidance.scale}</p>
            </div>
            <div className="op-context-note">
              <span className="op-context-note-label">Training note</span>
              <p>{guidance.training}</p>
            </div>
            <div className="op-context-note">
              <span className="op-context-note-label">Fuel note</span>
              <p>{guidance.fuel}</p>
            </div>
          </div>

          <div className="op-context-footer">
            {healthStream.workouts.length === 0
              ? 'Workout export is still empty, so this section is using your planned week as the anchor.'
              : `Apple Health has ${workoutsThisWeek.length} workout${workoutsThisWeek.length === 1 ? '' : 's'} in the last 7 days, so plan and live session data can now read together.`}
          </div>
        </aside>
      </div>
    </section>
  );
}
