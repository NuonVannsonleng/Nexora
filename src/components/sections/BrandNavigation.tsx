import { brandsWithProducts } from '../../lib/catalog';
import { BrandCard } from '../brands/BrandCard';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Brand explorer.
 *
 * A horizontally scrollable rail on touch viewports; a grid from `sm` up. Only
 * brands that actually carry stock appear, so no tile leads to an empty page.
 */
export function BrandNavigation() {
  return (
    <section aria-labelledby="brands-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        <SectionHeading
          title={<span id="brands-heading">Shop by brand</span>}
          description="Official products from the manufacturers behind them."
          action={{ label: 'All products', to: '/products' }}
        />

        <ScrollReveal>
          <ul className="rail m-0 list-none p-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:p-0 lg:grid-cols-4 xl:grid-cols-5">
            {brandsWithProducts.map((brand) => (
              <li key={brand.id} className="flex">
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </Container>
    </section>
  );
}
