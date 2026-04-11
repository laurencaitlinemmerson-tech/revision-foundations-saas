import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import QuickStatsStrip from '@/components/dashboard/QuickStatsStrip';
import WeakAreaBanner from '@/components/dashboard/WeakAreaBanner';
import PlacementCountdown from '@/components/dashboard/PlacementCountdown';
import QuickTopicSearch from '@/components/dashboard/QuickTopicSearch';
import RecentPagesStrip from '@/components/dashboard/RecentPagesStrip';
import RevisionWeekPlanner from '@/components/dashboard/RevisionWeekPlanner';
import OsceSparkline from '@/components/dashboard/OsceSparkline';
import DashboardCarousel from '@/components/dashboard/DashboardCarousel';
import { TodaysPlanCard } from '@/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your calm study desk for progress, planning, and the next useful revision step.',
};

interface TopicStrength {
  label: string;
  pct: number;
  color: string;
}

function SectionIntro({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-t border-[rgba(26,24,21,0.08)] pt-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/48">
        {label}
      </p>
      <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.8rem)] leading-[1.04] tracking-[-0.02em] text-[var(--espresso)]">
        {title}
      </h2>
      <p className="mt-3 max-w-[56ch] text-sm leading-7 text-[var(--charcoal)]/72">
        {body}
      </p>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.5)] px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/42">
        {label}
      </p>
      <p className="mt-3 font-display text-[2.1rem] leading-none text-[var(--espresso)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/62">
        {detail}
      </p>
    </div>
  );
}

