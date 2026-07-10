import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Phase 1: phone. Phase 2 (board) starts the instant phase 1 finishes, then the
// board's dimming/spotlight settles in as its attention line reaches the board.
const PHONE_DRAW = 1;
const BOARD_START = PHONE_DRAW;
const BOARD_DRAW = 1;
const BOARD_DIM_DELAY = BOARD_START + 0.45;
const BOARD_DIM_DURATION = 0.9;

const coneLineVariants = (delay, duration) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration, delay, ease: EASE } },
});

const coneFillVariants = (delay, duration) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration * 0.8, delay, ease: 'easeOut' } },
});

function PhonePanel() {
  const cx = 100, cy = 44, headR = 26;
  const leftEyeX = cx - 9, rightEyeX = cx + 9;
  const eyeY = cy + headR - 5;

  // Phone dimensions and position — more gap from head
  const phoneW = 34, phoneH = 54;
  const phoneX = cx - phoneW / 2;
  const phoneY = eyeY + 52;
  const screenCx = phoneX + phoneW / 2;
  const screenCy = phoneY + phoneH / 2;

  // Cone points: rays go to edges of phone
  const conePoints = [
    [leftEyeX, eyeY],
    [phoneX - 1, phoneY + phoneH],
    [phoneX + phoneW + 1, phoneY + phoneH],
    [rightEyeX, eyeY],
  ].map(p => p.join(',')).join(' ');

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="pv-p-head" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F3EE" />
          <stop offset="100%" stopColor="#D8D0C0" />
        </radialGradient>
        <linearGradient id="pv-p-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3c3c3c" />
          <stop offset="55%" stopColor="#1c1c1c" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="pv-p-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFEDC2" />
          <stop offset="100%" stopColor="#E8A020" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="pv-p-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDA8C" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#E8A020" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E8A020" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pv-p-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C261" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E8A020" stopOpacity="0.06" />
        </linearGradient>
        <filter id="pv-p-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.2" floodColor="#2D2520" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Attention cone fill */}
      <motion.polygon points={conePoints} fill="url(#pv-p-cone)" variants={coneFillVariants(0, PHONE_DRAW)} />

      {/* Concentration hotspot — narrows and brightens as attention locks onto the phone */}
      <motion.circle
        cx={screenCx}
        cy={screenCy}
        fill="url(#pv-p-spot)"
        variants={{
          hidden: { r: 62, opacity: 0 },
          visible: { r: 15, opacity: 0.95, transition: { duration: PHONE_DRAW, ease: EASE } },
        }}
      />

      {/* Cone edges — drawn from eyes to phone */}
      <motion.line x1={leftEyeX} y1={eyeY} x2={phoneX - 1} y2={phoneY + phoneH}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" variants={coneLineVariants(0, PHONE_DRAW)} />
      <motion.line x1={rightEyeX} y1={eyeY} x2={phoneX + phoneW + 1} y2={phoneY + phoneH}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" variants={coneLineVariants(0, PHONE_DRAW)} />

      {/* Head */}
      <circle cx={cx} cy={cy} r={headR} fill="url(#pv-p-head)" stroke="#C8C0B4" strokeWidth="1.5" filter="url(#pv-p-shadow)" />
      <ellipse cx={cx} cy={cy + headR - 7} rx={3.5} ry={2.5} fill="#C8C0B4" opacity="0.7" />
      <circle cx={leftEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={rightEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={leftEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
      <circle cx={rightEyeX + 1} cy={eyeY - 1} r={1} fill="white" />

      {/* Phone body */}
      <rect x={phoneX} y={phoneY} width={phoneW} height={phoneH} rx={5} ry={5}
        fill="url(#pv-p-body)" stroke="#000" strokeWidth="1" filter="url(#pv-p-shadow)" />
      {/* Screen */}
      <rect x={phoneX + 3} y={phoneY + 7} width={phoneW - 6} height={phoneH - 14}
        rx={2} fill="url(#pv-p-screen)" stroke="#c99a3d" strokeWidth="0.75" />
      {/* Mini chess grid */}
      {[0, 1, 2, 3].map(row => [0, 1, 2, 3].map(col => {
        const cw = (phoneW - 10) / 4, ch = (phoneH - 18) / 4;
        return (
          <rect key={`${row}-${col}`}
            x={phoneX + 5 + col * cw} y={phoneY + 9 + row * ch}
            width={cw} height={ch}
            fill={(row + col) % 2 === 1 ? '#c9922f' : '#FFF3DC'}
            opacity={(row + col) % 2 === 1 ? 0.55 : 0.9}
          />
        );
      }))}
      {/* Home button */}
      <circle cx={cx} cy={phoneY + phoneH - 4} r={2.5} fill="#3a3a3a" stroke="#555" strokeWidth="0.5" />
    </svg>
  );
}

function BoardPanel() {
  const cx = 100, cy = 44, headR = 26;
  const leftEyeX = cx - 9, rightEyeX = cx + 9;
  const eyeY = cy + headR - 5;

  // Board — same gap from head as phone panel
  const boardSize = 136;
  const boardX = cx - boardSize / 2;
  const boardY = eyeY + 52;
  const cellSize = boardSize / 8;

  // Same angular cone — rays hit only the middle portion of the board
  const coneLeftX = boardX + 30;
  const coneRightX = boardX + boardSize - 30;
  const focusCx = (coneLeftX + coneRightX) / 2;
  const focusCy = boardY + boardSize * 0.62;

  const conePoints = [
    [leftEyeX, eyeY],
    [coneLeftX, boardY + boardSize],
    [coneRightX, boardY + boardSize],
    [rightEyeX, eyeY],
  ].map(p => p.join(',')).join(' ');

  return (
    <svg viewBox="0 0 200 260" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="pv-b-head" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F3EE" />
          <stop offset="100%" stopColor="#D8D0C0" />
        </radialGradient>
        <linearGradient id="pv-b-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCF3E2" />
          <stop offset="100%" stopColor="#F0E2C4" />
        </linearGradient>
        <linearGradient id="pv-b-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D3B786" />
          <stop offset="100%" stopColor="#B6935C" />
        </linearGradient>
        <linearGradient id="pv-b-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="pv-b-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDA8C" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#E8A020" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E8A020" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pv-b-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C261" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E8A020" stopOpacity="0.06" />
        </linearGradient>
        <filter id="pv-b-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2D2520" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Board squares */}
      <g filter="url(#pv-b-shadow)">
        {[...Array(8)].map((_, row) => [...Array(8)].map((_, col) => (
          <rect key={`${row}-${col}`}
            x={boardX + col * cellSize} y={boardY + row * cellSize}
            width={cellSize} height={cellSize}
            fill={(row + col) % 2 === 1 ? 'url(#pv-b-dark)' : 'url(#pv-b-light)'} />
        )))}
        {/* Board border */}
        <rect x={boardX} y={boardY} width={boardSize} height={boardSize} fill="none" stroke="#2D2520" strokeWidth="1.5" />
      </g>

      {/* Glossy sheen */}
      <rect x={boardX} y={boardY} width={boardSize} height={boardSize} fill="url(#pv-b-sheen)" />

      {/* Out-of-cone dimming — the board starts evenly lit, then narrows as the line arrives */}
      <motion.rect x={boardX} y={boardY} width={coneLeftX - boardX} height={boardSize} fill="#2D2520"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.55, transition: { duration: BOARD_DIM_DURATION, delay: BOARD_DIM_DELAY, ease: 'easeOut' } } }} />
      <motion.rect x={coneRightX} y={boardY} width={boardX + boardSize - coneRightX} height={boardSize} fill="#2D2520"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.55, transition: { duration: BOARD_DIM_DURATION, delay: BOARD_DIM_DELAY, ease: 'easeOut' } } }} />

      {/* Focus spotlight glow on the point of attention */}
      <motion.circle cx={focusCx} cy={focusCy} fill="url(#pv-b-spot)"
        variants={{ hidden: { r: 8, opacity: 0 }, visible: { r: 44, opacity: 1, transition: { duration: BOARD_DIM_DURATION, delay: BOARD_DIM_DELAY, ease: 'easeOut' } } }} />

      {/* Attention cone fill */}
      <motion.polygon points={conePoints} fill="url(#pv-b-cone)" variants={coneFillVariants(BOARD_START, BOARD_DRAW)} />

      {/* Cone edges — drawn from eyes to board */}
      <motion.line x1={leftEyeX} y1={eyeY} x2={coneLeftX} y2={boardY + boardSize}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" variants={coneLineVariants(BOARD_START, BOARD_DRAW)} />
      <motion.line x1={rightEyeX} y1={eyeY} x2={coneRightX} y2={boardY + boardSize}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" variants={coneLineVariants(BOARD_START, BOARD_DRAW)} />

      {/* Head */}
      <circle cx={cx} cy={cy} r={headR} fill="url(#pv-b-head)" stroke="#C8C0B4" strokeWidth="1.5" filter="url(#pv-b-shadow)" />
      <ellipse cx={cx} cy={cy + headR - 7} rx={3.5} ry={2.5} fill="#C8C0B4" opacity="0.7" />
      <circle cx={leftEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={rightEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={leftEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
      <circle cx={rightEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
    </svg>
  );
}

function BoardVisionDiagram() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, visible: {} }}
      className="border border-[#E8A020]/20 rounded-2xl p-5 bg-white"
    >
      <p className="font-nunito text-[#2D2520]/40 text-xs font-700 uppercase tracking-widest text-center mb-4">
        Visual Attention
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <div className="w-full"><PhonePanel /></div>
        <div className="w-full"><BoardPanel /></div>
      </div>
    </motion.div>
  );
}

export default function BoardVisionSection() {
  return (
    <section className="bg-[#FAFAF7] py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-6">
            👁 Board vision
          </span>

          <h2 className="font-fredoka text-[#2D2520] mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Board Vision
          </h2>

          <BoardVisionDiagram />

          <div className="mt-8 space-y-5 font-nunito text-[#2D2520]/65 text-base leading-relaxed">
            <p>
              This diagram shows how engaging with complex tasks on small screens can restrict our ability to perceive the bigger picture. When visual information is compressed into a confined space, broader patterns and relationships can become more difficult to recognise. For children, constant exposure to fast-paced digital environments may encourage short-term reactions rather than careful reasoning, planning, and strategic thinking.
            </p>
            <p>
              Games like chess provide an opportunity to develop a wider field of attention by promoting ideas of assessing the whole board, anticipating future possibilities, and evaluating different outcomes. By learning to visualise strategy on a larger scale, children can strengthen their focus and problem-solving skills. At Rook Foundations, we believe that proper encouragement and engagement can support learning to explore different strategies and build on existing skill sets. Our aim is to build principles which provide purpose and meaning in the real world.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
