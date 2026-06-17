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

const finalMilestone = {
  year: 'Today',
  emoji: '♜',
  event: 'Rook Foundations was born from a belief that chess and other games like it build positive life skills if they are rewarded and encouraged properly.',
};

// Each entry: position on desktop (col = 1..3), and side label alignment
// Pattern: zigzag across 3 columns — left, right, left, right...
const positions = [
  { col: 'left' },    // 2018
  { col: 'right' },   // 2019
  { col: 'left' },    // 2021
  { col: 'right' },   // 2022
  { col: 'left' },    // 2023
  { col: 'right' },   // 2024
  { col: 'left' },    // 2025
  { col: 'right' },   // 2026
];

function TimelineCard({ t, idx, col }) {
  const isLeft = col === 'left';
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: idx * 0.07 }}
      className={`relative flex items-start gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Card */}
      <div className={`bg-white border border-[#E8A020]/15 rounded-2xl p-5 shadow-sm flex-1 max-w-xs ${isLeft ? 'mr-2' : 'ml-2'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{t.emoji}</span>
          <span className="font-fredoka text-[#E8A020] font-600 text-base">{t.year}</span>
        </div>
        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{t.event}</p>
      </div>

      {/* Node connector dot */}
      <div className="flex-shrink-0 flex flex-col items-center mt-2">
        <div className="w-4 h-4 rounded-full bg-[#E8A020]/80 border-2 border-white shadow-md shadow-[#E8A020]/30 z-10" />
      </div>
    </motion.div>
  );
}

