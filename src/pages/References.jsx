import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const sections = [
  {
    topic: "Chess, Focus & Child Development",
    emoji: "🔬",
    color: "bg-amber-50 border-amber-200",
    accent: "#b8790a",
    tag: "bg-amber-100 text-amber-700",
    refs: [
      {
        citation: "Zhang, Y., et al. (2025). Chess and the development of logical reasoning and patience in children. Frontiers in Psychology, 16.",
        detail: "This research suggests that chess may help children practise sustained attention, careful decision-making, and patience — skills that can extend beyond the board.",
        url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1592247/full",
      },
      {
        citation: "Sala, G., & Gobet, F. (2016). Do the benefits of chess instruction transfer to academic and cognitive skills? A meta-analysis. Educational research review, 18, 46–57.",
        detail: "This study explored whether chess instruction can strengthen planning, reasoning, and problem-solving skills, and how those skills might transfer to other areas of learning.",
      },
      {
        citation: "Fuentes, J. L., et al. (2018). Benefits of chess for the intellectual and social-emotional enrichment in schoolchildren. The Spanish Journal of Psychology, 21, E20.",
        detail: "Research examining how chess supports emotional and social development in children — including respect for others, managing wins and losses, and thinking under pressure.",
        url: "https://www.cambridge.org/core/journals/spanish-journal-of-psychology/article/abs/benefits-of-chess-for-the-intellectual-and-socialemotional-enrichment-in-schoolchildren/9BAE7D7E2A9D7587C0259F7E964E5CF9",
      },
      {
        citation: "Education Endowment Foundation. (2018). Chess in primary schools.",
        detail: "A large-scale study across 300+ schools which found that the quality of teaching involvement during chess sessions significantly affects whether children gain developmental benefits.",
        url: "https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/chess-in-primary-schools",
      },
      {
        citation: "Trinchero, R., & Sala, G. (2016). Chess training and mathematical problem-solving: The role of teaching implementation and engagement. ERIC.",
        detail: "This study highlights the critical role of how chess is taught — finding that active instructor engagement throughout sessions is key to children developing transferable thinking skills.",
        url: "https://files.eric.ed.gov/fulltext/ED581100.pdf",
      },
    ],
  },
  {
    topic: "Chess and Learning Difficulties",
    emoji: "📚",
    color: "bg-blue-50 border-blue-200",
    accent: "#4a7eb8",
    tag: "bg-blue-100 text-blue-700",
    refs: [
      {
        citation: "Scholtz, S., Mundt, A., Lüders, A., & Rüter, A. (2008).",
        detail: "Chess and cognitive development. A study examining chess as a visual and cognitive tool for children with learning difficulties, supporting structured thinking and problem-solving skills.",
      },
      {
        citation: "Davis, A., Fletcher-Flinn, C., & Rounce, K. (2004).",
        detail: "Cognitive demands in chess: Memory, concentration, and communication as key requirements for chess participation, with implications for children with learning differences.",
      },
      {
        citation: "Deci, E. L., & Ryan, R. M. (2012).",
        detail: "Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. The relationship between motivation, engagement, and the development of concentration and persistence in learning environments.",
      },
    ],
  },
  {
    topic: "Chess and Children with Autism",
    emoji: "🧩",
    color: "bg-purple-50 border-purple-200",
    accent: "#7a48c0",
    tag: "bg-purple-100 text-purple-700",
    refs: [
      {
        citation: "National Autistic Society.",
        detail: "Guidance on structured and predictable learning environments for autistic children, highlighting the benefit of consistent rules and clear patterns in educational settings.",
        url: "https://www.autism.org.uk",
      },
      {
        citation: "Ambrose, L., Mottron, L., & Dawson, M. (2021).",
        detail: "Educational and social challenges for autistic children in classroom and social settings, including the impact of anxiety on confidence and educational opportunity.",
      },
      {
        citation: "Konstantinidis, E. I., Luneski, A., Frantzidis, C. A., Milonas, I., Ceravolo, M. G., & Bamidis, P. D. (2009).",
        detail: "Computer-assisted instruction for children with autism: Reducing social pressure, sensory overload, and providing clearer visual learning cues through technology-supported environments.",
      },
    ],
  },
  {
    topic: "Chess and Children with ADHD",
    emoji: "⚡",
    color: "bg-amber-50 border-amber-200",
    accent: "#b8790a",
    tag: "bg-amber-100 text-amber-700",
    refs: [
      {
        citation: "Agarwal, R. (2023).",
        detail: "Chess-based interventions and ADHD symptom reduction: Evidence for improvements in planning ability, working memory, and impulse control in children with ADHD following structured chess instruction.",
      },
      {
        citation: "Yakushina, A., et al. (2025).",
        detail: "Recent findings on chess as a cognitive training tool for children with attention difficulties, including measurable improvements in executive function and self-regulation.",
      },
    ],
  },
  {
    topic: "Chess, Girls, and Gender Inclusivity",
    emoji: "♛",
    color: "bg-pink-50 border-pink-200",
    accent: "#b84880",
    tag: "bg-pink-100 text-pink-700",
    refs: [
      {
        citation: "Polgár, J. (career record, 1984–2014).",
        detail: "Judit Polgár's documented competitive record as the strongest female chess player in history, defeating multiple world champions including Garry Kasparov, challenging longstanding assumptions about gender and chess ability.",
      },
      {
        citation: "Chess in Schools and Communities / UK Chess Federation.",
        detail: "Reports on gender inclusivity initiatives in chess education, and evidence that girls benefit equally from structured chess instruction in terms of confidence, resilience, and academic skills.",
      },
    ],
  },
  {
    topic: "Motivation, Engagement, and Learning",
    emoji: "🌱",
    color: "bg-green-50 border-green-200",
    accent: "#2d8c62",
    tag: "bg-green-100 text-green-700",
    refs: [
      {
        citation: "Deci, E. L., & Ryan, R. M. (2000).",
        detail: "The 'what' and 'why' of goal pursuits: Human needs and the self-determination of behaviour. A foundational framework for understanding how intrinsic motivation supports deeper learning, persistence, and long-term engagement in children.",
      },
      {
        citation: "Vygotsky, L. S. (1978).",
        detail: "Mind in Society: The Development of Higher Psychological Processes. The theoretical basis for gradual, supported learning — working within a child's zone of proximal development to build confidence and capability incrementally.",
      },
    ],
  },
];

