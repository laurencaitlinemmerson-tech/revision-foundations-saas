import { notFound } from 'next/navigation';
import { PIP_TOKEN } from '../constants';
import PipForm from '../PipForm';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PipPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!PIP_TOKEN || token !== PIP_TOKEN) {
    notFound();
  }

  return <PipForm />;
}
