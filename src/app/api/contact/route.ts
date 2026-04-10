import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendContactNotification } from '@/lib/contactEmail';
import { contactSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const limited = rateLimit(`contact:${getClientIp(request)}`, { maxRequests: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const submission = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || undefined,
      message: message.trim(),
    };

    const supabase = createServiceClient();

    const { error } = await supabase.from('contact_submissions').insert({
      name: submission.name,
      email: submission.email,
      subject: submission.subject || null,
      message: submission.message,
    });

    if (error) {
      console.error('Error inserting contact submission:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    const notification = await sendContactNotification(submission);

    if (!notification.delivered) {
      console.warn('Contact submission saved but email delivery failed:', notification.reason);
    }

    return NextResponse.json({ success: true, notified: notification.delivered });
  } catch (error) {
    console.error('Error in contact POST:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
