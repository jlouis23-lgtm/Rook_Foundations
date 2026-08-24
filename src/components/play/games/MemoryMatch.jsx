import { useEffect, useState } from 'react';

const PIECE_SET = ['♔', '♕', '♖', '♗', '♘', '♙'];

function shuffledDeck() {
  const deck = [...PIECE_SET, ...PIECE_SET].map((symbol, i) => ({ id: i, symbol }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryMatch({ onComplete }) {
  const [deck] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const finished = matched.length === deck.length;

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    setMoves((m) => m + 1);
    if (deck[a].symbol === deck[b].symbol) {
      setMatched((prev) => [...prev, a, b]);
      setFlipped([]);
    } else {
      const timeout = setTimeout(() => setFlipped([]), 700);
      return () => clearTimeout(timeout);
    }
  }, [flipped, deck]);

  useEffect(() => {
    if (!finished) return;
    const perfect = deck.length / 2;
    const extraMoves = Math.max(0, moves - perfect);
    const score = Math.max(10, 100 - extraMoves * 8);
    const stars = extraMoves <= 1 ? 3 : extraMoves <= 4 ? 2 : 1;
    onComplete({ score, stars });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped((prev) => [...prev, index]);
  };

  return (
    <div>
      <p className="font-nunito text-sm text-[#2D2520]/60 mb-4">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {deck.map((card, index) => {
          const isRevealed = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-fredoka transition-all duration-300 ${
                isRevealed ? 'bg-white border-2 border-[#E8A020] text-[#2D2520]' : 'bg-[#E8A020] hover:bg-[#d4940e]'
              } ${matched.includes(index) ? 'opacity-40' : ''}`}
            >
              {isRevealed ? card.symbol : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
