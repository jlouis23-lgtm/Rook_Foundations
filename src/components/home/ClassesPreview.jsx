import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Sprout, Puzzle, Trophy } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const phases = [
  {
    phase: '01', title: 'Discovery', ages: '', tagline: 'Just starting out',
    Icon: Sprout,
    accent: '#2d8c62',
    desc: 'Through play and hands-on learning, young beginners explore the magic of chess one piece at a time. Visual, fun, and confidence-building from day one.',
    features: ['How each piece moves', 'Setting up the board', 'Your first checkmate', 'Learning through stories'],
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80'
  },
  {
    phase: '02', title: 'Development', ages: '', tagline: 'Growing thinkers',
    Icon: Puzzle,
    accent: '#4a7eb8',
    desc: 'Children start to see patterns, set traps, and think 2–3 moves ahead. They begin to understand that chess is about plans, not just moves.',
    features: ['Tactics & patterns', 'Opening principles', 'Reading the board', 'Friendly mini-tournaments'],
    image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&q=80'
  },
  {
    phase: '03', title: 'Strategy', ages: '', tagline: 'Independent thinkers',
    Icon: Trophy,
    accent: '#7a48c0',
    desc: 'Deeper analysis, competitive play, and the psychological dimensions of chess. These students are building a mindset for life — on and off the board.',
    features: ['Position and judgement', 'Timed challenges', 'Puzzle thinking', 'Endgame tips'],
    image: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=600&q=80'
  }
];

export default function ClassesPreview() {
  const [active, setActive] = useState(0);
  const p = phases[active];

  return (
    <section className="bg-[#F5F3EE] py-24 relative overflow-hidden">
      <ChessBg variant="classes" />



      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <BookOpen size={14} /> Every child's journey is different
          </span>
          <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Where does your child fit in?
          </h2>
          <p className="font-nunito text-[#2D2520]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Three lovingly designed levels that meet every child exactly where they are — and gently grow with them.
          </p>
        </div>

        {/* Phase selector pills */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          {phases.map((ph, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative overflow-hidden flex items-center gap-3 px-6 py-3.5 rounded-2xl font-nunito font-700 text-sm transition-colors duration-300 border-2 ${
                active === i
                  ? `text-white border-[#E8A020]`
                  : `bg-white text-[#2D2520]/60 border-[#E8A020]/20 hover:border-[#E8A020]/50 hover:text-[#2D2520]`
              }`}
            >
              {active === i && (
                <motion.div
                  layoutId="classes-preview-pill"
                  className="absolute inset-0 bg-[#E8A020] rounded-2xl shadow-lg shadow-[#E8A020]/25"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <ph.Icon size={20} className="relative z-10" />
              <div className="relative z-10 text-left">
                <span className="block leading-tight">{ph.title}</span>
                <span className={`text-[10px] font-600 leading-tight ${active === i ? 'text-white/70' : 'text-[#E8A020]/60'}`}>{ph.ages}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Text side */}
          <div>
            <div className="inline-flex items-center gap-2 mb-5 font-nunito text-xs font-800 uppercase tracking-widest" style={{ color: p.accent }}>
              <p.Icon size={16} />
              {p.tagline}
            </div>
            <h3 className="font-fredoka mb-4" style={{ fontSize: '2rem', color: p.accent }}>
              {p.title} Level
            </h3>
            <p className="font-nunito text-[#2D2520]/70 text-base leading-relaxed mb-7">{p.desc}</p>
            <ul className="space-y-3 mb-8">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-nunito text-[#2D2520]/75 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.accent }} />
                  {f}
                </li>
              ))}
            </ul>
            <MotionLink
              whileTap={ctaTap}
              to="/contact"
              className="inline-flex items-center gap-2 text-white font-fredoka font-600 text-base px-7 py-3.5 rounded-2xl hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: p.accent }}>
              Enquire About This Level
              <ArrowRight size={18} />
            </MotionLink>
          </div>

          {/* Image side */}
          <div className="relative overflow-hidden rounded-3xl min-h-64 lg:min-h-[22rem] shadow-lg">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 inline-flex items-center gap-2">
                <Users size={16} className="text-[#2D2520]/70" />
                <span className="font-nunito text-[#2D2520] text-sm font-700">In-person · Small groups · {p.ages}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link to="/classes" onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-nunito text-[#E8A020] font-700 text-sm hover:gap-4 transition-all">
            See the full class breakdown <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}