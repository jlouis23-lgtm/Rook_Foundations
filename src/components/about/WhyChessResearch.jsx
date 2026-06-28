import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const bubbles = [
  {
    emoji: '🧠',
    color: 'bg-green-50 border-green-200',
    accent: '#2d8c62',
    label: 'Focus & Concentration',
    body: 'Chess trains children to slow down, sustain attention, and think before acting. These skills can extend beyond the board.',
    citation: '(Zhang et al., 2025)',
  },
  {
    emoji: '♟',
    color: 'bg-blue-50 border-blue-200',
    accent: '#4a7eb8',
    label: 'Decision-Making & Reasoning',
    body: 'Every move requires planning ahead, weighing consequences, and adapting when things change — helping children become logical, independent thinkers.',
    citation: '(Sala & Gobet, 2016)',
  },
  {
    emoji: '🤝',
    color: 'bg-amber-50 border-amber-200',
    accent: '#b8790a',
    label: 'Emotional & Social Growth',
    body: 'Children learn to respect opponents, follow rules, manage the emotions of winning and losing, and think under pressure.',
    citation: '(Fuentes et al., 2018)',
  },
  {
    emoji: '👩‍🏫',
    color: 'bg-purple-50 border-purple-200',
    accent: '#7a48c0',
    label: 'The Role of Teaching Quality',
    body: 'A large-scale study across 300+ schools found that chess has limited impact when instructors are not actively engaged throughout every session.',
    citation: '(EEF, 2018; Trinchero & Sala, 2016)',
  },
];



