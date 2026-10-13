import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GAMES } from '../data/seedGames';
import { getTheme } from '../themes';
import { useThemeFonts } from '../themes/useThemeFonts';
import { useGroups, useLeaderboardActions, useSessions } from '../data/hooks';
import ConfirmDialog from './ConfirmDialog';
import { formatDay, formatTime } from './describe';
import { btnDanger, btnPrimary, btnQuiet, btnText, eyebrow } from './styles';

export default function HomePage() {
  const { data: sessions = [] } = useSessions();
  const { data: groups = [] } = useGroups();
  const run = useLeaderboardActions();
  // The tiles use each game's own typeface.
  useThemeFonts(getTheme('chess').fontsHref);
  useThemeFonts(getTheme('seaforth').fontsHref);
  const fileInput = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const inProgress = sessions.filter((session) => !session.endedAt);
  const finished = sessions.filter((session) => session.endedAt);
  const ungroupedFinished = finished.filter((session) => !session.group);
  const activeGroups = groups.filter((group) => group.sessionCount > 0);

  const sessionRows = (list) => (
    <ul className="mt-2">
      {list.map((session) => (
        <li key={session.id} className="border-b border-[#2D2520]/10">
          <Link
            to={`/leaderboard/session/${session.id}`}
            className="flex items-center justify-between gap-4 py-3 hover:bg-[#2D2520]/[0.03]"
          >
            <span className="font-700">
              {session.game.name} · {formatDay(session.startedAt)}
            </span>
            <span className="text-[#2D2520]/60">{session.playerCount} players</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const exportBackup = async () => {
    const data = await run('exportAll');
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `rook-leaderboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const chooseFile = async (event) => {
    const [file] = event.target.files;
    event.target.value = '';
    if (!file) return;
    setImportError('');
    try {
      setPendingImport(JSON.parse(await file.text()));
    } catch {
      setImportError('That file could not be read as a leaderboard backup.');
    }
  };

  return (
    <div className="max-w-4xl">
      {inProgress.length > 0 && (
        <section className="mb-12">
          <p className={eyebrow}>In progress</p>
          <ul className="mt-2">
            {inProgress.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-4 py-4 border-b border-[#2D2520]/15"
              >
                <div>
                  <p className="font-fredoka text-2xl font-600">
                    {session.game.name}
                    {session.group && <span className="text-[#2D2520]/55"> · {session.group.name}</span>}
                  </p>
                  <p className="text-[#2D2520]/60">
                    Started {formatDay(session.startedAt)} at {formatTime(session.startedAt)} ·{' '}
                    {session.playerCount} players · Round {session.currentRound}
                  </p>
                </div>
                <Link to={`/leaderboard/session/${session.id}`} className={btnPrimary}>
                  Resume
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h1 className="font-fredoka text-3xl sm:text-4xl font-600">Choose your game</h1>
        <p className="mt-2 text-[#2D2520]/65">Pick the game you are running today to start a session.</p>
        <div className="lb-tiles">
          {GAMES.map((game) => {
            const { Frieze } = getTheme(game.themeId);
            return (
              <Link key={game.id} to={`/leaderboard/new/${game.id}`} className="lb-tile" data-lb-theme={game.themeId}>
                <div className="lb-tile-art" aria-hidden="true">
                  <Frieze />
                </div>
                <div className="lb-tile-text">
                  <p className="lb-tile-genre">{game.genre}</p>
                  <p className="lb-tile-name">{game.name}</p>
                </div>
                <span className="lb-tile-go">
                  Start a session <span aria-hidden="true">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {activeGroups.length > 0 && (
        <section className="mt-12">
          <h2 className="font-fredoka text-2xl font-600">Groups</h2>
          {activeGroups.map((group) => {
            const past = finished.filter((session) => session.group?.id === group.id);
            return (
              <div key={group.id} className="mt-6">
                <div className="flex items-baseline justify-between gap-4 border-b border-[#2D2520]/25 pb-1">
                  <p className="font-fredoka text-xl font-600">{group.name}</p>
                  <Link to={`/leaderboard/group/${group.id}`} className={btnText}>
                    Overall leaderboard →
                  </Link>
                </div>
                {past.length > 0 ? (
                  sessionRows(past)
                ) : (
                  <p className="mt-3 text-[#2D2520]/55">No finished sessions yet.</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {ungroupedFinished.length > 0 && (
        <section className="mt-12">
          <p className={eyebrow}>{activeGroups.length > 0 ? 'Past sessions without a group' : 'Past sessions'}</p>
          {sessionRows(ungroupedFinished)}
        </section>
      )}

      <section className="mt-12">
        <p className={eyebrow}>Backup</p>
        <p className="mt-2 text-[#2D2520]/65 max-w-xl">
          Sessions are kept only in this browser. Save a backup file if you want a copy, or to move your
          sessions to another device.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={btnQuiet} onClick={exportBackup} disabled={sessions.length === 0}>
            Save backup file
          </button>
          <button type="button" className={btnQuiet} onClick={() => fileInput.current?.click()}>
            Restore from backup
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={chooseFile} />
          <button
            type="button"
            className={btnDanger}
            onClick={() => setConfirmClear(true)}
            disabled={sessions.length === 0}
          >
            Delete everything on this device
          </button>
        </div>
        {importError && <p className="mt-2 text-[#B3261E]" role="alert">{importError}</p>}
      </section>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Delete all leaderboard data?"
        description="This permanently removes every session, player name and result saved in this browser. It cannot be undone unless you have saved a backup file."
        confirmLabel="Delete everything"
        onConfirm={() => run('clearAll').catch(() => {})}
      />

      <ConfirmDialog
        open={!!pendingImport}
        onOpenChange={(open) => !open && setPendingImport(null)}
        title="Replace everything on this device?"
        description="Restoring a backup replaces all leaderboard sessions and players currently saved in this browser with the contents of the file."
        confirmLabel="Replace with backup"
        onConfirm={async () => {
          const data = pendingImport;
          setPendingImport(null);
          await run('importAll', data).catch(() => {});
        }}
      />
    </div>
  );
}
