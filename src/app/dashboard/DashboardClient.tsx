'use client';

import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useReducedMotion } from 'framer-motion';

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

export default function DashboardClient({
  children,
  firstName,
  hasOsce,
  hasQuiz,
  hasMocks,
}: DashboardClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const hour = new Date().getHours();

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
    { href: '#search', label: 'Search', note: 'Open a guide fast' },
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
            className="grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_320px] lg:items-end"
          >
            <div>
              <div className="mb-3 flex items-center gap-3">
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48 font-medium"
                >
                  {formatToday()}
                </motion.p>
                <div className="w-[1px] h-3 bg-[var(--charcoal)]/15" />
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  className="text-[10px] uppercase tracking-[0.16em] text-[var(--espresso)] font-medium bg-[var(--linen-light)] px-2 py-0.5"
                >
                  🗓 32 Days to Core OSCEs
                </motion.p>
              </div>
              <h1 className="font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.01em] text-[var(--espresso)]">
                {title}
              </h1>
              <p className="mt-5 max-w-[48ch] text-[15px] font-light leading-8 text-[var(--charcoal)]/80">
                Your revision desk. Pick up exactly where you left off, check your weak spots, and start practice without repeating the baseline set up.
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
                      className={`inline-flex items-center gap-2 border px-5 py-2.5 text-sm transition-all ${
                      item.available
                        ? 'border-[var(--linen-deep)] bg-white text-[var(--espresso)] hover:border-[var(--linen-medium)] hover:shadow-sm'
                        : 'border-transparent bg-[rgba(245,243,240,0.6)] text-[var(--charcoal)]/60 hover:bg-[rgba(245,243,240,0.9)]'
                    }`}
                  >
                    {item.label}
                    {!item.available ? <span className="text-[9px] font-medium uppercase tracking-[0.12em] opacity-80">Locked</span> : null}
                    {item.available ? <span className="text-[10px] opacity-40 ml-1">→</span> : null}
                  </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border border-[var(--linen-deep)] bg-white shadow-[0_14px_28px_rgba(26,24,21,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--teal-50)] opacity-40 rounded-full blur-3xl" />
              {railLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group flex items-start justify-between gap-4 px-6 py-5 transition-colors hover:bg-[var(--bg-secondary)] relative z-10 ${
                    index < railLinks.length - 1 ? 'border-b border-[var(--linen-light)]' : ''
                  }`}
                >
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--charcoal)]/50">
                      {link.label}
                    </p>
                    <p className="mt-1 text-sm font-light leading-6 text-[var(--espresso)]">
                      {link.note}
                    </p>
                  </div>
                  <span className="mt-1 text-sm text-[var(--charcoal)]/30 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
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
