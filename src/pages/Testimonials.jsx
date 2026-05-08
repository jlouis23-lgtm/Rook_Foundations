import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  { quote: "My daughter's teacher commented on how much her concentration had improved after just two months of classes. She's calmer, more thoughtful, and absolutely loves coming every week.", author: "Sarah M.", role: "Parent of Emma, age 9", phase: "Strategy Phase", rating: 5, highlight: "Concentration improved in 2 months" },
  { quote: "I was skeptical at first — chess seemed like it was for older or 'academic' kids. But the way it's taught at RookFoundations makes it genuinely joyful. My son asks to practise every single night.", author: "James T.", role: "Parent of Oliver, age 7", phase: "Discovery Phase", rating: 5, highlight: "Asks to practise every night" },
  { quote: "The structured approach and Alex's patience with the children is outstanding. My son went from a complete beginner to competing in his first regional tournament in just 6 months.", author: "Priya K.", role: "Parent of Aryan, age 12", phase: "Mastery Phase", rating: 5, highlight: "First tournament in 6 months" },
  { quote: "As a sceptical parent, I appreciate that the curriculum is evidence-based and there's clear progression. My daughter has shown marked improvement in her schoolwork.", author: "David L.", role: "Parent of Sophie, age 10", phase: "Strategy Phase", rating: 5, highlight: "Measurable school improvement" },
  { quote: "What I love most is that Alex focuses on the children's confidence, not just the chess. My shy son has come out of his shell completely. He's a different child.", author: "Michelle R.", role: "Parent of Thomas, age 8", phase: "Discovery Phase", rating: 5, highlight: "Transformed his confidence" },
  { quote: "The small group format is perfect. Every child gets individual attention and there's genuine warmth in every session. It's become the highlight of my twins' week.", author: "Anthony N.", role: "Parent of Lila & Ben, ages 11", phase: "Strategy Phase", rating: 5, highlight: "Highlight of their week" },
  { quote: "I never expected chess to help with maths but my daughter's arithmetic has genuinely improved. She thinks in steps now — working backward from the answer. It's remarkable.", author: "Fatima A.", role: "Parent of Zara, age 9", phase: "Strategy Phase", rating: 5, highlight: "Unexpected maths improvement" },
  { quote: "My son has ADHD and I was worried it wouldn't work. Alex was incredible — patient, adaptive, and my son's ability to focus in class has improved dramatically.", author: "Mark S.", role: "Parent of Leo, age 11", phase: "Strategy Phase", rating: 5, highlight: "ADHD — dramatic focus improvement" },
  { quote: "RookFoundations feels like a community, not just a class. The children celebrate each other's wins and support each other through losses.", author: "Claire B.", role: "Parent of Isla, age 8", phase: "Discovery Phase", rating: 5, highlight: "Community and sportsmanship" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function Testimonials() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Parent Voices</span>
          <h1 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            What families say about us
          </h1>
          <p className="font-lato text-white/50 text-lg max-w-2xl mx-auto">
            Real stories from real parents. Every testimonial below is from a family whose child has attended RookFoundations.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#D4A843] py-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '98%', label: 'Parent satisfaction rate' },
              { num: '150+', label: 'Children taught' },
              { num: '5★', label: 'Average rating' },
              { num: '8+', label: 'Years of classes' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-oswald text-[#0A0A0A] text-4xl font-700">{s.num}</div>
                <div className="font-lato text-[#0A0A0A]/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div variants={container} initial="hidden" animate="show"
            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={item}
                className="break-inside-avoid bg-[#0D0D0D] border border-[#D4A843]/15 p-8 hover:border-[#D4A843]/40 transition-colors duration-300 mb-4">
                <div className="inline-flex items-center gap-2 border border-[#D4A843]/20 px-3 py-1.5 mb-5">
                  <span className="w-1 h-1 bg-[#D4A843]" />
                  <span className="font-oswald text-[#D4A843] text-xs tracking-widest uppercase">{t.highlight}</span>
                </div>
                <div className="font-oswald text-[#D4A843]/20 text-5xl mb-2 leading-none">"</div>
                <p className="font-lato text-white/60 text-base leading-relaxed italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-[#D4A843] text-sm">★</span>
                  ))}
                </div>
                <div className="border-t border-[#D4A843]/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-oswald text-white tracking-wide">{t.author}</p>
                    <p className="font-lato text-[#D4A843]/50 text-xs mt-0.5">{t.role}</p>
                  </div>
                  <span className="font-lato text-white/30 text-xs border border-[#D4A843]/15 px-2 py-0.5">{t.phase}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 text-center border-t border-[#D4A843]/15 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto px-6">
          <span className="text-5xl text-[#D4A843] block mb-6">♜</span>
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em' }}>
            Join our growing community of thinkers.
          </h2>
          <p className="font-lato text-white/50 text-lg mb-8">Your child could be our next success story. Book a free trial class today.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all">
            BOOK A FREE TRIAL <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}