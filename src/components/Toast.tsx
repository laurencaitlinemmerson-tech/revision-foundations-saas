'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm
              animate-in slide-in-from-right-5 fade-in duration-300
              ${toast.type === 'success' ? 'bg-emerald-50/95 text-emerald-800 border border-emerald-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50/95 text-red-800 border border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-white/95 text-[var(--plum)] border border-[var(--lavender)]' : ''}
            `}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
