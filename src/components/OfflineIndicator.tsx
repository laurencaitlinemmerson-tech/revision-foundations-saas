'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Show reconnected message briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 
        px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300
        ${isOnline 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">You&apos;re back online!</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">You&apos;re offline. Some features may be unavailable.</span>
        </>
      )}
    </div>
  );
}
