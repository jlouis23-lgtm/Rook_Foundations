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

// The Unicode chess glyphs don't share a consistent visual weight at a single
// font-size in most system fonts — the pawn glyph in particular renders
// noticeably larger than bishop/knight/queen/king. Scale relative to a
// shared base size so every piece reads as roughly the same visual size.
export const PIECE_SIZE_SCALE = {
  pawn: 0.74,
  rook: 1,
  bishop: 1.18,
  knight: 1.18,
  queen: 1.18,
  king: 1.18,
};

export function pieceFontSize(basePx, type) {
  const scale = PIECE_SIZE_SCALE[type] ?? 1;
  return `${Math.round(basePx * scale * 100) / 100}px`;
}

export function pieceFontSizeResponsive(baseVw, capPx, type) {
  const scale = PIECE_SIZE_SCALE[type] ?? 1;
  const vw = Math.round(baseVw * scale * 100) / 100;
  const cap = Math.round(capPx * scale * 100) / 100;
  return `min(${vw}vw, ${cap}px)`;
}

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
