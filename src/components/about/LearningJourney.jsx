import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Lightbulb, Mountain, BrainCircuit, Search, Sprout, RotateCw } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const stages = [
  {
    num: 1,
    title: 'Relationship',
    accent: '#2d8c62',
    Icon: HeartHandshake,
    body: 'Children learn through people before they learn through content. We take time to know, listen to and understand every child.',
  },
  {
    num: 2,
    title: 'Curiosity',
    accent: '#b8790a',
    Icon: Lightbulb,
    body: "Puzzles, surprises and interesting questions spark curiosity, turning a child's attention into real motivation to learn.",
  },
  {
    num: 3,
    title: 'Challenge',
    accent: '#4a7eb8',
    Icon: Mountain,
    body: "We find each child's perfect level of challenge — enough to stretch their thinking without ever feeling overwhelming.",
  },
  {
    num: 4,
    title: 'Thinking',
    accent: '#7a48c0',
    Icon: BrainCircuit,
    body: 'We ask questions, not answers. Children explain what they notice, predict and decide, because their thinking matters.',
  },
  {
    num: 5,
    title: 'Reflection',
    accent: '#c05050',
    Icon: Search,
    body: "We pause to look back together: what happened, what surprised us, and what we'd try differently next time.",
  },
  {
    num: 6,
    title: 'Transfer',
    accent: '#2a8c88',
    Icon: Sprout,
    body: "We connect today's thinking to everyday life — at school, at home, and in every challenge still to come.",
  },
];

const RADIUS_PERCENT = 38;
const ARROW_TRIM_DEG = 14;

function pointAtAngle(degrees, radius = RADIUS_PERCENT) {
  const rad = degrees * (Math.PI / 180);
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

// Small curved connectors between consecutive stages only (1→2→3→4→5→6) —
// deliberately no arrow from 6 back to 1, so it reads as a guided path
// rather than a closed loop. Trimmed short of each icon so arrowheads
// stay subtle and don't crowd the stages themselves.
function ConnectorArrows() {
  return (
    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <marker id="journey-arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#E8A020" fillOpacity="0.5" />
        </marker>
      </defs>
      {stages.slice(0, -1).map((_, i) => {
        const startDeg = i * 60 - 90 + ARROW_TRIM_DEG;
        const endDeg = (i + 1) * 60 - 90 - ARROW_TRIM_DEG;
        const start = pointAtAngle(startDeg);
        const end = pointAtAngle(endDeg);
        return (
          <path
            key={i}
            d={`M ${start.x},${start.y} A ${RADIUS_PERCENT},${RADIUS_PERCENT} 0 0,1 ${end.x},${end.y}`}
            fill="none"
            stroke="#E8A020"
            strokeOpacity="0.45"
            strokeWidth="0.35"
            strokeLinecap="round"
            markerEnd="url(#journey-arrowhead)"
          />
        );
      })}
    </svg>
  );
}

function CenterLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-[#E8A020] rounded-full flex items-center justify-center shadow-lg shadow-[#E8A020]/30 border-4 border-[#FAFAF7]">
        <span className="text-white text-3xl lg:text-4xl leading-none">♜</span>
      </div>
      <span className="font-fredoka text-[#2D2520]/70 text-xs lg:text-sm text-center leading-tight max-w-[6rem]">
        The Learning<br />Journey
      </span>
    </div>
  );
}

function DesktopCircle({ active, hovered, onSelect, onHover, panelId }) {
  return (
    <div className="hidden lg:block relative mx-auto" style={{ width: '100%', maxWidth: 760, aspectRatio: '1 / 1' }}>
      <ConnectorArrows />
      <CenterLogo />
      {stages.map((stage, i) => {
        const { x, y } = pointAtAngle(i * 60 - 90);
        const isLit = active === i || hovered === i;
        return (
          // Positioning lives on this plain, non-animated element so its
          // `translate(-50%, -50%)` centering can't be clobbered by Framer
          // Motion, which manages `transform` itself on motion.* elements
          // for scale/opacity animation.
          <div
            key={stage.num}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => onSelect(active === i ? null : i)}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(i)}
              onBlur={() => onHover(null)}
              aria-expanded={isLit}
              aria-controls={panelId}
              className="group flex flex-col items-center gap-2 focus-visible:outline-none"
            >
              <span
                className="relative rounded-full flex items-center justify-center shadow-sm transition-all duration-300"
                style={{
                  width: 76,
                  height: 76,
                  backgroundColor: isLit ? stage.accent : `${stage.accent}15`,
                  border: `3px solid ${stage.accent}${isLit ? '' : '30'}`,
                  transform: isLit ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isLit ? `0 6px 20px ${stage.accent}45` : undefined,
                }}
              >
                <stage.Icon size={32} style={{ color: isLit ? '#fff' : stage.accent }} />
                <span
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-nunito font-800 shadow"
                  style={{ backgroundColor: stage.accent }}
                >
                  {stage.num}
                </span>
              </span>
              <span className="font-fredoka text-lg whitespace-nowrap" style={{ color: stage.accent }}>{stage.title}</span>
            </button>
          </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function RevealPanel({ activeStage, panelId }) {
  return (
    <div id={panelId} className="max-w-lg mx-auto mt-8 lg:mt-10 min-h-[7rem]">
      <AnimatePresence mode="wait">
        {activeStage ? (
          <motion.div
            key={activeStage.num}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bg-white rounded-2xl border-l-4 px-6 py-5 shadow-sm text-center lg:text-left"
            style={{ borderColor: activeStage.accent }}
          >
            <h3 className="font-fredoka text-lg mb-1.5" style={{ color: activeStage.accent }}>
              {activeStage.num}. {activeStage.title}
            </h3>
            <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{activeStage.body}</p>
          </motion.div>
        ) : (
          <motion.p
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-nunito text-[#2D2520]/40 text-sm text-center italic"
          >
            Hover or tap a stage above to see how it works.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileList() {
  return (
    <div className="lg:hidden">
      <div className="flex justify-center mb-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-[#E8A020] rounded-full flex items-center justify-center shadow-lg shadow-[#E8A020]/30">
            <span className="text-white text-2xl leading-none">♜</span>
          </div>
          <span className="font-fredoka text-[#2D2520]/70 text-sm">The Learning Journey</span>
        </div>
      </div>

      <div className="space-y-5">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.num}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
            className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm"
          >
            <div
              className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stage.accent}15`, border: `2px solid ${stage.accent}30` }}
            >
              <stage.Icon size={18} style={{ color: stage.accent }} />
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-nunito font-800 shadow"
                style={{ backgroundColor: stage.accent }}
              >
                {stage.num}
              </span>
            </div>
            <div>
              <h3 className="font-fredoka text-base mb-1" style={{ color: stage.accent }}>{stage.title}</h3>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{stage.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function LearningJourney() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const panelId = useId();
  const activeStage = stages[hovered !== null ? hovered : active] ?? null;

  return (
    <div>
      <DesktopCircle active={active} hovered={hovered} onSelect={setActive} onHover={setHovered} panelId={panelId} />
      <div className="hidden lg:block">
        <RevealPanel activeStage={activeStage} panelId={panelId} />
      </div>

      <MobileList />

      {/* Cycle continues note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 lg:mt-10 flex items-center justify-center gap-3 bg-[#F5F3EE] rounded-2xl px-6 py-4 max-w-md mx-auto text-center"
      >
        <RotateCw size={18} className="text-[#E8A020] flex-shrink-0" />
        <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">
          <span className="font-700 text-[#2D2520]">The cycle continues.</span> Every session builds on the last.
        </p>
      </motion.div>
    </div>
  );
}
