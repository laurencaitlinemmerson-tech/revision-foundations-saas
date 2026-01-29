'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

// ============ Components ============

export function WeeklyProgress() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getWeeklySessionCount());
  }, []);

  if (count === null) return null;

  return (
    <p className="text-sm text-[var(--plum-dark)]/70 mt-1">
      {count > 0 ? (
        <>You've practised <span className="font-semibold text-[var(--purple)]">{count} time{count !== 1 ? 's' : ''}</span> this week 🎉</>
      ) : (
        <>Ready when you are — try a quick 5-minute session.</>
      )}
    </p>
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
    <div className="card mb-6 border border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[var(--purple)]" />
        <h3 className="text-sm font-semibold text-[var(--plum)]">Continue where you left off</h3>
      </div>

      {activity ? (
        <Link
          href={activity.path}
          className="flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${toolInfo.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
              <Icon className={`w-5 h-5 ${toolInfo.color}`} />
            </div>
            <div>
              <p className="font-medium text-[var(--plum)]">{activity.label}</p>
              <p className="text-xs text-[var(--plum-dark)]/60">
                {activity.toolName === 'osce' ? 'OSCE Tool' : 'Core Quiz'} • {getRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
          <div className="bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-[var(--plum)] transition-all flex items-center gap-1.5 group-hover:gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      ) : (
        <div className="flex items-center justify-between">
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
    </div>
  );
}

export function StudyTipCard() {
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    setTip(getDailyTip());
  }, []);

  if (!tip) return null;

  return (
    <div className="card bg-[var(--lilac-soft)]/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--plum)]">Study Tip</h3>
            <span className="text-[10px] uppercase tracking-wide text-[var(--purple)] bg-[var(--lilac)] px-2 py-0.5 rounded-full font-medium">
              New tip daily
            </span>
          </div>
          <p className="text-sm text-[var(--plum-dark)]/70 leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </div>
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

  useEffect(() => {
    setMounted(true);
    setWeeklyCount(getWeeklySessionCount());
  }, []);

  if (!mounted) return null;

  // TODO: Wire these to real analytics when available
  const stats = [
    {
      icon: Flame,
      label: 'Current streak',
      value: weeklyCount > 0 ? `${Math.min(weeklyCount, 7)} days` : 'Start today!',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Timer,
      label: 'This week',
      value: weeklyCount > 0 ? `${weeklyCount} sessions` : 'No sessions yet',
      color: 'text-[var(--purple)]',
      bg: 'bg-[var(--lilac-soft)]',
    },
    {
      icon: TrendingUp,
      label: 'Keep going',
      value: weeklyCount >= 5 ? 'On fire!' : `${5 - weeklyCount} more to goal`,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="card flex items-center gap-4 hover:border-[var(--lavender)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
        >
          <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs text-[var(--plum-dark)]/60 uppercase tracking-wide">{stat.label}</p>
            <p className="font-semibold text-[var(--plum)]">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
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

  return (
    <div className="card hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[var(--purple)]" />
          <h3 className="font-semibold text-[var(--plum)]">Today's Plan</h3>
        </div>
        <span className="text-xs text-[var(--plum-dark)]/60 bg-[var(--lilac-soft)] px-2.5 py-1 rounded-full">
          {completedCount}/{totalCount} done
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {DAILY_CHECKLIST.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                isChecked
                  ? 'bg-[var(--mint)]/20 border border-[var(--mint)]'
                  : 'bg-[var(--lilac-soft)]/50 hover:bg-[var(--lilac-soft)] border border-transparent'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[var(--plum-dark)]/30 flex-shrink-0" />
              )}
              <span className={`flex-1 text-sm ${isChecked ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum)]'}`}>
                {item.label}
              </span>
              <span className="text-xs text-[var(--plum-dark)]/50">{item.duration}</span>
            </button>
          );
        })}
      </div>

      <Link
        href="/osce"
        className="flex items-center justify-center gap-2 w-full bg-[var(--purple)] text-white py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
      >
        <Play className="w-4 h-4" />
        Start Session
      </Link>
    </div>
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
  'needs-work': 'bg-amber-50 text-amber-700 border-amber-200',
  'improving': 'bg-blue-50 text-blue-700 border-blue-200',
  'strong': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function FocusAreasCard() {
  return (
    <div className="card hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--purple)]" />
        <h3 className="font-semibold text-[var(--plum)]">Focus areas this week</h3>
      </div>

      <div className="space-y-3">
        {FOCUS_AREAS.map((area, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--lilac-soft)]/30"
          >
            <span className="text-sm text-[var(--plum)]">{area.topic}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_STYLES[area.status]}`}>
              {area.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--plum-dark)]/50 mt-4 text-center">
        Based on your recent quiz performance
      </p>
    </div>
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

  useEffect(() => {
    setMounted(true);
    const weeklyCount = getWeeklySessionCount();
    setStats(getCommunityStats(weeklyCount));
  }, []);

  if (!mounted || !stats) return null;

  const isAboveAverage = stats.yourSessions > stats.avgSessions;
  const isTopPerformer = stats.percentile >= 80;

  return (
    <div className="card bg-gradient-to-br from-[var(--lilac-soft)] via-white to-[var(--pink-soft)]/30 border-[var(--lavender)] hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--purple)]" />
          <h3 className="font-semibold text-[var(--plum)]">How you compare</h3>
        </div>
        <span className="text-xs text-[var(--plum-dark)]/50 bg-white/60 px-2.5 py-1 rounded-full">
          This week
        </span>
      </div>

      {/* Main Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white/70 rounded-2xl p-4 text-center">
          <p className="text-xs text-[var(--plum-dark)]/60 mb-1">Your sessions</p>
          <p className="text-3xl font-bold text-[var(--purple)]">{stats.yourSessions}</p>
          {isAboveAverage && (
            <div className="flex items-center justify-center gap-1 mt-1 text-emerald-600">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-medium">Above avg</span>
            </div>
          )}
        </div>
        <div className="bg-white/70 rounded-2xl p-4 text-center">
          <p className="text-xs text-[var(--plum-dark)]/60 mb-1">Community avg</p>
          <p className="text-3xl font-bold text-[var(--plum-dark)]/70">{stats.avgSessions}</p>
          <p className="text-xs text-[var(--plum-dark)]/50 mt-1">{stats.totalUsers} students</p>
        </div>
      </div>

      {/* Percentile Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--plum-dark)]/70">Your ranking</span>
          <span className="text-xs font-semibold text-[var(--purple)]">Top {100 - stats.percentile}%</span>
        </div>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--lavender)] to-[var(--purple)] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.percentile}%` }}
          />
        </div>
      </div>

      {/* Achievement Badge */}
      {isTopPerformer ? (
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Top Performer! 🏆</p>
            <p className="text-xs text-amber-700/70">You're in the top {100 - stats.percentile}% of all students</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-[var(--lilac-soft)] rounded-xl p-3">
          <div className="w-10 h-10 rounded-full bg-[var(--lavender)]/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[var(--purple)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--plum)]">
              {5 - stats.yourSessions > 0 
                ? `${5 - stats.yourSessions} more to beat the average!`
                : 'Keep up the great work!'}
            </p>
            <p className="text-xs text-[var(--plum-dark)]/60">Top students do {stats.topUserSessions}+ sessions/week</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Streak Calendar ============

export function StreakCalendar() {
  const [activityDays, setActivityDays] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

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

  return (
    <div className="card hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-[var(--plum)]">Your streak</h3>
      </div>

      <div className="flex justify-between gap-2">
        {days.map((date, i) => {
          const isActive = activityDays.has(date.toDateString());
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-[var(--plum-dark)]/50">{dayNames[date.getDay()]}</span>
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md' 
                    : isToday 
                      ? 'bg-[var(--lilac)] text-[var(--purple)] border-2 border-dashed border-[var(--lavender)]'
                      : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/50'
                }`}
              >
                {isActive ? <Star className="w-4 h-4" /> : date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--plum-dark)]/50 mt-4 text-center">
        {activityDays.size > 0 
          ? `🔥 ${activityDays.size} day${activityDays.size !== 1 ? 's' : ''} this week!`
          : 'Start a session to build your streak!'}
      </p>
    </div>
  );
}

// ============ Quick Achievement ============

export function QuickAchievement() {
  const [achievement, setAchievement] = useState<{ title: string; emoji: string; desc: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sessions = getWeeklySessionCount();
    
    if (sessions >= 10) {
      setAchievement({ title: 'Revision Legend', emoji: '👑', desc: '10+ sessions this week!' });
    } else if (sessions >= 7) {
      setAchievement({ title: 'Week Warrior', emoji: '⚔️', desc: 'Practised every day!' });
    } else if (sessions >= 5) {
      setAchievement({ title: 'Consistent', emoji: '💪', desc: '5+ sessions - nice streak!' });
    } else if (sessions >= 3) {
      setAchievement({ title: 'Getting Started', emoji: '🌱', desc: 'Building good habits!' });
    } else if (sessions >= 1) {
      setAchievement({ title: 'First Step', emoji: '👣', desc: 'You showed up - that matters!' });
    }
  }, []);

  if (!mounted || !achievement) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--lilac-soft)] to-[var(--pink-soft)]/50 rounded-2xl p-4 border border-[var(--lavender)]/50">
      <div className="text-3xl">{achievement.emoji}</div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[var(--plum)]">{achievement.title}</p>
          <Sparkles className="w-4 h-4 text-[var(--purple)]" />
        </div>
        <p className="text-xs text-[var(--plum-dark)]/70">{achievement.desc}</p>
      </div>
    </div>
  );
}
