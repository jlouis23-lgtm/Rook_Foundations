import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  {
    quote: "My daughter's teacher commented on how much her concentration had improved after just two months. She's calmer, more thoughtful, and absolutely loves coming to class.",
    author: "Sarah M.", role: "Parent of Emma, age 9", rating: 5,
  },
  {
    quote: "I was skeptical at first. But the way it's taught here makes it genuinely fun. My son asks to practise every single night.",
    author: "James T.", role: "Parent of Oliver, age 7", rating: 5,
  },
  {
    quote: "The structured approach and patience with the children is outstanding. My son went from beginner to competing in his first tournament in just 6 months.",
    author: "Priya K.", role: "Parent of Aryan, age 12", rating: 5,
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="bg-[#111111] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">Parent Voices</span>
          <h2 className="font-oswald text-white uppercase leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
            What families say about us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-[#0D0D0D] border border-[#D4A843]/15 p-8 hover:border-[#D4A843]/40 transition-colors duration-300"
            >
              <div className="text-[#D4A843] text-4xl font-oswald mb-4">"</div>
              <p className="font-lato text-white/70 text-base leading-relaxed mb-6 italic">{t.quote}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-[#D4A843] text-sm">★</span>
                ))}
              </div>
              <div className="border-t border-[#D4A843]/10 pt-4">
                <p className="font-oswald text-white tracking-wide">{t.author}</p>
                <p className="font-lato text-[#D4A843]/60 text-sm mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/testimonials" className="inline-flex items-center gap-2 font-oswald text-[#D4A843] text-sm tracking-widest uppercase hover:gap-4 transition-all">
            Read more parent stories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}