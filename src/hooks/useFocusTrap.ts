import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Confines Tab focus to `containerRef` while `active`, restoring focus to whatever
 * was focused beforehand on close. Used by every drawer and modal so keyboard users
 * cannot tab out into the page behind an open overlay.
 *
 * `restoreTo` is the element to return focus to. It has to be supplied by the
 * caller: React runs child effects before parent effects, so by the time this hook
 * runs a child may already have focused itself (the search field does), and reading
 * `document.activeElement` here would capture that child instead of the opener.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  restoreTo?: HTMLElement | null,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const current = document.activeElement as HTMLElement | null;
    const previouslyFocused =
      restoreTo ?? (container.contains(current) ? null : current);

    const focusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Move focus into the overlay so the next Tab starts inside it — but only if
    // it is not already there. A child that focuses itself on mount (the search
    // field, say) runs its effect before this one, and must not be overridden.
    if (!container.contains(document.activeElement)) {
      const first = focusable()[0];
      (first ?? container).focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === firstItem || current === container)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Only restore if the element is still in the document.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [active, containerRef, restoreTo]);
}

/**
 * Locks page scrolling while an overlay is open, via a body attribute so nested
 * overlays cannot fight over inline styles.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const previous = body.getAttribute('data-scroll-locked');
    body.setAttribute('data-scroll-locked', 'true');
    return () => {
      if (previous === null) body.removeAttribute('data-scroll-locked');
      else body.setAttribute('data-scroll-locked', previous);
    };
  }, [active]);
}

/** Calls `onEscape` on the Escape key while `active`. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [active, onEscape]);
}
