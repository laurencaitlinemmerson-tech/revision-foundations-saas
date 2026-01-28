'use client';

import { Lock, Sparkles, Zap, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useToast } from './Toast';

export interface HubItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Quick Win' | 'Moderate' | 'Deep Dive';
  isLocked: boolean;
  href: string;
}

interface HubCardProps {
  item: HubItem;
  isPro: boolean;
}

const difficultyStyles = {
  'Quick Win': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Moderate': 'bg-amber-50 text-amber-700 border-amber-200',
  'Deep Dive': 'bg-purple-50 text-purple-700 border-purple-200',
};

const difficultyIcons = {
  'Quick Win': Zap,
  'Moderate': BookOpen,
  'Deep Dive': Sparkles,
};

export default function HubCard({ item, isPro }: HubCardProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { showToast } = useToast();

  const canAccess = !item.isLocked || isPro;
  const DifficultyIcon = difficultyIcons[item.difficulty];

  const handleClick = () => {
    if (canAccess) {
      router.push(item.href);
      return;
    }

    // Locked content logic
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Signed in but not Pro
    showToast("That's a Pro resource", 'info');
    router.push('/pricing');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative card cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2
        ${!canAccess ? 'overflow-hidden' : ''}
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Locked overlay */}
      {!canAccess && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-[var(--lilac)] flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-[var(--purple)]" />
          </div>
          <span className="text-xs font-semibold text-[var(--purple)] bg-[var(--lilac-soft)] px-3 py-1 rounded-full">
            Upgrade to access
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            item.isLocked
              ? 'bg-[var(--purple)]/10 text-[var(--purple)]'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {item.isLocked ? 'PREMIUM' : 'FREE'}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${difficultyStyles[item.difficulty]}`}>
          <DifficultyIcon className="w-3 h-3" />
          {item.difficulty}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-[var(--plum)] text-base font-semibold mb-2 line-clamp-2">
        {item.title}
      </h3>
      <p className="text-sm text-[var(--plum-dark)]/70 mb-4 line-clamp-2">
        {item.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`
          w-full py-2 rounded-full text-sm font-semibold text-center transition-all
          ${canAccess
            ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]'
            : 'bg-[var(--lilac)] text-[var(--purple)]'
          }
        `}
      >
        {canAccess ? 'Open Resource' : 'Unlock'}
      </div>
    </div>
  );
}
