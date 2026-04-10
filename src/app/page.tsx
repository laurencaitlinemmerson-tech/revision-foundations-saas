'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import HeroSection from '@/components/home/HeroSection';
import ToolsShowcase from '@/components/home/ToolsShowcase';
import WhatsIncluded from '@/components/home/WhatsIncluded';
import AccessPaths from '@/components/home/AccessPaths';
import SamplePreviews from '@/components/home/SamplePreviews';
import StartHereDiagnostic from '@/components/home/StartHereDiagnostic';
import BundleCTA from '@/components/home/BundleCTA';
import HubGrid from '@/components/home/HubGrid';
import WhySection from '@/components/home/WhySection';
import FinalCTA from '@/components/home/FinalCTA';
import HomeStyles from '@/components/home/HomeStyles';
import { cream } from '@/components/home/styles';

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <StartHereDiagnostic />
      <Testimonials compact />
      <ToolsShowcase />
      <WhatsIncluded />
      <AccessPaths />
      <SamplePreviews />
      <BundleCTA />
      <HubGrid />
      <WhySection />
      <FinalCTA />
      <Footer />
      <HomeStyles />
    </div>
  );
}
