import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const supabase = createServiceClient();
  const study_date = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('study_sessions')
    .upsert(
      { clerk_user_id: userId, study_date },
      { onConflict: 'clerk_user_id,study_date', ignoreDuplicates: true },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, date: study_date });
}
