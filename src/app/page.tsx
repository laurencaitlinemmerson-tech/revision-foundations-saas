'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimonials';
import { Sparkles, Heart, Play, ArrowRight, BookOpen, ClipboardCheck, Users, Zap } from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useParallax } from '@/lib/hooks/useParallax';
import { ScrollProgress } from '@/components/MotionComponents';

export default function HomePage() {
  const { isPro, isLoading: accessLoading } = useEntitlements();
  const { ref: parallaxRef, offset: parallaxOffset } = useParallax({ speed: 0.3 });
  
  const [counters, setCounters] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const animateCounter = useCallback((id: string, target: number, duration: number) => {
    // clear any existing interval
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    intervalRef.current = window.setInterval(() => {
      current += increment;

      if (current >= target) {
        setCounters((prev) => ({ ...prev, [id]: target }));

        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setCounters((prev) => ({ ...prev, [id]: Math.floor(current) }));
      }
    }, stepDuration);
  }, []);

  // Counter animation trigger
  useEffect(() => {
    if (!statsRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) {
          setHasAnimated(true);
          animateCounter('quiz', 17, 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, [hasAnimated, animateCounter]);

  // Cleanup any running interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <ScrollProgress />
      <Navbar />

      {/* Hero Section */}
      <main id="main-content">
        <section 
          className="gradient-hero min-h-screen relative overflow-hidden flex items-center justify-center"
          aria-labelledby="hero-heading"
        >
        {/* Parallax Background */}
        <div 
          ref={parallaxRef}
          className="parallax-bg"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
          aria-hidden="true"
        >
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <div className="hero-center max-w-3xl mx-auto">
            <div className="hero-badge" aria-hidden="true">
              <Sparkles className="w-4 h-4 text-[var(--purple)] icon-spin" />
              <span className="text-[var(--plum)]">For Nursing Students</span>
              <Heart className="w-4 h-4 text-[var(--pink)] icon-pulse" />
            </div>

            <h1 id="hero-heading" className="hero-title">
              <span className="gradient-text">Revision Foundations</span>
            </h1>


            <p className="hero-subtitle">Your Nursing Bestie for OSCEs & Exams</p>

            <p className="hero-description">
              Know what to revise, how to revise, and feel confident walking into placements and
              assessments.
            </p>

            <div className="hero-cta-group flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {!accessLoading && isPro ? (
                <>
                  <Link href="/hub" className="btn-primary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    <Sparkles className="w-5 h-5" aria-hidden="true" /> Go to Hub <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                  <Link href="/dashboard" className="btn-secondary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/pricing" className="btn-primary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    <Sparkles className="w-5 h-5" aria-hidden="true" /> Get Started – £4.99
                  </Link>
                  <a href="#whats-inside" className="btn-secondary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    See What's Inside <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,150.63,69.29,321.39,56.44Z"
              fill="var(--cream)"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '17', label: 'Quiz Topics', icon: '📚', id: 'quiz' },
              { num: '50+', label: 'OSCE Stations', icon: '✨', id: 'osce' },
              { num: '£4.99', label: 'One-time access', icon: '💜', id: 'price' },
              { num: '∞', label: 'Lifetime updates', icon: '⭐', id: 'lifetime' },
            ].map((s) => (
              <div key={s.id} className="card bg-white dark:bg-[var(--bg-card)] p-4 md:p-6">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <div className="text-2xl md:text-3xl font-bold text-[var(--purple)] dark:text-[var(--lavender)]">
                  {s.id === 'quiz' && counters[s.id] !== undefined ? counters[s.id] : s.num}
                </div>
                <p className="text-[var(--plum-dark)]/60 dark:text-[var(--text-muted)] text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section - What's Inside */}
      <section id="whats-inside" className="py-16 md:py-24 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--lilac)] to-[var(--lilac-soft)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="badge badge-purple mb-4 inline-flex">Our Tools</span>
            <h2 className="text-3xl md:text-4xl text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-4">What&apos;s Inside?</h2>
            <p className="text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] text-lg">
              Everything you need to ace your exams.
            </p>
          </div>

          {/* Simple 2-column grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* OSCE Tool */}
            <Link href={isPro ? "/hub" : "/osce"} className="card bg-white dark:bg-[var(--bg-card)] p-5 text-center hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center mx-auto mb-3">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">OSCE Tool</h3>
              <p className="text-xs text-[var(--plum-dark)]/60 dark:text-[var(--text-muted)]">50+ stations</p>
            </Link>

            {/* Quiz Tool */}
            <Link href={isPro ? "/hub" : "/quiz"} className="card bg-white dark:bg-[var(--bg-card)] p-5 text-center hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--pink)] to-[var(--lavender)] flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Core Quiz</h3>
              <p className="text-xs text-[var(--plum-dark)]/60 dark:text-[var(--text-muted)]">17 topics</p>
            </Link>

            {/* Hub */}
            <Link href="/hub" className="card bg-white dark:bg-[var(--bg-card)] p-5 text-center hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--purple)] to-[var(--plum)] flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Nursing Hub</h3>
              <p className="text-xs text-[var(--plum-dark)]/60 dark:text-[var(--text-muted)]">Resources & Q&A</p>
            </Link>

            {/* Dashboard */}
            <Link href="/dashboard" className="card bg-white dark:bg-[var(--bg-card)] p-5 text-center hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[var(--plum-dark)] dark:text-[var(--text-primary)] mb-1">Dashboard</h3>
              <p className="text-xs text-[var(--plum-dark)]/60 dark:text-[var(--text-muted)]">Track progress</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="badge badge-purple mb-4 inline-flex">
            Why Us?
          </span>
          <h2 className="mb-12 text-[var(--plum-dark)]">Made With Love</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '👩‍🎓',
                title: 'By a Student',
                copy: 'Created by a nursing student who knows exactly what you need.',
              },
              {
                icon: '⚡',
                title: 'Easy to Use',
                copy: 'Simple, pretty interface that makes revision actually fun.',
              },
              {
                icon: '🎁',
                title: 'Pay Once',
                copy: 'One-time payment. Lifetime access. No subscription.',
              },
            ].map((item) => (
              <div key={item.title} className="card bg-white dark:bg-[var(--bg-card)] p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-[var(--plum)] dark:text-[var(--lavender)] mb-2">{item.title}</h3>
                <p className="text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] text-sm">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="gradient-hero py-16 md:py-24 relative overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="text-4xl mb-6">✨</div>
          <h2 className="mb-4 text-white">Ready to Start?</h2>
          <p className="text-white/90 text-lg mb-8">
            Your nursing exams don&apos;t stand a chance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isPro ? (
              <Link
                href="/hub"
                className="btn-primary px-8 py-4 bg-white text-[var(--purple)] hover:bg-white/90"
              >
                <Sparkles className="w-5 h-5" />
                Go to Hub
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="btn-primary px-8 py-4 bg-white text-[var(--purple)] hover:bg-white/90"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started – £4.99
                </Link>
                <Link
                  href="/quiz"
                  className="btn-secondary px-8 py-4 bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Play className="w-5 h-5" />
                  Free Preview
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-cream py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[var(--plum-dark)]/70 dark:text-[var(--text-secondary)] mb-4">
            Got questions? I&apos;m always happy to chat!
          </p>
          <a
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            💬 WhatsApp Me
          </a>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 pb-10 pt-16 text-[var(--plum-dark)]/70" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="space-y-4">
              <div className="font-serif text-2xl font-semibold text-[var(--plum)]">
                Revision Foundations
              </div>
              <p className="text-sm">Made with 💜 by Lauren</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Products</p>
              <div className="flex flex-col gap-2">
                <Link href="/osce" className="footer-link">
                  OSCE Tool
                </Link>
                <Link href="/quiz" className="footer-link">
                  Core Quiz
                </Link>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Company</p>
              <div className="flex flex-col gap-2">
                <Link href="/about" className="footer-link">
                  About
                </Link>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
                <Link href="/delete-data" className="footer-link">
                  Delete My Data
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Account</p>
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="footer-link">
                  Sign In
                </Link>
                <Link href="/sign-up" className="footer-link">
                  Sign Up
                </Link>
                <Link href="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--lavender)]/40 pt-6 text-center text-sm">
            © 2026 Revision Foundations
          </div>
        </div>
      </footer>
    </div>
  );
}
