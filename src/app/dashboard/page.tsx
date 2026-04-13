import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import WeakAreaBanner from '@/components/dashboard/WeakAreaBanner';
import PlacementCountdown from '@/components/dashboard/PlacementCountdown';
import QuickTopicSearch from '@/components/dashboard/QuickTopicSearch';
import RecentPagesStrip from '@/components/dashboard/RecentPagesStrip';
import StudySignalsRow from '@/components/dashboard/StudySignalsRow';
import WhatToDoToday from '@/components/dashboard/WhatToDoToday';
import RevisionWeekPlanner from '@/components/dashboard/RevisionWeekPlanner';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your study dashboard for tools, saved pages, and purchased content.',
};

// ── Design tokens ──────────────────────────────────────────────────────────────
const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const mid     = "var(--charcoal)";
const muted   = "var(--charcoal-light)";
const border  = "var(--border)";

// ── Section divider ────────────────────────────────────────────────────────────
function SectionDivider({
  label,
  id,
  accent,
  context,
}: {
  label: string;
  id?: string;
  accent?: string;
  context?: string;
}) {
  return (
    <div
      id={id}
      style={{
        borderTop: `0.5px solid ${border}`,
        paddingTop: '16px',
        marginBottom: '28px',
        marginTop: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {accent && (
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: accent, flexShrink: 0,
        }} />
      )}
      <p style={{
        fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em',
        textTransform: 'uppercase', color: muted, margin: 0,
      }}>
        {label}
      </p>
      {context && (
        <p style={{
          marginLeft: 'auto', fontFamily: serif, fontSize: '11px',
          color: '#C4B4A8', fontWeight: 300, margin: 0,
        }}>
          {context}
        </p>
      )}
    </div>
  );
}

