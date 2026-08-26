'use client';

import { useEffect } from 'react';
import type { PeriodId } from './periods';
import { SCREENS, type Screen, type TrainingState } from './logic';

/**
 * The address bar as state.
 *
 * Without this the dashboard is nine screens that forget themselves: a refresh
 * drops you back on the Dashboard, the back button leaves the app entirely, and
 * there is no way to send someone — or yourself, later — a link to the thing you
 * are looking at. Holding screen, period, filter and open day in the query
 * string is most of what separates an app from a page with tabs.
 *
 * Screen changes push a history entry so Back walks between screens, which is
 * what the button is for. Everything else replaces, because stepping back
 * through eleven period changes to leave a screen is not navigation.
 */

const KEYS = { screen: 's', period: 'p', focus: 'f', day: 'd', month: 'm' } as const;

const PERIODS: PeriodId[] = ['Day', 'Week', 'Month', 'Year', 'Custom'];

/** What the URL says, as far as it can be trusted. */
export function stateFromUrl(): Partial<TrainingState> {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  const out: Partial<TrainingState> = {};

  const screen = q.get(KEYS.screen);
  if (screen && (SCREENS as readonly string[]).includes(screen)) {
    out.screen = screen as Screen;
  }

  const period = q.get(KEYS.period);
  if (period && (PERIODS as string[]).includes(period)) out.range = period as PeriodId;

  const focus = q.get(KEYS.focus);
  if (focus) out.focus = focus;

  // A malformed date in the query string must not reach the derivation.
  const day = q.get(KEYS.day);
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) out.selectedDay = day;

  const month = q.get(KEYS.month);
  if (month && /^\d{4}-\d{2}$/.test(month)) out.calendarMonth = month;

  return out;
}

function toQuery(st: TrainingState): string {
  const q = new URLSearchParams(window.location.search);

  // Defaults are left out, so a plain /operator stays a plain /operator.
  const set = (key: string, value: string | null, isDefault: boolean) => {
    if (value === null || isDefault) q.delete(key);
    else q.set(key, value);
  };

  set(KEYS.screen, st.screen, st.screen === 'Dashboard');
  set(KEYS.period, st.range, st.range === 'Week');
  set(KEYS.focus, st.focus, st.focus === null);
  set(KEYS.day, st.selectedDay, st.selectedDay === null);
  set(KEYS.month, st.calendarMonth, st.calendarMonth === null);

  const s = q.toString();
  return s ? `?${s}` : window.location.pathname;
}

/** Keep the address bar and the state in step, both ways. */
export function useUrlState(
  state: TrainingState,
  apply: (patch: Partial<TrainingState>) => void,
) {
  // State → URL. A screen change is navigation; everything else is a detail of
  // the view you are already on.
  useEffect(() => {
    const next = toQuery(state);
    const current = window.location.search || window.location.pathname;
    if (next === current) return;

    const screenChanged = new URLSearchParams(window.location.search).get(KEYS.screen)
      !== (state.screen === 'Dashboard' ? null : state.screen);

    const url = next.startsWith('?') ? next : window.location.pathname;
    if (screenChanged) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }, [state]);

  // URL → state, so Back and Forward actually move.
  useEffect(() => {
    const onPop = () => apply({
      screen: 'Dashboard', range: 'Week', focus: null, selectedDay: null, calendarMonth: null,
      ...stateFromUrl(),
    });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [apply]);
}
