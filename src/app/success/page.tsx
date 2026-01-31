"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowRight, Mail, UserPlus } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = searchParams.get("product");
  const sessionId = searchParams.get("session_id");

  const productName =
    product === "osce"
      ? "Children's OSCE Tool"
      : product === "quiz"
      ? "Core Nursing Quiz"
      : product === "bundle"
      ? "Complete Nursing Bundle"
      : "your product";

  const productLink =
    product === "osce" ? "/osce" : product === "quiz" ? "/quiz" : "/dashboard";

  useEffect(() => {
    if (isSignedIn) {
      setClaiming(true);
      fetch("/api/purchases/claim", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setClaimed(true);
          setClaiming(false);
        })
        .catch((err) => {
          setError("Failed to claim your purchase. Please contact support.");
          setClaiming(false);
        });
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-6 float">🎉</div>
          <h1 className="text-2xl mb-3">Payment Successful!</h1>
          <p className="text-[var(--plum-dark)]/70 mb-6">
            Create an account or sign in to unlock your access.
          </p>
          <SignInButton afterSignInUrl="/success">
            <button className="btn-primary w-full">Sign in to unlock access</button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6 float">🎉</div>
        <h1 className="text-2xl mb-3">Payment Successful!</h1>
        {claiming && <p>Claiming your purchase...</p>}
        {claimed && (
          <p>
            Your access has been unlocked!{' '}
            <a href="/dashboard" className="underline">
              Go to dashboard
            </a>
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-hero flex items-center justify-center">
          <div className="text-[var(--plum)]">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowRight, Mail, UserPlus } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = searchParams.get("product");
  const sessionId = searchParams.get("session_id");

  const productName =
    product === "osce"
      ? "Children's OSCE Tool"
      : product === "quiz"
      ? "Core Nursing Quiz"
      : product === "bundle"
      ? "Complete Nursing Bundle"
      : "your product";

  const productLink =
    product === "osce" ? "/osce" : product === "quiz" ? "/quiz" : "/dashboard";

  useEffect(() => {
    if (isSignedIn) {
      setClaiming(true);
      fetch("/api/purchases/claim", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setClaimed(true);
          setClaiming(false);
        })
        .catch((err) => {
          setError("Failed to claim your purchase. Please contact support.");
          setClaiming(false);
        });
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-6 float">🎉</div>
          <h1 className="text-2xl mb-3">Payment Successful!</h1>
          <p className="text-[var(--plum-dark)]/70 mb-6">
            Create an account or sign in to unlock your access.
          </p>
          <SignInButton afterSignInUrl="/success">
            <button className="btn-primary w-full">Sign in to unlock access</button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6 float">🎉</div>
        <h1 className="text-2xl mb-3">Payment Successful!</h1>
        {claiming && <p>Claiming your purchase...</p>}
        {claimed && (
          <p>
            Your access has been unlocked!{' '}
            <a href="/dashboard" className="underline">
              Go to dashboard
            </a>
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-hero flex items-center justify-center">
          <div className="text-[var(--plum)]">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
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
      try {
        setError(null);
        setMessage(null);
        setClaiming(true);

        const res = await fetch('/api/purchases/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Send session_id if you have it (API can still fall back to email matching)
          body: JSON.stringify({ sessionId, product }),
          signal: controller.signal,
        });

        const data = (await res.json().catch(() => null)) as ClaimResponse | null;

        if (!res.ok) {
          const errMsg =
            (data && 'error' in data && data.error) ||
            'Failed to claim your purchase. Please contact support.';
          throw new Error(errMsg);
        }

        // Mark claimed even if API says "nothing to claim" — avoids infinite retries
        setClaimed(true);

        const friendly =
          (data && 'ok' in data && data.ok && (data.message || null)) ||
          'Your access has been unlocked!';
        setMessage(friendly);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Failed to claim your purchase. Please contact support.');
      } finally {
        setClaiming(false);
      }
    })();

    return () => controller.abort();
  }, [isLoaded, isSignedIn, claimed, claiming, sessionId, product]);

  // If signed out: show sign-in CTA (with redirect that preserves params)
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-6 float">🎉</div>
          <h1 className="text-2xl mb-2">Payment Successful!</h1>
          <p className="text-[var(--plum-dark)]/70 mb-6">
            To unlock access to <span className="font-semibold">{productName}</span>, please create an account or sign in.
          </p>

          <SignInButton redirectUrl={redirectTo}>
            <button className="btn-primary w-full">Sign in to unlock access</button>
          </SignInButton>

          <p className="mt-4 text-sm text-[var(--plum-dark)]/60">
            After signing in, we’ll automatically attach your purchase to your account.
          </p>
        </div>
      </div>
    );
  }

  // Signed in: auto-claim runs
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6 float">🎉</div>
        <h1 className="text-2xl mb-2">Payment Successful!</h1>

        <p className="text-[var(--plum-dark)]/70 mb-4">
          Unlocking access to <span className="font-semibold">{productName}</span>
          {sessionId ? '' : ' (no session ID found — matching by email)'}…
        </p>

        {claiming && (
          <p className="text-[var(--plum-dark)]/70">Claiming your purchase…</p>
        )}

        {message && !error && (
          <p className="text-[var(--plum-dark)]/80">{message}</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <a href={productLink} className="btn-primary w-full">
            Continue
          </a>
          <a href="/dashboard" className="btn-secondary w-full">
            Go to dashboard
          </a>
        </div>

        <p className="mt-4 text-xs text-[var(--plum-dark)]/55">
          If access doesn’t appear within a minute, refresh this page.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-hero flex items-center justify-center">
          <div className="text-[var(--plum)]">Loading…</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

