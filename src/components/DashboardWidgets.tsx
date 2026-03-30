'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import {
  Flame,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  Sparkles,
  BarChart2,
  Trophy,
  Clock,
  Play,
  Users,
  Award,
  Target,
  Lightbulb,
} from 'lucide-react';

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
export function recordSessionStart(_tool: string) { recordStudySession(); }
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
      className="card bg-white border border-[var(--linen-deep)] h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className={`w-5 h-5 ${streak.currentStreak > 0 ? 'text-[var(--amber)]' : 'text-[var(--linen-medium)]'}`} />
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">Study Streak</p>
          </div>
          <p className="text-xs text-[var(--charcoal)]/60 font-light">Keep the momentum going!</p>
        </div>
        <div className="text-right">
          <motion.p className="font-display text-4xl text-[var(--espresso)]"
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

      <div className="flex gap-2 mb-4">
        {DAY_LABELS.map((label, i) => {
          const isToday = i === todayIdx;
          const isActive = weekActivity[i];
          return (
            <motion.div key={i} className="flex flex-col items-center gap-1.5 flex-1"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className={`w-full h-1.5 rounded-full transition-colors ${
                isActive ? 'bg-[var(--espresso)]'
                : isToday ? 'bg-[var(--linen-deep)] ring-1 ring-[var(--espresso)]/30'
                : 'bg-[var(--linen-deep)]'
              }`} />
              <span className={`text-[10px] ${isToday ? 'text-[var(--espresso)] font-medium' : 'text-[var(--charcoal)]/50'}`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className={`text-center px-3 py-2.5 text-xs font-light ${
        studiedToday ? 'bg-[var(--teal-50)] text-[var(--teal-600)]' : 'bg-[var(--linen-light)] text-[var(--charcoal)]/70'
      }`} style={{ borderRadius: '8px' }}>
        {studiedToday
          ? "✓ You've studied today — keep it up!"
          : streak.currentStreak > 0
          ? `Study today to keep your ${streak.currentStreak}-day streak going!`
          : 'Start a study session to begin your streak 🔥'}
      </div>

      {streak.longestStreak > 1 && (
        <p className="text-center text-xs text-[var(--charcoal)]/50 font-light mt-3">
          <Trophy className="w-3 h-3 inline mr-1 text-[var(--amber)]" />
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

  const Icon = activity?.toolName === 'osce' ? ClipboardCheck : BookOpen;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card bg-[var(--linen-light)] border border-[var(--linen-deep)] h-full flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[var(--espresso)]" />
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">
          Continue where you left off
        </p>
      </div>

      {activity ? (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white border border-[var(--linen-deep)] flex items-center justify-center" style={{ borderRadius: '10px' }}>
            <Icon className="w-6 h-6 text-[var(--espresso)]" />
          </div>
          <div>
            <p className="text-sm font-display text-[var(--espresso)]">{activity.label}</p>
            <p className="text-xs text-[var(--charcoal)]/60 font-light">{getRelativeTime(activity.timestamp)}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--charcoal)] font-light mb-4">
          Start a session and pick up right where you left off.
        </p>
      )}

      <Link href={activity?.path ?? '/osce'}
        className="bg-[var(--espresso)] text-white px-4 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-[#3a2010] w-fit"
        style={{ borderRadius: '8px' }}
      >
        {activity ? 'Continue' : 'Start now'} <ArrowRight className="w-4 h-4" />
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

  useEffect(() => {
    setMounted(true);
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
      if (next.osceStation && next.quizQuestions && next.weakTopics) recordStudySession();

      return next;
    });
  }, []);

  if (!mounted) return null;

  const completedCount = Object.values(plan).filter(Boolean).length;
  const allDone = completedCount === 3;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible"
      className="card bg-white border border-[var(--linen-deep)] h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${allDone ? 'text-[var(--teal-600)]' : 'text-[var(--espresso)]'}`} />
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">Today's Plan</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={completedCount}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className={`text-xs px-3 py-1 font-light ${allDone ? 'bg-[var(--teal-50)] text-[var(--teal-600)]' : 'bg-[var(--linen-light)] text-[var(--charcoal)]/60'}`}
            style={{ borderRadius: '999px' }}
          >
            {allDone ? '🎉 All done!' : `${completedCount}/3 done`}
          </motion.span>
        </AnimatePresence>
      </div>

      {allDone ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }} className="text-5xl mb-3"
          >
            🎉
          </motion.div>
          <p className="font-display text-[var(--espresso)] text-lg mb-1">All done today!</p>
          <p className="text-sm text-[var(--charcoal)] font-light">
            Streak updated. Come back tomorrow to keep it going.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2 flex-1 mb-5">
            {PLAN_ITEMS.map(({ key, label, duration }, i) => (
              <motion.button key={key} onClick={() => toggle(key)}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }} whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 text-left transition-all ${
                  plan[key]
                    ? 'bg-[var(--teal-50)]/40 border border-[var(--teal-600)]/20'
                    : 'bg-[var(--linen-light)] border border-transparent hover:border-[var(--linen-deep)]'
                }`}
                style={{ borderRadius: '8px' }}
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
                style={{ borderRadius: '6px' }}
              >
                Almost there — one more and your streak counts! 🔥
              </motion.p>
            )}
          </AnimatePresence>

          <Link href="/osce"
            className="bg-[var(--espresso)] text-white px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2 hover:bg-[#3a2010] w-full"
            style={{ borderRadius: '8px' }}
          >
            <Play className="w-4 h-4" /> Start Session
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
      <div className="card bg-white border border-[var(--linen-deep)]">
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (weakTopics.length === 0) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible"
        className="card bg-white border border-[var(--linen-deep)]"
      >
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-12 h-12 bg-[var(--linen-light)] flex items-center justify-center mb-4" style={{ borderRadius: '10px' }}>
            <Sparkles className="w-6 h-6 text-[var(--espresso)]" />
          </div>
          <p className="font-display text-[var(--espresso)] mb-1">No weak areas yet</p>
          <p className="text-sm text-[var(--charcoal)] font-light max-w-xs">
            Complete some quiz questions and your weak topics will appear here automatically.
          </p>
          <Link href="/quiz" className="mt-4 text-sm text-[var(--espresso)] underline underline-offset-2 hover:no-underline font-light">
            Start the Core Quiz →
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} variants={cardVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
      className="card bg-white border border-[var(--linen-deep)]"
    >
      <div className="space-y-3">
        {weakTopics.map((topic, i) => {
          const isLow = topic.score < 50;
          return (
            <motion.div key={topic.topic}
              initial={{ opacity: 0, x: -16 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-[var(--linen-light)] border border-[var(--linen-deep)]"
              style={{ borderRadius: '8px' }}
            >
              <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${isLow ? 'bg-[var(--coral-50)]' : 'bg-[var(--amber-50)]'}`} style={{ borderRadius: '7px' }}>
                <AlertTriangle className={`w-4 h-4 ${isLow ? 'text-[var(--coral-600)]' : 'text-[var(--amber-600)]'}`} />
              </div>
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
                style={{ borderRadius: '6px' }}
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
  const [stats, setStats] = useState<SessionStats | null>(null);
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

  if (!stats) return null;

  const thisWeekTotal = stats.weekSessions.reduce((a, b) => a + b, 0);
  const diff = thisWeekTotal - stats.lastWeekTotal;
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
      className="card bg-white border border-[var(--linen-deep)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {hasCommunity
            ? <Users className="w-4 h-4 text-[var(--espresso)]" />
            : <BarChart2 className="w-4 h-4 text-[var(--espresso)]" />
          }
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">
            {hasCommunity ? 'You vs Others' : 'Your Progress'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {diff > 0 ? <TrendingUp className="w-3.5 h-3.5 text-[var(--teal-600)]" />
            : diff < 0 ? <TrendingDown className="w-3.5 h-3.5 text-[var(--coral-600)]" />
            : <Minus className="w-3.5 h-3.5 text-[var(--charcoal)]/40" />
          }
          <span className="text-xs text-[var(--charcoal)]/60 font-light">
            {diff > 0 ? `+${diff} vs last week` : diff < 0 ? `${diff} vs last week` : 'Same as last week'}
          </span>
        </div>
      </div>

      {hasCommunity && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-4 mb-4 text-center ${
            isAboveAvg ? 'bg-[var(--teal-50)]' : userSessions === avgSessions ? 'bg-[var(--blue-50)]' : 'bg-[var(--amber-50)]'
          }`}
          style={{ borderRadius: '10px' }}
        >
          <p className={`font-display text-lg mb-0.5 ${isAboveAvg ? 'text-[var(--teal-600)]' : userSessions === avgSessions ? 'text-[var(--blue-600)]' : 'text-[var(--amber-600)]'}`}>
            {isAboveAvg ? "You're ahead!" : userSessions === avgSessions ? 'Right on track!' : 'Keep going!'}
          </p>
          <p className={`text-xs font-light ${isAboveAvg ? 'text-[var(--teal-600)]' : userSessions === avgSessions ? 'text-[var(--blue-600)]' : 'text-[var(--amber-600)]'}`}>
            {isAboveAvg
              ? `${pctDiff}% more practice than average`
              : userSessions === avgSessions
              ? 'You match the community average'
              : `${avgSessions - userSessions} more sessions to beat the average`}
          </p>
        </motion.div>
      )}

      {/* Sparkline */}
      <div className="flex items-end gap-1.5 h-10 mb-2">
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
      <div className="flex gap-1.5 mb-4">
        {DAY_LABELS.map((l, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={`text-[9px] ${i === todayIdx ? 'text-[var(--espresso)]' : 'text-[var(--charcoal)]/40'}`}>{l}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t border-[var(--linen-deep)]">
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
  { threshold: 30, title: 'Monthly champion', emoji: '👑', desc: '30+ day streak — extraordinary.' },
  { threshold: 14, title: 'Two week streak',  emoji: '🏆', desc: 'Two weeks of consistent revision!' },
  { threshold: 7,  title: 'One week strong',  emoji: '⭐', desc: "A full week — you're building real momentum." },
  { threshold: 3,  title: '3-day streak',     emoji: '🔥', desc: 'Three days in a row — habits forming!' },
  { threshold: 1,  title: 'First session',    emoji: '🌱', desc: "You showed up. That's everything." },
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
      className="card bg-[var(--linen-light)] border border-[var(--linen-deep)]"
    >
      <div className="flex items-center gap-3">
        <motion.div className="text-3xl"
          animate={achieved ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {display.emoji}
        </motion.div>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)] mb-0.5">
            <Award className="w-3 h-3 inline mr-1" />
            {achieved ? 'Achievement unlocked' : 'Next milestone'}
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
      className="card bg-white border border-[var(--linen-deep)]"
    >
      <div className="flex items-start gap-4">
        <motion.div className="w-10 h-10 bg-[var(--amber-bg)] flex items-center justify-center shrink-0"
          style={{ borderRadius: '8px' }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        >
          <Lightbulb className="w-5 h-5 text-[var(--amber-text)]" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]">Study Tip</p>
            <span className="text-[9px] uppercase tracking-[0.12em] bg-[var(--amber-bg)] text-[var(--amber-text)] px-2 py-0.5" style={{ borderRadius: '3px' }}>
              Daily wisdom
            </span>
          </div>
          <p className="text-sm text-[var(--charcoal)] font-light leading-relaxed">{tip}</p>
        </div>
      </div>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-2">
      {count > 0 ? (
        <p className="text-sm text-[var(--charcoal)]/70 font-light">
          You've practised{' '}
          <motion.span className="inline-flex items-center gap-1 font-display text-[var(--espresso)] bg-[var(--linen-light)] px-2 py-0.5"
            style={{ borderRadius: '999px' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Flame className="w-3.5 h-3.5 text-[var(--amber)]" />
            {animated} {count !== 1 ? 'times' : 'time'}
          </motion.span>{' '}
          this week 🎉
        </p>
      ) : (
        <p className="text-sm text-[var(--charcoal)]/70 font-light">
          Ready when you are — try a quick 5-minute session.
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STREAK CALENDAR (alias — kept for any existing imports)
// ─────────────────────────────────────────────

export { StudyStreakCard as StreakCalendar };
