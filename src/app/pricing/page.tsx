'use client';

import React, { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  Gift,
  ClipboardCheck,
  BookOpen,
  Play,
  ArrowRight,
  Loader2,
  Mail,
  Check,
} from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function PricingPage() {
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState<Product | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<Product | null>(null);
  const [emailError, setEmailError] = useState('');

  const isPro = Boolean(user?.publicMetadata?.isPro);

  const packages = useMemo(
    () => [
      {
        name: "Children's OSCE Tool",
        price: '£4.99',
        description: 'Placement Ready',
        features: ['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'],
        perfectFor: 'OSCE practice + paeds placement confidence',
        ctaText: 'Get OSCE Tool',
        product: 'osce' as const,
        icon: ClipboardCheck,
      },
      {
        name: 'Full Hub Access',
        price: '£9.99',
        description: 'Everything Included',
        features: [
          'Full access to the Revision Hub',
          'OSCE Tool included',
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
        icon: Gift,
      },
      {
        name: 'Core Nursing Quiz',
        price: '£4.99',
        description: 'Exam Ready',
        features: ['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'],
        perfectFor: 'Revision in little pockets of time',
        ctaText: 'Get Quiz Tool',
        product: 'quiz' as const,
        icon: BookOpen,
      },
    ],
    [isPro]
  );

  const addOns = useMemo(
    () => [
      { name: 'Printable checklists', price: 'Included' },
      { name: 'New resources weekly', price: 'Included' },
      { name: 'OSCE templates', price: 'Included' },
      { name: 'Revision plans', price: 'Included' },
      { name: 'Progress tracking', price: 'Included' },
      { name: 'Lifetime updates', price: 'Included' },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      { question: 'Is this a subscription?', answer: 'No — one-time payment with lifetime access ✨' },
      { question: 'Do I need an account?', answer: 'No. Guests can checkout with email.' },
      { question: 'What payment methods do you accept?', answer: 'All major cards via Stripe 💳' },
      { question: 'Can I get a refund?', answer: 'Yes — within 7 days if you’re not happy.' },
      { question: 'Already purchased?', answer: 'If you’re signed in, you’ll see “Purchased” / “Go to Hub”.' },
    ],
    []
  );

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
      alert(`Oops! ${error?.message || 'Something went wrong.'}`);
    } finally {
      setLoading(null);
    }
  };

  const EmailBlock = ({ product }: { product: Product }) => (
    <div className="mt-4 space-y-3">
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
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]"
        />
      </div>
      {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
      <button
        onClick={() => handlePurchase(product)}
        disabled={loading !== null}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 px-6 bg-[var(--purple)] text-white hover:bg-[var(--plum)] transition-all"
        type="button"
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

      {/* HERO */}
      <section className="gradient-hero py-16 md:py-24 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.2 }} />
        <div className="blob blob-2" style={{ opacity: 0.2 }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-[var(--plum)]">PRICING</h1>
            <p className="text-xl text-[var(--plum-dark)]/70 mb-8">One-time payment • lifetime access • no subscriptions 💜</p>

            <button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple)]/20"
              type="button"
            >
              <Sparkles className="w-5 h-5" />
              See options
            </button>

            <p className="text-xs text-[var(--plum-dark)]/55 mt-3">Full Hub Access includes everything (and future updates) ✨</p>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section id="packages" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => {
              const Icon = pkg.icon;

              return (
                <div
                  key={pkg.product}
                  className={cx(
                    'relative rounded-3xl bg-white border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                    pkg.highlighted ? 'border-[var(--lavender)] shadow-lg' : 'border-[var(--lilac-medium)]'
                  )}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--purple)] text-white">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-2xl bg-[var(--lilac-soft)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[var(--purple)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--plum-dark)]/70">{pkg.description}</p>
                      <h3 className="text-xl font-bold text-[var(--plum)]">{pkg.name}</h3>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-[var(--plum)] mb-1">{pkg.price}</div>
                  <p className="text-sm text-[var(--plum-dark)]/60 mb-6">one-time • lifetime</p>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </span>
                        <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm text-[var(--plum-dark)]/70 mb-6">
                    <span className="font-semibold text-[var(--plum)]">Perfect for:</span> {pkg.perfectFor}
                  </p>

                  {pkg.product === 'bundle' && isPro ? (
                    <Link
                      href="/hub"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 px-6 bg-[var(--purple)] text-white hover:bg-[var(--plum)] transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Go to Hub <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : showEmailInput === pkg.product && !isSignedIn ? (
                    <EmailBlock product={pkg.product} />
                  ) : (
                    <button
                      onClick={() => handlePurchase(pkg.product)}
                      disabled={loading !== null}
                      className={cx(
                        'w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 px-6 transition-all',
                        pkg.highlighted
                          ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]'
                          : 'bg-[var(--lilac-soft)] text-[var(--purple)] hover:bg-[var(--lilac)]'
                      )}
                      type="button"
                    >
                      {loading === pkg.product ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" /> {pkg.ctaText}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ADD-ONS */}
          <div className="bg-white/60 border border-[var(--lilac-medium)] rounded-3xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[var(--plum)] font-heading">
              What you get inside
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl border border-[var(--lilac-medium)] text-center"
                >
                  <p className="font-semibold text-sm mb-1 text-[var(--plum)]">{addon.name}</p>
                  <p className="text-[var(--purple)] font-bold">{addon.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading text-[var(--plum)]">
            Frequently asked questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card">
                <h3 className="font-bold text-lg mb-2 text-[var(--plum)]">{faq.question}</h3>
                <p className="text-[var(--plum-dark)]/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white/60 border-t border-[var(--lilac-medium)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--plum)] font-heading">Not sure yet?</h2>
            <p className="text-xl text-[var(--plum-dark)]/70 mb-8">Try a preview first 💜</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <Play className="w-5 h-5" />
                Try Quiz Preview
              </Link>

              <Link
                href="/osce"
                className="inline-flex items-center justify-center gap-2 bg-[var(--lilac-soft)] hover:bg-[var(--lilac)] text-[var(--purple)] font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <Play className="w-5 h-5" />
                Try OSCE Preview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
