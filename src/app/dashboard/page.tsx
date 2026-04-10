import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import ExamSeasonPlanner from '@/components/dashboard/ExamSeasonPlanner';
import WeakAreaBanner from '@/components/dashboard/WeakAreaBanner';
import PlacementCountdown from '@/components/dashboard/PlacementCountdown';
import QuickTopicSearch from '@/components/dashboard/QuickTopicSearch';
import RecentPagesStrip from '@/components/dashboard/RecentPagesStrip';
import WhatToDoToday from '@/components/dashboard/WhatToDoToday';
import OsceSparkline from '@/components/dashboard/OsceSparkline';

import {
  ContinueCard,
  TodaysPlanCard,
  FocusAreasCard,
  StudyStreakCard,
  CommunityStatsCard,
  QuickAchievement,
  StudyTipCard,
  WeeklyProgress,
} from '@/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your study dashboard for tools, saved pages, and purchased content.',
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const serif     = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display   = "'Playfair Display', Georgia, serif";
const ink       = '#1A1815';
const mid       = '#5A5750';
const muted     = '#9C8878';
const border    = 'rgba(0,0,0,0.08)';
const borderMid = 'rgba(0,0,0,0.10)';

// ── Lightweight section divider ───────────────────────────────────────────────
function SectionDivider({ label, id }: { label: string; id?: string }) {
  return (
    <div id={id} style={{
      borderTop: `0.5px solid ${border}`,
      paddingTop: '10px',
      marginBottom: '24px',
      marginTop: '8px',
    }}>
      <p style={{
        fontFamily: serif,
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: muted,
        margin: 0,
      }}>
        {label}
      </p>
    </div>
  );
}

