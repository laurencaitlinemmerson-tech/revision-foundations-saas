'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Clock,
  Lightbulb,
  Flame,
  Timer,
  TrendingUp,
  CheckCircle2,
  Circle,
  Target,
  Play,
  Users,
  Trophy,
  Zap,
  Star,
  ArrowUp,
  Sparkles,
  Calendar,
  Award,
  Heart,
  Rocket,
} from 'lucide-react';

// ============ localStorage Helpers ============

interface LastActivity {
  toolName: 'osce' | 'quiz';
  path: string;
  label: string;
  timestamp: number;
}

interface SessionEvent {
  timestamp: number;
  tool: string;
}

const STORAGE_KEYS = {
  lastActivity: 'rf_last_activity',
  sessionEvents: 'rf_session_events',
};

export function saveLastActivity(activity: Omit<LastActivity, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  const data: LastActivity = { ...activity, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEYS.lastActivity, JSON.stringify(data));
}

export function getLastActivity(): LastActivity | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.lastActivity);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function recordSessionStart(tool: string) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sessionEvents);
    const events: SessionEvent[] = stored ? JSON.parse(stored) : [];
    events.push({ timestamp: Date.now(), tool });
    // Keep only last 30 days of events
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = events.filter((e) => e.timestamp > thirtyDaysAgo);
    localStorage.setItem(STORAGE_KEYS.sessionEvents, JSON.stringify(filtered));
  } catch {
    // Ignore errors
  }
}

function getWeeklySessionCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sessionEvents);
    if (!stored) return 0;
    const events: SessionEvent[] = JSON.parse(stored);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return events.filter((e) => e.timestamp > oneWeekAgo).length;
  } catch {
    return 0;
  }
}

// ============ Study Tips ============

const STUDY_TIPS = [
  "Little and often beats cramming! Try 15-20 minutes of practice each day rather than hours before an exam.",
  "Test yourself before you feel ready — retrieval practice strengthens memory more than re-reading.",
  "Explain concepts out loud as if teaching someone else. If you stumble, that's where to focus.",
  "Take short breaks every 25-30 minutes. Your brain consolidates learning during rest.",
  "Review mistakes carefully — they're your best teachers. Understanding why you got something wrong is gold.",
  "Mix up topics in a single session (interleaving) rather than drilling one thing repeatedly.",
  "Sleep is revision! Your brain processes and stores information while you rest.",
  "Write down one thing you learned today before bed. It takes 30 seconds and boosts retention.",
];

function getDailyTip(): string {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return STUDY_TIPS[seed % STUDY_TIPS.length];
}

// ============ Animation Variants ============

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// ============ Components ============

