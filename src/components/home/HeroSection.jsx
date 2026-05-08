import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-midnight overflow-hidden flex items-center">
      {/* Ghost grid lines */}
      {[16.6, 33.3, 50, 66.6, 83.3].map((pos, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{ left: `${pos}%`, background: 'rgba(250,249,246,0.04)' }}
        />
      ))}

      {/* Background chess pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(250,249,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,249,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Large chess piece watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/[0.03] font-playfair select-none pointer-events-none"
        style={{ fontSize: '40rem', lineHeight: 1, transform: 'translateY(-50%) translateX(15%)' }}>
        ♜
      </div>

      {/* Coral accent blob */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-coral/10 border border-coral/20 rounded-full px-4 py-2 mb-8">
              <Star size={12} className="text-coral fill-coral" />
              <span className="font-inter text-coral text-xs tracking-widest uppercase font-500">
                In-Person Chess Classes · Ages 5–15
              </span>
            </div>

            <h1 className="font-playfair text-ivory leading-[1.05] mb-8"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700 }}>
              Master the Board.{' '}
              <span className="text-coral">Master the</span>{' '}
              Future.
            </h1>

            <p className="font-inter text-ivory/60 text-lg leading-relaxed mb-10 max-w-lg">
              RookFoundations teaches children the ancient art of chess — building concentration, strategic thinking, 
              and resilience that extends far beyond the 64 squares.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/contact"
                className="group bg-coral text-ivory font-inter font-600 text-base px-8 py-4 rounded-full hover:bg-coral-dark transition-all duration-300 hover:shadow-2xl hover:shadow-coral/30 flex items-center gap-3"
              >
                Book a Free Trial Class
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/classes"
                className="font-inter text-ivory/60 text-base hover:text-ivory transition-colors flex items-center gap-2 border-b border-ivory/20 hover:border-ivory/60 pb-0.5"
              >
                View our classes
              </Link>
            </div>

            {/* Social proof bar */}
            <div className="flex items-center gap-8 mt-14 pt-10 border-t border-white/10">
              {[
                { num: '150+', label: 'Young Thinkers' },
                { num: '8+', label: 'Years Teaching' },
                { num: '98%', label: 'Parent Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-playfair text-ivory text-2xl font-700">{stat.num}</div>
                  <div className="font-inter text-ivory/40 text-xs tracking-wide mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: image card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-md ml-auto">
              <img
                src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80"
                alt="Child focused on chess"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 bg-ivory/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-coral text-xl">♟</span>
                  </div>
                  <div>
                    <p className="font-playfair text-midnight text-sm font-600">Next intake open</p>
                    <p className="font-inter text-slate text-xs mt-0.5">Limited spots available for all age groups</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border border-coral/20 rounded-2xl rotate-12 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 border border-ivory/10 rounded-xl rotate-6 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-gradient-to-b from-transparent to-ivory/30"
        />
        <span className="font-inter text-ivory/30 text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}