'use client';

import { useEffect, useState } from 'react';
import type { SessionDetail } from '@/lib/health/sessionDetail';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * One session's per-minute record, fetched when it is opened.
 *
 * A year of workouts each carrying a sample a minute would be megabytes to draw
 * a table, so the list never asks for this. Opening a session does.
 */

export type SessionData = {
  loading: boolean;
  id: string | null;
  detail: SessionDetail | null;
  /** True when the row exists but carries only a summary. */
  summaryOnly: boolean;
};

export function useSessionDetail(id: string | null): SessionData {
  const [data, setData] = useState<SessionData>({
    loading: false, id: null, detail: null, summaryOnly: false,
  });

  useEffect(() => {
    let cancelled = false;

    // Both the cleared case and the loading flag are set from inside the async
    // body, so the effect never sets state during the render that scheduled it.
    (async () => {
      if (!id) { if (!cancelled) setData({ loading: false, id: null, detail: null, summaryOnly: false }); return; }
      if (!cancelled) setData({ loading: true, id, detail: null, summaryOnly: false });

      const pw = storedOperatorPassword();
      if (!pw) { if (!cancelled) setData({ loading: false, id, detail: null, summaryOnly: true }); return; }
      try {
        const res = await fetch(`/api/operator/workouts/${id}`, {
          headers: { 'x-operator-pw': pw }, cache: 'no-store',
        });
        const json = res.ok ? await res.json() as { detail: SessionDetail | null } : null;
        if (!cancelled) {
          setData({
            loading: false,
            id,
            detail: json?.detail ?? null,
            summaryOnly: !json?.detail?.rich,
          });
        }
      } catch {
        if (!cancelled) setData({ loading: false, id, detail: null, summaryOnly: true });
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return data;
}
