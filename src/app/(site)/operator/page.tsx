import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TDEECalculator from '@/components/dashboard/TDEECalculator';
import BackfillButton from '@/components/operator/BackfillButton';
import { createServiceClient } from '@/lib/supabase';
import { isOperator } from '@/lib/operator';

export const metadata: Metadata = {
  title: 'Operator',
  robots: { index: false, follow: false },
};

// ── Design tokens ──────────────────────────────────────────────────────────────
const serif   = "var(--font-body)";
const display = "var(--font-display)";
const ink     = "var(--espresso)";
const muted   = "#9A8E84";
const ACCENT  = ['#8BBCAA', '#D4A574', '#7BA7CC', '#C89BB0', '#D4B896'];

// Product prices for revenue estimation (signed-in users only go to entitlements, not purchases)
const PRICES = { osce: 4.99, quiz: 4.99, bundle: 9.99 } as const;

// ── Helpers ────────────────────────────────────────────────────────────────────
function gbp(n: number) {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function num(n: number) {
  return n.toLocaleString('en-GB');
}
function shortDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d));
}
function titleCase(s: string) {
  return s.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Divider({ label, accent, id }: { label: string; accent?: string; id?: string }) {
  return (
    <div id={id} style={{
      borderTop: '0.5px solid rgba(0,0,0,0.09)',
      paddingTop: '14px',
      marginBottom: '20px',
      marginTop: '52px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      {accent && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0 }} />}
      <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function Metric({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string; accent?: string;
}) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '20px 18px' }}>
      <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '10px' }}>
        {label}
      </p>
      <p style={{ fontFamily: display, fontSize: '1.8rem', fontStyle: 'italic', color: accent ?? ink, lineHeight: 1, marginBottom: '3px' }}>
        {value}
      </p>
      <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300 }}>{sub}</p>
    </div>
  );
}

