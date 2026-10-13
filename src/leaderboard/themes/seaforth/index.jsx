import './seaforth.css';
import { Flagship, Ship } from './ships';

// Seaforth: a naval strategy world. Ships sail along the header behind
// their Flagship, the game's hexagonal sea chart sits far behind the
// content, and on the display positions are signal pennants, results are
// small flags, and rows are ruled like a ship's log.

function Backdrop({ variant = 'console' }) {
  return <div className={`lb-texture sf-texture sf-texture-${variant}`} aria-hidden="true" />;
}

// A small fleet in line: two ships following the larger Flagship.
function Frieze() {
  return (
    <div className="lb-frieze sf-frieze">
      <Ship className="sf-ship" style={{ height: '50%' }} />
      <Ship className="sf-ship" style={{ height: '58%' }} />
      <Flagship className="sf-flagship" style={{ height: '88%' }} />
    </div>
  );
}

function Emblem({ className }) {
  return <Ship className={className} />;
}

function RankMarker({ rank, tied }) {
  return (
    <span className="sf-pennant" data-place={rank <= 3 ? rank : 'rest'}>
      <svg viewBox="0 0 120 80" aria-hidden="true" preserveAspectRatio="none">
        <path d="M2 2H118L92 40 118 78H2Z" />
      </svg>
      <span className="sf-pennant-number">
        {tied && <span className="rfd-tied">=</span>}
        {rank}
      </span>
    </span>
  );
}

function ResultToken({ outcome, label, points }) {
  return (
    <span className="sf-flag" data-outcome={outcome}>
      <span className="sf-flag-letter">{label[0]}</span>
      <span className="sf-flag-points">+{points}</span>
    </span>
  );
}

export default {
  id: 'seaforth',
  name: 'Seaforth',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&display=swap',
  labels: {
    standings: 'Fleet standings',
    finalStandings: 'Final fleet standings',
    overall: 'Overall fleet standings',
    latest: 'Latest signal'
  },
  Backdrop,
  Frieze,
  Emblem,
  RankMarker,
  ResultToken
};
