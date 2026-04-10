'use client';

import { X, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import type { ToastType } from '@/lib/bookmarks/types';

interface BookmarkToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const styleMap = {
  success: 'bg-emerald-50/95 text-emerald-900 border border-emerald-200',
  error: 'bg-red-50/95 text-red-900 border border-red-200',
  info: 'bg-white/95 text-[var(--espresso)] border border-[var(--linen-deep)]',
} as const;

export default function BookmarkToast({ message, type, onDismiss }: BookmarkToastProps) {
  const Icon = iconMap[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${styleMap[type]}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-sm font-medium leading-6">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto rounded-full p-1 transition hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
