'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

const serif = "var(--font-body)";
const display = "var(--font-display)";
const ink = "var(--espresso)";
const mid = "var(--charcoal)";
const muted = "var(--charcoal-light)";
const border = "var(--border)";

interface InteractiveFocusTimerProps {
  compact?: boolean;
}

export default function InteractiveFocusTimer({ compact = false }: InteractiveFocusTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [todayFocusSeconds, setTodayFocusSeconds] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persistent stats
  useEffect(() => {
    setMounted(true);
    try {
      const savedStats = localStorage.getItem('rf_focus_seconds_today');
      const todayKey = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('rf_focus_date');
      if (savedDate === todayKey && savedStats) {
        setTodayFocusSeconds(parseInt(savedStats, 10) || 0);
      } else {
        localStorage.setItem('rf_focus_date', todayKey);
        localStorage.setItem('rf_focus_seconds_today', '0');
      }
    } catch {}
  }, []);

  // Handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            triggerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  function triggerCompletion() {
    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8BBCAA', '#D4A574', '#C89BB0', '#7BA7CC'],
      });
    } catch {}

    // Track completed seconds
    const addedSeconds = selectedMinutes * 60;
    setTodayFocusSeconds((prev) => {
      const next = prev + addedSeconds;
      try {
        localStorage.setItem('rf_focus_seconds_today', next.toString());
      } catch {}
      return next;
    });
  }

  function handleSelectDuration(mins: number) {
    if (isRunning) setIsRunning(false);
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsCompleted(false);
  }

  function handleTogglePlay() {
    if (isCompleted) {
      setTimeLeft(selectedMinutes * 60);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setIsCompleted(false);
  }

  if (!mounted) return null;

  const totalSeconds = selectedMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const todayMinutes = Math.round(todayFocusSeconds / 60);

  // SVG Ring calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      style={{
        background: 'var(--surface-raised, #FFFFFF)',
        border: '0.5px solid var(--hairline-firm, rgba(0,0,0,0.12))',
        padding: compact ? '16px 18px' : '22px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isRunning ? '#6B9E87' : isCompleted ? '#D4A574' : 'rgba(0,0,0,0.25)',
              display: 'inline-block',
              boxShadow: isRunning ? '0 0 8px rgba(107,158,135,0.6)' : 'none',
              transition: 'all 0.3s ease',
            }}
          />
          <p
            style={{
              fontFamily: serif,
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: muted,
              margin: 0,
            }}
          >
            Focus Sprint Timer
          </p>
        </div>
        {todayMinutes > 0 && (
          <span
            style={{
              fontFamily: serif,
              fontSize: '10.5px',
              color: '#6B9E87',
              background: 'rgba(107,158,135,0.1)',
              padding: '3px 9px',
              borderRadius: '999px',
              fontWeight: 500,
            }}
          >
            ⚡ {todayMinutes}m logged today
          </span>
        )}
      </div>

      {/* Main Grid: Radial Timer + Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'auto 1fr',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {/* Radial Visual Indicator */}
        <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto' }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={isCompleted ? '#6B9E87' : 'var(--espresso, #1A1815)'}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: display,
                fontSize: '1.45rem',
                fontStyle: 'italic',
                color: ink,
                lineHeight: 1,
              }}
            >
              {formattedTime}
            </span>
            <span
              style={{
                fontFamily: serif,
                fontSize: '9px',
                color: muted,
                marginTop: '3px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {isRunning ? 'Running' : isCompleted ? 'Complete!' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls & Preset Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Presets */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[5, 15, 25].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectDuration(m)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  border: `0.5px solid ${selectedMinutes === m ? ink : 'rgba(0,0,0,0.12)'}`,
                  background: selectedMinutes === m ? ink : 'transparent',
                  color: selectedMinutes === m ? 'white' : mid,
                  fontFamily: serif,
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {m} min
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleTogglePlay}
              style={{
                flex: 2,
                padding: '9px 14px',
                border: 'none',
                background: isRunning ? '#D4A574' : ink,
                color: 'white',
                fontFamily: serif,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s ease',
              }}
            >
              <span>{isRunning ? '⏸ Pause' : isCompleted ? '🔄 Start Again' : '▶ Start Focus'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: '0.5px solid rgba(0,0,0,0.12)',
                background: 'transparent',
                color: mid,
                fontFamily: serif,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
