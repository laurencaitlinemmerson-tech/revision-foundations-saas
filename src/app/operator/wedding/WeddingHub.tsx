'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { WeddingSnapshot } from '@/lib/wedding/types';
import { fmtMoney, groupByPhase, isoDay, summarise } from '@/lib/wedding/derive';
import { fmtLongDate } from '../components/format';
import type { WeddingWriter } from './sections/types';
import TaskList from './sections/TaskList';
import HenDo from './sections/HenDo';
import Budget from './sections/Budget';
import People from './sections/People';
import Details from './sections/Details';

const THEME_KEY = 'op-theme';
const THEME_EVENT = 'op-theme-change';

function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function readTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.opTheme === 'dark' ? 'dark' : 'light';
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => 'light' as const);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.opTheme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing — the choice just will not persist.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  return (
    <button
      type="button"
      className="op-btn"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}

const TABS = [
  { key: 'checklist', label: 'Checklist' },
  { key: 'hen', label: 'Hen do' },
  { key: 'budget', label: 'Budget' },
  { key: 'people', label: 'People' },
  { key: 'details', label: 'Details' },
] as const;

export type WeddingTabKey = (typeof TABS)[number]['key'];

export default function WeddingHub({ snapshot }: { snapshot: WeddingSnapshot }) {
  const router = useRouter();
  const [tab, setTab] = useState<WeddingTabKey>('checklist');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const summary = useMemo(() => summarise(snapshot), [snapshot]);
  const { settings } = snapshot;

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const writer: WeddingWriter = useMemo(
    () => ({
      busy,
      save: async (collection, fields, id) => {
        setBusy(true);
        try {
          const response = await fetch('/api/operator/wedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection, id, fields }),
          });
          if (!response.ok) {
            const detail = await response.json().catch(() => ({}));
            flash(
              detail?.error === 'not_configured'
                ? 'Supabase not configured'
                : 'Could not save — has the wedding migration been run?',
            );
            return false;
          }
          router.refresh();
          return true;
        } catch {
          flash('Could not reach the server');
          return false;
        } finally {
          setBusy(false);
        }
      },
      remove: async (collection, id) => {
        setBusy(true);
        try {
          const response = await fetch(
            `/api/operator/wedding?collection=${collection}&id=${encodeURIComponent(id)}`,
            { method: 'DELETE' },
          );
          if (!response.ok) {
            flash('Could not delete');
            return false;
          }
          router.refresh();
          return true;
        } catch {
          flash('Could not reach the server');
          return false;
        } finally {
          setBusy(false);
        }
      },
    }),
    [busy, flash, router],
  );

  const phases = useMemo(
    () => groupByPhase(snapshot.tasks.filter((task) => !task.isHen)),
    [snapshot.tasks],
  );

  const coupleLine = [settings.brideName, settings.partnerName].filter(Boolean).join(' & ');
  const progressPct = summary.tasksTotal
    ? Math.round((summary.tasksDone / summary.tasksTotal) * 100)
    : 0;

  const sectionProps = { snapshot, summary, writer, phases } as const;

  return (
    <div className="op">
      <div className="op-shell">
        <aside className="op-rail">
          <div>
            <div className="op-wordmark">
              Wedding<em> hub</em>
            </div>
            <div className="op-eyebrow" style={{ marginTop: 4 }}>
              Maid of honour
            </div>
            <span className="op-sync">
              <i />
              {summary.daysToWedding === null
                ? 'No date set'
                : summary.daysToWedding >= 0
                  ? `${summary.daysToWedding} days to go`
                  : 'Married!'}
            </span>
          </div>

          <nav className="op-nav" aria-label="Wedding sections">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-current={tab === item.key}
                onClick={() => setTab(item.key)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="op-streaks">
            <span className="op-eyebrow op-rail-hide">Progress</span>
            <span className="op-streak">
              <b>{summary.tasksDone}</b> of {summary.tasksTotal} done
            </span>
            {summary.overdue.length ? (
              <span className="op-streak">
                <b>{summary.overdue.length}</b> overdue
              </span>
            ) : null}
            <Link className="op-btn" href="/operator" style={{ marginTop: 6, justifyContent: 'center' }}>
              ← Fitness
            </Link>
          </div>
        </aside>

        <main className="op-main">
          <header className="op-head">
            <div>
              <h1>{coupleLine ? `${coupleLine}'s wedding` : 'The wedding'}</h1>
              <p>
                {settings.weddingDate ? fmtLongDate(settings.weddingDate) : 'Date not set yet'}
                {settings.venue ? ` · ${settings.venue}` : ''}
                {summary.tasksTotal ? ` · ${progressPct}% of the list done` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <ThemeToggle />
              <form action="/api/operator/session" method="post">
                <button type="submit" className="op-btn">Sign out</button>
              </form>
            </div>
          </header>

          {snapshot.setupRequired ? (
            <div className="op-card op-card-soft" style={{ marginBottom: 16 }}>
              <p className="op-note">
                <strong>Tables not created yet.</strong> Run{' '}
                <code>supabase/migrations/20260804_wedding_hub.sql</code> in the Supabase SQL editor,
                then everything here becomes editable.
              </p>
            </div>
          ) : null}

          {/* Countdown hero — the one display figure on this page. */}
          <div className="op-hero">
            <div>
              <div className="op-hero-label">Counting down</div>
              <div className="op-hero-row">
                <span className="op-hero-value" data-empty={summary.daysToWedding === null}>
                  {summary.daysToWedding === null
                    ? 'Set a wedding date to start the countdown'
                    : summary.daysToWedding >= 0
                      ? summary.daysToWedding
                      : 'Married!'}
                </span>
                {summary.daysToWedding !== null && summary.daysToWedding >= 0 ? (
                  <span className="op-hero-unit">days</span>
                ) : null}
              </div>
              <p className="op-hero-verdict">
                {summary.overdue.length
                  ? `${summary.overdue.length} task${summary.overdue.length === 1 ? '' : 's'} overdue — worth clearing those first.`
                  : summary.upcoming.length
                    ? `${summary.upcoming.length} task${summary.upcoming.length === 1 ? '' : 's'} due in the next fortnight. Nothing overdue.`
                    : summary.tasksTotal
                      ? 'Nothing overdue and nothing due in the next fortnight — you are ahead.'
                      : 'Add your first task on the checklist to get started.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="op-pill" data-variant="solid" onClick={() => setTab('checklist')}>
                  Checklist →
                </button>
                <button type="button" className="op-pill" data-variant="outline" onClick={() => setTab('hen')}>
                  Hen do →
                </button>
                <button type="button" className="op-pill" data-variant="ghost" onClick={() => setTab('details')}>
                  Edit details
                </button>
              </div>
              <div className="op-hero-stats">
                <div>
                  <div className="op-hero-stat-label">Hen do</div>
                  <div className="op-hero-stat-value" data-empty={summary.daysToHen === null}>
                    {summary.daysToHen === null
                      ? 'no date'
                      : summary.daysToHen >= 0
                        ? `${summary.daysToHen} days`
                        : 'done'}
                  </div>
                  <div className="op-hero-stat-note">
                    {settings.henLocation || 'location tbc'}
                  </div>
                </div>
                <div>
                  <div className="op-hero-stat-label">My spend</div>
                  <div className="op-hero-stat-value">
                    {fmtMoney(summary.mySpend, settings.currency)}
                  </div>
                  <div className="op-hero-stat-note">
                    {summary.budgetCap
                      ? `of ${fmtMoney(summary.budgetCap, settings.currency)}`
                      : `${fmtMoney(summary.myOutstanding, settings.currency)} outstanding`}
                  </div>
                </div>
                <div>
                  <div className="op-hero-stat-label">Bridal party</div>
                  <div className="op-hero-stat-value">{summary.partyCount}</div>
                  <div className="op-hero-stat-note">{summary.henAttending} coming to the hen</div>
                </div>
              </div>
            </div>
          </div>

          <div className="op-tabs" role="tablist" aria-label="Wedding sections">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={tab === item.key}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" aria-label={TABS.find((t) => t.key === tab)?.label}>
            {tab === 'checklist' ? <TaskList {...sectionProps} /> : null}
            {tab === 'hen' ? <HenDo {...sectionProps} /> : null}
            {tab === 'budget' ? <Budget {...sectionProps} /> : null}
            {tab === 'people' ? <People {...sectionProps} /> : null}
            {tab === 'details' ? <Details {...sectionProps} /> : null}
          </div>

          <footer className="op-foot">
            <span>Private hub · reachable only with the link · never indexed</span>
            <span>{isoDay(new Date(snapshot.generatedAt))}</span>
          </footer>
        </main>
      </div>

      {toast ? (
        <div className="op-toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
