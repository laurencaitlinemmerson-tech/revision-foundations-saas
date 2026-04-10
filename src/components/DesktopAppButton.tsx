'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface DesktopAppButtonProps {
  className?: string;
  href?: string;
  label: string;
  style?: CSSProperties;
  title?: string;
}

export default function DesktopAppButton({
  className,
  href = '/how-to-use#desktop-app',
  label,
  style,
  title,
}: DesktopAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!deferredPrompt) return;

    event.preventDefault();

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (outcome === 'dismissed') {
        window.location.assign(href);
      }
    } catch {
      setDeferredPrompt(null);
      window.location.assign(href);
    }
  };

  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
      style={style}
      title={title}
    >
      {label}
    </a>
  );
}
