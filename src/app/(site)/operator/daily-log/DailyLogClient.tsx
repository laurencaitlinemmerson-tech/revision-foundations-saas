'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DailyLogView from './DailyLogView';
import { useOperatorData } from './data';
import {
  deriveVals,
  DEFAULT_PROPS,
  INITIAL_STATE,
  type DailyLogProps,
  type DailyLogState,
} from './logic';
import './daily-log.css';

/**
 * Holds the dashboard's interaction state and hands the derived view-model to
 * the generated view.
 *
 * Only preferences live here — which tab, which range, which unit. Everything
 * measured comes from Apple Health on each render, so today's figures reset by
 * themselves when the date rolls over and there is no stale copy to clear.
 */

/** What the Google connect flow reports back through the redirect. */
const GOOGLE_RESULTS: Record<string, { ok: boolean; text: string }> = {
  connected: { ok: true, text: 'Google Calendar connected. Your week and the shift comparison will fill in on the next refresh.' },
  denied: { ok: false, text: 'The Google consent screen was cancelled, so nothing changed.' },
  bad_state: { ok: false, text: 'That sign-in link had expired. Press connect again — the whole round trip has to finish inside ten minutes.' },
  no_code: { ok: false, text: 'Google sent the browser back without an authorisation code. Press connect and try once more.' },
  exchange_failed: { ok: false, text: 'Google would not exchange the code for a token.' },
  save_failed: { ok: false, text: 'Google authorised fine, but the token could not be stored — run supabase-operator-google.sql.' },
};

/**
 * The two figures the dashboard cannot derive: practice hours worked before the
 * calendar window, and the registration target. Kept in localStorage so they
 * survive a reload without needing a table of their own.
 */
const PLACEMENT_KEY = 'operator-placement-v1';

export default function DailyLogClient({ props = DEFAULT_PROPS }: { props?: DailyLogProps }) {
  const [state, setStateRaw] = useState<DailyLogState>(INITIAL_STATE);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const live = useOperatorData();
  const refresh = live.refresh;

  const setState = useCallback<
    (patch: Partial<DailyLogState> | ((s: DailyLogState) => Partial<DailyLogState>)) => void
  >((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  // localStorage is only readable after mount, so the saved practice-hours
  // figures are picked up here rather than in the initial state.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PLACEMENT_KEY);
      if (!raw) return;
      const { prior, target } = JSON.parse(raw) as { prior?: number; target?: number };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStateRaw((s) => ({
        ...s,
        placementPrior: Number.isFinite(prior) ? Number(prior) : s.placementPrior,
        placementTarget: Number.isFinite(target) && Number(target) > 0 ? Number(target) : s.placementTarget,
      }));
    } catch {
      /* a corrupt entry just means the defaults stand */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PLACEMENT_KEY,
        JSON.stringify({ prior: state.placementPrior, target: state.placementTarget }),
      );
    } catch {
      /* private browsing, or the quota is full — not worth surfacing */
    }
  }, [state.placementPrior, state.placementTarget]);

  // The connect flow returns as a page load with ?google=… on it. Report the
  // outcome, then strip the parameter so a reload does not repeat the message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('google');
    if (!result) return;

    const base = GOOGLE_RESULTS[result] ?? { ok: false, text: 'The Google connection did not complete.' };
    const detail = params.get('detail');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotice(detail && !base.ok ? { ...base, text: `${base.text} Google said: ${detail}` } : base);

    params.delete('google');
    params.delete('detail');
    const qs = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : ''));

    if (base.ok) refresh();
  }, [refresh]);

  const vals = useMemo(
    () => deriveVals(state, setState, props, live, live.refresh),
    [state, setState, props, live],
  );

  return (
    <div className="daily-log-shell">
      {notice && (
        <div
          role="status"
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
            padding: '14px 18px', marginBottom: 16, borderRadius: 12, fontSize: 13, lineHeight: 1.55,
            background: notice.ok ? '#EDF1EC' : '#FAF0F3',
            border: `0.5px solid ${notice.ok ? 'rgba(127,146,137,0.35)' : 'rgba(192,108,132,0.30)'}`,
            color: notice.ok ? '#4E6259' : '#8A4459',
          }}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'inherit', fontSize: 15, lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
        </div>
      )}
      <DailyLogView v={vals} />
    </div>
  );
}
