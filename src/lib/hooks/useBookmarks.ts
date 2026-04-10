'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/bookmarks/api';
import { bookmarkQueryKeys } from '@/lib/bookmarks/queryKeys';

export function useBookmarks(folderId?: number | null) {
  const queryClient = useQueryClient();

  const bookmarksQuery = useQuery({
    queryKey: bookmarkQueryKeys.bookmarks(folderId),
    queryFn: async () => {
      const response = await bookmarkApi.listBookmarks(typeof folderId === 'number' ? folderId : undefined);
      return response.items;
    },
    enabled: folderId !== null,
  });

  const addMutation = useMutation({
    mutationFn: bookmarkApi.addBookmark,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
        queryClient.invalidateQueries({ queryKey: ['folders'] }),
      ]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: bookmarkApi.removeBookmark,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
        queryClient.invalidateQueries({ queryKey: ['folders'] }),
      ]);
    },
  });

  return {
    bookmarks: bookmarksQuery.data ?? [],
    loading: bookmarksQuery.isLoading,
    error: bookmarksQuery.error instanceof Error ? bookmarksQuery.error.message : null,
    refetch: bookmarksQuery.refetch,
    addBookmark: addMutation.mutateAsync,
    removeBookmark: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
