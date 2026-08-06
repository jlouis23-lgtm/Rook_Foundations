import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BrainCircuit, MessageCircleQuestion } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const principles = [
  {
    Icon: Heart,
    title: 'Child-Centred',
    accent: '#c05050',
    body: "We don't believe every child should learn the same game in the same way. Instead, we observe how each child thinks and introduce activities that match their interests, confidence and stage of development.",
  },
  {
    Icon: BrainCircuit,
    title: 'Learn at the Right Level',
    accent: '#4a7eb8',
    body: 'Children make the greatest progress when they are challenged without becoming overwhelmed. We continually adjust activities to provide just the right level of difficulty that stretches thinking while ensuring learning remains enjoyable and achievable.',
  },
  {
    Icon: MessageCircleQuestion,
    title: 'Questions Before Answers',
    accent: '#7a48c0',
    body: 'Rather than simply telling children the correct move, we encourage them to explain their thinking. By asking thoughtful questions, children learn to think more independently and become increasingly confident in explaining their ideas.',
  },
];

// Outline traced from the reference Staunton rook (IMG_2868), in a 0 0 100
// 114.6 viewBox. OUTER is the full silhouette (used once as a white fill,
// once as a stroke-only pass on top so the gold line always reads crisp).
// TEETH are the three crenellations sliced out of that same trace — same
// source points, so they align pixel-for-pixel with the outline — each one
// closed off with a flat edge at the notch floor (y 21.19) so it can be
// tinted independently as one of the three clickable pillars.
const GOLD = '#C99A34';
const OUTER =
  'M 90.52 109.86 L 8.61 109.86 L 8.44 109.69 L 8.44 101.09 L 8.66 98.26 L 9.31 95.1 L 10.19 92.92 L 11.49 90.74 L 13.83 88.4 L 16.23 86.98 L 19.88 85.62 L 25.0 42.81 L 24.4 42.21 L 22.88 41.56 L 21.13 40.36 L 18.9 38.24 L 17.7 36.49 L 16.5 33.77 L 15.85 30.83 L 15.52 25.16 L 14.65 16.45 L 14.43 12.96 L 14.81 12.47 L 17.86 10.84 L 22.33 9.31 L 26.14 8.66 L 30.94 8.66 L 31.86 11.98 L 33.71 20.7 L 34.2 21.19 L 37.36 21.19 L 37.8 21.08 L 37.96 20.81 L 39.38 7.63 L 39.87 7.03 L 41.07 6.81 L 46.41 6.15 L 50.44 6.05 L 54.79 6.37 L 59.48 7.14 L 59.75 7.84 L 61.06 20.15 L 61.17 20.81 L 61.55 21.19 L 64.92 21.19 L 65.31 21.02 L 68.19 8.66 L 72.98 8.66 L 76.8 9.31 L 81.26 10.84 L 84.48 12.53 L 84.69 12.85 L 84.69 13.62 L 83.61 24.84 L 83.28 30.72 L 82.3 34.53 L 81.1 36.93 L 79.79 38.67 L 77.45 40.69 L 74.29 42.43 L 74.13 43.25 L 79.14 85.4 L 79.74 85.89 L 83.44 87.31 L 85.73 88.83 L 87.96 91.29 L 89.27 93.68 L 90.14 96.62 L 90.47 98.91 L 90.69 104.36 L 90.69 109.69 L 90.52 109.86 Z';
const TEETH = [
  'M 14.65 16.45 L 14.43 12.96 L 14.81 12.47 L 17.86 10.84 L 22.33 9.31 L 26.14 8.66 L 30.94 8.66 L 31.86 11.98 L 33.71 20.7 L 34.2 21.19 L 14.65 21.19 Z',
  'M 37.96 21.19 L 39.38 7.63 L 39.87 7.03 L 41.07 6.81 L 46.41 6.15 L 50.44 6.05 L 54.79 6.37 L 59.48 7.14 L 59.75 7.84 L 61.06 20.15 L 61.17 20.81 L 61.55 21.19 Z',
  'M 65.31 21.19 L 68.19 8.66 L 72.98 8.66 L 76.8 9.31 L 81.26 10.84 L 84.48 12.53 L 84.69 12.85 L 84.69 13.62 L 84.69 21.19 Z',
];
// Two soft highlight regions traced from the reference's shading — kept at
// low opacity so the piece reads as a clean, flat premium icon rather than
// a rendered/glossy one.
const HIGHLIGHTS = [
  'M 72.11 39.92 L 61.98 38.73 L 52.94 38.07 L 43.68 38.18 L 36.82 38.73 L 28.32 39.92 L 26.80 39.92 L 25.49 39.38 L 23.09 37.85 L 21.51 36.38 L 20.32 34.64 L 19.44 32.57 L 18.79 28.76 L 18.79 27.02 L 17.81 16.88 L 17.81 14.38 L 20.37 13.13 L 22.44 12.47 L 25.82 11.82 L 28.32 11.71 L 28.70 12.09 L 31.21 23.86 L 31.59 24.24 L 40.52 24.24 L 40.80 23.75 L 41.01 22.22 L 41.99 12.20 L 42.21 11.66 L 42.21 10.46 L 42.48 9.86 L 45.97 9.31 L 49.24 9.10 L 55.99 9.64 L 56.64 9.86 L 56.92 10.57 L 58.44 24.07 L 58.61 24.24 L 67.65 24.24 L 67.92 23.86 L 68.46 21.57 L 68.57 20.37 L 70.59 11.82 L 73.31 11.82 L 76.25 12.36 L 80.07 13.78 L 81.32 14.49 L 81.32 15.90 L 80.34 26.14 L 80.34 28.10 L 79.68 32.35 L 78.81 34.53 L 77.51 36.38 L 74.84 38.62 L 72.11 39.92 Z',
  'M 23.64 85.02 L 23.15 84.86 L 23.15 84.31 L 24.02 78.32 L 24.13 76.03 L 26.63 55.01 L 26.85 54.47 L 27.83 44.77 L 28.21 43.08 L 37.04 41.88 L 40.96 41.78 L 45.32 41.34 L 50.54 41.23 L 54.47 41.34 L 55.34 41.56 L 64.92 42.21 L 66.23 42.54 L 70.48 42.97 L 70.97 43.25 L 73.80 68.08 L 74.02 68.63 L 75.44 81.59 L 75.65 82.14 L 75.87 84.20 L 75.71 84.91 L 69.93 84.15 L 60.02 83.61 L 42.27 83.50 L 30.28 84.15 L 24.18 84.80 L 23.64 85.02 Z',
];

