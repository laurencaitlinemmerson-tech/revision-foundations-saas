import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('entitlements')
      .select('clerk_user_id', { count: 'exact', head: true });

    // Get unique users who have quiz progress
    const { count: activeQuizUsers } = await supabase
      .from('quiz_progress')
      .select('clerk_user_id', { count: 'exact', head: true });

    // Get unique users who have OSCE progress
    const { count: activeOsceUsers } = await supabase
      .from('osce_progress')
      .select('clerk_user_id', { count: 'exact', head: true });

    // Get total questions attempted across all users
    const { data: quizTotals } = await supabase
      .from('quiz_progress')
      .select('questions_attempted, questions_correct');

    let totalQuestionsAttempted = 0;
    let totalQuestionsCorrect = 0;
    
    if (quizTotals) {
      quizTotals.forEach((row) => {
        totalQuestionsAttempted += row.questions_attempted || 0;
        totalQuestionsCorrect += row.questions_correct || 0;
      });
    }

    // Get total OSCE attempts
    const { data: osceTotals } = await supabase
      .from('osce_progress')
      .select('attempts, best_score');

    let totalOsceAttempts = 0;
    let avgBestScore = 0;
    
    if (osceTotals && osceTotals.length > 0) {
      osceTotals.forEach((row) => {
        totalOsceAttempts += row.attempts || 0;
        avgBestScore += row.best_score || 0;
      });
      avgBestScore = Math.round(avgBestScore / osceTotals.length);
    }

    // Calculate community average accuracy
    const communityAccuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
      : 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeQuizUsers: activeQuizUsers || 0,
      activeOsceUsers: activeOsceUsers || 0,
      totalQuestionsAttempted,
      totalQuestionsCorrect,
      communityAccuracy,
      totalOsceAttempts,
      avgBestOsceScore: avgBestScore,
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community stats' },
      { status: 500 }
    );
  }
}
