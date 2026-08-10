import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Folder-with-lock icon traced from the reference photo (IMG_2893) — a bold
// line-art glyph, so the ink itself (not a filled silhouette) is traced and
// rendered with fill-rule evenodd, which reproduces the outline strokes at
// their original width rather than approximating them with a chosen stroke
// weight. Normalised so 1 unit = the icon's own height; the 1.4354 viewBox
// width reproduces its true (wider-than-tall) proportions.
const FOLDER_LOCK_RATIO = 1.4354;
const FOLDER_LOCK_PATHS = [
  'M 1.135 1.0006 L 1.085 0.9983 L 1.0373 0.9889 L 0.9919 0.9726 L 0.9604 0.9563 L 0.929 0.9354 L 0.8877 0.8976 L 0.8597 0.8626 L 0.837 0.826 L 0.0955 0.826 L 0.0594 0.8143 L 0.0407 0.8015 L 0.0122 0.7672 L 0.0029 0.7462 L -0.0006 0.7253 L -0.0006 0.1001 L 0.0099 0.0617 L 0.0285 0.0349 L 0.0594 0.0111 L 0.0931 -0.0006 L 0.4529 -0.0006 L 0.4761 0.0064 L 0.5017 0.0227 L 0.5437 0.0728 L 1.0384 0.0716 L 1.071 0.0809 L 1.0966 0.0972 L 1.1228 0.1281 L 1.1368 0.1641 L 1.138 0.3655 L 1.1909 0.3743 L 1.2515 0.3952 L 1.3097 0.4302 L 1.358 0.475 L 1.3906 0.5192 L 1.4162 0.5716 L 1.4302 0.6193 L 1.436 0.6764 L 1.4302 0.7474 L 1.4162 0.7951 L 1.3906 0.8475 L 1.3556 0.8941 L 1.3201 0.9284 L 1.2584 0.968 L 1.1944 0.9913 L 1.135 1.0006 Z',
  'M 0.8225 0.7905 L 0.8085 0.7381 L 0.8038 0.6764 L 0.8085 0.6286 L 0.8178 0.5891 L 0.8411 0.5343 L 0.862 0.5006 L 0.8877 0.4692 L 0.9302 0.4302 L 0.9581 0.4115 L 1.0244 0.3813 L 1.1019 0.3667 L 1.1013 0.2648 L 0.6531 0.2637 L 0.6432 0.2561 L 0.4849 0.0559 L 0.4668 0.0413 L 0.4447 0.0343 L 0.1013 0.0343 L 0.078 0.0413 L 0.0495 0.0652 L 0.0402 0.0815 L 0.0343 0.1059 L 0.0343 0.7194 L 0.0425 0.7485 L 0.064 0.7747 L 0.0792 0.7841 L 0.1024 0.791 L 0.8225 0.7905 Z',
  'M 1.1426 0.9627 L 1.1769 0.9587 L 1.234 0.94 L 1.2887 0.9075 L 1.33 0.8696 L 1.3673 0.8161 L 1.3906 0.759 L 1.3999 0.709 L 1.3999 0.6566 L 1.3859 0.5925 L 1.3603 0.5378 L 1.33 0.4971 L 1.2922 0.4616 L 1.2421 0.4302 L 1.1921 0.4115 L 1.142 0.4034 L 1.0827 0.4045 L 1.0396 0.4139 L 0.9849 0.4371 L 0.9395 0.4686 L 0.897 0.5134 L 0.862 0.5728 L 0.8481 0.6135 L 0.8411 0.6508 L 0.8411 0.7159 L 0.8574 0.7823 L 0.8807 0.83 L 0.9086 0.8673 L 0.9441 0.9016 L 0.979 0.9261 L 1.0373 0.9517 L 1.099 0.9633 L 1.1426 0.9627 Z',
  'M 1.248 0.8399 L 0.9919 0.8399 L 0.9738 0.8254 L 0.9715 0.6065 L 0.9796 0.5937 L 0.9919 0.5861 L 1.0297 0.5856 L 1.0297 0.553 L 1.039 0.5192 L 1.0617 0.4907 L 1.0838 0.4767 L 1.1048 0.4697 L 1.135 0.4697 L 1.17 0.4837 L 1.1927 0.5052 L 1.2043 0.5262 L 1.2101 0.5506 L 1.2101 0.5844 L 1.248 0.5861 L 1.2561 0.5896 L 1.2672 0.6019 L 1.2695 0.8172 L 1.2648 0.8277 L 1.248 0.8399 Z',
  'M 1.1019 0.2282 L 1.1019 0.1723 L 1.0972 0.156 L 1.0856 0.1362 L 1.0745 0.1251 L 1.0431 0.1088 L 0.5733 0.1094 L 0.6671 0.2288 L 1.1019 0.2282 Z',
  'M 1.2322 0.8044 L 1.2328 0.6211 L 1.0064 0.6217 L 1.007 0.8038 L 1.2322 0.8044 Z',
  'M 1.1234 0.7794 L 1.1106 0.7771 L 1.1042 0.7695 L 1.1019 0.7334 L 1.0832 0.7183 L 1.0751 0.6973 L 1.0763 0.6787 L 1.0809 0.6682 L 1.0955 0.6537 L 1.1118 0.6467 L 1.1281 0.6467 L 1.1455 0.6537 L 1.1577 0.6659 L 1.1647 0.6822 L 1.1624 0.7101 L 1.1554 0.7206 L 1.138 0.7346 L 1.1368 0.7695 L 1.1234 0.7794 Z',
  'M 1.174 0.5856 L 1.1717 0.5402 L 1.1647 0.5274 L 1.1432 0.5093 L 1.1257 0.5047 L 1.0978 0.5093 L 1.0786 0.5239 L 1.0693 0.539 L 1.0658 0.5565 L 1.0675 0.5861 L 1.174 0.5856 Z',
  'M 1.1228 0.7008 L 1.1298 0.695 L 1.1298 0.6892 L 1.1199 0.6816 L 1.1112 0.6868 L 1.1112 0.6962 L 1.1228 0.7008 Z',
].join(' ');

