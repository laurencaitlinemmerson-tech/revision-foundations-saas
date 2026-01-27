'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="badge badge-purple mb-4">
              <Heart className="w-3.5 h-3.5" />
              About
            </span>
            <h1 className="mb-4 text-[var(--text-dark)]">Hey, I'm Lauren! 👋</h1>
            <p className="text-[var(--text-medium)]">
              The girl behind Revision Foundations
            </p>
          </div>

          {/* Main Card */}
          <div className="card mb-8">
            <div className="text-5xl mb-5">💜</div>
            <h3 className="mb-4 text-[var(--text-dark)]">My Story</h3>
            <div className="space-y-4 text-[var(--text-medium)] leading-relaxed">
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
                Everything here is made with love (and lots of coffee ☕) by just me - no big team, no fancy office. Just a nursing student who wants to help other nursing students succeed!
              </p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { emoji: '📚', text: "Children's Nursing Student" },
              { emoji: '☕', text: 'Fuelled by coffee' },
              { emoji: '💜', text: 'Obsessed with purple' },
              { emoji: '✨', text: 'Making revision cute' },
            ].map((fact, i) => (
              <div key={i} className="card text-center py-5">
                <span className="text-3xl block mb-3">{fact.emoji}</span>
                <span className="text-sm text-[var(--text-medium)]">{fact.text}</span>
              </div>
            ))}
          </div>

          {/* Why I Made This */}
          <div className="card mb-8">
            <h3 className="mb-5 text-[var(--text-dark)]">Why I Made This</h3>
            <ul className="space-y-4">
              {[
                'I wanted revision tools that were actually nice to look at',
                'OSCE prep was stressing me out and I needed a system',
                "I couldn't find anything specific to children's nursing",
                'I believe studying should be less painful!',
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--pink-dark)] text-lg">♥</span>
                  <span className="text-[var(--text-medium)] text-sm">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Promise */}
          <div className="card text-center mb-8">
            <div className="text-4xl mb-4">🤙</div>
            <h3 className="text-lg mb-3 text-[var(--text-dark)]">My Promise</h3>
            <p className="text-[var(--text-medium)] text-sm">
              No subscriptions, no sneaky fees. Pay once, use forever.
              And if you're not happy, just message me!
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[var(--text-light)] text-sm mb-5">
              Questions? Want to say hi?
            </p>
            <div className="flex gap-4 justify-center">
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
    </div>
  );
}
