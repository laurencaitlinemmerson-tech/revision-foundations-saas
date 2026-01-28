import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('hub_resources')
    .select('slug, title, description, tags, difficulty, is_locked, read_time, display_order')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch hub resources:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resources: data });
}
