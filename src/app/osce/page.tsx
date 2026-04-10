import { auth } from '@clerk/nextjs/server';
import OscePageClient from '@/components/product-pages/OscePageClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

export default async function OscePage() {
  const { userId } = await auth();

  let hasPremium = false;

  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    hasPremium = hasAccessToContent(entitlements, 'osce');
  }

  return <OscePageClient hasPremium={hasPremium} />;
}
