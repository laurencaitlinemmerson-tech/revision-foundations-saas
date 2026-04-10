'use client';

import { ReactNode, useEffect, useEffectEvent } from 'react';

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalShell({ isOpen, title, onClose, children }: ModalShellProps) {
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/28 backdrop-blur-[10px]"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="relative p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
