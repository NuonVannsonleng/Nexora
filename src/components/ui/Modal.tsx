import { useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEscapeKey, useFocusTrap, useScrollLock } from '../../hooks/useFocusTrap';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  title: string;
  /** Hide the title visually while keeping it for screen readers. */
  hideTitle?: boolean;
  children: ReactNode;
  /** Right-hand drawer (bag, filters) or a top sheet (search). */
  placement?: 'right' | 'top' | 'center';
  className?: string;
  /** Extra content pinned to the bottom of a right-hand drawer. */
  footer?: ReactNode;
}

const panelPlacement = {
  right: 'ml-auto h-full w-full max-w-[420px] drawer-panel-right',
  top: 'w-full drawer-panel-top',
  center: 'm-auto w-[min(92vw,720px)] rounded-lg drawer-panel-top',
};

/**
 * The overlay used by the bag, mobile menu, search and filter drawers.
 *
 * Handles the full dialog contract in one place: role/aria wiring, Escape,
 * scrim click, focus trap, focus restore and body scroll lock.
 */
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  placement = 'right',
  className = '',
  footer,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-${Math.random().toString(36).slice(2, 9)}`).current;

  // Remember what was focused when the dialog opened, so focus can go back there
  // on close. Captured during the opening render rather than in an effect: child
  // effects run first, and one of them may focus itself (the search field does).
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  if (open && !wasOpenRef.current) {
    openerRef.current = document.activeElement as HTMLElement | null;
  }
  wasOpenRef.current = open;

  useEscapeKey(open, onClose);
  useFocusTrap(panelRef, open, openerRef.current);
  useScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex" style={{ zIndex: 'var(--z-drawer)' }}>
      {/* Scrim: clicking it closes. Hidden from the a11y tree — Escape and the
          explicit close button are the accessible paths. */}
      <div
        className="drawer-scrim absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-full flex-col bg-white shadow-drawer outline-none ${panelPlacement[placement]} ${className}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className={hideTitle ? 'sr-only' : 'text-[1.125rem] font-semibold'}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            className="-mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && <div className="border-t border-hairline bg-white px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
