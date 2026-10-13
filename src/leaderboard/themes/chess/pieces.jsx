// Chess piece silhouettes drawn for the leaderboard: simple Staunton-style
// profiles on a shared 100 x 140 canvas so they line up along a baseline.
// Shapes overlap freely; set opacity on the <svg>, not on the fill.

const BASE = <rect x="18" y="116" width="64" height="16" rx="6" />;
const FOOT = <path d="M26 118C30 104 40 92 40 70H60C60 92 70 104 74 118Z" />;

const SHAPES = {
  pawn: (
    <>
      <circle cx="50" cy="44" r="16" />
      <ellipse cx="50" cy="64" rx="19" ry="5" />
      {FOOT}
      {BASE}
    </>
  ),
  rook: (
    <>
      <path d="M26 24H38V34H44V24H56V34H62V24H74V50H26Z" />
      <path d="M30 50H70L64 62H36Z" />
      <path d="M36 60H64L70 118H30Z" />
      {BASE}
    </>
  ),
  bishop: (
    <>
      <circle cx="50" cy="14" r="6" />
      <path d="M50 18C70 36 68 56 50 66C32 56 30 36 50 18Z" />
      <ellipse cx="50" cy="68" rx="18" ry="5" />
      {FOOT}
      {BASE}
    </>
  ),
  queen: (
    <>
      <circle cx="24" cy="26" r="5" />
      <circle cx="38" cy="18" r="5" />
      <circle cx="50" cy="14" r="5" />
      <circle cx="62" cy="18" r="5" />
      <circle cx="76" cy="26" r="5" />
      <path d="M22 28L33 46L38 20L46 44L50 16L54 44L62 20L67 46L78 28L70 64H30Z" />
      <ellipse cx="50" cy="66" rx="22" ry="5" />
      {FOOT}
      {BASE}
    </>
  ),
  king: (
    <>
      <rect x="46" y="2" width="8" height="26" rx="1" />
      <rect x="38" y="9" width="24" height="8" rx="1" />
      <path d="M26 36C26 26 44 26 50 34C56 26 74 26 74 36L67 64H33Z" />
      <ellipse cx="50" cy="66" rx="22" ry="5" />
      {FOOT}
      {BASE}
    </>
  )
};

// The knight re-uses the detailed horse-head silhouette from the site's
// chess curriculum button, scaled onto the shared canvas.
const KNIGHT_PATH =
  'M 89.16 130.81 L 9.75 130.66 L 9.96 124.71 L 11.21 122.11 L 12.25 120.75 L 13.56 119.76 L 15.22 118.93 L 17.10 118.40 L 18.56 117.57 L 19.76 116.16 L 20.28 114.60 L 20.49 111.57 L 19.71 111.21 L 17.73 111.21 L 15.64 110.38 L 14.75 109.49 L 14.23 108.45 L 14.13 106.15 L 14.96 104.48 L 16.48 103.39 L 17.31 103.18 L 20.33 103.18 L 21.01 102.92 L 19.03 94.37 L 17.47 86.13 L 16.32 76.23 L 16.32 67.15 L 16.84 60.58 L 18.40 52.97 L 20.49 46.92 L 23.62 40.88 L 25.70 37.85 L 28.00 35.14 L 32.22 31.23 L 35.25 29.14 L 41.08 26.12 L 45.46 24.45 L 45.83 24.09 L 46.77 21.69 L 48.44 18.56 L 51.46 14.18 L 57.98 7.46 L 63.09 3.39 L 63.35 3.44 L 63.45 8.34 L 63.45 21.27 L 69.24 24.35 L 72.26 26.75 L 74.30 29.09 L 77.53 34.10 L 95.67 51.82 L 96.19 52.55 L 96.51 53.81 L 96.51 58.29 L 95.99 62.67 L 94.89 63.97 L 93.64 64.91 L 87.70 68.77 L 85.61 69.60 L 84.25 69.50 L 82.90 68.87 L 79.56 66.16 L 78.00 65.22 L 75.50 64.29 L 72.68 63.66 L 67.99 63.14 L 65.28 63.97 L 61.31 64.60 L 58.19 64.60 L 54.33 63.97 L 51.20 62.83 L 48.59 61.26 L 43.74 56.41 L 41.35 52.24 L 39.10 46.04 L 38.32 47.24 L 37.38 50.57 L 37.59 54.85 L 38.53 57.77 L 39.78 60.27 L 41.87 62.98 L 43.80 64.91 L 46.51 67.00 L 50.78 69.08 L 55.06 70.23 L 59.23 70.75 L 61.89 73.93 L 72.42 84.57 L 75.76 88.84 L 77.53 91.66 L 79.61 96.35 L 80.55 100.21 L 80.76 103.02 L 82.90 103.49 L 84.15 104.33 L 84.83 105.32 L 85.25 106.99 L 85.04 108.34 L 84.41 109.49 L 83.63 110.27 L 82.48 110.90 L 79.87 111.21 L 79.30 111.57 L 78.78 113.56 L 78.99 115.12 L 79.72 116.68 L 80.71 117.67 L 81.96 118.40 L 83.73 118.82 L 85.30 119.55 L 86.65 120.59 L 87.75 121.90 L 88.69 123.67 L 89.31 125.96 L 89.42 130.55 L 89.16 130.81 Z';

export function ChessPiece({ name, className, style }) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style} fill="currentColor" aria-hidden="true">
      {name === 'knight' ? <path d={KNIGHT_PATH} transform="translate(0 1.2)" /> : SHAPES[name]}
    </svg>
  );
}
