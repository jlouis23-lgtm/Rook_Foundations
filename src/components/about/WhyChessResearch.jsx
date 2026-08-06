import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, BookOpen, FlaskConical } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const EASE = [0.22, 1, 0.36, 1];

const bubbles = [
  {
    accent: '#2d8c62',
    label: 'Focus & Concentration',
    body: 'Chess trains children to slow down, sustain attention, and think before acting. These skills can extend beyond the board.',
    citation: '(Zhang et al., 2025)',
  },
  {
    accent: '#4a7eb8',
    label: 'Decision-Making & Reasoning',
    body: 'Every move requires planning ahead, weighing consequences, and adapting when things change. This can help children become logical, independent thinkers.',
    citation: '(Sala & Gobet, 2016)',
  },
  {
    accent: '#b8790a',
    label: 'Emotional & Social Growth',
    body: 'Children learn to respect opponents, follow rules, manage the emotions of winning and losing, and think under pressure.',
    citation: '(Fuentes et al., 2018)',
  },
];

function ResearchItem({ bubble, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-4 py-6 text-left"
      >
        <h3 className="font-fredoka text-lg sm:text-xl" style={{ color: bubble.accent }}>{bubble.label}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} className="text-[#E8A020]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 -mt-1">
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-2">{bubble.body}</p>
              <span className="font-nunito text-xs italic" style={{ color: `${bubble.accent}99` }}>{bubble.citation}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WhyChessResearch() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="whychess" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 font-nunito text-green-700 text-sm font-800 uppercase tracking-widest mb-4">
            <FlaskConical size={14} /> Backed by research
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            How can strategy games benefit my child?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Chess provides a powerful example of how strategic games can help children develop important skills both inside and outside the classroom.
          </p>
        </div>

        {/* Research findings — click a topic to reveal it, one at a time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-[#2D2520]/8 divide-y divide-[#2D2520]/8 mb-14"
        >
          {bubbles.map((bubble, i) => (
            <ResearchItem
              key={i}
              bubble={bubble}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* Values line */}
        <div className="mb-14 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E8A020]" />
          <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide">Child-centred · Play-focused · Personalised support</span>
        </div>

        {/* Research CTA */}
        <Link
          to="/references"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-4 border-t border-b border-[#2D2520]/10 py-6 hover:bg-amber-50/40 transition-colors group"
        >
          <BookOpen size={28} className="text-[#b8790a] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-fredoka text-[#2D2520] text-lg leading-tight">Interested in the research behind our approach?</p>
            <p className="font-nunito text-[#2D2520]/55 text-sm mt-0.5">Explore the studies and sources we use — with parent-friendly summaries.</p>
          </div>
          <ArrowRight size={18} className="text-[#E8A020] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
