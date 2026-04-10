import { NextRequest, NextResponse } from 'next/server';
import {
  BookmarkApiError,
  deleteBookmarkForUser,
  parseRouteId,
  requireAuthenticatedUserId,
} from '@/lib/bookmarks/server';

function handleError(error: unknown) {
  if (error instanceof BookmarkApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireAuthenticatedUserId();
    const { id } = await params;
    const bookmarkId = parseRouteId(id, 'Bookmark ID');
    const result = await deleteBookmarkForUser(userId, bookmarkId);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
