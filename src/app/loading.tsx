import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div 
      className="min-h-screen bg-cream flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[var(--lilac)]" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--purple)] animate-spin" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[var(--purple)] animate-pulse" aria-hidden="true" />
          </div>
        </div>
        <p className="text-[var(--plum)] font-medium">Loading...</p>
        <span className="sr-only">Please wait while the page loads</span>
      </div>
    </div>
  );
}
