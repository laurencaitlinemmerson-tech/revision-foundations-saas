'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpenText, ClipboardCheck, Search, Sparkles } from 'lucide-react';
import { getRecentPages, type RecentPage } from '@/lib/dashboardTracking';

interface DashboardHeroPanelProps {
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
}

interface DailyPlanState {
  date: string;
  plan: {
    osceStation: boolean;
    quizQuestions: boolean;
    weakTopics: boolean;
  };
}

interface WeakTopic {
  topic: string;
  score: number;
}

interface LastActivity {
  toolName: 'osce' | 'quiz';
  path: string;
  label: string;
  timestamp: number;
}

interface StudyStreak {
  currentStreak: number;
  lastStudyDate: string;
}

interface HeroState {
  recentPages: RecentPage[];
  completedToday: number;
  weakTopic: WeakTopic | null;
  lastActivity: LastActivity | null;
  streak: StudyStreak | null;
}

const defaultState: HeroState = {
  recentPages: [],
  completedToday: 0,
  weakTopic: null,
  lastActivity: null,
  streak: null,
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatToday() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

function relativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function getGreeting(firstName: string | null) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return firstName?.trim() ? `${greeting}, ${firstName.trim()}.` : `${greeting}.`;
}

export default function DashboardHeroPanel({
  firstName,
  hasOsce,
  hasQuiz,
}: DashboardHeroPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<HeroState>(defaultState);

  useEffect(() => {
    const nextPlan = load<DailyPlanState>('rf_daily_plan', {
      date: '',
      plan: {
        osceStation: false,
        quizQuestions: false,
        weakTopics: false,
      },
    });
    const todaysKey = new Date().toDateString();
    const completedToday =
      nextPlan.date === todaysKey
        ? Object.values(nextPlan.plan).filter(Boolean).length
        : 0;

    const weakTopics = load<WeakTopic[]>('rf_weak_topics', []).sort((a, b) => a.score - b.score);
    const streak = load<StudyStreak | null>('rf_study_streak', null);
    const nextState: HeroState = {
      recentPages: getRecentPages(),
      completedToday,
      weakTopic: weakTopics[0] ?? null,
      lastActivity: load<LastActivity | null>('rf_last_activity', null),
      streak,
    };

    const frame = window.requestAnimationFrame(() => {
      setState(nextState);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const heading = useMemo(() => getGreeting(firstName), [firstName]);
  const continueItem = state.recentPages[0] ?? null;
  const continueHref = continueItem?.href ?? state.lastActivity?.path ?? '/hub';
  const continueTitle = continueItem?.title ?? state.lastActivity?.label ?? 'Open your next study thread';
  const continueMeta =
    continueItem?.timestamp != null
      ? relativeTime(continueItem.timestamp)
      : state.lastActivity?.timestamp
      ? relativeTime(state.lastActivity.timestamp)
      : 'No recent session yet';
  const progressWidth = `${Math.min((state.completedToday / 3) * 100, 100)}%`;
  const quietPressure =
    state.streak?.currentStreak && state.streak.currentStreak > 0
      ? `You're one session away from ${state.streak.currentStreak + 1} days.`
      : 'One focused session is enough to start momentum.';

  let insightTitle = 'Use your strongest area in a more applied setting.';
  let insightBody = 'The dashboard should not just show progress. It should steer you toward the next useful kind of practice.';
  let insightHref = hasOsce ? '/osce' : hasQuiz ? '/quiz' : '/hub';
  let insightLabel = hasOsce ? 'Run one timed station' : hasQuiz ? 'Start a short quiz' : 'Open the hub';

  if (state.weakTopic && state.weakTopic.score < 70) {
    insightTitle = `${state.weakTopic.topic} is still pulling your average down.`;
    insightBody = `A short targeted set here is likely to help more than another comfortable revision session.`;
    insightHref = hasQuiz ? `/quiz?topic=${encodeURIComponent(state.weakTopic.topic)}` : '/pricing';
    insightLabel = hasQuiz ? `Practise ${state.weakTopic.topic}` : 'Unlock targeted quizzes';
  } else if (state.lastActivity?.toolName === 'quiz' && hasOsce) {
    insightTitle = 'You revised recall recently. Balance it with timed practice.';
    insightBody = 'That usually keeps revision feeling more exam-shaped and less theoretical.';
    insightHref = '/osce';
    insightLabel = 'Launch OSCE practice';
  } else if (state.lastActivity?.toolName === 'osce' && hasQuiz) {
    insightTitle = 'Your last session was applied. A short quiz would consolidate it.';
    insightBody = 'Use a smaller recall set to lock in what the station exposed.';
    insightHref = '/quiz';
    insightLabel = 'Open the core quiz';
  }

  const quickActions = [
    {
      href: hasOsce ? '/osce' : '/pricing',
      label: '8-minute OSCE station',
      note: hasOsce ? 'Timed and practical.' : 'Unlock practical stations.',
      icon: ClipboardCheck,
    },
    {
      href: hasQuiz ? '/quiz' : '/pricing',
      label: '10-question quiz',
      note: hasQuiz ? 'Fast recall check.' : 'Add short question sets.',
      icon: Search,
    },
    {
      href: '/hub',
      label: 'Quick recall session',
      note: 'Re-open a guide and test yourself aloud.',
      icon: BookOpenText,
    },
  ];

  const heroMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section className="border-b border-[rgba(26,24,21,0.08)] bg-[var(--cream)]">
      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-[52px] md:px-10 md:pb-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--charcoal)]/48">
          {formatToday()}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--espresso)]">
          {heading}
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-8 text-[var(--charcoal)]/72">
          A calmer study desk for resuming the right thread, protecting momentum, and making the next useful action obvious.
        </p>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <motion.article
            {...heroMotion}
            className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6 md:px-7"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/48">
              Continue where you left off
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.9rem)] leading-[1.02] tracking-[-0.02em] text-[var(--espresso)]">
              {continueTitle}
            </h2>
            <p className="mt-3 max-w-[50ch] text-sm leading-7 text-[var(--charcoal)]/72">
              {continueItem
                ? 'Returning to the last page you actually used is usually the cleanest way back into revision.'
                : 'Once you reopen a guide, station, or quiz, this space becomes your quickest route back in next time.'}
            </p>

            <div className="mt-6 grid gap-4 border-y border-[rgba(26,24,21,0.08)] py-4 md:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/42">Last active</p>
                <p className="mt-2 text-sm text-[var(--espresso)]">{continueMeta}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/42">Today</p>
                <p className="mt-2 text-sm text-[var(--espresso)]">{state.completedToday} of 3 study markers complete</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/42">Momentum</p>
                <p className="mt-2 text-sm text-[var(--espresso)]">{quietPressure}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] text-[var(--charcoal)]/58">
                <span>Daily progress</span>
                <span>{state.completedToday}/3</span>
              </div>
              <div className="mt-2 h-[3px] overflow-hidden bg-[rgba(26,24,21,0.08)]">
                <div
                  className="h-full bg-[linear-gradient(90deg,#8bb59f_0%,#d4a574_100%)]"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={continueHref}
                className="inline-flex items-center gap-2 bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]"
              >
                Continue now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hub"
                className="inline-flex items-center gap-2 border border-[rgba(26,24,21,0.08)] px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.16)]"
              >
                Browse the hub
              </Link>
            </div>
          </motion.article>

          <div className="space-y-4">
            <motion.div
              {...heroMotion}
              transition={{
                duration: 0.45,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.78)] px-5 py-5"
            >
              <div className="flex items-center gap-2 text-[var(--charcoal)]/56">
                <Sparkles className="h-4 w-4" />
                <p className="text-[10px] uppercase tracking-[0.16em]">Smart insight</p>
              </div>
              <h3 className="mt-3 font-display text-[1.6rem] leading-[1.06] text-[var(--espresso)]">
                {insightTitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/72">
                {insightBody}
              </p>
              <Link
                href={insightHref}
                className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--espresso)] transition-colors hover:text-black"
              >
                {insightLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              {...heroMotion}
              transition={{
                duration: 0.45,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="border border-[rgba(26,24,21,0.08)] bg-white px-5 py-5"
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/48">
                Quick entry
              </p>
              <div className="mt-3 divide-y divide-[rgba(26,24,21,0.08)]">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)] text-[var(--espresso)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-[var(--espresso)]">{action.label}</span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--charcoal)]/64">{action.note}</span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--charcoal)]/32" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
