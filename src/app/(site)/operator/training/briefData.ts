'use client';

import { useEffect, useState } from 'react';
import type { Cue } from '@/lib/health/dailyBrief';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * The daily brief's cues.
 *
 * The dashboard is otherwise entirely passive — it answers questions but never
 * raises one. The brief already decides what is worth saying about yesterday, so
 * this surfaces that rather than inventing a second opinion beside it.
 */

export type BriefData = {
  loaded: boolean;
  cues: Cue[];
  staleNote: string | null;
  ok: boolean;
};

export const EMPTY_BRIEF: BriefData = { loaded: false, cues: [], staleNote: null, ok: false };

export function useBrief(): BriefData {
  const [data, setData] = useState<BriefData>(EMPTY_BRIEF);

  useEffect(() => {
    let cancelled = false;
    const pw = storedOperatorPassword();
    if (!pw) { setData({ ...EMPTY_BRIEF, loaded: true }); return; }

    (async () => {
      try {
        const res = await fetch('/api/operator/brief', {
          headers: { 'x-operator-pw': pw }, cache: 'no-store',
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json() as {
          cues?: Cue[];
          freshness?: { healthy?: boolean; note?: string | null };
        };
        if (cancelled) return;
        setData({
          loaded: true,
          ok: true,
          cues: json.cues ?? [],
          staleNote: json.freshness?.healthy === false ? json.freshness?.note ?? null : null,
        });
      } catch {
        // A brief that cannot be built must not take the dashboard down with it.
        if (!cancelled) setData({ ...EMPTY_BRIEF, loaded: true });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return data;
}
