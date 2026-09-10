import { brandName, brands } from '../data/brands';
import { categories, categoryName } from '../data/categories';
import { products } from '../data/products';
import type { CategoryId, Product } from '../data/types';
import { normalize } from './format';

/* ------------------------------------------------------------------ search */

export type SuggestionKind = 'product' | 'brand' | 'category';

export interface Suggestion {
  kind: SuggestionKind;
  id: string;
  label: string;
  /** Brand or category name shown under a product suggestion. */
  detail: string;
  to: string;
}

/** Searchable text for a product: name, model, brand, category and description. */
const haystack = (p: Product) =>
  normalize([p.name, p.model, brandName(p.brandId), categoryName(p.category), p.description]
    .filter(Boolean)
    .join(' '));

const searchIndex = products.map((p) => ({ product: p, text: haystack(p) }));

/** Products matching a free-text query; every term must appear somewhere. */
export function searchProducts(query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return searchIndex
    .filter(({ text }) => terms.every((t) => text.includes(t)))
    .map(({ product }) => product);
}

/**
 * Mixed suggestions for the search overlay: matching brands and categories first,
 * since they narrow the catalogue, then individual products.
 */
export function buildSuggestions(query: string, limit = 8): Suggestion[] {
  const q = normalize(query);
  if (q.length === 0) return [];

  const brandHits: Suggestion[] = brands
    .filter((b) => normalize(b.name).includes(q))
    .map((b) => ({
      kind: 'brand' as const,
      id: b.id,
      label: b.name,
      detail: 'Brand',
      to: `/brand/${b.id}`,
    }));

  const categoryHits: Suggestion[] = categories
    .filter((c) => normalize(c.name).includes(q))
    .map((c) => ({
      kind: 'category' as const,
      id: c.id,
      label: c.name,
      detail: 'Category',
      to: `/category/${c.id}`,
    }));

  const productHits: Suggestion[] = searchProducts(query).map((p) => ({
    kind: 'product' as const,
    id: p.id,
    label: [brandName(p.brandId), p.name].join(' '),
    detail: categoryName(p.category),
    to: `/products/${p.id}`,
  }));

  return [...brandHits, ...categoryHits, ...productHits].slice(0, limit);
}

/* ----------------------------------------------------------------- filters */

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface Filters {
  query: string;
  brandIds: string[];
  categoryIds: CategoryId[];
  /** Upper bound on price; `null` means no ceiling. */
  maxPrice: number | null;
  /** Minimum star rating; 0 means unfiltered. */
  minRating: number;
  inStockOnly: boolean;
  sort: SortKey;
}

export const emptyFilters: Filters = {
  query: '',
  brandIds: [],
  categoryIds: [],
  maxPrice: null,
  minRating: 0,
  inStockOnly: false,
  sort: 'featured',
};

/** True when any filter would narrow the catalogue. */
export const hasActiveFilters = (f: Filters): boolean =>
  f.query.trim() !== '' ||
  f.brandIds.length > 0 ||
  f.categoryIds.length > 0 ||
  f.maxPrice !== null ||
  f.minRating > 0 ||
  f.inStockOnly;

/** Number of narrowing filters, for the mobile filter button's badge. */
export const activeFilterCount = (f: Filters): number =>
  f.brandIds.length +
  f.categoryIds.length +
  (f.maxPrice !== null ? 1 : 0) +
  (f.minRating > 0 ? 1 : 0) +
  (f.inStockOnly ? 1 : 0);

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  // Featured first, then the higher-rated product.
  featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  newest: (a, b) => b.releaseYear - a.releaseYear,
};

/** Applies every filter, then sorts. Pure — safe to call during render. */
export function applyFilters(filters: Filters, source: Product[] = products): Product[] {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);

  const result = source.filter((p) => {
    if (terms.length > 0) {
      const text = haystack(p);
      if (!terms.every((t) => text.includes(t))) return false;
    }
    if (filters.brandIds.length > 0 && !filters.brandIds.includes(p.brandId)) return false;
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.category)) return false;
    if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    return true;
  });

  return result.sort(sorters[filters.sort]);
}

/** Brands that actually have products, for filter lists and the brand explorer. */
export const brandsWithProducts = brands.filter((b) =>
  products.some((p) => p.brandId === b.id),
);

/** How many products each brand carries — shown beside filter checkboxes. */
export const productCountByBrand = new Map(
  brands.map((b) => [b.id, products.filter((p) => p.brandId === b.id).length]),
);

export const productCountByCategory = new Map(
  categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length]),
);
