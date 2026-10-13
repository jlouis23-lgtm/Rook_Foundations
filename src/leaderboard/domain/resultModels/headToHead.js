// Head-to-head: exactly two players, one wins and one loses, or both draw.
// Entries: [{ playerId, outcome: 'win' | 'loss' | 'draw' }]

export const headToHead = {
  id: 'headToHead',

  validate(entries, ruleset) {
    if (!Array.isArray(entries) || entries.length !== 2) {
      return 'A head-to-head result needs exactly two players.';
    }
    const [a, b] = entries;
    if (!a.playerId || !b.playerId) return 'Both players must be selected.';
    if (a.playerId === b.playerId) return 'A player cannot play against themselves.';

    const outcomes = [a.outcome, b.outcome].sort().join('+');
    if (outcomes === 'draw+draw') {
      return ruleset.allowDraw ? null : 'This game does not allow draws.';
    }
    if (outcomes === 'loss+win') return null;
    return 'A result must be one win and one loss, or a draw for both players.';
  },

  // Returns one scored line per player. Points come only from the ruleset.
  score(entries, ruleset) {
    return entries.map(({ playerId, outcome }) => ({
      playerId,
      outcome,
      label: ruleset.labels?.[outcome] ?? outcome,
      points: ruleset.points[outcome]
    }));
  }
};

export function winLossEntries(winnerId, loserId) {
  return [
    { playerId: winnerId, outcome: 'win' },
    { playerId: loserId, outcome: 'loss' }
  ];
}

export function drawEntries(playerAId, playerBId) {
  return [
    { playerId: playerAId, outcome: 'draw' },
    { playerId: playerBId, outcome: 'draw' }
  ];
}
