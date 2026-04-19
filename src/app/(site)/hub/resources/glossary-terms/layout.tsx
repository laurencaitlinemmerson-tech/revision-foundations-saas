import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Clinical Nursing Glossary',
  description: 'Key clinical and medical terms explained for student nurses — clear plain-English definitions across all nursing specialties.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
