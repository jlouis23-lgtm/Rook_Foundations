// Scoring rulesets are data. A game points at a ruleset; a session pins the
// ruleset it started with, so later rule changes never rewrite old scores.

export const RF_POINTS_V1 = {
  id: 'rf-points-v1',
  name: 'Rook Foundations points',
  resultModel: 'headToHead',
  players: { min: 2, max: 2 },
  allowDraw: true,
  points: { win: 3, draw: 2, loss: 1 },
  labels: { win: 'Win', draw: 'Draw', loss: 'Loss' },
  // Ordered metrics used after points to separate players; empty means
  // players level on points share a rank.
  tieBreakers: [],
  defaultScope: 'session'
};

export const RULESETS = {
  [RF_POINTS_V1.id]: RF_POINTS_V1
};

export function getRuleset(id) {
  const ruleset = RULESETS[id];
  if (!ruleset) throw new Error(`Unknown ruleset: ${id}`);
  return ruleset;
}
