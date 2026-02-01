'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full
        bg-gradient-to-br from-[var(--purple)] to-[var(--lavender-dark)]
        text-white shadow-lg
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl
        focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--lavender)]
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
