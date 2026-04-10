import { auth } from '@clerk/nextjs/server';
import QuizPageClient from '@/components/product-pages/QuizPageClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

export default async function QuizPage() {
  const { userId } = await auth();

  let hasPremium = false;

  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    hasPremium = hasAccessToContent(entitlements, 'quiz');
  }

  return <QuizPageClient hasPremium={hasPremium} />;
}
