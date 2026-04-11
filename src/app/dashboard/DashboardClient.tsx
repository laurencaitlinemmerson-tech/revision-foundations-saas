'use client';

import { ReactNode, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import PinnedNote from '@/components/dashboard/PinnedNote';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const serif   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink     = '#1A1815';
const mid     = '#5A5750';
const muted   = '#9C8878';
const border  = 'rgba(0,0,0,0.08)';

// ── Motion ─────────────────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function formatToday() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());
}

export default function DashboardClient({
  children,
  firstName,
  hasOsce,
  hasQuiz,
}: DashboardClientProps) {
  useScrollAnimation();
  const shouldReduceMotion = useReducedMotion();
  const hour = new Date().getHours();

  const greeting = useMemo(() => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [hour]);

  const today       = useMemo(() => formatToday(), []);
  const headingName = firstName?.trim();

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const, variants: containerVariants };

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero shell ── */}
      <section style={{ borderBottom: `0.5px solid ${border}`, background: '#FAFAF8' }}>
        <div className="dash-wrap" style={{ paddingTop: '52px', paddingBottom: '48px' }}>
          <motion.div {...motionProps}>
            <motion.div variants={itemVariants}>

              <p style={{
                fontFamily: serif, fontSize: '10px', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: muted, marginBottom: '16px',
              }}>
                {today}
              </p>

              <h1 style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: ink,
                marginBottom: '8px',
              }}>
                {headingName ? `${greeting}, ${headingName}.` : `${greeting}.`}
              </h1>

              <p style={{
                fontFamily: serif, fontSize: '12px', color: '#B4A89C',
                fontWeight: 300, lineHeight: 1.7, marginBottom: '36px',
              }}>
                Pick up where you left off, or start something small.
              </p>

              {/* ── Tier 1: Primary CTA ── */}
              <div className="dash-primary-card">
                <div>
                  <p className="dash-eyebrow">Now · continue where you left off</p>
                  <p style={{
                    fontFamily: display, fontSize: '1.4rem', fontWeight: 400,
                    color: ink, marginBottom: '6px', lineHeight: 1.15,
                  }}>
                    Open the Hub
                  </p>
                  <p style={{
                    fontFamily: serif, fontSize: '12px', color: mid,
                    fontWeight: 300, lineHeight: 1.65, maxWidth: '46ch',
                  }}>
                    Guides, glossaries, and saved folders — your main revision base.
                  </p>
                </div>
                <Link href="/hub" className="dash-primary-btn">
                  Continue →
                </Link>
              </div>

              {/* ── Tier 2: Secondary cards ── */}
              <div className="dash-sec-row">
                <Link
                  href={hasOsce ? '/osce' : '/pricing'}
                  className="dash-sec-card dash-sec-osce"
                >
                  <span className="dash-sec-arr">→</span>
                  <p className="dash-eyebrow">OSCE practice</p>
                  <p className="dash-sec-title">
                    {hasOsce ? 'Run a timed station' : 'Try the free preview'}
                  </p>
                  <p className="dash-sec-sub">
                    {hasOsce
                      ? 'Pick a station and practise under exam conditions.'
                      : 'One free station — no commitment needed.'}
                  </p>
                </Link>

                <Link
                  href={hasQuiz ? '/quiz' : '/pricing'}
                  className="dash-sec-card dash-sec-quiz"
                >
                  <span className="dash-sec-arr">→</span>
                  <p className="dash-eyebrow">Quiz · weak areas</p>
                  <p className="dash-sec-title">
                    {hasQuiz ? 'Spot-check weak topics' : 'Add the quiz'}
                  </p>
                  <p className="dash-sec-sub">
                    {hasQuiz
                      ? '10 questions, under 8 minutes.'
                      : 'Short sets and weak-area spotting.'}
                  </p>
                </Link>
              </div>

              <div style={{ marginTop: '20px' }}>
                <PinnedNote compact />
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      <main>
        <div className="dash-wrap" style={{ paddingBottom: '80px' }}>
          {children}
        </div>
      </main>

      <Footer />

      <style>{`
        .dash-wrap {
          max-width: 1060px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }
        .dash-eyebrow {
          font-family: ${serif};
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${muted};
          margin-bottom: 9px;
        }
        .dash-primary-card {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.09);
          border-left: 3px solid #8BBCAA;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .dash-primary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
        }
        .dash-primary-btn {
          background: #1A1815;
          color: #FAFAF8;
          font-family: ${serif};
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 10px 22px;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          transition: opacity 150ms;
        }
        .dash-primary-btn:hover { opacity: 0.85; }
        .dash-sec-row {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .dash-sec-card {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.07);
          border-left: 3px solid transparent;
          padding: 20px 22px;
          text-decoration: none;
          display: block;
          position: relative;
          transition: all 170ms ease;
        }
        .dash-sec-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }
        .dash-sec-osce { border-left-color: #8BBCAA; }
        .dash-sec-quiz { border-left-color: #C89BB0; }
        .dash-sec-arr {
          position: absolute; right: 18px; top: 20px;
          font-size: 13px; color: #D4C4B8;
          transition: transform 160ms;
        }
        .dash-sec-card:hover .dash-sec-arr { transform: translateX(3px); }
        .dash-sec-title {
          font-family: ${serif};
          font-size: 13px; font-weight: 500; color: ${ink}; margin-bottom: 4px;
        }
        .dash-sec-sub {
          font-family: ${serif};
          font-size: 11px; color: ${mid}; font-weight: 300;
          line-height: 1.6; padding-right: 20px;
        }
        @media (max-width: 860px) {
          .dash-wrap { padding-left: 24px; padding-right: 24px; }
          .dash-sec-row { grid-template-columns: 1fr; }
          .dash-primary-card { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .dash-wrap { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>
    </div>
  );
}
