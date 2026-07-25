import { SQUARES } from './chessMemory';
import { shuffle, randomInt } from './difficulty';

export const PIECE_VALUES = { pawn: 1, bishop: 3, knight: 3, rook: 5, queen: 9, king: 10 };

export const WHITE_GLYPHS = { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' };
export const BLACK_GLYPHS = { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' };

export const REFERENCE_ORDER = ['pawn', 'bishop', 'knight', 'rook', 'queen', 'king'];

const WEIGHTS = {
  explorer: { pawn: 5, bishop: 2, knight: 2, rook: 1, queen: 0.5, king: 0.5 },
  thinker: { pawn: 3, bishop: 2, knight: 2, rook: 3, queen: 2, king: 1 },
  champion: { pawn: 1, bishop: 1, knight: 1, rook: 1, queen: 1, king: 1 },
};

export const DIFFICULTY_CONFIG = {
  explorer: { min: 6, max: 8, weights: WEIGHTS.explorer },
  thinker: { min: 9, max: 14, weights: WEIGHTS.thinker },
  champion: { min: 15, max: 20, weights: WEIGHTS.champion },
};

function weightedType(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [type, w] of entries) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return entries[entries.length - 1][0];
}

export function generatePuzzle(difficulty) {
  const { min, max, weights } = DIFFICULTY_CONFIG[difficulty];
  const count = randomInt(min, max);
  const squares = shuffle(SQUARES).slice(0, count);
  const color = Math.random() < 0.5 ? 'white' : 'black';

  const pieces = squares.map((square) => ({ square, type: weightedType(weights) }));
  const total = pieces.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);

  return { pieces, color, total };
}
