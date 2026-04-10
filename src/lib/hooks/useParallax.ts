'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ParallaxOptions {
  speed?: number; // 0-1, where 0.5 is half speed
  direction?: 'up' | 'down';
}

/**
 * useParallax - Creates smooth parallax scrolling effect
 * Inspired by Red Bull's scroll UX
 */
export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    
    const scrollY = window.scrollY;
    const multiplier = direction === 'up' ? -1 : 1;
    setOffset(scrollY * speed * multiplier);
  }, [speed, direction]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { ref, offset };
}

/**
 * useScrollProgress - Returns scroll progress through an element (0-1)
 */
export function useScrollProgress() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress from when element is at bottom of viewport to when it's at top
      const start = windowHeight;
      const end = -elementHeight;
      const current = elementTop;
      
      const rawProgress = (start - current) / (start - end);
      setProgress(Math.max(0, Math.min(1, rawProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

/**
 * useScrollReveal - Reveals elements as they scroll into view with stagger
 */
export function useScrollReveal(threshold = 0.1) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show all elements immediately if reduced motion is preferred
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold]);
}