// Three consecutive sessions compressed to one line of movement each — the
// point being made is the cycle itself (observe, set targets, adapt, repeat)
// rather than the detail of any single lesson. No per-stage icons: the node
// numbers, connecting line and return loop carry the progression instead.
const sessions = [
  {
    label: 'Session 1',
    accent: '#2d8c62',
    body: 'Gameplay reveals strengths and shapes initial learning targets.',
  },
  {
    label: 'Session 2',
    accent: '#4a7eb8',
    body: 'Games are chosen to build those targets, then progress is reviewed.',
  },
  {
    label: 'Session 3',
    accent: '#7a48c0',
    body: 'Targets adapt, strengths are reinforced, and new challenges begin.',
  },
];

function SessionNode({ session, index, vertical = false }) {
  const badge = (
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center font-fredoka text-white text-sm shadow-md flex-shrink-0 relative z-10"
      style={{ backgroundColor: session.accent, boxShadow: `0 6px 14px ${session.accent}35` }}
    >
      {index + 1}
    </span>
  );

  if (vertical) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
        className="flex items-start gap-3"
      >
        {badge}
        <div className="pt-1.5">
          <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest" style={{ color: session.accent }}>
            {session.label}
          </p>
          <p className="font-nunito text-[#2D2520]/60 text-xs leading-snug mt-1">{session.body}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
      className="relative z-10 flex flex-col items-center text-center flex-1 px-1"
    >
      {badge}
      <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest mt-2.5" style={{ color: session.accent }}>
        {session.label}
      </p>
      <p className="font-nunito text-[#2D2520]/60 text-xs leading-snug mt-1 max-w-[10.5rem]">{session.body}</p>
    </motion.div>
  );
}

