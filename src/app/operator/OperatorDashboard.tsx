'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { OperatorSnapshot } from '@/lib/operator/types';
import { derive, isoDay, type RangeKey } from '@/lib/operator/fitness/derive';
import {
  fmtCompact,
  fmtDuration,
  fmtLongDate,
  fmtNumber,
  toUnit,
  type Unit,
} from './components/format';
import { Chip, Kpi } from './components/ui';
import type { Logger } from './tabs/types';
import TargetsRow from './components/TargetsRow';
import Today from './tabs/Today';
import Trends from './tabs/Trends';
import Plan from './tabs/Plan';
import Progress from './tabs/Progress';
import Nutrition from './tabs/Nutrition';
import Training from './tabs/Training';
import Habits from './tabs/Habits';

const THEME_KEY = 'op-theme';
const THEME_EVENT = 'op-theme-change';

/* The inline bootstrap in layout.tsx stamps the theme onto the root
   element before first paint, so that element — not React state — is
   the source of truth. Reading it as an external store keeps the two
   from disagreeing and avoids a second render just to catch up. */

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
    <button type="button" className="op-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'trends', label: 'Trends' },
  { key: 'plan', label: 'Plan' },
  { key: 'progress', label: 'Progress' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'training', label: 'Training' },
  { key: 'habits', label: 'Habits' },
] as const;

export type TabKey = (typeof TABS)[number]['key'];

function greetingFor(date: Date, name: string) {
  const hour = date.getHours();
  if (hour < 12) return `Good morning, ${name}.`;
  if (hour < 18) return `Good afternoon, ${name}.`;
  return `Good evening, ${name}.`;
}

