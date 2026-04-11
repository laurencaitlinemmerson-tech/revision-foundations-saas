'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardHeroPanel from '@/components/dashboard/DashboardHeroPanel';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string | null;
  hasOsce: boolean;
  hasQuiz: boolean;
}

export default function DashboardClient({
  children,
  firstName,
  hasOsce,
  hasQuiz,
}: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />
      <DashboardHeroPanel
        firstName={firstName}
        hasOsce={hasOsce}
        hasQuiz={hasQuiz}
      />
      <main className="pb-20 pt-8 md:pt-10">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
