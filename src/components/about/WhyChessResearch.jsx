import { motion } from 'framer-motion';

const bubbles = [
  {
    icon: '🧠',
    color: 'from-[#d8f0e6] to-[#c8eada]',
    border: 'border-[#4a8c6e]/35',
    accent: '#2d8c62',
    label: 'Focus & Concentration',
    body: 'Chess trains children to slow down, sustain attention, and think before acting. These skills can extend beyond the board.',
    citation: '(Zhang et al., 2025)',
  },
  {
    icon: '♟',
    color: 'from-[#ddeaf7] to-[#cce0f5]',
    border: 'border-[#3a5c8c]/35',
    accent: '#4a7eb8',
    label: 'Decision-Making & Reasoning',
    body: 'Every move requires planning ahead, weighing consequences, and adapting when things change. This helps children become logical, independent thinkers.',
    citation: '(Sala & Gobet, 2016)',
  },
  {
    icon: '🤝',
    color: 'from-[#faefd5] to-[#f5e4b8]',
    border: 'border-[#D4A843]/35',
    accent: '#b8902e',
    label: 'Emotional & Social Growth',
    body: 'Children learn to respect opponents, follow rules, manage the emotions of winning and losing, and think under pressure.',
    citation: '(Fuentes et al., 2018)',
  },
  {
    icon: '👩‍🏫',
    color: 'from-[#ece0f5] to-[#e2d0f0]',
    border: 'border-[#6a4a8c]/35',
    accent: '#7a48c0',
    label: 'The Role of Teaching Quality',
    body: 'A large-scale study across 300+ schools found that chess has limited improvements in problem solving when instructors are not actively engaged throughout every session.',
    citation: '(EEF, 2018; Trinchero & Sala, 2016)',
  },
];

