import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { BookOpen, ClipboardCheck, Sparkles, ArrowRight, Lock, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold text-[var(--plum-text)] mb-2">
              Welcome Back!
            </h1>
            <p className="text-[var(--plum-text)]/70">
              Continue your nursing revision journey.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* OSCE Tool Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                {hasOsce ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[var(--lilac-tint)] text-[var(--lavender-primary)] px-3 py-1 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Free Preview
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-[var(--plum-text)] mb-2">
                Children&apos;s OSCE Tool
              </h2>
              <p className="text-[var(--plum-text)]/70 mb-6">
                Practice OSCE stations with detailed checklists and step-by-step guidance.
              </p>

              <div className="flex gap-3">
                <Link href="/osce" className="btn-gradient flex-1 justify-center">
                  {hasOsce ? 'Continue Practice' : 'Try Preview'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {!hasOsce && (
                  <Link href="/pricing?product=osce" className="btn-secondary">
                    <Sparkles className="w-4 h-4" />
                    Unlock
                  </Link>
                )}
              </div>
            </div>

            {/* Quiz Tool Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                {hasQuiz ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[var(--lilac-tint)] text-[var(--lavender-primary)] px-3 py-1 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Free Preview
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-[var(--plum-text)] mb-2">
                Nursing Theory Quiz
              </h2>
              <p className="text-[var(--plum-text)]/70 mb-6">
                Test your knowledge with topic-based quizzes and instant feedback.
              </p>

              <div className="flex gap-3">
                <Link href="/quiz" className="btn-gradient flex-1 justify-center">
                  {hasQuiz ? 'Continue Quiz' : 'Try Preview'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                {!hasQuiz && (
                  <Link href="/pricing?product=quiz" className="btn-secondary">
                    <Sparkles className="w-4 h-4" />
                    Unlock
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold text-[var(--plum-text)] mb-6">
              Your Access
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--lavender-primary)]">
                  {hasOsce ? '✓' : '—'}
                </div>
                <p className="text-sm text-[var(--plum-text)]/70 mt-1">OSCE Tool</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--lavender-primary)]">
                  {hasQuiz ? '✓' : '—'}
                </div>
                <p className="text-sm text-[var(--plum-text)]/70 mt-1">Quiz Tool</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--lavender-primary)]">
                  {entitlements.length}
                </div>
                <p className="text-sm text-[var(--plum-text)]/70 mt-1">Products Owned</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--lavender-primary)]">
                  ∞
                </div>
                <p className="text-sm text-[var(--plum-text)]/70 mt-1">Lifetime Access</p>
              </div>
            </div>
          </div>

          {/* Upgrade CTA (if not fully unlocked) */}
          {(!hasOsce || !hasQuiz) && (
            <div className="mt-8 glass-card p-8 bg-gradient-to-r from-[var(--purple-gradient-start)]/10 to-[var(--purple-gradient-end)]/10 border-[var(--lavender-primary)]/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--plum-text)] mb-2">
                    Unlock Full Access
                  </h3>
                  <p className="text-[var(--plum-text)]/70">
                    Get unlimited access to all content with our premium tools.
                  </p>
                </div>
                <Link href="/pricing" className="btn-gradient whitespace-nowrap">
                  <Sparkles className="w-5 h-5" />
                  View Pricing
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
