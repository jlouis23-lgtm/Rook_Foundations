import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import FAQAccordionItem from '@/components/ui/FAQAccordionItem';
import Reveal from '@/components/ui/Reveal';

const faqs = [
  {
    q: "My child has never played before. Is that okay?",
    a: "Yes. Chess is a highly inclusive activity, and every child learns at their own pace. Many children begin with no prior experience at all, so lessons are designed to introduce concepts gradually in a supportive and enjoyable way. My teaching approach focuses on small, manageable steps that make learning engaging rather than overwhelming. The goal is not only to teach chess, but also to help children build confidence, concentration, awareness, patience, and motivation over time. For me, the important thing is for children to enjoy the process of learning and feel proud of the progress they make."
  },
  {
    q: "How do I know which phase is right for my child?",
    a: "You do not need to decide alone. Our first assessment will identify your child's interest and engagement with chess. This will include an honest evaluation of whether I believe chess is something they could genuinely connect with over time."
  },
  {
    q: "What if my child progresses quickly?",
    a: "Children learn at different rates, and some may progress through the fundamentals of chess surprisingly quickly. My focus is on building strong thinking habits, confidence, concentration, and problem-solving skills rather than simply creating strong chess players. If your child eventually reaches a level beyond what I can coach effectively, I will always be honest and transparent about the next best steps for their development. At that stage, lessons may shift more toward advanced strategy, cognitive exercises, and other structured games that continue to develop critical thinking, decision-making, memory, and creativity. My goal is to help children build skills that remain useful both inside and outside of chess."
  },
  {
    q: "Are classes suitable for children with learning difficulties?",
    a: "Yes. Children with learning difficulties are more than capable of learning chess, and research suggests it can serve as a genuinely helpful visual and cognitive tool for these children. That said, chess does require a degree of memory, concentration, and communication, which can feel more challenging for some learners. I see chess as an inclusive activity and respect that every child learns at their own pace. For children who may find certain concepts more difficult at first, my step-by-step approach aims to guide them slowly and gradually. Developing concentration and focus is strongly linked to motivation and engagement — which in turn supports persistence, patience, and deeper learning. That is the framework I use to guide my lessons."
  },
  {
    q: "How can I be sure that chess is right for my child?",
    a: "You cannot be certain in advance, and I think it is important to be honest about that. Chess is a complex activity, and not every child will immediately engage with it. I am aware of this and have alternative games and approaches that might be a better fit for your child. For more details, please get in touch."
  },
  {
    q: "Can your lessons support children with autism?",
    a: "Yes, and this is something I care deeply about. Chess naturally provides structure, clear rules, and consistent patterns. These are things that many autistic children find reassuring and engaging. However, playing a game with someone sitting opposite you can involve real social and emotional demands, and I understand that this can feel stressful or unfamiliar, particularly when working with someone new. Many autistic children also experience anxiety around social environments, which can affect their confidence and opportunities over time. Through my studies and professional experience, I have developed a deeper understanding of how to create emotionally safe, lower-pressure learning environments. I adapt my teaching approach for each child. For your child, this may include greater focus on computer-assisted instruction, which is already built into my lesson plans and can help reduce sensory demands and provide clearer visual cues. Before lessons begin, I always encourage parents to get in touch so I can learn about your child's individual needs; things such as communication style, sensory sensitivities, anxiety levels, and learning preferences. This helps me plan sessions that feel supportive and meaningful from the very start."
  },
  {
    q: "Can your lessons support children with ADHD?",
    a: "Yes, and there is good reason to be optimistic. Chess has been shown to support improvements in planning, working memory, and impulse control. These can be more challenging for children with ADHD. I do expect that these children may find it harder to focus for extended periods, to pause before acting, or to hold multiple possibilities in mind at once. My approach responds to this by keeping sessions varied and at the right pace for your child. We aim to break concepts into bite-size chunks, and recognise and positively reinforce small improvements throughout. Building confidence, trust, and long-term motivation is our main goal here at Rook Foundations."
  },
  {
    q: "Chess is a boy thing. Could my daughter engage with it?",
    a: "Absolutely. Chess is for anyone who enjoys thinking creatively, solving problems, and learning new skills. Although chess has historically been male-dominated, many women and girls have shown that talent, dedication, and hard work matter far more than gender. A famous example is Judit Polgár. Judit is widely regarded as the strongest female chess player in history. She defeated several world champions, like Garry Kasparov, at a time when many still underestimated women's capability of being calculated and being able to maintain emotional control under pressure. Chess can be a fantastic activity for girls, helping to build confidence, resilience, concentration, and independent thinking in a supportive environment. My teaching approach is fully inclusive, and lessons are adapted to each child's personality, interests, and learning style so they can feel comfortable, engaged, and capable from the very beginning."
  },
  {
    q: "Are you any good at chess?",
    a: "I believe in being honest and transparent about my level. I am not a chess master or elite competitive player. That is not the focus of my teaching. My carefully analysed games are evaluated by the chess engine Stockfish at an estimated strength of around 1600 Elo. In the chess world, this is considered average, and reflects a solid understanding of strategy, structure, and decision-making. This level is well suited to teaching at the beginner level where children working with me will most likely be starting from."
  },
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-[#F5F3EE] relative overflow-hidden">
      <ChessBg variant="faq" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 font-nunito text-amber-700 text-sm font-800 uppercase tracking-widest mb-4">
            <MessageCircle size={14} /> Questions from parents like you
          </span>
          <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Things families often ask us
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base leading-relaxed max-w-xl mx-auto">
            Before launching, I asked for parents' opinions on private chess tutoring, what mattered to them, and what they were unsure about. These are the questions which came up the most.
          </p>
        </Reveal>

        <div className="border-t border-[#2D2520]/10 divide-y divide-[#2D2520]/10 mb-12">
          {faqs.map((faq, i) => <FAQAccordionItem key={i} question={faq.q} answer={faq.a} variant="default" />)}
        </div>

        <div className="text-center space-y-6">
          <p className="font-nunito text-[#2D2520]/50 text-sm font-600">Still have a question? I'd love to help.</p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-base px-8 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
          >
            <MessageCircle size={18} />
            Send me a message
          </MotionLink>
          <div className="pt-4 border-t-2 border-[#E8A020]/10">
            <Link
              to="/references"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors group"
            >
              <BookOpen size={16} />
              Explore the research and evidence behind our approach
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}