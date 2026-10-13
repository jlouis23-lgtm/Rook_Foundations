import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GAMES } from '../data/seedGames';
import { useGroupView } from '../data/hooks';
import { groupBoard } from '../data/sessionBoard';
import { useConsoleTheme } from './ConsoleTheme';
import Standings from './Standings';
import { formatDay } from './describe';
import { btnPrimary, btnQuiet, btnText, eyebrow } from './styles';

// A group's home: its overall leaderboard across every session, the list of
// those sessions, and a quick way to start the next one.
export default function GroupPage() {
  const { groupId } = useParams();
  const { data: groupView, isLoading, error } = useGroupView(groupId);
  const board = useMemo(() => groupBoard(groupView), [groupView]);
  // A group takes the look of the game it played most recently.
  useConsoleTheme(groupView?.game?.themeId);

  if (isLoading) return null;
  if (error || !groupView) {
    return (
      <div className="max-w-xl">
        <h1 className="font-fredoka text-3xl font-600">Group not found</h1>
        <p className="mt-2 text-[#2D2520]/65">This group is not saved in this browser.</p>
        <Link to="/leaderboard" className={`${btnPrimary} mt-5`}>Back to the leaderboard home</Link>
      </div>
    );
  }

  const { group, sessions } = groupView;
  const openDisplay = () => window.open(`/leaderboard/display/group/${group.id}`, 'rf-leaderboard-display');

  return (
    <div>
      <Link to="/leaderboard" className={btnText}>← Back</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-5 border-b border-[#2D2520]/15">
        <div>
          <p className={eyebrow}>
            Group · {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
          </p>
          <h1 className="mt-1 font-fredoka text-3xl sm:text-4xl font-600">{group.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btnPrimary} onClick={openDisplay} disabled={sessions.length === 0}>
            Open overall display
          </button>
          {GAMES.map((game) => (
            <Link key={game.id} to={`/leaderboard/new/${game.id}?group=${group.id}`} className={btnQuiet}>
              New {game.name} session
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Standings board={board} title="Overall standings · all sessions" />

        <section aria-label="Sessions">
          <p className={eyebrow}>Sessions</p>
          <ul className="mt-2">
            {sessions
              .slice()
              .reverse()
              .map((session) => (
                <li key={session.id} className="border-b border-[#2D2520]/10">
                  <Link
                    to={`/leaderboard/session/${session.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:bg-[#2D2520]/[0.03]"
                  >
                    <span className="font-700">
                      Session {session.number} · {session.game.name}
                    </span>
                    <span className="text-[#2D2520]/60">
                      {formatDay(session.startedAt)}
                      {!session.endedAt && ' · in progress'}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
