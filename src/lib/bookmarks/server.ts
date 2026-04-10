import { auth } from '@clerk/nextjs/server';
import {
  countBookmarksInFolder,
  deleteBookmarkRow,
  deleteFolderRow,
  getBookmarkRowById,
  getFolderRowById,
  getHubResourcesBySlugs,
  insertBookmarkRow,
  insertFolderRow,
  listBookmarkRows,
  listFolderMatches,
  listFolderRows,
  updateFolderRow,
  type BookmarkRow,
  type FolderRow,
} from './supabaseClient';
import { getCatalogItem, humanizeHubItemId, inferHubItemType } from './catalog';
import type {
  BookmarkItem,
  BookmarkPayload,
  DeleteBookmarkPayload,
  DeleteFolderPayload,
  Folder,
  FolderPayload,
  HubItemSummary,
} from './types';

const FOLDER_NAME_MAX_LENGTH = 50;
const DEFAULT_FOLDER_EMOJI = '📚';
const MAX_EMOJI_LENGTH = 16;
const HUB_ITEM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class BookmarkApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'BookmarkApiError';
    this.status = status;
  }
}

function getBookmarkCount(bookmarks: FolderRow['bookmarks']) {
  if (!bookmarks) return 0;
  if (Array.isArray(bookmarks)) {
    return bookmarks[0]?.count ?? 0;
  }
  return bookmarks.count ?? 0;
}

function mapFolder(row: FolderRow, matchingFolderIds: Set<number>): Folder {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji || DEFAULT_FOLDER_EMOJI,
    itemCount: getBookmarkCount(row.bookmarks),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    containsItem: matchingFolderIds.has(row.id),
  };
}

function mapFolderPayload(row: {
  id: number;
  name: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}): FolderPayload {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji || DEFAULT_FOLDER_EMOJI,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function assertPresent<T>(value: T | null, message: string) {
  if (value === null) {
    throw new BookmarkApiError(500, message);
  }

  return value;
}

function mapBookmarkPayload(row: {
  id: number;
  folder_id: number;
  hub_item_id: string;
  saved_at: string;
}): BookmarkPayload {
  return {
    id: row.id,
    folder_id: row.folder_id,
    hub_item_id: row.hub_item_id,
    saved_at: row.saved_at,
  };
}

function assertSupabaseSuccess<T>(result: { data: T; error: { code?: string; message: string } | null }) {
  if (result.error) {
    if (result.error.code === '23505') {
      throw new BookmarkApiError(409, 'That folder name is already in use.');
    }
    throw new BookmarkApiError(500, result.error.message || 'Something went wrong.');
  }

  return result.data;
}

function assertValidId(value: string, label: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new BookmarkApiError(400, `${label} is invalid.`);
  }
  return parsed;
}

export function parseRouteId(rawId: string, label = 'ID') {
  return assertValidId(rawId, label);
}

export function normalizeFolderName(value: unknown) {
  if (typeof value !== 'string') {
    throw new BookmarkApiError(400, 'Folder name is required.');
  }

  const name = value.trim().replace(/\s+/g, ' ');

  if (!name) {
    throw new BookmarkApiError(400, 'Folder name is required.');
  }

  if (name.length > FOLDER_NAME_MAX_LENGTH) {
    throw new BookmarkApiError(400, `Folder names must be ${FOLDER_NAME_MAX_LENGTH} characters or fewer.`);
  }

  return name;
}

export function normalizeEmoji(value: unknown) {
  if (typeof value !== 'string') {
    return DEFAULT_FOLDER_EMOJI;
  }

  const emoji = value.trim();

  if (!emoji) {
    return DEFAULT_FOLDER_EMOJI;
  }

  if (emoji.length > MAX_EMOJI_LENGTH) {
    throw new BookmarkApiError(400, 'Folder emoji is too long.');
  }

  return emoji;
}

