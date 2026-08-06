import { Fragment, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowRight, ArrowDown, Castle, Eye, Target } from 'lucide-react';

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

// Three consecutive sessions, each ending in a learning-targets moment that
// feeds directly into the next session's gameplay — the loop back to
// Session 1 (below) is what makes this a cycle rather than a one-off list.
const sessions = [
  {
    label: 'Session 1',
    title: 'Discover',
    accent: '#2d8c62',
    stages: [
      { Icon: Castle, title: 'Gameplay', body: 'Children explore carefully selected strategy games that provide meaningful opportunities for observation.' },
      { Icon: Eye, title: 'Observation', body: 'The instructor observes how the child approaches challenges, communicates, plans and solves problems.' },
      { Icon: Target, title: 'Initial Learning Targets', body: 'Personalised learning targets are created from the observations made during the session.', highlight: true },
    ],
  },
  {
    label: 'Session 2',
    title: 'Develop',
    accent: '#4a7eb8',
    stages: [
      { Icon: Castle, title: 'Targeted Gameplay', body: 'Games are selected specifically to develop the learning targets identified during Session 1.' },
      { Icon: Eye, title: 'Observation & Review', body: 'Progress towards existing learning targets is reviewed throughout gameplay.' },
      { Icon: Target, title: 'Refined Learning Targets', body: "Learning targets are updated, refined or expanded based on the child's progress.", highlight: true },
    ],
  },
  {
    label: 'Session 3',
    title: 'Build',
    accent: '#7a48c0',
    stages: [
      { Icon: Castle, title: 'Purposeful Gameplay', body: 'Activities continue to strengthen and extend personalised learning targets.' },
      { Icon: Eye, title: 'Ongoing Review', body: 'Repeated observations help identify long-term strengths, emerging challenges and meaningful progress.' },
      { Icon: Target, title: 'Plan the Next Stage', body: 'Future lessons are planned using all previous observations and learning targets.', highlight: true },
    ],
  },
];

function SessionCard({ session, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
      className="w-full lg:flex-1 bg-white border border-[#2D2520]/8 rounded-3xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center font-fredoka text-xs text-white flex-shrink-0"
          style={{ backgroundColor: session.accent }}
        >
          {index + 1}
        </span>
        <div>
          <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest" style={{ color: session.accent }}>
            {session.label}
          </p>
          <h3 className="font-fredoka text-[#2D2520] text-lg leading-none mt-0.5">{session.title}</h3>
        </div>
      </div>

      <div>
        {session.stages.map((stage, i) => (
          <div key={stage.title}>
            <div
              className={`flex items-start gap-2.5 ${stage.highlight ? 'rounded-2xl p-2.5 -mx-2.5' : ''}`}
              style={stage.highlight ? { backgroundColor: `${session.accent}0F` } : undefined}
            >
              <stage.Icon size={15} style={{ color: session.accent }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-fredoka text-[#2D2520] text-sm leading-tight">{stage.title}</p>
                <p className="font-nunito text-[#2D2520]/55 text-xs leading-relaxed mt-1">{stage.body}</p>
              </div>
            </div>
            {i < session.stages.length - 1 && (
              <div className="flex justify-center py-1.5" aria-hidden="true">
                <ArrowDown size={13} className="text-[#E8A020]/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProgressTrackingSection() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
      {/* Subheading — deliberately lighter than the page's "What Makes Us
          Different?" heading above, since this section is the answer to
          that question rather than a new topic of its own. The small dot
          is the landing point for the connector traced down from the
          Ongoing Progress Tracking item in SessionIncludesGrid above —
          same purple as that card's accent (and Session 3 "Build" below). */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-10"
      >
        <span className="block w-1.5 h-1.5 rounded-full bg-[#7a48c0]/40 mx-auto mb-3" aria-hidden="true" />
        <h3 className="font-fredoka text-[#2D2520] text-xl sm:text-2xl">
          Tracking Progress Over Time
        </h3>
      </motion.div>

      {/* Three-session cycle */}
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 sm:gap-5 lg:gap-4">
        {sessions.map((session, i) => (
          <Fragment key={session.label}>
            <SessionCard session={session} index={i} />
            {i < sessions.length - 1 && (
              <div className="flex items-center justify-center" aria-hidden="true">
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: EASE }}
                  className="hidden lg:block text-[#E8A020]/50"
                >
                  <ArrowRight size={20} />
                </motion.span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: EASE }}
                  className="lg:hidden text-[#E8A020]/50"
                >
                  <ArrowDown size={20} />
                </motion.span>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* Loop back to Session 1 — the journey is a cycle, not a line */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        className="flex flex-col items-center mt-8 mb-14"
      >
        <svg width="96" height="28" viewBox="0 0 96 28" className="mb-1" aria-hidden="true">
          <motion.path
            d="M 82 4 C 82 20, 14 20, 14 4"
            fill="none"
            stroke="#E8A020"
            strokeOpacity="0.55"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3.5 4"
            animate={{ strokeDashoffset: [0, -15] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
          <path d="M 14 4 L 9.5 8.5 M 14 4 L 19 7.5" stroke="#E8A020" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            className="text-[#E8A020] flex-shrink-0"
          >
            <RotateCcw size={15} />
          </motion.span>
          <span className="font-fredoka text-[#b8790a] text-sm italic">The learning journey continues</span>
        </div>
      </motion.div>

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
