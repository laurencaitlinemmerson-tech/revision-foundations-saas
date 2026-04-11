'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface DailyPlan {
  osceStation: boolean;
  quizQuestions: boolean;
  weakTopics: boolean;
}

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  studyDates: string[];  // last 30 days
}

interface WeakTopic {
  topic: string;
  score: number;    // 0–100
  attempts: number;
  lastSeen: string; // YYYY-MM-DD
}

interface SessionStats {
  totalSessions: number;
  totalQuestions: number;
  totalOsceStations: number;
  weekSessions: number[]; // [6 days ago … today], length 7
  lastWeekTotal: number;
}

interface LastActivity {
  toolName: 'osce' | 'quiz';
  path: string;
  label: string;
  timestamp: number;
}

// ─────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────

export const STORAGE_KEYS = {
  streak:     'rf_study_streak',
  plan:       'rf_daily_plan',
  weakTopics: 'rf_weak_topics',
  stats:      'rf_session_stats',
  lastTool:   'rf_last_activity',
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Monday-based week index: Mon=0 … Sun=6 */
function todayWeekIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

function defaultStreak(): StudyStreak {
  return { currentStreak: 0, longestStreak: 0, lastStudyDate: '', studyDates: [] };
}

function defaultStats(): SessionStats {
  return { totalSessions: 0, totalQuestions: 0, totalOsceStations: 0, weekSessions: Array(7).fill(0), lastWeekTotal: 0 };
}

// ─────────────────────────────────────────────
// PUBLIC API — call from quiz / osce pages
// ─────────────────────────────────────────────

/**
 * Mark today as studied and recalculate streak.
 * Idempotent — safe to call multiple times per day.
 */
export function recordStudySession() {
  if (typeof window === 'undefined') return;
  const today = todayStr();
  const streak = load<StudyStreak>(STORAGE_KEYS.streak, defaultStreak());
  if (streak.lastStudyDate === today) return;

  const newCount = streak.lastStudyDate === yesterdayStr() ? streak.currentStreak + 1 : 1;
  const newLongest = Math.max(newCount, streak.longestStreak);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const newDates = [...streak.studyDates.filter(d => d >= cutoffStr), today];

  save(STORAGE_KEYS.streak, {
    currentStreak: newCount,
    longestStreak: newLongest,
    lastStudyDate: today,
    studyDates: newDates,
  });

  const stats = load<SessionStats>(STORAGE_KEYS.stats, defaultStats());
  const newWeek = [...stats.weekSessions];
  newWeek[6] = (newWeek[6] || 0) + 1;
  save(STORAGE_KEYS.stats, { ...stats, totalSessions: stats.totalSessions + 1, weekSessions: newWeek });
}

/**
 * Call after a quiz session with per-topic results.
 * Weak topics (< 80%) surface in FocusAreasCard.
 * Topics graduate once score >= 80 and attempts >= 2.
 *
 * Usage:
 *   recordQuizResults([{ topic: 'Pharmacology', correct: 6, total: 10 }])
 */
export function recordQuizResults(results: { topic: string; correct: number; total: number }[]) {
  if (typeof window === 'undefined') return;
  const existing = load<WeakTopic[]>(STORAGE_KEYS.weakTopics, []);
  const today = todayStr();
  const updated = [...existing];

  for (const r of results) {
    const score = Math.round((r.correct / r.total) * 100);
    const idx = updated.findIndex(t => t.topic === r.topic);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], score, attempts: updated[idx].attempts + 1, lastSeen: today };
    } else if (score < 80) {
      updated.push({ topic: r.topic, score, attempts: 1, lastSeen: today });
    }
  }

  const filtered = updated.filter(t => !(t.score >= 80 && t.attempts >= 2));
  save(STORAGE_KEYS.weakTopics, filtered);

  const stats = load<SessionStats>(STORAGE_KEYS.stats, defaultStats());
  const totalAnswered = results.reduce((a, r) => a + r.total, 0);
  save(STORAGE_KEYS.stats, { ...stats, totalQuestions: stats.totalQuestions + totalAnswered });

  recordStudySession();
  save(STORAGE_KEYS.lastTool, { toolName: 'quiz', path: '/quiz', label: 'Core Quiz', timestamp: Date.now() });
}

/**
 * Call after completing an OSCE station.
 *
 * Usage:
 *   recordOsceStation()
 */
