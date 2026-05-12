import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843] to-transparent" />

      {/* Gold ambient glow */}
      <div className="absolute inset-0 bg-[#D4A843]/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl text-[#D4A843] mb-6">♜</div>
          <div className="gold-line mx-auto mb-6" />

          <h2 className="font-oswald text-white uppercase leading-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            More than a game.
          </h2>
          <h2 className="font-oswald text-[#D4A843] uppercase leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Skills for life.
          </h2>

          <div className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/40 px-6 py-2 mb-6">
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase">🎉 Limited Offer — 50% Off Your First Lesson</span>
          </div>

          <p className="font-lato text-white/60 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Give your child the gift of strategic thinking. Book now and get 50% off your first lesson — no commitment, just a session that could change how they see the world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 text-base tracking-wider px-10 py-4 hover:bg-[#e8c06a] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4A843]/20 flex items-center gap-3"
            >
              CLAIM 50% OFF FIRST LESSON
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/classes"
              className="font-oswald text-white/60 text-sm tracking-widest uppercase hover:text-[#D4A843] transition-colors border-b border-white/20 hover:border-[#D4A843] pb-0.5"
            >
              View class schedule
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843] to-transparent" />
    </section>
  );
}