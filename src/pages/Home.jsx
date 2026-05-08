import HeroSection from '../components/home/HeroSection';
import BenefitsPreview from '../components/home/BenefitsPreview';
import ClassesPreview from '../components/home/ClassesPreview';
import InstructorTeaser from '../components/home/InstructorTeaser';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsPreview />
      <ClassesPreview />
      <InstructorTeaser />
      <TestimonialsPreview />
      <CTABanner />
    </>
  );
}