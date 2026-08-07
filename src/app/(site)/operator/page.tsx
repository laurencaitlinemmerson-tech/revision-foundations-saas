import { Metadata } from 'next';
import OperatorGate from './OperatorGate';
import DailyLogClient from './daily-log/DailyLogClient';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  robots: { index: false, follow: false },
};

/**
 * The operator dashboard — the Daily log redesign.
 *
 * The previous warm-editorial dashboard is still available at /operator/legacy;
 * both sit behind the same password gate.
 */
export default function OperatorPage() {
  return (
    <OperatorGate>
      <DailyLogClient />
    </OperatorGate>
  );
}
