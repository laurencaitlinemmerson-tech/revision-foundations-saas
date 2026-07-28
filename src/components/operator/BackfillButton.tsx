'use client';

import { useState } from 'react';

const serif = "var(--font-body)";

type Result = {
  ok: boolean;
  entitlements?: number;
  purchases?: number;
  skipped?: number;
  errors?: number;
  error?: string;
};

export default function BackfillButton() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setState('running');
    setResult(null);
    try {
      const res  = await fetch('/api/admin/backfill', { method: 'POST' });
      const data = await res.json() as Result;
      setResult(data);
      setState(data.ok ? 'done' : 'error');
    } catch {
      setState('error');
      setResult({ ok: false, error: 'Request failed' });
    }
  }

  const label =
    state === 'running' ? 'Replaying Stripe sessions…' :
    state === 'done'    ? 'Done' :
    state === 'error'   ? 'Failed — try again' :
    'Backfill past purchases';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
      <button
        onClick={run}
        disabled={state === 'running'}
        style={{
          padding: '10px 20px',
          fontFamily: serif,
          fontSize: '12px',
          background: state === 'done' ? '#8BBCAA' : state === 'error' ? '#C89BB0' : '#1A1815',
          color: '#fff',
          border: 'none',
          cursor: state === 'running' ? 'default' : 'pointer',
          opacity: state === 'running' ? 0.6 : 1,
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        {label}
      </button>

      {result && (
        <p style={{ fontFamily: serif, fontSize: '11px', color: '#9A8E84', fontWeight: 300, lineHeight: 1.7, margin: 0, paddingTop: '11px' }}>
          {result.ok
            ? `${result.entitlements} entitlements created · ${result.purchases} guest purchases queued · ${result.skipped} skipped · ${result.errors} errors`
            : result.error ?? 'Something went wrong'}
        </p>
      )}
    </div>
  );
}
