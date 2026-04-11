import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import QuizPageClient from '@/components/product-pages/QuizPageClient';
import { getUserEntitlements, hasAccessToContent } from '@/lib/entitlements';

export default async function QuizPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const entitlements = await getUserEntitlements(userId);
  const hasPremium = hasAccessToContent(entitlements, 'quiz');

  return <QuizPageClient hasPremium={hasPremium} />;
}
