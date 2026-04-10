import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionThreadClient from '@/components/hub/QuestionThreadClient';

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  const supabase = createServiceClient();

  const [{ data: question }, { data: answers }] = await Promise.all([
    supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('answers')
      .select('*')
      .eq('question_id', id)
      .order('is_accepted', { ascending: false })
      .order('is_from_lauren', { ascending: false })
      .order('created_at', { ascending: true }),
  ]);

  if (!question) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: '#FAFAF8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '1180px', margin: '0 auto', width: '100%', padding: '72px 48px 96px' }}>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', padding: '48px 40px', textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: '14px' }}>Q&amp;A board</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 400, color: '#1A1815', marginBottom: '16px' }}>
              Question not found
            </h1>
            <Link
              href="/hub/questions"
              style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1815', textDecoration: 'none', border: '0.5px solid rgba(0,0,0,0.12)', padding: '9px 18px', display: 'inline-block' }}
            >
              ← Back to Q&amp;A
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <QuestionThreadClient
      question={question}
      initialAnswers={answers || []}
      isSignedIn={Boolean(userId)}
    />
  );
}
