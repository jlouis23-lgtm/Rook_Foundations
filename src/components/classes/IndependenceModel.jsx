// Seven stages, mirroring the visual system of the five-stage chevron model
// in BehaviourFramework.jsx directly beneath this one on the page: same
// interlocking notch/point geometry, same six-colour accent rotation (cycling
// back to green for stage seven, closing the loop rather than introducing a
// new colour), same numbering style and typography. Deliberately static (no
// hover/click reveal) and text-only (number + name, no prompt line), per the
// brief's explicit "no captions, no interactive element" instruction — this
// diagram matches the five-stage model's look, not its interaction.
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
      <p className="font-nunito text-[#2D2520]/50 text-sm text-center mt-6">
        The Rook Foundations approach to building independence through challenge.
      </p>
    </div>
  );
}
