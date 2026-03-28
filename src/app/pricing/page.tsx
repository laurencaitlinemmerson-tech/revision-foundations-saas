'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Check,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Mail,
  ArrowRight,
  Crown,
  Shield,
  X,
  Info,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const { hasOsce, hasQuiz, hasBundle, isPro, isLoading: accessLoading } = useEntitlements();

  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [showGuestTip, setShowGuestTip] = useState(true);
  const [adultEmail, setAdultEmail] = useState('');
  const [adultSubmitted, setAdultSubmitted] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePurchase = async (product: 'osce' | 'quiz' | 'bundle') => {
    if (!isSignedIn && !guestEmail) {
      setShowEmailInput(product);
      return;
    }

    if (!isSignedIn && guestEmail && !validateEmail(guestEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(product);
    setEmailError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          guestEmail: !isSignedIn ? guestEmail : undefined,
        }),
      });

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.error || 'No checkout URL returned');
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      alert(`Oops! ${message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleGuestCheckout = (product: 'osce' | 'quiz' | 'bundle') => {
    if (!validateEmail(guestEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    handlePurchase(product);
  };

  const handleAdultWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(adultEmail)) return;
    await new Promise((r) => setTimeout(r, 400));
    setAdultSubmitted(true);
  };

  // Already has full access
  if (!accessLoading && hasBundle) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--linen-deep)] flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-[var(--espresso)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-[var(--espresso)] mb-4">
              You have full access
            </h1>
            <p className="text-[var(--charcoal)] text-lg mb-8">
              Lifetime access to everything — OSCE tool, quiz, and revision hub.
            </p>
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[var(--charcoal-light)] mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-display text-[var(--espresso)] mb-5">
            Simple pricing, lifetime access.
          </h1>
          <p className="text-[var(--charcoal)] text-lg max-w-xl">
            One payment. No subscription. New content added regularly at no extra cost.
          </p>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Guest tip */}
          {!isSignedIn && showGuestTip && (
            <div className="mb-10 bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--charcoal-light)] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[var(--charcoal)]">
                <span className="font-medium">No account needed.</span> You can checkout as a guest with
                just your email — create an account later to sync progress across devices.
              </p>
              <button
                onClick={() => setShowGuestTip(false)}
                className="text-[var(--charcoal-light)] hover:text-[var(--espresso)] transition-colors ml-auto flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* === CHILDREN'S BUNDLE === */}
          <div className="bg-white border border-[var(--linen-deep)] rounded-2xl overflow-hidden mb-6">
            <div className="p-7 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--charcoal-light)] mb-1">Most popular</p>
                  <h2 className="text-2xl font-display text-[var(--espresso)]">Children&apos;s Bundle</h2>
                  <p className="text-sm text-[var(--charcoal)] mt-1">
                    OSCE tool + quiz + revision hub — everything for paeds nursing
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-display text-[var(--espresso)]">£9.99</div>
                  <p className="text-xs text-[var(--charcoal-light)]">one-time</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 mb-7 text-sm text-[var(--charcoal)]">
                {[
                  'Full Revision Hub access',
                  "Children's OSCE Tool (50+ stations)",
                  'Core Nursing Quiz (17 topics)',
                  'All future updates included',
                  'Progress tracking dashboard',
                  'Lifetime access',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--espresso)] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {showEmailInput === 'bundle' && !isSignedIn ? (
                <div className="space-y-3 max-w-sm">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--linen-deep)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 focus:border-[var(--espresso)]/40 text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => handleGuestCheckout('bundle')} disabled={loading !== null} className="btn-primary flex-1 py-3">
                      {loading === 'bundle' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Get Bundle</>}
                    </button>
                    <button onClick={() => setShowEmailInput(null)} className="btn-secondary py-3 px-4 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <button
                    onClick={() => handlePurchase('bundle')}
                    disabled={loading !== null}
                    className="btn-primary py-3 px-8"
                  >
                    {loading === 'bundle' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Get Children&apos;s Bundle — £9.99</>}
                  </button>
                  <p className="text-xs text-[var(--charcoal-light)] flex items-center gap-1">
                    <Shield className="w-3 h-3" /> 7-day money-back guarantee
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* === ADULT BUNDLE (coming soon) === */}
          <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-2xl overflow-hidden mb-6 opacity-75">
            <div className="p-7 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs bg-[var(--charcoal-light)]/10 text-[var(--charcoal)] px-3 py-1 rounded-full font-medium">
                    Coming soon
                  </span>
                  <h2 className="text-2xl font-display text-[var(--espresso)] mt-2">Adult Nursing Bundle</h2>
                  <p className="text-sm text-[var(--charcoal)] mt-1">
                    NEWS2, sepsis, wound care, adult OSCE stations, and more
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-display text-[var(--espresso)]">£9.99</div>
                  <p className="text-xs text-[var(--charcoal-light)]">one-time</p>
                </div>
              </div>

              <p className="text-sm text-[var(--charcoal)] mb-5">
                Adult nursing content is in development. Leave your email and we&apos;ll let you know when it launches.
              </p>

              {adultSubmitted ? (
                <p className="text-sm text-[var(--espresso)] font-medium">Got it — we&apos;ll email you when it&apos;s ready.</p>
              ) : (
                <form onSubmit={handleAdultWaitlist} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={adultEmail}
                      onChange={(e) => setAdultEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--linen-deep)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm"
                    />
                  </div>
                  <button type="submit" className="btn-secondary py-2.5 px-5 text-sm flex-shrink-0">
                    Notify me
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--linen-deep)]" />
            <span className="text-xs text-[var(--charcoal-light)]">or buy individually</span>
            <div className="flex-1 h-px bg-[var(--linen-deep)]" />
          </div>

          {/* Individual tools */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {/* OSCE */}
            <div className={`bg-white border rounded-2xl p-6 ${hasOsce ? 'border-[var(--espresso)]/20' : 'border-[var(--linen-deep)]'}`}>
              {hasOsce && (
                <span className="inline-flex items-center gap-1 text-xs bg-[var(--espresso)] text-white px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" /> Owned
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--linen-deep)] flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[var(--espresso)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--espresso)]">Children&apos;s OSCE Tool</h3>
                  {!hasOsce && <span className="text-sm text-[var(--charcoal)]">£4.99</span>}
                </div>
              </div>
              <p className="text-sm text-[var(--charcoal)] mb-5">
                50+ paediatric OSCE stations with marking checklists and timed exam mode.
              </p>
              {hasOsce ? (
                <Link href="/osce" className="btn-secondary w-full justify-center py-2.5 text-sm">
                  Open OSCE Tool <ArrowRight className="w-4 h-4" />
                </Link>
              ) : showEmailInput === 'osce' && !isSignedIn ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--linen-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('osce')} disabled={loading !== null} className="btn-secondary w-full py-2.5 text-sm">
                    {loading === 'osce' ? 'Processing...' : 'Continue to Checkout'}
                  </button>
                  <button onClick={() => setShowEmailInput(null)} className="text-xs text-[var(--charcoal-light)] w-full">Cancel</button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('osce')} disabled={loading !== null} className="btn-secondary w-full py-2.5 text-sm">
                  {loading === 'osce' ? 'Processing...' : 'Get OSCE Tool — £4.99'}
                </button>
              )}
            </div>

            {/* Quiz */}
            <div className={`bg-white border rounded-2xl p-6 ${hasQuiz ? 'border-[var(--espresso)]/20' : 'border-[var(--linen-deep)]'}`}>
              {hasQuiz && (
                <span className="inline-flex items-center gap-1 text-xs bg-[var(--espresso)] text-white px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" /> Owned
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--linen-deep)] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[var(--espresso)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--espresso)]">Core Nursing Quiz</h3>
                  {!hasQuiz && <span className="text-sm text-[var(--charcoal)]">£4.99</span>}
                </div>
              </div>
              <p className="text-sm text-[var(--charcoal)] mb-5">
                17 topic areas with instant feedback and explanations — not just right or wrong.
              </p>
              {hasQuiz ? (
                <Link href="/quiz" className="btn-secondary w-full justify-center py-2.5 text-sm">
                  Open Quiz Tool <ArrowRight className="w-4 h-4" />
                </Link>
              ) : showEmailInput === 'quiz' && !isSignedIn ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--linen-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('quiz')} disabled={loading !== null} className="btn-secondary w-full py-2.5 text-sm">
                    {loading === 'quiz' ? 'Processing...' : 'Continue to Checkout'}
                  </button>
                  <button onClick={() => setShowEmailInput(null)} className="text-xs text-[var(--charcoal-light)] w-full">Cancel</button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('quiz')} disabled={loading !== null} className="btn-secondary w-full py-2.5 text-sm">
                  {loading === 'quiz' ? 'Processing...' : 'Get Quiz Tool — £4.99'}
                </button>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 text-center">
            {[
              { icon: '🔒', label: 'Secure checkout', desc: 'Powered by Stripe' },
              { icon: '⚡', label: 'Instant access', desc: 'Start right away' },
              { icon: '↩️', label: '7-day refund', desc: 'No questions asked' },
              { icon: '♾️', label: 'Lifetime access', desc: 'All updates included' },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-[var(--linen-deep)] rounded-xl p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-semibold text-[var(--espresso)] mb-0.5">{item.label}</div>
                <div className="text-xs text-[var(--charcoal-light)]">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-2xl p-7 md:p-8 mb-12">
            <h2 className="text-xl font-display text-[var(--espresso)] mb-6">Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'Is this a subscription?',
                  a: 'Nope. One payment, yours forever. No recurring charges.',
                },
                {
                  q: 'Do I need an account?',
                  a: "Not to buy — you can checkout as a guest with just your email. Create an account later to sync progress across devices.",
                },
                {
                  q: "What if it's not for me?",
                  a: "Full refund within 7 days, no questions asked. Just email and we'll sort it.",
                },
                {
                  q: 'Will more content be added?',
                  a: 'Yes — new resources are added regularly. All future updates are included with your purchase.',
                },
                {
                  q: 'Does it work on my phone?',
                  a: 'Yes, everything is mobile-friendly. Designed to work on placement, on the bus, wherever.',
                },
                {
                  q: "What's the difference between the bundles?",
                  a: "The Children's Bundle has everything available now — OSCE tool, quiz, and the full hub. The Adult Nursing Bundle is in development. The Complete Bundle (coming soon) will include both branches.",
                },
              ].map((faq, i) => (
                <div key={i} className="border-b border-[var(--linen-deep)] last:border-0 pb-5 last:pb-0">
                  <h4 className="font-medium text-[var(--espresso)] mb-1.5">{faq.q}</h4>
                  <p className="text-sm text-[var(--charcoal)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Try free */}
          {!isPro && (
            <div className="text-center">
              <p className="text-sm text-[var(--charcoal-light)] mb-4">Want to try before you buy?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/osce" className="btn-secondary text-sm px-6">
                  🩺 Try OSCE preview
                </Link>
                <Link href="/quiz" className="btn-secondary text-sm px-6">
                  📚 Try quiz preview
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
