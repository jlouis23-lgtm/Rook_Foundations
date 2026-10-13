import { useEffect } from 'react';

// Keeps the leaderboard out of search results while it lives on the public
// domain; the tag and title are restored when leaving this area.
export function useNoIndex(title) {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = title;
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, [title]);
}
