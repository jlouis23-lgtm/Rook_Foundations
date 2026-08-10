import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Sits between the hero and the rest of the homepage — secondary context
// once a parent already understands what Rook Foundations is, not a
// replacement for the hero introduction. Reuses the same white-card
// pre-launch treatment established on the Booking page, so the two read
// as one consistent "pre-launch" pattern rather than two different ideas.
export default function PreLaunchNotice() {
  return (
    <section className="bg-[#FAFAF7] px-6 lg:px-12 pb-4">
      {/* No extra top padding — HeroSection's own pb-20/24 already provides
          the gap above. No large bottom padding either — TestimonialsPreview
          right after this shares the same background and already opens
          with py-24, so stacking both would create excess whitespace. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-xl mx-auto text-center bg-white border border-[#2D2520]/10 rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-sm"
      >
        <h2 className="font-fredoka text-[#2D2520] text-xl sm:text-2xl mb-3">
          Rook Foundations is currently preparing for launch.
        </h2>
        <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
          We're currently running pilot sessions and workshops with children to refine our approach and develop the best possible learning experience for families.
        </p>
        <Link
          to="/classes"
          onClick={() => window.scrollTo(0, 0)}
          className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#b8790a] transition-colors mt-4"
        >
          Discover our approach
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
