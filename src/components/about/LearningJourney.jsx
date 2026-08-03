import { motion } from 'framer-motion';
import { HeartHandshake, Lightbulb, Mountain, BrainCircuit, Search, Sprout } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Ordered bottom (foundation) to top (culmination), matching the reading /
// tab order. The pyramid silhouette itself is produced visually via
// flex-col-reverse further down, so stage 1 still renders first in the DOM.
const stages = [
  {
    num: 1,
    title: 'Relationship',
    descriptor: 'Building Trust First',
    accent: '#2d8c62',
    Icon: HeartHandshake,
    body: 'Every learning journey begins with understanding the child. By getting to know their interests, communication style and personality, we create a supportive environment where they feel comfortable to learn.',
    width: 'w-full',
  },
  {
    num: 2,
    title: 'Curiosity',
    descriptor: 'Inspiring Exploration',
    accent: '#b8790a',
    Icon: Lightbulb,
    body: 'A wide variety of strategy games and puzzles spark curiosity and encourage children to explore new ideas. Every activity is introduced with enthusiasm to create a genuine desire to learn and improve.',
    width: 'w-[94%] sm:w-[90%] lg:w-[86%]',
  },
  {
    num: 3,
    title: 'Challenge',
    descriptor: 'Stretching Thinking with Confidence',
    accent: '#4a7eb8',
    Icon: Mountain,
    body: "Activities are carefully matched to each child's ability, providing enough challenge to promote growth without becoming overwhelming. The right level of challenge builds confidence, resilience and independence.",
    width: 'w-[88%] sm:w-[80%] lg:w-[74%]',
  },
  {
    num: 4,
    title: 'Thinking',
    descriptor: 'Developing Thoughtful Decision-Making',
    accent: '#7a48c0',
    Icon: BrainCircuit,
    body: 'Children are encouraged to explain their thinking, consider different options and make decisions with purpose rather than impulse. Speaking their ideas aloud helps develop reasoning, confidence and communication.',
    width: 'w-[82%] sm:w-[70%] lg:w-[62%]',
  },
  {
    num: 5,
    title: 'Reflection',
    descriptor: 'Learning Through Reflection',
    accent: '#c05050',
    Icon: Search,
    body: 'Children pause to look back on what they did well, what challenged them and what they might do differently next time. Reflection helps strengthen understanding and prepares them for future learning.',
    width: 'w-[76%] sm:w-[60%] lg:w-[50%]',
  },
  {
    num: 6,
    title: 'Transfer',
    descriptor: 'Applying Learning Beyond the Game',
    accent: '#2a8c88',
    Icon: Sprout,
    body: 'Learning doesn’t end when the game finishes. We help children recognise how the thinking, decisions and strategies they practised can be applied to situations in everyday life.',
    width: 'w-[70%] sm:w-[50%] lg:w-[40%]',
  },
];

function PyramidLevel({ stage, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className={`${stage.width} mx-auto`}
    >
      <div
        tabIndex={0}
        className="group relative bg-white border border-[#2D2520]/10 rounded-2xl shadow-sm outline-none transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:shadow-lg focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 cursor-default"
        style={{
          borderTopWidth: 3,
          borderTopColor: stage.accent,
          padding: 'clamp(1rem, 2.4vw, 1.75rem) clamp(1.1rem, 3vw, 2rem)',
          '--tw-ring-color': `${stage.accent}80`,
        }}
      >
        <div className="flex items-center gap-3 mb-1.5">
          <span
            className="font-fredoka leading-none flex-shrink-0"
            style={{ color: stage.accent, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
          >
            {String(stage.num).padStart(2, '0')}
          </span>
          <h3
            className="font-fredoka text-[#2D2520] leading-snug"
            style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)' }}
          >
            {stage.title}
          </h3>
          <stage.Icon
            size={17}
            style={{ color: stage.accent }}
            className="ml-auto flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
        </div>

        <p
          className="font-nunito font-700 uppercase tracking-wide mb-2"
          style={{ color: stage.accent, fontSize: 'clamp(0.68rem, 1.2vw, 0.78rem)' }}
        >
          {stage.descriptor}
        </p>

        <p
          className="font-nunito text-[#2D2520]/65 leading-relaxed"
          style={{ fontSize: 'clamp(0.82rem, 1.6vw, 0.95rem)' }}
        >
          {stage.body}
        </p>
      </div>
    </motion.li>
  );
}

export default function LearningJourney() {
  return (
    <div>
      <div className="text-center mb-10 lg:mb-12 max-w-2xl mx-auto">
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          The Rook Foundations Learning Pyramid
        </h2>
        <p className="font-nunito text-[#2D2520]/55 text-base mt-3 leading-relaxed">
          Every session follows the same six-stage journey, helping children progress from feeling understood to confidently applying their learning beyond the game.
        </p>
      </div>

      <ol className="flex flex-col-reverse gap-3 sm:gap-4 max-w-3xl mx-auto list-none">
        {stages.map((stage, i) => (
          <PyramidLevel key={stage.num} stage={stage} index={i} />
        ))}
      </ol>
    </div>
  );
}
