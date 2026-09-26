import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';
import './dashboard-premium.css';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';
import SavedFoldersDashboard from '@/components/SavedFoldersDashboard';
import WeakAreaBanner from '@/components/dashboard/WeakAreaBanner';
import PlacementCountdown from '@/components/dashboard/PlacementCountdown';
import QuickTopicSearch from '@/components/dashboard/QuickTopicSearch';
import RecentPagesStrip from '@/components/dashboard/RecentPagesStrip';
import StudySignalsRow from '@/components/dashboard/StudySignalsRow';
import WhatToDoToday from '@/components/dashboard/WhatToDoToday';
import RevisionWeekPlanner from '@/components/dashboard/RevisionWeekPlanner';
import OsceSparkline from '@/components/dashboard/OsceSparkline';
import InteractiveFocusTimer from '@/components/dashboard/InteractiveFocusTimer';
import InteractiveDailyChecklist from '@/components/dashboard/InteractiveDailyChecklist';
import InteractiveEnergySelector from '@/components/dashboard/InteractiveEnergySelector';
import TopicStrengthDrilldown from '@/components/dashboard/TopicStrengthDrilldown';
import PinnedNote from '@/components/dashboard/PinnedNote';

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
  context,
}: {
  label: string;
  id?: string;
  accent?: string;
  context?: string;
}) {
  const words = label.split(' ');
  const last = words.pop();
  return (
    <div
      id={id}
      className="dash-section-head"
    >
      <span className="dash-section-bar" aria-hidden="true" />
      <h2 className="dash-section-title">
        {words.length > 0 ? `${words.join(' ')} ` : ''}<em>{last}</em>
      </h2>
      {context && <p className="dash-section-context">{context}</p>}
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
    <div className="dash-stat-card">
      <p className="dash-stat-label">{label}</p>
      <p className="dash-stat-value">{value}</p>
      <p className="dash-stat-unit">{unit}</p>
      {delta && (
        <p className={`dash-stat-delta ${deltaUp ? 'up' : 'down'}`}>
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
        <span style={{ fontFamily: serif, fontSize: '12px', color: 'var(--ink-mid)' }}>{label}</span>
        <span style={{ fontFamily: serif, fontSize: '11px', color: 'var(--ink-faint)' }}>{pct}%</span>
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
  const streakStats = await getUserStreakStats(userId).catch(() => null);

  const effectiveStreak = streakStats?.totalDaysActive
    ? { streakDays: streakStats.streakDays, lastSevenDays: streakStats.lastSevenDays }
    : quizStats
      ? { streakDays: quizStats.streakDays, lastSevenDays: quizStats.lastSevenDays }
      : null;

  // Derive weak/strong areas for progress bars
  const strengthColour = (pct: number) => (pct >= 75 ? '#0F6E56' : pct >= 55 ? '#A6906B' : '#B0664A');
  const topicStrength = (quizStats?.topicBreakdown ?? [
    { label: 'Respiratory',  pct: 60 },
    { label: 'Cardiac',      pct: 54 },
    { label: 'Neurological', pct: 46 },
    { label: 'Pharmacology', pct: 38 },
  ]).map((t: { label: string; pct: number }) => ({ label: t.label, pct: t.pct, color: strengthColour(t.pct) }));

  return (
    <DashboardClient firstName={firstName} hasOsce={hasOsce} hasQuiz={hasQuiz} hasMocks={hasMocks}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* ━━ 1 · PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="How you're doing" context="This week" />

          {/* 4-col analytics row */}
          <div className="dash-analytics-row">
            <StatCard
              label="Study streak"
              value={effectiveStreak ? String(effectiveStreak.streakDays) : '—'}
              unit={effectiveStreak ? 'days in a row — keep it going' : 'today could be day one'}
            >
              {/* Streak pips — 7 squares mapped to last 7 days */}
              {effectiveStreak && (
                <div className="dash-pips" aria-label="Last seven days">
                  {effectiveStreak.lastSevenDays.map((active: boolean, i: number) => (
                    <span key={i} className={`dash-pip${active ? ' on' : ''}${i === 6 ? ' today' : ''}`} />
                  ))}
                </div>
              )}
            </StatCard>

            <StatCard
              label="Quiz average"
              value={quizStats ? `${quizStats.averagePercent}%` : '—'}
              unit={quizStats ? `${quizStats.totalAnswered} questions answered` : 'run a quiz to fill this in'}
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
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, marginBottom: '14px' }}>
                Nothing to show yet — run one of these and your stats will start filling in.
              </p>
              <div className="dash-empty-actions">
                {[
                  { href: '/quiz',          label: 'Try the Core Quiz →',       sub: '17 nursing topics with instant feedback' },
                  { href: '/osce',          label: 'Run an OSCE station →',     sub: '50+ paediatric stations with checklists' },
                  { href: '/hub/childrens', label: 'Read a hub guide →',        sub: 'Free clinical guides for nursing students' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', flexDirection: 'column', gap: '5px',
                    padding: '16px 20px',
                    border: `0.5px solid ${border}`,
                    background: 'var(--surface-raised)',
                    textDecoration: 'none',
                    transition: 'background 0.12s',
                  }}>
                    <span style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: ink }}>{item.label}</span>
                    <span style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted }}>{item.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Topic strength + quiz accuracy interactive drilldown */}
          <div className="dash-prog-pair" style={{ marginTop: '12px' }}>
            <TopicStrengthDrilldown topics={topicStrength} title="Topic by topic" />
            <TopicStrengthDrilldown
              topics={topicStrength.map((t: { label: string; pct: number }) => { const pct = Math.min(t.pct + 14, 100); return { label: t.label, pct, color: strengthColour(pct) }; })}
              title="Accuracy by topic"
            />
          </div>

          <div className="dash-prog-pair" style={{ marginTop: '16px' }}>
            <WeakAreaBanner />
            <OsceSparkline />
          </div>
        </section>

        {/* ━━ 2 · TODAY'S PLAN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Today's plan" id="todays-plan" />
          
          <InteractiveEnergySelector />
          <WhatToDoToday />
          <InteractiveDailyChecklist />

          <div className="dash-prog-pair" style={{ marginTop: '16px' }}>
            <InteractiveFocusTimer />
            <PinnedNote />
          </div>

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
          <SectionDivider label="A week that could work for you" id="revision-week" context="Adjust to your schedule" />
          <RevisionWeekPlanner />
        </section>

        {/* ━━ 4 · FIND ANYTHING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Find a guide" id="search" />
          <QuickTopicSearch />
        </section>

        {/* ━━ 5 · SAVED FOLDERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section>
          <SectionDivider label="Your saved pages" id="saved-folders" />
          <SavedFoldersDashboard />
        </section>

        {/* ━━ 6 · CLOSING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{
          marginTop: '72px',
          paddingTop: '8px',
          textAlign: 'center',
          paddingBottom: '8px',
        }}>
          <svg className="dash-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true" style={{ marginBottom: '32px', marginLeft: 'auto', marginRight: 'auto' }}>
            <path d="M0,30 L400,30 L416,30 L424,24 L432,30 L452,30 L458,36 L466,4 L474,44 L480,30 L500,30 L516,20 L532,30 L1000,30" fill="none" />
          </svg>
          <p style={{
            fontFamily: display, fontSize: '1.2rem', fontStyle: 'italic',
            color: 'var(--ink-mid)', lineHeight: 1.5, maxWidth: '44ch',
            margin: '0 auto 8px',
          }}>
            "Keep the next step smaller than your stress."
          </p>
          <p style={{
            fontFamily: serif, fontSize: '11px', color: 'var(--ink-faint)', fontWeight: 300,
          }}>
            One guide, one station, one question — then rest if you need to.
          </p>
          <div style={{
            display: 'flex', gap: '20px', justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '12px',
          }}>
            <Link
              href="/how-to-use"
              style={{
                fontFamily: serif, fontSize: '12px', color: ink,
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Read the study method →
            </Link>
            <Link
              href="/neurodivergent-guide"
              style={{
                fontFamily: serif, fontSize: '12px', color: ink,
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Neurodivergent revision guide →
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        .dash-analytics-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 0;
        }
        .dash-empty-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .dash-empty-actions a:hover { background: var(--surface-sunken) !important; }
        @media (max-width: 700px) {
          .dash-empty-actions { grid-template-columns: 1fr; }
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
        @media (max-width: 420px) {
          .dash-analytics-row { grid-template-columns: 1fr; }
          .dash-stat-card { padding: 16px 16px !important; }
          .dash-empty-actions { grid-template-columns: 1fr; }
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

  // Which of the last 7 days had activity (index 0 = 6 days ago, index 6 = today)
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return uniqueDates.includes(d.toDateString());
  });

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
    lastSevenDays,
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

async function getUserStreakStats(userId: string) {
  const { createServiceClient } = await import('@/lib/supabase');
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('study_sessions')
    .select('study_date')
    .eq('clerk_user_id', userId)
    .order('study_date', { ascending: false })
    .limit(365);

  if (error || !data) return null;
  const dateSet = new Set((data as { study_date: string }[]).map((r) => r.study_date));
  const totalDaysActive = dateSet.size;
  if (totalDaysActive === 0) return { streakDays: 0, lastSevenDays: Array(7).fill(false), totalDaysActive: 0 };

  const today = new Date();
  const toYmd = (d: Date) => d.toISOString().split('T')[0];

  let streakDays = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (dateSet.has(toYmd(d))) streakDays++;
    else if (i > 0) break;
  }

  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return dateSet.has(toYmd(d));
  });

  return { streakDays, lastSevenDays, totalDaysActive };
}
