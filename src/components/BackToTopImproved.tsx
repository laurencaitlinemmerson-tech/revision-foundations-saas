'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopImproved() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          
          setIsVisible(scrollTop > 400);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full 
        bg-white shadow-lg border border-[var(--lilac)]
        flex items-center justify-center
        hover:shadow-xl hover:scale-105 
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple)]"
      aria-label={`Back to top. ${Math.round(scrollProgress)}% scrolled`}
      style={{
        background: `conic-gradient(var(--purple) ${scrollProgress}%, var(--lilac-soft) ${scrollProgress}%)`,
      }}
    >
      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
        <ArrowUp className="w-5 h-5 text-[var(--purple)]" aria-hidden="true" />
      </span>
    </button>
  );
}
