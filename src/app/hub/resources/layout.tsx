import { ReactNode } from 'react';
import ResourceTracker from '@/components/dashboard/ResourceTracker';
import ResourcePDFWrapper from '@/components/ResourcePDFWrapper';
import StudyToolbar from '@/components/StudyToolbar';

export default function ResourceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ResourceTracker />
      <ResourcePDFWrapper>
        {children}
      </ResourcePDFWrapper>
      <StudyToolbar />
    </>
  );
}
