import { ReactNode } from 'react';
import ResourceTracker from '@/components/dashboard/ResourceTracker';
import ResourcePDFWrapper from '@/components/ResourcePDFWrapper';

export default function ResourceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ResourceTracker />
      <ResourcePDFWrapper>
        {children}
      </ResourcePDFWrapper>
    </>
  );
}
