'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Check,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Play,
  Gift,
  Mail,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      </span>
      <span className="text-sm text-[var(--plum-dark)]">{children}</span>
    </div>
  );
}

function SectionTitle({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  return (
    <div className="text-center mb-7 md:mb-8">
      <span className="animate-on-scroll badge badge-purple mb-3 inline-flex">{badge}</span>

      <h1 className="animate-on-scroll mb-3 leading-[1.05] tracking-tight">{title}</h1>

      <p className="animate-on-scroll text-[var(--plum-dark)]/70 max-w-lg mx-auto text-sm md:text-base">
        {subtitle}
      </p>

      <p className="animate-on-scroll text-[11px] text-[var(--plum-dark)]/55 mt-2">
        Full Hub Access includes everything (and future updates) ✨
      </p>
    </div>
  );
}

function FAQItem({
  q,
  a,
  i,
}: {
  q: string;
  a: string;
  i: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cx(
        'animate-on-scroll w-full text-left rounded-2xl border border-[var(--lilac-medium)] bg-white px-5 py-4 card-lift',
        open && 'shadow-sm'
      )}
      style={{ animationDelay: `${i * 0.06}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-[var(--plum)]">{q}</p>
          {open && <p className="mt-2 text-sm text-[var(--plum-dark)]/70">{a}</p>}
        </div>
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lilac-soft)] text-[var(--plum)]">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </div>
    </button>
  );
}

export default function PricingPage() {
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const isPro = Boolean(user?.publicMetadata?.isPro);

  const bundlePrice = 9.99;
  const oldBundlePrice = 14.99;
  const saveAmount = useMemo(() => Math.max(0, oldBundlePrice - bundlePrice), [bundlePrice, oldBundlePrice]);

  const trustItems = useMemo(
    () => [
      { icon: ShieldCheck, title: 'Secure checkout', desc: 'Powered by Stripe' },
      { icon: Zap, title: 'Instant access', desc: 'Unlock straight away' },
      { icon: Clock, title: 'Lifetime access', desc: 'One-time payment' },
    ],
    []
  );

  // Animate-on-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.animate = 'in';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Count-up stat
  const statRef = useRef<HTMLDivElement>(null);
  const [statValue, setStatValue] = useState(0);
  const [statAnimated, setStatAnimated] = useState(false);

  const animateNumber = useCallback((target: number, durationMs: number) => {
    const steps = 50;
    const increment = target / steps;
    const stepDuration = Math.max(10, Math.floor(durationMs / steps));
    let current = 0;

    const t = window.setInterval(() => {
      current += increment;
      if (current >= target) {
        setStatValue(target);
        window.clearInterval(t);
      } else {
        setStatValue(Math.floor(current));
      }
    }, stepDuration);
  }, []);

  useEffect(() => {
    if (!statRef.current || statAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatAnimated(true);
          animateNumber(Math.round(saveAmount), 900);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(statRef.current);
    return () => observer.disconnect();
  }, [animateNumber, saveAmount, statAnimated]);

  // Checkout logic
  const handlePurchase = async (product: Product) => {
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

  const handleGuestCheckout = (product: Product) => {
    if (!validateEmail(guestEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    handlePurchase(product);
  };

  const EmailInput = ({ product, variant }: { product: Product; variant: 'primary' | 'secondary' }) => (
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

      <button
        onClick={() => handleGuestCheckout(product)}
        disabled={loading !== null}
        className={cx(
          variant === 'primary' ? 'btn-primary w-full' : 'btn-secondary w-full',
          'inline-flex items-center justify-center gap-2'
        )}
      >
        {loading === product ? (
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
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        {/* Hero (slimmed) */}
        <section className="gradient-hero rounded-2xl overflow-hidden relative">
          <div className="blob blob-1" style={{ opacity: 0.18 }} />
          <div className="blob blob-2" style={{ opacity: 0.18 }} />

          <div className="px-6 py-8 md:py-10 max-w-5xl mx-auto relative z-10">
            <SectionTitle
              badge="Pricing"
              title={
                <>
                  Simple pricing that <span className="gradient-text">actually helps</span>
                </>
              }
              subtitle={<>One-time payment • lifetime access • no subscriptions 💜</>}
            />

            {/* Trust strip (slimmed) */}
            <div className="grid sm:grid-cols-3 gap-2 md:gap-3 -mt-1">
              {trustItems.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="animate-on-scroll rounded-xl bg-white/70 backdrop-blur border border-white/40 px-4 py-3 flex items-center gap-3"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <span className="h-9 w-9 rounded-xl bg-[var(--lilac-soft)] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[var(--purple)]" />
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--plum)] text-sm leading-tight">{t.title}</p>
                      <p className="text-xs text-[var(--plum-dark)]/70 leading-tight">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto mt-6">
          {/* Featured bundle */}
          <div className="animate-on-scroll card mb-8 relative overflow-hidden border-[var(--lavender)] border-2 fade-in-up">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              {isPro ? 'PURCHASED ✓' : `BEST VALUE • SAVE £${saveAmount.toFixed(0)} ✨`}
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
                  ].map((feature, i) => (
                    <div
                      key={feature}
                      className="animate-on-scroll feature-check"
                      style={{ animationDelay: `${0.12 + i * 0.04}s` }}
                    >
                      <div className="check-icon">
                        <Check className="w-3.5 w-3.5 text-green-600" />
                      </div>
                      <span className="text-sm text-[var(--plum-dark)]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div
                  ref={statRef}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--lilac-soft)] border border-[var(--lilac-medium)] px-4 py-2"
                >
                  <Sparkles className="h-4 w-4 text-[var(--purple)]" />
                  <span className="text-sm text-[var(--plum)] font-semibold">Save £{statValue}</span>
                  <span className="text-xs text-[var(--plum-dark)]/60">when you get Full Hub Access</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                {isPro ? (
                  <>
                    <div className="mb-4">
                      <span className="text-emerald-600 font-semibold">You own this!</span>
                    </div>
                    <Link
                      href="/hub"
                      className="btn-primary px-8 inline-flex items-center gap-2 justify-center"
                    >
                      <Sparkles className="w-5 h-5" /> Go to Hub <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mb-2">
                      <span className="text-[var(--plum-dark)]/50 line-through text-lg">
                        £{oldBundlePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="stat-number mb-1">£{bundlePrice.toFixed(2)}</div>
                    <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
                      one-time payment • lifetime access
                    </p>

                    {showEmailInput === 'bundle' && !isSignedIn ? (
                      <EmailInput product="bundle" variant="primary" />
                    ) : (
                      <button
                        onClick={() => handlePurchase('bundle')}
                        disabled={loading !== null}
                        className="btn-primary px-8 inline-flex items-center gap-2 justify-center"
                      >
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

                    {!isSignedIn && (
                      <p className="mt-3 text-xs text-[var(--plum-dark)]/60">
                        No account needed — checkout with email ✨
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Individual Products */}
          <div className="animate-on-scroll text-center mb-6 fade-in-up">
            <p className="text-[var(--plum-dark)]/60 text-sm">Or buy individually:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* OSCE Card */}
            <div className="animate-on-scroll card card-lift fade-in-up" style={{ animationDelay: '0.05s' }}>
              <div className="text-4xl mb-4">📋</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2">Children&apos;s OSCE Tool</h3>
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                Walk into your placement OSCE feeling prepared
              </p>

              <div className="space-y-2 mb-6">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'].map((f, i) => (
                  <div key={f} className="animate-on-scroll" style={{ animationDelay: `${0.08 + i * 0.04}s` }}>
                    <Feature>{f}</Feature>
                  </div>
                ))}
              </div>

              {showEmailInput === 'osce' && !isSignedIn ? (
                <EmailInput product="osce" variant="secondary" />
              ) : (
                <button
                  onClick={() => handlePurchase('osce')}
                  disabled={loading !== null}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2"
                >
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
            <div className="animate-on-scroll card card-lift fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4">📚</div>
              <span className="badge mb-3">£4.99 · Lifetime</span>
              <h3 className="mb-2">Core Nursing Quiz</h3>
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                17 topic areas covering the theory you need
              </p>

              <div className="space-y-2 mb-6">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'].map((f, i) => (
                  <div key={f} className="animate-on-scroll" style={{ animationDelay: `${0.08 + i * 0.04}s` }}>
                    <Feature>{f}</Feature>
                  </div>
                ))}
              </div>

              {showEmailInput === 'quiz' && !isSignedIn ? (
                <EmailInput product="quiz" variant="secondary" />
              ) : (
                <button
                  onClick={() => handlePurchase('quiz')}
                  disabled={loading !== null}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2"
                >
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
            <div className="animate-on-scroll text-center mb-6">
              <h2 className="text-xl">Questions?</h2>
              <p className="text-sm text-[var(--plum-dark)]/60 mt-1">Click to expand</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: 'Is this a subscription?', a: 'No! One-time payment with lifetime access ✨' },
                { q: 'Do I need an account?', a: 'No! Just enter your email at checkout.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe 💳' },
                { q: 'Can I get a refund?', a: 'Yes, within 7 days if not happy!' },
                { q: 'Already purchased?', a: "You'll see 'Go to Hub' automatically when signed in." },
              ].map((faq, i) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} i={i} />
              ))}
            </div>
          </div>

          {/* Free preview */}
          <div className="text-center mt-10">
            <p className="animate-on-scroll text-[var(--plum-dark)]/60 text-sm mb-4">
              Not sure yet? Try it first!
            </p>

            <div className="animate-on-scroll flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quiz" className="btn-secondary text-sm inline-flex items-center gap-2 justify-center">
                <Play className="w-4 h-4" />
                Try Quiz Preview
              </Link>

              <Link href="/osce" className="btn-secondary text-sm inline-flex items-center gap-2 justify-center">
                <Play className="w-4 h-4" />
                Try OSCE Preview
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      {!isPro && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-50 md:hidden">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-[var(--lilac-medium)] shadow-lg p-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--plum)]">Full Hub Access</p>
              <p className="text-xs text-[var(--plum-dark)]/60">£{bundlePrice.toFixed(2)} • lifetime</p>
            </div>
            <button
              onClick={() => handlePurchase('bundle')}
              disabled={loading !== null}
              className="btn-primary px-5 py-2 text-sm inline-flex items-center gap-2 justify-center"
            >
              {loading === 'bundle' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> ...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Get it
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
