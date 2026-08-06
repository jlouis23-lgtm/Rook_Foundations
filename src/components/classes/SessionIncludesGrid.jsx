import { motion } from 'framer-motion';
import { Dices, Target, MessageCircle, TrendingUp, RotateCcw, Calendar } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Same six-colour rotation already used for a six-item sequence elsewhere on
// the site (LearningJourney's pyramid stages), reused here rather than
// introducing a new palette.
const features = [
  {
    Icon: Dices,
    accent: '#2d8c62',
    title: 'Personalised Strategy Games',
    body: "Activities are carefully selected to match your child's age, interests and current learning goals.",
  },
  {
    Icon: Target,
    accent: '#c9860f',
    title: 'Individual Learning Targets',
    body: 'Each session contributes towards personalised learning targets that evolve as your child develops.',
  },
  {
    Icon: MessageCircle,
    accent: '#4a7eb8',
    title: 'Guided Discussion',
    body: 'Children are encouraged to explain their thinking, explore ideas and build confidence through conversation.',
  },
  {
    Icon: TrendingUp,
    accent: '#7a48c0',
    title: 'Ongoing Progress Tracking',
    body: 'Observations from each session help shape future lessons and monitor long-term development.',
  },
  {
    Icon: RotateCcw,
    accent: '#c05050',
    title: 'Structured Reflection',
    body: 'Every session includes opportunities to reflect on decisions, celebrate successes and identify next steps.',
  },
  {
    Icon: Calendar,
    accent: '#2a8c88',
    title: 'Tailored Lesson Planning',
    body: 'Future sessions are adapted using previous observations, ensuring every lesson builds on the last.',
  },
];

// Deliberately not a card grid — the rest of the page (ProgressTrackingSection
// below) already uses white rounded-3xl shadow cards, so this list uses a
// flatter, left-accent panel treatment instead: no shadow, no card background,
// just a coloured rule and tight icon-led text. It reads as a continuation of
// the "What Makes Us Different" intro paragraph rather than a new section.
function FeatureRow({ feature, index }) {
  const { Icon, accent, title, body } = feature;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06, ease: EASE }}
      className="flex items-start gap-2.5 pl-3.5 pr-2 py-2 border-l-[3px] rounded-r-lg transition-colors duration-200 hover:bg-[#2D2520]/[0.025]"
      style={{ borderColor: accent }}
    >
      <span
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Icon size={13} style={{ color: accent }} />
      </span>
      <div>
        <p className="font-fredoka text-[#2D2520] text-sm leading-tight">{title}</p>
        <p className="font-nunito text-[#2D2520]/55 text-xs leading-snug mt-1">{body}</p>
      </div>
    </motion.div>
  );
}

export default function SessionIncludesGrid() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 sm:gap-y-1.5 mb-16">
      {features.map((feature, i) => (
        <FeatureRow key={feature.title} feature={feature} index={i} />
      ))}
    </div>
  );
}
