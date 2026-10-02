import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];
const INK = '#2D2520';
const LINE = 'rgba(45, 37, 32, 0.22)';

// The radial map is drawn on a 1000 x 740 canvas that scales with its
// container, so the rook, the lines and the labels always stay in proportion.
const W = 1000;
const H = 740;
const CX = 500;
const CY = 372;
const GAP = 98; // connecting lines start this far from the rook's centre

// Where each topic's dot sits, in the same order as `topics` in
// src/data/research.js. These are placed by hand rather than on a perfect
// circle, so the map feels drawn rather than generated. `bend` is how far the
// connecting line curves away from a straight line (negative bends the other
// way).
const LAYOUT = [
  { x: 300, y: 118, side: 'left', bend: 0.16 },
  { x: 690, y: 76, side: 'right', bend: -0.12 },
  { x: 770, y: 262, side: 'right', bend: 0.1 },
  { x: 780, y: 480, side: 'right', bend: -0.14 },
  { x: 665, y: 652, side: 'right', bend: 0.12 },
  { x: 318, y: 640, side: 'left', bend: -0.1 },
  { x: 236, y: 392, side: 'left', bend: 0.12 },
];

// How far each branch is indented on phones, to give the list a staggered,
// hand-placed rhythm instead of a ruler-straight column.
const MOBILE_INDENT = [34, 54, 40, 60, 36, 52, 42];

