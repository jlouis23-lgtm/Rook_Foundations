import { motion } from 'framer-motion';

const values = [
{
  icon: '♟',
  color: 'from-[#ddeaf7] to-[#cce0f5]',
  border: 'border-[#7aa8d4]/30',
  accent: '#4a7eb8',
  heading: 'Strategic Thinking',
    body: "Children learn to think ahead, compare different options, and evaluate the consequences of their decisions before making a move. As they play, they develop logical reasoning, pattern recognition, and problem solving skills. Students are encouraged to recognise connections between ideas, anticipate an opponent's plans, and adapt their approach as the game changes.",
  },
  {
    icon: '🌱',
    color: 'from-[#d8f0e6] to-[#c8eada]',
    border: 'border-[#4a8c6e]/30',
    accent: '#2d8c62',
    heading: 'Confidence & Resilience',
    body: 'Progress is measured in mindset over moves. We celebrate small breakthroughs, and bring energy into lessons to make progress feel rewarding and meaningful. Children often disengage when something does not come easily at first. By encouraging curiosity and steady improvement, our goal is to help students stay motivated and continue challenging themselves.',
  },
  {
    icon: '🎯',
    color: 'from-[#ece0f5] to-[#e2d0f0]',
    border: 'border-[#9a70c8]/30',
    accent: '#7a48c0',
    heading: 'Patience & Focus',
    body: 'Chess teaches children that good outcomes require careful thought and sustained attention. This occurs through exploring multiple possibilities and deciding which choice is best. There are often several good moves available. Once a child finds a good move, we encourage them to search for a better one based on their own plan and reasoning. This process involves evaluating options, thinking step by step, and resisting the urge to rush.',
  },
  {
    icon: '🤝',
    color: 'from-[#faefd5] to-[#f5e4b8]',
    border: 'border-[#D4A843]/35',
    accent: '#b8902e',
    heading: 'Supportive Environment',
    body: 'Our approach assures that children feel comfortable asking questions and exploring ideas without fear of getting things wrong. We avoid the "winning versus losing" mindset. Fear of losing can cause children to play too cautiously and miss chances to be creative and take initiative. We encourage ambitious ideas even when they do not work, because that is where the real learning happens.',
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="bg-[#EEEAE0] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">Our Community</span>
          <h2 className="font-oswald text-[#1C1C1E] uppercase leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
            What Families Can Expect
          </h2>
          <p className="font-lato text-[#2D2B26]/55 text-base max-w-xl mx-auto leading-relaxed">
            Rook Foundations is a growing programme built on genuine educational values. Here is what every student and family receives from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <div className="h-14 flex items-start">
                <h3 className="font-oswald text-[#1C1C1E] text-lg uppercase tracking-wide leading-tight">{v.heading}</h3>
              </div>
              <div className="w-8 h-px mb-4 opacity-40" style={{ backgroundColor: v.accent }} />
              <p className="font-lato text-[#2D2B26]/65 text-sm leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}