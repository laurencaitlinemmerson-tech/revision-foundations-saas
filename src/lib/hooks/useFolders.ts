'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/lib/bookmarks/api';
import { bookmarkQueryKeys } from '@/lib/bookmarks/queryKeys';

export function useFolders(hubItemId?: string) {
  const queryClient = useQueryClient();

  const foldersQuery = useQuery({
    queryKey: bookmarkQueryKeys.folders(hubItemId),
    queryFn: async () => {
      const response = await bookmarkApi.listFolders(hubItemId);
      return response.folders;
    },
  });

  const createMutation = useMutation({
    mutationFn: bookmarkApi.createFolder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ folderId, name, emoji }: { folderId: number; name: string; emoji?: string }) =>
      bookmarkApi.updateFolder(folderId, { name, emoji }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bookmarkApi.deleteFolder,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['folders'] }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
      ]);
    },
  });

  return {
    folders: foldersQuery.data ?? [],
    loading: foldersQuery.isLoading,
    error: foldersQuery.error instanceof Error ? foldersQuery.error.message : null,
    refetch: foldersQuery.refetch,
    createFolder: createMutation.mutateAsync,
    updateFolder: updateMutation.mutateAsync,
    deleteFolder: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
