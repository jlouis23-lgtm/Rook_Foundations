import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, X } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const milestones = [
  { year: '2018', title: 'Academic Tutoring', body: 'Tutoring GCSE students in Maths, Science and English.' },
  { year: '2019', title: 'Youth Camp Officer', body: "Working as a Youth Officer at a children's camp, designing age-specific activities for primary school children." },
  { year: '2021', title: 'BSc Psychology', body: 'BSc in Psychology at the University of Manchester, focusing on developmental psychology, cognitive development and how children build resilience through supportive environments.' },
  { year: '2022', title: 'Peer Mentoring', body: 'Volunteering with Midlands charity ReachOut as a Peer Mentor, helping children from disadvantaged backgrounds build academic confidence, communication skills and self-belief.' },
  { year: '2023', title: 'Mental Health Research', body: "Conducting research with parents experiencing mental illness, exploring how stigma affects parenting and children's emotional wellbeing." },
  { year: '2024', title: 'MSc War & Psychiatry', body: "MSc in War and Psychiatry at King's College London, studying trauma therapy, CBT, resilience and human response to conflict." },
  { year: '2025', title: 'AI & PTSD Research', body: 'Conducting independent research exploring whether AI and machine learning could be used as a screening tool for post-traumatic stress in the UK Armed Forces.' },
  { year: '2026', title: 'Residential Support Worker', body: "Working as a Children's Residential Support Worker, supporting young people from complex backgrounds with structure, safety and stability." },
];

const finalMilestone = {
  year: 'Today',
  title: 'Rook Foundations',
  body: 'Rook Foundations was born from a belief that chess and other strategy games can build lifelong thinking skills, resilience and confidence when children are guided, challenged and encouraged in the right environment.',
};

// Illustrative coordinates in percentage space — hand-placed, not a computed
// function. Y is ordinal by entry order (this is a story axis, not a literal
// calendar scale): 2018 sits low, "today" sits at the very top. X advances
// every step, with slightly longer strides later on, so the climb visibly
// steepens as each experience compounds on the last.
const points = [
  { x: 8, y: 93 },
  { x: 16, y: 82 },
  { x: 24, y: 71 },
  { x: 33, y: 60 },
  { x: 42, y: 49 },
  { x: 54, y: 38 },
  { x: 66, y: 26 },
  { x: 79, y: 14 },
  { x: 92, y: 3 }, // Rook Foundations
];

function buildPath(pts) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
}

const pathD = buildPath(points);
const allEntries = [...milestones, finalMilestone];
const finalIndex = milestones.length;

