import { Fragment, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, RotateCcw, ArrowRight, ArrowDown, Castle, Eye, Target } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
          <Repeat size={14} /> Progress tracking
        </span>
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Tracking Progress Over Time
        </h2>
        <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          Every lesson builds on the previous one. Through observation, personalised learning targets and carefully selected strategy games, we continually adapt teaching to support each child's development.
        </p>
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

      {/* Notion — how it's all kept organised behind the scenes */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        className="flex flex-col items-center"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex flex-col items-center gap-2 outline-none"
        >
          <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-focus-visible:scale-105 group-focus-visible:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-[#E8A020] group-focus-visible:ring-offset-2">
            <picture>
              <source srcSet="/images/icons/notion-logo.webp" type="image/webp" />
              <img
                src="/images/icons/notion-logo.png"
                alt="Notion"
                width={240}
                height={240}
                className="w-14 h-14 sm:w-16 sm:h-16"
              />
            </picture>
          </span>
          <span className="font-nunito text-[#2D2520]/45 text-xs">
            {open ? 'Hide details' : 'How we organise it all'}
          </span>
        </button>

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
