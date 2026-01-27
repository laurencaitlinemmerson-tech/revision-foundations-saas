'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Sparkles, BookOpen, ClipboardCheck, Star, Heart, Check, Play, Users, Zap, Gift } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero min-h-screen relative overflow-hidden flex items-center">
        {/* Decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="fade-in inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-8 border border-[var(--lavender)]/30">
              <Sparkles className="w-4 h-4 text-[var(--purple)]" />
              <span className="text-[var(--plum)]">For Children's Nursing Students</span>
              <Heart className="w-4 h-4 text-[var(--pink)]" />
            </div>

            <h1 className="fade-in mb-6">
              Revision Foundations
            </h1>

            <p className="fade-in text-lg md:text-xl text-[var(--plum-dark)]/80 mb-10 max-w-2xl mx-auto">
              Cute, simple revision tools to help you ace your nursing exams.
              Made by students who've been there!
            </p>

            <div className="fade-in flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" />
                Get Started
              </Link>
              <Link href="/quiz" className="btn-secondary text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                Try Free Preview
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,150.63,69.29,321.39,56.44Z" fill="var(--cream)"></path>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Happy Students', icon: '💜' },
              { num: '17', label: 'Quiz Topics', icon: '📚' },
              { num: '50+', label: 'OSCE Stations', icon: '✨' },
              { num: '4.9', label: 'Star Rating', icon: '⭐' },
            ].map((s, i) => (
              <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <div className="stat-number">{s.num}</div>
                <p className="text-[var(--plum-dark)]/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-lilac section relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.3 }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">Our Tools</span>
            <h2 className="mb-4">What's Inside?</h2>
            <p className="text-[var(--plum-dark)]/70 max-w-xl mx-auto">
              Two lovely tools designed to make your revision actually enjoyable!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* OSCE Card */}
            <div className="card">
              <div className="icon-box mb-5">
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <span className="badge mb-4">£4.99 · Lifetime</span>
              <h3 className="mb-3">Children's OSCE Tool</h3>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Practice stations with detailed checklists and step-by-step guidance.
              </p>
              <div className="space-y-2 mb-6">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Track your progress'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/osce" className="btn-primary w-full">
                Try OSCE Tool
              </Link>
            </div>

            {/* Quiz Card */}
            <div className="card">
              <div className="icon-box mb-5">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="badge mb-4">£4.99 · Lifetime</span>
              <h3 className="mb-3">Nursing Theory Quiz</h3>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Fun quizzes with instant feedback and detailed explanations.
              </p>
              <div className="space-y-2 mb-6">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Works on mobile'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--plum-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/quiz" className="btn-primary w-full">
                Try Quiz Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-cream section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">Why Us?</span>
            <h2 className="mb-4">Made With Love</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                emoji: '👩‍🎓',
                title: 'By Students',
                desc: 'Created by nursing students who know exactly what you need.',
              },
              {
                icon: Zap,
                emoji: '⚡',
                title: 'Easy to Use',
                desc: 'Simple, pretty interface that makes revision actually fun.',
              },
              {
                icon: Gift,
                emoji: '🎁',
                title: 'Pay Once',
                desc: 'No subscriptions! One payment, lifetime access forever.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-[var(--plum-dark)]/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="gradient-hero section relative overflow-hidden">
        <div className="blob blob-2" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="badge mb-4">Reviews</span>
            <h2 className="mb-4">Students Love It</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Javine',
                text: "It's quick and easy revision which is practically accessible on the go!",
              },
              {
                name: 'Sarah',
                text: 'The OSCE tool helped me feel so much more confident before my exam.',
              },
              {
                name: 'Emily',
                text: 'These tools break everything down into manageable chunks. Perfect!',
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[var(--plum-dark)]/80 text-sm mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <span className="font-medium text-sm text-[var(--plum)]">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream section">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-4xl mb-6">✨</div>
          <h2 className="mb-4">Ready to Start?</h2>
          <p className="text-[var(--plum-dark)]/70 mb-8">
            Join hundreds of happy nursing students today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Get Started - £4.99
            </Link>
            <Link href="/quiz" className="btn-secondary px-8 py-4">
              <Play className="w-5 h-5" />
              Free Preview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg mb-3">Revision Foundations</h3>
              <p className="text-sm text-[var(--plum-dark)]/70">Made with 💜 by nursing students.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--plum)] mb-3 text-sm">Products</h4>
              <ul className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <li><Link href="/osce" className="hover:text-[var(--purple)]">OSCE Tool</Link></li>
                <li><Link href="/quiz" className="hover:text-[var(--purple)]">Quiz Tool</Link></li>
                <li><Link href="/pricing" className="hover:text-[var(--purple)]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--plum)] mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <li><Link href="/about" className="hover:text-[var(--purple)]">About</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--purple)]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--plum)] mb-3 text-sm">Account</h4>
              <ul className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <li><Link href="/sign-in" className="hover:text-[var(--purple)]">Sign In</Link></li>
                <li><Link href="/sign-up" className="hover:text-[var(--purple)]">Sign Up</Link></li>
                <li><Link href="/dashboard" className="hover:text-[var(--purple)]">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--lilac-medium)] pt-6 text-center text-sm text-[var(--plum-dark)]/60">
            © 2025 Revision Foundations
          </div>
        </div>
      </footer>
    </div>
  );
}
