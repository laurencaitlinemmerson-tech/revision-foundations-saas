'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';

type ClaimResponse =
  | { ok: true; claimedCount?: number; message?: string }
  | { ok: false; error: string };

const NEXT_STEPS: Record<string, { label: string; href: string; desc: string }[]> = {
  bundle: [
    { label: 'Open the OSCE tool →',    href: '/osce',          desc: 'Start with any station — checklists and marking guides included' },
    { label: 'Try the Core Quiz →',     href: '/quiz',          desc: 'Pick a topic and see where your recall is strongest' },
    { label: 'Read a hub guide →',      href: '/hub/childrens', desc: 'Clinical guides written for the way student nurses actually study' },
  ],
  osce: [
    { label: 'Open the OSCE tool →',    href: '/osce',          desc: 'Start with any station and use the marking checklist' },
    { label: 'Set your placement date →',href: '/dashboard',    desc: 'Track countdown and see a suggested revision week' },
    { label: 'Explore hub guides →',    href: '/hub/childrens', desc: 'Free clinical guides to read alongside OSCE practice' },
  ],
  quiz: [
    { label: 'Try the Core Quiz →',     href: '/quiz',          desc: 'Pick any topic — respiratory, cardiac, pharmacology, and more' },
    { label: 'Check your dashboard →',  href: '/dashboard',     desc: 'Your stats update after each session' },
    { label: 'Explore hub guides →',    href: '/hub/childrens', desc: 'Free clinical guides to read before or after quizzing' },
  ],
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = searchParams.get('product') ?? 'bundle';
  const sessionId = searchParams.get('session_id');

  const productName = useMemo(() => {
    if (product === 'osce') return "Children's OSCE Tool";
    if (product === 'quiz') return 'Core Nursing Quiz';
    return "Children's Bundle";
  }, [product]);

  const productLink = useMemo(() => {
    if (product === 'osce') return '/osce';
    if (product === 'quiz') return '/quiz';
    return '/osce';
  }, [product]);

  const nextSteps = NEXT_STEPS[product] ?? NEXT_STEPS.bundle;

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams();
    if (sessionId) params.set('session_id', sessionId);
    if (product) params.set('product', product);
    const qs = params.toString();
    return qs ? `/success?${qs}` : '/success';
  }, [sessionId, product]);

  const onboardingHref = useMemo(() => {
    const params = new URLSearchParams({ entry: 'success' });
    if (product) params.set('product', product);
    return `/onboarding?${params.toString()}`;
  }, [product]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || claimed || claiming) return;
    const controller = new AbortController();
    (async () => {
      setClaiming(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/purchases/claim?session_id=${sessionId || ''}&product=${product || ''}`,
          { method: 'POST', signal: controller.signal },
        );
        const data: ClaimResponse = await res.json();
        if (!res.ok) throw new Error((data as { error: string }).error || 'Failed to claim purchase.');
        setClaimed(true);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Failed to claim your purchase. Please contact support.');
      } finally {
        setClaiming(false);
      }
    })();
    return () => controller.abort();
  }, [isLoaded, isSignedIn, claimed, claiming, sessionId, product]);

  /* ── Signed-out state ─────────────────────────────────────────────────── */
  if (!isLoaded || !isSignedIn) {
    return (
      <div style={page}>
        <div style={card}>
          <p style={kicker}>Purchase complete</p>
          <h1 style={headline}>You&apos;re in.</h1>
          <p style={body}>
            To unlock your access to <strong style={{ fontWeight: 500, color: 'var(--ink-strong)' }}>{productName}</strong>,
            create an account or sign in below. We&apos;ll attach your purchase automatically.
          </p>
          <SignInButton forceRedirectUrl={redirectTo}>
            <button style={primaryBtn}>Create account or sign in →</button>
          </SignInButton>
          <p style={footnote}>Already have an account? Signing in is enough.</p>
        </div>
      </div>
    );
  }

  /* ── Signed-in state ──────────────────────────────────────────────────── */
  return (
    <div style={page}>
      <div style={{ ...card, maxWidth: '560px' }}>
        <p style={kicker}>Purchase complete</p>
        <h1 style={headline}>You&apos;re in.</h1>
        <p style={{ ...body, marginBottom: '6px' }}>
          {claiming
            ? `Unlocking ${productName}…`
            : claimed
            ? `${productName} is now active on your account.`
            : `Setting up ${productName}…`}
        </p>
        {error && <p style={{ fontFamily: inter, fontSize: '13px', color: '#B03030', marginBottom: '12px' }}>{error}</p>}

        {/* Next steps */}
        <div style={{ marginTop: '28px', marginBottom: '28px' }}>
          <p style={{ fontFamily: inter, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '14px' }}>
            Start here
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '0.5px solid var(--hairline-soft)' }}>
            {nextSteps.map((step) => (
              <a key={step.href} href={step.href} style={stepCard}>
                <span style={{ fontFamily: inter, fontSize: '13px', fontWeight: 400, color: 'var(--ink-strong)' }}>{step.label}</span>
                <span style={{ fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'var(--ink-faint)', marginTop: '3px' }}>{step.desc}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href={productLink} style={primaryBtn}>Open {productName} →</a>
          <a href={onboardingHref} style={secondaryBtn}>Start with a quick plan</a>
          <a href="/dashboard" style={tertiaryBtn}>Go to dashboard</a>
        </div>

        {!error && (
          <p style={footnote}>If access doesn&apos;t appear within a minute, refresh this page.</p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: 'var(--surface-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: inter, fontSize: '13px', color: 'var(--ink-faint)' }}>Loading…</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */

const inter = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const playfair = "'Playfair Display', Georgia, serif";

const page: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--surface-page)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
};

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '480px',
  background: 'var(--surface-raised)',
  border: '0.5px solid rgba(26,24,21,0.1)',
  padding: '48px 40px',
};

const kicker: React.CSSProperties = {
  fontFamily: inter,
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
  marginBottom: '12px',
};

const headline: React.CSSProperties = {
  fontFamily: playfair,
  fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
  fontWeight: 400,
  lineHeight: 1.05,
  color: 'var(--ink-strong)',
  marginBottom: '16px',
};

const body: React.CSSProperties = {
  fontFamily: inter,
  fontSize: '14px',
  lineHeight: 1.8,
  fontWeight: 300,
  color: 'var(--ink-soft)',
  marginBottom: '24px',
};

const primaryBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '14px 20px',
  background: '#1A1815',
  color: 'var(--surface-page)',
  fontFamily: inter,
  fontSize: '12px',
  letterSpacing: '0.08em',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '13px 20px',
  background: 'transparent',
  color: 'var(--ink-strong)',
  fontFamily: inter,
  fontSize: '12px',
  letterSpacing: '0.08em',
  textDecoration: 'none',
  border: '0.5px solid rgba(26,24,21,0.12)',
};

const tertiaryBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '12px 20px',
  background: 'transparent',
  color: '#6A6158',
  fontFamily: inter,
  fontSize: '12px',
  textDecoration: 'none',
};

const stepCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '14px 18px',
  textDecoration: 'none',
  background: 'var(--surface-raised)',
  borderBottom: '0.5px solid var(--hairline-soft)',
  transition: 'background 0.12s',
};

const footnote: React.CSSProperties = {
  fontFamily: inter,
  fontSize: '11px',
  fontWeight: 300,
  color: 'var(--border-strong)',
  marginTop: '16px',
  textAlign: 'center',
};
