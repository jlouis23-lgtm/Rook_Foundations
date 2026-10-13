import { eyebrow } from './styles';

export default function Standings({ board, title = 'Standings', onSelectPlayer }) {
  return (
    <section aria-label={title}>
      <p className={eyebrow}>{title}</p>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="text-left text-xs font-700 uppercase tracking-wider text-[#2D2520]/50 border-b border-[#2D2520]/15">
            <th className="py-2 w-10 font-700">#</th>
            <th className="py-2 font-700">Player</th>
            <th className="py-2 text-right font-700">Played</th>
            <th className="py-2 text-right font-700 hidden sm:table-cell">W · D · L</th>
            <th className="py-2 text-right font-700">Points</th>
          </tr>
        </thead>
        <tbody>
          {board.map((row) => (
            <tr
              key={row.playerId}
              className={
                'border-b border-[#2D2520]/10 ' + (onSelectPlayer ? 'cursor-pointer hover:bg-[#2D2520]/[0.04]' : '')
              }
              onClick={onSelectPlayer ? () => onSelectPlayer(row.playerId) : undefined}
            >
              <td className="py-2.5 tabular-nums text-[#2D2520]/60">
                {row.tied ? '=' : ''}
                {row.rank}
              </td>
              <td className="py-2.5">
                {onSelectPlayer ? (
                  <button
                    type="button"
                    className="font-fredoka text-lg font-600 text-left hover:underline underline-offset-4"
                    aria-label={`Show how ${row.displayName}'s score was earned`}
                  >
                    {row.displayName}
                  </button>
                ) : (
                  <span className="font-fredoka text-lg font-600">{row.displayName}</span>
                )}
                {row.left && <span className="ml-2 text-xs text-[#2D2520]/50">left</span>}
              </td>
              <td className="py-2.5 text-right tabular-nums text-[#2D2520]/70">{row.played}</td>
              <td className="py-2.5 text-right tabular-nums text-[#2D2520]/70 hidden sm:table-cell">
                {row.wins} · {row.draws} · {row.losses}
              </td>
              <td className="py-2.5 text-right font-fredoka text-xl font-700 tabular-nums">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
