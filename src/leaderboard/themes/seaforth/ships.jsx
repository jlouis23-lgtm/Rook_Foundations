// Seaforth vessels drawn for the leaderboard, after the game's own pieces:
// a single-masted ship, and the larger two-masted Flagship flying a pennant.
// The pennant takes the theme accent so the Flagship always stands out.

export function Ship({ className, style }) {
  return (
    <svg viewBox="0 0 120 110" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M8 80H112L97 102H23Z" />
      <rect x="57" y="12" width="4" height="70" />
      <path d="M63 16C88 30 96 54 94 74H63Z" />
      <path d="M55 28C40 42 31 58 29 74H55Z" />
    </svg>
  );
}

export function Flagship({ className, style }) {
  return (
    <svg viewBox="0 0 170 130" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <path d="M6 96H164L144 124H26Z" />
        <rect x="58" y="26" width="4" height="72" />
        <rect x="106" y="8" width="4" height="90" />
        <path d="M64 32C84 44 90 66 88 90H64Z" />
        <path d="M56 42C44 54 37 70 35 90H56Z" />
        <path d="M112 24C138 40 146 66 144 90H112Z" />
        <path d="M104 34C97 50 94 70 94 90H104Z" />
      </g>
      <path className="lb-flag" d="M110 4L140 12L110 20Z" />
    </svg>
  );
}
