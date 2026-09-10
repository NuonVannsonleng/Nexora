import { STORE_NAME } from '../../data/footer';

interface StoreLogoProps {
  /** Height of the mark in px. */
  height?: number;
  /** Hide the wordmark and show the mark alone (tight mobile headers). */
  markOnly?: boolean;
  className?: string;
}

/**
 * NEXORA's own store identity.
 *
 * This is the marketplace's original logo — deliberately not any manufacturer's
 * mark. Official brand logos appear only inside brand sections and on product
 * cards, so the store never presents itself as owned by Apple or anyone else.
 *
 * The mark is an "N" chevron drawn from two strokes, reading as both the initial
 * and a forward arrow.
 */
export function StoreLogo({ height = 22, markOnly = false, className = '' }: StoreLogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox="0 0 32 32"
        role="img"
        aria-label={`${STORE_NAME} logo`}
        style={{ height: '100%', width: 'auto' }}
        className="shrink-0"
      >
        <title>{STORE_NAME}</title>
        <rect width="32" height="32" rx="8.5" fill="currentColor" />
        {/* The N: two uprights joined by a diagonal, knocked out of the tile. */}
        <path
          d="M10 22.5V9.5l12 13V9.5"
          fill="none"
          stroke="var(--c-white, #fff)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!markOnly && (
        <span
          className="font-semibold leading-none"
          style={{ fontSize: `${height * 0.72}px`, letterSpacing: '0.14em' }}
        >
          {STORE_NAME}
        </span>
      )}
    </span>
  );
}
