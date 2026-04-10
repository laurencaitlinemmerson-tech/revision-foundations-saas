import { NextRequest } from 'next/server';
import { serveToolHtml } from '@/lib/serveToolHtml';

const quizHtml = new URL('../_static/quiz.html', import.meta.url);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  return serveToolHtml(request, 'quiz', quizHtml);
}
