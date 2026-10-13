import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { playerHistory } from '../domain/ledger';
import { NAME_MAX_LENGTH } from '../data/service';
import ConfirmDialog from './ConfirmDialog';
import { signed } from './describe';
import { btnDanger, btnQuiet, btnText, eyebrow, field } from './styles';

// How one player's score was earned, line by line, plus the controls for
// renaming them or taking them out of the session.
export default function PlayerSheet({ player, view, nameOf, roundLabel, readOnly, onRename, onRemove, onReturn, onClose }) {
  const [audit, setAudit] = useState(false);
  const [name, setName] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    setName(player?.displayName ?? '');
    setAudit(false);
  }, [player?.id, player?.displayName]);

  if (!player) return null;

  const scope = { sessionId: view.session.id };
  const history = playerHistory(view.ledger, player.id, scope, { audit });
  const hasCorrections = view.ledger.transactions.some(
    (tx) => tx.playerId === player.id && tx.kind === 'reversal'
  );

  const opponentOf = (line) => {
    const result = view.ledger.results.find((candidate) => candidate.id === line.resultId);
    const other = result?.entries.find((entry) => entry.playerId !== player.id);
    return other ? nameOf(other.playerId) : null;
  };

  const lineLabel = (line) => {
    if (line.kind === 'reversal') return `${line.label} removed`;
    return line.label;
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-[#FAFAF7]">
        <SheetHeader className="text-left">
          <SheetTitle className="font-fredoka text-3xl text-[#2D2520]">{player.displayName}</SheetTitle>
          <SheetDescription className="font-nunito text-base">
            {history.total} {history.total === 1 ? 'point' : 'points'} this session
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <p className={eyebrow}>How the score was earned</p>
            {hasCorrections && (
              <button type="button" className={btnText} onClick={() => setAudit((value) => !value)}>
                {audit ? 'Hide corrections' : 'Show corrections'}
              </button>
            )}
          </div>

          {history.lines.length === 0 ? (
            <p className="mt-3 text-[#2D2520]/55">No games played yet.</p>
          ) : (
            <ol className="mt-2">
              {history.lines.map((line) => (
                <li
                  key={line.id}
                  className={
                    'flex items-baseline justify-between gap-3 py-2.5 border-b border-[#2D2520]/10 ' +
                    (audit && (line.voided || line.kind === 'reversal') ? 'text-[#2D2520]/50' : '')
                  }
                >
                  <div>
                    <p className="font-700">
                      {line.gameNumber ? `Game ${line.gameNumber} · ` : ''}
                      {lineLabel(line)}
                    </p>
                    <p className="text-sm text-[#2D2520]/60">
                      {roundLabel} {line.round}
                      {opponentOf(line) ? ` · against ${opponentOf(line)}` : ''}
                    </p>
                  </div>
                  <span className="font-fredoka text-xl font-700 tabular-nums">{signed(line.points)}</span>
                </li>
              ))}
              <li className="flex items-baseline justify-between pt-3">
                <span className="font-700 uppercase tracking-wider text-sm">Total</span>
                <span className="font-fredoka text-3xl font-700 tabular-nums">{history.total}</span>
              </li>
            </ol>
          )}
        </div>

        {!readOnly && (
          <div className="mt-10 pt-6 border-t border-[#2D2520]/15">
            <p className={eyebrow}>Display name</p>
            <form
              className="mt-2 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim() && name.trim() !== player.displayName) onRename(player.id, name);
              }}
            >
              <input
                className={field}
                value={name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => setName(event.target.value)}
                aria-label="Display name"
              />
              <button
                type="submit"
                className={btnQuiet}
                disabled={!name.trim() || name.trim() === player.displayName}
              >
                Save
              </button>
            </form>

            <div className="mt-6">
              {player.leftAt ? (
                <button type="button" className={btnQuiet} onClick={() => onReturn(player.id)}>
                  Return {player.displayName} to the session
                </button>
              ) : (
                <button type="button" className={btnDanger} onClick={() => setConfirmRemove(true)}>
                  Remove from session
                </button>
              )}
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmRemove}
          onOpenChange={setConfirmRemove}
          title={`Remove ${player.displayName} from this session?`}
          description="They will no longer appear for new results. Games they have already played stay in the history, and you can return them to the session later."
          confirmLabel="Remove"
          onConfirm={() => onRemove(player.id)}
        />
      </SheetContent>
    </Sheet>
  );
}
