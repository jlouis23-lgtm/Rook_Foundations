import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "My daughter's teacher commented on how much her concentration had improved after just two months of classes. She's calmer, more thoughtful, and absolutely loves coming every week.",
    author: "Sarah M.",
    role: "Parent of Emma, age 9",
    phase: "Strategy Phase",
    rating: 5,
    highlight: "Concentration improved within 2 months",
  },
  {
    quote: "I was skeptical at first — chess seemed like it was for older or 'academic' kids. But the way it's taught at RookFoundations makes it genuinely joyful. My son asks to practise every single night.",
    author: "James T.",
    role: "Parent of Oliver, age 7",
    phase: "Discovery Phase",
    rating: 5,
    highlight: "Asks to practise every night",
  },
  {
    quote: "The structured approach and Alex's patience with the children is outstanding. My son went from a complete beginner to competing in his first regional tournament in just 6 months.",
    author: "Priya K.",
    role: "Parent of Aryan, age 12",
    phase: "Mastery Phase",
    rating: 5,
    highlight: "First tournament in 6 months",
  },
  {
    quote: "As a sceptical parent, I appreciate that the curriculum is evidence-based and there's clear progression. My daughter has shown marked improvement in her schoolwork — her teacher agrees.",
    author: "David L.",
    role: "Parent of Sophie, age 10",
    phase: "Strategy Phase",
    rating: 5,
    highlight: "Measurable school improvement",
  },
  {
    quote: "What I love most is that Alex focuses on the children's confidence, not just the chess. My shy son has come out of his shell completely. He's a different child.",
    author: "Michelle R.",
    role: "Parent of Thomas, age 8",
    phase: "Discovery Phase",
    rating: 5,
    highlight: "Transformed his confidence",
  },
  {
    quote: "The small group format is perfect. Every child gets individual attention and there's genuine warmth in every session. It's become the highlight of my twins' week.",
    author: "Anthony N.",
    role: "Parent of Lila & Ben, ages 11",
    phase: "Strategy Phase",
    rating: 5,
    highlight: "Highlight of their week",
  },
  {
    quote: "I never expected chess to help with maths but my daughter's arithmetic has genuinely improved. She thinks in steps now — working backward from the answer. It's remarkable.",
    author: "Fatima A.",
    role: "Parent of Zara, age 9",
    phase: "Strategy Phase",
    rating: 5,
    highlight: "Unexpected maths improvement",
  },
  {
    quote: "My son has ADHD and I was worried it wouldn't work. Alex was incredible — patient, adaptive, and my son's ability to focus in class has improved dramatically.",
    author: "Mark S.",
    role: "Parent of Leo, age 11",
    phase: "Strategy Phase",
    rating: 5,
    highlight: "ADHD — dramatic focus improvement",
  },
  {
    quote: "RookFoundations feels like a community, not just a class. The children celebrate each other's wins and support each other through losses. It's taught my daughter to be a good sport.",
    author: "Claire B.",
    role: "Parent of Isla, age 8",
    phase: "Discovery Phase",
    rating: 5,
    highlight: "Community and good sportsmanship",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Testimonials() {
  return (
    <div className="bg-ivory pt-32">
      {/* Header */}
      <section className="bg-midnight relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(250,249,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Parent Voices</span>
          <h1 className="font-playfair text-ivory mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            What families say about RookFoundations
          </h1>
          <p className="font-inter text-ivory/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Real stories from real parents. The testimonials below are from families whose children 
            have attended RookFoundations classes.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-coral py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '98%', label: 'Parent satisfaction rate' },
              { num: '150+', label: 'Children taught' },
              { num: '5★', label: 'Average rating' },
              { num: '8+', label: 'Years of classes' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-playfair text-ivory text-4xl font-700">{s.num}</div>
                <div className="font-inter text-ivory/70 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={item}
                className="break-inside-avoid bg-white rounded-2xl p-8 border border-slate/8 hover:shadow-xl hover:shadow-slate/5 transition-all duration-400 mb-6"
              >
                {/* Highlight tag */}
                <div className="inline-flex items-center gap-2 bg-coral/8 rounded-full px-3 py-1.5 mb-5">
                  <span className="w-1.5 h-1.5 bg-coral rounded-full" />
                  <span className="font-inter text-coral text-xs font-500">{t.highlight}</span>
                </div>

                <Quote size={28} className="text-coral/15 mb-3" />
                <p className="font-inter text-slate text-base leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-coral text-sm">★</span>
                  ))}
                </div>

                <div className="border-t border-slate/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-playfair text-midnight font-600">{t.author}</p>
                    <p className="font-inter text-slate text-xs mt-0.5">{t.role}</p>
                  </div>
                  <span className="font-inter text-slate/40 text-xs border border-slate/15 rounded-full px-2 py-0.5">
                    {t.phase}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <span className="text-5xl text-coral block mb-6">♜</span>
          <h2 className="font-playfair text-ivory mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 600 }}>
            Join our growing community of thinkers.
          </h2>
          <p className="font-inter text-ivory/60 text-lg mb-8">
            Your child could be our next success story. Book a free trial class today.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-coral text-ivory font-inter font-600 px-8 py-4 rounded-full hover:bg-coral-dark transition-all hover:shadow-lg hover:shadow-coral/20"
          >
            Book a Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}