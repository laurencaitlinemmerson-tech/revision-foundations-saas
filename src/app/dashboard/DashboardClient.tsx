'use client';

import { ReactNode, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  FolderOpen,
  Target,
} from 'lucide-react';
import { WeeklyProgress } from '@/components/DashboardWidgets';
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
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
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

  const primaryHref = '/hub';
  const primaryLabel = 'Open the hub';

  const secondaryHref = hasOsce ? '/osce' : hasQuiz ? '/quiz' : '/pricing';
  const secondaryLabel = hasOsce
    ? 'Run a timed station'
    : hasQuiz
    ? 'Open the core quiz'
    : 'See the bundle';

  const quickLinks = useMemo(
    () => [
      {
        href: '#today-block',
        label: 'Today',
        description: 'Plan and countdown',
        icon: CalendarDays,
      },
      {
        href: '#progress-block',
        label: 'Progress',
        description: 'Streak and focus areas',
        icon: Target,
      },
      {
        href: '#saved-resources',
        label: 'Saved',
        description: 'Folders and recent pages',
        icon: FolderOpen,
      },
      {
        href: '#exam-season',
        label: 'Exam season',
        description: 'Weekly revision blocks',
        icon: BookOpenText,
      },
    ],
    [],
  );

  const accessCards = useMemo(
    () => [
      {
        href: '/hub',
        label: 'Hub',
        status: 'Ready',
        statusColor: 'var(--sage-600)',
        statusBg: 'var(--sage-50)',
        description: 'Guides, glossaries, and saved folders for calmer revision.',
      },
      {
        href: '/osce',
        label: 'OSCE',
        status: hasOsce ? 'Unlocked' : 'Preview',
        statusColor: hasOsce ? 'var(--teal-600)' : 'var(--amber-600)',
        statusBg: hasOsce ? 'var(--teal-50)' : 'var(--amber-50)',
        description: hasOsce
          ? 'Timed spoken stations when you want exam-style pressure.'
          : 'See the station flow before you unlock more.',
      },
      {
        href: hasQuiz ? '/quiz' : '/pricing',
        label: 'Quiz',
        status: hasQuiz ? 'Unlocked' : 'Locked',
        statusColor: hasQuiz ? 'var(--blue-600)' : muted,
        statusBg: hasQuiz ? 'var(--blue-50)' : '#F0EFED',
        description: hasQuiz
          ? 'Short sets and weak-area spotting for targeted recall.'
          : 'Add the core quiz when you want tighter practice loops.',
      },
    ],
    [hasOsce, hasQuiz],
  );

  const routeCards = useMemo(
    () => [
      {
        href: '/hub',
        label: 'Hub',
        badge: 'Always on',
        badgeColor: 'var(--sage-600)',
        badgeBg: 'var(--sage-50)',
        accent: 'var(--sage-600)',
        surface:
          'linear-gradient(180deg, rgba(238,242,237,0.92) 0%, rgba(255,255,255,0.98) 72%)',
        title: 'Open a guide and settle into revision.',
        description:
          'Best when you want structure without pressure: branch guides, saved folders, quick-reference pages, and calmer reading blocks.',
        highlights: ['Saved folders', 'Glossary', 'Placement reads'],
        cta: 'Go to hub',
      },
      {
        href: '/osce',
        label: 'OSCE',
        badge: hasOsce ? 'Unlocked' : 'Preview',
        badgeColor: hasOsce ? 'var(--teal-600)' : 'var(--amber-600)',
        badgeBg: hasOsce ? 'var(--teal-50)' : 'var(--amber-50)',
        accent: 'var(--teal-600)',
        surface:
          'linear-gradient(180deg, rgba(225,245,238,0.94) 0%, rgba(255,255,255,0.98) 74%)',
        title: hasOsce ? 'Run one station out loud.' : 'Try the free station preview.',
        description: hasOsce
          ? 'Use this when you want a proper timed run, clearer structure, or confidence under pressure.'
          : 'A quick preview is enough to see the station rhythm before you commit.',
        highlights: hasOsce
          ? ['Timed prompts', 'Speaking practice', 'Repeat runs']
          : ['Free preview', 'Station flow', 'Speaking prompt'],
        cta: hasOsce ? 'Launch OSCE' : 'Try preview',
      },
      {
        href: hasQuiz ? '/quiz' : '/pricing',
        label: 'Quiz',
        badge: hasQuiz ? 'Unlocked' : 'Locked',
        badgeColor: hasQuiz ? 'var(--blue-600)' : muted,
        badgeBg: hasQuiz ? 'var(--blue-50)' : '#F0EFED',
        accent: 'var(--blue-600)',
        surface:
          'linear-gradient(180deg, rgba(230,241,251,0.92) 0%, rgba(255,255,255,0.98) 74%)',
        title: hasQuiz ? 'Do a short question set.' : 'Unlock the core quiz loop.',
        description: hasQuiz
          ? 'Use this when you want quick recall, topic reps, and clearer weak-area signals.'
          : 'Add question-based practice when you want stronger recall and clearer gaps.',
        highlights: hasQuiz
          ? ['Topic filters', 'Weak areas', 'Short reps']
          : ['Question practice', 'Feedback', 'Progress tracking'],
        cta: hasQuiz ? 'Open quiz' : 'Unlock quiz',
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
        <div className="dash-wrap" style={{ padding: '52px 0 56px' }}>
          <motion.div {...motionProps}>
            <div className="dash-hero-grid">
              <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: muted, margin: 0 }}>
                    Study desk
                  </p>
                  <span style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, opacity: 0.7 }}>
                    {today}
                  </span>
                </div>

                <h1 style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.7rem, 5.6vw, 4.6rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.03em',
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '18px',
                  maxWidth: '12ch',
                }}>
                  {headingName ? `${greeting}, ${headingName}.` : `${greeting}.`}
                </h1>

                <p style={{
                  fontFamily: serif,
                  fontSize: '15px',
                  color: mid,
                  fontWeight: 300,
                  lineHeight: 1.9,
                  maxWidth: '40rem',
                  marginBottom: '22px',
                }}>
                  Start with one calm, useful action. The quickest wins here are usually a short plan, a saved page, or one practice loop rather than the whole dashboard at once.
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <WeeklyProgress />
                </div>

                <div className="dash-hero-actions">
                  <Link
                    href={primaryHref}
                    className="dash-primary-link"
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: '#FAFAF8',
                      background: ink,
                      padding: '12px 20px',
                      textDecoration: 'none',
                    }}
                  >
                    {primaryLabel}
                  </Link>
                  <Link
                    href={secondaryHref}
                    className="dash-secondary-link"
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: body,
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    {secondaryLabel} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="#saved-resources"
                    className="dash-secondary-link"
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: mid,
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Saved folders <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="dash-quick-links">
                  {quickLinks.map(({ href, label, description, icon: Icon }) => (
                    <Link key={href} href={href} className="dash-quick-link">
                      <div className="dash-quick-link-icon">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="dash-quick-link-label">{label}</p>
                        <p className="dash-quick-link-copy">{description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.aside variants={itemVariants} className="dash-hero-panel">
                <div className="dash-hero-panel-head">
                  <p className="dash-hero-panel-kicker">At a glance</p>
                  <p className="dash-hero-panel-copy">
                    Use this page like a study desk: quick jumps for where to go, a note for what matters, and clearer signals about what is ready right now.
                  </p>
                </div>

                <div className="dash-access-grid">
                  {accessCards.map(({ href, label, status, statusColor, statusBg, description }) => (
                    <Link key={label} href={href} className="dash-access-card">
                      <div className="dash-access-row">
                        <p className="dash-access-label">{label}</p>
                        <span
                          style={{
                            fontFamily: serif,
                            fontSize: '9px',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: statusColor,
                            background: statusBg,
                            padding: '4px 8px',
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

            <motion.div variants={itemVariants} style={{ marginTop: '40px' }}>
              <div className="dash-route-grid">
                {routeCards.map(({ href, label, badge, badgeColor, badgeBg, accent, surface, title, description, highlights, cta }, index) => (
                  <Link
                    key={label}
                    href={href}
                    className="dash-route-cell"
                    style={{
                      borderTop: `2px solid ${accent}`,
                      background: surface,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '18px',
                      flexWrap: 'wrap',
                    }}>
                      <p style={{
                        fontFamily: serif,
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: muted,
                        margin: 0,
                      }}>
                        {label}
                      </p>
                      <span style={{
                        fontFamily: serif,
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: badgeColor,
                        background: badgeBg,
                        padding: '2px 8px',
                        }}>
                        {badge}
                      </span>
                    </div>

                    <p style={{
                      fontFamily: display,
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      color: ink,
                      lineHeight: 1.12,
                      marginBottom: '12px',
                    }}>
                      {title}
                    </p>

                    <p style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      color: mid,
                      lineHeight: 1.75,
                      fontWeight: 300,
                      flex: 1,
                      marginBottom: '20px',
                    }}>
                      {description}
                    </p>

                    <div className="dash-route-highlights">
                      {highlights.map((highlight) => (
                        <span key={`${label}-${highlight}`} className="dash-route-pill">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="dash-route-footer">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: serif,
                        fontSize: '12px',
                        color: body,
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}>
                        {cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="dash-route-index">0{index + 1}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main>
        <div className="dash-wrap" style={{ paddingTop: '56px', paddingBottom: '96px' }}>
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
            linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,244,239,0.98) 100%);
        }

        .dash-hero-shell::before {
          content: '';
          position: absolute;
          width: 440px;
          height: 440px;
          left: -140px;
          bottom: -190px;
          background: radial-gradient(circle, rgba(184,204,186,0.42) 0%, rgba(184,204,186,0) 74%);
          pointer-events: none;
        }

        .dash-hero-shell::after {
          content: '';
          position: absolute;
          width: 420px;
          height: 420px;
          right: -110px;
          top: -160px;
          background: radial-gradient(circle, rgba(230,241,251,0.5) 0%, rgba(230,241,251,0) 72%);
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
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
          gap: 32px;
          align-items: start;
        }

        .dash-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 22px;
          align-items: center;
          margin-bottom: 28px;
        }

        .dash-primary-link,
        .dash-secondary-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .dash-quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-quick-link {
          display: flex;
          gap: 14px;
          align-items: start;
          padding: 16px 18px;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(10px);
          transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
        }

        .dash-quick-link:hover {
          border-color: rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.94);
          transform: translateY(-1px);
        }

        .dash-quick-link-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: ${ink};
          background: rgba(245,243,240,0.95);
          border: 1px solid rgba(0,0,0,0.06);
          flex-shrink: 0;
        }

        .dash-quick-link-label {
          font-family: ${serif};
          font-size: 12px;
          color: ${ink};
          margin: 0 0 3px;
        }

        .dash-quick-link-copy {
          font-family: ${serif};
          font-size: 11px;
          color: ${mid};
          line-height: 1.6;
          margin: 0;
        }

        .dash-hero-panel {
          position: relative;
          z-index: 1;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(12px);
          padding: 24px;
        }

        .dash-hero-panel-head {
          margin-bottom: 20px;
        }

        .dash-hero-panel-kicker {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 10px;
        }

        .dash-hero-panel-copy {
          font-family: ${serif};
          font-size: 13px;
          line-height: 1.8;
          color: ${mid};
          margin: 0;
        }

        .dash-access-grid {
          display: grid;
          gap: 12px;
        }

        .dash-access-card {
          padding: 14px 16px;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(250,250,248,0.92);
          transition: border-color 150ms ease, background 150ms ease;
        }

        .dash-access-card:hover {
          border-color: rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.98);
        }

        .dash-access-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
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
          line-height: 1.7;
          color: ${body};
          margin: 0;
        }

        .dash-pinned-wrap {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }

        .dash-route-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .dash-route-cell {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 26px 24px 24px;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.08);
          transition: border-color 150ms ease, transform 150ms ease;
        }
        .dash-route-cell:hover {
          border-color: rgba(0,0,0,0.14);
          transform: translateY(-1px);
        }

        .dash-route-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          margin-bottom: 18px;
        }

        .dash-route-pill {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${mid};
          padding: 6px 10px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(0,0,0,0.06);
        }

        .dash-route-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }

        .dash-route-index {
          font-family: ${serif};
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${muted};
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
          .dash-quick-links {
            grid-template-columns: 1fr 1fr;
          }
          .dash-route-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
          .dash-quick-links,
          .dash-route-grid {
            grid-template-columns: 1fr;
          }
          .dash-hero-panel {
            padding: 20px;
          }
          .dash-route-cell {
            padding: 22px 20px;
          }
        }
      `}</style>
    </div>
  );
}
