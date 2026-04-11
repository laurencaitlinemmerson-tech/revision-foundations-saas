'use client';

import { ReactNode, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PinnedNote from '@/components/dashboard/PinnedNote';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const serif     = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display   = "'Playfair Display', Georgia, serif";
const ink       = '#1A1815';
const body      = '#2C2A27';
const mid       = '#5A5750';
const muted     = '#9C8878';
const borderMid = 'rgba(0,0,0,0.10)';

// ── Motion ────────────────────────────────────────────────────────────────────
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

  const accessCards = useMemo(
    () => [
      {
        href: '/hub',
        label: 'Hub',
        status: 'Ready',
        statusColor: 'var(--sage-600)',
        statusBg: 'var(--sage-50)',
        description: 'Guides, glossaries, and saved folders.',
      },
      {
        href: '/hub/mocks',
        label: 'Mocks',
        status: 'Ready',
        statusColor: 'var(--sage-600)',
        statusBg: 'var(--sage-50)',
        description: 'Exam-style scenarios with guided support.',
      },
      {
        href: '/osce',
        label: 'OSCE',
        status: hasOsce ? 'Unlocked' : 'Preview',
        statusColor: hasOsce ? 'var(--teal-600)' : 'var(--amber-600)',
        statusBg: hasOsce ? 'var(--teal-50)' : 'var(--amber-50)',
        description: hasOsce
          ? 'Timed spoken stations for exam practice.'
          : 'Try the free station preview.',
      },
      {
        href: hasQuiz ? '/quiz' : '/pricing',
        label: 'Quiz',
        status: hasQuiz ? 'Unlocked' : 'Locked',
        statusColor: hasQuiz ? 'var(--blue-600)' : muted,
        statusBg: hasQuiz ? 'var(--blue-50)' : '#F0EFED',
        description: hasQuiz
          ? 'Short sets and weak-area spotting.'
          : 'Add the quiz for tighter practice.',
      },
    ],
    [hasOsce, hasQuiz],
  );

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: 'hidden' as const, animate: 'visible' as const, variants: containerVariants };

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <Navbar />

      <section className="dash-hero-shell">
        <div className="dash-wrap" style={{ padding: '48px 0 44px' }}>
          <motion.div {...motionProps}>
            <div className="dash-hero-grid">
              {/* ── Left: greeting ── */}
              <motion.div variants={itemVariants}>
                <p style={{
                  fontFamily: serif, fontSize: '10px', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: muted, marginBottom: '16px',
                }}>
                  {today}
                </p>

                <h1 style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '14px',
                  maxWidth: '14ch',
                }}>
                  {headingName ? `${greeting}, ${headingName}.` : `${greeting}.`}
                </h1>

                <p style={{
                  fontFamily: serif, fontSize: '14px', color: mid,
                  fontWeight: 300, lineHeight: 1.7, maxWidth: '36rem',
                  marginBottom: '28px',
                }}>
                  Pick up where you left off, or start something small.
                </p>

                <div className="dash-hero-actions">
                  <Link
                    href="/hub"
                    className="dash-primary-link"
                    style={{
                      fontFamily: serif, fontSize: '13px', color: '#FAFAF8',
                      background: 'linear-gradient(135deg, #2C2A27 0%, #4A3728 100%)',
                      padding: '12px 24px', textDecoration: 'none',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    Open the hub
                  </Link>
                  <Link
                    href={hasOsce ? '/osce' : hasQuiz ? '/quiz' : '/pricing'}
                    className="dash-secondary-link"
                    style={{
                      fontFamily: serif, fontSize: '13px', color: body,
                      textDecoration: 'underline', textUnderlineOffset: '4px',
                    }}
                  >
                    {hasOsce ? 'Run a station' : hasQuiz ? 'Open quiz' : 'See the bundle'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* ── Right: side panel ── */}
              <motion.aside variants={itemVariants} className="dash-hero-panel">
                <div className="dash-access-grid">
                  {accessCards.map(({ href, label, status, statusColor, statusBg, description }) => (
                    <Link key={label} href={href} className="dash-access-card">
                      <div className="dash-access-row">
                        <p className="dash-access-label">{label}</p>
                        <span
                          style={{
                            fontFamily: serif, fontSize: '9px', letterSpacing: '0.14em',
                            textTransform: 'uppercase', color: statusColor,
                            background: statusBg, padding: '3px 8px',
                          }}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="dash-access-copy">{description}</p>
                    </Link>
                  ))}
                </div>

                <div className="dash-pinned-wrap">
                  <PinnedNote compact />
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </div>
      </section>

      <main>
        <div className="dash-wrap" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          {children}
        </div>
      </main>

      <Footer />

      <style>{`
        .dash-hero-shell {
          position: relative;
          overflow: hidden;
          border-bottom: 0.5px solid ${borderMid};
          background:
            linear-gradient(135deg, rgba(228,242,236,0.3) 0%, rgba(255,255,255,0.92) 35%, rgba(234,241,250,0.25) 70%, rgba(250,238,218,0.2) 100%);
        }

        .dash-hero-shell::before {
          content: '';
          position: absolute;
          width: 480px;
          height: 480px;
          left: -150px;
          bottom: -200px;
          background: radial-gradient(circle, rgba(139,188,170,0.25) 0%, rgba(139,188,170,0) 70%);
          pointer-events: none;
        }

        .dash-hero-shell::after {
          content: '';
          position: absolute;
          width: 440px;
          height: 440px;
          right: -120px;
          top: -160px;
          background: radial-gradient(circle, rgba(200,155,176,0.18) 0%, rgba(200,155,176,0) 70%);
          pointer-events: none;
        }

        .dash-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding-left: 48px;
          padding-right: 48px;
        }

        .dash-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
          gap: 56px;
          align-items: start;
        }

        .dash-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px 20px;
          align-items: center;
        }

        .dash-primary-link,
        .dash-secondary-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .dash-hero-panel {
          position: relative;
          z-index: 1;
          border: 0.5px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          padding: 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.04);
        }

        .dash-access-grid {
          display: grid;
          gap: 10px;
        }

        .dash-access-card {
          padding: 14px 16px;
          text-decoration: none;
          border: 0.5px solid rgba(0,0,0,0.06);
          background: rgba(250,250,248,0.92);
          transition: all 200ms ease;
          border-left: 3px solid transparent;
        }

        .dash-access-card:nth-child(1) { border-left-color: #8BBCAA; }
        .dash-access-card:nth-child(2) { border-left-color: #D4A574; }
        .dash-access-card:nth-child(3) { border-left-color: #7BA7CC; }
        .dash-access-card:nth-child(4) { border-left-color: #C89BB0; }

        .dash-access-card:hover {
          border-color: rgba(0,0,0,0.12);
          background: rgba(255,255,255,1);
          transform: translateX(2px);
        }

        .dash-access-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 5px;
        }

        .dash-access-label {
          font-family: ${serif};
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0;
        }

        .dash-access-copy {
          font-family: ${serif};
          font-size: 12px;
          line-height: 1.6;
          color: ${body};
          font-weight: 300;
          margin: 0;
        }

        .dash-pinned-wrap {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 0.5px solid rgba(0,0,0,0.08);
        }

        @media (max-width: 860px) {
          .dash-wrap {
            padding-left: 24px;
            padding-right: 24px;
          }
          .dash-hero-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 600px) {
          .dash-wrap {
            padding-left: 20px;
            padding-right: 20px;
          }
          .dash-hero-actions {
            align-items: stretch;
          }
          .dash-primary-link {
            justify-content: center;
          }
          .dash-hero-panel {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
