import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Rook outline traced from the reference Staunton piece (IMG_2868) — same
// silhouette used site-wide, reused here as the frame that houses the
// Notion icon rather than as an interactive three-pillar diagram.
const GOLD = '#C99A34';
const ROOK_OUTER =
  'M 90.52 109.86 L 8.61 109.86 L 8.44 109.69 L 8.44 101.09 L 8.66 98.26 L 9.31 95.1 L 10.19 92.92 L 11.49 90.74 L 13.83 88.4 L 16.23 86.98 L 19.88 85.62 L 25.0 42.81 L 24.4 42.21 L 22.88 41.56 L 21.13 40.36 L 18.9 38.24 L 17.7 36.49 L 16.5 33.77 L 15.85 30.83 L 15.52 25.16 L 14.65 16.45 L 14.43 12.96 L 14.81 12.47 L 17.86 10.84 L 22.33 9.31 L 26.14 8.66 L 30.94 8.66 L 31.86 11.98 L 33.71 20.7 L 34.2 21.19 L 37.36 21.19 L 37.8 21.08 L 37.96 20.81 L 39.38 7.63 L 39.87 7.03 L 41.07 6.81 L 46.41 6.15 L 50.44 6.05 L 54.79 6.37 L 59.48 7.14 L 59.75 7.84 L 61.06 20.15 L 61.17 20.81 L 61.55 21.19 L 64.92 21.19 L 65.31 21.02 L 68.19 8.66 L 72.98 8.66 L 76.8 9.31 L 81.26 10.84 L 84.48 12.53 L 84.69 12.85 L 84.69 13.62 L 83.61 24.84 L 83.28 30.72 L 82.3 34.53 L 81.1 36.93 L 79.79 38.67 L 77.45 40.69 L 74.29 42.43 L 74.13 43.25 L 79.14 85.4 L 79.74 85.89 L 83.44 87.31 L 85.73 88.83 L 87.96 91.29 L 89.27 93.68 L 90.14 96.62 L 90.47 98.91 L 90.69 104.36 L 90.69 109.69 L 90.52 109.86 Z';
const ROOK_HIGHLIGHTS = [
  'M 72.11 39.92 L 61.98 38.73 L 52.94 38.07 L 43.68 38.18 L 36.82 38.73 L 28.32 39.92 L 26.80 39.92 L 25.49 39.38 L 23.09 37.85 L 21.51 36.38 L 20.32 34.64 L 19.44 32.57 L 18.79 28.76 L 18.79 27.02 L 17.81 16.88 L 17.81 14.38 L 20.37 13.13 L 22.44 12.47 L 25.82 11.82 L 28.32 11.71 L 28.70 12.09 L 31.21 23.86 L 31.59 24.24 L 40.52 24.24 L 40.80 23.75 L 41.01 22.22 L 41.99 12.20 L 42.21 11.66 L 42.21 10.46 L 42.48 9.86 L 45.97 9.31 L 49.24 9.10 L 55.99 9.64 L 56.64 9.86 L 56.92 10.57 L 58.44 24.07 L 58.61 24.24 L 67.65 24.24 L 67.92 23.86 L 68.46 21.57 L 68.57 20.37 L 70.59 11.82 L 73.31 11.82 L 76.25 12.36 L 80.07 13.78 L 81.32 14.49 L 81.32 15.90 L 80.34 26.14 L 80.34 28.10 L 79.68 32.35 L 78.81 34.53 L 77.51 36.38 L 74.84 38.62 L 72.11 39.92 Z',
  'M 23.64 85.02 L 23.15 84.86 L 23.15 84.31 L 24.02 78.32 L 24.13 76.03 L 26.63 55.01 L 26.85 54.47 L 27.83 44.77 L 28.21 43.08 L 37.04 41.88 L 40.96 41.78 L 45.32 41.34 L 50.54 41.23 L 54.47 41.34 L 55.34 41.56 L 64.92 42.21 L 66.23 42.54 L 70.48 42.97 L 70.97 43.25 L 73.80 68.08 L 74.02 68.63 L 75.44 81.59 L 75.65 82.14 L 75.87 84.20 L 75.71 84.91 L 69.93 84.15 L 60.02 83.61 L 42.27 83.50 L 30.28 84.15 L 24.18 84.80 L 23.64 85.02 Z',
];

// Three consecutive sessions compressed to one line of movement each — the
// point being made is the cycle itself (observe, set targets, adapt, repeat)
// rather than the detail of any single lesson. No per-stage icons: the node
// numbers, connecting line and return loop carry the progression instead.
const sessions = [
  {
    label: 'Session 1',
    accent: '#2d8c62',
    body: 'Gameplay reveals strengths and shapes initial learning targets.',
  },
  {
    label: 'Session 2',
    accent: '#4a7eb8',
    body: 'Games are chosen to build those targets, then progress is reviewed.',
  },
  {
    label: 'Session 3',
    accent: '#7a48c0',
    body: 'Targets adapt, strengths are reinforced, and new challenges begin.',
  },
];

