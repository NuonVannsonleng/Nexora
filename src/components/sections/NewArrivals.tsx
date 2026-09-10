import { newArrivals } from '../../data/products';
import { ProductGrid } from '../products/ProductGrid';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * New arrivals — the most recently announced products in the catalogue, ordered
 * by their real announcement year rather than an invented "added on" date.
 */
export function NewArrivals() {
  return (
    <section aria-labelledby="new-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        <SectionHeading
          title={<span id="new-heading">New arrivals</span>}
          description="The latest additions across every brand we carry."
          action={{ label: 'See all new', to: '/new-arrivals' }}
        />
        <ScrollReveal>
          <ProductGrid products={newArrivals.slice(0, 4)} columns={4} label="New arrivals" />
        </ScrollReveal>
      </Container>
    </section>
  );
}
