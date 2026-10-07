import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Eye, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import RestartButton from '@/components/RestartButton';
import { FILES, RANKS, PIECE_SIZE_SCALE } from '@/lib/chessMemory';
import { WHITE_GLYPHS, BLACK_GLYPHS } from '@/lib/pieceValues';
import {
  generatePuzzle,
  generateSquareChoices,
  generatePieceTypeChoices,
  capitalize,
  MAX_LEVEL,
} from '@/lib/whatsChanged';

const COLOR = '#c2419a';
const LIGHT_SQUARE = '#f7ecd6';
const DARK_SQUARE = '#c99a54';
const BLANK_MS = 2500;

function LabeledBoard({ pieces, color, size = 440, highlightSquare }) {
  const glyphs = color === 'white' ? WHITE_GLYPHS : BLACK_GLYPHS;
  const pieceMap = useMemo(() => Object.fromEntries(pieces.map((p) => [p.square, p.type])), [pieces]);
  const gutter = Math.max(16, Math.round(size * 0.062));
  const labelFont = Math.max(9, Math.round(size * 0.026));
  const basePieceFont = Math.max(12, Math.round(size * 0.062));

  const cells = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) cells.push({ row, col });
  }

  return (
    <div
      className="grid rounded-xl overflow-hidden border-2 flex-shrink-0"
      style={{
        borderColor: '#8a6a3f',
        width: size,
        height: size,
        gridTemplateColumns: `${gutter}px repeat(8, 1fr) ${gutter}px`,
        gridTemplateRows: `${gutter}px repeat(8, 1fr) ${gutter}px`,
      }}
    >
      {cells.map(({ row, col }) => {
        const isLabelRow = row === 0 || row === 9;
        const isLabelCol = col === 0 || col === 9;

        if (isLabelRow && isLabelCol) return <div key={`${row}-${col}`} />;
        if (isLabelRow) {
          return (
            <div
              key={`${row}-${col}`}
              className="flex items-center justify-center font-nunito font-800 text-ink/80"
              style={{ fontSize: labelFont }}
            >
              {FILES[col - 1].toUpperCase()}
            </div>
          );
        }
        if (isLabelCol) {
          return (
            <div
              key={`${row}-${col}`}
              className="flex items-center justify-center font-nunito font-800 text-ink/80"
              style={{ fontSize: labelFont }}
            >
              {RANKS[row - 1]}
            </div>
          );
        }

        const file = FILES[col - 1];
        const rank = RANKS[row - 1];
        const square = `${file}${rank}`;
        const boardRow = row - 1;
        const boardCol = col - 1;
        const isDark = (boardRow + boardCol) % 2 === 1;
        const type = pieceMap[square];
        const isHighlight = highlightSquare === square;

        return (
          <div
            key={`${row}-${col}`}
            className="relative flex items-center justify-center"
            style={{ backgroundColor: isDark ? DARK_SQUARE : LIGHT_SQUARE }}
          >
            {isHighlight && (
              <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 0 3px ${COLOR}`, backgroundColor: `${COLOR}25` }} />
            )}
            {type && (
              <span
                className="select-none leading-none"
                style={{ fontSize: basePieceFont * (PIECE_SIZE_SCALE[type] ?? 1), color: '#2D2520' }}
              >
                {glyphs[type]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WhatsChanged() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(1));
  const [phase, setPhase] = useState('observe1'); // observe1 | blank | observe2 | question | result
  const [countdown, setCountdown] = useState(0);
  const [typeChoices, setTypeChoices] = useState([]);
  const [squareChoices, setSquareChoices] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [squareAnswer, setSquareAnswer] = useState('');
  const [resultCorrect, setResultCorrect] = useState(null);
  const [mastered, setMastered] = useState(false);

  const timers = useRef([]);

  function clearAllTimers() {
    timers.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timers.current = [];
  }

  function startCountdown(seconds, onDone) {
    setCountdown(seconds);
    let remaining = seconds;
    const id = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        onDone();
      }
    }, 1000);
    timers.current.push(id);
  }

  function startLevel(lvl) {
    clearAllTimers();
    const p = generatePuzzle(lvl);
    setPuzzle(p);
    setTypeChoices(generatePieceTypeChoices());
    setSquareChoices(p.config.squareMode === 'choice' ? generateSquareChoices(p.addedPiece.square, p.config.choiceCount, p.config.similar) : []);
    setSelectedType(null);
    setSquareAnswer('');
    setResultCorrect(null);
    setPhase('observe1');

    startCountdown(p.config.obs, () => {
      setPhase('blank');
      const id = setTimeout(() => {
        setPhase('observe2');
        startCountdown(p.config.obs, () => setPhase('question'));
      }, BLANK_MS);
      timers.current.push(id);
    });
  }

  useEffect(() => {
    setMastered(false);
    startLevel(level);
    return () => clearAllTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function checkAnswer() {
    const typeCorrect = selectedType === puzzle.addedPiece.type;
    const squareCorrect =
      puzzle.config.squareMode === 'typed'
        ? squareAnswer.trim().toLowerCase() === puzzle.addedPiece.square.toLowerCase()
        : squareAnswer === puzzle.addedPiece.square;
    const correct = typeCorrect && squareCorrect;
    setResultCorrect(correct);
    setPhase('result');
    if (correct) {
      setScore((s) => s + 1);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [COLOR, '#E8A020', '#2d8c62'] });
    }
  }

  function nextLevel() {
    if (level >= MAX_LEVEL) {
      setMastered(true);
      return;
    }
    setLevel((l) => l + 1);
  }

  function retrySameLevel() {
    startLevel(level);
  }

  const allPieces = useMemo(() => [...puzzle.existingPieces, puzzle.addedPiece], [puzzle]);
  const canSubmit = selectedType !== null && squareAnswer !== '';
  const progress = level / MAX_LEVEL;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Eye}
        color={COLOR}
        title="What's Changed?"
        description="Study the board, then spot the one new piece that appears — and remember exactly which square it landed on."
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-fredoka text-ink text-xl leading-none">{level}</div>
            <div className="font-nunito text-ink/45 text-[10px] font-800 uppercase tracking-widest mt-1">Level of {MAX_LEVEL}</div>
          </div>
          <div className="text-center">
            <div className="font-fredoka text-ink text-xl leading-none">{score}</div>
            <div className="font-nunito text-ink/45 text-[10px] font-800 uppercase tracking-widest mt-1">Score</div>
          </div>
        </div>
        <RestartButton onClick={retrySameLevel} color={COLOR} label="Reset" />
      </div>

      <div className="w-full h-2.5 bg-ink/8 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: COLOR }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-white border border-ink/8 rounded-3xl p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {(phase === 'observe1' || phase === 'observe2') && (
            <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <span
                className="inline-flex items-center gap-2 font-nunito font-800 text-sm px-4 py-2 rounded-full mb-5"
                style={{ backgroundColor: `${COLOR}18`, color: COLOR }}
              >
                {phase === 'observe1' ? 'Study the board…' : 'One piece was added — look again…'} {countdown}
              </span>
              <LabeledBoard pieces={phase === 'observe1' ? puzzle.existingPieces : allPieces} color={puzzle.color} />
            </motion.div>
          )}

          {phase === 'blank' && (
            <motion.div
              key="blank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
              style={{ height: 'min(92vw, 440px)' }}
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLOR }}
              />
            </motion.div>
          )}

          {phase === 'question' && (
            <motion.div key="question" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
              <div className="mb-8">
                <p className="font-fredoka text-ink text-lg mb-4 text-center">Which piece was added?</p>
                <div className="grid grid-cols-3 gap-3">
                  {typeChoices.map((type) => {
                    const glyphs = puzzle.color === 'white' ? WHITE_GLYPHS : BLACK_GLYPHS;
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className="flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-colors"
                        style={{ borderColor: isSelected ? COLOR : '#e5e0d3', backgroundColor: isSelected ? `${COLOR}12` : '#fff' }}
                      >
                        <span className="leading-none" style={{ color: '#2D2520', fontSize: 24 * (PIECE_SIZE_SCALE[type] ?? 1) }}>
                          {glyphs[type]}
                        </span>
                        <span className="font-nunito text-xs font-700" style={{ color: isSelected ? COLOR : '#2D2520' }}>
                          {capitalize(type)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <p className="font-fredoka text-ink text-lg mb-4 text-center">Which square was it placed on?</p>
                {puzzle.config.squareMode === 'choice' ? (
                  <div className="grid grid-cols-3 gap-3">
                    {squareChoices.map((sq) => {
                      const isSelected = squareAnswer === sq;
                      return (
                        <button
                          key={sq}
                          onClick={() => setSquareAnswer(sq)}
                          className="py-3 rounded-2xl border-2 font-fredoka text-base transition-colors"
                          style={{
                            borderColor: isSelected ? COLOR : '#e5e0d3',
                            backgroundColor: isSelected ? `${COLOR}12` : '#fff',
                            color: isSelected ? COLOR : '#2D2520',
                          }}
                        >
                          {sq.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={squareAnswer}
                    onChange={(e) => setSquareAnswer(e.target.value.replace(/[^a-hA-H1-8]/g, '').slice(0, 2).toLowerCase())}
                    placeholder="e.g. E5"
                    autoFocus
                    className="w-full max-w-[200px] mx-auto block font-fredoka text-lg text-center uppercase rounded-2xl border-2 border-ink/15 px-4 py-3 focus:outline-none focus:border-[#c2419a] transition-colors"
                  />
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={checkAnswer}
                  disabled={!canSubmit}
                  className="font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
                  style={{ backgroundColor: COLOR }}
                >
                  Check Answer
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              {mastered ? (
                <div className="space-y-4">
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
                </div>
              ) : resultCorrect ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-center gap-2 bg-[#2d8c6215] text-[#2d8c62] font-nunito font-800 text-sm rounded-2xl py-3 px-4">
                    <CheckCircle2 size={18} /> Correct! Excellent memory!
                  </div>
                  <button
                    onClick={nextLevel}
                    className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                    style={{ backgroundColor: COLOR }}
                  >
                    Next Level <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#c0446b15] text-[#c0446b] font-nunito font-800 text-sm rounded-2xl py-3 px-4">
                    Almost! Have another look next time.
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div>
                      <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-2">Before</p>
                      <LabeledBoard pieces={puzzle.existingPieces} color={puzzle.color} size={220} />
                    </div>
                    <div>
                      <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-2">After</p>
                      <LabeledBoard pieces={allPieces} color={puzzle.color} size={220} highlightSquare={puzzle.addedPiece.square} />
                    </div>
                  </div>
                  <p className="font-nunito text-ink/70 text-sm">
                    The added piece was a{' '}
                    <span className="font-800" style={{ color: COLOR }}>
                      {capitalize(puzzle.addedPiece.type)}
                    </span>{' '}
                    on{' '}
                    <span className="font-800" style={{ color: COLOR }}>
                      {puzzle.addedPiece.square.toUpperCase()}
                    </span>
                    .
                  </p>
                  <button
                    onClick={retrySameLevel}
                    className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                    style={{ backgroundColor: COLOR }}
                  >
                    Next Puzzle <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