export function normalizeHubItemId(value: unknown) {
  if (typeof value !== 'string') {
    throw new BookmarkApiError(400, 'Hub item ID is required.');
  }

  const hubItemId = value.trim().toLowerCase();

  if (!HUB_ITEM_ID_PATTERN.test(hubItemId)) {
    throw new BookmarkApiError(400, 'Hub item ID format is invalid.');
  }

  return hubItemId;
}

export async function requireAuthenticatedUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new BookmarkApiError(401, 'You need to sign in to save bookmarks.');
  }

  return userId;
}

async function getFolderOrThrow(folderId: number) {
  const { data, error } = await getFolderRowById(folderId);

  if (error) {
    throw new BookmarkApiError(500, error.message || 'Unable to load folder.');
  }

  if (!data) {
    throw new BookmarkApiError(404, 'Folder not found.');
  }

  return data;
}

async function assertFolderOwnership(userId: string, folderId: number) {
  const folder = await getFolderOrThrow(folderId);

  if (folder.user_id !== userId) {
    throw new BookmarkApiError(403, 'You do not have access to this folder.');
  }

  return folder;
}

async function getBookmarkOrThrow(bookmarkId: number) {
  const { data, error } = await getBookmarkRowById(bookmarkId);

  if (error) {
    throw new BookmarkApiError(500, error.message || 'Unable to load bookmark.');
  }

  if (!data) {
    throw new BookmarkApiError(404, 'Bookmark not found.');
  }

  return data;
}

async function resolveHubItems(hubItemIds: string[]) {
  const uniqueIds = Array.from(new Set(hubItemIds));
  const { data, error } = await getHubResourcesBySlugs(uniqueIds);

  const canFallbackToCatalog =
    error &&
    (
      error.code === 'PGRST205' ||
      error.code === '42P01' ||
      error.message.includes("Could not find the table 'public.hub_resources'") ||
      error.message.includes('relation "public.hub_resources" does not exist')
    );

  if (error && !canFallbackToCatalog) {
    throw new BookmarkApiError(500, error.message || 'Unable to load hub item details.');
  }

  const fromDatabase = new Map<string, HubItemSummary>(
    ((canFallbackToCatalog ? [] : data) ?? []).map((resource) => [
      resource.slug,
      {
        hubItemId: resource.slug,
        title: resource.title,
        href: `/hub/resources/${resource.slug}`,
        type: inferHubItemType(resource.title, resource.tags ?? []),
        description: resource.description,
        tags: resource.tags ?? [],
      },
    ]),
  );

  const resolved = new Map<string, HubItemSummary>();

  for (const hubItemId of uniqueIds) {
    const dbMatch = fromDatabase.get(hubItemId);
    if (dbMatch) {
      resolved.set(hubItemId, dbMatch);
      continue;
    }

    const catalogMatch = getCatalogItem(hubItemId);
    if (catalogMatch) {
      resolved.set(hubItemId, catalogMatch);
      continue;
    }

    resolved.set(hubItemId, {
      hubItemId,
      title: humanizeHubItemId(hubItemId),
      href: `/hub/resources/${hubItemId}`,
      type: 'Revision Resource',
    });
  }

  return resolved;
}

function mapBookmarkItem(row: BookmarkRow, hubItem: HubItemSummary): BookmarkItem {
  const folder = Array.isArray(row.folders) ? (row.folders[0] ?? null) : row.folders ?? null;

  return {
    id: row.id,
    folderId: row.folder_id,
    hubItemId: row.hub_item_id,
    savedAt: row.saved_at,
    item: hubItem,
    folder: folder
      ? {
          id: folder.id,
          name: folder.name,
          emoji: folder.emoji || DEFAULT_FOLDER_EMOJI,
        }
      : undefined,
  };
}

