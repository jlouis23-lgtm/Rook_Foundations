import { useEffect } from 'react';

export const DEFAULT_TITLE = 'Rook Foundations | Strategy Games & Learning for Children';
export const DEFAULT_DESCRIPTION = 'Rook Foundations is a growing education project using chess and strategy games to create meaningful learning opportunities for children, building confidence, character and skills for life.';

// Sets document.title and the single <meta name="description"> tag for the
// current page. Updates the existing tag from index.html in place (never
// creates a second one), so each route swap just overwrites the previous
// page's values rather than leaving stale metadata behind.
export function usePageMeta(title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);
}
