import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const phases = [
{
  phase: '01', title: 'Discovery', ages: 'Ages 5–7', icon: '♟', tagline: 'The First Move',
  desc: 'Through play and hands on learning, beginners explore the magic of chess one piece at a time. Our lessons are visual, engaging, and designed to build confidence from day one.',
  features: ['Piece names & movements', 'How to checkmate', 'Storytelling approach', 'Progress through practice'],
  image: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80'
},
{
  phase: '02', title: 'Strategy', ages: 'Ages 8–11', icon: '♞', tagline: 'The Middle Game',
  desc: 'Students advance to tactical patterns, forks, pins, and the art of the plan. They begin to see the board as a system of connected decisions.',
  features: ['Tactics & patterns', 'Opening principles', 'Middle-game tactics', 'Friendly tournaments'],
  image: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&q=80'
},
{
  phase: '03', title: 'Advanced', ages: 'Ages 12–15', icon: '♛', tagline: 'The Endgame',
  desc: 'Deeper analysis, competitive play, and the psychological dimensions of chess. These students are building a mindset for life.',
  features: ['Positional analysis', 'Timed games & puzzles', 'Advanced concepts', 'Endgame fundamentals'],
  image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80'
}];


export default function ClassesPreview() {
  const [active, setActive] = useState(1);

  return (
    <section className="bg-[#FAFAF7] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
        <div className="gold-line mx-auto mb-5" />
        <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">The Skill Tree</span>
        <h2 className="font-oswald text-[#1C1C1E] uppercase leading-tight mb-4"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
          Find the right level for your child
        </h2>
        <p className="font-lato text-[#2D2B26]/60 text-lg max-w-2xl mx-auto">Three carefully designed phases that take every child from their very first move to confident strategic thinking. Lessons are adapted for different children.
        </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 border border-[#D4A843]/25 overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="lg:w-72 flex-shrink-0 grid grid-cols-3 lg:grid-cols-none lg:flex lg:flex-col border-b lg:border-b-0 lg:border-r border-[#D4A843]/20">
            {phases.map((p, i) =>
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center justify-center text-center lg:text-left lg:items-start px-2 lg:px-6 py-5 lg:py-6 transition-all duration-300 border-r lg:border-r-0 lg:border-b border-[#D4A843]/20 last:border-r-0 overflow-hidden ${
              active === i ? 'bg-[#D4A843] text-white' : 'text-[#2D2B26]/50 hover:text-[#1C1C1E] hover:bg-[#D4A843]/8'}`
              }>
                <div className={`font-lato text-[10px] mb-1 tracking-widest uppercase leading-none ${active === i ? 'text-white/70' : 'text-[#D4A843]/60'}`}>Phase {p.phase}</div>
                <div className="font-oswald text-sm lg:text-xl tracking-wide uppercase leading-tight w-full truncate lg:overflow-visible lg:whitespace-normal">{p.title}</div>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white p-8 lg:p-12">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl text-[#D4A843]">{phases[active].icon}</span>
                  <div>
                    <div className="font-lato text-[#D4A843]/70 text-xs tracking-widest uppercase">{phases[active].tagline}</div>
                    <div className="font-oswald text-[#1C1C1E] text-2xl uppercase tracking-wide">{phases[active].title}</div>
                  </div>
                </div>
                <p className="font-lato text-[#2D2B26]/65 text-base leading-relaxed mb-8">{phases[active].desc}</p>
                <ul className="space-y-3">
                  {phases[active].features.map((f, i) =>
                  <li key={i} className="flex items-center gap-3 font-lato text-[#2D2B26]/70 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#D4A843] flex-shrink-0" />
                      {f}
                    </li>
                  )}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 mt-8 bg-[#D4A843] text-white font-oswald font-700 text-sm tracking-wider px-6 py-3 hover:bg-[#b8902e] transition-all">
                  
                  ENQUIRE NOW <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative overflow-hidden aspect-video lg:aspect-square">
                <img src={phases[active].image} alt={phases[active].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/20 to-[#0A0A0A]/60" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/85 border border-[#D4A843]/30 px-4 py-3">
                <span className="font-lato text-[#2D2B26]/60 text-xs">In-person · Small groups</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/classes" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-2 font-oswald text-[#D4A843]/70 hover:text-[#D4A843] text-sm tracking-widest uppercase transition-colors">
            See full class schedule <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>);

}