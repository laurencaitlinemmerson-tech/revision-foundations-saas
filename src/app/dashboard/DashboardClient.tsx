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

export default function DashboardClient({
  children,
  firstName,
  hasOsce,
  hasQuiz,
  hasMocks,
}: DashboardClientProps) {
  const shouldReduceMotion = useReducedMotion();
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
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  const railLinks = [
    { href: '#todays-plan', label: 'Today', note: 'See the day at a glance' },
    { href: '#revision-week', label: 'Week', note: 'Plan your revision week' },
    { href: '#search', label: 'Search', note: 'Find a guide quickly' },
    { href: '#saved-folders', label: 'Library', note: 'Revisit saved material' },
  ];

  const quickLinks = [
    { href: '/hub', label: 'Hub', available: true },
    { href: hasMocks ? '/hub/mocks' : '/pricing', label: 'Mocks', available: hasMocks },
    { href: hasQuiz ? '/quiz' : '/pricing', label: 'Quiz', available: hasQuiz },
    { href: hasOsce ? '/osce' : '/pricing', label: 'OSCE', available: hasOsce },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <section className="border-b border-[rgba(26,24,21,0.08)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1120px] px-6 pb-10 pt-[52px] md:px-10 md:pb-12">
          <motion.div
            {...motionProps}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start"
          >
            {/* ── Left: greeting + quick links ── */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48 font-medium"
                >
                  {formatToday()}
                </motion.p>
                {placementDays !== null && (
                  <>
                    <div className="w-[0.5px] h-3 bg-[var(--charcoal)]/12" />
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
                      className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/60 font-medium"
                    >
                      {placementDays} {placementDays === 1 ? 'day' : 'days'} to placement
                    </motion.p>
                  </>
                )}
              </div>

              <h1 className="font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.01em] text-[var(--espresso)]">
                {title}
              </h1>
              <p className="mt-5 max-w-[48ch] text-[15px] font-light leading-8 text-[var(--charcoal)]/80">
                Your revision desk. Pick up exactly where you left off, check your weak spots, and start practice without the set-up.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {quickLinks.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    key={item.label}
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
                        <span className="text-[10px] opacity-40 transition-all duration-200 group-hover/ql:opacity-100 group-hover/ql:translate-x-0.5">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border border-[var(--linen-deep)] bg-white lg:mt-1"
            >
              {railLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group/rail flex items-center justify-between gap-4 px-5 py-[14px] transition-all duration-200 hover:bg-[var(--linen-light)]/50 hover:pl-6 ${
                    index < railLinks.length - 1 ? 'border-b border-[var(--linen-light)]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--charcoal)]/40 transition-colors duration-200 group-hover/rail:text-[var(--charcoal)]/70">
                      {link.label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-light leading-snug text-[var(--espresso)] transition-colors duration-200">
                      {link.note}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[13px] text-[var(--charcoal)]/20 transition-all duration-200 group-hover/rail:text-[var(--espresso)] group-hover/rail:translate-x-0.5">
                    →
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
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
