import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users, Heart } from 'lucide-react';

const credentials = [
  { icon: Award, title: 'FIDE Rated Player', desc: 'Active tournament competitor with a deep understanding of the game at every level.' },
  { icon: BookOpen, title: 'B.A. in Education', desc: 'Formal training in child development, learning theory, and pedagogical practice.' },
  { icon: Users, title: '8+ Years Teaching', desc: 'Hundreds of children guided from complete beginners to confident, competitive players.' },
  { icon: Heart, title: 'Child-First Approach', desc: 'Every session is designed to build confidence and joy before technique.' },
];

const timeline = [
  { year: '2016', event: 'Began tutoring local children after competing in regional tournaments.' },
  { year: '2018', event: 'Completed formal education degree, specialising in child cognitive development.' },
  { year: '2020', event: 'Launched RookFoundations as a structured after-school programme.' },
  { year: '2022', event: 'First cohort of students entered regional youth chess championships.' },
  { year: '2024', event: 'Expanded to three age-group phases with a full curriculum framework.' },
  { year: '2026', event: 'Over 150 young thinkers taught, with a waiting list each term.' },
];

export default function About() {
  return (
    <div className="bg-ivory pt-32">
      {/* Page header */}
      <section className="bg-midnight relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(250,249,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">About</span>
          <h1 className="font-playfair text-ivory mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            More than a chess teacher.
          </h1>
          <p className="font-inter text-ivory/60 text-lg leading-relaxed">
            A belief that the board is one of the most powerful learning tools a child can encounter.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
                  alt="Alex Morgan — RookFoundations instructor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
              </div>
              {/* Name plate */}
              <div className="absolute bottom-6 left-6 right-6 bg-ivory/95 backdrop-blur-sm rounded-xl p-5 shadow-xl">
                <p className="font-playfair text-midnight text-xl font-600">Alex Morgan</p>
                <p className="font-inter text-slate text-sm mt-1">Founder & Head Instructor · RookFoundations</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">My Story</span>
              <h2 className="font-playfair text-midnight mb-8" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600 }}>
                From player to passionate educator
              </h2>

              <div className="space-y-5 font-inter text-slate text-lg leading-relaxed">
                <p>
                  I learned chess at age eight from my grandfather. What started as a rainy Sunday game became 
                  an obsession that would shape how I think, make decisions, and handle setbacks for the rest of my life.
                </p>
                <p>
                  After competing in regional tournaments through my teens and completing a degree in Education, 
                  I realised that the lessons chess had taught me weren't just about the game. They were about life.
                </p>
                <p>
                  RookFoundations was born from a simple conviction: every child deserves access to that kind 
                  of structured, confidence-building thinking practice — taught by someone who truly loves both 
                  the game and the people learning it.
                </p>
              </div>

              <blockquote className="mt-10 border-l-4 border-coral pl-6">
                <p className="font-playfair text-midnight text-xl italic leading-relaxed">
                  "I don't just teach chess. I teach children how to think — and how to believe in their own thinking."
                </p>
                <footer className="font-inter text-slate text-sm mt-3">— Alex Morgan</footer>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-slate py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Teaching Philosophy</span>
          <h2 className="font-playfair text-ivory mb-8" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
            The three pillars of RookFoundations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { symbol: '♟', title: 'Confidence First', desc: 'No child should fear making a wrong move. We create a safe, encouraging space where mistakes are celebrated as learning.' },
              { symbol: '♞', title: 'Process Over Outcome', desc: 'We focus on the quality of thinking, not the result of the game. A well-thought-out loss teaches more than a lucky win.' },
              { symbol: '♛', title: 'Every Child Progresses', desc: 'Our curriculum adapts to the individual. Some students become tournament players; all become better thinkers.' },
            ].map((p) => (
              <div key={p.title} className="bg-midnight/40 rounded-2xl p-8 border border-white/10">
                <span className="text-4xl text-coral block mb-4">{p.symbol}</span>
                <h3 className="font-playfair text-ivory text-xl font-600 mb-3">{p.title}</h3>
                <p className="font-inter text-ivory/60 text-base leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-ivory py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Qualifications</span>
            <h2 className="font-playfair text-midnight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
              Credentials you can trust
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-slate/8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={20} className="text-coral" />
                </div>
                <h3 className="font-playfair text-midnight text-lg font-600 mb-2">{title}</h3>
                <p className="font-inter text-slate text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ivory-dark py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Journey</span>
            <h2 className="font-playfair text-midnight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
              Building RookFoundations
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-24 top-0 bottom-0 w-px bg-slate/15" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8"
                >
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-mono text-coral font-700">{t.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div className="w-3 h-3 bg-coral rounded-full border-2 border-ivory" />
                  </div>
                  <p className="font-inter text-slate text-base leading-relaxed pt-0">{t.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-coral py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-playfair text-ivory mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 600 }}>
            Ready to meet in person?
          </h2>
          <p className="font-inter text-ivory/80 text-lg mb-8">
            Book a free trial class and see the RookFoundations difference for yourself.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-midnight text-ivory font-inter font-600 px-8 py-4 rounded-full hover:bg-slate transition-all"
          >
            Book a Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}