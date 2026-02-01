'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Hook to detect mobile device
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// Hook for touch detection and gestures
export function useTouch() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
}

// Hook for swipe gestures
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.screenX ?? 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0]?.screenX ?? 0;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

// Hook for viewport dimensions
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isPortrait: true,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isPortrait: window.innerHeight > window.innerWidth,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
}

// Safe area insets hook for notched devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const style = getComputedStyle(document.documentElement);
    
    setSafeArea({
      top: parseInt(style.getPropertyValue('--sat') || '0', 10),
      right: parseInt(style.getPropertyValue('--sar') || '0', 10),
      bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
      left: parseInt(style.getPropertyValue('--sal') || '0', 10),
    });
  }, []);

  return safeArea;
}

// Pull to refresh hook
export function usePullToRefresh(onRefresh: () => Promise<void>, threshold: number = 80) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0]?.clientY ?? 0;
      setIsPulling(true);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const currentY = e.touches[0]?.clientY ?? 0;
    const diff = currentY - startY.current;
    
    if (diff > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
    }
  }, [isPulling, isRefreshing, threshold]);

  const onTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, onRefresh, isRefreshing]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
