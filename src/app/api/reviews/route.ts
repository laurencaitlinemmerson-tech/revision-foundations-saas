import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import {
  fetchGoogleReviews,
  getConfiguredGoogleReviewUrl,
  googleReviewsEnabled,
  type ReviewPayload,
} from '@/lib/googleReviews';

async function fetchSupabaseReviews(): Promise<ReviewPayload> {
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
    return {
      reviews: [],
      summary: {
        totalCount: 0,
        averageRating: 0,
        latestApprovedAt: null,
      },
      source: 'supabase',
      reviewUrl: null,
      sortDescription: 'Newest approved reviews',
    };
  }

  const approvedReviews = allApproved || [];
  const totalCount = approvedReviews.length;
  const averageRating = totalCount
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / totalCount
    : 0;
  const latestApprovedAt = totalCount > 0 ? approvedReviews[0].created_at : null;

  return {
    reviews: reviews || [],
    summary: {
      totalCount,
      averageRating,
      latestApprovedAt,
    },
    source: 'supabase',
    reviewUrl: null,
    sortDescription: 'Newest approved reviews',
  };
}

// GET - fetch approved reviews for display
export async function GET(request: NextRequest) {
  const limited = rateLimit(`reviews:${getClientIp(request)}`, { maxRequests: 30, windowMs: 60_000 });
  if (limited) return limited;

  try {
    if (googleReviewsEnabled()) {
      try {
        const googleReviews = await fetchGoogleReviews();
        if (googleReviews) {
          return NextResponse.json(googleReviews);
        }
      } catch (error) {
        console.error('Error fetching Google reviews, falling back to Supabase:', error);
      }
    }

    return NextResponse.json(await fetchSupabaseReviews());
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json({
      reviews: [],
      summary: {
        totalCount: 0,
        averageRating: 0,
        latestApprovedAt: null,
      },
      source: 'supabase',
      reviewUrl: getConfiguredGoogleReviewUrl(),
      sortDescription: null,
    });
  }
}

// POST - submit a new review
export async function POST(request: NextRequest) {
  try {
    if (googleReviewsEnabled()) {
      return NextResponse.json(
        {
          error: 'Reviews are now collected on Google.',
          reviewUrl: getConfiguredGoogleReviewUrl(),
        },
        { status: 409 }
      );
    }

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
