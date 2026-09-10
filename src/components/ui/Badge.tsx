import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'new' | 'sale' | 'popular' | 'stock' | 'out';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-haze text-slate',
  new: 'bg-ink text-white',
  sale: 'bg-deal text-white',
  popular: 'bg-white text-ink border border-hairline',
  stock: 'bg-transparent text-instock',
  out: 'bg-transparent text-slate',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Compact status label. Kept small and few-per-card to avoid badge clutter. */
export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-micro font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Maps a product's badge string onto the matching tone. */
export const toneForBadge = (badge?: string): BadgeTone => {
  switch (badge) {
    case 'New':
      return 'new';
    case 'Sale':
      return 'sale';
    case 'Popular':
      return 'popular';
    default:
      return 'neutral';
  }
};
