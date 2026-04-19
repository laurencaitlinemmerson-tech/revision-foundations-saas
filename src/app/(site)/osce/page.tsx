import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import OscePageClient from '@/components/product-pages/OscePageClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

export default async function OscePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const entitlements = await getUserEntitlements(userId);
  const hasPremium = hasAccessToContent(entitlements, 'osce');

  return <OscePageClient hasPremium={hasPremium} />;
}
