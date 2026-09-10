import { DealsSection } from '../components/sections/DealsSection';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PROMO_DISCLAIMER } from '../data/products';
import { usePageTitle } from '../hooks/usePageTitle';

/** Every product carrying a demo reference price. */
export function Deals() {
  usePageTitle('Offers — NEXORA');

  return (
    <>
      <Container className="pb-2 pt-10 sm:pt-14">
        <SectionHeading level={1} title="Sample offers" description={PROMO_DISCLAIMER} />
      </Container>
      <DealsSection showHeading={false} headingLevel={2} />
    </>
  );
}
