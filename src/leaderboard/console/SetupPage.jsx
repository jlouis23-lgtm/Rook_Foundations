import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { GAMES } from '../data/seedGames';
import { GROUP_NAME_MAX_LENGTH, NAME_MAX_LENGTH } from '../data/service';
import { useGroups, useLeaderboardActions, usePlayers } from '../data/hooks';
import { useConsoleTheme } from './ConsoleTheme';
import { btnPrimary, btnQuiet, btnText, eyebrow, field } from './styles';

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function SetupPage() {
  const { gameId } = useParams();
  const game = GAMES.find((candidate) => candidate.id === gameId);
  useConsoleTheme(game?.themeId);
  const navigate = useNavigate();
  const run = useLeaderboardActions();
  const { data: knownPlayers = [] } = usePlayers();
  const { data: groups = [] } = useGroups();
  const [searchParams] = useSearchParams();

  // Each entry is { name, id? } — id is set when re-using a known player.
  const [roster, setRoster] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [presetApplied, setPresetApplied] = useState(false);

  const matchedGroup = groups.find((group) => sameName(group.name, groupName));

  // Picking a returning group fills in its name and, if nobody has been
  // added yet, the players from its most recent session.
  const chooseGroup = (group) => {
    setGroupName(group.name);
    setRoster((current) => {
      if (current.length > 0) return current;
      return group.lastRosterPlayerIds
        .map((id) => knownPlayers.find((player) => player.id === id))
        .filter(Boolean)
        .map((player) => ({ name: player.displayName, id: player.id }));
    });
  };

  // Arriving from a group page (?group=<id>) selects that group.
  const presetGroupId = searchParams.get('group');
  useEffect(() => {
    if (presetApplied || !presetGroupId || groups.length === 0 || knownPlayers.length === 0) return;
    const group = groups.find((candidate) => candidate.id === presetGroupId);
    if (group) chooseGroup(group);
    setPresetApplied(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetApplied, presetGroupId, groups, knownPlayers]);

  if (!game) return <Navigate to="/leaderboard" replace />;

  const suggestions = knownPlayers
    .filter((player) => !roster.some((entry) => sameName(entry.name, player.displayName)))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const add = (name, id) => {
    const clean = name.trim().replace(/\s+/g, ' ');
    if (!clean) return;
    if (roster.some((entry) => sameName(entry.name, clean))) {
      setError(`${clean} is already in this session. Add a letter to tell them apart.`);
      return;
    }
    const known = id ? { id } : knownPlayers.find((player) => sameName(player.displayName, clean));
    setRoster((current) => [...current, { name: clean, id: known?.id }]);
    setDraft('');
    setError('');
  };

  const start = async () => {
    setStarting(true);
    try {
      const playerIds = [];
      for (const entry of roster) {
        playerIds.push(entry.id ?? (await run('createPlayer', entry.name)).id);
      }
      const session = await run('createSession', { gameId: game.id, playerIds, groupName });
      navigate(`/leaderboard/session/${session.id}`, { replace: true });
    } catch {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/leaderboard" className={btnText}>← Back</Link>
      <p className={`${eyebrow} mt-4`}>New session</p>
      <h1 className="mt-1 lb-display-font text-4xl sm:text-5xl font-700 leading-none">{game.name}</h1>
      <p className="mt-3 text-[#2D2520]/65">Set up the session.</p>

      <section className="mt-6">
        <label htmlFor="group-name" className={eyebrow}>Group name · optional</label>
        <input
          id="group-name"
          className={`${field} mt-2`}
          value={groupName}
          maxLength={GROUP_NAME_MAX_LENGTH}
          placeholder="e.g. Tuesday Club"
          onChange={(event) => setGroupName(event.target.value)}
        />
        <p className="mt-2 text-sm text-[#2D2520]/60">
          {matchedGroup
            ? `This session will be added to ${matchedGroup.name}’s overall leaderboard (${matchedGroup.sessionCount} ${matchedGroup.sessionCount === 1 ? 'session' : 'sessions'} so far).`
            : groupName.trim()
              ? 'A new group. Its sessions will be kept together with an overall leaderboard.'
              : 'Name the group to keep its sessions together and build an overall leaderboard across them.'}
        </p>
        {groups.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                aria-pressed={matchedGroup?.id === group.id}
                className={
                  'h-10 px-3 rounded-md border font-700 ' +
                  (matchedGroup?.id === group.id
                    ? 'border-[#2D2520] bg-[#2D2520] text-[#FAFAF7]'
                    : 'border-dashed border-[#2D2520]/35 hover:bg-[#2D2520]/5')
                }
                onClick={() => chooseGroup(group)}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <h2 className="mt-10 font-fredoka text-2xl font-600">Who is playing?</h2>
      <p className="mt-2 text-[#2D2520]/65">
        Type a name or initials and press Enter. Initials are enough — this is what appears on the leaderboard.
      </p>

      <form
        className="mt-5 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          add(draft);
        }}
      >
        <input
          className={field}
          value={draft}
          maxLength={NAME_MAX_LENGTH}
          placeholder="e.g. LJ"
          aria-label="Player name or initials"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className={btnQuiet} disabled={!draft.trim()}>
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-[#B3261E]" role="alert">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-5">
          <p className={eyebrow}>Played before on this device</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((player) => (
              <button
                key={player.id}
                type="button"
                className="h-10 px-3 rounded-md border border-dashed border-[#2D2520]/35 font-700 hover:bg-[#2D2520]/5"
                onClick={() => add(player.displayName, player.id)}
              >
                + {player.displayName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className={eyebrow}>In this session · {roster.length}</p>
        {roster.length === 0 ? (
          <p className="mt-3 text-[#2D2520]/55">No players added yet.</p>
        ) : (
          <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-6">
            {roster.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between py-2 border-b border-[#2D2520]/10">
                <span className="font-fredoka text-xl font-600 truncate">{entry.name}</span>
                <button
                  type="button"
                  className="p-2 text-[#2D2520]/50 hover:text-[#2D2520]"
                  aria-label={`Remove ${entry.name}`}
                  onClick={() => setRoster((current) => current.filter((other) => other !== entry))}
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button type="button" className={btnPrimary} disabled={roster.length < 2 || starting} onClick={start}>
          Start {game.name} session
        </button>
        {roster.length < 2 && <span className="text-[#2D2520]/55">Add at least two players.</span>}
      </div>
    </div>
  );
}
