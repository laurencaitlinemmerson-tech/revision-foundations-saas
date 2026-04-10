'use client';

import { useEffect, useCallback, useState } from 'react';

interface UseReducedMotionReturn {
  prefersReducedMotion: boolean;
}

// Hook to detect if user prefers reduced motion
export function useReducedMotion(): UseReducedMotionReturn {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return { prefersReducedMotion };
}

// Hook for keyboard navigation
export function useKeyboardNav(
  items: number,
  options: {
    loop?: boolean;
    onSelect?: (index: number) => void;
    onEscape?: () => void;
    vertical?: boolean;
  } = {}
) {
  const { loop = true, onSelect, onEscape, vertical = true } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';

      switch (e.key) {
        case nextKey:
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev + 1;
            if (next >= items) {
              return loop ? 0 : prev;
            }
            return next;
          });
          break;
        case prevKey:
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev - 1;
            if (next < 0) {
              return loop ? items - 1 : prev;
            }
            return next;
          });
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(items - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(activeIndex);
          break;
        case 'Escape':
          onEscape?.();
          break;
      }
    },
    [items, loop, activeIndex, onSelect, onEscape, vertical]
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
}

// Hook for focus management
export function useFocusReturn() {
  const [previousElement, setPreviousElement] = useState<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    setPreviousElement(document.activeElement as HTMLElement);
  }, []);

  const restoreFocus = useCallback(() => {
    previousElement?.focus();
  }, [previousElement]);

  return { saveFocus, restoreFocus };
}
