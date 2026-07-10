import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ScanEye, GitBranch, HeartHandshake, GraduationCap, PuzzleIcon, TrendingUp, MonitorSmartphone, Users, BookOpen, FlaskConical } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import InteractiveRookPillars from '@/components/about/InteractiveRookPillars';

const EASE = [0.22, 1, 0.36, 1];

const bubbles = [
  {
    Icon: ScanEye,
    accent: '#2d8c62',
    label: 'Focus & Concentration',
    body: 'Chess trains children to slow down, sustain attention, and think before acting. These skills can extend beyond the board.',
    citation: '(Zhang et al., 2025)',
  },
  {
    Icon: GitBranch,
    accent: '#4a7eb8',
    label: 'Decision-Making & Reasoning',
    body: 'Every move requires planning ahead, weighing consequences, and adapting when things change. This can help children become logical, independent thinkers.',
    citation: '(Sala & Gobet, 2016)',
  },
  {
    Icon: HeartHandshake,
    accent: '#b8790a',
    label: 'Emotional & Social Growth',
    body: 'Children learn to respect opponents, follow rules, manage the emotions of winning and losing, and think under pressure.',
    citation: '(Fuentes et al., 2018)',
  },
  {
    Icon: GraduationCap,
    accent: '#7a48c0',
    label: 'The Role of Teaching Quality',
    body: 'A large-scale study across 300+ schools found that chess has limited impact when instructors are not actively engaged throughout every session.',
    citation: '(EEF, 2018; Trinchero & Sala, 2016)',
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
        <div className="flex items-center gap-3">
          <bubble.Icon size={20} style={{ color: bubble.accent, flexShrink: 0 }} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
          <h3 className="font-fredoka text-lg sm:text-xl" style={{ color: bubble.accent }}>{bubble.label}</h3>
        </div>
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
            <div className="pl-8 pb-6 -mt-1">
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

        {/* Research summary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <Link
            to="/research-summary"
            onClick={() => window.scrollTo(0, 0)}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-br from-amber-50 to-white border border-[#E8A020]/20 rounded-3xl p-7 hover:border-[#E8A020]/40 hover:shadow-lg hover:shadow-[#E8A020]/10 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E8A020]/12 flex items-center justify-center flex-shrink-0">
              <FlaskConical size={26} className="text-[#E8A020]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-fredoka text-[#2D2520] text-xl mb-1">Want to know what UK research really shows?</h3>
              <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
                See how strategy games can support children's learning, confidence and emotional wellbeing, in a plain English summary of UK studies on academic performance, emotional regulation and trauma informed practice.
              </p>
            </div>
            <ArrowRight size={20} className="text-[#E8A020] flex-shrink-0 group-hover:translate-x-1 transition-transform hidden sm:block" />
          </Link>
        </motion.div>

        {/* How We Teach — expanded mission section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.65 }}
          className="mb-10"
        >
          {/* Section header — intentional dark surface for emphasis */}
          <div className="bg-[#2D2520] rounded-3xl px-8 py-8 mb-10 relative overflow-hidden">
            <div className="absolute right-6 bottom-3 text-white/5 font-fredoka select-none pointer-events-none" style={{ fontSize: '6rem', lineHeight: 1 }} aria-hidden="true">♜</div>

            {/* Disclaimer indicator — absolutely positioned, no impact on flow */}
            <div className="absolute top-6 right-8 flex flex-col items-center gap-0.5 z-20">
              <svg width="36" height="32" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.134 2.5C13.5188 1.833 14.4812 1.833 14.866 2.5L26.1244 22C26.5092 22.667 26.028 23.5 25.2583 23.5H2.74167C1.97202 23.5 1.49076 22.667 1.87565 22L13.134 2.5Z" fill="#E8A020" fillOpacity="0.22" stroke="#E8A020" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round"/>
                <text x="14" y="18" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="11" fontWeight="600" fill="#F4C261">!</text>
              </svg>
              <span className="font-nunito text-[#E8A020]/70 text-xs font-700 tracking-wide uppercase">Disclaimer</span>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 2 C22 12, 16 24, 6 38" stroke="#E8A020" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="3.5 2.5"/>
                <path d="M2 34 L6 40 L11 36" stroke="#E8A020" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>

            <span className="font-nunito text-[#E8A020] text-xs font-700 uppercase tracking-widest block mb-2">Our Mission</span>
            <h3 className="font-fredoka text-white text-3xl mb-4 relative z-10">How We Teach</h3>
            <div className="w-10 h-1 bg-[#E8A020] rounded-full mb-5" />

            <p className="font-nunito text-white/75 text-base leading-relaxed mb-3 relative z-10">
              We recognise the limitations of transferring skills from strategy games into other domains and do NOT claim that these games alone guarantee academic or financial success.
            </p>
            <p className="font-nunito text-white/65 text-sm leading-relaxed relative z-10">
              Instead, our aim is to create an engaging thinking environment using a wide variety of tactics and ways of thinking. Through these games, children develop <span className="text-[#F4C261] font-700">focus, reasoning, patience, communication, and discipline</span>. We believe that, when nurtured through enjoyment and challenging play, the skills that they learn with us can support broader learning and extend positively into other areas of life.
            </p>
          </div>

          {/* Core principles — interactive rook illustration */}
          <InteractiveRookPillars />
        </motion.div>
      </div>

      {/* Secondary pillars — full-width breakout, matching the games gallery supporting content above */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {[
            { Icon: PuzzleIcon,        label: 'Puzzles & Decision Making', accent: '#b8790a', body: 'Puzzles are designed to strengthen reasoning and problem-solving skills. Rather than teaching that one move is "right" and another "wrong", we encourage children to explore multiple possibilities, evaluate their options, and make thoughtful decisions based on reflection.' },
            { Icon: TrendingUp,        label: 'Tracking Progress',          accent: '#2d8c62', body: 'Personalised feedback is recorded through observation and note taking. Parents can view learning goals, achievements, and areas for development in one place. Children also have access to their progress, helping them build confidence and ownership of their learning journey.' },
            { Icon: MonitorSmartphone, label: 'Using Technology Carefully',  accent: '#4a7eb8', body: 'Children deserve meaningful face-to-face interaction while in education. We value hands-on learning using real boards. However, some selected digital tools are used to help aid understanding and memory of more complex concepts.' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><item.Icon size={28} style={{ color: item.accent }} /></div>
              <h3 className="font-fredoka text-lg mb-3" style={{ color: item.accent }}>{item.label}</h3>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Individual vs Group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="border-t border-b border-[#2D2520]/10 py-7 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-[#b8790a] flex-shrink-0" />
            <h4 className="font-fredoka text-lg text-[#b8790a]">Individual & Group Learning</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide block mb-2">Individual Sessions</span>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">Focus on developing thinking skills through puzzles, strategy, and personalised guidance tailored to each child's learning needs.</p>
            </div>
            <div className="sm:border-l sm:border-[#2D2520]/10 sm:pl-8">
              <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide block mb-2">Group Sessions</span>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">Focus on applying these skills through gameplay. Children learn to communicate ideas, collaborate, show respect, and practise patience in a positive social environment.</p>
            </div>
          </div>
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
