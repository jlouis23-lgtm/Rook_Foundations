import { useEffect } from 'react';
import { playerHistory } from '../domain/ledger';

// One player's score explained line by line: "Game 1 · Win · +3 … Total 6".
// Only results that still count are shown; corrections stay in the console.
export default function PlayerSpotlight({ player, view, nameOf, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const history = playerHistory(view.ledger, player.id, { sessionId: view.session.id });
  const opponentOf = (line) => {
    const result = view.ledger.results.find((candidate) => candidate.id === line.resultId);
    const other = result?.entries.find((entry) => entry.playerId !== player.id);
    return other ? nameOf(other.playerId) : null;
  };

  return (
    <div className="rfd-spotlight" onClick={onClose} role="dialog" aria-label={`${player.displayName}'s score`}>
      <div className="rfd-spotlight-inner">
        <p className="rfd-spotlight-name">{player.displayName}</p>
        <p className="rfd-spotlight-total">
          {history.total} {history.total === 1 ? 'point' : 'points'}
        </p>
        {history.lines.length === 0 ? (
          <p className="rfd-spotlight-hint">No games played yet.</p>
        ) : (
          <>
            <ol className="rfd-spotlight-lines">
              {history.lines.map((line) => (
                <li key={line.id}>
                  <span>
                    {view.game.terminology.game} {line.gameNumber} · {line.label}
                    {opponentOf(line) && <small>against {opponentOf(line)}</small>}
                  </span>
                  <span className="rfd-spotlight-points">+{line.points}</span>
                </li>
              ))}
            </ol>
            <p className="rfd-spotlight-sum">
              <span>Total</span>
              <span>{history.total}</span>
            </p>
          </>
        )}
        <p className="rfd-spotlight-hint">Tap anywhere to go back to the leaderboard.</p>
      </div>
    </div>
  );
}
