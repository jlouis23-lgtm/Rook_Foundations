/**
 * ChessBg — decorative chess piece silhouettes in page margins only.
 * Pieces are uniform size, positioned on left/right edges to avoid content clash.
 */

// Proper recognisable chess piece SVG paths (viewBox 0 0 45 45 — standard chess piece scale)
const PIECES = {
  king: "M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5zM11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V17s0.5-1.5 6-2c0 0 1 0 0-1l-3.5-3.5c-0.5-0.5-2.5-0.5-3 0L18.5 14c-1 1 0 1 0 1 5.5 0.5 6 2 6 2v6.5C22 16 12.5 13 8.5 19.5c-3 6 5 10.5 3 10.5v7z",
  queen: "M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-0.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 0.5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5 0.5 2.5 0.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0-0.5-1.5-1.5-2.5-0.5-2.5-0.5-2 0.5-3.5 1-2 2.5-2 2.5-4 0-0.5-0.5-1-3-1-2.5 0-3-0.5-3-1l0.5-0.5c0.5-1 0-1.5-1.5-1.5S9.5 24 9.5 25l0.5 0.5C9.5 26 9.5 26.5 9 26z",
  rook: "M9 39h27v-3H9v3zM14 29.5v-14h17v14H14zM14 16.5L11 14V9h4v2h3V9h3v2h3V9h4v5l-3 2.5H14zM11 14h23",
  bishop: "M9 36c3.39-0.97 10.11 0.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.5 0.5 1.5 1.5 0 0.5-0.25 0.75-0.5 1C36 39 36 39.5 36 39.5c0 1-1 2-2 2H11c-1 0-2-1-2-2 0 0 0-0.5-0.5-1C8.25 38.25 8 38 8 37.5 8 36.5 9 36 9 36zM15 32c2.5 2.5 12.5 2.5 15 0 0.5-1.5-1.5-3-1.5-3L27 22.5c0 0-2 2-4.5 2s-4.5-2-4.5-2L16.5 29c0 0-2 1.5-1.5 3zM22.5 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM22.5 9c-1.5 1.5-3.5 3.5-3.5 6s2 4.5 3.5 5c1.5-0.5 3.5-2.5 3.5-5s-2-4.5-3.5-6zM11.5 37h22M22.5 14v8",
  knight: "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 M 24,18 C 24.384,20.077 18.645,21.823 16,17 C 14.028,13.369 16.973,11.726 21,11 C 21,11 22.998,11.248 22.998,10 M 15,39 C 15,30 25,32.5 23,18 M 17,16 C 17,16 20,14.5 22,10 M 9.5,25.5 A 0.5,0.5 0 1 1 8.5,25.5 A 0.5,0.5 0 1 1 9.5,25.5 z M 15,15.5 A 0.5,1.5 0 1 1 14,15.5 A 0.5,1.5 0 1 1 15,15.5 z",
  pawn: "M22.5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22.5 9c-3.5 0-6 1.5-6 4s2.5 5 6 5 6-2.5 6-5-2.5-4-6-4zM15 28c0-2.5 3-6 7.5-6s7.5 3.5 7.5 6M11 36h23v-8H11v8z",
};

