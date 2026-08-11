import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// A milestone moment, not a disclaimer — full-bleed dark band (same weight as
// CTABanner/the Pricing "Offer CTA") rather than a card floating on the page
// background, so it reads as a significant part of the homepage narrative.
// Reuses the dark/gold treatment already established on the About page's
// hero quote card (bg-[#2D2520], gold hairline, #F4C261 highlight) so the
// "dark card" language feels native to the site rather than newly invented.
export default function PreLaunchNotice() {
  return (
    <section className="relative overflow-hidden bg-[#2D2520] py-20 sm:py-24">
      <ChessBg variant="cta" />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(232,160,32,0.5), transparent)' }}
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={container}
        className="relative z-10 max-w-2xl mx-auto px-6 lg:px-12 text-center"
      >
        <motion.div variants={item} className="w-10 h-px bg-[#E8A020]/50 mx-auto mb-5" aria-hidden="true" />

        <motion.span
          variants={item}
          className="block font-nunito text-[#E8A020] text-xs font-800 uppercase tracking-[0.2em] mb-5"
        >
          Preparing for launch
        </motion.span>

        <motion.h2
          variants={item}
          className="font-fredoka text-white leading-tight mb-5"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)' }}
        >
          Rook Foundations is currently preparing for launch
        </motion.h2>

        <motion.p
          variants={item}
          className="font-nunito text-white/65 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8"
        >
          I am currently running pilot sessions and workshops with children to refine my approach and develop the best possible learning experience for families.
        </motion.p>

        <motion.div variants={item}>
          <Link
            to="/classes"
            onClick={() => window.scrollTo(0, 0)}
            className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#F4C261] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8A020] rounded-sm"
          >
            Discover our approach
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
