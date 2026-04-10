import { NextRequest, NextResponse } from 'next/server';
import {
  BookmarkApiError,
  createBookmarkForUser,
  listBookmarksForUser,
  normalizeHubItemId,
  parseFolderIdFromSearchParam,
  requireAuthenticatedUserId,
} from '@/lib/bookmarks/server';

function handleError(error: unknown) {
  if (error instanceof BookmarkApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuthenticatedUserId();
    const folderId = await parseFolderIdFromSearchParam(
      request.nextUrl.searchParams.get('folder_id'),
    );
    const items = await listBookmarksForUser(userId, folderId);

    return NextResponse.json({ items });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuthenticatedUserId();
    const body = await request.json();
    const folderId = Number(body?.folder_id);

    if (!Number.isFinite(folderId) || folderId <= 0) {
      throw new BookmarkApiError(400, 'Folder ID is invalid.');
    }

    const bookmark = await createBookmarkForUser(userId, {
      folder_id: folderId,
      hub_item_id: normalizeHubItemId(body?.hub_item_id),
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
