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

            <h1 className="fade-in mb-2">
              Revision Foundations
            </h1>

            <p className="fade-in text-xl md:text-2xl text-[var(--plum)] font-medium mb-4">
              Your Nursing Bestie for OSCEs & Exams
            </p>

            <p className="fade-in text-lg md:text-xl text-[var(--plum-dark)]/80 mb-10 max-w-2xl mx-auto">
              Know what to revise, how to revise, and feel confident walking into placements and assessments.
            </p>

            <div className="fade-in flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" />
                Get Started - £4.99
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
              { num: '17', label: 'Quiz Topics', icon: '📚' },
              { num: '50+', label: 'OSCE Stations', icon: '✨' },
              { num: '∞', label: 'Lifetime Access', icon: '💜' },
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
              <div className="flex justify-between items-start mb-5">
                <div className="icon-box">
                  <ClipboardCheck className="w-8 h-8 text-white" />
                </div>
                <span className="badge">£4.99 · Lifetime</span>
              </div>
              <h3 className="mb-3">Children's OSCE Tool</h3>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                Walk into your placement OSCE feeling prepared. 50+ stations with step-by-step guidance.
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
                <Play className="w-4 h-4" />
                Try OSCE Tool
              </Link>
            </div>

            {/* Quiz Card */}
            <div className="card">
              <div className="flex justify-between items-start mb-5">
                <div className="icon-box">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <span className="badge">£4.99 · Lifetime</span>
              </div>
              <h3 className="mb-3">Core Nursing Quiz</h3>
              <p className="text-[var(--plum-dark)]/70 mb-6">
                17 topic areas covering the theory you need for exams. Instant feedback + explanations.
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
                <Play className="w-4 h-4" />
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

      {/* Leave a Review */}
      <section className="bg-cream section">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="mb-4">Leave a Review</h2>
          <p className="text-[var(--plum-dark)]/70 mb-6">
            Loved the tools? Your feedback means the world! Share your experience and help other nursing students find their study bestie.
          </p>
          <a
            href="mailto:hello@revisionfoundations.com?subject=My Review"
            className="btn-secondary"
          >
            <Heart className="w-4 h-4" />
            Share Your Experience
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero section relative overflow-hidden">
        <div className="blob blob-1" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <div className="text-4xl mb-6">✨</div>
          <h2 className="mb-4 text-white">Ready to Start?</h2>
          <p className="text-white/80 mb-8">
            Your nursing exams don't stand a chance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary px-8 py-4 bg-white text-[var(--purple)] hover:bg-white/90">
              <Sparkles className="w-5 h-5" />
              Get Started - £4.99
            </Link>
            <Link href="/quiz" className="btn-secondary px-8 py-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Play className="w-5 h-5" />
              Free Preview
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-cream py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[var(--plum-dark)]/70 mb-4">
            Got questions? I'm always happy to chat!
          </p>
          <a
            href="https://wa.me/447000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message me on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg mb-3">Revision Foundations</h3>
              <p className="text-sm text-[var(--plum-dark)]/70">Made with 💜 by Lauren</p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--plum)] mb-3 text-sm">Products</h4>
              <ul className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <li><Link href="/osce" className="hover:text-[var(--purple)]">OSCE Tool</Link></li>
                <li><Link href="/quiz" className="hover:text-[var(--purple)]">Core Quiz</Link></li>
                <li><Link href="/pricing" className="hover:text-[var(--purple)]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--plum)] mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <li><Link href="/about" className="hover:text-[var(--purple)]">About</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--purple)]">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-[var(--purple)]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--purple)]">Terms of Service</Link></li>
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
