 'use client';

import { ReactNode, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants, useReducedMotion } from 'framer-motion';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string;
  hasAnyTool?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

function formatToday() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

export default function DashboardClient({
  children,
  firstName,
  hasAnyTool = false,
}: DashboardClientProps) {
  useScrollAnimation();

  const shouldReduceMotion = useReducedMotion();
  const hour = new Date().getHours();

  const greeting = useMemo(() => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [hour]);

  const subcopy = useMemo(() => {
    if (hour < 12) return 'A fresh start. Let’s make today’s revision count.';
    if (hour < 18) return 'Perfect time for a focused study session.';
    return 'Wind down with a calm, productive revision block.';
  }, [hour]);

  const today = useMemo(() => formatToday(), []);

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden' as const,
        animate: 'visible' as const,
        variants: containerVariants,
      };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section
        className="
          relative overflow-hidden
          pt-14 md:pt-16
          pb-10 md:pb-12
          bg-[var(--linen-light)]
          border-b border-[var(--linen-deep)]
        "
      >
        {/* background texture / wash */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/25 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pt-8 md:pt-12"
            {...motionProps}
          >
            <motion.div variants={itemVariants} className="min-w-0 max-w-2xl">
              <div
                className="inline-flex items-center gap-2 bg-white border border-[var(--linen-deep)] px-3 py-1.5 mb-4"
                style={{ borderRadius: '999px' }}
              >
                <CalendarDays className="w-4 h-4 text-[var(--espresso)]" />
                <span className="text-sm text-[var(--espresso)]">{today}</span>
              </div>

              <h1 className="font-display text-3xl md:text-5xl leading-tight text-[var(--espresso)] mb-3">
                {greeting}, {firstName}!
              </h1>

              <p className="text-[var(--charcoal)] text-base md:text-lg font-light mb-3">
                {subcopy}
              </p>

              <p className="text-sm md:text-base text-[var(--charcoal)]/80 font-light max-w-xl">
                {hasAnyTool
                  ? 'Jump back into your tools, keep your streak alive, and build confidence one session at a time.'
                  : 'Explore the platform, try the free preview, and get set up for smarter revision.'}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
            >
              <Link
                href="/hub"
                className="bg-[var(--espresso)] text-white inline-flex items-center justify-center gap-2 group px-5 py-3 text-sm hover:bg-[#3a2010] transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <span>Go to Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/how-to-use"
                className="bg-white border border-[var(--linen-deep)] text-[var(--espresso)] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm hover:border-[var(--linen-medium)] transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <Sparkles className="w-4 h-4" />
                Quick tour
              </Link>
            </motion.div>
          </motion.div>

          {/* Top highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            {...motionProps}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur border border-[var(--linen-deep)] px-4 py-4"
              style={{ borderRadius: '10px' }}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)] mb-1">
                Today’s focus
              </p>
              <p className="font-display text-[var(--espresso)] text-lg">
                Small steps, big progress
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur border border-[var(--linen-deep)] px-4 py-4"
              style={{ borderRadius: '10px' }}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)] mb-1">
                Best approach
              </p>
              <p className="font-display text-[var(--espresso)] text-lg">
                Practice, review, repeat
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur border border-[var(--linen-deep)] px-4 py-4"
              style={{ borderRadius: '10px' }}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)] mb-1">
                Momentum
              </p>
              <p className="font-display text-[var(--espresso)] text-lg">
                Show up for yourself today
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.main className="px-6 pb-12" {...motionProps}>
        <div className="max-w-6xl mx-auto space-y-8 pt-5 md:pt-8">{children}</div>
      </motion.main>

      <Footer />
    </div>
  );
}
