import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// GET - fetch approved reviews for display
export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, name, text, rating, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: reviews || [] });
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
