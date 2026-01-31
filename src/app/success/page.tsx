'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Sparkles, ArrowRight, Mail, UserPlus } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = searchParams.get('product');
  const sessionId = searchParams.get('session_id');

  const productName =
    product === 'osce'
      ? "Children's OSCE Tool"
      : product === 'quiz'
      ? 'Core Nursing Quiz'
      : product === 'bundle'
      ? 'Complete Nursing Bundle'
      : 'your product';

  const productLink = product === 'osce' ? '/osce' : product === 'quiz' ? '/quiz' : '/dashboard';

  useEffect(() => {
    if (isSignedIn) {
      setClaiming(true);
      fetch('/api/purchases/claim', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setClaimed(true);
          setClaiming(false);
        })
        .catch(err => {
          setError('Failed to claim your purchase. Please contact support.');
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
          <SignInButton redirectUrl="/success">
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
        {claimed && <p>Your access has been unlocked! <a href="/dashboard" className="underline">Go to dashboard</a></p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-[var(--plum)]">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
