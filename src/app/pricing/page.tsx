'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { motion, AnimatePresence, type Easing } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, BookOpen, ClipboardCheck, Loader2, Mail, ArrowRight, Crown, Gift, Zap, Shield, Star, Users, X, Info } from 'lucide-react';
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

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as Easing }
  }
};

export default function PricingPage() {
  
  const { isSignedIn } = useUser();
  const { hasOsce, hasQuiz, hasBundle, isPro, isLoading: accessLoading } = useEntitlements();
  
  const [loading, setLoading] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [showGuestTip, setShowGuestTip] = useState(true);

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

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--pink-soft)]/30 to-cream relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--lavender)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[var(--pink)]/15 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 border border-[var(--lilac-medium)]/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-amber-500" />
              </motion.div>
              <span className="text-sm font-medium text-[var(--plum)]">One-time payment • Lifetime access • No subscriptions</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display text-[var(--plum-dark)] mb-5"
            >
              Invest in Your{' '}
              <span className="gradient-text">Future Career</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[var(--plum)] text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
              Built by nursing students, for nursing students. Your all-in-one revision companion. 
              Pay once, access forever.
            </motion.p>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--plum-dark)]/70"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['👩‍⚕️', '👨‍⚕️', '👩‍⚕️', '👨‍⚕️'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[var(--lilac)] flex items-center justify-center border-2 border-white text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span>Trusted by nursing students</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">Made with 💜</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Guest checkout tip - dismissible */}
          <AnimatePresence>
            {!isSignedIn && showGuestTip && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 -mt-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Pro tip:</span> Create a free account first for instant access after purchase. 
                      Or checkout as a guest — you can claim your purchase later by signing up with the same email!
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowGuestTip(false)}
                    className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                    aria-label="Dismiss tip"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bundle Card - Featured */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mb-12"
          >
            {/* Animated glow background */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-[var(--lavender)] via-[var(--pink)] to-[var(--lavender)] rounded-3xl blur-md"
              animate={{ 
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.01, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div 
              className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[var(--lavender)] via-[var(--pink)] to-[var(--lavender)]" />
              
              {/* Best value badge */}
              <motion.div 
                className="absolute top-6 right-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  BEST VALUE — SAVE £5
                </span>
              </motion.div>

              <div className="p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Left - Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        variants={floatingVariants}
                        animate="animate"
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center shadow-lg"
                      >
                        <Gift className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-display text-[var(--plum-dark)]">Complete Bundle</h2>
                        <p className="text-[var(--plum-dark)]/60">Everything you need to succeed</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                      {[
                        { text: 'Full Revision Hub access', highlight: true },
                        { text: 'Children\'s OSCE Tool (50+ stations)', highlight: true },
                        { text: 'Core Nursing Quiz (17 topics)', highlight: true },
                        { text: 'All future tools & updates', highlight: false },
                        { text: 'Progress tracking dashboard', highlight: false },
                        { text: 'Lifetime access guarantee', highlight: false },
                      ].map((feature) => (
                        <div key={feature.text} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feature.highlight 
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' 
                              : 'bg-emerald-100'
                          }`}>
                            <Check className={`w-3.5 h-3.5 ${feature.highlight ? 'text-white' : 'text-emerald-600'}`} />
                          </div>
                          <span className={`text-sm ${feature.highlight ? 'font-medium text-[var(--plum-dark)]' : 'text-[var(--plum-dark)]/70'}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Testimonial snippet */}
                    <div className="bg-[var(--lilac-soft)]/50 rounded-xl p-4 border border-[var(--lilac-medium)]/30">
                      <p className="text-sm text-[var(--plum-dark)]/80 italic">
                        &quot;Genuinely wish I had this from year 1. The OSCE tool alone saved me hours of stress before my placement!&quot;
                      </p>
                      <p className="text-xs text-[var(--plum-dark)]/50 mt-2">— Year 3 Child Nursing Student</p>
                    </div>
                  </div>

                  {/* Right - Price & CTA */}
                  <div className="lg:w-72 lg:border-l lg:border-[var(--lilac-medium)]/30 lg:pl-8">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                        <span className="text-[var(--plum-dark)]/40 line-through text-xl">£14.99</span>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">33% OFF</span>
                      </div>
                      <div className="text-5xl md:text-6xl font-display text-[var(--plum-dark)] mb-1">£9.99</div>
                      <p className="text-sm text-[var(--plum-dark)]/60 mb-6">one-time payment • forever yours</p>

                      {showEmailInput === 'bundle' && !isSignedIn ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/40" />
                            <input
                              type="email"
                              placeholder="Your email address"
                              value={guestEmail}
                              onChange={(e) => { setGuestEmail(e.target.value); setEmailError(''); }}
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-[var(--lilac-medium)] bg-white focus:border-[var(--lavender)] focus:outline-none text-sm"
                            />
                          </div>
                          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                          <button onClick={() => handleGuestCheckout('bundle')} disabled={loading !== null} className="btn-primary w-full py-4 text-base">
                            {loading === 'bundle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Get Complete Bundle</>}
                          </button>
                          <button 
                            onClick={() => setShowEmailInput(null)} 
                            className="text-sm text-[var(--plum-dark)]/50 hover:text-[var(--plum)] w-full"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} className="btn-primary w-full py-4 text-base shadow-lg shadow-[var(--lavender)]/30">
                            {loading === 'bundle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Get Complete Bundle</>}
                          </button>
                          <p className="text-xs text-center text-[var(--plum-dark)]/50">
                            <Shield className="w-3 h-3 inline mr-1" />
                            7-day money-back guarantee
                          </p>
                        </div>
                      )}
                    </div>
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
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--lilac-medium)] to-transparent" />
            <span className="text-sm text-[var(--plum-dark)]/50 font-medium bg-cream px-4">Or choose individually</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--lilac-medium)] to-transparent" />
          </motion.div>

          {/* Individual Products */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {/* OSCE Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                hasOsce ? 'border-emerald-300 bg-emerald-50/30' : 'border-[var(--lilac-medium)]/50 hover:border-[var(--lavender)]'
              }`}
            >
              {hasOsce && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Owned
                  </span>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lilac)] to-[var(--lavender)] flex items-center justify-center shadow-md">
                    <ClipboardCheck className="w-7 h-7 text-[var(--purple)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-[var(--plum-dark)]">Children&apos;s OSCE Tool</h3>
                    {!hasOsce && <span className="text-[var(--purple)] font-bold text-lg">£4.99</span>}
                  </div>
                </div>
                
                <p className="text-[var(--plum-dark)]/70 mb-6">
                  Walk into your placement OSCE feeling prepared with 50+ practice stations covering paediatric nursing scenarios.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    '50+ OSCE practice stations',
                    'Detailed marking checklists', 
                    'Timer & realistic exam mode',
                    'Track your progress'
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                    </div>
                  ))}
                </div>

                {hasOsce ? (
                  <Link href="/osce" className="btn-secondary w-full justify-center py-3">
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
                    <button onClick={() => handleGuestCheckout('osce')} disabled={loading !== null} className="btn-secondary w-full py-3">
                      {loading === 'osce' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Continue to Checkout</>}
                    </button>
                    <button onClick={() => setShowEmailInput(null)} className="text-sm text-[var(--plum-dark)]/50 hover:text-[var(--plum)] w-full">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handlePurchase('osce')} disabled={loading !== null} className="btn-secondary w-full py-3">
                    {loading === 'osce' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Get OSCE Tool — £4.99</>}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Quiz Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                hasQuiz ? 'border-emerald-300 bg-emerald-50/30' : 'border-[var(--lilac-medium)]/50 hover:border-[var(--lavender)]'
              }`}
            >
              {hasQuiz && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Owned
                  </span>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pink-soft)] to-[var(--pink)] flex items-center justify-center shadow-md">
                    <BookOpen className="w-7 h-7 text-[var(--plum)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-[var(--plum-dark)]">Core Nursing Quiz</h3>
                    {!hasQuiz && <span className="text-[var(--purple)] font-bold text-lg">£4.99</span>}
                  </div>
                </div>
                
                <p className="text-[var(--plum-dark)]/70 mb-6">
                  Test and reinforce your nursing knowledge with 17 comprehensive topic areas and instant feedback.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    '17 topic categories',
                    'Instant feedback & explanations',
                    'Learn from mistakes',
                    'Mobile-friendly design'
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                    </div>
                  ))}
                </div>

                {hasQuiz ? (
                  <Link href="/quiz" className="btn-secondary w-full justify-center py-3">
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
                    <button onClick={() => handleGuestCheckout('quiz')} disabled={loading !== null} className="btn-secondary w-full py-3">
                      {loading === 'quiz' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Continue to Checkout</>}
                    </button>
                    <button onClick={() => setShowEmailInput(null)} className="text-sm text-[var(--plum-dark)]/50 hover:text-[var(--plum)] w-full">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handlePurchase('quiz')} disabled={loading !== null} className="btn-secondary w-full py-3">
                    {loading === 'quiz' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Get Quiz Tool — £4.99</>}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Trust signals */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { icon: '🔒', label: 'Secure Checkout', desc: 'Powered by Stripe' },
              { icon: '⚡', label: 'Instant Access', desc: 'Start learning now' },
              { icon: '💜', label: '7-Day Refund', desc: 'No questions asked' },
              { icon: '♾️', label: 'Lifetime Access', desc: 'Including all updates' },
            ].map((item) => (
              <motion.div 
                key={item.label} 
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                className="text-center p-5 rounded-2xl bg-white border border-[var(--lilac-medium)]/30 shadow-sm"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold text-sm text-[var(--plum-dark)] mb-1">{item.label}</div>
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
            className="bg-gradient-to-br from-[var(--lilac-soft)] to-[var(--pink-soft)]/30 dark:from-[var(--bg-card)] dark:to-[var(--bg-secondary)] rounded-3xl p-8 md:p-10 border border-[var(--lilac-medium)]/20 dark:border-[var(--border-color)]"
          >
            <h2 className="text-2xl font-display text-[var(--plum-dark)] dark:text-white text-center mb-8">Frequently Asked Questions</h2>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-5"
            >
              {[
                { q: 'Is this a subscription?', a: 'Nope! One-time payment for lifetime access. No recurring charges, ever. You pay once and it\'s yours forever.' },
                { q: 'Do I need to create an account?', a: 'Not required! You can checkout as a guest with just your email. Create an account later to sync your progress across devices.' },
                { q: 'What payment methods do you accept?', a: 'All major credit/debit cards via Stripe, plus Apple Pay and Google Pay for quick checkout.' },
                { q: 'What if it\'s not for me?', a: 'Full refund within 7 days, no questions asked. Just email us and we\'ll sort it out.' },
                { q: 'Will there be more content added?', a: 'Yes! We\'re constantly adding new resources. All future updates are included free with your purchase.' },
                { q: 'Can I use this on my phone?', a: 'Absolutely! Everything is mobile-friendly so you can study on the go, on placement, or anywhere.' },
              ].map((faq, i) => (
                <motion.div 
                  key={i} 
                  variants={cardVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[var(--bg-card)] backdrop-blur-sm border border-white dark:border-[var(--border-color)]"
                >
                  <h4 className="font-semibold text-[var(--plum)] dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-sm text-[var(--plum-dark)]/70 dark:text-white leading-relaxed">{faq.a}</p>
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
              className="text-center mt-12"
            >
              <p className="text-[var(--plum-dark)]/60 mb-4">Want to try before you buy?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/osce" className="btn-secondary text-sm px-6">
                  🩺 Try OSCE Preview (3 min)
                </Link>
                <Link href="/quiz" className="btn-secondary text-sm px-6">
                  📚 Try Quiz Preview (3 min)
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
              <div className="bg-white rounded-2xl border border-[var(--lilac-medium)]/30 p-8 text-center max-w-md mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[var(--lilac-soft)] flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-[var(--purple)]" />
                </div>
                <h3 className="text-lg font-display text-[var(--plum)] mb-2">Already have an account?</h3>
                <p className="text-sm text-[var(--plum-dark)]/70 mb-6">
                  Sign in to access your purchased content or create a free account to track your progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/sign-in" className="btn-secondary text-sm px-6 py-2.5">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="btn-primary text-sm px-6 py-2.5">
                    <Sparkles className="w-4 h-4" />
                    Create Free Account
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
