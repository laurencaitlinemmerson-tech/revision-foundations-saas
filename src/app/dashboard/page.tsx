import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { BookOpen, ClipboardCheck, Sparkles, ArrowRight, Lock, Crown, Zap, Heart } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');
  const hasBundle = entitlements.some(e => e.product === 'bundle');
  const totalOwned = (hasOsce ? 1 : 0) + (hasQuiz ? 1 : 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="card mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--lavender-dark)] via-[var(--pink)] to-[var(--lavender-dark)]" />
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl mb-2 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
              Welcome Back!
            </h1>
            <p className="text-[var(--text-medium)]">
              Ready to ace those exams? Let's go! ✨
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card text-center py-6">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-[var(--purple-accent)]" style={{ fontFamily: 'Fraunces, serif' }}>
                {totalOwned}
              </div>
              <p className="text-xs text-[var(--text-light)] mt-1">Tools Owned</p>
            </div>
            <div className="card text-center py-6">
              <div className="text-3xl mb-2">{hasBundle ? '👑' : '💜'}</div>
              <div className="text-2xl font-bold text-[var(--purple-accent)]" style={{ fontFamily: 'Fraunces, serif' }}>
                {hasBundle ? 'Bundle' : totalOwned === 2 ? 'Both!' : totalOwned === 1 ? '1 Tool' : 'None'}
              </div>
              <p className="text-xs text-[var(--text-light)] mt-1">Your Plan</p>
            </div>
            <div className="card text-center py-6">
              <div className="text-3xl mb-2">∞</div>
              <div className="text-2xl font-bold text-[var(--purple-accent)]" style={{ fontFamily: 'Fraunces, serif' }}>
                Forever
              </div>
              <p className="text-xs text-[var(--text-light)] mt-1">Access</p>
            </div>
          </div>

          {/* Tools */}
          <h2 className="text-xl mb-4 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
            Your Tools
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* OSCE Card */}
            <div className={`card relative overflow-hidden ${hasOsce ? 'border-2 border-green-300' : ''}`}>
              {hasOsce && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Unlocked
                  </span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="icon-box flex-shrink-0">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-1 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                    OSCE Tool
                  </h3>
                  <p className="text-sm text-[var(--text-medium)] mb-4">
                    Practice stations with checklists
                  </p>
                  {hasOsce ? (
                    <Link href="/osce" className="btn-primary text-sm px-5 py-2.5">
                      <Zap className="w-4 h-4" />
                      Open Tool
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/osce" className="btn-secondary text-sm px-4 py-2">
                        <Lock className="w-3.5 h-3.5" />
                        Preview
                      </Link>
                      <Link href="/pricing?product=osce" className="btn-primary text-sm px-4 py-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Unlock
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Card */}
            <div className={`card relative overflow-hidden ${hasQuiz ? 'border-2 border-green-300' : ''}`}>
              {hasQuiz && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Unlocked
                  </span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="icon-box flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-1 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                    Theory Quiz
                  </h3>
                  <p className="text-sm text-[var(--text-medium)] mb-4">
                    17 topics with instant feedback
                  </p>
                  {hasQuiz ? (
                    <Link href="/quiz" className="btn-primary text-sm px-5 py-2.5">
                      <Zap className="w-4 h-4" />
                      Open Tool
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/quiz" className="btn-secondary text-sm px-4 py-2">
                        <Lock className="w-3.5 h-3.5" />
                        Preview
                      </Link>
                      <Link href="/pricing?product=quiz" className="btn-primary text-sm px-4 py-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Unlock
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          {(!hasOsce || !hasQuiz) && !hasBundle && (
            <div className="card bg-gradient-to-r from-[var(--lavender)]/30 to-[var(--pink)]/30 border-2 border-[var(--lavender)]/50 text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-lg mb-2 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                {totalOwned === 0 ? 'Get Started!' : 'Want both tools?'}
              </h3>
              <p className="text-sm text-[var(--text-medium)] mb-4">
                {totalOwned === 0
                  ? 'Unlock your revision tools and start studying!'
                  : 'Get the bundle and save £2!'}
              </p>
              <Link href="/pricing" className="btn-primary">
                <Sparkles className="w-4 h-4" />
                View Pricing
              </Link>
            </div>
          )}

          {/* All unlocked celebration */}
          {(hasOsce && hasQuiz) && (
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg mb-2 text-green-800" style={{ fontFamily: 'Fraunces, serif' }}>
                You have full access!
              </h3>
              <p className="text-sm text-green-700">
                All tools unlocked forever. Happy revising! 💜
              </p>
            </div>
          )}

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--text-light)] mb-2">
              Need help or have questions?
            </p>
            <Link href="/contact" className="text-sm text-[var(--purple-accent)] hover:underline inline-flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              Get in touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
