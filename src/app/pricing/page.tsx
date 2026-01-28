'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, BookOpen, ClipboardCheck, Loader2, Play, Gift, Mail, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  // Check if user already has Pro access
  const isPro = Boolean(user?.publicMetadata?.isPro);

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
    } catch (error: any) {
      console.error('Checkout error:', error);
      const message = error?.message || 'Something went wrong. Please try again or contact support.';
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

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[var(--lilac-soft)] to-white py-8 md:py-10 px-6 md:px-10 mb-10 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--lavender)] rounded-full blur-3xl opacity-[0.18] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--pink)] rounded-full blur-3xl opacity-[0.18] translate-x-1/3 translate-y-1/3" />
            
            {/* Content */}
            <div className="relative z-10 text-center mb-7 md:mb-8">
              <span className="badge badge-purple mb-4">Pricing</span>
              <h1 className="mb-3 leading-[1.05] tracking-tight">Simple Pricing</h1>
              <p className="text-sm md:text-base text-[var(--plum-dark)]/70 max-w-lg mx-auto">
                One-time payment • lifetime access • no subscriptions 💜
              </p>
              <p className="text-[11px] text-[var(--plum-dark)]/55 mt-2">
                Full Hub Access includes everything (and future updates) ✨
              </p>
            </div>

            {/* Trust Strip */}
            <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-3">
              {[
                { icon: '🔒', label: 'Secure Checkout' },
                { icon: '⚡', label: 'Instant Access' },
                { icon: '💜', label: 'Lifetime Updates' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
                >
                  <div className="h-9 w-9 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                    <span className="h-4 w-4 flex items-center justify-center text-sm">{item.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--plum-dark)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bundle - Featured */}
          <div className="card mb-8 relative overflow-hidden border-[var(--lavender)] border-2">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              {isPro ? 'PURCHASED ✓' : 'SAVE £5 ✨'}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-box">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2>Full Hub Access</h2>
                    <p className="text-[var(--plum-dark)]/70 text-sm">
                      Everything included — OSCE + Quiz + future updates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    'Full access to the Revision Hub',
                    'OSCE Tool included',
                    'Core Nursing Quiz included',
                    'Everything unlocked',
                    'Future tools included',
                    'Lifetime access',
                  ].map((feature) => (
                    <div key={feature} className="feature-check">
                      <div className="check-icon">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm text-[var(--plum-dark)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center md:text-right">
                {isPro ? (
                  <>
                    <div className="mb-4">
                      <span className="text-emerald-600 font-semibold">You own this!</span>
                    </div>
                    <Link href="/hub" className="btn-primary px-8">
                      <Sparkles className="w-5 h-5" /> Go to Hub <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mb-2">
                      <span className="text-[var(--plum-dark)]/50 line-through text-lg">£14.99</span>
                    </div>

                    <div className="stat-number mb-1">£9.99</div>
                    <p className="text-sm text-[var(--plum-dark)]/70 mb-4">one-time payment • lifetime access</p>

                    {showEmailInput === 'bundle' && !isSignedIn ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/50" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={guestEmail}
                            onChange={(e) => {
                              setGuestEmail(e.target.value);
                              setEmailError('');
                            }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                          />
                        </div>
                        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

                        <button onClick={() => handleGuestCheckout('bundle')} disabled={loading !== null} className="btn-primary w-full">
                          {loading === 'bundle' ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" /> Continue to Payment
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} className="btn-primary px-8">
                        {loading === 'bundle' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" /> Get Full Hub Access
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Individual Products */}
          <div className="text-center mb-6">
            <p className="text-[var(--plum-dark)]/60 text-sm">Or buy individually:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* OSCE Card */}
            <div className="card">
              <div className="text-4xl mb-4">📋</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2">Children&apos;s OSCE Tool</h3>
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                Walk into your placement OSCE feeling prepared
              </p>

              <div className="space-y-2 mb-6">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>

              {showEmailInput === 'osce' && !isSignedIn ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/50" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        setEmailError('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('osce')} disabled={loading !== null} className="btn-secondary w-full">
                    {loading === 'osce' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="w-5 h-5" /> Continue
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('osce')} disabled={loading !== null} className="btn-secondary w-full">
                  {loading === 'osce' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-5 h-5" /> Get OSCE Tool
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Quiz Card */}
            <div className="card">
              <div className="text-4xl mb-4">📚</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2">Core Nursing Quiz</h3>
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                17 topic areas covering the theory you need
              </p>

              <div className="space-y-2 mb-6">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>

              {showEmailInput === 'quiz' && !isSignedIn ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/50" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        setEmailError('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('quiz')} disabled={loading !== null} className="btn-secondary w-full">
                    {loading === 'quiz' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" /> Continue
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('quiz')} disabled={loading !== null} className="btn-secondary w-full">
                  {loading === 'quiz' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5" /> Get Quiz Tool
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-xl">Questions?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: 'Is this a subscription?', a: 'No! One-time payment with lifetime access ✨' },
                { q: 'Do I need an account?', a: 'No! Just enter your email at checkout.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe 💳' },
                { q: 'Can I get a refund?', a: 'Yes, within 7 days if not happy!' },
                { q: 'Already purchased?', a: "You'll see 'Go to Hub' automatically when signed in." },
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--lilac-soft)]">
                  <h4 className="font-semibold text-[var(--plum)] text-sm mb-1">{faq.q}</h4>
                  <p className="text-sm text-[var(--plum-dark)]/70">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Free preview */}
          <div className="text-center mt-10">
            <p className="text-[var(--plum-dark)]/60 text-sm mb-4">Not sure yet? Try it first!</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quiz" className="btn-secondary text-sm">
                <Play className="w-4 h-4" />
                Try Quiz Preview
              </Link>

              <Link href="/osce" className="btn-secondary text-sm">
                <Play className="w-4 h-4" />
                Try OSCE Preview
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
