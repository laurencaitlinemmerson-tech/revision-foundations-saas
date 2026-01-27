'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Check, Sparkles, BookOpen, ClipboardCheck, Loader2, Play, Star, Gift } from 'lucide-react';

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (product: 'osce' | 'quiz' | 'bundle') => {
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

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
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

          {/* Bundle - Featured */}
          <div className="card mb-8 relative overflow-hidden border-2 border-[var(--lavender-dark)]">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--lavender-dark)] to-[var(--pink-dark)] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              BEST VALUE ✨
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-box">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
                      Complete Nursing Bundle
                    </h2>
                    <p className="text-[var(--text-medium)] text-sm">Both tools in one!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    'OSCE Tool included',
                    'Quiz Tool included',
                    'All features unlocked',
                    'Lifetime access',
                    'Save £2!',
                    'Best for exam prep',
                  ].map((feature) => (
                    <div key={feature} className="feature-check">
                      <div className="check-icon">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm text-[var(--text-dark)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="mb-2">
                  <span className="text-[var(--text-light)] line-through text-lg">£9.98</span>
                </div>
                <div className="text-4xl font-bold text-[var(--text-dark)] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                  £7.99
                </div>
                <p className="text-sm text-[var(--text-medium)] mb-4">one-time payment</p>
                <button
                  onClick={() => handlePurchase('bundle')}
                  disabled={loading !== null}
                  className="btn-primary px-8"
                >
                  {loading === 'bundle' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get the Bundle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Individual Products */}
          <div className="text-center mb-6">
            <p className="text-[var(--text-light)] text-sm">Or buy individually:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* OSCE Card */}
            <div className="card">
              <div className="text-4xl mb-4">📋</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2 text-[var(--text-dark)]">Children's OSCE Tool</h3>
              <p className="text-[var(--text-medium)] text-sm mb-5">
                Practice stations with checklists and guidance
              </p>
              <div className="space-y-2 mb-6">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--text-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePurchase('osce')}
                disabled={loading !== null}
                className="btn-secondary w-full"
              >
                {loading === 'osce' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="w-5 h-5" />
                    Get OSCE Tool
                  </>
                )}
              </button>
            </div>

            {/* Quiz Card */}
            <div className="card">
              <div className="text-4xl mb-4">📚</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2 text-[var(--text-dark)]">Nursing Theory Quiz</h3>
              <p className="text-[var(--text-medium)] text-sm mb-5">
                Topic-based quizzes with instant feedback
              </p>
              <div className="space-y-2 mb-6">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--text-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePurchase('quiz')}
                disabled={loading !== null}
                className="btn-secondary w-full"
              >
                {loading === 'quiz' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Get Quiz Tool
                  </>
                )}
              </button>
            </div>
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
