import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'My child has never played before. Is that okay?',
    a: 'Yes. Chess is a highly inclusive activity, and every child learns at their own pace. Many children begin with no prior experience at all, so lessons are designed to introduce concepts gradually in a supportive and enjoyable way. My teaching approach focuses on small, manageable steps that make learning engaging rather than overwhelming. The goal is not only to teach chess, but also to help children build confidence, concentration, awareness, patience, and motivation over time. The important thing is for children to enjoy the process of learning and feel proud of the progress they make.',
    refs: [],
  },
  {
    q: 'What if my child progresses quickly?',
    a: "Children learn at different rates, and some may progress through the fundamentals of chess surprisingly quickly. My focus is on building strong thinking habits, confidence, concentration, and problem-solving skills rather than simply creating strong chess players. If your child eventually reaches a level beyond what I can coach effectively, I will always be honest and transparent about the next best steps for their development. At that stage, lessons may shift more toward advanced strategy, cognitive exercises, and other structured games that continue to develop critical thinking, decision-making, memory, and creativity. My goal is to help children build skills that remain useful both inside and outside of chess.",
    refs: [],
  },
  {
    q: 'Are classes suitable for children with learning difficulties?',
    a: 'Yes. Children with learning difficulties are more than capable of learning chess, and it can serve as a helpful visual learning tool [1]. That said, chess does require a degree of memory, concentration, and communication, which some children may find more challenging [2]. I see chess as an inclusive activity and respect that every child learns at their own pace. For children who find certain concepts more difficult at first, my step-by-step approach aims to guide them gradually. Developing focus and concentration is strongly linked to motivation and engagement, which in turn supports persistence, patience, and deeper learning [3]. That is the framework I use to guide my lessons.',
    refs: [1, 2, 3],
  },
  {
    q: 'How can I be sure that chess is right for my child?',
    a: "You don't. That is perfectly fine. Chess is a complex game and not everyone will engage with it. Our first assessment will identify your child's interest and engagement with chess and will include an honest evaluation of whether I believe chess is something they could genuinely connect with over time. If they do not engage, I offer alternative games of strategy that may be a better fit for your child. For more details, please get in touch.",
    refs: [],
  },
  {
    q: 'Can your lessons support children with autism?',
    a: 'Chess naturally provides structure, clear rules, and consistent patterns of learning — all of which can benefit children with autism [4]. That said, playing a complex game with someone sitting opposite you involves social and emotional demands that may feel stressful or unfamiliar at first. I understand that, and I adapt my teaching approach to create a more emotionally safe and supportive environment. This can include a greater focus on computer-assisted instruction, which research suggests may reduce sensory overload and provide clearer visual cues [5]. It can also offer a space that feels free from social pressure and judgement [6]. Before lessons begin, I encourage parents to get in touch so I can better understand their child\'s individual needs — including sensory sensitivities, communication style, anxiety levels, processing speed, and learning preferences. This helps me create lessons that are engaging, supportive, and meaningful for each child.',
    refs: [4, 5, 6],
  },
  {
    q: 'Can your lessons support children with ADHD?',
    a: 'Absolutely. Chess has shown promise in helping reduce ADHD symptoms and supporting improvements in planning, working memory, and impulse control [7, 8]. I expect that children with ADHD may find it more difficult to focus for extended periods, pause before acting, or manage frustration when adapting to new concepts. I take a gradual approach, adapting the lesson plan in alignment with each child\'s learning preferences. Small improvements are always recognised and positively reinforced throughout the process — building confidence, trust, and long-term motivation.',
    refs: [7, 8],
  },
  {
    q: 'Chess is a boy thing. Could my daughter engage with it?',
    a: "Absolutely. Chess is for anyone who enjoys thinking creatively, solving problems, and learning new skills. Although chess has historically been male-dominated, many women and girls have demonstrated that talent, dedication, and hard work matter far more than gender. A famous example is Judit Polgár, widely regarded as the strongest female chess player in history — she defeated several world champions, including Garry Kasparov, at a time when many still underestimated women in chess. My teaching approach is fully inclusive, and lessons are adapted to each child's personality, interests, and learning style so they can feel comfortable, engaged, and capable from the very beginning.",
    refs: [],
  },
  {
    q: 'Are you any good at chess?',
    a: "I believe in being honest and transparent about my level. I am not a chess master or elite competitive player — and that is not the focus of my teaching. My carefully analysed games are evaluated by the chess engine Stockfish at an estimated strength of around 1600–1800 Elo. In the chess world, this is considered average, reflecting a solid understanding of strategy, structure, and decision-making. This level is well suited for teaching at the beginner stages where most children working with me will be starting from.",
    refs: [],
  },
];

