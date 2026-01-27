'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Sparkles, ArrowRight, Mail, UserPlus } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();
  const product = searchParams.get('product');

  const productName =
    product === 'osce'
      ? "Children's OSCE Tool"
      : product === 'quiz'
      ? 'Nursing Theory Quiz'
      : product === 'bundle'
      ? 'Complete Nursing Bundle'
      : 'your product';

  const productLink = product === 'osce' ? '/osce' : product === 'quiz' ? '/quiz' : '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6 sparkle-float">🎉</div>
        <h1 className="text-2xl mb-3 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
          Payment Successful!
        </h1>
        <p className="text-[var(--text-medium)] mb-6">
          Thank you! You now have full access to {productName}.
        </p>

        {isSignedIn ? (
          // Signed-in user flow
          <div className="space-y-3">
            <Link href={productLink} className="btn-primary w-full">
              <Sparkles className="w-5 h-5" />
              Start Using {product === 'bundle' ? 'Your Tools' : productName}
            </Link>
            <Link href="/dashboard" className="btn-secondary w-full">
              <ArrowRight className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        ) : (
          // Guest checkout flow
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--lavender)]/20 border border-[var(--lavender)]/30">
              <Mail className="w-6 h-6 text-[var(--purple-accent)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-dark)] font-medium mb-1">
                Check your email!
              </p>
              <p className="text-xs text-[var(--text-medium)]">
                We've sent your access details to your email address.
              </p>
            </div>

            <div className="border-t border-[var(--lavender)]/30 pt-4">
              <p className="text-sm text-[var(--text-medium)] mb-3">
                Create a free account to access your tools anytime:
              </p>
              <Link href="/sign-up" className="btn-primary w-full">
                <UserPlus className="w-5 h-5" />
                Create Account
              </Link>
            </div>

            <Link
              href={productLink}
              className="text-sm text-[var(--purple-accent)] hover:underline inline-flex items-center gap-1"
            >
              Or continue without account
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-dark)]">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
