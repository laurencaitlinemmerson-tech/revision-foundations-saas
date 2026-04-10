import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// GET - fetch approved reviews for display
export async function GET(request: NextRequest) {
  const limited = rateLimit(`reviews:${getClientIp(request)}`, { maxRequests: 30, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const supabase = createServiceClient();

    const [{ data: reviews, error: reviewsError }, { data: allApproved, error: summaryError }] =
      await Promise.all([
        supabase
          .from('reviews')
          .select('id, name, text, rating, created_at')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('reviews')
          .select('rating, created_at')
          .eq('approved', true)
          .order('created_at', { ascending: false }),
      ]);

    if (reviewsError || summaryError) {
      console.error('Error fetching reviews:', reviewsError || summaryError);
      return NextResponse.json({ reviews: [] });
    }

    const approvedReviews = allApproved || [];
    const totalCount = approvedReviews.length;
    const averageRating = totalCount
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / totalCount
      : 0;
    const latestApprovedAt = totalCount > 0 ? approvedReviews[0].created_at : null;

    return NextResponse.json({
      reviews: reviews || [],
      summary: {
        totalCount,
        averageRating,
        latestApprovedAt,
      },
    });
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json({ reviews: [] });
  }
}

// POST - submit a new review
export async function POST(request: NextRequest) {
  try {
    const { name, text, rating } = await request.json();

    // Validate input
    if (!name || !text || !rating) {
      return NextResponse.json(
        { error: 'Name, review text, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be 50 characters or less' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Review must be 500 characters or less' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from('reviews')
      .insert({
        name: name.trim(),
        text: text.trim(),
        rating: parseInt(rating),
        approved: false, // Requires manual approval
      });

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Review submitted for approval!' });
  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
