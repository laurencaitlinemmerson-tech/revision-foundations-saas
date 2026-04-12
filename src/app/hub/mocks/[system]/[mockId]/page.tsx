import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { bodySystems } from '../../mockTypes';
import { getMockById } from '../../mockData';
import MockExamClient from './MockExamClient';

interface Props {
  params: Promise<{ system: string; mockId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { system: systemId, mockId } = await params;
  const mock = getMockById(systemId, mockId);
  if (!mock) return {};
  const system = bodySystems.find((s) => s.id === systemId);
  return {
    title: `${mock.title} | ${system?.label ?? ''} Written Practice | The Nurse Lab`,
    description: mock.description,
  };
}

export default async function MockExamPage({ params }: Props) {
  const { system: systemId, mockId } = await params;
  const mock = getMockById(systemId, mockId);
  if (!mock) notFound();

  return (
    <>
      <Navbar />
      <MockExamClient mock={mock} />
      <Footer />
    </>
  );
}
