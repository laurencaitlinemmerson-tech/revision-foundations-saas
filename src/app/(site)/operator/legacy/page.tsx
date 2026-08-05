import { Metadata } from 'next';
import '../operator-dashboard.css';
import '../operator-dashboard-polish.css';
import '../print-issue.css';
import OperatorDashboardClient from '../OperatorDashboardClient';

export const metadata: Metadata = {
  title: 'Operator Dashboard · legacy',
  robots: { index: false, follow: false },
};

/**
 * The warm-editorial operator dashboard that /operator used to render.
 *
 * Kept reachable so the Nursing tab, arcade, supply drop and the live
 * Apple Health wiring stay available while the Daily log redesign catches up.
 * It carries its own password gate.
 */
export default function OperatorLegacyPage() {
  return <OperatorDashboardClient />;
}
