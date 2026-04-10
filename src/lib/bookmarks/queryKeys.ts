export const bookmarkQueryKeys = {
  folders: (hubItemId?: string) =>
    hubItemId ? ['folders', hubItemId] as const : ['folders', 'all'] as const,
  bookmarks: (folderId?: number | null) =>
    typeof folderId === 'number'
      ? ['bookmarks', folderId] as const
      : folderId === null
      ? ['bookmarks', 'disabled'] as const
      : ['bookmarks', 'all'] as const,
};
