import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms, applied when several reveals sit side by side. */
  delay?: number;
  className?: string;
}

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * The observer disconnects after firing, so scrolling back up does not replay the
 * animation. When the visitor prefers reduced motion — or IntersectionObserver is
 * unavailable, as in jsdom — the content is marked visible immediately and the
 * stylesheet's reduced-motion rule keeps it fully opaque.
 */
export function ScrollReveal({ children, as: Tag = 'div', delay = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!node || reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Fire slightly before the element reaches the fold.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
