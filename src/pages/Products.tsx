import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductFilters, SORT_OPTIONS } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Modal } from '../components/ui/Modal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Badge } from '../components/ui/Badge';
import { brandName } from '../data/brands';
import { categoryName } from '../data/categories';
import { PRICING_DISCLAIMER } from '../data/products';
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  hasActiveFilters,
  type Filters,
  type SortKey,
} from '../lib/catalog';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * The full catalogue with search, filtering and sorting.
 *
 * The `q` query parameter seeds the text filter so a search from the header lands
 * here with results already narrowed, and stays shareable as a URL.
 */
export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, query: queryParam });
  const [drawerOpen, setDrawerOpen] = useState(false);

  usePageTitle(
    queryParam ? `Search: ${queryParam} — NEXORA` : 'All products — NEXORA',
  );

  // Keep the text filter in step when the URL changes (header search, back button).
  useEffect(() => {
    setFilters((f) => (f.query === queryParam ? f : { ...f, query: queryParam }));
  }, [queryParam]);

  const results = useMemo(() => applyFilters(filters), [filters]);
  const activeCount = activeFilterCount(filters);

  const reset = () => {
    setFilters({ ...emptyFilters });
    setSearchParams({}, { replace: true });
  };

  const clearQuery = () => {
    setFilters((f) => ({ ...f, query: '' }));
    setSearchParams({}, { replace: true });
  };

  return (
    <Container as="div" className="py-10 sm:py-14">
      <SectionHeading
        level={1}
        title={queryParam ? `Results for “${queryParam}”` : 'All products'}
        description={
          queryParam
            ? undefined
            : 'Every product NEXORA carries, across all brands and categories.'
        }
      />

      {/* Active text query shown as a removable chip. */}
      {filters.query && (
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-pill bg-haze px-3 py-1.5 text-small">
            Search: {filters.query}
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search term"
              className="grid h-5 w-5 place-items-center rounded-full text-slate hover:bg-white hover:text-ink"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        {/* ---- Desktop sidebar ------------------------------------------ */}
        <aside aria-label="Product filters" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={reset}
              idPrefix="side"
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {/* ---- Toolbar ------------------------------------------------ */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
            <p aria-live="polite" className="text-small text-slate">
              {results.length} {results.length === 1 ? 'product' : 'products'}
              {hasActiveFilters(filters) ? ' match your filters' : ''}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-2 text-small transition-colors duration-fast hover:border-ink lg:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Filters
                {activeCount > 0 && <Badge tone="new">{activeCount}</Badge>}
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-small text-slate">
                  Sort
                </label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
                  className="h-9 rounded-sm border border-hairline bg-white px-2.5 text-small outline-none focus-visible:border-ink"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ---- Active filter chips ------------------------------------ */}
          {activeCount > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {filters.brandIds.map((id) => (
                <li key={`b-${id}`}>
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        brandIds: filters.brandIds.filter((b) => b !== id),
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-pill bg-haze px-3 py-1.5 text-small hover:bg-hairline/60"
                  >
                    {brandName(id)}
                    <X aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">Remove brand filter</span>
                  </button>
                </li>
              ))}
              {filters.categoryIds.map((id) => (
                <li key={`c-${id}`}>
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        categoryIds: filters.categoryIds.filter((c) => c !== id),
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-pill bg-haze px-3 py-1.5 text-small hover:bg-hairline/60"
                  >
                    {categoryName(id)}
                    <X aria-hidden="true" className="h-3 w-3" />
                    <span className="sr-only">Remove category filter</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <ProductGrid
            products={results}
            columns={3}
            priorityCount={3}
            label="Product results"
            headingLevel={2}
            emptyState={
              <div className="rounded-lg bg-haze px-6 py-16 text-center">
                <h2 className="text-[1.25rem]">No products match</h2>
                <p className="mx-auto mt-2 max-w-[42ch] text-small text-slate">
                  Try widening the price range, clearing a brand, or searching for a
                  different product name.
                </p>
                <div className="mt-6">
                  <Button onClick={reset} variant="outline">
                    Reset filters
                  </Button>
                </div>
              </div>
            }
          />

          <p className="mt-2 text-micro text-slate">{PRICING_DISCLAIMER}</p>
        </div>
      </div>

      {/* ---- Mobile filter drawer -------------------------------------- */}
      <Modal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        placement="right"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} block disabled={!hasActiveFilters(filters)}>
              Reset
            </Button>
            <Button onClick={() => setDrawerOpen(false)} block>
              Show {results.length}
            </Button>
          </div>
        }
      >
        <div className="px-5 py-6 sm:px-6">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onReset={reset}
            idPrefix="drawer"
          />
        </div>
      </Modal>
    </Container>
  );
}
