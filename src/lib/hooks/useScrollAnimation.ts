'use client';

import { useEffect } from 'react';

/**
 * Hook to trigger scroll-based animations using IntersectionObserver.
 * Elements with `.animate-on-scroll` class will get `data-animate="in"` when visible.
 */
export function useScrollAnimation(threshold = 0.1) {
  useEffect(() => {
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
  }, [threshold]);
}
