import { NextRequest } from 'next/server';
import { serveToolHtml } from '@/lib/serveToolHtml';

const osceHtml = new URL('../_static/osce.html', import.meta.url);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  return serveToolHtml(request, 'osce', osceHtml);
}