// ── Analytics stat card ────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  delta,
  deltaUp,
  children,
}: {
  label: string;
  value: string;
  unit: string;
  delta?: string;
  deltaUp?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="dash-stat-card" style={{
      background: '#fff',
      border: '0.5px solid rgba(0,0,0,0.12)',
      padding: '24px 22px',
    }}>
      <p style={{
        fontFamily: serif, fontSize: '9px', letterSpacing: '0.16em',
        textTransform: 'uppercase', color: muted, marginBottom: '11px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: display, fontSize: '2rem', fontStyle: 'italic',
        color: ink, lineHeight: 1,
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: serif, fontSize: '10px', color: '#B4A89C',
        fontWeight: 300, marginTop: '4px',
      }}>
        {unit}
      </p>
      {delta && (
        <p style={{
          fontFamily: serif, fontSize: '10px',
          color: deltaUp ? '#6B9E87' : '#B07A8E',
          marginTop: '10px', paddingTop: '9px',
          borderTop: `0.5px solid rgba(0,0,0,0.06)`,
        }}>
          {deltaUp ? '↑' : '↓'} {delta}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Inline progress bar ────────────────────────────────────────────────────────
function ProgressBar({
  label,
  pct,
  color,
  index = 0,
}: {
  label: string;
  pct: number;
  color: string;
  index?: number;
}) {
  return (
    <div className="dash-pb-row" style={{ marginBottom: '13px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontFamily: serif, fontSize: '12px', color: '#2C2A27' }}>{label}</span>
        <span style={{ fontFamily: serif, fontSize: '11px', color: '#B4A89C' }}>{pct}%</span>
      </div>
      <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)' }}>
        <div
          className="dash-pb-fill"
          style={{
            height: '100%',
            background: color,
            ['--bar-width' as string]: `${pct}%`,
            animationDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user      = await currentUser();
  const firstName = user?.firstName ?? null;

  const entitlements  = await getUserEntitlements(userId);
  const hasOsce       = hasAccessToContent(entitlements, 'osce');
  const hasQuiz       = hasAccessToContent(entitlements, 'quiz');
  const hasMocks      = hasAccessToContent(entitlements, 'osce'); // Bundled with OSCE access

  const quizStats = await getUserQuizStats(userId).catch(() => null);
  const osceStats = await getUserOsceStats(userId).catch(() => null);

  // Derive weak/strong areas for progress bars
  const topicStrength = quizStats?.topicBreakdown ?? [
    { label: 'Respiratory',  pct: 60, color: '#8BBCAA' },
    { label: 'Cardiac',      pct: 54, color: '#D4A574' },
    { label: 'Neurological', pct: 46, color: '#7BA7CC' },
    { label: 'Pharmacology', pct: 38, color: '#C89BB0' },
  ];

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz} hasMocks={hasMocks}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* ━━ 1 · PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Your progress" accent="#D4A574" context="This week" />

          {/* 4-col analytics row */}
          <div className="dash-analytics-row">
            <StatCard
              label="Study streak"
              value={quizStats ? String(quizStats.streakDays) : '—'}
              unit={quizStats ? 'days in a row' : 'No data yet'}
            >
              {/* Streak pips — 7 squares, last one = today */}
              {quizStats && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '11px' }}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} style={{
                      width: '9px', height: '9px',
                      background: i < 6 ? '#8BBCAA' : '#2C2A27',
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              )}
            </StatCard>

            <StatCard
              label="Quiz average"
              value={quizStats ? `${quizStats.averagePercent}%` : '—'}
              unit={quizStats ? `${quizStats.totalAnswered} questions answered` : 'No quiz data yet'}
              delta={quizStats?.weekOnWeekDelta ? `${quizStats.weekOnWeekDelta}% from last week` : undefined}
              deltaUp={(quizStats?.weekOnWeekDelta ?? 0) > 0}
            />

            <StatCard
              label="OSCE stations"
              value={String(osceStats?.totalRuns ?? '—')}
              unit="completed this month"
              delta={osceStats?.monthOnMonthDelta ? `${osceStats.monthOnMonthDelta} more than last month` : undefined}
              deltaUp={(osceStats?.monthOnMonthDelta ?? 0) > 0}
            />

            <StatCard
              label="Hours this week"
              value={quizStats?.hoursThisWeek ? String(quizStats.hoursThisWeek) : '—'}
              unit="hours studied"
            />
          </div>

          {/* Empty state — shown only when no data exists yet */}
          {!quizStats && !osceStats && (
            <p style={{
              fontFamily: serif, fontSize: '12px', fontWeight: 300,
              color: muted, marginTop: '10px', fontStyle: 'italic',
            }}>
              Complete your first quiz or OSCE session to see your stats here.
            </p>
          )}

          {/* Topic strength + quiz accuracy bars */}
          <div className="dash-prog-pair" style={{ marginTop: '12px' }}>
            <div style={{
              background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)', padding: '24px 26px',
            }}>
              <p style={{
                fontFamily: serif, fontSize: '9px', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: muted, marginBottom: '16px',
              }}>
                Topic strength
              </p>
              {topicStrength.map((t, i) => (
                <ProgressBar key={t.label} label={t.label} pct={t.pct} color={t.color} index={i} />
              ))}
            </div>

            <div style={{
              background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)', padding: '24px 26px',
            }}>
              <p style={{
                fontFamily: serif, fontSize: '9px', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: muted, marginBottom: '16px',
              }}>
                Quiz accuracy by area
              </p>
              {topicStrength.map((t, i) => (
                <ProgressBar key={t.label} label={t.label} pct={Math.min(t.pct + 14, 100)} color={t.color} index={i} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <WeakAreaBanner />
          </div>
        </section>

        {/* ━━ 2 · TODAY'S PLAN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Today's plan" id="todays-plan" accent="#8BBCAA" />
          <WhatToDoToday />
          <div style={{ marginTop: '12px' }}>
            <PlacementCountdown />
          </div>
          <div style={{ marginTop: '12px' }}>
            <StudySignalsRow />
          </div>
          <div style={{ marginTop: '20px' }}>
            <p style={{
              fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: muted, marginBottom: '10px',
            }}>
              Recent pages
            </p>
            <RecentPagesStrip />
          </div>
        </section>

        {/* ━━ 3 · REVISION WEEK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Sample revision week" id="revision-week" accent="#D4B896" context="Adjust to your schedule" />
          <RevisionWeekPlanner />
        </section>

        {/* ━━ 4 · FIND ANYTHING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Find anything" id="search" accent="#7BA7CC" />
          <QuickTopicSearch />
        </section>

        {/* ━━ 5 · SAVED FOLDERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Saved folders" id="saved-folders" accent="#D4B896" />
          <SavedFoldersDashboard />
        </section>

        {/* ━━ 6 · CLOSING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          marginTop: '56px',
          paddingTop: '30px',
          borderTop: `0.5px solid rgba(0,0,0,0.07)`,
          textAlign: 'center',
          paddingBottom: '8px',
        }}>
          <p style={{
            fontFamily: display, fontSize: '1.2rem', fontStyle: 'italic',
            color: '#2C2A27', lineHeight: 1.5, maxWidth: '44ch',
            margin: '0 auto 8px',
          }}>
            "Keep the next step smaller than your stress."
          </p>
          <p style={{
            fontFamily: serif, fontSize: '11px', color: '#C4B4A8', fontWeight: 300,
          }}>
            One guide, one station, one question — then rest if you need to.
          </p>
          <Link
            href="/how-to-use"
            style={{
              fontFamily: serif, fontSize: '12px', color: ink,
              textDecoration: 'underline', textUnderlineOffset: '3px',
              display: 'inline-block', marginTop: '12px',
            }}
          >
            Read the study method →
          </Link>
        </div>

      </div>

      <style>{`
        .dash-analytics-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 0;
        }
        .dash-prog-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 980px) {
          .dash-analytics-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 860px) {
          .dash-analytics-row { grid-template-columns: 1fr 1fr; }
          .dash-prog-pair { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .dash-analytics-row { grid-template-columns: 1fr 1fr; }
        }

        /* ── Stat card hover ── */
        .dash-stat-card {
          transition: transform 0.2s ease;
          cursor: default;
        }
        .dash-stat-card:hover {
          transform: scale(1.02);
        }

        /* ── Progress bar animate-in ── */
        @keyframes dashBarGrow {
          from { width: 0; }
          to   { width: var(--bar-width, 0%); }
        }
        .dash-pb-fill {
          width: var(--bar-width, 0%);
          animation: dashBarGrow 0.6s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .dash-pb-fill { animation: none; }
        }

        /* ── Progress bar row hover ── */
        .dash-pb-row {
          padding: 3px 6px;
          margin-left: -6px;
          margin-right: -6px;
          transition: background 0.2s ease;
          cursor: default;
        }
        .dash-pb-row:hover {
          background: rgba(0,0,0,0.025);
        }
      `}</style>
    </DashboardClient>
  );
}

// ── Data fetching ──────────────────────────────────────────────────────────────
const TOPIC_COLORS = ['#8BBCAA', '#D4A574', '#7BA7CC', '#C89BB0', '#D4B896', '#8BBCAA'];

async function getUserQuizStats(userId: string) {
  const { createServiceClient } = await import('@/lib/supabase');
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('quiz_progress')
    .select('topic_id, questions_attempted, questions_correct, last_attempted_at')
    .eq('clerk_user_id', userId);

  if (error || !data || data.length === 0) return null;

  const totalAnswered = data.reduce((sum, row) => sum + (row.questions_attempted || 0), 0);
  const totalCorrect  = data.reduce((sum, row) => sum + (row.questions_correct || 0), 0);
  if (totalAnswered === 0) return null;

  const averagePercent = Math.round((totalCorrect / totalAnswered) * 100);

  // Streak: count consecutive days with activity up to today
  const dates = data
    .map((row) => row.last_attempted_at as string)
    .filter(Boolean)
    .map((d) => new Date(d).toDateString());
  const uniqueDates = [...new Set(dates)].sort();
  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (uniqueDates.includes(d.toDateString())) streakDays++;
    else if (i > 0) break;
  }

  const topicBreakdown = data
    .filter((row) => row.questions_attempted > 0)
    .map((row, i) => {
      const pct = Math.round((row.questions_correct / row.questions_attempted) * 100);
      const label = (row.topic_id as string)
        .split(/[-_]/)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { label, pct, color: TOPIC_COLORS[i % TOPIC_COLORS.length] };
    })
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 4);

  return {
    totalAnswered,
    averagePercent,
    weekOnWeekDelta: 0,
    streakDays,
    hoursThisWeek: 0,
    strongestArea: topicBreakdown[topicBreakdown.length - 1]?.label ?? '',
    weakestArea:   topicBreakdown[0]?.label ?? '',
    topicBreakdown,
  };
}

async function getUserOsceStats(userId: string) {
  const { createServiceClient } = await import('@/lib/supabase');
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('osce_progress')
    .select('station_id, attempts, best_score')
    .eq('clerk_user_id', userId);

  if (error || !data || data.length === 0) return null;

  const totalRuns = data.reduce((sum, row) => sum + (row.attempts || 0), 0);
  if (totalRuns === 0) return null;

  const scoredRows = data.filter((row) => (row.best_score || 0) > 0);
  const averageScore = scoredRows.length > 0
    ? Math.round(scoredRows.reduce((sum, row) => sum + row.best_score, 0) / scoredRows.length)
    : 0;

  return {
    totalRuns,
    averageScore,
    monthOnMonthDelta: 0,
  };
}
