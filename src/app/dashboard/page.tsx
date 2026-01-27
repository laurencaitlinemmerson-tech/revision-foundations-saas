import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
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
  Star,
  HelpCircle,
  Award,
} from 'lucide-react';
import {
  WeeklyProgress,
  ContinueCard,
  StudyTipCard,
  WavingHand,
} from '@/components/DashboardWidgets';

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
  const hasBundle = entitlements.some(e => e.product === 'bundle');
  const hasAnyTool = hasOsce || hasQuiz;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Welcome Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <WavingHand />
              <h1 className="text-2xl md:text-3xl">Hey, {firstName}!</h1>
            </div>
            <WeeklyProgress />
          </div>

          {/* Continue Card - Only show if user has tools */}
          {hasAnyTool && <ContinueCard />}

          {/* Quick Launch - Only show if user has tools */}
          {hasAnyTool && (
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {/* OSCE Tool - Primary/Larger */}
              {hasOsce && (
                <Link
                  href="/osce"
                  className="md:col-span-3 group card card-glow gradient-hero hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <Award className="w-3 h-3" />
                      Most popular
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ClipboardCheck className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">OSCE Tool</h3>
                        <p className="text-white/70 text-sm">Timed stations • examiner checklists • feedback</p>
                      </div>
                    </div>
                    <div className="bg-white text-[var(--purple)] px-5 py-2.5 rounded-full font-semibold text-sm group-hover:bg-white/95 transition-all flex items-center gap-2 group-hover:gap-3">
                      Launch
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )}

              {/* Core Quiz - Secondary/Smaller */}
              {hasQuiz && (
                <Link
                  href="/quiz"
                  className={`${hasOsce ? 'md:col-span-2' : 'md:col-span-3'} group card gradient-hero hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2`}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">Core Quiz</h3>
                        <p className="text-white/70 text-sm">Quick recall • exam-focused questions</p>
                      </div>
                    </div>
                    <div className="bg-white text-[var(--purple)] px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-white/95 transition-all flex items-center gap-2 group-hover:gap-3">
                      Launch
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Status Banner */}
          {(hasOsce && hasQuiz) ? (
            <div className="card bg-[var(--mint)]/20 border-2 border-[var(--mint)] mb-8 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-green-800">Full Access Unlocked!</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    You have lifetime access to all tools. Happy revising!
                  </p>
                </div>
              </div>
            </div>
          ) : hasAnyTool ? (
            <div className="card bg-[var(--lilac-soft)] border border-[var(--lavender)] mb-8 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <h3 className="font-semibold text-[var(--plum)]">Want both tools?</h3>
                    <p className="text-sm text-[var(--plum-dark)]/70">
                      Get the bundle and save £1!
                    </p>
                  </div>
                </div>
                <Link href="/pricing" className="btn-primary text-sm focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                  <Gift className="w-4 h-4" />
                  View Bundle
                </Link>
              </div>
            </div>
          ) : null}

          {/* Tools Section - Show locked tools or get started */}
          {!hasAnyTool ? (
            // No tools yet - show get started
            <div className="card text-center py-12 mb-8 hover:shadow-md transition-all duration-200">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-xl mb-2">Ready to start revising?</h2>
              <p className="text-[var(--plum-dark)]/70 mb-6 max-w-md mx-auto">
                Unlock your study tools and feel confident walking into your exams and placements!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/pricing" className="btn-primary focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                  <Sparkles className="w-5 h-5" />
                  Get Started - £4.99
                </Link>
                <Link href="/osce" className="btn-secondary focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                  <Play className="w-4 h-4" />
                  Try Free Preview
                </Link>
              </div>
            </div>
          ) : (!hasOsce || !hasQuiz) ? (
            // Has one tool, show the locked one
            <div className="mb-8">
              <h2 className="text-lg mb-4 text-[var(--plum-dark)]/70">Unlock more tools</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {!hasOsce && (
                  <div className="card border-2 border-dashed border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6 text-[var(--purple)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">OSCE Tool</h3>
                        <p className="text-sm text-[var(--plum-dark)]/60">Timed stations • examiner checklists</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/osce" className="btn-secondary text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                        <Play className="w-4 h-4" />
                        Try Preview
                      </Link>
                      <Link href="/pricing?product=osce" className="btn-primary text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                        <Sparkles className="w-4 h-4" />
                        Unlock £4.99
                      </Link>
                    </div>
                  </div>
                )}
                {!hasQuiz && (
                  <div className="card border-2 border-dashed border-[var(--lilac-medium)] hover:border-[var(--lavender)] hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-[var(--purple)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Core Quiz</h3>
                        <p className="text-sm text-[var(--plum-dark)]/60">Quick recall • exam-focused questions</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/quiz" className="btn-secondary text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                        <Play className="w-4 h-4" />
                        Try Preview
                      </Link>
                      <Link href="/pricing?product=quiz" className="btn-primary text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2">
                        <Sparkles className="w-4 h-4" />
                        Unlock £4.99
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              href="/about"
              className="card text-center py-5 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2"
            >
              <HelpCircle className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">How to use this</p>
            </Link>
            <Link
              href="/contact"
              className="card text-center py-5 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2"
            >
              <MessageCircle className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Get Help</p>
            </Link>
            <a
              href="https://wa.me/447572650980"
              target="_blank"
              rel="noopener noreferrer"
              className="card text-center py-5 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2"
            >
              <Heart className="w-6 h-6 text-[var(--pink)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Say Hi!</p>
            </a>
            <Link
              href="/review"
              className="card text-center py-5 hover:border-[var(--lavender)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2"
            >
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-[var(--plum)]">Leave Review</p>
            </Link>
          </div>

          {/* Study Tip */}
          <StudyTipCard />

        </div>
      </main>
    </div>
  );
}