export function recordOsceStation() {
  if (typeof window === 'undefined') return;
  const stats = load<SessionStats>(STORAGE_KEYS.stats, defaultStats());
  save(STORAGE_KEYS.stats, { ...stats, totalOsceStations: stats.totalOsceStations + 1 });
  recordStudySession();
  save(STORAGE_KEYS.lastTool, { toolName: 'osce', path: '/osce', label: 'OSCE Tool', timestamp: Date.now() });
}

// Legacy exports — kept so nothing breaks
export function recordSessionStart(_tool: string) { void _tool; recordStudySession(); }
export function getStudyStreak() { return load<StudyStreak>(STORAGE_KEYS.streak, defaultStreak()); }
export function getLastActivity() { return load<LastActivity | null>(STORAGE_KEYS.lastTool, null); }
export function saveLastActivity(activity: Omit<LastActivity, 'timestamp'>) {
  save(STORAGE_KEYS.lastTool, { ...activity, timestamp: Date.now() });
}

// ─────────────────────────────────────────────
// STUDY TIPS
// ─────────────────────────────────────────────

const TIPS = [
  "Little and often beats cramming. 15–20 minutes daily beats hours the night before.",
  "Test yourself before you feel ready — retrieval practice strengthens memory more than re-reading.",
  "Explain concepts out loud as if teaching someone else. If you stumble, that's where to focus.",
  "Take a short break every 25–30 minutes. Your brain consolidates learning during rest.",
  "Review mistakes carefully — they're your best teachers. Understanding why beats re-reading.",
  "Mix topics in a single session instead of drilling one thing repeatedly.",
  "Sleep is revision. Your brain processes and stores information while you rest.",
  "Write down one thing you learned today before bed. 30 seconds, big retention boost.",
];

function getDailyTip() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return TIPS[seed % TIPS.length];
}

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// STUDY STREAK CARD
// ─────────────────────────────────────────────

