import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBrand } from '../data/brands';
import { getProductsByBrand, PRICING_DISCLAIMER } from '../data/products';
import { applyFilters, emptyFilters, hasActiveFilters, type Filters } from '../lib/catalog';
import { BrandLogo } from '../components/brands/BrandLogo';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * One manufacturer's products.
 *
 * The page header carries only that brand's official logo, so it reads as
 * "NEXORA's <brand> range" rather than as the manufacturer's own site — the
 * disclosure line under the heading says so explicitly.
 */
export function Brand() {
  const { brand: brandId } = useParams<{ brand: string }>();
  const brand = brandId ? getBrand(brandId) : undefined;
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });

  usePageTitle(brand ? `${brand.name} at NEXORA` : 'Brand not found — NEXORA');

  const brandProducts = useMemo(
    () => (brand ? getProductsByBrand(brand.id) : []),
    [brand],
  );
  const results = useMemo(
    () => applyFilters(filters, brandProducts),
    [filters, brandProducts],
  );

  if (!brand) {
    return (
      <Container className="py-24 text-center">
        <h1>Brand not found</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-slate">
          We don&rsquo;t carry a brand at that address.
        </p>
        <div className="mt-8">
          <Button to="/products">Browse all products</Button>
        </div>
      </Container>
    );
  }

  const dark = brand.theme === 'dark';

  return (
    <>
      <section
        aria-labelledby="brand-heading"
        className={dark ? 'bg-ink text-white' : 'bg-haze text-ink'}
      >
        <Container className="py-14 sm:py-20">
          <div className="flex flex-col gap-5">
            <span
              className={`inline-grid h-14 w-fit place-items-center rounded-md px-5 ${
                dark ? 'bg-white' : 'bg-white'
              }`}
            >
              <BrandLogo brandId={brand.id} height={28} />
            </span>

            <h1 id="brand-heading" className={dark ? 'text-white' : undefined}>
              {brand.name} at NEXORA
            </h1>
            <p className={`max-w-[60ch] text-[1.0625rem] ${dark ? 'text-white/70' : 'text-slate'}`}>
              {brand.description}. {brandProducts.length}{' '}
              {brandProducts.length === 1 ? 'product' : 'products'} available.
            </p>

            <p className={`max-w-[70ch] text-micro ${dark ? 'text-white/50' : 'text-slate'}`}>
              NEXORA is an independent retailer. This page is not operated by or affiliated
              with {brand.name}.{' '}
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2"
              >
                Visit {brand.name}&rsquo;s official site
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <aside aria-label={`Filters for ${brand.name} products`} className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
              {/* The brand group is redundant on a page already scoped to one. */}
              <ProductFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ ...emptyFilters })}
                hide={['brand']}
                idPrefix={`brand-${brand.id}`}
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
              label={`${brand.name} products`}
            headingLevel={2}
              emptyState={
                <div className="rounded-lg bg-haze px-6 py-16 text-center">
                  <h2 className="text-[1.25rem]">No {brand.name} products match</h2>
                  <p className="mx-auto mt-2 max-w-[42ch] text-small text-slate">
                    Try clearing a filter to see the full {brand.name} range.
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
    </>
  );
}