// Single compact diagram replacing the old three-card layout: a short flow
// of numbered nodes (horizontal on tablet/desktop, a left-aligned timeline
// on mobile). No connecting lines or arrows — just the node numbers, colour
// and spacing carry the progression, with the rotating icon below standing
// in for the "repeats" cue.
function SessionCycle() {
  return (
    <div className="max-w-3xl mx-auto mb-14">
      {/* Tablet & desktop — horizontal flow */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        {sessions.map((session, i) => (
          <SessionNode key={session.label} session={session} index={i} />
        ))}
      </div>

      {/* Mobile — left-aligned vertical timeline */}
      <div className="sm:hidden flex flex-col gap-5">
        {sessions.map((session, i) => (
          <SessionNode key={session.label} session={session} index={i} vertical />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        <motion.span
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="text-[#E8A020] flex-shrink-0"
        >
          <RotateCcw size={13} />
        </motion.span>
        <span className="font-fredoka text-[#b8790a] text-xs sm:text-sm italic">Every session builds on the last</span>
      </div>
    </div>
  );
}

export default function ProgressTrackingSection() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
      {/* Subheading — deliberately lighter than the page's "What Makes Us
          Different?" heading above, since this section is the answer to
          that question rather than a new topic of its own. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-10"
      >
        <h3 className="font-fredoka text-[#2D2520] text-xl sm:text-2xl">
          Tracking Progress Over Time
        </h3>
      </motion.div>

      {/* Session 1 → 2 → 3, looping back — a single compact diagram in
          place of three large cards */}
      <SessionCycle />

      {/* Notion → data protection: the system used to organise a child's
          learning, and the secure handling of that information, presented
          as two connected, equally-weighted icons rather than the previous
          single Notion-in-a-rook illustration. The data-protection image
          has no interaction yet — only the Notion icon is clickable. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        className="flex flex-col items-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="How we use Notion to personalise lessons"
            className="group flex-shrink-0 h-14 sm:h-20 lg:h-24 w-14 sm:w-20 lg:w-24 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 rounded-2xl"
          >
            <picture className="w-full h-full transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-focus-visible:scale-105">
              <source srcSet="/images/icons/notion-logo.webp" type="image/webp" />
              <img
                src="/images/icons/notion-logo.png"
                alt="Notion"
                width={240}
                height={240}
                className="w-full h-full object-contain"
              />
            </picture>
          </button>

          <ArrowRight size={22} strokeWidth={2.5} className="flex-shrink-0 text-[#E8A020]/65 sm:hidden" aria-hidden="true" />
          <ArrowRight size={28} strokeWidth={2.5} className="hidden sm:block lg:hidden flex-shrink-0 text-[#E8A020]/65" aria-hidden="true" />
          <ArrowRight size={32} strokeWidth={2.5} className="hidden lg:block flex-shrink-0 text-[#E8A020]/65" aria-hidden="true" />

          <div role="img" aria-label="Data protection" className="flex-shrink-0 h-14 sm:h-20 lg:h-24 w-auto">
            <svg viewBox={`0 0 ${FOLDER_LOCK_RATIO} 1`} className="h-full w-auto block" focusable="false">
              <path d={FOLDER_LOCK_PATHS} fill="#2D2520" fillOpacity="0.72" fillRule="evenodd" />
            </svg>
          </div>
        </div>

        <span className="font-nunito text-[#2D2520]/45 text-xs mt-4">
          {open ? 'Hide details' : 'Tap to see how we organise it all'}
        </span>

        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden w-full max-w-lg"
            >
              <div className="bg-white border border-[#2D2520]/8 rounded-3xl px-6 py-6 shadow-sm text-center">
                <h3 className="font-fredoka text-[#2D2520] text-lg mb-2">What is Notion?</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                  Notion contains the secure database I use behind the scenes to keep every lesson connected. It's where I record lesson observations, document each child's strengths, and note any areas that need extra support. It tracks progress over time, keeps learning targets up to date, and plans the next lesson around how the last one went. This data provides valuable insights into skills learnt through specific games, which are then used to personalise learning experiences.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