// ─── Desktop zigzag layout ────────────────────────────────────────────────────
function DesktopTimeline() {
  return (
    <div className="hidden lg:block relative">
      {/* Winding SVG road */}
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: '100%', zIndex: 0 }}
        preserveAspectRatio="none"
        viewBox="0 0 800 1400"
        aria-hidden="true"
      >
        {/* Dashed winding path */}
        <path
          d="M 200,40 C 200,120 600,120 600,240 C 600,360 200,360 200,480 C 200,600 600,600 600,720 C 600,840 200,840 200,960 C 200,1080 600,1080 600,1200 C 600,1280 400,1320 400,1380"
          fill="none"
          stroke="#E8A020"
          strokeWidth="3"
          strokeDasharray="10,8"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />
        {/* Glow overlay */}
        <path
          d="M 200,40 C 200,120 600,120 600,240 C 600,360 200,360 200,480 C 200,600 600,600 600,720 C 600,840 200,840 200,960 C 200,1080 600,1080 600,1200 C 600,1280 400,1320 400,1380"
          fill="none"
          stroke="#F4C261"
          strokeWidth="1.5"
          strokeOpacity="0.12"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 space-y-0">
        {timeline.map((t, i) => {
          const isLeft = positions[i].col === 'left';
          return (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`flex items-center gap-0 ${isLeft ? 'justify-start' : 'justify-end'}`}
              style={{ marginBottom: '2.5rem' }}
            >
              {isLeft ? (
                <>
                  {/* Card on left */}
                  <div className="w-5/12">
                    <div className="bg-white border-2 border-[#E8A020]/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#E8A020]/30 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{t.emoji}</span>
                        <span className="font-fredoka text-[#E8A020] font-600 text-base">{t.year}</span>
                      </div>
                      <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{t.event}</p>
                    </div>
                  </div>
                  {/* Connector line + dot */}
                  <div className="w-2/12 flex justify-center items-center">
                    <div className="h-0.5 w-full bg-[#E8A020]/20" />
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8A020] border-3 border-white shadow-lg shadow-[#E8A020]/30 -mx-2.5 z-10" />
                    <div className="h-0.5 w-full bg-[#E8A020]/20" />
                  </div>
                  {/* Empty right */}
                  <div className="w-5/12" />
                </>
              ) : (
                <>
                  {/* Empty left */}
                  <div className="w-5/12" />
                  {/* Connector line + dot */}
                  <div className="w-2/12 flex justify-center items-center">
                    <div className="h-0.5 w-full bg-[#E8A020]/20" />
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E8A020] border-3 border-white shadow-lg shadow-[#E8A020]/30 -mx-2.5 z-10" />
                    <div className="h-0.5 w-full bg-[#E8A020]/20" />
                  </div>
                  {/* Card on right */}
                  <div className="w-5/12">
                    <div className="bg-white border-2 border-[#E8A020]/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#E8A020]/30 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{t.emoji}</span>
                        <span className="font-fredoka text-[#E8A020] font-600 text-base">{t.year}</span>
                      </div>
                      <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{t.event}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Convergence funnel lines */}
      <div className="relative flex justify-center mt-2 mb-2 z-10">
        <div className="flex items-end gap-0 w-full justify-center">
          <div className="h-10 w-px bg-gradient-to-b from-[#E8A020]/30 to-[#E8A020]/70 mx-1" style={{ marginRight: '4rem' }} />
          <div className="h-16 w-px bg-gradient-to-b from-[#E8A020]/10 to-[#E8A020]/60" />
          <div className="h-10 w-px bg-gradient-to-b from-[#E8A020]/30 to-[#E8A020]/70 mx-1" style={{ marginLeft: '4rem' }} />
        </div>
      </div>

      {/* Today — Final milestone */}
      <FinalMilestone />
    </div>
  );
}

// ─── Mobile / tablet layout ───────────────────────────────────────────────────
function MobileTimeline() {
  return (
    <div className="lg:hidden relative">
      {/* Vertical road line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8A020]/15 via-[#E8A020]/40 to-[#E8A020]/80 rounded-full" />

      <div className="space-y-6 relative z-10">
        {timeline.map((t, i) => (
          <motion.div
            key={t.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex items-start gap-4 pl-2"
          >
            {/* Node */}
            <div className="flex-shrink-0 mt-3">
              <div className="w-5 h-5 rounded-full bg-[#E8A020] border-2 border-white shadow-md shadow-[#E8A020]/30 z-10" />
            </div>
            {/* Card */}
            <div className="bg-white border border-[#E8A020]/15 rounded-2xl p-4 flex-1 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{t.emoji}</span>
                <span className="font-fredoka text-[#E8A020] font-600 text-sm">{t.year}</span>
              </div>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{t.event}</p>
            </div>
          </motion.div>
        ))}

        {/* Converging arrow on mobile */}
        <div className="flex items-center justify-center pl-2 py-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-8 bg-gradient-to-b from-[#E8A020]/40 to-[#E8A020]" />
            <div className="text-[#E8A020] text-lg">▼</div>
          </div>
        </div>

        {/* Today mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="pl-2"
        >
          <div className="relative bg-[#E8A020] rounded-3xl p-6 shadow-xl shadow-[#E8A020]/30 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-4 text-white text-6xl font-fredoka">♜</div>
              <div className="absolute bottom-2 left-2 text-white text-4xl font-fredoka">♜</div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
                <span className="text-white font-fredoka font-700 text-sm">Today</span>
              </div>
              <div className="text-4xl mb-3">♜</div>
              <p className="font-nunito text-white font-700 text-base leading-relaxed">
                {finalMilestone.event}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Final "Today" milestone ──────────────────────────────────────────────────
function FinalMilestone() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 mx-auto max-w-2xl"
    >
      {/* Glow halo */}
      <div className="absolute -inset-4 bg-[#E8A020]/10 rounded-[2.5rem] blur-xl" />

      <div className="relative bg-gradient-to-br from-[#E8A020] to-[#d4920a] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#E8A020]/35 overflow-hidden border-2 border-[#F4C261]/40">
        {/* Background chess pieces */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none select-none">
          <span className="absolute top-3 right-5 text-white text-7xl font-fredoka">♜</span>
          <span className="absolute bottom-4 left-4 text-white text-5xl font-fredoka">♛</span>
          <span className="absolute top-1/2 right-1/4 text-white text-3xl font-fredoka">♞</span>
        </div>

        <div className="relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white font-nunito font-800 text-sm tracking-wide uppercase">The destination</span>
          </div>

          {/* King piece */}
          <div className="text-6xl mb-4 drop-shadow-lg">♜</div>

          {/* Year */}
          <div className="font-fredoka text-white/80 text-2xl font-600 mb-3">Today</div>

          {/* Main text */}
          <p className="font-nunito text-white font-700 text-xl sm:text-2xl leading-relaxed max-w-lg mx-auto">
            {finalMilestone.event}
          </p>

          {/* Decorative underline */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-white/40 rounded-full" />
            <span className="text-white/60 text-xl">✦</span>
            <div className="h-px w-12 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function JourneyTimeline() {
  return (
    <section className="bg-[#F5F3EE] py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🗺️</span>
            <span className="font-nunito text-blue-700 text-sm font-700">The journey here</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Study and experience gained over the years
          </h2>
        </div>

        <DesktopTimeline />
        <MobileTimeline />
      </div>
    </section>
  );
}