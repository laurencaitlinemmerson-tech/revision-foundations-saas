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
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-3 text-[var(--text-dark)]">Welcome Back! 👋</h1>
            <p className="text-[var(--text-medium)]">
              Continue your nursing revision journey.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* OSCE Tool Card */}
            <div className="card relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="icon-box">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                {hasOsce ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-[var(--lavender)]/20 text-[var(--purple-accent)] px-3 py-1.5 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Free Preview
                  </span>
                )}
              </div>

              <h2 className="text-2xl mb-3 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                Children&apos;s OSCE Tool
              </h2>
              <p className="text-[var(--text-medium)] mb-6">
                Practice OSCE stations with detailed checklists and step-by-step guidance.
              </p>

              <div className="flex gap-3">
                <Link href="/osce" className="btn-primary flex-1 justify-center">
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
            <div className="card relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="icon-box">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                {hasQuiz ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-[var(--lavender)]/20 text-[var(--purple-accent)] px-3 py-1.5 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Free Preview
                  </span>
                )}
              </div>

              <h2 className="text-2xl mb-3 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                Nursing Theory Quiz
              </h2>
              <p className="text-[var(--text-medium)] mb-6">
                Test your knowledge with topic-based quizzes and instant feedback.
              </p>

              <div className="flex gap-3">
                <Link href="/quiz" className="btn-primary flex-1 justify-center">
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
          <div className="card">
            <h2 className="text-xl mb-6 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
              Your Access
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-2xl bg-white/50">
                <div className="text-3xl font-bold text-[var(--purple-accent)] mb-1">
                  {hasOsce ? '✓' : '—'}
                </div>
                <p className="text-sm text-[var(--text-medium)]">OSCE Tool</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/50">
                <div className="text-3xl font-bold text-[var(--purple-accent)] mb-1">
                  {hasQuiz ? '✓' : '—'}
                </div>
                <p className="text-sm text-[var(--text-medium)]">Quiz Tool</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/50">
                <div className="text-3xl font-bold text-[var(--purple-accent)] mb-1">
                  {entitlements.length}
                </div>
                <p className="text-sm text-[var(--text-medium)]">Products Owned</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/50">
                <div className="text-3xl font-bold text-[var(--purple-accent)] mb-1">
                  ∞
                </div>
                <p className="text-sm text-[var(--text-medium)]">Lifetime Access</p>
              </div>
            </div>
          </div>

          {/* Upgrade CTA (if not fully unlocked) */}
          {(!hasOsce || !hasQuiz) && (
            <div className="mt-8 card bg-gradient-to-r from-[var(--lavender)]/20 to-[var(--pink)]/20 border-[var(--lavender)]/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl mb-2 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                    Unlock Full Access
                  </h3>
                  <p className="text-[var(--text-medium)]">
                    Get unlimited access to all content with our premium tools.
                  </p>
                </div>
                <Link href="/pricing" className="btn-primary whitespace-nowrap">
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
