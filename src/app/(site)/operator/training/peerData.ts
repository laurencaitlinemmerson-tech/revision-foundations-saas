'use client';

import { useEffect, useState } from 'react';
import type { PeerPayload } from '@/lib/peer/contract';
import { storedOperatorPassword } from '../OperatorGate';

/**
 * Both sides of the head-to-head, read from the server.
 *
 * The peer's key never reaches the browser — the route assembles both documents
 * and returns them already parsed, so this only has to deal with the result.
 */

export type PeerData = {
  loaded: boolean;
  you: PeerPayload | null;
  them: PeerPayload | null;
  peerError: string | null;
  configured: boolean;
};

export const EMPTY_PEER: PeerData = {
  loaded: false, you: null, them: null, peerError: null, configured: false,
};

/** How often to re-read while the tab is open. */
const REFRESH_MS = 5 * 60 * 1000;

export function usePeerData(): PeerData {
  const [data, setData] = useState<PeerData>(EMPTY_PEER);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setTick((n) => n + 1);
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pw = storedOperatorPassword();
    if (!pw) { setData({ ...EMPTY_PEER, loaded: true }); return; }

    (async () => {
      try {
        const res = await fetch('/api/operator/headtohead', {
          headers: { 'x-operator-pw': pw }, cache: 'no-store',
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json() as Omit<PeerData, 'loaded'>;
        if (!cancelled) setData({ ...json, loaded: true });
      } catch {
        if (!cancelled) {
          setData({ ...EMPTY_PEER, loaded: true, peerError: 'unreachable' });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [tick]);

  return data;
}
