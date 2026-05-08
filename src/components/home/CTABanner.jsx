import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="bg-coral relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Crect x='0' y='0' width='20' height='20'/%3E%3Crect x='20' y='20' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-playfair text-ivory/70 text-xl italic block mb-4">
            The best time to start was yesterday.
          </span>
          <h2 className="font-playfair text-ivory leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            The second best time is today.
          </h2>
          <p className="font-inter text-ivory/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Give your child the gift of strategic thinking. Book a free trial class — no commitment, 
            just 60 minutes that could change how they see the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group bg-midnight text-ivory font-inter font-600 text-base px-10 py-4 rounded-full hover:bg-slate transition-all duration-300 hover:shadow-2xl flex items-center gap-3"
            >
              Book Free Trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/classes"
              className="font-inter text-ivory/80 text-base hover:text-ivory transition-colors border-b border-ivory/40 hover:border-ivory pb-0.5"
            >
              View class schedule
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}