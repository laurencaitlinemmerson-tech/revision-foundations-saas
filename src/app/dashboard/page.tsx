import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

import {
  BookOpen,
  ClipboardCheck,
  Sparkles,
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
} from '@/components/DashboardWidgets';
import PlacementSurvivalDashboardCard from '@/components/PlacementSurvivalDashboardCard';

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
      {/* ✅ Adds a little breathing room below the hero before the first card */}
      <div className="space-y-8 pt-6 md:pt-10">
        {/* Continue Where You Left Off */}
        {hasAnyTool && <ContinueCard />}

        {/* Quick Launch Tools Grid */}
        {hasAnyTool && (
          <div className="grid md:grid-cols-2 gap-4">
            {hasOsce && (
              <Link
                href="/osce"
                className="group card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--lilac-soft)] via-[var(--lilac)] to-[var(--lavender)]/60 border-[var(--lavender)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-7 h-7 text-[var(--purple)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--plum)] text-lg font-semibold">OSCE Tool</h3>
                    <p className="text-[var(--plum-dark)]/70 text-sm">50+ stations • timed practice</p>
                  </div>
                  <div className="bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-[var(--plum)] transition-all flex items-center gap-2">
                    Launch <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {hasQuiz && (
              <Link
                href="/quiz"
                className="group card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--lilac-soft)] via-[var(--lilac)] to-[var(--lavender)]/60 border-[var(--lavender)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-7 h-7 text-[var(--purple)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--plum)] text-lg font-semibold">Core Quiz</h3>
                    <p className="text-[var(--plum-dark)]/70 text-sm">17 topics • instant feedback</p>
                  </div>
                  <div className="bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-[var(--plum)] transition-all flex items-center gap-2">
                    Launch <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Status Banner */}
        {hasOsce && hasQuiz ? (
          <div className="card bg-[var(--mint)]/20 border-2 border-[var(--mint)]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-green-800">Full Access Unlocked!</h3>
                </div>
                <p className="text-sm text-green-700">You have lifetime access to all tools. Happy revising!</p>
              </div>
            </div>
          </div>
        ) : hasAnyTool ? (
          <div className="card bg-[var(--lilac-soft)] border border-[var(--lavender)]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎁</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)]">Want both tools?</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Get the bundle and save!</p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                View Bundle
              </Link>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12 bg-gradient-to-br from-[var(--lilac-soft)] to-white">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-semibold text-[var(--plum)] mb-2">Ready to start revising?</h2>
            <p className="text-[var(--plum-dark)]/70 mb-6 max-w-md mx-auto">
              Unlock your study tools and feel confident walking into your exams and placements!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Started - £4.99
              </Link>
              <Link
                href="/osce"
                className="bg-white border-2 border-[var(--lilac-medium)] text-[var(--plum)] px-6 py-3 rounded-full font-semibold hover:border-[var(--lavender)] transition-all flex items-center justify-center gap-2"
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
            <h2 className="text-sm font-semibold text-[var(--plum-dark)]/60 uppercase tracking-wide mb-3">
              Unlock more tools
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {!hasOsce && (
                <div className="card border-2 border-dashed border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-[var(--purple)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--plum)]">OSCE Tool</h3>
                      <p className="text-sm text-[var(--plum-dark)]/60">50+ timed stations</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/osce"
                      className="flex-1 bg-white border-2 border-[var(--lilac-medium)] text-[var(--plum)] px-4 py-2 rounded-full font-semibold text-sm hover:border-[var(--lavender)] transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Preview
                    </Link>
                    <Link
                      href="/pricing?product=osce"
                      className="flex-1 bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Unlock
                    </Link>
                  </div>
                </div>
              )}

              {!hasQuiz && (
                <div className="card border-2 border-dashed border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[var(--purple)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--plum)]">Core Quiz</h3>
                      <p className="text-sm text-[var(--plum-dark)]/60">17 topic areas</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/quiz"
                      className="flex-1 bg-white border-2 border-[var(--lilac-medium)] text-[var(--plum)] px-4 py-2 rounded-full font-semibold text-sm hover:border-[var(--lavender)] transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Preview
                    </Link>
                    <Link
                      href="/pricing?product=quiz"
                      className="flex-1 bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Unlock
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
        <div className="card bg-gradient-to-r from-[var(--lilac-soft)] via-white to-[var(--pink-soft)]/50 border-[var(--lavender)]/50">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💜</div>
            <div className="flex-1">
              <p className="text-[var(--plum)] font-medium">Remember: progress over perfection!</p>
              <p className="text-sm text-[var(--plum-dark)]/60">
                Even 10 minutes of revision today is better than none. You've got this!
              </p>
            </div>
          </div>
        </div>

        {/* Placement Survival Guide - Lauren only */}
        <div className="card mt-8">
          <h2 className="text-xl font-bold text-[var(--plum)] mb-4">Placement Survival Guide</h2>
          <PlacementSurvivalDashboardCard />
        </div>

        {/* Focus Areas - Full Width */}
        <FocusAreasCard />

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--plum-dark)]/60 uppercase tracking-wide mb-4">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/hub"
              className="card text-center py-6 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <Sparkles className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Nursing Hub</p>
              <p className="text-xs text-[var(--plum-dark)]/50 mt-1">Resources & Q&A</p>
            </Link>

            <Link
              href="/how-to-use"
              className="card text-center py-6 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <HelpCircle className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">How to use</p>
              <p className="text-xs text-[var(--plum-dark)]/50 mt-1">2-min tour</p>
            </Link>

            <Link
              href="/contact"
              className="card text-center py-6 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <MessageCircle className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Get Help</p>
              <p className="text-xs text-[var(--plum-dark)]/50 mt-1">WhatsApp</p>
            </Link>

            <Link
              href="/review"
              className="card text-center py-6 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <Heart className="w-6 h-6 text-[var(--pink)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Leave Review</p>
              <p className="text-xs text-[var(--plum-dark)]/50 mt-1">30 seconds</p>
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
