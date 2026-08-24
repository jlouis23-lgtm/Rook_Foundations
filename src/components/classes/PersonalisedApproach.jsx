import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Seven adaptable dimensions, placed evenly around a circle (angle = -90deg
// + i*360/7, i.e. one point due north, the rest spaced every ~51.4deg
// clockwise) using plain unit-circle coordinates. The SAME percentage table
// drives both the SVG connecting lines (viewBox 0-100, preserveAspectRatio
// "none") and the absolutely-positioned label divs (left/top %) — because
// the container itself is a wide rectangle rather than a perfect square,
// this uniform circle math renders as a natural, balanced ellipse for free,
// with no separate radiusX/radiusY needed. Every label is centred on its
// own point (translate(-50%,-50%)) rather than anchored to hang off it, so
// only half the label's width needs clearance from the container edge —
// this keeps the diagram safe at narrow (sm:) widths without clipping.
// `align` still varies per side purely for text-alignment nuance.
const dimensions = [
  {
    key: 'activity', accent: '#2d8c62', label: 'Activity',
    body: 'Different games, puzzles and competitive or cooperative activities.',
    x: 0, y: -1, align: 'center',
  },
  {
    key: 'presentation', accent: '#4a7eb8', label: 'Presentation',
    body: 'Visual demonstrations, verbal explanations, hands-on exploration and written representation.',
    x: 0.7818, y: -0.6235, align: 'left',
  },
  {
    key: 'interaction', accent: '#7a48c0', label: 'Interaction',
    body: 'Independent work, instructor questioning, collaborative problem-solving and competitive play.',
    x: 0.9749, y: 0.2225, align: 'left',
  },
  {
    key: 'support', accent: '#c05050', label: 'Support',
    body: 'Independent attempts, questions, prompts, hints, demonstrations and direct support where necessary.',
    x: 0.4339, y: 0.9010, align: 'left',
  },
  {
    key: 'choice', accent: '#E8A020', label: 'Choice',
    body: 'Child choice where appropriate, instructor direction where needed, and alternative activities when engagement is low.',
    x: -0.4339, y: 0.9010, align: 'right',
  },
  {
    key: 'difficulty', accent: '#c9860f', label: 'Difficulty',
    body: 'Simpler or more complex challenges with graduated difficulty.',
    x: -0.9749, y: 0.2225, align: 'right',
  },
  {
    key: 'setting', accent: '#2a8c88', label: 'Setting',
    body: 'Individual, paired, small-group, competitive and collaborative environments.',
    x: -0.7818, y: -0.6235, align: 'right',
  },
];

const LINE_R_DESKTOP = 24;
const LINE_R_MOBILE = 29;
const LABEL_R_DESKTOP = 36;
const LABEL_R_MOBILE = 37;

// Radius (same unit-circle scale as LINE_R/LABEL_R) at which each line
// STARTS, rather than starting at the literal centre point (50,50). This is
// the "protective zone" around the centre label: since every line was
// previously drawn from dead centre outward, its inner segment always ran
// directly under the centre text. Trimming the start point outward to this
// radius — for every line equally, so length/weight/symmetry are preserved
// exactly as before — leaves a clean, unobstructed gap around the label
// with no line ever entering it.
const CENTRE_GAP_DESKTOP = 18;
const CENTRE_GAP_MOBILE = 21;

const outcomeSteps = ['Engagement', 'Thinking', 'Reflection', 'Development'];

function pct(v) { return `${v}%`; }

function ConnectorLines({ accentOpacity = 0.35, gap, lineR }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {dimensions.map((d) => (
        <line
          key={d.key}
          x1={50 + d.x * gap} y1={50 + d.y * gap}
          x2={50 + d.x * lineR} y2={50 + d.y * lineR}
          stroke={d.accent}
          strokeWidth="0.35"
          strokeOpacity={accentOpacity}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// Desktop centre label deliberately contains nothing but the name itself —
// no supporting line, no divider — so the "protective zone" the connecting
// lines now respect reads as genuinely clear space. Mobile keeps the
// supporting line, since only the desktop label was asked to be simplified.
function CentreLabel({ compact = false }) {
  return (
    <div
      className="absolute text-center"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: compact ? '9rem' : '11rem' }}
    >
      <p className={`font-fredoka text-[#2D2520] leading-tight ${compact ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
        Individual Child
      </p>
      {compact && (
        <>
          <div className="bg-[#E8A020] rounded-full mx-auto w-6 h-[3px] my-1.5" />
          <p className="font-nunito text-[#2D2520]/50 leading-snug text-[10px]">
            Learning goals, strengths, interests &amp; needs
          </p>
        </>
      )}
    </div>
  );
}

// Desktop / tablet — full radial diagram with permanently-visible
// descriptions, matching how LearningJourney's own desktop pyramid keeps
// every description visible rather than requiring interaction.
function DesktopDiagram() {
  return (
    <div className="relative w-full py-10" style={{ height: 'clamp(560px, 46vw, 680px)' }}>
      <ConnectorLines gap={CENTRE_GAP_DESKTOP} lineR={LINE_R_DESKTOP} />
      <CentreLabel />
      {dimensions.map((d) => (
        <div
          key={d.key}
          className="absolute w-32 sm:w-36 lg:w-44"
          style={{
            left: pct(50 + d.x * LABEL_R_DESKTOP),
            top: pct(50 + d.y * LABEL_R_DESKTOP),
            transform: 'translate(-50%, -50%)',
            textAlign: d.align,
          }}
        >
          <p className="font-nunito text-xs font-800 uppercase tracking-widest mb-1" style={{ color: d.accent }}>
            {d.label}
          </p>
          <p className="font-nunito text-[#2D2520]/60 text-xs leading-snug">{d.body}</p>
        </div>
      ))}
    </div>
  );
}

// Mobile — compact, headings only, sized to fit one screen. Tapping a
// heading reveals its description in a single shared panel beneath (not
// seven permanent sections), reusing the same tap-to-reveal interaction
// LearningJourney's own MobilePyramid already uses for the same reason.
function MobileDiagram() {
  const [activeKey, setActiveKey] = useState(null);
  const active = dimensions.find((d) => d.key === activeKey);

  return (
    <div>
      <div className="relative w-full" style={{ height: '380px' }}>
        <ConnectorLines accentOpacity={0.3} gap={CENTRE_GAP_MOBILE} lineR={LINE_R_MOBILE} />
        <CentreLabel compact />
        {dimensions.map((d) => {
          const isActive = activeKey === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveKey((k) => (k === d.key ? null : d.key))}
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls="personalised-approach-detail"
              className="absolute font-nunito text-[10px] font-800 uppercase tracking-wide whitespace-nowrap px-1 py-0.5 -m-1 outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] rounded"
              style={{
                left: pct(50 + d.x * LABEL_R_MOBILE),
                top: pct(50 + d.y * LABEL_R_MOBILE),
                transform: 'translate(-50%, -50%)',
                color: d.accent,
                opacity: isActive ? 1 : 0.85,
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <div id="personalised-approach-detail" className="min-h-[3.5rem] px-6">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="text-center pt-3 border-t"
              style={{ borderColor: `${active.accent}40` }}
            >
              <p className="font-nunito text-xs font-800 uppercase tracking-widest mb-1.5" style={{ color: active.accent }}>
                {active.label}
              </p>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{active.body}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-nunito text-[#2D2520]/35 text-xs text-center italic pt-3"
            >
              Tap a heading above to explore it
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PersonalisedApproach() {
  return (
    <div className="py-4">
      {/* Heading — same rhythm as every other block in this section */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            Personalising the approach
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            One Goal. Different Routes.
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Every child is working toward the same kind of growth. How I get them there adapts to who they are.
          </p>
        </motion.div>
      </div>

      {/* Diagram — full-width breakout, matching the pyramid/progress diagrams above */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-4xl mx-auto relative z-10 mb-10"
      >
        <div className="hidden sm:block px-6 lg:px-12">
          <DesktopDiagram />
        </div>
        <div className="sm:hidden">
          <MobileDiagram />
        </div>
      </motion.div>

      {/* Outcome chain */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3"
      >
        {outcomeSteps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap">
              {step}
            </span>
            {i < outcomeSteps.length - 1 && <ChevronRight size={16} className="text-[#E8A020]/50 flex-shrink-0" aria-hidden="true" />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
