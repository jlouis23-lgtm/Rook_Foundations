import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NAME_MAX_LENGTH } from '../data/service';
import { btnQuiet, eyebrow, field } from './styles';

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Adds a late arrival to a running session: a new name, a player who left
// earlier, or someone who has played on this device before.
export default function AddPlayerDialog({ open, onOpenChange, sessionPlayers, knownPlayers, onAddExisting, onAddNew }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const active = sessionPlayers.filter((player) => !player.leftAt);
  const available = knownPlayers
    .filter((player) => !active.some((other) => other.id === player.id))
    .filter((player) => !active.some((other) => sameName(other.displayName, player.displayName)))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const close = () => {
    setDraft('');
    setError('');
    onOpenChange(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    const clean = draft.trim().replace(/\s+/g, ' ');
    if (!clean) return;
    if (active.some((player) => sameName(player.displayName, clean))) {
      setError(`${clean} is already in this session. Add a letter to tell them apart.`);
      return;
    }
    const known = knownPlayers.find((player) => sameName(player.displayName, clean));
    await (known ? onAddExisting(known.id) : onAddNew(clean));
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-[#2D2520]">Add a player</DialogTitle>
          <DialogDescription className="font-nunito text-base">
            They join the session on zero points.
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={submit}>
          <input
            autoFocus
            className={field}
            value={draft}
            maxLength={NAME_MAX_LENGTH}
            placeholder="Name or initials"
            aria-label="Player name or initials"
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className={btnQuiet} disabled={!draft.trim()}>
            Add
          </button>
        </form>
        {error && <p className="text-[#B3261E]" role="alert">{error}</p>}
        {available.length > 0 && (
          <div>
            <p className={eyebrow}>Played before on this device</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {available.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className="h-10 px-3 rounded-md border border-dashed border-[#2D2520]/35 font-700 hover:bg-[#2D2520]/5"
                  onClick={async () => {
                    await onAddExisting(player.id);
                    close();
                  }}
                >
                  + {player.displayName}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