export function StudyStreakCard() {
  const [streak, setStreak] = useState<StudyStreak | null>(null);

  useEffect(() => {
    const stored = load<StudyStreak>(STORAGE_KEYS.streak, defaultStreak());
    // Invalidate if last study was before yesterday
    if (stored.lastStudyDate !== todayStr() && stored.lastStudyDate !== yesterdayStr()) {
      stored.currentStreak = 0;
    }
    setStreak(stored);
  }, []);

  if (!streak) return null;

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = todayWeekIndex();
  const studiedToday = streak.lastStudyDate === todayStr();

  const weekActivity = DAY_LABELS.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - todayIdx));
    return streak.studyDates.includes(d.toISOString().slice(0, 10));
  });

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card border border-[var(--linen-deep)] bg-white h-full"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">Study streak</p>
          <p className="max-w-[180px] text-sm font-light leading-6 text-[var(--charcoal)]/70">
            A small record of how often you’ve shown up.
          </p>
        </div>
        <div className="text-right">
          <motion.p className="font-display text-[3rem] leading-none text-[var(--espresso)]"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {streak.currentStreak}
          </motion.p>
          <p className="text-xs text-[var(--charcoal)]/60 font-light">
            {streak.currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        {DAY_LABELS.map((label, i) => {
          const isToday = i === todayIdx;
          const isActive = weekActivity[i];
          return (
            <motion.div key={i} className="flex flex-col items-center gap-1.5 flex-1"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className={`w-full h-1.5 rounded-full transition-colors ${
                isActive ? 'bg-[var(--sage-600)]'
                : isToday ? 'bg-[var(--linen-deep)] ring-1 ring-[var(--sage-600)]/30'
                : 'bg-[var(--linen-deep)]'
              }`} />
              <span className={`text-[10px] ${isToday ? 'text-[var(--espresso)] font-medium' : 'text-[var(--charcoal)]/50'}`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className={`px-3 py-3 text-xs font-light ${
        studiedToday ? 'bg-[var(--teal-50)] text-[var(--teal-600)]' : 'bg-[var(--linen-light)] text-[var(--charcoal)]/70'
      }`}>
        {studiedToday
          ? "You've studied today."
          : streak.currentStreak > 0
          ? `Study today to keep your ${streak.currentStreak}-day streak going.`
          : 'Start a short session and the streak begins here.'}
      </div>

      {streak.longestStreak > 1 && (
        <p className="mt-3 text-xs font-light text-[var(--charcoal)]/50">
          Personal best: {streak.longestStreak} days
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// CONTINUE CARD
// ─────────────────────────────────────────────

function getRelativeTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d === 1) return 'Yesterday';
  return `${d} days ago`;
}

export function ContinueCard() {
  const [activity, setActivity] = useState<LastActivity | null>(null);

  useEffect(() => {
    setActivity(load<LastActivity | null>(STORAGE_KEYS.lastTool, null));
  }, []);

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card-dark h-full flex flex-col justify-between"
    >
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--cream)]/60">
          Continue where you left off
        </p>

        {activity ? (
          <>
            <h3 className="max-w-md font-display text-[2rem] leading-[1.05] text-white">
              Pick up {activity.label.toLowerCase()} again.
            </h3>
            <p className="mt-4 max-w-md text-sm font-light leading-7 text-[var(--cream)]/70">
              The last place you practised is still the easiest way back into a short session.
            </p>

            <div className="mt-8 border-l border-[var(--cream)]/20 pl-5">
              <p className="font-display text-[1.25rem] leading-[1.08] text-white">{activity.label}</p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--cream)]/50">{getRelativeTime(activity.timestamp)}</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="max-w-md font-display text-[2rem] leading-[1.05] text-white">
              Start one short piece of practice.
            </h3>
            <p className="mt-4 max-w-md text-sm font-light leading-7 text-[var(--cream)]/70">
              Open a station or a question set once, and this spot becomes your fastest route back in next time.
            </p>
          </>
        )}
      </div>

      <Link href={activity?.path ?? '/hub'}
        className="mt-10 inline-flex w-fit items-center bg-white px-5 py-3 text-sm text-[var(--espresso)] font-medium transition-transform hover:scale-[1.02]"
      >
        {activity ? 'Continue session' : 'Browse the hub'}
        <span className="ml-2 font-serif opacity-60">→</span>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// TODAY'S PLAN CARD
// ─────────────────────────────────────────────

const PLAN_ITEMS: { key: keyof DailyPlan; label: string; duration: string }[] = [
  { key: 'osceStation',   label: '1 OSCE station',     duration: '3 mins' },
  { key: 'quizQuestions', label: '10 quiz questions',  duration: '5 mins' },
  { key: 'weakTopics',    label: 'Review weak topics', duration: '2 mins' },
];

const DEFAULT_PLAN: DailyPlan = { osceStation: false, quizQuestions: false, weakTopics: false };

export function TodaysPlanCard() {
  const [plan, setPlan] = useState<DailyPlan>(DEFAULT_PLAN);
  const [mounted, setMounted] = useState(false);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);

  useEffect(() => {
    setMounted(true);
    setWeakTopics(load<WeakTopic[]>(STORAGE_KEYS.weakTopics, []));

    const stored = load<{ date: string; plan: DailyPlan }>(STORAGE_KEYS.plan, { date: '', plan: DEFAULT_PLAN });
    if (stored.date !== new Date().toDateString()) {
      save(STORAGE_KEYS.plan, { date: new Date().toDateString(), plan: DEFAULT_PLAN });
      setPlan(DEFAULT_PLAN);
    } else {
      setPlan(stored.plan);
    }
  }, []);

  const toggle = useCallback((key: keyof DailyPlan) => {
    setPlan(prev => {
      const next = { ...prev, [key]: !prev[key] };
      save(STORAGE_KEYS.plan, { date: new Date().toDateString(), plan: next });

      if (key === 'osceStation' && !prev.osceStation)
        save(STORAGE_KEYS.lastTool, { toolName: 'osce', path: '/osce', label: 'OSCE Tool', timestamp: Date.now() });
      if (key === 'quizQuestions' && !prev.quizQuestions)
        save(STORAGE_KEYS.lastTool, { toolName: 'quiz', path: '/quiz', label: 'Core Quiz', timestamp: Date.now() });

      // All done → increment streak
      if (next.osceStation && next.quizQuestions && next.weakTopics) {
        recordStudySession();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4A574', '#8BBCAA', '#C89BB0', '#7BA7CC'],
          disableForReducedMotion: true,
        });
      }

      return next;
    });
  }, []);

  if (!mounted) return null;

  const completedCount = Object.values(plan).filter(Boolean).length;
  const allDone = completedCount === 3;
  const lastActivity = load<LastActivity | null>(STORAGE_KEYS.lastTool, null);

  const nextAction = !plan.osceStation
    ? { href: '/osce', label: 'Run one station' }
    : !plan.quizQuestions
    ? { href: '/quiz', label: 'Start a short quiz' }
    : !plan.weakTopics
    ? { href: '/dashboard#weak-areas', label: 'Review weak areas' }
    : lastActivity
    ? { href: lastActivity.path, label: `Open ${lastActivity.label}` }
    : { href: '/hub', label: 'Open the hub' };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card bg-[#FAF8F6] border border-[var(--linen-deep)] h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--charcoal)]/60">Today&apos;s plan</p>
        <AnimatePresence mode="wait">
          <motion.span key={completedCount}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className={`text-xs px-3 py-1 font-light ${allDone ? 'bg-[var(--teal-50)] text-[var(--teal-600)]' : 'bg-[var(--linen-light)] text-[var(--charcoal)]/60'}`}
          >
            {allDone ? 'Complete' : `${completedCount}/3 checked`}
          </motion.span>
        </AnimatePresence>
      </div>

      {allDone ? (
        <div className="flex flex-1 flex-col justify-center py-6">
          <p className="mb-2 font-display text-lg text-[var(--espresso)]">That&apos;s enough for today.</p>
          <p className="text-sm font-light leading-7 text-[var(--charcoal)]">
            Leave it here and come back tomorrow.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2 flex-1 mb-5">
            {[
              { key: 'osceStation' as const, label: weakTopics.length > 0 ? `1 OSCE station (Focus: ${weakTopics[0].topic})` : '1 OSCE station', duration: '3 mins' },
              { key: 'quizQuestions' as const, label: weakTopics.length > 1 ? `10 quiz questions (${weakTopics[1].topic} bias)` : '10 quiz questions', duration: '5 mins' },
              { key: 'weakTopics' as const, label: 'Review weak topics', duration: '2 mins' }
            ].map(({ key, label, duration }, i) => (
              <motion.button key={key} onClick={() => toggle(key)}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }} whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 text-left transition-all ${
                  plan[key]
                    ? 'bg-[var(--teal-50)]/40 border border-[var(--teal-600)]/20'
                    : 'bg-[var(--linen-light)] border border-transparent hover:border-[var(--linen-deep)]'
                }`}
              >
                <motion.div animate={plan[key] ? { scale: [0, 1.3, 1] } : {}} transition={{ type: 'spring', stiffness: 300 }}>
                  {plan[key]
                    ? <CheckCircle2 className="w-5 h-5 text-[var(--teal-600)] shrink-0" />
                    : <Circle className="w-5 h-5 text-[var(--linen-medium)] shrink-0" />
                  }
                </motion.div>
                <span className={`flex-1 text-sm ${plan[key] ? 'line-through text-[var(--charcoal)]/40' : 'text-[var(--charcoal)]'}`}>
                  {label}
                </span>
                <span className="text-xs text-[var(--charcoal)]/50 font-light shrink-0">{duration}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {completedCount === 2 && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs bg-[var(--amber-bg)] text-[var(--amber-text)] px-3 py-2 mb-4"
              >
                One more and today counts toward your streak.
              </motion.p>
            )}
          </AnimatePresence>

          <Link href={nextAction.href}
            className="flex w-full items-center justify-center bg-[var(--espresso)] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#3a2010]"
          >
            {nextAction.label}
          </Link>
        </>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FOCUS AREAS CARD — fed by recordQuizResults()
// ─────────────────────────────────────────────

export function FocusAreasCard() {
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const stored = load<WeakTopic[]>(STORAGE_KEYS.weakTopics, []);
    setWeakTopics(stored.slice(0, 4));
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="card bg-[var(--amber-bg)] border border-[rgba(200,112,10,0.1)]">
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-14" />)}
        </div>
      </div>
    );
  }

  if (weakTopics.length === 0) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible"
        className="card bg-[var(--amber-bg)] border border-[rgba(200,112,10,0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffeedd] opacity-40 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="flex flex-col items-center text-center py-8 relative z-10">
          <p className="font-display text-2xl text-[var(--amber-text)] mb-2">Uncover your blindspots</p>
          <p className="text-sm text-[var(--amber-text)]/80 font-light max-w-[240px] leading-7">
            Take the baseline diagnostic quiz to start tracking exactly where you need to focus.
          </p>
          <Link href="/quiz" className="mt-6 inline-flex bg-white shadow-sm border border-[var(--amber-text)]/20 text-[var(--amber-text)] px-4 py-2 text-sm font-medium transition-transform hover:scale-105">
            Take Baseline Diagnostic →
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} variants={cardVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
      className="card bg-[#FEFAF2] border border-[rgba(200,112,10,0.12)]"
    >
      <div className="space-y-3">
        {weakTopics.map((topic, i) => {
          const isLow = topic.score < 50;
          return (
            <motion.div key={topic.topic}
              initial={{ opacity: 0, x: -16 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-[var(--linen-light)] border border-[var(--linen-deep)]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--espresso)] truncate">{topic.topic}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-[var(--linen-deep)] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isLow ? 'bg-[var(--coral-600)]' : 'bg-[var(--amber-600)]'}`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${topic.score}%` } : {}}
                      transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-[var(--charcoal)]/60 font-light shrink-0">{topic.score}%</span>
                </div>
              </div>
              <Link href={`/quiz?topic=${encodeURIComponent(topic.topic)}`}
                className="text-xs text-[var(--espresso)] border border-[var(--linen-deep)] px-3 py-1.5 hover:border-[var(--linen-medium)] transition-colors shrink-0 font-light"
              >
                Practise
              </Link>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-[var(--charcoal)]/50 font-light mt-4">
        Topics graduate automatically once you score 80%+ twice in a row.
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// COMMUNITY / PERSONAL STATS CARD
// ─────────────────────────────────────────────

interface CommunityData {
  totalUsers: number;
  avgQuestionsPerUser: number;
  error?: string;
}

export function CommunityStatsCard() {
  const [stats, setStats] = useState<SessionStats>(defaultStats());
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setStats(load<SessionStats>(STORAGE_KEYS.stats, defaultStats()));
    fetch('/api/community-stats')
      .then(r => r.json())
      .then(d => { if (!d.error) setCommunity(d); })
      .catch(() => {});
  }, []);

  const thisWeekTotal = stats.weekSessions.reduce((a, b) => a + b, 0);
  const maxBar = Math.max(...stats.weekSessions, 1);
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = todayWeekIndex();

  const hasCommunity = community && community.totalUsers > 0;
  const avgSessions = community?.avgQuestionsPerUser ?? 0;
  const userSessions = stats.totalSessions;
  const isAboveAvg = userSessions > avgSessions;
  const pctDiff = avgSessions > 0 ? Math.round(Math.abs(((userSessions - avgSessions) / avgSessions) * 100)) : 0;

  return (
    <motion.div ref={ref} variants={cardVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
      className="card h-full min-h-[290px] border border-[var(--linen-deep)] bg-[#FBFAF8]"
    >
      <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">
        This week
      </p>

      <p className="mb-4 max-w-lg text-sm font-light leading-7 text-[var(--charcoal)]">
        {thisWeekTotal > 0
          ? 'A quick snapshot of how revision has looked this week.'
          : 'Once you start using the tools, this turns into a simple read on your study rhythm.'}
      </p>

      {hasCommunity && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-4 border border-[var(--linen-deep)] bg-[var(--linen-light)] p-4"
        >
          <p className="font-display text-lg text-[var(--espresso)]">
            {isAboveAvg ? 'You are ahead of your usual pace.' : userSessions === avgSessions ? 'You are roughly on your usual pace.' : 'You are a little behind your usual pace.'}
          </p>
          <p className="mt-1 text-xs font-light text-[var(--charcoal)]/65">
            {isAboveAvg
              ? `${pctDiff}% more practice than average`
              : userSessions === avgSessions
              ? 'You match the community average'
              : `${avgSessions - userSessions} more sessions to beat the average`}
          </p>
        </motion.div>
      )}

      {/* Sparkline */}
      <div className="border border-[rgba(26,24,21,0.08)] bg-white/80 px-4 py-4">
        <div className="flex items-end gap-1.5 h-12 mb-2">
        {stats.weekSessions.map((val, i) => {
          const isToday = i === todayIdx;
          const heightPct = Math.max((val / maxBar) * 100, val > 0 ? 15 : 5);
          return (
            <div key={i} className="flex-1 h-full flex items-end">
              <motion.div
                className={`w-full rounded-sm ${isToday ? 'bg-[var(--espresso)]' : val > 0 ? 'bg-[var(--linen-deep)]' : 'bg-[var(--linen-light)]'}`}
                style={{ minHeight: '3px' }}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${heightPct}%` } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              />
            </div>
          );
        })}
        </div>
        <div className="flex gap-1.5">
          {DAY_LABELS.map((l, i) => (
            <div key={i} className="flex-1 text-center">
              <span className={`text-[9px] ${i === todayIdx ? 'text-[var(--espresso)]' : 'text-[var(--charcoal)]/40'}`}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-4 border-t border-[var(--linen-deep)] pt-4">
        {[
          { value: stats.totalSessions,     label: 'sessions'  },
          { value: stats.totalQuestions,    label: 'questions' },
          { value: stats.totalOsceStations, label: 'stations'  },
        ].map(({ value, label }) => (
          <div key={label}>
            <p className="font-display text-2xl text-[var(--espresso)]">{value}</p>
            <p className="text-xs text-[var(--charcoal)]/60 font-light">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// QUICK ACHIEVEMENT
// ─────────────────────────────────────────────

const ACHIEVEMENTS = [
  { threshold: 30, title: 'Month-long rhythm', desc: 'Thirty days of showing up is a real habit.' },
  { threshold: 14, title: 'Two-week rhythm', desc: 'Two weeks in a row is usually where things start to stick.' },
  { threshold: 7,  title: 'One full week', desc: 'A week of steady revision is enough to feel the difference.' },
  { threshold: 3,  title: 'Three-day start', desc: 'A few days in a row is often how momentum begins.' },
  { threshold: 1,  title: 'First session done', desc: 'One small session is still a proper start.' },
];

export function QuickAchievement() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const streak = load<StudyStreak>(STORAGE_KEYS.streak, defaultStreak());
    setCurrentStreak(streak.currentStreak);
  }, []);

  if (!mounted) return null;

  const achieved = ACHIEVEMENTS.find(a => currentStreak >= a.threshold);
  const next = [...ACHIEVEMENTS].reverse().find(a => currentStreak < a.threshold);
  if (!achieved && !next) return null;

  const display = achieved ?? next!;
  const daysAway = next ? next.threshold - currentStreak : 0;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className={`card border ${achieved ? 'bg-[#F9F8FF] border-[rgba(83,74,183,0.2)]' : 'bg-[#FAFAF8] border-[var(--linen-deep)]'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`text-[11px] uppercase tracking-[0.14em] mb-0.5 ${achieved ? 'text-[var(--purple-600)]' : 'text-[var(--charcoal)]'}`}>
            {achieved ? 'Small win' : 'Next marker'}
          </p>
          <p className="text-sm font-display text-[var(--espresso)]">{display.title}</p>
          <p className="text-xs text-[var(--charcoal)] font-light mt-0.5">{display.desc}</p>
        </div>
        {!achieved && next && (
          <p className="text-xs text-[var(--charcoal)]/50 font-light shrink-0">
            {daysAway} {daysAway === 1 ? 'day' : 'days'} away
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STUDY TIP CARD
// ─────────────────────────────────────────────

export function StudyTipCard() {
  const [tip, setTip] = useState('');

  useEffect(() => { setTip(getDailyTip()); }, []);

  if (!tip) return null;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card border border-[rgba(217,108,85,0.14)] bg-[rgba(255,247,237,0.9)]"
    >
      <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[var(--coral-600)]">Study tip</p>
      <p className="text-sm font-light leading-7 text-[var(--charcoal)]">{tip}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// WEEKLY PROGRESS (used in DashboardClient hero)
// ─────────────────────────────────────────────

export function WeeklyProgress() {
  const [count, setCount] = useState<number | null>(null);
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const stats = load<SessionStats>(STORAGE_KEYS.stats, defaultStats());
    const thisWeek = stats.weekSessions.reduce((a, b) => a + b, 0);
    setCount(thisWeek);
    if (thisWeek > 0) {
      let current = 0;
      const inc = thisWeek / 20;
      const t = setInterval(() => {
        current += inc;
        if (current >= thisWeek) { setAnimated(thisWeek); clearInterval(t); }
        else setAnimated(Math.floor(current));
      }, 50);
      return () => clearInterval(t);
    }
  }, []);

  if (count === null) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
      {count > 0 ? (
        <p className="text-sm font-light text-[var(--charcoal)]/70">
          You&apos;ve practised{' '}
          <motion.span className="inline-flex items-center font-display text-[var(--espresso)] bg-[var(--linen-light)] px-2 py-0.5"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {animated} {count !== 1 ? 'times' : 'time'}
          </motion.span>{' '}
          this week.
        </p>
      ) : (
        <p className="text-sm font-light text-[var(--charcoal)]/70">
          No sessions logged yet this week.
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STREAK CALENDAR (alias — kept for any existing imports)
// ─────────────────────────────────────────────

export { StudyStreakCard as StreakCalendar };
