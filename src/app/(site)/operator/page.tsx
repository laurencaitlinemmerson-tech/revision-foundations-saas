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
 * The previous Daily log dashboard is still available at /operator/daily-log;
 * both sit behind the same password gate.
 */
export default function OperatorPage() {
  return (
    <OperatorGate>
      <TrainingClient />
    </OperatorGate>
  );
}
