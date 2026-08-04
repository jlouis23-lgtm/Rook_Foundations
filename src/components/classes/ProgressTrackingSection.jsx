import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, ArrowRight, ChevronDown, BookOpenCheck, Target, ClipboardCheck } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const workflow = ['Lesson', 'Observation', 'Learning Targets', 'Review Progress', 'Update Targets', 'Plan Next Lesson'];

const cards = [
  {
    Icon: BookOpenCheck,
    accent: '#4a7eb8',
    title: 'Session Records',
    items: [
      'Strategy games played',
      'Skills being developed',
      'Strengths observed',
      'Challenges encountered',
      'Personalised learning targets',
    ],
  },
  {
    Icon: Target,
    accent: '#7a48c0',
    title: 'Planning the Next Session',
    items: [
      'Learning targets guide future lessons',
      'Different strategy games are selected to suit individual learning needs',
      'Activities become progressively more challenging as confidence develops',
    ],
  },
  {
    Icon: ClipboardCheck,
    accent: '#2d8c62',
    title: 'Review',
    items: [
      'Previous lesson notes',
      'Progress made',
      'Strengths',
      'Areas requiring support',
      'Updated learning targets',
    ],
  },
];

export default function ProgressTrackingSection() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
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
            How We Track Your Child's Progress
          </h2>
          <p className="font-fredoka text-[#b8790a] text-lg sm:text-xl italic mt-4">
            "Every session builds on the last."
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Children receiving individual tuition are given a personalised learning profile. Every lesson builds on what we've observed before — strengths and challenges are recorded, learning targets are kept up to date, and each future session is planned around real progress rather than a generic curriculum.
          </p>
        </motion.div>

        {/* Workflow */}
        <div className="mb-14">
          {/* Mobile — vertical numbered roadmap, one clear path top to bottom */}
          <ol className="sm:hidden relative max-w-[15rem] mx-auto">
            <div
              className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-[#E8A020]/50 via-[#E8A020]/25 to-[#E8A020]/10"
              aria-hidden="true"
            />
            {workflow.map((step, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                className="relative flex items-center gap-3 pb-4 last:pb-0"
              >
                <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#E8A020] text-white font-fredoka text-sm flex items-center justify-center shadow-sm shadow-[#E8A020]/30">
                  {i + 1}
                </span>
                <span className="flex-1 bg-white border border-[#E8A020]/15 rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 active:scale-[0.98] active:bg-[#E8A020]/5">
                  <span className="font-fredoka text-[#2D2520] text-sm">{step}</span>
                </span>
              </motion.li>
            ))}
          </ol>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
            className="sm:hidden flex items-center justify-center gap-1.5 mt-5"
          >
            <Repeat size={12} className="text-[#E8A020]/45 flex-shrink-0" />
            <span className="font-nunito text-[#2D2520]/40 text-xs">Then the cycle begins again</span>
          </motion.div>

          {/* Tablet / desktop — unchanged horizontal flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="hidden sm:flex sm:flex-wrap lg:flex-nowrap items-center justify-center gap-x-1.5 gap-y-3"
          >
            {workflow.map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <div className="bg-white border border-[#E8A020]/15 rounded-2xl px-3.5 py-3 sm:px-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 whitespace-nowrap">
                  <span className="font-fredoka text-[#2D2520] text-xs sm:text-sm">{step}</span>
                </div>
                {i < workflow.length - 1 && (
                  <ArrowRight size={16} className="text-[#E8A020] flex-shrink-0" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="bg-white border border-[#2D2520]/8 rounded-3xl p-6 shadow-sm"
            >
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${c.accent}14` }}
              >
                <c.Icon size={20} style={{ color: c.accent }} />
              </span>
              <h3 className="font-fredoka text-[#2D2520] text-lg mb-3">{c.title}</h3>
              <ul className="space-y-1.5">
                {c.items.map((item) => (
                  <li key={item} className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: c.accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Converging arrows + Notion icon — the destination all three cards feed into */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="flex flex-col items-center mb-14"
        >
          {/* Desktop / tablet — three arrows converging on the icon */}
          <svg className="hidden md:block w-full max-w-3xl h-10" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 16.7 0 Q 16.7 22 48 31" fill="none" stroke="#E8A020" strokeOpacity="0.35" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 50 0 L 50 31" fill="none" stroke="#E8A020" strokeOpacity="0.35" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 83.3 0 Q 83.3 22 52 31" fill="none" stroke="#E8A020" strokeOpacity="0.35" strokeWidth="0.8" strokeLinecap="round" />
          </svg>

          {/* Mobile — simplified single connector */}
          <div className="md:hidden flex flex-col items-center h-8 justify-end">
            <div className="w-px h-5 bg-[#E8A020]/35" />
            <ChevronDown size={14} className="text-[#E8A020]/50 -mt-0.5" />
          </div>

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
                  <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-3">
                    Notion is the system I use behind the scenes to keep every lesson connected. It's where I record lesson observations, document each child's strengths, note any areas that need extra support, track progress over time, keep learning targets up to date, and plan the next lesson around how the last one went.
                  </p>
                  <p className="font-nunito text-[#b8790a] text-sm font-700">
                    It's used for one purpose only — personalising and improving your child's learning journey.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Closing summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="border border-[#E8A020]/30 bg-[#E8A020]/5 rounded-3xl px-6 sm:px-10 py-7 text-center mb-16"
        >
          <p className="font-nunito text-[#2D2520]/75 italic leading-relaxed max-w-2xl mx-auto">
            We use structured observations and ongoing review to understand how each child learns best. By regularly recording strengths, challenges and progress towards personalised learning targets, we can adapt future sessions to keep children engaged, appropriately challenged and moving forward.
          </p>
        </motion.div>
    </div>
  );
}
