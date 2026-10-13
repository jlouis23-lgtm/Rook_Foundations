import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { drawEntries, winLossEntries } from '../domain/resultModels/headToHead';
import { describeResult } from './describe';
import { btnDanger, btnQuiet } from './styles';

// Replaces a wrongly entered head-to-head result, or removes it. The
// original stays in the history as undone.
export default function CorrectResultDialog({ result, ruleset, nameOf, onCorrect, onRemove, onClose }) {
  if (!result) return null;
  const [a, b] = result.entries.map((entry) => entry.playerId);
  const current = describeResult(result, nameOf);

  const options = [
    { label: `${nameOf(a)} beat ${nameOf(b)}`, entries: winLossEntries(a, b) },
    ...(ruleset.allowDraw ? [{ label: `${nameOf(a)} drew with ${nameOf(b)}`, entries: drawEntries(a, b) }] : []),
    { label: `${nameOf(b)} beat ${nameOf(a)}`, entries: winLossEntries(b, a) }
  ].filter((option) => describeResult({ entries: option.entries }, nameOf) !== current);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-[#2D2520]">Correct this result</DialogTitle>
          <DialogDescription className="font-nunito text-base">
            Recorded as “{current}”. What should it be?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`${btnQuiet} justify-start`}
              onClick={() => onCorrect(result, option.entries)}
            >
              {option.label}
            </button>
          ))}
          <button type="button" className={`${btnDanger} justify-start mt-2`} onClick={() => onRemove(result)}>
            This game didn’t happen — remove it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
