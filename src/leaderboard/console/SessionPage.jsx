import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLeaderboardActions, usePlayers, useSessionView } from '../data/hooks';
import { sessionBoard } from '../data/sessionBoard';
import AddPlayerDialog from './AddPlayerDialog';
import ConfirmDialog from './ConfirmDialog';
import { useConsoleTheme } from './ConsoleTheme';
import CorrectResultDialog from './CorrectResultDialog';
import DisplayOptionsDialog from './DisplayOptionsDialog';
import PlayerSheet from './PlayerSheet';
import ResultsLog from './ResultsLog';
import Standings from './Standings';
import { describeResult, formatDay } from './describe';
import { getEntryPad } from './entryPads';
import { btnPrimary, btnQuiet, btnText, eyebrow } from './styles';

const UNDO_SECONDS = 8;

export default function SessionPage() {
  const { sessionId } = useParams();
  const { data: view, isLoading, error } = useSessionView(sessionId);
  const { data: knownPlayers = [] } = usePlayers();
  const run = useLeaderboardActions();

  const [busy, setBusy] = useState(false);
  const [undo, setUndo] = useState(null);
  const [openPlayerId, setOpenPlayerId] = useState(null);
  const [correcting, setCorrecting] = useState(null);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [displayOptions, setDisplayOptions] = useState(false);
  const undoTimer = useRef(null);

  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const board = useMemo(() => sessionBoard(view), [view]);
  useConsoleTheme(view?.game.themeId);

  if (isLoading) return null;
  if (error || !view) {
    return (
      <div className="max-w-xl">
        <h1 className="font-fredoka text-3xl font-600">Session not found</h1>
        <p className="mt-2 text-[#2D2520]/65">
          This session is not saved in this browser. Sessions only exist on the device they were started on.
        </p>
        <Link to="/leaderboard" className={`${btnPrimary} mt-5`}>Back to the leaderboard home</Link>
      </div>
    );
  }

  const { session, game, ruleset, players, ledger, group, sessionNumber } = view;
  const showingOverall = session.display.view === 'overall';
  const ended = !!session.endedAt;
  const roundLabel = game.terminology.round;
  const activePlayers = players.filter((player) => !player.leftAt);
  const nameOf = (playerId) => players.find((player) => player.id === playerId)?.displayName ?? 'Unknown';
  const playedThisRound = new Set(
    ledger.results
      .filter((result) => !result.voidedAt && result.round === session.currentRound)
      .flatMap((result) => result.entries.map((entry) => entry.playerId))
  );
  const EntryPad = getEntryPad(ruleset.resultModel);
  const openPlayer = players.find((player) => player.id === openPlayerId);

  const showUndo = (result) => {
    clearTimeout(undoTimer.current);
    setUndo({ resultId: result.id, text: describeResult(result, nameOf) });
    undoTimer.current = setTimeout(() => setUndo(null), UNDO_SECONDS * 1000);
  };

  const record = async (entries) => {
    setBusy(true);
    try {
      showUndo(await run('recordResult', session.id, entries));
    } catch {
      // The error toast is raised by the action hook.
    } finally {
      setBusy(false);
    }
  };

  const undoLast = async () => {
    const { resultId } = undo;
    clearTimeout(undoTimer.current);
    setUndo(null);
    await run('voidResult', resultId).catch(() => {});
  };

  const quietly = (promise) => promise.catch(() => {});

  // Opens the child-facing display in its own window, ready to drag onto a
  // projector or second screen. Re-uses the same window if already open.
  const displayPath = `/leaderboard/display/${session.id}`;
  const openDisplay = () => window.open(displayPath, 'rf-leaderboard-display');
  // Switches what the display window shows: this session's scores, or the
  // group's overall leaderboard across all of its sessions.
  const setDisplayView = (nextView) => quietly(run('setDisplay', session.id, { view: nextView }));
  const showOnDisplay = async (nextView) => {
    await setDisplayView(nextView);
    openDisplay();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-5 border-b border-[#2D2520]/15">
        <div>
          <p className={eyebrow}>
            {ended ? `Ended session · ${formatDay(session.startedAt)}` : `${game.genre} · ${formatDay(session.startedAt)}`}
            {group && (
              <>
                {' · '}
                <Link to={`/leaderboard/group/${group.id}`} className="underline underline-offset-4 hover:text-[#2D2520]">
                  {group.name}, session {sessionNumber}
                </Link>
              </>
            )}
          </p>
          <h1 className="mt-1 lb-display-font text-4xl sm:text-5xl font-700 leading-none">
            {game.name}
            {!ended && (
              <span className="ml-3 font-fredoka not-italic normal-case tracking-normal text-[#2D2520]/55 text-2xl font-600">
                {roundLabel} {session.currentRound}
              </span>
            )}
          </h1>
        </div>
        {ended ? (
          <div className="flex flex-wrap items-center gap-2">
            {group && (
              <button type="button" className={btnPrimary} onClick={() => showOnDisplay('overall')}>
                Show overall leaderboard
              </button>
            )}
            <button type="button" className={group ? btnQuiet : btnPrimary} onClick={() => showOnDisplay('session')}>
              Show final standings
            </button>
            <Link to="/leaderboard" className={btnQuiet}>Back to home</Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={btnPrimary} onClick={openDisplay}>
              Open display
            </button>
            {group && (
              <button
                type="button"
                className={btnQuiet}
                aria-pressed={showingOverall}
                onClick={() => setDisplayView(showingOverall ? 'session' : 'overall')}
              >
                {showingOverall ? 'Display: overall · switch to this session' : 'Display: this session · switch to overall'}
              </button>
            )}
            <button type="button" className={btnText} onClick={() => setDisplayOptions(true)}>
              What children see
            </button>
            <button type="button" className={btnQuiet} onClick={() => quietly(run('nextRound', session.id))}>
              Next {roundLabel.toLowerCase()}
            </button>
            <button type="button" className={btnQuiet} onClick={() => setAddingPlayer(true)}>
              Add player
            </button>
            <button type="button" className={btnText} onClick={() => setConfirmEnd(true)}>
              End session
            </button>
          </div>
        )}
      </div>

      <div className={`mt-6 grid gap-x-12 gap-y-10 ${ended ? '' : 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'}`}>
        {!ended && (
          <section aria-label="Record a result">
            {activePlayers.length < 2 ? (
              <p className="text-[#2D2520]/65">Add at least two players to record a result.</p>
            ) : EntryPad ? (
              <EntryPad
                players={activePlayers}
                ruleset={ruleset}
                playedThisRound={playedThisRound}
                onRecord={record}
                busy={busy}
              />
            ) : (
              <p className="text-[#2D2520]/65">This game’s result type is not supported yet.</p>
            )}
          </section>
        )}

        <div className="space-y-10 max-w-2xl">
          <Standings
            board={board}
            title={ended ? 'Final standings' : 'Standings'}
            onSelectPlayer={setOpenPlayerId}
          />
          <ResultsLog
            ledger={ledger}
            nameOf={nameOf}
            roundLabel={roundLabel}
            onCorrect={ended ? null : setCorrecting}
          />
        </div>
      </div>

      {undo && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-md bg-[#2D2520] text-[#FAFAF7] pl-5 pr-2 py-2 shadow-lg max-w-[calc(100vw-2rem)]"
        >
          <span className="font-700 truncate">Recorded: {undo.text}</span>
          <button
            type="button"
            className="h-10 px-4 rounded-md bg-[#E8A020] text-[#2D2520] font-700 hover:bg-[#F4C261] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={undoLast}
          >
            Undo
          </button>
        </div>
      )}

      <PlayerSheet
        player={openPlayer}
        view={view}
        nameOf={nameOf}
        roundLabel={roundLabel}
        readOnly={ended}
        onRename={(playerId, name) => quietly(run('renamePlayer', playerId, name))}
        onRemove={(playerId) => {
          setOpenPlayerId(null);
          quietly(run('removePlayerFromSession', session.id, playerId));
        }}
        onReturn={(playerId) => quietly(run('addPlayerToSession', session.id, playerId))}
        onClose={() => setOpenPlayerId(null)}
      />

      <CorrectResultDialog
        result={correcting}
        ruleset={ruleset}
        nameOf={nameOf}
        onClose={() => setCorrecting(null)}
        onCorrect={(result, entries) => {
          setCorrecting(null);
          quietly(run('correctResult', result.id, entries));
        }}
        onRemove={(result) => {
          setCorrecting(null);
          quietly(run('voidResult', result.id));
        }}
      />

      <AddPlayerDialog
        open={addingPlayer}
        onOpenChange={setAddingPlayer}
        sessionPlayers={players}
        knownPlayers={knownPlayers}
        onAddExisting={(playerId) => quietly(run('addPlayerToSession', session.id, playerId))}
        onAddNew={async (name) => {
          const player = await run('createPlayer', name).catch(() => null);
          if (player) await quietly(run('addPlayerToSession', session.id, player.id));
        }}
      />

      <DisplayOptionsDialog
        open={displayOptions}
        onOpenChange={setDisplayOptions}
        display={session.display}
        onChange={(patch) => quietly(run('setDisplay', session.id, patch))}
      />

      <ConfirmDialog
        open={confirmEnd}
        onOpenChange={setConfirmEnd}
        title="End this session?"
        description="No more results can be recorded once the session has ended. The final standings and history stay saved on this device."
        confirmLabel="End session"
        onConfirm={() => quietly(run('endSession', session.id))}
      />
    </div>
  );
}
