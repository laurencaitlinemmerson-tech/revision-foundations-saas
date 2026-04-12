'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import FolderSelector from '@/components/FolderSelector';
import CreateFolderModal from '@/components/CreateFolderModal';
import { useFolders } from '@/lib/hooks/useFolders';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { showToast } from '@/lib/toast';
import type { Folder } from '@/lib/bookmarks/types';

interface BookmarkButtonProps {
  hubItemId: string;
  hubItemTitle: string;
}

export default function BookmarkButton({ hubItemId, hubItemTitle }: BookmarkButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { folders, loading: foldersLoading, createFolder, isCreating } = useFolders(hubItemId);
  const { bookmarks, addBookmark, removeBookmark, isAdding, isRemoving } = useBookmarks();

  const matchingBookmarks = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.hubItemId === hubItemId),
    [bookmarks, hubItemId],
  );

  const selectedFolderIds = useMemo(
    () => new Set(matchingBookmarks.map((bookmark) => bookmark.folderId)),
    [matchingBookmarks],
  );

  const isSaved = selectedFolderIds.size > 0 || folders.some((folder) => folder.containsItem);
  const isMutating = isAdding || isRemoving || isCreating;
  const savedCount = selectedFolderIds.size;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  async function handleToggleFolder(folder: Folder) {
    const existingBookmark = matchingBookmarks.find((bookmark) => bookmark.folderId === folder.id);

    try {
      if (existingBookmark) {
        await removeBookmark(existingBookmark.id);
        showToast(`Removed from ${folder.name}`, 'info');
      } else {
        await addBookmark({ folder_id: folder.id, hub_item_id: hubItemId });
        showToast(`Saved to ${folder.name}`, 'success');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update bookmark.', 'error');
    }
  }

async function handleCreateFolder(input: { name: string; emoji: string }) {
    try {
      const folder = await createFolder(input);
      await addBookmark({ folder_id: folder.id, hub_item_id: hubItemId });
      showToast(`Saved to ${folder.name}`, 'success');
      setIsOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save bookmark.', 'error');
      throw error;
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={isMutating}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={isSaved ? 'Manage bookmark folders' : `Save ${hubItemTitle}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          border: isSaved ? '0.5px solid rgba(24,95,165,0.25)' : '0.5px solid rgba(0,0,0,0.12)',
          background: isSaved ? '#EEF3FA' : 'transparent',
          padding: '6px 14px',
          fontSize: '11px',
          letterSpacing: '0.06em',
          color: isSaved ? '#185FA5' : '#1A1815',
          cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        {isMutating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span>{isSaved ? 'Saved' : 'Save'}</span>
        {isSaved ? (
          <span className="bg-white px-2 py-0.5 text-[11px] tracking-[0.04em] text-[#185FA5]">
            {savedCount || '1+'}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[23rem] overflow-hidden border border-black/8 bg-[#fcfbf8] shadow-[0_8px_32px_rgba(15,23,42,0.07)]"
          >
            <div className="border-b border-black/6 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Save</p>
              <h3 className="mt-1 font-display text-xl text-[var(--espresso)]">Choose a folder</h3>
              <p className="mt-1 text-sm text-[var(--charcoal)]/72">
                <span className="font-medium text-[var(--espresso)]">{hubItemTitle}</span>
              </p>
            </div>

            <div className="p-4">
              {foldersLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-14 animate-pulse bg-[var(--linen-light)]"
                    />
                  ))}
                </div>
              ) : (
                <FolderSelector
                  folders={folders}
                  selectedFolderIds={selectedFolderIds}
                  disabled={isMutating}
                  onToggleFolder={handleToggleFolder}
                  onCreateFolder={() => setIsCreateOpen(true)}
                />
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CreateFolderModal
        isOpen={isCreateOpen}
        isLoading={isCreating || isAdding}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}
