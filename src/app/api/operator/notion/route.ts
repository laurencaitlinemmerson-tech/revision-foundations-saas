import { NextRequest, NextResponse } from 'next/server';

/**
 * Live nursing data from Notion, so the Nursing and Study pages stop depending on
 * a hand-refreshed snapshot.
 *
 * Needs NOTION_TOKEN: an internal integration secret from
 * notion.so/profile/integrations. The integration must be shared (Connections
 * menu) with the three databases read here:
 *
 *   Master Assignment / Exam Planner   deadlines
 *   Placement Hours Tracker            shifts and NMC hours
 *   Nursing Lecture Notes              lecture progress per module
 *
 * Without the token the response is `{ configured: false }` and the pages keep
 * showing the snapshot in nursingData.ts. Each dataset fails on its own, so one
 * unshared database does not blank the others.
 *
 * Results are cached for five minutes; `?refresh=1` skips the cache.
 */

export const dynamic = 'force-dynamic';

const NOTION_VERSION = '2025-09-03';
const PLANNER = '26a306da-d855-811e-8235-000b9d30447d';
const HOURS = 'db153c02-aea8-4614-895f-57894a5c8799';
const LECTURES = '28b306da-d855-80eb-8f21-000ba0234513';
const CACHE_MS = 5 * 60 * 1000;

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

type Props = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

async function queryAll(token: string, id: string): Promise<Props[]> {
  const rows: Props[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const res = await fetch(`https://api.notion.com/v1/data_sources/${id}/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Notion ${res.status}`);
    const json = await res.json();
    rows.push(...(json.results ?? []).map((r: { properties: Props }) => r.properties));
    if (!json.has_more) break;
    cursor = json.next_cursor;
  }
  return rows;
}

const title = (p?: Props) => (p?.title ?? []).map((t: { plain_text: string }) => t.plain_text).join('').trim();
const sel = (p?: Props): string => p?.select?.name ?? p?.status?.name ?? '';
const num = (p?: Props): number | null => (typeof p?.number === 'number' ? p.number : null);
const date = (p?: Props): { start: string; end: string | null } | null => (p?.date?.start ? { start: p.date.start, end: p.date.end ?? null } : null);
const clean = (s: string) => s.replace(/[^\p{L}\p{N}\s/&%.-]/gu, '').trim();

/** Wall-clock HH:MM from a Notion datetime. Notion sends the rota with a Z suffix but the times are local. */
const clock = (s: string | null) => (s && s.includes('T') ? s.slice(11, 16) : null);

async function deadlines(token: string) {
  const rows = await queryAll(token, PLANNER);
  return rows
    .map((p) => {
      const d = date(p['Due Date']);
      const weight = p['Weighting']?.rollup?.number ?? p['Weighting']?.rollup?.array?.[0]?.number ?? null;
      return {
        title: title(p['Assignment Name']),
        date: d?.start.slice(0, 10) ?? '',
        time: clock(d?.start ?? null),
        status: clean(sel(p['Status']).replace(/💗/g, '')),
        priority: clean(sel(p['Priority'])),
        year: sel(p['Year']),
        weight: typeof weight === 'number' ? weight : null,
      };
    })
    .filter((d) => d.title && d.date);
}

async function hours(token: string) {
  const rows = await queryAll(token, HOURS);
  const clinical = new Set(['Long day', 'Early', 'Late', 'Night', 'Spoke day']);
  const acc = { clinical: 0, simulated: 0, rpl: 0, y2Placements: 0, y2Simulated: 0, longDays: 0, nights: 0 };
  const rota: { date: string; start: string; end: string; ward: string; missingHours: boolean }[] = [];
  for (const p of rows) {
    const type = sel(p['Shift Type']);
    const h = num(p['Hours']) ?? 0;
    const signed = sel(p['Signed off']) === 'Done';
    const year = sel(p['Year']);
    const d = date(p['Date']);
    if (signed) {
      if (clinical.has(type)) acc.clinical += h;
      else if (type === 'Simulated') acc.simulated += h;
      else if (type === 'RPL') acc.rpl += h;
      if (year === 'Year 1' && type === 'Long day') acc.longDays++;
      if (year === 'Year 1' && type === 'Night') acc.nights++;
    } else if (year === 'Year 2') {
      if (type === 'Simulated') acc.y2Simulated += h;
      else if (clinical.has(type) || type === 'Placeholder') acc.y2Placements += h;
    }
    if (year === 'Year 2' && d && clinical.has(type)) {
      rota.push({
        date: d.start.slice(0, 10),
        start: clock(d.start) ?? '',
        end: clock(d.end) ?? '',
        ward: title(p['Shift']) || 'Placement',
        missingHours: !h,
      });
    }
  }
  rota.sort((a, b) => a.date.localeCompare(b.date));
  return { ...acc, rota };
}

async function sessions(token: string) {
  const rows = await queryAll(token, LECTURES);
  const by = new Map<string, { done: number; inProgress: number; todo: number }>();
  for (const p of rows) {
    if (sel(p['Year']) !== 'Year 2') continue;
    const module = sel(p['Module']) || (p['Module']?.rich_text ?? []).map((t: { plain_text: string }) => t.plain_text).join('');
    const code = /\(([A-Z0-9]{6,9})\)/.exec(module)?.[1] ?? module;
    if (!code) continue;
    const status = sel(p['Status']).toLowerCase();
    const cur = by.get(code) ?? { done: 0, inProgress: 0, todo: 0 };
    if (status.includes('complete') || status === 'done') cur.done++;
    else if (status.includes('progress')) cur.inProgress++;
    else cur.todo++;
    by.set(code, cur);
  }
  return [...by.entries()].map(([code, v]) => ({ code, ...v }));
}

let cache: { at: number; body: unknown } | null = null;

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = process.env.NOTION_TOKEN;
  if (!token) return NextResponse.json({ configured: false });

  const refresh = req.nextUrl.searchParams.get('refresh') === '1';
  if (!refresh && cache && Date.now() - cache.at < CACHE_MS) return NextResponse.json(cache.body);

  const errors: Record<string, string> = {};
  const attempt = async <T,>(name: string, fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (e) {
      errors[name] = e instanceof Error ? e.message : 'failed';
      return null;
    }
  };

  const [dl, hr, ss] = await Promise.all([
    attempt('deadlines', () => deadlines(token)),
    attempt('hours', () => hours(token)),
    attempt('sessions', () => sessions(token)),
  ]);

  const body = { configured: true, fetchedAt: new Date().toISOString(), deadlines: dl, hours: hr, sessions: ss, errors };
  cache = { at: Date.now(), body };
  return NextResponse.json(body);
}
