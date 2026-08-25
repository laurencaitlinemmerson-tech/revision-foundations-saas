import { NextRequest, NextResponse } from 'next/server';
import { buildPeerPayload } from '@/lib/peer/publish';
import { fetchPeer } from '@/lib/peer/read';

/**
 * Both sides of the head-to-head, assembled on the server.
 *
 * The peer's key stays here rather than travelling to the browser: the dashboard
 * is behind a password, but a key embedded in client JavaScript is readable by
 * anyone the page is ever shown to, and it is not this side's secret to leak.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = process.env.PEER_URL;
  const key = process.env.PEER_KEY;

  const [mine, theirs] = await Promise.all([
    buildPeerPayload().catch(() => null),
    url && key ? fetchPeer(url, key) : Promise.resolve({ ok: false as const, reason: 'unreachable' as const }),
  ]);

  return NextResponse.json(
    {
      you: mine,
      them: theirs.ok ? theirs.payload : null,
      // An unreachable partner renders as a "not connected" panel; this says why.
      peerError: theirs.ok ? null : theirs.reason,
      configured: Boolean(url && key),
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
