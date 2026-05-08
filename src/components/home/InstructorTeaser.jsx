import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Users } from 'lucide-react';

export default function InstructorTeaser() {
  return (
    <section className="bg-ivory py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-sm">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&q=80"
                alt="Chess instructor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
            </div>

            {/* Credentials card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl shadow-slate/10 border border-slate/8 w-52"
            >
              <div className="flex flex-col gap-4">
                {[
                  { icon: Award, label: 'FIDE Rated', sub: 'Tournament player' },
                  { icon: BookOpen, label: 'Education B.A.', sub: 'Child development' },
                  { icon: Users, label: '150+ Students', sub: 'Taught & mentored' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-coral" />
                    </div>
                    <div>
                      <p className="font-inter text-midnight text-xs font-600">{label}</p>
                      <p className="font-inter text-slate text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Decorative */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-coral/5 rounded-2xl -z-10" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">
              Your Instructor
            </span>
            <h2 className="font-playfair text-midnight leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
              Taught by a passionate educator,<br />
              <em>not just a chess player.</em>
            </h2>
            <p className="font-inter text-slate text-lg leading-relaxed mb-6">
              With over 8 years of experience teaching chess to children, I combine a background in 
              child development with a deep love of the game. My teaching philosophy centres on building 
              confidence first, technique second.
            </p>
            <p className="font-inter text-slate text-lg leading-relaxed mb-8">
              Every child learns differently. My small-group sessions ensure every student receives 
              personalised attention and progresses at their own pace — celebrating every small victory along the way.
            </p>

            <blockquote className="border-l-4 border-coral pl-6 mb-10">
              <p className="font-playfair text-midnight text-xl italic leading-relaxed">
                "Chess gave me the ability to think under pressure. I want to give every child that same gift."
              </p>
              <footer className="font-inter text-slate text-sm mt-3">
                — Alex Morgan, Founder of RookFoundations
              </footer>
            </blockquote>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-inter text-coral font-500 hover:gap-4 transition-all"
            >
              Read the full story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}