import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shapes, BrainCircuit, MessageCircleQuestion, TrendingUp, MonitorSmartphone } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const principles = [
  {
    Icon: Heart,
    title: 'Child-Centred',
    accent: '#c05050',
    body: "We don't believe every child should learn the same game in the same way. Instead, we observe how each child thinks and introduce activities that match their interests, confidence and stage of development.",
  },
  {
    Icon: Shapes,
    title: 'Strategy Games, Not Just Chess',
    accent: '#b8790a',
    body: "Chess is one of many wonderful strategy games. However, it isn't the right starting point for every child. We use a variety of carefully chosen games to create opportunities for thinking, communication and problem-solving. The game is never the goal. The child's development is.",
  },
  {
    Icon: BrainCircuit,
    title: 'Learning at the Right Level',
    accent: '#4a7eb8',
    body: 'Children make the greatest progress when they are challenged without becoming overwhelmed. We continually adjust activities to provide just the right level of difficulty that stretches thinking while ensuring learning remains enjoyable and achievable.',
  },
  {
    Icon: MessageCircleQuestion,
    title: 'Questions Before Answers',
    accent: '#7a48c0',
    body: 'Rather than simply telling children the correct move, we encourage them to explain their thinking. By asking thoughtful questions, children learn to think more independently and become increasingly confident in explaining their ideas.',
  },
  {
    Icon: TrendingUp,
    title: 'Our Tracking System',
    accent: '#2d8c62',
    body: "Personalised feedback is recorded through observation and note-taking. Parents can view learning goals, achievements and areas for development in one place. Children also have access to their own progress, helping them build confidence, independence and ownership of their learning journey.",
  },
  {
    Icon: MonitorSmartphone,
    title: 'Using Technology Carefully',
    accent: '#2a8c88',
    body: 'Our approach combines the benefits of hands-on learning with the thoughtful use of digital tools. Children learn using real boards and practical activities, while carefully selected digital resources support thinking, strengthen memory and enhance learning only where they add genuine educational value.',
  },
];

// Crenellation x-ranges within the 0 0 400 520 viewBox — six evenly spaced
// teeth with five gaps, used both to draw the rook and to size/tint each
// tooth in sync with the label buttons below.
const TEETH = [
  { x: 70, w: 30 },
  { x: 116, w: 30 },
  { x: 162, w: 30 },
  { x: 208, w: 30 },
  { x: 254, w: 30 },
  { x: 300, w: 30 },
];
const TOOTH_TOP = 30;
const TOOTH_BOTTOM = 125;

function RookIllustration({ active, hovered, onSelect, onHover }) {
  const gradId = useId();
  const glowId = useId();

  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-auto max-w-[280px] sm:max-w-[340px] mx-auto"
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

      {/* Base plinth (two-tier) — broadened for a sturdier, more grounded base */}
      <rect x="40" y="480" width="320" height="24" rx="6" style={{ fill: `url(#${gradId})` }} opacity="0.92" />
      <rect x="60" y="445" width="280" height="38" rx="4" style={{ fill: `url(#${gradId})` }} />
      {/* Base flare */}
      <path d="M 130,400 L 270,400 L 330,445 L 70,445 Z" style={{ fill: `url(#${gradId})` }} />
      {/* Shaft — substantially widened so the piece reads as a rook, not a torch */}
      <rect x="130" y="225" width="140" height="175" style={{ fill: `url(#${gradId})` }} />
      {/* Collar band */}
      <rect x="115" y="295" width="170" height="20" rx="4" fill="#c98a12" opacity="0.55" />
      {/* Neck taper */}
      <path d="M 90,175 L 310,175 L 270,225 L 130,225 Z" style={{ fill: `url(#${gradId})` }} />
      {/* Crown slab */}
      <rect x="55" y="125" width="290" height="50" rx="3" style={{ fill: `url(#${gradId})` }} />

      {/* Six crenellations — decorative + mouse/touch clickable, kept out of
          the tab order since the labelled buttons below are the canonical
          accessible controls. */}
      {TEETH.map((t, i) => {
        const isLit = active === i || hovered === i;
        return (
          <g key={i}>
            {isLit && (
              <rect
                x={t.x - 5}
                y={TOOTH_TOP - 8}
                width={t.w + 10}
                height={TOOTH_BOTTOM - TOOTH_TOP + 16}
                rx="9"
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

      {/* Six labelled, keyboard-accessible controls — the canonical way to open each principle */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-2xl mx-auto">
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
