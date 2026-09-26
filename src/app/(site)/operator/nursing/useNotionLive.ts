'use client';

import { useEffect, useMemo, useState } from 'react';
import { storedOperatorPassword } from '../OperatorGate';
import { DEADLINES, HOURS, ROTA, Y2_SESSIONS, type Deadline, type Shift } from './nursingData';

/**
 * The snapshot in nursingData.ts, overlaid with live Notion data when the
 * /api/operator/notion route is configured. Anything Notion did not return
 * (a database not shared with the integration, no token yet) simply keeps its
 * snapshot value, so the pages never show less than they used to.
 */

type LiveDeadline = { title: string; date: string; time: string | null; status: string; priority: string; year: string; weight: number | null };
type LiveHours = {
  clinical: number; simulated: number; rpl: number; y2Placements: number; y2Simulated: number; longDays: number; nights: number;
  rota: (Shift & { missingHours: boolean })[];
};
type LiveSession = { code: string; done: number; inProgress: number; todo: number };
type LiveBody = {
  configured: boolean; fetchedAt?: string;
  deadlines: LiveDeadline[] | null; hours: LiveHours | null; sessions: LiveSession[] | null;
  errors?: Record<string, string>;
};

export type LiveState = 'off' | 'loading' | 'live' | 'partial' | 'error';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const PRIORITY = (p: string): Deadline['priority'] => (/urgent/i.test(p) ? 'Urgent' : /high/i.test(p) ? 'High' : /medium/i.test(p) ? 'Medium' : undefined);

function mergeDeadlines(live: LiveDeadline[]): Deadline[] {
  const today = new Date().toISOString().slice(0, 10);
  const used = new Set<string>();
  const merged = DEADLINES.map((snap) => {
    const hit = live.find((l) => !used.has(l.title) && (norm(l.title).includes(norm(snap.title)) || norm(snap.title).includes(norm(l.title))));
    if (!hit) return snap;
    used.add(hit.title);
    return {
      ...snap,
      date: hit.date,
      time: hit.time ? (snap.time ?? hit.time) : snap.time,
      status: hit.status || snap.status,
      priority: PRIORITY(hit.priority) ?? snap.priority,
      weight: hit.weight ?? snap.weight,
    };
  });
  const extra: Deadline[] = live
    .filter((l) => !used.has(l.title) && l.date >= today && l.year !== 'Year 1')
    .map((l) => ({
      id: `live-${norm(l.title).replace(/ /g, '-')}`,
      title: l.title,
      module: '',
      date: l.date,
      time: l.time ?? undefined,
      kind: 'Assessment',
      weight: l.weight ?? undefined,
      priority: PRIORITY(l.priority),
      status: l.status || 'Not started',
      detail: 'Added in Notion.',
    }));
  return [...merged, ...extra].sort((a, b) => a.date.localeCompare(b.date));
}

export function useNotionLive() {
  const [body, setBody] = useState<LiveBody | null>(null);
  const [state, setState] = useState<LiveState>('loading');

  useEffect(() => {
    const pw = storedOperatorPassword();
    if (!pw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState('off');
      return;
    }
    let alive = true;
    fetch('/api/operator/notion', { headers: { 'x-operator-pw': pw }, cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<LiveBody>) : Promise.reject()))
      .then((j) => {
        if (!alive) return;
        setBody(j);
        if (!j.configured) return setState('off');
        setState(Object.keys(j.errors ?? {}).length ? 'partial' : 'live');
      })
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, []);

  const data = useMemo(() => {
    const live = state === 'live' || state === 'partial' ? body : null;
    const lh = live?.hours;
    return {
      deadlines: live?.deadlines?.length ? mergeDeadlines(live.deadlines) : DEADLINES,
      rota: lh?.rota?.length ? (lh.rota as Shift[]) : ROTA,
      hours: lh
        ? {
            ...HOURS,
            signedOff: { clinical: lh.clinical, simulated: lh.simulated, rpl: lh.rpl },
            y2Planned: { placements: lh.y2Placements, simulated: lh.y2Simulated },
            y1Shifts: { longDays: lh.longDays || HOURS.y1Shifts.longDays, nights: lh.nights || HOURS.y1Shifts.nights },
          }
        : HOURS,
      sessions: live?.sessions?.length
        ? Y2_SESSIONS.map((m) => {
            const l = live.sessions!.find((x) => x.code === m.code);
            return l ? { ...m, done: l.done, inProgress: l.inProgress, todo: l.todo } : m;
          })
        : Y2_SESSIONS,
    };
  }, [body, state]);

  return { state, fetchedAt: body?.fetchedAt ?? null, errors: body?.errors ?? {}, ...data };
}
