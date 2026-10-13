import { buildLeaderboard } from '../domain/ranking';

// A group's overall leaderboard: every session the group has played, from
// the first one. Each row also carries a per-session breakdown, used to
// explain an overall total ("Session 1 +7, Session 2 +5").
export function groupBoard(groupView) {
  if (!groupView?.ruleset) return [];
  const rows = buildLeaderboard({
    players: groupView.players,
    ledger: groupView.ledger,
    ruleset: groupView.ruleset,
    scope: { sessionIds: groupView.sessionIds }
  });
  return rows.map((row) => {
    const bySession = groupView.sessions
      .map((session) => {
        const lines = row.history.filter((line) => line.sessionId === session.id);
        return {
          session,
          played: lines.length,
          points: lines.reduce((sum, line) => sum + line.points, 0)
        };
      })
      .filter((entry) => entry.played > 0);
    return { ...row, bySession, sessionsPlayed: bySession.length };
  });
}

// The session-scope leaderboard shown in both the console and the display.
// Players who left before playing a game drop off; players who left after
// playing stay, marked as left.
export function sessionBoard(view) {
  if (!view) return [];
  const rows = buildLeaderboard({
    players: view.players,
    ledger: view.ledger,
    ruleset: view.ruleset,
    scope: { sessionId: view.session.id }
  });
  const left = new Set(view.players.filter((player) => player.leftAt).map((player) => player.id));
  return rows
    .filter((row) => !left.has(row.playerId) || row.played > 0)
    .map((row) => ({ ...row, left: left.has(row.playerId) }));
}
