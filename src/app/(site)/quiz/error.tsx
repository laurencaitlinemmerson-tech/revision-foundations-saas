'use client';

import Link from 'next/link';

export default function QuizError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <p style={{
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: 'var(--ink-faint)',
          marginBottom: '14px',
        }}>
          Quiz Tool
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '28px',
          fontWeight: 400,
          color: 'var(--ink-strong)',
          marginBottom: '12px',
        }}>
          Something went wrong loading the quiz.
        </h1>
        <p style={{
          fontSize: '14px',
          fontWeight: 300,
          color: 'var(--ink-soft)',
          lineHeight: 1.7,
          marginBottom: '24px',
        }}>
          Try refreshing, or head back to the hub and come back in a moment.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <button onClick={reset} style={{
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            background: '#1A1815',
            color: 'var(--surface-page)',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Try again
          </button>
          <Link href="/hub" style={{
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            background: 'transparent',
            color: 'var(--ink-strong)',
            border: '0.5px solid var(--hairline-firm)',
            padding: '10px 20px',
            textDecoration: 'none',
          }}>
            Back to hub
          </Link>
        </div>
      </div>
    </div>
  );
}
