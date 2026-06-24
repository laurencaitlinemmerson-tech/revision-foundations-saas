import { Metadata } from 'next';
import './operator-dashboard.css';
import './operator-dashboard-polish.css';
import './operator-dashboard-reference.css';
import OperatorDashboardClient from './OperatorDashboardClient';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  robots: { index: false, follow: false },
};

export default function OperatorPage() {
  return <OperatorDashboardClient />;
}
