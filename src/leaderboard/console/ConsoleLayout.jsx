import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { isStoragePersistent, useLeaderboardSync } from '../data/hooks';
import { getTheme } from '../themes';
import { useThemeFonts } from '../themes/useThemeFonts';
import { useNoIndex } from '../useNoIndex';
import { ConsoleThemeContext } from './ConsoleTheme';
import './console.css';

// The practitioner console's frame. One Rook Foundations shell; the header
// band, background texture and accents change with the game being played.
export default function ConsoleLayout() {
  useNoIndex('Strategy Leaderboard | Rook Foundations');
  useLeaderboardSync();
  const [themeId, setThemeId] = useState('hub');
  const theme = getTheme(themeId);
  useThemeFonts(theme.fontsHref);
  const persistent = isStoragePersistent();
  const { Backdrop, Frieze, Emblem } = theme;

  return (
    <ConsoleThemeContext.Provider value={setThemeId}>
      <div className="lb-console" data-lb-theme={theme.id}>
        {/* Keyed by theme so each world fades in as it is entered. */}
        <div key={`texture-${theme.id}`} className="lb-console-texture">
          <Backdrop variant="console" />
        </div>

        <header className="lb-band">
          <div className="lb-band-inner">
            <Link to="/leaderboard" className="lb-brand">
              <span className="lb-brand-kicker">Rook Foundations</span>
              <span className="lb-brand-name">
                <span aria-hidden="true">♜</span>
                Strategy Leaderboard
              </span>
            </Link>
            <div className="lb-band-art" aria-hidden="true">
              <div key={`art-${theme.id}`} className="lb-arrive">
                <Frieze />
              </div>
            </div>
            {theme.id !== 'hub' && (
              <p key={`name-${theme.id}`} className="lb-world-name lb-arrive">
                <Emblem />
                {theme.name}
              </p>
            )}
          </div>
        </header>

        <main className="lb-console-main">
          <Outlet />
        </main>

        <footer className="lb-console-footer">
          <p className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-xs text-[#2D2520]/60">
            {persistent
              ? 'Prototype: sessions are saved only in this browser on this device. They are not backed up online.'
              : 'This browser is blocking storage, so sessions will be lost when this tab closes.'}
          </p>
        </footer>
      </div>
    </ConsoleThemeContext.Provider>
  );
}
