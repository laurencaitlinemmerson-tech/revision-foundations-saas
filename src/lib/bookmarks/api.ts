'use client';

import type {
  BookmarkListResponse,
  BookmarkPayload,
  DeleteBookmarkPayload,
  DeleteFolderPayload,
  FolderListResponse,
  FolderPayload,
} from './types';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.error || 'Request failed.', response.status);
  }

  return payload as T;
}

export const bookmarkApi = {
  listFolders(hubItemId?: string) {
    const search = hubItemId ? `?hub_item_id=${encodeURIComponent(hubItemId)}` : '';
    return requestJson<FolderListResponse>(`/api/folders${search}`);
  },

  createFolder(input: { name: string; emoji?: string }) {
    return requestJson<FolderPayload>('/api/folders', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateFolder(folderId: number, input: { name: string; emoji?: string }) {
    return requestJson<FolderPayload>(`/api/folders/${folderId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  deleteFolder(folderId: number) {
    return requestJson<DeleteFolderPayload>(`/api/folders/${folderId}`, {
      method: 'DELETE',
    });
  },

  listBookmarks(folderId?: number) {
    const search = typeof folderId === 'number' ? `?folder_id=${folderId}` : '';
    return requestJson<BookmarkListResponse>(`/api/bookmarks${search}`);
  },

  addBookmark(input: { folder_id: number; hub_item_id: string }) {
    return requestJson<BookmarkPayload>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  removeBookmark(bookmarkId: number) {
    return requestJson<DeleteBookmarkPayload>(`/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };
