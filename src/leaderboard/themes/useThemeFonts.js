import { useEffect } from 'react';

// Loads a theme's typefaces while it is on screen.
export function useThemeFonts(href) {
  useEffect(() => {
    if (!href) return undefined;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return () => link.remove();
  }, [href]);
}
