interface ProductImageProps {
  /** Base path under /assets/products, without the size suffix. */
  base: string;
  alt: string;
  width: number;
  height: number;
  /** Above-the-fold images should load eagerly and skip lazy decoding. */
  priority?: boolean;
  /** `sizes` hint so the browser can pick the right variant. */
  sizes?: string;
  className?: string;
}

/**
 * A product photo as a <picture> with WebP first and JPEG as the fallback.
 *
 * Both intrinsic dimensions are always set so the browser reserves the right box
 * before the bytes arrive — that is what keeps the grids free of layout shift.
 */
export function ProductImage({
  base,
  alt,
  width,
  height,
  priority = false,
  sizes = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw',
  className = '',
}: ProductImageProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`}
        sizes={sizes}
      />
      <img
        src={`${base}-640.jpg`}
        srcSet={`${base}-640.jpg 640w, ${base}-1200.jpg 1200w`}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // Nudges the hero image ahead of the rest of the page. Spread as a
        // lowercase attribute: React 18 does not recognise the camelCase prop
        // and would drop it with a warning.
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={className}
      />
    </picture>
  );
}