export default function References() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="references" />

        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-5">
            <BookOpen size={14} className="text-amber-700" />
            <span className="font-nunito text-amber-700 text-sm font-700">Research & evidence</span>
          </div>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            The research behind our approach
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl">
            We believe families deserve to know what informs our teaching. Below you will find the research, studies, and expert guidance that shape the answers in our FAQ section — organised by topic so they are easy to explore.
          </p>
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl px-6 py-4 inline-block">
            <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
              <span className="font-700 text-[#b8790a]">Please note:</span> Some references are cited to acknowledge the source of an idea or finding. Where a URL is not provided, the work can typically be found through academic databases such as Google Scholar, JSTOR, or your local library.
            </p>
          </div>
        </div>
      </section>

      {/* Reference sections */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="space-y-8">
          {sections.map((section, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: si * 0.08 }}
              className={`${section.color} border-2 rounded-3xl overflow-hidden`}
            >
              {/* Section header */}
              <div className="px-7 py-5 border-b-2 border-current/10 flex items-center gap-3"
                style={{ borderBottomColor: `${section.accent}18` }}>
                <span className="text-2xl">{section.emoji}</span>
                <div>
                  <span className={`inline-block ${section.tag} rounded-full px-3 py-0.5 text-xs font-nunito font-700 mb-1`}>Research topic</span>
                  <h2 className="font-fredoka text-xl" style={{ color: section.accent }}>{section.topic}</h2>
                </div>
              </div>

              {/* References */}
              <div className="px-7 py-5 space-y-5">
                {section.refs.map((ref, ri) => (
                  <div key={ri} className="flex gap-4">
                    <div className="w-1.5 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${section.accent}40`, minHeight: '2rem' }} />
                    <div>
                      <p className="font-nunito text-[#2D2520] text-sm font-700 leading-snug mb-1">
                        {ref.citation}
                      </p>
                      <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
                        {ref.detail}
                      </p>
                      {ref.url && (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 font-nunito text-xs font-700 hover:underline transition-colors"
                          style={{ color: section.accent }}>
                          Visit website →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="font-nunito text-[#2D2520]/45 text-sm font-600 mb-5">
            Have a question about any of these sources, or want to learn more?
          </p>
          <Link
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-base px-8 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}