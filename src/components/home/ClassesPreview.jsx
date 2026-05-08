import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 01',
    title: 'Discovery',
    ages: 'Ages 5–7',
    color: '#E8705A',
    icon: '♟',
    tagline: 'The First Move',
    desc: 'Through play and tactile learning, young beginners discover the magic of each chess piece. We make it fun, visual, and confidence-building from day one.',
    features: ['Piece names & movements', 'Tactile wooden sets', 'Storytelling approach', 'Small group sessions'],
    image: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80',
  },
  {
    phase: 'Phase 02',
    title: 'Strategy',
    ages: 'Ages 8–11',
    color: '#3D4F5C',
    icon: '♞',
    tagline: 'The Middle Game',
    desc: 'Students advance to tactical patterns, forks, pins, and the art of the plan. They begin to see the board as a system of connected decisions.',
    features: ['Tactics & patterns', 'Opening principles', 'Endgame fundamentals', 'Friendly tournaments'],
    image: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&q=80',
  },
  {
    phase: 'Phase 03',
    title: 'Mastery',
    ages: 'Ages 12–15',
    color: '#1A242B',
    icon: '♛',
    tagline: 'The Endgame',
    desc: 'Advanced analysis, competitive play preparation, and the psychological dimensions of chess. These students are building a mindset for life.',
    features: ['Deep positional analysis', 'Competitive preparation', 'Psychological resilience', 'Advanced study methods'],
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80',
  },
];

export default function ClassesPreview() {
  const [active, setActive] = useState(1);

  return (
    <section className="bg-slate py-28 relative overflow-hidden">
      {/* Ghost grid */}
      {[25, 50, 75].map((pos, i) => (
        <div key={i} className="ghost-grid-line" style={{ left: `${pos}%`, background: 'rgba(250,249,246,0.05)' }} />
      ))}

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">
            The Skill Tree
          </span>
          <h2 className="font-playfair text-ivory leading-tight mb-6"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600 }}>
            Find the right level for your child
          </h2>
          <p className="font-inter text-ivory/60 text-lg max-w-2xl mx-auto">
            Our three-phase curriculum meets every child exactly where they are and grows with them.
          </p>
        </div>

        {/* Phase tabs */}
        <div className="flex flex-col lg:flex-row gap-0 bg-midnight/40 rounded-2xl overflow-hidden border border-white/10">
          {/* Phase list */}
          <div className="lg:w-80 flex-shrink-0 flex flex-row lg:flex-col">
            {phases.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-1 lg:flex-none text-left px-8 py-6 transition-all duration-300 border-b lg:border-b-0 lg:border-r border-white/10 ${
                  active === i
                    ? 'bg-coral text-ivory'
                    : 'text-ivory/50 hover:text-ivory hover:bg-white/5'
                }`}
              >
                <div className="font-mono text-xs opacity-60 mb-1">{p.phase}</div>
                <div className="font-playfair text-lg font-600">{p.title}</div>
                <div className={`font-inter text-xs mt-1 ${active === i ? 'text-ivory/70' : 'text-ivory/30'}`}>
                  {p.ages}
                </div>
              </button>
            ))}
          </div>

          {/* Phase content */}
          <div className="flex-1 p-8 lg:p-12">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl text-coral">{phases[active].icon}</span>
                  <div>
                    <div className="font-inter text-ivory/40 text-xs tracking-widest uppercase">{phases[active].tagline}</div>
                    <div className="font-playfair text-ivory text-3xl font-600">{phases[active].title}</div>
                  </div>
                </div>
                <p className="font-inter text-ivory/70 text-base leading-relaxed mb-8">
                  {phases[active].desc}
                </p>
                <ul className="space-y-3">
                  {phases[active].features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 font-inter text-ivory/80 text-sm">
                      <span className="w-1.5 h-1.5 bg-coral rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 mt-8 bg-coral text-ivory font-inter font-600 text-sm px-6 py-3 rounded-full hover:bg-coral-dark transition-all hover:shadow-lg hover:shadow-coral/20"
                >
                  Enquire for {phases[active].ages} <ArrowRight size={16} />
                </Link>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-video lg:aspect-square">
                <img
                  src={phases[active].image}
                  alt={phases[active].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-midnight/20 to-midnight/60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-ivory/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3">
                    <span className="font-playfair text-ivory text-sm">{phases[active].ages}</span>
                    <span className="font-inter text-ivory/60 text-xs ml-2">· In-person · Small groups</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/classes"
            className="inline-flex items-center gap-2 font-inter text-ivory/60 hover:text-ivory text-sm transition-colors"
          >
            See full class schedule & pricing <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}