'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { getPlacementDate } from '@/lib/dashboardTracking';

import InteractiveCommandPalette from '@/components/dashboard/InteractiveCommandPalette';

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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const saved = getPlacementDate();
    if (!saved) return;

    const d = daysUntil(saved);
    if (d <= 0) return;

    const frameId = window.requestAnimationFrame(() => {
      setPlacementDays(d);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const greeting = useMemo(() => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [hour]);

  const trimmedName = firstName?.trim() || null;

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
    <div className="dash-shell min-h-screen">

      <section className="dash-hero">
        <div className="mx-auto max-w-[1120px] px-6 pb-10 pt-[104px] md:px-10 md:pb-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">

            {/* ── Left: greeting ── */}
            <div>
              <motion.div {...fadeUp(0)} className="mb-7 flex flex-wrap items-center gap-2.5">
                <span className="dash-chip">
                  <span className="dash-chip-dot" aria-hidden="true" />
                  {formatToday()}
                </span>
                {placementDays !== null && (
                  <span className="dash-chip dash-chip-gold">
                    {placementDays} {placementDays === 1 ? 'day' : 'days'} to placement
                  </span>
                )}
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-display text-[clamp(2.8rem,5.4vw,4.6rem)] leading-[1.04] tracking-[-0.012em] text-[var(--espresso)]"
              >
                {trimmedName ? (
                  <>{greeting}, <em>{trimmedName}</em>.</>
                ) : (
                  <>{greeting}.</>
                )}
              </motion.h1>

              <svg className="dash-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L1000,30" fill="none" />
              </svg>

              <motion.p
                {...fadeUp(0.15)}
                className="max-w-[50ch] text-[16px] font-light leading-8 text-[var(--charcoal)]/80"
              >
                Your revision desk. Pick up exactly where you left off, check your weak spots, and start practice without the set-up.
              </motion.p>

              <div className="mt-9 flex flex-wrap items-center gap-2.5">
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
                      className={`dash-pill group/ql ${item.available ? '' : 'is-locked'}`}
                    >
                      <span>{item.label}</span>
                      {!item.available ? (
                        <span className="dash-pill-tag">Locked</span>
                      ) : (
                        <span className="dash-pill-arrow">→</span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                <motion.button
                  type="button"
                  onClick={() => setIsCommandPaletteOpen(true)}
                  {...(anim ? {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.48, duration: 0.38, ease },
                    whileTap: { scale: 0.97 },
                  } : {})}
                  className="dash-pill dash-pill-dark"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                  <span>Search</span>
                  <span className="dash-kbd">⌘K</span>
                </motion.button>
              </div>

              <motion.div {...fadeUp(0.2)} className="mt-6">
                <Link href="/onboarding?entry=signup" className="dash-textlink">
                  New here? Use the start-here guide →
                </Link>
              </motion.div>
            </div>

            {/* ── Right: jump rail ── */}
            <motion.div
              variants={railContainerVariants}
              initial="hidden"
              animate="visible"
              className="dash-rail lg:mt-8"
            >
              <p className="dash-rail-title">Jump to</p>
              {railLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  {...(anim ? { variants: railItemVariants } : {})}
                >
                  <Link href={link.href} className="dash-rail-item group/rail">
                    <span className="dash-rail-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1">
                      <span className="dash-rail-name">{link.label}</span>
                      <span className="dash-rail-note">{link.note}</span>
                    </span>
                    <span className="dash-rail-arrow">→</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <main className="pb-24 pt-2 md:pt-4">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          {children}
        </div>
      </main>

      {/* Global Interactive Command Palette */}
      <InteractiveCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
