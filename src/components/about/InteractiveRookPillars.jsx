import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sprout, BrainCircuit, MessageCircle } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const principles = [
  {
    Icon: Target,
    title: 'Process Over Outcome',
    accent: '#b8790a',
    body: 'We focus on the quality of a child\'s thinking rather than simply the result. A well-reasoned and clearly explained loss often teaches more than a lucky win.',
  },
  {
    Icon: Sprout,
    title: 'Every Child Progresses',
    accent: '#2d8c62',
    body: 'Children learn differently. We identify each child\'s individual needs and provide tailored guidance to help them grow steadily and confidently.',
  },
  {
    Icon: BrainCircuit,
    title: 'Learning at the Right Level',
    accent: '#4a7eb8',
    body: 'Lessons are carefully adapted so that children are challenged without becoming overwhelmed. As confidence grows, children are gradually introduced to new games, deeper ideas, and more complex forms of thinking.',
  },
  {
    Icon: MessageCircle,
    title: 'Thinking Aloud & Social Learning',
    accent: '#7a48c0',
    body: 'Children are encouraged to explain their ideas, discuss their decisions, and consider how others may respond. Through gameplay they develop patience, respect, listening skills, and the confidence to express their thoughts clearly.',
  },
];

// Crenellation x-ranges within the 0 0 400 520 viewBox — four evenly spaced
// teeth with three gaps, used both to draw the rook and to size/tint each
// tooth in sync with the label buttons below.
const TEETH = [
  { x: 90, w: 40 },
  { x: 150, w: 40 },
  { x: 210, w: 40 },
  { x: 270, w: 40 },
];
const TOOTH_TOP = 40;
const TOOTH_BOTTOM = 130;

function RookIllustration({ active, hovered, onSelect, onHover }) {
  const gradId = useId();
  const glowId = useId();

  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-auto max-w-[240px] sm:max-w-[300px] mx-auto"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C261" />
          <stop offset="55%" stopColor="#E8A020" />
          <stop offset="100%" stopColor="#c98a12" />
        </linearGradient>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Base plinth (two-tier) */}
      <rect x="60" y="465" width="280" height="26" rx="6" style={{ fill: `url(#${gradId})` }} opacity="0.92" />
      <rect x="80" y="435" width="240" height="32" rx="4" style={{ fill: `url(#${gradId})` }} />
      {/* Base flare */}
      <path d="M 160,395 L 240,395 L 310,435 L 90,435 Z" style={{ fill: `url(#${gradId})` }} />
      {/* Shaft */}
      <rect x="160" y="215" width="80" height="180" style={{ fill: `url(#${gradId})` }} />
      {/* Collar band */}
      <rect x="148" y="285" width="104" height="17" rx="4" fill="#c98a12" opacity="0.55" />
      {/* Neck taper */}
      <path d="M 80,175 L 320,175 L 240,215 L 160,215 Z" style={{ fill: `url(#${gradId})` }} />
      {/* Crown slab */}
      <rect x="80" y="130" width="240" height="45" rx="3" style={{ fill: `url(#${gradId})` }} />

      {/* Four crenellations — decorative + mouse/touch clickable, kept out of
          the tab order since the labelled buttons below are the canonical
          accessible controls. */}
      {TEETH.map((t, i) => {
        const isLit = active === i || hovered === i;
        return (
          <g key={i}>
            {isLit && (
              <rect
                x={t.x - 6}
                y={TOOTH_TOP - 8}
                width={t.w + 12}
                height={TOOTH_BOTTOM - TOOTH_TOP + 16}
                rx="10"
                fill={principles[i].accent}
                opacity="0.55"
                filter={`url(#${glowId})`}
              />
            )}
            <motion.rect
              x={t.x}
              y={TOOTH_TOP}
              width={t.w}
              height={TOOTH_BOTTOM - TOOTH_TOP}
              rx="6"
              style={{ fill: isLit ? principles[i].accent : `url(#${gradId})`, cursor: 'pointer' }}
              animate={{ y: isLit ? TOOTH_TOP - 6 : TOOTH_TOP }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => onSelect(i)}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            />
          </g>
        );
      })}
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

      {/* Four labelled, keyboard-accessible controls — the canonical way to open each principle */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-2xl mx-auto">
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
              className={`group flex flex-col items-center text-center gap-1.5 rounded-2xl px-3 py-4 border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${
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
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${p.accent}18` }}
              >
                <p.Icon size={17} style={{ color: p.accent }} />
              </span>
              <span className="font-fredoka text-xs sm:text-sm leading-tight" style={{ color: p.accent }}>
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
