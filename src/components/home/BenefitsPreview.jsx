import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: '♞',
    title: 'Concentration & Focus',
    desc: 'Chess demands sustained attention, training children to block distractions and think deeply — skills that translate directly to academic performance.',
  },
  {
    icon: '♛',
    title: 'Strategic Thinking',
    desc: 'Every move requires planning several steps ahead. Children develop the ability to anticipate consequences and think long-term.',
  },
  {
    icon: '♝',
    title: 'Problem Solving',
    desc: 'Each game presents unique puzzles. Children learn to break down complex challenges into manageable steps and find creative solutions.',
  },
  {
    icon: '♚',
    title: 'Resilience & Patience',
    desc: 'Learning from defeats and staying composed under pressure builds emotional intelligence and a growth mindset that lasts a lifetime.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function BenefitsPreview() {
  return (
    <section className="bg-ivory py-28 relative overflow-hidden">
      {/* Ghost grid */}
      {[25, 50, 75].map((pos, i) => (
        <div key={i} className="ghost-grid-line" style={{ left: `${pos}%` }} />
      ))}

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
          <div>
            <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">
              The Cognitive Edge
            </span>
            <h2 className="font-playfair text-midnight leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Chess isn't just a game —<br />
              <em>it's a thinking system.</em>
            </h2>
          </div>
          <div>
            <p className="font-inter text-slate text-lg leading-relaxed">
              Research consistently shows that children who learn chess develop measurably stronger cognitive skills. 
              We've seen it in every student who walks through our doors.
            </p>
            <Link
              to="/benefits"
              className="inline-flex items-center gap-2 mt-6 font-inter text-coral text-sm font-500 hover:gap-3 transition-all"
            >
              Explore all benefits <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Benefits grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={item}
              className="group bg-white rounded-2xl p-8 border border-slate/8 hover:border-coral/30 hover:shadow-xl hover:shadow-coral/5 transition-all duration-400 cursor-default"
            >
              <div className="w-14 h-14 bg-slate/5 group-hover:bg-coral/10 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <span className="text-slate group-hover:text-coral text-2xl transition-colors duration-300">{b.icon}</span>
              </div>
              <h3 className="font-playfair text-midnight text-lg font-600 mb-3">{b.title}</h3>
              <p className="font-inter text-slate/80 text-sm leading-relaxed">{b.desc}</p>
              <div className="mt-6 w-8 h-px bg-coral/30 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}