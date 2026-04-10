'use client';

import { Lock, Check } from 'lucide-react';
import Link from 'next/link';

interface LockedContentProps {
  productName?: string;
  productSlug?: 'osce' | 'quiz' | 'bundle';
  title?: string;
  description?: string;
  features?: string[];
}

export default function LockedContent({ 
  productName, 
  productSlug,
  title,
  description,
  features 
}: LockedContentProps) {
  // If using the new flexible props
  if (title || description || features) {
    return (
      <div className="card border border-black/8 bg-white text-center py-12 px-8">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal-light)] mb-4">Locked</p>
        <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">
          {title || 'Premium Content'}
        </h3>
        <p className="text-[var(--plum-dark)]/70 mb-6 max-w-md mx-auto">
          {description || 'Upgrade to unlock this content.'}
        </p>
        
        {features && features.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8 text-left">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-[var(--plum-dark)]">{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        <Link
          href="/pricing"
          className="btn-primary inline-flex"
        >
          Unlock Full Access
        </Link>
        <p className="text-sm text-[var(--plum-dark)]/65 mt-4">
          Already bought access or saved pages?{' '}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in or create your account here
          </Link>
          .
        </p>
        <p className="text-xs text-[var(--plum-dark)]/50 mt-4">
          One-time payment • Lifetime access
        </p>
      </div>
    );
  }

  // Original locked overlay style
  return (
    <div className="locked-overlay">
      <div className="text-center text-white p-8">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
        <p className="text-white/80 mb-6 max-w-xs mx-auto">
          Unlock full access to {productName} for just £4.99
        </p>
        <Link
          href={`/pricing?product=${productSlug}`}
          className="btn-gradient inline-flex"
        >
          Unlock Now
        </Link>
        <p className="mt-4 text-sm text-white/80">
          Already bought this?{' '}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in or create your account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
