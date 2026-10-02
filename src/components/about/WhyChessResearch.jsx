import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, BookOpen } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const EASE = [0.22, 1, 0.36, 1];

const bubbles = [
  {
    accent: '#2d8c62',
    label: 'Why we use games',
    body: [
      'Games are structured problems. They give children rules to work within, decisions to make, feedback on what happened and a reason to try again. That makes them a good setting for practising planning, reasoning and reflection.',
      'Practising a skill in a game is not the same as improving at school. The largest UK trial of chess lessons followed over 4,000 Year 5 pupils and found no effect on maths, reading or science results a year later, although many pupils enjoyed the lessons. We use games as opportunities to practise thinking, and we do not promise academic gains.',
    ],
    citation: 'Jerrim et al. (2016); Sala & Gobet (2017)',
  },
  {
    accent: '#4a7eb8',
    label: 'Why we use different games',
    body: [
      'Different games ask for different kinds of thinking. A spatial puzzle asks a child to picture how shapes fit together. Chess asks them to plan against an opponent. A one-player logic puzzle lets them test an idea, see it fail and correct it at their own pace. A cooperative game asks them to talk and share a goal.',
      'The research behind each type is uneven. Practice with spatial tasks has the strongest support: spatial skills improve with practice. For many of the commercial puzzles and board games we use, including SmartGames logic puzzles, we have not found independent studies of the specific products, so we rely on research into the kinds of thinking they involve and say so.',
    ],
    citation: 'Uttal et al. (2013); Mackey et al. (2011); Estrada-Plana et al. (2026)',
  },
  {
    accent: '#b8790a',
    label: 'Why adult guidance matters',
    body: [
      'A game on its own is only an activity. What an adult does around it matters: asking a child to explain their thinking, offering a clue instead of the answer, giving them another go and making time to look back at what worked.',
      'This is the part of our approach with the most research behind it. Studies of guided play, of asking learners to explain their reasoning and of teaching children to plan, monitor and review their own work broadly support this, though most of that research comes from classroom teaching and not from games. No study has tested our particular combination of games and guidance, so we treat it as a carefully reasoned approach that we keep reviewing.',
    ],
    citation: 'Skene et al. (2022); Bisra et al. (2018); Quigley et al. (2018)',
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
              {bubble.body.map((para) => (
                <p key={para} className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-3">{para}</p>
              ))}
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
    <section className="pt-8 sm:pt-10 pb-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="whychess" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 font-nunito text-green-700 text-sm font-800 uppercase tracking-widest mb-4">
            What the research says
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Why does Rook Foundations use games?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Games give children structured chances to practise thinking. Here is why we use them, and what research has and has not established.
          </p>
        </div>

        {/* Why games / why different games / why guidance — click a topic to reveal it, one at a time */}
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
            <p className="font-nunito text-[#2D2520]/55 text-sm mt-0.5">Every study we cite, with what it found and how far it applies.</p>
          </div>
          <ArrowRight size={18} className="text-[#E8A020] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
