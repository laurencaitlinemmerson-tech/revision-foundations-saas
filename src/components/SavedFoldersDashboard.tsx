'use client';

import { startTransition, useRef, useState } from 'react';
import CreateFolderModal from '@/components/CreateFolderModal';
import DeleteFolderModal from '@/components/DeleteFolderModal';
import EditFolderModal from '@/components/EditFolderModal';
import FolderGrid from '@/components/FolderGrid';
import FolderView from '@/components/FolderView';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useFolders } from '@/lib/hooks/useFolders';
import { showToast } from '@/lib/toast';
import './folders.css';

export default function SavedFoldersDashboard() {
  const { folders, loading, error, refetch, createFolder, updateFolder, deleteFolder, isCreating, isUpdating, isDeleting } = useFolders();

  const rootRef = useRef<HTMLDivElement>(null);
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  // Opening or leaving a folder changes the height of this section a lot, so bring
  // its top back into view once the new content is in place.
  function showFolder(id: number | null) {
    startTransition(() => setActiveFolderId(id));
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState<number | null>(null);
  const [deleteFolderId, setDeleteFolderId] = useState<number | null>(null);

  const activeFolder = folders.find((f) => f.id === activeFolderId) ?? null;
  const editFolder = folders.find((f) => f.id === editFolderId) ?? null;
  const deleteTarget = folders.find((f) => f.id === deleteFolderId) ?? null;

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
    <div ref={rootRef} className="fld-root">
      <div key={activeFolder ? `folder-${activeFolder.id}` : 'folder-grid'} className="fld-fade">
        {activeFolder ? (
          <FolderView
            folder={activeFolder}
            items={bookmarks}
            loading={bookmarksLoading}
            error={bookmarksError}
            isRemoving={isRemoving}
            onRetry={() => { void refetchBookmarks(); }}
            onBack={() => showFolder(null)}
            onRemove={handleRemoveBookmark}
          />
        ) : (
          <FolderGrid
            folders={folders}
            folderPreviews={folderPreviews}
            loading={loading}
            error={error}
            onRetry={() => { void refetch(); }}
            onOpenFolder={(folderId) => showFolder(folderId)}
            onCreateFolder={() => setCreateOpen(true)}
            onEditFolder={(folderId) => setEditFolderId(folderId)}
            onDeleteFolder={(folderId) => setDeleteFolderId(folderId)}
          />
        )}
      </div>

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
    </div>
  );
}