export default function OperatorDashboard({ snapshot }: { snapshot: OperatorSnapshot }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('today');
  const [range, setRange] = useState<RangeKey>('90d');
  const [unit, setUnit] = useState<Unit>('kg');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [targetsOpen, setTargetsOpen] = useState(false);

  const data = useMemo(
    () => derive(snapshot.readings, snapshot.dailies, snapshot.workouts, snapshot.settings, range),
    [snapshot, range],
  );

  const settings = snapshot.settings;
  const today = data.today;
  const latest = data.latest;

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const post = useCallback(
    async (url: string, body: unknown) => {
      setBusy(true);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          flash(detail?.error === 'not_configured' ? 'Supabase not configured' : 'Could not save');
          return false;
        }
        // The page is server-rendered from Supabase; re-fetch rather than
        // patching local state, so what is on screen is what was stored.
        router.refresh();
        return true;
      } catch {
        flash('Could not reach the server');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [flash, router],
  );

  const logger: Logger = useMemo(
    () => ({
      busy,
      saveDay: async (date, fields) => {
        const ok = await post('/api/operator/ingest', { days: [{ date, ...fields }] });
        if (ok) flash('Saved');
        return ok;
      },
      saveWeight: async (date, weightKg) => {
        const ok = await post('/api/operator/readings', { date, weight: weightKg });
        if (ok) flash('Weigh-in saved');
        return ok;
      },
      saveSettings: async (fields) => {
        const ok = await post('/api/operator/settings', fields);
        if (ok) flash('Targets updated');
        return ok;
      },
      logSet: async (date, move, loadKg, reps, type) => {
        const ok = await post('/api/operator/sets', { date, move, loadKg, reps, type });
        if (ok) flash(`${move} logged`);
        return ok;
      },
    }),
    [busy, post, flash],
  );

  // Hero delta reads the smoothed line a week back, not the previous raw
  // reading — day-to-day scale noise is not signal.
  const latestTrend = [...data.days].reverse().find((d) => d.trendWeight !== null)?.trendWeight ?? null;
  const weekAgoTrend = data.days.length > 7 ? data.days[data.days.length - 8]?.trendWeight ?? null : null;
  const weeklyDelta = latestTrend !== null && weekAgoTrend !== null ? latestTrend - weekAgoTrend : null;

  const unitLabel = unit;
  const heroWeight = toUnit(latest?.weight ?? null, unit);
  const intake = today?.intakeKcal ?? null;
  const targetIntake = data.tdee.targetIntake;
  const tail = data.days.slice(-14);

  const verdict = (() => {
    if (data.slopePerWeek === null) return 'Not enough weigh-ins yet to read a trend — keep logging.';
    const rate = Math.abs(data.slopePerWeek);
    if (data.slopePerWeek < -0.05) {
      const vsTarget = rate / Math.max(0.01, settings.weeklyChangeKg);
      if (vsTarget > 1.4) {
        return `Losing ${fmtNumber(rate, 2)} kg a week — faster than the ${fmtNumber(settings.weeklyChangeKg, 2)} kg target. That pace tends to cost muscle; consider easing the deficit.`;
      }
      if (vsTarget < 0.6) {
        return `Slightly behind plan — losing ${fmtNumber(rate, 2)} kg a week against a ${fmtNumber(settings.weeklyChangeKg, 2)} kg target. Hold the load and add steps before cutting further.`;
      }
      return `On plan at ${fmtNumber(rate, 2)} kg a week. Nothing to change — keep protein near target and let it run.`;
    }
    if (data.slopePerWeek > 0.05) {
      return `Up ${fmtNumber(rate, 2)} kg a week across this window. Intake is running above expenditure.`;
    }
    return 'Holding steady inside ±0.05 kg a week — the scale has gone quiet.';
  })();

  const navMeta: Record<TabKey, string> = {
    today: today?.intakeKcal ? `${fmtCompact(today.intakeKcal)} kcal` : '—',
    trends: data.slopePerWeek === null ? '—' : `${fmtNumber(data.slopePerWeek, 2)} kg`,
    plan: `${fmtNumber(settings.weeklyChangeKg, 2)} kg/wk`,
    progress: data.first && latest ? `${fmtNumber(Math.abs(latest.weight - data.first.weight), 1)} kg` : '—',
    nutrition: data.averages.proteinG ? `${fmtNumber(data.averages.proteinG)} g` : '—',
    training: `${data.training.sessions} logged`,
    habits: `${data.streaks.logging.current} days`,
  };

  const tabProps = { data, settings, unit, logger, snapshot, range, setRange } as const;

  return (
    <div className="op">
      <div className="op-shell">
        <aside className="op-rail">
          <div>
            <div className="op-wordmark">
              Daily<em> log</em>
            </div>
            <div className="op-eyebrow" style={{ marginTop: 4 }}>
              {snapshot.isDemo ? 'Sample data' : 'Private · link only'}
            </div>
            <span className="op-sync">
              <i />
              {snapshot.setupRequired
                ? 'Tables not created'
                : `Synced ${fmtLongDate(snapshot.generatedAt)}`}
            </span>
          </div>

          <div className="op-whoami op-rail-hide">
            <div className="op-avatar">L</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink)' }}>Lauren</div>
              <div className="op-eyebrow">
                {data.slopePerWeek !== null && data.slopePerWeek < 0 ? 'Cut' : 'Maintain'} ·{' '}
                {Math.max(1, Math.ceil(data.days.length / 7))} weeks
              </div>
            </div>
          </div>

          <nav className="op-nav" aria-label="Sections">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-current={tab === item.key}
                onClick={() => setTab(item.key)}
              >
                <span>{item.label}</span>
                <span className="op-nav-meta">{navMeta[item.key]}</span>
              </button>
            ))}
          </nav>

          <div className="op-streaks">
            <span className="op-eyebrow op-rail-hide">Streaks</span>
            <span className="op-streak">
              <b>{data.streaks.logging.current}</b> days logged
            </span>
            <span className="op-streak">
              <b>{data.streaks.protein.current}</b> protein hit
            </span>
            <span className="op-streak">
              <b>{data.training.sessions}</b> workouts
            </span>
            <Link
              className="op-btn"
              href="/operator/wedding"
              style={{ marginTop: 6, justifyContent: 'center' }}
            >
              Wedding hub →
            </Link>
          </div>
        </aside>

        <main className="op-main">
          <header className="op-head">
            <div>
              <h1>{greetingFor(new Date(snapshot.generatedAt), 'Lauren')}</h1>
              <p>
                {latest ? fmtLongDate(latest.date) : '—'} ·{' '}
                {heroWeight === null ? '—' : `${fmtNumber(heroWeight, 1)} ${unitLabel}`} this morning
                {intake !== null ? `, ${fmtNumber(Math.max(0, targetIntake - intake))} kcal left today.` : '.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="op-tabs" style={{ margin: 0 }} role="group" aria-label="Weight unit">
                {(['kg', 'lb'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-selected={unit === option}
                    role="tab"
                    onClick={() => setUnit(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <ThemeToggle />
              <form action="/api/operator/session" method="post">
                <button type="submit" className="op-btn">Sign out</button>
              </form>
            </div>
          </header>

          {snapshot.setupRequired ? (
            <div className="op-card op-card-soft" style={{ marginBottom: 16 }}>
              <p className="op-note">
                <strong>Showing sample data.</strong> Run{' '}
                <code>supabase/migrations/20260803_operator_dashboard.sql</code> in the Supabase SQL
                editor to create the operator tables, then log a weigh-in below.
              </p>
            </div>
          ) : null}

          {/* Hero figure — exactly one on the page. */}
          <div className="op-hero">
            <div>
              <div className="op-hero-label">This morning</div>
              <div className="op-hero-row">
                <span className="op-hero-value" data-empty={heroWeight === null}>
                  {heroWeight === null ? 'No weigh-in logged yet' : fmtNumber(heroWeight, 1)}
                </span>
                {heroWeight !== null ? <span className="op-hero-unit">{unitLabel}</span> : null}
                {weeklyDelta !== null ? (
                  <Chip
                    value={toUnit(weeklyDelta, unit)}
                    suffix={` ${unitLabel}`}
                    digits={2}
                    goodDirection="down"
                    label="this week"
                  />
                ) : null}
              </div>
              <p className="op-hero-verdict">{verdict}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="op-pill" data-variant="solid" onClick={() => setTab('nutrition')}>
                  Log food →
                </button>
                <button type="button" className="op-pill" data-variant="outline" onClick={() => setTab('training')}>
                  Log exercise →
                </button>
                <button
                  type="button"
                  className="op-pill"
                  data-variant="ghost"
                  onClick={() => setTargetsOpen((v) => !v)}
                >
                  {targetsOpen ? 'Hide targets' : 'Edit targets'}
                </button>
              </div>
              <div className="op-hero-stats">
                <div>
                  <div className="op-hero-stat-label">Calories left</div>
                  <div className="op-hero-stat-value" data-empty={intake === null}>
                    {intake === null ? 'not logged' : fmtNumber(Math.max(0, targetIntake - intake))}
                  </div>
                  <div className="op-hero-stat-note">of {fmtNumber(targetIntake)}</div>
                </div>
                <div>
                  <div className="op-hero-stat-label">Protein</div>
                  <div className="op-hero-stat-value" data-empty={today?.proteinG == null}>
                    {today?.proteinG == null ? 'not logged' : `${fmtNumber(today.proteinG)} g`}
                  </div>
                  <div className="op-hero-stat-note">of {fmtNumber(settings.proteinTargetG)} g</div>
                </div>
                <div>
                  <div className="op-hero-stat-label">Goal weight</div>
                  <div className="op-hero-stat-value">
                    {fmtNumber(toUnit(settings.targetWeightKg, unit), 1)}
                  </div>
                  <div className="op-hero-stat-note">
                    {data.toGoalKg === null
                      ? '—'
                      : `${fmtNumber(Math.abs(toUnit(data.toGoalKg, unit) ?? 0), 1)} ${unitLabel} to go`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {targetsOpen ? (
            <TargetsRow settings={settings} unit={unit} logger={logger} targetIntake={targetIntake} />
          ) : null}

          <div className="op-grid op-grid-auto" style={{ marginBottom: 16 }}>
            <Kpi
              label="Weight"
              value={heroWeight === null ? '—' : fmtNumber(heroWeight, 1)}
              unit={unitLabel}
              chip={<Chip value={toUnit(weeklyDelta, unit)} suffix="" digits={2} goodDirection="down" />}
              spark={tail.map((d) => toUnit(d.trendWeight, unit))}
            />
            <Kpi
              label="Calories"
              value={intake === null ? '—' : fmtNumber(intake)}
              unit="kcal"
              chip={
                <span className="op-chip" data-tone={intake !== null && intake > targetIntake ? 'bad' : 'good'}>
                  {intake === null ? 'not logged' : intake > targetIntake ? 'over' : 'on track'}
                </span>
              }
              spark={tail.map((d) => d.intakeKcal)}
              color="var(--series-2)"
            />
            <Kpi
              label="Protein"
              value={today?.proteinG == null ? '—' : fmtNumber(today.proteinG)}
              unit="g"
              chip={
                <span
                  className="op-chip"
                  data-tone={
                    today?.proteinG != null && today.proteinG >= settings.proteinTargetG ? 'good' : 'flat'
                  }
                >
                  {today?.proteinG == null
                    ? '—'
                    : `${Math.round((today.proteinG / settings.proteinTargetG) * 100)}%`}
                </span>
              }
              spark={tail.map((d) => d.proteinG)}
              color="var(--series-3)"
            />
            <Kpi
              label="Steps"
              value={fmtCompact(today?.steps ?? null)}
              chip={
                <span
                  className="op-chip"
                  data-tone={today?.steps != null && today.steps >= settings.stepTarget ? 'good' : 'flat'}
                >
                  {fmtCompact(settings.stepTarget)} goal
                </span>
              }
              spark={tail.map((d) => d.steps)}
              color="var(--series-4)"
            />
            <Kpi
              label="Sleep"
              value={fmtDuration(today?.sleepTotalMin ?? null)}
              chip={
                <span
                  className="op-chip"
                  data-tone={
                    today?.sleepTotalMin != null && today.sleepTotalMin >= settings.sleepTargetMin
                      ? 'good'
                      : 'flat'
                  }
                >
                  {fmtDuration(settings.sleepTargetMin)}
                </span>
              }
              spark={tail.map((d) => d.sleepTotalMin)}
              color="var(--series-5)"
            />
          </div>

          <div className="op-tabs" role="tablist" aria-label="Dashboard sections">
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
            {tab === 'today' ? <Today {...tabProps} /> : null}
            {tab === 'trends' ? <Trends {...tabProps} /> : null}
            {tab === 'plan' ? <Plan {...tabProps} /> : null}
            {tab === 'progress' ? <Progress {...tabProps} /> : null}
            {tab === 'nutrition' ? <Nutrition {...tabProps} /> : null}
            {tab === 'training' ? <Training {...tabProps} /> : null}
            {tab === 'habits' ? <Habits {...tabProps} /> : null}
          </div>

          <footer className="op-foot">
            <span>Private dashboard · reachable only with the link · never indexed</span>
            <span>
              {snapshot.isDemo ? 'Sample data · ' : ''}
              {data.days.length} days · latest {today ? fmtLongDate(today.date) : '—'} ·{' '}
              {isoDay(new Date(snapshot.generatedAt))}
            </span>
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
