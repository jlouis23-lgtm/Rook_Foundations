import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];

// Five stages, in order. Colours reuse five of the site's established
// six-stage rotation (skipping red), in the same left-to-right order
// already used for the Learning Pyramid above, so this reads as a sibling
// framework rather than an unrelated palette. Only "respond" carries the
// extra regulation cross-reference, per the brief.
const stages = [
  {
    num: '01',
    key: 'identify',
    title: 'IDENTIFY',
    prompt: 'What is happening?',
    accent: '#2d8c62',
    body: "We observe what is happening and consider the circumstances surrounding the behaviour. We look at what happened immediately beforehand, what the child is doing and whether there are patterns within the activity or environment.",
  },
  {
    num: '02',
    key: 'understand',
    title: 'UNDERSTAND',
    prompt: 'What might be contributing?',
    accent: '#c9860f',
    body: "We consider what may be contributing to the behaviour, such as frustration, difficulty understanding an instruction, a change in activity, communication difficulties, sensory demands or uncertainty. We remain curious rather than assuming we know why a child is behaving in a particular way.",
  },
  {
    num: '03',
    key: 'respond',
    title: 'RESPOND',
    prompt: 'What can we do now?',
    accent: '#4a7eb8',
    body: "We respond calmly and proportionately, adapting the activity or environment where appropriate. This may include changing an instruction, providing additional processing time, offering a choice, reducing immediate demands, changing the activity or providing a short pause.",
    regulationLink: true,
  },
  {
    num: '04',
    key: 'communicate',
    title: 'COMMUNICATE',
    prompt: 'Who needs to know?',
    accent: '#7a48c0',
    body: "Where appropriate, we share relevant observations with the adults supporting the child. This can help us understand patterns, maintain consistency and identify approaches that may support participation in future sessions.",
  },
  {
    num: '05',
    key: 'prevent',
    title: 'PREVENT',
    prompt: 'What can we learn for next time?',
    accent: '#2a8c88',
    body: "We use what we learn to inform future sessions. Where an activity, instruction, environment or transition appears to have contributed to difficulty, we consider whether the experience can be adapted to make future participation more accessible and successful.",
  },
];

// Interlocking chevron geometry, in pixels (constant depth regardless of
// each segment's own fluid width, which is how real chevron/process
// diagrams read best). Segments overlap by NOTCH so the point of one tucks
// under the notch of the next, forming one continuous flowing chain.
const NOTCH = 22;

function chevronClipPath(isFirst, isLast) {
  const rightTip = isLast ? '100% 0, 100% 100%' : `calc(100% - ${NOTCH}px) 0, 100% 50%, calc(100% - ${NOTCH}px) 100%`;
  const leftNotch = isFirst ? '0 100%' : `0 100%, ${NOTCH}px 50%`;
  return `polygon(0 0, ${rightTip}, ${leftNotch})`;
}

