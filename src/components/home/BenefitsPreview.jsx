import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const benefits = [
  { emoji: '🧠', title: 'Sharper Focus', desc: 'Chess trains young minds to slow down, concentrate, and sustain attention — a skill that transfers directly to school and daily life.' },
  { emoji: '💪', title: 'Emotional Resilience', desc: 'Learning to lose gracefully and persist through difficulty builds the emotional strength children need to navigate life\'s challenges.' },
  { emoji: '🔍', title: 'Critical Thinking', desc: 'Every position is a new problem to solve. Children practise evaluating options, predicting outcomes, and making informed decisions.' },
  { emoji: '🌟', title: 'Genuine Confidence', desc: 'As children master new skills and experience real progress, their self-belief grows — and they start to see themselves as capable thinkers.' },
];

export default function BenefitsPreview() {
  return (
    <section className="bg-[#FAFAF7] py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/25 blob-shape pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-5">
              <span className="text-sm">🔬</span>
              <span className="font-nunito text-blue-700 text-sm font-700">What the research says</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Chess isn't just a game —<br />
              <span className="text-[#E8A020]">it's a thinking system.</span>
            </h2>
          </div>
          <div>
            <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed">
              Research consistently shows that children who play chess develop stronger reasoning, greater patience, and improved academic engagement. But the real magic is in what you can't measure — the look on a child's face when they spot a winning move for the very first time.
            </p>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 font-nunito text-[#E8A020] font-700 text-sm mt-5 hover:gap-4 transition-all">
              See the research <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="play-card bg-white border-2 border-[#E8A020]/15 rounded-3xl p-7 cursor-default"
            >
              <div className="text-4xl mb-4">{b.emoji}</div>
              <h3 className="font-fredoka text-[#2D2520] text-xl mb-2">{b.title}</h3>
              <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}