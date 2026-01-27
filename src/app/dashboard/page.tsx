import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import { BookOpen, ClipboardCheck, Sparkles, ArrowRight, Lock, Crown, Heart } from 'lucide-react';

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
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="card mb-8 text-center gradient-hero">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-white mb-2">Welcome Back!</h1>
            <p className="text-white/80">
              Ready to ace those exams? Let's go! ✨
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card text-center py-5">
              <div className="text-3xl mb-2">📚</div>
              <div className="stat-number text-2xl">{totalOwned}</div>
              <p className="text-xs text-[var(--plum-dark)]/60 mt-1">Tools Owned</p>
            </div>
            <div className="card text-center py-5">
              <div className="text-3xl mb-2">{hasBundle ? '👑' : '💜'}</div>
              <div className="stat-number text-2xl">
                {hasBundle ? 'Bundle' : totalOwned === 2 ? 'Both!' : totalOwned === 1 ? '1 Tool' : 'None'}
              </div>
              <p className="text-xs text-[var(--plum-dark)]/60 mt-1">Your Plan</p>
            </div>
            <div className="card text-center py-5">
              <div className="text-3xl mb-2">∞</div>
              <div className="stat-number text-2xl">Forever</div>
              <p className="text-xs text-[var(--plum-dark)]/60 mt-1">Access</p>
            </div>
          </div>

          {/* Tools */}
          <h2 className="text-xl mb-4">Your Tools</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* OSCE Card */}
            <div className={`card relative ${hasOsce ? 'border-[var(--mint)] border-2' : ''}`}>
              {hasOsce && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-[var(--mint)] text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
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
                  <h3 className="text-lg mb-1">OSCE Tool</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
                    Practice stations with checklists
                  </p>
                  {hasOsce ? (
                    <Link href="/osce" className="btn-primary text-sm px-5 py-2">
                      Open Tool
                      <ArrowRight className="w-4 h-4" />
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
            <div className={`card relative ${hasQuiz ? 'border-[var(--mint)] border-2' : ''}`}>
              {hasQuiz && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-[var(--mint)] text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
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
                  <h3 className="text-lg mb-1">Core Quiz</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
                    17 topics with instant feedback
                  </p>
                  {hasQuiz ? (
                    <Link href="/quiz" className="btn-primary text-sm px-5 py-2">
                      Open Tool
                      <ArrowRight className="w-4 h-4" />
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
            <div className="card text-center bg-[var(--lilac-soft)] border-[var(--lavender)]">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-lg mb-2">
                {totalOwned === 0 ? 'Get Started!' : 'Want both tools?'}
              </h3>
              <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
                {totalOwned === 0
                  ? 'Unlock your revision tools and start studying!'
                  : 'Get the bundle and save £3!'}
              </p>
              <Link href="/pricing" className="btn-primary">
                <Sparkles className="w-4 h-4" />
                View Pricing
              </Link>
            </div>
          )}

          {/* All unlocked celebration */}
          {(hasOsce && hasQuiz) && (
            <div className="card text-center bg-[var(--mint)]/30 border-[var(--mint)] border-2">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg mb-2 text-green-800">You have full access!</h3>
              <p className="text-sm text-green-700">
                All tools unlocked forever. Happy revising! 💜
              </p>
            </div>
          )}

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--plum-dark)]/60 mb-2">
              Need help or have questions?
            </p>
            <Link href="/contact" className="text-sm text-[var(--purple)] hover:underline inline-flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              Get in touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
