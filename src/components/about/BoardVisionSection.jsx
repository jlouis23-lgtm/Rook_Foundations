import { motion } from 'framer-motion';

function PhonePanel() {
  const cx = 100, cy = 44, headR = 26;
  const leftEyeX = cx - 9, rightEyeX = cx + 9;
  const eyeY = cy + headR - 5;

  // Phone dimensions and position — more gap from head
  const phoneW = 34, phoneH = 54;
  const phoneX = cx - phoneW / 2;
  const phoneY = eyeY + 52;

  // Cone points: rays go to edges of phone
  const conePoints = [
    [leftEyeX, eyeY],
    [phoneX - 1, phoneY + phoneH],
    [phoneX + phoneW + 1, phoneY + phoneH],
    [rightEyeX, eyeY],
  ].map(p => p.join(',')).join(' ');

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full" aria-hidden="true">
      {/* Attention cone fill */}
      <polygon points={conePoints} fill="#E8A020" fillOpacity={0.15} />
      {/* Cone edges — thick */}
      <line x1={leftEyeX} y1={eyeY} x2={phoneX - 1} y2={phoneY + phoneH}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={rightEyeX} y1={eyeY} x2={phoneX + phoneW + 1} y2={phoneY + phoneH}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" />

      {/* Head */}
      <circle cx={cx} cy={cy} r={headR} fill="#F5F3EE" stroke="#C8C0B4" strokeWidth="1.5" />
      {/* Nose hint */}
      <ellipse cx={cx} cy={cy + headR - 7} rx={3.5} ry={2.5} fill="#C8C0B4" />
      {/* Eyes */}
      <circle cx={leftEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={rightEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={leftEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
      <circle cx={rightEyeX + 1} cy={eyeY - 1} r={1} fill="white" />

      {/* Phone body */}
      <rect x={phoneX} y={phoneY} width={phoneW} height={phoneH} rx={5} ry={5}
        fill="white" stroke="#2D2520" strokeWidth="1.5" />
      {/* Screen */}
      <rect x={phoneX + 3} y={phoneY + 7} width={phoneW - 6} height={phoneH - 14}
        rx={2} fill="#E8F4FD" stroke="#b0c8e0" strokeWidth="1" />
      {/* Mini chess grid */}
      {[0,1,2,3].map(row => [0,1,2,3].map(col => {
        const cw = (phoneW - 10) / 4, ch = (phoneH - 18) / 4;
        return (
          <rect key={`${row}-${col}`}
            x={phoneX + 5 + col * cw} y={phoneY + 9 + row * ch}
            width={cw} height={ch}
            fill={(row + col) % 2 === 1 ? '#b0c8e0' : '#E8F4FD'} />
        );
      }))}
      {/* Home button */}
      <circle cx={cx} cy={phoneY + phoneH - 4} r={2.5} fill="#DDD8CC" />
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

  const conePoints = [
    [leftEyeX, eyeY],
    [coneLeftX, boardY + boardSize],
    [coneRightX, boardY + boardSize],
    [rightEyeX, eyeY],
  ].map(p => p.join(',')).join(' ');

  return (
    <svg viewBox="0 0 200 260" className="w-full h-full" aria-hidden="true">
      {/* Board squares */}
      {[...Array(8)].map((_, row) => [...Array(8)].map((_, col) => (
        <rect key={`${row}-${col}`}
          x={boardX + col * cellSize} y={boardY + row * cellSize}
          width={cellSize} height={cellSize}
          fill={(row + col) % 2 === 1 ? '#c8b89a' : '#f0e8d8'} />
      )))}
      {/* Board border */}
      <rect x={boardX} y={boardY} width={boardSize} height={boardSize}
        fill="none" stroke="#2D2520" strokeWidth="1.5" />

      {/* Out-of-cone dimming: left strip */}
      <rect x={boardX} y={boardY} width={coneLeftX - boardX} height={boardSize}
        fill="#2D2520" fillOpacity={0.12} />
      {/* Out-of-cone dimming: right strip */}
      <rect x={coneRightX} y={boardY} width={boardX + boardSize - coneRightX} height={boardSize}
        fill="#2D2520" fillOpacity={0.12} />

      {/* Attention cone fill */}
      <polygon points={conePoints} fill="#E8A020" fillOpacity={0.15} />
      {/* Cone edges — thick */}
      <line x1={leftEyeX} y1={eyeY} x2={coneLeftX} y2={boardY + boardSize}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={rightEyeX} y1={eyeY} x2={coneRightX} y2={boardY + boardSize}
        stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" />

      {/* Head */}
      <circle cx={cx} cy={cy} r={headR} fill="#F5F3EE" stroke="#C8C0B4" strokeWidth="1.5" />
      {/* Nose hint */}
      <ellipse cx={cx} cy={cy + headR - 7} rx={3.5} ry={2.5} fill="#C8C0B4" />
      {/* Eyes */}
      <circle cx={leftEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={rightEyeX} cy={eyeY} r={3} fill="#2D2520" />
      <circle cx={leftEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
      <circle cx={rightEyeX + 1} cy={eyeY - 1} r={1} fill="white" />
    </svg>
  );
}

function BoardVisionDiagram() {
  return (
    <div className="border border-[#E8A020]/20 rounded-2xl p-5 bg-white">
      <p className="font-nunito text-[#2D2520]/40 text-xs font-700 uppercase tracking-widest text-center mb-4">
        Visual Attention
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <div className="w-full"><PhonePanel /></div>
        <div className="w-full"><BoardPanel /></div>
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