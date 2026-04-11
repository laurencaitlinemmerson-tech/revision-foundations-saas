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

type TopicStrength = {
  label: string;
  pct: number;
  color: string;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: serif,
      fontSize: '10px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      color: muted,
      marginBottom: '10px',
    }}>
      {children}
    </p>
  );
}

function SectionHeader({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <SectionLabel>{label}</SectionLabel>
      <h2 style={{
        fontFamily: display,
        fontSize: 'clamp(1.9rem, 2.8vw, 2.6rem)',
        lineHeight: 1.06,
        color: ink,
        letterSpacing: '-0.02em',
        marginBottom: '10px',
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: serif,
        fontSize: '13.5px',
        lineHeight: 1.85,
        color: '#5A5750',
        fontWeight: 300,
        maxWidth: '52ch',
      }}>
        {body}
      </p>
    </div>
  );
}

function Meter({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <p style={{ fontFamily: serif, fontSize: '12.5px', color: '#2C2A27' }}>{label}</p>
        <p style={{ fontFamily: serif, fontSize: '11px', color: '#8D7E71' }}>{pct}%</p>
      </div>
      <div style={{ height: '2px', background: 'rgba(0,0,0,0.06)', borderRadius: '1px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '1px' }} />
      </div>
    </div>
  );
}

function RecommendationCard({ eyebrow, title, body, href, cta }: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="dash-reco-card dash-hover-card">
      <div>
        <p className="dash-reco-eyebrow">{eyebrow}</p>
        <h3 className="dash-reco-title">{title}</h3>
        <p className="dash-reco-body">{body}</p>
      </div>
      <p className="dash-reco-cta">{cta} <span aria-hidden="true">→</span></p>
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
  const hasMocks = hasAccessToContent(entitlements, 'osce');

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

        {/* Stats strip */}
        <section>
          <QuickStatsStrip />
        </section>

        {/* Continue */}
        <section id="continue" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Continue"
              title="Pick up the live thread."
              body="The most useful dashboard is the one that gets you back into active revision without asking you to decide everything again."
            />
            <ContinueCard />
          </div>

          <aside className="dash-split-side">
            <div className="dash-rail-card dash-hover-card">
              <SectionLabel>Quick starts</SectionLabel>
              <div className="dash-rail-links">
                <Link href="/hub" className="dash-rail-link"><span>Open the hub</span><span aria-hidden="true">→</span></Link>
                <Link href={hasQuiz ? '/quiz' : '/pricing'} className="dash-rail-link">
                  <span>{hasQuiz ? '10-question quiz' : 'Unlock the quiz'}</span><span aria-hidden="true">→</span>
                </Link>
                <Link href={hasOsce ? '/osce' : '/pricing'} className="dash-rail-link">
                  <span>{hasOsce ? 'Run a timed station' : 'Unlock OSCE practice'}</span><span aria-hidden="true">→</span>
                </Link>
                <Link href={hasMocks ? '/hub/mocks' : '/pricing'} className="dash-rail-link">
                  <span>{hasMocks ? 'Take a mock exam' : 'Unlock mock exams'}</span><span aria-hidden="true">→</span>
                </Link>
                <Link href="#saved-folders" className="dash-rail-link">
                  <span>Open saved library</span><span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <PlacementCountdown />
          </aside>
        </section>

        {/* Divider */}
        <div className="dash-divider" />

        {/* Today */}
        <section id="today-block" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Today"
              title="A clearer read on what matters now."
              body="The day, the weak spots, and the shape of your revision — all visible at once."
            />

            <div className="dash-today-grid">
              <TodaysPlanCard />

              <div className="dash-progress-panel dash-hover-card">
                <div className="dash-progress-top">
                  <div>
                    <SectionLabel>Progress</SectionLabel>
                    <h3 className="dash-panel-title">Strength and accuracy</h3>
                  </div>
                  <p className="dash-panel-note">Strongest: {strongestArea}</p>
                </div>

                <div className="dash-progress-columns">
                  <div>
                    <SectionLabel>Topic strength</SectionLabel>
                    <div style={{ marginTop: '12px' }}>
                      {topicStrength.map((topic) => (
                        <Meter key={topic.label} label={topic.label} pct={topic.pct} color={topic.color} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Exam pressure</SectionLabel>
                    <p className="dash-side-copy">
                      {weakestArea} still needs deliberate repetition. Use shorter sessions to stop it becoming drag.
                    </p>
                    <div className="dash-aside-note">
                      <SectionLabel>Useful next move</SectionLabel>
                      <p className="dash-note-copy">
                        {hasQuiz
                          ? `Run a short ${weakestArea.toLowerCase()} quiz set, then review one saved page.`
                          : 'Use saved guides first, then add the quiz when you want targeted practice.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="dash-split-side">
            <StudyStreakCard />
            <FocusAreasCard />
          </aside>
        </section>

        <div className="dash-divider" />

        {/* Editorial carousel */}
        <section>
          <DashboardCarousel
            eyebrow="Editorial track"
            title="Use the dashboard like a working desk."
            description="Move between your main routes without the page turning into a grid of generic tools."
          >
            <RecommendationCard eyebrow="Hub" title="Return to your reading base" body="Open guides, glossaries, and saved pages when you want the calmest way back into study." href="/hub" cta="Open hub" />
            <RecommendationCard
              eyebrow="Quiz"
              title={hasQuiz ? `Bring ${weakestArea} up next` : 'Add short question sets'}
              body={hasQuiz ? 'A quick question set gives you a direct read on recall without committing to a long session.' : 'The quiz is the cleanest way to turn weak topics into something measurable.'}
              href={hasQuiz ? `/quiz?topic=${encodeURIComponent(weakestArea)}` : '/pricing'}
              cta={hasQuiz ? 'Start quiz' : 'View quiz access'}
            />
            <RecommendationCard
              eyebrow="OSCE"
              title={hasOsce ? 'Shift from reading to performance' : 'Unlock timed practice'}
              body={hasOsce ? 'When revision feels too passive, one station changes the pace immediately.' : 'Add practical timed work when you want exam-style preparation.'}
              href={hasOsce ? '/osce' : '/pricing'}
              cta={hasOsce ? 'Run station' : 'See OSCE access'}
            />
            <RecommendationCard
              eyebrow="Mocks"
              title={hasMocks ? 'Simulate exam conditions' : 'Unlock mock exams'}
              body={hasMocks ? 'Full, long-answer exam scenarios with examiner feedback and marking criteria.' : 'Structured mock exams to build clinical reasoning and structure.'}
              href={hasMocks ? '/hub/mocks' : '/pricing'}
              cta={hasMocks ? 'Start mock exam' : 'See mock access'}
            />
            <RecommendationCard eyebrow="Library" title="Re-enter through saved material" body="Your saved folders are a personal archive of pages worth revisiting, not a dumping ground." href="#saved-folders" cta="Open library" />
          </DashboardCarousel>
        </section>

        <div className="dash-divider" />

        {/* Search */}
        <section id="search" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Search"
              title="Find the exact page quickly."
              body="The quickest route back into revision is often a precise page, not a whole tool."
            />
            <QuickTopicSearch />
            <div className="dash-recent-panel">
              <SectionLabel>Recent pages</SectionLabel>
              <div style={{ marginTop: '10px' }}>
                <RecentPagesStrip />
              </div>
            </div>
          </div>

          <aside className="dash-split-side">
            <RevisionWeekPlanner />
          </aside>
        </section>

        <div className="dash-divider" />

        {/* Library */}
        <section id="saved-folders" className="dash-split">
          <div className="dash-split-main">
            <SectionHeader
              label="Library"
              title="Keep saved material in reach."
              body="Less like another dashboard module, more like a working archive of pages you actually come back to."
            />
            <div className="dash-library-frame">
              <SavedFoldersDashboard showOverview={false} />
            </div>
          </div>

          <aside className="dash-split-side">
            <div className="dash-rail-card dash-hover-card">
              <SectionLabel>Working rhythm</SectionLabel>
              <p className="dash-side-copy">
                Continue on the left, plan or search on the right, then drop into saved material when you need a familiar route back in.
              </p>
              <div className="dash-rail-links" style={{ marginTop: '18px' }}>
                <Link href="/how-to-use" className="dash-rail-link"><span>Read the study method</span><span aria-hidden="true">→</span></Link>
                <Link href="/hub" className="dash-rail-link"><span>Browse hub resources</span><span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </aside>
        </section>

      </div>

      <style>{`
        .dash-page-stack {
          display: flex;
          flex-direction: column;
          gap: 52px;
          padding-bottom: 80px;
        }
        .dash-divider {
          height: 0.5px;
          background: rgba(0,0,0,0.07);
          margin: 4px 0;
        }
        .dash-split {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) 300px;
          gap: 32px;
          align-items: start;
        }
        .dash-split-main { min-width: 0; }
        .dash-split-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
          position: sticky;
          top: 24px;
        }
        .dash-hover-card {
          border: 0.5px solid rgba(0,0,0,0.08);
          background: #fff;
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
        }
        .dash-hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26,24,21,0.05);
          border-color: rgba(26,24,21,0.14);
        }
        .dash-rail-card { padding: 18px 20px; }
        .dash-rail-links {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        .dash-rail-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 11px 0;
          border-top: 0.5px solid rgba(0,0,0,0.06);
          text-decoration: none;
          color: ${ink};
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.5;
          transition: padding-left 160ms ease;
        }
        .dash-rail-link:first-child { border-top: none; padding-top: 4px; }
        .dash-rail-link:hover { padding-left: 3px; }
        .dash-today-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 16px;
        }
        .dash-progress-panel { padding: 20px 22px; }
        .dash-progress-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 0.5px solid rgba(0,0,0,0.06);
        }
        .dash-panel-title {
          font-family: ${display};
          font-size: 1.4rem;
          line-height: 1.1;
          color: ${ink};
          margin-top: 6px;
        }
        .dash-panel-note {
          font-family: ${serif};
          font-size: 11px;
          line-height: 1.6;
          color: #8D7E71;
          text-align: right;
          white-space: nowrap;
        }
        .dash-progress-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .dash-side-copy {
          font-family: ${serif};
          font-size: 12.5px;
          line-height: 1.85;
          color: #5A5750;
          font-weight: 300;
          margin-top: 8px;
        }
        .dash-aside-note {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 0.5px solid rgba(0,0,0,0.06);
        }
        .dash-note-copy {
          font-family: ${serif};
          font-size: 12.5px;
          line-height: 1.75;
          color: #2C2A27;
          margin-top: 6px;
        }
        .dash-reco-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 220px;
          padding: 20px 20px 22px;
          text-decoration: none;
        }
        .dash-reco-eyebrow {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
        }
        .dash-reco-title {
          font-family: ${display};
          font-size: 1.65rem;
          line-height: 1.06;
          letter-spacing: -0.01em;
          color: ${ink};
          margin-top: 12px;
        }
        .dash-reco-body {
          font-family: ${serif};
          font-size: 12.5px;
          line-height: 1.85;
          color: #5A5750;
          font-weight: 300;
          margin-top: 10px;
        }
        .dash-reco-cta {
          font-family: ${serif};
          font-size: 13px;
          color: ${ink};
          margin-top: 18px;
          transition: letter-spacing 160ms ease;
        }
        .dash-reco-card:hover .dash-reco-cta { letter-spacing: 0.02em; }
        .dash-recent-panel {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 0.5px solid rgba(0,0,0,0.07);
        }
        .dash-library-frame {
          margin-top: 4px;
          border: 0.5px solid rgba(0,0,0,0.08);
          background: #fff;
          padding: 20px;
        }
        @media (max-width: 1040px) {
          .dash-split { grid-template-columns: 1fr; }
          .dash-split-side { position: static; }
          .dash-today-grid { grid-template-columns: 1fr; }
          .dash-progress-columns { grid-template-columns: 1fr; }
        }
        @media (max-width: 680px) {
          .dash-page-stack { gap: 40px; }
          .dash-progress-panel,
          .dash-rail-card,
          .dash-library-frame { padding: 16px; }
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
