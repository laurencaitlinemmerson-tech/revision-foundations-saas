import { Metadata } from 'next';
import OperatorDashboardClient from './OperatorDashboardClient';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  robots: { index: false, follow: false },
};

export default function OperatorPage() {
  return <OperatorDashboardClient />;
}
