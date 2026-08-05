'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

/**
 * Password gate for the operator area.
 *
 * Extracted from OperatorDashboardClient so more than one operator surface can
 * sit behind the same lock. It reuses that component's storage key and TTL, so
 * an existing unlock carries straight over and unlocking here unlocks there.
 */

const AUTH_KEY = 'operator-log-auth-v3';
const AUTH_TTL = 30 * 24 * 60 * 60 * 1000;

/** The password the operator APIs expect, if a caller needs to pass it on. */
export function storedOperatorPassword(): string | null {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const { ts, pw } = JSON.parse(raw) as { ts: number; pw: string };
    if (Date.now() - ts >= AUTH_TTL) {
      window.localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return pw;
  } catch {
    return null;
  }
}

export default function OperatorGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(storedOperatorPassword() !== null);
    setChecked(true);
  }, []);

  // Render nothing until the stored unlock has been read, so the lock screen
  // never flashes for an already-unlocked operator.
  if (!checked) return null;
  if (!authed) return <Lock onUnlock={() => setAuthed(true)} />;
  return <>{children}</>;
}

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/operator/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now(), pw }));
        onUnlock();
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 1400);
      }
    } catch {
      setErr(true);
      setTimeout(() => setErr(false), 1400);
    } finally {
      setLoading(false);
    }
  };

  const sans = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  const display = "'Playfair Display', Georgia, serif";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8', padding: 24 }}>
      <form
        onSubmit={submit}
        style={{ width: '100%', maxWidth: 400, textAlign: 'left', padding: '30px 30px 32px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, background: '#FBF8F3' }}
      >
        <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9A948C', marginBottom: 10 }}>
          Operator · Restricted
        </div>
        <h1 style={{ fontFamily: display, fontWeight: 500, fontSize: 30, lineHeight: 1.1, color: '#1A1815', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          The Operator <em style={{ fontStyle: 'italic', color: '#8B72C4' }}>Log</em>
        </h1>
        <p style={{ fontFamily: sans, fontSize: 13, color: '#9A948C', margin: '0 0 24px', lineHeight: 1.55 }}>
          A private fitness &amp; nursing log. Enter your password to continue.
        </p>
        <label
          htmlFor="op-pw"
          style={{ display: 'block', fontFamily: sans, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9A948C', marginBottom: 6 }}
        >
          Password
        </label>
        <input
          id="op-pw"
          ref={ref}
          type="password"
          placeholder="enter password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{
            width: '100%', background: '#FAFAF8', outline: 'none',
            border: `1px solid ${err ? '#B4577B' : 'rgba(0,0,0,0.08)'}`, borderRadius: 6,
            fontFamily: sans, fontSize: 14, color: '#1A1815',
            padding: '10px 12px', marginBottom: err ? 8 : 20, transition: 'border-color 0.2s',
          }}
        />
        {err && <p style={{ fontFamily: sans, fontSize: 11, color: '#B4577B', margin: '0 0 16px' }}>Incorrect password. Try again.</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: '#1A1815', color: '#FAFAF8', border: 0, borderRadius: 6, cursor: 'pointer',
            padding: '12px 20px', fontFamily: sans, fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase', opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Verifying…' : 'Enter →'}
        </button>
      </form>
    </div>
  );
}
