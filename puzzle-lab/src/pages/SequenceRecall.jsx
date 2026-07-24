import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Repeat, Play } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import { randomInt } from '@/lib/difficulty';

const COLOR = '#7a48c0';
const START_LENGTH = { explorer: 2, thinker: 3, champion: 4 };
const PADS = [
  { id: 0, color: '#E8A020' },
  { id: 1, color: '#2d8c62' },
  { id: 2, color: '#4a7eb8' },
  { id: 3, color: '#7a48c0' },
];

export default function SequenceRecall() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [sequence, setSequence] = useState([]);
  const [input, setInput] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | showing | input | gameover
  const [activePad, setActivePad] = useState(null);
  const timeouts = useRef([]);

  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const reset = useCallback(() => {
    clearTimers();
    setSequence([]);
    setInput([]);
    setActivePad(null);
    setPhase('idle');
  }, []);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const playSequence = useCallback((seq) => {
    setPhase('showing');
    setInput([]);
    seq.forEach((padId, i) => {
      const onId = setTimeout(() => setActivePad(padId), i * 700);
      const offId = setTimeout(() => setActivePad(null), i * 700 + 450);
      timeouts.current.push(onId, offId);
    });
    const doneId = setTimeout(() => setPhase('input'), seq.length * 700 + 150);
    timeouts.current.push(doneId);
  }, []);

  function start() {
    const seq = Array.from({ length: START_LENGTH[difficulty] }, () => randomInt(0, 3));
    setSequence(seq);
    playSequence(seq);
  }

  function handlePadClick(padId) {
    if (phase !== 'input') return;
    const nextInput = [...input, padId];
    const stepIndex = nextInput.length - 1;

    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    if (sequence[stepIndex] !== padId) {
      setPhase('gameover');
      return;
    }

    setInput(nextInput);

    if (nextInput.length === sequence.length) {
      const grown = [...sequence, randomInt(0, 3)];
      const timeoutId = setTimeout(() => {
        setSequence(grown);
        playSequence(grown);
      }, 600);
      timeouts.current.push(timeoutId);
    }
  }

  const completedSteps = sequence.length - (phase === 'gameover' ? 1 : 0);

  useEffect(() => {
    if (phase === 'gameover' && completedSteps >= 8) {
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 }, colors: ['#E8A020', '#7a48c0', '#4a7eb8'] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Repeat}
        color={COLOR}
        title="Sequence Recall"
        description="Watch the pads light up, then repeat the pattern back in the same order. Each round adds one more step."
      />

      <div className="mb-8">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="font-nunito text-ink/70 text-sm font-700">
          {phase === 'idle' ? 'Ready when you are' : `Level: ${sequence.length}`}
        </span>
        <RestartButton onClick={reset} color={COLOR} label="Reset" />
      </div>

      <div className="bg-white border border-ink/8 rounded-3xl p-8 flex flex-col items-center gap-8">
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {PADS.map((pad) => (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={phase !== 'input'}
              className="aspect-square rounded-3xl transition-all duration-150"
              style={{
                backgroundColor: pad.color,
                opacity: activePad === pad.id ? 1 : phase === 'input' ? 0.55 : 0.35,
                transform: activePad === pad.id ? 'scale(0.94)' : 'scale(1)',
                boxShadow: activePad === pad.id ? `0 0 0 6px ${pad.color}30` : 'none',
              }}
            />
          ))}
        </div>

        {phase === 'idle' && (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            <Play size={18} fill="white" /> Start
          </button>
        )}

        {phase === 'showing' && (
          <p className="font-nunito text-ink/50 text-sm font-700">Watch closely…</p>
        )}

        {phase === 'input' && (
          <p className="font-nunito text-ink/50 text-sm font-700">Your turn — repeat the pattern</p>
        )}

        {phase === 'gameover' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h3 className="font-fredoka text-ink text-xl mb-1">Nice memory!</h3>
            <p className="font-nunito text-ink/60 text-sm mb-5">
              You remembered <span className="font-800" style={{ color: COLOR }}>{Math.max(completedSteps, 0)}</span> step{completedSteps === 1 ? '' : 's'} correctly.
            </p>
            <button
              onClick={start}
              className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              style={{ backgroundColor: COLOR }}
            >
              <Play size={18} fill="white" /> Play again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