const references = [
  { citation: 'Education Endowment Foundation. (2018). Chess in primary schools.', url: 'https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/chess-in-primary-schools' },
  { citation: 'Fuentes, J. L., et al. (2018). Benefits of chess for the intellectual and social-emotional enrichment in schoolchildren. The Spanish Journal of Psychology, 21, E20.', url: 'https://www.cambridge.org/core/journals/spanish-journal-of-psychology/article/abs/benefits-of-chess-for-the-intellectual-and-socialemotional-enrichment-in-schoolchildren/9BAE7D7E2A9D7587C0259F7E964E5CF9' },
  { citation: 'Sala, G., & Gobet, F. (2016). Do the benefits of chess instruction transfer to academic and cognitive skills? A meta-analysis. Educational research review, 18, 46–57.', url: null },
  { citation: 'Sala, G., & Gobet, F. (2017). Does far transfer exist? Negative evidence from chess, music, and working memory training. PLOS ONE, 12(5), e0177257.', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0177257' },
  { citation: 'Trinchero, R., & Sala, G. (2016). Chess training and mathematical problem-solving: The role of teaching implementation and engagement. ERIC.', url: 'https://files.eric.ed.gov/fulltext/ED581100.pdf' },
  { citation: 'Zhang, Y., et al. (2025). Chess and the development of logical reasoning and patience in children. Frontiers in Psychology, 16.', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1592247/full' },
];

function Connector() {
  return (
    <div className="flex flex-col items-center py-1 hidden md:flex">
      <div className="w-px h-6 bg-gradient-to-b from-[#D4A843]/30 to-[#D4A843]/10" />
      <div className="w-2 h-2 rounded-full bg-[#D4A843]/30" />
      <div className="w-px h-6 bg-gradient-to-b from-[#D4A843]/10 to-[#D4A843]/30" />
    </div>
  );
}

function MobileConnector() {
  return (
    <div className="flex flex-col items-center py-1 md:hidden">
      <div className="w-px h-5 bg-gradient-to-b from-[#D4A843]/30 to-[#D4A843]/10" />
      <div className="w-2 h-2 rounded-full bg-[#D4A843]/30" />
      <div className="w-px h-5 bg-gradient-to-b from-[#D4A843]/10 to-[#D4A843]/30" />
    </div>
  );
}

export default function WhyChessResearch() {
  return (
    <section className="py-24 border-t border-[#D4A843]/10" style={{ backgroundColor: '#EEEAE0' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Research</span>
          <h2 className="font-oswald text-[#1C1C1E] uppercase" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
            Why Chess?
          </h2>
          <p className="font-lato text-[#2D2B26]/55 text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Research shows chess supports meaningful development and we provide a structured thinking environment designed to build lifelong habits.
          </p>
        </div>

        {/* Bubble Network */}
        <div className="flex flex-col items-center">
          {bubbles.map((bubble, i) => (
            <div key={i} className="w-full flex flex-col items-center">
              {/* Stagger left/right on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className={`w-full md:w-[88%] ${i % 2 === 0 ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'}`}
              >
                <div
                  className={`relative rounded-2xl border ${bubble.border} bg-gradient-to-br ${bubble.color} p-6 backdrop-blur-sm
                    hover:scale-[1.015] transition-transform duration-300 cursor-default
                    shadow-lg hover:shadow-xl`}
                  style={{ boxShadow: `0 4px 32px 0 ${bubble.accent}12` }}
                >
                  {/* Icon + Label row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl leading-none">{bubble.icon}</span>
                    <h3 className="font-oswald text-[#1C1C1E] text-lg uppercase tracking-wide leading-tight">
                      {bubble.label}
                    </h3>
                  </div>
                  {/* Body */}
                  <p className="font-lato text-[#2D2B26]/70 text-sm leading-relaxed mb-3">
                    {bubble.body}
                  </p>
                  {/* Citation */}
                  <span
                    className="font-lato text-xs italic"
                    style={{ color: `${bubble.accent}99` }}
                  >
                    {bubble.citation}
                  </span>
                  {/* Accent dot */}
                  <div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-50"
                    style={{ backgroundColor: bubble.accent }}
                  />
                </div>
              </motion.div>

              {/* Connector between bubbles */}
              {i < bubbles.length - 1 && (
                <>
                  <Connector />
                  <MobileConnector />
                </>
              )}
            </div>
          ))}

          {/* Final connector down to mission card */}
          <Connector />
          <MobileConnector />

          {/* Mission / Rook Foundations card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.65 }}
            className="w-full"
          >
            <div
              className="relative rounded-2xl border border-[#D4A843]/40 p-8 md:p-10 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fdf6e3 0%, #faf0d0 50%, #F5F3EE 100%)',
                boxShadow: '0 0 60px 0 rgba(212,168,67,0.12), 0 4px 32px 0 rgba(212,168,67,0.08)',
              }}
            >
              {/* Glow blob */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl text-[#D4A843]">♜</span>
                  <div>
                    <span className="font-oswald text-[#D4A843] text-xs tracking-widest uppercase block">Our Mission</span>
                    <h3 className="font-oswald text-[#1C1C1E] text-xl md:text-2xl uppercase tracking-wide leading-tight">
                      The Rook Foundations Approach
                    </h3>
                  </div>
                </div>

                <div className="w-12 h-px bg-[#D4A843]/40 mb-5" />

                <p className="font-lato text-[#2D2B26]/75 text-base md:text-lg leading-relaxed mb-4">
                  We recognise the limitations of chess as a transferrable skill into other areas of life and do not claim that chess alone guarantees academic and financial success later in life.
                </p>
                <p className="font-lato text-[#2D2B26]/65 text-base leading-relaxed">
                  Instead, our aim is to create an engaging thinking environment where children develop <span className="text-[#D4A843]/90 font-semibold">focus, reasoning, patience, and discipline</span>. It is our goal that, overtime, the principles they learn with us will help support broader learning experiences and extend positively into other areas of life.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/25 rounded-full px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                  <span className="font-oswald text-[#D4A843] text-xs tracking-widest uppercase">
                    Research-informed · Parent-friendly · Child-centred
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* References */}
        <div className="mt-16 border-t border-[#D4A843]/10 pt-10">
          <h3 className="font-oswald text-[#2D2B26]/45 text-sm uppercase tracking-widest mb-6">References</h3>
          <ul className="space-y-4">
            {references.map((ref, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="font-oswald text-[#D4A843]/50 text-xs mt-0.5 flex-shrink-0 w-5 text-right">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <div>
                  <p className="font-lato text-[#2D2B26]/40 text-sm leading-relaxed">{ref.citation}</p>
                  {ref.url && (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer"
                      className="font-lato text-[#D4A843]/40 text-xs hover:text-[#D4A843]/70 transition-colors mt-1 inline-block break-all">
                      {ref.url}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}