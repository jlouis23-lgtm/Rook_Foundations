import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#E8A020] py-20">
      <ChessBg variant="cta" color="#ffffff" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white text-5xl mb-5">♜</div>

          <h2 className="font-fredoka text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Interested in Rook Foundations?
          </h2>

          <p className="font-nunito text-white/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            I'm currently inviting a small number of families to take part in £5 trial sessions as I prepare for launch. If you'd like to find out more, I'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MotionLink
              whileTap={ctaTap}
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="group bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3"
            >
              Register Your Interest
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </MotionLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}