function DesktopChevrons({ activeKey, onHover, onLeave, onSelect }) {
  return (
    <div className="hidden md:flex max-w-5xl mx-auto" role="group" aria-label="Five-stage response framework: Identify, Understand, Respond, Communicate, Prevent">
      {stages.map((s, i) => {
        const isFirst = i === 0;
        const isLast = i === stages.length - 1;
        const isActive = activeKey === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onMouseEnter={() => onHover(s.key)}
            onMouseLeave={onLeave}
            onFocus={() => onHover(s.key)}
            onBlur={onLeave}
            onClick={() => onSelect(s.key)}
            aria-pressed={isActive}
            className="relative flex-1 h-28 lg:h-32 flex flex-col items-center justify-center text-center outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-white"
            style={{
              backgroundColor: s.accent,
              clipPath: chevronClipPath(isFirst, isLast),
              marginLeft: isFirst ? 0 : -NOTCH,
              zIndex: isActive ? 20 : i + 1,
              transform: isActive ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
              boxShadow: isActive ? '0 16px 28px -12px rgba(45,37,32,0.45)' : '0 4px 10px -4px rgba(45,37,32,0.25)',
              paddingLeft: isFirst ? '1.25rem' : '2.25rem',
              paddingRight: isLast ? '1.25rem' : '2.25rem',
            }}
          >
            <span className="font-fredoka text-white/70 text-xs tracking-widest leading-none">{s.num}</span>
            <span className="font-fredoka text-white leading-tight mt-1" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)' }}>
              {s.title}
            </span>
            <span className="font-nunito text-white/85 leading-snug mt-1 px-1" style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.75rem)' }}>
              {s.prompt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MobileStack({ activeKey, onSelect }) {
  return (
    <div className="md:hidden max-w-md mx-auto space-y-2.5" role="group" aria-label="Five-stage response framework: Identify, Understand, Respond, Communicate, Prevent">
      {stages.map((s) => {
        const isActive = activeKey === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onSelect(s.key)}
            aria-pressed={isActive}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[#E8A020]"
            style={{
              backgroundColor: s.accent,
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isActive ? '0 10px 20px -10px rgba(45,37,32,0.4)' : '0 2px 6px -2px rgba(45,37,32,0.2)',
            }}
          >
            <span className="font-fredoka text-white/70 text-xs flex-shrink-0">{s.num}</span>
            <span className="flex-1">
              <span className="font-fredoka text-white text-sm block leading-tight">{s.title}</span>
              <span className="font-nunito text-white/85 text-xs block mt-0.5">{s.prompt}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StagePanel({ stage }) {
  if (!stage) {
    return (
      <p className="font-nunito text-[#2D2520]/40 text-sm text-center italic">
        Select a stage to see what it involves.
      </p>
    );
  }
  return (
    <div
      className="bg-white border border-[#2D2520]/10 rounded-2xl px-6 py-5 sm:px-7 sm:py-6"
      style={{ borderTopWidth: 3, borderTopColor: stage.accent }}
    >
      <p className="font-fredoka text-base mb-1" style={{ color: stage.accent }}>
        {stage.num} — {stage.title}
      </p>
      <p className="font-nunito text-[#2D2520]/45 text-xs italic mb-3">{stage.prompt}</p>
      <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{stage.body}</p>

      {stage.regulationLink && (
        <div className="mt-4 pt-4 border-t border-[#2D2520]/8">
          <p className="font-nunito text-[#2D2520] text-sm font-700 mb-2">Regulation may form part of this response.</p>
          <a
            href="#regulation-before-participation"
            className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#b8790a] transition-colors"
          >
            Explore Regulation Before Participation
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function BehaviourFramework() {
  const [hoverKey, setHoverKey] = useState(null);
  const [pinnedKey, setPinnedKey] = useState(null);
  const activeKey = hoverKey ?? pinnedKey;
  const activeStage = stages.find((s) => s.key === activeKey) || null;

  const handleSelect = (key) => setPinnedKey((prev) => (prev === key ? null : key));

  return (
    <div>
      <div className="text-center mb-10">
        <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
          Responding thoughtfully
        </span>
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Responding to Challenging Behaviour
        </h2>
      </div>

      <Reveal className="max-w-2xl mx-auto text-center mb-5">
        <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
          At Rook Foundations, we recognise that children may sometimes display behaviour that is difficult to understand or respond to during games and learning activities. Rather than focusing simply on stopping the behaviour, we consider what may be happening for the child, the activity and the surrounding environment, and use this understanding to support safe, meaningful participation.
        </p>
      </Reveal>

      <Reveal className="max-w-2xl mx-auto text-center mb-14" delay={0.05}>
        <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed italic">
          Our approach has been informed by Sarah Dove's five-stage approach to behaviour, outlined in Behaving Together in the Classroom (2021): Identifying, Understanding, Responding, Communicating and Preventing. Rook Foundations has adapted these principles for its own educational enrichment context.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <DesktopChevrons
          activeKey={activeKey}
          onHover={setHoverKey}
          onLeave={() => setHoverKey(null)}
          onSelect={handleSelect}
        />
        <MobileStack activeKey={activeKey} onSelect={handleSelect} />
      </Reveal>

      <div className="max-w-xl mx-auto mt-6 mb-16 min-h-[6rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey || 'hint'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <StagePanel stage={activeStage} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Philosophy statement */}
      <Reveal className="max-w-2xl mx-auto text-center mb-16">
        <div className="w-12 h-[3px] rounded-full bg-[#E8A020] mx-auto mb-6" aria-hidden="true" />
        <p className="font-fredoka text-[#2D2520]/85 italic font-light text-xl sm:text-2xl leading-relaxed mb-5">
          Our aim is <strong className="font-600 not-italic">participation</strong>, not simply compliance.
        </p>
        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed max-w-xl mx-auto">
          Challenging behaviour does not automatically mean that a child should be removed from an activity. Where it is safe and appropriate, we look for ways to reduce barriers, <strong className="font-700 text-[#2D2520]">adapt</strong> the experience and <strong className="font-700 text-[#2D2520]">support</strong> the child to remain involved. This may mean continuing with the original activity, changing how it is delivered, <strong className="font-700 text-[#2D2520]">choosing</strong> an alternative activity or allowing time to reset before deciding what to do next.
        </p>
      </Reveal>

      {/* Connection into Regulation Before Participation */}
      <Reveal className="max-w-md mx-auto text-center mb-10">
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2">
            Respond
          </span>
          <ChevronDown size={16} className="text-[#E8A020]/50" aria-hidden="true" />
          <span className="font-nunito text-[#2D2520]/70 text-sm bg-white border border-[#2D2520]/10 rounded-full px-4 py-2">
            When regulation is needed
          </span>
          <ChevronDown size={16} className="text-[#E8A020]/50" aria-hidden="true" />
          <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2">
            Regulation Before Participation
          </span>
        </div>
        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-6">
          When a child is experiencing heightened emotion, frustration or difficulty engaging, regulation strategies may form part of our response. Our Regulation Before Participation approach provides children with practical ways to pause, reset and decide how they would like to continue.
        </p>
        <a
          href="#regulation-before-participation"
          className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
        >
          Explore Regulation Before Participation
          <ChevronDown size={16} className="flex-shrink-0" />
        </a>
      </Reveal>

      {/* Professional boundaries — small and understated, matching the
          quiet disclaimer notes used elsewhere rather than a prominent
          callout. */}
      <div className="max-w-xl mx-auto pt-6 border-t border-[#2D2520]/8 text-center">
        <p className="font-nunito text-[#2D2520]/50 text-xs leading-relaxed italic">
          Professional boundaries: This approach forms part of Rook Foundations' educational enrichment practice. We do not provide clinical diagnosis, psychotherapy, counselling, behavioural therapy or specialist therapeutic intervention. Where a child's needs extend beyond our role, competence or capacity, we work with the school to consider appropriate support or involvement from relevant professionals.
        </p>
      </div>

      {/* Attribution — left unlinked; no verified official source page was
          available to link to, so an unlinked citation was used rather than
          an invented URL. */}
      <div className="max-w-xl mx-auto mt-5 text-center">
        <p className="font-nunito text-[#2D2520]/40 text-xs leading-relaxed">
          Informed by: Dove, S. (2021). Behaving Together in the Classroom: A Teacher's Guide to Nurturing Behaviour. Maidenhead: Open University Press / McGraw-Hill Education.
        </p>
      </div>
    </div>
  );
}
