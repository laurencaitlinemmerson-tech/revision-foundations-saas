'use client';

import Link from 'next/link';
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
  return (
    <div className="ed">
      <style dangerouslySetInnerHTML={{ __html: EDITORIAL_CSS }} />
      <div className="ed-wrap">
        <Link href={backHref} className="ed-back">
          <span>←</span> {backLabel}
        </Link>
        <p className="ed-kicker">{kicker}</p>
        <h1 className="ed-headline">{title}</h1>
        <p className="ed-standfirst">{standfirst}</p>
        {byline && <p className="ed-byline">{byline}</p>}
        {children}
      </div>
    </div>
  );
}
