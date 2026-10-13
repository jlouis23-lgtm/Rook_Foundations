import { useState } from 'react';
import { describeResult, formatTime, signed } from './describe';
import { btnText, eyebrow } from './styles';

export default function ResultsLog({ ledger, nameOf, roundLabel, onCorrect }) {
  const [showUndone, setShowUndone] = useState(false);
  const undoneCount = ledger.results.filter((result) => result.voidedAt).length;
  const visible = ledger.results.filter((result) => showUndone || !result.voidedAt).slice().reverse();

  const pointsFor = (result) =>
    result.entries
      .map((entry) => {
        const award = ledger.transactions.find(
          (tx) => tx.resultId === result.id && tx.playerId === entry.playerId && tx.kind === 'award'
        );
        return `${nameOf(entry.playerId)} ${signed(award?.points ?? 0)}`;
      })
      .join(', ');

  return (
    <section aria-label="Results">
      <div className="flex items-baseline justify-between">
        <p className={eyebrow}>Results</p>
        {undoneCount > 0 && (
          <button type="button" className={btnText} onClick={() => setShowUndone((value) => !value)}>
            {showUndone ? 'Hide' : 'Show'} undone ({undoneCount})
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-3 text-[#2D2520]/55">No results yet.</p>
      ) : (
        <ul className="mt-2">
          {visible.map((result) => (
            <li
              key={result.id}
              className="flex items-center justify-between gap-3 py-2.5 border-b border-[#2D2520]/10"
            >
              <div className={result.voidedAt ? 'text-[#2D2520]/45' : ''}>
                <p className={`font-700 ${result.voidedAt ? 'line-through' : ''}`}>
                  {describeResult(result, nameOf)}
                </p>
                <p className="text-sm text-[#2D2520]/60">
                  {roundLabel} {result.round} · {formatTime(result.recordedAt)} ·{' '}
                  {result.voidedAt
                    ? result.voidReason === 'corrected'
                      ? 'replaced by a correction'
                      : 'undone'
                    : pointsFor(result)}
                </p>
              </div>
              {onCorrect && !result.voidedAt && (
                <button type="button" className={btnText} onClick={() => onCorrect(result)}>
                  Correct
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
