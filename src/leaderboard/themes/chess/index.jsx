import './chess.css';
import { ChessPiece } from './pieces';

// Chess: black and ivory, like a tournament set. Pieces stand along the
// header, a chequered texture sits far behind the content, and on the
// display positions carry a piece (king for first, then queen, rook,
// bishop, knight, pawns), results are board squares, and rows alternate
// like the ranks of a board.

// Outline pieces with a text-presentation selector so no platform swaps in
// a colour emoji.
const PIECES = ['♔', '♕', '♖', '♗', '♘'];
const PAWN = '♙';
const TEXT_STYLE = '︎';

function Backdrop({ variant = 'console' }) {
  return (
    <div className={`lb-texture ch-texture ch-texture-${variant}`} aria-hidden="true">
      {variant === 'display' && <div className="ch-band" />}
    </div>
  );
}

// The six pieces in rising order, standing on the header's baseline.
const LINE_UP = [
  ['pawn', 56],
  ['knight', 70],
  ['bishop', 78],
  ['rook', 70],
  ['queen', 88],
  ['king', 96]
];

function Frieze() {
  return (
    <div className="lb-frieze ch-frieze">
      {LINE_UP.map(([name, height]) => (
        <ChessPiece key={name} name={name} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function Emblem({ className }) {
  return <ChessPiece name="knight" className={className} />;
}

function RankMarker({ rank, tied }) {
  return (
    <span className="ch-marker" data-place={rank <= 3 ? rank : 'rest'}>
      <span className="ch-piece" aria-hidden="true">
        {(PIECES[rank - 1] ?? PAWN) + TEXT_STYLE}
      </span>
      <span className="ch-rank">
        {tied && <span className="rfd-tied">=</span>}
        {rank}
      </span>
    </span>
  );
}

function ResultToken({ outcome, label, points }) {
  return (
    <span className="ch-square" data-outcome={outcome}>
      <span className="ch-square-letter">{label[0]}</span>
      <span className="ch-square-points">+{points}</span>
    </span>
  );
}

export default {
  id: 'chess',
  name: 'Chess',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&display=swap',
  labels: {
    standings: 'Tournament table',
    finalStandings: 'Final table',
    overall: 'Overall table',
    latest: 'Latest game'
  },
  Backdrop,
  Frieze,
  Emblem,
  RankMarker,
  ResultToken
};
