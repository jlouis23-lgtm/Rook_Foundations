import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];

// Three self-calming strategies practitioners may offer, not guaranteed
// methods for changing a child's emotional state or behaviour. Colours
// reused from the Learning Pyramid's own six-stage rotation directly above
// this section (Relationship/Challenge/Thinking), per the brief's steer
// towards "distinctive but consistent with the Learning Pyramid above"
// rather than introducing a new palette.
const strategies = [
  {
    key: 'self-talk',
    name: 'Positive self-talk',
    accent: '#2d8c62',
    body: [
      { text: 'Encourage the child to use short, reassuring statements to help reframe difficulty and maintain a sense of control.' },
      { text: 'Examples: "I can take my time," "It\'s okay to make a mistake," "I can try again," or "I don\'t have to get it right straight away."', italic: true },
    ],
  },
  {
    key: 'breathing',
    name: 'Controlled breathing',
    accent: '#4a7eb8',
    body: [
      { text: 'Guide the child through slow, comfortable breaths, helping them pause before continuing. A simple approach is to breathe in gently and then breathe out slowly, repeating this several times. This can be particularly useful when frustration or excitement is escalating.' },
    ],
  },
  {
    key: 'pause-reset',
    name: 'Pause, reset and choose',
    accent: '#7a48c0',
    body: [
      { text: 'Give the child permission to temporarily step away from the activity, reduce demands and choose what happens next.' },
      { text: 'For example: "Would you like a short break, try something different, or come back to the puzzle when you\'re ready?"', italic: true },
      { text: 'This provides space for regulation without framing taking a break as failure.' },
    ],
  },
];

export default function RegulationStrategies() {
  const [activeKey, setActiveKey] = useState(null);
  const active = strategies.find((s) => s.key === activeKey) || null;

  return (
    <div>
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
          Supporting regulation
        </span>
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Regulation Before Participation
        </h2>
      </div>

      <Reveal className="max-w-2xl mx-auto text-center mb-10">
        <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
          If a child becomes dysregulated, the objective isn't to get them back to the activity as quickly as possible. It is to help them feel sufficiently settled and supported to decide whether and how they want to continue. Being able to manage emotions is widely regarded as necessary for engaging in learning, although a recent systematic review found little research on how schools can best support this for autistic pupils (Bennett et al., 2024). In response, we have incorporated three main self-calming strategies to support regulation and create the conditions for meaningful engagement and learning:
        </p>
      </Reveal>

      <Reveal className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
        {strategies.map((s) => {
          const isActive = activeKey === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveKey(isActive ? null : s.key)}
              aria-pressed={isActive}
              className="rounded-full flex-shrink-0 flex items-center justify-center text-center outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E8A020]"
              style={{
                width: 'clamp(150px, 15vw, 180px)',
                height: 'clamp(150px, 15vw, 180px)',
                backgroundColor: isActive ? s.accent : '#fff',
                border: `2.5px solid ${isActive ? s.accent : `${s.accent}55`}`,
                boxShadow: isActive ? `0 10px 24px -8px ${s.accent}66` : '0 1px 3px rgba(45,37,32,0.06)',
              }}
            >
              <span
                className="font-fredoka font-600 leading-snug px-6"
                style={{ color: isActive ? '#fff' : s.accent, fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </Reveal>

      <div className="max-w-xl mx-auto mt-8 min-h-[3rem]">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="bg-white border border-[#2D2520]/10 rounded-2xl px-6 py-5 sm:px-7 sm:py-6"
              style={{ borderTopWidth: 3, borderTopColor: active.accent }}
            >
              <p className="font-fredoka text-base mb-2.5" style={{ color: active.accent }}>
                {active.name}
              </p>
              {active.body.map((para, i) => (
                <p
                  key={i}
                  className={`font-nunito text-[#2D2520]/70 text-sm leading-relaxed ${i > 0 ? 'mt-3' : ''} ${para.italic ? 'italic' : ''}`}
                >
                  {para.text}
                </p>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-nunito text-[#2D2520]/40 text-sm text-center italic"
            >
              Select a strategy to see how it can help.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* The Reset Zone — a calm, supervised-space concept sitting beneath
          the three self-calming strategies. Kept as plain centred text, no
          card treatment, so it reads as lightweight explanatory context
          rather than competing with the interactive circles/panel above. */}
      <Reveal className="max-w-2xl mx-auto text-center mt-12">
        <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug inline-flex items-center gap-2">
          <Hourglass size={18} className="text-[#E8A020] flex-shrink-0" aria-hidden="true" />
          The Reset Zone
        </h3>
        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
          Our Reset Zone provides a calm, supervised space where children can temporarily step away from an activity, reduce demands and use a self-calming strategy before deciding how they would like to continue. It is not a punishment, exclusion area or reward, but a supportive space designed to encourage regulation, co-regulation and independence. A visual sand timer may be used to provide predictability around the length of a pause, with flexibility depending on the child's needs. When ready, children are supported to choose whether to return to the activity, try something different or continue independently.
        </p>
      </Reveal>

      {/* Scholarly reference for the research cited above — same treatment as
          the Learning Pyramid's own reference note directly above this
          section (small, muted, border-t separator). */}
      <div className="max-w-2xl mx-auto mt-8 sm:mt-10 pt-5 border-t border-[#2D2520]/8">
        <p className="font-nunito text-[#2D2520]/45 text-xs leading-relaxed">
          Reference: Bennett, J., Parsons, S., &amp; Kovshoff, H. (2024). Developing the emotion regulation skills of autistic pupils in educational settings: A systematic literature review. Journal of Research in Special Educational Needs, 24(3), 475-491.
        </p>
      </div>
    </div>
  );
}
