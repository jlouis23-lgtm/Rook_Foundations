import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { latestResult } from '../domain/ranking';
import { useGroupView, useLeaderboardSync, useSessionView } from '../data/hooks';
import { sessionBoard } from '../data/sessionBoard';
import { describeResult } from '../console/describe';
import { getTheme } from '../themes';
import DisplayBoard, { DisplayMessage, scoringKeyFor } from './DisplayBoard';
import OverallBoard from './OverallBoard';
import PlayerSpotlight from './PlayerSpotlight';

// The child-facing leaderboard for one session. It follows the console live
// when both are open on the same device, including the practitioner's choice
// between this session's scores and the group's overall leaderboard.
export default function DisplayPage() {
  const { sessionId } = useParams();
  useLeaderboardSync();
  const { data: view, isLoading, error } = useSessionView(sessionId);
  const showOverall = !!view?.group && view.session.display.view === 'overall';
  const { data: groupView } = useGroupView(view?.group?.id, showOverall);
  const board = useMemo(() => sessionBoard(view), [view]);

  if (isLoading) return null;
  if (error || !view) {
    return (
      <DisplayMessage>
        This leaderboard is not available here. Open the display from the practitioner console on the same device.
      </DisplayMessage>
    );
  }

  const { session, game, ruleset, players, ledger, group } = view;
  if (showOverall) {
    if (!groupView) return null;
    return <OverallBoard groupView={groupView} themeGame={game} options={session.display} />;
  }

  const theme = getTheme(game.themeId);
  const ended = !!session.endedAt;
  const nameOf = (playerId) => players.find((player) => player.id === playerId)?.displayName ?? '';
  const latest = latestResult(ledger, { sessionId: session.id });
  const latestPoints = latest
    ? latest.entries.map((entry) => `${nameOf(entry.playerId)} +${ruleset.points[entry.outcome]}`).join(', ')
    : '';
  const heading = ended ? theme.labels.finalStandings : theme.labels.standings;

  return (
    <DisplayBoard
      theme={theme}
      eyebrow={group ? `${heading} · ${group.name}` : heading}
      title={game.name}
      aside={ended ? null : `${game.terminology.round} ${session.currentRound}`}
      board={board}
      options={session.display}
      highlightIds={ended ? null : new Set(latest?.entries.map((entry) => entry.playerId))}
      footerLeft={
        latest ? (
          <>
            <span className="rfd-label">{theme.labels.latest}</span>
            <strong>{describeResult(latest, nameOf)}</strong> · {latestPoints}
          </>
        ) : (
          <span className="rfd-label">Waiting for the first result</span>
        )
      }
      scoringKey={scoringKeyFor(ruleset)}
      renderSpotlight={(playerId, close) => {
        const player = players.find((candidate) => candidate.id === playerId);
        return player ? <PlayerSpotlight player={player} view={view} nameOf={nameOf} onClose={close} /> : null;
      }}
    />
  );
}
