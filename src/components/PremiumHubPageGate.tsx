'use client';

import type { ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import LockedContent from '@/components/LockedContent';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

export default function PremiumHubPageGate({
  children,
  resourceTitle,
}: {
  children: ReactNode;
  resourceTitle: string;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const { isLoading, isPro } = useEntitlements();

  if (!isLoaded || isLoading) {
    return null;
  }

  if (!isSignedIn || !isPro) {
    return (
      <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '120px 24px 72px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <LockedContent
            title={`Unlock ${resourceTitle}`}
            description="This guide is one of the premium pathway resources. Keep the free pathway pages open to start, then upgrade when you want the deeper revision layer."
            features={[
              'Premium hub guides',
              'OSCE tool access',
              'Quiz bank access',
              'One payment with lifetime access',
            ]}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
