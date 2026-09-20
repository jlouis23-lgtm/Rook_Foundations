import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const INK = '#2D2520';
const GOLD = '#E8A020';

const gameExamples = ['Chess', 'Strategy Games', 'Puzzles', 'Board Games', 'Problem Solving Activities'];

// The four-stage loop. `angle` is the node's position on the middle ring in
// SVG screen degrees (0 = right, 90 = down), so the cycle reads clockwise from
// the top left: Select, Adapt, Observe, Refine, then back to Select.
const stages = [
  { key: 'select', label: 'Select', angle: -135, accent: '#2d8c62', text: '#237a53', body: 'Choosing activities to suit the child and the purpose of the session.' },
  { key: 'adapt', label: 'Adapt', angle: -45, accent: '#4a7eb8', text: '#3d6a9c', body: 'Adjusting rules, difficulty, time, equipment or support.' },
  { key: 'observe', label: 'Observe', angle: 45, accent: '#7a48c0', text: '#6a3aac', body: 'Noticing how the child engages, responds and communicates.' },
  { key: 'refine', label: 'Refine', angle: 135, accent: '#c9860f', text: '#a86f0a', body: 'Using observations to inform what comes next.' },
];

const skills = [
  { name: 'Strategic Thinking', body: 'Considering different options, anticipating consequences and developing a plan before acting.' },
  { name: 'Planning', body: 'Thinking ahead and organising the steps towards a goal.' },
  { name: 'Attention & Concentration', body: 'Staying focused on an activity and sustaining attention over time.' },
  { name: 'Creativity & Imagination', body: 'Coming up with original ideas and different ways to approach a challenge.' },
  { name: 'Emotional Regulation & Resilience', body: 'How a child responds to winning, losing and frustration, and keeps going.' },
  { name: 'Problem Solving', body: 'Working out how to approach a challenge and trying different routes through it.' },
  { name: 'Decision Making', body: 'Weighing up choices and committing to a decision.' },
  { name: 'Memory & Recall', body: 'Remembering rules, patterns and earlier moves, and using them again.' },
  { name: 'Communication & Interaction', body: 'Sharing ideas, taking turns and responding to others.' },
  { name: 'Independence', body: 'Working through a challenge with growing confidence and less prompting.' },
];

const feedbackChain = ['Game', 'Personalised adaptation', 'Observation', 'Skills observed', 'Review', 'Future activity or adaptation'];

const exampleOptions = [
  'simplify the position',
  'provide additional thinking time',
  'introduce a visual prompt',
  'change the rules or objective',
  'provide an alternative game with a similar thinking challenge',
];

// Geometry, in a 100 x 100 space centred on (50, 50).
const RING_R = 25.5;
const SKILL_R = 43;
const SKILL_START = -72;
const SKILL_STEP = 36;
const ARC_MARGIN = 26;

const rad = (deg) => (deg * Math.PI) / 180;
const point = (r, deg) => [50 + r * Math.cos(rad(deg)), 50 + r * Math.sin(rad(deg))];
const arcPath = (a0, a1, r) => {
  const [x0, y0] = point(r, a0);
  const [x1, y1] = point(r, a1);
  return `M ${x0.toFixed(3)} ${y0.toFixed(3)} A ${r} ${r} 0 0 1 ${x1.toFixed(3)} ${y1.toFixed(3)}`;
};
const skillAngle = (i) => SKILL_START + i * SKILL_STEP;

function Heading() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
      <h3 className="font-fredoka text-[#2D2520] leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
        The Rook Foundations Personalised Enrichment Review
      </h3>
      <p className="font-nunito text-[#2D2520]/60 text-base mt-3 leading-relaxed">
        Using games as a starting point for observing, adapting and supporting individual development.
      </p>
    </div>
  );
}

