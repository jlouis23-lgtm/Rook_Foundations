import { FILES, SQUARES } from './chessMemory';
import { shuffle, randomInt } from './difficulty';

const BASIC_POOL = ['pawn', 'rook', 'bishop', 'knight'];
export const ALL_TYPES = ['pawn', 'bishop', 'knight', 'rook', 'queen', 'king'];

export const LEVEL_CONFIG = [
  { level: 1, min: 4, max: 5, obs: 10, pool: BASIC_POOL, squareMode: 'choice', choiceCount: 4, similar: false, biasNear: false },
  { level: 2, min: 6, max: 6, obs: 10, pool: BASIC_POOL, squareMode: 'choice', choiceCount: 5, similar: false, biasNear: false },
  { level: 3, min: 7, max: 8, obs: 9, pool: ALL_TYPES, squareMode: 'choice', choiceCount: 6, similar: false, biasNear: false },
  { level: 4, min: 9, max: 9, obs: 8, pool: ALL_TYPES, squareMode: 'choice', choiceCount: 6, similar: true, biasNear: false },
  { level: 5, min: 10, max: 11, obs: 8, pool: ALL_TYPES, squareMode: 'typed', biasNear: false },
  { level: 6, min: 12, max: 12, obs: 7, pool: ALL_TYPES, squareMode: 'typed', biasNear: false },
  { level: 7, min: 13, max: 14, obs: 7, pool: ALL_TYPES, squareMode: 'typed', biasNear: true },
  { level: 8, min: 15, max: 15, obs: 6, pool: ALL_TYPES, squareMode: 'typed', biasNear: false },
  { level: 9, min: 16, max: 18, obs: 5, pool: ALL_TYPES, squareMode: 'typed', biasNear: false },
  { level: 10, min: 20, max: 22, obs: 5, pool: ALL_TYPES, squareMode: 'typed', biasNear: false },
];

export const MAX_LEVEL = LEVEL_CONFIG.length;

function nearbySquares(square) {
  const file = FILES.indexOf(square[0]);
  const rank = Number(square.slice(1));
  const out = [];
  for (let df = -2; df <= 2; df++) {
    for (let dr = -2; dr <= 2; dr++) {
      if (df === 0 && dr === 0) continue;
      const f = file + df;
      const r = rank + dr;
      if (f >= 0 && f < 8 && r >= 1 && r <= 8) out.push(`${FILES[f]}${r}`);
    }
  }
  return out;
}

export function generatePuzzle(level) {
  const config = LEVEL_CONFIG[Math.min(Math.max(level, 1), MAX_LEVEL) - 1];
  const count = randomInt(config.min, config.max);
  const color = Math.random() < 0.5 ? 'white' : 'black';

  const shuffledSquares = shuffle(SQUARES);
  const existingSquares = shuffledSquares.slice(0, count);
  const existingPieces = existingSquares.map((square) => ({
    square,
    type: config.pool[randomInt(0, config.pool.length - 1)],
  }));

  const occupied = new Set(existingSquares);
  const addedType = config.pool[randomInt(0, config.pool.length - 1)];
  let addedSquare = null;

  if (config.biasNear) {
    const sameTypeSquares = existingPieces.filter((p) => p.type === addedType).map((p) => p.square);
    if (sameTypeSquares.length) {
      const anchor = sameTypeSquares[randomInt(0, sameTypeSquares.length - 1)];
      const nearby = shuffle(nearbySquares(anchor)).filter((sq) => !occupied.has(sq));
      if (nearby.length) addedSquare = nearby[0];
    }
  }

  if (!addedSquare) {
    const remaining = shuffledSquares.filter((sq) => !occupied.has(sq));
    addedSquare = remaining[0];
  }

  return {
    existingPieces,
    addedPiece: { square: addedSquare, type: addedType },
    color,
    config,
  };
}

export function generateSquareChoices(correctSquare, count, similar) {
  const pool = similar ? nearbySquares(correctSquare) : SQUARES.filter((sq) => sq !== correctSquare);
  let distractors = shuffle(pool.filter((sq) => sq !== correctSquare)).slice(0, count - 1);

  if (distractors.length < count - 1) {
    const extra = shuffle(SQUARES.filter((sq) => sq !== correctSquare && !distractors.includes(sq))).slice(
      0,
      count - 1 - distractors.length
    );
    distractors = [...distractors, ...extra];
  }

  return shuffle([correctSquare, ...distractors]);
}

export function generatePieceTypeChoices() {
  return shuffle(ALL_TYPES);
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
