'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pageViews, setPageViews] = useState(1);
  const [readyToSurface, setReadyToSurface] = useState(false);
  const hideOnAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  const isHighIntentRoute =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/account') ||
    pathname?.startsWith('/hub/childrens') ||
    pathname?.startsWith('/hub/adult') ||
    pathname?.startsWith('/hub/resources');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentViews = Number.parseInt(window.sessionStorage.getItem('tnl_page_views') || '0', 10) + 1;
    window.sessionStorage.setItem('tnl_page_views', String(currentViews));
    setPageViews(currentViews);
  }, [pathname]);

  useEffect(() => {
    if (!isHighIntentRoute) {
      setReadyToSurface(false);
      return;
    }

    let timeoutId: number | null = window.setTimeout(() => {
      setReadyToSurface(true);
    }, 18000);

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress > 0.42) {
        setReadyToSurface(true);
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHighIntentRoute, pathname]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

      if (isLocalPreview) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            void registration.unregister();
          });
        });

        if ('caches' in window) {
          window.caches.keys().then((keys) => {
            keys.forEach((key) => {
              void window.caches.delete(key);
            });
          }).catch(() => {
            // Cache cleanup failed silently
          });
        }
      } else {
        navigator.serviceWorker
          .register('/sw.js', { updateViaCache: 'none' })
          .then((registration) => {
            void registration.update();
          })
          .catch(() => {
            // Service worker registration failed silently
          });
      }
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  useEffect(() => {
    if (!deferredPrompt || hideOnAuthPage || dismissed || !isHighIntentRoute || !readyToSurface || pageViews < 2) {
      return;
    }

    const dismissedBefore = localStorage.getItem('pwa-install-dismissed');
    if (!dismissedBefore) {
      setShowInstallBanner(true);
    }
  }, [deferredPrompt, dismissed, hideOnAuthPage, isHighIntentRoute, pageViews, readyToSurface]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (hideOnAuthPage || dismissed || !showInstallBanner) return null;

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-[21rem] z-50"
        >
          <div
            className="rounded-none p-4 shadow-2xl"
            style={{
              background: 'rgba(250,250,248,0.97)',
              border: '0.5px solid rgba(26,24,21,0.12)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 transition-colors"
              style={{ color: '#9A948C' }}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '2.6rem',
                  height: '2.6rem',
                  background: 'var(--surface-sunken)',
                }}
              >
                <Download className="w-5 h-5" style={{ color: 'var(--ink-strong)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    margin: '0 0 5px',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#9A948C',
                  }}
                >
                  App access
                </p>
                <h3
                  className="text-sm mb-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '22px',
                    lineHeight: 1.1,
                    fontWeight: 400,
                    color: 'var(--ink-strong)',
                    marginBottom: '8px',
                  }}
                >
                  Install The Nurse Lab
                </h3>
                <p
                  className="text-xs mb-3"
                  style={{
                    color: 'var(--ink-soft)',
                    lineHeight: 1.65,
                    marginBottom: '14px',
                  }}
                >
                  Keep your saved study space close to hand, especially when you are revising with patchy hospital WiFi or moving between placement and home.
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full px-4 py-2 text-sm transition-colors"
                  style={{
                    background: '#1A1815',
                    color: 'var(--surface-page)',
                  }}
                >
                  Install App
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
