// The Rook Foundations mark: an R built from three separate pieces (the
// upright, the bowl and the leg) fitted together like a shape puzzle.
// Drawn in currentColor, so set the colour with a text-* class and the
// size with a height (width follows). Placed on the gold tile it forms the
// full logo; see brand/ for the master files.
export default function RookMark({ className = '', style, title }) {
  return (
    <svg
      viewBox="12 11 24 26"
      className={className}
      style={style}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect x="12" y="11" width="7" height="26" rx="1.5" />
      <path d="M21 11h7.5a7.5 7.5 0 0 1 0 15H21v-5h7a2.5 2.5 0 0 0 0-5h-7Z" />
      <path d="M23.5 28h7l5.5 9h-7Z" />
    </svg>
  );
}
