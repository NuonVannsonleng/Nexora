import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../data/types';
import { ProductImage } from './ProductImage';

interface ProductGalleryProps {
  product: Product;
  /** Accessible label for each view, e.g. "Apple iPhone 15 Pro". */
  productLabel: string;
}

/**
 * Product gallery.
 *
 * The catalogue holds one authentic photograph per product, so rather than pad the
 * gallery with invented extra angles this presents that photo at three framings —
 * full, and two crops that let the visitor look closer. Views are labelled for
 * what they are.
 *
 * Desktop gets a thumbnail rail; touch viewports get a swipeable, snap-scrolling
 * carousel driven by the same state.
 */
const VIEWS = [
  { id: 'full', label: 'Full view', objectPosition: 'center', scale: 1 },
  { id: 'detail', label: 'Detail', objectPosition: 'center 35%', scale: 1.6 },
  { id: 'closer', label: 'Closer', objectPosition: 'center 65%', scale: 2.1 },
] as const;

export function ProductGallery({ product, productLabel }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const active = VIEWS[index];

  const go = (next: number) => setIndex((next + VIEWS.length) % VIEWS.length);

  // Keep the mobile carousel in step when a thumbnail or arrow changes the view.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [index]);

  return (
    <div className="flex flex-col gap-4">
      {/* ---- Desktop / tablet: one large frame ------------------------- */}
      <div
        className="relative hidden overflow-hidden rounded-lg bg-haze md:block"
        style={{ aspectRatio: '4 / 3' }}
      >
        <div
          className="h-full w-full transition-transform duration-slow ease-premium"
          style={{ transform: `scale(${active.scale})`, transformOrigin: active.objectPosition }}
        >
          <ProductImage
            base={product.image}
            alt={`${productLabel} — ${active.label.toLowerCase()}`}
            width={product.imageWidth}
            height={product.imageHeight}
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="h-full w-full object-contain p-[6%]"
          />
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous view"
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition-transform duration-fast hover:scale-105"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next view"
          className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition-transform duration-fast hover:scale-105"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {/* ---- Mobile: swipeable carousel -------------------------------- */}
      {/* tabIndex makes this scroller reachable by keyboard so the arrow keys can
          pan it — a scrollable region with no focusable content is a dead end for
          anyone not using touch. */}
      <div
        ref={trackRef}
        role="group"
        aria-label={`${productLabel} image carousel`}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-lg md:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {VIEWS.map((view, i) => (
          <div
            key={view.id}
            className="relative w-full flex-none snap-center overflow-hidden rounded-lg bg-haze"
            style={{ aspectRatio: '4 / 3' }}
            aria-label={`${view.label}, ${i + 1} of ${VIEWS.length}`}
          >
            <div
              className="h-full w-full"
              style={{ transform: `scale(${view.scale})`, transformOrigin: view.objectPosition }}
            >
              <ProductImage
                base={product.image}
                alt={`${productLabel} — ${view.label.toLowerCase()}`}
                width={product.imageWidth}
                height={product.imageHeight}
                priority={i === 0}
                sizes="100vw"
                className="h-full w-full object-contain p-[6%]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ---- Thumbnail rail: the view switcher on every viewport ------- */}
      <div role="group" aria-label="Product views" className="flex gap-3">
        {VIEWS.map((view, i) => (
          <button
            key={view.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border bg-haze transition-colors duration-fast ${
              i === index ? 'border-ink' : 'border-hairline hover:border-slate'
            }`}
          >
            <div
              className="h-full w-full"
              style={{ transform: `scale(${view.scale})`, transformOrigin: view.objectPosition }}
            >
              <img
                src={`${product.image}-640.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <span className="sr-only">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