// ── Bundle upsell — compact ───────────────────────────────────────────────────
function BundlePrompt({
  hasOsce,
  hasQuiz,
  hasAnyTool,
}: {
  hasOsce: boolean;
  hasQuiz: boolean;
  hasAnyTool: boolean;
}) {
  const remainingLabel =
    hasOsce && !hasQuiz ? 'core quiz'
    : !hasOsce && hasQuiz ? 'OSCE tool'
    : "children's bundle";

  return (
    <div style={{
      padding: '18px 20px',
      background: 'linear-gradient(135deg, rgba(250,238,218,0.4) 0%, rgba(245,243,240,0.6) 100%)',
      border: `0.5px solid ${border}`,
    }}>
      <p style={{
        fontFamily: display, fontSize: '1.1rem', fontStyle: 'italic',
        fontWeight: 400, lineHeight: 1.2, color: ink, marginBottom: '8px',
      }}>
        {hasAnyTool ? `Add the ${remainingLabel}.` : 'Build the full study setup.'}
      </p>
      <p style={{
        fontFamily: serif, fontSize: '12px', color: mid, fontWeight: 300,
        lineHeight: 1.7, marginBottom: '14px',
      }}>
        {hasAnyTool
          ? 'Bring your practice into one place.'
          : 'Start with the free preview, or unlock when ready.'}
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          href="/pricing"
          style={{
            fontFamily: serif, fontSize: '12px', color: '#FAFAF8',
            background: ink, padding: '8px 16px', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
          }}
        >
          View pricing
        </Link>
        {!hasAnyTool && (
          <Link
            href="/osce"
            style={{
              fontFamily: serif, fontSize: '12px', color: mid,
              padding: '7px 16px', border: `0.5px solid ${borderMid}`,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              background: 'white',
            }}
          >
            Try free preview
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user      = await currentUser();
  const firstName = user?.firstName ?? null;

  const entitlements  = await getUserEntitlements(userId);
  const hasOsce       = hasAccessToContent(entitlements, 'osce');
  const hasQuiz       = hasAccessToContent(entitlements, 'quiz');
  const hasAnyTool    = hasOsce || hasQuiz;
  const hasFullAccess = hasOsce && hasQuiz;

  const quizStats    = await getUserQuizStats(userId).catch(() => null);
  const osceStats    = await getUserOsceStats(userId).catch(() => null);
  const hasAnalytics = !!(quizStats?.totalAnswered || osceStats?.totalRuns);

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

        {/* ━━ 1 · UP NEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Up next" id="up-next" />

          <div style={{ marginBottom: '16px' }}>
            <WhatToDoToday />
          </div>

          <div className="dash-upnext-grid">
            <TodaysPlanCard />
            <ContinueCard />
          </div>

          {!hasFullAccess && (
            <div style={{ marginTop: '20px' }}>
              <BundlePrompt hasOsce={hasOsce} hasQuiz={hasQuiz} hasAnyTool={hasAnyTool} />
            </div>
          )}
        </section>

        {/* ━━ 2 · PRACTICE & PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Practice & progress" id="progress-block" />

          <div className="dash-progress-grid">
            <StudyStreakCard />
            <FocusAreasCard />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <QuickAchievement />
              <PlacementCountdown />
              <WeeklyProgress />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <WeakAreaBanner />
          </div>

          {hasAnalytics && (
            <div className="dash-analytics-row" style={{ marginTop: '20px' }}>
              <OsceSparkline />

              {quizStats && (
                <div style={{ borderLeft: `0.5px solid ${border}`, paddingLeft: '24px' }}>
                  <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '8px' }}>
                    Quiz average
                  </p>
                  <p style={{ fontFamily: display, fontSize: '2.4rem', fontStyle: 'italic', lineHeight: 1, color: ink, marginBottom: '6px' }}>
                    {quizStats.averagePercent}%
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: mid, fontWeight: 300, lineHeight: 1.65 }}>
                    Across {quizStats.totalAnswered} questions.
                  </p>
                  {(quizStats.strongestArea || quizStats.weakestArea) && (
                    <div style={{ display: 'flex', gap: '24px', marginTop: '12px', borderTop: `0.5px solid ${border}`, paddingTop: '10px' }}>
                      {quizStats.strongestArea && (
                        <div>
                          <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>Strongest</p>
                          <p style={{ fontFamily: serif, fontSize: '12px', color: ink }}>{quizStats.strongestArea}</p>
                        </div>
                      )}
                      {quizStats.weakestArea && (
                        <div>
                          <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>Weakest</p>
                          <p style={{ fontFamily: serif, fontSize: '12px', color: ink }}>{quizStats.weakestArea}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ━━ 3 · YOUR RESOURCES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Your resources" id="saved-resources" />

          <div className="dash-resources-grid">
            <QuickTopicSearch />
            <div>
              <p style={{
                fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: muted, marginBottom: '10px',
              }}>
                Recent pages
              </p>
              <RecentPagesStrip />
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <SavedFoldersDashboard />
          </div>
        </section>

        {/* ━━ 4 · REVISION PLANNING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Revision planning" id="exam-season" />

          <ExamSeasonPlanner hasOsce={hasOsce} hasQuiz={hasQuiz} />

          <div className="dash-closing-grid" style={{ marginTop: '24px' }}>
            <CommunityStatsCard />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <StudyTipCard />
              <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '18px' }}>
                <p style={{
                  fontFamily: display, fontSize: '1.2rem', fontStyle: 'italic',
                  fontWeight: 400, lineHeight: 1.15, color: ink, marginBottom: '8px',
                }}>
                  Keep the next step smaller than your stress.
                </p>
                <p style={{
                  fontFamily: serif, fontSize: '12px', color: mid,
                  fontWeight: 300, lineHeight: 1.7, marginBottom: '12px',
                }}>
                  One guide, one station, or one short question set — then stop there if you need to.
                </p>
                <Link
                  href="/how-to-use"
                  style={{ fontFamily: serif, fontSize: '12px', color: ink, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Read the study method →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        .dash-upnext-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 16px;
          align-items: start;
        }
        .dash-progress-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }
        .dash-analytics-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          padding: 20px;
          border: 0.5px solid ${border};
          background: rgba(255,255,255,0.6);
        }
        .dash-resources-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 20px;
          align-items: start;
        }
        .dash-closing-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .dash-progress-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 860px) {
          .dash-upnext-grid,
          .dash-progress-grid,
          .dash-analytics-row,
          .dash-resources-grid,
          .dash-closing-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 560px) {
          .dash-progress-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardClient>
  );
}

// ── Stubs — replace with your real data fetching ──────────────────────────────
async function getUserQuizStats(_userId: string) {
  void _userId;
  return null as null | {
    totalAnswered: number;
    averagePercent: number;
    strongestArea: string;
    weakestArea: string;
    weakAreas: { area: string; note: string }[];
  };
}

async function getUserOsceStats(_userId: string) {
  void _userId;
  return null as null | {
    totalRuns: number;
    averageScore: number;
  };
}
