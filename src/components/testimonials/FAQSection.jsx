import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: "Does my child need any experience to start?",
    a: "Not at all! Our Discovery level is designed for complete beginners. We start from scratch — with storytelling, colourful pieces, and a gentle, playful approach that makes every first session feel fun, not intimidating."
  },
  {
    q: "How do you keep young children engaged during sessions?",
    a: "We use a mix of storytelling, puzzles, tactile play, and friendly challenges. Sessions are never just 'sit and watch' — children learn by doing, which keeps energy levels high and attention focused throughout."
  },
  {
    q: "Will chess actually help my child beyond the game itself?",
    a: "Research shows chess supports focus, reasoning, patience, and emotional regulation. We don't just teach moves — we build habits of mind. Many parents tell us the biggest changes happen at school and at home."
  },
  {
    q: "What if my child progresses more slowly than others?",
    a: "Every child develops at their own wonderful pace, and we fully embrace that. Detailed notes are kept after every session, and lessons are adapted to each child's individual needs. There is no pressure to rush ahead."
  },
  {
    q: "How big are the groups?",
    a: "Sessions run with a maximum of 4 students. Small group sizes ensure every child receives genuine attention, personalised guidance, and the space to ask questions and make mistakes safely."
  },
  {
    q: "What does the first session look like?",
    a: "Your child's first session is relaxed, exploratory, and fun. We assess their current understanding (if any), introduce them to the pieces through play, and — most importantly — make sure they leave excited to come back."
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