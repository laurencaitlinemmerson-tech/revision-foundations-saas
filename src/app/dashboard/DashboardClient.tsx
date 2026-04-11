'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  FolderArchive,
  Flame,
  Search,
  Sparkles,
  Stethoscope,
  Target,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import ContinueCard from '@/components/dashboard/ContinueCard';
import DashboardCarousel from '@/components/dashboard/DashboardCarousel';
import { getPlacementDate, getRecentPages, type RecentPage } from '@/lib/dashboardTracking';
import type { OsceStats, QuizStats, TopicStrength } from '@/components/dashboard/dashboardTypes';

interface DashboardClientProps {
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
  quizStats: QuizStats | null;
  osceStats: OsceStats | null;
  topicStrength: TopicStrength[];
}

interface DailyPlan {
  osceStation: boolean;
  quizQuestions: boolean;
  weakTopics: boolean;
}

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[];
}

interface WeakTopic {
  topic: string;
  score: number;
  attempts: number;
  lastSeen: string;
}

interface LastActivity {
  toolName: 'osce' | 'quiz';
  path: string;
  label: string;
  timestamp: number;
}

interface TrackItem {
  id: string;
  state: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  meta: string;
  accent: string;
}

interface ResourceShortcut {
  title: string;
  href: string;
  tag: string;
  note: string;
}

interface RevisionDay {
  day: string;
  theme: string;
  duration: string;
  mood: string;
  tasks: string[];
}

const STORAGE_KEYS = {
  streak: 'rf_study_streak',
  plan: 'rf_daily_plan',
  weakTopics: 'rf_weak_topics',
  lastTool: 'rf_last_activity',
} as const;

const DEFAULT_PLAN: DailyPlan = {
  osceStation: false,
  quizQuestions: false,
  weakTopics: false,
};

const QUICK_ACTIONS = [
  {
    title: '8-minute OSCE station',
    description: 'Quiet pressure, real application.',
    href: '/osce',
    accent: 'var(--sage-600)',
    icon: Stethoscope,
  },
  {
    title: '10-question quiz',
    description: 'Short recall without losing the day.',
    href: '/quiz',
    accent: '#a86c43',
    icon: Target,
  },
  {
    title: 'Quick recall session',
    description: 'Re-open a guide and test yourself aloud.',
    href: '/hub',
    accent: '#6d8795',
    icon: BookOpenText,
  },
  {
    title: 'Review saved folder',
    description: 'Return to your own revision archive.',
    href: '#saved-library',
    accent: '#9a7b67',
    icon: FolderArchive,
  },
];

const RESOURCE_SHORTCUTS: ResourceShortcut[] = [
  {
    title: 'A-E assessment framework',
    href: '/hub/resources/ae-assessment-guide',
    tag: 'OSCE',
    note: 'Best when you want an immediate clinical structure.',
  },
  {
    title: 'Drug calculations cheat sheet',
    href: '/hub/resources/drug-calculations-cheat-sheet',
    tag: 'Meds',
    note: 'A calm way back into pharmacology.',
  },
  {
    title: 'Placement survival guide',
    href: '/hub/resources/placement-survival',
    tag: 'Placement',
    note: 'Useful when you need practical reassurance quickly.',
  },
  {
    title: 'Respiratory system',
    href: '/hub/resources/respiratory-system',
    tag: 'Anatomy',
    note: 'A strong revision anchor before mocks.',
  },
  {
    title: 'Paediatric vital signs',
    href: '/hub/resources/paeds-vital-signs-cheat-sheet',
    tag: 'Paeds',
    note: 'Fast reference for exam-day recall.',
  },
  {
    title: 'Medication abbreviations',
    href: '/hub/resources/medication-abbreviations',
    tag: 'Meds',
    note: 'A tidy quick win when time is tight.',
  },
];

const REVISION_WEEK: RevisionDay[] = [
  {
    day: 'Mon',
    theme: 'Respiratory',
    duration: '75 min',
    mood: 'Applied recall',
    tasks: ['Airway assessment guide', 'Chest auscultation station', '10-question respiratory set'],
  },
  {
    day: 'Tue',
    theme: 'Pharmacology',
    duration: '60 min',
    mood: 'Accuracy repair',
    tasks: ['Drug calculations refresher', 'Medication abbreviations', 'Short weak-area quiz'],
  },
  {
    day: 'Wed',
    theme: 'Neurological',
    duration: '80 min',
    mood: 'Assessment fluency',
    tasks: ['Neuro assessment guide', 'Pupil response station', 'Focused recall review'],
  },
  {
    day: 'Thu',
    theme: 'Reset',
    duration: '30 min',
    mood: 'Light maintenance',
    tasks: ['Read one saved guide', 'Review errors only', 'Stop early and recover'],
  },
  {
    day: 'Fri',
    theme: 'Cardiac',
    duration: '75 min',
    mood: 'Exam rehearsal',
    tasks: ['ECG interpretation guide', 'Cardiac auscultation station', 'Timed mixed set'],
  },
  {
    day: 'Sat',
    theme: 'Mock block',
    duration: '90 min',
    mood: 'Pressure practice',
    tasks: ['Timed mock', 'Error review', 'One spoken recap'],
  },
  {
    day: 'Sun',
    theme: 'Recovery',
    duration: '20 min',
    mood: 'Keep the thread',
    tasks: ['Open one gentle topic', 'Plan the week ahead', 'Leave with a clear next step'],
  },
];

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayDateKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function normalizeStreak(streak: StudyStreak | null): StudyStreak | null {
  if (!streak) return null;

  if (streak.lastStudyDate !== todayDateKey() && streak.lastStudyDate !== yesterdayDateKey()) {
    return {
      ...streak,
      currentStreak: 0,
    };
  }

  return streak;
}