function TopicBar({ topic }: { topic: TopicStrength }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--espresso)]">{topic.label}</p>
        <p className="text-sm text-[var(--charcoal)]/56">{topic.pct}%</p>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden bg-[rgba(26,24,21,0.08)]">
        <div
          className="h-full"
          style={{ width: `${topic.pct}%`, background: topic.color }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col justify-between border border-[rgba(26,24,21,0.08)] bg-white px-5 py-5 transition-transform duration-200 hover:-translate-y-1 hover:border-[rgba(26,24,21,0.16)]"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/44">
          {eyebrow}
        </p>
        <h3 className="mt-3 font-display text-[1.65rem] leading-[1.06] text-[var(--espresso)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/72">
          {body}
        </p>
      </div>
      <p className="mt-6 text-sm text-[var(--espresso)]">
        {cta} {'->'}
      </p>
    </Link>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const firstName = user?.firstName ?? null;

  const entitlements = await getUserEntitlements(userId);
  const hasOsce = hasAccessToContent(entitlements, 'osce');
  const hasQuiz = hasAccessToContent(entitlements, 'quiz');

  const quizStats = await getUserQuizStats(userId).catch(() => null);
  const osceStats = await getUserOsceStats(userId).catch(() => null);

  const topicStrength = quizStats?.topicBreakdown ?? [
    { label: 'Respiratory', pct: 60, color: '#8BBCAA' },
    { label: 'Cardiac', pct: 54, color: '#D4A574' },
    { label: 'Neurological', pct: 46, color: '#7BA7CC' },
    { label: 'Pharmacology', pct: 38, color: '#C89BB0' },
  ];

  const strongestTopic = topicStrength[0]?.label ?? quizStats?.strongestArea ?? 'Respiratory';
  const weakestTopic = topicStrength[topicStrength.length - 1]?.label ?? quizStats?.weakestArea ?? 'Pharmacology';

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz}>
      <div className="flex flex-col gap-16 md:gap-20">
        <section>
          <QuickStatsStrip />
        </section>

        <section
          id="today-block"
          className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]"
        >
          <div className="border border-[rgba(26,24,21,0.08)] bg-white px-6 py-6 md:px-7">
            <SectionIntro
              label="Study desk"
              title="Progress, made readable."
              body="The aim here is not to drown you in analytics. It is to make the state of your revision obvious enough that choosing the next action feels easy."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MetricBlock
                label="Study streak"
                value={String(quizStats?.streakDays ?? 14)}
                detail="Quiet consistency matters more than perfect study days."
              />
              <MetricBlock
                label="Quiz average"
                value={quizStats ? `${quizStats.averagePercent}%` : '—'}
                detail={quizStats ? `${quizStats.totalAnswered} questions answered so far.` : 'Run a short set and this becomes meaningful.'}
              />
              <MetricBlock
                label="This week"
                value={String(quizStats?.hoursThisWeek ?? '—')}
                detail="Enough signal to tell whether the week is moving."
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <div className="border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.56)] px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/44">
                        Topic strength
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]/68">
                        Use this to spot what is holding up under revision and what still needs deliberate repair.
                      </p>
                    </div>
                    <p className="text-sm text-[var(--charcoal)]/56">
                      Strongest: {strongestTopic}
                    </p>
                  </div>
                  <div className="mt-5 space-y-4">
                    {topicStrength.map((topic) => (
                      <TopicBar key={topic.label} topic={topic} />
                    ))}
                  </div>
                </div>

                <div id="weak-areas">
                  <WeakAreaBanner />
                </div>
              </div>

              <div className="border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.56)] px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/44">
                  Applied signal
                </p>
                <p className="mt-3 font-display text-[2.3rem] leading-none text-[var(--espresso)]">
                  {osceStats ? `${osceStats.averageScore}%` : '—'}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]/68">
                  {osceStats
                    ? `${osceStats.totalRuns} stations completed. Keep pulling ${strongestTopic.toLowerCase()} into timed settings and bring ${weakestTopic.toLowerCase()} up next.`
                    : 'Once you run a few stations, this starts to show whether recall is translating into practice.'}
                </p>
                <div className="mt-5">
                  <OsceSparkline />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TodaysPlanCard />
            <PlacementCountdown />
          </div>
        </section>

        <section>
          <DashboardCarousel
            eyebrow="Recommended next"
            title="Guided progression, not filler."
            description="A calm dashboard should still create movement. These are the next few directions that are most likely to be useful."
          >
            <RecommendationCard
              eyebrow="Continue your track"
              title="Resume the last thread"
              body="The easiest way back into revision is usually the page, station, or question flow you already opened recently."
              href="/hub"
              cta="Open your last route"
            />
            <RecommendationCard
              eyebrow="Build on a strength"
              title={`${strongestTopic} under pressure`}
              body="Use your strongest topic in a timed or more applied setting before the week gets too theoretical."
              href={hasOsce ? '/osce' : '/hub'}
              cta={hasOsce ? 'Launch OSCE practice' : 'Open the hub'}
            />
            <RecommendationCard
              eyebrow="Repair the gap"
              title={`Bring ${weakestTopic} above 80%`}
              body="One precise short set here is likely to improve the overall dashboard more than another comfortable review session."
              href={hasQuiz ? `/quiz?topic=${encodeURIComponent(weakestTopic)}` : '/pricing'}
              cta={hasQuiz ? `Practise ${weakestTopic}` : 'Unlock targeted quizzes'}
            />
            <RecommendationCard
              eyebrow="Use your archive"
              title="Revisit saved material"
              body="Your saved folders should feel like a personal revision library, not a place things disappear into."
              href="#saved-resources"
              cta="Open saved library"
            />
          </DashboardCarousel>
        </section>

        <section id="saved-search">
          <SectionIntro
            label="Lookup and planning"
            title="Search quickly, then shape the week."
            body="One side helps you re-enter content fast. The other keeps revision structured enough that you know what a good week could look like."
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <QuickTopicSearch />
              <div className="mt-4 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.5)] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/44">
                  Recent pages
                </p>
                <div className="mt-3">
                  <RecentPagesStrip />
                </div>
              </div>
            </div>

            <RevisionWeekPlanner />
          </div>
        </section>

        <section id="saved-resources">
          <SectionIntro
            label="Saved library"
            title="Your personal revision archive."
            body="Saved folders work best when they feel collected and reusable, not forgotten. This should be the material you genuinely want close by."
          />

          <div className="mt-6 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.58)] p-4 md:p-6">
            <SavedFoldersDashboard showOverview={false} />
          </div>
        </section>

        <section className="border-t border-[rgba(26,24,21,0.08)] pt-6 text-center">
          <p className="font-display text-[1.35rem] leading-[1.2] text-[var(--espresso)]">
            Keep the next step smaller than your stress.
          </p>
          <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-7 text-[var(--charcoal)]/68">
            One guide, one station, one focused question set. Enough to keep the system alive without turning it into noise.
          </p>
          <Link
            href="/how-to-use"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--espresso)] underline underline-offset-4"
          >
            Read the study method {'->'}
          </Link>
        </section>
      </div>
    </DashboardClient>
  );
}

async function getUserQuizStats(_userId: string) {
  void _userId;
  return null as null | {
    totalAnswered: number;
    averagePercent: number;
    weekOnWeekDelta: number;
    streakDays: number;
    hoursThisWeek: number;
    strongestArea: string;
    weakestArea: string;
    topicBreakdown: TopicStrength[];
  };
}

async function getUserOsceStats(_userId: string) {
  void _userId;
  return null as null | {
    totalRuns: number;
    averageScore: number;
    monthOnMonthDelta: number;
  };
}
