import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];

// Destination for the "Explore our approach to working with SEND pupils"
// link on the Schools page. Only the gateway introduction has been written
// so far (Section 1 of the wider SEND project) — the detailed material
// (activity examples, group sizes, the SEND Group Information Form, school
// responsibilities, safeguarding boundaries, the Personalised Enrichment
// Review, FAQs, etc.) is still being developed and will be added to this
// page as its own sections, so the link isn't left pointing at an empty or
// broken destination in the meantime. Follows the same honest,
// work-in-progress framing already used elsewhere on the site (Pricing's
// "pricing is currently being finalised", Events.jsx's "coming soon") rather
// than implying content exists before it does.
export default function SendPupils() {
  usePageMeta(
    'Working with SEND Pupils | Rook Foundations',
    'Rook Foundations provides inclusive enrichment for pupils with SEND through games, puzzles and strategic activities, adapted around the individual pupil or group.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="schools" />
        <Reveal className="max-w-2xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            Inclusive enrichment
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
            Working with SEND Pupils
          </h1>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-xl mx-auto">
            Rook Foundations provides inclusive enrichment for pupils with SEND through games, puzzles and strategic activities. Sessions are shaped around meaningful participation, enjoyment and engagement, with activities adapted to suit the individual pupil or group.
          </p>
        </Reveal>
      </section>

      {/* Honest work-in-progress notice — matches PreLaunchNotice's dark
          band treatment used elsewhere on the site for the same purpose. */}
      <section className="relative overflow-hidden bg-[#2D2520] py-20">
        <ChessBg variant="faq" />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(232,160,32,0.5), transparent)' }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 max-w-xl mx-auto px-6 lg:px-12 text-center"
        >
          <span className="block font-nunito text-[#E8A020] text-xs font-800 uppercase tracking-[0.2em] mb-5">
            More detail coming soon
          </span>
          <h2 className="font-fredoka text-white leading-tight mb-5" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
            This page is being developed
          </h2>
          <p className="font-nunito text-white/65 text-base leading-relaxed mb-4">
            I'm putting together fuller detail on how Rook Foundations works with SEND pupils — the activities we use, how sessions are arranged, and what schools can expect from working together.
          </p>
          <p className="font-nunito text-white/65 text-base leading-relaxed mb-8">
            In the meantime, if you'd like to talk through SEND provision for your school, I'd be very happy to hear from you.
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
    </div>
  );
}
