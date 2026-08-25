'use client';

import { useEffect, useState } from 'react';
import type { PartnerDay } from '@/lib/operatorPartnerStorage';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * The partner's daily summaries.
 *
 * Kept separate from `useOperatorData` because it is the one source that
 * describes somebody else, and because it is allowed to be absent: the table may
 * not exist yet, and the head-to-head screen has an honest empty state for that.
 */

export type PartnerData = {
  loaded: boolean;
  days: PartnerDay[] | null;
  /** The name to show, taken from the rows themselves. */
  name: string;
  /** The table is not set up yet, so there is nothing to read rather than nothing logged. */
  setupRequired: boolean;
};

export const EMPTY_PARTNER: PartnerData = {
  loaded: false,
  days: null,
  name: 'Partner',
  setupRequired: false,
};

const titleCase = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

export function usePartnerData(tick = 0): PartnerData {
  const [data, setData] = useState<PartnerData>(EMPTY_PARTNER);

  useEffect(() => {
    let cancelled = false;
    const pw = storedOperatorPassword();
    if (!pw) {
      setData({ ...EMPTY_PARTNER, loaded: true });
      return;
    }

    const from = new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10);
    (async () => {
      try {
        const res = await fetch(`/api/operator/partner?from=${from}`, {
          headers: { 'x-operator-pw': pw },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { days?: PartnerDay[]; setup_required?: boolean };
        if (cancelled) return;

        const days = json.days ?? [];
        setData({
          loaded: true,
          days: days.length ? days : null,
          name: days.length ? titleCase(days[days.length - 1].person) : 'Partner',
          setupRequired: Boolean(json.setup_required),
        });
      } catch {
        if (!cancelled) setData({ ...EMPTY_PARTNER, loaded: true, setupRequired: true });
      }
    })();

    return () => { cancelled = true; };
  }, [tick]);

  return data;
}