export default function JourneyTimeline() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const wrapperRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (active === null) return;
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setActive(null);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setActive(null);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [active]);

  const toggle = (i) => setActive((cur) => (cur === i ? null : i));
  const activeEntry = active !== null ? allEntries[active] : null;
  const isFinalActive = active === finalIndex;

  return (
    <section className="bg-[#F5F3EE] py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <TrendingUp size={14} /> The journey here
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Study and experience gained over the years
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Curious about the journey behind Rook Foundations? Explore the experiences that have shaped my approach and led me to create it.
          </p>
        </div>

        <div ref={wrapperRef}>
          {/* Graph */}
          <div className="flex">
            {/* Y-axis — Year */}
            <div className="relative w-12 sm:w-16 flex-shrink-0 h-[440px] sm:h-[520px] lg:h-[620px]">
              <span className="absolute -top-7 left-0 font-nunito text-[#2D2520]/35 text-[10px] font-800 uppercase tracking-widest">
                Year
              </span>
              <div className="absolute top-0 bottom-0 right-2 w-px bg-[#2D2520]/10" />
              {allEntries.map((entry, i) => (
                <div
                  key={entry.year}
                  className="absolute right-2.5 -translate-y-1/2 flex items-center gap-1.5"
                  style={{ top: `${points[i].y}%` }}
                >
                  <div className="w-2 h-px bg-[#2D2520]/20 flex-shrink-0" />
                  {i === finalIndex ? (
                    <span className="text-[#E8A020] text-sm leading-none">♜</span>
                  ) : (
                    <span className="font-nunito text-[#2D2520]/45 text-[10px] sm:text-xs font-700 whitespace-nowrap">
                      {entry.year}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Graph area */}
            <div className="relative flex-1 h-[440px] sm:h-[520px] lg:h-[620px]">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#2D2520"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </svg>

              {/* Milestone nodes */}
              {milestones.map((m, i) => {
                const isActive = active === i;
                const isHovered = hovered === i;
                return (
                  <motion.button
                    key={m.year}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    aria-label={`${m.year}: ${m.title}`}
                    onClick={() => toggle(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                    whileTap={{ scale: 0.85 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center focus-visible:outline-none"
                    style={{ left: `${points[i].x}%`, top: `${points[i].y}%` }}
                  >
                    {(isActive || isHovered) && (
                      <span className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#E8A020]/25 blur-md" aria-hidden="true" />
                    )}
                    <motion.span
                      animate={{ scale: isActive || isHovered ? 1.35 : 1 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="relative"
                    >
                      <X
                        size={16}
                        strokeWidth={3}
                        className={`transition-colors duration-300 ${isActive ? 'text-[#2D2520]' : 'text-[#E8A020]'}`}
                      />
                    </motion.span>
                  </motion.button>
                );
              })}

              {/* Rook Foundations — the destination */}
              <motion.button
                type="button"
                aria-expanded={isFinalActive}
                aria-controls={panelId}
                aria-label="Rook Foundations — the destination"
                onClick={() => toggle(finalIndex)}
                onMouseEnter={() => setHovered(finalIndex)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(finalIndex)}
                onBlur={() => setHovered(null)}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: finalIndex * 0.06, ease: EASE }}
                whileTap={{ scale: 0.9 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center focus-visible:outline-none"
                style={{ left: `${points[finalIndex].x}%`, top: `${points[finalIndex].y}%` }}
              >
                <motion.span
                  className="absolute inset-0 m-auto rounded-full bg-[#E8A020]/40 blur-lg pointer-events-none"
                  style={{ width: 44, height: 44 }}
                  animate={{ opacity: [0.4, 0.75, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  animate={{ scale: isFinalActive || hovered === finalIndex ? 1.1 : 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg shadow-[#E8A020]/40 border-2 border-white"
                  style={{ background: 'linear-gradient(180deg, #F4C261 0%, #E8A020 55%, #c98a12 100%)' }}
                >
                  <span className="text-white text-xl leading-none">♜</span>
                </motion.span>
              </motion.button>
            </div>
          </div>

          {/* X-axis title */}
          <div className="flex justify-end mt-4 pr-1">
            <span className="font-nunito text-[#E8A020] text-xs sm:text-sm font-800 uppercase tracking-widest">
              Professional Growth →
            </span>
          </div>

          {/* Info panel — single shared panel, appears below the graph rather than over it */}
          <div id={panelId} className="max-w-xl mx-auto mt-8 min-h-[3rem]">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className={`relative rounded-2xl px-6 py-5 shadow-md border-l-4 ${
                    isFinalActive ? 'bg-[#2D2520] border-[#F4C261]' : 'bg-white border-[#E8A020]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    aria-label="Close"
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isFinalActive ? 'text-white/40 hover:text-white' : 'text-[#2D2520]/30 hover:text-[#2D2520]'
                    }`}
                  >
                    <X size={15} />
                  </button>
                  <div className="flex items-center gap-2 mb-2 pr-6">
                    <span className={`font-fredoka font-600 text-sm ${isFinalActive ? 'text-[#F4C261]' : 'text-[#E8A020]'}`}>
                      {activeEntry.year}
                    </span>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isFinalActive ? 'bg-white/30' : 'bg-[#2D2520]/20'}`} />
                    <h4 className={`font-fredoka text-base ${isFinalActive ? 'text-white' : 'text-[#2D2520]'}`}>
                      {activeEntry.title}
                    </h4>
                  </div>
                  <p className={`font-nunito text-sm leading-relaxed ${isFinalActive ? 'text-white/80' : 'text-[#2D2520]/65'}`}>
                    {activeEntry.body}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-nunito text-[#2D2520]/40 text-sm text-center italic"
                >
                  Tap a point on the graph to explore that year.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
