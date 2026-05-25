import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const cards = [
  {
    icon: '♟',
    color: 'from-[#1e2d4a]/70 to-[#12203a]/70',
    border: 'border-[#3a5c8c]/35',
    accent: '#7aa8d4',
    heading: 'Strategic Thinking',
    body: 'Every session is designed to stretch how children plan, reason, and adapt. Students learn to slow down, think ahead, and make decisions with purpose — skills that extend well beyond the board.',
  },
  {
    icon: '🌱',
    color: 'from-[#1e3a2d]/70 to-[#122a1e]/70',
    border: 'border-[#4a8c6e]/35',
    accent: '#6bbf9a',
    heading: 'Confidence & Resilience',
    body: 'Progress at Rook Foundations is measured in mindset, not just moves. Children are encouraged to embrace mistakes as learning, building the kind of quiet confidence that grows session by session.',
  },
  {
    icon: '🎯',
    color: 'from-[#2d1e3a]/70 to-[#1e1228]/70',
    border: 'border-[#6a4a8c]/35',
    accent: '#a07ad4',
    heading: 'Patience & Focus',
    body: 'Chess teaches children that good outcomes require careful thought and sustained attention. Each puzzle and game becomes a practice in patience — a quality that benefits concentration across all areas of learning.',
  },
  {
    icon: '🤝',
    color: 'from-[#2d2010]/70 to-[#1e1500]/70',
    border: 'border-[#8c6a3a]/35',
    accent: '#D4A843',
    heading: 'A Supportive Environment',
    body: 'Small group sizes ensure every child receives individual attention. Sessions are structured to feel safe, encouraging, and free from pressure — so students can develop at their own natural pace.',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Testimonials() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">

      {/* Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(212,168,67,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Our Community</span>
          <h1 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Our Community
          </h1>
          <p className="font-lato text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Rook Foundations is a new and growing programme built on genuine educational values. Here is what every student and family can expect from day one.
          </p>
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <div className="gold-line mx-auto mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">What Families Can Expect</span>
            <h2 className="font-oswald text-white uppercase" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              Built on thoughtful foundations
            </h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                variants={item}
                className={`relative rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} p-8
                  hover:scale-[1.015] transition-transform duration-300 cursor-default`}
                style={{ boxShadow: `0 4px 32px 0 ${card.accent}0f` }}
              >
                {/* Accent dot */}
                <div className="absolute top-5 right-5 w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: card.accent }} />

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl leading-none">{card.icon}</span>
                  <h3 className="font-oswald text-white text-xl uppercase tracking-wide">{card.heading}</h3>
                </div>

                <div className="w-10 h-px mb-4 opacity-50" style={{ backgroundColor: card.accent }} />

                <p className="font-lato text-white/60 text-base leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Authentic future-facing statement */}
      <section className="py-20 border-t border-[#D4A843]/10" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-4xl text-[#D4A843] block mb-6">♜</span>
            <div className="gold-line mx-auto mb-6" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-5">Growing Together</span>
            <h2 className="font-oswald text-white uppercase mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '0.02em' }}>
              Real experiences, shared honestly
            </h2>
            <p className="font-lato text-white/55 text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
              Rook Foundations is in the early stages of building a genuine student community. We believe trust is earned through real experiences — not manufactured reviews.
            </p>
            <p className="font-lato text-white/40 text-base leading-relaxed max-w-xl mx-auto mb-10">
              As our programme grows, we look forward to sharing authentic feedback from the students and families who have been part of this journey from the very beginning.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all"
            >
              JOIN OUR FIRST STUDENTS <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values strip */}
      <section className="border-t border-[#D4A843]/10 py-14" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4A843]/10">
            {[
              { symbol: '♟', label: 'Child-Centred' },
              { symbol: '♞', label: 'Evidence-Informed' },
              { symbol: '♝', label: 'Small Groups' },
              { symbol: '♛', label: 'Long-Term Thinking' },
            ].map((v) => (
              <div key={v.label} className="bg-[#0A0A0A] py-8 px-6 flex flex-col items-center text-center gap-3 hover:bg-[#111] transition-colors">
                <span className="text-2xl text-[#D4A843]">{v.symbol}</span>
                <span className="font-oswald text-white/70 text-sm uppercase tracking-widest">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}