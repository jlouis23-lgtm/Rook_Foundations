import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];

// Six values, reusing the site's established six-colour rotation (already
// used for the Learning Pyramid, session-includes grid, etc.) rather than
// inventing a new palette, per the brief's steer towards visual consistency
// with the Rook Foundations identity.
const values = [
  {
    title: 'Inclusive by Design',
    accent: '#2d8c62',
    body: 'We adapt games, activities and environments to support different ways of learning and participating.',
  },
  {
    title: 'Every Child is Welcome',
    accent: '#c9860f',
    body: "We create an environment where children feel respected, valued and able to participate without being defined by a diagnosis or difficulty.",
  },
  {
    title: 'Accessible Participation',
    accent: '#4a7eb8',
    body: 'We consider physical, sensory, communication, cognitive and emotional factors when supporting participation.',
  },
  {
    title: 'Positive Relationships',
    accent: '#7a48c0',
    body: "We build trust through consistency, patience and genuine interest in each child's strengths and preferences.",
  },
  {
    title: "Children's Voices Matter",
    accent: '#c05050',
    body: "We listen to children's preferences and experiences and consider these when adapting activities.",
  },
  {
    title: 'High Expectations, Flexible Support',
    accent: '#2a8c88',
    body: 'We maintain positive expectations while recognising that children may need different forms of support to participate successfully.',
  },
];

// Fan geometry — six cards pivoting from a shared point below the container,
// spread across a gentle arc rather than a straight row. Angle and lift are
// both symmetric around the middle gap (between cards 3 and 4), so the arc
// stays balanced. Card width/spacing are percentages of the container's own
// (responsive, clamp()-driven) width, so the whole fan scales as one unit
// on narrower screens rather than needing a separate mobile layout.
const ANGLES = [-20, -12, -4, 4, 12, 20];
const CARD_W_PCT = 16;
const STEP_PCT = 13;
const MAX_LIFT = 20;

function liftFor(offset) {
  const k = MAX_LIFT / (2.5 * 2.5);
  return MAX_LIFT - k * offset * offset;
}

export default function ValuesFan() {
  // Hover/focus give a live preview; click pins a card open independently of
  // hover, since a real mouse click is always preceded by a real hover on
  // the same element — reading a single "isActive" at click time would make
  // every click immediately re-close the card the hover had just opened.
  const [hoverIndex, setHoverIndex] = useState(null);
  const [pinnedIndex, setPinnedIndex] = useState(null);
  const activeIndex = hoverIndex ?? pinnedIndex;
  const active = activeIndex === null ? null : values[activeIndex];

  return (
    <div className="max-w-2xl mx-auto mb-14">
      <Reveal>
        <div
          className="relative mx-auto"
          style={{ width: 'clamp(300px, 78vw, 560px)', height: 'clamp(170px, 26vw, 210px)' }}
          role="group"
          aria-label="Our six values — select a card to see what it means"
        >
          {values.map((v, i) => {
            const offset = i - 2.5;
            const isActive = activeIndex === i;
            const lift = liftFor(offset);
            return (
              <button
                key={v.title}
                type="button"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                onClick={() => setPinnedIndex((prev) => (prev === i ? null : i))}
                aria-pressed={isActive}
                className="absolute bottom-0 rounded-xl bg-white flex items-center justify-center text-center outline-none transition-[transform,box-shadow,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#E8A020]"
                style={{
                  left: `calc(50% + ${offset * STEP_PCT}%)`,
                  width: `${CARD_W_PCT}%`,
                  aspectRatio: '0.72',
                  transform: `translateX(-50%) rotate(${ANGLES[i]}deg) translateY(${-lift}px) ${isActive ? 'scale(1.08)' : 'scale(1)'}`,
                  transformOrigin: '50% 115%',
                  zIndex: isActive ? 20 : i,
                  border: `1.5px solid ${isActive ? v.accent : `${v.accent}40`}`,
                  boxShadow: isActive ? `0 12px 20px -8px ${v.accent}55` : '0 2px 6px rgba(45,37,32,0.08)',
                  padding: '8%',
                }}
              >
                <span
                  className="font-fredoka leading-tight"
                  style={{ color: v.accent, fontSize: 'clamp(9.5px, 1.35vw, 12.5px)' }}
                >
                  {v.title}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="max-w-md mx-auto mt-5 min-h-[3.5rem]">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="bg-white border border-[#2D2520]/10 rounded-2xl px-5 py-4 text-center"
              style={{ borderTopWidth: 3, borderTopColor: active.accent }}
            >
              <p className="font-fredoka text-sm mb-1" style={{ color: active.accent }}>
                {active.title}
              </p>
              <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{active.body}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-nunito text-[#2D2520]/40 text-xs text-center italic"
            >
              Hover or select a card to see what it means.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
