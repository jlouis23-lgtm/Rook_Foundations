import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeFonts } from '../themes/useThemeFonts';
import { useNoIndex } from '../useNoIndex';
import './display.css';

const MAX_SINGLE_COLUMN = 9;
const RECENT_SHOWN = 5;

function useFullscreen() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const onChange = () => setActive(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const enter = () => document.documentElement.requestFullscreen?.().catch(() => {});
  return { active, enter, supported: !!document.documentElement.requestFullscreen };
}

export function DisplayMessage({ children }) {
  useNoIndex('Leaderboard | Rook Foundations');
  return (
    <div className="rf-display" data-theme="chess" data-lb-theme="chess">
      <p className="rfd-empty">{children}</p>
    </div>
  );
}

// The shared child-facing board, used for a single session and for a
// group's overall leaderboard. Read-only: it has no way to record, change
// or remove anything, and no link back to the practitioner console.
export default function DisplayBoard({
  theme,
  eyebrow,
  title,
  aside,
  board,
  options,
  highlightIds,
  footerLeft,
  scoringKey,
  renderSpotlight
}) {
  useNoIndex('Leaderboard | Rook Foundations');
  useThemeFonts(theme.fontsHref);
  const fullscreen = useFullscreen();
  const [spotlightId, setSpotlightId] = useState(null);
  const firstPaint = useRef(true);
  useEffect(() => {
    firstPaint.current = false;
  }, []);

  const { Backdrop, Frieze, RankMarker, ResultToken } = theme;
  const rows = board.length > MAX_SINGLE_COLUMN ? Math.ceil(board.length / 2) : Math.max(board.length, 4);

  return (
    <div className="rf-display" data-theme={theme.id} data-lb-theme={theme.id} style={{ '--rows': rows }}>
      <div className="rfd-backdrop lb-fade">
        <Backdrop variant="display" />
      </div>

      {fullscreen.supported && !fullscreen.active && (
        <button type="button" className="rfd-fullscreen" onClick={fullscreen.enter}>
          Full screen
        </button>
      )}

      <header className="rfd-header">
        <div>
          <p className="rfd-eyebrow">{eyebrow}</p>
          <h1 className="rfd-title">{title}</h1>
        </div>
        {/* The game's imagery sits here, between the title and the round,
            so it can never run behind a name or a score. */}
        <div className="rfd-art lb-arrive" aria-hidden="true">
          <Frieze />
        </div>
        {aside && <p className="rfd-round">{aside}</p>}
      </header>

      <div className="rfd-body">
        {board.length === 0 ? (
          <p className="rfd-empty">No games played yet.</p>
        ) : (
          <ol className="rfd-rows">
            {board.map((row) => (
              <motion.li
                key={row.playerId}
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className={`rfd-row ${highlightIds?.has(row.playerId) ? 'is-latest' : ''}`}
                tabIndex={0}
                aria-label={`${row.displayName}, position ${row.rank}, ${row.points} points. Show how the score was earned.`}
                onClick={() => setSpotlightId(row.playerId)}
                onKeyDown={(event) => event.key === 'Enter' && setSpotlightId(row.playerId)}
              >
                <RankMarker rank={row.rank} tied={row.tied} />
                <span className="rfd-name">
                  {row.displayName}
                  {row.left && <span className="rfd-left">left</span>}
                </span>
                {options.showRecent && (
                  <span className="rfd-strip" aria-hidden="true">
                    {row.history.slice(-RECENT_SHOWN).map((line) => (
                      <ResultToken key={line.id} outcome={line.outcome} label={line.label} points={line.points} />
                    ))}
                  </span>
                )}
                {options.showRecord && (
                  <span className="rfd-stat">
                    W{row.wins} D{row.draws} L{row.losses}
                  </span>
                )}
                {options.showPlayed && (
                  <span className="rfd-stat">
                    {row.played} {row.played === 1 ? 'game' : 'games'}
                  </span>
                )}
                <motion.span
                  key={row.points}
                  className="rfd-points"
                  initial={firstPaint.current ? false : { scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  {row.points}
                </motion.span>
              </motion.li>
            ))}
          </ol>
        )}
      </div>

      <footer className="rfd-footer">
        <p className="rfd-latest" aria-live="polite">{footerLeft}</p>
        <p className="rfd-key">{scoringKey}</p>
        <p className="rfd-brand">♜ Rook Foundations</p>
      </footer>

      {spotlightId && renderSpotlight(spotlightId, () => setSpotlightId(null))}
    </div>
  );
}

export function scoringKeyFor(ruleset) {
  return ['win', 'draw', 'loss']
    .filter((outcome) => outcome !== 'draw' || ruleset.allowDraw)
    .map((outcome) => `${ruleset.labels[outcome]} +${ruleset.points[outcome]}`)
    .join(' · ');
}
