'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentPages, type RecentPage } from '@/lib/dashboardTracking';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const bodyColor = '#2C2A27';
const muted = '#999';
const border = 'rgba(0,0,0,0.1)';
const borderMid = 'rgba(0,0,0,0.12)';

export default function RecentPagesStrip() {
  const [pages, setPages] = useState<RecentPage[]>([]);

  useEffect(() => {
    setPages(getRecentPages());
  }, []);

  if (pages.length === 0) {
    return (
      <p style={{ fontFamily: serif, fontSize: '12px', color: muted, fontWeight: 300 }}>
        Pages you visit will appear here for quick access.
      </p>
    );
  }

  const accentForHref = (href: string) => {
    if (href.startsWith('/hub')) return 'var(--sage-200)';
    if (href.startsWith('/osce')) return 'var(--teal-50)';
    if (href.startsWith('/quiz')) return 'var(--blue-50)';
    return 'transparent';
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontFamily: serif, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, flexShrink: 0 }}>
        Recent
      </span>
      {pages.map(page => (
        <Link
          key={page.href}
          href={page.href}
          className="rps-chip"
          style={{
            fontFamily: serif, fontSize: '12px', color: bodyColor,
            background: 'white', border: `0.5px solid ${border}`,
            borderLeft: `2px solid ${accentForHref(page.href)}`,
            padding: '6px 12px', textDecoration: 'none',
          }}
        >
          {page.title}
        </Link>
      ))}

      <style>{`
        .rps-chip {
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .rps-chip:hover {
          background: #F5F2EE !important;
          border-color: ${borderMid} !important;
        }
      `}</style>
    </div>
  );
}
