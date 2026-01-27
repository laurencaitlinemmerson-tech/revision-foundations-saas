'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Sparkles, BookOpen, ClipboardCheck, Star, Heart, Check, Play, Users, Zap, Gift } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="fade-in inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/50 shadow-lg shadow-purple-500/10">
              <Sparkles className="w-4 h-4 text-[var(--purple-accent)] sparkle" />
              <span className="text-[var(--text-dark)]">For Children's Nursing Students</span>
              <Heart className="w-4 h-4 text-[var(--pink-dark)]" />
            </div>

            <h1 className="fade-in mb-6 text-[var(--text-dark)]">
              Revision Foundations
            </h1>

            <p className="fade-in text-lg md:text-xl text-[var(--text-medium)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Cute, simple revision tools to help you ace your nursing exams.
              Made by a student who's been there! 💜
            </p>

            <div className="fade-in flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-purple-500/25">
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

        {/* Floating Icon Cards */}
        <div className="hidden lg:block absolute top-1/4 left-[8%] float-1">
          <div className="icon-card">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="hidden lg:block absolute top-1/3 right-[10%] float-2">
          <div className="icon-card">
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-1/4 left-[15%] float-3">
          <div className="icon-card">
            <Star className="w-7 h-7 text-white" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: '500+', label: 'Happy Students', icon: '💜' },
                { num: '17', label: 'Quiz Topics', icon: '📚' },
                { num: '50+', label: 'OSCE Stations', icon: '✨' },
                { num: '4.9', label: 'Star Rating', icon: '⭐' },
              ].map((s, i) => (
                <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="text-3xl mb-3 block">{s.icon}</span>
                  <div className="stat-number">{s.num}</div>
                  <p className="text-[var(--text-light)] text-sm mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="section relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Our Tools
            </span>
            <h2 className="mb-4 text-[var(--text-dark)]">What's Inside?</h2>
            <p className="text-[var(--text-medium)] max-w-xl mx-auto">
              Two lovely tools designed to make your revision actually enjoyable!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* OSCE Card */}
            <div className="card">
              <div className="icon-box mb-6 float-1">
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <span className="badge mb-4">£4.99 · Lifetime</span>
              <h3 className="mb-3 text-[var(--text-dark)]">Children's OSCE Tool</h3>
              <p className="text-[var(--text-medium)] mb-6">
                Practice stations with detailed checklists and step-by-step guidance.
              </p>
              <div className="space-y-2.5 mb-8">
                {['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Track your progress'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--text-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/osce" className="btn-primary w-full">
                <Sparkles className="w-4 h-4" />
                Try OSCE Tool
              </Link>
            </div>

            {/* Quiz Card */}
            <div className="card">
              <div className="icon-box mb-6 float-2">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="badge mb-4">£4.99 · Lifetime</span>
              <h3 className="mb-3 text-[var(--text-dark)]">Nursing Theory Quiz</h3>
              <p className="text-[var(--text-medium)] mb-6">
                Fun quizzes with instant feedback and detailed explanations.
              </p>
              <div className="space-y-2.5 mb-8">
                {['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Works on mobile'].map((f) => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--text-dark)]">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/quiz" className="btn-primary w-full">
                <Sparkles className="w-4 h-4" />
                Try Quiz Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">
              <Heart className="w-3.5 h-3.5" />
              Why Us?
            </span>
            <h2 className="mb-4 text-[var(--text-dark)]">Made With Love</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                emoji: '👩‍🎓',
                title: 'By a Student',
                desc: 'Created by a nursing student who knows exactly what you need.',
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
              <div key={i} className="card text-center">
                <div className="text-5xl mb-5">{item.emoji}</div>
                <h3 className="mb-3 text-[var(--text-dark)]">{item.title}</h3>
                <p className="text-[var(--text-medium)] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="badge mb-4">
              <Star className="w-3.5 h-3.5" />
              Reviews
            </span>
            <h2 className="mb-4 text-[var(--text-dark)]">Students Love It</h2>
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
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[var(--text-medium)] text-sm mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lavender-dark)] to-[var(--pink-dark)] flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-purple-500/20">
                    {t.name[0]}
                  </div>
                  <span className="font-semibold text-sm text-[var(--text-dark)]">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="max-w-2xl mx-auto px-6">
          <div className="card text-center">
            <div className="text-5xl mb-6 sparkle-float">✨</div>
            <h2 className="mb-4 text-[var(--text-dark)]">Ready to Start?</h2>
            <p className="text-[var(--text-medium)] mb-8">
              Join hundreds of happy nursing students today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary px-8 py-4">
                <Sparkles className="w-5 h-5" />
                Get Started
              </Link>
              <Link href="/quiz" className="btn-secondary px-8 py-4">
                <Play className="w-5 h-5" />
                Free Preview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="card">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div>
                <h3 className="text-lg mb-3 text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>Revision Foundations</h3>
                <p className="text-sm text-[var(--text-medium)]">Made with 💜 by Lauren</p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-dark)] mb-4 text-sm">Products</h4>
                <ul className="space-y-2.5 text-sm text-[var(--text-medium)]">
                  <li><Link href="/osce" className="hover:text-[var(--purple-accent)] transition-colors">OSCE Tool</Link></li>
                  <li><Link href="/quiz" className="hover:text-[var(--purple-accent)] transition-colors">Quiz Tool</Link></li>
                  <li><Link href="/pricing" className="hover:text-[var(--purple-accent)] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-dark)] mb-4 text-sm">Company</h4>
                <ul className="space-y-2.5 text-sm text-[var(--text-medium)]">
                  <li><Link href="/about" className="hover:text-[var(--purple-accent)] transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-[var(--purple-accent)] transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-dark)] mb-4 text-sm">Account</h4>
                <ul className="space-y-2.5 text-sm text-[var(--text-medium)]">
                  <li><Link href="/sign-in" className="hover:text-[var(--purple-accent)] transition-colors">Sign In</Link></li>
                  <li><Link href="/sign-up" className="hover:text-[var(--purple-accent)] transition-colors">Sign Up</Link></li>
                  <li><Link href="/dashboard" className="hover:text-[var(--purple-accent)] transition-colors">Dashboard</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[var(--lavender)]/30 pt-6 text-center text-sm text-[var(--text-light)]">
              © {new Date().getFullYear()} Revision Foundations
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
