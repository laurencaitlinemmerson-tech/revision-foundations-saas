import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import {
  ArrowRight,
  ClipboardCheck,
  BookOpen,
  Crown,
  Sparkles,
  Lock,
  Play
} from 'lucide-react';
import {
  ContinueCard,
  StudyTipCard,
  TodaysPlanCard,
  FocusAreasCard,
  CommunityStatsCard,
  QuickAchievement,
  StudyStreakCard,
} from '@/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard - track your progress and access your purchased content.',
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">{eyebrow}</p>
      )}
      <h2 className="font-display text-2xl text-[var(--espresso)]">{title}</h2>
      {description && <p className="text-sm text-gray-600 font-light mt-2 max-w-2xl">{description}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const firstName = user?.firstName || 'lovely';

  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');
  const hasAnyTool = hasOsce || hasQuiz;
  const hasFullAccess = hasOsce && hasQuiz;

  return (
    <DashboardClient firstName={firstName} hasAnyTool={hasAnyTool}>
      <div className="space-y-12 pt-6 md:pt-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#FEA85D] to-[#4F5D75] p-8 rounded-xl shadow-lg mb-12 text-center">
          <h1 className="text-4xl text-white font-semibold">Welcome back, {firstName}!</h1>
          <p className="text-lg text-white mt-4">Let's make today's revision count. Jump back into your tools and keep your streak alive.</p>
        </section>

        {/* Intro / Status */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="card bg-white border border-[var(--linen-deep)] p-6 rounded-xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center rounded-lg">
                <Sparkles className="w-7 h-7 text-[var(--espresso)]" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--espresso)] mb-2">Your revision space</h2>
                <p className="text-gray-600 text-sm">Everything important in one place — your tools, study plan, achievements, and next steps.</p>
              </div>
            </div>
          </div>

          <div className="card bg-[var(--linen-light)] border border-[var(--linen-deep)] p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{hasFullAccess ? '👑' : hasAnyTool ? '🎁' : '🌱'}</div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">Access status</p>
                <p className="text-[var(--espresso)] text-xl font-semibold">
                  {hasFullAccess
                    ? 'Full access unlocked'
                    : hasAnyTool
                    ? 'One tool unlocked'
                    : 'Free preview available'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Streak / Continue */}
        <section>
          <SectionHeading eyebrow="Start here" title="Pick up where you left off" description="The fastest way to get moving today." />
          <div className="grid md:grid-cols-2 gap-8">
            <StudyStreakCard />
            <ContinueCard />
          </div>
        </section>

        {/* Quick Launch Tools */}
        {hasAnyTool && (
          <section>
            <SectionHeading eyebrow="Your tools" title="Launch straight into practice" description="Jump into the tools you’ve unlocked without hunting around." />
            <div className="grid md:grid-cols-2 gap-8">
              {hasOsce && (
                <Link href="/osce" className="group card bg-white border border-[var(--linen-deep)] p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center rounded-xl">
                      <ClipboardCheck className="w-7 h-7 text-[var(--espresso)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[var(--espresso)] text-lg font-semibold">OSCE Tool</h3>
                      <p className="text-sm text-[var(--charcoal)] font-light">50+ stations · timed practice</p>
                    </div>
                    <div className="bg-[var(--espresso)] text-white px-4 py-2 text-sm rounded-lg flex items-center gap-2 hover:bg-[#3a2010] transition-colors">
                      Launch <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )}

              {hasQuiz && (
                <Link href="/quiz" className="group card bg-white border border-[var(--linen-deep)] p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center rounded-xl">
                      <BookOpen className="w-7 h-7 text-[var(--espresso)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[var(--espresso)] text-lg font-semibold">Core Quiz</h3>
                      <p className="text-sm text-[var(--charcoal)] font-light">17 topics · instant feedback</p>
                    </div>
                    <div className="bg-[var(--espresso)] text-white px-4 py-2 text-sm rounded-lg flex items-center gap-2 hover:bg-[#3a2010] transition-colors">
                      Launch <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Motivation Banner */}
        <section>
          <div className="card bg-white border border-[var(--linen-deep)] p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💜</div>
              <div className="flex-1">
                <p className="text-xl font-semibold text-[var(--espresso)]">Progress over perfection</p>
                <p className="text-sm text-[var(--charcoal)] font-light">
                  Even 10 focused minutes today moves you forward. Keep the momentum gentle and consistent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section>
          <SectionHeading eyebrow="Priority areas" title="Focus where it matters most" description="Use these areas to guide your next study block." />
          <FocusAreasCard />
        </section>

        {/* Quick Actions */}
        <section>
          <SectionHeading eyebrow="Shortcuts" title="Quick actions" description="The pages you’re most likely to need next." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/hub" className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group">
              <div className="w-8 h-8 bg-[var(--linen-light)] mx-auto mb-4 rounded-full">
                <Sparkles className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--espresso)]">Nursing Hub</p>
              <p className="text-xs text-[var(--charcoal)] font-light">Resources &amp; Q&amp;A</p>
            </Link>
            <Link href="/how-to-use" className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group">
              <div className="w-8 h-8 bg-[var(--linen-light)] mx-auto mb-4 rounded-full">
                <Play className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--espresso)]">How to use</p>
              <p className="text-xs text-[var(--charcoal)] font-light">2-min tour</p>
            </Link>
            <Link href="/contact" className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group">
              <div className="w-8 h-8 bg-[var(--linen-light)] mx-auto mb-4 rounded-full">
                <Lock className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--espresso)]">Get Help</p>
              <p className="text-xs text-[var(--charcoal)] font-light">WhatsApp</p>
            </Link>
            <Link href="/review" className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group">
              <div className="w-8 h-8 bg-[var(--linen-light)] mx-auto mb-4 rounded-full">
                <Crown className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--espresso)]">Leave Review</p>
              <p className="text-xs text-[var(--charcoal)] font-light">30 seconds</p>
            </Link>
          </div>
        </section>

        {/* Study Tip */}
        <section className="pb-16">
          <SectionHeading eyebrow="Daily boost" title="A quick study tip" description="A small reminder to help you revise a little smarter." />
          <StudyTipCard />
        </section>
      </div>
    </DashboardClient>
  );
}
