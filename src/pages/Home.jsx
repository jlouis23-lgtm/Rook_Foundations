import HeroSection from '../components/home/HeroSection';
import ClassesPreview from '../components/home/ClassesPreview';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ClassesPreview />
      <TestimonialsPreview />
      <CTABanner />
    </>
  );
}