export default function WhyChessResearch() {
  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="whychess" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🔬</span>
            <span className="font-nunito text-green-700 text-sm font-700">Backed by research</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            How can strategy games benefit my child?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Chess provides a powerful example of how strategic games can help children develop important skills both inside and outside the classroom.
          </p>
        </div>

        {/* Bubble Network */}
        <div className="flex flex-col gap-4 mb-8">
          {bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={`play-card ${bubble.color} border-2 rounded-3xl p-6 ${i % 2 === 0 ? 'lg:mr-16' : 'lg:ml-16'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl leading-none">{bubble.emoji}</span>
                <h3 className="font-fredoka text-xl" style={{ color: bubble.accent }}>{bubble.label}</h3>
              </div>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-2">{bubble.body}</p>
              <span className="font-nunito text-xs italic" style={{ color: `${bubble.accent}99` }}>{bubble.citation}</span>
            </motion.div>
          ))}
        </div>

        {/* How We Teach — expanded mission section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.65 }}
          className="mb-12"
        >
          {/* Section header */}
          <div className="bg-[#2D2520] rounded-3xl px-8 py-8 mb-6 relative overflow-hidden">
            <div className="absolute right-6 bottom-3 text-white/5 font-fredoka select-none pointer-events-none" style={{ fontSize: '6rem', lineHeight: 1 }} aria-hidden="true">♜</div>

            {/* Disclaimer indicator — inset from right, not at the very corner */}
            <div className="absolute top-6 right-16 flex flex-col items-center gap-0.5 z-20">
              <svg width="44" height="40" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.134 2.5C13.5188 1.833 14.4812 1.833 14.866 2.5L26.1244 22C26.5092 22.667 26.028 23.5 25.2583 23.5H2.74167C1.97202 23.5 1.49076 22.667 1.87565 22L13.134 2.5Z" fill="#E8A020" fillOpacity="0.22" stroke="#E8A020" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round"/>
                <text x="14" y="18" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="11" fontWeight="600" fill="#F4C261">!</text>
              </svg>
              <span className="font-nunito text-[#E8A020]/75 text-sm font-700 tracking-wide uppercase">Disclaimer</span>
              <svg width="18" height="48" viewBox="0 0 18 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 2 L9 38" stroke="#E8A020" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3"/>
                <path d="M4 34 L9 40 L14 34" stroke="#E8A020" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>

            <span className="font-nunito text-[#E8A020] text-xs font-700 uppercase tracking-widest block mb-2">Our Mission</span>
            <h3 className="font-fredoka text-white text-3xl mb-4 relative z-10">How We Teach</h3>
            <div className="w-10 h-1 bg-[#E8A020] rounded-full mb-5" />
            <p className="font-nunito text-white/75 text-base leading-relaxed mb-3 relative z-10 pr-10 sm:pr-16">
              We recognise the limitations of transferring skills from strategy games into other domains and do NOT claim that these games alone guarantee academic or financial success.
            </p>
            <p className="font-nunito text-white/65 text-sm leading-relaxed relative z-10">
              Instead, our aim is to create an engaging thinking environment using a wide variety of tactics and ways of thinking. Through these games, children develop <span className="text-[#F4C261] font-700">focus, reasoning, patience, communication, and discipline</span>. We believe that, when nurtured through enjoyment and challenging play, the skills that they learn with us can support broader learning and extend positively into other areas of life.
            </p>
          </div>

          {/* Core principles — 2-col grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[
              { emoji: '🎯', label: 'Process Over Outcome', color: 'bg-amber-50 border-amber-200', accent: '#b8790a', body: 'We focus on the quality of a child\'s thinking rather than simply the result. A well-reasoned and clearly explained loss often teaches more than a lucky win.' },
              { emoji: '🌱', label: 'Every Child Progresses', color: 'bg-green-50 border-green-200', accent: '#2d8c62', body: 'Children learn differently. We identify each child\'s individual needs and provide tailored guidance to help them grow steadily and confidently.' },
              { emoji: '🧠', label: 'Learning at the Right Level', color: 'bg-blue-50 border-blue-200', accent: '#4a7eb8', body: 'Lessons are carefully adapted so that children are challenged without becoming overwhelmed. As confidence grows, children are gradually introduced to new games, deeper ideas, and more complex forms of thinking.' },
              { emoji: '💬', label: 'Thinking Aloud & Social Learning', color: 'bg-purple-50 border-purple-200', accent: '#7a48c0', body: 'Children are encouraged to explain their ideas, discuss their decisions, and consider how others may respond. Through gameplay they develop patience, respect, listening skills, and the confidence to express their thoughts clearly.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 + i * 0.08, duration: 0.5 }}
                className={`play-card ${item.color} border-2 rounded-2xl p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <h4 className="font-fredoka text-lg leading-tight" style={{ color: item.accent }}>{item.label}</h4>
                </div>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Secondary pillars — full-width stacked */}
          <div className="flex flex-col gap-4 mb-6">
            {[
              { emoji: '🔍', label: 'Puzzles & Decision Making', accent: '#b8790a', body: 'Children regularly solve puzzles and game scenarios designed to strengthen reasoning and problem-solving skills. Rather than teaching that one move is simply "right" and another "wrong", we encourage children to explore multiple possibilities, evaluate their options, and make thoughtful decisions based on evidence and reflection.' },
              { emoji: '📈', label: 'Tracking Progress', accent: '#2d8c62', body: 'Every child has a personalised learning record through our secure online platform. Parents can view learning goals, tutor feedback, achievements, and areas for development in one place. Children also have access to their progress, helping them build confidence, accountability, and ownership of their learning journey.' },
              { emoji: '💻', label: 'Using Technology Carefully', accent: '#4a7eb8', body: 'We believe face-to-face learning and physical games should remain at the heart of education. However, when appropriate, we use carefully selected digital tools to help children understand more complex concepts and reinforce learning in a structured, child-friendly way.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                className="flex items-start gap-4 bg-white border-2 border-[#E8A020]/15 rounded-2xl p-5 hover:border-[#E8A020]/30 transition-colors"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <h4 className="font-fredoka text-lg mb-1" style={{ color: item.accent }}>{item.label}</h4>
                  <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Individual vs Group — split card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.95, duration: 0.55 }}
            className="bg-amber-50 border-2 border-amber-200 rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👥</span>
                <h4 className="font-fredoka text-lg text-[#b8790a]">Individual & Group Learning</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-amber-200">
              <div className="p-5">
                <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide block mb-2">Individual Sessions</span>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">Focus on developing thinking skills through puzzles, strategy, and personalised guidance tailored to each child's learning needs.</p>
              </div>
              <div className="p-5">
                <span className="font-nunito text-[#b8790a] text-xs font-700 uppercase tracking-wide block mb-2">Group Sessions</span>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">Focus on applying these skills through gameplay. Children learn to communicate ideas, collaborate, show respect, and practise patience in a positive social environment.</p>
              </div>
            </div>
          </motion.div>

          {/* Values pill */}
          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white border border-amber-200 rounded-full px-5 py-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#E8A020]" />
              <span className="font-nunito text-[#b8790a] text-xs font-700">Child-centred · Play-focused · Personalised support</span>
            </div>
          </div>
        </motion.div>

        {/* Research CTA */}
        <Link
          to="/references"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-4 bg-amber-50 border-2 border-amber-200 rounded-2xl px-6 py-5 hover:border-[#E8A020]/60 hover:shadow-md hover:shadow-[#E8A020]/10 transition-all group"
        >
          <span className="text-3xl flex-shrink-0">📚</span>
          <div className="flex-1 min-w-0">
            <p className="font-fredoka text-[#2D2520] text-lg leading-tight">Interested in the research behind our approach?</p>
            <p className="font-nunito text-[#2D2520]/55 text-sm mt-0.5">Explore the studies and sources we use — with parent-friendly summaries.</p>
          </div>
          <ArrowRight size={18} className="text-[#E8A020] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}