function ActionBadge({ count, label, href, color }: { count: number; label: string; href: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }} className="op-badge">
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '13px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)',
      }}>
        <span style={{
          width: '34px', height: '34px', background: color, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: display, fontSize: '1rem', fontStyle: 'italic', color: '#fff',
        }}>
          {count}
        </span>
        <span style={{ fontFamily: serif, fontSize: '12px', color: count > 0 ? ink : muted, flex: 1 }}>
          {label}
        </span>
        <span style={{ fontFamily: serif, fontSize: '11px', color: muted }}>→</span>
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function OperatorPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  if (!(await isOperator(userId))) redirect('/dashboard');

  const data  = await getOperatorData();
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <section style={{ background: ink }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(80px,10vw,112px) clamp(20px,4vw,40px) 48px' }}>
          <p style={{ fontFamily: serif, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', marginBottom: '14px' }}>
            Operator · {today}
          </p>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.2rem,5vw,3.4rem)', fontStyle: 'italic', color: '#fff', lineHeight: 1.05, marginBottom: '0' }}>
            Platform overview.
          </h1>
          <div className="op-header-stats">
            {[
              { label: 'Registered users', value: num(data.totalUsers)     },
              { label: 'Paying customers', value: num(data.payingCustomers) },
              { label: 'Revenue (est.)',   value: gbp(data.totalRevenue)   },
              { label: 'Active today',     value: num(data.studySessionsToday) },
            ].map(s => (
              <div key={s.label} style={{ borderLeft: '0.5px solid rgba(255,255,255,0.12)', paddingLeft: '20px' }}>
                <p style={{ fontFamily: serif, fontSize: '9px', color: 'rgba(255,255,255,0.38)', marginBottom: '5px', letterSpacing: '0.1em' }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: display, fontSize: '1.4rem', fontStyle: 'italic', color: '#fff' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(20px,4vw,40px) 80px' }}>

        {/* ━━ Revenue ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Revenue by product" accent="#8BBCAA" />
        <div className="op-3col">
          <Metric label="OSCE tool"       value={gbp(data.revenue.osce)}   sub={`${data.sales.osce} tracked sales`}   accent="#8BBCAA" />
          <Metric label="Core quiz"       value={gbp(data.revenue.quiz)}   sub={`${data.sales.quiz} tracked sales`}   accent="#D4A574" />
          <Metric label="Complete bundle" value={gbp(data.revenue.bundle)} sub={`${data.sales.bundle} tracked sales`} accent="#7BA7CC" />
        </div>
        <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300, marginTop: '10px', lineHeight: 1.6 }}>
          Revenue from guest (unclaimed) purchases is tracked in the purchases table.
          Signed-in purchases are estimated from entitlements using list prices.
          {data.unclaimedCount > 0 && ` · ${data.unclaimedCount} unclaimed purchase${data.unclaimedCount !== 1 ? 's' : ''} awaiting account linking.`}
        </p>

        {/* ━━ Engagement ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Platform engagement" accent="#D4A574" />
        <div className="op-4col">
          <Metric label="Questions answered" value={num(data.totalQuestionsAnswered)} sub="across all users"    />
          <Metric label="Platform accuracy"  value={`${data.platformAccuracy}%`}      sub="correct answers"    />
          <Metric label="OSCE runs"          value={num(data.totalOsceAttempts)}       sub="all time"           />
          <Metric label="Study days logged"  value={num(data.totalStudyDays)}          sub="total user-days"    />
        </div>

        {data.topTopics.length > 0 && (
          <div style={{ marginTop: '12px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '20px 22px' }}>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '14px' }}>
              Most-practised quiz topics
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {data.topTopics.map((t, i) => (
                <div key={t.topic} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: serif, fontSize: '10px', color: muted, width: '14px', textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: serif, fontSize: '12px', color: ink, flex: 1 }}>{t.topic}</span>
                  <span style={{ fontFamily: serif, fontSize: '10px', color: muted }}>{num(t.count)}</span>
                  <div style={{ width: '72px', height: '2px', background: 'rgba(0,0,0,0.06)', flexShrink: 0, position: 'relative' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: ACCENT[i % ACCENT.length],
                      width: `${Math.round((t.count / data.topTopics[0].count) * 100)}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━ Needs attention ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Needs attention" accent="#C89BB0" />
        <div className="op-3col">
          <ActionBadge count={data.unansweredQuestions} label="Unanswered community questions" href="/hub/questions"  color="#C89BB0" />
          <ActionBadge count={data.pendingReviews}       label="Reviews pending approval"       href="#"              color="#D4A574" />
          <ActionBadge count={data.unclaimedCount}       label="Unclaimed guest purchases"      href="#"              color="#7BA7CC" />
        </div>

        {/* ━━ Recent activity ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Recent activity" accent="#7BA7CC" />
        <div className="op-2col">

          {/* Recent signups */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '20px 22px' }}>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '14px' }}>
              Latest signups
            </p>
            {data.recentUsers.length === 0 ? (
              <p style={{ fontFamily: serif, fontSize: '12px', color: muted, fontWeight: 300 }}>No users yet</p>
            ) : data.recentUsers.map((u, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                padding: '9px 0',
                borderBottom: i < data.recentUsers.length - 1 ? '0.5px solid rgba(0,0,0,0.07)' : 'none',
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: ink, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.full_name || '—'}
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email || '—'}
                  </p>
                </div>
                <p style={{ fontFamily: serif, fontSize: '10px', color: muted, flexShrink: 0 }}>{shortDate(u.created_at)}</p>
              </div>
            ))}
          </div>

          {/* Recent purchases */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '20px 22px' }}>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '14px' }}>
              Latest purchases
            </p>
            {data.recentPurchases.length === 0 ? (
              <p style={{ fontFamily: serif, fontSize: '12px', color: muted, fontWeight: 300 }}>No purchases recorded</p>
            ) : data.recentPurchases.map((p, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                padding: '9px 0',
                borderBottom: i < data.recentPurchases.length - 1 ? '0.5px solid rgba(0,0,0,0.07)' : 'none',
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: ink, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.customer_email || '—'}
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '10px', color: muted, fontWeight: 300 }}>
                    {p.product_key} · <span style={{ color: p.status === 'claimed' ? '#8BBCAA' : '#D4A574' }}>{p.status}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: serif, fontSize: '12px', color: '#8BBCAA' }}>
                    {p.amount_total != null ? gbp(p.amount_total / 100) : '—'}
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '10px', color: muted }}>{shortDate(p.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ━━ Admin tools ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Admin tools" accent="#C89BB0" />
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '20px 22px' }}>
          <p style={{ fontFamily: serif, fontSize: '12px', color: ink, marginBottom: '4px' }}>
            Backfill past purchases
          </p>
          <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, marginBottom: '14px', lineHeight: 1.6 }}>
            Replays all paid Stripe sessions. Creates missing entitlements for signed-in buyers and queues unclaimed purchase records for guests. Safe to run multiple times — skips sessions already processed.
          </p>
          <BackfillButton />
        </div>

        {/* ━━ Wellness ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Divider label="Personal wellness" accent="#D4B896" />
        <div className="op-2col">
          <TDEECalculator />
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', padding: '24px 26px' }}>
            <p style={{ fontFamily: serif, fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: '4px' }}>
              A note
            </p>
            <p style={{ fontFamily: display, fontSize: '1.05rem', fontStyle: 'italic', color: ink, marginBottom: '18px', lineHeight: 1.4 }}>
              Running a SaaS is a physical act too.
            </p>
            {[
              {
                title: 'Stress raises TDEE',
                body: 'Cognitive load and chronic stress increase energy expenditure — even on sedentary days. Account for this on heavy build weeks.',
              },
              {
                title: 'Under-eating affects output',
                body: 'Poor nutrition hits executive function first. If you\'re shipping features late and skipping meals, your code will reflect it.',
              },
              {
                title: 'Placement shifts the baseline',
                body: 'If you\'re on placement while running this, you\'re burning significantly more than a desk day. Set "very active" and eat accordingly.',
              },
            ].map(item => (
              <div key={item.title} style={{ paddingTop: '13px', marginTop: '13px', borderTop: '0.5px solid rgba(0,0,0,0.07)' }}>
                <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 500, color: ink, marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontFamily: serif, fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <style>{`
        .op-header-stats {
          display: flex;
          gap: 0;
          flex-wrap: wrap;
          margin-top: 32px;
          gap: 24px;
        }
        .op-3col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .op-4col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .op-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .op-badge { transition: opacity 0.12s; }
        .op-badge:hover { opacity: 0.8; }
        @media (max-width: 900px) {
          .op-4col { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 680px) {
          .op-3col, .op-2col { grid-template-columns: 1fr; }
        }
        @media (max-width: 500px) {
          .op-4col { grid-template-columns: 1fr 1fr; }
          .op-header-stats { gap: 16px; }
        }
      `}</style>
    </div>
  );
}

// ── Data fetching ──────────────────────────────────────────────────────────────
async function getOperatorData() {
  const supabase  = createServiceClient();
  const todayStr  = new Date().toISOString().split('T')[0];

  const [
    usersCountRes,
    entitlementsRes,
    allPurchasesRes,
    recentPurchasesRes,
    quizRes,
    osceRes,
    sessionsTodayRes,
    sessionsTotalRes,
    unansweredRes,
    pendingReviewsRes,
    recentUsersRes,
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('entitlements').select('clerk_user_id, product').eq('status', 'active'),
    supabase.from('purchases').select('product_key, amount_total, status, claimed_by_clerk_user_id'),
    supabase.from('purchases')
      .select('customer_email, product_key, amount_total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('quiz_progress').select('topic_id, questions_attempted, questions_correct'),
    supabase.from('osce_progress').select('attempts'),
    supabase.from('study_sessions').select('id', { count: 'exact', head: true }).eq('study_date', todayStr),
    supabase.from('study_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('questions').select('id', { count: 'exact', head: true }).eq('is_answered', false),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('users')
      .select('full_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // ── Entitlements ────────────────────────────────────────────────────────────
  const entitlements = entitlementsRes.data ?? [];
  const usersWithBundle = new Set(entitlements.filter(e => e.product === 'bundle').map(e => e.clerk_user_id));
  const usersWithOsce   = new Set(entitlements.filter(e => e.product === 'osce').map(e => e.clerk_user_id));
  const usersWithQuiz   = new Set(entitlements.filter(e => e.product === 'quiz').map(e => e.clerk_user_id));
  const allEntitledUsers = new Set(entitlements.map(e => e.clerk_user_id));

  // ── Purchases ───────────────────────────────────────────────────────────────
  const purchases = allPurchasesRes.data ?? [];
  const claimedUserIds = new Set(
    purchases.filter(p => p.status === 'claimed').map(p => p.claimed_by_clerk_user_id).filter(Boolean),
  );
  const unclaimedCount = purchases.filter(p => p.status === 'unclaimed').length;

  // Revenue from guest purchases (tracked in purchases table with actual amount)
  const guestRevenue = purchases.reduce((s, p) => s + (p.amount_total ?? 0), 0) / 100;

  // Revenue estimate for signed-in users (their purchases go straight to entitlements, no amount stored)
  let signedInRevenue = 0;
  for (const uid of allEntitledUsers) {
    if (claimedUserIds.has(uid)) continue; // already counted in guestRevenue
    if (usersWithBundle.has(uid)) {
      signedInRevenue += PRICES.bundle;
    } else {
      if (usersWithOsce.has(uid)) signedInRevenue += PRICES.osce;
      if (usersWithQuiz.has(uid)) signedInRevenue += PRICES.quiz;
    }
  }

  const totalRevenue    = guestRevenue + signedInRevenue;
  const payingCustomers = allEntitledUsers.size + unclaimedCount;

  // Revenue by product (from purchases only — actual amounts)
  const revenue = { osce: 0, quiz: 0, bundle: 0 };
  const sales   = { osce: 0, quiz: 0, bundle: 0 };
  for (const p of purchases) {
    const k = p.product_key as keyof typeof revenue;
    if (k in revenue) {
      revenue[k] += (p.amount_total ?? 0) / 100;
      sales[k]   += 1;
    }
  }

  // ── Quiz ────────────────────────────────────────────────────────────────────
  const quizList = quizRes.data ?? [];
  const totalQuestionsAnswered = quizList.reduce((s, r) => s + (r.questions_attempted ?? 0), 0);
  const totalQuestionsCorrect  = quizList.reduce((s, r) => s + (r.questions_correct  ?? 0), 0);
  const platformAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
    : 0;

  const topicMap = new Map<string, number>();
  for (const r of quizList) {
    const label = titleCase(String(r.topic_id));
    topicMap.set(label, (topicMap.get(label) ?? 0) + (r.questions_attempted ?? 0));
  }
  const topTopics = [...topicMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  // ── OSCE ────────────────────────────────────────────────────────────────────
  const totalOsceAttempts = (osceRes.data ?? []).reduce((s, r) => s + (r.attempts ?? 0), 0);

  return {
    totalUsers:            usersCountRes.count ?? 0,
    payingCustomers,
    totalRevenue,
    studySessionsToday:    sessionsTodayRes.count ?? 0,
    totalStudyDays:        sessionsTotalRes.count ?? 0,
    revenue,
    sales,
    unclaimedCount,
    totalQuestionsAnswered,
    platformAccuracy,
    totalOsceAttempts,
    topTopics,
    unansweredQuestions:  unansweredRes.count ?? 0,
    pendingReviews:       pendingReviewsRes.count ?? 0,
    recentUsers: (recentUsersRes.data ?? []) as Array<{
      full_name: string | null;
      email: string | null;
      created_at: string | null;
    }>,
    recentPurchases: (recentPurchasesRes.data ?? []) as Array<{
      customer_email: string | null;
      product_key: string;
      amount_total: number | null;
      status: string;
      created_at: string | null;
    }>,
  };
}
