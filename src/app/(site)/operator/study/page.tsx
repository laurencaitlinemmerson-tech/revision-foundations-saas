import type { Metadata } from 'next';
import OperatorGate from '../OperatorGate';
import StudyClient from './StudyClient';

export const metadata: Metadata = {
  title: 'Study',
  robots: { index: false, follow: false },
};

export default function StudyPage() {
  return (
    <OperatorGate>
      <StudyClient />
    </OperatorGate>
  );
}
