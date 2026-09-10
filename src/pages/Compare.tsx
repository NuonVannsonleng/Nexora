import { CompareProducts } from '../components/products/CompareProducts';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

/** Comparison view for the products the visitor has selected. */
export function Compare() {
  usePageTitle('Compare products — NEXORA');

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        level={1}
        title="Compare products"
        description="Line up to four products side by side. A dash means the manufacturer does not publish that specification."
      />
      <CompareProducts />
    </Container>
  );
}
