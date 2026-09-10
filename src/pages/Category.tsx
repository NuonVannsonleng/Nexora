import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategory } from '../data/categories';
import { getProductsByCategory, PRICING_DISCLAIMER } from '../data/products';
import { applyFilters, emptyFilters, hasActiveFilters, type Filters } from '../lib/catalog';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

/** All products in one category, with the category filter group suppressed. */
export function Category() {
  const { category: categoryId } = useParams<{ category: string }>();
  const category = categoryId ? getCategory(categoryId) : undefined;
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });

  usePageTitle(category ? `${category.name} — NEXORA` : 'Category not found — NEXORA');

  const categoryProducts = useMemo(
    () => (category ? getProductsByCategory(category.id) : []),
    [category],
  );
  const results = useMemo(
    () => applyFilters(filters, categoryProducts),
    [filters, categoryProducts],
  );

  if (!category) {
    return (
      <Container className="py-24 text-center">
        <h1>Category not found</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-slate">
          There is no category at that address.
        </p>
        <div className="mt-8">
          <Button to="/products">Browse all products</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading level={1} title={category.name} description={category.description} />

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside aria-label={`Filters for ${category.name}`} className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({ ...emptyFilters })}
              hide={['category']}
              idPrefix={`cat-${category.id}`}
            />
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <p aria-live="polite" className="text-small text-slate">
            {results.length} {results.length === 1 ? 'product' : 'products'}
            {hasActiveFilters(filters) ? ' match your filters' : ''}
          </p>

          <ProductGrid
            products={results}
            columns={3}
            priorityCount={3}
            label={`${category.name} products`}
            headingLevel={2}
            emptyState={
              <div className="rounded-lg bg-haze px-6 py-16 text-center">
                <h2 className="text-[1.25rem]">Nothing matches those filters</h2>
                <p className="mx-auto mt-2 max-w-[42ch] text-small text-slate">
                  Reset the filters to see everything in {category.name}.
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setFilters({ ...emptyFilters })}>
                    Reset filters
                  </Button>
                </div>
              </div>
            }
          />

          <p className="text-micro text-slate">{PRICING_DISCLAIMER}</p>
        </div>
      </div>
    </Container>
  );
}
