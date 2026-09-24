import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Grid3x3, PartyPopper } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import DifficultyPicker from '@/components/DifficultyPicker';
import RestartButton from '@/components/RestartButton';
import { shuffle } from '@/lib/difficulty';

const COLOR = '#2d8c62';
const SYMBOLS = ['🦊', '🐸', '🐢', '🦋', '🐬', '🦁', '🐼', '🐨', '🦉', '🐙', '🐝', '🦄'];

const PAIR_COUNT = { explorer: 4, thinker: 6, champion: 8 };
const GRID_COLS = { explorer: 'grid-cols-4', thinker: 'grid-cols-4', champion: 'grid-cols-4 sm:grid-cols-4' };

function buildDeck(difficulty) {
  const pairCount = PAIR_COUNT[difficulty];
  const chosen = shuffle(SYMBOLS).slice(0, pairCount);
  const deck = shuffle([...chosen, ...chosen]).map((symbol, i) => ({
    id: `${symbol}-${i}`,
    symbol,
    flipped: false,
    matched: false,
  }));
  return deck;
}

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState('explorer');
  const [cards, setCards] = useState(() => buildDeck('explorer'));
  const [picked, setPicked] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const reset = useCallback((diff = difficulty) => {
    setCards(buildDeck(diff));
    setPicked([]);
    setMoves(0);
    setLocked(false);
  }, [difficulty]);

  useEffect(() => {
    reset(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const matchedCount = cards.filter((c) => c.matched).length;
  const totalPairs = PAIR_COUNT[difficulty];
  const won = matchedCount === totalPairs * 2 && totalPairs > 0;

  useEffect(() => {
    if (won) {
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: ['#E8A020', '#2d8c62', '#4a7eb8'] });
    }
  }, [won]);

  function handleFlip(card) {
    if (locked || card.flipped || card.matched || picked.length === 2) return;

    const nextCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    const nextPicked = [...picked, card.id];
    setCards(nextCards);
    setPicked(nextPicked);

    if (nextPicked.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextPicked;
      const first = nextCards.find((c) => c.id === firstId);
      const second = nextCards.find((c) => c.id === secondId);

      if (first.symbol === second.symbol) {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c)));
          setPicked([]);
          setLocked(false);
        }, 450);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c)));
          setPicked([]);
          setLocked(false);
        }, 850);
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Grid3x3}
        color={COLOR}
        title="Memory Match"
        description="Flip two cards at a time and find every matching pair. Try to finish in as few moves as possible!"
      />

      <div className="mb-8">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="font-nunito text-ink/70 text-sm font-700">
          Pairs found: <span style={{ color: COLOR }}>{matchedCount / 2}</span> / {totalPairs}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-nunito text-ink/70 text-sm font-700">Moves: {moves}</span>
          <RestartButton onClick={() => reset()} color={COLOR} />
        </div>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-[#2d8c6212] border border-[#2d8c6240] rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <PartyPopper size={22} style={{ color: COLOR }} />
            <p className="font-nunito text-ink/80 text-sm font-700">
              Great job! You matched all {totalPairs} pairs in {moves} moves.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid ${GRID_COLS[difficulty]} gap-3 sm:gap-4`}>
        {cards.map((card) => {
          const showing = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card)}
              disabled={showing}
              className="aspect-square rounded-2xl relative"
              style={{ perspective: 600 }}
            >
              <motion.div
                animate={{ rotateY: showing ? 180 : 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center bg-gold"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-white text-2xl">♜</span>
                </div>
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: card.matched ? `${COLOR}20` : '#fff',
                    border: card.matched ? `2px solid ${COLOR}` : '1px solid #e5e0d3',
                  }}
                >
                  {card.symbol}
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
