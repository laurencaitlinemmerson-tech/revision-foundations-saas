'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  Gift,
  ClipboardCheck,
  BookOpen,
  Check,
  Mail,
  Loader2,
  Play,
  ArrowRight,
} from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function FeatureRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      </span>
      <span className="text-sm text-white/90 md:text-[15px]">{children}</span>
    </li>
  );
}

function LightFeatureRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      </span>
      <span className="text-sm text-[var(--plum-dark)]">{children}</span>
    </li>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  badge,
  highlighted,
  perfectFor,
  ctaText,
  onClick,
  rightSlot,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
  perfectFor: string;
  ctaText: string;
  onClick?: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        'relative rounded-3xl border bg-white/90 backdrop-blur p-6 md:p-7',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        highlighted
          ? 'border-[var(--lavender)] shadow-[0_18px_50px_rgba(120,80,180,0.12)]'
          : 'border-[var(--lilac-medium)]'
      )}
    >
      {badge && (
        <div className="absolute top-4 right-4 text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--purple)] text-white">
          {badge}
        </div>
      )}

      <div className="mb-5">
        <p className="text-sm font-semibold text-[var(--purple)]">{description}</p>
        <h3 className="text-xl md:text-2xl font-bold text-[var(--plum)] mt-1">{name}</h3>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-4xl font-bold text-[var(--plum)]">{price}</p>
          <p className="text-sm text-[var(--plum-dark)]/60 pb-1">one-time</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="text-sm text-[var(--plum-dark)]">{f}</span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-[var(--plum-dark)]/70 mb-5">
        <span className="font-semibold text-[var(--plum)]">Perfect for:</span> {perfectFor}
      </p>

      {rightSlot ? (
        rightSlot
      ) : (
        <button
          onClick={onClick}
          className={cx(
            'w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-5 py-3 transition-all',
            highlighted
              ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]'
              : 'bg-[var(--lilac-soft)] text-[var(--purple)] hover:bg-[var(--lilac)]'
          )}
          type="button"
        >
          <Sparkles className="h-5 w-5" />
          {ctaText}
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const isPro = Boolean(user?.publicMetadata?.isPro);

  // Scroll reveal (keeps your “dynamic” feel without needing Lenis)
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
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
        />
      </div>
      {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

      <button
        onClick={() => handlePurchase(product)}
        disabled={loading !== null}
        className={cx(
          'w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-5 py-3 transition-all',
          variant === 'primary'
            ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]'
            : 'bg-[var(--lilac-soft)] text-[var(--purple)] hover:bg-[var(--lilac)]'
        )}
        type="button"
      >
        {loading === product ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" /> Continue to payment
          </>
        )}
      </button>
    </div>
  );

  const packages = useMemo(
    () => [
      {
        name: 'Full Hub Access',
        price: '£9.99',
        description: 'Best Value',
        features: [
          'Full access to the Revision Hub',
          'Children’s OSCE Tool included',
          'Core Nursing Quiz included',
          'Everything unlocked',
          'Future tools included',
          'Lifetime access',
        ],
        badge: isPro ? 'Purchased ✓' : 'Most Popular',
        highlighted: true,
        perfectFor: 'Students who want everything in one go',
        ctaText: isPro ? 'Go to Hub' : 'Get Full Hub Access',
        product: 'bundle' as const,
      },
      {
        name: "Children’s OSCE Tool",
        price: '£4.99',
        description: 'Placement Ready',
        features: ['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'],
        perfectFor: 'OSCE practice + paeds placement confidence',
        ctaText: 'Get OSCE Tool',
        product: 'osce' as const,
      },
      {
        name: 'Core Nursing Quiz',
        price: '£4.99',
        description: 'Exam Ready',
        features: ['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'],
        perfectFor: 'Revision in little pockets of time',
        ctaText: 'Get Quiz Tool',
        product: 'quiz' as const,
      },
    ],
    [isPro]
  );

  const addOns = useMemo(
    () => [
      { name: 'Printable checklists pack', price: 'Included in Hub' },
      { name: 'New resources weekly', price: 'Included in Hub' },
      { name: 'OSCE station templates', price: 'Included in Hub' },
      { name: 'Revision plans', price: 'Included in Hub' },
      { name: 'Progress tracking', price: 'Included in Hub' },
      { name: 'Lifetime updates', price: 'Included in Hub' },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      { q: 'Is this a subscription?', a: 'No — one-time payment with lifetime access ✨' },
      { q: 'Do I need an account?', a: 'No. Guests can checkout with email, and you can make an account later.' },
      { q: 'What payment methods do you accept?', a: 'All major cards via Stripe 💳' },
      { q: 'Can I get a refund?', a: 'Yes — within 7 days if you’re not happy.' },
      { q: 'Already purchased?', a: 'If you’re signed in, you’ll see “Purchased” / “Go to Hub” automatically.' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* HEADER — same structure as his, but your palette */}
      <section className="gradient-hero text-[var(--plum)] py-16 md:py-24 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.18 }} />
        <div className="blob blob-2" style={{ opacity: 0.18 }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-on-scroll badge badge-purple mb-4 inline-flex">Pricing</div>

            <h1 className="animate-on-scroll text-4xl md:text-6xl font-bold mb-5 leading-[1.02] tracking-tight">
              Unlock your{' '}
              <span className="gradient-text">exam-ready</span> hub
            </h1>

            <p className="animate-on-scroll text-lg md:text-xl text-[var(--plum-dark)]/70 mb-8">
              One-time payment • lifetime access • no subscriptions 💜
            </p>

            <button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="animate-on-scroll inline-flex items-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple)]/15"
              type="button"
            >
              <Sparkles className="w-5 h-5" />
              See packages
            </button>

            <p className="animate-on-scroll mt-3 text-xs text-[var(--plum-dark)]/55">
              Full Hub Access includes everything (and future updates) ✨
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
            {packages.map((pkg) => (
              <PricingCard
                key={pkg.product}
                name={pkg.name}
                price={pkg.price}
                description={pkg.description}
                features={pkg.features}
                badge={pkg.badge}
                highlighted={pkg.highlighted}
                perfectFor={pkg.perfectFor}
                ctaText={pkg.ctaText}
                rightSlot={
                  pkg.product === 'bundle' && isPro ? (
                    <Link
                      href="/hub"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-5 py-3 transition-all bg-[var(--purple)] text-white hover:bg-[var(--plum)]"
                    >
                      <Sparkles className="h-5 w-5" />
                      Go to Hub
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : showEmailInput === pkg.product && !isSignedIn ? (
                    <EmailInput product={pkg.product as Product} variant={pkg.highlighted ? 'primary' : 'secondary'} />
                  ) : (
                    <button
                      onClick={() => handlePurchase(pkg.product as Product)}
                      disabled={loading !== null}
                      className={cx(
                        'w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-5 py-3 transition-all',
                        pkg.highlighted
                          ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]'
                          : 'bg-[var(--lilac-soft)] text-[var(--purple)] hover:bg-[var(--lilac)]'
                      )}
                      type="button"
                    >
                      {loading === pkg.product ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                        </>
                      ) : pkg.product === 'bundle' ? (
                        <>
                          <Gift className="h-5 w-5" /> {pkg.ctaText}
                        </>
                      ) : pkg.product === 'osce' ? (
                        <>
                          <ClipboardCheck className="h-5 w-5" /> {pkg.ctaText}
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-5 w-5" /> {pkg.ctaText}
                        </>
                      )}
                    </button>
                  )
                }
              />
            ))}
          </div>

          {/* FEATURED CALLOUT (his “Season Pass” style) — yours */}
          <div className="animate-on-scroll rounded-3xl p-8 md:p-12 text-white relative overflow-hidden bg-gradient-to-r from-[var(--purple)] to-[var(--plum)]">
            <div className="text-center max-w-3xl mx-auto relative z-10">
              <h3 className="text-3xl font-bold mb-4">Full Hub Access</h3>
              <div className="text-5xl font-bold mb-4">£9.99</div>
              <p className="mb-6 text-white/85">
                Everything included — OSCE + Quiz + future updates. One payment. Lifetime access.
              </p>

              <ul className="text-left max-w-2xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'OSCE Tool included',
                  'Core Nursing Quiz included',
                  'Printable checklists & guides',
                  'New content added weekly',
                  'Progress tracking dashboard',
                  'Lifetime updates',
                ].map((f) => (
                  <FeatureRow key={f}>{f}</FeatureRow>
                ))}
              </ul>

              <p className="text-sm mb-6 text-white/80">Perfect for: students who want the full library</p>

              {isPro ? (
                <Link
                  href="/hub"
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3 bg-white text-[var(--purple)] hover:bg-white/90 transition-all"
                >
                  <Sparkles className="h-5 w-5" />
                  Go to Hub
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : showEmailInput === 'bundle' && !isSignedIn ? (
                <div className="max-w-md mx-auto text-left">
                  <EmailInput product="bundle" variant="primary" />
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('bundle')}
                  disabled={loading !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3 bg-white text-[var(--purple)] hover:bg-white/90 transition-all"
                  type="button"
                >
                  {loading === 'bundle' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" /> Get Full Hub Access
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ADD-ONS (your version) */}
      <section className="py-16 bg-white/60 border-y border-[var(--lilac-medium)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--plum)]">
            What you get inside
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border border-[var(--lilac-medium)] text-center card-lift"
              >
                <p className="font-semibold text-sm mb-1 text-[var(--plum)]">{addon.name}</p>
                <p className="text-[var(--purple)] font-bold text-sm">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--plum)]">
            Frequently asked questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-bold text-lg mb-2 text-[var(--plum)]">{faq.q}</h3>
                <p className="text-[var(--plum-dark)]/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-white/60 border-t border-[var(--lilac-medium)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--plum)]">
              Not sure yet?
            </h2>
            <p className="text-xl text-[var(--plum-dark)]/70 mb-8">
              Try a preview or get in touch 💜
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-[var(--purple)] text-white font-semibold py-3 px-6 rounded-xl transition-all hover:bg-[var(--plum)]"
              >
                <Play className="w-5 h-5" />
                Try Quiz Preview
              </Link>

              <Link
                href="/osce"
                className="inline-flex items-center justify-center gap-2 bg-[var(--lilac-soft)] text-[var(--purple)] font-semibold py-3 px-6 rounded-xl transition-all hover:bg-[var(--lilac)]"
              >
                <Play className="w-5 h-5" />
                Try OSCE Preview
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white border border-[var(--lilac-medium)] text-[var(--plum)] font-semibold py-3 px-6 rounded-xl transition-all hover:shadow-md"
              >
                Contact
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Small note for guest checkout */}
      {!isSignedIn && (
        <div className="pb-10 text-center text-xs text-[var(--plum-dark)]/55">
          No account needed — checkout with email ✨
        </div>
      )}
    </div>
  );
}
