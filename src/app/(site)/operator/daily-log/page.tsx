import { Metadata } from 'next';
import OperatorGate from '../OperatorGate';
import DailyLogClient from './DailyLogClient';

export const metadata: Metadata = {
  title: 'Daily log',
  robots: { index: false, follow: false },
};

/**
 * The previous operator dashboard, kept reachable after Training took over
 * /operator. It reads the same sources, so nothing here needs migrating.
 */
export default function DailyLogPage() {
  return (
    <OperatorGate>
      <DailyLogClient />
    </OperatorGate>
  );
}
