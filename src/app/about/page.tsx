'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

export default function AboutPage() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--pink-soft)]/30 to-cream relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.2 }} />
        <div className="blob blob-2" style={{ opacity: 0.2 }} />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="hero-title mb-4">
              <span className="gradient-text">Hey, I'm Lauren</span> 👋
            </h1>
            
            <p className="text-[var(--plum-dark)]/70 text-lg">
              Children's nursing student & creator of Revision Foundations
            </p>
          </motion.div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Main Story */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="card">
              <div className="space-y-4 text-[var(--plum-dark)]/80">
                <p>
                  I used to be a medical photographer – spent years in hospitals behind a camera. 
                  It was cool, but it never quite felt like <em>my thing</em>. So at 25, I decided 
                  to make a change and start nursing. Best decision ever.
                </p>
                <p>
                  Now I'm a children's nursing student and honestly loving it. But one thing that 
                  drove me mad? Trying to find decent revision resources. Everything was either 
                  boring, outdated, or ridiculously expensive.
                </p>
                <p>
                  So I started making my own. I shared them with my coursemates and they actually 
                  found them useful – that's when I thought... maybe other nursing students need 
                  this too? 💡
                </p>
                <p>
                  That's how Revision Foundations was born – study tools that are actually nice 
                  to look at, made by a student who gets it.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Quick Facts */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: '👶', label: 'Paeds Student' },
                { emoji: '🍒', label: 'Pepsi Max Cherry' },
                { emoji: '💜', label: 'Purple Everything' },
                { emoji: '✨', label: 'Design Nerd' },
              ].map((fact, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/60 rounded-2xl p-4 text-center"
                >
                  <span className="text-2xl block mb-1">{fact.emoji}</span>
                  <span className="text-xs font-medium text-[var(--plum-dark)]/70">{fact.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Promise */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="card-glass text-center">
              <Sparkles className="w-8 h-8 text-[var(--lavender)] mx-auto mb-3" />
              <h2 className="text-lg text-[var(--plum)] mb-4">What you can expect</h2>
              <div className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <p><strong className="text-[var(--plum)]">No subscriptions</strong> – pay once, yours forever</p>
                <p><strong className="text-[var(--plum)]">Made by a student</strong> – I know the struggle</p>
                <p><strong className="text-[var(--plum)]">Always improving</strong> – I use these tools too!</p>
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[var(--plum-dark)]/60 text-sm mb-4">
              Questions? Just want to chat? I'd love to hear from you 💜
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn-primary">
                <Heart className="w-4 h-4" />
                Get in Touch
              </Link>
              <Link href="/hub" className="btn-secondary">
                <Sparkles className="w-4 h-4" />
                Explore the Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
