'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimonials';
import { Sparkles, Heart, Play, ArrowRight, BookOpen, ClipboardCheck, Users, Zap } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useParallax } from '@/lib/hooks/useParallax';
import { 
  HorizontalScrollSection, 
  HorizontalCard, 
  AnimateOnScroll, 
  StaggerChildren, 
  StaggerItem,
  FloatingElement,
  ScrollProgress 
} from '@/components/MotionComponents';

export default function HomePage() {
  useScrollAnimation();
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
      <section className="gradient-hero min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Parallax Background */}
        <div 
          ref={parallaxRef}
          className="parallax-bg"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <div className="hero-center max-w-3xl mx-auto">
            <div className="hero-badge">
              <Sparkles className="w-4 h-4 text-[var(--purple)] icon-spin" />
              <span className="text-[var(--plum)]">For Nursing Students</span>
              <Heart className="w-4 h-4 text-[var(--pink)] icon-pulse" />
            </div>

            <h1 className="hero-title">
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
                    <Sparkles className="w-5 h-5" /> Go to Hub <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/dashboard" className="btn-secondary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/pricing" className="btn-primary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    <Sparkles className="w-5 h-5" /> Get Started – £4.99
                  </Link>
                  <a href="#whats-inside" className="btn-secondary btn-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                    See What's Inside <ArrowRight className="w-5 h-5" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '17', label: 'Quiz Topics', icon: '📚', id: 'quiz' },
              { num: '50+', label: 'OSCE Stations', icon: '✨', id: 'osce' },
              { num: '£4.99', label: 'One-time access', icon: '💜', id: 'price' },
              { num: '∞', label: 'Lifetime updates', icon: '⭐', id: 'lifetime' },
            ].map((s, i) => (
              <div
                key={s.id}
                className="animate-on-scroll stat-card"
                style={{ animationDelay: i * 0.1 + 's' }}
              >
                <span
                  className="text-2xl mb-2 block emoji-float"
                  style={{ animationDelay: i * 0.2 + 's' }}
                >
                  {s.icon}
                </span>

                <div className="stat-number">
                  {s.id === 'quiz' && counters[s.id] !== undefined ? counters[s.id] : s.num}
                </div>

                <p className="text-[var(--plum-dark)]/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section - Horizontal Scroll */}
      <HorizontalScrollSection id="whats-inside" className="bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--lilac)] to-[var(--lilac-soft)]">
        {/* Intro Card */}
        <HorizontalCard className="flex items-center">
          <div className="card bg-white/90 backdrop-blur-sm p-10 h-full flex flex-col justify-center">
            <span className="badge badge-purple mb-4 inline-flex w-fit">Our Tools</span>
            <h2 className="text-3xl md:text-4xl text-[var(--plum-dark)] mb-4">What&apos;s Inside?</h2>
            <p className="text-[var(--plum-dark)]/70 text-lg">
              Everything you need to ace your nursing exams and feel confident on placement.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[var(--purple)]">
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </HorizontalCard>

        {/* OSCE Tool Card */}
        <HorizontalCard>
          <div className="card bg-white h-full p-8 flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center mb-6">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-[var(--plum-dark)] mb-3">Children&apos;s OSCE Tool</h3>
            <p className="text-[var(--plum-dark)]/70 mb-6 flex-1">
              Practice with 50+ OSCE stations. Timed scenarios, examiner checklists, and instant feedback to build your confidence.
            </p>
            <ul className="space-y-2 mb-6">
              {['50+ stations', 'Timed practice', 'Examiner checklists', 'Self-assessment'].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-[var(--plum-dark)]/80">
                  <Sparkles className="w-4 h-4 text-[var(--purple)]" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPro ? (
              <Link href="/hub" className="btn-primary w-full text-center">
                <ArrowRight className="w-4 h-4" /> Open in Hub
              </Link>
            ) : (
              <Link href="/osce" className="btn-primary w-full text-center">
                Try OSCE Tool
              </Link>
            )}
          </div>
        </HorizontalCard>

        {/* Quiz Tool Card */}
        <HorizontalCard>
          <div className="card bg-white h-full p-8 flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--pink)] to-[var(--lavender)] flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-[var(--plum-dark)] mb-3">Core Nursing Quiz</h3>
            <p className="text-[var(--plum-dark)]/70 mb-6 flex-1">
              17 topic areas covering everything from anatomy to pharmacology. Track your progress and focus on weak spots.
            </p>
            <ul className="space-y-2 mb-6">
              {['17 topic areas', 'Instant feedback', 'Progress tracking', 'Exam-focused'].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-[var(--plum-dark)]/80">
                  <Sparkles className="w-4 h-4 text-[var(--pink)]" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPro ? (
              <Link href="/hub" className="btn-primary w-full text-center">
                <ArrowRight className="w-4 h-4" /> Open in Hub
              </Link>
            ) : (
              <Link href="/quiz" className="btn-primary w-full text-center">
                Try Quiz Tool
              </Link>
            )}
          </div>
        </HorizontalCard>

        {/* Hub Card */}
        <HorizontalCard>
          <div className="card bg-white h-full p-8 flex flex-col">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[var(--plum)] flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--plum-dark)] mb-3">Nursing Hub</h3>
            <p className="text-[var(--plum-dark)]/70 mb-6 flex-1 leading-relaxed">
              Your all-in-one study headquarters with curated resources, guides, and community Q&amp;A.
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/80">
                <span>📚</span>
                <span>Y1 Child Nursing Resources</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/80">
                <span>📄</span>
                <span>Downloadable Study Guides</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/80">
                <span>💬</span>
                <span>Community Q&amp;A Forum</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/80">
                <span>📊</span>
                <span>Progress Tracking</span>
              </div>
            </div>
            <Link href="/hub" className="btn-primary w-full text-center">
              Explore Hub
            </Link>
          </div>
        </HorizontalCard>

        {/* Dashboard Preview Card */}
        <HorizontalCard>
          <div className="card bg-gradient-to-br from-[var(--pink-soft)] via-white to-[var(--lilac-soft)] h-full p-8 flex flex-col border-2 border-[var(--lavender)]/30">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center mb-6 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--plum-dark)] mb-3">Personal Dashboard</h3>
            <p className="text-[var(--plum-dark)]/70 mb-6 flex-1 leading-relaxed">
              Track your learning journey with streaks, progress stats, and daily goals. Stay motivated and see how far you&apos;ve come!
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                { text: 'Daily study streak tracker', icon: '🔥' },
                { text: 'Weekly progress stats', icon: '📈' },
                { text: 'Personal best records', icon: '🏆' },
                { text: 'Daily revision checklist', icon: '✅' },
              ].map((feature) => (
                <li key={feature.text} className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/80">
                  <span className="text-base">{feature.icon}</span>
                  {feature.text}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="btn-primary w-full text-center font-semibold">
              View Dashboard
            </Link>
          </div>
        </HorizontalCard>
      </HorizontalScrollSection>

      {/* Why Us Section */}
      <section className="bg-cream section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <AnimateOnScroll>
            <span className="badge badge-purple mb-4 inline-flex badge-shimmer">
              Why Us?
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <h2 className="mb-12 text-[var(--plum-dark)]">Made With Love</h2>
          </AnimateOnScroll>

          <StaggerChildren className="grid gap-10 md:grid-cols-3">
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
              <StaggerItem key={item.title} className="space-y-3">
                <FloatingElement className="text-4xl inline-block">
                  {item.icon}
                </FloatingElement>
                <h3 className="text-[var(--plum)]">{item.title}</h3>
                <p className="text-[var(--plum-dark)]/70">{item.copy}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Leave Review Section */}
      <section className="bg-cream py-12">
        <div className="flex justify-center">
          <a href="/review" className="review-link">
            <Sparkles className="w-4 h-4 text-[var(--purple)]" />
            <span className="text-[var(--plum)]">Leave your own review</span>
            <Heart className="w-4 h-4 text-[var(--pink)]" />
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero section relative overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="text-4xl mb-6 animate-on-scroll emoji-float">✨</div>
          <h2 className="mb-4 text-white animate-on-scroll">Ready to Start?</h2>
          <p className="text-white text-lg mb-8 animate-on-scroll">
            Your nursing exams don&apos;t stand a chance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll">
            {isPro ? (
              <Link
                href="/hub"
                className="btn-primary btn-hover px-8 py-4 bg-white text-[var(--purple)] hover:bg-white/90"
              >
                <Sparkles className="w-5 h-5" />
                Go to Hub
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="btn-primary btn-hover px-8 py-4 bg-white text-[var(--purple)] hover:bg-white/90"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started – £4.99
                </Link>
                <Link
                  href="/quiz"
                  className="btn-secondary btn-hover px-8 py-4 bg-white/20 text-white border-white/30 hover:bg-white/30"
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
          <p className="text-[var(--plum-dark)]/70 mb-4 animate-on-scroll">
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

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 pb-10 pt-16 text-[var(--plum-dark)]/70">
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
