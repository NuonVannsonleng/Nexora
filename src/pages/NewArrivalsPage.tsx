import { ProductGrid } from '../components/products/ProductGrid';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { newArrivals, PRICING_DISCLAIMER } from '../data/products';
import { usePageTitle } from '../hooks/usePageTitle';

/** The catalogue's most recently announced products. */
export function NewArrivalsPage() {
  usePageTitle('New arrivals — NEXORA');

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        level={1}
        title="New arrivals"
        description="Ordered by the year each product was announced."
      />
      <ProductGrid products={newArrivals} columns={4} priorityCount={4} label="New arrivals"
            headingLevel={2} />
      <p className="mt-8 text-micro text-slate">{PRICING_DISCLAIMER}</p>
    </Container>
  );
}
