'use client';

import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className={`${sizeClasses[size]} animate-spin text-[var(--purple)]`}>
        <Sparkles className="w-full h-full" />
      </div>
      {text && (
        <p className="text-sm text-[var(--plum-dark)]/70">{text}</p>
      )}
      <span className="sr-only">Loading{text ? `: ${text}` : '...'}</span>
    </div>
  );
}

// Skeleton loading component for content placeholders
export function Skeleton({ 
  className = '',
  variant = 'text',
}: { 
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}) {
  const baseClasses = 'skeleton animate-pulse';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

// Card skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4" aria-hidden="true">
      <Skeleton variant="rectangular" className="w-16 h-16" />
      <Skeleton className="w-3/4" />
      <Skeleton className="w-full" />
      <Skeleton className="w-full" />
      <Skeleton className="w-1/2" />
    </div>
  );
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-cream py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="w-1/3 h-10 mx-auto" />
        <Skeleton className="w-2/3 h-6 mx-auto" />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
