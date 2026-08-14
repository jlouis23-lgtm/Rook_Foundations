import HeroSection from '../components/home/HeroSection';
import PreLaunchNotice from '../components/home/PreLaunchNotice';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import FAQSection from '../components/testimonials/FAQSection';
import BeginningCTA from '../components/home/BeginningCTA';
import { usePageMeta } from '@/hooks/use-page-meta';

export default function Home() {
  usePageMeta(
    'Rook Foundations | Strategy Games & Learning for Children',
    'Rook Foundations is a growing education project using chess and strategy games to create meaningful learning opportunities for children, building confidence, character and skills for life.'
  );

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
