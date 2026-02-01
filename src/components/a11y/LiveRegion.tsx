'use client';

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

// Announces dynamic content changes to screen readers
export default function LiveRegion({ 
  message, 
  politeness = 'polite',
  clearAfter = 5000 
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      
      if (clearAfter > 0) {
        const timer = setTimeout(() => setAnnouncement(''), clearAfter);
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
