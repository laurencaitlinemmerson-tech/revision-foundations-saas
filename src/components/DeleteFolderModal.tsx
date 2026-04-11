'use client';

import { useState } from 'react';
import ModalShell from '@/components/ModalShell';
import type { Folder } from '@/lib/bookmarks/types';

const COLOUR_MAP: Record<string, string> = {
  sage:  '#8BBCAA',
  warm:  '#D4A574',
  slate: '#7BA7CC',
  rose:  '#C89BB0',
  ink:   '#3D3530',
  sand:  '#C4B49A',
};

interface DeleteFolderModalProps {
  folder: Folder | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteFolderModal({
  folder,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteFolderModalProps) {
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} title="Delete folder">
      <div className="space-y-5">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-10 w-10 flex-shrink-0"
              style={{
                background: folder?.emoji
                  ? (COLOUR_MAP[folder.emoji] ?? folder.emoji)
                  : '#e5e7eb',
              }}
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-red-700">Delete folder</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--espresso)]">Are you sure?</h2>
            </div>
          </div>
          <p className="text-sm text-[var(--charcoal)]/72">
            This removes the folder and every saved item inside it from your dashboard.
          </p>
        </div>

        <div className="border border-red-200 bg-red-50 px-5 py-5 text-sm text-red-900">
          <p className="font-medium">
            Delete &apos;{folder?.name}&apos; and {folder?.itemCount ?? 0}{' '}
            {(folder?.itemCount ?? 0) === 1 ? 'saved item' : 'saved items'}?
          </p>
          <p className="mt-2 text-red-800/80">This cannot be undone.</p>
        </div>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="border border-black/10 px-4 py-2 text-sm text-[var(--charcoal)] transition hover:border-black/16"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                setError(null);
                await onConfirm();
              } catch (confirmError) {
                setError(
                  confirmError instanceof Error
                    ? confirmError.message
                    : 'Unable to delete folder.',
                );
              }
            }}
            disabled={isLoading}
            className="bg-red-700 px-5 py-2 text-sm text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Deleting...' : 'Delete folder'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
