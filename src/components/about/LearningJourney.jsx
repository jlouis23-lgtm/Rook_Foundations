import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Ordered bottom (foundation) to top (culmination) — the natural reading
// order. Rendered in reverse (apex first) further down so the pyramid
// silhouette stacks narrow-to-wide, top to bottom.
const stages = [
  {
    num: 1,
    title: 'Relationship',
    accent: '#2d8c62',
    body: 'Every learning journey begins with understanding the child. By getting to know their interests, communication style and personality, we create a supportive environment where they feel comfortable to learn.',
  },
  {
    num: 2,
    title: 'Curiosity',
    accent: '#c9860f',
    body: 'A wide variety of strategy games and puzzles spark curiosity and encourage children to explore new ideas. Every activity is introduced with enthusiasm to create a genuine desire to learn and improve.',
  },
  {
    num: 3,
    title: 'Challenge',
    accent: '#4a7eb8',
    body: "Activities are carefully matched to each child's ability, providing enough challenge to promote growth without becoming overwhelming. The right level of challenge builds confidence, resilience and independence.",
  },
  {
    num: 4,
    title: 'Thinking',
    accent: '#7a48c0',
    body: 'Children are encouraged to explain their thinking, consider different options and make decisions with purpose rather than impulse. Speaking their ideas aloud helps develop reasoning, confidence and communication.',
  },
  {
    num: 5,
    title: 'Reflection',
    accent: '#c05050',
    body: 'Children pause to look back on what they did well, what challenged them and what they might do differently next time. Reflection helps strengthen understanding and prepares them for future learning.',
  },
  {
    num: 6,
    title: 'Transfer',
    accent: '#2a8c88',
    body: 'Learning doesn’t end when the game finishes. We help children recognise how the thinking, decisions and strategies they practised can be applied to situations in everyday life.',
  },
];

// 7 boundary lines (apex to base) as a symmetric % inset from each side. The
// apex band (index 0, "Transfer") gets a bigger slice of the inset budget
// than the rest so its base edge is wide enough to hold a label; every band
// below splits the remainder evenly. Band i spans boundaries[i]..boundaries[i+1].
const APEX_DELTA = 14;
const OTHER_DELTA = (50 - APEX_DELTA) / 5;
const DELTAS = [APEX_DELTA, OTHER_DELTA, OTHER_DELTA, OTHER_DELTA, OTHER_DELTA, OTHER_DELTA];
const BOUNDARIES = DELTAS.reduce(
  (acc, d) => [...acc, acc[acc.length - 1] - d],
  [50]
);

const pyramidOrder = [...stages].reverse();

function bandClipPath(top, bottom) {
  return `polygon(${top}% 0%, ${100 - top}% 0%, ${100 - bottom}% 100%, ${bottom}% 100%)`;
}

// Each band's height is set proportional to its own inset delta (via flex-grow
// on a zero flex-basis). Since width-change / height is then identical for
// every band, the left and right silhouette edges are each a single straight
// line from apex to base — a true, unbroken triangle — no matter how the
// available height is divided, and independent of any sibling's content.
function bandFlex(delta) {
  return `${delta} ${delta} 0%`;
}

function Heading() {
  return (
    <div className="text-center mb-8 lg:mb-10 max-w-2xl mx-auto">
      <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)' }}>
        The Rook Foundations Learning Pyramid
      </h2>
      <p className="font-nunito text-[#2D2520]/55 text-base mt-3 leading-relaxed">
        Every session follows the same six-stage journey, helping children progress from feeling understood to confidently applying their learning beyond the game.
      </p>
    </div>
  );
}

