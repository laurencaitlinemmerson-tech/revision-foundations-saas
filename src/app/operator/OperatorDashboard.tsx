'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import type { OperatorSnapshot } from '@/lib/operator/types';
import { derive, RANGES, type RangeKey } from '@/lib/operator/fitness/derive';
import { fmtLongDate, fmtNumber, fmtSigned } from './components/format';
import { Delta } from './components/ui';
import Trajectory from './sections/Trajectory';
import TodayBoard from './sections/TodayBoard';
import Energy from './sections/Energy';
import Composition from './sections/Composition';
import Training from './sections/Training';
import Recovery from './sections/Recovery';
import StudioPulse from './sections/StudioPulse';

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
    <button
      type="button"
      className="op-btn"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

export default function OperatorDashboard({ snapshot }: { snapshot: OperatorSnapshot }) {
  const [range, setRange] = useState<RangeKey>('90d');

  const data = useMemo(
    () => derive(snapshot.readings, snapshot.dailies, snapshot.workouts, snapshot.settings, range),
    [snapshot, range],
  );

  const { latest, previous, settings } = { ...data, settings: snapshot.settings };

  // The hero delta compares against the smoothed line a week back, not
  // the previous raw reading — day-to-day scale noise is not signal.
  const weekAgoTrend = data.days.length > 7 ? data.days[data.days.length - 8]?.trendWeight ?? null : null;
  const latestTrend = [...data.days].reverse().find((day) => day.trendWeight !== null)?.trendWeight ?? null;
  const weeklyDelta = latestTrend !== null && weekAgoTrend !== null ? latestTrend - weekAgoTrend : null;

  return (
    <div className="op">
      <div className="op-shell">
        <header className="op-masthead">
          <div>
            <div className="op-kicker">Private · link only</div>
            <h1>The Operator Desk</h1>
            <div className="op-badges">
              <span className="op-badge">
                <span className="op-badge-dot" />
                {fmtLongDate(snapshot.generatedAt)}
              </span>
              {snapshot.isDemo ? (
                <span className="op-badge" data-tone="warning">
                  <span className="op-badge-dot" />
                  Sample data
                </span>
              ) : null}
              {snapshot.setupRequired ? (
                <span className="op-badge" data-tone="warning">
                  <span className="op-badge-dot" />
                  Tables not created
                </span>
              ) : null}
            </div>
          </div>

          <div className="op-masthead-meta">
            <ThemeToggle />
            <form action="/api/operator/session" method="post">
              <button type="submit" className="op-btn">
                Sign out
              </button>
            </form>
          </div>
        </header>

        {snapshot.setupRequired ? (
          <div className="op-note" data-tone="warning" style={{ marginTop: 20 }}>
            <span className="op-note-icon" aria-hidden="true">
              ◆
            </span>
            <p style={{ margin: 0 }}>
              <strong>Showing sample data.</strong> Run{' '}
              <code>supabase/migrations/20260803_operator_dashboard.sql</code> in the Supabase SQL
              editor to create the operator tables, then post real readings to{' '}
              <code>/api/operator/readings</code>.
            </p>
          </div>
        ) : null}

        {/* One filter row, above everything it scopes. */}
        <div className="op-filters">
          <div className="op-seg" role="group" aria-label="Date range">
            {RANGES.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={range === option.key}
                onClick={() => setRange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="op-kicker">
            {data.days.length} days · {data.days.filter((day) => day.weight !== null).length}{' '}
            weigh-ins · {data.training.sessions} sessions
          </span>
        </div>

        {/* Hero figure — exactly one per view. */}
        <div className="op-grid op-grid-hero">
          <div className="op-hero">
            <div>
              <div className="op-stat-label">Weight now</div>
              <div className="op-hero-value">
                {latest ? fmtNumber(latest.weight, 1) : '—'}
                <span className="op-hero-unit">kg</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <Delta value={weeklyDelta} suffix=" kg" digits={2} goodDirection="down" period=" this week" />
              </div>
            </div>

            <dl className="op-hero-rows">
              <div className="op-hero-row">
                <dt>Trend</dt>
                <dd>
                  {data.slopePerWeek === null ? '—' : `${fmtSigned(data.slopePerWeek, 2)} kg/wk`}
                </dd>
              </div>
              <div className="op-hero-row">
                <dt>To goal ({fmtNumber(settings.targetWeightKg, 1)} kg)</dt>
                <dd>{data.toGoalKg === null ? '—' : `${fmtNumber(data.toGoalKg, 1)} kg`}</dd>
              </div>
              <div className="op-hero-row">
                <dt>Projected arrival</dt>
                <dd>{data.goalEta ? fmtLongDate(data.goalEta) : 'Not on this trend'}</dd>
              </div>
              <div className="op-hero-row">
                <dt>Last weigh-in</dt>
                <dd>{latest ? fmtLongDate(latest.date) : '—'}</dd>
              </div>
            </dl>
          </div>

          <TodayBoard data={data} settings={settings} />
        </div>

        <Trajectory data={data} settings={settings} previous={previous} />
        <Energy data={data} settings={settings} />
        <Composition data={data} />
        <Training data={data} />
        <Recovery data={data} settings={settings} />
        <StudioPulse business={snapshot.business} />

        <footer className="op-footer">
          <span>
            Private dashboard · reachable only with the link · never indexed, never in the sitemap
          </span>
          <span>
            Rendered {fmtLongDate(snapshot.generatedAt)} · range {range}
          </span>
        </footer>
      </div>
    </div>
  );
}
