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
            <svg viewBox="0 0 100 133.47" className="w-7 h-9" aria-hidden="true">
              <path
                fill="#2D2520"
                fillRule="evenodd"
                d="M 89.16 130.81 L 9.75 130.66 L 9.96 124.71 L 11.21 122.11 L 12.25 120.75 L 13.56 119.76 L 15.22 118.93 L 17.10 118.40 L 18.56 117.57 L 19.76 116.16 L 20.28 114.60 L 20.49 111.57 L 19.71 111.21 L 17.73 111.21 L 15.64 110.38 L 14.75 109.49 L 14.23 108.45 L 14.13 106.15 L 14.96 104.48 L 16.48 103.39 L 17.31 103.18 L 20.33 103.18 L 21.01 102.92 L 19.03 94.37 L 17.47 86.13 L 16.32 76.23 L 16.32 67.15 L 16.84 60.58 L 18.40 52.97 L 20.49 46.92 L 23.62 40.88 L 25.70 37.85 L 28.00 35.14 L 32.22 31.23 L 35.25 29.14 L 41.08 26.12 L 45.46 24.45 L 45.83 24.09 L 46.77 21.69 L 48.44 18.56 L 51.46 14.18 L 57.98 7.46 L 63.09 3.39 L 63.35 3.44 L 63.45 8.34 L 63.45 21.27 L 69.24 24.35 L 72.26 26.75 L 74.30 29.09 L 77.53 34.10 L 95.67 51.82 L 96.19 52.55 L 96.51 53.81 L 96.51 58.29 L 95.99 62.67 L 94.89 63.97 L 93.64 64.91 L 87.70 68.77 L 85.61 69.60 L 84.25 69.50 L 82.90 68.87 L 79.56 66.16 L 78.00 65.22 L 75.50 64.29 L 72.68 63.66 L 67.99 63.14 L 65.28 63.97 L 61.31 64.60 L 58.19 64.60 L 54.33 63.97 L 51.20 62.83 L 48.59 61.26 L 43.74 56.41 L 41.35 52.24 L 39.10 46.04 L 38.32 47.24 L 37.38 50.57 L 37.59 54.85 L 38.53 57.77 L 39.78 60.27 L 41.87 62.98 L 43.80 64.91 L 46.51 67.00 L 50.78 69.08 L 55.06 70.23 L 59.23 70.75 L 61.89 73.93 L 72.42 84.57 L 75.76 88.84 L 77.53 91.66 L 79.61 96.35 L 80.55 100.21 L 80.76 103.02 L 82.90 103.49 L 84.15 104.33 L 84.83 105.32 L 85.25 106.99 L 85.04 108.34 L 84.41 109.49 L 83.63 110.27 L 82.48 110.90 L 79.87 111.21 L 79.30 111.57 L 78.78 113.56 L 78.99 115.12 L 79.72 116.68 L 80.71 117.67 L 81.96 118.40 L 83.73 118.82 L 85.30 119.55 L 86.65 120.59 L 87.75 121.90 L 88.69 123.67 L 89.31 125.96 L 89.42 130.55 L 89.16 130.81 Z
                   M 13.03 97.34 L 6.26 96.51 L 5.47 96.14 L 4.22 90.20 L 2.97 80.81 L 2.66 76.02 L 2.66 69.55 L 2.97 60.58 L 4.54 51.82 L 6.93 44.00 L 10.27 36.70 L 13.50 31.49 L 17.78 26.17 L 22.42 21.74 L 28.36 17.36 L 34.52 14.03 L 37.75 12.67 L 41.92 11.31 L 46.51 10.48 L 46.66 10.64 L 44.06 14.39 L 41.08 19.55 L 37.96 20.91 L 32.33 23.93 L 28.36 26.75 L 23.72 31.07 L 21.01 34.31 L 18.40 38.06 L 16.32 41.81 L 14.55 45.78 L 12.88 50.68 L 11.73 55.27 L 10.90 60.27 L 10.27 68.30 L 10.27 72.99 L 10.79 80.92 L 11.73 88.01 L 13.40 96.56 L 13.40 97.18 L 13.03 97.34 Z"
              />
            </svg>
          </motion.div>
        </div>

        <span className="font-nunito text-[#2D2520]/75 text-xs font-700">Chess Curriculum</span>
      </MotionLink>

      <span className="h-px flex-1 max-w-[7rem]" style={{ backgroundColor: '#2D252020' }} aria-hidden="true" />
    </div>
  );
}
