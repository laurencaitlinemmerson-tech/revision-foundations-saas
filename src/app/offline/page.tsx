'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="border border-[rgba(26,24,21,0.08)] bg-white px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[rgba(245,243,240,0.9)] border border-[rgba(26,24,21,0.08)] mb-6">
            <WifiOff className="w-5 h-5 text-[var(--charcoal)]" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/55 mb-4">
            Connection
          </p>

          <h1 className="font-display text-[clamp(2rem,5vw,2.8rem)] leading-[0.97] tracking-[-0.03em] text-[var(--espresso)] mb-4">
            You&apos;re offline.
          </h1>

          <p className="text-sm font-light leading-7 text-[var(--charcoal)] mb-2">
            Pages you&apos;ve visited before may still be available.
          </p>
          <p className="text-sm font-light leading-7 text-[var(--charcoal)]/60 mb-8">
            Your study progress is saved locally and will sync when you&apos;re back online.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-[rgba(26,24,21,0.12)] bg-white px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.2)]"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
