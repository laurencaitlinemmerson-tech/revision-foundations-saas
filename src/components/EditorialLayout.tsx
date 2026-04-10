'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import { EDITORIAL_CSS } from '@/lib/editorialStyles';

interface EditorialLayoutProps {
  kicker: string;
  title: string;
  standfirst: string;
  byline?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function EditorialLayout({
  kicker,
  title,
  standfirst,
  byline,
  backHref = '/hub/childrens',
  backLabel = "Children's Hub",
  children,
}: EditorialLayoutProps) {
  const pathname = usePathname();
  const hubItemId = pathname.startsWith('/hub/resources/')
    ? pathname.replace('/hub/resources/', '').split('/')[0]
    : pathname === '/hub/glossary'
    ? 'glossary'
    : null;

  return (
    <div className="ed">
      <style dangerouslySetInnerHTML={{ __html: EDITORIAL_CSS }} />
      <div className="ed-wrap">
        <header className="ed-header">
          <Link href={backHref} className="ed-back">
            <span>←</span> {backLabel}
          </Link>
          <p className="ed-kicker">{kicker}</p>
          <h1 className="ed-headline">{title}</h1>
          <p className="ed-standfirst">{standfirst}</p>
          {(byline || hubItemId) && (
            <div className="ed-meta">
              {byline ? <p className="ed-byline">{byline}</p> : null}
              {hubItemId ? (
                <EditorialSaveButton hubItemId={hubItemId} hubItemTitle={title} />
              ) : null}
            </div>
          )}
        </header>
        <div className="ed-body">{children}</div>
      </div>
    </div>
  );
}
