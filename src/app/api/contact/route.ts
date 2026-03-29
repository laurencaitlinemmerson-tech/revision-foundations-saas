import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// POST - submit a contact message
// Requires a 'contact_submissions' table in Supabase:
//
// create table contact_submissions (
//   id uuid primary key default gen_random_uuid(),
//   name text not null,
//   email text not null,
//   subject text,
//   message text not null,
//   created_at timestamptz default now()
// );
//
// Enable RLS and add an insert policy if needed:
// alter table contact_submissions enable row level security;
// create policy "Allow inserts" on contact_submissions for insert with check (true);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        { error: 'Name must be 80 characters or less' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be 2000 characters or less' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
    });

    if (error) {
      console.error('Error inserting contact submission:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact POST:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
