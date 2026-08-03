import { motion } from 'framer-motion';
import { Repeat, NotebookText, ArrowRight, BookOpenCheck, Target, ClipboardCheck } from 'lucide-react';

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
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Notion badge — subtle, top-right */}
        <div
          className="hidden sm:flex absolute top-0 right-6 lg:right-12 w-11 h-11 rounded-2xl bg-[#2D2520] items-center justify-center shadow-sm"
          title="Organised with Notion"
          aria-hidden="true"
        >
          <NotebookText size={18} className="text-white" strokeWidth={1.8} />
        </div>

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-1.5 gap-y-3 mb-14"
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

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
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

        {/* Closing summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="border border-[#E8A020]/30 bg-[#E8A020]/5 rounded-3xl px-6 sm:px-10 py-7 text-center"
        >
          <p className="font-nunito text-[#2D2520]/75 italic leading-relaxed max-w-2xl mx-auto">
            We use structured observations and ongoing review to understand how each child learns best. By regularly recording strengths, challenges and progress towards personalised learning targets, we can adapt future sessions to keep children engaged, appropriately challenged and moving forward.
          </p>
        </motion.div>
    </div>
  );
}
