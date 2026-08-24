// Static catalog of games available in the Rook Play area.
// Each entry maps to a component in src/components/play/games/ via `componentKey`.
export const PLAY_GAMES = [
  {
    id: 'memory-match',
    componentKey: 'MemoryMatch',
    title: 'Memory Match',
    description: 'Flip the cards and find every matching chess piece pair. Trains focus and recall.',
    skill: 'Memory & focus',
    minAge: 5,
    maxAge: 12,
    accent: '#2d8c62'
  },
  {
    id: 'chess-tactics',
    componentKey: 'ChessTactics',
    title: 'Chess Tactics Puzzles',
    description: 'Find the winning move: one-move checkmates, forks, pins and discovered attacks.',
    skill: 'Tactics & calculation',
    minAge: 6,
    maxAge: 12,
    accent: '#4a7eb8'
  },
  {
    id: 'mastermind',
    componentKey: 'Mastermind',
    title: 'Mastermind',
    description: 'Crack the secret code using logic and the clues from every guess.',
    skill: 'Logic & deduction',
    minAge: 7,
    maxAge: 12,
    accent: '#7a48c0'
  }
];

export function getPlayGameById(gameId) {
  return PLAY_GAMES.find((game) => game.id === gameId);
}
