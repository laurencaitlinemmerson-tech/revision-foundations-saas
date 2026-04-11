import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import type { OsceStats, QuizStats, TopicStrength } from '@/components/dashboard/dashboardTypes';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'A premium study workspace for revision, progress, and next-step guidance.',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const firstName = user?.firstName ?? null;

  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');

  const quizStats = await getUserQuizStats(userId).catch(() => null);
  const osceStats = await getUserOsceStats(userId).catch(() => null);

  const topicStrength: TopicStrength[] = quizStats?.topicBreakdown ?? [
    { label: 'Respiratory', pct: 78, color: '#799783' },
    { label: 'Cardiac', pct: 71, color: '#d1a073' },
    { label: 'Neurological', pct: 64, color: '#8ca8ba' },
    { label: 'Pharmacology', pct: 52, color: '#b48d80' },
  ];

  return (
    <DashboardClient
      firstName={firstName}
      hasOsce={hasOsce}
      hasQuiz={hasQuiz}
      quizStats={quizStats}
      osceStats={osceStats}
      topicStrength={topicStrength}
    />
  );
}

async function getUserQuizStats(_userId: string): Promise<QuizStats | null> {
  void _userId;
  return {
    totalAnswered: 184,
    averagePercent: 74,
    weekOnWeekDelta: 6,
    streakDays: 14,
    hoursThisWeek: 6,
    strongestArea: 'Respiratory',
    weakestArea: 'Pharmacology',
    topicBreakdown: [
      { label: 'Respiratory', pct: 78, color: '#799783' },
      { label: 'Cardiac', pct: 71, color: '#d1a073' },
      { label: 'Neurological', pct: 64, color: '#8ca8ba' },
      { label: 'Pharmacology', pct: 52, color: '#b48d80' },
    ],
  };
}

async function getUserOsceStats(_userId: string): Promise<OsceStats | null> {
  void _userId;
  return {
    totalRuns: 11,
    averageScore: 68,
    monthOnMonthDelta: 3,
  };
}
