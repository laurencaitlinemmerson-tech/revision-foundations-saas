'use client';

import { startTransition, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CreateFolderModal from '@/components/CreateFolderModal';
import DeleteFolderModal from '@/components/DeleteFolderModal';
import EditFolderModal from '@/components/EditFolderModal';
import FolderGrid from '@/components/FolderGrid';
import FolderView from '@/components/FolderView';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useFolders } from '@/lib/hooks/useFolders';
import { showToast } from '@/lib/toast';

interface SavedFoldersDashboardProps {
  showOverview?: boolean;
}

export default function SavedFoldersDashboard({ showOverview = true }: SavedFoldersDashboardProps) {
  const { folders, loading, error, refetch, createFolder, updateFolder, deleteFolder, isCreating, isUpdating, isDeleting } = useFolders();

  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState<number | null>(null);
  const [deleteFolderId, setDeleteFolderId] = useState<number | null>(null);

  const activeFolder = folders.find((f) => f.id === activeFolderId) ?? null;
  const editFolder = folders.find((f) => f.id === editFolderId) ?? null;
  const deleteTarget = folders.find((f) => f.id === deleteFolderId) ?? null;

  const totalSavedItems = folders.reduce((total, folder) => total + folder.itemCount, 0);

  const { bookmarks, loading: bookmarksLoading, error: bookmarksError, refetch: refetchBookmarks, removeBookmark, isRemoving } = useBookmarks(activeFolderId ?? null);

  const folderPreviews = new Map<number, { latestSavedAt: string; latestTitle: string; previewItems: Array<{ title: string; type: string }> }>();
  for (const bookmark of bookmarks) {
    const existing = folderPreviews.get(bookmark.folderId);
    if (!existing) {
      folderPreviews.set(bookmark.folderId, {
        latestSavedAt: bookmark.savedAt,
        latestTitle: bookmark.item.title,
        previewItems: [{ title: bookmark.item.title, type: bookmark.item.type }],
      });
    } else if (existing.previewItems.length < 2) {
      existing.previewItems.push({ title: bookmark.item.title, type: bookmark.item.type });
    }
  }

  async function handleCreateFolder(input: { name: string; emoji: string }) {
    try {
      const folder = await createFolder(input);
      showToast(`Created ${folder.name}`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to create folder.', 'error');
      throw err;
    }
  }

  async function handleUpdateFolder(input: { name: string; emoji: string }) {
    if (!editFolder) return;
    try {
      await updateFolder({ folderId: editFolder.id, ...input });
      showToast(`Updated ${input.name}`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update folder.', 'error');
      throw err;
    }
  }

  async function handleDeleteFolder() {
    if (!deleteTarget) return;
    try {
      const result = await deleteFolder(deleteTarget.id);
      if (activeFolderId === deleteTarget.id) setActiveFolderId(null);
      setDeleteFolderId(null);
      showToast(`Folder deleted (${result.itemsDeleted} ${result.itemsDeleted === 1 ? 'item' : 'items'})`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete folder.', 'error');
      throw err;
    }
  }

  async function handleRemoveBookmark(bookmarkId: number, folderName: string) {
    try {
      await removeBookmark(bookmarkId);
      showToast(`Removed from ${folderName}`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to remove item.', 'error');
    }
  }

  return (
    <>
      {showOverview && !activeFolder && folders.length > 0 ? (
        <div className="mb-6 overflow-hidden border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(240,249,247,0.86)_48%,rgba(241,246,255,0.88)_100%)] px-6 py-6 md:px-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70">Saved library</p>
              <h3 className="mt-2 font-display text-[2rem] leading-[1.04] text-[var(--espresso)]">
                Your quickest route back to the pages you actually reuse.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--charcoal)]">
                Use folders for repeat reads and pages you want close to hand. Less hunting, more re-entry.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/60">Folders</p>
                <p className="mt-1 font-display text-[1.8rem] leading-none text-[var(--espresso)]">{folders.length}</p>
              </div>
              <div className="border border-[rgba(26,24,21,0.08)] bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/60">Saved pages</p>
                <p className="mt-1 font-display text-[1.8rem] leading-none text-[var(--espresso)]">{totalSavedItems}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {activeFolder ? (
          <motion.div
            key={`folder-${activeFolder.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <FolderView
              folder={activeFolder}
              items={bookmarks}
              loading={bookmarksLoading}
              error={bookmarksError}
              isRemoving={isRemoving}
              onRetry={() => { void refetchBookmarks(); }}
              onBack={() => { startTransition(() => setActiveFolderId(null)); }}
              onRemove={handleRemoveBookmark}
            />
          </motion.div>
        ) : (
          <motion.div
            key="folder-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <FolderGrid
              folders={folders}
              folderPreviews={folderPreviews}
              loading={loading}
              error={error}
              onRetry={() => { void refetch(); }}
              onOpenFolder={(folderId) => { startTransition(() => setActiveFolderId(folderId)); }}
              onCreateFolder={() => setCreateOpen(true)}
              onEditFolder={(folderId) => setEditFolderId(folderId)}
              onDeleteFolder={(folderId) => setDeleteFolderId(folderId)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateFolderModal
        key={createOpen ? 'create-open' : 'create-closed'}
        isOpen={createOpen}
        isLoading={isCreating}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateFolder}
      />

      <EditFolderModal
        key={editFolder?.id ?? 'edit-none'}
        folder={editFolder}
        isOpen={Boolean(editFolder)}
        isLoading={isUpdating}
        onClose={() => setEditFolderId(null)}
        onSave={handleUpdateFolder}
      />

      <DeleteFolderModal
        key={deleteTarget?.id ?? 'delete-none'}
        folder={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        isLoading={isDeleting}
        onClose={() => setDeleteFolderId(null)}
        onConfirm={handleDeleteFolder}
      />
    </>
  );
}
