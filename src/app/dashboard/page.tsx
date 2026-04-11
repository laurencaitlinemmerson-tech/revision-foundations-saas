import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import PlacementCountdown from '@/components/dashboard/PlacementCountdown';
import QuickTopicSearch from '@/components/dashboard/QuickTopicSearch';
import RecentPagesStrip from '@/components/dashboard/RecentPagesStrip';
import RevisionWeekPlanner from '@/components/dashboard/RevisionWeekPlanner';
import QuickStatsStrip from '@/components/dashboard/QuickStatsStrip';
import DashboardCarousel from '@/components/dashboard/DashboardCarousel';
import {
  ContinueCard,
  FocusAreasCard,
  StudyStreakCard,
  TodaysPlanCard,
} from '@/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your editorial revision desk for progress, planning, and quick re-entry into study.',
};

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const muted = '#9C8878';
const border = 'rgba(0,0,0,0.08)';

type TopicStrength = {
  label: string;
  pct: number;
  color: string;
};

function SectionHeader({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: serif,
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: muted,
          marginBottom: '12px',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontFamily: display,
          fontSize: 'clamp(2rem, 3vw, 2.8rem)',
          lineHeight: 1.05,
          color: ink,
          letterSpacing: '-0.02em',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: serif,
          fontSize: '14px',
          lineHeight: 1.8,
          color: '#5A5750',
          fontWeight: 300,
          maxWidth: '58ch',
        }}
      >
        {body}
      </p>
    </div>
  );
}

