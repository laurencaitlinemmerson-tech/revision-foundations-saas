import { NextResponse } from 'next/server';
import { PIP_TOKEN } from '@/app/pip/constants';
import { sendPipSummary, type PipSubmission } from '@/lib/pipEmail';

export async function POST(request: Request) {
  let body: { token?: string } & Partial<PipSubmission>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!PIP_TOKEN || body.token !== PIP_TOKEN) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (!body.answers || typeof body.answers !== 'object') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const result = await sendPipSummary({
    answers: body.answers,
    extra: typeof body.extra === 'string' ? body.extra : '',
  });

  if (!result.delivered) {
    return NextResponse.json({ error: result.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
