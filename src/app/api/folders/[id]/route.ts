import { NextRequest, NextResponse } from 'next/server';
import {
  BookmarkApiError,
  deleteFolderForUser,
  parseRouteId,
  requireAuthenticatedUserId,
  updateFolderForUser,
} from '@/lib/bookmarks/server';

function handleError(error: unknown) {
  if (error instanceof BookmarkApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireAuthenticatedUserId();
    const { id } = await params;
    const folderId = parseRouteId(id, 'Folder ID');
    const body = await request.json();
    const folder = await updateFolderForUser(userId, folderId, {
      name: body?.name,
      emoji: body?.emoji,
    });

    return NextResponse.json(folder);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireAuthenticatedUserId();
    const { id } = await params;
    const folderId = parseRouteId(id, 'Folder ID');
    const result = await deleteFolderForUser(userId, folderId);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
