'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { storedOperatorPassword } from '@/app/(site)/operator/OperatorGate';

/**
 * useState that survives reloads and follows you between devices.
 *
 * It reads localStorage straight away (so the page is instant and works offline),
 * then reconciles with the server copy in /api/operator/state: whichever side was
 * written last wins, and an offline edit is pushed up once the server is
 * reachable. Until supabase-operator-state.sql has been run the status is
 * 'local' and everything still works on this device.
 */

export type SyncStatus = 'loading' | 'synced' | 'saving' | 'local' | 'setup' | 'error';

type Stored<T> = { v: T; t: number };
type ServerMap = Record<string, { value: unknown; updatedAt: string }>;

const LS_PREFIX = 'op-state:';
const SAVE_DELAY = 700;

let serverLoad: Promise<{ state: ServerMap; setup: boolean } | null> | null = null;

function headers(): Record<string, string> | null {
  const pw = storedOperatorPassword();
  return pw ? { 'x-operator-pw': pw, 'Content-Type': 'application/json' } : null;
}

function loadServer() {
  if (!serverLoad) {
    const h = headers();
    serverLoad = h
      ? fetch('/api/operator/state', { headers: h, cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => (j ? { state: (j.state ?? {}) as ServerMap, setup: Boolean(j.setup_required) } : null))
          .catch(() => null)
      : Promise.resolve(null);
  }
  return serverLoad;
}

function readLocal<T>(key: string): Stored<T> | null {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + key);
    return raw ? (JSON.parse(raw) as Stored<T>) : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, s: Stored<T>) {
  try {
    window.localStorage.setItem(LS_PREFIX + key, JSON.stringify(s));
  } catch {
    /* blocked or full: the server copy still holds it */
  }
}

async function push<T>(key: string, value: T): Promise<'ok' | 'setup' | 'error'> {
  const h = headers();
  if (!h) return 'error';
  try {
    const r = await fetch('/api/operator/state', { method: 'PUT', headers: h, body: JSON.stringify({ key, value }) });
    if (r.ok) return 'ok';
    return r.status === 503 ? 'setup' : 'error';
  } catch {
    return 'error';
  }
}

export function useOperatorState<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void, SyncStatus] {
  const [value, setValue] = useState<T>(initial);
  const [status, setStatus] = useState<SyncStatus>('loading');
  const latest = useRef<T>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    const local = readLocal<T>(key);
    if (local) {
      latest.current = local.v;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(local.v);
    }
    loadServer().then((res) => {
      if (!alive) return;
      if (!res) return setStatus('local');
      if (res.setup) return setStatus('setup');
      const remote = res.state[key];
      const remoteT = remote ? Date.parse(remote.updatedAt) : 0;
      if (remote && remoteT > (local?.t ?? 0)) {
        latest.current = remote.value as T;
        setValue(remote.value as T);
        writeLocal(key, { v: remote.value as T, t: remoteT });
        setStatus('synced');
      } else if (local && local.t > remoteT) {
        push(key, local.v).then((r) => alive && setStatus(r === 'ok' ? 'synced' : r === 'setup' ? 'setup' : 'error'));
      } else {
        setStatus('synced');
      }
    });
    return () => {
      alive = false;
    };
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(latest.current) : next;
      latest.current = resolved;
      setValue(resolved);
      writeLocal(key, { v: resolved, t: Date.now() });
      setStatus('saving');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        push(key, latest.current).then((r) => setStatus(r === 'ok' ? 'synced' : r === 'setup' ? 'setup' : 'error'));
      }, SAVE_DELAY);
    },
    [key],
  );

  return [value, set, status];
}
