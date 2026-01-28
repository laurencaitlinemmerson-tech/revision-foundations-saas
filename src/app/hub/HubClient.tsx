'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Sparkles, BookOpen, FileText, Crown, Heart, MessageCircle } from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

interface Entitlement {
  product: Product;
  status: string;
}

export default function HubClient() {
  const { user, isLoaded } = useUser();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    fetch('/api/entitlements/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.entitlements) {
          setEntitlements(data.entitlements);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const hasProduct = (product: Product) => {
    return entitlements.some((e) => e.product === product && e.status === 'active');
  };

  const hasAnyAccess = hasProduct('osce') || hasProduct('quiz') || hasProduct('bundle');

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-on-scroll emoji-float">✨</div>
          <p className="text-[var(--plum)] animate-on-scroll">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <section className="gradient-hero min-h-screen relative overflow-hidden flex items-center">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div className="text-4xl mb-6 animate-on-scroll emoji-float">🔒</div>
            <h1 className="mb-4 hero-title animate-on-scroll">
              <span className="gradient-text">Please Sign In</span>
            </h1>
            <p className="hero-description animate-on-scroll mb-8">
              Sign in to access your revision tools and continue your nursing journey.
            </p>
            <Link href="/sign-in" className="btn-primary btn-hover text-lg px-8 py-4 animate-on-scroll">
              <Sparkles className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="gradient-hero relative overflow-hidden pt-32 pb-20">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="hero-badge animate-on-scroll">
              <Sparkles className="w-4 h-4 text-[var(--purple)] icon-spin" />
              <span className="text-[var(--plum)]">Welcome Back</span>
              <Heart className="w-4 h-4 text-[var(--pink)] icon-pulse" />
            </div>

            <h1 className="mb-4 hero-title animate-on-scroll">
              <span className="gradient-text">Your Dashboard</span>
            </h1>

            <p className="hero-subtitle animate-on-scroll">
              Hey {user.firstName || 'there'}! Ready to revise?
            </p>
          </div>
        </div>

        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,150.63,69.29,321.39,56.44Z" fill="var(--cream)"></path>
          </svg>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6">
          {!hasAnyAccess ? (
            <div className="text-center mb-12 animate-on-scroll">
              <div className="text-4xl mb-4 emoji-float">🎁</div>
              <h2 className="mb-4 text-[var(--plum-dark)]">Ready to Get Started?</h2>
              <p className="text-[var(--plum-dark)]/70 mb-8 max-w-2xl mx-auto">
                Unlock both OSCE and Quiz tools for just £9.99 one-time. No subscription, lifetime access!
              </p>
              <Link href="/pricing" className="btn-primary btn-hover text-lg px-8 py-4">
                <Crown className="w-5 h-5" />
                View Pricing
              </Link>
            </div>
          ) : (
            <div className="text-center mb-12 animate-on-scroll">
              <span className="badge badge-purple mb-4 badge-shimmer">Your Tools</span>
              <h2 className="mb-4 text-[var(--plum-dark)]">Choose Your Tool</h2>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className={`card card-lift bg-white p-8 rounded-2xl shadow-sm animate-on-scroll slide-in-left ${!hasProduct('osce') && !hasProduct('bundle') ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box-soft">
                  <BookOpen className="w-6 h-6 text-[var(--purple)]" />
                </div>
                <h3 className="text-[var(--plum-dark)]">Children&apos;s OSCE Tool</h3>
              </div>

              <p className="text-[var(--plum-dark)]/70 mb-6">
                50+ stations to prepare you for placements and assessments.
              </p>

              {hasProduct('osce') || hasProduct('bundle') ? (
                <Link href="/osce" className="btn-primary btn-hover w-full block text-center">
                  <Sparkles className="w-5 h-5" />
                  Start OSCE Practice
                </Link>
              ) : (
                <Link href="/pricing" className="btn-secondary btn-hover w-full block text-center">
                  <Crown className="w-5 h-5" />
                  Unlock Access
                </Link>
              )}
            </div>

            <div className={`card card-lift bg-white p-8 rounded-2xl shadow-sm animate-on-scroll slide-in-right ${!hasProduct('quiz') && !hasProduct('bundle') ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box-soft">
                  <FileText className="w-6 h-6 text-[var(--purple)]" />
                </div>
                <h3 className="text-[var(--plum-dark)]">Core Nursing Quiz</h3>
              </div>

              <p className="text-[var(--plum-dark)]/70 mb-6">
                17 topic areas covering essential nursing knowledge for exams.
              </p>

              {hasProduct('quiz') || hasProduct('bundle') ? (
                <Link href="/quiz" className="btn-primary btn-hover w-full block text-center">
                  <Sparkles className="w-5 h-5" />
                  Start Quiz Practice
                </Link>
              ) : (
                <Link href="/pricing" className="btn-secondary btn-hover w-full block text-center">
                  <Crown className="w-5 h-5" />
                  Unlock Access
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-lilac section relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.3 }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-purple mb-4 animate-on-scroll badge-shimmer">Study Tips</span>
            <h2 className="mb-4 text-[var(--plum-dark)] animate-on-scroll">Make the Most of Your Revision</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: '📅', title: 'Practice Daily', copy: 'Even 15 minutes a day builds confidence and retention.' },
              { icon: '🎯', title: 'Focus on Weak Areas', copy: 'Use the tools to identify and strengthen your weak spots.' },
              { icon: '✨', title: 'Stay Consistent', copy: 'Regular practice beats cramming every time.' },
            ].map((item, i) => (
              <div key={item.title} className="card bg-white p-6 text-center animate-on-scroll fade-in-up" style={{ animationDelay: i * 0.1 + 's' }}>
                <div className="text-4xl mb-3 emoji-float" style={{ animationDelay: i * 0.3 + 's' }}>{item.icon}</div>
                <h3 className="text-[var(--plum)] mb-2">{item.title}</h3>
                <p className="text-[var(--plum-dark)]/70 text-sm">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4 animate-on-scroll emoji-float">💬</div>
          <h2 className="mb-4 text-[var(--plum-dark)] animate-on-scroll">Need Help?</h2>
          <p className="text-[var(--plum-dark)]/70 mb-6 animate-on-scroll">Got questions or feedback? I am always happy to chat!</p>
          <Link href="https://wa.me/447572650980" target="_blank" rel="noopener noreferrer" className="whatsapp-btn animate-on-scroll">
            <MessageCircle className="w-4 h-4" />
            WhatsApp Me
          </Link>
        </div>
      </section>

      <footer className="bg-[var(--lilac)] px-6 pb-10 pt-16 text-[var(--plum-dark)]/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="space-y-4">
              <div className="font-serif text-2xl font-semibold text-[var(--plum)]">Revision Foundations</div>
              <p className="text-sm">Made with 💜 by Lauren</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Products</p>
              <div className="flex flex-col gap-2">
                <Link href="/osce" className="footer-link">OSCE Tool</Link>
                <Link href="/quiz" className="footer-link">Core Quiz</Link>
                <Link href="/pricing" className="footer-link">Pricing</Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Company</p>
              <div className="flex flex-col gap-2">
                <Link href="/about" className="footer-link">About</Link>
                <Link href="/contact" className="footer-link">Contact</Link>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/terms" className="footer-link">Terms of Service</Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--plum)]">Account</p>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="footer-link">Dashboard</Link>
                <Link href="/sign-out" className="footer-link">Sign Out</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--lavender)]/40 pt-6 text-center text-sm">© 2026 Revision Foundations</div>
        </div>
      </footer>
    </div>
  );
}
