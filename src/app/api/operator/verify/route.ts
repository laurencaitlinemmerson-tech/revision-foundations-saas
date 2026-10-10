import { NextRequest, NextResponse } from 'next/server';
import { operatorPasswordMatches } from '@/lib/operatorAuth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  if (operatorPasswordMatches(password)) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
