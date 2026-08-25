'use client';

import { useEffect, useRef, useState } from 'react';

interface WorkoutRestTimerProps {
  compact?: boolean;
}

export function WorkoutRestTimer({ compact = false }: WorkoutRestTimerProps) {
  const [selectedSecs, setSelectedSecs] = useState<number>(90);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
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

  function handleSelectDuration(secs: number) {
    setIsRunning(false);
    setSelectedSecs(secs);
    setTimeLeft(secs);
    setIsCompleted(false);
  }

  function handleTogglePlay() {
    if (isCompleted) {
      setTimeLeft(selectedSecs);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(selectedSecs);
    setIsCompleted(false);
  }

  if (!mounted) return null;

  const progress = selectedSecs > 0 ? (selectedSecs - timeLeft) / selectedSecs : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formatted = `${mins}:${String(secs).padStart(2, '0')}`;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      style={{
        padding: compact ? '12px 14px' : '16px 20px',
        background: '#FFFFFF',
        border: '0.5px solid rgba(26,24,21,0.12)',
        borderRadius: '12px',
        marginTop: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isRunning ? '#C06C84' : isCompleted ? '#7F9289' : '#A29D95',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95' }}>
            Set Rest Timer
          </span>
        </div>
        <span style={{ fontSize: '11px', color: isCompleted ? '#C06C84' : '#8E8A82', fontWeight: isCompleted ? 600 : 400 }}>
          {isCompleted ? '✓ Rest complete! Next set' : isRunning ? 'Resting...' : 'Ready'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* SVG Ring & Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r={radius} stroke="rgba(26,24,21,0.08)" strokeWidth="4" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke={isCompleted ? '#7F9289' : '#C06C84'}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                color: 'var(--ink)',
              }}
            >
              {formatted}
            </div>
          </div>

          {/* Preset Pill Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[60, 90, 120, 180].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectDuration(s)}
                style={{
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: `0.5px solid ${selectedSecs === s ? '#C06C84' : 'rgba(26,24,21,0.12)'}`,
                  background: selectedSecs === s ? '#FAF0F3' : 'transparent',
                  color: selectedSecs === s ? '#8A4459' : '#8E8A82',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {s >= 60 ? `${s / 60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleTogglePlay}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 0,
              background: isRunning ? '#8E8A82' : '#C06C84',
              color: '#FFFFFF',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isRunning ? 'Pause' : isCompleted ? 'Restart Rest' : 'Start Rest'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '0.5px solid rgba(26,24,21,0.12)',
              background: 'transparent',
              color: '#8E8A82',
              fontSize: '11.5px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