function Meter({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
        <p style={{ fontFamily: serif, fontSize: '13px', color: '#2C2A27' }}>{label}</p>
        <p style={{ fontFamily: serif, fontSize: '12px', color: '#8D7E71' }}>{pct}%</p>
      </div>
      <div style={{ height: '3px', background: 'rgba(0,0,0,0.07)' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
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
    <Link href={href} className="dash-hover-card dash-reco-card">
      <div>
        <p className="dash-reco-eyebrow">{eyebrow}</p>
        <h3 className="dash-reco-title">{title}</h3>
        <p className="dash-reco-body">{body}</p>
      </div>
      <p className="dash-reco-cta">
        {cta} <span aria-hidden="true">→</span>
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
  const hasMocks = hasAccessToContent(entitlements, 'osce'); // Currently bundled with OSCE access

  const quizStats = await getUserQuizStats(userId).catch(() => null);

  const topicStrength = quizStats?.topicBreakdown ?? [
    { label: 'Respiratory', pct: 60, color: '#8BBCAA' },
    { label: 'Cardiac', pct: 54, color: '#D4A574' },
    { label: 'Neurological', pct: 46, color: '#7BA7CC' },
    { label: 'Pharmacology', pct: 38, color: '#C89BB0' },
  ];

  const strongestArea = quizStats?.strongestArea ?? topicStrength[0]?.label ?? 'Respiratory';
  const weakestArea = quizStats?.weakestArea ?? topicStrength[topicStrength.length - 1]?.label ?? 'Pharmacology';

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz} hasMocks={hasMocks}>
      <div className="dash-page-stack">
        <section>
          <QuickStatsStrip />
        </section>

        <section id="continue" className="dash-split dash-split-hero">
          <div className="dash-split-main">
            <SectionHeader
              label="Continue"
              title="Pick up the live thread."
              body="The most useful dashboard is the one that gets you back into active revision without asking you to decide everything again."
            />
            <div className="dash-hover-shell">
              <ContinueCard />
            </div>
          </div>

          <aside className="dash-split-side">
            <div className="dash-rail-card dash-hover-card">
              <p className="dash-rail-label">Quick starts</p>
              <div className="dash-rail-links">
                <Link href="/hub" className="dash-rail-link">
                  <span>Open the hub</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href={hasQuiz ? '/quiz' : '/pricing'} className="dash-rail-link">
                  <span>{hasQuiz ? '10-question quiz' : 'Unlock the quiz'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href={hasOsce ? '/osce' : '/pricing'} className="dash-rail-link">
                  <span>{hasOsce ? 'Run a timed station' : 'Unlock OSCE practice'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href={hasMocks ? '/hub/mocks' : '/pricing'} className="dash-rail-link">
                  <span>{hasMocks ? 'Take a mock exam' : 'Unlock mock exams'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="#saved-folders" className="dash-rail-link">
                  <span>Open saved library</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="dash-hover-shell">
              <PlacementCountdown />
            </div>
          </aside>
        </section>

        <section id="today-block" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Today"
              title="A clearer read on what matters now."
              body="This is where the dashboard becomes a working study environment: the day, the weak spots, and the shape of your revision are all visible at once."
            />

            <div className="dash-progress-grid">
              <div className="dash-hover-shell">
                <TodaysPlanCard />
              </div>

              <div className="dash-progress-panel dash-hover-card">
                <div className="dash-progress-top">
                  <div>
                    <p className="dash-panel-label">Progress</p>
                    <h3 className="dash-panel-title">Strength and accuracy</h3>
                  </div>
                  <p className="dash-panel-note">
                    Strongest: {strongestArea}
                  </p>
                </div>

                <div className="dash-progress-columns">
                  <div>
                    <p className="dash-mini-label">Topic strength</p>
                    <div className="dash-meter-stack">
                      {topicStrength.map((topic) => (
                        <Meter key={topic.label} label={topic.label} pct={topic.pct} color={topic.color} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="dash-mini-label">Exam pressure</p>
                    <p className="dash-side-copy">
                      {weakestArea} still needs more deliberate repetition. Use the day&apos;s shorter sessions to stop it becoming drag.
                    </p>
                    <div className="dash-aside-note">
                      <p className="dash-note-kicker">Useful next move</p>
                      <p className="dash-note-copy">
                        {hasQuiz ? `Run a short ${weakestArea.toLowerCase()} quiz set, then review one saved page.` : 'Use saved guides first, then add the quiz when you want targeted practice.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="dash-split-side">
            <div className="dash-hover-shell">
              <StudyStreakCard />
            </div>
            <div id="weak-areas" className="dash-hover-shell">
              <FocusAreasCard />
            </div>
          </aside>
        </section>

        <section>
          <DashboardCarousel
            eyebrow="Editorial track"
            title="Use the dashboard like a working desk."
            description="Move between your main routes without the page turning into a grid of generic tools."
          >
            <RecommendationCard
              eyebrow="Hub"
              title="Return to your reading base"
              body="Open guides, glossaries, and saved pages when you want the calmest way back into study."
              href="/hub"
              cta="Open hub"
            />
            <RecommendationCard
              eyebrow="Quiz"
              title={hasQuiz ? `Bring ${weakestArea} up next` : 'Add short question sets'}
              body={hasQuiz ? 'Use a quick question set when you want a direct read on recall without committing to a long session.' : 'The quiz is the cleanest way to turn weak topics into something measurable.'}
              href={hasQuiz ? `/quiz?topic=${encodeURIComponent(weakestArea)}` : '/pricing'}
              cta={hasQuiz ? 'Start quiz' : 'View quiz access'}
            />
            <RecommendationCard
              eyebrow="OSCE"
              title={hasOsce ? 'Shift from reading to performance' : 'Unlock timed practice'}
              body={hasOsce ? 'When revision feels too passive, one station changes the pace immediately.' : 'Add practical timed work when you want the dashboard to extend into exam-style preparation.'}
              href={hasOsce ? '/osce' : '/pricing'}
              cta={hasOsce ? 'Run station' : 'See OSCE access'}
            />
            <RecommendationCard
              eyebrow="Mocks"
              title={hasMocks ? 'Simulate exam conditions' : 'Unlock mock exams'}
              body={hasMocks ? 'Practice full, long-answer exam scenarios with examiner feedback and marking criteria.' : 'Take structured mock exams to build your clinical reasoning and structure.'}
              href={hasMocks ? '/hub/mocks' : '/pricing'}
              cta={hasMocks ? 'Start mock exam' : 'See mock access'}
            />
            <RecommendationCard
              eyebrow="Library"
              title="Re-enter through saved material"
              body="Treat your saved folders as a personal archive of pages worth revisiting, not a dumping ground."
              href="#saved-folders"
              cta="Open library"
            />
          </DashboardCarousel>
        </section>

        <section id="search" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Search"
              title="Find the exact page quickly."
              body="The quickest route back into revision is often a precise page, not a whole tool. Search should feel immediate, and recent pages should stay close."
            />

            <div className="dash-hover-shell">
              <QuickTopicSearch />
            </div>

            <div className="dash-recent-panel">
              <p className="dash-panel-label">Recent pages</p>
              <div style={{ marginTop: '12px' }}>
                <RecentPagesStrip />
              </div>
            </div>
          </div>

          <aside className="dash-split-side">
            <div className="dash-hover-shell">
              <RevisionWeekPlanner />
            </div>
          </aside>
        </section>

        <section id="saved-folders" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Library"
              title="Keep saved material in reach."
              body="The saved area should feel less like another dashboard module and more like a working archive of pages you actually come back to."
            />
            <div className="dash-library-frame">
              <SavedFoldersDashboard showOverview={false} />
            </div>
          </div>

          <aside className="dash-split-side">
            <div className="dash-rail-card dash-hover-card">
              <p className="dash-rail-label">Working rhythm</p>
              <p className="dash-side-copy">
                Use the split view as a study surface: continue on the left, plan or search on the right, then drop into saved material when you need a familiar route back in.
              </p>
              <div className="dash-rail-links" style={{ marginTop: '18px' }}>
                <Link href="/how-to-use" className="dash-rail-link">
                  <span>Read the study method</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/hub" className="dash-rail-link">
                  <span>Browse hub resources</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <style>{`
        .dash-page-stack {
          display: flex;
          flex-direction: column;
          gap: 72px;
        }
        .dash-split {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) 320px;
          gap: 24px;
          align-items: start;
        }
        .dash-split-hero {
          align-items: stretch;
        }
        .dash-split-main {
          min-width: 0;
        }
        .dash-split-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }
        .dash-hover-shell {
          transition: transform 220ms ease, filter 220ms ease;
        }
        .dash-hover-shell:hover {
          transform: translateY(-3px);
          filter: drop-shadow(0 14px 28px rgba(26, 24, 21, 0.05));
        }
        .dash-hover-card {
          border: 0.5px solid ${border};
          background: #fff;
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
        }
        .dash-hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(26, 24, 21, 0.06);
          border-color: rgba(26,24,21,0.16);
          background: #fffdfa;
        }
        .dash-rail-card {
          padding: 20px 22px;
        }
        .dash-rail-label,
        .dash-panel-label,
        .dash-mini-label,
        .dash-note-kicker,
        .dash-reco-eyebrow {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
        }
        .dash-rail-links {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 12px;
        }
        .dash-rail-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
          border-top: 0.5px solid rgba(0,0,0,0.07);
          text-decoration: none;
          color: ${ink};
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.6;
          transition: padding-left 180ms ease, color 180ms ease;
        }
        .dash-rail-link:first-child {
          border-top: none;
          padding-top: 6px;
        }
        .dash-rail-link:hover {
          padding-left: 4px;
        }
        .dash-progress-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 18px;
          margin-top: 24px;
        }
        .dash-progress-panel {
          padding: 22px 24px;
        }
        .dash-progress-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }
        .dash-panel-title {
          font-family: ${display};
          font-size: 1.55rem;
          line-height: 1.08;
          color: ${ink};
          margin-top: 8px;
        }
        .dash-panel-note {
          font-family: ${serif};
          font-size: 12px;
          line-height: 1.6;
          color: #8D7E71;
          max-width: 16ch;
          text-align: right;
        }
        .dash-progress-columns {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(220px, 0.82fr);
          gap: 22px;
        }
        .dash-meter-stack {
          margin-top: 14px;
        }
        .dash-side-copy {
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.85;
          color: #5A5750;
          font-weight: 300;
          margin-top: 10px;
        }
        .dash-aside-note {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 0.5px solid rgba(0,0,0,0.07);
        }
        .dash-note-copy {
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.75;
          color: #2C2A27;
          margin-top: 8px;
        }
        .dash-reco-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 250px;
          padding: 22px 22px 24px;
          text-decoration: none;
        }
        .dash-reco-title {
          font-family: ${display};
          font-size: 1.75rem;
          line-height: 1.08;
          color: ${ink};
          margin-top: 12px;
        }
        .dash-reco-body {
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.85;
          color: #5A5750;
          font-weight: 300;
          margin-top: 12px;
        }
        .dash-reco-cta {
          font-family: ${serif};
          font-size: 13px;
          color: ${ink};
          margin-top: 20px;
          transition: letter-spacing 180ms ease;
        }
        .dash-reco-card:hover .dash-reco-cta {
          letter-spacing: 0.02em;
        }
        .dash-recent-panel {
          margin-top: 16px;
          border-top: 0.5px solid rgba(0,0,0,0.08);
          padding-top: 16px;
        }
        .dash-library-frame {
          margin-top: 24px;
          border: 0.5px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.74);
          padding: 18px;
        }
        @media (max-width: 1040px) {
          .dash-split {
            grid-template-columns: 1fr;
          }
          .dash-progress-grid {
            grid-template-columns: 1fr;
          }
          .dash-progress-columns {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 760px) {
          .dash-page-stack {
            gap: 56px;
          }
          .dash-progress-panel,
          .dash-rail-card,
          .dash-library-frame {
            padding: 18px;
          }
        }
      `}</style>
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
