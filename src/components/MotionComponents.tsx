'use client';

import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode, useState, useEffect } from 'react';

// ============ Animation Variants ============

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// ============ Motion Components ============

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fadeInUp' | 'fadeIn' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
}

const variants: Record<string, Variants> = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
};

export function AnimateOnScroll({ 
  children, 
  className = '', 
  delay = 0,
  variant = 'fadeInUp' 
}: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}

// ============ Horizontal Scroll Section ============

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function HorizontalScrollSection({ children, className = '', id }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Must call useTransform unconditionally (React hooks rules)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66%']);

  // Mobile: Simple vertical stacked layout
  if (isMobile) {
    return (
      <section id={id} className={`py-16 px-4 ${className}`}>
        <div className="flex flex-col gap-6 max-w-lg mx-auto">
          {children}
        </div>
      </section>
    );
  }

  // Desktop: Horizontal scroll animation
  return (
    <section ref={containerRef} id={id} className={`relative ${className}`} style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div 
          className="flex gap-8 pl-[10vw]"
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function HorizontalCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div 
      className={`flex-shrink-0 w-full md:w-[45vw] lg:w-[35vw] ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ============ Parallax Components ============

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxSection({ children, offset = 50, className = '' }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ============ Text Reveal Animation ============

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className = '' }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const words = text.split(' ');
  
  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.5, 
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ============ Floating Elements ============

interface FloatingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  y?: number;
}

export function FloatingElement({ children, className = '', duration = 3, y = 10 }: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{ 
        y: [-y, y, -y],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

// ============ Counter Animation ============

interface CounterProps {
  target: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export function AnimatedCounter({ target, duration = 2, className = '', suffix = '' }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useTransform(
    useScroll({ target: ref }).scrollYProgress,
    [0, 0.5],
    [0, target]
  );
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span>{isInView ? target : 0}</motion.span>
      {suffix}
    </motion.span>
  );
}

// ============ Magnetic Button ============

interface MagneticProps {
  children: ReactNode;
  className?: string;
}

export function MagneticButton({ children, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };
  
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  };
  
  return (
    <motion.div
      ref={ref}
      className={`transition-transform duration-200 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// ============ Scroll Progress Indicator ============

export function ScrollProgress({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)] origin-left z-50 ${className}`}
      style={{ scaleX: scrollYProgress }}
    />
  );
}
