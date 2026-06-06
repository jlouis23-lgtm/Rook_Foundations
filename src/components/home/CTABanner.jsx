import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#E8A020] py-20">
      {/* Playful blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/8 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/6 blob-shape-2 pointer-events-none" />
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-8 left-12 text-white/20 text-5xl pointer-events-none hidden lg:block"
      >✦</motion.div>
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-8 right-20 text-white/15 text-3xl pointer-events-none hidden lg:block"
      >★</motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-5">♜</div>

          <h2 className="font-fredoka text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            More than a game.
          </h2>
          <h2 className="font-fredoka text-white/80 leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Skills for life.
          </h2>

          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-7">
            <Sparkles size={14} className="text-white" />
            <span className="font-nunito text-white font-700 text-sm">🎉 Limited Time — 50% Off Your First Lesson</span>
          </div>

          <p className="font-nunito text-white/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Give your child the gift of strategic thinking. One session could change the way they approach every challenge in life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="group bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3"
            >
              Claim Your 50% Off Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/classes"
              onClick={() => window.scrollTo(0, 0)}
              className="font-nunito text-white/70 text-sm font-600 hover:text-white transition-colors underline underline-offset-4"
            >
              View class schedule first
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}