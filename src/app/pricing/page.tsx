'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Check,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Mail,
  ArrowRight,
  Crown,
  Shield,
  X,
  Info,
  Sparkles,
  Smartphone,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

type Product = 'osce' | 'quiz' | 'bundle';

const BUNDLE_FEATURES = [
  '50+ paediatric OSCE stations',
  'Core nursing quiz across 17 topics',
  'Revision hub for nursing knowledge',
  'Timed exam mode + marking checklists',
  'Progress tracking dashboard',
  'All future updates included',
];

const FAQS = [
  {
    q: 'Is this a subscription?',
    a: 'No. It is a one-time payment with lifetime access. No recurring charges.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You can checkout as a guest with just your email, then create an account later to sync progress across devices.',
  },
  {
    q: "What if it's not for me?",
    a: 'You can get a full refund within 7 days. No questions asked.',
  },
  {
    q: 'Will more content be added?',
    a: 'Yes. New resources are added regularly, and all future updates are included in your purchase.',
  },
  {
    q: 'Does it work on my phone?',
    a: 'Yes. Everything is mobile-friendly and designed to work on placement, on the bus, or wherever you revise.',
  },
  {
    q: 'What is included in the bundle?',
    a: 'The Children’s Bundle includes the OSCE tool, the core quiz, and the revision hub in one purchase.',
  },
];

