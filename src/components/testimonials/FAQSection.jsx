import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: "My child has never played chess before — is that okay?",
    a: "Absolutely. The Discovery level is designed specifically for complete beginners, including children who have never seen a chess board before. We start from the very beginning — the names of the pieces, how they move, and why the game is so special — using storytelling and visual learning to make it feel exciting rather than overwhelming. There is no assumed knowledge, and no child will ever feel behind."
  },
  {
    q: "How do you keep young children focused and engaged during a session?",
    a: "This is something I think about deeply. Young children learn best through play, movement, and narrative — not passive instruction. Sessions are structured around short, varied activities: storytelling sequences, physical piece-handling, visual puzzles, and friendly mini-challenges. I never lecture for long stretches. The goal is for children to feel like they are playing and exploring, while the learning happens naturally through that experience."
  },
  {
    q: "What if my child progresses more slowly than other children in the group?",
    a: "Every child develops at their own pace, and that is something I fully embrace rather than work around. I keep detailed notes after every session so I can track each child's individual progress, adjust the pace when needed, and make sure no child is ever pushed forward before they are ready. A child who takes longer to grasp a concept is not falling behind — they are building a stronger foundation. There is no race, and no child will ever be made to feel inadequate."
  },
  {
    q: "Will learning chess actually benefit my child outside of the game?",
    a: "Yes — and this is supported by a growing body of research. Studies have consistently shown that chess instruction improves concentration, working memory, problem-solving ability, and emotional regulation in children. Beyond the research, parents frequently tell me that they notice real changes at home and at school: their child is calmer when facing challenges, more willing to think before reacting, and more confident in their own reasoning. Chess teaches children that effort and thought lead to results — and that is a lesson that extends far beyond the board."
  },
  {
    q: "How many children are in each session?",
    a: "Sessions are intentionally kept very small — a maximum of four students per group. This is a deliberate choice. Small group sizes mean I can give every child genuine, personalised attention throughout the session. I can see when someone is confused, when someone is ready to be stretched, and when someone just needs a moment of encouragement. It also creates a warm, safe social environment where children feel comfortable asking questions and making mistakes without embarrassment."
  },
  {
    q: "What happens in a typical session?",
    a: "While every session is adapted to the group's current level and energy, a typical session follows a warm, structured rhythm. We begin with a short recap of the previous session to reinforce memory and build confidence. We then move into the main learning activity — which might be a new concept, a puzzle challenge, or a structured game. Sessions include time for children to play against each other, with guidance and gentle coaching from me throughout. We close with reflection: what did we learn today? What are we looking forward to next time? The tone is always calm, encouraging, and fun."
  },
  {
    q: "Do you work with children who have additional needs or learning differences?",
    a: "Yes. My background includes extensive professional experience working with children and young people in residential care settings, including children with a wide range of additional needs, learning differences, and behavioural support requirements. I have completed training in safeguarding, mental health and emotional wellbeing, behaviour support, and equality and inclusion. I approach every child as an individual, and I am experienced in adapting my teaching style, pace, and communication to suit different needs. If your child has specific requirements, I would welcome the opportunity to discuss this with you before the first session so we can plan the best possible experience for them."
  },
  {
    q: "What if my child decides chess isn't for them?",
    a: "That is completely okay, and I would never want a child to feel pressured to continue if they are genuinely not enjoying it. That said, in my experience, the children who feel uncertain at first are often the ones who become the most engaged once the game starts to click. The first session is always low-pressure and exploratory. If after a few sessions it truly is not the right fit, I will always be honest and transparent with you about that. My priority is your child's wellbeing and happiness — not filling a space in a group."
  },
  {
    q: "How do I know which level is right for my child?",
    a: "If you are unsure, the best approach is simply to get in touch. I offer an initial assessment session where I can get a sense of your child's current understanding, temperament, and learning style. From there, I can recommend the most appropriate starting level with confidence. There is no obligation, and the assessment itself is a relaxed, enjoyable experience for the child — not a test. Many families find this a really helpful first step, especially if their child is somewhere between levels."
  },
  {
    q: "Is there flexibility with session times and scheduling?",
    a: "I aim to be as flexible as possible within the constraints of running small group sessions. Available times are listed when you enquire, and I do my best to accommodate the needs of families wherever I can. If your child misses a session due to illness or an unavoidable commitment, I will always do my best to ensure they do not feel lost when they return — detailed session notes mean I can catch them up effectively and sensitively."
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${open ? 'border-[#E8A020]/40 bg-white shadow-md shadow-[#E8A020]/8' : 'border-[#E8A020]/15 bg-white/70'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-4 p-6"
      >
        <span className="font-fredoka text-[#2D2520] text-lg leading-snug flex-1 pt-0.5">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 mt-0.5">
          <ChevronDown size={20} className="text-[#E8A020]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <div className="w-8 h-0.5 bg-[#E8A020]/40 rounded-full mb-3" />
              <p className="font-nunito text-[#2D2520]/70 text-base leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24 bg-[#F5F3EE] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A020]/6 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-100/20 blob-shape-2 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">💬</span>
            <span className="font-nunito text-amber-700 text-sm font-700">Questions from parents like you</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Things families often ask us
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base leading-relaxed max-w-xl mx-auto">
            We love answering questions. Here are some of the most common ones — but feel free to reach out anytime.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
        </div>

        <div className="text-center">
          <p className="font-nunito text-[#2D2520]/50 text-sm mb-5 font-600">Still have a question? I'd love to help.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-base px-8 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
          >
            <MessageCircle size={18} />
            Send me a message
          </Link>
        </div>
      </div>
    </section>
  );
}