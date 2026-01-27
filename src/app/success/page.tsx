'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Sparkles, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const product = searchParams.get('product');

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const productName =
    product === 'osce'
      ? "Children's OSCE Tool"
      : product === 'quiz'
      ? 'Nursing Theory Quiz'
      : 'your product';

  const productLink = product === 'osce' ? '/osce' : product === 'quiz' ? '/quiz' : '/dashboard';

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl mb-3">Payment Successful!</h1>
        <p className="text-[var(--plum-dark)]/70 mb-8">
          Thank you! You now have full access to {productName}.
        </p>
        <div className="space-y-3">
          <Link href={productLink} className="btn-primary w-full">
            <Sparkles className="w-5 h-5" />
            Start Using {productName}
          </Link>
          <Link href="/dashboard" className="btn-secondary w-full">
            Go to Dashboard
          </Link>
        </div>
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
