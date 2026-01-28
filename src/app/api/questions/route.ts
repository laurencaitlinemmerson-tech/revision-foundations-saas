import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// GET all questions
export async function GET(request: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const answered = searchParams.get('answered');

  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  if (answered === 'true') {
    query = query.eq('is_answered', true);
  } else if (answered === 'false') {
    query = query.eq('is_answered', false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}

// POST a new question
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const userName = user?.firstName || 'Anonymous';

  const body = await request.json();
  const { title, body: questionBody, tags } = body;

  if (!title || !questionBody) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('questions')
    .insert({
      clerk_user_id: userId,
      user_name: userName,
      title: title.slice(0, 200),
      body: questionBody.slice(0, 2000),
      tags: tags || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ question: data });
}