export async function listFoldersForUser(userId: string, hubItemId?: string) {
  const folderResult = await listFolderRows(userId);
  const rows = assertSupabaseSuccess(folderResult) ?? [];

  let matchingFolderIds = new Set<number>();

  if (hubItemId) {
    const matchingResult = await listFolderMatches(userId, hubItemId);
    const matches = assertSupabaseSuccess(matchingResult);
    matchingFolderIds = new Set((matches ?? []).map((bookmark) => bookmark.folder_id));
  }

  return rows.map((row) => mapFolder(row as FolderRow, matchingFolderIds));
}

export async function createFolderForUser(
  userId: string,
  input: { name: string; emoji?: string },
) {
  const name = normalizeFolderName(input.name);
  const emoji = normalizeEmoji(input.emoji);

  const result = await insertFolderRow({
    user_id: userId,
    name,
    emoji,
  });

  return mapFolderPayload(assertPresent(assertSupabaseSuccess(result), 'Unable to create folder.'));
}

export async function updateFolderForUser(
  userId: string,
  folderId: number,
  input: { name: string; emoji?: string },
) {
  await assertFolderOwnership(userId, folderId);

  const result = await updateFolderRow(folderId, {
    name: normalizeFolderName(input.name),
    emoji: normalizeEmoji(input.emoji),
  });

  return mapFolderPayload(assertPresent(assertSupabaseSuccess(result), 'Unable to update folder.'));
}

export async function deleteFolderForUser(
  userId: string,
  folderId: number,
): Promise<DeleteFolderPayload> {
  await assertFolderOwnership(userId, folderId);

  const countResult = await countBookmarksInFolder(folderId);
  if (countResult.error) {
    throw new BookmarkApiError(500, countResult.error.message || 'Unable to count bookmarks.');
  }

  const deleteResult = await deleteFolderRow(folderId);
  if (deleteResult.error) {
    throw new BookmarkApiError(500, deleteResult.error.message || 'Unable to delete folder.');
  }

  return {
    success: true,
    itemsDeleted: countResult.count ?? 0,
  };
}

export async function createBookmarkForUser(
  userId: string,
  input: { folder_id: number; hub_item_id: string },
) {
  await assertFolderOwnership(userId, input.folder_id);

  const result = await insertBookmarkRow({
    user_id: userId,
    folder_id: input.folder_id,
    hub_item_id: normalizeHubItemId(input.hub_item_id),
  });

  if (result.error?.code === '23505') {
    throw new BookmarkApiError(400, 'This item is already saved in that folder.');
  }

  return mapBookmarkPayload(assertPresent(assertSupabaseSuccess(result), 'Unable to save bookmark.'));
}

export async function deleteBookmarkForUser(
  userId: string,
  bookmarkId: number,
): Promise<DeleteBookmarkPayload> {
  const bookmark = await getBookmarkOrThrow(bookmarkId);

  if (bookmark.user_id !== userId) {
    throw new BookmarkApiError(403, 'You do not have access to this bookmark.');
  }

  const result = await deleteBookmarkRow(bookmarkId);
  if (result.error) {
    throw new BookmarkApiError(500, result.error.message || 'Unable to remove bookmark.');
  }

  return { success: true };
}

export async function listBookmarksForUser(userId: string, folderId?: number) {
  if (typeof folderId === 'number') {
    await assertFolderOwnership(userId, folderId);
  }

  const result = await listBookmarkRows(userId, folderId);
  const rows = ((assertSupabaseSuccess(result) ?? []) as unknown) as BookmarkRow[];
  const hubItems = await resolveHubItems(rows.map((row) => row.hub_item_id));

  return rows.map((row) => {
    const hubItem = hubItems.get(row.hub_item_id);
    return mapBookmarkItem(
      row,
      hubItem ?? {
        hubItemId: row.hub_item_id,
        title: humanizeHubItemId(row.hub_item_id),
        href: `/hub/resources/${row.hub_item_id}`,
        type: 'Revision Resource',
      },
    );
  });
}

export async function parseFolderIdFromSearchParam(rawFolderId: string | null) {
  if (!rawFolderId) {
    return undefined;
  }

  return assertValidId(rawFolderId, 'Folder ID');
}
