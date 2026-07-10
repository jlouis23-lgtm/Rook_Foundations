/**
 * ChessBg — refined chess.com-style piece silhouettes.
 * Minimal, intentional placement in negative space only.
 * Smaller, subtle appearance; sparse coverage prioritising clean composition.
 * Pieces drift a few pixels as the section scrolls through view, like a
 * board seen from a slowly moving perspective. Disabled under reduced motion.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Authentic chess.com–style filled SVG paths, viewBox "0 0 45 45"
const PIECES = {
  king: `
    <g fill="#7B4F10" stroke="none">
      <circle cx="22.5" cy="12" r="3"/>
      <path d="M 22.5,15 L 22.5,20 M 18,19 L 27,19 M 15,25 C 15,30 18.5,35 22.5,38 C 26.5,35 30,30 30,25 Z" stroke="#7B4F10" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="20" y="10" width="5" height="3" fill="#7B4F10"/>
    </g>`,
  queen: `
    <g fill="#7B4F10" stroke="none">
      <circle cx="22.5" cy="10" r="2.5"/>
      <circle cx="16" cy="11.5" r="2"/>
      <circle cx="29" cy="11.5" r="2"/>
      <path d="M 10,25 L 35,25 L 34,14 L 30,18 L 25,12 L 22.5,18 L 20,12 L 15,18 L 11,14 Z" fill="#7B4F10"/>
      <path d="M 12,25 L 12,38 L 33,38 L 33,25 M 13,27 L 32,27 M 13,30 L 32,30" stroke="#7B4F10" stroke-width="1" fill="none"/>
    </g>`,
  rook: `
    <g fill="#7B4F10" stroke="none">
      <path d="M 10,38 L 35,38 L 35,35 L 10,35 Z" fill="#7B4F10"/>
      <path d="M 12,35 L 12,18 L 33,18 L 33,35 Z" fill="#7B4F10"/>
      <path d="M 11,18 L 11,12 L 14,12 L 14,8 L 17,8 L 17,12 L 28,12 L 28,8 L 31,8 L 31,12 L 34,12 L 34,18 Z" fill="#7B4F10"/>
    </g>`,
  bishop: `
    <g fill="#7B4F10" stroke="none">
      <circle cx="22.5" cy="8" r="2.5" fill="#7B4F10"/>
      <path d="M 22.5,10.5 L 19,16 L 19,32 C 19,35 20.5,37 22.5,38 C 24.5,37 26,35 26,32 L 26,16 Z" fill="#7B4F10"/>
      <path d="M 14,38 L 31,38 L 31,36 L 14,36 Z" fill="#7B4F10"/>
      <path d="M 20,32 C 20,34 21,36 22.5,37 C 24,36 25,34 25,32" fill="none" stroke="#7B4F10" stroke-width="0.8"/>
    </g>`,
  knight: `
    <g fill="#7B4F10" stroke="none">
      <path d="M 22,10 C 28,9 32,13 32,20 L 32,38 L 13,38 L 13,20 C 13,15 16,10 22,10 Z" fill="#7B4F10"/>
      <path d="M 22,10 C 24,11 26,13 25,17 C 24,20 20,19 20,16 Z" fill="#7B4F10"/>
      <circle cx="18" cy="30" r="1" fill="#FAFAF7"/>
      <circle cx="27" cy="30" r="1" fill="#FAFAF7"/>
    </g>`,
  pawn: `
    <g fill="#7B4F10" stroke="none">
      <circle cx="22.5" cy="8" r="3.5" fill="#7B4F10"/>
      <path d="M 19,11.5 L 19,20 C 19,23 20.5,25 22.5,26 C 24.5,25 26,23 26,20 L 26,11.5 Z" fill="#7B4F10"/>
      <path d="M 15,26 L 30,26 L 32,32 L 32,38 L 13,38 L 13,32 Z" fill="#7B4F10"/>
    </g>`,
};

// Minimal, intentional layouts with fewer pieces in clear negative space
// Pieces placed only where there is substantial breathing room
const LAYOUTS = {
  // Hero: top corners + bottom corners
  hero: [
    { piece: 'rook',   edge: 'left',  fromEdge: 16, fromTop: 100,  rotate: -8  },
    { piece: 'queen',  edge: 'right', fromEdge: 16, fromTop: 100,  rotate: 12  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 600,  rotate: 5,   hideOnMobile: true },
    { piece: 'king',   edge: 'right', fromEdge: 18, fromTop: 600,  rotate: -6,  hideOnMobile: true },
  ],
  
  // Classes: minimal, avoid content cards
  classes: [
    { piece: 'knight', edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -14 },
    { piece: 'king',   edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 10  },
    { piece: 'bishop', edge: 'left',  fromEdge: 18, fromTop: 550,  rotate: 8,   hideOnMobile: true },
    { piece: 'queen',  edge: 'right', fromEdge: 18, fromTop: 550,  rotate: 12,  hideOnMobile: true },
  ],
  
  // Testimonials: sparse, respect card spacing
  testimonials: [
    { piece: 'queen',  edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: 9   },
    { piece: 'bishop', edge: 'right', fromEdge: 16, fromTop: 80,   rotate: -8  },
  ],
  
  // Instructor: minimal
  instructor: [
    { piece: 'king',   edge: 'right', fromEdge: 16, fromTop: 100,  rotate: 9   },
    { piece: 'pawn',   edge: 'left',  fromEdge: 16, fromTop: 100,  rotate: -11 },
  ],
  
  // FAQ: minimal, space around boxes
  faq: [
    { piece: 'king',   edge: 'right', fromEdge: 16, fromTop: 80,   rotate: -8  },
    { piece: 'knight', edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: 12  },
  ],
  
  // CTA: top corners only
  cta: [
    { piece: 'rook',   edge: 'left',  fromEdge: 18, fromTop: 60,   rotate: -6 },
    { piece: 'queen',  edge: 'right', fromEdge: 18, fromTop: 60,   rotate: 14 },
  ],
  
  // Contact: minimal with clear spacing
  contact: [
    { piece: 'bishop', edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 11 },
    { piece: 'pawn',   edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -7 },
  ],
  
  // Pricing: balanced but sparse
  pricing: [
    { piece: 'queen',  edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 8  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -6 },
    { piece: 'rook',   edge: 'left',  fromEdge: 18, fromTop: 550,  rotate: -3,  hideOnMobile: true },
    { piece: 'king',   edge: 'right', fromEdge: 18, fromTop: 550,  rotate: 5,   hideOnMobile: true },
  ],
  
  // PricingCTA: top corners only
  pricingcta: [
    { piece: 'knight', edge: 'left',  fromEdge: 18, fromTop: 60,   rotate: -10 },
    { piece: 'king',   edge: 'right', fromEdge: 18, fromTop: 60,   rotate: 14  },
  ],
  
  // Booking: minimal
  booking: [
    { piece: 'rook',   edge: 'right', fromEdge: 16, fromTop: 80,   rotate: -5 },
    { piece: 'pawn',   edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: 11 },
  ],
  
  // WhyChess: sparse
  whychess: [
    { piece: 'bishop', edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 12 },
    { piece: 'knight', edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -9 },
  ],
  
  // Training: minimal
  training: [
    { piece: 'king',   edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 7  },
    { piece: 'rook',   edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -8 },
  ],
  
  // AboutHeader: balanced
  aboutheader: [
    { piece: 'rook',   edge: 'right', fromEdge: 18, fromTop: 100,  rotate: 9   },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 100,  rotate: -12 },
  ],
  
  // MyStory: sparse
  mystory: [
    { piece: 'knight', edge: 'right', fromEdge: 16, fromTop: 100,  rotate: -8 },
    { piece: 'bishop', edge: 'left',  fromEdge: 16, fromTop: 100,  rotate: 10 },
  ],
  
  // References: minimal
  references: [
    { piece: 'queen',  edge: 'right', fromEdge: 16, fromTop: 80,   rotate: 11 },
    { piece: 'bishop', edge: 'left',  fromEdge: 16, fromTop: 80,   rotate: -7 },
  ],

  // Research summary: warm, sparse
  research: [
    { piece: 'rook',   edge: 'right', fromEdge: 18, fromTop: 90,   rotate: 9  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 90,   rotate: -8 },
    { piece: 'knight', edge: 'left',  fromEdge: 16, fromTop: 560,  rotate: -10, hideOnMobile: true },
    { piece: 'bishop', edge: 'right', fromEdge: 16, fromTop: 560,  rotate: 8,   hideOnMobile: true },
  ],

  // Risk assessment: minimal, calm
  risk: [
    { piece: 'king',   edge: 'right', fromEdge: 18, fromTop: 90,   rotate: 7  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 90,   rotate: -6 },
  ],

  // Terms & Conditions: minimal, understated for a legal document
  legal: [
    { piece: 'rook',   edge: 'right', fromEdge: 18, fromTop: 90,   rotate: 6  },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 90,   rotate: -7 },
  ],

  // Default/Page: sparse
  page: [
    { piece: 'bishop', edge: 'right', fromEdge: 18, fromTop: 100,  rotate: 8   },
    { piece: 'pawn',   edge: 'left',  fromEdge: 18, fromTop: 100,  rotate: -6  },
  ],
};

// Smaller, more subtle sizing
const PIECE_SIZE = 36;
const PIECE_OPACITY = 0.09;

function Piece({ p, i, scrollYProgress, prefersReducedMotion }) {
  const driftRange = prefersReducedMotion ? 0 : 6 + (i % 3) * 5;
  const direction = i % 2 === 0 ? 1 : -1;
  const y = useTransform(scrollYProgress, [0, 1], [-driftRange * direction, driftRange * direction]);

  const style = {
    position: 'absolute',
    [p.edge === 'left' ? 'left' : 'right']: p.fromEdge,
    top: p.fromTop,
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    opacity: PIECE_OPACITY,
    rotate: p.rotate,
    flexShrink: 0,
    y,
  };

  const mobileClass = p.hideOnMobile ? 'hidden md:block' : 'block';

  return (
    <motion.div className={`absolute ${mobileClass}`} style={style}>
      <svg
        viewBox="0 0 45 45"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: PIECES[p.piece] }}
      />
    </motion.div>
  );
}

export default function ChessBg({ variant = 'page' }) {
  const pieces = LAYOUTS[variant] || LAYOUTS.page;
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none select-none print:hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <Piece key={i} p={p} i={i} scrollYProgress={scrollYProgress} prefersReducedMotion={prefersReducedMotion} />
      ))}
    </div>
  );
}