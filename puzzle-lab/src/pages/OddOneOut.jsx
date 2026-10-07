import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ScanEye } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import ShapeIcon from '@/components/ShapeIcon';
import { generateRound } from '@/lib/oddOneOut';

const COLOR = '#b8790a';
const TOTAL_ROUNDS = 6;
const GRID_COLS = { explorer: 'grid-cols-3', thinker: 'grid-cols-3', champion: 'grid-cols-4' };

export default function OddOneOut() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generateRound('explorer'));
  const [pickedId, setPickedId] = useState(null);
  const [score, setScore] = useState(0);

  const newSession = useCallback((diff = difficulty) => {
    setRound(0);
    setScore(0);
    setPickedId(null);
    setPuzzle(generateRound(diff));
  }, [difficulty]);

  useEffect(() => {
    newSession(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const finished = round >= TOTAL_ROUNDS;

  useEffect(() => {
    if (finished && score >= TOTAL_ROUNDS - 1) {
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 }, colors: ['#E8A020', '#b8790a', '#2d8c62'] });
    }
  }, [finished, score]);

  function handlePick(item) {
    if (pickedId !== null) return;
    setPickedId(item.id);
    if (item.id === puzzle.oddIndex) setScore((s) => s + 1);

    setTimeout(() => {
      setPickedId(null);
      setRound((r) => r + 1);
      setPuzzle(generateRound(difficulty));
    }, 750);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={ScanEye}
        color={COLOR}
        title="Odd One Out"
        description="Every shape in the grid matches, except one. Tap the shape that doesn't belong."
      />

      <div className="mb-8">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="font-nunito text-ink/70 text-sm font-700">
          Round {Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </span>
        <div className="flex items-center gap-4">
          <span className="font-nunito text-ink/70 text-sm font-700">Score: {score}</span>
          <RestartButton onClick={() => newSession()} color={COLOR} />
        </div>
      </div>

      {!finished ? (
        <motion.div
          key={round}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-ink/8 rounded-3xl p-8"
        >
          <div className={`grid ${GRID_COLS[difficulty]} gap-4 max-w-md mx-auto`}>
            {puzzle.items.map((item) => {
              const isPicked = pickedId === item.id;
              const isAnswer = pickedId !== null && item.id === puzzle.oddIndex;
              let ring = 'border-transparent hover:bg-ink/5';
              if (isAnswer) ring = 'border-[#2d8c62] bg-[#2d8c6212]';
              else if (isPicked) ring = 'border-[#c0446b] bg-[#c0446b12]';

              return (
                <button
                  key={item.id}
                  onClick={() => handlePick(item)}
                  disabled={pickedId !== null}
                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-colors ${ring}`}
                >
                  <div style={{ transform: `rotate(${item.rotation}deg)` }}>
                    <ShapeIcon shape={item.shape} color={item.color} size={30} />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-ink/8 rounded-3xl p-10 text-center"
        >
          <h2 className="font-fredoka text-ink text-2xl mb-2">Round complete!</h2>
          <p className="font-nunito text-ink/60 mb-6">
            You spotted <span className="font-800" style={{ color: COLOR }}>{score}</span> out of {TOTAL_ROUNDS} correctly.
          </p>
          <RestartButton onClick={() => newSession()} color={COLOR} label="Play again" />
        </motion.div>
      )}
    </div>
  );
}
