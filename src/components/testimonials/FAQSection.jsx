import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import FAQAccordionItem from '@/components/ui/FAQAccordionItem';
import Reveal from '@/components/ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];

const faqs = [
  {
    q: "What is your main goal?",
    a: "Our goal isn't simply to help children become better at strategy games. Our goal is to help children become thoughtful, curious learners who enjoy thinking, communicate their ideas with confidence and approach challenges with patience and resilience. If they also develop a lifelong love of strategy games along the way, that's a wonderful bonus.",
  },
  {
    q: "Is Rook Foundations a chess club?",
    a: "Not exactly. While chess is one of the strategy games we use, Rook Foundations is a child development organisation that uses a variety of strategy games to encourage thoughtful learning, communication and decision-making. The game is never the goal. The child's development is.",
  },
  {
    q: "Does my child need to know how to play chess?",
    a: "No. Many children join with little or no experience. We introduce games gradually and choose activities that suit each child's current level of understanding.",
  },
  {
    q: "What if my child doesn't enjoy chess?",
    a: "That's absolutely fine. Chess is just one of many strategy games we use. If another game provides a better opportunity for your child to engage, think and learn, we'll happily adapt our approach.",
  },
  {
    q: "Is this suitable for beginners?",
    a: "Yes. Our sessions are designed to meet children where they are. Whether they're completely new to strategy games or already have experience, activities are adapted to provide the right level of challenge.",
  },
  {
    q: "How is Rook Foundations different from traditional chess coaching?",
    a: "Traditional coaching often focuses on improving performance within the game. Our focus is broader. We use strategy games to help children develop thinking skills, communication, reflection, patience and confidence that extend beyond the board.",
  },
  {
    q: "What does a typical session look like?",
    a: (
      <>
        <p className="mb-3">Sessions usually include:</p>
        <ul className="list-disc pl-5 space-y-1.5 mb-3">
          <li>A warm welcome and conversation</li>
          <li>Strategy games and puzzles</li>
          <li>Guided questioning</li>
          <li>Gameplay</li>
          <li>Reflection</li>
          <li>Connecting learning to everyday life</li>
        </ul>
        <p>Each session is adapted to the needs of the children attending.</p>
      </>
    ),
  },
  {
    q: "Do children only play games?",
    a: "No. Games are central to our sessions, but they are only one part of the learning process. Children are encouraged to explain their thinking, ask questions, reflect on decisions and learn from one another.",
  },
  {
    q: "Why do you ask children so many questions?",
    a: "Because thinking grows through participation. Rather than simply giving answers, we encourage children to explain their reasoning, consider alternatives and reflect on their decisions. This helps develop independent thinking and confidence.",
  },
  {
    q: "Do you guarantee improvements in school or academic performance?",
    a: "No. Every child is different. Our sessions provide opportunities to practise skills such as attention, communication, reflection and thoughtful decision-making, but we do not claim that strategy games automatically improve academic results.",
  },
  {
    q: "My child struggles to concentrate. Can you help?",
    a: "Many children find strategy games engaging because they provide a fun reason to think carefully. Sessions are always adapted to the child, and we aim to create an environment where sustained attention develops naturally through meaningful activities.",
  },
  {
    q: "My child has SEND. Can they attend?",
    a: "In many cases, yes. Every child is different, so we recommend getting in touch to discuss your child's individual needs before booking. We'll always be honest about whether we feel our sessions are the right fit.",
  },
  {
    q: "What's the difference between individual and group sessions?",
    a: (
      <>
        <p className="mb-3">Individual sessions allow for more personalised guidance, deeper questioning and detailed reflection.</p>
        <p>
          Group sessions place greater emphasis on communication, teamwork, respectful competition and learning alongside others. You can read more on our{' '}
          <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-[#E8A020] underline underline-offset-2 hover:text-[#b8790a] transition-colors">
            How We Teach page
          </Link>.
        </p>
      </>
    ),
  },
  {
    q: "How do you measure progress?",
    a: "Rather than relying solely on game results, we observe how children develop over time. This may include improvements in communication, confidence, decision-making, reflection and engagement. For individual sessions, we also keep personalised learning notes to help guide future teaching.",
  },
  {
    q: "Will I receive feedback about my child?",
    a: "Yes. Where appropriate, we provide regular feedback about your child's learning journey and the areas we're working on together. Individual sessions allow for more detailed observations.",
  },
  {
    q: "Are your sessions competitive?",
    a: "They can be. Friendly competition is a valuable part of learning, but winning is never treated as the primary goal. We encourage children to enjoy challenge while learning to respect opponents, reflect on mistakes and celebrate progress.",
  },
  {
    q: "What if my child becomes upset after losing?",
    a: "This can happen, and it's often an important learning opportunity. We support children in understanding their emotions, reflecting on what happened and recognising that mistakes and setbacks are a natural part of learning.",
  },
  {
    q: "How many children are in a group?",
    a: "Group sizes vary depending on the setting and age of the children. We always aim to create an environment where every child can participate meaningfully.",
  },
  {
    q: "Do you work with schools?",
    a: "Yes. We offer after-school clubs, lunchtime sessions and other educational opportunities for schools. Please visit our For Schools section for more information.",
  },
  {
    q: "Do I need to stay during the session?",
    a: "No. Unless otherwise stated, children attend independently while parents are welcome to ask questions before or after the session.",
  },
  {
    q: "Are you DBS checked and insured?",
    a: "Yes. All appropriate safeguarding, DBS and insurance requirements are in place. Further details are available upon request and within our school information pack.",
  },
  {
    q: "Where can I learn more about your educational approach?",
    a: "Our website provides an overview of how we teach. For those interested in the thinking behind Rook Foundations, we've also developed the Rook Foundations Philosophy & Practice Handbook, which explains the educational principles that guide our work.",
  },
];

const chessFaqs = [
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
  const [showChessFaqs, setShowChessFaqs] = useState(false);

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
            Before launching, I asked prospective parents what mattered most to them about Rook Foundations, and what they were unsure about. These are the questions which came up the most.
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
          <div className="pt-4 border-t-2 border-[#E8A020]/10 space-y-3">
            <Link
              to="/references"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors group"
            >
              <BookOpen size={16} />
              Explore the research and evidence behind our approach
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setShowChessFaqs((v) => !v)}
                aria-expanded={showChessFaqs}
                className="inline-flex items-center gap-1.5 font-nunito text-[#2D2520]/40 text-xs font-600 hover:text-[#E8A020] transition-colors"
              >
                Curious about chess? Here's what parents wanted to know.
                <motion.span animate={{ rotate: showChessFaqs ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex-shrink-0">
                  <ChevronDown size={12} />
                </motion.span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showChessFaqs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-12 mt-12 border-t border-[#2D2520]/10">
                <div className="text-center mb-8">
                  <span className="font-nunito text-[#2D2520]/40 text-xs font-700 uppercase tracking-widest">Chess-specific questions</span>
                  <h3 className="font-fredoka text-[#2D2520] text-xl mt-2">Chess FAQs</h3>
                </div>
                <div className="border-t border-[#2D2520]/10 divide-y divide-[#2D2520]/10">
                  {chessFaqs.map((faq, i) => <FAQAccordionItem key={i} question={faq.q} answer={faq.a} variant="default" />)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
