'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/Toast';
import type { HubItem } from './hubTypes';

export default function HubCard({
  item,
  isPro,
  isSignedIn,
}: {
  item: HubItem;
  isPro: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const canAccess = !item.isLocked || isPro;

  const handleClick = () => {
    if (canAccess) {
      router.push(item.href);
      return;
    }
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    showToast("That's a Pro resource \u{1F49C}", 'info');
    router.push('/pricing');
  };

  return (
    <div
      className="hbc-card"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {!canAccess && (
        <div className="hbc-locked-overlay">
          <Lock className="hbc-lock-icon" />
          <span className="hbc-lock-badge">Upgrade to access</span>
        </div>
      )}

      <div className="hbc-card-header">
        <span className={`hbc-card-badge ${item.isLocked ? 'premium' : 'free'}`}>
          {item.isLocked ? 'Premium' : 'Free'}
        </span>
        {item.isRecommended && (
          <span className="hbc-card-recommended">Recommended</span>
        )}
      </div>

      <h3 className="hbc-card-title">{item.title}</h3>
      <p className="hbc-card-desc">{item.description}</p>

      <div className="hbc-card-footer">
        <span className="hbc-card-meta">
          {item.difficulty} · {item.tags.slice(0, 2).join(' · ')}
        </span>
        <span className="hbc-card-cta">
          {canAccess ? 'Open' : 'Unlock'}
          <span className="hbc-card-arrow">&rarr;</span>
        </span>
      </div>
    </div>
  );
}
