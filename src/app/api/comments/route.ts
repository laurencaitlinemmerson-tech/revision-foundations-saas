import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { upsertClerkUser } from '@/lib/clerkUsers';
// GET comments for a resource
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('resource_comments')
    .select('*')
    .eq('resource_slug', slug)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data });
}

// POST a new comment
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const userName = user?.firstName || 'Anonymous';

  if (user) {
    const email = user.emailAddresses?.[0]?.emailAddress ?? null;
    const firstName = user.firstName ?? null;
    const lastName = user.lastName ?? null;
    const username = user.username ?? null;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
    await upsertClerkUser({
      clerkUserId: userId,
      email,
      firstName,
      lastName,
      fullName,
      username,
    });
  }
  const body = await request.json();
  const { slug, body: commentBody, parentId } = body;

  if (!slug || !commentBody) {
    return NextResponse.json({ error: 'Slug and body are required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('resource_comments')
    .insert({
      resource_slug: slug,
      clerk_user_id: userId,
      user_name: userName,
      body: commentBody.slice(0, 1000),
      parent_id: parentId || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
