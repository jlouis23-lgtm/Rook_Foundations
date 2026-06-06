import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

const lessonPlans = [
  {
    phase: 'Discovery',
    plans: [
      { duration: '1 Hour', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/8795dbc50_f94a58d96e47fff5d3acb5dbfc5495f76070d21dda1bc19cb092da4d41b4d7d7.png' },
      { duration: '2 Hours', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/c0fd26cfd_76db2d5dd451768fc2001985f35997041eb6c2aee75f76e092e4e0dc8c91b268.png' },
    ],
  },
  {
    phase: 'Strategy',
    plans: [
      { duration: '1 Hour', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/33a3303a8_8ea1df9542942f11bb18ae357a681b6b701315769cbbba8eed96a4d115473c30.png' },
      { duration: '2 Hours', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/f24b28ac4_4e3c5f8b721ce33c537a87c1523575063c44d44616312e3a0b19c06cadcae5ff.png' },
    ],
  },
  {
    phase: 'Advanced',
    plans: [
      { duration: '1 Hour', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/e42e38299_d19b66d75e26e73e9fcbd657b5644c99b55d87f43cf48a227fc9f1455029a9b4.png' },
      { duration: '2 Hours', image: 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/182445314_f2d6513965ad7faf7f9dc1c9dfbcfe01e3d1062ba116324f1adb93eec536f78d.png' },
    ],
  },
];

export default function LessonPlans({ activePhaseTitle }) {
  const [modalImage, setModalImage] = useState(null);
  const [modalLabel, setModalLabel] = useState('');

  const phaseData = lessonPlans.find(
    (p) => p.phase.toLowerCase() === activePhaseTitle?.toLowerCase()
  );

  if (!phaseData) return null;

  return (
    <>
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
        <h3 className="font-fredoka text-[#b8790a] text-lg mb-1 flex items-center gap-2">
          📋 What does a session look like?
        </h3>
        <p className="font-nunito text-[#2D2520]/50 text-xs mb-5 font-600">
          Tap a plan to explore the full session structure and learning goals.
        </p>
        <div className="flex gap-3 flex-wrap">
          {phaseData.plans.map((plan) => (
            <button
              key={plan.duration}
              onClick={() => {
                setModalImage(plan.image);
                setModalLabel(`${phaseData.phase} — ${plan.duration} Session`);
              }}
              className="group flex items-center gap-2 bg-white border-2 border-amber-200 rounded-2xl px-5 py-3 hover:border-[#E8A020] hover:bg-amber-50 transition-all font-nunito font-700 text-sm text-[#2D2520]/70 hover:text-[#b8790a]"
            >
              <Clock size={14} className="text-[#E8A020]" />
              {plan.duration} Plan
            </button>
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
            style={{ backgroundColor: 'rgba(45,37,32,0.80)' }}
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
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E8A020]/20">
                <div className="flex items-center justify-between bg-amber-50 border-b-2 border-amber-100 px-5 py-4">
                  <span className="font-fredoka text-[#b8790a] text-base">{modalLabel}</span>
                  <button onClick={() => setModalImage(null)} className="text-[#2D2520]/40 hover:text-[#2D2520] transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <img src={modalImage} alt={modalLabel} className="w-full block" />
                <div className="bg-amber-50 border-t-2 border-amber-100 px-5 py-3 flex items-center justify-between">
                  <span className="font-nunito text-[#2D2520]/35 text-xs font-600">Tap outside to close</span>
                  <span className="text-[#E8A020] text-base">♜</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}