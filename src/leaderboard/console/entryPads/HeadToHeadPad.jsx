import { useState } from 'react';
import { drawEntries, winLossEntries } from '../../domain/resultModels/headToHead';
import { btnText, eyebrow } from '../styles';

// Fast head-to-head entry: tap the two players, then tap the winner or Draw.
// The pad only reports who played and the outcome; points are worked out by
// the scoring engine from the session's ruleset.
export default function HeadToHeadPad({ players, ruleset, playedThisRound, onRecord, busy }) {
  const [selected, setSelected] = useState([]);
  const pair = selected.map((id) => players.find((player) => player.id === id)).filter(Boolean);
  const ready = pair.length === 2;

  const toggle = (playerId) => {
    setSelected((current) => {
      if (current.includes(playerId)) return current.filter((id) => id !== playerId);
      if (current.length === 2) return [current[1], playerId];
      return [...current, playerId];
    });
  };

  const submit = async (entries) => {
    setSelected([]);
    await onRecord(entries);
  };

  const outcomeButton =
    'h-16 rounded-md font-fredoka text-xl font-600 transition-colors disabled:opacity-40 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2';

  return (
    <div>
      <p className={eyebrow}>{ready ? '2 · Who won?' : '1 · Tap the two players'}</p>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {players.map((player) => {
          const isSelected = selected.includes(player.id);
          const played = playedThisRound.has(player.id);
          return (
            <button
              key={player.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(player.id)}
              className={
                'relative h-16 px-3 rounded-md border-2 text-left font-fredoka text-xl font-600 truncate transition-colors ' +
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 ' +
                (isSelected
                  ? 'border-[#2D2520] bg-[#2D2520] text-[#FAFAF7]'
                  : 'border-[#2D2520]/20 bg-white text-[#2D2520] hover:border-[#2D2520]/50')
              }
            >
              {player.displayName}
              {played && (
                <span
                  className={
                    'absolute right-2 top-1.5 font-nunito text-[10px] font-700 uppercase tracking-wider ' +
                    (isSelected ? 'text-[#FAFAF7]/70' : 'text-[#2D2520]/45')
                  }
                >
                  played
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[7.5rem]">
        {ready ? (
          <div>
            <div className={`grid gap-2 ${ruleset.allowDraw ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(winLossEntries(pair[0].id, pair[1].id))}
                className={`${outcomeButton} bg-[#E8A020] text-[#2D2520] hover:bg-[#F4C261]`}
              >
                <span className="block truncate px-2">{pair[0].displayName} won</span>
              </button>
              {ruleset.allowDraw && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => submit(drawEntries(pair[0].id, pair[1].id))}
                  className={`${outcomeButton} border-2 border-[#2D2520] bg-white text-[#2D2520] hover:bg-[#2D2520]/5`}
                >
                  Draw
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(winLossEntries(pair[1].id, pair[0].id))}
                className={`${outcomeButton} bg-[#E8A020] text-[#2D2520] hover:bg-[#F4C261]`}
              >
                <span className="block truncate px-2">{pair[1].displayName} won</span>
              </button>
            </div>
            <button type="button" className={`${btnText} mt-2`} onClick={() => setSelected([])}>
              Clear selection
            </button>
          </div>
        ) : (
          <p className="text-[#2D2520]/55">
            {selected.length === 1
              ? `${pair[0]?.displayName} played against…`
              : 'Choose who played, then tap the winner or Draw.'}
          </p>
        )}
      </div>
    </div>
  );
}
