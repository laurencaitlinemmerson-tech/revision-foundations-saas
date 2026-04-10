'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';

type ClaimResponse =
  | {
      ok: true;
      claimedCount?: number;
      message?: string;
    }
  | {
      ok: false;
      error: string;
    };

function SuccessContent() {
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const product = searchParams.get('product');
  const sessionId = searchParams.get('session_id');

  const productName = useMemo(() => {
    if (product === 'osce') return "Children's OSCE Tool";
    if (product === 'quiz') return 'Core Nursing Quiz';
    if (product === 'bundle') return 'Complete Nursing Bundle';
    return 'your product';
  }, [product]);

  const productLink = useMemo(() => {
    if (product === 'osce') return '/osce';
    if (product === 'quiz') return '/quiz';
    return '/dashboard';
  }, [product]);

  // IMPORTANT: preserve query params so the success page can claim after sign-in
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams();
    if (sessionId) params.set('session_id', sessionId);
    if (product) params.set('product', product);
    const qs = params.toString();
    return qs ? `/success?${qs}` : '/success';
  }, [sessionId, product]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (claimed || claiming) return;

    const controller = new AbortController();

    (async () => {
      setClaiming(true);
      setError(null);
      setMessage(null);
      try {
        const res = await fetch(`/api/purchases/claim?session_id=${sessionId || ''}&product=${product || ''}`, {
          method: 'POST',
          signal: controller.signal,
        });
        const data: ClaimResponse = await res.json();
        if (!res.ok) {
          const errMsg =
            (data && 'error' in data && data.error) ||
            'Failed to claim your purchase. Please contact support.';
          throw new Error(errMsg);
        }
        setClaimed(true);
        const friendly =
          (data && 'ok' in data && data.ok && (data.message || null)) ||
          'Your access has been unlocked!';
        setMessage(friendly);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Failed to claim your purchase. Please contact support.');
      } finally {
        setClaiming(false);
      }
    })();

    return () => controller.abort();
  }, [isLoaded, isSignedIn, claimed, claiming, sessionId, product]);

  // If signed out: show sign-in CTA (with redirect that preserves params)
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-[rgba(26,24,21,0.08)] bg-white px-8 py-10 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/55 mb-4">Purchase complete</p>
          <h1 className="font-display text-[clamp(2rem,5vw,2.8rem)] leading-[0.97] tracking-[-0.03em] text-[var(--espresso)] mb-4">
            Payment successful.
          </h1>
          <p className="text-sm font-light leading-7 text-[var(--charcoal)] mb-6">
            To unlock access to <span className="font-medium text-[var(--espresso)]">{productName}</span>, please create an account or sign in.
          </p>

          <SignInButton forceRedirectUrl={redirectTo}>
            <button className="inline-flex items-center justify-center w-full bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]">
              Open account page to unlock access
            </button>
          </SignInButton>

          <p className="mt-4 text-sm font-light text-[var(--charcoal)]/60">
            After you sign in or create your account, we&apos;ll automatically attach your purchase there.
          </p>
        </div>
      </div>
    );
  }

  // Signed in: auto-claim runs
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-[rgba(26,24,21,0.08)] bg-white px-8 py-10 text-center">
        <div className="text-5xl mb-6">🎉</div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/55 mb-4">Purchase complete</p>
        <h1 className="font-display text-[clamp(2rem,5vw,2.8rem)] leading-[0.97] tracking-[-0.03em] text-[var(--espresso)] mb-4">
          Payment successful.
        </h1>

        <p className="text-sm font-light leading-7 text-[var(--charcoal)] mb-4">
          Unlocking access to <span className="font-medium text-[var(--espresso)]">{productName}</span>
          {sessionId ? '' : ' (no session ID found \u2014 matching by email)'}&hellip;
        </p>

        {claiming && (
          <p className="text-sm font-light text-[var(--charcoal)]/70">Claiming your purchase…</p>
        )}

        {message && !error && (
          <p className="text-sm font-light text-[var(--charcoal)]">{message}</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <a href={productLink} className="inline-flex items-center justify-center bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]">
            Continue
          </a>
          <a href="/dashboard" className="inline-flex items-center justify-center border border-[rgba(26,24,21,0.12)] bg-white px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.2)]">
            Go to dashboard
          </a>
        </div>

        <p className="mt-4 text-xs font-light text-[var(--charcoal)]/55">
          If access doesn&apos;t appear within a minute, refresh this page.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
          <div className="text-sm text-[var(--charcoal)]/60">Loading…</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
