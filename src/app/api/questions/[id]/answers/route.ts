import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { upsertClerkUser } from '@/lib/clerkUsers';
// Lauren's Clerk user ID - update this with your actual ID
const LAUREN_USER_ID = process.env.LAUREN_CLERK_USER_ID || '';

// GET answers for a question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', id)
    .order('is_accepted', { ascending: false })
    .order('is_from_lauren', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ answers: data });
}

// POST a new answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const userName = user?.firstName || 'Anonymous';
  const isFromLauren = userId === LAUREN_USER_ID;

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
  const { body: answerBody, image_url } = body;

  if (!answerBody) {
    return NextResponse.json({ error: 'Answer body is required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('answers')
    .insert({
      question_id: questionId,
      clerk_user_id: userId,
      user_name: userName,
      body: answerBody.slice(0, 2000),
      is_from_lauren: isFromLauren,
      image_url: image_url || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If Lauren answered, mark question as answered
  if (isFromLauren) {
    await supabase
      .from('questions')
      .update({ is_answered: true })
      .eq('id', questionId);
  }

  return NextResponse.json({ answer: data });
}
