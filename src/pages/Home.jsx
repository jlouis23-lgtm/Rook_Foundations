import HeroSection from '../components/home/HeroSection';
import PreLaunchNotice from '../components/home/PreLaunchNotice';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import FAQSection from '../components/testimonials/FAQSection';
import BeginningCTA from '../components/home/BeginningCTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PreLaunchNotice />
      <TestimonialsPreview />
      <FAQSection />
      <BeginningCTA />
    </>
  );
}
