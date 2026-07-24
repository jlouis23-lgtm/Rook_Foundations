import { shuffle } from './difficulty';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export const SQUARES = RANKS.flatMap((rank) => FILES.map((file) => `${file}${rank}`));

export const PIECE_GLYPHS = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
};

export const PIECE_TYPES = Object.keys(PIECE_GLYPHS);

export const DIFFICULTY_CONFIG = {
  explorer: { start: 2, increment: 1, memorizeMs: 6000 },
  thinker: { start: 3, increment: 1, memorizeMs: 4500 },
  champion: { start: 4, increment: 2, memorizeMs: 3500 },
};

export function pieceCountForRound(difficulty, round) {
  const { start, increment } = DIFFICULTY_CONFIG[difficulty];
  return Math.min(start + (round - 1) * increment, 32);
}

export function generateLayout(pieceCount) {
  const squares = shuffle(SQUARES).slice(0, pieceCount);
  return squares.map((square) => ({
    square,
    type: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
  }));
}
