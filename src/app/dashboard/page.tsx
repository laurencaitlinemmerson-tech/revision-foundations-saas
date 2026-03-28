import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

import {
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Play,
  Crown,
  Heart,
  MessageCircle,
  Gift,
  HelpCircle,
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

  return (
    <DashboardClient firstName={firstName}>
      <div className="space-y-8 pt-6 md:pt-10">
        {/* Study Streak Card - show for users with tools */}
        {hasAnyTool && (
          <div className="grid md:grid-cols-2 gap-4">
            <StudyStreakCard />
            <ContinueCard />
          </div>
        )}

        {/* Continue Where You Left Off - only show if no tools yet */}
        {!hasAnyTool && <ContinueCard />}

        {/* Quick Launch Tools Grid */}
        {hasAnyTool && (
          <div className="grid md:grid-cols-2 gap-4">
            {hasOsce && (
              <Link
                href="/osce"
                className="group card transition-colors duration-200 bg-white border border-[var(--linen-deep)] hover:border-[var(--linen-medium)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center" style={{ borderRadius: '8px' }}>
                    <ClipboardCheck className="w-7 h-7 text-[var(--espresso)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--espresso)] text-lg font-display">OSCE Tool</h3>
                    <p className="text-[var(--charcoal)] text-sm font-light">50+ stations &middot; timed practice</p>
                  </div>
                  <div className="bg-[var(--espresso)] text-white px-4 py-2 text-sm transition-colors flex items-center gap-2 hover:bg-[#3a2010]" style={{ borderRadius: '8px' }}>
                    Launch <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {hasQuiz && (
              <Link
                href="/quiz"
                className="group card transition-colors duration-200 bg-white border border-[var(--linen-deep)] hover:border-[var(--linen-medium)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center" style={{ borderRadius: '8px' }}>
                    <BookOpen className="w-7 h-7 text-[var(--espresso)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--espresso)] text-lg font-display">Core Quiz</h3>
                    <p className="text-[var(--charcoal)] text-sm font-light">17 topics &middot; instant feedback</p>
                  </div>
                  <div className="bg-[var(--espresso)] text-white px-4 py-2 text-sm transition-colors flex items-center gap-2 hover:bg-[#3a2010]" style={{ borderRadius: '8px' }}>
                    Launch <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Status Banner */}
        {hasOsce && hasQuiz ? (
          <div className="card bg-[var(--linen-light)] border border-[var(--linen-deep)]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-[var(--espresso)]" />
                  <h3 className="font-display text-[var(--espresso)]">Full Access Unlocked</h3>
                </div>
                <p className="text-sm text-[var(--charcoal)] font-light">You have lifetime access to all tools. Happy revising!</p>
              </div>
            </div>
          </div>
        ) : hasAnyTool ? (
          <div className="card bg-white border border-[var(--linen-deep)]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎁</div>
                <div>
                  <h3 className="font-display text-[var(--espresso)]">Want both tools?</h3>
                  <p className="text-sm text-[var(--charcoal)] font-light">Get the bundle and save!</p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-[var(--espresso)] text-white px-5 py-2.5 text-sm hover:bg-[#3a2010] transition-colors flex items-center gap-2"
                style={{ borderRadius: '8px' }}
              >
                <Gift className="w-4 h-4" />
                View Bundle
              </Link>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12 bg-white border border-[var(--linen-deep)]">
            <h2 className="text-xl font-display text-[var(--espresso)] mb-2">No tools unlocked yet</h2>
            <p className="text-[var(--charcoal)] font-light mb-6 max-w-md mx-auto">
              There&rsquo;s a free preview if you want to try before you buy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="bg-[var(--espresso)] text-white px-6 py-3 hover:bg-[#3a2010] transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: '8px' }}
              >
                See pricing
              </Link>
              <Link
                href="/osce"
                className="bg-white border border-[var(--linen-deep)] text-[var(--espresso)] px-6 py-3 hover:border-[var(--linen-medium)] transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: '8px' }}
              >
                <Play className="w-4 h-4" />
                Try Free Preview
              </Link>
            </div>
          </div>
        )}

        {/* Unlock more tools - Only show if has one but not both */}
        {hasAnyTool && (!hasOsce || !hasQuiz) && (
          <div>
            <h2 className="text-[11px] text-[var(--charcoal)] uppercase tracking-[0.14em] mb-3" style={{ fontFamily: 'var(--font-source-serif, serif)' }}>
              Unlock more tools
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {!hasOsce && (
                <div className="card border border-[var(--linen-deep)] hover:border-[var(--linen-medium)] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[var(--linen-light)] flex items-center justify-center" style={{ borderRadius: '8px' }}>
                      <ClipboardCheck className="w-6 h-6 text-[var(--espresso)]" />
                    </div>
                    <div>
                      <h3 className="font-display text-[var(--espresso)]">OSCE Tool</h3>
                      <p className="text-sm text-[var(--charcoal)] font-light">50+ timed stations</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/osce"
                      className="flex-1 bg-white border border-[var(--linen-deep)] text-[var(--espresso)] px-4 py-2 text-sm hover:border-[var(--linen-medium)] transition-colors flex items-center justify-center gap-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <Play className="w-4 h-4" /> Preview
                    </Link>
                    <Link
                      href="/pricing?product=osce"
                      className="flex-1 bg-[var(--espresso)] text-white px-4 py-2 text-sm hover:bg-[#3a2010] transition-colors flex items-center justify-center gap-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <ArrowRight className="w-4 h-4" /> Unlock
                    </Link>
                  </div>
                </div>
              )}

              {!hasQuiz && (
                <div className="card border border-[var(--linen-deep)] hover:border-[var(--linen-medium)] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[var(--linen-light)] flex items-center justify-center" style={{ borderRadius: '8px' }}>
                      <BookOpen className="w-6 h-6 text-[var(--espresso)]" />
                    </div>
                    <div>
                      <h3 className="font-display text-[var(--espresso)]">Core Quiz</h3>
                      <p className="text-sm text-[var(--charcoal)] font-light">17 topic areas</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/quiz"
                      className="flex-1 bg-white border border-[var(--linen-deep)] text-[var(--espresso)] px-4 py-2 text-sm hover:border-[var(--linen-medium)] transition-colors flex items-center justify-center gap-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <Play className="w-4 h-4" /> Preview
                    </Link>
                    <Link
                      href="/pricing?product=quiz"
                      className="flex-1 bg-[var(--espresso)] text-white px-4 py-2 text-sm hover:bg-[#3a2010] transition-colors flex items-center justify-center gap-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <ArrowRight className="w-4 h-4" /> Unlock
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid - 2 columns on desktop */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TodaysPlanCard />
          <div className="space-y-6">
            <QuickAchievement />
            <CommunityStatsCard />
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="card bg-white border border-[var(--linen-deep)]">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💜</div>
            <div className="flex-1">
              <p className="text-[var(--espresso)] font-display">Remember: progress over perfection!</p>
              <p className="text-sm text-[var(--charcoal)] font-light">
                Even 10 minutes of revision today is better than none. You've got this!
              </p>
            </div>
          </div>
        </div>

        {/* Focus Areas - Full Width */}
        <FocusAreasCard />

        {/* Quick Actions */}
        <div>
          <h2 className="text-[11px] text-[var(--charcoal)] uppercase tracking-[0.14em] mb-4" style={{ fontFamily: 'var(--font-source-serif, serif)' }}>
            Quick actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/hub"
              className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group"
            >
              <BookOpen className="w-6 h-6 text-[var(--espresso)] mx-auto mb-2" />
              <p className="text-sm font-display text-[var(--espresso)]">Nursing Hub</p>
              <p className="text-xs text-[var(--charcoal)] font-light mt-1">Resources &amp; Q&amp;A</p>
            </Link>

            <Link
              href="/how-to-use"
              className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group"
            >
              <HelpCircle className="w-6 h-6 text-[var(--espresso)] mx-auto mb-2" />
              <p className="text-sm font-display text-[var(--espresso)]">How to use</p>
              <p className="text-xs text-[var(--charcoal)] font-light mt-1">2-min tour</p>
            </Link>

            <Link
              href="/contact"
              className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group"
            >
              <MessageCircle className="w-6 h-6 text-[var(--espresso)] mx-auto mb-2" />
              <p className="text-sm font-display text-[var(--espresso)]">Get Help</p>
              <p className="text-xs text-[var(--charcoal)] font-light mt-1">WhatsApp</p>
            </Link>

            <Link
              href="/review"
              className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group"
            >
              <Heart className="w-6 h-6 text-[var(--espresso)] mx-auto mb-2" />
              <p className="text-sm font-display text-[var(--espresso)]">Leave Review</p>
              <p className="text-xs text-[var(--charcoal)] font-light mt-1">30 seconds</p>
            </Link>
          </div>
        </div>

        {/* Study Tip */}
        <div className="pb-16">
          <StudyTipCard />
        </div>
      </div>
    </DashboardClient>
  );
}
