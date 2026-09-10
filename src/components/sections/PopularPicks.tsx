import { popularPicks } from '../../data/products';
import { ProductGrid } from '../products/ProductGrid';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * "Popular picks" rather than "best sellers".
 *
 * This store has no real sales data, so the ordering comes from the demo review
 * counts and the heading avoids claiming anything it cannot support.
 */
export function PopularPicks() {
  return (
    <section
      aria-labelledby="popular-heading"
      className="bg-haze"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <Container>
        <SectionHeading
          title={<span id="popular-heading">Popular picks</span>}
          description="The products customers ask us about most, ranked by review volume."
          action={{ label: 'Shop all', to: '/products' }}
        />
        <ScrollReveal>
          <ProductGrid products={popularPicks.slice(0, 4)} columns={4} label="Popular picks" />
        </ScrollReveal>
      </Container>
    </section>
  );
}
