import { motion } from 'framer-motion';

const timeline = [
  { year: '2018', emoji: '📚', event: "Began tutoring GCSE students in Maths, Science, and English. Developed skills in providing personalised academic support, building on previous lessons and using well-timed breaks to maximise concentration and learning." },
  { year: '2019', emoji: '⛺', event: "Worked as a Youth Officer at a children's camp, designing age-specific activities that deepened an understanding of child engagement, teamwork, and structured play." },
  { year: '2021', emoji: '🧠', event: 'Started a BSc in Psychology at the University of Manchester, focusing on developmental psychology, cognitive development, and how children build resilience through supportive environments.' },
  { year: '2022', emoji: '🤝', event: "Volunteered with Midlands charity ReachOut as a Peer Mentor, helping children from disadvantaged backgrounds build academic confidence, communication skills, and self-belief." },
  { year: '2023', emoji: '🔍', event: "Conducted research with parents experiencing mental illness, exploring how stigma affects parenting and children's emotional wellbeing." },
  { year: '2024', emoji: '🏛️', event: "Began an MSc in War and Psychology at King's College London, studying trauma therapy, CBT, resilience, and emotional recovery in young people." },
  { year: '2025', emoji: '💻', event: 'Conducted an independent study exploring whether AI and machine learning could be used as a screening tool for mental health issues in veterans post conflict.' },
  { year: '2026', emoji: '🏠', event: "Began working as a Children's Residential Support Worker, supporting young people from complex backgrounds with structure, safety, and stability." },
];

// Desktop positions: side + ml offset for organic staggered feel
const positions = [
  { side: 'left',  ml: 'ml-0',   mr: 'mr-0' },
  { side: 'right', ml: 'ml-0',   mr: 'mr-0' },
  { side: 'left',  ml: 'md:ml-10', mr: 'mr-0' },
  { side: 'right', ml: 'ml-0',   mr: 'md:mr-6' },
  { side: 'left',  ml: 'md:ml-6',  mr: 'mr-0' },
  { side: 'right', ml: 'ml-0',   mr: 'md:mr-10' },
  { side: 'left',  ml: 'md:ml-14', mr: 'mr-0' },
  { side: 'right', ml: 'ml-0',   mr: 'md:mr-4' },
];

function ConnectorCurve({ fromRight }) {
  return (
    <div className="relative h-10 md:h-12 lg:h-14 overflow-hidden -my-1">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={fromRight
            ? "M 270,2 C 200,2 150,25 100,48"
            : "M 30,2 C 100,2 150,25 200,48"
          }
          stroke="#E8A020"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4,5"
          opacity="0.35"
          strokeLinecap="round"
        />
        {/* Small dot at connection point */}
        <circle
          cx={fromRight ? 100 : 200}
          cy="48"
          r="2.5"
          fill="#E8A020"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

function EntryCard({ entry, pos, index, isLast }) {
  const isLeft = pos.side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className={`
        w-full md:w-[48%]
        ${isLeft ? 'md:self-start md:text-left' : 'md:self-end md:text-right'}
        ${pos.ml} ${pos.mr}
      `}
    >
      <div className="bg-white rounded-2xl border border-[#E8A020]/12 p-4 md:p-5 shadow-sm hover:shadow-md hover:shadow-[#E8A020]/06 transition-shadow duration-300">
        <div className={`flex items-center gap-3 mb-2 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-[#E8A020] rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm shadow-[#E8A020]/20">
            <span>{entry.emoji}</span>
          </div>
          <span className="font-fredoka text-[#E8A020] text-sm md:text-base font-700 tracking-wide">
            {entry.year}
          </span>
        </div>
        <p className={`font-nunito text-[#2D2520]/65 text-sm leading-relaxed ${!isLeft ? 'md:text-right' : ''}`}>
          {entry.event}
        </p>
      </div>
    </motion.div>
  );
}

export default function JourneyTimeline() {
  return (
    <section className="bg-[#F5F3EE] py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🗺️</span>
            <span className="font-nunito text-blue-700 text-sm font-700">The journey here</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Study and experience gained over the years
          </h2>
        </div>

        {/* Desktop: winding path backdrop */}
        <div className="hidden md:block absolute left-1/2 top-[18%] bottom-[8%] w-px pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom, #E8A020 0px, #E8A020 3px, transparent 3px, transparent 10px)',
          opacity: 0.15,
        }} />

        {/* Timeline entries */}
        <div className="relative flex flex-col gap-0">
          {timeline.map((entry, i) => (
            <div key={entry.year}>
              <EntryCard entry={entry} pos={positions[i]} index={i} />
              {i < timeline.length - 1 && (
                <ConnectorCurve fromRight={positions[i].side === 'right'} />
              )}
            </div>
          ))}
        </div>

        {/* Final Culmination — Today */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-8 md:mt-12"
        >
          {/* Convergence indicator */}
          <div className="flex justify-center mb-3 md:mb-5">
            <div className="flex flex-col items-center gap-1">
              {/* Arrow/chevron lines converging */}
              <svg width="48" height="24" viewBox="0 0 48 24" className="hidden md:block" aria-hidden="true">
                <path d="M 4,20 L 24,2 L 44,20" stroke="#E8A020" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                <path d="M 12,20 L 24,6 L 36,20" stroke="#E8A020" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
              </svg>
              <div className="w-1.5 h-10 md:h-14 bg-gradient-to-b from-[#E8A020]/30 to-[#E8A020] rounded-full" />
            </div>
          </div>

          {/* The destination card */}
          <div className="max-w-xl mx-auto">
            <div className="bg-gradient-to-br from-[#E8A020]/08 via-[#E8A020]/05 to-amber-50/50 border-2 border-[#E8A020]/30 rounded-3xl p-7 md:p-10 shadow-lg shadow-[#E8A020]/10 text-center relative overflow-hidden">
              {/* Subtle decorative corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#E8A020]/20 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#E8A020]/20 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#E8A020]/20 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#E8A020]/20 rounded-br-lg" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-[#E8A020] rounded-full px-5 py-2 mb-5 shadow-md shadow-[#E8A020]/25">
                  <span className="text-lg">♜</span>
                  <span className="font-fredoka text-white text-lg font-700 tracking-wide">Today</span>
                </div>
                <p className="font-fredoka text-[#2D2520] text-xl md:text-2xl leading-relaxed max-w-md mx-auto font-600">
                  Rook Foundations was born from a belief that chess and other games like it build positive life skills if they are rewarded and encouraged properly.
                </p>
                <div className="mt-6">
                  <div className="gold-line mx-auto" style={{ width: '64px', height: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}