function recordStudySession() {
  const existing = normalizeStreak(
    readLocalStorage<StudyStreak | null>(STORAGE_KEYS.streak, {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: '',
      studyDates: [],
    }),
  );

  const streak = existing ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    studyDates: [],
  };

  if (streak.lastStudyDate === todayDateKey()) {
    return streak;
  }

  const currentStreak =
    streak.lastStudyDate === yesterdayDateKey() ? streak.currentStreak + 1 : 1;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  const nextStreak: StudyStreak = {
    currentStreak,
    longestStreak: Math.max(currentStreak, streak.longestStreak),
    lastStudyDate: todayDateKey(),
    studyDates: [...streak.studyDates.filter((day) => day >= cutoffKey), todayDateKey()],
  };

  writeLocalStorage(STORAGE_KEYS.streak, nextStreak);
  return nextStreak;
}

function formatToday() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

function formatRelativeTime(timestamp: number) {
  const delta = Date.now() - timestamp;
  const minutes = Math.floor(delta / 60000);
  const hours = Math.floor(delta / 3600000);
  const days = Math.floor(delta / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function buildICSContent() {
  const startOfNextWeek = new Date();
  const currentDay = startOfNextWeek.getDay();
  const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
  startOfNextWeek.setDate(startOfNextWeek.getDate() + daysUntilMonday);
  startOfNextWeek.setHours(9, 0, 0, 0);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Nurse Lab//Revision Week//EN',
  ];

  REVISION_WEEK.forEach((day, index) => {
    const start = new Date(startOfNextWeek);
    start.setDate(startOfNextWeek.getDate() + index);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + Number.parseInt(day.duration, 10));

    const formatICS = (value: Date) =>
      value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    lines.push(
      'BEGIN:VEVENT',
      `UID:nurselab-dashboard-${index}-${Date.now()}@nurselab.co.uk`,
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:Nurse Lab - ${day.theme}`,
      `DESCRIPTION:${day.tasks.join(', ')}`,
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadRevisionWeek() {
  const blob = new Blob([buildICSContent()], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'nurse-lab-revision-week.ics';
  anchor.click();
  URL.revokeObjectURL(url);
}

function streakMessage(streak: StudyStreak | null, fallbackDays: number) {
  const current = streak?.currentStreak ?? fallbackDays;
  const studiedToday = streak?.lastStudyDate === todayDateKey();

  if (current <= 0) {
    return 'One focused session starts the rhythm.';
  }

  if (!studiedToday) {
    return `You're 1 session away from ${current + 1} days.`;
  }

  return `${current + 1} days is waiting tomorrow if you show up again.`;
}

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[clamp(2rem,3vw,2.9rem)] leading-[0.98] tracking-[-0.03em] text-[var(--espresso)]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/74">
        {copy}
      </p>
    </div>
  );
}

function InsightPanel({
  quote,
  supporting,
  actionHref,
  actionLabel,
}: {
  quote: string;
  supporting: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
      className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,243,236,0.9)_100%)] p-6 shadow-[0_18px_54px_rgba(61,45,28,0.06)]"
    >
      <div className="flex items-center gap-3 text-[var(--charcoal)]/58">
        <Sparkles className="h-4 w-4" />
        <p className="text-[10px] uppercase tracking-[0.2em]">
          Smart insight
        </p>
      </div>
      <p className="mt-5 font-display text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--espresso)]">
        {quote}
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--charcoal)]/74">
        {supporting}
      </p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--espresso)] transition hover:text-black"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.section>
  );
}

function MomentumPanel({
  currentStreak,
  copy,
  weeklyHours,
}: {
  currentStreak: number;
  copy: string;
  weeklyHours: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
      className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.7)] p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/46">
          Momentum
        </p>
        <Flame className="h-4 w-4 text-[#a16b43]" />
      </div>

      <div className="mt-5 flex items-end gap-4">
        <p className="font-display text-[3.4rem] italic leading-none text-[var(--espresso)]">
          {currentStreak}
        </p>
        <div className="pb-2 text-sm leading-5 text-[var(--charcoal)]/62">
          day streak
          <br />
          {weeklyHours} hrs this week
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--charcoal)]/74">
        {copy}
      </p>
    </motion.section>
  );
}

