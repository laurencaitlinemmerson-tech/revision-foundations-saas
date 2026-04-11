'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { HubBranch } from '@/app/hub/hubTypes';
import { getPreferredBranch } from '@/lib/hubPreferences';

const branchCopy: Record<HubBranch, {
  title: string;
  href: string;
  label: string;
  note: string;
}> = {
  childrens: {
    title: "Children's Nursing",
    href: '/hub/childrens',
    label: "Continue in children's hub",
    note: 'Pick up where you left off with paediatric guides, OSCE prep, and placement refreshers.',
  },
  adult: {
    title: 'Adult Nursing',
    href: '/hub/adult',
    label: 'Continue in adult hub',
    note: 'Return to the adult branch for escalation guides, placement refreshers, and revision pathways.',
  },
};

export default function RememberedBranchCard() {
  const [branch, setBranch] = useState<HubBranch | null>(null);

  useEffect(() => {
    setBranch(getPreferredBranch());
  }, []);

  if (!branch) return null;

  const remembered = branchCopy[branch];

  return (
    <div
      style={{
        border: '0.5px solid rgba(0,0,0,0.1)',
        background: '#FBF8F3',
        padding: '48px 52px 52px',
        marginBottom: '64px',
      }}
    >
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#9A948C',
        }}
      >
        Continue where you left off
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '18px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: '42rem' }}>
          <h2
            style={{
              margin: '0 0 16px',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '34px',
              lineHeight: 1.05,
              fontWeight: 400,
              color: '#1A1815',
            }}
          >
            {remembered.title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.7,
              color: '#5A5750',
              fontWeight: 300,
            }}
          >
            {remembered.note}
          </p>
        </div>

        <Link
          href={remembered.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            background: '#1A1815',
            color: '#FAFAF8',
            padding: '12px 20px',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {remembered.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
