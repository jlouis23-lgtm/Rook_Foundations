import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';

const LEAFLET_IMG = 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/3b7300d3f_51E37187-F312-43E1-8058-02E71B191F4B.png';

const pillars = [
  { icon: '🧠', label: 'Focus', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { icon: '♜', label: 'Strategy', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { icon: '⭐', label: 'Confidence', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { icon: '💡', label: 'Growth', color: 'bg-green-50 text-green-700 border-green-200' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#FAFAF7] overflow-hidden flex items-center">

      {/* Decorative blobs */}
      <div className="absolute top-16 right-0 w-[500px] h-[500px] bg-[#E8A020]/10 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#F4C261]/12 blob-shape-2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-purple-100/40 blob-shape pointer-events-none" />

      {/* Floating sparkles */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-1/4 text-[#E8A020]/40 text-4xl pointer-events-none hidden lg:block"
      >✦</motion.div>
      <motion.div
        animate={{ y: [8, -8, 8], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 right-12 text-purple-300/50 text-2xl pointer-events-none hidden lg:block"
      >✦</motion.div>
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-48 left-16 text-green-300/40 text-3xl pointer-events-none hidden lg:block"
      >★</motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Mobile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex lg:hidden flex-col items-center">
            <div className="relative max-w-xs w-full mx-auto">
              <div className="absolute inset-0 bg-[#E8A020]/20 blob-shape blur-2xl scale-110" />
              <img
                src={LEAFLET_IMG}
                alt="RookFoundations"
                className="relative z-10 w-full rounded-full border-4 border-white shadow-2xl shadow-[#E8A020]/20" />
            </div>
          </motion.div>

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2">
                <Sparkles size={14} className="text-[#E8A020]" />
                <span className="font-nunito text-[#b8790a] text-sm font-700">Chess for curious minds</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-2">
                <span className="text-purple-500 text-sm">♟</span>
                <span className="font-nunito text-purple-700 text-sm font-700">Strategy for curious minds</span>
              </div>
            </div>

            <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 600 }}>
              More than a game.
            </h1>
            <h2 className="font-fredoka text-[#E8A020] leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 600 }}>
              Skills for life.
            </h2>

            <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed mb-8 max-w-lg">
              In-person chess classes for children aged 5–15. We build focus, strategy, confidence, and lifelong thinking skills — one move at a time.
            </p>

            {/* Pillars */}
            <div className="flex flex-wrap gap-3 mb-10">
              {pillars.map((p) => (
                <div key={p.label} className={`flex items-center gap-2 ${p.color} border rounded-2xl px-4 py-2`}>
                  <span className="text-lg">{p.icon}</span>
                  <span className="font-nunito text-sm font-700">{p.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="group bg-[#E8A020] text-white font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#d4940e] transition-all duration-300 hover:shadow-xl hover:shadow-[#E8A020]/30 hover:-translate-y-0.5 flex items-center gap-3">
                Claim 50% Off Your First Lesson
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 bg-white border border-[#E8A020]/20 rounded-2xl px-5 py-3.5 shadow-sm">
                <span className="text-xl">👧🧒</span>
                <span className="font-nunito text-[#2D2520] text-sm font-700">Ages 5–15</span>
              </div>
            </div>

          </motion.div>

          {/* Right: Image — desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center justify-center gap-6">

            <div className="relative max-w-md w-full mx-auto">
              <div className="absolute inset-0 bg-[#E8A020]/18 blob-shape blur-3xl scale-110" />
              <motion.img
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                src={LEAFLET_IMG}
                alt="RookFoundations"
                className="relative z-10 w-full rounded-full border-4 border-white shadow-2xl shadow-[#E8A020]/20" />
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="font-nunito text-[#2D2520]/35 text-xs font-600 uppercase tracking-wide mr-1">Follow along</span>
              {[
                {
                  href: 'https://www.instagram.com/rookfoundations/',
                  label: 'Instagram',
                  svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
                },
                {
                  href: 'https://www.tiktok.com/@rookfoundations',
                  label: 'TikTok',
                  svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>,
                },
                {
                  href: 'https://www.facebook.com/profile.php?id=61561285444390',
                  label: 'Facebook',
                  svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                },
              ].map(({ href, label, svg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 bg-white border border-[#E8A020]/20 rounded-xl flex items-center justify-center text-[#2D2520]/40 hover:text-[#E8A020] hover:border-[#E8A020]/50 hover:shadow-md transition-all duration-200">
                  {svg}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}