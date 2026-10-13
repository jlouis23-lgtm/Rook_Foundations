import { useMemo } from 'react';
import { groupBoard } from '../data/sessionBoard';
import { DEFAULT_DISPLAY } from '../data/service';
import { formatDay } from '../console/describe';
import { getTheme } from '../themes';
import DisplayBoard, { DisplayMessage, scoringKeyFor } from './DisplayBoard';
import OverallSpotlight from './OverallSpotlight';

// A group's overall leaderboard, counting every session from the first.
// themeGame lets it keep the look of the session it was opened from.
export default function OverallBoard({ groupView, themeGame, options = DEFAULT_DISPLAY }) {
  const board = useMemo(() => groupBoard(groupView), [groupView]);
  if (!groupView.ruleset) return <DisplayMessage>This group has not played a session yet.</DisplayMessage>;

  const theme = getTheme((themeGame ?? groupView.game).themeId);
  const count = groupView.sessions.length;

  return (
    <DisplayBoard
      theme={theme}
      eyebrow={theme.labels.overall}
      title={groupView.group.name}
      aside={`${count} ${count === 1 ? 'session' : 'sessions'}`}
      board={board}
      options={options}
      footerLeft={
        <>
          <span className="rfd-label">All sessions</span>
          since {formatDay(groupView.sessions[0].startedAt)}
        </>
      }
      scoringKey={scoringKeyFor(groupView.ruleset)}
      renderSpotlight={(playerId, close) => {
        const row = board.find((candidate) => candidate.playerId === playerId);
        return row ? <OverallSpotlight row={row} onClose={close} /> : null;
      }}
    />
  );
}
