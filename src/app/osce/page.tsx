'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft, Play, Clock } from 'lucide-react';

const PREVIEW_TIME = 180; // 3 minutes

export default function OscePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [hasPremium, setHasPremium] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PREVIEW_TIME);
  const [previewExpired, setPreviewExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkPremium = async () => {
      if (!isLoaded) return;
      if (isSignedIn) {
        try {
          const res = await fetch('/api/check-access?product=osce');
          const data = await res.json();
          setHasPremium(data.hasAccess);
        } catch {
          setHasPremium(false);
        }
      }
      setChecking(false);
    };
    checkPremium();
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (showPreview && !hasPremium && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPreviewExpired(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPreview, hasPremium, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-dark)] text-lg">Loading...</div>
      </div>
    );
  }

  if (hasPremium) {
    return (
      <iframe
        src="/apps/osce.html"
        className="w-full border-0 fixed inset-0"
        style={{ height: '100vh', width: '100vw' }}
        title="Children's OSCE Tool"
      />
    );
  }

  if (previewExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-sm text-center">
          <div className="text-5xl mb-5">⏰</div>
          <h2 className="text-xl mb-3 text-[var(--text-dark)]">Preview Ended!</h2>
          <p className="text-[var(--text-medium)] text-sm mb-6">
            Your free preview has finished. Unlock to keep using the OSCE Tool!
          </p>
          <div className="space-y-3">
            <Link href="/pricing?product=osce" className="btn-primary w-full">
              <Sparkles className="w-5 h-5" />
              Unlock for £4.99
            </Link>
            <Link href="/" className="btn-secondary w-full">
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[var(--lavender-dark)] to-[var(--pink-dark)] text-white py-3 px-4 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sparkle" />
              <span className="font-medium">Free Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Link
                href="/pricing?product=osce"
                className="bg-white text-[var(--purple-accent)] px-4 py-1.5 rounded-full font-semibold hover:bg-white/90 transition text-sm shadow-md"
              >
                Unlock Full Access
              </Link>
            </div>
          </div>
        </div>
        <iframe
          src="/apps/osce.html"
          className="w-full border-0 fixed left-0 right-0 bottom-0"
          style={{ top: '52px', height: 'calc(100vh - 52px)' }}
          title="Children's OSCE Tool"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-sm text-center">
        <div className="text-5xl mb-5">📋</div>
        <h2 className="text-xl mb-3 text-[var(--text-dark)]">Children's OSCE Tool</h2>
        <p className="text-[var(--text-medium)] text-sm mb-6">
          Practice all OSCE stations with detailed checklists and step-by-step guidance!
        </p>
        <div className="space-y-3">
          <Link href="/pricing?product=osce" className="btn-primary w-full">
            <Sparkles className="w-5 h-5" />
            Unlock for £4.99
          </Link>
          <button onClick={() => setShowPreview(true)} className="btn-secondary w-full">
            <Play className="w-4 h-4" />
            Try 3-Min Preview
          </button>
          <Link href="/" className="text-sm text-[var(--text-light)] hover:text-[var(--purple-accent)] inline-flex items-center gap-1 mt-3 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
