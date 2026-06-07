/**
 * RookRibbonDivider — decorative medallion with curved ribbons and chess pieces.
 * Sits between the booking header and the Calendly embed.
 */
export default function RookRibbonDivider() {
  return (
    <div className="flex items-center justify-center py-6 px-4 select-none" aria-hidden="true">
      <svg
        viewBox="0 0 700 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl"
        style={{ overflow: 'visible' }}
      >
        {/* ── Left ribbon (curved path) ── */}
        <path
          d="M 290,60 C 260,48 220,44 180,46 C 150,47 120,52 90,50"
          fill="none"
          stroke="#E8A020"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Left ribbon lower edge (gives thickness) */}
        <path
          d="M 290,65 C 260,54 220,51 180,53 C 150,54 120,59 90,57"
          fill="none"
          stroke="#E8A020"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* Left ribbon fill */}
        <path
          d="M 290,60 C 260,48 220,44 180,46 C 150,47 120,52 90,50
             L 90,57 C 120,59 150,54 180,53 C 220,51 260,54 290,65 Z"
          fill="#E8A020"
          opacity="0.08"
        />
        {/* Left ribbon tapered end cap */}
        <path
          d="M 90,50 Q 82,53 90,57"
          fill="#E8A020"
          opacity="0.3"
        />

        {/* ── Right ribbon (mirrored) ── */}
        <path
          d="M 410,60 C 440,48 480,44 520,46 C 550,47 580,52 610,50"
          fill="none"
          stroke="#E8A020"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 410,65 C 440,54 480,51 520,53 C 550,54 580,59 610,57"
          fill="none"
          stroke="#E8A020"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M 410,60 C 440,48 480,44 520,46 C 550,47 580,52 610,50
             L 610,57 C 580,59 550,54 520,53 C 480,51 440,54 410,65 Z"
          fill="#E8A020"
          opacity="0.08"
        />
        <path
          d="M 610,50 Q 618,53 610,57"
          fill="#E8A020"
          opacity="0.3"
        />

        {/* ── Left ribbon chess pieces ── */}

        {/* Pawn at ~x=265 */}
        <g transform="translate(252, 49) scale(0.32)" opacity="0.45" fill="#C08010">
          <circle cx="12" cy="4" r="3.5"/>
          <path d="M 9,7.5 L 9,14 C 9,16 10.5,17.5 12,18 C 13.5,17.5 15,16 15,14 L 15,7.5 Z"/>
          <path d="M 6,18 L 18,18 L 20,22 L 20,26 L 4,26 L 4,22 Z"/>
        </g>

        {/* Bishop at ~x=230 */}
        <g transform="translate(218, 47) scale(0.30)" opacity="0.42" fill="#C08010">
          <circle cx="12" cy="3.5" r="2.5"/>
          <path d="M 12,6 L 9.5,11 L 9.5,22 C 9.5,24.5 10.5,26 12,27 C 13.5,26 14.5,24.5 14.5,22 L 14.5,11 Z"/>
          <path d="M 5,27 L 19,27 L 19,25.5 L 5,25.5 Z"/>
        </g>

        {/* Knight at ~x=190 */}
        <g transform="translate(178, 46) scale(0.30)" opacity="0.40" fill="#C08010">
          <path d="M 12,5 C 16,4.5 19,7.5 19,13 L 19,27 L 5,27 L 5,13 C 5,9 8,5 12,5 Z"/>
          <path d="M 12,5 C 13.5,6 15,8 14,11 C 13,13 10,12 10,9.5 Z"/>
          <circle cx="8.5" cy="20" r="0.7" fill="#FAFAF7" opacity="0.8"/>
          <circle cx="16.5" cy="20" r="0.7" fill="#FAFAF7" opacity="0.8"/>
        </g>

        {/* Queen at ~x=155 */}
        <g transform="translate(143, 46) scale(0.30)" opacity="0.38" fill="#C08010">
          <circle cx="12" cy="5" r="2.5"/>
          <circle cx="7" cy="6.5" r="2"/>
          <circle cx="17" cy="6.5" r="2"/>
          <path d="M 4,15 L 20,15 L 19,8 L 16,11.5 L 12,7 L 8,11.5 L 5,8 Z"/>
          <path d="M 5,15 L 5,26 L 19,26 L 19,15 M 5.5,17 L 18.5,17 M 5.5,20 L 18.5,20"/>
        </g>

        {/* Pawn at ~x=120 (near left end) */}
        <g transform="translate(108, 47) scale(0.28)" opacity="0.35" fill="#C08010">
          <circle cx="12" cy="4" r="3.5"/>
          <path d="M 9,7.5 L 9,14 C 9,16 10.5,17.5 12,18 C 13.5,17.5 15,16 15,14 L 15,7.5 Z"/>
          <path d="M 6,18 L 18,18 L 20,22 L 20,26 L 4,26 L 4,22 Z"/>
        </g>

        {/* ── Right ribbon chess pieces (mirrored positions) ── */}

        {/* Pawn at ~x=435 */}
        <g transform="translate(423, 49) scale(0.32)" opacity="0.45" fill="#C08010">
          <circle cx="12" cy="4" r="3.5"/>
          <path d="M 9,7.5 L 9,14 C 9,16 10.5,17.5 12,18 C 13.5,17.5 15,16 15,14 L 15,7.5 Z"/>
          <path d="M 6,18 L 18,18 L 20,22 L 20,26 L 4,26 L 4,22 Z"/>
        </g>

        {/* Bishop at ~x=465 */}
        <g transform="translate(453, 47) scale(0.30)" opacity="0.42" fill="#C08010">
          <circle cx="12" cy="3.5" r="2.5"/>
          <path d="M 12,6 L 9.5,11 L 9.5,22 C 9.5,24.5 10.5,26 12,27 C 13.5,26 14.5,24.5 14.5,22 L 14.5,11 Z"/>
          <path d="M 5,27 L 19,27 L 19,25.5 L 5,25.5 Z"/>
        </g>

        {/* Knight at ~x=500 */}
        <g transform="translate(488, 46) scale(0.30)" opacity="0.40" fill="#C08010">
          <path d="M 12,5 C 16,4.5 19,7.5 19,13 L 19,27 L 5,27 L 5,13 C 5,9 8,5 12,5 Z"/>
          <path d="M 12,5 C 13.5,6 15,8 14,11 C 13,13 10,12 10,9.5 Z"/>
          <circle cx="8.5" cy="20" r="0.7" fill="#FAFAF7" opacity="0.8"/>
          <circle cx="16.5" cy="20" r="0.7" fill="#FAFAF7" opacity="0.8"/>
        </g>

        {/* Queen at ~x=535 */}
        <g transform="translate(523, 46) scale(0.30)" opacity="0.38" fill="#C08010">
          <circle cx="12" cy="5" r="2.5"/>
          <circle cx="7" cy="6.5" r="2"/>
          <circle cx="17" cy="6.5" r="2"/>
          <path d="M 4,15 L 20,15 L 19,8 L 16,11.5 L 12,7 L 8,11.5 L 5,8 Z"/>
          <path d="M 5,15 L 5,26 L 19,26 L 19,15 M 5.5,17 L 18.5,17 M 5.5,20 L 18.5,20"/>
        </g>

        {/* Pawn near right end ~x=562 */}
        <g transform="translate(560, 47) scale(0.28)" opacity="0.35" fill="#C08010">
          <circle cx="12" cy="4" r="3.5"/>
          <path d="M 9,7.5 L 9,14 C 9,16 10.5,17.5 12,18 C 13.5,17.5 15,16 15,14 L 15,7.5 Z"/>
          <path d="M 6,18 L 18,18 L 20,22 L 20,26 L 4,26 L 4,22 Z"/>
        </g>

        {/* ── Central rook medallion ── */}
        {/* Outer glow ring */}
        <circle cx="350" cy="60" r="36" fill="#E8A020" opacity="0.08" />
        {/* Gold border ring */}
        <circle cx="350" cy="60" r="30" fill="#1a1410" stroke="#E8A020" strokeWidth="1.8" opacity="0.9" />
        {/* Inner accent ring */}
        <circle cx="350" cy="60" r="26" fill="none" stroke="#E8A020" strokeWidth="0.6" opacity="0.4" />

        {/* Rook piece — centred at 350,60, drawn in white */}
        <g transform="translate(336, 44)" fill="white" opacity="0.92">
          {/* Base */}
          <rect x="1" y="27" width="26" height="4" rx="1"/>
          {/* Body */}
          <rect x="3" y="14" width="22" height="14"/>
          {/* Battlements */}
          <rect x="1" y="8" width="6" height="8" rx="0.5"/>
          <rect x="11" y="8" width="6" height="8" rx="0.5"/>
          <rect x="21" y="8" width="6" height="8" rx="0.5"/>
          {/* Battlement gaps (cut out) */}
          <rect x="7" y="10" width="4" height="6" fill="#1a1410" opacity="1"/>
          <rect x="17" y="10" width="4" height="6" fill="#1a1410" opacity="1"/>
        </g>

        {/* Tiny decorative dots on each side where ribbon meets circle */}
        <circle cx="320" cy="60" r="2.5" fill="#E8A020" opacity="0.5"/>
        <circle cx="380" cy="60" r="2.5" fill="#E8A020" opacity="0.5"/>
      </svg>
    </div>
  );
}