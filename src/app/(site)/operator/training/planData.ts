'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PlanKind } from '@/app/api/operator/plan/route';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * The intended week, read and written.
 *
 * The only writable thing on the dashboard, so unlike every other hook here it
 * exposes a setter. It writes through to the server and holds the new value
 * locally at the same time, because a plan that flickers back to its old value
 * while a request lands reads as the click not having worked.
 */

export type PlanDay = { weekday: number; kind: PlanKind; label: string | null };

export type PlanData = {
  loaded: boolean;
  plan: PlanDay[];
  /** True when the table has not been created yet. */
  setupRequired: boolean;
  save: (weekday: number, kind: PlanKind, label?: string | null) => void;
  saving: boolean;
};

const REST_WEEK: PlanDay[] = Array.from({ length: 7 }, (_, i) => ({
  weekday: i + 1, kind: 'rest', label: null,
}));

export const EMPTY_PLAN: PlanData = {
  loaded: false, plan: REST_WEEK, setupRequired: false, save: () => {}, saving: false,
};

export function usePlan(): PlanData {
  const [state, setState] = useState<{ loaded: boolean; plan: PlanDay[]; setupRequired: boolean }>(
    { loaded: false, plan: REST_WEEK, setupRequired: false },
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pw = storedOperatorPassword();
      if (!pw) { if (!cancelled) setState({ loaded: true, plan: REST_WEEK, setupRequired: false }); return; }
      try {
        const res = await fetch('/api/operator/plan', { headers: { 'x-operator-pw': pw }, cache: 'no-store' });
        const json = res.ok ? await res.json() as { plan: PlanDay[]; setup_required: boolean } : null;
        if (!cancelled) {
          setState({
            loaded: true,
            plan: json?.plan ?? REST_WEEK,
            setupRequired: json?.setup_required ?? true,
          });
        }
      } catch {
        if (!cancelled) setState({ loaded: true, plan: REST_WEEK, setupRequired: true });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const save = useCallback((weekday: number, kind: PlanKind, label: string | null = null) => {
    // Held locally straight away: the row is the click's own feedback, and a
    // round trip before it changes reads as nothing having happened.
    setState((s) => ({
      ...s,
      plan: s.plan.map((d) => (d.weekday === weekday ? { ...d, kind, label } : d)),
    }));
    setSaving(true);

    (async () => {
      const pw = storedOperatorPassword();
      if (!pw) { setSaving(false); return; }
      try {
        const res = await fetch('/api/operator/plan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-operator-pw': pw },
          body: JSON.stringify({ weekday, kind, label }),
        });
        if (!res.ok) setState((s) => ({ ...s, setupRequired: true }));
      } catch {
        setState((s) => ({ ...s, setupRequired: true }));
      } finally {
        setSaving(false);
      }
    })();
  }, []);

  return { ...state, save, saving };
}
