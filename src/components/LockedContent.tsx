'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LockedContentProps {
  productName: string;
  productSlug: 'osce' | 'quiz';
}

export default function LockedContent({ productName, productSlug }: LockedContentProps) {
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
          className="btn-gradient inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Unlock Now
        </Link>
      </div>
    </div>
  );
}
