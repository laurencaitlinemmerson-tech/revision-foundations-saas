'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChromeless = pathname?.startsWith('/operator');

  if (isChromeless) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
