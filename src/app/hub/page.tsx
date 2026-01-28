import HubClient from './HubClient';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getIsPro(userId: string) {
  const supabase = createServiceClient();

  // Adjust table/fields if yours differ
  const { data } = await supabase
    .from('entitlements')
    .select('active')
    .eq('user_id', userId)
    .maybeSingle();

  return Boolean(data?.active);
}

export default async function HubPage() {
  const { userId } = auth();
  const isSignedIn = Boolean(userId);
  const isPro = userId ? await getIsPro(userId) : false;

  return <HubClient isSignedIn={isSignedIn} isPro={isPro} />;
}
