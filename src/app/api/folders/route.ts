import { NextRequest, NextResponse } from 'next/server';
import {
  BookmarkApiError,
  createFolderForUser,
  listFoldersForUser,
  normalizeHubItemId,
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
    const hubItemId = request.nextUrl.searchParams.get('hub_item_id');
    const folders = await listFoldersForUser(
      userId,
      hubItemId ? normalizeHubItemId(hubItemId) : undefined,
    );

    return NextResponse.json({ folders });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuthenticatedUserId();
    const body = await request.json();
    const folder = await createFolderForUser(userId, {
      name: body?.name,
      emoji: body?.emoji,
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
