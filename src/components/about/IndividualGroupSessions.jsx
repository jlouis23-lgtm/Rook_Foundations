import { Fragment, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Comparison-table content merged directly into each drop-down as bullet
// points (see point 5/6 in the brief) rather than living in a separate table.
const sessionTypes = [
  {
    key: 'individual',
    accent: '#4a7eb8',
    count: '1',
    countLabel: 'student',
    heading: 'Individual Sessions',
    tag: 'Self reflection',
    idealFor: 'Ideal for children who benefit from personalised guidance, deeper reflection and learning at their own pace.',
    ctaLabel: 'How Individual Sessions Work',
    body: "With fewer distractions, children have more time to explain their thinking, explore different ideas and reflect on the decisions they make. Because learning is more personalised, this allows us to also make detailed observations, identify areas for growth and adapt future sessions to the child's individual needs.",
    bulletPoints: [
      'Deeper exploration of thinking',
      'More personalised questioning',
      'More opportunities for puzzles and reflection',
      'Detailed observations and personalised guidance',
      'Learning tailored to one child',
    ],
  },
  {
    key: 'group',
    accent: '#2d8c62',
    count: '2–4',
    countLabel: 'students',
    heading: 'Group Sessions',
    tag: 'Social reflection',
    idealFor: 'Ideal for children who enjoy learning with others while developing confidence, communication and social thinking.',
    ctaLabel: 'How Group Sessions Work',
    body: 'Children play strategy games together, solve problems, communicate ideas and learn how to approach challenge in a respectful and supportive environment. Alongside developing their decision-making, they also practise important social skills such as patience, teamwork, listening and healthy competition. The instructor guides learning through demonstrations, discussion and timely questioning while allowing children the opportunity to think, play and learn from one another.',
    bulletPoints: [
      'Applying thinking with others',
      'More collaborative discussion',
      'More opportunities for gameplay and teamwork',
      'Observation of communication, teamwork and decision-making',
      'Learning through interaction with peers',
    ],
  },
];

function SessionBlock({ session, isOpen, onToggle }) {
  const panelId = useId();
  const { accent, count, countLabel, heading, tag, idealFor, ctaLabel, body, bulletPoints } = session;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-fredoka text-[#2D2520] text-2xl">{heading}</h3>
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <span className="font-fredoka text-2xl sm:text-3xl leading-none" style={{ color: accent }}>
            {count}
          </span>
          <span className="font-nunito text-[10px] font-700 uppercase tracking-wide text-[#2D2520]/40 mt-1">
            {countLabel}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        <li className="flex items-start gap-3 font-nunito text-sm leading-relaxed">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: accent }}
          >
            <Check size={11} className="text-white" />
          </span>
          <span className="font-700" style={{ color: accent }}>{tag}</span>
        </li>
        <li className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: accent }}
          >
            <Check size={11} className="text-white" />
          </span>
          {idealFor}
        </li>
      </ul>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 font-fredoka text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7]"
        style={{
          backgroundColor: isOpen ? accent : `${accent}12`,
          color: isOpen ? '#fff' : accent,
          '--tw-ring-color': accent,
        }}
      >
        {ctaLabel}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed pt-6">
              {body}
            </p>
            <ul className="mt-4 space-y-2.5">
              {bulletPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 font-nunito text-[#2D2520]/70 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IndividualGroupSessions() {
  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) => setOpenKey((cur) => (cur === key ? null : key));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 md:gap-y-12 items-start">
      {sessionTypes.map((session, i) => (
        <Fragment key={session.key}>
          {/* Mobile-only divider between Individual and Group. The grid's
              own row-gap is zeroed below md (restored at md and up, where
              this divider is hidden and the two sit side by side as
              before) so the wrapper's own padding is the single source of
              spacing here, rather than stacking on top of a structural
              grid gutter. Colour is set inline rather than via
              bg-[#2D2520]/12 since that utility wasn't generating a
              visible background for this element in dev. */}
          {i > 0 && (
            <div className="md:hidden py-6" aria-hidden="true">
              <div className="h-px" style={{ backgroundColor: '#2D2520', opacity: 0.12 }} />
            </div>
          )}
          <SessionBlock
            session={session}
            isOpen={openKey === session.key}
            onToggle={() => toggle(session.key)}
          />
        </Fragment>
      ))}
    </div>
  );
}