function SessionNode({ session, index, vertical = false }) {
  const badge = (
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center font-fredoka text-white text-sm shadow-md flex-shrink-0 relative z-10"
      style={{ backgroundColor: session.accent, boxShadow: `0 6px 14px ${session.accent}35` }}
    >
      {index + 1}
    </span>
  );

  if (vertical) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
        className="flex items-start gap-3"
      >
        {badge}
        <div className="pt-1.5">
          <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest" style={{ color: session.accent }}>
            {session.label}
          </p>
          <p className="font-nunito text-[#2D2520]/60 text-xs leading-snug mt-1">{session.body}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
      className="relative z-10 flex flex-col items-center text-center flex-1 px-1"
    >
      {badge}
      <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest mt-2.5" style={{ color: session.accent }}>
        {session.label}
      </p>
      <p className="font-nunito text-[#2D2520]/60 text-xs leading-snug mt-1 max-w-[10.5rem]">{session.body}</p>
    </motion.div>
  );
}

// Single compact diagram replacing the old three-card layout: a short flow
// of numbered nodes (horizontal on tablet/desktop, a left-aligned timeline
// on mobile). No connecting lines or arrows — just the node numbers, colour
// and spacing carry the progression, with the rotating icon below standing
// in for the "repeats" cue.
function SessionCycle() {
  return (
    <div className="max-w-3xl mx-auto mb-14">
      {/* Tablet & desktop — horizontal flow */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        {sessions.map((session, i) => (
          <SessionNode key={session.label} session={session} index={i} />
        ))}
      </div>

      {/* Mobile — left-aligned vertical timeline */}
      <div className="sm:hidden flex flex-col gap-5">
        {sessions.map((session, i) => (
          <SessionNode key={session.label} session={session} index={i} vertical />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        <motion.span
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="text-[#E8A020] flex-shrink-0"
        >
          <RotateCcw size={13} />
        </motion.span>
        <span className="font-fredoka text-[#b8790a] text-xs sm:text-sm italic">Every session builds on the last</span>
      </div>
    </div>
  );
}

export default function ProgressTrackingSection() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
      {/* Subheading — deliberately lighter than the page's "What Makes Us
          Different?" heading above, since this section is the answer to
          that question rather than a new topic of its own. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-10"
      >
        <h3 className="font-fredoka text-[#2D2520] text-xl sm:text-2xl">
          Tracking Progress Over Time
        </h3>
      </motion.div>

      {/* Session 1 → 2 → 3, looping back — a single compact diagram in
          place of three large cards */}
      <SessionCycle />

      {/* Notion, housed inside the redesigned rook — the piece that carries
          the page's visual identity becomes the container for the system
          that keeps every child's learning organised. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        className="flex flex-col items-center mb-16"
      >
        <div className="relative w-full max-w-[220px] sm:max-w-[260px] mx-auto">
          <svg viewBox="0 0 100 114.6" className="w-full h-auto block" aria-hidden="true" focusable="false">
            <path d={ROOK_OUTER} fill="#fff" />
            <path d={ROOK_HIGHLIGHTS[0]} fill={GOLD} opacity="0.08" />
            <path d={ROOK_HIGHLIGHTS[1]} fill={GOLD} opacity="0.08" />
            <path d={ROOK_OUTER} fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinejoin="round" />
          </svg>

          {/* Notion icon — centred within the rook's body, well clear of
              the outline on every side at every breakpoint since it's
              positioned as a percentage of the same viewBox the rook is
              traced in. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="How we use Notion to personalise lessons"
            className="group absolute flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 rounded-2xl"
            style={{ left: '33%', top: '41%', width: '34%', height: '30%' }}
          >
            <picture className="w-full h-full transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-focus-visible:scale-105">
              <source srcSet="/images/icons/notion-logo.webp" type="image/webp" />
              <img
                src="/images/icons/notion-logo.png"
                alt="Notion"
                width={240}
                height={240}
                className="w-full h-full object-contain"
              />
            </picture>
          </button>
        </div>

        <span className="font-nunito text-[#2D2520]/45 text-xs mt-4">
          {open ? 'Hide details' : 'Tap to see how we organise it all'}
        </span>

        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden w-full max-w-lg"
            >
              <div className="bg-white border border-[#2D2520]/8 rounded-3xl px-6 py-6 shadow-sm text-center">
                <h3 className="font-fredoka text-[#2D2520] text-lg mb-2">What is Notion?</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                  Notion is the system I use behind the scenes to keep every lesson connected. It's where I record lesson observations, document each child's strengths, note any areas that need extra support, track progress over time, keep learning targets up to date, and plan the next lesson around how the last one went.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
