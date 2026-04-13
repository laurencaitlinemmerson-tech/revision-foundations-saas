import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

interface TopicProgress {
  topicId: string;
  attempted: number;
  correct: number;
  lastAt: string;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let topics: TopicProgress[];
  try {
    const body = await req.json();
    topics = body.topics;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    return NextResponse.json({ ok: true, synced: 0 });
  }

  const supabase = createServiceClient();

  const rows = topics.map((t) => ({
    clerk_user_id: userId,
    topic_id: t.topicId,
    questions_attempted: t.attempted,
    questions_correct: t.correct,
    last_attempted_at: t.lastAt,
  }));

  const { error } = await supabase
    .from('quiz_progress')
    .upsert(rows, { onConflict: 'clerk_user_id,topic_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, synced: rows.length });
}
