'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface UserAccess {
  hasOsce: boolean;
  hasQuiz: boolean;
  hasBundle: boolean;
  isPro: boolean; // has any paid access
  isLoading: boolean;
}

export function useEntitlements(): UserAccess {
  const { isSignedIn, isLoaded } = useUser();
  const [access, setAccess] = useState<Omit<UserAccess, 'isLoading'>>({
    hasOsce: false,
    hasQuiz: false,
    hasBundle: false,
    isPro: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setAccess({ hasOsce: false, hasQuiz: false, hasBundle: false, isPro: false });
      setIsLoading(false);
      return;
    }

    // Check all entitlements
    const checkAccess = async () => {
      try {
        const [osceRes, quizRes] = await Promise.all([
          fetch('/api/check-access?product=osce'),
          fetch('/api/check-access?product=quiz'),
        ]);

        const [osceData, quizData] = await Promise.all([
          osceRes.json(),
          quizRes.json(),
        ]);

        const hasOsce = osceData.hasAccess;
        const hasQuiz = quizData.hasAccess;
        const hasBundle = hasOsce && hasQuiz;
        const isPro = hasOsce || hasQuiz;

        setAccess({ hasOsce, hasQuiz, hasBundle, isPro });
      } catch (error) {
        console.error('Error checking entitlements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isSignedIn, isLoaded]);

  return { ...access, isLoading };
}
