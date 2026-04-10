'use client';

import { useState } from 'react';

export function useBookmarkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  return {
    isOpen,
    selectedFolderId,
    setSelectedFolderId,
    openModal: (folderId?: number | null) => {
      setSelectedFolderId(folderId ?? null);
      setIsOpen(true);
    },
    closeModal: () => {
      setSelectedFolderId(null);
      setIsOpen(false);
    },
  };
}
