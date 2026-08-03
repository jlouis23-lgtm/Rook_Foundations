import { Fragment } from 'react';
import { motion } from 'framer-motion';

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

// 7 boundary lines (apex to base) as a symmetric % inset from each side.
// Band i spans boundaries[i] (its top) to boundaries[i+1] (its bottom); since
// each band shares its top/bottom value with its neighbour, the clip-path
// edges line up into one continuous, unbroken triangle silhouette.
const BOUNDARIES = [35, 29, 23, 17, 11, 6, 0];

const pyramidOrder = [...stages].reverse();

export default function LearningJourney() {
  return (
    <div>
      <div className="text-center mb-8 lg:mb-10 max-w-2xl mx-auto">
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)' }}>
          The Rook Foundations Learning Pyramid
        </h2>
        <p className="font-nunito text-[#2D2520]/55 text-base mt-3 leading-relaxed">
          Every session follows the same six-stage journey, helping children progress from feeling understood to confidently applying their learning beyond the game.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="grid grid-cols-[clamp(150px,34vw,240px)_1fr] gap-x-3 sm:gap-x-6 lg:gap-x-10 max-w-4xl mx-auto"
      >
        {pyramidOrder.map((stage, i) => {
          const top = BOUNDARIES[i];
          const bottom = BOUNDARIES[i + 1];
          const descId = `pyramid-desc-${stage.num}`;
          return (
            <Fragment key={stage.num}>
              <div
                tabIndex={0}
                aria-describedby={descId}
                className="group relative flex items-center justify-center text-center outline-none transition-[filter] duration-300 hover:brightness-110 focus-visible:brightness-110 cursor-default"
                style={{
                  backgroundColor: stage.accent,
                  clipPath: `polygon(${top}% 0%, ${100 - top}% 0%, ${100 - bottom}% 100%, ${bottom}% 100%)`,
                }}
              >
                <div className="flex flex-col items-center justify-center gap-y-0.5 px-1.5 py-3 sm:py-4 max-w-full">
                  <span
                    className="font-fredoka text-white/75 leading-none"
                    style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.85rem)' }}
                  >
                    {String(stage.num).padStart(2, '0')}
                  </span>
                  <span
                    className="font-fredoka text-white leading-tight text-center"
                    style={{ fontSize: 'clamp(0.62rem, 1.6vw, 1.1rem)' }}
                  >
                    {stage.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center py-1.5 sm:py-2">
                <p
                  id={descId}
                  className="font-nunito text-[#2D2520]/70 leading-snug"
                  style={{ fontSize: 'clamp(0.72rem, 1vw, 0.85rem)' }}
                >
                  {stage.body}
                </p>
              </div>
            </Fragment>
          );
        })}
      </motion.div>
    </div>
  );
}
