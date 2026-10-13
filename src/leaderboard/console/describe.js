// Plain-language descriptions of results, shared by the console and display.

export function describeResult(result, nameOf) {
  const winner = result.entries.find((entry) => entry.outcome === 'win');
  const loser = result.entries.find((entry) => entry.outcome === 'loss');
  if (winner && loser) return `${nameOf(winner.playerId)} beat ${nameOf(loser.playerId)}`;
  const [a, b] = result.entries;
  return `${nameOf(a.playerId)} drew with ${nameOf(b.playerId)}`;
}

export function signed(points) {
  return points > 0 ? `+${points}` : `${points}`;
}

export function formatDay(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
