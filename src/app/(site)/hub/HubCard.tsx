'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  difficultyWeight,
  familyForTag,
  primaryFamily,
} from '@/lib/studyColors';
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

  // The card's spine colour: the subject family of its first mapped tag.
  const family = primaryFamily(item.tags);
  const weight = difficultyWeight(item.difficulty);

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
      data-family={family ?? undefined}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} — ${item.difficulty}${item.isLocked ? ', premium' : ', free'}`}
      onKeyDown={(e) => {
        // Space as well as Enter: a role="button" is expected to answer to both,
        // and Space alone would otherwise scroll the page.
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
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

      <div className="hbc-card-tags">
        {item.tags.slice(0, 3).map((tag) => {
          const tagFamily = familyForTag(tag);
          return (
            <span
              key={tag}
              className="topic-chip"
              data-family={tagFamily ?? undefined}
              data-neutral={tagFamily ? undefined : 'true'}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <div className="hbc-card-footer">
        <span className="hbc-card-meta">
          <span
            className="difficulty-dots"
            role="img"
            aria-label={`Effort: ${item.difficulty}`}
          >
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="difficulty-dot"
                data-filled={n <= weight ? 'true' : undefined}
              />
            ))}
          </span>
          <span aria-hidden="true">{item.difficulty}</span>
        </span>
        <span className="hbc-card-cta">
          {canAccess ? 'Open' : 'Unlock'}
          <span className="hbc-card-arrow">&rarr;</span>
        </span>
      </div>
    </div>
  );
}
