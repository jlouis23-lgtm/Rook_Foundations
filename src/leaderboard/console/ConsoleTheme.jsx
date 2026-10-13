import { createContext, useContext, useEffect } from 'react';

// Lets a console page tell the layout which game world it is in, so the
// header band, background and accents follow the game being played.
export const ConsoleThemeContext = createContext(() => {});

export function useConsoleTheme(themeId) {
  const setThemeId = useContext(ConsoleThemeContext);
  useEffect(() => {
    if (!themeId) return undefined;
    setThemeId(themeId);
    return () => setThemeId('hub');
  }, [themeId, setThemeId]);
}
