import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const references = [
  {
    citation: 'Education Endowment Foundation. (2018). Chess in primary schools.',
    url: 'https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/chess-in-primary-schools',
  },
  {
    citation: 'Fuentes, J. L., López Gómez, E., Moreno Murcia, J. A., & Cachón Zagalaz, J. (2018). Benefits of chess for the intellectual and social-emotional enrichment in schoolchildren. The Spanish Journal of Psychology, 21, E20.',
    url: 'https://www.cambridge.org/core/journals/spanish-journal-of-psychology/article/abs/benefits-of-chess-for-the-intellectual-and-socialemotional-enrichment-in-schoolchildren/9BAE7D7E2A9D7587C0259F7E964E5CF9',
  },
  {
    citation: 'Sala, G., & Gobet, F. (2017). Does far transfer exist? Negative evidence from chess, music, and working memory training. PLOS ONE, 12(5), e0177257.',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0177257',
  },
  {
    citation: 'Trinchero, R., & Sala, G. (2016). Chess training and mathematical problem-solving: The role of teaching implementation and engagement. ERIC.',
    url: 'https://files.eric.ed.gov/fulltext/ED581100.pdf',
  },
  {
    citation: 'Zhang, Y., et al. (2025). Chess and the development of logical reasoning and patience in children. Frontiers in Psychology, 16.',
    url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1592247/full',
  },
];

const paragraphs = [
  {
    text: 'Current research has not consistently demonstrated that chess directly improves cognitive or academic performance across all domains. While some studies suggest that transferring chess-based skills into broader academic or intellectual abilities is possible, the evidence indicates that this transfer is complex and not guaranteed (Sala & Gobet, 2017).',
  },
  {
    text: 'However, research has shown that chess can positively influence important developmental skills in children, including memory, concentration, patience, logical reasoning, and emotional regulation. A large-scale study conducted across more than 300 schools highlighted that successful implementation depends heavily on active engagement from both tutors and classroom teachers. The findings suggested that chess programmes were less effective when teachers were minimally involved or only present at the beginning and end of sessions (Education Endowment Foundation, 2018; Trinchero & Sala, 2016).',
  },
  {
    text: 'Beyond academic outcomes, chess also provides opportunities for social and emotional development. Through the game, children learn to respect opponents, follow rules, think critically under pressure, and manage emotions associated with both winning and losing. These emotional and interpersonal skills are considered important components of personal growth and development (Fuentes et al., 2018).',
  },
  {
    text: 'At Rook Foundations, we recognise the current limitations within the research and do not claim that chess alone guarantees academic success. Instead, our belief is that the skills developed through structured gameplay — such as focus, reasoning, patience, discipline, and decision-making — can potentially support broader learning experiences and encourage positive habits that extend into other areas of life.',
  },
];

export default function Benefits() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(212,168,67,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Research</span>
          <h1 className="font-oswald text-white uppercase mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Why Chess?
          </h1>
          <p className="font-lato text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            An honest look at what the research says — and what we genuinely believe chess offers every child.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="space-y-8">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="font-lato text-white/65 text-lg leading-relaxed"
              >
                {p.text}
              </motion.p>
            ))}
          </div>

          {/* References */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 border-t border-[#D4A843]/15 pt-10"
          >
            <h2 className="font-oswald text-white text-xl uppercase tracking-wide mb-6">References</h2>
            <ul className="space-y-5">
              {references.map((ref, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-lato text-[#D4A843]/40 text-xs mt-1 flex-shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                  <div>
                    <p className="font-lato text-white/40 text-sm leading-relaxed">{ref.citation}</p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-lato text-[#D4A843]/60 text-xs hover:text-[#D4A843] transition-colors mt-1 break-all"
                    >
                      <ExternalLink size={11} /> {ref.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0D0D0D] py-20 border-t border-[#D4A843]/10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-oswald text-white uppercase mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em' }}>
            See it for yourself.
          </h2>
          <p className="font-lato text-white/50 text-lg mb-8">
            Get 50% off your child's first lesson and experience the Rook Foundations difference first-hand.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all"
          >
            CLAIM 50% OFF FIRST LESSON <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}