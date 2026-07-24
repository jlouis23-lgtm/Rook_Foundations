import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, Check, X } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import ShapeIcon from '@/components/ShapeIcon';
import { generateRound } from '@/lib/patterns';

const COLOR = '#4a7eb8';
const TOTAL_ROUNDS = 6;

export default function PatternDetective() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generateRound('explorer'));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const newSession = useCallback((diff = difficulty) => {
    setRound(0);
    setScore(0);
    setSelected(null);
    setPuzzle(generateRound(diff));
  }, [difficulty]);

  useEffect(() => {
    newSession(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const finished = round >= TOTAL_ROUNDS;

  useEffect(() => {
    if (finished && score >= TOTAL_ROUNDS - 1) {
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 }, colors: ['#E8A020', '#4a7eb8', '#2d8c62'] });
    }
  }, [finished, score]);

  function handleChoice(option) {
    if (selected) return;
    const correct = option.shape === puzzle.answer.shape && option.color === puzzle.answer.color;
    setSelected({ option, correct });
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      setRound((r) => r + 1);
      setPuzzle(generateRound(difficulty));
    }, 900);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Sparkles}
        color={COLOR}
        title="Pattern Detective"
        description="Study the sequence, work out the rule, and choose the shape that comes next."
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
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {puzzle.sequence.map((item, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <ShapeIcon shape={item.shape} color={item.color} />
              </div>
            ))}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-dashed border-ink/25">
              <HelpCircle size={24} className="text-ink/35" />
            </div>
          </div>

          <p className="text-center font-nunito text-ink/50 text-sm font-700 uppercase tracking-widest mb-5">
            What comes next?
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {puzzle.options.map((option, i) => {
              const isSelected = selected?.option === option;
              const isAnswer = selected && option.shape === puzzle.answer.shape && option.color === puzzle.answer.color;
              let ring = 'border-ink/10 hover:border-ink/25';
              if (selected && isAnswer) ring = 'border-[#2d8c62] bg-[#2d8c6212]';
              else if (isSelected && !isAnswer) ring = 'border-[#c0446b] bg-[#c0446b12]';

              return (
                <button
                  key={i}
                  onClick={() => handleChoice(option)}
                  disabled={!!selected}
                  className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative transition-colors ${ring}`}
                >
                  <ShapeIcon shape={option.shape} color={option.color} size={30} />
                  {selected && isAnswer && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2d8c62] flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </span>
                  )}
                  {isSelected && !isAnswer && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#c0446b] flex items-center justify-center">
                      <X size={13} className="text-white" />
                    </span>
                  )}
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
            You solved <span className="font-800" style={{ color: COLOR }}>{score}</span> out of {TOTAL_ROUNDS} patterns.
          </p>
          <RestartButton onClick={() => newSession()} color={COLOR} label="Play again" />
        </motion.div>
      )}
    </div>
  );
}
