'use client';

import type { ToastType } from '@/lib/bookmarks/types';

type ToastHandler = (message: string, type?: ToastType) => void;

let toastHandler: ToastHandler | null = null;

export function registerToastHandler(handler: ToastHandler | null) {
  toastHandler = handler;
}

export function showToast(message: string, type: ToastType = 'info') {
  if (typeof window === 'undefined') {
    return;
  }

  if (toastHandler) {
    toastHandler(message, type);
    return;
  }

  console[type === 'error' ? 'error' : 'log'](message);
}
