import { motion } from 'framer-motion';
import {
  Sparkles, Puzzle, TrendingUp, Presentation, Users, HeartHandshake, Compass, MapPin, ChevronRight,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// Seven adaptable dimensions, arranged to fill a 3-top / 1-left / 1-right /
// 2-bottom ring around the child on desktop (see `gridArea` below). Six
// colours come from the site's existing stage-accent rotation (also used by
// LearningJourney and the Learning Framework page); the seventh — Choice —
// deliberately uses the site's own primary gold rather than a rotation
// colour, since it's the one dimension that's literally about the child's
// own input.
const dimensions = [
  {
    area: 'top1', accent: '#2d8c62', Icon: Puzzle, tag: 'Activity',
    label: 'What we play', body: 'Games and puzzles, solo or together', dot: 'bottom',
  },
  {
    area: 'top2', accent: '#c9860f', Icon: TrendingUp, tag: 'Difficulty',
    label: 'How challenging it is', body: 'Simpler steps or bigger stretches', dot: 'bottom',
  },
  {
    area: 'top3', accent: '#4a7eb8', Icon: Presentation, tag: 'Presentation',
    label: 'How we explain it', body: 'Shown, talked through, or explored hands-on', dot: 'bottom',
  },
  {
    area: 'left', accent: '#7a48c0', Icon: Users, tag: 'Interaction',
    label: 'How they engage', body: 'Alone, guided, together or in friendly competition', dot: 'right',
  },
  {
    area: 'right', accent: '#c05050', Icon: HeartHandshake, tag: 'Support',
    label: 'How we support them', body: 'From a gentle prompt to hands-on help', dot: 'left',
  },
  {
    area: 'bottom1', accent: '#E8A020', Icon: Compass, tag: 'Choice',
    label: 'Their choices', body: 'Real input into what they try', dot: 'top',
  },
  {
    area: 'bottom2', accent: '#2a8c88', Icon: MapPin, tag: 'Setting',
    label: 'Where & how they learn', body: 'Individually, in pairs, or in a group', dot: 'top',
  },
];

const outcomeSteps = ['Engagement', 'Thinking', 'Reflection', 'Development'];

const dotPosition = {
  bottom: 'left-1/2 -bottom-1.5 -translate-x-1/2',
  top: 'left-1/2 -top-1.5 -translate-x-1/2',
  left: 'top-1/2 -left-1.5 -translate-y-1/2',
  right: 'top-1/2 -right-1.5 -translate-y-1/2',
};

function DimensionCard({ d, compact = false }) {
  const { Icon } = d;
  return (
    <div
      className={`relative bg-white border border-[#2D2520]/8 rounded-2xl border-l-4 ${compact ? 'p-4' : 'p-5'}`}
      style={{ borderLeftColor: d.accent }}
    >
      {!compact && (
        <span
          className={`hidden lg:block absolute w-3 h-3 rounded-full border-2 border-[#FAFAF7] ${dotPosition[d.dot]}`}
          style={{ backgroundColor: d.accent }}
          aria-hidden="true"
        />
      )}
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${d.accent}18` }}>
          <Icon size={15} style={{ color: d.accent }} />
        </span>
        <span className="font-nunito text-[10px] font-800 uppercase tracking-wide" style={{ color: d.accent }}>{d.tag}</span>
      </div>
      <p className="font-fredoka text-[#2D2520] text-sm leading-snug mb-1">{d.label}</p>
      <p className="font-nunito text-[#2D2520]/55 text-xs leading-snug">{d.body}</p>
    </div>
  );
}

function ChildCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-3xl flex flex-col items-center justify-center text-center px-6 py-8 ${className}`}
      style={{ boxShadow: '0 0 0 1px rgba(45,37,32,0.06), 0 0 50px rgba(232,160,32,0.25)' }}
    >
      <span className="font-nunito text-[#b8790a] text-[11px] font-800 uppercase tracking-widest mb-2">The constant</span>
      <p className="font-fredoka text-[#2D2520] text-xl sm:text-2xl leading-tight mb-2">Individual Child</p>
      <p className="font-nunito text-[#2D2520]/55 text-xs sm:text-sm leading-snug max-w-[14rem]">
        Learning goals, strengths, interests &amp; needs
      </p>
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
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Personalising the approach
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
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 mb-14"
      >
        {/* Desktop / large tablet — child surrounded on all sides via a
            named CSS grid (3 top, 1 each side, 2 bottom = 7), no literal
            circle or absolute-position trigonometry. */}
        <div
          className="hidden lg:grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateAreas: '"top1 top2 top3" "left center right" "bottom1 center bottom2"',
          }}
        >
          {dimensions.map((d) => (
            <div key={d.area} style={{ gridArea: d.area }} className="flex items-center">
              <DimensionCard d={d} />
            </div>
          ))}
          <div style={{ gridArea: 'center' }} className="flex items-center px-4">
            <ChildCard className="w-full h-full" />
          </div>
        </div>

        {/* Tablet — child as a banner above a simplified 2-column grid */}
        <div className="hidden sm:block lg:hidden">
          <ChildCard className="mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {dimensions.map((d) => (
              <DimensionCard key={d.area} d={d} compact />
            ))}
          </div>
        </div>

        {/* Mobile — single stacked column */}
        <div className="sm:hidden">
          <ChildCard className="mb-6" />
          <div className="space-y-3">
            {dimensions.map((d) => (
              <DimensionCard key={d.area} d={d} compact />
            ))}
          </div>
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
