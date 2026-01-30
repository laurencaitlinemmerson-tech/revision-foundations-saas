'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants } from 'framer-motion';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export default function DashboardClient({ children, firstName }: DashboardClientProps) {
  useScrollAnimation();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ✅ Cleaner / smaller hero */}
      <section
        className="
          relative overflow-hidden
          pt-14 md:pt-16
          pb-10 md:pb-12
        "
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lilac-soft)] via-[var(--cream)] to-[var(--pink-soft)]/30" />

        {/* ✅ Smaller + subtler orbs */}
        <motion.div
          className="absolute top-8 right-[10%] w-52 h-52 bg-gradient-to-br from-[var(--lavender)]/28 to-[var(--pink)]/18 rounded-full blur-3xl"
          animate={{ scale: [1, 1.12, 1], x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-10 left-[6%] w-44 h-44 bg-gradient-to-br from-[var(--purple)]/16 to-[var(--lavender)]/24 rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], x: [0, -12, 0], y: [0, 14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* ✅ Push hero content LOWER */}
          <motion.div
            className="flex items-center justify-between gap-6 pt-8 md:pt-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="min-w-0">
              <h1 className="hero-title mb-2">
                <span className="gradient-text">Hey, {firstName}!</span>
              </h1>

              <p className="text-[var(--plum-dark)]/70 text-base md:text-lg mb-3">
                Ready to smash your revision today?
              </p>

              <motion.div
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[var(--lavender)]/30 rounded-full px-4 py-1.5"
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-4 h-4 text-[var(--purple)]" />
                <span className="text-sm text-[var(--plum)]">{greeting}</span>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0">
              {/* ✅ Smaller + cleaner button */}
              <Link
                href="/hub"
                className="btn-primary inline-flex items-center gap-2 group px-5 py-2.5 text-sm"
              >
                <span>Go to Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Modest gap below hero */}
      <motion.main
        className="px-6 pb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto space-y-8 pt-4 md:pt-6">
          {children}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
