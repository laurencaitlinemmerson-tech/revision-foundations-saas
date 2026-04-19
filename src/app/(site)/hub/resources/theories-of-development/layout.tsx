import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Theories of Child Development | Nursing',
  description: 'Piaget, Erikson, Bowlby, Vygotsky, and developmental milestones explained for nursing students in child health settings.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
