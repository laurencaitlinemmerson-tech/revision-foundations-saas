'use client';

import { useMemo, useState } from 'react';
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
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-4 focus:ring-[var(--lavender)]/50 focus:border-[var(--purple)]"
        />
      </div>
      {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
      <button
        onClick={() => handlePurchase(product)}
        disabled={loading !== null}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple)]/25 group disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
      >
        {loading === product ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continue to Payment
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="gradient-hero text-[var(--plum)] py-10 md:py-14 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.18 }} />
        <div className="blob blob-2" style={{ opacity: 0.18 }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lilac-medium)] bg-white/60 px-4 py-2 text-xs text-[var(--plum-dark)]/70 mb-5">
              <Sparkles className="w-4 h-4 text-[var(--purple)]" />
              One-time payment • Lifetime access • No subscription
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              Pricing
            </h1>

            <p className="text-base md:text-lg text-[var(--plum-dark)]/70 mb-7">
              Pick a tool, or grab Full Hub Access and unlock everything 💜
            </p>

            <button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple)]/25 group"
              type="button"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              See options
            </button>

            <p className="text-xs text-[var(--plum-dark)]/55 mt-3">
              Full Hub Access includes everything (and future updates) ✨
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => {
              const Icon = pkg.icon;

              return (
                <div
                  key={pkg.product}
                  className={`relative bg-white p-7 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
                    pkg.highlighted
                      ? 'border-[var(--lavender)] ring-1 ring-[var(--lavender)]/40 shadow-[0_12px_40px_-18px_rgba(84,38,150,0.35)]'
                      : 'border-[var(--lilac-medium)]'
                  }`}
                >
                  {pkg.badge && (
                    <div
                      className={`absolute top-4 right-4 text-[11px] font-bold px-3 py-1 rounded-full ${
                        pkg.highlighted
                          ? 'bg-[var(--purple)] text-white shadow-sm'
                          : 'bg-[var(--lilac-soft)] text-[var(--purple)] border border-[var(--lilac-medium)]'
                      }`}
                    >
                      {pkg.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                        pkg.highlighted ? 'bg-[var(--lavender)]' : 'bg-[var(--lilac-soft)]'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-[var(--purple)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--plum-dark)]/70">{pkg.description}</p>
                      <h3 className="text-xl font-bold text-[var(--plum)] leading-tight">{pkg.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="text-4xl font-bold text-[var(--plum)] tracking-tight">{pkg.price}</div>
                    <div className="text-xs text-[var(--plum-dark)]/60">one-time</div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </span>
                        <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl bg-[var(--lilac-soft)]/55 border border-[var(--lilac-medium)] px-4 py-3 mb-6">
                    <p className="text-sm text-[var(--plum-dark)]/75">
                      <span className="font-semibold text-[var(--plum)]">Perfect for:</span> {pkg.perfectFor}
                    </p>
                  </div>

                  {pkg.product === 'bundle' && isPro ? (
                    <Link
                      href="/hub"
                      className="inline-flex items-center justify-center gap-2 w-full font-semibold py-3 px-6 rounded-xl transition-all group bg-[var(--purple)] hover:bg-[var(--plum)] text-white hover:shadow-lg hover:shadow-[var(--purple)]/25"
                    >
                      <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Go to Hub <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : showEmailInput === pkg.product && !isSignedIn ? (
                    <EmailBlock product={pkg.product} />
                  ) : (
                    <button
                      onClick={() => handlePurchase(pkg.product)}
                      disabled={loading !== null}
                      className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full group disabled:opacity-60 disabled:cursor-not-allowed ${
                        pkg.highlighted
                          ? 'bg-[var(--purple)] hover:bg-[var(--plum)] text-white hover:shadow-lg hover:shadow-[var(--purple)]/25'
                          : 'bg-[var(--lilac-soft)] hover:bg-[var(--lilac)] text-[var(--purple)] border border-[var(--lilac-medium)]'
                      }`}
                      type="button"
                    >
                      {loading === pkg.product ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          {pkg.ctaText}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ADD-ONS */}
          <section className="py-16 bg-white/60 rounded-2xl border border-[var(--lilac-medium)]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading text-[var(--plum)]">
              Add-ons
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-6">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-[var(--lilac-medium)] text-center hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-sm mb-1 text-[var(--plum)]">{addon.name}</p>
                  <p className="text-[var(--purple)] font-bold">{addon.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading text-[var(--plum)]">
              Frequently asked questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-white rounded-2xl border border-[var(--lilac-medium)] p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2 text-[var(--plum)]">{faq.question}</h3>
                  <p className="text-[var(--plum-dark)]/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-16 bg-white/60 rounded-2xl border border-[var(--lilac-medium)]">
            <div className="text-center max-w-2xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--plum)]">
                Not sure which package is right for you?
              </h2>
              <p className="text-xl text-[var(--plum-dark)]/70 mb-8">Try a preview first 💜</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[var(--purple)]/25"
                >
                  <Play className="w-5 h-5" />
                  Try Quiz Preview
                </Link>
                <Link
                  href="/osce"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--lilac-soft)] hover:bg-[var(--lilac)] text-[var(--purple)] border border-[var(--lilac-medium)] font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  <Play className="w-5 h-5" />
                  Try OSCE Preview
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      {!isSignedIn && (
        <div className="pb-10 text-center text-xs text-[var(--plum-dark)]/55">
          No account needed — checkout with email ✨
        </div>
      )}
    </div>
  );
}
