import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

const lessonPlans = [
  {
    phase: 'Discovery',
    plans: [
      {
        duration: '1 Hour',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/8795dbc50_f94a58d96e47fff5d3acb5dbfc5495f76070d21dda1bc19cb092da4d41b4d7d7.png',
      },
      {
        duration: '2 Hours',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/c0fd26cfd_76db2d5dd451768fc2001985f35997041eb6c2aee75f76e092e4e0dc8c91b268.png',
      },
    ],
  },
  {
    phase: 'Strategy',
    plans: [
      {
        duration: '1 Hour',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/33a3303a8_8ea1df9542942f11bb18ae357a681b6b701315769cbbba8eed96a4d115473c30.png',
      },
      {
        duration: '2 Hours',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/f24b28ac4_4e3c5f8b721ce33c537a87c1523575063c44d44616312e3a0b19c06cadcae5ff.png',
      },
    ],
  },
  {
    phase: 'Advanced',
    plans: [
      {
        duration: '1 Hour',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/e42e38299_d19b66d75e26e73e9fcbd657b5644c99b55d87f43cf48a227fc9f1455029a9b4.png',
      },
      {
        duration: '2 Hours',
        image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/182445314_f2d6513965ad7faf7f9dc1c9dfbcfe01e3d1062ba116324f1adb93eec536f78d.png',
      },
    ],
  },
];

export default function LessonPlans({ activePhaseTitle }) {
  const [modalImage, setModalImage] = useState(null);
  const [modalLabel, setModalLabel] = useState('');
  const [tooltip, setTooltip] = useState(null);

  const phaseData = lessonPlans.find(
    (p) => p.phase.toLowerCase() === activePhaseTitle?.toLowerCase()
  );

  if (!phaseData) return null;

  return (
    <>
      <div className="mt-6 border border-[#D4A843]/15 bg-[#0D0D0D] p-6">
        <h3 className="font-oswald text-[#D4A843] text-lg uppercase tracking-wide mb-1 flex items-center gap-2">
          <Clock size={15} /> Session Lesson Plans
        </h3>
        <p className="font-lato text-white/35 text-xs mb-5 tracking-wide">
          Click a plan to explore the full session structure and learning goals.
        </p>
        <div className="flex gap-3">
          {phaseData.plans.map((plan) => (
            <div key={plan.duration} className="relative">
              <button
                onClick={() => {
                  setModalImage(plan.image);
                  setModalLabel(`${phaseData.phase} Phase — ${plan.duration}`);
                }}
                onMouseEnter={() => setTooltip(plan.duration)}
                onMouseLeave={() => setTooltip(null)}
                className="group relative flex items-center gap-2 border border-[#D4A843]/30 bg-[#0A0A0A] px-5 py-3 hover:border-[#D4A843] hover:bg-[#D4A843]/8 transition-all duration-250"
              >
                <Clock size={13} className="text-[#D4A843] flex-shrink-0" />
                <span className="font-oswald text-white/80 text-sm uppercase tracking-widest group-hover:text-[#D4A843] transition-colors">
                  {plan.duration} Plan
                </span>
                <span className="absolute -top-px left-0 right-0 h-px bg-[#D4A843] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {tooltip === plan.duration && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none"
                  >
                    <div className="bg-[#111] border border-[#D4A843]/30 px-3 py-2 whitespace-nowrap">
                      <p className="font-lato text-white/70 text-xs">View lesson structure & learning goals</p>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#111] border-l border-t border-[#D4A843]/30 rotate-45" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
            onClick={() => setModalImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between bg-[#111] border border-b-0 border-[#D4A843]/30 px-5 py-3">
                <span className="font-oswald text-[#D4A843] text-sm uppercase tracking-widest">{modalLabel}</span>
                <button
                  onClick={() => setModalImage(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Image */}
              <div className="border border-[#D4A843]/30 overflow-hidden">
                <img
                  src={modalImage}
                  alt={modalLabel}
                  className="w-full block"
                />
              </div>
              {/* Footer */}
              <div className="bg-[#111] border border-t-0 border-[#D4A843]/30 px-5 py-2.5 flex items-center justify-between">
                <span className="font-lato text-white/25 text-xs tracking-wide">Tap outside or press × to close</span>
                <span className="text-[#D4A843] text-base">♜</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}