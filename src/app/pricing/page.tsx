'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, BookOpen, ClipboardCheck, Loader2, Mail, ArrowRight, Crown, Gift, Zap } from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function PricingPage() {
  
  const { isSignedIn } = useUser();
  const { hasOsce, hasQuiz, hasBundle, isPro, isLoading: accessLoading } = useEntitlements();
  
  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

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

  // Already has full access - show simplified page
  if (!accessLoading && hasBundle) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-4">
              You Have Full Access! 🎉
            </h1>
            <p className="text-[var(--plum)] text-lg mb-8">
              You already own the complete bundle with lifetime access to everything.
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

      {/* Access Recommendation Notice */}
      <div className="w-full flex justify-center bg-[var(--lilac-soft)] border-b border-[var(--lilac-medium)] py-3 px-2">
        <div className="max-w-2xl text-center text-[var(--plum-dark)] text-sm flex flex-col gap-1">
          <span className="font-semibold">For instant access:</span> Sign in or create an account before purchasing.<br />
          Or, purchase as a guest and claim access later by signing in with your email.
        </div>
      </div>

      {/* Hero */}
      <section className="pt-28 pb-10 bg-gradient-to-b from-[var(--lilac-soft)] to-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="hero-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Zap className="w-4 h-4 text-[var(--purple)]" />
              </motion.div>
              <span className="text-sm font-medium text-[var(--plum)]">One-time payment • Lifetime access</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hero-title mb-4"
            >
              <span className="gradient-text">Simple, Fair Pricing</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[var(--plum)] text-lg max-w-xl"
            >
              No subscriptions, no hidden fees. Pay once and get lifetime access to your study tools.
            </motion.p>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6 -mt-4">
        <div className="max-w-5xl mx-auto">

          {/* Bundle Card - Featured */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mb-10"
          >
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-[var(--lavender)] via-[var(--pink)] to-[var(--lavender)] rounded-3xl blur-sm opacity-60"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="relative card bg-white border-0 shadow-xl"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg">
                  ✨ BEST VALUE — SAVE £5
                </span>
              </motion.div>

              <div className="pt-8 pb-2">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Left - Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center shadow-lg">
                        <Gift className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl">Full Hub Access</h2>
                        <p className="text-[var(--plum-dark)]/60 text-sm">Everything included forever</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        'Complete Revision Hub access',
                        'Children\'s OSCE Tool (50+ stations)',
                        'Core Nursing Quiz (17 topics)',
                        'All future tools & updates',
                        'Progress tracking',
                        'Lifetime access guarantee',
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-sm text-[var(--plum-dark)]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Price & CTA */}
                  <div className="lg:w-64 text-center lg:text-right">
                    <div className="mb-1">
                      <span className="text-[var(--plum-dark)]/40 line-through text-lg">£14.99</span>
                    </div>
                    <div className="text-5xl font-display text-[var(--plum-dark)] mb-1">£9.99</div>
                    <p className="text-sm text-[var(--plum-dark)]/60 mb-5">one-time • forever yours</p>

                    {showEmailInput === 'bundle' && !isSignedIn ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/40" />
                          <input
                            type="email"
                            placeholder="Your email"
                            value={guestEmail}
                            onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                          />
                        </div>
                        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                        <button onClick={() => handleGuestCheckout('bundle')} disabled={loading !== null} className="btn-primary w-full py-3">
                          {loading === 'bundle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Get Full Access</>}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} className="btn-primary w-full lg:w-auto px-8 py-3 text-base">
                        {loading === 'bundle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Get Full Access</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex-1 h-px bg-[var(--lilac-medium)]" />
            <span className="text-sm text-[var(--plum-dark)]/50 font-medium">Or buy individually</span>
            <div className="flex-1 h-px bg-[var(--lilac-medium)]" />
          </motion.div>

          {/* Individual Products */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            {/* OSCE Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`card relative transition-all ${hasOsce ? 'border-emerald-300 bg-emerald-50/30' : ''}`}
            >
              {hasOsce && (
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Owned
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--lilac)] flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-[var(--purple)]" />
                </div>
                <div>
                  <h3 className="text-xl">Children&apos;s OSCE Tool</h3>
                  {!hasOsce && <span className="text-[var(--purple)] font-semibold">£4.99</span>}
                </div>
              </div>
              
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                Walk into your placement OSCE feeling prepared with 50+ practice stations.
              </p>

              <div className="space-y-2 mb-6">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>

              {hasOsce ? (
                <Link href="/osce" className="btn-secondary w-full justify-center">
                  <ArrowRight className="w-4 h-4" /> Open OSCE Tool
                </Link>
              ) : showEmailInput === 'osce' && !isSignedIn ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/40" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('osce')} disabled={loading !== null} className="btn-secondary w-full">
                    {loading === 'osce' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><ClipboardCheck className="w-5 h-5" /> Continue</>}
                  </button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('osce')} disabled={loading !== null} className="btn-secondary w-full">
                  {loading === 'osce' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Get OSCE Tool — £4.99</>}
                </button>
              )}
            </motion.div>

            {/* Quiz Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`card relative transition-all ${hasQuiz ? 'border-emerald-300 bg-emerald-50/30' : ''}`}
            >
              {hasQuiz && (
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Owned
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--lilac)] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[var(--purple)]" />
                </div>
                <div>
                  <h3 className="text-xl">Core Nursing Quiz</h3>
                  {!hasQuiz && <span className="text-[var(--purple)] font-semibold">£4.99</span>}
                </div>
              </div>
              
              <p className="text-[var(--plum-dark)]/70 text-sm mb-5">
                17 topic areas covering the theory you need to know for exams.
              </p>

              <div className="space-y-2 mb-6">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>

              {hasQuiz ? (
                <Link href="/quiz" className="btn-secondary w-full justify-center">
                  <ArrowRight className="w-4 h-4" /> Open Quiz Tool
                </Link>
              ) : showEmailInput === 'quiz' && !isSignedIn ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/40" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  <button onClick={() => handleGuestCheckout('quiz')} disabled={loading !== null} className="btn-secondary w-full">
                    {loading === 'quiz' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><BookOpen className="w-5 h-5" /> Continue</>}
                  </button>
                </div>
              ) : (
                <button onClick={() => handlePurchase('quiz')} disabled={loading !== null} className="btn-secondary w-full">
                  {loading === 'quiz' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Get Quiz Tool — £4.99</>}
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Trust signals */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: '🔒', label: 'Secure checkout', desc: 'Powered by Stripe' },
              { icon: '⚡', label: 'Instant access', desc: 'Start learning now' },
              { icon: '💜', label: '7-day refund', desc: 'No questions asked' },
              { icon: '♾️', label: 'Lifetime access', desc: 'Includes all updates' },
            ].map((item) => (
              <motion.div 
                key={item.label} 
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm text-[var(--plum-dark)]">{item.label}</div>
                <div className="text-xs text-[var(--plum-dark)]/60">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card bg-[var(--lilac-soft)] border-0"
          >
            <h2 className="text-xl text-center mb-6">Common Questions</h2>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-4"
            >
              {[
                { q: 'Is this a subscription?', a: 'No! One-time payment, lifetime access. No recurring charges ever.' },
                { q: 'Do I need an account?', a: 'Nope! Just enter your email at checkout for guest access.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe — Apple Pay & Google Pay too!' },
                { q: 'Can I get a refund?', a: 'Yes! Full refund within 7 days, no questions asked.' },
              ].map((faq, i) => (
                <motion.div 
                  key={i} 
                  variants={cardVariants}
                  className="p-4 rounded-xl bg-white/80"
                >
                  <h4 className="font-semibold text-[var(--plum)] text-sm mb-1">{faq.q}</h4>
                  <p className="text-sm text-[var(--plum-dark)]/70">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Try free preview - only show for non-owners */}
          {!isPro && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <p className="text-[var(--plum-dark)]/60 text-sm mb-4">Want to try before you buy?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/osce" className="btn-secondary text-sm">
                  Try OSCE Preview
                </Link>
                <Link href="/quiz" className="btn-secondary text-sm">
                  Try Quiz Preview
                </Link>
              </div>
            </motion.div>
          )}

          {/* Sign up options for non-signed in users */}
          {!isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="card bg-[var(--lilac-soft)] border-0 text-center max-w-lg mx-auto">
                <h3 className="text-lg text-[var(--plum)] mb-3">Already have an account?</h3>
                <p className="text-sm text-[var(--plum-dark)]/70 mb-5">
                  Sign in to access your purchased content, or create an account to track your progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/sign-in" className="btn-secondary text-sm px-6 py-2.5">
                    <Mail className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="btn-primary text-sm px-6 py-2.5">
                    <Sparkles className="w-4 h-4" />
                    Create Account
                  </Link>
                </div>
                <p className="text-xs text-[var(--plum-dark)]/50 mt-4">
                  Or checkout as a guest using just your email above
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
