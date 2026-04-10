import { createServiceClient } from '@/lib/supabase';

export interface FolderRow {
  id: number;
  user_id: string;
  name: string;
  emoji: string;
  created_at: string;
  updated_at: string;
  bookmarks?: Array<{ count: number }> | { count: number } | null;
}

export interface BookmarkRow {
  id: number;
  user_id: string;
  folder_id: number;
  hub_item_id: string;
  saved_at: string;
  folders?:
    | {
        id: number;
        name: string;
        emoji: string;
      }
    | Array<{
        id: number;
        name: string;
        emoji: string;
      }>
    | null;
}

export interface HubResourceRow {
  slug: string;
  title: string;
  description: string;
  tags: string[] | null;
}

export async function listFolderRows(userId: string) {
  return createServiceClient()
    .from('folders')
    .select('id, user_id, name, emoji, created_at, updated_at, bookmarks(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function listFolderMatches(userId: string, hubItemId: string) {
  return createServiceClient()
    .from('bookmarks')
    .select('folder_id')
    .eq('user_id', userId)
    .eq('hub_item_id', hubItemId);
}

export async function getFolderRowById(folderId: number) {
  return createServiceClient()
    .from('folders')
    .select('id, user_id, name, emoji, created_at, updated_at')
    .eq('id', folderId)
    .maybeSingle();
}

export async function insertFolderRow(input: { user_id: string; name: string; emoji: string }) {
  return createServiceClient()
    .from('folders')
    .insert(input)
    .select('id, user_id, name, emoji, created_at, updated_at')
    .single();
}

export async function updateFolderRow(folderId: number, input: { name: string; emoji: string }) {
  return createServiceClient()
    .from('folders')
    .update(input)
    .eq('id', folderId)
    .select('id, user_id, name, emoji, created_at, updated_at')
    .single();
}

export async function countBookmarksInFolder(folderId: number) {
  return createServiceClient()
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('folder_id', folderId);
}

export async function deleteFolderRow(folderId: number) {
  return createServiceClient()
    .from('folders')
    .delete()
    .eq('id', folderId);
}

export async function listBookmarkRows(userId: string, folderId?: number) {
  let query = createServiceClient()
    .from('bookmarks')
    .select('id, user_id, folder_id, hub_item_id, saved_at, folders(id, name, emoji)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (typeof folderId === 'number') {
    query = query.eq('folder_id', folderId);
  }

  return query;
}

export async function getBookmarkRowById(bookmarkId: number) {
  return createServiceClient()
    .from('bookmarks')
    .select('id, user_id, folder_id, hub_item_id, saved_at')
    .eq('id', bookmarkId)
    .maybeSingle();
}

export async function insertBookmarkRow(input: {
  user_id: string;
  folder_id: number;
  hub_item_id: string;
}) {
  return createServiceClient()
    .from('bookmarks')
    .insert(input)
    .select('id, folder_id, hub_item_id, saved_at')
    .single();
}

export async function deleteBookmarkRow(bookmarkId: number) {
  return createServiceClient()
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId);
}

export async function getHubResourcesBySlugs(slugs: string[]) {
  if (!slugs.length) {
    return { data: [] as HubResourceRow[], error: null };
  }

  return createServiceClient()
    .from('hub_resources')
    .select('slug, title, description, tags')
    .in('slug', slugs);
}
