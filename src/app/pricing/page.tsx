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
  ChevronDown,
  Stethoscope,
} from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
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
        badge: isPro ? 'Purchased ✓' : 'Most popular',
        highlighted: true,
        perfectFor: 'Students who want everything in one go',
        ctaText: isPro ? 'Go to Hub' : 'Unlock everything',
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
      'Printable checklists',
      'New resources weekly',
      'OSCE templates',
      'Revision plans',
      'Progress tracking',
      'Lifetime updates',
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
    <div className="mt-4 space-y-3 animate-fadeUp">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/45" />
        <input
          type="email"
          placeholder="Email for receipt + access"
          value={guestEmail}
          onChange={(e) => {
            setGuestEmail(e.target.value);
            setEmailError('');
          }}
          className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-4 focus:ring-[var(--lavender)]/40 focus:border-[var(--purple)] text-sm"
        />
      </div>

      {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

      <button
        onClick={() => handlePurchase(product)}
        disabled={loading !== null}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--purple)] hover:bg-[var(--plum)] text-white font-semibold py-3 px-5 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-[var(--purple)]/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        type="button"
      >
        {loading === product ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Continue to payment
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <Navbar />

      {/* Ambient animated background layer */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.25)_1px,transparent_0)] [background-size:18px_18px]" />
        <div className="blob-anim blob-a" />
        <div className="blob-anim blob-b" />
      </div>

      {/* HUB-STYLE HERO (with big title) */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_0%,rgba(236,72,153,0.22),transparent_55%),radial-gradient(900px_520px_at_92%_35%,rgba(168,85,247,0.20),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.00),rgba(255,255,255,0.55))]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lilac-medium)] bg-white/70 px-4 py-2 text-xs text-[var(--plum-dark)]/70 shadow-sm animate-fadeUp">
            <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
            Pricing <span className="text-[var(--plum-dark)]/40">✦</span>{' '}
            One-time payment • Lifetime access
            <Sparkles className="w-4 h-4 text-pink-500/70" />
          </div>

          <h1 className="mt-10 text-6xl md:text-7xl font-heading font-bold tracking-tight text-[var(--plum)] leading-[0.92] animate-fadeUp">
            Pricing
          </h1>

          <p className="mt-5 text-lg md:text-xl text-[var(--plum-dark)]/70 max-w-2xl mx-auto animate-fadeUp">
            Pick one tool, or unlock everything with <span className="font-semibold">Full Hub Access</span> 💜
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeUp">
            <button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--lavender)] bg-white/70 hover:bg-white text-[var(--purple)] font-semibold px-10 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
              type="button"
            >
              <ArrowRight className="w-5 h-5 rotate-90" />
              Browse options
            </button>

            <button
              onClick={() => handlePurchase('bundle')}
              disabled={loading !== null}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full font-semibold px-10 py-4 transition-all duration-200',
                'text-white hover:-translate-y-[1px] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed',
                'bg-[linear-gradient(90deg,#A855F7_0%,#EC4899_100%)]'
              )}
              type="button"
            >
              {loading === 'bundle' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Unlock everything
                </>
              )}
            </button>
          </div>

          {!isSignedIn && (
            <p className="mt-6 text-xs text-[var(--plum-dark)]/55 animate-fadeUp">
              Guests can checkout with email — no account needed ✨
            </p>
          )}
        </div>
      </section>

      {/* PRICING CARDS (LARGER + AIRIER) */}
      <section id="packages" className="py-12 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {packages.map((pkg, idx) => {
              const Icon = pkg.icon;

              return (
                <div
                  key={pkg.product}
                  className={cn(
                    'relative bg-white rounded-3xl border transition-all duration-200',
                    'p-7 md:p-8 hover:shadow-xl hover:-translate-y-1',
                    'animate-fadeUp',
                    pkg.highlighted
                      ? 'border-[var(--lavender)] ring-1 ring-[var(--lavender)]/50 shadow-[0_16px_44px_-22px_rgba(84,38,150,0.35)]'
                      : 'border-[var(--lilac-medium)]'
                  )}
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  {pkg.badge && (
                    <div
                      className={cn(
                        'absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-full',
                        pkg.highlighted
                          ? 'bg-[var(--purple)] text-white'
                          : 'bg-[var(--lilac-soft)] text-[var(--purple)] border border-[var(--lilac-medium)]'
                      )}
                    >
                      {pkg.badge}
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-2xl flex items-center justify-center shrink-0',
                        pkg.highlighted ? 'bg-[var(--lavender)]' : 'bg-[var(--lilac-soft)]'
                      )}
                    >
                      <Icon className="h-6 w-6 text-[var(--purple)]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-[var(--plum-dark)]/60">
                        {pkg.description}
                      </p>
                      <h3 className="text-2xl font-bold text-[var(--plum)] leading-snug">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div className="text-5xl font-bold text-[var(--plum)]">{pkg.price}</div>
                    <div className="text-xs text-[var(--plum-dark)]/55">one-time</div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </span>
                        <span className="text-base text-[var(--plum-dark)]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-2xl border border-[var(--lilac-medium)] bg-[var(--lilac-soft)]/50 p-4">
                    <p className="text-sm text-[var(--plum-dark)]/80">
                      <span className="font-semibold text-[var(--plum)]">Perfect for:</span>{' '}
                      {pkg.perfectFor}
                    </p>
                  </div>

                  <div className="mt-6">
                    {pkg.product === 'bundle' && isPro ? (
                      <Link
                        href="/hub"
                        className="inline-flex items-center justify-center gap-2 w-full font-semibold py-3.5 px-5 rounded-2xl transition-all duration-200 bg-[var(--purple)] hover:bg-[var(--plum)] text-white hover:shadow-lg hover:shadow-[var(--purple)]/20"
                      >
                        <Sparkles className="w-5 h-5" />
                        Go to Hub <ArrowRight className="w-5 h-5" />
                      </Link>
                    ) : showEmailInput === pkg.product && !isSignedIn ? (
                      <EmailBlock product={pkg.product} />
                    ) : (
                      <button
                        onClick={() => handlePurchase(pkg.product)}
                        disabled={loading !== null}
                        className={cn(
                          'inline-flex items-center justify-center gap-2 w-full font-semibold py-3.5 px-5 rounded-2xl transition-all duration-200',
                          'disabled:opacity-60 disabled:cursor-not-allowed',
                          pkg.highlighted
                            ? 'text-white bg-[linear-gradient(90deg,#A855F7_0%,#EC4899_100%)] hover:shadow-xl'
                            : 'bg-[var(--lilac-soft)] hover:bg-[var(--lilac)] text-[var(--purple)] border border-[var(--lilac-medium)]'
                        )}
                        type="button"
                      >
                        {loading === pkg.product ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            {pkg.ctaText}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD-ONS */}
          <section className="mt-14 md:mt-16">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--plum)]">
                Add-ons
              </h2>
              <span className="text-sm text-[var(--plum-dark)]/60">Included with Full Hub Access</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {addOns.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--lilac-medium)] bg-white/70 px-4 py-2 text-sm text-[var(--plum)]"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  {label}
                </span>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-14 md:mt-16 pb-14">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--plum)]">
              FAQs
            </h2>

            <div className="mt-5 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-white rounded-2xl border border-[var(--lilac-medium)] px-6 py-4 hover:shadow-md transition-shadow"
                >
                  <summary className="list-none cursor-pointer flex items-center justify-between gap-3">
                    <span className="font-semibold text-[var(--plum)] text-base">
                      {faq.question}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[var(--plum-dark)]/60 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-base text-[var(--plum-dark)]/75">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes floatA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(22px, 14px, 0) scale(1.06);
          }
          66% {
            transform: translate3d(-14px, -10px, 0) scale(0.98);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes floatB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(-18px, -12px, 0) scale(0.98);
          }
          66% {
            transform: translate3d(14px, 16px, 0) scale(1.07);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blob-anim {
          position: absolute;
          border-radius: 9999px;
          filter: blur(44px);
          opacity: 1;
        }

        .blob-a {
          top: -110px;
          left: -110px;
          height: 420px;
          width: 420px;
          background: radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.22), transparent 62%),
            radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.18), transparent 62%);
          animation: floatA 14s ease-in-out infinite;
        }

        .blob-b {
          bottom: -140px;
          right: -140px;
          height: 480px;
          width: 480px;
          background: radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.16), transparent 62%),
            radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.18), transparent 62%);
          animation: floatB 16s ease-in-out infinite;
        }

        .animate-fadeUp {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .blob-a,
          .blob-b,
          .animate-fadeUp {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
