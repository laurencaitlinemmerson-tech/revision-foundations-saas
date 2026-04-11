'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Folder } from '@/lib/bookmarks/types';

const COLOUR_MAP: Record<string, string> = {
  sage:  '#8BBCAA',
  warm:  '#D4A574',
  slate: '#7BA7CC',
  rose:  '#C89BB0',
  ink:   '#3D3530',
  sand:  '#C4B49A',
};

function folderColour(colour: string): string {
  // Handles both the new id-based values and any legacy hex strings
  return COLOUR_MAP[colour] ?? colour ?? '#8BBCAA';
}

interface FolderGridProps {
  folderPreviews?: Map<number, { latestSavedAt: string; latestTitle: string; previewItems: Array<{ title: string; type: string }> }>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpenFolder: (folderId: number) => void;
  onCreateFolder: () => void;
  onEditFolder: (folderId: number) => void;
  onDeleteFolder: (folderId: number) => void;
}

export default function FolderGrid({
  folders,
  folderPreviews,
  loading = false,
  error = null,
  onRetry,
  onOpenFolder,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
}: FolderGridProps) {
  const [menuFolderId, setMenuFolderId] = useState<number | null>(null);

  function formatSavedAt(savedAt: string) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(savedAt));
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse border border-black/8 bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm text-red-800">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 border border-red-200 px-4 py-2 text-sm text-red-900"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (!folders.length) {
    return (
      <div className="border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.5)] px-6 py-10 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70">Saved library</p>
        <h3 className="mt-2 font-display text-[2rem] leading-[1.05] text-[var(--espresso)]">
          No folders yet.
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--charcoal)]/80">
          Save pages as you go — folders are the quickest way back to guides you actually reuse.
        </p>
        <button
          type="button"
          onClick={onCreateFolder}
          className="mt-6 inline-flex items-center gap-2 bg-[var(--espresso)] px-5 py-2.5 text-sm text-white transition hover:bg-[#3a2010]"
        >
          <Plus className="h-4 w-4" />
          Create first folder
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreateFolder}
          className="inline-flex items-center gap-2 bg-[var(--espresso)] px-4 py-2.5 text-sm text-white transition hover:bg-[#3a2010]"
        >
          <Plus className="h-4 w-4" />
          New folder
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => {
          const preview = folderPreviews?.get(folder.id);
          const hex = folderColour(folder.colour);

          return (
            <div
              key={folder.id}
              className="relative border border-black/8 bg-white p-5 transition duration-200 hover:border-black/14"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenFolder(folder.id)}
                  className="flex min-w-0 flex-1 items-start gap-4 text-left"
                >
                  <div
                    className="mt-1 h-8 w-8 flex-shrink-0 rounded-full"
                    style={{ background: hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/55">Folder</p>
                    <h3 className="truncate font-display text-[22px] text-[var(--espresso)]">{folder.name}</h3>
                    <p className="mt-1 text-sm text-[var(--charcoal)]/70">
                      {folder.itemCount} {folder.itemCount === 1 ? 'saved item' : 'saved items'}
                    </p>
                  </div>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuFolderId(menuFolderId === folder.id ? null : folder.id)
                    }
                    className="border border-black/8 bg-white p-2 text-[var(--charcoal)] transition hover:border-black/14"
                    aria-label={`Manage ${folder.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {menuFolderId === folder.id ? (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-44 border border-black/8 bg-white p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuFolderId(null);
                          onEditFolder(folder.id);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--espresso)] transition hover:bg-[var(--linen-light)]"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit folder
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuFolderId(null);
                          onDeleteFolder(folder.id);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete folder
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {preview ? (
                <button
                  type="button"
                  onClick={() => onOpenFolder(folder.id)}
                  className="mt-5 w-full border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.62)] px-4 py-4 text-left transition hover:border-[rgba(26,24,21,0.16)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/55">Latest saved</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--espresso)]">
                    {preview.latestTitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preview.previewItems.map((item) => (
                      <span
                        key={`${folder.id}-${item.title}`}
                        className="border border-[rgba(26,24,21,0.08)] bg-white px-2.5 py-1 text-[11px] text-[var(--charcoal)]"
                      >
                        {item.type}
                      </span>
                    ))}
                  </div>
                </button>
              ) : null}

              <div className="mt-6 flex items-center justify-between border-t border-[rgba(26,24,21,0.08)] pt-4">
                <span className="text-xs text-[var(--charcoal)]/60">
                  Updated {formatSavedAt(preview?.latestSavedAt ?? folder.updatedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenFolder(folder.id)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--espresso)]"
                >
                  Open folder <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
