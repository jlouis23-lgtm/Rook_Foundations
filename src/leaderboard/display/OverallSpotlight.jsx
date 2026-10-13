import { useEffect } from 'react';
import { formatDay } from '../console/describe';

// One player's overall score explained session by session:
// "Session 1 · +7 … Session 3 · +5 … Total 18".
export default function OverallSpotlight({ row, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="rfd-spotlight" onClick={onClose} role="dialog" aria-label={`${row.displayName}'s overall score`}>
      <div className="rfd-spotlight-inner">
        <p className="rfd-spotlight-name">{row.displayName}</p>
        <p className="rfd-spotlight-total">
          {row.points} {row.points === 1 ? 'point' : 'points'} overall
        </p>
        <ol className="rfd-spotlight-lines">
          {row.bySession.map(({ session, played, points }) => (
            <li key={session.id}>
              <span>
                Session {session.number}
                <small>
                  {formatDay(session.startedAt)} · {session.game.name} · {played} {played === 1 ? 'game' : 'games'}
                </small>
              </span>
              <span className="rfd-spotlight-points">+{points}</span>
            </li>
          ))}
        </ol>
        <p className="rfd-spotlight-sum">
          <span>Total</span>
          <span>{row.points}</span>
        </p>
        <p className="rfd-spotlight-hint">Tap anywhere to go back to the leaderboard.</p>
      </div>
    </div>
  );
}
