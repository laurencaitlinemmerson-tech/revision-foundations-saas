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
  Rocket,
  Star,
  Coffee
} from 'lucide-react';

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

  // Fun motivational messages
  const motivationalMessages = [
    "You've got this! 💪",
    "One step closer to qualified! ✨",
    "Future nurse in the making! 🩺",
    "Smashing it! 🌟",
    "Keep going, you're doing amazing! 💜",
  ];
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">👋</span>
              <div>
                <h1 className="text-2xl md:text-3xl">Hey, {firstName}!</h1>
                <p className="text-[var(--plum-dark)]/60">{randomMessage}</p>
              </div>
            </div>
          </div>

          {/* Quick Launch - Only show if user has tools */}
          {hasAnyTool && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {hasOsce && (
                <Link
                  href="/osce"
                  className="group card gradient-hero hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <ClipboardCheck className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">OSCE Tool</h3>
                        <p className="text-white/70 text-sm">50+ stations ready</p>
                      </div>
                    </div>
                    <div className="bg-white text-[var(--purple)] px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-white/90 transition flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Launch
                    </div>
                  </div>
                </Link>
              )}

              {hasQuiz && (
                <Link
                  href="/quiz"
                  className="group card gradient-hero hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold">Core Quiz</h3>
                        <p className="text-white/70 text-sm">17 topics to explore</p>
                      </div>
                    </div>
                    <div className="bg-white text-[var(--purple)] px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-white/90 transition flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Launch
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Status Banner */}
          {(hasOsce && hasQuiz) ? (
            <div className="card bg-[var(--mint)]/20 border-2 border-[var(--mint)] mb-8">
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
            <div className="card bg-[var(--lilac-soft)] border border-[var(--lavender)] mb-8">
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
                <Link href="/pricing" className="btn-primary text-sm">
                  <Gift className="w-4 h-4" />
                  View Bundle
                </Link>
              </div>
            </div>
          ) : null}

          {/* Tools Section - Show locked tools or get started */}
          {!hasAnyTool ? (
            // No tools yet - show get started
            <div className="card text-center py-12 mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-xl mb-2">Ready to start revising?</h2>
              <p className="text-[var(--plum-dark)]/70 mb-6 max-w-md mx-auto">
                Unlock your study tools and feel confident walking into your exams and placements!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/pricing" className="btn-primary">
                  <Sparkles className="w-5 h-5" />
                  Get Started - £4.99
                </Link>
                <Link href="/osce" className="btn-secondary">
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
                  <div className="card border-2 border-dashed border-[var(--lilac-medium)]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6 text-[var(--purple)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">OSCE Tool</h3>
                        <p className="text-sm text-[var(--plum-dark)]/60">50+ practice stations</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/osce" className="btn-secondary text-sm flex-1">
                        <Play className="w-4 h-4" />
                        Try Preview
                      </Link>
                      <Link href="/pricing?product=osce" className="btn-primary text-sm flex-1">
                        <Sparkles className="w-4 h-4" />
                        Unlock £4.99
                      </Link>
                    </div>
                  </div>
                )}
                {!hasQuiz && (
                  <div className="card border-2 border-dashed border-[var(--lilac-medium)]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-[var(--purple)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Core Quiz</h3>
                        <p className="text-sm text-[var(--plum-dark)]/60">17 topic categories</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/quiz" className="btn-secondary text-sm flex-1">
                        <Play className="w-4 h-4" />
                        Try Preview
                      </Link>
                      <Link href="/pricing?product=quiz" className="btn-primary text-sm flex-1">
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
            <Link href="/about" className="card text-center py-5 hover:border-[var(--lavender)] transition group">
              <Coffee className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm font-medium text-[var(--plum)]">About Me</p>
            </Link>
            <Link href="/contact" className="card text-center py-5 hover:border-[var(--lavender)] transition group">
              <MessageCircle className="w-6 h-6 text-[var(--purple)] mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm font-medium text-[var(--plum)]">Get Help</p>
            </Link>
            <a
              href="https://wa.me/447572650980"
              target="_blank"
              rel="noopener noreferrer"
              className="card text-center py-5 hover:border-[var(--lavender)] transition group"
            >
              <Heart className="w-6 h-6 text-[var(--pink)] mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm font-medium text-[var(--plum)]">Say Hi!</p>
            </a>
            <Link href="/pricing" className="card text-center py-5 hover:border-[var(--lavender)] transition group">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm font-medium text-[var(--plum)]">Leave Review</p>
            </Link>
          </div>

          {/* Study Tip */}
          <div className="card bg-[var(--lilac-soft)]/50">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold text-[var(--plum)] mb-1">Study Tip</h3>
                <p className="text-sm text-[var(--plum-dark)]/70">
                  Little and often beats cramming! Try doing 15-20 minutes of practice each day rather than hours before an exam. Your brain will thank you.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
