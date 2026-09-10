import { Star } from 'lucide-react';
import { categories } from '../../data/categories';
import { priceRange } from '../../data/products';
import type { CategoryId } from '../../data/types';
import {
  brandsWithProducts,
  hasActiveFilters,
  productCountByBrand,
  productCountByCategory,
  type Filters,
  type SortKey,
} from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { BrandLogo } from '../brands/BrandLogo';

interface ProductFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  /** Hide the brand or category group on a page already scoped to one. */
  hide?: ('brand' | 'category')[];
  /** Distinguishes ids when the panel is rendered twice (sidebar + drawer). */
  idPrefix?: string;
}

const RATINGS = [4.5, 4, 3.5] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 text-small font-semibold">{title}</legend>
      <div className="flex flex-col gap-2.5">{children}</div>
    </fieldset>
  );
}

/**
 * The filter panel. Rendered as a sidebar on desktop and inside a slide-over
 * drawer on mobile — the same component both times, with `idPrefix` keeping the
 * input ids unique between the two instances.
 */
export function ProductFilters({
  filters,
  onChange,
  onReset,
  hide = [],
  idPrefix = 'f',
}: ProductFiltersProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleBrand = (id: string) =>
    set(
      'brandIds',
      filters.brandIds.includes(id)
        ? filters.brandIds.filter((b) => b !== id)
        : [...filters.brandIds, id],
    );

  const toggleCategory = (id: CategoryId) =>
    set(
      'categoryIds',
      filters.categoryIds.includes(id)
        ? filters.categoryIds.filter((c) => c !== id)
        : [...filters.categoryIds, id],
    );

  // Round the ceiling up to a clean step so the slider's end label reads well.
  const maxStep = Math.ceil(priceRange.max / 100) * 100;
  const currentMax = filters.maxPrice ?? maxStep;

  return (
    <div className="flex flex-col gap-8">
      {!hide.includes('brand') && (
        <Group title="Brand">
          {brandsWithProducts.map((brand) => {
            const id = `${idPrefix}-brand-${brand.id}`;
            return (
              <div key={brand.id} className="flex items-center gap-2.5">
                <input
                  id={id}
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => toggleBrand(brand.id)}
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                <label htmlFor={id} className="flex flex-1 items-center gap-2 text-small">
                  <BrandLogo brandId={brand.id} height={12} decorative />
                  <span className="flex-1">{brand.name}</span>
                  <span className="tabular text-slate">{productCountByBrand.get(brand.id)}</span>
                </label>
              </div>
            );
          })}
        </Group>
      )}

      {!hide.includes('category') && (
        <Group title="Category">
          {categories.map((category) => {
            const id = `${idPrefix}-cat-${category.id}`;
            return (
              <div key={category.id} className="flex items-center gap-2.5">
                <input
                  id={id}
                  type="checkbox"
                  checked={filters.categoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                <label htmlFor={id} className="flex flex-1 items-center gap-2 text-small">
                  <span className="flex-1">{category.name}</span>
                  <span className="tabular text-slate">
                    {productCountByCategory.get(category.id)}
                  </span>
                </label>
              </div>
            );
          })}
        </Group>
      )}

      <Group title="Maximum price">
        <label htmlFor={`${idPrefix}-price`} className="flex justify-between text-small">
          <span className="text-slate">Up to</span>
          <span className="tabular font-medium">
            {filters.maxPrice === null ? 'Any price' : formatPrice(currentMax)}
          </span>
        </label>
        <input
          id={`${idPrefix}-price`}
          type="range"
          min={0}
          max={maxStep}
          step={50}
          value={currentMax}
          onChange={(e) => {
            const value = Number(e.target.value);
            // Sliding to the far end means "no ceiling" rather than "$2500 exactly".
            set('maxPrice', value >= maxStep ? null : value);
          }}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-micro text-slate">
          <span className="tabular">{formatPrice(0)}</span>
          <span className="tabular">{formatPrice(maxStep)}+</span>
        </div>
      </Group>

      <Group title="Rating">
        <div className="flex flex-col gap-2.5">
          {RATINGS.map((rating) => {
            const id = `${idPrefix}-rating-${rating}`;
            return (
              <div key={rating} className="flex items-center gap-2.5">
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-rating`}
                  checked={filters.minRating === rating}
                  onChange={() => set('minRating', rating)}
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                <label htmlFor={id} className="flex items-center gap-1.5 text-small">
                  <Star aria-hidden="true" className="h-3.5 w-3.5 fill-ink text-ink" />
                  <span className="tabular">{rating.toFixed(1)}</span>
                  <span className="text-slate">and above</span>
                </label>
              </div>
            );
          })}
          <div className="flex items-center gap-2.5">
            <input
              id={`${idPrefix}-rating-any`}
              type="radio"
              name={`${idPrefix}-rating`}
              checked={filters.minRating === 0}
              onChange={() => set('minRating', 0)}
              className="h-4 w-4 shrink-0 accent-accent"
            />
            <label htmlFor={`${idPrefix}-rating-any`} className="text-small text-slate">
              Any rating
            </label>
          </div>
        </div>
      </Group>

      <Group title="Availability">
        <div className="flex items-center gap-2.5">
          <input
            id={`${idPrefix}-stock`}
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => set('inStockOnly', e.target.checked)}
            className="h-4 w-4 shrink-0 accent-accent"
          />
          <label htmlFor={`${idPrefix}-stock`} className="text-small">
            In stock only
          </label>
        </div>
      </Group>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={!hasActiveFilters(filters)}
        className="self-start"
      >
        Reset filters
      </Button>
    </div>
  );
}
