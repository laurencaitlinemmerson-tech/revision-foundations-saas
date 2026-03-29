'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Sparkles, ArrowLeft, Play, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { saveLastActivity, recordSessionStart } from '@/components/DashboardWidgets';

const PREVIEW_TIME = 180;

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const paper = '#F7F2E8';
const border = '#D9D0C1';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const bodyText: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 1.9,
  fontWeight: 300,
  color: inkMid,
};

export default function QuizPage() {
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
          const res = await fetch('/api/check-access?product=quiz');
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

  useEffect(() => {
    if (hasPremium || showPreview) {
      recordSessionStart('quiz');
      saveLastActivity({
        toolName: 'quiz',
        path: '/quiz',
        label: 'Core Quiz Practice',
      });
    }
  }, [hasPremium, showPreview]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLoaded || checking) {
    return (
      <div style={{ background: cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: serif, color: inkMid, fontSize: '16px' }}>Loading…</p>
      </div>
    );
  }

  if (hasPremium) {
    return (
      <iframe
        src="/apps/quiz.html"
        className="w-full border-0 fixed inset-0"
        style={{ height: '100vh', width: '100vw' }}
        title="Core Nursing Quiz"
      />
    );
  }

  if (previewExpired) {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
          <div style={{
            background: parchment,
            border: `1px solid ${border}`,
            borderRadius: '28px',
            padding: '48px 44px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}>
            <p style={sectionLabel}>Preview ended</p>
            <p style={{
              fontFamily: display,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              lineHeight: 1.15,
              color: ink,
              marginBottom: '12px',
            }}>
              Your 3 minutes are up.
            </p>
            <p style={{ ...bodyText, fontSize: '15px', marginBottom: '32px' }}>
              Unlock the full quiz to keep going — 17 topics, instant feedback, and detailed explanations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/pricing?product=quiz" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: serif, fontSize: '15px', color: cream,
                background: ink, border: 'none', borderRadius: '12px',
                padding: '14px 24px', textDecoration: 'none',
              }}>
                <Sparkles style={{ width: '16px', height: '16px' }} />
                Unlock for £4.99
              </Link>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: serif, fontSize: '14px', color: inkMid,
                background: paper, border: `1px solid ${border}`, borderRadius: '12px',
                padding: '13px 24px', textDecoration: 'none',
              }}>
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                Back home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="relative">
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: ink, color: cream,
          padding: '10px 20px', zIndex: 50,
        }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: serif, fontSize: '13px', color: 'rgba(249,246,240,0.7)' }}>
              Free preview
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: "'Courier New', monospace", fontSize: '13px', fontWeight: 600,
                background: 'rgba(249,246,240,0.12)', padding: '4px 12px', borderRadius: '999px',
              }}>
                <Clock style={{ width: '13px', height: '13px' }} />
                {formatTime(timeLeft)}
              </div>
              <Link href="/pricing?product=quiz" style={{
                fontFamily: serif, fontSize: '13px', color: ink,
                background: cream, padding: '5px 14px', borderRadius: '999px',
                textDecoration: 'none', fontWeight: 500,
              }}>
                Unlock full access
              </Link>
            </div>
          </div>
        </div>
        <iframe
          src="/apps/quiz.html"
          className="w-full border-0 fixed left-0 right-0 bottom-0"
          style={{ top: '44px', height: 'calc(100vh - 44px)' }}
          title="Core Nursing Quiz"
        />
      </div>
    );
  }

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
        <div style={{
          background: parchment,
          border: `1px solid ${border}`,
          borderRadius: '28px',
          padding: '48px 44px',
          maxWidth: '420px',
          width: '100%',
        }}>
          <p style={sectionLabel}>Core Quiz Practice</p>
          <p style={{
            fontFamily: display,
            fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
            lineHeight: 1.12,
            color: ink,
            marginBottom: '12px',
          }}>
            Core Nursing Quiz
          </p>
          <p style={{ ...bodyText, fontSize: '15px', marginBottom: '32px' }}>
            17 topics, instant feedback, and detailed explanations to help you ace your exams.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/pricing?product=quiz" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: serif, fontSize: '15px', color: cream,
              background: ink, borderRadius: '12px',
              padding: '14px 24px', textDecoration: 'none',
            }}>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Unlock for £4.99
            </Link>
            <button onClick={() => setShowPreview(true)} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: serif, fontSize: '14px', color: inkMid,
              background: paper, border: `1px solid ${border}`, borderRadius: '12px',
              padding: '13px 24px', cursor: 'pointer',
            }}>
              <Play style={{ width: '14px', height: '14px' }} />
              Try 3-min preview
            </button>
            <Link href="/" style={{
              fontFamily: serif, fontSize: '13px', color: inkLight,
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              textDecoration: 'none', marginTop: '4px',
            }}>
              <ArrowLeft style={{ width: '12px', height: '12px' }} />
              Back home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
