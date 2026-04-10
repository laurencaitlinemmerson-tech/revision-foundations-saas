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
} from '@/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your study dashboard for tools, saved pages, and purchased content.',
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const serif     = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display   = "'Playfair Display', Georgia, serif";
const ink       = '#1A1815';
const bodyColor = '#2C2A27';
const mid       = '#5A5750';
const muted     = '#9C8878';
const border    = 'rgba(0,0,0,0.08)';
const borderMid = 'rgba(0,0,0,0.10)';

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: string;
}) {
  return (
    <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '32px', marginBottom: '28px' }}>
      {eyebrow && (
        <p style={{
          fontFamily: serif,
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent || muted,
          marginBottom: '12px',
          borderLeft: accent ? `2px solid ${accent}` : undefined,
          paddingLeft: accent ? '10px' : undefined,
        }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{
        fontFamily: display,
        fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
        fontWeight: 400,
        lineHeight: 1.1,
        color: ink,
        marginBottom: 0,
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          fontFamily: serif,
          fontSize: '13px',
          color: mid,
          fontWeight: 300,
          lineHeight: 1.8,
          maxWidth: '580px',
          marginTop: '8px',
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

// ── Bundle upsell ─────────────────────────────────────────────────────────────
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
      borderTop: `0.5px solid ${border}`,
      paddingTop: '28px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: '32px',
      alignItems: 'start',
    }}
    className="dash-bundle-prompt"
    >
      <div>
        <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '10px' }}>
          {hasAnyTool ? 'Unlock more' : 'Get started'}
        </p>
        <p style={{ fontFamily: display, fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.15, color: ink, marginBottom: '10px' }}>
          {hasAnyTool ? `Add the ${remainingLabel}.` : 'Build the full study setup.'}
        </p>
        <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.8, maxWidth: '480px' }}>
          {hasAnyTool
            ? 'Bring your practice back into one place so the dashboard becomes a proper revision home base.'
            : 'Start with the free preview if you want a feel for it first, or unlock the bundle when you are ready.'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flexShrink: 0, paddingTop: '4px' }}>
        <Link
          href="/pricing"
          style={{ fontFamily: serif, fontSize: '13px', color: '#FAFAF8', background: ink, padding: '11px 20px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
        >
          View pricing
        </Link>
        {!hasAnyTool && (
          <Link
            href="/osce"
            style={{ fontFamily: serif, fontSize: '13px', color: bodyColor, background: 'white', padding: '10px 20px', border: `0.5px solid ${borderMid}`, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
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

  // Analytics gated — replace stubs with real fetches
  const quizStats    = await getUserQuizStats(userId).catch(() => null);
  const osceStats    = await getUserOsceStats(userId).catch(() => null);
  const hasAnalytics = !!(quizStats?.totalAnswered || osceStats?.totalRuns);

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* ── 1 · What to do right now ───────────────────────────────────
            WhatToDoToday: full-width primary prose nudge
            ContinueCard: secondary, picks up last session
        ─────────────────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Start here"
            title="Choose the next useful thing."
            description="This works best when it points you to one sensible next step — not every option at once."
            accent="var(--sage-600)"
          />
          <div style={{ marginBottom: '16px' }}>
            <WhatToDoToday />
          </div>
          <ContinueCard />
          {!hasFullAccess && (
            <div style={{ marginTop: '32px' }}>
              <BundlePrompt hasOsce={hasOsce} hasQuiz={hasQuiz} hasAnyTool={hasAnyTool} />
            </div>
          )}
        </section>

        {/* ── 2 · Today ──────────────────────────────────────────────────
            TodaysPlanCard + PlacementCountdown: both time-anchored
        ─────────────────────────────────────────────────────────────── */}
        <section id="today-block" style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Today"
            title="What deserves attention today."
            description="A short checklist and one date can do most of the heavy lifting when your revision brain feels crowded."
            accent="var(--amber-600)"
          />
          <div className="dash-today-grid">
            <TodaysPlanCard />
            <PlacementCountdown />
          </div>
        </section>

        {/* ── 3 · Search & recent ──────────────────────────────────────── */}
        <section id="jump-back-in" style={{ paddingBottom: '52px', borderTop: `0.5px solid ${border}`, paddingTop: '32px' }}>
          <div className="dash-utility-grid">
            <QuickTopicSearch />
            <div className="dash-utility-card">
              <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '12px' }}>
                Quick return
              </p>
              <h3 style={{ fontFamily: display, fontSize: '1.6rem', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '10px' }}>
                Recent pages stay close.
              </h3>
              <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.8, marginBottom: '18px', maxWidth: '34rem' }}>
                When you already know where you want to go, this should feel like the shortest path back rather than another section to think about.
              </p>
              <RecentPagesStrip />
            </div>
          </div>
        </section>

        {/* ── 4 · Your progress ──────────────────────────────────────────
            Streak + FocusAreas + QuickAchievement: momentum signals
        ─────────────────────────────────────────────────────────────── */}
        <section id="progress-block" style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Your progress"
            title="A small record of how often you've shown up."
            description="Use these as nudges, not as another thing to manage."
            accent="var(--teal-600)"
          />
          <div className="dash-progress-grid">
            <StudyStreakCard />
            <FocusAreasCard />
            <QuickAchievement />
          </div>
        </section>

        {/* ── 5 · Weak areas ─────────────────────────────────────────────
            WeakAreaBanner: important but not the first thing every visit
        ─────────────────────────────────────────────────────────────── */}
        <section id="weak-areas" style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Weak areas"
            title="What still needs work."
            description="Only worth looking at when you want to decide what to target next."
            accent="var(--coral-600)"
          />
          <WeakAreaBanner />
        </section>

        {/* ── 6 · Exam season ────────────────────────────────────────────
            ExamSeasonPlanner: full width, earns its own section
        ─────────────────────────────────────────────────────────────── */}
        <section id="exam-season" style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Exam season"
            title="A few revision suggestions you can borrow, move, or ignore."
            description="Use this only when you want help deciding what to do next."
            accent="var(--blue-600)"
          />
          <ExamSeasonPlanner hasOsce={hasOsce} hasQuiz={hasQuiz} />
        </section>

        {/* ── 7 · Analytics — only when real data exists ─────────────────
            OsceSparkline + quiz stats, hidden for new users
        ─────────────────────────────────────────────────────────────── */}
        {hasAnalytics && (
          <section id="analytics" style={{ paddingBottom: '52px' }}>
            <SectionHeading
              eyebrow="Analytics"
              title="A small read on what still needs work."
              description="Only the bits that help you choose the next revision block."
              accent="var(--purple-600)"
            />
            <div className="dash-analytics-grid">

              <OsceSparkline />

              {quizStats && (
                <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '20px' }}>
                  <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '10px' }}>
                    Quiz average
                  </p>
                  <p style={{ fontFamily: display, fontSize: '3rem', fontStyle: 'italic', lineHeight: 1, color: ink, marginBottom: '10px' }}>
                    {quizStats.averagePercent}%
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.75 }}>
                    Correct across {quizStats.totalAnswered} questions. The rough pass line is 75% — keep weaker areas from dragging that down under pressure.
                  </p>
                  {(quizStats.strongestArea || quizStats.weakestArea) && (
                    <div className="dash-analytics-sub">
                      {quizStats.strongestArea && (
                        <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '14px', marginTop: '16px' }}>
                          <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '6px' }}>Strongest area</p>
                          <p style={{ fontFamily: serif, fontSize: '13px', color: bodyColor }}>{quizStats.strongestArea}</p>
                        </div>
                      )}
                      {quizStats.weakestArea && (
                        <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '14px', marginTop: '16px' }}>
                          <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '6px' }}>Most fragile area</p>
                          <p style={{ fontFamily: serif, fontSize: '13px', color: bodyColor }}>{quizStats.weakestArea}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(quizStats?.weakAreas?.length ?? 0) > 0 && (
                <div className="dash-analytics-wide" style={{ borderTop: `0.5px solid ${border}`, paddingTop: '20px' }}>
                  <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '16px' }}>
                    Weak areas
                  </p>
                  <div className="dash-weak-grid">
                     {quizStats?.weakAreas?.map((item: { area: string; note: string }) => (
                      <div key={item.area} style={{ borderTop: `0.5px solid ${border}`, paddingTop: '12px' }}>
                        <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 400, color: bodyColor, marginBottom: '4px' }}>{item.area}</p>
                        <p style={{ fontFamily: serif, fontSize: '12px', color: mid, fontWeight: 300, lineHeight: 1.65 }}>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 8 · Saved resources ────────────────────────────────────────
            SavedFoldersDashboard: full width
        ─────────────────────────────────────────────────────────────── */}
        <section id="saved-resources" style={{ paddingBottom: '52px' }}>
          <SectionHeading
            eyebrow="Saved resources"
            title="Saved pages."
            description="Make folders only if they help. Otherwise this can stay quiet until there are pages you want to keep close."
          />
          <SavedFoldersDashboard />
        </section>

        {/* ── 9 · Signals ────────────────────────────────────────────────
            CommunityStatsCard + StudyTipCard + closing note
            Lightest content, naturally last
        ─────────────────────────────────────────────────────────────── */}
        <section id="signals" style={{ paddingBottom: '80px' }}>
          <SectionHeading
            eyebrow="Study signals"
            title="A quick read on momentum and patterns."
            description="Use these as nudges, not as another thing to manage."
            accent="var(--purple-600)"
          />
          <div className="dash-signals-grid">
            <CommunityStatsCard />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <StudyTipCard />
              <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '28px' }}>
                <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, marginBottom: '12px' }}>
                  Use this dashboard well
                </p>
                <p style={{ fontFamily: display, fontSize: '1.5rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.12, color: ink, marginBottom: '12px' }}>
                  Keep the next step smaller than your stress.
                </p>
                <p style={{ fontFamily: serif, fontSize: '13px', color: mid, fontWeight: 300, lineHeight: 1.8, marginBottom: '18px' }}>
                  The best version of this page is not the busiest one. Open one guide, run one station, or clear one short question set, then stop there if you need to.
                </p>
                <Link
                  href="/how-to-use"
                  style={{ fontFamily: serif, fontSize: '13px', color: bodyColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Read the study method →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        .dash-today-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 24px;
          align-items: start;
        }
        .dash-utility-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 20px;
          align-items: stretch;
        }
        .dash-utility-card {
          border: 0.5px solid ${borderMid};
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,250,248,0.98) 100%);
          padding: 20px 22px 24px;
          min-height: 100%;
        }
        .dash-progress-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: start;
        }
        .dash-analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 32px;
          align-items: start;
        }
        .dash-analytics-sub {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .dash-analytics-wide {
          grid-column: 1 / -1;
        }
        .dash-weak-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px 40px;
        }
        .dash-signals-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 48px;
          align-items: start;
        }
        .dash-bundle-prompt {
          grid-template-columns: minmax(0, 1fr) auto;
        }
        @media (max-width: 980px) {
          .dash-progress-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 860px) {
          .dash-today-grid,
          .dash-utility-grid,
          .dash-progress-grid,
          .dash-analytics-grid,
          .dash-signals-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .dash-analytics-wide { grid-column: 1; }
          .dash-weak-grid { grid-template-columns: 1fr; }
          .dash-signals-grid { gap: 32px; }
          .dash-bundle-prompt { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .dash-progress-grid { grid-template-columns: 1fr; }
          .dash-utility-card { padding: 18px 18px 20px; }
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
