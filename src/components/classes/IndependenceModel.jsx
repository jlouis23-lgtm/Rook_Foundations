// Seven stages, mirroring the visual system of the five-stage chevron model
// in BehaviourFramework.jsx directly beneath this one on the page: same
// interlocking notch/point geometry, same six-colour accent rotation (cycling
// back to green for stage seven, closing the loop rather than introducing a
// new colour), same numbering style and typography. Deliberately static (no
// hover/click reveal) and text-only (number + name, no prompt line), per the
// brief's explicit "no captions, no interactive element" instruction — this
// diagram matches the five-stage model's look, not its interaction.
import { Fragment } from 'react';

const INK = '#2D2520';

const stages = [
  { num: '01', title: 'PAUSE', accent: '#2d8c62' },
  { num: '02', title: 'THINK', accent: '#c9860f' },
  { num: '03', title: 'TRY', accent: '#4a7eb8' },
  { num: '04', title: 'SUPPORT', accent: '#7a48c0' },
  { num: '05', title: 'TRY AGAIN', accent: '#c05050' },
  { num: '06', title: 'REFLECT', accent: '#2a8c88' },
  { num: '07', title: 'INDEPENDENTLY APPLY', accent: '#2d8c62' },
];

// Same interlocking geometry as the five-stage model (NOTCH = 22px, identical
// clip-path shape), just spread across seven narrower segments instead of
// five.
const NOTCH = 22;

function chevronClipPath(isFirst, isLast) {
  const rightTip = isLast ? '100% 0, 100% 100%' : `calc(100% - ${NOTCH}px) 0, 100% 50%, calc(100% - ${NOTCH}px) 100%`;
  const leftNotch = isFirst ? '0 100%' : `0 100%, ${NOTCH}px 50%`;
  return `polygon(0 0, ${rightTip}, ${leftNotch})`;
}

function DesktopChevrons() {
  return (
    <div
      className="hidden md:flex max-w-5xl mx-auto"
      role="img"
      aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply"
    >
      {stages.map((s, i) => {
        const isFirst = i === 0;
        const isLast = i === stages.length - 1;
        return (
          <div
            key={s.num}
            className="relative flex-1 h-24 lg:h-28 flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: s.accent,
              clipPath: chevronClipPath(isFirst, isLast),
              marginLeft: isFirst ? 0 : -NOTCH,
              zIndex: i + 1,
              boxShadow: '0 4px 10px -4px rgba(45,37,32,0.25)',
              paddingLeft: isFirst ? '0.75rem' : '1.6rem',
              paddingRight: isLast ? '0.75rem' : '1.6rem',
            }}
          >
            <span className="font-fredoka text-white leading-tight" style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.92rem)' }}>
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// The principle behind the seven-stage sequence above: three inputs summing
// to one outcome, rather than another sequence — deliberately a different
// shape (rounded box, not a chevron/arrow) from the stage model, so the two
// are never mistaken for one another, while still sharing the same colours,
// font and shadow language.
const inputs = [
  { label: 'Appropriate Challenge', accent: '#2d8c62' },
  { label: 'Appropriate Support', accent: '#4a7eb8' },
  { label: 'Agency', accent: '#7a48c0' },
];

function PrincipleModel() {
  return (
    <div className="max-w-3xl mx-auto mt-14 lg:mt-16 pt-10 border-t border-[#2D2520]/10" role="img" aria-label="Appropriate challenge, appropriate support and agency together create opportunities to experience competence and confidence">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
        {inputs.map((item, i) => (
          <Fragment key={item.label}>
            <div
              className="rounded-2xl px-5 py-3.5 text-center"
              style={{ backgroundColor: item.accent, boxShadow: '0 2px 6px -2px rgba(45,37,32,0.2)' }}
            >
              <span className="font-fredoka text-white text-sm sm:text-base leading-snug whitespace-nowrap">{item.label}</span>
            </div>
            {i < inputs.length - 1 && (
              <span className="font-fredoka text-[#2D2520]/40 text-lg flex-shrink-0" aria-hidden="true">+</span>
            )}
          </Fragment>
        ))}
      </div>

      <div className="flex justify-center my-3" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v10m0 0L3.5 7.5M8 12l4.5-4.5" stroke="#E8A020" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div
        className="rounded-2xl px-6 py-4 text-center"
        style={{ backgroundColor: INK, boxShadow: '0 4px 10px -4px rgba(45,37,32,0.25)' }}
      >
        <span className="font-fredoka text-white text-sm sm:text-base leading-snug">
          Opportunities to Experience Competence and Confidence
        </span>
      </div>

      <p className="font-nunito text-[#2D2520]/45 text-xs italic text-center mt-4 leading-relaxed">
        Appropriate challenge + appropriate support + agency → opportunities to experience competence and confidence.
      </p>
    </div>
  );
}

function MobileStack() {
  return (
    <div
      className="md:hidden max-w-md mx-auto space-y-2.5"
      role="img"
      aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply"
    >
      {stages.map((s) => (
        <div
          key={s.num}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5"
          style={{ backgroundColor: s.accent, boxShadow: '0 2px 6px -2px rgba(45,37,32,0.2)' }}
        >
          <span className="font-fredoka text-white/70 text-xs flex-shrink-0">{s.num}</span>
          <span className="font-fredoka text-white text-base leading-snug">{s.title}</span>
        </div>
      ))}
    </div>
  );
}

export default function IndependenceModel() {
  return (
    <div className="max-w-6xl mx-auto">
      <DesktopChevrons />
      <MobileStack />
      <PrincipleModel />
      <p className="font-nunito text-[#2D2520]/50 text-sm text-center mt-6">
        The Rook Foundations approach to building independence through challenge.
      </p>
    </div>
  );
}
