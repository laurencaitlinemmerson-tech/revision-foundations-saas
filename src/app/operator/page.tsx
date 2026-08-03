import { notFound } from 'next/navigation';
import { hasOperatorAccess } from '@/lib/operator/guard';
import { loadOperatorSnapshot } from '@/lib/operator/data';
import OperatorDashboard from './OperatorDashboard';

// Reads cookies and live Supabase rows — never cache, never prerender.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OperatorPage() {
  // Without the link (or with a stale one) the route does not exist as
  // far as the visitor is concerned — no login form to probe, nothing
  // that confirms there is anything here.
  if (!(await hasOperatorAccess())) notFound();

  const snapshot = await loadOperatorSnapshot();

  return <OperatorDashboard snapshot={snapshot} />;
}