// Tablet / desktop — a single connected infographic: six horizontal rows,
// each pairing its pyramid band directly against a lightly-tinted panel
// holding that stage's description. Row height is set once on the outer
// wrapper (a responsive clamp, independent of text length) and divided
// between rows via the same proportional flex-grow as the band widths, so
// the coloured band and its panel always start and end at the exact same
// pixel — no separate columns to fall out of sync.
function DesktopPyramid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      className="max-w-6xl mx-auto rounded-3xl border border-[#2D2520]/8 shadow-sm overflow-hidden bg-white"
    >
      <div className="flex flex-col" style={{ height: 'clamp(480px, 46vw, 620px)' }}>
        {pyramidOrder.map((stage, i) => {
          const top = BOUNDARIES[i];
          const bottom = BOUNDARIES[i + 1];
          const descId = `pyramid-desc-${stage.num}`;
          return (
            <div
              key={stage.num}
              className={`group flex items-stretch ${i !== 0 ? 'border-t border-[#2D2520]/8' : ''}`}
              style={{ flex: bandFlex(DELTAS[i]) }}
            >
              <div
                tabIndex={0}
                aria-describedby={descId}
                className="relative flex items-end justify-center text-center outline-none flex-shrink-0 transition-[filter] duration-300 group-hover:brightness-110 focus-visible:brightness-110 cursor-default"
                style={{
                  width: 'clamp(215px, 22vw, 300px)',
                  backgroundColor: stage.accent,
                  clipPath: bandClipPath(top, bottom),
                }}
              >
                <span
                  className="font-fredoka text-white leading-tight px-1 pb-3 sm:pb-4 whitespace-nowrap"
                  style={{ fontSize: 'clamp(0.72rem, 1vw, 0.92rem)' }}
                >
                  {stage.title}
                </span>
              </div>

              <div
                className="flex-1 flex items-center px-6 sm:px-8 lg:px-10 py-3 transition-colors duration-300"
                style={{ backgroundColor: `${stage.accent}14` }}
              >
                <p
                  id={descId}
                  className="font-nunito text-[#2D2520]/75"
                  style={{ fontSize: 'clamp(0.85rem, 0.95vw, 0.95rem)', lineHeight: 1.7 }}
                >
                  {stage.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Mobile only — a centred, title-only pyramid. Tapping a stage reveals its
// description in a panel beneath the diagram; only one is shown at a time.
function MobilePyramid() {
  const [activeNum, setActiveNum] = useState(null);
  const activeStage = stages.find((s) => s.num === activeNum);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto"
      style={{ width: 'min(72vw, 300px)' }}
    >
      <div className="flex flex-col" style={{ aspectRatio: '4 / 5' }}>
        {pyramidOrder.map((stage, i) => {
          const top = BOUNDARIES[i];
          const bottom = BOUNDARIES[i + 1];
          const isActive = activeNum === stage.num;
          return (
            <button
              key={stage.num}
              type="button"
              onClick={() => setActiveNum(stage.num)}
              aria-pressed={isActive}
              className="w-full appearance-none border-0 min-h-0 flex items-end justify-center text-center outline-none transition-[filter] duration-300 hover:brightness-110 focus-visible:brightness-110 active:brightness-110"
              style={{
                backgroundColor: stage.accent,
                clipPath: bandClipPath(top, bottom),
                flex: bandFlex(DELTAS[i]),
                filter: isActive ? 'brightness(1.1)' : 'none',
              }}
            >
              <span
                className="font-fredoka text-white leading-tight text-center px-1 pb-2"
                style={{ fontSize: 'clamp(0.68rem, 3vw, 0.85rem)' }}
              >
                {stage.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[2.5rem]">
        <AnimatePresence mode="wait">
          {activeStage ? (
            <motion.div
              key={activeStage.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="bg-white border border-[#2D2520]/10 rounded-2xl px-4 py-4"
              style={{ borderTopWidth: 3, borderTopColor: activeStage.accent }}
            >
              <p
                className="font-fredoka mb-1.5"
                style={{ color: activeStage.accent, fontSize: '0.95rem' }}
              >
                {activeStage.title}
              </p>
              <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">
                {activeStage.body}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-nunito text-[#2D2520]/40 text-sm text-center italic"
            >
              Tap a stage above to explore it
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LearningJourney() {
  return (
    <div>
      <Heading />

      <div className="sm:hidden">
        <MobilePyramid />
      </div>

      <div className="hidden sm:block">
        <DesktopPyramid />
      </div>
    </div>
  );
}
