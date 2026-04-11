'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useReducedMotion } from 'framer-motion';
import { getPlacementDate } from '@/lib/dashboardTracking';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
  hasMocks: boolean;
}

function formatToday() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Animation constants ────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

const railContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
};

const railItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function DashboardClient({
  children,
  firstName,
  hasOsce,
  hasQuiz,
  hasMocks,
}: DashboardClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const anim = !shouldReduceMotion;
  const hour = new Date().getHours();
  const [placementDays, setPlacementDays] = useState<number | null>(null);

  useEffect(() => {
    const saved = getPlacementDate();
    if (saved) {
      const d = daysUntil(saved);
      if (d > 0) setPlacementDays(d);
    }
  }, []);

  const greeting = useMemo(() => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [hour]);

  const title = firstName?.trim() ? `${greeting}, ${firstName.trim()}.` : `${greeting}.`;

  // Returns motion props for a simple fade-up, or {} when reduced motion is on
  function fadeUp(delay = 0) {
    if (!anim) return {};
    return {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.5, ease },
    } as const;
  }

  const railLinks = [
    { href: '#todays-plan', label: 'Today',   note: 'See the day at a glance'  },
    { href: '#revision-week', label: 'Week',  note: 'Plan your revision week'  },
    { href: '#search', label: 'Search',       note: 'Find a guide quickly'     },
    { href: '#saved-folders', label: 'Library', note: 'Revisit saved material' },
  ];

  const quickLinks = [
    { href: '/hub',                                label: 'Hub',   available: true      },
    { href: hasMocks ? '/hub/mocks' : '/pricing',  label: 'Mocks', available: hasMocks  },
    { href: hasQuiz  ? '/quiz'      : '/pricing',  label: 'Quiz',  available: hasQuiz   },
    { href: hasOsce  ? '/osce'      : '/pricing',  label: 'OSCE',  available: hasOsce   },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <section className="border-b border-[rgba(26,24,21,0.07)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-[88px] md:px-10 md:pb-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_272px] lg:items-start">

            {/* ── Left: greeting ── */}
            <div>
              {/* Meta line — date + placement days */}
              <motion.div
                {...fadeUp(0)}
                className="mb-4 flex items-center gap-3"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--charcoal)]/40">
                  {formatToday()}
                </p>
                {placementDays !== null && (
                  <>
                    <div className="h-3 w-[0.5px] bg-[var(--charcoal)]/12" />
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--charcoal)]/55">
                      {placementDays} {placementDays === 1 ? 'day' : 'days'} to placement
                    </p>
                  </>
                )}
              </motion.div>

              {/* Greeting heading */}
              <motion.h1
                {...fadeUp(0.08)}
                className="font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.01em] text-[var(--espresso)]"
              >
                {title}
              </motion.h1>

              {/* Supporting copy */}
              <motion.p
                {...fadeUp(0.15)}
                className="mt-5 max-w-[48ch] text-[15px] font-light leading-8 text-[var(--charcoal)]/75"
              >
                Your revision desk. Pick up exactly where you left off, check your weak spots, and start practice without the set-up.
              </motion.p>

              {/* Navigation pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {quickLinks.map((item, i) => (
                  <motion.div
                    key={item.label}
                    {...(anim ? {
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.28 + i * 0.05, duration: 0.38, ease },
                      whileTap: { scale: 0.97 },
                    } : {})}
                  >
                    <Link
                      href={item.href}
                      className={`group/ql inline-flex items-center gap-2 border px-5 py-2.5 text-sm transition-all duration-200 ${
                        item.available
                          ? 'border-[var(--linen-deep)] bg-white text-[var(--espresso)] hover:border-[var(--espresso)] hover:bg-[var(--espresso)] hover:text-white'
                          : 'border-[var(--linen-light)] bg-[var(--linen-light)]/50 text-[var(--charcoal)]/50 hover:border-[var(--linen-deep)] hover:text-[var(--charcoal)]'
                      }`}
                    >
                      <span className="transition-[letter-spacing] duration-200 group-hover/ql:tracking-[0.04em]">
                        {item.label}
                      </span>
                      {!item.available && (
                        <span className="text-[9px] font-medium uppercase tracking-[0.12em] opacity-60">
                          Locked
                        </span>
                      )}
                      {item.available && (
                        <span className="text-[10px] opacity-40 transition-all duration-200 group-hover/ql:translate-x-0.5 group-hover/ql:opacity-100">
                          →
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Right: jump rail ── */}
            <motion.div
              {...(anim ? {
                variants: railContainerVariants,
                initial: 'hidden',
                animate: 'visible',
              } : {})}
              className="border border-[rgba(26,24,21,0.06)] bg-white lg:mt-10"
            >
              {railLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  {...(anim ? {
                    variants: railItemVariants,
                    whileHover: { y: -1 },
                    whileTap: { scale: 0.985 },
                  } : {})}
                  className={
                    index < railLinks.length - 1
                      ? 'border-b border-[rgba(26,24,21,0.05)]'
                      : ''
                  }
                >
                  <Link
                    href={link.href}
                    className="group/rail flex items-center justify-between gap-4 px-5 py-[17px] transition-colors duration-200 hover:bg-[#FAF8F5]"
                  >
                    <div className="min-w-0">
                      <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--charcoal)]/35 transition-colors duration-200 group-hover/rail:text-[var(--charcoal)]/65">
                        {link.label}
                      </p>
                      <p className="mt-1 text-[13px] font-light leading-snug text-[var(--espresso)]/75 transition-colors duration-200 group-hover/rail:text-[var(--espresso)]">
                        {link.note}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-[13px] text-[var(--charcoal)]/15 transition-all duration-200 group-hover/rail:translate-x-1 group-hover/rail:text-[var(--espresso)]">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <main className="pb-20 pt-8 md:pt-10">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
