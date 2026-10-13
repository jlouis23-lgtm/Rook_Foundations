import './hub.css';
import { ChessPiece } from '../chess/pieces';
import { Ship } from '../seaforth/ships';

// The Rook Foundations hub: the neutral look of the leaderboard before a
// game has been chosen. It hints at the worlds on offer without belonging
// to any one of them.

function Backdrop() {
  return <div className="lb-texture hub-texture" aria-hidden="true" />;
}

function Frieze() {
  return (
    <div className="lb-frieze hub-frieze">
      <ChessPiece name="knight" style={{ height: '64%' }} />
      <Ship style={{ height: '58%' }} />
      <ChessPiece name="rook" style={{ height: '70%' }} />
    </div>
  );
}

function Emblem({ className }) {
  return <ChessPiece name="rook" className={className} />;
}

export default {
  id: 'hub',
  name: 'Game hub',
  fontsHref: null,
  Backdrop,
  Frieze,
  Emblem
};
