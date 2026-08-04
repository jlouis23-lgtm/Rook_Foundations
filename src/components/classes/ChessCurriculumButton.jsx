import { motion } from 'framer-motion';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

// Compact interactive entry point to the chess curriculum — a floating,
// glowing badge rather than another content block, so it stays discoverable
// without taking up much vertical space.
export default function ChessCurriculumButton({ className = '' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <MotionLink
        whileTap={ctaTap}
        to="/classes/chess-curriculum"
        aria-label="View Chess Curriculum"
        className="group flex flex-col items-center gap-3 outline-none"
      >
        <div className="relative">
          {/* Soft ambient glow */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full blur-xl pointer-events-none"
            style={{ width: 84, height: 84, backgroundColor: '#E8A02040' }}
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />

          {/* Tooltip — desktop only */}
          <span className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#2D2520] text-white font-nunito text-xs font-700 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            View Chess Curriculum
          </span>

          {/* Circular knight button */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-md shadow-[#E8A020]/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#E8A020]/40 group-focus-visible:scale-110 group-focus-visible:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-[#E8A020] group-focus-visible:ring-offset-2"
            style={{ background: 'linear-gradient(180deg, #F4C261 0%, #E8A020 55%, #c98a12 100%)' }}
          >
            <span className="text-white leading-none" style={{ fontSize: '1.9rem' }}>♞</span>
          </motion.div>
        </div>

        <span className="font-nunito text-[#2D2520]/45 text-xs">Chess Curriculum</span>
      </MotionLink>
    </div>
  );
}
