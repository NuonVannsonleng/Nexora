/** Formatting and search helpers shared across the catalogue UI. */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

/** Product prices are whole dollars in this catalogue; totals show cents. */
export const formatPrice = (amount: number): string => usd.format(amount);

export const formatTotal = (amount: number): string => usdCents.format(amount);

export const formatReviewCount = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);

/** Responsive <img> attributes for a product photo. */
export function productImage(basePath: string, alt: string) {
  return {
    src: `${basePath}-1200.jpg`,
    srcSet: `${basePath}-640.jpg 640w, ${basePath}-1200.jpg 1200w`,
    webpSrcSet: `${basePath}-640.webp 640w, ${basePath}-1200.webp 1200w`,
    alt,
  };
}

/** Normalises text for accent- and case-insensitive matching. */
export const normalize = (value: string): string =>
  value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
