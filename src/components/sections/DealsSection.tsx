import { Link } from 'react-router-dom';
import { brandName } from '../../data/brands';
import { dealProducts, discountPercent, PROMO_DISCLAIMER } from '../../data/products';
import { formatPrice } from '../../lib/format';
import { BrandLogo } from '../brands/BrandLogo';
import { ProductImage } from '../products/ProductImage';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

interface DealsSectionProps {
  /** Cap the number of tiles; the deals page shows them all. */
  limit?: number;
  /** The standalone page renders its own heading. */
  showHeading?: boolean;
  /**
   * Depth of each tile's title. With the band's own h2 above them they are h3;
   * on the offers page, where the page h1 is the nearest heading, they are h2.
   */
  headingLevel?: 2 | 3;
}

/**
 * Sample promotion.
 *
 * Shows only products that carry a demo reference price, and labels the whole
 * band as a sample rather than implying a live offer.
 */
export function DealsSection({
  limit,
  showHeading = true,
  headingLevel = 3,
}: DealsSectionProps) {
  const items = limit ? dealProducts.slice(0, limit) : dealProducts;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="deals-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        {showHeading && (
          <SectionHeading
            title={<span id="deals-heading">Sample offers</span>}
            description={PROMO_DISCLAIMER}
            action={limit ? { label: 'All offers', to: '/deals' } : undefined}
          />
        )}

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product, index) => {
            const percent = discountPercent(product);
            return (
              <ScrollReveal key={product.id} as="li" delay={index * 80} className="flex">
                <article className="group flex flex-1 flex-col gap-4 rounded-md border border-hairline p-5 transition-shadow duration-base hover:shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <BrandLogo brandId={product.brandId} height={14} decorative />
                    {percent !== undefined && <Badge tone="sale">Save {percent}%</Badge>}
                  </div>

                  <span className="photo-plate h-[150px] w-full">
                    <ProductImage
                      base={product.image}
                      alt={`${brandName(product.brandId)} ${product.name}`}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="(min-width: 1024px) 260px, 45vw"
                    />
                  </span>

                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-micro uppercase tracking-[0.08em] text-slate">
                      {brandName(product.brandId)}
                    </p>
                    <Heading className="text-[1.0625rem] font-semibold">
                      <Link to={`/products/${product.id}`} className="hover:text-accent">
                        {product.name}
                      </Link>
                    </Heading>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="tabular text-[1.125rem] font-semibold text-deal">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="tabular text-small text-slate line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <p className="text-micro text-slate">
                        You save {formatPrice(product.originalPrice - product.price)}
                      </p>
                    )}
                  </div>

                  <Button to={`/products/${product.id}`} size="sm" variant="secondary" block>
                    View product
                  </Button>
                </article>
              </ScrollReveal>
            );
          })}
        </ul>

        {!showHeading && (
          <p className="mt-6 text-micro text-slate">{PROMO_DISCLAIMER}</p>
        )}
      </Container>
    </section>
  );
}
