/** Shared catalogue types. Every rendered product/brand resolves to one of these. */

export interface Brand {
  id: string;
  name: string;
  /** Path to the official logo SVG under /assets/brands. */
  logo: string;
  /** Short line shown under the brand name in the explorer. */
  description: string;
  /** Manufacturer's own site — brand tiles link into the store, not off-site. */
  website: string;
  /** Editorial treatment for the brand's showcase band. */
  theme: 'light' | 'dark';
}

export type CategoryId =
  | 'phones'
  | 'laptops'
  | 'tablets'
  | 'smartwatches'
  | 'headphones'
  | 'cameras'
  | 'gaming'
  | 'tvs'
  | 'accessories';

export interface Category {
  id: CategoryId;
  name: string;
  /** One-line description used on the category page header. */
  description: string;
  /** Product id whose photo represents the category. */
  representativeProduct: string;
}

/**
 * Specification keys are drawn from this fixed set so the comparison table can
 * line up rows across products from different brands.
 */
export interface Specifications {
  display?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  camera?: string;
  battery?: string;
  connectivity?: string;
  os?: string;
  weight?: string;
  audio?: string;
}

export interface Product {
  id: string;
  brandId: string;
  /** Real product name as the manufacturer markets it. */
  name: string;
  /** Real model/variant designation where the product has one. */
  model?: string;
  category: CategoryId;
  description: string;
  /** Base path under /assets/products; responsive variants are derived from it. */
  image: string;
  /** Intrinsic size of the 1200px render, used to reserve layout space. */
  imageWidth: number;
  imageHeight: number;
  /** Demo pricing — see PRICING_DISCLAIMER. */
  price: number;
  currency: 'USD';
  /** Demo reference price; present only on products in the sample promotion. */
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  /** Real colourway names offered for the product. */
  colors: string[];
  specifications: Specifications;
  badge?: 'New' | 'Popular' | 'Sale';
  featured?: boolean;
  inStock: boolean;
  /** Real year the product was announced. */
  releaseYear: number;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

/** Attribution recorded by scripts/fetch-assets.mjs for each product photo. */
export interface PhotoCredit {
  file: string;
  descriptionUrl: string;
  author: string;
  license: string;
  width?: number;
  height?: number;
}
