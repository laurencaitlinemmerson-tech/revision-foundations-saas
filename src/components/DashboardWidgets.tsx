'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Lightbulb,
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
    <div className="card mb-6 border border-[var(--lilac-medium)] hover:border-[var(--lavender)] transition-all duration-200">
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
            <div className={`w-10 h-10 rounded-xl ${toolInfo.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${toolInfo.color}`} />
            </div>
            <div>
              <p className="font-medium text-[var(--plum)]">{activity.label}</p>
              <p className="text-xs text-[var(--plum-dark)]/70">
                {activity.toolName === 'osce' ? 'OSCE Tool' : 'Core Quiz'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[var(--purple)] text-sm font-medium group-hover:gap-2 transition-all">
            Continue
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      ) : (
        <p className="text-sm text-[var(--plum-dark)]/70">
          Your next session will appear here after you start a tool.
        </p>
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