function linePath({ x, y, bend }) {
  const dx = x - CX;
  const dy = y - CY;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = CX + ux * GAP;
  const sy = CY + uy * GAP;
  const mx = (sx + x) / 2;
  const my = (sy + y) / 2;
  const off = len * bend;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${(mx - uy * off).toFixed(1)} ${(my + ux * off).toFixed(1)} ${x} ${y}`;
}

const PATHS = LAYOUT.map(linePath);

// The Rook Foundations mark: the amber rounded badge with the ♜ glyph used
// in the site header, drawn large. `size` is the badge's own CSS width.
function RookBadge({ lit, glyphSize, size, breathe }) {
  return (
    <motion.div
      role="img"
      aria-label="Rook Foundations"
      animate={breathe ? { scale: [1, 1.025, 1] } : undefined}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, aspectRatio: '1' }}
    >
      <div
        className="flex h-full w-full items-center justify-center bg-[#E8A020] shadow-xl shadow-[#E8A020]/30 transition-transform duration-500"
        style={{ borderRadius: '36%', transform: lit ? 'scale(1.05)' : 'scale(1)' }}
      >
        <span aria-hidden="true" className="leading-none text-white" style={{ fontSize: glyphSize }}>
          ♜
        </span>
      </div>
    </motion.div>
  );
}

// A soft halo behind the rook. One layer per topic, cross-faded, so the glow
// quietly takes on the colour of whichever strand is being looked at.
function Glow({ topics, litId }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgba(232,160,32,0.34) 0%, rgba(232,160,32,0) 68%)', opacity: litId ? 0 : 1 }}
      />
      {topics.map((t) => (
        <div
          key={t.id}
          className="absolute inset-0 rounded-full transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${t.accent}57 0%, ${t.accent}00 68%)`, opacity: litId === t.id ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

export default function ResearchMap({ topics, activeId, onSelect }) {
  const [hoverId, setHoverId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const reduceMotion = useReducedMotion();

  // Hover wins, then keyboard focus, then whichever strand is open.
  const litId = hoverId ?? focusId ?? activeId;
  const hoverProps = (id) => ({
    onMouseEnter: () => setHoverId(id),
    onMouseLeave: () => setHoverId(null),
    onFocus: () => setFocusId(id),
    onBlur: () => setFocusId(null),
  });

  return (
    <nav aria-label="Research strands">
      {/* Tablet and desktop: rook at the centre, strands branching outward */}
      <div className="hidden md:block">
        <div
          className="relative mx-auto w-full max-w-[64rem]"
          style={{ aspectRatio: `${W} / ${H}`, containerType: 'inline-size' }}
        >
          <div
            className="absolute"
            style={{ left: '50%', top: `${(CY / H) * 100}%`, width: '46%', aspectRatio: '1', transform: 'translate(-50%, -50%)' }}
          >
            <Glow topics={topics} litId={litId} />
          </div>

          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {topics.map((t, i) => {
              const lit = litId === t.id;
              return (
                <motion.path
                  key={t.id}
                  d={PATHS[i]}
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.09, ease: EASE }}
                  style={{
                    stroke: lit ? t.accent : LINE,
                    strokeWidth: lit ? 2.75 : 1.25,
                    transition: 'stroke 300ms ease, stroke-width 300ms ease',
                  }}
                />
              );
            })}
          </svg>

          <div
            className="absolute"
            style={{ left: '50%', top: `${(CY / H) * 100}%`, width: '15%', transform: 'translate(-50%, -50%)' }}
          >
            <RookBadge lit={Boolean(litId)} size="100%" glyphSize="8.2cqw" breathe={!reduceMotion} />
          </div>

          <ul className="m-0 list-none p-0">
            {topics.map((t, i) => {
              const p = LAYOUT[i];
              const left = p.side === 'left';
              const lit = litId === t.id;
              return (
                <li
                  key={t.id}
                  className="absolute"
                  style={{
                    left: `${(p.x / W) * 100}%`,
                    top: `${(p.y / H) * 100}%`,
                    transform: left ? 'translate(calc(-100% + 7px), -12px)' : 'translate(-7px, -12px)',
                  }}
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.09, ease: EASE }}
                  >
                    <button
                      type="button"
                      data-topic-trigger={t.id}
                      aria-haspopup="dialog"
                      aria-describedby={`${t.id}-preview`}
                      onClick={() => onSelect(t.id)}
                      {...hoverProps(t.id)}
                      className={`group relative flex items-start gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[8px] focus-visible:outline-[#2D2520] ${
                        left ? 'flex-row-reverse text-right' : 'text-left'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[5px] h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 transition-all duration-300"
                        style={{
                          borderColor: t.accent,
                          backgroundColor: lit ? t.accent : '#FAFAF7',
                          transform: lit ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span className="relative block max-w-[9.75rem] lg:max-w-[14rem] xl:max-w-[15rem]">
                        <span
                          aria-hidden="true"
                          className="absolute -inset-x-3 -inset-y-2 rounded-2xl transition-opacity duration-300"
                          style={{ backgroundColor: t.accent, opacity: lit ? 0.1 : 0 }}
                        />
                        <span
                          className="relative block font-fredoka text-[0.95rem] leading-snug transition-colors duration-300 lg:text-[1.05rem]"
                          style={{
                            color: lit ? t.deep : INK,
                            textDecorationLine: lit ? 'underline' : 'none',
                            textDecorationColor: t.accent,
                            textUnderlineOffset: '4px',
                          }}
                        >
                          {t.title}
                        </span>
                        <span id={`${t.id}-preview`} className="relative mt-1 hidden font-nunito text-[0.82rem] leading-snug text-[#2D2520]/75 lg:block">
                          {t.preview}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`relative mt-1.5 hidden items-center gap-1 font-nunito text-[0.72rem] font-800 uppercase tracking-widest transition-opacity duration-300 lg:inline-flex ${
                            left ? 'flex-row-reverse' : ''
                          }`}
                          style={{ color: t.deep, opacity: lit ? 1 : 0 }}
                        >
                          Explore <ArrowRight size={12} />
                        </span>
                      </span>
                    </button>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Phones: rook at the top, strands branching down in a staggered line */}
      <div className="mx-auto max-w-md md:hidden">
        <div className="relative flex justify-center pt-2">
          <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2">
            <Glow topics={topics} litId={litId} />
          </div>
          <div className="relative">
            <RookBadge lit={Boolean(litId)} size="6rem" glyphSize="3.25rem" breathe={!reduceMotion} />
          </div>
        </div>

        <div className="relative mt-2">
          <div
            aria-hidden="true"
            className="ml-3 h-10 rounded-tl-[28px] border-l-[1.5px] border-t-[1.5px]"
            style={{ marginRight: '50%', borderColor: LINE }}
          />
          <ul className="m-0 list-none p-0">
            {topics.map((t, i) => {
              const indent = MOBILE_INDENT[i];
              const lit = litId === t.id;
              const last = i === topics.length - 1;
              return (
                <li key={t.id} className="relative" style={{ paddingLeft: indent }}>
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-0 w-[1.5px]"
                    style={{ height: last ? 26 : '100%', backgroundColor: LINE }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-[26px] h-[1.5px] transition-colors duration-300"
                    style={{ left: 12, width: indent - 12, backgroundColor: lit ? t.accent : LINE }}
                  />
                  <button
                    type="button"
                    data-topic-trigger={t.id}
                    aria-haspopup="dialog"
                    aria-describedby={`${t.id}-preview-m`}
                    onClick={() => onSelect(t.id)}
                    {...hoverProps(t.id)}
                    className="flex min-h-[4.5rem] w-full items-start gap-3 rounded-xl py-3 pr-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2520]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 transition-all duration-300"
                      style={{ borderColor: t.accent, backgroundColor: lit ? t.accent : '#FAFAF7' }}
                    />
                    <span className="block flex-1">
                      <span className="block font-fredoka text-[1.05rem] leading-snug" style={{ color: lit ? t.deep : INK }}>
                        {t.title}
                      </span>
                      <span id={`${t.id}-preview-m`} className="mt-1 block font-nunito text-[0.85rem] leading-snug text-[#2D2520]/75">
                        {t.preview}
                      </span>
                    </span>
                    <ChevronRight size={18} className="mt-1 flex-shrink-0" style={{ color: t.deep }} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
