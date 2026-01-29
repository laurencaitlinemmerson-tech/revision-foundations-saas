'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function AboutPage() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Compact Hero */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-[var(--lilac-soft)] to-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="hero-center">
            <h1 className="animate-on-scroll brand-title brand-title-lg mb-2">
              Hey, I'm Lauren! 👋
            </h1>
            <p className="animate-on-scroll text-[var(--plum)] text-lg">
              The girl behind Revision Foundations
            </p>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Main Card */}
          <div className="card mb-8 animate-on-scroll">
            <div className="text-4xl mb-4">💜</div>
            <h3 className="mb-4">My Story</h3>
            <div className="space-y-4 text-[var(--plum-dark)]/80">
              <p>
                I'm a children's nursing student who got tired of searching for revision tools that actually worked for our course!
              </p>
              <p>
                So I made my own ✨
              </p>
              <p>
                These tools started as my personal study notes and checklists. When my coursemates kept asking to use them, I realised they might help other nursing students too.
              </p>
              <p>
                Everything here is made with love by just me - no big team, no fancy office. Just a nursing student who wants to help other nursing students succeed!
              </p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="grid grid-cols-2 gap-4 mb-8 animate-on-scroll">
            {[
              { emoji: '📚', text: "Children's Nursing Student" },
              { emoji: '🍒', text: 'Fuelled by Pepsi Max Cherry' },
              { emoji: '💜', text: 'Obsessed with purple' },
              { emoji: '✨', text: 'Making revision cute' },
            ].map((fact, i) => (
              <div key={i} className="card text-center py-4">
                <span className="text-2xl block mb-2">{fact.emoji}</span>
                <span className="text-sm text-[var(--plum-dark)]/70">{fact.text}</span>
              </div>
            ))}
          </div>

          {/* Why I Made This */}
          <div className="card mb-8 animate-on-scroll">
            <h3 className="mb-4">Why I Made This</h3>
            <ul className="space-y-3">
              {[
                'I wanted revision tools that were actually nice to look at',
                'OSCE prep was stressing me out and I needed a system',
                "I couldn't find anything specific to children's nursing",
                'I believe studying should be less painful!',
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--pink)]">♥</span>
                  <span className="text-[var(--plum-dark)]/80 text-sm">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Promise */}
          <div className="card-glass text-center mb-8 animate-on-scroll">
            <div className="text-3xl mb-3">🤙</div>
            <h3 className="text-lg mb-2">My Promise</h3>
            <p className="text-[var(--plum-dark)]/70 text-sm">
              No subscriptions, no sneaky fees. Pay once, use forever.
              And if you're not happy, just message me!
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[var(--plum-dark)]/60 text-sm mb-4">
              Questions? Want to say hi?
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-primary">
                <Heart className="w-4 h-4" />
                Get in Touch
              </Link>
              <Link href="/pricing" className="btn-secondary">
                <Sparkles className="w-4 h-4" />
                View Tools
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
