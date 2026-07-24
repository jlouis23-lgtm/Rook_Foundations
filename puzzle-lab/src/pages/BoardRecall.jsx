import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Play, Sparkles } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import { SQUARES, PIECE_GLYPHS, DIFFICULTY_CONFIG, pieceCountForRound, generateLayout } from '@/lib/chessMemory';
import { shuffle } from '@/lib/difficulty';

const COLOR = '#E8A020';
const LIGHT_SQUARE = '#f7ecd6';
const DARK_SQUARE = '#c99a54';

export default function BoardRecall() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [phase, setPhase] = useState('ready'); // ready | memorize | recall | success | gameover
  const [round, setRound] = useState(1);
  const [layout, setLayout] = useState([]);
  const [placed, setPlaced] = useState({});
  const [tray, setTray] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [mistake, setMistake] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);

  const timers = useRef([]);
  const intervalRef = useRef(null);

  const layoutMap = useMemo(() => Object.fromEntries(layout.map((p) => [p.square, p.type])), [layout]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => () => clearTimers(), []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('ready');
    setRound(1);
    setLayout([]);
    setPlaced({});
    setTray([]);
    setMistake(null);
    setDragging(null);
    setHoverSquare(null);
  }, []);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const startRound = useCallback((roundNum) => {
    const count = pieceCountForRound(difficulty, roundNum);
    const newLayout = generateLayout(count);
    setLayout(newLayout);
    setPlaced({});
    setMistake(null);
    setPhase('memorize');

    const memorizeMs = DIFFICULTY_CONFIG[difficulty].memorizeMs;
    const totalSeconds = Math.round(memorizeMs / 1000);
    setCountdown(totalSeconds);

    let remaining = totalSeconds;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setTray(shuffle(newLayout).map((p, i) => ({ id: `${p.square}-${i}`, type: p.type })));
        setPhase('recall');
      }
    }, 1000);
  }, [difficulty]);

  function handleStart() {
    setRound(1);
    startRound(1);
  }

  function findSquare(x, y) {
    const el = document.elementFromPoint(x, y);
    const target = el?.closest('[data-square]');
    return target?.getAttribute('data-square') || null;
  }

  function handlePointerDownTray(e, item) {
    e.preventDefault();
    setDragging({ id: item.id, type: item.type, x: e.clientX, y: e.clientY });

    function onMove(ev) {
      setHoverSquare(findSquare(ev.clientX, ev.clientY));
      setDragging((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    }
    function onUp(ev) {
      const sq = findSquare(ev.clientX, ev.clientY);
      handleDrop(sq, item);
      setDragging(null);
      setHoverSquare(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function handleDrop(squareId, item) {
    if (!squareId || !item) return;
    if (placed[squareId]) return; // occupied, ignore drop

    const originalType = layoutMap[squareId];

    if (originalType && originalType === item.type) {
      const nextPlaced = { ...placed, [squareId]: item.type };
      setPlaced(nextPlaced);
      setTray((t) => t.filter((p) => p.id !== item.id));

      if (Object.keys(nextPlaced).length === layout.length) {
        setPhase('success');
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 }, colors: ['#E8A020', '#2d8c62', '#c99a54'] });
        const id = setTimeout(() => {
          const nextRound = round + 1;
          setRound(nextRound);
          startRound(nextRound);
        }, 1100);
        timers.current.push(id);
      }
    } else {
      setMistake({ square: squareId, droppedType: item.type });
      setPhase('gameover');
    }
  }

  const piecesPlaced = Object.keys(placed).length;
  const totalPieces = layout.length;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Crown}
        color={COLOR}
        title="Board Recall"
        description="Watch where the pieces are placed, then rebuild the board from memory by dragging each piece back into position."
      />

      <div className="mb-8">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="font-nunito text-ink/70 text-sm font-700">
          {phase === 'ready' ? 'Ready when you are' : `Round ${round} · ${totalPieces} piece${totalPieces === 1 ? '' : 's'}`}
        </span>
        <RestartButton onClick={reset} color={COLOR} label="Reset" />
      </div>

      <div className="bg-white border border-ink/8 rounded-3xl p-6 sm:p-8">
        {phase === 'memorize' && (
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-2 font-nunito font-800 text-sm px-4 py-2 rounded-full" style={{ backgroundColor: `${COLOR}18`, color: COLOR }}>
              Memorize the board… {countdown}
            </span>
          </div>
        )}
        {phase === 'recall' && (
          <div className="text-center mb-5">
            <p className="font-nunito text-ink/60 text-sm font-700">Drag each piece back to its square</p>
          </div>
        )}
        {phase === 'success' && (
          <div className="text-center mb-5 flex items-center justify-center gap-2">
            <Sparkles size={16} style={{ color: COLOR }} />
            <p className="font-nunito font-800 text-sm" style={{ color: COLOR }}>Board complete! Next round…</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Board */}
          <div
            className="grid grid-cols-8 rounded-xl overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: '#8a6a3f', width: 'min(88vw, 400px)', height: 'min(88vw, 400px)' }}
          >
            {SQUARES.map((square, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isDark = (row + col) % 2 === 1;
              const showPiece =
                phase === 'memorize'
                  ? layoutMap[square]
                  : phase === 'gameover'
                  ? layoutMap[square]
                  : placed[square];
              const isHover = phase === 'recall' && hoverSquare === square && !placed[square];
              const isMistakeSquare = phase === 'gameover' && mistake?.square === square;
              const isCorrectSquare = phase === 'gameover' && placed[square];
              const isMissedSquare = phase === 'gameover' && layoutMap[square] && !placed[square] && mistake?.square !== square;

              return (
                <div
                  key={square}
                  data-square={square}
                  className="relative flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isDark ? DARK_SQUARE : LIGHT_SQUARE,
                    outline: isHover ? `3px solid ${COLOR}` : 'none',
                    outlineOffset: '-3px',
                  }}
                >
                  {isMistakeSquare && <div className="absolute inset-0 bg-[#c0446b]/35" />}
                  {isCorrectSquare && phase === 'gameover' && <div className="absolute inset-0 bg-[#2d8c62]/20" />}
                  {isMissedSquare && <div className="absolute inset-0 bg-ink/10" />}
                  {showPiece && (
                    <span
                      className="select-none leading-none"
                      style={{
                        fontSize: 'min(6.5vw, 30px)',
                        color: isMistakeSquare ? '#c0446b' : '#2D2520',
                      }}
                    >
                      {PIECE_GLYPHS[showPiece]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-52 flex-shrink-0">
            {phase === 'ready' && (
              <div className="text-center lg:text-left">
                <p className="font-nunito text-ink/60 text-sm leading-relaxed mb-5">
                  Study the pieces, then rebuild the board once it's cleared. One wrong square ends the run.
                </p>
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: COLOR }}
                >
                  <Play size={18} fill="white" /> Start
                </button>
              </div>
            )}

            {phase === 'recall' && (
              <div>
                <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-3 text-center lg:text-left">
                  {tray.length} to place
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {tray.map((item) => (
                    <button
                      key={item.id}
                      onPointerDown={(e) => handlePointerDownTray(e, item)}
                      className="w-14 h-14 rounded-2xl bg-[#f7ecd6] border-2 border-[#c99a54]/50 flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing touch-none"
                      style={{ opacity: dragging?.id === item.id ? 0.25 : 1, color: '#2D2520' }}
                    >
                      {PIECE_GLYPHS[item.type]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === 'gameover' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <h3 className="font-fredoka text-ink text-xl mb-1">So close!</h3>
                <p className="font-nunito text-ink/60 text-sm mb-5 leading-relaxed">
                  You placed <span className="font-800" style={{ color: COLOR }}>{piecesPlaced}</span> of {totalPieces} pieces correctly on round {round}.
                </p>
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: COLOR }}
                >
                  <Play size={18} fill="white" /> Play again
                </button>
              </motion.div>
            )}
          </div>
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
