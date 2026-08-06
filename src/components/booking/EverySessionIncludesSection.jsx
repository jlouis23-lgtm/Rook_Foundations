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

function FeatureCard({ feature, index }) {
  const { Icon, accent, title, body } = feature;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE } }}
      className="h-full flex flex-col bg-white border border-[#2D2520]/8 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <span
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </span>
      <h3 className="font-fredoka text-[#2D2520] text-lg mb-2">{title}</h3>
      <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

export default function EverySessionIncludesSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-12"
      >
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Every Session Includes
        </h2>
        <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Regardless of the session length you choose, every Rook Foundations session is carefully planned to provide a purposeful learning experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </div>
  );
}
