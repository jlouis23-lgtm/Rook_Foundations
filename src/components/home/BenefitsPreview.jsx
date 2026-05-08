import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const benefits = [
  { icon: '🧠', title: 'Concentration & Focus', desc: 'Chess demands sustained attention, training children to block distractions and think deeply — skills that translate directly to academic performance.' },
  { icon: '♛', title: 'Strategic Thinking', desc: 'Every move requires planning several steps ahead. Children develop the ability to anticipate consequences and think long-term.' },
  { icon: '💡', title: 'Problem Solving', desc: 'Each game presents unique puzzles. Children learn to break down complex challenges into manageable steps and find creative solutions.' },
  { icon: '❤️', title: 'Resilience & Patience', desc: 'Learning from defeats and staying composed under pressure builds emotional intelligence and a growth mindset that lasts a lifetime.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function BenefitsPreview() {
  return (
    <section className="bg-[#0D0D0D] py-28 relative overflow-hidden">
      <div className="ghost-grid-line" style={{ left: '25%' }} />
      <div className="ghost-grid-line" style={{ left: '50%' }} />
      <div className="ghost-grid-line" style={{ left: '75%' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <div className="gold-line mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">The Cognitive Edge</span>
            <h2 className="font-oswald text-white uppercase leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
              Chess isn't just a game —<br />
              <span className="text-[#D4A843]">it's a thinking system.</span>
            </h2>
          </div>
          <div>
            <p className="font-lato text-white/60 text-lg leading-relaxed">
              Research consistently shows that children who learn chess develop measurably stronger cognitive skills. We've seen it in every student.
            </p>
            <Link to="/benefits" className="inline-flex items-center gap-2 mt-6 font-oswald text-[#D4A843] text-sm tracking-widest uppercase hover:gap-3 transition-all">
              Explore all benefits <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4A843]/10"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={item}
              className="group bg-[#0D0D0D] p-8 hover:bg-[#111111] transition-colors duration-300 cursor-default border border-transparent hover:border-[#D4A843]/20"
            >
              <div className="text-4xl mb-5">{b.icon}</div>
              <h3 className="font-oswald text-white text-lg uppercase tracking-wide mb-3 group-hover:text-[#D4A843] transition-colors">{b.title}</h3>
              <p className="font-lato text-white/50 text-sm leading-relaxed">{b.desc}</p>
              <div className="mt-6 w-8 h-0.5 bg-[#D4A843]/30 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}