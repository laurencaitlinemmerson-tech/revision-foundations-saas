import type { Metadata } from 'next';
import OperatorGate from '../OperatorGate';
import NursingClient from './NursingClient';

export const metadata: Metadata = {
  title: 'Nursing',
  robots: { index: false, follow: false },
};

export default function NursingPage() {
  return (
    <OperatorGate>
      <NursingClient />
    </OperatorGate>
  );
}
