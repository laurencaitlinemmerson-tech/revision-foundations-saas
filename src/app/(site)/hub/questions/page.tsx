import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';
import QuestionsBoardClient from '@/components/hub/QuestionsBoardClient';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Nursing Questions and Answers',
  description:
    'Ask nursing-school questions, browse student nurse answers, and untangle placement, OSCE, calculation, and revision problems.',
  path: '/hub/questions',
});

export default async function QuestionsPage() {
  const { userId } = await auth();
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return <QuestionsBoardClient initialQuestions={data || []} isSignedIn={Boolean(userId)} />;
}
