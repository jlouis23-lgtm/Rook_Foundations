import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];

// The three areas making up the enrichment offer. Presented as three
// neutral, equal-weight cards (bg-white border, NOT the coloured play-card
// treatment used for the Schools page's three session-FORMAT cards) because
// these aren't alternatives a school picks between — they're three facets
// of one flexible offer, so equal/neutral styling avoids implying they're
// competing options. Each gets a small coloured heading rule rather than an
// icon, per the brief's steer away from decorative/generic SEND imagery.
const offerAreas = [
  {
    key: 'games-strategy',
    accent: '#2d8c62',
    title: 'Games & Strategy',
    body: "Games can provide opportunities to explore strategy, planning and decision-making, and to practise turn-taking, concentration and persistence along the way. They can also create natural opportunities for interacting with others and thinking through choices and their consequences. Chess is one example we sometimes use, but it's just one part of a wider range of strategy and other games — each selected because it suits the pupils taking part, not because a particular game is assumed to be inherently better suited to SEND.",
  },
  {
    key: 'puzzles-exploration',
    accent: '#4a7eb8',
    title: 'Puzzles & Exploration',
    body: "Not every pupil engages best through a competitive or turn-based game, so we also draw on puzzles and exploratory activities — from tactile problem-solving resources and Rubik's cubes to open-ended challenges pupils can experiment with, investigate and work through at their own pace. These aren't a fallback for pupils who find games difficult; they're a valuable way to participate in their own right, through exploration, observation and independent problem-solving.",
  },
  {
    key: 'flexible-enrichment',
    accent: '#7a48c0',
    title: 'Flexible Enrichment',
    body: "Activities can be adapted around the pupil or group in many ways — adjusting the complexity, pace, instructions, grouping, equipment or the amount of support offered, among others. Adaptation doesn't only mean making something simpler: where it's a better fit, an activity can just as easily be made more challenging, extended or developed further, based on a pupil's interests and abilities. Our practitioners use their professional judgement, session by session, to decide what's appropriate for the pupils in front of them.",
  },
];

// Destination for the "Explore our approach to working with SEND pupils"
// link on the Schools page. "What We Offer" is Section 2 of the wider SEND
// project — the introductory hero is Section 1's own content, restated
// here. The remaining detailed material (group sizes, the SEND Group
// Information Form, school responsibilities, safeguarding boundaries, the
// Personalised Enrichment Review, FAQs, etc.) is still being developed and
// will be added to this page as further sections, so the closing notice
// stays honest about that rather than implying the page is finished.
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

      {/* What We Offer — Section 2. Matches "Our Sessions" on the Schools
          page (white, border-y, ChessBg "page") since this is likewise the
          first substantive content section on its page. Three neutral cards
          rather than the coloured play-card treatment: these three areas
          aren't alternatives to pick between, they're facets of one offer. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              The enrichment offer
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              What We Offer
            </h2>
          </div>

          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              Rook Foundations provides inclusive enrichment through a broad range of games, puzzles and activities — not a single fixed SEND programme. What we bring to a session is selected, adapted, combined or changed according to the pupils taking part, their interests and strengths, the purpose of the session, the environment, and how they respond once things get underway.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mt-4">
              The school knows its pupils; Rook Foundations knows its activities. Bringing the two together, and deciding what's most appropriate, is something we take seriously as part of our professional practice.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offerAreas.map((area, i) => (
              <motion.div
                key={area.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#2D2520]/10 rounded-3xl p-7 flex flex-col"
              >
                <div className="w-8 h-[3px] rounded-full mb-4" style={{ backgroundColor: area.accent }} aria-hidden="true" />
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">{area.title}</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{area.body}</p>
              </motion.div>
            ))}
          </div>

          <Reveal className="max-w-2xl mx-auto text-center mt-12">
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed">
              Across all of this, our practitioners aren't working from a fixed list of prescribed SEND activities — they can select, adapt, combine or change what's happening in response to the session as it unfolds, always within our usual safeguarding, safety and professional boundaries. And just as the activities themselves can flex, so can the way a pupil takes part in them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Honest work-in-progress notice — matches PreLaunchNotice's dark
          band treatment used elsewhere on the site for the same purpose.
          Scaled back now that real content exists above it: this simply
          flags that further sections are still being added, rather than
          framing the whole page as unfinished. */}
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
            More sections coming soon
          </span>
          <h2 className="font-fredoka text-white leading-tight mb-5" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
            We're continuing to build this page
          </h2>
          <p className="font-nunito text-white/65 text-base leading-relaxed mb-8">
            This is the first part of a fuller look at how Rook Foundations works with SEND pupils — more will be added here as it's ready. If you'd like to talk through SEND provision for your school now, I'd be very happy to hear from you.
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
