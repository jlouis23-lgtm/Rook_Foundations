/**
 * ChessBg — chess.com-style filled piece silhouettes.
 * Pieces are placed at fixed pixel offsets from the section corners/edges,
 * so they stay in dead space regardless of viewport size.
 * On narrow screens (< 768px), only corner pieces are shown.
 */

// Chess.com–style filled SVG paths, viewBox "0 0 45 45"
const PIECES = {
  king: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 22.5,11.63 L 22.5,6" stroke-width="1.5" stroke-linecap="square"/>
      <path d="M 20,8 L 25,8" stroke-width="1.5" stroke-linecap="square"/>
      <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 Z" fill="#7B4F10"/>
      <path d="M 11.5,37 C 17,40.5 27,40.5 33.5,37 L 33.5,30 C 33.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16.5 22.5,23.5 L 22.5,17 C 27.5,16.5 32,14.5 32,14.5 C 32,14.5 32.5,13 28.5,13.5 L 25,10 C 24.5,9.5 22.5,9.5 22,10 L 18.5,13.5 C 14.5,13 15,14.5 15,14.5 C 15,14.5 19.5,16.5 22.5,17 L 22.5,23.5 C 20,16.5 10.5,13 6.5,19.5 C 3.5,25.5 11.5,30 11.5,30 Z" fill="#7B4F10"/>
      <path d="M 11.5,37 C 17,40.5 27,40.5 33.5,37" fill="none" stroke="#7B4F10" stroke-width="1.5"/>
    </g>`,
  queen: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="12" r="2.75"/>
      <circle cx="14" cy="9" r="2.75"/>
      <circle cx="22.5" cy="8" r="2.75"/>
      <circle cx="31" cy="9" r="2.75"/>
      <circle cx="39" cy="12" r="2.75"/>
      <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 Z" fill="#7B4F10"/>
      <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 29,24.5 16,24.5 9,26 Z" fill="#7B4F10"/>
      <path d="M 11,38.5 L 34,38.5" stroke-width="1" fill="none"/>
      <path d="M 11,36 L 34,36" stroke-width="1" fill="none"/>
    </g>`,
  rook: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 9,39 L 36,39 L 36,36 L 9,36 Z" fill="#7B4F10"/>
      <path d="M 12,36 L 12,22 L 33,22 L 33,36 Z" fill="#7B4F10"/>
      <path d="M 11,22 L 11,14 L 15,14 L 15,9 L 18,9 L 18,14 L 21,14 L 21,9 L 24,9 L 24,14 L 27,14 L 27,9 L 30,9 L 30,14 L 34,14 L 34,22 Z" fill="#7B4F10"/>
    </g>`,
  bishop: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.5,36.5 37.5,37.5 C 37.5,38 37.25,38.25 37,38.5 C 36,39.5 36,40 36,40 C 36,41 35,42 34,42 L 11,42 C 10,42 9,41 9,40 C 9,40 9,39.5 8.5,38.5 C 8.25,38.25 8,38 8,37.5 C 8,36.5 9,36 9,36 Z" fill="#7B4F10"/>
      <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 28.5,29 28.5,29 L 27,21.5 C 27,21.5 25,23.5 22.5,23.5 C 20,23.5 18,21.5 18,21.5 L 16.5,29 C 16.5,29 14.5,30.5 15,32 Z" fill="#7B4F10"/>
      <circle cx="22.5" cy="10" r="4" fill="#7B4F10"/>
      <path d="M 22.5,14 C 22.5,14 20,17 20,20 C 20,23 21.5,24.5 22.5,25 C 23.5,24.5 25,23 25,20 C 25,17 22.5,14 22.5,14 Z" fill="#7B4F10"/>
      <path d="M 22.5,8 L 22.5,10" stroke-width="1.5" stroke-linecap="square" fill="none"/>
    </g>`,
  knight: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 Z" fill="#7B4F10"/>
      <path d="M 24,18 C 24.38,20.08 18.65,21.82 16,17 C 14.03,13.37 16.97,11.73 21,11 Z" fill="#7B4F10"/>
      <path d="M 9.5,25.5 A 0.5,0.5 0 1 1 8.5,25.5 A 0.5,0.5 0 1 1 9.5,25.5 Z" fill="#FAFAF7"/>
      <path d="M 15,15.5 A 0.5,1.5 0 1 1 14,15.5 A 0.5,1.5 0 1 1 15,15.5 Z" fill="#FAFAF7"/>
      <path d="M 9,36 L 36,36 L 36,39 L 9,39 Z" fill="#7B4F10"/>
    </g>`,
  pawn: `
    <g fill="#7B4F10" stroke="#7B4F10" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22.5" cy="9" r="5" fill="#7B4F10"/>
      <path d="M 22.5,14 C 19,14 16.5,16 16.5,18.5 C 16.5,20.5 18,22 20,23 L 17,28 C 17,28 14,28.5 13,29.5 C 12,30.5 11,34 11,36 L 34,36 C 34,34 33,30.5 32,29.5 C 31,28.5 28,28 28,28 L 25,23 C 27,22 28.5,20.5 28.5,18.5 C 28.5,16 26,14 22.5,14 Z" fill="#7B4F10"/>
      <path d="M 11,37 L 34,37 L 34,39 L 11,39 Z" fill="#7B4F10"/>
    </g>`,
};

// Positions are anchored from edges using fixed px offsets.
// Each entry: { piece, edge: 'left'|'right', fromEdge: px, fromTop: px, rotate, hideOnMobile? }
// "fromEdge" = px from the left or right border of the section
// "fromTop"  = px from the top of the section
const LAYOUTS = {
  hero: [
    { piece: 'rook',   edge: 'left',  fromEdge: 12, fromTop: 90,  rotate: -8  },
    { piece: 'queen',  edge: 'right', fromEdge: 12, fromTop: 80,  rotate: 14  },
    { piece: 'knight', edge: 'left',  fromEdge: 8,  fromTop: 340, rotate: -12, hideOnMobile: true },
    { piece: 'bishop', edge: 'right', fromEdge: 10, fromTop: 360, rotate: 7,   hideOnMobile: true },
    { piece: 'pawn',   edge: 'left',  fromEdge: 14, fromTop: 580, rotate: 5,   hideOnMobile: true },
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 560, rotate: -6,  hideOnMobile: true },
  ],
  classes: [
    { piece: 'knight', edge: 'left',  fromEdge: 12, fromTop: 60,  rotate: -14 },
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 60,  rotate: 10  },
    { piece: 'bishop', edge: 'left',  fromEdge: 8,  fromTop: 300, rotate: 8,   hideOnMobile: true },
    { piece: 'rook',   edge: 'right', fromEdge: 10, fromTop: 300, rotate: -5,  hideOnMobile: true },
    { piece: 'pawn',   edge: 'left',  fromEdge: 14, fromTop: 520, rotate: -9,  hideOnMobile: true },
    { piece: 'queen',  edge: 'right', fromEdge: 12, fromTop: 520, rotate: 12,  hideOnMobile: true },
  ],
  testimonials: [
    { piece: 'queen',  edge: 'left',  fromEdge: 12, fromTop: 60,  rotate: 9  },
    { piece: 'bishop', edge: 'right', fromEdge: 12, fromTop: 60,  rotate: -8 },
    { piece: 'king',   edge: 'left',  fromEdge: 10, fromTop: 340, rotate: -6, hideOnMobile: true },
    { piece: 'rook',   edge: 'right', fromEdge: 10, fromTop: 340, rotate: 11, hideOnMobile: true },
  ],
  instructor: [
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 60,  rotate: 9  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 12, fromTop: 60,  rotate: -11 },
    { piece: 'knight', edge: 'right', fromEdge: 10, fromTop: 340, rotate: 13, hideOnMobile: true },
    { piece: 'bishop', edge: 'left',  fromEdge: 10, fromTop: 340, rotate: -7, hideOnMobile: true },
  ],
  faq: [
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 50,  rotate: -8  },
    { piece: 'knight', edge: 'left',  fromEdge: 12, fromTop: 50,  rotate: 12  },
    { piece: 'bishop', edge: 'right', fromEdge: 10, fromTop: 280, rotate: -4,  hideOnMobile: true },
    { piece: 'queen',  edge: 'left',  fromEdge: 10, fromTop: 280, rotate: 8,   hideOnMobile: true },
    { piece: 'rook',   edge: 'right', fromEdge: 12, fromTop: 500, rotate: 6,   hideOnMobile: true },
    { piece: 'pawn',   edge: 'left',  fromEdge: 12, fromTop: 500, rotate: -10, hideOnMobile: true },
  ],
  cta: [
    { piece: 'rook',   edge: 'left',  fromEdge: 14, fromTop: 30,  rotate: -6 },
    { piece: 'queen',  edge: 'right', fromEdge: 14, fromTop: 30,  rotate: 14 },
    { piece: 'knight', edge: 'left',  fromEdge: 10, fromTop: 110, rotate: 10, hideOnMobile: true },
    { piece: 'bishop', edge: 'right', fromEdge: 10, fromTop: 110, rotate: -9, hideOnMobile: true },
  ],
  contact: [
    { piece: 'bishop', edge: 'right', fromEdge: 12, fromTop: 50,  rotate: 11 },
    { piece: 'pawn',   edge: 'left',  fromEdge: 12, fromTop: 50,  rotate: -7 },
    { piece: 'rook',   edge: 'right', fromEdge: 10, fromTop: 340, rotate: 5,  hideOnMobile: true },
    { piece: 'knight', edge: 'left',  fromEdge: 10, fromTop: 340, rotate: -14, hideOnMobile: true },
  ],
  pricing: [
    { piece: 'queen',  edge: 'right', fromEdge: 12, fromTop: 40,  rotate: 8  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 12, fromTop: 40,  rotate: -6 },
    { piece: 'knight', edge: 'right', fromEdge: 10, fromTop: 340, rotate: -12, hideOnMobile: true },
    { piece: 'bishop', edge: 'left',  fromEdge: 10, fromTop: 340, rotate: 9,   hideOnMobile: true },
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 580, rotate: 5,   hideOnMobile: true },
    { piece: 'rook',   edge: 'left',  fromEdge: 12, fromTop: 580, rotate: -3,  hideOnMobile: true },
  ],
  pricingcta: [
    { piece: 'knight', edge: 'left',  fromEdge: 14, fromTop: 30,  rotate: -10 },
    { piece: 'king',   edge: 'right', fromEdge: 14, fromTop: 30,  rotate: 14  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 10, fromTop: 110, rotate: -4,  hideOnMobile: true },
    { piece: 'rook',   edge: 'right', fromEdge: 10, fromTop: 110, rotate: 7,   hideOnMobile: true },
  ],
  booking: [
    { piece: 'rook',   edge: 'right', fromEdge: 12, fromTop: 40,  rotate: -5 },
    { piece: 'pawn',   edge: 'left',  fromEdge: 12, fromTop: 40,  rotate: 11 },
    { piece: 'queen',  edge: 'right', fromEdge: 10, fromTop: 300, rotate: 8,  hideOnMobile: true },
    { piece: 'bishop', edge: 'left',  fromEdge: 10, fromTop: 300, rotate: -7, hideOnMobile: true },
  ],
  whychess: [
    { piece: 'bishop', edge: 'right', fromEdge: 12, fromTop: 50,  rotate: 12 },
    { piece: 'knight', edge: 'left',  fromEdge: 12, fromTop: 50,  rotate: -9 },
    { piece: 'pawn',   edge: 'right', fromEdge: 10, fromTop: 300, rotate: 4,  hideOnMobile: true },
  ],
  training: [
    { piece: 'king',   edge: 'right', fromEdge: 12, fromTop: 40,  rotate: 7  },
    { piece: 'rook',   edge: 'left',  fromEdge: 12, fromTop: 40,  rotate: -8 },
    { piece: 'bishop', edge: 'right', fromEdge: 10, fromTop: 280, rotate: 13, hideOnMobile: true },
    { piece: 'pawn',   edge: 'left',  fromEdge: 10, fromTop: 280, rotate: -5, hideOnMobile: true },
  ],
  aboutheader: [
    { piece: 'rook',   edge: 'right', fromEdge: 14, fromTop: 50,  rotate: 9   },
    { piece: 'pawn',   edge: 'left',  fromEdge: 14, fromTop: 50,  rotate: -12 },
    { piece: 'queen',  edge: 'right', fromEdge: 10, fromTop: 200, rotate: 5,   hideOnMobile: true },
  ],
  mystory: [
    { piece: 'knight', edge: 'right', fromEdge: 14, fromTop: 50,  rotate: -8 },
    { piece: 'bishop', edge: 'left',  fromEdge: 14, fromTop: 50,  rotate: 10 },
    { piece: 'king',   edge: 'right', fromEdge: 10, fromTop: 320, rotate: 6,  hideOnMobile: true },
  ],
  references: [
    { piece: 'queen',  edge: 'right', fromEdge: 12, fromTop: 40,  rotate: 11 },
    { piece: 'bishop', edge: 'left',  fromEdge: 12, fromTop: 40,  rotate: -7 },
    { piece: 'rook',   edge: 'right', fromEdge: 10, fromTop: 300, rotate: -5, hideOnMobile: true },
    { piece: 'pawn',   edge: 'left',  fromEdge: 10, fromTop: 300, rotate: 8,  hideOnMobile: true },
  ],
  page: [
    { piece: 'bishop', edge: 'right', fromEdge: 14, fromTop: 40,  rotate: 8   },
    { piece: 'pawn',   edge: 'left',  fromEdge: 14, fromTop: 40,  rotate: -6  },
    { piece: 'knight', edge: 'right', fromEdge: 10, fromTop: 280, rotate: -14, hideOnMobile: true },
    { piece: 'rook',   edge: 'left',  fromEdge: 10, fromTop: 280, rotate: 7,   hideOnMobile: true },
  ],
};

const PIECE_SIZE = 48;
const PIECE_OPACITY = 0.15;

export default function ChessBg({ variant = 'page' }) {
  const pieces = LAYOUTS[variant] || LAYOUTS.page;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {pieces.map((p, i) => {
        const style = {
          position: 'absolute',
          [p.edge === 'left' ? 'left' : 'right']: p.fromEdge,
          top: p.fromTop,
          width: PIECE_SIZE,
          height: PIECE_SIZE,
          opacity: PIECE_OPACITY,
          transform: `rotate(${p.rotate}deg)`,
          flexShrink: 0,
        };

        // On mobile (<768px) hide pieces marked hideOnMobile
        const mobileClass = p.hideOnMobile ? 'hidden md:block' : 'block';

        return (
          <div key={i} className={`absolute ${mobileClass}`} style={style}>
            <svg
              viewBox="0 0 45 45"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
              dangerouslySetInnerHTML={{ __html: PIECES[p.piece] }}
            />
          </div>
        );
      })}
    </div>
  );
}