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

          {/* RIGHT: Leaflet image + Social — shown on mobile above the buttons, hidden on desktop (rendered again below) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex lg:hidden flex-col items-center justify-center gap-6">
            <div className="relative max-w-xs w-full mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#D4A843]/10 blur-2xl scale-110" />
              <img
                src={LEAFLET_IMG}
                alt="RookFoundations — More than a game. Skills for life."
                className="relative z-10 w-full rounded-full border-2 border-[#D4A843]/40 shadow-2xl shadow-[#D4A843]/10" />
            </div>
          </motion.div>

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

          </motion.div>

          {/* RIGHT: Leaflet image + Social — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col items-center justify-center gap-6">
            
            <div className="relative max-w-md w-full mx-auto">
              {/* Gold ring glow */}
              <div className="absolute inset-0 rounded-full bg-[#D4A843]/10 blur-2xl scale-110" />
              <img
                src={LEAFLET_IMG}
                alt="RookFoundations — More than a game. Skills for life."
                className="relative z-10 w-full rounded-full border-2 border-[#D4A843]/40 shadow-2xl shadow-[#D4A843]/10" />
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <span className="font-lato text-white/30 text-xs tracking-widest uppercase mr-1">Follow us</span>
              {[
                {
                  href: 'https://www.instagram.com/rookfoundations/',
                  label: 'Instagram',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.tiktok.com/@rookfoundations',
                  label: 'TikTok',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.facebook.com/profile.php?id=61561285444390',
                  label: 'Facebook',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-[#D4A843]/25 flex items-center justify-center text-white/40 hover:text-[#D4A843] hover:border-[#D4A843]/60 transition-all duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}