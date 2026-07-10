import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const variants = {
  // Larger scale — used for the primary homepage FAQ.
  default: {
    button: 'w-full text-left flex items-start justify-between gap-4 py-6',
    question: 'font-fredoka text-[#2D2520] text-lg leading-snug flex-1 pt-0.5 transition-colors group-hover:text-[#b8790a]',
    chevronSize: 20,
    answerWrap: 'pb-6 pr-10',
    answer: 'font-nunito text-[#2D2520]/70 text-base leading-relaxed',
  },
  // Tighter scale — used for page-specific FAQ lists.
  compact: {
    button: 'w-full flex items-center justify-between py-4 text-left',
    question: 'font-fredoka text-[#2D2520] text-lg pr-4 transition-colors group-hover:text-[#b8790a]',
    chevronSize: 18,
    answerWrap: 'pb-5 pr-8',
    answer: 'font-nunito text-[#2D2520]/65 text-sm leading-relaxed',
  },
};

export default function FAQAccordionItem({ question, answer, variant = 'default', defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const v = variants[variant] || variants.default;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="group">
      <button
        onClick={() => setOpen((o) => !o)}
        className={v.button}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={v.question}>{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown size={v.chevronSize} className="text-[#E8A020]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className={`${v.answerWrap} ${v.answer}`}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
