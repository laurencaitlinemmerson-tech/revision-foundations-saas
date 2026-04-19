'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import HeroSection from '@/components/home/HeroSection';
import ToolsShowcase from '@/components/home/ToolsShowcase';
import WhatsIncluded from '@/components/home/WhatsIncluded';
import AccessPaths from '@/components/home/AccessPaths';
import SamplePreviews from '@/components/home/SamplePreviews';
import FinalCTA from '@/components/home/FinalCTA';
import HomeStyles from '@/components/home/HomeStyles';
import { cream } from '@/components/home/styles';

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <Testimonials compact />
      <SamplePreviews />
      <ToolsShowcase />
      <WhatsIncluded />
      <AccessPaths />
      <FinalCTA />
      <Footer />
      <HomeStyles />
    </div>
  );
}

