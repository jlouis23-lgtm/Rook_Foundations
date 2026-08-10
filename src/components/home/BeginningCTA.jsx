import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const EASE = [0.22, 1, 0.36, 1];

// The homepage's final invitation — sits after everything else so a parent
// reaches it only once they already understand what Rook Foundations is,
// how it teaches and how progress is tracked. Deliberately lighter than
// CTABanner above (no bold amber fill, no big rook glyph): this is a
// personal note, not the primary "book a session" push.
export default function BeginningCTA() {
  return (
    <section className="bg-[#F5F3EE] py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-xl mx-auto px-6 lg:px-12 text-center"
      >
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
          Be part of the beginning
        </h2>
        <p className="font-nunito text-[#2D2520]/60 text-base mt-4 mb-8 leading-relaxed">
          Rook Foundations is currently preparing for its first full programme. If you're interested in finding out more or would like to hear when bookings open, I'd love to hear from you.
        </p>
        <MotionLink
          whileTap={ctaTap}
          to="/contact"
          onClick={() => window.scrollTo(0, 0)}
          className="group inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
        >
          Get in Touch
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </MotionLink>
      </motion.div>
    </section>
  );
}
