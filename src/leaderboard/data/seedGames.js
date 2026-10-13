// The games the prototype ships with. Each game points at a scoring ruleset
// and a theme; adding a game later is a new entry here (and, in Phase 3, a
// record the practitioner can edit).

export const GAMES = [
  {
    id: 'seaforth',
    name: 'Seaforth',
    genre: 'Naval strategy',
    themeId: 'seaforth',
    rulesetId: 'rf-points-v1',
    terminology: { round: 'Round', game: 'Game' }
  },
  {
    id: 'chess',
    name: 'Chess',
    genre: 'Classic strategy',
    themeId: 'chess',
    rulesetId: 'rf-points-v1',
    terminology: { round: 'Round', game: 'Game' }
  }
];

export function getGame(id) {
  const game = GAMES.find((candidate) => candidate.id === id);
  if (!game) throw new Error(`Unknown game: ${id}`);
  return game;
}
