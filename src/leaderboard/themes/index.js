import './themes.css';
import hub from './hub';
import seaforth from './seaforth';
import chess from './chess';

// A theme gives a game its own world inside the one Rook Foundations
// leaderboard. Adding a game means adding one folder here. Each theme
// supplies:
//   fontsHref   – the typefaces it loads
//   Backdrop    – a faint full-screen texture (variant: 'console' | 'display');
//                 pattern only, so it is safe behind text
//   Frieze      – the game's imagery (pieces, ships…) as a strip that fills
//                 whatever box it is given; used in the header band, the
//                 game tiles and the display header, never behind content
//   Emblem      – a small mark for the game
//   labels      – game-specific wording (standings, finalStandings, overall, latest)
//   RankMarker  – how a position is drawn on the display
//   ResultToken – how one result (and its points) is drawn on the display
// plus a stylesheet that sets the --lb-* tokens under [data-lb-theme="<id>"]
// and the display tokens under .rf-display[data-theme="<id>"].
// The shared shell fixes structure, sizing and motion, so every game still
// reads as the same application.

const THEMES = { hub, seaforth, chess };

export function getTheme(themeId) {
  return THEMES[themeId] ?? hub;
}
