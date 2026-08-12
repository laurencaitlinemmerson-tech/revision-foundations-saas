import { notFound } from 'next/navigation';
import { hasOperatorAccess } from '@/lib/operator/guard';
import { loadWeddingSnapshot } from '@/lib/wedding/data';
import WeddingHub from './WeddingHub';

// Reads cookies and live Supabase rows — never cache, never prerender.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WeddingPage() {
  // Same gate as the rest of /operator: without the link this route
  // does not exist as far as a visitor is concerned.
  if (!(await hasOperatorAccess())) notFound();

  const snapshot = await loadWeddingSnapshot();

  return <WeddingHub snapshot={snapshot} />;
}