function RookIllustration({ active, hovered, onSelect, onHover }) {
  const glowId = useId();

  return (
    <svg
      viewBox="0 0 100 114.6"
      className="w-full h-auto max-w-[170px] sm:max-w-[210px] mx-auto"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* White body */}
      <path d={OUTER} fill="#fff" />
      {/* Subtle traced shading — same warm gold as the outline, very low opacity */}
      <path d={HIGHLIGHTS[0]} fill={GOLD} opacity="0.08" />
      <path d={HIGHLIGHTS[1]} fill={GOLD} opacity="0.08" />

      {/* Three crenellations — decorative + mouse/touch clickable, kept out of
          the tab order since the labelled buttons below are the canonical
          accessible controls. */}
      {TEETH.map((d, i) => {
        const isLit = active === i || hovered === i;
        return (
          <g key={i}>
            {isLit && (
              <path d={d} fill={principles[i].accent} opacity="0.6" filter={`url(#${glowId})`} />
            )}
            <motion.path
              d={d}
              style={{ fill: isLit ? principles[i].accent : '#fff', cursor: 'pointer' }}
              animate={{ y: isLit ? -1.5 : 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => onSelect(i)}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            />
          </g>
        );
      })}

      {/* Gold outline, drawn last so it always reads crisp over every fill state above */}
      <path d={OUTER} fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function InteractiveRookPillars() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const panelId = useId();

  const toggle = (i) => setActive((cur) => (cur === i ? null : i));
  const activePrinciple = active !== null ? principles[active] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mb-10"
    >
      <RookIllustration active={active} hovered={hovered} onSelect={toggle} onHover={setHovered} />

      {/* Three labelled, keyboard-accessible controls — the canonical way to open each principle */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 max-w-xl mx-auto">
        {principles.map((p, i) => {
          const isActive = active === i;
          return (
            <button
              key={p.title}
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`group aspect-square flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 rounded-2xl px-1.5 py-2 sm:px-3 sm:py-4 border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${
                isActive
                  ? 'shadow-md -translate-y-0.5'
                  : 'border-transparent hover:-translate-y-0.5 hover:shadow-sm'
              }`}
              style={{
                borderColor: isActive ? p.accent : `${p.accent}25`,
                backgroundColor: isActive ? `${p.accent}12` : 'transparent',
                '--tw-ring-color': p.accent,
              }}
            >
              <span
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                style={{ backgroundColor: `${p.accent}18` }}
              >
                <p.Icon size={14} className="sm:hidden" style={{ color: p.accent }} />
                <p.Icon size={17} className="hidden sm:block" style={{ color: p.accent }} />
              </span>
              <span className="font-fredoka text-[10px] sm:text-sm leading-tight" style={{ color: p.accent }}>
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Shared reveal panel */}
      <div id={panelId} className="max-w-2xl mx-auto mt-2">
        <AnimatePresence mode="wait">
          {activePrinciple ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-4 rounded-2xl border-l-4 bg-white px-6 py-5 shadow-sm"
              style={{ borderColor: activePrinciple.accent }}
            >
              <h4 className="font-fredoka text-lg mb-2" style={{ color: activePrinciple.accent }}>
                {activePrinciple.title}
              </h4>
              <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">
                {activePrinciple.body}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-nunito text-[#2D2520]/40 text-sm text-center italic mt-6"
            >
              Select a pillar above to explore how we bring it to life.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
