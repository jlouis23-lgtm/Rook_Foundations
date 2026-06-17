import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const bubbles = [
  {
    emoji: '🧠',
    color: 'bg-green-50 border-green-200',
    accent: '#2d8c62',
    label: 'Focus & Concentration',
    body: 'Chess trains children to slow down, sustain attention, and think before acting. These skills can extend beyond the board.',
    citation: '(Zhang et al., 2025)',
  },
  {
    emoji: '♟',
    color: 'bg-blue-50 border-blue-200',
    accent: '#4a7eb8',
    label: 'Decision-Making & Reasoning',
    body: 'Every move requires planning ahead, weighing consequences, and adapting when things change — helping children become logical, independent thinkers.',
    citation: '(Sala & Gobet, 2016)',
  },
  {
    emoji: '🤝',
    color: 'bg-amber-50 border-amber-200',
    accent: '#b8790a',
    label: 'Emotional & Social Growth',
    body: 'Children learn to respect opponents, follow rules, manage the emotions of winning and losing, and think under pressure.',
    citation: '(Fuentes et al., 2018)',
  },
  {
    emoji: '👩‍🏫',
    color: 'bg-purple-50 border-purple-200',
    accent: '#7a48c0',
    label: 'The Role of Teaching Quality',
    body: 'A large-scale study across 300+ schools found that chess has limited impact when instructors are not actively engaged throughout every session.',
    citation: '(EEF, 2018; Trinchero & Sala, 2016)',
  },
];



export default function WhyChessResearch() {
  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="whychess" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🔬</span>
            <span className="font-nunito text-green-700 text-sm font-700">Backed by research</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            How can chess benefit my child?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Research shows chess supports meaningful child development.
          </p>
        </div>

        {/* Bubble Network */}
        <div className="flex flex-col gap-4 mb-8">
          {bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={`play-card ${bubble.color} border-2 rounded-3xl p-6 ${i % 2 === 0 ? 'lg:mr-16' : 'lg:ml-16'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl leading-none">{bubble.emoji}</span>
                <h3 className="font-fredoka text-xl" style={{ color: bubble.accent }}>{bubble.label}</h3>
              </div>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-2">{bubble.body}</p>
              <span className="font-nunito text-xs italic" style={{ color: `${bubble.accent}99` }}>{bubble.citation}</span>
            </motion.div>
          ))}
        </div>

        {/* Mission card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.65 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl text-[#E8A020]">♜</span>
            <div>
              <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide block">Our Mission</span>
              <h3 className="font-fredoka text-[#2D2520] text-2xl">How We Teach</h3>
            </div>
          </div>
          <div className="w-10 h-1 bg-[#E8A020] rounded-full mb-5" />
          <p className="font-nunito text-[#2D2520]/70 text-base leading-relaxed mb-4">
            We recognise the limitations of chess as a transferrable skill and do not claim that chess alone guarantees academic or financial success.
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
            Instead, our aim is to create an engaging thinking environment using different types of games. Through these games, children develop <span className="text-[#b8790a] font-800" style={{ textShadow: '0 0 1px rgba(184,121,10,0.2)' }}>focus, reasoning, patience, and discipline</span>. It is our goal that, over time, these principles that they learn with us will support broader learning and extend positively into other areas of life.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-white border border-amber-200 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#E8A020]" />
            <span className="font-nunito text-[#b8790a] text-xs font-700">Research-informed · Parent-friendly · Child-centred</span>
          </div>
        </motion.div>

        {/* Research CTA */}
        <Link
          to="/references"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-4 bg-amber-50 border-2 border-amber-200 rounded-2xl px-6 py-5 hover:border-[#E8A020]/60 hover:shadow-md hover:shadow-[#E8A020]/10 transition-all group"
        >
          <span className="text-3xl flex-shrink-0">📚</span>
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