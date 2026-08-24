import { useState } from 'react';
import { Chess } from 'chess.js';

const PUZZLES = [
  {
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    hint: 'Your rook can deliver checkmate along the back rank.'
  },
  {
    fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1',
    hint: 'Use both rooks like a ladder to trap the king.'
  },
  {
    fen: '7k/5K2/8/8/8/8/8/7Q w - - 0 1',
    hint: "Bring your queen down the h-file — your king covers the escape squares."
  }
];

const PIECE_UNICODE = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
  P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔'
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function squareName(rowIdx, colIdx) {
  return `${FILES[colIdx]}${8 - rowIdx}`;
}

export default function ChessTactics({ onComplete }) {
  const [puzzle] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);
  const [game] = useState(() => new Chess(puzzle.fen));
  const [board, setBoard] = useState(() => game.board());
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);

  const handleSquareClick = (rowIdx, colIdx) => {
    if (solved) return;
    const square = squareName(rowIdx, colIdx);
    const piece = board[rowIdx][colIdx];

    if (!selected) {
      if (piece && piece.color === 'w') setSelected(square);
      return;
    }

    if (selected === square) {
      setSelected(null);
      return;
    }

    const move = game.move({ from: selected, to: square, promotion: 'q' });
    setSelected(null);

    if (!move) {
      setMessage("That move isn't legal — try again.");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (game.isCheckmate()) {
      setBoard(game.board());
      setSolved(true);
      const score = nextAttempts <= 1 ? 100 : nextAttempts === 2 ? 70 : 40;
      const stars = nextAttempts <= 1 ? 3 : nextAttempts === 2 ? 2 : 1;
      setMessage('Checkmate! Well spotted.');
      onComplete({ score, stars });
    } else {
      game.undo();
      setBoard(game.board());
      setMessage("Good try, but that's not checkmate. Look again.");
    }
  };

  return (
    <div>
      <p className="font-nunito text-sm text-[#2D2520]/60 mb-1">White to move — find checkmate in one.</p>
      <p className="font-nunito text-xs text-[#2D2520]/40 mb-4">{puzzle.hint}</p>

      <div className="grid grid-cols-8 w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-[#2D2520]/20 mb-4">
        {board.map((row, rowIdx) =>
          row.map((piece, colIdx) => {
            const isDark = (rowIdx + colIdx) % 2 === 1;
            const square = squareName(rowIdx, colIdx);
            const isSelected = selected === square;
            return (
              <button
                key={square}
                onClick={() => handleSquareClick(rowIdx, colIdx)}
                className="aspect-square flex items-center justify-center text-2xl sm:text-3xl"
                style={{ backgroundColor: isSelected ? '#E8A02066' : isDark ? '#DDD8CC' : '#FAFAF7' }}
              >
                {piece && (
                  <span style={{ color: piece.color === 'w' ? '#2D2520' : '#7a2d2d' }}>
                    {PIECE_UNICODE[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {message && <p className="text-center font-nunito text-sm font-700 text-[#2D2520]">{message}</p>}
    </div>
  );
}
