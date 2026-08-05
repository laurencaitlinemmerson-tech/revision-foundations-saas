import { Metadata } from 'next';
import DailyLogClient from './DailyLogClient';

export const metadata: Metadata = {
  title: 'Daily log',
  robots: { index: false, follow: false },
};

export default function DailyLogPage() {
  return <DailyLogClient />;
}
