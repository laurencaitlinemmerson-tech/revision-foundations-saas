'use client';

import { useEffect, useState } from 'react';
import type { Findings } from '@/lib/health/whatWorked';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * The whole record's findings, read once.
 *
 * Unlike the rest of the dashboard this does not change through the day — it is
 * eight years of history, and a weigh-in this morning moves it by nothing worth
 * re-fetching for. So it is read on mount and left alone.
 */

export type HistoryData = {
  loaded: boolean;
  findings: Findings | null;
};

export const EMPTY_HISTORY: HistoryData = { loaded: false, findings: null };

export function useHistory(): HistoryData {
  const [data, setData] = useState<HistoryData>(EMPTY_HISTORY);

  useEffect(() => {
    let cancelled = false;

    // Everything, including the locked case, resolves inside the async body, so
    // this effect never sets state during the render that scheduled it.
    (async () => {
      const pw = storedOperatorPassword();
      if (!pw) { if (!cancelled) setData({ loaded: true, findings: null }); return; }
      try {
        const res = await fetch('/api/operator/history', {
          headers: { 'x-operator-pw': pw },
          cache: 'no-store',
        });
        const json = res.ok ? await res.json() as { findings: Findings | null } : { findings: null };
        if (!cancelled) setData({ loaded: true, findings: json.findings });
      } catch {
        if (!cancelled) setData({ loaded: true, findings: null });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return data;
}
