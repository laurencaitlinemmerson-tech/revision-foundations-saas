'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Check, FolderPlus, Search } from 'lucide-react';
import type { Folder } from '@/lib/bookmarks/types';

interface FolderSelectorProps {
  folders: Folder[];
  selectedFolderIds: Set<number>;
  disabled?: boolean;
  onToggleFolder: (folder: Folder) => Promise<void>;
  onCreateFolder: () => void;
}

export default function FolderSelector({
  folders,
  selectedFolderIds,
  disabled = false,
  onToggleFolder,
  onCreateFolder,
}: FolderSelectorProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredFolders = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) {
      return folders;
    }

    return folders.filter((folder) => folder.name.toLowerCase().includes(query));
  }, [deferredSearch, folders]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onCreateFolder}
        className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/12 bg-[var(--linen-light)] px-4 py-3 text-sm text-[var(--espresso)] transition hover:border-black/22"
      >
        <FolderPlus className="h-4 w-4" />
        Create new folder
      </button>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--charcoal)]/70" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search folders"
          className="w-full rounded-[18px] border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(15,23,42,0.05)]"
        />
      </label>

      {filteredFolders.length ? (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {filteredFolders.map((folder) => {
            const isSelected = selectedFolderIds.has(folder.id);

            return (
              <button
                key={folder.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleFolder(folder)}
                className={`flex w-full items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-[var(--espresso)] bg-[var(--linen-light)]'
                    : 'border-black/8 bg-white hover:border-black/16'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--linen-light)] text-xl">
                  {folder.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--espresso)]">{folder.name}</p>
                  <p className="text-xs text-[var(--charcoal)]">
                    {folder.itemCount} {folder.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-[var(--espresso)] bg-[var(--espresso)] text-white'
                      : 'border-black/10 text-transparent'
                  }`}
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[18px] border border-black/8 bg-[var(--linen-light)] px-4 py-5 text-center text-sm text-[var(--charcoal)]">
          No folders match that search yet.
        </div>
      )}
    </div>
  );
}
