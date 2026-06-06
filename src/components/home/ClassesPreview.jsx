import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const phases = [
  {
    phase: '01', title: 'Discovery', ages: '', icon: '♟', tagline: 'Just starting out',
    emoji: '🌱',
    color: 'from-green-50 to-emerald-50',
    accent: '#2d8c62',
    border: 'border-green-200',
    tag: 'bg-green-100 text-green-700',
    desc: 'Through play and hands-on learning, young beginners explore the magic of chess one piece at a time. Visual, fun, and confidence-building from day one.',
    features: ['How each piece moves', 'Setting up the board', 'Your first checkmate', 'Learning through stories'],
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80'
  },
  {
    phase: '02', title: 'Development', ages: '', icon: '♞', tagline: 'Growing thinkers',
    emoji: '🧩',
    color: 'from-blue-50 to-sky-50',
    accent: '#4a7eb8',
    border: 'border-blue-200',
    tag: 'bg-blue-100 text-blue-700',
    desc: 'Children start to see patterns, set traps, and think 2–3 moves ahead. They begin to understand that chess is about plans, not just moves.',
    features: ['Tactics & patterns', 'Opening principles', 'Reading the board', 'Friendly mini-tournaments'],
    image: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&q=80'
  },
  {
    phase: '03', title: 'Strategy', ages: '', icon: '♛', tagline: 'Independent thinkers',
    emoji: '🏆',
    color: 'from-purple-50 to-violet-50',
    accent: '#7a48c0',
    border: 'border-purple-200',
    tag: 'bg-purple-100 text-purple-700',
    desc: 'Deeper analysis, competitive play, and the psychological dimensions of chess. These students are building a mindset for life — on and off the board.',
    features: ['Position and judgement', 'Timed challenges', 'Puzzle thinking', 'Endgame tips'],
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80'
  }
];

export default function ClassesPreview() {
  const [active, setActive] = useState(0);
  const p = phases[active];

  return (
    <section className="bg-[#F5F3EE] py-24 relative overflow-hidden">
      <ChessBg variant="classes" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#E8A020]/6 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-100/30 blob-shape-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">📚</span>
            <span className="font-nunito text-[#b8790a] text-sm font-700">Every child's journey is different</span>
          </div>
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
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-nunito font-700 text-sm transition-all duration-300 border-2 ${
                active === i
                  ? `bg-[#E8A020] text-white border-[#E8A020] shadow-lg shadow-[#E8A020]/25`
                  : `bg-white text-[#2D2520]/60 border-[#E8A020]/20 hover:border-[#E8A020]/50 hover:text-[#2D2520]`
              }`}
            >
              <span className="text-xl">{ph.emoji}</span>
              <div className="text-left">
                <span className="block leading-tight">{ph.title}</span>
                <span className={`text-[10px] font-600 leading-tight ${active === i ? 'text-white/70' : 'text-[#E8A020]/60'}`}>{ph.ages}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`bg-gradient-to-br ${p.color} border-2 ${p.border} rounded-3xl overflow-hidden shadow-lg`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Text side */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex items-center gap-2 ${p.tag} rounded-full px-4 py-1.5 mb-5 font-nunito text-xs font-700 uppercase tracking-wide`}>
                <span className="text-base">{p.emoji}</span>
                {p.tagline}
              </div>
              <h3 className="font-fredoka mb-4" style={{ fontSize: '2rem', color: p.accent }}>
                {p.title} Level
              </h3>
              <p className="font-nunito text-[#2D2520]/70 text-base leading-relaxed mb-7">{p.desc}</p>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-nunito text-[#2D2520]/75 text-sm">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{ backgroundColor: p.accent }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-white font-fredoka font-600 text-base px-7 py-3.5 rounded-2xl hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: p.accent }}>
                Enquire About This Level
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Image side */}
            <div className="relative overflow-hidden min-h-64 lg:min-h-0">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 inline-flex items-center gap-2">
                  <span className="text-base">👥</span>
                  <span className="font-nunito text-[#2D2520] text-sm font-700">In-person · Small groups · {p.ages}</span>
                </div>
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