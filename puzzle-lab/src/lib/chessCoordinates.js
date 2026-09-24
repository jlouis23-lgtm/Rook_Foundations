import { FILES, SQUARES } from './chessMemory';
import { shuffle } from './difficulty';

const CENTER_FILES = ['c', 'd', 'e', 'f'];
const CENTER_RANKS = [3, 4, 5, 6];
export const CENTER_SQUARES = CENTER_RANKS.flatMap((rank) => CENTER_FILES.map((file) => `${file}${rank}`));

const ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const QUEEN_DIRS = [...ROOK_DIRS, ...BISHOP_DIRS];
const KNIGHT_OFFSETS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const PAWN_OFFSETS = [[0, 1]];

function coordsOf(square) {
  return [FILES.indexOf(square[0]), Number(square.slice(1))];
}

function squareAt(fileIndex, rank) {
  if (fileIndex < 0 || fileIndex > 7 || rank < 1 || rank > 8) return null;
  return `${FILES[fileIndex]}${rank}`;
}

function slideTargets(from, dirs, occupied) {
  const [f0, r0] = coordsOf(from);
  const out = [];
  for (const [df, dr] of dirs) {
    let f = f0 + df;
    let r = r0 + dr;
    while (true) {
      const sq = squareAt(f, r);
      if (!sq || occupied.has(sq)) break;
      out.push(sq);
      f += df;
      r += dr;
    }
  }
  return out;
}

function stepTargets(from, offsets, occupied) {
  const [f0, r0] = coordsOf(from);
  const out = [];
  for (const [df, dr] of offsets) {
    const sq = squareAt(f0 + df, r0 + dr);
    if (sq && !occupied.has(sq)) out.push(sq);
  }
  return out;
}

export function legalTargets(type, from, occupied) {
  switch (type) {
    case 'rook':
      return slideTargets(from, ROOK_DIRS, occupied);
    case 'bishop':
      return slideTargets(from, BISHOP_DIRS, occupied);
    case 'queen':
      return slideTargets(from, QUEEN_DIRS, occupied);
    case 'knight':
      return stepTargets(from, KNIGHT_OFFSETS, occupied);
    case 'king':
      return stepTargets(from, QUEEN_DIRS, occupied);
    case 'pawn':
      return stepTargets(from, PAWN_OFFSETS, occupied);
    default:
      return [];
  }
}

export const LEVEL_CONFIG = [
  { level: 1, pieces: 1, moves: 0, pool: ['pawn'], centerOnly: true },
  { level: 2, pieces: 2, moves: 1, pool: ['pawn', 'rook'] },
  { level: 3, pieces: 2, moves: 2, pool: ['pawn', 'rook', 'bishop'] },
  { level: 4, pieces: 3, moves: 3, pool: ['pawn', 'rook', 'bishop', 'knight'] },
  { level: 5, pieces: 3, moves: 4, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen'] },
  { level: 6, pieces: 4, moves: 5, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen'] },
  { level: 7, pieces: 5, moves: 5, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'] },
  { level: 8, pieces: 5, moves: 6, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'] },
  { level: 9, pieces: 6, moves: 6, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'] },
  { level: 10, pieces: 6, moves: 7, pool: ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'] },
];

export const MAX_LEVEL = LEVEL_CONFIG.length;

function tryGenerate(config) {
  if (config.pool.length < config.pieces) return null;
  const types = shuffle(config.pool).slice(0, config.pieces);

  const squarePool = config.centerOnly ? CENTER_SQUARES : SQUARES;
  const occupied = new Set();
  const positions = {};
  const placements = [];

  for (const type of types) {
    const candidates = shuffle(squarePool.filter((sq) => !occupied.has(sq)));
    if (!candidates.length) return null;
    const square = candidates[0];
    placements.push({ type, square });
    occupied.add(square);
    positions[type] = square;
  }

  const moves = [];
  for (let i = 0; i < config.moves; i++) {
    const order = shuffle(types);
    let moved = false;
    for (const type of order) {
      const from = positions[type];
      const occWithoutSelf = new Set(occupied);
      occWithoutSelf.delete(from);
      const targets = legalTargets(type, from, occWithoutSelf);
      if (targets.length) {
        const to = shuffle(targets)[0];
        moves.push({ type, from, to });
        occupied.delete(from);
        occupied.add(to);
        positions[type] = to;
        moved = true;
        break;
      }
    }
    if (!moved) return null;
  }

  return { placements, moves, finalPositions: { ...positions }, totalInstructions: 1 + moves.length };
}

export function generatePuzzle(level) {
  const config = LEVEL_CONFIG[Math.min(Math.max(level, 1), MAX_LEVEL) - 1];
  for (let attempt = 0; attempt < 50; attempt++) {
    const result = tryGenerate(config);
    if (result) return result;
  }
  return { placements: [{ type: 'pawn', square: 'd4' }], moves: [], finalPositions: { pawn: 'd4' }, totalInstructions: 1 };
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function instructionItems(puzzle) {
  const placementText = `Place ${puzzle.placements
    .map((p) => `the ${capitalize(p.type)} on ${p.square.toUpperCase()}`)
    .join(', ')}`;
  const moveTexts = puzzle.moves.map((m) => `Move the ${capitalize(m.type)} to ${m.to.toUpperCase()}`);
  return [placementText, ...moveTexts];
}
