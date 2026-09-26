'use client';

import { useEffect, useMemo, useState } from 'react';
import { useOperatorState } from '@/lib/useOperatorState';
import type { Shift } from './nursingData';

/**
 * A few lines per shift, written while it is fresh, saved across devices.
 * The fields mirror the shift log in the Notion placement pages, so what is
 * written here can be copied straight into a PAD entry or a reflection.
 */

type Entry = { did: string; learnt: string; well: string; follow: string; pad: string };
type Log = Record<string, Entry>;

const EMPTY: Entry = { did: '', learnt: '', well: '', follow: '', pad: '' };
const FIELDS: { key: keyof Entry; label: string; hint: string }[] = [
  { key: 'did', label: 'What I did and saw', hint: 'Patients, procedures, who you worked with' },
  { key: 'learnt', label: 'New skill or knowledge', hint: 'One thing you could not have told me yesterday' },
  { key: 'well', label: 'What went well', hint: 'Evidence for your PAD' },
  { key: 'follow', label: 'To look up or do differently', hint: 'Becomes your look-up list below' },
  { key: 'pad', label: 'For my PAD or supervisor', hint: 'Proficiency to get signed off, a question to ask' },
];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const label = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};
const filled = (e?: Entry) => Boolean(e && Object.values(e).some((v) => v.trim()));

export default function ShiftLog({ rota }: { rota: Shift[] }) {
  const [log, setLog, status] = useOperatorState<Log>('nursing.shiftlog', {});
  const [today, setToday] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setToday(iso(new Date()));
  }, []);

  const shifts = useMemo(() => {
    if (!today) return [];
    const past = rota.filter((s) => s.date <= today).reverse();
    const next = rota.find((s) => s.date > today);
    return next ? [next, ...past] : past;
  }, [today, rota]);

  useEffect(() => {
    if (open === null && shifts.length && today) {
      const first = shifts.find((s) => s.date <= today && !filled(log[s.date])) ?? shifts[0];
      setOpen(first.date);
    }
  }, [shifts, today, log, open]);

  const set = (date: string, key: keyof Entry, value: string) =>
    setLog((prev) => ({ ...prev, [date]: { ...EMPTY, ...prev[date], [key]: value } }));

  const lookups = useMemo(
    () =>
      Object.entries(log)
        .filter(([, e]) => e.follow.trim())
        .sort(([a], [b]) => b.localeCompare(a))
        .flatMap(([date, e]) => e.follow.split('\n').map((t) => t.trim()).filter(Boolean).map((t) => ({ date, t }))),
    [log],
  );

  if (!today) return null;

  return (
    <div className="sl">
      <p className="ns-byline sl-status">
        {status === 'synced' ? 'Synced across your devices' : status === 'saving' ? 'Saving…' : status === 'loading' ? '' : 'Saved on this device'}
      </p>

      {lookups.length > 0 && (
        <div className="sl-look">
          <p className="ns-eyebrow">To look up</p>
          <ul>
            {lookups.map((l, i) => (
              <li key={i}><span>{label(l.date)}</span>{l.t}</li>
            ))}
          </ul>
        </div>
      )}

      {shifts.length === 0 && <p className="st-empty">No shifts on the rota yet.</p>}
      <ul className="sl-list">
        {shifts.map((s) => {
          const future = s.date > today;
          const isOpen = open === s.date;
          const e = log[s.date] ?? EMPTY;
          return (
            <li key={s.date} className={`sl-item${isOpen ? ' is-open' : ''}`}>
              <button type="button" className="sl-head" onClick={() => setOpen(isOpen ? '' : s.date)} aria-expanded={isOpen}>
                <span className="sl-date">{label(s.date)}</span>
                <span className="sl-meta">{s.ward} &middot; {s.start}&ndash;{s.end}</span>
                <span className={`sl-tag${filled(log[s.date]) ? ' is-logged' : ''}`}>
                  {future ? 'Next shift' : filled(log[s.date]) ? 'Logged' : 'Not logged'}
                </span>
              </button>
              {isOpen && (
                <div className="sl-body">
                  {FIELDS.map((f) => (
                    <label key={f.key} className="sl-field">
                      <span>{f.label}<em>{f.hint}</em></span>
                      <textarea value={e[f.key]} rows={f.key === 'did' ? 3 : 2} onChange={(ev) => set(s.date, f.key, ev.target.value)} />
                    </label>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
