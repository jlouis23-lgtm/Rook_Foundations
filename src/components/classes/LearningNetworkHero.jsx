import { motion } from 'framer-motion';
import { BrainCircuit, Crown, Grid3x3, Swords, Shield, Move, Layers, Target, Circle, Shapes } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

// The network of games radiating from the brain — pulled from the same
// game list taught elsewhere on the site (see Classes.jsx), not invented
// for this visual, and coloured from the site's own established accent
// palette (the same hues used across the Learning Pyramid) rather than
// any new colour.
const games = [
  { name: 'Chess', Icon: Crown, accent: '#b8790a' },
  { name: 'Go', Icon: Grid3x3, accent: '#2d8c62' },
  { name: 'Mastermind', Icon: Target, accent: '#4a7eb8' },
  { name: 'Quoridor', Icon: Move, accent: '#7a48c0' },
  { name: 'Tower of Hanoi', Icon: Layers, accent: '#c05050' },
  { name: 'Xiangqi', Icon: Swords, accent: '#2a8c88' },
  { name: 'Reversi / Othello', Icon: Circle, accent: '#c9860f' },
  { name: 'Janggi', Icon: Shield, accent: '#d4940e' },
  { name: 'Marble Solitaire', Icon: Shapes, accent: '#b8790a' },
];

const RADIUS = 40;
const START_ANGLE = -100;
const STEP = 360 / games.length;

function nodePosition(i) {
  const angle = (START_ANGLE + i * STEP) * (Math.PI / 180);
  return {
    left: `${50 + RADIUS * Math.cos(angle)}%`,
    top: `${50 + RADIUS * Math.sin(angle)}%`,
  };
}

function connectorPath(i) {
  const angle = (START_ANGLE + i * STEP) * (Math.PI / 180);
  const nodeX = 50 + RADIUS * Math.cos(angle);
  const nodeY = 50 + RADIUS * Math.sin(angle);
  // Pull the curve's control point off the straight line, perpendicular to
  // it, so each connector reads as a gentle arc rather than a straight ray.
  const midX = 50 + (RADIUS * 0.55) * Math.cos(angle);
  const midY = 50 + (RADIUS * 0.55) * Math.sin(angle);
  const perpAngle = angle + Math.PI / 2;
  const bow = 5;
  const ctrlX = midX + bow * Math.cos(perpAngle);
  const ctrlY = midY + bow * Math.sin(perpAngle);
  return `M 50 50 Q ${ctrlX} ${ctrlY} ${nodeX} ${nodeY}`;
}

// Desktop / tablet — a radial network diagram: a glowing brain hub at the
// centre with each game connected by a soft curved line.
function NetworkDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[620px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        {games.map((g, i) => (
          <path
            key={g.name}
            d={connectorPath(i)}
            fill="none"
            stroke={g.accent}
            strokeOpacity="0.28"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {games.map((g, i) => {
        const pos = nodePosition(i);
        return (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: EASE }}
            className="absolute flex items-center gap-2 bg-white border border-[#2D2520]/8 rounded-2xl pl-2 pr-3.5 py-2 shadow-sm whitespace-nowrap"
            style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${g.accent}18` }}
            >
              <g.Icon size={14} style={{ color: g.accent }} />
            </span>
            <span className="font-fredoka text-[#2D2520] text-[0.8rem] leading-none">{g.name}</span>
          </motion.div>
        );
      })}

      {/* Central brain hub */}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ width: 150, height: 150, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#E8A02033' }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#E8A020]/20 shadow-lg flex items-center justify-center"
        >
          <BrainCircuit size={44} className="sm:hidden" style={{ color: '#E8A020' }} strokeWidth={1.6} />
          <BrainCircuit size={52} className="hidden sm:block" style={{ color: '#E8A020' }} strokeWidth={1.6} />
        </motion.div>
      </div>
    </div>
  );
}

// Mobile — the radial layout doesn't fit; the same concept is expressed as
// a brain hub above a wrapping list of game chips.
function MobileNetwork() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className="absolute rounded-full blur-2xl"
          style={{ width: 110, height: 110, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#E8A02033' }}
          aria-hidden="true"
        />
        <div className="relative w-20 h-20 rounded-full bg-white border border-[#E8A020]/20 shadow-lg flex items-center justify-center">
          <BrainCircuit size={36} style={{ color: '#E8A020' }} strokeWidth={1.6} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-sm">
        {games.map((g) => (
          <span
            key={g.name}
            className="inline-flex items-center gap-1.5 bg-white border border-[#2D2520]/8 rounded-full pl-1.5 pr-3 py-1.5 shadow-sm"
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${g.accent}18` }}
            >
              <g.Icon size={11} style={{ color: g.accent }} />
            </span>
            <span className="font-fredoka text-[#2D2520] text-xs leading-none">{g.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LearningNetworkHero() {
  return (
    <div className="py-6 sm:py-10">
      <div className="sm:hidden">
        <MobileNetwork />
      </div>
      <div className="hidden sm:block">
        <NetworkDiagram />
      </div>
    </div>
  );
}
