'use client';

import { useEffect } from 'react';
import { useReducedMotion } from './useAccessibility';

/**
 * Hook to trigger scroll-based animations using IntersectionObserver.
 * Elements with `.animate-on-scroll` class will get `data-animate="in"` when visible.
 */
export function useScrollAnimation(threshold = 0.1) {
  const { prefersReducedMotion } = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        (el as HTMLElement).dataset.animate = 'in';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.animate = 'in';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold]);
}