function DesktopDiagram({ activeIndex, onSelect }) {
  return (
    <div
      className="relative w-full max-w-[920px] mx-auto aspect-square"
      style={{ containerType: 'inline-size' }}
      role="group"
      aria-label="Diagram of the Personalised Enrichment Review: a game at the centre, a Select, Adapt, Observe, Refine loop around it, and ten broad skill areas on the outside"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true" focusable="false">
        <defs>
          {stages.map((s) => (
            <marker key={s.key} id={`erd-arrow-${s.key}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="2.6" markerHeight="2.6" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M1 1 L9 5 L1 9 Z" fill={s.accent} />
            </marker>
          ))}
        </defs>

        <circle cx="50" cy="50" r={SKILL_R} fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.25" strokeDasharray="0.8 1.2" />
        <circle cx="50" cy="50" r={RING_R} fill="none" stroke={INK} strokeOpacity="0.07" strokeWidth="0.3" />

        {skills.map((_, i) => {
          const a = skillAngle(i);
          const [x0, y0] = point(RING_R, a);
          const [x1, y1] = point(SKILL_R, a);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={GOLD}
              strokeOpacity={0.4}
              strokeWidth={0.25}
              strokeDasharray="0.8 0.9"
              strokeLinecap="round"
            />
          );
        })}

        {stages.map((s) => (
          <path
            key={s.key}
            d={arcPath(s.angle + ARC_MARGIN, s.angle + 90 - ARC_MARGIN, RING_R)}
            fill="none"
            stroke={s.accent}
            strokeWidth="0.5"
            strokeLinecap="round"
            markerEnd={`url(#erd-arrow-${s.key})`}
          />
        ))}
      </svg>

      {/* Centre: the game */}
      <div
        className="absolute rounded-full bg-[#2D2520] flex flex-col items-center justify-center text-center shadow-[0_0_0_0.9cqw_rgba(232,160,32,0.18)]"
        style={{ left: '50%', top: '50%', width: '26%', aspectRatio: '1', transform: 'translate(-50%, -50%)', padding: '2.2cqw' }}
      >
        <p className="font-fredoka text-[#E8A020] uppercase tracking-widest leading-none" style={{ fontSize: 'clamp(13px, 2.4cqw, 24px)' }}>
          The Game
        </p>
        <p className="font-nunito text-white/85 leading-snug" style={{ fontSize: 'clamp(10.5px, 1.5cqw, 16px)', marginTop: '1cqw' }}>
          {gameExamples.join(' • ')}
        </p>
      </div>

      {/* Middle: select, adapt, observe, refine */}
      {stages.map((s) => {
        const [x, y] = point(RING_R, s.angle);
        return (
          <div
            key={s.key}
            className="absolute bg-white rounded-2xl text-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '17.5%',
              transform: 'translate(-50%, -50%)',
              border: `1.5px solid ${s.accent}66`,
              padding: '1cqw 1.1cqw',
            }}
          >
            <p className="font-fredoka uppercase tracking-widest leading-none" style={{ color: s.text, fontSize: 'clamp(11.5px, 1.7cqw, 18px)' }}>
              {s.label}
            </p>
            <p className="font-nunito text-[#2D2520]/70 leading-snug" style={{ fontSize: 'clamp(10.5px, 1.35cqw, 14px)', marginTop: '0.5cqw' }}>
              {s.body}
            </p>
          </div>
        );
      })}

      {/* Outer: ten broad skill areas */}
      {skills.map((skill, i) => {
        const [x, y] = point(SKILL_R, skillAngle(i));
        const active = activeIndex === i;
        return (
          <button
            key={skill.name}
            type="button"
            onClick={() => onSelect(active ? null : i)}
            onMouseEnter={() => onSelect(i)}
            onFocus={() => onSelect(i)}
            aria-pressed={active}
            className={`absolute rounded-xl text-center font-nunito font-700 leading-tight transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] ${
              active ? 'bg-[#FCF1DE] border-[#E8A020] text-[#2D2520]' : 'bg-white border-[#2D2520]/12 text-[#2D2520]/85 hover:border-[#E8A020]/60'
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '12.5%',
              transform: 'translate(-50%, -50%)',
              borderWidth: 1.5,
              borderStyle: 'solid',
              padding: '0.9cqw 0.5cqw',
              fontSize: 'clamp(10.5px, 1.4cqw, 14.5px)',
            }}
          >
            {skill.name}
          </button>
        );
      })}
    </div>
  );
}

function MobileDiagram({ activeIndex, onSelect }) {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="w-full rounded-3xl bg-[#2D2520] text-center px-6 py-6">
        <p className="font-fredoka text-[#E8A020] uppercase tracking-widest text-lg leading-none">The Game</p>
        <p className="font-nunito text-white/85 text-sm leading-relaxed mt-3">{gameExamples.join(' • ')}</p>
      </div>

      <ChevronDown size={20} className="text-[#E8A020]/60 my-3" aria-hidden="true" />

      <div className="w-full">
        <p className="font-nunito text-[#2D2520]/50 text-xs font-800 uppercase tracking-widest text-center mb-4">Personalised enrichment</p>
        <div className="flex flex-col items-center">
          {stages.map((s, i) => (
            <Fragment key={s.key}>
              <div className="w-full rounded-2xl bg-white flex items-start gap-3 px-4 py-3.5" style={{ border: `1.5px solid ${s.accent}66` }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center font-fredoka text-white text-sm flex-shrink-0" style={{ backgroundColor: s.accent }}>
                  {i + 1}
                </span>
                <div>
                  <p className="font-fredoka uppercase tracking-widest text-sm leading-tight" style={{ color: s.text }}>{s.label}</p>
                  <p className="font-nunito text-[#2D2520]/70 text-sm leading-snug mt-1">{s.body}</p>
                </div>
              </div>
              {i < stages.length - 1 && <ChevronDown size={18} className="text-[#E8A020]/60 my-1.5" aria-hidden="true" />}
            </Fragment>
          ))}
          <div className="flex items-center gap-2 mt-3 font-nunito text-[#2D2520]/55 text-xs font-700">
            <RotateCcw size={14} className="text-[#E8A020] flex-shrink-0" aria-hidden="true" />
            Then back to Select, informed by what we observed
          </div>
        </div>
      </div>

      <ChevronDown size={20} className="text-[#E8A020]/60 my-3" aria-hidden="true" />

      <div className="w-full">
        <p className="font-nunito text-[#2D2520]/50 text-xs font-800 uppercase tracking-widest text-center mb-4">Ten broad skill areas</p>
        <div className="grid grid-cols-2 gap-2.5">
          {skills.map((skill, i) => {
            const active = activeIndex === i;
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => onSelect(active ? null : i)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-3 min-h-[3.25rem] text-center font-nunito font-700 text-sm leading-tight transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] ${
                  active ? 'bg-[#FCF1DE] border-[#E8A020] text-[#2D2520]' : 'bg-white border-[#2D2520]/12 text-[#2D2520]/85'
                }`}
                style={{ borderWidth: 1.5, borderStyle: 'solid' }}
              >
                {skill.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SkillPanel({ activeIndex }) {
  const skill = activeIndex === null ? null : skills[activeIndex];
  return (
    <div className="mt-6 max-w-xl mx-auto min-h-[5.75rem] flex items-center justify-center" aria-live="polite">
      {skill ? (
        <div className="w-full bg-[#FAFAF7] border border-[#2D2520]/10 rounded-2xl px-5 py-4 text-center" style={{ borderTopWidth: 3, borderTopColor: GOLD }}>
          <p className="font-fredoka text-[#2D2520] text-base">{skill.name}</p>
          <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed mt-1">{skill.body}</p>
        </div>
      ) : (
        <p className="font-nunito text-[#2D2520]/40 text-sm italic text-center">Hover over or tap a skill area to see what we look for.</p>
      )}
    </div>
  );
}

function FeedbackChain() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
      {feedbackChain.map((step, i) => (
        <Fragment key={step}>
          <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2">
            {step}
          </span>
          {i < feedbackChain.length - 1 && <ChevronRight size={16} className="text-[#E8A020]/50 flex-shrink-0" aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}

function WorkedExample() {
  return (
    <div className="max-w-2xl mx-auto bg-[#FAFAF7] border border-[#2D2520]/10 rounded-3xl p-6 sm:p-8">
      <p className="font-nunito text-[#b8790a] text-xs font-800 uppercase tracking-widest mb-3">An illustrative example</p>
      <p className="font-nunito text-[#2D2520] text-base font-700 leading-relaxed">A child finds a particular chess challenge difficult.</p>
      <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed mt-1.5 mb-3">Rather than simply moving on, the practitioner might:</p>
      <ul className="space-y-2">
        {exampleOptions.map((option) => (
          <li key={option} className="flex items-start gap-3 font-nunito text-[#2D2520]/75 text-sm leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] flex-shrink-0 mt-2" aria-hidden="true" />
            {option}
          </li>
        ))}
      </ul>
      <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed mt-4">
        The practitioner then observes how the child responds and records relevant observations. These observations can help inform the next activity.
      </p>
      <p className="font-nunito text-[#2D2520]/45 text-xs italic leading-relaxed mt-4 pt-4 border-t border-[#2D2520]/8">
        This shows how the process can work in practice. It is an example, not a prescribed intervention.
      </p>
    </div>
  );
}

export default function EnrichmentReviewDiagram() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div>
      <Heading />

      <Reveal>
        <div className="hidden md:block">
          <DesktopDiagram activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>
        <div className="md:hidden">
          <MobileDiagram activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>
      </Reveal>

      <SkillPanel activeIndex={activeIndex} />

      <Reveal className="mt-8 max-w-2xl mx-auto text-center">
        <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
          These are descriptive areas we look at, not scored, graded or diagnostic. Different games, activities and adaptations offer opportunities to explore different skills, and no single game develops every skill equally.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <FeedbackChain />
      </Reveal>

      <Reveal className="mt-12">
        <WorkedExample />
      </Reveal>
    </div>
  );
}