export function WeeklyProgress() {
  const [count, setCount] = useState<number | null>(null);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const actualCount = getWeeklySessionCount();
    setCount(actualCount);
    
    // Animate count up
    if (actualCount > 0) {
      let current = 0;
      const increment = actualCount / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= actualCount) {
          setAnimatedCount(actualCount);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-2"
    >
      {count > 0 ? (
        <p className="text-sm text-[var(--plum-dark)]/70">
          You've practised <motion.span 
            className="inline-flex items-center gap-1 font-semibold text-[var(--purple)] bg-[var(--lilac-soft)] px-2 py-0.5 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            {animatedCount} time{count !== 1 ? 's' : ''}
          </motion.span> this week 🎉
        </p>
      ) : (
        <p className="text-sm text-[var(--plum-dark)]/70">
          Ready when you are — try a quick 5-minute session.
        </p>
      )}
    </motion.div>
  );
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function ContinueCard() {
  const [activity, setActivity] = useState<LastActivity | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActivity(getLastActivity());
  }, []);

  if (!mounted) return null;

  const toolInfo = activity?.toolName === 'osce'
    ? { icon: ClipboardCheck, color: 'text-[var(--purple)]', bg: 'bg-[var(--lilac-soft)]' }
    : { icon: BookOpen, color: 'text-[var(--purple)]', bg: 'bg-[var(--lilac-soft)]' };

  const Icon = toolInfo.icon;

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01, y: -2 }}
      className="card mb-6 border border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-lg transition-all duration-300 overflow-hidden relative"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--lavender)]/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Clock className="w-4 h-4 text-[var(--purple)]" />
        </motion.div>
        <h3 className="text-sm font-semibold text-[var(--plum)]">Continue where you left off</h3>
      </div>

      {activity ? (
        <Link
          href={activity.path}
          className="flex items-center justify-between group relative z-10"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-12 h-12 rounded-xl ${toolInfo.bg} flex items-center justify-center`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className={`w-6 h-6 ${toolInfo.color}`} />
            </motion.div>
            <div>
              <p className="font-medium text-[var(--plum)]">{activity.label}</p>
              <p className="text-xs text-[var(--plum-dark)]/60">
                {activity.toolName === 'osce' ? 'OSCE Tool' : 'Core Quiz'} • {getRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
          <motion.div 
            className="bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05, gap: '12px' }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      ) : (
        <div className="flex items-center justify-between relative z-10">
          <p className="text-sm text-[var(--plum-dark)]/70">
            Start a session and pick up right where you left off.
          </p>
          <Link
            href="/osce"
            className="text-sm text-[var(--purple)] font-medium hover:underline flex items-center gap-1"
          >
            Start now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export function StudyTipCard() {
  const [tip, setTip] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setTip(getDailyTip());
  }, []);

  if (!tip) return null;

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      className="card bg-gradient-to-br from-amber-50/80 via-white to-[var(--lilac-soft)]/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 shadow-sm"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        >
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-[var(--plum)]">Study Tip</h3>
            <motion.span 
              className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Daily wisdom
            </motion.span>
          </div>
          <p className="text-sm text-[var(--plum-dark)]/80 leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Wave animation component for greeting
export function WavingHand() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={`text-4xl inline-block ${animate ? 'animate-wave' : ''}`}
      style={{
        transformOrigin: '70% 70%',
      }}
    >
      👋
    </span>
  );
}

// ============ Progress Stats Row ============

export function ProgressStatsRow() {
  const [weeklyCount, setWeeklyCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
    setWeeklyCount(getWeeklySessionCount());
  }, []);

  if (!mounted) return null;

  const stats = [
    {
      icon: Flame,
      label: 'Current streak',
      value: weeklyCount > 0 ? `${Math.min(weeklyCount, 7)} days` : 'Start today!',
      color: 'text-orange-500',
      bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
      iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    },
    {
      icon: Timer,
      label: 'This week',
      value: weeklyCount > 0 ? `${weeklyCount} sessions` : 'No sessions yet',
      color: 'text-[var(--purple)]',
      bg: 'bg-gradient-to-br from-[var(--lilac-soft)] to-[var(--lavender)]/30',
      iconBg: 'bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)]',
    },
    {
      icon: TrendingUp,
      label: 'Goal progress',
      value: weeklyCount >= 5 ? 'Smashed it! 🎉' : `${5 - weeklyCount} more to goal`,
      color: 'text-emerald-500',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      progress: Math.min((weeklyCount / 5) * 100, 100),
    },
  ];

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          whileHover={{ scale: 1.03, y: -4 }}
          className={`card ${stat.bg} border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
        >
          {/* Progress bar for goal */}
          {stat.progress !== undefined && (
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${stat.progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          )}
          
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0 shadow-md`}
              whileHover={{ rotate: 10 }}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-[var(--plum-dark)]/60 uppercase tracking-wide font-medium">{stat.label}</p>
              <p className="font-bold text-lg text-[var(--plum)]">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============ Today's Plan Card ============

interface ChecklistItem {
  id: string;
  label: string;
  duration: string;
  href: string;
}

const DAILY_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: '1 OSCE station', duration: '3 mins', href: '/osce' },
  { id: '2', label: '10 quiz questions', duration: '5 mins', href: '/quiz' },
  { id: '3', label: 'Review weak topics', duration: '2 mins', href: '/quiz' },
];

export function TodaysPlanCard() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load checked state from localStorage
    try {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('rf_daily_plan');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setChecked(new Set(data.checked));
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleItem = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Save to localStorage
      try {
        localStorage.setItem('rf_daily_plan', JSON.stringify({
          date: new Date().toDateString(),
          checked: Array.from(next),
        }));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  if (!mounted) return null;

  const completedCount = checked.size;
  const totalCount = DAILY_CHECKLIST.length;
  const allComplete = completedCount === totalCount;

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="card hover:shadow-lg transition-all duration-300 overflow-hidden relative"
    >
      {/* Celebration overlay when all complete */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-[var(--mint)]/80 to-teal-50/90 z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={allComplete ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Target className={`w-5 h-5 ${allComplete ? 'text-emerald-500' : 'text-[var(--purple)]'}`} />
            </motion.div>
            <h3 className="font-semibold text-[var(--plum)]">Today's Plan</h3>
          </div>
          <motion.span 
            className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              allComplete 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70'
            }`}
            animate={allComplete ? { scale: [1, 1.1, 1] } : {}}
          >
            {allComplete ? '🎉 All done!' : `${completedCount}/${totalCount} done`}
          </motion.span>
        </div>

        <div className="space-y-2 mb-4">
          {DAILY_CHECKLIST.map((item, index) => {
            const isChecked = checked.has(item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                  isChecked
                    ? 'bg-[var(--mint)]/30 border border-[var(--mint)]'
                    : 'bg-[var(--lilac-soft)]/50 hover:bg-[var(--lilac-soft)] border border-transparent'
                }`}
              >
                <motion.div
                  animate={isChecked ? { scale: [0, 1.2, 1] } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[var(--plum-dark)]/30 flex-shrink-0" />
                  )}
                </motion.div>
                <span className={`flex-1 text-sm ${isChecked ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum)]'}`}>
                  {item.label}
                </span>
                <span className="text-xs text-[var(--plum-dark)]/50">{item.duration}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/osce"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[var(--purple)] to-[var(--plum)] text-white py-3 rounded-full font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4" />
            Start Session
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ Focus Areas Card ============

interface FocusArea {
  topic: string;
  status: 'needs-work' | 'improving' | 'strong';
  label: string;
}

// TODO: Wire to real analytics/quiz performance data
const FOCUS_AREAS: FocusArea[] = [
  { topic: 'Infection control', status: 'needs-work', label: 'Needs work' },
  { topic: 'Med calculations', status: 'improving', label: 'Improving' },
  { topic: 'SBAR handover', status: 'strong', label: 'Strong' },
];

const STATUS_STYLES = {
  'needs-work': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '🎯' },
  'improving': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '📈' },
  'strong': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '💪' },
};

export function FocusAreasCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="card hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--purple)]" />
        <h3 className="font-semibold text-[var(--plum)]">Focus areas this week</h3>
      </div>

      <div className="space-y-3">
        {FOCUS_AREAS.map((area, i) => {
          const style = STATUS_STYLES[area.status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`flex items-center justify-between p-3 rounded-xl ${style.bg}/50 border ${style.border} cursor-default`}
            >
              <div className="flex items-center gap-2">
                <span>{style.icon}</span>
                <span className="text-sm font-medium text-[var(--plum)]">{area.topic}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} font-medium`}>
                {area.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--plum-dark)]/50 mt-4 text-center">
        Based on your recent quiz performance
      </p>
    </motion.div>
  );
}

// ============ Community Stats - Compare vs Other Users ============

interface CommunityStats {
  yourSessions: number;
  avgSessions: number;
  percentile: number;
  totalUsers: number;
  topUserSessions: number;
}

// Simulated community stats - in production, this would come from an API
function getCommunityStats(userSessions: number): CommunityStats {
  // These would be fetched from the backend in production
  const avgSessions = 4.2;
  const totalUsers = 847;
  const topUserSessions = 14;
  
  // Calculate percentile based on user's sessions
  let percentile = 50;
  if (userSessions >= 10) percentile = 95;
  else if (userSessions >= 7) percentile = 85;
  else if (userSessions >= 5) percentile = 70;
  else if (userSessions >= 3) percentile = 50;
  else if (userSessions >= 1) percentile = 30;
  else percentile = 10;
  
  return {
    yourSessions: userSessions,
    avgSessions,
    percentile,
    totalUsers,
    topUserSessions,
  };
}

export function CommunityStatsCard() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatedPercentile, setAnimatedPercentile] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
    const weeklyCount = getWeeklySessionCount();
    setStats(getCommunityStats(weeklyCount));
  }, []);

  useEffect(() => {
    if (stats && isInView) {
      // Animate percentile bar
      let current = 0;
      const target = stats.percentile;
      const timer = setInterval(() => {
        current += 2;
        if (current >= target) {
          setAnimatedPercentile(target);
          clearInterval(timer);
        } else {
          setAnimatedPercentile(current);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [stats, isInView]);

  if (!mounted || !stats) return null;

  const isAboveAverage = stats.yourSessions > stats.avgSessions;
  const isTopPerformer = stats.percentile >= 80;

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="card bg-gradient-to-br from-[var(--lilac-soft)] via-white to-[var(--pink-soft)]/30 border-[var(--lavender)] hover:shadow-xl transition-all duration-300 overflow-hidden relative"
    >
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Users className="w-5 h-5 text-[var(--purple)]" />
            </motion.div>
            <h3 className="font-semibold text-[var(--plum)]">How you compare</h3>
          </div>
          <span className="text-xs text-[var(--plum-dark)]/50 bg-white/60 px-2.5 py-1 rounded-full">
            This week
          </span>
        </div>

        {/* Main Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-[var(--plum-dark)]/60 mb-1">Your sessions</p>
            <motion.p 
              className="text-4xl font-bold text-[var(--purple)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {stats.yourSessions}
            </motion.p>
            {isAboveAverage && (
              <motion.div 
                className="flex items-center justify-center gap-1 mt-1 text-emerald-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ArrowUp className="w-3 h-3" />
                <span className="text-xs font-medium">Above avg</span>
              </motion.div>
            )}
          </motion.div>
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-xs text-[var(--plum-dark)]/60 mb-1">Community avg</p>
            <p className="text-4xl font-bold text-[var(--plum-dark)]/60">{stats.avgSessions}</p>
            <p className="text-xs text-[var(--plum-dark)]/50 mt-1">{stats.totalUsers} students</p>
          </motion.div>
        </div>

        {/* Percentile Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--plum-dark)]/70">Your ranking</span>
            <motion.span 
              className="text-xs font-bold text-[var(--purple)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Top {100 - stats.percentile}%
            </motion.span>
          </div>
          <div className="h-4 bg-white/60 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--lavender)] via-[var(--purple)] to-[var(--pink)] rounded-full relative"
              style={{ width: `${animatedPercentile}%` }}
            >
              {/* Shimmer effect on bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Achievement Badge */}
        <AnimatePresence mode="wait">
          {isTopPerformer ? (
            <motion.div 
              key="top"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3"
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-amber-800">Top Performer! 🏆</p>
                <p className="text-xs text-amber-700/70">You're crushing it - top {100 - stats.percentile}% of all students!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="regular"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 bg-[var(--lilac-soft)] rounded-xl p-3"
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-[var(--lavender)]/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Zap className="w-6 h-6 text-[var(--purple)]" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-[var(--plum)]">
                  {5 - stats.yourSessions > 0 
                    ? `${5 - stats.yourSessions} more to beat the average!`
                    : 'Keep up the great work!'}
                </p>
                <p className="text-xs text-[var(--plum-dark)]/60">Top students do {stats.topUserSessions}+ sessions/week</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============ Streak Calendar ============

export function StreakCalendar() {
  const [activityDays, setActivityDays] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.sessionEvents);
      if (stored) {
        const events: SessionEvent[] = JSON.parse(stored);
        const days = new Set(events.map(e => new Date(e.timestamp).toDateString()));
        setActivityDays(days);
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!mounted) return null;

  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const streakCount = activityDays.size;

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="card hover:shadow-lg transition-all duration-300 overflow-hidden relative"
    >
      {/* Fire background for good streaks */}
      {streakCount >= 5 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.div
              animate={streakCount > 0 ? { 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Flame className={`w-5 h-5 ${streakCount >= 5 ? 'text-orange-500' : 'text-[var(--purple)]'}`} />
            </motion.div>
            <h3 className="font-semibold text-[var(--plum)]">Your streak</h3>
          </div>
          {streakCount > 0 && (
            <motion.span 
              className="text-xs font-bold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              🔥 {streakCount} day{streakCount !== 1 ? 's' : ''}
            </motion.span>
          )}
        </div>

        <div className="flex justify-between gap-2">
          {days.map((date, i) => {
            const isActive = activityDays.has(date.toDateString());
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.div 
                key={i} 
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-xs font-medium text-[var(--plum-dark)]/50">{dayNames[date.getDay()]}</span>
                <motion.div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200' 
                      : isToday 
                        ? 'bg-[var(--lilac)] text-[var(--purple)] border-2 border-dashed border-[var(--lavender)]'
                        : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ delay: i * 0.1 + 0.5 }}
                >
                  {isActive ? <Star className="w-5 h-5" /> : date.getDate()}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.p 
          className="text-xs text-[var(--plum-dark)]/60 mt-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {streakCount >= 7 
            ? '🏆 Perfect week! You&apos;re unstoppable!'
            : streakCount >= 5 
              ? '🔥 Amazing streak! Keep it going!'
              : streakCount > 0 
                ? `⚡ ${7 - streakCount} more days for a perfect week!`
                : '✨ Start a session to build your streak!'}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ============ Quick Achievement ============

const ACHIEVEMENTS = [
  { threshold: 10, title: 'Revision Legend', emoji: '👑', desc: '10+ sessions this week!', color: 'from-amber-400 to-yellow-500' },
  { threshold: 7, title: 'Week Warrior', emoji: '⚔️', desc: 'Practised every day!', color: 'from-purple-400 to-pink-500' },
  { threshold: 5, title: 'Consistent', emoji: '💪', desc: '5+ sessions - nice streak!', color: 'from-emerald-400 to-teal-500' },
  { threshold: 3, title: 'Getting Started', emoji: '🌱', desc: 'Building good habits!', color: 'from-green-400 to-emerald-500' },
  { threshold: 1, title: 'First Step', emoji: '👣', desc: 'You showed up - that matters!', color: 'from-blue-400 to-indigo-500' },
];

export function QuickAchievement() {
  const [achievement, setAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sessions = getWeeklySessionCount();
    
    for (const ach of ACHIEVEMENTS) {
      if (sessions >= ach.threshold) {
        setAchievement(ach);
        break;
      }
    }
  }, []);

  if (!mounted || !achievement) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Animated gradient background */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-10`}
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <div className="relative flex items-center gap-4 bg-gradient-to-r from-[var(--lilac-soft)]/80 to-[var(--pink-soft)]/50 backdrop-blur-sm rounded-2xl p-5 border border-[var(--lavender)]/50">
        <motion.div 
          className="text-4xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          {achievement.emoji}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-lg text-[var(--plum)]">{achievement.title}</p>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-[var(--purple)]" />
            </motion.div>
          </div>
          <p className="text-sm text-[var(--plum-dark)]/70">{achievement.desc}</p>
        </div>
        <motion.div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Award className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
