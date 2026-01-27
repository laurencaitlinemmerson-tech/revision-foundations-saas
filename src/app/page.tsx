'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimonials';
import { Sparkles, BookOpen, ClipboardCheck, Heart, Check, Play, Users, Zap, Gift } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero min-h-screen relative overflow-hidden flex items-center">
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

            <h1 className="fade-in mb-2">Revision Foundations</h1>
            <p className="fade-in text-xl md:text-2xl text-[var(--plum)] font-medium mb-4">
              Your Nursing Bestie for OSCEs & Exams
            </p>
            <p className="fade-in text-lg md:text-xl text-[var(--plum-dark)]/80 mb-10 max-w-2xl mx-auto">
              Know what to revise, how to revise, and feel confident walking into placements and assessments.
            </p>

            <div className="fade-in flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="btn-primary text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" /> Get Started - £4.99
              </Link>
              <Link href="/osce" className="btn-secondary text-lg px-8 py-4">
                <Play className="w-5 h-5" /> Try OSCE
              </Link>
              <Link href="/quiz" className="btn-secondary text-lg px-8 py-4">
                <Play className="w-5 h-5" /> Try Quiz
              </Link>
            </div>
          </div>
        </div>

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
            <h2 className="mb-4 text-[var(--plum-dark)]">What's Inside?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="mb-3 text-[var(--plum-dark)]">Children's OSCE Tool</h3>
              <p className="mb-6 text-[var(--plum-dark)]/70">Prepared for placements. 50+ stations.</p>
              <Link href="/osce" className="btn-primary w-full">Try OSCE Tool</Link>
            </div>
            <div className="card bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="mb-3 text-[var(--plum-dark)]">Core Nursing Quiz</h3>
              <p className="mb-6 text-[var(--plum-dark)]/70">17 topic areas for exam success.</p>
              <Link href="/quiz" className="btn-primary w-full">Try Quiz Tool</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-cream pb-24 relative">
        <Testimonials />
        
        {/* Corrected "Leave your own review" button */}
        <div className="flex justify-center -mt-16 mb-8 relative z-20">
          <Link 
            href="/review" 
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--lavender)]/30 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[var(--purple)]" />
            <span className="text-[var(--plum)]">Leave your own review</span>
            <Heart className="w-4 h-4 text-[var(--pink)]" />
          </Link>
        </div>
      </section>

      <footer className="bg-[var(--lilac)] py-12 text-center text-sm text-[var(--plum-dark)]/60">
        © 2025 Revision Foundations
      </footer>
    </div>
  );
}
