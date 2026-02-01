'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, MessageCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
    
    // You could also send to an error tracking service here
    // e.g., Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div 
      className="min-h-screen bg-cream flex items-center justify-center px-6"
      role="alert"
      aria-labelledby="error-heading"
    >
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4" aria-hidden="true">😅</div>
        <h1 
          id="error-heading"
          className="text-3xl font-display text-[var(--plum-dark)] mb-3"
        >
          Something went wrong
        </h1>
        <p className="text-[var(--plum)] mb-4">
          Don&apos;t worry, it happens! Let&apos;s try that again.
        </p>
        
        {/* Show error digest in development for debugging */}
        {error.digest && (
          <p className="text-xs text-[var(--plum-dark)]/50 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button 
            onClick={reset} 
            className="btn-primary inline-flex items-center gap-2"
            aria-label="Try loading the page again"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link 
            href="/" 
            className="btn-secondary inline-flex items-center gap-2 justify-center"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
        
        <p className="text-sm text-[var(--plum-dark)]/60">
          Still having issues?{' '}
          <a 
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--purple)] hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" aria-hidden="true" />
            Contact Lauren
          </a>
        </p>
      </div>
    </div>
  );
}
