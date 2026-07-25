import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Compass, CheckCircle2, ArrowRight, RotateCcw, PlayCircle, Trophy } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import { FILES, RANKS, PIECE_GLYPHS } from '@/lib/chessMemory';
import { generatePuzzle, instructionItems, MAX_LEVEL } from '@/lib/chessCoordinates';

const COLOR = '#5b5fc7';
const LIGHT_SQUARE = '#f7ecd6';
const DARK_SQUARE = '#c99a54';
const MEMORIZE_OPTIONS = [5, 10, 15];

export default function CoordinateMemory() {
  const [level, setLevel] = useState(1);
  const [easyMode, setEasyMode] = useState(false);
  const [memorizeSeconds, setMemorizeSeconds] = useState(10);

  const [puzzle, setPuzzle] = useState(() => generatePuzzle(1));
  const [phase, setPhase] = useState('memorize'); // memorize | play
  const [countdown, setCountdown] = useState(10);
  const [tray, setTray] = useState([]);
  const [boardState, setBoardState] = useState({}); // type -> square
  const [activeIndex, setActiveIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [replayIndex, setReplayIndex] = useState(null);
  const [mastered, setMastered] = useState(false);

  const intervalRef = useRef(null);
  const replayTimers = useRef([]);

  function clearAllTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    replayTimers.current.forEach(clearTimeout);
    replayTimers.current = [];
  }

  function startLevel(lvl) {
    clearAllTimers();
    const p = generatePuzzle(lvl);
    setPuzzle(p);
    setTray(p.placements.map((pl) => pl.type));
    setBoardState({});
    setActiveIndex(0);
    setChecked(false);
    setSuccess(false);
    setDragging(null);
    setHoverSquare(null);
    setReplayIndex(null);

    if (easyMode) {
      setPhase('play');
      return;
    }

    setPhase('memorize');
    setCountdown(memorizeSeconds);
    let remaining = memorizeSeconds;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setPhase('play');
      }
    }, 1000);
  }

  useEffect(() => {
    setMastered(false);
    startLevel(level);
    return () => clearAllTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const checklist = useMemo(() => instructionItems(puzzle), [puzzle]);
  const squareToType = useMemo(() => Object.fromEntries(Object.entries(boardState).map(([t, sq]) => [sq, t])), [boardState]);

  function findSquare(x, y) {
    const el = document.elementFromPoint(x, y);
    const target = el?.closest('[data-square]');
    return target?.getAttribute('data-square') || null;
  }

  function evaluate(state) {
    setChecked(true);
    const types = Object.keys(puzzle.finalPositions);
    const correct = types.every((t) => state[t] === puzzle.finalPositions[t]);
    if (correct) {
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [COLOR, '#E8A020', '#2d8c62'] });
    } else {
      setSuccess(false);
    }
  }

  function handleDrop(square, type, source, fromSquare) {
    if (!square) return;
    const occupiedSquares = new Set(Object.values(boardState));
    if (source === 'board') occupiedSquares.delete(fromSquare);
    if (occupiedSquares.has(square)) return;

    const nextState = { ...boardState, [type]: square };
    setBoardState(nextState);

    if (source === 'tray') {
      const nextTray = tray.filter((t) => t !== type);
      setTray(nextTray);
      if (!checked && activeIndex === 0 && nextTray.length === 0) {
        const nextIndex = 1;
        setActiveIndex(nextIndex);
        if (nextIndex >= puzzle.totalInstructions) evaluate(nextState);
      }
    } else if (!checked) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      if (nextIndex >= puzzle.totalInstructions) evaluate(nextState);
    }

    if (checked) evaluate(nextState);
  }

  function beginDrag(e, type, source, fromSquare) {
    if (phase !== 'play') return;
    e.preventDefault();
    setDragging({ type, source, fromSquare, x: e.clientX, y: e.clientY });

    function onMove(ev) {
      setHoverSquare(findSquare(ev.clientX, ev.clientY));
      setDragging((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    }
    function onUp(ev) {
      const sq = findSquare(ev.clientX, ev.clientY);
      handleDrop(sq, type, source, fromSquare);
      setDragging(null);
      setHoverSquare(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function replayInstructions() {
    if (replayTimers.current.length) return;
    checklist.forEach((_, i) => {
      const id = setTimeout(() => setReplayIndex(i), i * 550);
      replayTimers.current.push(id);
    });
    const clearId = setTimeout(() => {
      setReplayIndex(null);
      replayTimers.current = [];
    }, checklist.length * 550 + 400);
    replayTimers.current.push(clearId);
  }

  function nextLevel() {
    if (level >= MAX_LEVEL) {
      setMastered(true);
      return;
    }
    setLevel((l) => l + 1);
  }

  const progress = puzzle.totalInstructions > 0 ? Math.min(activeIndex, puzzle.totalInstructions) / puzzle.totalInstructions : 0;
  const labelsOpacity = easyMode ? 0.35 : phase === 'memorize' ? 1 : 0;

  const boardCells = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      boardCells.push({ row, col });
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Compass}
        color={COLOR}
        title="Coordinate Memory"
        description="Memorise the board's coordinates, then follow the instructions from memory to place and move each piece."
      />

      {/* Settings */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setEasyMode((v) => !v)}
          className="flex items-center gap-2 font-nunito font-700 text-sm px-4 py-2 rounded-2xl border-2 transition-colors"
          style={{ borderColor: easyMode ? COLOR : '#e5e0d3', backgroundColor: easyMode ? `${COLOR}12` : '#fff', color: easyMode ? COLOR : '#2D2520' }}
        >
          Easy mode {easyMode ? 'on' : 'off'}
        </button>
        {!easyMode && (
          <div className="flex items-center gap-2">
            <span className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest">Memorise for</span>
            {MEMORIZE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setMemorizeSeconds(s)}
                className="w-10 h-9 rounded-xl border-2 font-nunito font-700 text-sm transition-colors"
                style={{
                  borderColor: memorizeSeconds === s ? COLOR : '#e5e0d3',
                  backgroundColor: memorizeSeconds === s ? `${COLOR}12` : '#fff',
                  color: memorizeSeconds === s ? COLOR : '#2D2520',
                }}
              >
                {s}s
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="font-nunito text-ink/70 text-sm font-700">Level {level} of {MAX_LEVEL}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={replayInstructions}
            className="inline-flex items-center gap-1.5 font-nunito font-700 text-sm px-4 py-2 rounded-2xl border-2 hover:-translate-y-0.5 transition-all"
            style={{ borderColor: COLOR, color: COLOR }}
          >
            <PlayCircle size={15} /> Replay instructions
          </button>
          <button
            onClick={() => startLevel(level)}
            className="inline-flex items-center gap-1.5 font-nunito font-700 text-sm px-4 py-2 rounded-2xl border-2 hover:-translate-y-0.5 transition-all"
            style={{ borderColor: COLOR, color: COLOR }}
          >
            <RotateCcw size={15} /> Reset level
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-ink/8 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: COLOR }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-white border border-ink/8 rounded-3xl p-6 sm:p-8">
        {phase === 'memorize' && (
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-2 font-nunito font-800 text-sm px-4 py-2 rounded-full" style={{ backgroundColor: `${COLOR}18`, color: COLOR }}>
              Memorise the coordinates… {countdown}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Board with coordinate gutter */}
          <div
            className="grid flex-shrink-0"
            style={{
              width: 'min(92vw, 452px)',
              height: 'min(92vw, 452px)',
              gridTemplateColumns: '30px repeat(8, 1fr) 30px',
              gridTemplateRows: '30px repeat(8, 1fr) 30px',
            }}
          >
            {boardCells.map(({ row, col }) => {
              const isLabelRow = row === 0 || row === 9;
              const isLabelCol = col === 0 || col === 9;

              if (isLabelRow && isLabelCol) {
                return <div key={`${row}-${col}`} />;
              }
              if (isLabelRow) {
                const file = FILES[col - 1];
                return (
                  <div
                    key={`${row}-${col}`}
                    className="flex items-center justify-center font-nunito font-800 text-sm text-ink/80 transition-opacity duration-500"
                    style={{ opacity: labelsOpacity }}
                  >
                    {file.toUpperCase()}
                  </div>
                );
              }
              if (isLabelCol) {
                const rank = RANKS[row - 1];
                return (
                  <div
                    key={`${row}-${col}`}
                    className="flex items-center justify-center font-nunito font-800 text-sm text-ink/80 transition-opacity duration-500"
                    style={{ opacity: labelsOpacity }}
                  >
                    {rank}
                  </div>
                );
              }

              const file = FILES[col - 1];
              const rank = RANKS[row - 1];
              const square = `${file}${rank}`;
              const boardRow = row - 1;
              const boardCol = col - 1;
              const isDark = (boardRow + boardCol) % 2 === 1;
              const type = squareToType[square];
              const isHover = phase === 'play' && hoverSquare === square && !type;
              const isWrong = checked && !success && type && puzzle.finalPositions[type] !== square;
              const isDraggingThis = dragging?.source === 'board' && dragging.fromSquare === square;

              return (
                <div
                  key={`${row}-${col}`}
                  data-square={square}
                  className="relative flex items-center justify-center"
                  style={{
                    backgroundColor: isDark ? DARK_SQUARE : LIGHT_SQUARE,
                    outline: isHover ? `3px solid ${COLOR}` : 'none',
                    outlineOffset: '-3px',
                  }}
                >
                  {isWrong && <div className="absolute inset-0 bg-[#c0446b]/30" />}
                  {type && !isDraggingThis && (
                    <span
                      onPointerDown={(e) => beginDrag(e, type, 'board', square)}
                      className="select-none leading-none cursor-grab active:cursor-grabbing touch-none"
                      style={{ fontSize: 'min(6vw, 28px)', color: isWrong ? '#c0446b' : '#2D2520' }}
                    >
                      {PIECE_GLYPHS[type]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar: tray + checklist */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            {tray.length > 0 && (
              <div>
                <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-3">Pieces to place</p>
                <div className="flex flex-wrap gap-3">
                  {tray.map((type) => (
                    <button
                      key={type}
                      onPointerDown={(e) => beginDrag(e, type, 'tray', null)}
                      className="w-14 h-14 rounded-2xl bg-[#f7ecd6] border-2 border-[#c99a54]/50 flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing touch-none"
                      style={{ opacity: dragging?.type === type && dragging.source === 'tray' ? 0.25 : 1, color: '#2D2520' }}
                    >
                      {PIECE_GLYPHS[type]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-3">Instructions</p>
              <div className="space-y-1.5">
                {checklist.map((text, i) => {
                  const done = checked || i < activeIndex;
                  const isActive = replayIndex !== null ? replayIndex === i : !checked && i === activeIndex;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl px-3 py-2 transition-colors"
                      style={{ backgroundColor: isActive ? `${COLOR}12` : 'transparent' }}
                    >
                      <span className="mt-0.5 flex-shrink-0">
                        {done ? (
                          <CheckCircle2 size={16} style={{ color: '#2d8c62' }} />
                        ) : (
                          <span
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-800"
                            style={{ borderColor: isActive ? COLOR : '#DDD8CC', color: isActive ? COLOR : '#2D2520' }}
                          >
                            {i + 1}
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-nunito text-sm leading-snug ${done ? 'text-ink/40' : isActive ? 'text-ink font-800' : 'text-ink/60'}`}
                      >
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-8 max-w-md mx-auto text-center">
          <AnimatePresence mode="wait">
            {mastered ? (
              <motion.div key="mastered" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-center gap-2 bg-[#2d8c6215] text-[#2d8c62] font-nunito font-800 text-sm rounded-2xl py-3 px-4">
                  <Trophy size={18} /> You've mastered every level!
                </div>
                <button
                  onClick={() => setLevel(1)}
                  className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: COLOR }}
                >
                  Play again from Level 1
                </button>
              </motion.div>
            ) : success ? (
              <motion.div key="success" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-center gap-2 bg-[#2d8c6215] text-[#2d8c62] font-nunito font-800 text-sm rounded-2xl py-3 px-4">
                  <CheckCircle2 size={18} /> Correct! Well done!
                </div>
                <button
                  onClick={nextLevel}
                  className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: COLOR }}
                >
                  Next Level <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : checked ? (
              <motion.div
                key="incorrect"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 bg-[#c0446b15] text-[#c0446b] font-nunito font-800 text-sm rounded-2xl py-3 px-4"
              >
                Not quite — the highlighted pieces are in the wrong place. Drag them to fix it.
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {dragging && (
          <motion.div
            className="fixed z-50 pointer-events-none text-4xl"
            style={{ left: dragging.x - 20, top: dragging.y - 20, color: COLOR }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
          >
            {PIECE_GLYPHS[dragging.type]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
