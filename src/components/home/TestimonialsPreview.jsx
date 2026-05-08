import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "My daughter's teacher commented on how much her concentration had improved after just two months. She's calmer, more thoughtful, and absolutely loves coming to class.",
    author: "Sarah M.",
    role: "Parent of Emma, age 9",
    rating: 5,
  },
  {
    quote: "I was skeptical at first — chess seemed like it was for older kids. But the way it's taught here makes it genuinely fun. My son asks to practise every night.",
    author: "James T.",
    role: "Parent of Oliver, age 7",
    rating: 5,
  },
  {
    quote: "The structured approach and Alex's patience with the children is outstanding. My son went from beginner to competing in his first tournament in just 6 months.",
    author: "Priya K.",
    role: "Parent of Aryan, age 12",
    rating: 5,
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="bg-slate/5 py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">
            Parent Voices
          </span>
          <h2 className="font-playfair text-midnight leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600 }}>
            What families say about us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white rounded-2xl p-8 border border-slate/8 hover:shadow-xl hover:shadow-slate/5 transition-all duration-400"
            >
              <Quote size={32} className="text-coral/20 mb-4" />
              <p className="font-inter text-slate text-base leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-coral text-sm">★</span>
                ))}
              </div>
              <div className="border-t border-slate/10 pt-4">
                <p className="font-playfair text-midnight font-600">{t.author}</p>
                <p className="font-inter text-slate text-sm mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 font-inter text-coral font-500 text-sm hover:gap-4 transition-all"
          >
            Read more parent stories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}