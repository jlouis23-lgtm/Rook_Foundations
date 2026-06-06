/**
 * ChessBg — purely decorative, zero-interactivity SVG chess piece silhouettes.
 * Usage:  <ChessBg variant="hero" />
 * All pieces are rendered as semi-transparent, pointer-events-none elements.
 */

// Simplified, child-friendly SVG paths for each piece type
const PIECES = {
  // King — rounded crown
  king: "M12 2 L12 6 M10 4 L14 4 M9 6 Q12 5 15 6 L16 10 Q12 9 8 10 Z M7 10 Q12 8 17 10 L18 16 Q12 14 6 16 Z M5 16 Q12 14 19 16 L20 20 Q12 18 4 20 Z",
  // Queen — spiked crown
  queen: "M4 8 L7 14 L12 10 L17 14 L20 8 L18 6 L16 8 L14 6 L12 8 L10 6 L8 8 L6 6 Z M5 14 Q12 12 19 14 L20 20 Q12 18 4 20 Z",
  // Rook — battlements
  rook: "M6 4 L6 8 L8 8 L8 4 L10 4 L10 8 L12 8 L12 4 L14 4 L14 8 L16 8 L16 4 L18 4 L18 8 Q18 10 16 10 L16 18 Q16 20 14 20 L10 20 Q8 20 8 18 L8 10 Q6 10 6 8 Z",
  // Bishop — mitre head
  bishop: "M12 2 Q13 3 13 5 Q15 7 14 9 Q13 10 12 10 Q11 10 10 9 Q9 7 11 5 Q11 3 12 2 Z M10 10 Q12 9 14 10 L15 16 Q12 15 9 16 Z M8 16 Q12 14 16 16 L17 20 Q12 19 7 20 Z",
  // Knight — horse head
  knight: "M10 2 Q8 3 7 5 Q6 7 7 9 Q8 11 9 12 L8 14 Q8 15 9 15 L10 14 Q11 15 13 15 L14 12 Q16 10 16 7 Q15 4 13 3 Q12 2 10 2 Z M8 15 Q12 14 16 15 L16 20 Q12 19 8 20 Z",
  // Pawn — simple rounded
  pawn: "M12 4 Q14 4 14 6 Q14 8 12 8 Q10 8 10 6 Q10 4 12 4 Z M10 8 Q12 7 14 8 L15 14 Q12 13 9 14 Z M8 14 Q12 13 16 14 L17 20 Q12 19 7 20 Z",
};

// Preset layouts: array of { piece, x, y, size, opacity, rotate }
const LAYOUTS = {
  hero: [
    { piece: 'king',   x: '88%', y: '15%', size: 90,  opacity: 0.045, rotate: 12  },
    { piece: 'queen',  x: '5%',  y: '70%', size: 70,  opacity: 0.04,  rotate: -8  },
    { piece: 'rook',   x: '92%', y: '65%', size: 55,  opacity: 0.035, rotate: 5   },
    { piece: 'pawn',   x: '15%', y: '20%', size: 40,  opacity: 0.05,  rotate: -5  },
    { piece: 'pawn',   x: '78%', y: '82%', size: 35,  opacity: 0.04,  rotate: 8   },
    { piece: 'bishop', x: '50%', y: '88%', size: 50,  opacity: 0.03,  rotate: -3  },
  ],
  classes: [
    { piece: 'knight', x: '3%',  y: '10%', size: 80,  opacity: 0.04,  rotate: -10 },
    { piece: 'pawn',   x: '93%', y: '5%',  size: 45,  opacity: 0.045, rotate: 6   },
    { piece: 'rook',   x: '90%', y: '75%', size: 65,  opacity: 0.035, rotate: -5  },
    { piece: 'pawn',   x: '8%',  y: '80%', size: 38,  opacity: 0.04,  rotate: 10  },
  ],
  testimonials: [
    { piece: 'queen',  x: '96%', y: '20%', size: 65,  opacity: 0.04,  rotate: 8   },
    { piece: 'bishop', x: '2%',  y: '55%', size: 55,  opacity: 0.04,  rotate: -6  },
    { piece: 'pawn',   x: '88%', y: '80%', size: 38,  opacity: 0.045, rotate: 4   },
  ],
  faq: [
    { piece: 'king',   x: '95%', y: '8%',  size: 72,  opacity: 0.04,  rotate: -8  },
    { piece: 'knight', x: '1%',  y: '40%', size: 60,  opacity: 0.035, rotate: 10  },
    { piece: 'pawn',   x: '92%', y: '70%', size: 40,  opacity: 0.04,  rotate: -4  },
  ],
  cta: [
    { piece: 'rook',   x: '4%',  y: '15%', size: 60,  opacity: 0.07,  rotate: -6  },
    { piece: 'queen',  x: '88%', y: '60%', size: 75,  opacity: 0.06,  rotate: 10  },
    { piece: 'pawn',   x: '50%', y: '85%', size: 42,  opacity: 0.06,  rotate: 3   },
  ],
  page: [
    { piece: 'bishop', x: '94%', y: '5%',  size: 70,  opacity: 0.04,  rotate: 8   },
    { piece: 'pawn',   x: '3%',  y: '30%', size: 42,  opacity: 0.04,  rotate: -5  },
    { piece: 'knight', x: '90%', y: '60%', size: 58,  opacity: 0.035, rotate: -12 },
    { piece: 'rook',   x: '5%',  y: '80%', size: 50,  opacity: 0.035, rotate: 6   },
  ],
};

export default function ChessBg({ variant = 'page', color = '#2D2520' }) {
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
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
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