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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function DashboardClient({ children, firstName }: DashboardClientProps) {
  useScrollAnimation();

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      {/* Premium Hero with Gradient Orbs */}
      <section className="pt-8 pb-6 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lilac-soft)] via-[var(--cream)] to-[var(--pink-soft)]/30" />
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-10 right-[10%] w-64 h-64 bg-gradient-to-br from-[var(--lavender)]/30 to-[var(--pink)]/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-[5%] w-48 h-48 bg-gradient-to-br from-[var(--purple)]/20 to-[var(--lavender)]/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[var(--lavender)]/30 rounded-full px-4 py-1.5 mb-2"
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-4 h-4 text-[var(--purple)]" />
                <span className="text-sm text-[var(--plum)]">{greeting}</span>
              </motion.div>
              <h1 className="hero-title mb-1">
                <span className="gradient-text">Hey, {firstName}!</span>
              </h1>
              <p className="text-[var(--plum-dark)]/70 text-lg">
                Ready to smash your revision today?
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                href="/hub" 
                className="btn-primary inline-flex items-center gap-2 group"
              >
                <span>Go to Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.main 
        className="px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto space-y-4">
          {children}
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
}
