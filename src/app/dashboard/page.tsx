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
  Sparkles,
  Lock,
  Flame,
  FolderOpen,
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
    <div className="mb-4">
      {eyebrow && (
        <p
          className="text-[11px] text-[var(--charcoal)] uppercase tracking-[0.14em] mb-2"
          style={{ fontFamily: 'var(--font-source-serif, serif)' }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-xl md:text-2xl text-[var(--espresso)]">{title}</h2>
      {description && (
        <p className="text-sm md:text-base text-[var(--charcoal)] font-light mt-1 max-w-2xl">
          {description}
        </p>
      )}
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
      <div className="space-y-10 pt-6 md:pt-10">
        {/* Intro / status */}
        <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-4">
          <div className="card bg-white border border-[var(--linen-deep)]">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 bg-[var(--linen-light)] flex items-center justify-center shrink-0"
                style={{ borderRadius: '10px' }}
              >
                <Sparkles className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <div>
                <h2 className="font-display text-[var(--espresso)] text-xl mb-1">
                  Your revision space
                </h2>
                <p className="text-[var(--charcoal)] font-light text-sm md:text-base">
                  Everything important in one place — your tools, study plan, achievements, and next steps.
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-[var(--linen-light)] border border-[var(--linen-deep)]">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{hasFullAccess ? '👑' : hasAnyTool ? '🎁' : '🌱'}</div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)] mb-1">
                  Access status
                </p>
                <p className="font-display text-[var(--espresso)]">
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

        {/* Streak / continue */}
        <section>
          <SectionHeading
            eyebrow="Start here"
            title="Pick up where you left off"
            description="The fastest way to get moving today."
          />

          {hasAnyTool ? (
            <div className="grid md:grid-cols-2 gap-4">
              <StudyStreakCard />
              <ContinueCard />
            </div>
          ) : (
            <ContinueCard />
          )}
        </section>

        {/* Quick launch */}
        {hasAnyTool && (
          <section>
            <SectionHeading
              eyebrow="Your tools"
              title="Launch straight into practice"
              description="Jump into the tools you’ve unlocked without hunting around."
            />

            <div className="grid md:grid-cols-2 gap-4">
              {hasOsce && (
                <Link
                  href="/osce"
                  className="group card transition-colors duration-200 bg-white border border-[var(--linen-deep)] hover:border-[var(--linen-medium)]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center"
                      style={{ borderRadius: '8px' }}
                    >
                      <ClipboardCheck className="w-7 h-7 text-[var(--espresso)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[var(--espresso)] text-lg font-display">OSCE Tool</h3>
                      <p className="text-[var(--charcoal)] text-sm font-light">
                        50+ stations &middot; timed practice
                      </p>
                    </div>
                    <div
                      className="bg-[var(--espresso)] text-white px-4 py-2 text-sm transition-colors flex items-center gap-2 hover:bg-[#3a2010]"
                      style={{ borderRadius: '8px' }}
                    >
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
                    <div
                      className="w-14 h-14 bg-[var(--linen-light)] flex items-center justify-center"
                      style={{ borderRadius: '8px' }}
                    >
                      <BookOpen className="w-7 h-7 text-[var(--espresso)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[var(--espresso)] text-lg font-display">Core Quiz</h3>
                      <p className="text-[var(--charcoal)] text-sm font-light">
                        17 topics &middot; instant feedback
                      </p>
                    </div>
                    <div
                      className="bg-[var(--espresso)] text-white px-4 py-2 text-sm transition-colors flex items-center gap-2 hover:bg-[#3a2010]"
                      style={{ borderRadius: '8px' }}
                    >
                      Launch <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Status banner */}
        <section>
          {hasFullAccess ? (
            <div className="card bg-[var(--linen-light)] border border-[var(--linen-deep)]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-[var(--espresso)]" />
                    <h3 className="font-display text-[var(--espresso)]">Full Access Unlocked</h3>
                  </div>
                  <p className="text-sm text-[var(--charcoal)] font-light">
                    You’ve got lifetime access to all tools — everything you need for consistent, confident revision.
                  </p>
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
                    <p className="text-sm text-[var(--charcoal)] font-light">
                      Unlock the full bundle and keep all your revision in one place.
                    </p>
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
              <div className="w-14 h-14 bg-[var(--linen-light)] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '999px' }}>
                <Lock className="w-6 h-6 text-[var(--espresso)]" />
              </div>
              <h2 className="text-xl font-display text-[var(--espresso)] mb-2">No tools unlocked yet</h2>
              <p className="text-[var(--charcoal)] font-light mb-6 max-w-md mx-auto">
                Start with the free preview and see how the platform feels before committing.
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
        </section>

        {/* Upgrade cards */}
        {hasAnyTool && !hasFullAccess && (
          <section>
            <SectionHeading
              eyebrow="Unlock more"
              title="Complete your toolkit"
              description="Add the missing tool for a more rounded revision setup."
            />

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
          </section>
        )}

        {/* Planning / momentum */}
        <section>
          <SectionHeading
            eyebrow="Today"
            title="Your study rhythm"
            description="A quick look at what to focus on next."
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <TodaysPlanCard />
            <div className="space-y-6">
              <QuickAchievement />
              <CommunityStatsCard />
            </div>
          </div>
        </section>

        {/* Motivation banner */}
        <section>
          <div className="card bg-white border border-[var(--linen-deep)]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💜</div>
              <div className="flex-1">
                <p className="text-[var(--espresso)] font-display">Progress over perfection</p>
                <p className="text-sm text-[var(--charcoal)] font-light">
                  Even 10 focused minutes today moves you forward. Keep the momentum gentle and consistent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus */}
        <section>
          <SectionHeading
            eyebrow="Priority areas"
            title="Focus where it matters most"
            description="Use these areas to guide your next study block."
          />
          <FocusAreasCard />
        </section>

        {/* Quick actions */}
        <section>
          <SectionHeading
            eyebrow="Shortcuts"
            title="Quick actions"
            description="The pages you’re most likely to need next."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/hub"
              className="card text-center py-6 hover:border-[var(--linen-medium)] transition-colors group"
            >
              <FolderOpen className="w-6 h-6 text-[var(--espresso)] mx-auto mb-2" />
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
        </section>

        {/* Tip */}
        <section className="pb-16">
          <SectionHeading
            eyebrow="Daily boost"
            title="A quick study tip"
            description="A small reminder to help you revise a little smarter."
          />
          <StudyTipCard />
        </section>
      </div>
    </DashboardClient>
  );
}
