import { useEffect } from 'react';

/**
 * Sets the document title for a route.
 *
 * A single-page app does not change the title on navigation by itself, and screen
 * readers announce it when the page changes — so every route sets one.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