// Safe margin positions — left column (2-8%) and right column (88-95%)
// y positions spread across the section height, avoiding the centre content zone
const LAYOUTS = {
  hero: [
    { piece: 'rook',   x: '2%',  y: '12%', rotate: -8  },
    { piece: 'queen',  x: '91%', y: '8%',  rotate: 14  },
    { piece: 'knight', x: '3%',  y: '55%', rotate: -12 },
    { piece: 'bishop', x: '90%', y: '55%', rotate: 7   },
    { piece: 'pawn',   x: '2%',  y: '82%', rotate: 5   },
    { piece: 'king',   x: '91%', y: '80%', rotate: -6  },
  ],
  classes: [
    { piece: 'knight', x: '2%',  y: '8%',  rotate: -14 },
    { piece: 'king',   x: '91%', y: '6%',  rotate: 10  },
    { piece: 'bishop', x: '3%',  y: '50%', rotate: 8   },
    { piece: 'rook',   x: '90%', y: '52%', rotate: -5  },
    { piece: 'pawn',   x: '2%',  y: '82%', rotate: -9  },
    { piece: 'queen',  x: '91%', y: '80%', rotate: 12  },
  ],
  testimonials: [
    { piece: 'queen',  x: '2%',  y: '10%', rotate: 9   },
    { piece: 'bishop', x: '91%', y: '10%', rotate: -8  },
    { piece: 'king',   x: '3%',  y: '72%', rotate: -6  },
    { piece: 'rook',   x: '90%', y: '70%', rotate: 11  },
  ],
  instructor: [
    { piece: 'king',   x: '91%', y: '8%',  rotate: 9   },
    { piece: 'pawn',   x: '2%',  y: '20%', rotate: -11 },
    { piece: 'knight', x: '90%', y: '65%', rotate: 13  },
    { piece: 'bishop', x: '3%',  y: '75%', rotate: -7  },
  ],
  faq: [
    { piece: 'king',   x: '91%', y: '5%',  rotate: -8  },
    { piece: 'knight', x: '2%',  y: '22%', rotate: 12  },
    { piece: 'bishop', x: '90%', y: '45%', rotate: -4  },
    { piece: 'queen',  x: '3%',  y: '60%', rotate: 8   },
    { piece: 'rook',   x: '91%', y: '78%', rotate: 6   },
    { piece: 'pawn',   x: '2%',  y: '85%', rotate: -10 },
  ],
  cta: [
    { piece: 'rook',   x: '2%',  y: '10%', rotate: -6  },
    { piece: 'queen',  x: '90%', y: '8%',  rotate: 14  },
    { piece: 'knight', x: '3%',  y: '70%', rotate: 10  },
    { piece: 'bishop', x: '89%', y: '68%', rotate: -9  },
  ],
  contact: [
    { piece: 'bishop', x: '91%', y: '6%',  rotate: 11  },
    { piece: 'pawn',   x: '2%',  y: '18%', rotate: -7  },
    { piece: 'rook',   x: '90%', y: '55%', rotate: 5   },
    { piece: 'knight', x: '3%',  y: '65%', rotate: -14 },
  ],
  pricing: [
    { piece: 'queen',  x: '91%', y: '4%',  rotate: 8   },
    { piece: 'pawn',   x: '2%',  y: '15%', rotate: -6  },
    { piece: 'knight', x: '90%', y: '55%', rotate: -12 },
    { piece: 'bishop', x: '2%',  y: '60%', rotate: 9   },
    { piece: 'king',   x: '91%', y: '78%', rotate: 5   },
    { piece: 'rook',   x: '3%',  y: '82%', rotate: -3  },
  ],
  pricingcta: [
    { piece: 'knight', x: '2%',  y: '10%', rotate: -10 },
    { piece: 'king',   x: '90%', y: '8%',  rotate: 14  },
    { piece: 'pawn',   x: '3%',  y: '72%', rotate: -4  },
    { piece: 'rook',   x: '89%', y: '70%', rotate: 7   },
  ],
  booking: [
    { piece: 'rook',   x: '91%', y: '5%',  rotate: -5  },
    { piece: 'pawn',   x: '2%',  y: '28%', rotate: 11  },
    { piece: 'queen',  x: '90%', y: '55%', rotate: 8   },
    { piece: 'bishop', x: '3%',  y: '72%', rotate: -7  },
  ],
  whychess: [
    { piece: 'bishop', x: '91%', y: '5%',  rotate: 12  },
    { piece: 'knight', x: '2%',  y: '42%', rotate: -9  },
    { piece: 'pawn',   x: '90%', y: '72%', rotate: 4   },
  ],
  training: [
    { piece: 'king',   x: '91%', y: '4%',  rotate: 7   },
    { piece: 'rook',   x: '2%',  y: '44%', rotate: -8  },
    { piece: 'bishop', x: '90%', y: '72%', rotate: 13  },
    { piece: 'pawn',   x: '3%',  y: '82%', rotate: -5  },
  ],
  aboutheader: [
    { piece: 'rook',   x: '91%', y: '12%', rotate: 9   },
    { piece: 'pawn',   x: '2%',  y: '55%', rotate: -12 },
    { piece: 'queen',  x: '90%', y: '70%', rotate: 5   },
  ],
  mystory: [
    { piece: 'knight', x: '91%', y: '8%',  rotate: -8  },
    { piece: 'bishop', x: '2%',  y: '50%', rotate: 10  },
    { piece: 'king',   x: '90%', y: '76%', rotate: 6   },
  ],
  references: [
    { piece: 'queen',  x: '91%', y: '4%',  rotate: 11  },
    { piece: 'bishop', x: '2%',  y: '30%', rotate: -7  },
    { piece: 'rook',   x: '90%', y: '58%', rotate: -5  },
    { piece: 'pawn',   x: '3%',  y: '75%', rotate: 8   },
  ],
  page: [
    { piece: 'bishop', x: '91%', y: '5%',  rotate: 8   },
    { piece: 'pawn',   x: '2%',  y: '28%', rotate: -6  },
    { piece: 'knight', x: '90%', y: '58%', rotate: -14 },
    { piece: 'rook',   x: '3%',  y: '78%', rotate: 7   },
  ],
};

// Uniform size for all pieces
const PIECE_SIZE = 52;
const PIECE_OPACITY = 0.13;
const PIECE_COLOR = '#7B4F10';

export default function ChessBg({ variant = 'page', color = PIECE_COLOR }) {
  const pieces = LAYOUTS[variant] || LAYOUTS.page;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: PIECE_SIZE,
            height: PIECE_SIZE,
            opacity: PIECE_OPACITY,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <svg
            viewBox="0 0 45 45"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            <path d={PIECES[p.piece]} />
          </svg>
        </div>
      ))}
    </div>
  );
}