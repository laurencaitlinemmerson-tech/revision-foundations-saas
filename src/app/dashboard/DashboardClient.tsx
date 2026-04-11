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
    { href: '#continue', label: 'Continue', note: 'Return to the active thread' },
    { href: '#today-block', label: 'Today', note: 'See the day at a glance' },
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
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/48">
                {formatToday()}
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.02] tracking-[-0.02em] text-[var(--espresso)]">
                {title}
              </h1>
              <p className="mt-4 max-w-[44ch] text-[15px] leading-8 text-[var(--charcoal)]/72">
                A calmer revision desk built around continuation, planning, and quick re-entry into the pages and tools you actually use.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors ${
                      item.available
                        ? 'border-[rgba(26,24,21,0.08)] bg-white text-[var(--espresso)] hover:border-[rgba(26,24,21,0.16)]'
                        : 'border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.9)] text-[var(--charcoal)]/72 hover:border-[rgba(26,24,21,0.16)]'
                    }`}
                  >
                    {item.label}
                    {!item.available ? <span className="text-[10px] uppercase tracking-[0.12em]">Locked</span> : null}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-[rgba(26,24,21,0.08)] bg-white">
              {railLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-[rgba(245,243,240,0.6)] ${
                    index < railLinks.length - 1 ? 'border-b border-[rgba(26,24,21,0.08)]' : ''
                  }`}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--charcoal)]/40">
                      {link.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--espresso)]">
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
