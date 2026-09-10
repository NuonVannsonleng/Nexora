import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  applyFilters,
  buildSuggestions,
  emptyFilters,
  hasActiveFilters,
  searchProducts,
  type Filters,
} from '../../src/lib/catalog';
import { products } from '../../src/data/products';

const base: Filters = { ...emptyFilters };

describe('applyFilters', () => {
  it('returns the whole catalogue when nothing is set', () => {
    expect(applyFilters(base)).toHaveLength(products.length);
  });

  it('filters by brand', () => {
    const result = applyFilters({ ...base, brandIds: ['apple'] });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.brandId === 'apple')).toBe(true);
  });

  it('treats multiple brands as a union', () => {
    const result = applyFilters({ ...base, brandIds: ['apple', 'samsung'] });

    expect(result.every((p) => p.brandId === 'apple' || p.brandId === 'samsung')).toBe(true);
    expect(result.some((p) => p.brandId === 'samsung')).toBe(true);
  });

  it('filters by category', () => {
    const result = applyFilters({ ...base, categoryIds: ['phones'] });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === 'phones')).toBe(true);
  });

  it('combines brand and category as an intersection', () => {
    const result = applyFilters({ ...base, brandIds: ['apple'], categoryIds: ['laptops'] });

    expect(result.every((p) => p.brandId === 'apple' && p.category === 'laptops')).toBe(true);
  });

  it('applies a price ceiling', () => {
    const result = applyFilters({ ...base, maxPrice: 300 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.price <= 300)).toBe(true);
  });

  it('applies a minimum rating', () => {
    const result = applyFilters({ ...base, minRating: 4.5 });

    expect(result.every((p) => p.rating >= 4.5)).toBe(true);
  });

  it('can restrict to products in stock', () => {
    const all = applyFilters(base);
    const inStock = applyFilters({ ...base, inStockOnly: true });

    expect(inStock.every((p) => p.inStock)).toBe(true);
    // The catalogue deliberately contains an out-of-stock product.
    expect(inStock.length).toBeLessThan(all.length);
  });

  it('narrows by free-text query across name, brand and category', () => {
    expect(applyFilters({ ...base, query: 'iphone' }).length).toBeGreaterThan(0);
    expect(applyFilters({ ...base, query: 'samsung' }).every((p) => p.brandId === 'samsung')).toBe(
      true,
    );
    expect(applyFilters({ ...base, query: 'zzzznotathing' })).toHaveLength(0);
  });

  it('requires every term of a multi-word query to match', () => {
    const result = applyFilters({ ...base, query: 'apple laptops' });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.brandId === 'apple' && p.category === 'laptops')).toBe(true);
  });

  it('sorts by price in both directions', () => {
    const asc = applyFilters({ ...base, sort: 'price-asc' }).map((p) => p.price);
    const desc = applyFilters({ ...base, sort: 'price-desc' }).map((p) => p.price);

    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('sorts newest by real release year', () => {
    const years = applyFilters({ ...base, sort: 'newest' }).map((p) => p.releaseYear);

    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('scopes filtering to a supplied subset', () => {
    const appleOnly = products.filter((p) => p.brandId === 'apple');
    const result = applyFilters({ ...base, categoryIds: ['phones'] }, appleOnly);

    expect(result.every((p) => p.brandId === 'apple' && p.category === 'phones')).toBe(true);
  });

  it('does not mutate the source array', () => {
    const source = products.filter((p) => p.brandId === 'apple');
    const order = source.map((p) => p.id);

    applyFilters({ ...base, sort: 'price-desc' }, source);

    expect(source.map((p) => p.id)).toEqual(order);
  });
});

describe('filter state helpers', () => {
  it('reports no active filters for the empty state', () => {
    expect(hasActiveFilters(base)).toBe(false);
    expect(activeFilterCount(base)).toBe(0);
  });

  it('counts each narrowing filter once', () => {
    const filters: Filters = {
      ...base,
      brandIds: ['apple', 'sony'],
      categoryIds: ['phones'],
      maxPrice: 500,
      minRating: 4,
      inStockOnly: true,
    };

    expect(activeFilterCount(filters)).toBe(6);
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it('counts a text query as active but not as a filter chip', () => {
    const filters = { ...base, query: 'ipad' };

    expect(hasActiveFilters(filters)).toBe(true);
    expect(activeFilterCount(filters)).toBe(0);
  });
});

describe('search', () => {
  it('matches on product name case-insensitively', () => {
    expect(searchProducts('IPHONE').map((p) => p.id)).toContain('iphone-15-pro');
  });

  it('matches on model designation', () => {
    expect(searchProducts('SM-S928').map((p) => p.id)).toContain('galaxy-s24-ultra');
  });

  it('returns nothing for an empty query', () => {
    expect(searchProducts('')).toHaveLength(0);
    expect(searchProducts('   ')).toHaveLength(0);
  });

  it('suggests brands and categories ahead of products', () => {
    const suggestions = buildSuggestions('apple');

    expect(suggestions[0]).toMatchObject({ kind: 'brand', id: 'apple', to: '/brand/apple' });
    expect(suggestions.some((s) => s.kind === 'product')).toBe(true);
  });

  it('suggests a category by name', () => {
    const suggestions = buildSuggestions('laptops');

    expect(suggestions.some((s) => s.kind === 'category' && s.to === '/category/laptops')).toBe(true);
  });

  it('caps the number of suggestions', () => {
    expect(buildSuggestions('a', 5).length).toBeLessThanOrEqual(5);
  });

  it('returns nothing for an empty query', () => {
    expect(buildSuggestions('')).toHaveLength(0);
  });
});
