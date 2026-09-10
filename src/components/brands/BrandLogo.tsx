import { getBrand } from '../../data/brands';

interface BrandLogoProps {
  brandId: string;
  /** Maximum rendered height in px. */
  height?: number;
  /**
   * Maximum rendered width in px. Defaults to a multiple of the height so that a
   * very wide wordmark (Bose is roughly 8:1) is bounded by width rather than
   * height, and therefore occupies a similar optical area to a squarer glyph like
   * Apple's. Both constraints together mean every mark fits the same box.
   */
  maxWidth?: number;
  className?: string;
  /**
   * When the logo sits beside the brand name in text, the image is decorative and
   * the name already conveys it — pass true to hide it from screen readers.
   */
  decorative?: boolean;
}

/** Width budget as a multiple of the height, when `maxWidth` is not given. */
const WIDTH_RATIO = 3.6;

/**
 * Renders a brand's official logo.
 *
 * The SVGs under /assets/brands are the manufacturers' own marks (see
 * src/data/brands.ts for provenance). They are loaded as <img> constrained on both
 * axes with `object-fit: contain`, so each mark keeps its true aspect ratio —
 * never stretched, never recoloured and never redrawn.
 */
export function BrandLogo({
  brandId,
  height = 20,
  maxWidth,
  className = '',
  decorative = false,
}: BrandLogoProps) {
  const brand = getBrand(brandId);
  if (!brand) return null;

  return (
    <img
      src={brand.logo}
      alt={decorative ? '' : `${brand.name} logo`}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
      className={`object-contain ${className}`}
      style={{
        height: `${height}px`,
        width: 'auto',
        maxHeight: `${height}px`,
        maxWidth: `${maxWidth ?? Math.round(height * WIDTH_RATIO)}px`,
      }}
    />
  );
}