function TrackCard(item: TrackItem) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-full flex-col justify-between rounded-[28px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_18px_48px_rgba(61,45,28,0.05)]"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/44">
            {item.state}
          </p>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.accent }}
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[var(--charcoal)]/54">
          {item.eyebrow}
        </p>
        <h3 className="mt-3 text-[1.8rem] leading-[1.02] tracking-[-0.03em] text-[var(--espresso)]">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/72">
          {item.description}
        </p>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-[rgba(26,24,21,0.08)] pt-4">
        <p className="text-sm text-[var(--charcoal)]/58">{item.meta}</p>
        <Link
          href={item.href}
          className="inline-flex items-center gap-1 text-sm text-[var(--espresso)] transition hover:gap-2"
        >
          Open
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function DayIntentPanel({
  plan,
  onToggle,
  nextActionHref,
  nextActionLabel,
}: {
  plan: DailyPlan;
  onToggle: (key: keyof DailyPlan) => void;
  nextActionHref: string;
  nextActionLabel: string;
}) {
  const completed = Object.values(plan).filter(Boolean).length;
  const progress = (completed / 3) * 100;

  const items: Array<{ key: keyof DailyPlan; title: string; note: string }> = [
    {
      key: 'osceStation',
      title: 'Run one OSCE station',
      note: 'Bring recall into timed performance.',
    },
    {
      key: 'quizQuestions',
      title: 'Complete one short quiz set',
      note: 'Keep retrieval practice active today.',
    },
    {
      key: 'weakTopics',
      title: 'Repair one weak area',
      note: 'Close the loop before it lingers.',
    },
  ];

  const message =
    completed === 3
      ? 'Everything important for today is already done.'
      : completed === 2
      ? "You're one step away from keeping the streak alive."
      : completed === 1
      ? 'The day is in motion. Keep the next step small.'
      : 'A calm win today only needs three deliberate touches.';

  return (
    <section className="rounded-[34px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(160deg,rgba(255,255,255,0.93)_0%,rgba(247,243,236,0.96)_100%)] p-7 shadow-[0_22px_70px_rgba(61,45,28,0.06)] sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48">
            Today&apos;s plan
          </p>
          <h3 className="mt-3 text-[2.3rem] leading-[0.98] tracking-[-0.03em] text-[var(--espresso)]">
            Win the day in one glance.
          </h3>
          <p className="mt-3 max-w-[40ch] text-sm leading-7 text-[var(--charcoal)]/72">
            Three quiet actions. Enough to move revision forward without turning the dashboard into a to-do list.
          </p>
        </div>

        <div className="min-w-[210px]">
          <div className="flex items-center justify-between text-sm text-[var(--charcoal)]/62">
            <span>{completed} of 3 complete</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(26,24,21,0.08)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-[linear-gradient(90deg,#88a08f_0%,#d7b08a_100%)]"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--charcoal)]/68">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((item, index) => {
          const checked = plan[item.key];
          return (
            <motion.button
              key={item.key}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
              onClick={() => onToggle(item.key)}
              className={`flex w-full items-start gap-4 rounded-[24px] border p-4 text-left transition ${
                checked
                  ? 'border-[rgba(112,146,124,0.22)] bg-[rgba(233,243,236,0.72)]'
                  : 'border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.78)] hover:border-[rgba(26,24,21,0.16)]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {checked ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--sage-600)] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-[var(--charcoal)]/40">
                    <Circle className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-base ${checked ? 'text-[var(--charcoal)]/55 line-through' : 'text-[var(--espresso)]'}`}>
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--charcoal)]/64">
                  {item.note}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-[rgba(26,24,21,0.08)] pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-7 text-[var(--charcoal)]/72">
          Use the dashboard as a study intention, not a guilt machine.
        </p>
        <Link
          href={nextActionHref}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--espresso)] px-5 py-3 text-sm text-white transition hover:bg-[#2a241d]"
        >
          {nextActionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function FocusPanel({
  weakestTopic,
  fallbackTopic,
  hasQuiz,
}: {
  weakestTopic: WeakTopic | null;
  fallbackTopic: string;
  hasQuiz: boolean;
}) {
  const label = weakestTopic?.topic ?? fallbackTopic;
  const score = weakestTopic?.score ?? 52;

  return (
    <section className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.7)] p-6">
      <div className="flex items-center gap-3 text-[var(--charcoal)]/56">
        <Target className="h-4 w-4" />
        <p className="text-[10px] uppercase tracking-[0.18em]">
          Focus next
        </p>
      </div>
      <h3 className="mt-4 text-[2rem] leading-[1] tracking-[-0.03em] text-[var(--espresso)]">
        {label}
      </h3>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-display text-[3rem] italic leading-none text-[var(--espresso)]">
          {score}%
        </p>
        <p className="pb-1 text-sm leading-5 text-[var(--charcoal)]/62">
          current accuracy
        </p>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--charcoal)]/72">
        One targeted set here will improve the whole picture faster than another comfortable topic.
      </p>
      <Link
        href={hasQuiz ? `/quiz?topic=${encodeURIComponent(label)}` : '/pricing'}
        className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--espresso)] transition hover:gap-3"
      >
        {hasQuiz ? 'Improve accuracy' : 'Unlock targeted quizzes'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function QuickActionsPanel({
  hasOsce,
  hasQuiz,
}: {
  hasOsce: boolean;
  hasQuiz: boolean;
}) {
  const actions = QUICK_ACTIONS.map((action) => {
    if (action.href === '/osce' && !hasOsce) {
      return { ...action, href: '/pricing', description: 'Unlock timed stations when you want them.' };
    }

    if (action.href === '/quiz' && !hasQuiz) {
      return { ...action, href: '/pricing', description: 'Add short question sets to your rhythm.' };
    }

    return action;
  });

  return (
    <section className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.7)] p-6">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/46">
        Quick entry
      </p>
      <h3 className="mt-3 text-[2rem] leading-[1] tracking-[-0.03em] text-[var(--espresso)]">
        Start fast.
      </h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-[24px] border border-[rgba(26,24,21,0.08)] bg-[rgba(250,248,244,0.9)] p-4 transition hover:-translate-y-1 hover:border-[rgba(26,24,21,0.16)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
                  style={{ color: action.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--charcoal)]/30 transition group-hover:translate-x-1" />
              </div>
              <p className="mt-4 text-base text-[var(--espresso)]">
                {action.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/64">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ProgressStoryPanel({
  quizStats,
  osceStats,
  topicStrength,
  streakCount,
}: {
  quizStats: QuizStats | null;
  osceStats: OsceStats | null;
  topicStrength: TopicStrength[];
  streakCount: number;
}) {
  const strongest = topicStrength[0];
  const weakest = topicStrength[topicStrength.length - 1];
  const appliedGap =
    quizStats && osceStats ? quizStats.averagePercent - osceStats.averageScore : null;

  const story =
    appliedGap != null && appliedGap >= 6
      ? `Your recall is ahead of your timed performance by ${appliedGap} points. Keep one timed station in the weekly rhythm.`
      : strongest && weakest
      ? `${strongest.label} is carrying confidence. ${weakest.label} still needs deliberate repetition.`
      : 'Your revision signal is clearest when recall and application move together.';

  return (
    <section className="rounded-[36px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(246,241,233,0.96)_100%)] p-7 shadow-[0_24px_72px_rgba(61,45,28,0.06)] sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48">
            Progress story
          </p>
          <h3 className="mt-3 text-[2.4rem] leading-[0.98] tracking-[-0.03em] text-[var(--espresso)]">
            Calm metrics, clearer signal.
          </h3>
          <p className="mt-3 max-w-[36ch] text-sm leading-7 text-[var(--charcoal)]/72">
            Less dashboard noise, more sense of where revision is actually moving.
          </p>

          <div className="mt-8 space-y-5 border-t border-[rgba(26,24,21,0.08)] pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                  Study streak
                </p>
                <p className="mt-2 font-display text-[2.5rem] italic leading-none text-[var(--espresso)]">
                  {streakCount}
                </p>
              </div>
              <p className="max-w-[18ch] text-right text-sm leading-6 text-[var(--charcoal)]/62">
                Momentum grows when the next session stays easy to begin.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[rgba(26,24,21,0.08)] bg-white/70 p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                  Accuracy
                </p>
                <p className="mt-2 font-display text-[2.2rem] italic leading-none text-[var(--espresso)]">
                  {quizStats?.averagePercent ?? 74}%
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/62">
                  Quiz average across {quizStats?.totalAnswered ?? 184} questions.
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(26,24,21,0.08)] bg-white/70 p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                  This week
                </p>
                <p className="mt-2 font-display text-[2.2rem] italic leading-none text-[var(--espresso)]">
                  {quizStats?.hoursThisWeek ?? 6}h
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/62">
                  Enough volume to keep content warm without overload.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(26,24,21,0.08)] bg-[rgba(246,240,232,0.85)] p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                Read of the week
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]/72">
                {story}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-white/72 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                Topic strength
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/66">
                Built for scanning, not squinting.
              </p>
            </div>
            <div className="text-right text-sm text-[var(--charcoal)]/58">
              {osceStats?.totalRuns ?? 11} stations
              <br />
              {osceStats?.averageScore ?? 68}% OSCE avg
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {topicStrength.map((topic) => (
              <div key={topic.label}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-base text-[var(--espresso)]">{topic.label}</p>
                  <p className="text-sm text-[var(--charcoal)]/58">{topic.pct}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(26,24,21,0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${topic.pct}%` }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RevisionWeekPanel() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');
  const [downloaded, setDownloaded] = useState(false);

  const selected = REVISION_WEEK[selectedDay];

  async function handleCopy() {
    const text = REVISION_WEEK.map(
      (day) => `${day.day} - ${day.theme} (${day.duration})\n${day.tasks.map((task) => `- ${task}`).join('\n')}`,
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopyState('done');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {}
  }

  function handleDownload() {
    downloadRevisionWeek();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2000);
  }

  return (
    <section className="rounded-[36px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.72)] p-7 sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[34ch]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48">
            Revision week
          </p>
          <h3 className="mt-3 text-[2.3rem] leading-[0.98] tracking-[-0.03em] text-[var(--espresso)]">
            A planner that feels worth returning to.
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/72">
            Structured enough to guide the week, loose enough to feel humane.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-[rgba(26,24,21,0.08)] bg-white px-4 py-2.5 text-sm text-[var(--espresso)] transition hover:border-[rgba(26,24,21,0.16)]"
          >
            {downloaded ? 'Downloaded' : 'Add to calendar'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-[var(--espresso)] px-4 py-2.5 text-sm text-white transition hover:bg-[#2a241d]"
          >
            {copyState === 'done' ? 'Copied' : 'Copy week'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2">
          {REVISION_WEEK.map((day, index) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setSelectedDay(index)}
              className={`min-w-[180px] rounded-[24px] border p-4 text-left transition ${
                selectedDay === index
                  ? 'border-[rgba(26,24,21,0.18)] bg-[rgba(245,239,231,0.92)]'
                  : 'border-[rgba(26,24,21,0.08)] bg-white/70 hover:border-[rgba(26,24,21,0.14)]'
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
                {day.day}
              </p>
              <p className="mt-3 text-[1.3rem] leading-[1.02] text-[var(--espresso)]">
                {day.theme}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/64">
                {day.duration} · {day.mood}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-[28px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,240,232,0.92)_100%)] p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/44">
                  Selected day
                </p>
                <h4 className="mt-3 text-[2rem] leading-[1] tracking-[-0.03em] text-[var(--espresso)]">
                  {selected.theme}
                </h4>
              </div>
              <div className="text-right text-sm leading-6 text-[var(--charcoal)]/62">
                {selected.day}
                <br />
                {selected.duration}
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[var(--charcoal)]/72">
              The mood for this day is <span className="text-[var(--espresso)]">{selected.mood.toLowerCase()}</span>. Enough structure to feel purposeful, enough space to keep you wanting to come back.
            </p>

            <div className="mt-6 space-y-3">
              {selected.tasks.map((task) => (
                <div
                  key={task}
                  className="flex items-start gap-3 rounded-[20px] border border-[rgba(26,24,21,0.08)] bg-white/72 px-4 py-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(26,24,21,0.4)]" />
                  <p className="text-sm leading-7 text-[var(--espresso)]">{task}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function PlacementCard({ placementDate }: { placementDate: string | null }) {
  const target = placementDate ? new Date(placementDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let message = 'Set a placement date and this turns into a calm countdown.';
  let label = 'Not set';

  if (target) {
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    label = diff === 0 ? 'Today' : `${Math.abs(diff)} days`;
    message =
      diff > 0
        ? `${diff} days until placement. Keep revision practical from here.`
        : diff === 0
        ? 'Placement day is here. Trust the work you have done.'
        : 'Placement has passed. Capture what you learned while it is fresh.';
  }

  return (
    <section className="rounded-[30px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.72)] p-6">
      <div className="flex items-center gap-3 text-[var(--charcoal)]/56">
        <CalendarDays className="h-4 w-4" />
        <p className="text-[10px] uppercase tracking-[0.18em]">
          Placement
        </p>
      </div>
      <p className="mt-4 font-display text-[2.4rem] italic leading-none text-[var(--espresso)]">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/72">
        {message}
      </p>
      <Link
        href="/hub/resources/placement-survival"
        className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--espresso)] transition hover:gap-3"
      >
        Open placement guide
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function ResourceDesk({
  recentPages,
}: {
  recentPages: RecentPage[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const trimmedQuery = deferredQuery.trim().toLowerCase();
  const results =
    trimmedQuery.length > 1
      ? RESOURCE_SHORTCUTS.filter((item) => {
          const haystack = `${item.title} ${item.tag} ${item.note}`.toLowerCase();
          return haystack.includes(trimmedQuery);
        }).slice(0, 4)
      : RESOURCE_SHORTCUTS.slice(0, 4);

  function openResult(href: string) {
    router.push(href);
    setQuery('');
  }

  return (
    <section className="rounded-[36px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(246,241,233,0.96)_100%)] p-7 shadow-[0_22px_70px_rgba(61,45,28,0.06)] sm:p-8">
      <SectionHeader
        eyebrow="Quick lookup"
        title="Your calmer route back to content."
        copy="Search fewer things, find the right one faster, and keep recent reads close to hand."
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div>
          <div className="flex items-center gap-3 rounded-[24px] border border-[rgba(26,24,21,0.08)] bg-white/82 px-5 py-4">
            <Search className="h-4 w-4 text-[var(--charcoal)]/48" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && results[0]) {
                  event.preventDefault();
                  openResult(results[0].href);
                }
              }}
              placeholder="Search guides, quick references, and practical refreshers..."
              className="w-full border-0 bg-transparent text-sm text-[var(--espresso)] outline-none placeholder:text-[var(--charcoal)]/38"
              aria-label="Search study resources"
            />
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/36 sm:block">
              Enter
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {results.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => openResult(item.href)}
                className="w-full rounded-[22px] border border-[rgba(26,24,21,0.08)] bg-white/78 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[rgba(26,24,21,0.16)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base text-[var(--espresso)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/64">
                      {item.note}
                    </p>
                  </div>
                  <span className="rounded-full border border-[rgba(26,24,21,0.08)] bg-[rgba(248,245,240,0.9)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/62">
                    {item.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.76)] p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/44">
            Recent pages
          </p>
          <div className="mt-4 space-y-3">
            {recentPages.length > 0 ? (
              recentPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(26,24,21,0.08)] bg-[rgba(248,245,240,0.86)] px-4 py-3 text-sm text-[var(--espresso)] transition hover:border-[rgba(26,24,21,0.16)]"
                >
                  <span className="line-clamp-1">{page.title}</span>
                  <span className="shrink-0 text-[var(--charcoal)]/46">
                    {formatRelativeTime(page.timestamp)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--charcoal)]/64">
                Pages you revisit will start to collect here, so returning never feels like starting from scratch.
              </p>
            )}
          </div>

          <Link
            href="/hub"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--espresso)] transition hover:gap-3"
          >
            Browse the full hub
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function DashboardClient({
  firstName,
  hasOsce,
  hasQuiz,
  quizStats,
  osceStats,
  topicStrength,
}: DashboardClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [plan, setPlan] = useState<DailyPlan>(DEFAULT_PLAN);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [placementDate, setPlacementDate] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = readLocalStorage<{ date: string; plan: DailyPlan }>(STORAGE_KEYS.plan, {
      date: '',
      plan: DEFAULT_PLAN,
    });

    const todayKey = new Date().toDateString();
    const nextPlan = storedPlan.date === todayKey ? storedPlan.plan : DEFAULT_PLAN;

    if (storedPlan.date !== todayKey) {
      writeLocalStorage(STORAGE_KEYS.plan, { date: todayKey, plan: DEFAULT_PLAN });
    }

    const frame = window.requestAnimationFrame(() => {
      setPlan(nextPlan);
      setStreak(normalizeStreak(readLocalStorage<StudyStreak | null>(STORAGE_KEYS.streak, null)));
      setWeakTopics(
        [...readLocalStorage<WeakTopic[]>(STORAGE_KEYS.weakTopics, [])].sort((a, b) => a.score - b.score),
      );
      setLastActivity(readLocalStorage<LastActivity | null>(STORAGE_KEYS.lastTool, null));
      setRecentPages(getRecentPages());
      setPlacementDate(getPlacementDate());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const strongestTopic = topicStrength[0]?.label ?? quizStats?.strongestArea ?? 'Respiratory';
  const weakestTopic = weakTopics[0] ?? null;
  const planCompleted = Object.values(plan).filter(Boolean).length;
  const streakCount = streak?.currentStreak ?? quizStats?.streakDays ?? 14;

  let insightQuote = `You're strongest in ${strongestTopic}. Use that confidence under timed pressure before the week gets away from you.`;
  let insightSupporting = 'The strongest topic should not stay theoretical. Turning strength into fluency is what makes exam revision feel calmer later.';
  let insightHref = hasOsce ? '/osce' : '/quiz';
  let insightAction = hasOsce ? 'Run one timed station' : 'Open one short quiz';

  if (weakestTopic && weakestTopic.score < 60) {
    insightQuote = `${weakestTopic.topic} is still dragging your average down. Give it one precise set today.`;
    insightSupporting = 'You do not need a huge catch-up session. One deliberate rep here does more than another pass through material that already feels comfortable.';
    insightHref = hasQuiz ? `/quiz?topic=${encodeURIComponent(weakestTopic.topic)}` : '/pricing';
    insightAction = hasQuiz ? `Practise ${weakestTopic.topic}` : 'Unlock short quizzes';
  } else if (
    quizStats &&
    osceStats &&
    quizStats.averagePercent - osceStats.averageScore >= 6 &&
    hasOsce
  ) {
    insightQuote = 'Your quiz accuracy is ahead of your applied performance. Close that gap with a timed station.';
    insightSupporting = 'Recall is there. The next gain comes from practising under a little more structure and pressure.';
    insightHref = '/osce';
    insightAction = 'Launch OSCE practice';
  } else if (streakCount > 0 && streak?.lastStudyDate !== todayDateKey()) {
    insightQuote = `You've kept momentum for ${streakCount} days. Protect it with one focused session.`;
    insightSupporting = 'A short, deliberate study block is enough. The value is in preserving the habit while it still feels light.';
    insightHref = hasQuiz ? '/quiz' : '/hub';
    insightAction = hasQuiz ? 'Start a quick quiz' : 'Open the hub';
  }

  const continuePage = recentPages[0];
  const continueTitle = continuePage?.title ?? lastActivity?.label ?? 'Resume your study thread';
  const continueHref = continuePage?.href ?? lastActivity?.path ?? '/hub';
  const continueLastActive =
    continuePage?.timestamp != null
      ? formatRelativeTime(continuePage.timestamp)
      : lastActivity?.timestamp
      ? formatRelativeTime(lastActivity.timestamp)
      : 'No recent session yet';

  const continueDescription = continuePage
    ? `You already opened ${continuePage.title.toLowerCase()} recently. Returning here will cost you the least attention and give you the quickest sense of momentum.`
    : lastActivity
    ? `The last place you studied was ${lastActivity.label.toLowerCase()}. Treat this as the cleanest doorway back into revision instead of deciding from scratch again.`
    : 'Start somewhere small today. Once the first session exists, the dashboard can begin guiding you back intelligently.';

  const nextActionLabel = !plan.osceStation
    ? hasOsce
      ? 'Run one station'
      : 'Explore practical guides'
    : !plan.quizQuestions
    ? hasQuiz
      ? 'Start a short quiz'
      : 'Open a revision guide'
    : !plan.weakTopics
    ? 'Repair weak area'
    : continuePage
    ? 'Resume where you left off'
    : 'Open the hub';

  const nextActionHref = !plan.osceStation
    ? hasOsce
      ? '/osce'
      : '/hub/resources/ae-assessment-guide'
    : !plan.quizQuestions
    ? hasQuiz
      ? '/quiz'
      : '/hub'
    : !plan.weakTopics
    ? weakestTopic
      ? `/quiz?topic=${encodeURIComponent(weakestTopic.topic)}`
      : '/quiz'
    : continueHref;

  const trackItems: TrackItem[] = [
    {
      id: 'current',
      state: 'Current',
      eyebrow: 'Continue your track',
      title: continuePage?.title ?? lastActivity?.label ?? 'Your last open thread',
      description: continuePage
        ? 'Re-enter the exact page you were using, with no new decision required.'
        : 'The easiest return is usually the one that is already familiar.',
      href: continueHref,
      meta: continueLastActive,
      accent: '#7d9a88',
    },
    {
      id: 'next',
      state: 'Next',
      eyebrow: 'Recommended next',
      title: hasOsce ? `${strongestTopic} under pressure` : `Deepen ${strongestTopic}`,
      description: hasOsce
        ? `You already know the material. Now let it hold up in a more exam-like setting.`
        : `Use your strongest topic to build confidence before switching into weaker territory.`,
      href: hasOsce ? '/osce' : '/hub',
      meta: hasOsce ? 'Timed application' : 'Confidence builder',
      accent: '#d0a57b',
    },
    {
      id: 'weak',
      state: 'Weak area',
      eyebrow: 'Bring this up next',
      title: weakestTopic?.topic ?? quizStats?.weakestArea ?? 'Pharmacology',
      description: weakestTopic
        ? `${weakestTopic.score}% accuracy. A short repair session here will change the whole dashboard fastest.`
        : 'Still the clearest opportunity for quick improvement.',
      href: hasQuiz ? `/quiz?topic=${encodeURIComponent(weakestTopic?.topic ?? quizStats?.weakestArea ?? 'Pharmacology')}` : '/pricing',
      meta: hasQuiz ? 'Repair accuracy' : 'Unlock targeted quizzes',
      accent: '#b48372',
    },
    {
      id: 'quick-win',
      state: 'Quick win',
      eyebrow: 'When time is tight',
      title: 'Open one saved or familiar page',
      description: 'Use the lowest-friction action when you want momentum without committing to a full session.',
      href: recentPages[1]?.href ?? '/hub/resources/placement-survival',
      meta: '5-minute re-entry',
      accent: '#8da5b3',
    },
  ];

  function togglePlanItem(key: keyof DailyPlan) {
    const nextPlan = {
      ...plan,
      [key]: !plan[key],
    };

    setPlan(nextPlan);
    writeLocalStorage(STORAGE_KEYS.plan, {
      date: new Date().toDateString(),
      plan: nextPlan,
    });

    if (key === 'osceStation' && !plan.osceStation) {
      const nextActivity: LastActivity = {
        toolName: 'osce',
        path: '/osce',
        label: 'OSCE practice',
        timestamp: Date.now(),
      };
      setLastActivity(nextActivity);
      writeLocalStorage(STORAGE_KEYS.lastTool, nextActivity);
    }

    if (key === 'quizQuestions' && !plan.quizQuestions) {
      const nextActivity: LastActivity = {
        toolName: 'quiz',
        path: '/quiz',
        label: 'Core quiz',
        timestamp: Date.now(),
      };
      setLastActivity(nextActivity);
      writeLocalStorage(STORAGE_KEYS.lastTool, nextActivity);
    }

    if (
      Object.values(nextPlan).every(Boolean) &&
      !Object.values(plan).every(Boolean)
    ) {
      setStreak(recordStudySession());
    }
  }

  const mainMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[var(--charcoal)]">
      <Navbar />

      <main className="relative overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top_right,rgba(213,198,176,0.32),transparent_42%),radial-gradient(circle_at_top_left,rgba(171,195,178,0.18),transparent_38%),linear-gradient(180deg,#f7f2ea_0%,#f6f1e8_64%,#f3eee5_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-32 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[rgba(255,255,255,0.38)] blur-3xl" />

        <div className="relative mx-auto max-w-[1240px] px-5 pb-20 sm:px-8 lg:px-10">
          <motion.section
            {...mainMotion}
            className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]"
          >
            <div className="space-y-6">
              <div className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--charcoal)]/44">
                  {formatToday()}
                </p>
                <h1 className="mt-5 text-[clamp(3.4rem,8vw,6.2rem)] leading-[0.9] tracking-[-0.05em] text-[var(--espresso)]">
                  {firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
                </h1>
                <p className="mt-5 max-w-[42ch] text-[15px] leading-8 text-[var(--charcoal)]/72">
                  A premium study workspace for picking up the right thread, protecting momentum, and turning revision into something you actually want to open.
                </p>
              </div>

              <ContinueCard
                eyebrow="Resume your revision journey"
                title={continueTitle}
                description={continueDescription}
                href={continueHref}
                cta="Continue"
                progressCurrent={planCompleted}
                progressTotal={3}
                progressLabel={
                  planCompleted === 0
                    ? 'No study markers complete yet today.'
                    : `${planCompleted} of 3 daily study markers are already in motion.`
                }
                lastActiveLabel={continueLastActive}
                nextStep={
                  weakestTopic
                    ? `Repair ${weakestTopic.topic.toLowerCase()} or stay with this thread.`
                    : 'Take the smallest next action and let momentum build.'
                }
                contextLabel={streakMessage(streak, quizStats?.streakDays ?? 14)}
              />
            </div>

            <div className="space-y-5 pt-1">
              <InsightPanel
                quote={insightQuote}
                supporting={insightSupporting}
                actionHref={insightHref}
                actionLabel={insightAction}
              />
              <MomentumPanel
                currentStreak={streakCount}
                copy={streakMessage(streak, quizStats?.streakDays ?? 14)}
                weeklyHours={quizStats?.hoursThisWeek ?? 6}
              />
            </div>
          </motion.section>

          <section className="mt-20">
            <DashboardCarousel
              eyebrow="Based on your activity"
              title="Curated next steps, not filler."
              description="These recommendations are designed to keep you moving with minimal friction: continue the live thread, build on a strength, repair a weak area, or take the quick win."
              items={trackItems}
              renderItem={(item) => <TrackCard {...item} />}
            />
          </section>

          <section className="mt-20 grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
            <DayIntentPanel
              plan={plan}
              onToggle={togglePlanItem}
              nextActionHref={nextActionHref}
              nextActionLabel={nextActionLabel}
            />

            <div className="space-y-6">
              <FocusPanel
                weakestTopic={weakestTopic}
                fallbackTopic={quizStats?.weakestArea ?? 'Pharmacology'}
                hasQuiz={hasQuiz}
              />
              <QuickActionsPanel hasOsce={hasOsce} hasQuiz={hasQuiz} />
            </div>
          </section>

          <section className="mt-20 grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
            <ProgressStoryPanel
              quizStats={quizStats}
              osceStats={osceStats}
              topicStrength={topicStrength}
              streakCount={streakCount}
            />
            <RevisionWeekPanel />
          </section>

          <section className="mt-20 grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
            <ResourceDesk recentPages={recentPages} />
            <PlacementCard placementDate={placementDate} />
          </section>

          <section id="saved-library" className="mt-20">
            <SectionHeader
              eyebrow="Saved library"
              title="Your personal revision archive."
              copy="This is the part of the product that should feel collected, reusable, and quietly valuable over time rather than temporary."
            />
            <div className="mt-8 rounded-[40px] border border-[rgba(26,24,21,0.08)] bg-[rgba(250,247,241,0.82)] p-4 sm:p-6">
              <SavedFoldersDashboard showOverview={false} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
