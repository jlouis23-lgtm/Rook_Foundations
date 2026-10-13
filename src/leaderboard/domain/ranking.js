import { inScope, playerHistory } from './ledger';

const METRICS = {
  points: (row) => row.points,
  wins: (row) => row.wins,
  draws: (row) => row.draws,
  played: (row) => row.played,
  // Fewer games for the same points ranks higher.
  fewestPlayed: (row) => -row.played
};

// Builds leaderboard rows from the ledger. Nothing here is stored: totals,
// records and ranks are always derived from transactions and results.
export function buildLeaderboard({ players, ledger, ruleset, scope, recentCount = 5 }) {
  const order = ['points', ...(ruleset.tieBreakers ?? [])];

  const rows = players.map((player) => {
    const history = playerHistory(ledger, player.id, scope);
    const count = (outcome) => history.lines.filter((line) => line.outcome === outcome).length;
    return {
      playerId: player.id,
      displayName: player.displayName,
      points: history.total,
      played: history.lines.length,
      wins: count('win'),
      draws: count('draw'),
      losses: count('loss'),
      recent: history.lines.slice(-recentCount),
      history: history.lines
    };
  });

  const compare = (a, b) => {
    for (const metric of order) {
      const diff = METRICS[metric](b) - METRICS[metric](a);
      if (diff !== 0) return diff;
    }
    return 0;
  };

  // Stable within a tie: tied players keep the order they joined in.
  const sorted = rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => compare(a.row, b.row) || a.index - b.index)
    .map(({ row }) => row);

  // Standard competition ranking: 1, 2, 2, 4.
  let rank = 0;
  return sorted.map((row, index) => {
    if (index === 0 || compare(sorted[index - 1], row) !== 0) rank = index + 1;
    const tied = sorted.some((other) => other !== row && compare(other, row) === 0);
    return { ...row, rank, tied };
  });
}

// The most recent result that still counts, for the "latest result" callout.
export function latestResult(ledger, scope) {
  const active = ledger.results.filter((result) => !result.voidedAt && inScope(result, scope));
  return active.length ? active[active.length - 1] : null;
}
