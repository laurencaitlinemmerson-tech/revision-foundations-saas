import { Metadata } from 'next';
import OperatorGate from './OperatorGate';
import TrainingClient from './training/TrainingClient';

export const metadata: Metadata = {
  title: 'Training',
  robots: { index: false, follow: false },
};

/**
 * The operator dashboard — Training.
 *
 * Sits behind the operator password gate, alongside /operator/nursing.
 */
export default function OperatorPage() {
  return (
    <OperatorGate>
      <TrainingClient />
    </OperatorGate>
  );
}
