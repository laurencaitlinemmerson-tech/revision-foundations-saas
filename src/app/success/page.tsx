'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const product = searchParams.get('product');

  useEffect(() => {
    // Simulate checking payment status
    const timer = setTimeout(() => {
      setLoading(false);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#c4b5fd', '#ddd6fe'],
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const productName =
    product === 'osce'
      ? "Children's OSCE Tool"
      : product === 'quiz'
      ? 'Nursing Theory Quiz'
      : 'your product';

  const productLink = product === 'osce' ? '/osce' : product === 'quiz' ? '/quiz' : '/dashboard';

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-light">
        <Navbar />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--lavender-primary)] mx-auto mb-4" />
            <p className="text-[var(--plum-text)]">Processing your purchase...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-light">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Header */}
          <h1 className="font-display text-4xl font-bold text-[var(--plum-text)] mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-[var(--plum-text)]/70 mb-8">
            Thank you for your purchase! You now have full access to {productName}.
          </p>

          {/* Purchase Summary */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--purple-gradient-start)] to-[var(--purple-gradient-end)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[var(--plum-text)]">{productName}</p>
                  <p className="text-sm text-[var(--plum-text)]/60">Lifetime access</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">£4.99</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="glass-card p-6 mb-8 text-left">
            <h2 className="font-semibold text-[var(--plum-text)] mb-4">What&apos;s Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--lilac-tint)] flex items-center justify-center text-xs font-bold text-[var(--lavender-primary)] flex-shrink-0">
                  1
                </span>
                <span className="text-[var(--plum-text)]/80">
                  Your account has been upgraded with full access
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--lilac-tint)] flex items-center justify-center text-xs font-bold text-[var(--lavender-primary)] flex-shrink-0">
                  2
                </span>
                <span className="text-[var(--plum-text)]/80">
                  A receipt has been sent to your email
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--lilac-tint)] flex items-center justify-center text-xs font-bold text-[var(--lavender-primary)] flex-shrink-0">
                  3
                </span>
                <span className="text-[var(--plum-text)]/80">
                  Start using your new tool right away!
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={productLink} className="btn-gradient">
              Start Using {productName}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
