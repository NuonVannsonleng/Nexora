import { getProduct } from '../../data/products';
import { brandName } from '../../data/brands';
import { useStore } from '../../context/StoreContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/** Three flagships from different brands, offered as a ready-made comparison. */
const SUGGESTED = ['iphone-15-pro', 'galaxy-s24-ultra', 'pixel-8-pro'];

/**
 * Invitation to the comparison view.
 *
 * Loads a cross-brand flagship comparison in one click, which is the clearest
 * demonstration of what a multi-brand store can do that a single-vendor one cannot.
 */
export function CompareTeaser() {
  const { compare, toggleCompare } = useStore();
  const items = SUGGESTED.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length < 2) return null;

  const loadComparison = () => {
    // Add only what is missing so an existing selection is not disturbed twice.
    for (const product of items) {
      if (!compare.includes(product.id)) toggleCompare(product.id);
    }
  };

  return (
    <section aria-labelledby="compare-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        <ScrollReveal>
          <div className="flex flex-col gap-8 rounded-lg border border-hairline p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex-1">
              <SectionHeading
                title={<span id="compare-heading">Compare across brands</span>}
                description="Put this year's flagships side by side — display, processor, camera, battery — and decide on the specifications rather than the marketing."
                className="mb-6 sm:mb-6"
              />
              <div className="flex flex-wrap gap-3">
                <Button onClick={loadComparison}>Compare these three</Button>
                <Button to="/compare" variant="outline">
                  Open comparison
                </Button>
              </div>
            </div>

            <ul className="m-0 flex min-w-0 flex-1 list-none flex-wrap justify-center gap-x-3 gap-y-5 p-0 sm:flex-nowrap sm:gap-8">
              {items.map((product) => (
                <li key={product.id} className="flex min-w-0 basis-[7rem] flex-col items-center gap-2 text-center sm:flex-1 sm:basis-auto">
                  <span className="photo-plate h-[96px] w-full sm:h-[150px]">
                    <img
                      src={`${product.image}-640.webp`}
                      alt={`${brandName(product.brandId)} ${product.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="text-micro uppercase tracking-[0.08em] text-slate">
                    {brandName(product.brandId)}
                  </span>
                  <span className="text-small font-medium leading-snug">{product.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
