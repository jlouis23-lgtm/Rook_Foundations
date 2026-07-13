import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Check, ChevronDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const sessionTypes = [
  {
    key: 'individual',
    accent: '#4a7eb8',
    Icon: User,
    heading: 'Individual Sessions',
    tag: 'Self reflection',
    idealFor: 'Ideal for children who benefit from personalised guidance, deeper reflection and learning at their own pace.',
    ctaLabel: 'How Individual Sessions Work',
    body: "With fewer distractions, children have more time to explain their thinking, explore different ideas and reflect on the decisions they make. Through thoughtful questioning, puzzles and carefully chosen strategy games, we help children develop confidence in the way they think, not just the moves they make. Because learning is more personalised, we can also make detailed observations, identify areas for growth and adapt future sessions to the child's individual needs.",
  },
  {
    key: 'group',
    accent: '#2d8c62',
    Icon: Users,
    heading: 'Group Sessions',
    tag: 'Social reflection',
    idealFor: 'Ideal for children who enjoy learning with others while developing confidence, communication and social thinking.',
    ctaLabel: 'How Group Sessions Work',
    body: 'Children play strategy games together, solve problems, communicate ideas and learn how to approach challenge in a respectful and supportive environment. Alongside developing their decision-making, they also practise important social skills such as patience, teamwork, listening and healthy competition. The instructor guides learning through demonstrations, discussion and timely questioning while allowing children the opportunity to think, play and learn from one another.',
  },
];

const comparisonRows = [
  ['Deeper exploration of thinking', 'Applying thinking with others'],
  ['More personalised questioning', 'More collaborative discussion'],
  ['More opportunities for puzzles and reflection', 'More opportunities for gameplay and teamwork'],
  ['Detailed observations and personalised guidance', 'Observation of communication, teamwork and decision-making'],
  ['Learning tailored to one child', 'Learning through interaction with peers'],
];

function SessionCard({ session, isOpen, onToggle }) {
  const panelId = useId();
  const { accent, Icon, heading, tag, idealFor, ctaLabel, body } = session;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="rounded-3xl bg-white border-2 p-7 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: isOpen ? accent : `${accent}20`,
        boxShadow: isOpen ? `0 12px 32px ${accent}18` : undefined,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon size={26} style={{ color: accent }} />
      </div>

      <h3 className="font-fredoka text-[#2D2520] text-2xl mb-3">{heading}</h3>

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
        className="group w-full flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 font-fredoka text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-10">
        {sessionTypes.map((session) => (
          <SessionCard
            key={session.key}
            session={session}
            isOpen={openKey === session.key}
            onToggle={() => toggle(session.key)}
          />
        ))}
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-3xl border border-[#2D2520]/10 bg-white overflow-hidden shadow-sm"
      >
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th className="font-fredoka text-left text-base sm:text-lg px-4 sm:px-6 py-4" style={{ color: sessionTypes[0].accent, backgroundColor: `${sessionTypes[0].accent}10` }}>
                    Individual Learning
                  </th>
                  <th className="font-fredoka text-left text-base sm:text-lg px-4 sm:px-6 py-4" style={{ color: sessionTypes[1].accent, backgroundColor: `${sessionTypes[1].accent}10` }}>
                    Group Learning
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#F5F3EE]/60' : 'bg-white'}>
                    <td className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed px-4 sm:px-6 py-4 border-t border-[#2D2520]/8 align-top">
                      {row[0]}
                    </td>
                    <td className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed px-4 sm:px-6 py-4 border-t border-l border-[#2D2520]/8 align-top">
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Fade hint indicating horizontal scroll — only relevant below the table's min-width breakpoint */}
          <div className="sm:hidden absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
        <p className="sm:hidden text-center font-nunito text-[#2D2520]/35 text-xs mt-3">
          Swipe sideways to compare both columns →
        </p>
      </motion.div>
    </div>
  );
}
