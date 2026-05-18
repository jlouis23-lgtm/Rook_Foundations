import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const values = [
  {
    icon: '♟',
    color: 'from-[#1e2d4a]/60 to-[#12203a]/60',
    border: 'border-[#3a5c8c]/30',
    accent: '#7aa8d4',
    heading: 'Strategic Thinking',
    body: 'Children learn to plan ahead, weigh consequences, and make thoughtful decisions — habits that extend into every area of life.',
  },
  {
    icon: '🌱',
    color: 'from-[#1e3a2d]/60 to-[#122a1e]/60',
    border: 'border-[#4a8c6e]/30',
    accent: '#6bbf9a',
    heading: 'Confidence & Resilience',
    body: 'Progress is measured in mindset, not just moves. Students are encouraged to embrace mistakes and grow at their own pace.',
  },
  {
    icon: '🤝',
    color: 'from-[#2d2010]/60 to-[#1e1500]/60',
    border: 'border-[#8c6a3a]/30',
    accent: '#D4A843',
    heading: 'Supportive Environment',
    body: 'Small groups, individual attention, and a calm structured space where every child feels safe to think, try, and grow.',
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="bg-[#111111] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">Our Community</span>
          <h2 className="font-oswald text-white uppercase leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
            What Families Can Expect
          </h2>
          <p className="font-lato text-white/40 text-base max-w-xl mx-auto leading-relaxed">
            Rook Foundations is a growing programme built on genuine educational values. Here is what every student and family receives from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-2xl border ${v.border} bg-gradient-to-br ${v.color} p-8
                hover:scale-[1.015] transition-transform duration-300`}
              style={{ boxShadow: `0 4px 24px 0 ${v.accent}0d` }}
            >
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: v.accent }} />
              <span className="text-3xl block mb-4">{v.icon}</span>
              <h3 className="font-oswald text-white text-lg uppercase tracking-wide mb-3">{v.heading}</h3>
              <div className="w-8 h-px mb-4 opacity-40" style={{ backgroundColor: v.accent }} />
              <p className="font-lato text-white/60 text-sm leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-12"
        >
          <p className="font-lato text-white/30 text-sm italic mb-5 max-w-xl mx-auto leading-relaxed">
            As our student community grows, we look forward to sharing authentic experiences from the families who have been part of our journey from the very beginning.
          </p>
          <Link to="/testimonials" className="inline-flex items-center gap-2 font-oswald text-[#D4A843] text-sm tracking-widest uppercase hover:gap-4 transition-all">
            Our approach & values <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}