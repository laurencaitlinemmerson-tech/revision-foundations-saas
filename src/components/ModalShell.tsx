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
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden border border-[rgba(0,0,0,0.1)] bg-white"
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
