import { ChevronRight, ChevronDown } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

// Seven stages, text only, no captions/numbers inside the shapes, per the
// brief. Structure (rounded-left, pointed-right flag shapes sitting directly
// adjacent, with a white circular chevron badge bridging each seam) mirrors
// the supplied reference image; colours and typography are the site's own,
// not copied from it. The final stage is solid ink rather than gold — a
// single, unambiguous "arrival" marker rather than a colour gradient — so
// the chain reads as one linear progression, not a repeating loop.
const stages = ['Pause', 'Think', 'Try', 'Support', 'Try Again', 'Reflect', 'Independently Apply'];
const GOLD = '#E8A020';
const INK = '#2D2520';
const TIP = 22;

function Badge({ Icon = ChevronRight }) {
  return (
    <div
      className="absolute rounded-full bg-white flex items-center justify-center flex-shrink-0"
      style={{ width: 34, height: 34, boxShadow: '0 3px 10px -2px rgba(45,37,32,0.35)' }}
    >
      <Icon size={16} className="text-[#2D2520]/70" />
    </div>
  );
}

function DesktopChain() {
  return (
    <div
      className="hidden md:block relative"
      role="img"
      aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply"
    >
      <div className="flex items-stretch w-full">
        {stages.map((label, i) => {
          const isLast = i === stages.length - 1;
          const fill = isLast ? INK : GOLD;
          return (
            <div key={label} className="flex items-stretch flex-1 min-w-0">
              <div
                className="flex-1 min-w-0 rounded-l-2xl flex items-center pl-5 pr-2"
                style={{ height: 'clamp(76px, 9vw, 100px)', backgroundColor: fill }}
              >
                <span
                  className="font-fredoka text-white leading-tight"
                  style={{ fontSize: 'clamp(10px, 1.05vw, 14px)' }}
                >
                  {label}
                </span>
              </div>
              <div
                className="flex-shrink-0"
                style={{
                  width: TIP,
                  height: 'clamp(76px, 9vw, 100px)',
                  backgroundColor: fill,
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {stages.slice(0, -1).map((label, i) => (
        <div
          key={`badge-${label}`}
          className="absolute top-1/2"
          style={{ left: `${((i + 1) / stages.length) * 100}%`, transform: 'translate(-50%, -50%)' }}
        >
          <Badge />
        </div>
      ))}
    </div>
  );
}

function MobileChain() {
  return (
    <div
      className="md:hidden flex flex-col items-center"
      role="img"
      aria-label="The Rook Foundations approach to building independence through challenge: Pause, Think, Try, Support, Try Again, Reflect, Independently Apply"
    >
      {stages.map((label, i) => {
        const isLast = i === stages.length - 1;
        return (
          <div key={label} className="flex flex-col items-center w-full">
            <div
              className="w-full max-w-xs rounded-2xl flex items-center justify-center py-3.5 px-5"
              style={{ backgroundColor: isLast ? INK : GOLD }}
            >
              <span className="font-fredoka text-white text-sm leading-tight">{label}</span>
            </div>
            {!isLast && (
              <div className="relative my-1.5" style={{ width: 34, height: 34 }}>
                <Badge Icon={ChevronDown} />
              </div>
            )}
          </div>
        );
      })}
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
      <p className="font-nunito text-[#2D2520]/50 text-sm text-center mt-6">
        The Rook Foundations approach to building independence through challenge.
      </p>
    </div>
  );
}
