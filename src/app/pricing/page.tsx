'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Check, Sparkles, BookOpen, ClipboardCheck, Loader2, Play } from 'lucide-react';

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (product: 'osce' | 'quiz') => {
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }

    setLoading(product);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Oops! Something went wrong. Please try again or contact support if this keeps happening.');
    } finally {
      setLoading(null);
    }
  };

  const products = [
    {
      id: 'osce' as const,
      name: "Children's OSCE Tool",
      emoji: '📋',
      price: '£4.99',
      description: 'Practice OSCE stations with checklists and guidance',
      icon: ClipboardCheck,
      features: [
        'All OSCE stations',
        'Detailed checklists',
        'Timer & exam mode',
        'Progress tracking',
        'Self-assessment',
        'Mobile friendly',
        'Lifetime access',
      ],
    },
    {
      id: 'quiz' as const,
      name: 'Nursing Theory Quiz',
      emoji: '📚',
      price: '£4.99',
      description: 'Topic-based quizzes with instant feedback',
      icon: BookOpen,
      features: [
        '17 topic categories',
        'Hundreds of questions',
        'Instant feedback',
        'Explanations',
        'Progress tracking',
        'Mobile friendly',
        'Lifetime access',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Pricing
            </span>
            <h1 className="mb-4 text-[var(--text-dark)]">Simple Pricing</h1>
            <p className="text-[var(--text-medium)] max-w-lg mx-auto">
              Pay once, use forever! No sneaky subscriptions 💜
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {products.map((product) => (
              <div key={product.id} className="card relative">
                <div className="text-5xl mb-5">{product.emoji}</div>
                <span className="badge mb-4">{product.price} · Lifetime</span>
                <h3 className="mb-3 text-[var(--text-dark)]">{product.name}</h3>
                <p className="text-[var(--text-medium)] text-sm mb-6">
                  {product.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {product.features.map((feature) => (
                    <div key={feature} className="feature-check">
                      <div className="check-icon">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm text-[var(--text-dark)]">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(product.id)}
                  disabled={loading !== null}
                  className="btn-primary w-full"
                >
                  {loading === product.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get {product.name}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="card">
            <div className="text-center mb-8">
              <h2 className="text-xl text-[var(--text-dark)]">Questions?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: 'Is this a subscription?', a: 'Nope! Pay once, access forever ✨' },
                { q: 'Can I try before buying?', a: 'Yes! We have a free 3-minute preview.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe 💳' },
                { q: 'Can I get a refund?', a: 'Yes, within 7 days if not happy!' },
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/50">
                  <h4 className="font-semibold text-[var(--text-dark)] text-sm mb-2">{faq.q}</h4>
                  <p className="text-sm text-[var(--text-medium)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Free preview */}
          <div className="text-center mt-12">
            <p className="text-[var(--text-light)] text-sm mb-4">
              Not sure yet? Try it first!
            </p>
            <Link href="/quiz" className="btn-secondary text-sm">
              <Play className="w-4 h-4" />
              Try Free Preview
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
