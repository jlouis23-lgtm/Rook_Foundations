import Reveal from '@/components/ui/Reveal';

// Seven stages, text only, no numbers/captions inside the shapes per the
// brief. The final stage is solid ink rather than gold — a single,
// unambiguous "arrival" marker rather than a colour gradient — so the chain
// reads as a one-way progression towards independence, not a repeating loop.
const stages = ['PAUSE', 'THINK', 'TRY', 'SUPPORT', 'TRY AGAIN', 'REFLECT', 'INDEPENDENTLY APPLY'];
const GOLD = '#E8A020';
const INK = '#2D2520';

// Pointed-right, flat-left arrow — used for every stage. Segments don't
// interlock (unlike the five-stage chevron elsewhere on this page); a small
// circular node sits in the gap between each pair, per the brief's "circular
// connectors between the stages".
const TIP = 14;
const arrowClipPath = `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%)`;

function Connector() {
  return (
    <div className="flex-shrink-0 flex items-center justify-center px-1 md:px-1.5" aria-hidden="true">
      <span className="block rounded-full" style={{ width: 9, height: 9, backgroundColor: GOLD }} />
    </div>
  );
}

function DesktopChain() {
  return (
    <div className="hidden md:flex items-stretch w-full" role="img" aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply">
      {stages.map((label, i) => (
        <div key={label} className="flex items-stretch flex-1 min-w-0">
          <div
            className="flex-1 min-w-0 flex items-center justify-center text-center px-3"
            style={{
              height: 'clamp(72px, 9vw, 96px)',
              backgroundColor: i === stages.length - 1 ? INK : GOLD,
              clipPath: arrowClipPath,
              paddingRight: `${TIP + 6}px`,
            }}
          >
            <span
              className="font-fredoka text-white leading-tight"
              style={{ fontSize: 'clamp(9.5px, 1.05vw, 12.5px)' }}
            >
              {label}
            </span>
          </div>
          {i < stages.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}

function MobileChain() {
  return (
    <div className="md:hidden flex flex-col items-center" role="img" aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply">
      {stages.map((label, i) => (
        <div key={label} className="flex flex-col items-center w-full">
          <div
            className="w-full max-w-xs rounded-2xl flex items-center justify-center py-3.5 px-5"
            style={{ backgroundColor: i === stages.length - 1 ? INK : GOLD }}
          >
            <span className="font-fredoka text-white text-sm leading-tight">
              {label}
            </span>
          </div>
          {i < stages.length - 1 && (
            <span className="block rounded-full my-2" style={{ width: 9, height: 9, backgroundColor: GOLD }} aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function IndependenceModel() {
  return (
    <div className="max-w-6xl mx-auto">
      <Reveal>
        <DesktopChain />
        <MobileChain />
      </Reveal>
      <p className="font-nunito text-[#2D2520]/50 text-sm text-center mt-5">
        The Rook Foundations approach to building independence through challenge.
      </p>
    </div>
  );
}
