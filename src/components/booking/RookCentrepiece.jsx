/**
 * RookCentrepiece — gold-and-white rook illustration with symmetrical cascading
 * ribbons and subtle game-piece accents. Pure SVG, no external assets.
 */
export default function RookCentrepiece() {
  return (
    <div className="flex justify-center items-center py-4 select-none pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 520 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gold gradient – rook body */}
          <linearGradient id="goldBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FDE68A" />
            <stop offset="35%"  stopColor="#F4C261" />
            <stop offset="70%"  stopColor="#E8A020" />
            <stop offset="100%" stopColor="#B8790A" />
          </linearGradient>

          {/* Gold gradient – lighter for highlights */}
          <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#F4C261" />
          </linearGradient>

          {/* Ribbon gradient – left */}
          <linearGradient id="ribbonL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#E8A020" stopOpacity="0.15" />
            <stop offset="50%"  stopColor="#F4C261" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8A020" stopOpacity="0.08" />
          </linearGradient>

          {/* Ribbon gradient – right (mirror) */}
          <linearGradient id="ribbonR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#E8A020" stopOpacity="0.15" />
            <stop offset="50%"  stopColor="#F4C261" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8A020" stopOpacity="0.08" />
          </linearGradient>

          {/* Soft gold stroke for mini pieces */}
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── LEFT RIBBON ── */}
        {/* Main ribbon sweep — cascades gently downward from rook base */}
        <path
          d="M 230,100 C 190,105 140,118 80,130 C 50,136 20,138 5,136"
          fill="none"
          stroke="url(#ribbonL)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Ribbon edge highlight */}
        <path
          d="M 230,96 C 190,101 140,113 80,125 C 50,131 20,133 5,131"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Ribbon lower edge shadow */}
        <path
          d="M 230,104 C 190,109 140,123 80,135 C 50,141 20,143 5,141"
          fill="none"
          stroke="#B8790A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* ── RIGHT RIBBON (mirror) ── */}
        <path
          d="M 290,100 C 330,105 380,118 440,130 C 470,136 500,138 515,136"
          fill="none"
          stroke="url(#ribbonR)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 290,96 C 330,101 380,113 440,125 C 470,131 500,133 515,131"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 290,104 C 330,109 380,123 440,135 C 470,141 500,143 515,141"
          fill="none"
          stroke="#B8790A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* ── RIBBON ACCENT PIECES — LEFT SIDE ── */}

        {/* Pawn accent ~left-far */}
        <g transform="translate(58, 118)" opacity="0.55" filter="url(#glow)">
          <circle cx="7" cy="4" r="3.5" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M5,7.5 L5,14 C5,15.5 6,16.5 7,17 C8,16.5 9,15.5 9,14 L9,7.5 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M3,17 L11,17 L12,20 L2,20 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
        </g>

        {/* Small diamond accent */}
        <g transform="translate(108, 113)" opacity="0.4">
          <path d="M7,2 L12,7 L7,12 L2,7 Z" fill="none" stroke="#F4C261" strokeWidth="1.1"/>
          <path d="M7,4 L10,7 L7,10 L4,7 Z" fill="#F4C261" opacity="0.25"/>
        </g>

        {/* Bishop accent ~left-mid */}
        <g transform="translate(152, 109)" opacity="0.5" filter="url(#glow)">
          <circle cx="7" cy="3" r="2.5" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M7,5.5 L5,10 L5,17 C5,18.5 6,19.5 7,20 C8,19.5 9,18.5 9,17 L9,10 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M3,20 L11,20 L11,21.5 L3,21.5 Z" fill="none" stroke="#E8A020" strokeWidth="1.1"/>
        </g>

        {/* Dot accent */}
        <circle cx="192" cy="107" r="2" fill="#F4C261" opacity="0.5"/>
        <circle cx="200" cy="108" r="1.2" fill="#E8A020" opacity="0.35"/>

        {/* Knight silhouette ~left-near */}
        <g transform="translate(202, 100)" opacity="0.45" filter="url(#glow)">
          <path d="M8,2 C11,2 14,5 14,9 L14,20 L2,20 L2,9 C2,5 5,2 8,2 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M8,2 C9.5,2.5 11,4 10.5,7 C10,9 7.5,8.5 7.5,6 Z" fill="none" stroke="#E8A020" strokeWidth="1"/>
        </g>

        {/* ── RIBBON ACCENT PIECES — RIGHT SIDE (mirror) ── */}

        {/* Knight accent ~right-near */}
        <g transform="translate(304, 100)" opacity="0.45" filter="url(#glow)">
          <path d="M8,2 C11,2 14,5 14,9 L14,20 L2,20 L2,9 C2,5 5,2 8,2 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M8,2 C9.5,2.5 11,4 10.5,7 C10,9 7.5,8.5 7.5,6 Z" fill="none" stroke="#E8A020" strokeWidth="1"/>
        </g>

        {/* Dot accent */}
        <circle cx="320" cy="108" r="1.2" fill="#E8A020" opacity="0.35"/>
        <circle cx="328" cy="107" r="2" fill="#F4C261" opacity="0.5"/>

        {/* Bishop accent ~right-mid */}
        <g transform="translate(348, 109)" opacity="0.5" filter="url(#glow)">
          <circle cx="7" cy="3" r="2.5" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M7,5.5 L5,10 L5,17 C5,18.5 6,19.5 7,20 C8,19.5 9,18.5 9,17 L9,10 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M3,20 L11,20 L11,21.5 L3,21.5 Z" fill="none" stroke="#E8A020" strokeWidth="1.1"/>
        </g>

        {/* Small diamond accent */}
        <g transform="translate(400, 113)" opacity="0.4">
          <path d="M7,2 L12,7 L7,12 L2,7 Z" fill="none" stroke="#F4C261" strokeWidth="1.1"/>
          <path d="M7,4 L10,7 L7,10 L4,7 Z" fill="#F4C261" opacity="0.25"/>
        </g>

        {/* Pawn accent ~right-far */}
        <g transform="translate(448, 118)" opacity="0.55" filter="url(#glow)">
          <circle cx="7" cy="4" r="3.5" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M5,7.5 L5,14 C5,15.5 6,16.5 7,17 C8,16.5 9,15.5 9,14 L9,7.5 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
          <path d="M3,17 L11,17 L12,20 L2,20 Z" fill="none" stroke="#E8A020" strokeWidth="1.2"/>
        </g>

        {/* ── CENTRAL ROOK ── */}
        {/* Glow halo behind rook */}
        <ellipse cx="260" cy="95" rx="38" ry="42" fill="#FDE68A" opacity="0.12"/>
        <ellipse cx="260" cy="95" rx="28" ry="32" fill="#FDE68A" opacity="0.1"/>

        {/* Rook base platform */}
        <rect x="236" y="128" width="48" height="7" rx="3.5" fill="url(#goldBody)" opacity="0.9"/>
        <rect x="238" y="128" width="44" height="2" rx="1" fill="#FDE68A" opacity="0.4"/>

        {/* Rook body */}
        <rect x="240" y="100" width="40" height="30" rx="2" fill="url(#goldBody)"/>
        {/* Body highlight */}
        <rect x="242" y="102" width="12" height="26" rx="2" fill="white" opacity="0.12"/>
        {/* Body detail line */}
        <rect x="240" y="114" width="40" height="2" rx="1" fill="#B8790A" opacity="0.3"/>
        <rect x="240" y="115" width="40" height="1" rx="0.5" fill="#FDE68A" opacity="0.25"/>

        {/* Rook collar (wider section) */}
        <rect x="237" y="96" width="46" height="8" rx="2" fill="url(#goldBody)"/>
        <rect x="239" y="97" width="14" height="5" rx="1.5" fill="white" opacity="0.14"/>
        <rect x="237" y="96" width="46" height="2" rx="1" fill="#FDE68A" opacity="0.35"/>
        <rect x="237" y="102" width="46" height="1.5" rx="0.75" fill="#B8790A" opacity="0.25"/>

        {/* Crenellations */}
        {/* Left merlon */}
        <rect x="240" y="78" width="11" height="20" rx="1.5" fill="url(#goldBody)"/>
        <rect x="241" y="79" width="4" height="14" rx="1" fill="white" opacity="0.14"/>
        <rect x="240" y="78" width="11" height="2.5" rx="1" fill="#FDE68A" opacity="0.4"/>

        {/* Middle merlon */}
        <rect x="254" y="78" width="12" height="20" rx="1.5" fill="url(#goldBody)"/>
        <rect x="255" y="79" width="4" height="14" rx="1" fill="white" opacity="0.14"/>
        <rect x="254" y="78" width="12" height="2.5" rx="1" fill="#FDE68A" opacity="0.4"/>

        {/* Right merlon */}
        <rect x="269" y="78" width="11" height="20" rx="1.5" fill="url(#goldBody)"/>
        <rect x="270" y="79" width="4" height="14" rx="1" fill="white" opacity="0.14"/>
        <rect x="269" y="78" width="11" height="2.5" rx="1" fill="#FDE68A" opacity="0.4"/>

        {/* Gap shadows between merlons */}
        <rect x="251" y="82" width="3" height="16" rx="1" fill="#7A4F00" opacity="0.18"/>
        <rect x="266" y="82" width="3" height="16" rx="1" fill="#7A4F00" opacity="0.18"/>

        {/* Window slot on body */}
        <rect x="252" y="106" width="16" height="10" rx="2" fill="#7A4F00" opacity="0.22"/>
        <rect x="254" y="107" width="12" height="7" rx="1.5" fill="white" opacity="0.08"/>

        {/* Crown cap line */}
        <rect x="237" y="95" width="46" height="1.5" rx="0.75" fill="#FDE68A" opacity="0.5"/>

        {/* ── SMALL STAR SPARKLES ── */}
        <text x="218" y="82" fontSize="10" fill="#F4C261" opacity="0.6" textAnchor="middle">✦</text>
        <text x="302" y="82" fontSize="10" fill="#F4C261" opacity="0.6" textAnchor="middle">✦</text>
        <text x="260" y="68" fontSize="7"  fill="#FDE68A" opacity="0.5" textAnchor="middle">★</text>
      </svg>
    </div>
  );
}