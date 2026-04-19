import { generatePageMetadata } from '@/lib/seo';
import Testimonials from '@/components/Testimonials';
import HeroSection from '@/components/home/HeroSection';
import ToolsShowcase from '@/components/home/ToolsShowcase';
import WhatsIncluded from '@/components/home/WhatsIncluded';
import AccessPaths from '@/components/home/AccessPaths';
import SamplePreviews from '@/components/home/SamplePreviews';
import FinalCTA from '@/components/home/FinalCTA';
import HomeStyles from '@/components/home/HomeStyles';
import { cream } from '@/components/home/styles';

export const metadata = generatePageMetadata({
  title: 'The calm revision system for UK nursing students',
  description:
    "Practise children's nursing OSCE stations, strengthen core nursing knowledge, and use placement-ready revision guides in one calm study space built for how student nurses actually revise.",
  path: '/',
});

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <HeroSection />
      <Testimonials compact />
      <SamplePreviews />
      <ToolsShowcase />
      <WhatsIncluded />
      <AccessPaths />
      <FinalCTA />
      <HomeStyles />
    </div>
  );
}
