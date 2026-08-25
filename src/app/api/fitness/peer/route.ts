import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { buildPeerPayload } from '@/lib/peer/publish';

/**
 * This side's peer document — read-only, for the paired tracker to fetch.
 *
 * A wrong or missing key returns 404 rather than 401, so the endpoint is not
 * discoverable by probing. The key is its own secret: it never unlocks a write
 * path, so handing it over grants reading this document and nothing else.
 */

export const dynamic = 'force-dynamic';

function keyMatches(presented: string) {
  const expected = process.env.PEER_PUBLISH_KEY ?? '';
  if (!expected || !presented) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const notFound = () =>
  new NextResponse('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });

export async function GET(req: NextRequest) {
  if (!keyMatches(new URL(req.url).searchParams.get('key') ?? '')) return notFound();

  try {
    const payload = await buildPeerPayload();
    return NextResponse.json(payload, {
      headers: {
        // A scoreboard showing yesterday's numbers as though they were live is
        // worse than one that is briefly unavailable.
        'cache-control': 'no-store',
      },
    });
  } catch {
    return new NextResponse('Unavailable', { status: 503, headers: { 'cache-control': 'no-store' } });
  }
}
