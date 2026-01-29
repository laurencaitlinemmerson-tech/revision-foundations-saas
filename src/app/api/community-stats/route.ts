import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = createServiceClient();
    
    // Get userId from query params if provided (for comparison)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get total users count (unique)
    const { data: allUsers } = await supabase
      .from('entitlements')
      .select('clerk_user_id');
    
    const uniqueUsers = new Set(allUsers?.map(u => u.clerk_user_id) || []);
    const totalUsers = uniqueUsers.size;

    // Get all quiz progress for averages and ranking
    const { data: allQuizProgress } = await supabase
      .from('quiz_progress')
      .select('clerk_user_id, questions_attempted, questions_correct');

    // Calculate per-user stats
    const userQuizStats: Record<string, { attempted: number; correct: number }> = {};
    
    if (allQuizProgress) {
      allQuizProgress.forEach((row) => {
        if (!userQuizStats[row.clerk_user_id]) {
          userQuizStats[row.clerk_user_id] = { attempted: 0, correct: 0 };
        }
        userQuizStats[row.clerk_user_id].attempted += row.questions_attempted || 0;
        userQuizStats[row.clerk_user_id].correct += row.questions_correct || 0;
      });
    }

    // Get total questions across all users
    let totalQuestionsAttempted = 0;
    let totalQuestionsCorrect = 0;
    const userAttemptCounts: number[] = [];
    
    Object.values(userQuizStats).forEach((stats) => {
      totalQuestionsAttempted += stats.attempted;
      totalQuestionsCorrect += stats.correct;
      userAttemptCounts.push(stats.attempted);
    });

    // Calculate averages
    const activeUsers = Object.keys(userQuizStats).length;
    const avgQuestionsPerUser = activeUsers > 0 
      ? Math.round(totalQuestionsAttempted / activeUsers) 
      : 0;

    const communityAccuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
      : 0;

    // Calculate user's rank if userId provided
    let userRank = null;
    let userPercentile = null;
    let userVsAverage = null;
    
    if (userId && userQuizStats[userId]) {
      const userAttempted = userQuizStats[userId].attempted;
      
      // Sort users by questions attempted (descending)
      const sortedCounts = [...userAttemptCounts].sort((a, b) => b - a);
      const rank = sortedCounts.indexOf(userAttempted) + 1;
      userRank = rank;
      userPercentile = activeUsers > 0 
        ? Math.round(((activeUsers - rank + 1) / activeUsers) * 100)
        : 0;
      userVsAverage = userAttempted - avgQuestionsPerUser;
    }

    // Get OSCE stats
    const { data: osceTotals } = await supabase
      .from('osce_progress')
      .select('attempts');

    let totalOsceAttempts = 0;
    if (osceTotals) {
      osceTotals.forEach((row) => {
        totalOsceAttempts += row.attempts || 0;
      });
    }

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalQuestionsAttempted,
      totalQuestionsCorrect,
      communityAccuracy,
      avgQuestionsPerUser,
      totalOsceAttempts,
      // User comparison (if userId provided)
      userRank,
      userPercentile,
      userVsAverage,
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community stats' },
      { status: 500 }
    );
  }
  }
}
