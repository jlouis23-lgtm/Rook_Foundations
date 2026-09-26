import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// A deliberately understated disclosure — smaller and quieter than the
// site's FAQAccordionItem (which reads at h3 scale, sized for a list of
// several questions) — so this single optional detail stays secondary to
// the main "Building Independence Through Challenge" content above it.
export default function ScaffoldingNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group inline-flex items-center gap-1.5 font-nunito text-[#2D2520]/55 text-sm font-700 hover:text-[#b8790a] transition-colors"
      >
        How we support independence
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-shrink-0"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed pt-3">
              We aim to provide enough support to help a child move forward while giving them opportunities to work things out for themselves. Our approach is informed by the{' '}
              <a
                href="https://educationendowmentfoundation.org.uk/news/what-goes-up-must-come-down-promoting-pupil-independence-through-scaffolding"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#2D2520]/25 hover:decoration-[#2D2520]/60 hover:text-[#2D2520]/75 transition-colors"
              >
                Education Endowment Foundation's Scaffolding Framework for Teaching Assistant–Pupil Interactions
              </a>
              , which describes a progression from self-scaffolding and prompting through to clueing, modelling and direct correction when needed.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
