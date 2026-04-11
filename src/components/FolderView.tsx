'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, X } from 'lucide-react';
import type { BookmarkItem, Folder } from '@/lib/bookmarks/types';

const COLOUR_MAP: Record<string, string> = {
  sage:  '#8BBCAA',
  warm:  '#D4A574',
  slate: '#7BA7CC',
  rose:  '#C89BB0',
  ink:   '#3D3530',
  sand:  '#C4B49A',
};

function folderColour(colour: string): string {
  return COLOUR_MAP[colour] ?? colour ?? '#8BBCAA';
}

interface FolderViewProps {
  folder: Folder;
  items: BookmarkItem[];
  loading?: boolean;
  error?: string | null;
  isRemoving?: boolean;
  onRetry?: () => void;
  onBack: () => void;
  onRemove: (bookmarkId: number, folderName: string) => Promise<void>;
}

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(savedAt));
}

export default function FolderView({
  folder,
  items,
  loading = false,
  error = null,
  isRemoving = false,
  onRetry,
  onBack,
  onRemove,
}: FolderViewProps) {
  const hex = folderColour(folder.colour);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--linen-light)]" />
        <div className="h-32 animate-pulse rounded-[24px] border border-black/8 bg-white" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-[20px] border border-black/8 bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm text-red-800">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm text-red-900"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-[var(--espresso)] transition hover:border-black/14"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to folders
        </button>

        <div className="flex items-center gap-3 rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-[var(--espresso)]">
          <div
            className="h-5 w-5 flex-shrink-0 rounded-full"
            style={{ background: hex }}
          />
          <span>{folder.name}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-black/8 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="h-14 w-14 flex-shrink-0 rounded-full"
              style={{ background: hex }}
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Folder</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--espresso)]">{folder.name}</h2>
              <p className="mt-2 text-sm text-[var(--charcoal)]/72">
                Pages you&apos;ve saved for later.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
            <div className="rounded-[18px] border border-black/8 bg-[var(--linen-light)] px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Saved</p>
              <p className="mt-1 font-display text-2xl text-[var(--espresso)]">{items.length}</p>
            </div>
            <div className="rounded-[18px] border border-black/8 bg-[var(--linen-light)] px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Updated</p>
              <p className="mt-1 font-display text-lg text-[var(--espresso)]">
                {new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(new Date(folder.updatedAt))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!items.length ? (
        <div className="rounded-[24px] border border-dashed border-black/12 bg-white px-6 py-10 text-center">
          <p className="font-display text-2xl text-[var(--espresso)]">No items in this folder</p>
          <p className="mt-2 text-sm text-[var(--charcoal)]">Save a guide or cheat sheet and it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex flex-wrap items-start gap-4 rounded-[20px] border border-black/8 bg-white px-5 py-4 transition hover:border-black/14"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--linen-light)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]">
                    {bookmark.item.type}
                  </span>
                  <span className="text-xs text-[var(--charcoal)]/70">Saved {formatSavedAt(bookmark.savedAt)}</span>
                </div>
                <Link
                  href={bookmark.item.href}
                  className="inline-flex items-center gap-2 font-display text-xl text-[var(--espresso)] transition hover:text-black"
                >
                  {bookmark.item.title}
                  <ExternalLink className="h-4 w-4" />
                </Link>
                {bookmark.item.description ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--charcoal)]/82">
                    {bookmark.item.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onRemove(bookmark.id, folder.name)}
                disabled={isRemoving}
                className="inline-flex items-center gap-2 rounded-full border border-black/8 px-3 py-2 text-sm text-[var(--charcoal)] transition hover:border-red-200 hover:text-red-700 disabled:opacity-70"
                aria-label={`Remove ${bookmark.item.title}`}
              >
                {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
