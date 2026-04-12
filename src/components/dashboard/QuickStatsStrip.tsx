'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { STORAGE_KEYS } from '../DashboardWidgets';

interface SessionStats {
  totalSessions: number;
  totalQuestions: number;
  totalOsceStations: number;
  totalMocks?: number;
  weekSessions: number[];
  lastWeekTotal: number;
}

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[];
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!isInView) return;
    if (value === 0) { setDisplayed(0); return; }
    const duration = 900;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return <span ref={ref}>{displayed}</span>;
}

export default function QuickStatsStrip() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
    setStats(load<SessionStats>(STORAGE_KEYS.stats, {
      totalSessions: 0, totalQuestions: 0, totalOsceStations: 0, totalMocks: 0,
      weekSessions: Array(7).fill(0), lastWeekTotal: 0,
    }));
    const s = load<StudyStreak>(STORAGE_KEYS.streak, {
      currentStreak: 0, longestStreak: 0, lastStudyDate: '', studyDates: [],
    });
    // Invalidate stale streaks
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (s.lastStudyDate !== today && s.lastStudyDate !== yesterday) {
      s.currentStreak = 0;
    }
    setStreak(s);
  }, []);

  if (!mounted || !stats || !streak) return null;

  const thisWeek = stats.weekSessions.reduce((a, b) => a + b, 0);
  const metrics = [
    { value: streak.currentStreak, label: 'day streak', accent: '#8BBCAA' },
    { value: thisWeek, label: 'this week', accent: '#D4A574' },
    { value: stats.totalQuestions, label: 'questions', accent: '#7BA7CC' },
    { value: stats.totalOsceStations, label: 'stations', accent: '#C89BB0' },
    ...(stats.totalMocks !== undefined ? [{ value: stats.totalMocks, label: 'written practice', accent: '#D9A7A7' }] : []),
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="qs-strip"
    >
      {metrics.map((m, i) => (
        <div key={m.label} className="qs-item">
          <span className="qs-dot" style={{ background: m.accent }} />
          <p className="qs-value">
            <AnimatedCounter value={m.value} delay={i * 0.12} />
          </p>
          <p className="qs-label">{m.label}</p>
        </div>
      ))}
      <style>{`
        .qs-strip {
          display: flex;
          justify-content: space-between;
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
          margin-bottom: 8px;
          padding-bottom: 28px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }
        .qs-strip::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
        .qs-item {
          flex: 1;
          min-width: 90px;
          text-align: center;
          padding: 0 12px;
          position: relative;
        }
        .qs-item:not(:first-child)::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 0.5px;
          background: rgba(0,0,0,0.06);
        }
        .qs-dot {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin: 0 auto 10px;
        }
        .qs-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.2rem;
          font-style: italic;
          line-height: 1;
          color: #1A1815;
          margin: 0 0 6px;
        }
        .qs-label {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9C8878;
          margin: 0;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .qs-strip {
            justify-content: flex-start;
          }
          .qs-item {
            flex: 0 0 auto;
          }

          .qs-item:nth-child(3)::before {
            display: none;
          }
          .qs-value {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </motion.div>
  );
}
