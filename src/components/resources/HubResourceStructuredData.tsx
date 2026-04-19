import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import { type HubResourceSeoInput, getHubResourceStructuredData } from '@/lib/seo';

export default function HubResourceStructuredData({
  children,
  resource,
}: {
  children: ReactNode;
  resource: HubResourceSeoInput;
}) {
  const { article, breadcrumb } = getHubResourceStructuredData(resource);

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
