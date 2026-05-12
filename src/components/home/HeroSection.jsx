import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LEAFLET_IMG = 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/3b7300d3f_51E37187-F312-43E1-8058-02E71B191F4B.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex items-center">
      {/* Subtle grid */}
      {[16.6, 33.3, 50, 66.6, 83.3].map((pos, i) =>
      <div key={i} className="ghost-grid-line" style={{ left: `${pos}%` }} />
      )}

      {/* Gold gradient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4A843]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A843]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            {/* Rook icon badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 border-2 border-[#D4A843] rounded-full flex items-center justify-center">
                <span className="text-[#D4A843] text-2xl leading-none">♜</span>
              </div>
              <div>
                <span className="font-oswald text-white text-xl tracking-wider leading-none block">ROOK</span>
                <span className="font-oswald text-[#D4A843] text-xl tracking-wider leading-none block">FOUNDATIONS.</span>
              </div>
            </div>

            {/* Gold line */}
            <div className="gold-line mb-8" />

            <h1 className="font-oswald text-white leading-[1.0] mb-4 uppercase"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '0.02em' }}>
              More than<br />
              a game.
            </h1>
            <h2 className="font-oswald text-[#D4A843] leading-[1.0] mb-8 uppercase"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '0.02em' }}>
              Skills for life.
            </h2>

            <p className="font-lato text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              In-person chess classes for children aged 5–15. Building focus, strategy, confidence and lifelong thinking skills.
            </p>

            {/* 4 pillars */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {[
              { icon: '🧠', label: 'FOCUS' },
              { icon: '♜', label: 'STRATEGY' },
              { icon: '⭐', label: 'CONFIDENCE' },
              { icon: '💡', label: 'GROWTH' }].
              map((p) =>
              <div key={p.label} className="flex flex-col items-center gap-2 border border-[#D4A843]/20 p-3 hover:border-[#D4A843]/60 transition-colors">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-oswald text-[#D4A843] text-xs tracking-widest">{p.label}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/contact"
                className="group bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 text-base tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all duration-300 hover:shadow-xl hover:shadow-[#D4A843]/20 flex items-center gap-3">
                
                50% OFF FIRST LESSON
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 border border-[#D4A843]/30 px-5 py-4">
                <span className="text-[#D4A843] text-lg">👥</span>
                <span className="font-oswald text-white text-sm tracking-widest">5–15 YEARS OLD</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-14 pt-10 border-t border-[#D4A843]/15">
              {[
              { num: '150+', label: 'Young Thinkers' },
              { num: '8+', label: 'Years in Childcare' },
              { num: '98%', label: 'Parent Satisfaction' }].
              map((s) =>
              <div key={s.label}>
                  <div className="font-oswald text-[#D4A843] text-3xl font-700">{s.num}</div>
                  <div className="font-lato text-white/40 text-xs tracking-wide mt-0.5">{s.label}</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Leaflet image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center">
            
            <div className="relative max-w-md w-full mx-auto">
              {/* Gold ring glow */}
              <div className="absolute inset-0 rounded-full bg-[#D4A843]/10 blur-2xl scale-110" />
              <img
                src={LEAFLET_IMG}
                alt="RookFoundations — More than a game. Skills for life."
                className="relative z-10 w-full rounded-full border-2 border-[#D4A843]/40 shadow-2xl shadow-[#D4A843]/10" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}