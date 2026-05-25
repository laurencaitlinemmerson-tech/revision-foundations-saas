import { Metadata } from 'next';
import './operator-dashboard.css';
import './operator-dashboard-polish.css';
import './print-issue.css';
import OperatorDashboardClient from './OperatorDashboardClient';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  robots: { index: false, follow: false },
};

export default function OperatorPage() {
  return <OperatorDashboardClient />;
}
