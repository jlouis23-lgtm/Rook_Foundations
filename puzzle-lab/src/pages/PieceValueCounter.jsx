import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calculator, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import { SQUARES } from '@/lib/chessMemory';
import { PIECE_VALUES, WHITE_GLYPHS, BLACK_GLYPHS, REFERENCE_ORDER, generatePuzzle } from '@/lib/pieceValues';

const COLOR = '#1f9e9e';
const LIGHT_SQUARE = '#f7ecd6';
const DARK_SQUARE = '#c99a54';

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-fredoka text-ink text-xl leading-none">{value}</div>
      <div className="font-nunito text-ink/45 text-[10px] font-800 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

export default function PieceValueCounter() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [puzzle, setPuzzle] = useState(() => generatePuzzle('explorer'));
  const [puzzleNumber, setPuzzleNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const [correctChecks, setCorrectChecks] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('idle'); // idle | correct | incorrect
  const [locked, setLocked] = useState(false);

  function startNewSession(diff) {
    setPuzzleNumber(1);
    setScore(0);
    setTotalChecks(0);
    setCorrectChecks(0);
    setPuzzle(generatePuzzle(diff));
    setAnswer('');
    setFeedback('idle');
    setLocked(false);
  }

  useEffect(() => {
    startNewSession(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const pieceMap = useMemo(() => Object.fromEntries(puzzle.pieces.map((p) => [p.square, p.type])), [puzzle]);
  const glyphs = puzzle.color === 'white' ? WHITE_GLYPHS : BLACK_GLYPHS;
  const accuracy = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : null;

  function handleAnswerChange(e) {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setAnswer(digits);
    if (feedback === 'incorrect') setFeedback('idle');
  }

  function checkAnswer() {
    if (locked || answer === '') return;
    const numeric = Number(answer);
    setTotalChecks((t) => t + 1);

    if (numeric === puzzle.total) {
      setFeedback('correct');
      setLocked(true);
      setScore((s) => s + 1);
      setCorrectChecks((c) => c + 1);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#1f9e9e', '#E8A020', '#2d8c62'] });
    } else {
      setFeedback('incorrect');
    }
  }

  function nextPuzzle() {
    setPuzzleNumber((n) => n + 1);
    setPuzzle(generatePuzzle(difficulty));
    setAnswer('');
    setFeedback('idle');
    setLocked(false);
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (locked) nextPuzzle();
    else checkAnswer();
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Calculator}
        color={COLOR}
        title="Piece Value Counter"
        description="Count every piece on the board, add up their values using the reference key, and enter the total."
      />

      <div className="mb-8">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <Stat label="Puzzle" value={puzzleNumber} />
          <Stat label="Score" value={score} />
          {accuracy !== null && <Stat label="Accuracy" value={`${accuracy}%`} />}
        </div>
        <RestartButton onClick={() => startNewSession(difficulty)} color={COLOR} />
      </div>

      <div className="bg-white border border-ink/8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Board */}
          <motion.div
            key={puzzleNumber}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="grid rounded-xl overflow-hidden border-2 flex-shrink-0"
            style={{
              borderColor: '#8a6a3f',
              width: 'min(88vw, 400px)',
              height: 'min(88vw, 400px)',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridTemplateRows: 'repeat(8, 1fr)',
            }}
          >
            {SQUARES.map((square, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isDark = (row + col) % 2 === 1;
              const type = pieceMap[square];

              return (
                <div
                  key={square}
                  className="flex items-center justify-center"
                  style={{ backgroundColor: isDark ? DARK_SQUARE : LIGHT_SQUARE }}
                >
                  {type && (
                    <span className="select-none leading-none" style={{ fontSize: 'min(6.5vw, 30px)', color: '#2D2520' }}>
                      {glyphs[type]}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Reference key */}
          <div className="w-full lg:w-52 flex-shrink-0 bg-[#faf7f0] rounded-2xl border border-ink/8 p-5">
            <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-3">Reference key</p>
            <div>
              {REFERENCE_ORDER.map((type) => (
                <div key={type} className="flex items-center justify-between gap-3 py-2 border-b border-ink/8 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none w-7 text-center" style={{ color: '#2D2520' }}>
                      {glyphs[type]}
                    </span>
                    <span className="font-nunito text-ink/70 text-sm font-700 capitalize">{type}</span>
                  </div>
                  <span className="font-fredoka text-lg" style={{ color: COLOR }}>
                    {PIECE_VALUES[type]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Answer entry */}
        <div className="mt-8 max-w-sm mx-auto text-center">
          <AnimatePresence mode="wait">
            {feedback === 'correct' && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center justify-center gap-2 bg-[#2d8c6215] text-[#2d8c62] font-nunito font-800 text-sm rounded-2xl py-3 px-4"
              >
                <CheckCircle2 size={18} /> Correct! Well done!
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div
                key="incorrect"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center justify-center gap-2 bg-[#c0446b15] text-[#c0446b] font-nunito font-800 text-sm rounded-2xl py-3 px-4"
              >
                <XCircle size={18} /> Not quite, try again.
              </motion.div>
            )}
          </AnimatePresence>

          {!locked ? (
            <motion.div
              key={totalChecks}
              initial={feedback === 'incorrect' ? { x: -8 } : false}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 15 }}
              className="flex gap-3"
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={answer}
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                placeholder="Total value"
                autoFocus
                className="flex-1 font-fredoka text-lg text-center rounded-2xl border-2 border-ink/15 px-4 py-3 focus:outline-none focus:border-[#1f9e9e] transition-colors"
              />
              <button
                onClick={checkAnswer}
                disabled={answer === ''}
                className="font-fredoka text-white text-base px-6 py-3 rounded-2xl hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ backgroundColor: COLOR }}
              >
                Check Answer
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextPuzzle}
              className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              style={{ backgroundColor: COLOR }}
            >
              Next Puzzle <ArrowRight size={18} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