const TRUST_ITEMS = [
  {
    icon: Lock,
    title: 'Secure checkout',
    desc: 'Powered by Stripe',
  },
  {
    icon: Sparkles,
    title: 'Instant access',
    desc: 'Start right away',
  },
  {
    icon: RefreshCw,
    title: '7-day refund',
    desc: 'No questions asked',
  },
  {
    icon: Smartphone,
    title: 'Works anywhere',
    desc: 'Mobile, tablet, laptop',
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const {
    hasOsce,
    hasQuiz,
    hasBundle,
    isPro,
    isLoading: accessLoading,
  } = useEntitlements();

  const [loading, setLoading] = useState<Product | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<Product | null>(null);
  const [emailError, setEmailError] = useState('');
  const [showGuestTip, setShowGuestTip] = useState(true);

  const [adultEmail, setAdultEmail] = useState('');
  const [adultSubmitted, setAdultSubmitted] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const bundleValueText = useMemo(() => {
    // Individual items shown are £4.99 + £4.99, and the bundle also includes the revision hub.
    // Avoid over-claiming a specific hub price if it is not sold separately.
    return 'Better value than buying separately';
  }, []);

  const resetEmailState = () => {
    setEmailError('');
  };

  const handlePurchase = async (product: Product) => {
    if (!isSignedIn && !guestEmail.trim()) {
      setShowEmailInput(product);
      setEmailError('');
      return;
    }

    if (!isSignedIn && !validateEmail(guestEmail)) {
      setShowEmailInput(product);
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
          guestEmail: !isSignedIn ? guestEmail.trim() : undefined,
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
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';
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

    void handlePurchase(product);
  };

  const handleAdultWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(adultEmail)) return;

    await new Promise((resolve) => setTimeout(resolve, 400));
    setAdultSubmitted(true);
  };

  if (!accessLoading && hasBundle) {
    return (
      <div
        className="bg-cream"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
          }}
        >
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            {/* Account status label */}
            <p
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--charcoal)',
                marginBottom: '20px',
              }}
            >
              Account status
            </p>

            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--linen-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <Crown className="w-7 h-7" style={{ color: 'var(--espresso)' }} />
            </div>

            {/* Heading */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 400,
                color: 'var(--espresso)',
                marginBottom: '10px',
                lineHeight: 1.15,
              }}
            >
              You have full access
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--charcoal)',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              Lifetime access to everything — no subscription, no renewal.
            </p>

            {/* Access chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '32px',
              }}
            >
              {['OSCE Tool', 'Core Quiz', 'Revision Hub', 'Lifetime access'].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: 'var(--espresso)',
                      background: 'var(--linen-light)',
                      border: '0.5px solid var(--linen-deep)',
                      padding: '5px 14px',
                      borderRadius: '2px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {label}
                  </span>
                ),
              )}
            </div>

            {/* Primary CTA */}
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                padding: '12px 28px',
              }}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary action */}
            <div style={{ marginTop: '16px' }}>
              <Link
                href="/hub"
                style={{
                  fontSize: '13px',
                  color: 'var(--charcoal)',
                  textDecoration: 'none',
                  borderBottom: '0.5px solid var(--linen-deep)',
                  paddingBottom: '1px',
                  transition: 'color 0.15s',
                }}
              >
                Browse the Hub
              </Link>
            </div>
          </div>
        </main>

        {/* Compact footer */}
        <footer
          style={{
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
            padding: '20px 24px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--charcoal)',
            letterSpacing: '0.02em',
          }}
        >
          Revision Foundations &middot; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--charcoal-light)] mb-4">
            Pricing
          </p>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-display text-[var(--espresso)] mb-5">
                Revise for exams, practise OSCEs, and build nursing knowledge in
                one place.
              </h1>

              <p className="text-lg md:text-xl text-[var(--charcoal)] max-w-2xl mb-5">
                One payment for the tools and revision support that help you feel
                more prepared on placement, in exams, and in OSCEs.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-[var(--charcoal)] mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[var(--linen-deep)] rounded-full">
                  <Check className="w-4 h-4 text-[var(--espresso)]" />
                  Lifetime access
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[var(--linen-deep)] rounded-full">
                  <Check className="w-4 h-4 text-[var(--espresso)]" />
                  No subscription
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[var(--linen-deep)] rounded-full">
                  <Check className="w-4 h-4 text-[var(--espresso)]" />
                  New content included
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[var(--linen-deep)] rounded-full">
                  <Check className="w-4 h-4 text-[var(--espresso)]" />
                  Mobile-friendly
                </span>
              </div>

              {!isPro && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/osce" className="btn-secondary text-sm px-6 py-3">
                    Try OSCE preview
                  </Link>
                  <Link href="/quiz" className="btn-secondary text-sm px-6 py-3">
                    Try quiz preview
                  </Link>
                </div>
              )}
            </div>

            {!isSignedIn && showGuestTip && (
              <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] p-5 rounded-xl relative">
                <button
                  onClick={() => setShowGuestTip(false)}
                  className="absolute right-3 top-3 text-[var(--charcoal-light)] hover:text-[var(--espresso)] transition-colors"
                  aria-label="Dismiss guest checkout note"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-[var(--charcoal-light)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--espresso)] mb-1">
                      No account needed
                    </p>
                    <p className="text-sm text-[var(--charcoal)] leading-relaxed">
                      You can checkout as a guest with just your email, then create
                      an account later to sync progress across devices.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main bundle */}
          <div className="bg-white border-2 border-[var(--espresso)]/15 shadow-sm overflow-hidden mb-8 rounded-2xl">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0">
              <div className="p-7 md:p-9 border-b lg:border-b-0 lg:border-r border-[var(--linen-deep)]">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--charcoal-light)]">
                    Most popular
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[var(--linen-light)] text-[var(--espresso)] text-xs font-medium px-3 py-1">
                    Best value
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-display text-[var(--espresso)] mb-2">
                  Children&apos;s Bundle
                </h2>

                <p className="text-[var(--charcoal)] text-base md:text-lg mb-6 max-w-2xl">
                  Everything you need for OSCE practice, nursing revision, and core
                  knowledge building in one bundle.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {BUNDLE_FEATURES.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 text-sm text-[var(--charcoal)]"
                    >
                      <Check className="w-4 h-4 text-[var(--espresso)] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-xl p-4">
                  <p className="text-sm font-medium text-[var(--espresso)] mb-1">
                    What this helps with
                  </p>
                  <p className="text-sm text-[var(--charcoal)] leading-relaxed">
                    Practise stations before OSCEs, revise high-yield nursing topics,
                    and strengthen the knowledge you need for exams and placement.
                  </p>
                </div>
              </div>

              <div className="p-7 md:p-9 bg-[var(--linen-light)]">
                <div className="mb-5">
                  <p className="text-sm text-[var(--charcoal-light)] mb-2">
                    One-time payment
                  </p>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl md:text-5xl font-display text-[var(--espresso)]">
                      £9.99
                    </span>
                  </div>
                  <p className="text-sm text-[var(--charcoal)]">{bundleValueText}</p>
                </div>

                {showEmailInput === 'bundle' && !isSignedIn ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[var(--espresso)]">
                      Checkout as guest
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={guestEmail}
                        onChange={(e) => {
                          setGuestEmail(e.target.value);
                          resetEmailState();
                        }}
                        className="w-full pl-11 pr-4 py-3 border border-[var(--linen-deep)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 focus:border-[var(--espresso)]/40 text-sm rounded-xl"
                        aria-label="Guest email address"
                      />
                    </div>

                    {emailError && (
                      <p className="text-red-500 text-xs" role="alert">
                        {emailError}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGuestCheckout('bundle')}
                        disabled={loading !== null}
                        className="btn-primary flex-1 py-3"
                      >
                        {loading === 'bundle' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Get instant access — £9.99</>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setShowEmailInput(null);
                          setEmailError('');
                        }}
                        className="btn-secondary py-3 px-4 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handlePurchase('bundle')}
                      disabled={loading !== null}
                      className="btn-primary w-full justify-center py-3.5 px-8 mb-4"
                    >
                      {loading === 'bundle' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Get Children&apos;s Bundle — £9.99</>
                      )}
                    </button>

                    <div className="space-y-2 text-sm text-[var(--charcoal)]">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[var(--espresso)]" />
                        7-day money-back guarantee
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[var(--espresso)]" />
                        No subscription or recurring charges
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[var(--espresso)]" />
                        Guest checkout available
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Individual options */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-[var(--linen-deep)]" />
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--charcoal-light)]">
              Or buy individually
            </span>
            <div className="flex-1 h-px bg-[var(--linen-deep)]" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div
              className={`bg-white border p-6 rounded-2xl ${
                hasOsce ? 'border-[var(--espresso)]/20' : 'border-[var(--linen-deep)]'
              }`}
            >
              {hasOsce && (
                <span className="inline-flex items-center gap-1 text-xs bg-[var(--espresso)] text-white px-2.5 py-1 rounded-full mb-4">
                  <Check className="w-3 h-3" />
                  Owned
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-[var(--linen-deep)] flex items-center justify-center rounded-xl">
                  <ClipboardCheck className="w-5 h-5 text-[var(--espresso)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--espresso)]">
                    Children&apos;s OSCE Tool
                  </h3>
                  {!hasOsce && (
                    <span className="text-sm text-[var(--charcoal)]">£4.99</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[var(--charcoal)] leading-relaxed mb-5">
                Practise 50+ paediatric OSCE stations with marking checklists and
                timed exam mode so you can feel more prepared on the day.
              </p>

              {hasOsce ? (
                <Link
                  href="/osce"
                  className="btn-secondary w-full justify-center py-2.5 text-sm"
                >
                  Open OSCE Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : showEmailInput === 'osce' && !isSignedIn ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        resetEmailState();
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--linen-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm rounded-xl"
                      aria-label="Guest email for OSCE checkout"
                    />
                  </div>

                  {emailError && (
                    <p className="text-red-500 text-xs" role="alert">
                      {emailError}
                    </p>
                  )}

                  <button
                    onClick={() => handleGuestCheckout('osce')}
                    disabled={loading !== null}
                    className="btn-secondary w-full py-2.5 text-sm"
                  >
                    {loading === 'osce' ? 'Processing...' : 'Continue to checkout'}
                  </button>

                  <button
                    onClick={() => {
                      setShowEmailInput(null);
                      setEmailError('');
                    }}
                    className="text-xs text-[var(--charcoal-light)] w-full"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('osce')}
                  disabled={loading !== null}
                  className="btn-secondary w-full py-2.5 text-sm"
                >
                  {loading === 'osce' ? 'Processing...' : 'Get OSCE Tool — £4.99'}
                </button>
              )}
            </div>

            <div
              className={`bg-white border p-6 rounded-2xl ${
                hasQuiz ? 'border-[var(--espresso)]/20' : 'border-[var(--linen-deep)]'
              }`}
            >
              {hasQuiz && (
                <span className="inline-flex items-center gap-1 text-xs bg-[var(--espresso)] text-white px-2.5 py-1 rounded-full mb-4">
                  <Check className="w-3 h-3" />
                  Owned
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-[var(--linen-deep)] flex items-center justify-center rounded-xl">
                  <BookOpen className="w-5 h-5 text-[var(--espresso)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--espresso)]">
                    Core Nursing Quiz
                  </h3>
                  {!hasQuiz && (
                    <span className="text-sm text-[var(--charcoal)]">£4.99</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[var(--charcoal)] leading-relaxed mb-5">
                Build exam-ready nursing knowledge across 17 topic areas with
                instant feedback and explanations, not just right or wrong answers.
              </p>

              {hasQuiz ? (
                <Link
                  href="/quiz"
                  className="btn-secondary w-full justify-center py-2.5 text-sm"
                >
                  Open Quiz Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : showEmailInput === 'quiz' && !isSignedIn ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        resetEmailState();
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--linen-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm rounded-xl"
                      aria-label="Guest email for quiz checkout"
                    />
                  </div>

                  {emailError && (
                    <p className="text-red-500 text-xs" role="alert">
                      {emailError}
                    </p>
                  )}

                  <button
                    onClick={() => handleGuestCheckout('quiz')}
                    disabled={loading !== null}
                    className="btn-secondary w-full py-2.5 text-sm"
                  >
                    {loading === 'quiz' ? 'Processing...' : 'Continue to checkout'}
                  </button>

                  <button
                    onClick={() => {
                      setShowEmailInput(null);
                      setEmailError('');
                    }}
                    className="text-xs text-[var(--charcoal-light)] w-full"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('quiz')}
                  disabled={loading !== null}
                  className="btn-secondary w-full py-2.5 text-sm"
                >
                  {loading === 'quiz' ? 'Processing...' : 'Get Quiz Tool — £4.99'}
                </button>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-[var(--linen-deep)] p-5 rounded-2xl text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--linen-light)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--espresso)]" />
                  </div>
                  <div className="text-sm font-semibold text-[var(--espresso)] mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-[var(--charcoal-light)]">
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Adult bundle */}
          <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-2xl p-7 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex text-xs bg-[var(--charcoal-light)]/10 text-[var(--charcoal)] px-3 py-1 rounded-full font-medium mb-3">
                  Coming soon
                </span>

                <h2 className="text-2xl font-display text-[var(--espresso)] mb-2">
                  Adult Nursing Bundle
                </h2>

                <p className="text-sm text-[var(--charcoal)] leading-relaxed">
                  Adult nursing content is in development, including topics like
                  NEWS2, sepsis, wound care, adult OSCE stations, and more.
                </p>
              </div>

              <div className="md:text-right">
                <div className="text-3xl font-display text-[var(--espresso)]">
                  £9.99
                </div>
                <p className="text-xs text-[var(--charcoal-light)]">planned one-time price</p>
              </div>
            </div>

            <div className="mt-5">
              {adultSubmitted ? (
                <p className="text-sm text-[var(--espresso)] font-medium">
                  Got it — we&apos;ll email you when it&apos;s ready.
                </p>
              ) : (
                <form onSubmit={handleAdultWaitlist} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={adultEmail}
                      onChange={(e) => setAdultEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--linen-deep)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 text-sm rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-secondary py-2.5 px-5 text-sm flex-shrink-0"
                  >
                    Notify me
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-[var(--linen-deep)] rounded-2xl p-7 md:p-8 mb-12">
            <h2 className="text-xl md:text-2xl font-display text-[var(--espresso)] mb-6">
              Questions
            </h2>

            <div className="space-y-5">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-[var(--linen-deep)] last:border-0 pb-5 last:pb-0"
                >
                  <h3 className="font-medium text-[var(--espresso)] mb-1.5">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-[var(--charcoal)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {!isPro && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-display text-[var(--espresso)] mb-3">
                Ready to get started?
              </h2>
              <p className="text-[var(--charcoal)] mb-5">
                Get instant access to your OSCE practice, nursing quiz, and revision
                support.
              </p>
              <button
                onClick={() => handlePurchase('bundle')}
                disabled={loading !== null}
                className="btn-primary px-8 py-3.5"
              >
                {loading === 'bundle' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Get Children&apos;s Bundle — £9.99</>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
