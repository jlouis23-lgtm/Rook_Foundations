import { motion } from 'framer-motion';

function BoardVisionDiagram() {
  const eyeFieldAngle = 35; // degrees half-angle for the attention cone

  // Shared constants
  const headR = 28;
  const eyeOffsetX = 10;
  const eyeOffsetY = 8;
  const rayLength = 130;

  // Convert angle to radians for ray spread
  const spread = (eyeFieldAngle * Math.PI) / 180;

  function getConePoints(cx, cy, facingDown = true) {
    // Eyes sit at bottom of head (facing down = looking at object below head in top-down view)
    const eyeY = cy + headR - 6;
    const leftEyeX = cx - eyeOffsetX;
    const rightEyeX = cx + eyeOffsetX;

    const dir = facingDown ? 1 : -1;

    // Left eye rays
    const leftRayAngle1 = Math.PI / 2 + spread;
    const leftRayAngle2 = Math.PI / 2 - spread;
    const leftFar1 = [
      leftEyeX + rayLength * Math.cos(Math.PI - leftRayAngle1) * dir,
      eyeY + rayLength * Math.sin(leftRayAngle1) * dir,
    ];
    const leftFar2 = [
      leftEyeX + rayLength * Math.cos(Math.PI - leftRayAngle2) * dir,
      eyeY + rayLength * Math.sin(leftRayAngle2) * dir,
    ];

    // Right eye rays
    const rightFar1 = [
      rightEyeX + rayLength * Math.cos(Math.PI - leftRayAngle1) * dir,
      eyeY + rayLength * Math.sin(leftRayAngle1) * dir,
    ];
    const rightFar2 = [
      rightEyeX + rayLength * Math.cos(Math.PI - leftRayAngle2) * dir,
      eyeY + rayLength * Math.sin(leftRayAngle2) * dir,
    ];

    return {
      eyeY,
      leftEyeX,
      rightEyeX,
      leftFar1,
      leftFar2,
      rightFar1,
      rightFar2,
    };
  }

  // ── LEFT PANEL: Phone ──────────────────────────────────────────────
  // SVG viewBox 220×260
  const phonePanel = () => {
    const cx = 110;
    const cy = 58;
    const cone = getConePoints(cx, cy, true);

    // Phone rectangle
    const phoneW = 36;
    const phoneH = 58;
    const phoneX = cx - phoneW / 2;
    const phoneY = cy + headR + 20;

    // Cone polygon: left outer ray to far-left, right outer ray to far-right, close across screen bottom
    const conePoints = [
      [cone.leftEyeX, cone.eyeY],
      [phoneX - 2, phoneY + phoneH],
      [phoneX + phoneW + 2, phoneY + phoneH],
      [cone.rightEyeX, cone.eyeY],
    ].map((p) => p.join(',')).join(' ');

    return (
      <svg viewBox="0 0 220 260" className="w-full h-full" aria-hidden="true">
        {/* Attention cone */}
        <polygon points={conePoints} fill="#E8A020" fillOpacity={0.12} />
        {/* Cone edges */}
        <line x1={cone.leftEyeX} y1={cone.eyeY} x2={phoneX - 2} y2={phoneY + phoneH}
          stroke="#E8A020" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
        <line x1={cone.rightEyeX} y1={cone.eyeY} x2={phoneX + phoneW + 2} y2={phoneY + phoneH}
          stroke="#E8A020" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />

        {/* Head */}
        <circle cx={cx} cy={cy} r={headR} fill="#F5F3EE" stroke="#DDD8CC" strokeWidth="1.5" />
        {/* Nose */}
        <ellipse cx={cx} cy={cy + headR - 8} rx={4} ry={3} fill="#DDD8CC" />
        {/* Eyes */}
        <circle cx={cone.leftEyeX} cy={cone.eyeY} r={3.5} fill="#2D2520" />
        <circle cx={cone.rightEyeX} cy={cone.eyeY} r={3.5} fill="#2D2520" />
        <circle cx={cone.leftEyeX + 1} cy={cone.eyeY - 1} r={1} fill="white" />
        <circle cx={cone.rightEyeX + 1} cy={cone.eyeY - 1} r={1} fill="white" />

        {/* Phone body */}
        <rect x={phoneX} y={phoneY} width={phoneW} height={phoneH}
          rx={5} ry={5} fill="white" stroke="#2D2520" strokeWidth="1.5" />
        {/* Phone screen */}
        <rect x={phoneX + 3} y={phoneY + 8} width={phoneW - 6} height={phoneH - 16}
          rx={2} fill="#E8F4FD" stroke="#b0c8e0" strokeWidth="1" />
        {/* Mini chess grid on screen */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const cellW = (phoneW - 10) / 4;
            const cellH = (phoneH - 20) / 4;
            const isDark = (row + col) % 2 === 1;
            return (
              <rect
                key={`${row}-${col}`}
                x={phoneX + 5 + col * cellW}
                y={phoneY + 10 + row * cellH}
                width={cellW}
                height={cellH}
                fill={isDark ? '#b0c8e0' : '#E8F4FD'}
              />
            );
          })
        )}
        {/* Phone home button */}
        <circle cx={cx} cy={phoneY + phoneH - 4} r={2.5} fill="#DDD8CC" />

        {/* Label */}
        <text x={cx} y={250} textAnchor="middle" fontSize="11" fill="#2D2520" fontFamily="Nunito, sans-serif" fontWeight="700" opacity="0.65">
          Small screen
        </text>
      </svg>
    );
  };

  // ── RIGHT PANEL: Chessboard ────────────────────────────────────────
  // Same cone angle, but board is much wider — cone only covers part of it
  const boardPanel = () => {
    const cx = 110;
    const cy = 52;
    const cone = getConePoints(cx, cy, true);

    const boardSize = 140;
    const boardX = cx - boardSize / 2;
    const boardY = cy + headR + 22;
    const cellSize = boardSize / 8;

    // Cone tip to "near" board edge width is narrow vs board width
    const coneLeftX = boardX + 26;
    const coneRightX = boardX + boardSize - 26;

    const conePoints = [
      [cone.leftEyeX, cone.eyeY],
      [coneLeftX, boardY + boardSize],
      [coneRightX, boardY + boardSize],
      [cone.rightEyeX, cone.eyeY],
    ].map((p) => p.join(',')).join(' ');

    return (
      <svg viewBox="0 0 220 280" className="w-full h-full" aria-hidden="true">
        {/* Board */}
        <rect x={boardX} y={boardY} width={boardSize} height={boardSize}
          fill="white" stroke="#DDD8CC" strokeWidth="1.5" />
        {[...Array(8)].map((_, row) =>
          [...Array(8)].map((_, col) => {
            const isDark = (row + col) % 2 === 1;
            return (
              <rect
                key={`${row}-${col}`}
                x={boardX + col * cellSize}
                y={boardY + row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isDark ? '#c8b89a' : '#f0e8d8'}
              />
            );
          })
        )}
        {/* Board border */}
        <rect x={boardX} y={boardY} width={boardSize} height={boardSize}
          fill="none" stroke="#2D2520" strokeWidth="1.5" />

        {/* Outside-cone overlay: left and right strips — dimmed */}
        <rect x={boardX} y={boardY} width={coneLeftX - boardX} height={boardSize}
          fill="#2D2520" fillOpacity={0.10} />
        <rect x={coneRightX} y={boardY} width={boardX + boardSize - coneRightX} height={boardSize}
          fill="#2D2520" fillOpacity={0.10} />

        {/* Attention cone fill */}
        <polygon points={conePoints} fill="#E8A020" fillOpacity={0.13} />
        {/* Cone edges */}
        <line x1={cone.leftEyeX} y1={cone.eyeY} x2={coneLeftX} y2={boardY + boardSize}
          stroke="#E8A020" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
        <line x1={cone.rightEyeX} y1={cone.eyeY} x2={coneRightX} y2={boardY + boardSize}
          stroke="#E8A020" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />

        {/* Head */}
        <circle cx={cx} cy={cy} r={headR} fill="#F5F3EE" stroke="#DDD8CC" strokeWidth="1.5" />
        {/* Nose */}
        <ellipse cx={cx} cy={cy + headR - 8} rx={4} ry={3} fill="#DDD8CC" />
        {/* Eyes */}
        <circle cx={cone.leftEyeX} cy={cone.eyeY} r={3.5} fill="#2D2520" />
        <circle cx={cone.rightEyeX} cy={cone.eyeY} r={3.5} fill="#2D2520" />
        <circle cx={cone.leftEyeX + 1} cy={cone.eyeY - 1} r={1} fill="white" />
        <circle cx={cone.rightEyeX + 1} cy={cone.eyeY - 1} r={1} fill="white" />

        {/* "Outside view" arrows hinting more board exists */}
        <text x={boardX - 8} y={boardY + boardSize / 2} textAnchor="middle" fontSize="14" fill="#2D2520" opacity="0.3">←</text>
        <text x={boardX + boardSize + 8} y={boardY + boardSize / 2} textAnchor="middle" fontSize="14" fill="#2D2520" opacity="0.3">→</text>

        {/* Label */}
        <text x={cx} y={268} textAnchor="middle" fontSize="11" fill="#2D2520" fontFamily="Nunito, sans-serif" fontWeight="700" opacity="0.65">
          Full chessboard
        </text>
      </svg>
    );
  };

  return (
    <div className="bg-white border-2 border-[#E8A020]/15 rounded-3xl p-6 lg:p-10">
      {/* Top label */}
      <p className="font-nunito text-[#2D2520]/40 text-xs font-700 uppercase tracking-widest text-center mb-6">
        Visual attention — top-down view
      </p>
      <div className="grid grid-cols-2 gap-4 lg:gap-10 max-w-lg mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-full" style={{ maxWidth: 200 }}>
            {phonePanel()}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full" style={{ maxWidth: 200 }}>
            {boardPanel()}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 rounded-full" style={{ background: 'rgba(232,160,32,0.35)' }} />
          <span className="font-nunito text-[#2D2520]/50 text-xs font-600">Field of attention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 rounded-full" style={{ background: 'rgba(45,37,32,0.12)' }} />
          <span className="font-nunito text-[#2D2520]/50 text-xs font-600">Outside attentional field</span>
        </div>
      </div>
    </div>
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
          <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-6">
            <span className="text-sm">👁</span>
            <span className="font-nunito text-[#b8790a] text-sm font-700">Board vision</span>
          </div>

          <h2 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Board Vision
          </h2>

          <BoardVisionDiagram />

          <div className="mt-10 space-y-5 font-nunito text-[#2D2520]/65 text-base leading-relaxed">
            <p>
              This diagram illustrates how engaging with complex tasks on small screens can limit our ability to perceive the bigger picture. When visual information is compressed into a confined space, broader patterns and relationships can become more difficult to recognise.
            </p>
            <p>
              For children, constant exposure to fast-paced digital environments may encourage short-term reactions rather than careful reasoning, planning, and strategic thinking. Chess provides an opportunity to develop a wider field of attention by encouraging students to assess the entire board, anticipate future possibilities, and consider multiple factors before making a decision.
            </p>
            <p>
              By learning to visualise strategy on a larger scale, children can strengthen their focus, judgement, and problem-solving abilities. These skills extend beyond chess and can support thoughtful decision-making, concentration, and long-term planning in many areas of life when properly developed and reinforced.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}