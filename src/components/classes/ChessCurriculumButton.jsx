import { motion } from 'framer-motion';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

// Compact interactive entry point to the chess curriculum — a floating,
// glowing badge framed by thin divider lines rather than another content
// block, so it stays discoverable without taking up much vertical space.
export default function ChessCurriculumButton({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}>
      <span className="h-px flex-1 max-w-[7rem]" style={{ backgroundColor: '#2D252020' }} aria-hidden="true" />

      <MotionLink
        whileTap={ctaTap}
        to="/classes/chess-curriculum"
        aria-label="View Chess Curriculum"
        className="group flex flex-col items-center gap-3 outline-none shrink-0"
      >
        <div className="relative">
          {/* Soft ambient glow */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full blur-xl pointer-events-none"
            style={{ width: 84, height: 84, backgroundColor: '#E8A02033' }}
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
            className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white border border-[#2D2520]/10 shadow-md shadow-[#2D2520]/10 transition-all duration-300 group-hover:scale-110 group-hover:border-[#E8A020]/40 group-hover:shadow-lg group-hover:shadow-[#E8A020]/25 group-focus-visible:scale-110 group-focus-visible:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-[#E8A020] group-focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 100 100" className="w-8 h-8" aria-hidden="true">
              <rect x="18" y="80" width="50" height="7" rx="1" fill="#2D2520" />
              <path
                fill="#2D2520"
                d="M 26 80 C 23 66, 24 52, 32 43 L 29 34 L 37 36 L 35 26 L 44 30 L 43 18 L 53 24
                   C 60 25, 67 28, 73 33 L 85 30 L 84 40 L 76 42 L 79 48 L 70 47 L 73 53
                   C 66 54, 61 57, 57 62 C 53 67, 52 73, 54 80 Z"
              />
              <circle cx="56" cy="30" r="2.4" fill="#fff" />
            </svg>
          </motion.div>
        </div>

        <span className="font-nunito text-[#2D2520]/75 text-xs font-700">Chess Curriculum</span>
      </MotionLink>

      <span className="h-px flex-1 max-w-[7rem]" style={{ backgroundColor: '#2D252020' }} aria-hidden="true" />
    </div>
  );
}