const references = [
  { num: 1, text: 'Scholtz, S., et al. (2008). The effects of chess instruction on the mathematical achievement of southern Cape learners. South African Journal of Research in Sport, Physical Education and Recreation.' },
  { num: 2, text: 'Davis, H., et al. (2004). Cognitive demands and limitations in chess for children with learning difficulties.' },
  { num: 3, text: 'Deci, E. L., & Ryan, R. M. (2012). Self-determination theory. Handbook of Theories of Social Psychology.' },
  { num: 4, text: 'National Autistic Society. Structured environments and autism. autism.org.uk' },
  { num: 5, text: 'Ambrose, K., et al. (2021). Computer-assisted instruction for autistic learners: reducing sensory overload and improving engagement.' },
  { num: 6, text: 'Konstantinidis, E. I., et al. (2009). Technology-assisted learning for autistic children: social pressure reduction and visual support.' },
  { num: 7, text: 'Argawal, S. (2023). Chess as an intervention for ADHD: benefits in executive function and impulse control.' },
  { num: 8, text: 'Yakushina, A., et al. (2025). Chess training and ADHD: improvements in planning, working memory and attention.' },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left group flex items-start justify-between gap-4 p-6 border transition-all duration-300 ${
          open
            ? 'bg-[#111] border-[#D4A843]/40'
            : 'bg-[#0D0D0D] border-[#D4A843]/12 hover:bg-[#111] hover:border-[#D4A843]/25'
        }`}
      >
        <span className="font-oswald text-white text-base md:text-lg uppercase tracking-wide leading-snug flex-1 pt-0.5">
          {faq.q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 border flex items-center justify-center transition-all duration-300 mt-0.5 ${
          open ? 'border-[#D4A843] bg-[#D4A843]/10 rotate-0' : 'border-[#D4A843]/30 group-hover:border-[#D4A843]/60'
        }`}>
          {open
            ? <Minus size={12} className="text-[#D4A843]" />
            : <Plus size={12} className="text-[#D4A843]/60 group-hover:text-[#D4A843]" />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-[#0A0A0A] border-x border-b border-[#D4A843]/15 px-6 pb-6 pt-5">
              <p className="font-lato text-white/60 text-base leading-relaxed">{faq.a}</p>
              {faq.refs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {faq.refs.map((r) => (
                    <span key={r} className="font-lato text-[#D4A843]/50 text-xs border border-[#D4A843]/20 px-2 py-0.5 rounded">
                      [{r}]
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24 border-t border-[#D4A843]/10" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">FAQ</span>
          <h2 className="font-oswald text-white uppercase" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
            Common questions answered
          </h2>
          <p className="font-lato text-white/40 text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Honest answers to the things parents ask most. If you don't see your question here, get in touch directly.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-lato text-white/35 text-sm mb-5">Still have a question?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-[#D4A843]/50 text-[#D4A843] font-oswald text-sm tracking-wider px-8 py-3 hover:bg-[#D4A843] hover:text-[#0A0A0A] transition-all duration-300"
          >
            GET IN TOUCH <ArrowRight size={14} />
          </Link>
        </div>

        {/* References */}
        <div className="mt-16 border-t border-[#D4A843]/10 pt-10">
          <h3 className="font-oswald text-white/40 text-xs uppercase tracking-widest mb-6">Sources</h3>
          <ul className="space-y-3">
            {references.map((ref) => (
              <li key={ref.num} className="flex items-start gap-3">
                <span className="font-oswald text-[#D4A843]/30 text-xs flex-shrink-0 w-5 text-right mt-0.5">[{ref.num}]</span>
                <p className="font-lato text-white/30 text-sm leading-relaxed">{ref.text}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}