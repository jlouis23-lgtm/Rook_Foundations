import { useState } from 'react';

const COLORS = ['#E8A020', '#2d8c62', '#4a7eb8', '#7a48c0', '#d1495b', '#2D2520'];
const CODE_LENGTH = 4;
const MAX_GUESSES = 8;

function randomCode() {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length));
}

function scoreGuess(code, guess) {
  let exact = 0;
  const codeLeft = [];
  const guessLeft = [];
  code.forEach((c, i) => {
    if (c === guess[i]) {
      exact++;
    } else {
      codeLeft.push(c);
      guessLeft.push(guess[i]);
    }
  });
  let partial = 0;
  const used = [...codeLeft];
  guessLeft.forEach((g) => {
    const idx = used.indexOf(g);
    if (idx !== -1) {
      partial++;
      used.splice(idx, 1);
    }
  });
  return { exact, partial };
}

export default function Mastermind({ onComplete }) {
  const [code] = useState(randomCode);
  const [current, setCurrent] = useState([]);
  const [history, setHistory] = useState([]);
  const [ended, setEnded] = useState(false);
  const [message, setMessage] = useState('');

  const addColor = (colorIndex) => {
    if (current.length >= CODE_LENGTH || ended) return;
    setCurrent((prev) => [...prev, colorIndex]);
  };

  const undo = () => setCurrent((prev) => prev.slice(0, -1));

  const submitGuess = () => {
    if (current.length !== CODE_LENGTH) return;
    const result = scoreGuess(code, current);
    const nextHistory = [...history, { guess: current, ...result }];
    setHistory(nextHistory);
    setCurrent([]);

    if (result.exact === CODE_LENGTH) {
      setEnded(true);
      const guessesUsed = nextHistory.length;
      const score = Math.max(10, 100 - (guessesUsed - 1) * 12);
      const stars = guessesUsed <= 3 ? 3 : guessesUsed <= 6 ? 2 : 1;
      setMessage('You cracked the code!');
      onComplete({ score, stars });
    } else if (nextHistory.length >= MAX_GUESSES) {
      setEnded(true);
      setMessage('Out of guesses — good effort!');
      onComplete({ score: 5, stars: 1 });
    }
  };

  return (
    <div>
      <p className="font-nunito text-sm text-[#2D2520]/60 mb-4">
        Guess the {CODE_LENGTH}-colour code. {Math.max(0, MAX_GUESSES - history.length)} guesses left.
      </p>

      <div className="flex gap-2 mb-4">
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-xl border-2 border-[#DDD8CC]"
            style={{ backgroundColor: current[i] !== undefined ? COLORS[current[i]] : 'white' }}
          />
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => addColor(i)}
            disabled={ended}
            className="w-10 h-10 rounded-full border-2 border-white shadow disabled:opacity-50"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={undo}
          disabled={ended}
          className="px-4 py-2 rounded-xl bg-[#F5F3EE] font-nunito text-sm font-700 text-[#2D2520]/70 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={submitGuess}
          disabled={current.length !== CODE_LENGTH || ended}
          className="px-4 py-2 rounded-xl bg-[#E8A020] text-white font-nunito text-sm font-700 disabled:opacity-50"
        >
          Guess
        </button>
      </div>

      {message && <p className="font-nunito text-sm font-700 text-[#2D2520] mb-4">{message}</p>}

      <div className="space-y-2">
        {history.map((entry, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {entry.guess.map((c, j) => (
                <div key={j} className="w-6 h-6 rounded-full" style={{ backgroundColor: COLORS[c] }} />
              ))}
            </div>
            <span className="font-nunito text-xs text-[#2D2520]/60">
              {entry.exact} exact, {entry.partial} close
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
